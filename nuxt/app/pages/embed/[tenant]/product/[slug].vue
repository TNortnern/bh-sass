<script setup lang="ts">
import type { PublicTenant, PublicRentalItem } from '~/composables/usePublicBooking'

/**
 * Embeddable Product Detail Widget
 *
 * URL: /embed/{tenant}/product/{slug}
 *
 * Query parameters:
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - behavior: 'modal' | 'navigate' | 'hosted' (default: 'modal')
 * - checkoutUrl: URL to redirect for checkout
 * - backUrl: URL to go back to products grid
 */
definePageMeta({
  layout: 'embed'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string
const productSlug = route.params.slug as string

// PostMessage API for iframe communication
const {
  isEmbedded,
  sendToParent,
  notifyCartUpdated,
  notifyCheckoutRequested,
  onMessage
} = useEmbedMessaging(tenantSlug, 'product')

// Query params
const theme = computed(() => (route.query.theme as string) || 'auto')
const _behavior = computed(() => (route.query.behavior as string) || 'modal')
const checkoutUrl = computed(() => (route.query.checkoutUrl as string) || `/book/${tenantSlug}/checkout`)
const backUrl = computed(() => route.query.backUrl as string || '')

// Apply theme
onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme.value === 'light') {
    document.documentElement.classList.remove('dark')
  }
})

const { loadTenant, loadItems } = usePublicBooking()

// Data
const tenantData = ref<PublicTenant | null>(null)
const product = ref<PublicRentalItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref(0)

// Cart state - shared with parent via localStorage for cross-iframe sync
const cart = ref<Array<{
  id: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity?: number
}>>([])

// Max quantity for this product (based on unit count)
const maxQuantity = computed(() => product.value?.quantity || 99)

// Load cart from localStorage on mount (for cross-iframe sync)
onMounted(() => {
  const savedCart = localStorage.getItem(`bh_cart_${tenantSlug}`)
  if (savedCart) {
    try {
      cart.value = JSON.parse(savedCart)
    } catch { /* ignore */ }
  }
})

// Save cart to localStorage when it changes (for cross-iframe sync)
watch(cart, (newCart) => {
  localStorage.setItem(`bh_cart_${tenantSlug}`, JSON.stringify(newCart))
}, { deep: true })

// Load data on mount
onMounted(async () => {
  try {
    const loadedTenant = await loadTenant(tenantSlug)
    if (!loadedTenant) {
      error.value = 'Business not found'
      loading.value = false
      return
    }

    tenantData.value = loadedTenant

    // Load all items and find the one matching slug
    const { items } = await loadItems(loadedTenant.id as string)
    const foundProduct = items.find(item =>
      item.slug === productSlug || String(item.id) === productSlug
    )

    if (!foundProduct) {
      error.value = 'Product not found'
      loading.value = false
      return
    }

    product.value = foundProduct
  } catch (err) {
    console.error('Failed to load product:', err)
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }

  // Listen for commands
  onMessage('bh:theme:set', (data: { theme?: unknown }) => {
    const newTheme = data.theme as string
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    }
  })
})

// Computed
const productImages = computed(() => {
  if (!product.value?.images?.length) {
    return ['https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=800&h=600&fit=crop']
  }
  return product.value.images.map(img => img.url || '')
})

const productPrice = computed(() => {
  return product.value?.pricing?.fullDayRate || 0
})

const isInCart = computed(() => {
  return cart.value.some(item => item.id === String(product.value?.id))
})

// Added to cart feedback
const justAdded = ref(false)

// Functions
function addToCart() {
  if (!product.value) return

  const existingItem = cart.value.find(item => item.id === String(product.value?.id))

  if (existingItem) {
    // Respect max quantity
    const newQty = Math.min(existingItem.quantity + quantity.value, maxQuantity.value)
    existingItem.quantity = newQty
  } else {
    cart.value.push({
      id: String(product.value.id),
      name: product.value.name,
      price: productPrice.value,
      image: productImages.value[0] || '',
      quantity: Math.min(quantity.value, maxQuantity.value),
      maxQuantity: maxQuantity.value
    })
  }

  // Show feedback
  justAdded.value = true
  setTimeout(() => {
    justAdded.value = false
  }, 2000)

  // Notify parent - this tells embed.js to update its cart state
  if (isEmbedded.value) {
    notifyCartUpdated(cart.value, cartTotal.value)
    // Tell parent to close modal after adding (better UX)
    sendToParent('bh:item:added', {
      item: {
        id: String(product.value.id),
        name: product.value.name,
        quantity: quantity.value
      }
    })
  }

  // Reset quantity
  quantity.value = 1
}

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

