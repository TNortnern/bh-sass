<script setup lang="ts">
import type { PublicTenant } from '~/composables/usePublicBooking'

/**
 * Embeddable Products Widget
 *
 * URL: /embed/{tenant}/products
 *
 * Query parameters:
 * - category: Filter by category ID
 * - featured: Show only featured items (true/false)
 * - limit: Number of items per page (default: 12)
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - checkout: URL to redirect for checkout (default: /book/{tenant}/checkout)
 * - hideFilters: Hide filter controls (true/false)
 * - hideCart: Hide cart sidebar (true/false)
 *
 * PostMessage API:
 * See useEmbedMessaging composable for full documentation of
 * supported message types and commands.
 */
definePageMeta({
  layout: 'embed'
})

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity?: number // Maximum quantity available (unit count)
}

const route = useRoute()
const tenantSlug = route.params.tenant as string

// PostMessage API for iframe communication
const {
  isEmbedded,
  notifyCartUpdated,
  notifyItemClicked,
  notifyCheckoutRequested,
  onMessage
} = useEmbedMessaging(tenantSlug, 'products')

// Query params
const categoryFilter = computed(() => route.query.category as string || '')
const featuredOnly = computed(() => route.query.featured === 'true')
const pageLimit = computed(() => parseInt(route.query.limit as string) || parseInt(route.query.perPage as string) || 12)
const theme = computed(() => (route.query.theme as string) || 'auto')
const checkoutUrl = computed(() => (route.query.checkoutUrl as string) || `/book/${tenantSlug}/checkout`)
const hideFilters = computed(() => route.query.hideFilters === 'true')
const hideCart = computed(() => route.query.hideCart === 'true')
const primaryColor = computed(() => (route.query.primaryColor as string) || '#f97316')
const defaultSort = computed(() => (route.query.defaultSort as string) || 'name')

// Behavior mode: modal (default), navigate, or hosted - stored for potential future use
const _behavior = computed(() => (route.query.behavior as string) || 'modal')
const _productUrl = computed(() => route.query.productUrl as string || '')

// Helper to handle item click based on behavior mode
function handleItemClick(item: { id: string, name: string, slug: string }) {
  // Always notify parent about click (parent decides what to do)
  notifyItemClicked(item)

  // For 'navigate' mode, the parent embed.js handles navigation
  // For 'modal' mode, the parent embed.js opens a modal
  // For 'hosted' mode, parent redirects to hosted page
  // Widget doesn't need to do anything else - parent handles it
}

// Apply theme and primary color
onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme.value === 'light') {
    document.documentElement.classList.remove('dark')
  }
  // 'auto' uses system preference

  // Apply custom primary color
  if (primaryColor.value && primaryColor.value !== '#f97316') {
    document.documentElement.style.setProperty('--bh-primary-color', primaryColor.value)
  }
})

const { loadTenant, loadItems } = usePublicBooking()

// Data - using proper types from usePublicBooking
const tenantData = ref<PublicTenant | null>(null)
const items = ref<Array<{
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
  categoryId: string
  capacity: number
  ageRange: string
  featured: boolean
  maxQuantity: number // Unit count
}>>([])
const categories = ref<Array<{ id: string, name: string }>>([])
const initialLoading = ref(true) // Full page loader on first load
const refreshing = ref(false) // Inline loader for filter/sort/pagination
const error = ref<string | null>(null)

// Cart state (multi-item support)
const cart = ref<CartItem[]>([])
const showCart = ref(false)

// Pagination (server-side)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const hasNextPage = ref(false)
const hasPrevPage = ref(false)

// Filter state
const searchQuery = ref('')
const selectedCategory = ref(categoryFilter.value || 'all')
const sortBy = ref(defaultSort.value)

// Load items with pagination
async function loadItemsWithPagination(page: number = 1, isRefresh: boolean = false) {
  if (!tenantData.value) return

  // Use refreshing for subsequent loads, initialLoading for first load
  if (isRefresh) {
    refreshing.value = true
  }

  try {
    // Map sortBy to API sort format
    let apiSort = sortBy.value
    if (sortBy.value === 'price-desc') apiSort = '-price'

    const result = await loadItems(tenantData.value.id as string, {
      page,
      limit: pageLimit.value,
      sort: apiSort
    })

    items.value = result.items.map(item => ({
      id: String(item.id),
      name: String(item.name || ''),
      slug: String(item.slug || ''),
      description: String(item.description || ''),
      price: item.pricing?.fullDayRate || 0,
      image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop',
      category: String(item.category || ''),
      categoryId: '', // Category ID not directly available in PublicRentalItem
      capacity: item.specifications?.capacity || 0,
      ageRange: String(item.specifications?.ageRange || 'All ages'),
      featured: item.featured || false,
      maxQuantity: item.quantity || 1 // Unit count - max items available
    }))

    // Update pagination state
    if (result.pagination) {
      currentPage.value = result.pagination.page
      totalPages.value = result.pagination.totalPages
      totalItems.value = result.pagination.totalDocs
      hasNextPage.value = result.pagination.hasNextPage
      hasPrevPage.value = result.pagination.hasPrevPage
    }
  } catch (err) {
    console.error('Failed to load items:', err)
  } finally {
    initialLoading.value = false
    refreshing.value = false
  }
}

// Load data on mount
onMounted(async () => {
  try {
    const loadedTenant = await loadTenant(tenantSlug)
    if (!loadedTenant) {
      error.value = 'Business not found'
      initialLoading.value = false
      return
    }

    tenantData.value = loadedTenant

    const [, loadedCategories] = await Promise.all([
      loadItemsWithPagination(1, false), // Initial load, not a refresh
      fetchCategories(loadedTenant.id as string)
    ])

    categories.value = loadedCategories
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = 'Failed to load products'
  } finally {
    initialLoading.value = false
  }
})

// Fetch categories
async function fetchCategories(tenantId: string) {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ docs: Array<{ id: string, name: string }> }>(`${config.public.payloadUrl}/api/categories`, {
      params: {
        'where[tenantId][equals]': tenantId,
        'where[isActive][equals]': true,
        'sort': 'sortOrder',
        'limit': 100
      }
    })
    return response?.docs || []
  } catch {
    return []
  }
}

// Category items for select
const categoryItems = computed(() => {
  const result = [{ label: 'All Categories', value: 'all' }]
  categories.value.forEach((cat) => {
    result.push({ label: cat.name, value: cat.id })
  })
  return result
})

// Sort options
const sortItems = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Price (High to Low)', value: 'price-desc' }
]

// Filtered items (client-side filtering for search/category, server handles sort and pagination)
const filteredItems = computed(() => {
  let result = [...items.value]

  // Featured filter
  if (featuredOnly.value) {
    result = result.filter(item => item.featured)
  }

  // Category filter (client-side since categories are tenant-specific)
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    result = result.filter(item => item.categoryId === selectedCategory.value)
  }

  // Search filter (client-side for instant feedback)
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.name.toLowerCase().includes(search)
      || item.description.toLowerCase().includes(search)
    )
  }

  return result
})

// Display items - with server-side pagination, items.value IS the current page
// Client-side search filters on current page (for instant feedback)
const displayItems = computed(() => filteredItems.value)

// Cart functions
function addToCart(item: typeof items.value[0]) {
  const existing = cart.value.find(c => c.id === item.id)
  const maxQty = item.maxQuantity || 99

  if (existing) {
    // Respect max quantity
    if (existing.quantity < maxQty) {
      existing.quantity++
    }
  } else {
    cart.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      maxQuantity: maxQty
    })
  }
  showCart.value = true
}

function removeFromCart(itemId: string) {
  const index = cart.value.findIndex(c => c.id === itemId)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

function updateQuantity(itemId: string, quantity: number) {
  const item = cart.value.find(c => c.id === itemId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      // Respect max quantity
      const maxQty = item.maxQuantity || 99
      item.quantity = Math.min(quantity, maxQty)
    }
  }
}

function isInCart(itemId: string) {
  return cart.value.some(c => c.id === itemId)
}

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const cartItemCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// Notify parent when cart changes
watch(cart, (newCart) => {
  if (isEmbedded.value) {
    notifyCartUpdated(newCart, cartTotal.value)
  }
}, { deep: true })

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