function proceedToCheckout() {
  const cartData = encodeURIComponent(JSON.stringify(cart.value))
  const fullCheckoutUrl = `${checkoutUrl.value}?cart=${cartData}`

  if (isEmbedded.value) {
    // Always notify parent about checkout request
    notifyCheckoutRequested(cart.value, cartTotal.value, fullCheckoutUrl)
    // Parent embed.js will handle based on behavior mode
    return
  }

  // Non-embedded: navigate directly
  navigateTo(fullCheckoutUrl)
}

function goBack() {
  if (backUrl.value) {
    // Navigate to parent-specified URL
    sendToParent('bh:navigate', { to: 'products' })
  } else {
    // Tell parent to close modal
    sendToParent('bh:navigate', { to: 'products' })
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

function formatDimensions(dims: { length?: number, width?: number, height?: number }) {
  const parts = []
  if (dims.length) parts.push(`${dims.length}' L`)
  if (dims.width) parts.push(`${dims.width}' W`)
  if (dims.height) parts.push(`${dims.height}' H`)
  return parts.join(' × ') || 'N/A'
}
</script>

<template>
  <div class="embed-product p-4 bg-white dark:bg-gray-900 min-h-screen">
    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-8 h-8 text-orange-600 animate-spin"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-center py-16"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="w-12 h-12 text-red-500 mx-auto mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400">
        {{ error }}
      </p>
      <UButton
        class="mt-4"
        variant="outline"
        @click="goBack"
      >
        Go Back
      </UButton>
    </div>

    <!-- Product Detail -->
    <div
      v-else-if="product"
      class="max-w-4xl mx-auto"
    >
      <!-- Back button -->
      <button
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        @click="goBack"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="w-4 h-4"
        />
        Back to Products
      </button>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Image Gallery -->
        <div>
          <!-- Main Image -->
          <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
            <img
              :src="productImages[selectedImage]"
              :alt="product.name"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Thumbnails -->
          <div
            v-if="productImages.length > 1"
            class="flex gap-2"
          >
            <button
              v-for="(image, index) in productImages"
              :key="index"
              :class="[
                'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                selectedImage === index
                  ? 'border-orange-600'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              ]"
              @click="selectedImage = index"
            >
              <img
                :src="image"
                :alt="`${product.name} ${index + 1}`"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ product.name }}
          </h1>

          <div class="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-4">
            {{ formatPrice(productPrice) }}
            <span class="text-base font-normal text-gray-500">/day</span>
          </div>

          <!-- Specifications -->
          <div
            v-if="product.specifications"
            class="mb-6 space-y-2"
          >
            <div
              v-if="product.specifications.capacity"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-users"
                class="w-4 h-4"
              />
              <span>Capacity: {{ product.specifications.capacity }} people</span>
            </div>
            <div
              v-if="product.specifications.ageRange"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-smile"
                class="w-4 h-4"
              />
              <span>Ages: {{ product.specifications.ageRange }}</span>
            </div>
            <div
              v-if="product.specifications.dimensions && (product.specifications.dimensions.length || product.specifications.dimensions.width || product.specifications.dimensions.height)"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-ruler"
                class="w-4 h-4"
              />
              <span>Size: {{ formatDimensions(product.specifications.dimensions) }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-sm dark:prose-invert mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              {{ product.description || 'No description available.' }}
            </p>
          </div>

          <!-- Quantity -->
          <div class="flex items-center gap-4 mb-6">
            <span class="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
            <div class="flex items-center gap-2">
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-minus"
                :disabled="quantity <= 1"
                @click="quantity = Math.max(1, quantity - 1)"
              />
              <span class="w-12 text-center text-lg font-semibold text-gray-900 dark:text-white">
                {{ quantity }}
              </span>
              <UButton
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-plus"
                :disabled="quantity >= maxQuantity"
                @click="quantity = Math.min(quantity + 1, maxQuantity)"
              />
            </div>
            <span
              v-if="maxQuantity < 99"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              ({{ maxQuantity }} available)
            </span>
          </div>

          <!-- Add to Cart -->
          <div class="space-y-3">
            <UButton
              block
              size="lg"
              :icon="isInCart ? 'i-lucide-check' : 'i-lucide-shopping-cart'"
              @click="addToCart"
            >
              {{ isInCart ? 'Add More to Cart' : 'Add to Cart' }}
            </UButton>

            <UButton
              v-if="cart.length > 0"
              block
              size="lg"
              color="success"
              icon="i-lucide-arrow-right"
              trailing
              @click="proceedToCheckout"
            >
              Checkout ({{ formatPrice(cartTotal) }})
            </UButton>
          </div>

          <!-- Features/Tags -->
          <div
            v-if="product.tags?.length"
            class="mt-6 flex flex-wrap gap-2"
          >
            <UBadge
              v-for="tag in product.tags"
              :key="tag"
              color="neutral"
              variant="subtle"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embed-product {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