// Listen for commands from parent window
onMounted(() => {
  // Handle cart:add command
  onMessage('bh:cart:add', (data: { itemId?: unknown, quantity?: unknown }) => {
    const itemId = data.itemId as string
    const quantity = (data.quantity as number) || 1
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      for (let i = 0; i < quantity; i++) {
        addToCart(item)
      }
    }
  })

  // Handle cart:remove command
  onMessage('bh:cart:remove', (data: { itemId?: unknown }) => {
    removeFromCart(data.itemId as string)
  })

  // Handle cart:clear command
  onMessage('bh:cart:clear', () => {
    cart.value = []
  })

  // Handle cart:sync command (from embed.js when product modal updates cart)
  onMessage('bh:cart:sync', (data: { cart?: unknown }) => {
    if (Array.isArray(data.cart)) {
      cart.value = data.cart as CartItem[]
    }
  })

  // Handle navigate command
  onMessage('bh:navigate', (data: { to?: unknown }) => {
    const to = data.to as string
    if (to === 'checkout') {
      proceedToCheckout()
    }
    // Other navigation handled by parent if needed
  })

  // Handle theme:set command
  onMessage('bh:theme:set', (data: { theme?: unknown }) => {
    const newTheme = data.theme as string
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    }
    // 'auto' uses system preference - no action needed
  })
})

// Checkout - post message to parent or redirect
function proceedToCheckout() {
  const cartData = encodeURIComponent(JSON.stringify(cart.value))
  const fullCheckoutUrl = `${checkoutUrl.value}?cart=${cartData}`

  // Send checkout event to parent window if embedded
  if (isEmbedded.value) {
    notifyCheckoutRequested(cart.value, cartTotal.value, fullCheckoutUrl)
    // Let parent embed.js handle based on behavior mode
    // Don't navigate from within iframe - parent controls navigation
    return
  }

  // Non-embedded: navigate directly
  navigateTo(fullCheckoutUrl)
}

// Format price
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Highlight search terms in text
function highlightText(text: string, search: string): string {
  if (!search || !text) return text
  const searchLower = search.toLowerCase()
  const textLower = text.toLowerCase()
  const index = textLower.indexOf(searchLower)
  if (index === -1) return text

  // Return the text with the matched portion wrapped in <mark> tags
  const before = text.substring(0, index)
  const match = text.substring(index, index + search.length)
  const after = text.substring(index + search.length)
  return `${before}<mark class="bg-yellow-200 dark:bg-yellow-700 text-inherit rounded-sm px-0.5">${match}</mark>${after}`
}

// Reset to first page when client-side filters change
watch([searchQuery, selectedCategory], () => {
  // Client-side search/category filter, just reset page counter display
  // Actual items stay the same (server pagination)
})

// Reload items when sort changes (server-side sort)
watch(sortBy, () => {
  loadItemsWithPagination(1, true) // isRefresh = true
})
</script>

<template>
  <div class="embed-products p-4 bg-white dark:bg-gray-900 min-h-screen">
    <!-- Initial Loading (full page) -->
    <div
      v-if="initialLoading"
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
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header with cart -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ featuredOnly ? 'Featured Rentals' : 'Browse Rentals' }}
        </h1>

        <!-- Cart Button -->
        <UButton
          v-if="!hideCart"
          :color="cartItemCount > 0 ? 'primary' : 'neutral'"
          :variant="cartItemCount > 0 ? 'solid' : 'outline'"
          icon="i-lucide-shopping-cart"
          @click="showCart = !showCart"
        >
          Cart
          <UBadge
            v-if="cartItemCount > 0"
            :label="cartItemCount.toString()"
            color="warning"
            size="xs"
            class="ml-2"
          />
        </UButton>
      </div>

      <!-- Filters -->
      <div
        v-if="!hideFilters"
        class="mb-6 space-y-4"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-0 sm:min-w-[200px] md:min-w-[300px]">
            <UInput
              v-model="searchQuery"
              placeholder="Search bounce houses, water slides..."
              icon="i-lucide-search"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Category -->
          <USelect
            v-model="selectedCategory"
            :items="categoryItems"
            class="w-full sm:w-40"
          />

          <!-- Sort -->
          <USelect
            v-model="sortBy"
            :items="sortItems"
            class="w-full sm:w-40"
          />
        </div>

        <!-- Category chips -->
        <div
          v-if="categories.length > 0"
          class="flex flex-wrap gap-2"
        >
          <button
            v-for="cat in [{ id: 'all', name: 'All' }, ...categories]"
            :key="cat.id"
            :class="[
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="relative">
        <!-- Inline refresh overlay -->
        <div
          v-if="refreshing"
          class="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
        >
          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <UIcon
              name="i-lucide-loader-circle"
              class="w-5 h-5 text-orange-600 animate-spin"
            />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Updating...</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <div
            v-for="item in displayItems"
            :key="item.id"
            class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Image - clickable to view details -->
            <div
              class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
              @click="handleItemClick({ id: item.id, name: item.name, slug: item.slug })"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              >
              <div
                v-if="item.featured"
                class="absolute top-2 left-2"
              >
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                  <UIcon
                    name="i-lucide-star"
                    class="w-3 h-3"
                  />
                  Featured
                </span>
              </div>
              <!-- In Cart Badge -->
              <div
                v-if="isInCart(item.id)"
                class="absolute top-2 right-2"
              >
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                  <UIcon
                    name="i-lucide-check"
                    class="w-3 h-3"
                  />
                  In Cart
                </span>
              </div>
              <!-- View Details overlay on hover -->
              <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <span class="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                  View Details
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                @click="handleItemClick({ id: item.id, name: item.name, slug: item.slug })"
                v-html="searchQuery ? highlightText(item.name, searchQuery) : item.name"
              />
              <p
                class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                v-html="searchQuery ? highlightText(item.description, searchQuery) : item.description"
              />

              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-orange-600 dark:text-orange-500">
                  {{ formatPrice(item.price) }}/day
                </span>

                <div class="flex gap-2">
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-eye"
                    @click.stop="handleItemClick({ id: item.id, name: item.name, slug: item.slug })"
                  >
                    Details
                  </UButton>
                  <UButton
                    v-if="!isInCart(item.id)"
                    size="sm"
                    icon="i-lucide-plus"
                    @click.stop="addToCart(item)"
                  >
                    Add
                  </UButton>
                  <UButton
                    v-else
                    size="sm"
                    color="success"
                    variant="soft"
                    icon="i-lucide-plus"
                    @click.stop="addToCart(item)"
                  >
                    Add More
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state (inside relative wrapper for loading overlay) -->
        <div
          v-if="displayItems.length === 0 && !refreshing"
          class="text-center py-12"
        >
          <UIcon
            name="i-lucide-search-x"
            class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400">
            No products found matching your criteria.
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-2"
      >
        <UButton
          :disabled="!hasPrevPage || refreshing"
          color="neutral"
          variant="outline"
          icon="i-lucide-chevron-left"
          @click="loadItemsWithPagination(currentPage - 1, true)"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <UButton
          :disabled="!hasNextPage || refreshing"
          color="neutral"
          variant="outline"
          icon="i-lucide-chevron-right"
          @click="loadItemsWithPagination(currentPage + 1, true)"
        />
      </div>
    </div>

    <!-- Cart Sidebar -->
    <USlideover
      v-if="!hideCart"
      v-model:open="showCart"
      title="Your Cart"
      side="right"
    >
      <template #body>
        <div
          v-if="cart.length === 0"
          class="text-center py-12"
        >
          <UIcon
            name="i-lucide-shopping-cart"
            class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4"
          />
          <p class="text-gray-600 dark:text-gray-400">
            Your cart is empty
          </p>
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 rounded object-cover"
            >
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                {{ item.name }}
              </h4>
              <p class="text-sm text-orange-600 dark:text-orange-500 font-semibold">
                {{ formatPrice(item.price) }}/day
              </p>
              <div class="flex items-center gap-2 mt-1">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-minus"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                />
                <span class="text-sm w-6 text-center">{{ item.quantity }}</span>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-plus"
                  :disabled="!!item.maxQuantity && item.quantity >= item.maxQuantity"
                  @click="updateQuantity(item.id, item.quantity + 1)"
                />
              </div>
              <div
                v-if="item.maxQuantity && item.maxQuantity < 99"
                class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
              >
                Max: {{ item.maxQuantity }}
              </div>
            </div>
            <UButton
              size="xs"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              @click="removeFromCart(item.id)"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div
          v-if="cart.length > 0"
          class="space-y-4"
        >
          <div class="flex items-center justify-between text-lg font-bold">
            <span class="text-gray-900 dark:text-white">Total</span>
            <span class="text-orange-600 dark:text-orange-500">{{ formatPrice(cartTotal) }}</span>
          </div>
          <UButton
            block
            size="lg"
            icon="i-lucide-arrow-right"
            trailing
            @click="proceedToCheckout"
          >
            Proceed to Checkout
          </UButton>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>
/* Custom styles for embed context */
.embed-products {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
