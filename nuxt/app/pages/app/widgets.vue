<script setup lang="ts">
/**
 * Widget Studio
 *
 * A comprehensive widget configuration experience with:
 * - Live preview that updates in real-time
 * - Color customization with preset palettes and custom picker
 * - Theme toggle (light/dark/auto)
 * - Layout options per widget type
 * - One-click embed code generation
 */
import NoTenantAlert from '~/components/NoTenantAlert.vue'
import RbPayloadNotConfiguredAlert from '~/components/RbPayloadNotConfiguredAlert.vue'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()

// Tenant data
const {
  tenant,
  loading: tenantLoading,
  hasTenant,
  isRbPayloadConfigured,
  fetchTenant
} = useTenant()

// Fetch tenant on mount
onMounted(async () => {
  await fetchTenant()
})

// Widget configuration state
const config = reactive({
  widgetType: 'products' as 'products' | 'categories' | 'featured',
  theme: 'dark' as 'light' | 'dark' | 'auto',
  primaryColor: 'f97316', // Orange (without #)
  borderRadius: 'lg' as 'none' | 'sm' | 'md' | 'lg' | 'xl',
  columns: 3,
  limit: 12,
  // Products specific
  hideFilters: false,
  hideCart: false,
  featuredOnly: false,
  // Categories specific
  layout: 'grid' as 'grid' | 'list' | 'carousel',
  onClick: 'book' as 'embed' | 'book' | 'custom',
  // Featured specific
  showPrice: true,
  showDescription: true,
  ctaText: 'Book Now'
})

// Color presets - beautiful, curated palette
const colorPresets = [
  { name: 'Sunset Orange', color: 'f97316', group: 'warm' },
  { name: 'Coral', color: 'f43f5e', group: 'warm' },
  { name: 'Ruby', color: 'dc2626', group: 'warm' },
  { name: 'Amber', color: 'f59e0b', group: 'warm' },
  { name: 'Ocean Blue', color: '3b82f6', group: 'cool' },
  { name: 'Sky', color: '0ea5e9', group: 'cool' },
  { name: 'Indigo', color: '6366f1', group: 'cool' },
  { name: 'Purple', color: 'a855f7', group: 'cool' },
  { name: 'Emerald', color: '10b981', group: 'nature' },
  { name: 'Teal', color: '14b8a6', group: 'nature' },
  { name: 'Lime', color: '84cc16', group: 'nature' },
  { name: 'Pink', color: 'ec4899', group: 'accent' }
]

// Widget type definitions
const widgetTypes = [
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'Full browsing experience with filters, search, and cart',
    icon: 'i-lucide-grid-3x3'
  },
  {
    id: 'categories',
    name: 'Category Browser',
    description: 'Visual category cards for easy navigation',
    icon: 'i-lucide-layout-grid'
  },
  {
    id: 'featured',
    name: 'Featured Items',
    description: 'Showcase your best rentals',
    icon: 'i-lucide-star'
  }
]

// Border radius options
const borderRadiusOptions = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' }
]

// Theme options
const themeOptions = [
  { label: 'Dark', value: 'dark', icon: 'i-lucide-moon' },
  { label: 'Light', value: 'light', icon: 'i-lucide-sun' },
  { label: 'Auto', value: 'auto', icon: 'i-lucide-monitor' }
]

// Layout options (for categories/featured)
const layoutOptions = [
  { label: 'Grid', value: 'grid', icon: 'i-lucide-grid-3x3' },
  { label: 'List', value: 'list', icon: 'i-lucide-list' },
  { label: 'Carousel', value: 'carousel', icon: 'i-lucide-gallery-horizontal' }
]

// Generate preview URL
const previewUrl = computed(() => {
  if (!tenant.value?.slug) return ''

  const base = `/embed/${tenant.value.slug}/${config.widgetType}`
  const params = new URLSearchParams()

  // Theme & styling
  if (config.theme !== 'auto') params.set('theme', config.theme)
  if (config.primaryColor !== 'f97316') params.set('primaryColor', config.primaryColor)
  if (config.borderRadius !== 'lg') params.set('borderRadius', config.borderRadius)

  // Common params
  if (config.columns !== 3) params.set('columns', String(config.columns))
  if (config.limit !== 12) params.set('limit', String(config.limit))

  // Products specific
  if (config.widgetType === 'products') {
    if (config.hideFilters) params.set('hideFilters', 'true')
    if (config.hideCart) params.set('hideCart', 'true')
    if (config.featuredOnly) params.set('featured', 'true')
  }

  // Categories specific
  if (config.widgetType === 'categories') {
    if (config.layout !== 'grid') params.set('layout', config.layout)
    if (config.onClick !== 'book') params.set('onClick', config.onClick)
  }

  // Featured specific
  if (config.widgetType === 'featured') {
    if (config.layout !== 'grid') params.set('layout', config.layout)
    if (!config.showPrice) params.set('showPrice', 'false')
    if (!config.showDescription) params.set('showDescription', 'false')
    if (config.ctaText !== 'Book Now') params.set('cta', config.ctaText)
  }

  const queryString = params.toString()
  return queryString ? `${base}?${queryString}` : base
})

// Full URL for embed
const fullEmbedUrl = computed(() => {
  if (!previewUrl.value) return ''
  return `${window.location.origin}${previewUrl.value}`
})

// Generate iframe code
const iframeCode = computed(() => {
  if (!fullEmbedUrl.value) return ''
  return `<iframe
  src="${fullEmbedUrl.value}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px;"
  title="${config.widgetType === 'products' ? 'Product Catalog' : config.widgetType === 'categories' ? 'Category Browser' : 'Featured Rentals'}"
  loading="lazy"
></iframe>`
})

// Copy to clipboard
const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Failed to copy',
      description: 'Please select and copy manually',
      color: 'error'
    })
  }
}

// Preview iframe key for forcing refresh
const previewKey = ref(0)
const refreshPreview = () => {
  previewKey.value++
}

// Product modal state for widget preview
const showProductModal = ref(false)
const productModalSlug = ref('')

// Handle postMessage from widget iframe for product details
onMounted(() => {
  const handleMessage = (event: MessageEvent) => {
    if (!event.data?.type?.startsWith('bh:')) return

    switch (event.data.type) {
      case 'bh:item:clicked': {
        // Open product modal when item is clicked in preview
        const item = event.data.item
        productModalSlug.value = item.slug || item.id
        showProductModal.value = true
        break
      }
      case 'bh:checkout:requested':
        // Show toast for checkout (just a preview)
        toast.add({
          title: 'Checkout Triggered',
          description: `Cart has ${event.data.cart?.length || 0} items. In embed mode, checkout opens in a drawer.`,
          color: 'info'
        })
        break
    }
  }

  window.addEventListener('message', handleMessage)
  onUnmounted(() => window.removeEventListener('message', handleMessage))
})

// Product modal URL for preview
const productModalUrl = computed(() => {
  if (!tenant.value?.slug || !productModalSlug.value) return ''
  const params = new URLSearchParams()
  if (config.theme !== 'auto') params.set('theme', config.theme)
  if (config.primaryColor !== 'f97316') params.set('primaryColor', config.primaryColor)
  return `/embed/${tenant.value.slug}/product/${productModalSlug.value}?${params.toString()}`
})

// Custom color input
const customColorInput = ref('')
const applyCustomColor = () => {
  const color = customColorInput.value.replace('#', '')
  if (/^[0-9a-fA-F]{6}$/.test(color)) {
    config.primaryColor = color.toLowerCase()
    customColorInput.value = ''
  } else {
    toast.add({
      title: 'Invalid color',
      description: 'Please enter a valid hex color (e.g., #3b82f6)',
      color: 'error'
    })
  }
}

// Tab state for code output
const codeTab = ref<'iframe' | 'url'>('iframe')

// API Documentation data
const embedBasicCode = `<!-- Add the widget container -->
<div
  data-bh-widget="products"
  data-tenant="your-tenant-slug"
  data-theme="dark"
  data-per-page="12"
  data-default-sort="name"
></div>

<!-- Include the embed script (place before closing body tag) -->
  <script async src="https://your-domain.com/embed.js"></` + `script>`

const customCartCode = `<!-- Your custom cart button -->
<button id="my-cart-button" class="cart-btn">
  Cart (<span data-cart-count>0</span>)
</button>

<!-- Widget with custom cart trigger -->
<div
  data-bh-widget="products"
  data-tenant="your-tenant-slug"
  data-cart-element-id="my-cart-button"
  data-hide-cart="true"
></div>`

const eventsCode = `// Cart updated event
window.addEventListener('bh:cart:updated', (e) => {
  console.log('Cart:', e.detail.cart)
  console.log('Total:', e.detail.total)
  console.log('Item count:', e.detail.itemCount)
})

// Item added event
window.addEventListener('bh:item:added', (e) => {
  console.log('Added:', e.detail)
})`

const embedAttributes = [
  { name: 'data-bh-widget', default: '(required)', description: 'Widget type: "products", "product", "checkout", or "cart"' },
  { name: 'data-tenant', default: '(required)', description: 'Your tenant slug (from your business URL)' },
  { name: 'data-behavior', default: 'modal', description: 'How clicks are handled: "modal", "navigate", or "hosted"' },
  { name: 'data-theme', default: 'auto', description: 'Color theme: "light", "dark", or "auto"' },
  { name: 'data-primary-color', default: '#f97316', description: 'Primary brand color (hex without #)' },
  { name: 'data-per-page', default: '12', description: 'Items per page (pagination)' },
  { name: 'data-default-sort', default: 'name', description: 'Default sort: "name", "price", or "price-desc"' },
  { name: 'data-hide-filters', default: 'false', description: 'Hide search and filter controls' },
  { name: 'data-hide-cart', default: 'false', description: 'Hide the built-in cart sidebar' },
  { name: 'data-featured', default: 'false', description: 'Show only featured items' },
  { name: 'data-category', default: '', description: 'Filter by category ID' },
  { name: 'data-cart-element-id', default: '', description: 'ID of custom cart trigger element' },
  { name: 'data-product-url', default: '', description: 'URL pattern for products (use {slug} or {id})' },
  { name: 'data-checkout-url', default: '', description: 'Custom checkout URL for "navigate" mode' }
]

const behaviorModes = [
  { value: 'modal', description: 'Product details open in a modal overlay. Checkout opens in a slide-out drawer. Best for keeping users on your site.' },
  { value: 'navigate', description: 'Clicking products navigates to your custom URLs (set via data-product-url). Checkout redirects to your checkout page.' },
  { value: 'hosted', description: 'All actions redirect to the hosted BouncePro booking pages. Simplest setup, full booking flow handled for you.' }
]

const jsApiMethods = [
  { name: 'addToCart', signature: 'BH.addToCart(itemId, quantity)', description: 'Add an item to the cart programmatically' },
  { name: 'clearCart', signature: 'BH.clearCart()', description: 'Clear all items from the cart' },
  { name: 'setTheme', signature: 'BH.setTheme(theme)', description: 'Change the widget theme ("light", "dark", or "auto")' },
  { name: 'openCheckout', signature: 'BH.openCheckout()', description: 'Open the checkout drawer' },
  { name: 'openProduct', signature: 'BH.openProduct(slugOrId)', description: 'Open product details in a modal' },
  { name: 'getProducts', signature: 'await BH.getProducts({ category, featured, search, limit })', description: 'Fetch products with optional filters (async)' },
  { name: 'getProductDetails', signature: 'await BH.getProductDetails(slugOrId)', description: 'Get details for a specific product (async)' },
  { name: 'getCategories', signature: 'await BH.getCategories()', description: 'Get all available categories (async)' },
  { name: 'getTenant', signature: 'await BH.getTenant()', description: 'Get tenant/business info (async)' },
  { name: 'filterByCategory', signature: 'BH.filterByCategory(category)', description: 'Filter the product grid by category' },
  { name: 'search', signature: 'BH.search(query)', description: 'Search products in the widget' },
  { name: 'cart', signature: 'BH.cart', description: 'Access the current cart array' },
  { name: 'cartTotal', signature: 'BH.cartTotal', description: 'Get the current cart total' }
]

// URL Parameters documentation
const urlParams = [
  { name: 'theme', example: 'dark', description: 'Color theme: "light", "dark", or "auto"' },
  { name: 'primaryColor', example: '3b82f6', description: 'Primary color in hex (without #)' },
  { name: 'category', example: 'bounce-houses', description: 'Filter by category slug - widget auto-filters to this category' },
  { name: 'featured', example: 'true', description: 'Show only featured items' },
  { name: 'product', example: 'rainbow-bounce', description: 'Auto-open product details for a specific product slug' },
  { name: 'hideFilters', example: 'true', description: 'Hide the search and filter controls' },
  { name: 'hideCart', example: 'true', description: 'Hide the cart sidebar/button' },
  { name: 'perPage', example: '6', description: 'Items per page (default: 12)' },
  { name: 'defaultSort', example: 'price', description: 'Default sort: "name", "price", or "price-desc"' }
]

const navigateModeCode = `<!-- Your website's product detail page -->
<!-- URL: /rentals/rainbow-bounce-house -->

<div
  data-bh-widget="product"
  data-tenant="your-tenant"
  data-product-slug="rainbow-bounce-house"
  data-behavior="navigate"
  data-checkout-url="/checkout"
></div>

  <script async src="https://your-domain.com/embed.js"></` + `script>`

const categoryPageCode = `<!-- Your website's category page -->
<!-- URL: /rentals/category/water-slides -->

<div
  data-bh-widget="products"
  data-tenant="your-tenant"
  data-category="water-slides"
  data-behavior="modal"
></div>

  <script async src="https://your-domain.com/embed.js"></` + `script>`

const deepLinkCode = `<!-- Direct link to filtered widget with specific product open -->
<!-- Share this URL to show a specific product -->

https://yoursite.com/rentals?bh_product=rainbow-bounce

<!-- Or filter by category -->
https://yoursite.com/rentals?category=water-slides&featured=true`
</script>

<template>
  <!-- Loading -->
  <div
    v-if="tenantLoading"
    class="flex items-center justify-center min-h-[60vh]"
  >
    <UIcon
      name="i-lucide-loader-2"
      class="w-8 h-8 animate-spin text-gray-400"
    />
  </div>

  <!-- No tenant -->
  <NoTenantAlert v-else-if="!hasTenant" />

  <!-- Not configured -->
  <RbPayloadNotConfiguredAlert
    v-else-if="!isRbPayloadConfigured"
    :sync-status="tenant?.rbPayloadSyncStatus"
    :sync-error="tenant?.rbPayloadSyncError"
  />

  <!-- Main content -->
  <div
    v-else
    class="min-h-screen"
  >
    <!-- Hero Header -->
    <div class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8 px-4 sm:px-6 lg:px-8 pt-8 pb-12 mb-8">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      <div class="relative max-w-7xl mx-auto">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <UIcon
              name="i-lucide-puzzle"
              class="w-7 h-7 text-white"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">
              Widget Studio
            </h1>
            <p class="text-gray-400 mt-1">
              Create embeddable widgets that match your brand
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto">
      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Configuration Panel -->
        <div class="space-y-6">
          <!-- Widget Type Selection -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-layout-template"
                class="w-5 h-5 text-gray-400"
              />
              Widget Type
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="type in widgetTypes"
                :key="type.id"
                :class="[
                  'relative p-4 rounded-xl border-2 text-left transition-all group',
                  config.widgetType === type.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
                @click="config.widgetType = type.id as 'products' | 'categories' | 'featured'"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors',
                    config.widgetType === type.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                  ]"
                >
                  <UIcon
                    :name="type.icon"
                    class="w-5 h-5"
                  />
                </div>
                <h3 class="font-medium text-gray-900 dark:text-white text-sm">
                  {{ type.name }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {{ type.description }}
                </p>
                <div
                  v-if="config.widgetType === type.id"
                  class="absolute top-2 right-2"
                >
                  <UIcon
                    name="i-lucide-check-circle"
                    class="w-5 h-5 text-orange-500"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Appearance -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-palette"
                class="w-5 h-5 text-gray-400"
              />
              Appearance
            </h2>

            <!-- Theme Toggle -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div class="flex gap-2">
                <button
                  v-for="option in themeOptions"
                  :key="option.value"
                  :class="[
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all',
                    config.theme === option.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  @click="config.theme = option.value as 'light' | 'dark' | 'auto'"
                >
                  <UIcon
                    :name="option.icon"
                    class="w-4 h-4"
                  />
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Color Picker -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Primary Color
              </label>

              <!-- Color Presets Grid -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.color"
                  :title="preset.name"
                  :class="[
                    'w-8 h-8 rounded-lg transition-all relative',
                    config.primaryColor === preset.color
                      ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-110'
                      : 'hover:scale-105'
                  ]"
                  :style="{
                    backgroundColor: `#${preset.color}`
                  }"
                  @click="config.primaryColor = preset.color"
                >
                  <UIcon
                    v-if="config.primaryColor === preset.color"
                    name="i-lucide-check"
                    class="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow"
                  />
                </button>
              </div>

              <!-- Custom Color Input -->
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <div
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded border border-gray-300 dark:border-gray-600"
                    :style="{ backgroundColor: customColorInput ? customColorInput : `#${config.primaryColor}` }"
                  />
                  <UInput
                    v-model="customColorInput"
                    placeholder="#3b82f6"
                    class="pl-10"
                    @keyup.enter="applyCustomColor"
                  />
                </div>
                <UButton
                  color="neutral"
                  variant="outline"
                  @click="applyCustomColor"
                >
                  Apply
                </UButton>
              </div>
            </div>

            <!-- Border Radius -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Corner Radius
              </label>
              <div class="flex gap-2">
                <button
                  v-for="option in borderRadiusOptions"
                  :key="option.value"
                  :class="[
                    'flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                    config.borderRadius === option.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  @click="config.borderRadius = option.value as 'none' | 'sm' | 'md' | 'lg' | 'xl'"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Widget-Specific Options -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-sliders-horizontal"
                class="w-5 h-5 text-gray-400"
              />
              Display Options
            </h2>

            <!-- Common: Columns -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Columns
              </label>
              <div class="flex gap-2">
                <button
                  v-for="col in [2, 3, 4]"
                  :key="col"
                  :class="[
                    'flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                    config.columns === col
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                  @click="config.columns = col"
                >
                  {{ col }}
                </button>
              </div>
            </div>

            <!-- Common: Limit -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items to Show
              </label>
              <UInput
                v-model.number="config.limit"
                type="number"
                :min="1"
                :max="50"
                class="w-full"
              />
            </div>

            <!-- Products Options -->
            <div
              v-if="config.widgetType === 'products'"
              class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <UCheckbox
                v-model="config.hideFilters"
                label="Hide search & filters"
              />
              <UCheckbox
                v-model="config.hideCart"
                label="Hide cart sidebar"
              />
              <UCheckbox
                v-model="config.featuredOnly"
                label="Show featured items only"
              />
            </div>

            <!-- Categories Options -->
            <div
              v-if="config.widgetType === 'categories'"
              class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Layout Style
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="option in layoutOptions"
                    :key="option.value"
                    :class="[
                      'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                      config.layout === option.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                    @click="config.layout = option.value as 'grid' | 'list' | 'carousel'"
                  >
                    <UIcon
                      :name="option.icon"
                      class="w-4 h-4"
                    />
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Featured Options -->
            <div
              v-if="config.widgetType === 'featured'"
              class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Layout Style
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="option in layoutOptions.filter(o => o.value !== 'list')"
                    :key="option.value"
                    :class="[
                      'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                      config.layout === option.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                    @click="config.layout = option.value as 'grid' | 'list' | 'carousel'"
                  >
                    <UIcon
                      :name="option.icon"
                      class="w-4 h-4"
                    />
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <UCheckbox
                  v-model="config.showPrice"
                  label="Show prices"
                />
                <UCheckbox
                  v-model="config.showDescription"
                  label="Show descriptions"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Button Text
                </label>
                <UInput
                  v-model="config.ctaText"
                  placeholder="Book Now"
                />
              </div>
            </div>
          </div>

          <!-- Embed Code -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon
                  name="i-lucide-code-2"
                  class="w-5 h-5 text-gray-400"
                />
                Embed Code
              </h2>
              <div class="flex gap-1">
                <button
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium transition-all',
                    codeTab === 'iframe'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  ]"
                  @click="codeTab = 'iframe'"
                >
                  iFrame
                </button>
                <button
                  :class="[
                    'px-3 py-1 rounded-md text-sm font-medium transition-all',
                    codeTab === 'url'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  ]"
                  @click="codeTab = 'url'"
                >
                  URL
                </button>
              </div>
            </div>

            <div class="relative">
              <pre
                class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap"
              >{{ codeTab === 'iframe' ? iframeCode : fullEmbedUrl }}</pre>
              <UButton
                color="primary"
                size="sm"
                icon="i-lucide-copy"
                class="absolute top-3 right-3"
                @click="copyToClipboard(codeTab === 'iframe' ? iframeCode : fullEmbedUrl, codeTab === 'iframe' ? 'Embed code' : 'Widget URL')"
              >
                Copy
              </UButton>
            </div>

            <div class="mt-4 flex gap-2">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-external-link"
                :to="previewUrl"
                target="_blank"
              >
                Open in New Tab
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-refresh-cw"
                @click="refreshPreview"
              >
                Refresh Preview
              </UButton>
            </div>
          </div>
        </div>

        <!-- Live Preview Panel -->
        <div class="xl:sticky xl:top-4 h-fit">
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500" />
                  <div class="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2 font-mono truncate max-w-[300px]">
                  {{ fullEmbedUrl || 'Configure widget to see preview' }}
                </span>
              </div>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-maximize-2"
                :to="previewUrl"
                target="_blank"
              />
            </div>

            <!-- Preview iframe -->
            <div
              :class="[
                'relative',
                config.theme === 'dark' ? 'bg-gray-900' : config.theme === 'light' ? 'bg-white' : 'bg-gray-100 dark:bg-gray-900'
              ]"
              style="height: calc(100vh - 280px); min-height: 500px;"
            >
              <iframe
                v-if="previewUrl"
                :key="previewKey"
                :src="previewUrl"
                class="w-full h-full border-0"
                title="Widget Preview"
              />
              <div
                v-else
                class="flex items-center justify-center h-full"
              >
                <div class="text-center">
                  <UIcon
                    name="i-lucide-monitor"
                    class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
                  />
                  <p class="text-gray-500 dark:text-gray-400">
                    Widget preview will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Tips -->
          <div class="mt-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl border border-orange-200 dark:border-orange-800/50">
            <h3 class="font-medium text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
              <UIcon
                name="i-lucide-lightbulb"
                class="w-4 h-4"
              />
              Integration Tips
            </h3>
            <ul class="text-sm text-orange-800 dark:text-orange-200 space-y-1">
              <li>Copy the iframe code and paste it into your website's HTML</li>
              <li>Works on WordPress, Wix, Squarespace, and any HTML site</li>
              <li>Adjust the height attribute to fit your page layout</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Advanced Integration Section -->
      <div class="mt-12 space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <UIcon
            name="i-lucide-code-2"
            class="w-6 h-6 text-orange-500"
          />
          Advanced Integration (embed.js)
        </h2>

        <p class="text-gray-600 dark:text-gray-400">
          For more control over the widget behavior, use our JavaScript embed script. This method provides
          modal/drawer support, custom cart triggers, event handling, and seamless integration with your site.
        </p>

        <!-- Basic Usage -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Usage
          </h3>
          <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ embedBasicCode }}</pre>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-copy"
            class="mt-3"
            @click="copyToClipboard(embedBasicCode, 'Basic embed code')"
          >
            Copy Code
          </UButton>
        </div>

        <!-- Attributes Reference -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Attributes
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">
                    Attribute
                  </th>
                  <th class="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">
                    Default
                  </th>
                  <th class="text-left py-2 font-semibold text-gray-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="attr in embedAttributes"
                  :key="attr.name"
                >
                  <td class="py-2 pr-4">
                    <code class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs">{{ attr.name }}</code>
                  </td>
                  <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    {{ attr.default }}
                  </td>
                  <td class="py-2 text-gray-600 dark:text-gray-400">
                    {{ attr.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Behavior Modes -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Behavior Modes
          </h3>

          <div class="space-y-4">
            <div
              v-for="mode in behaviorModes"
              :key="mode.value"
              class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-2">
                <code class="text-orange-600 dark:text-orange-400 font-semibold">{{ mode.value }}</code>
                <UBadge
                  v-if="mode.value === 'modal'"
                  color="success"
                  size="xs"
                >
                  Default
                </UBadge>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ mode.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Custom Cart Trigger -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Custom Cart Trigger
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Use your own cart button instead of the default one. The widget will update a <code class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs">data-cart-count</code> attribute on your element.
          </p>
          <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ customCartCode }}</pre>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-copy"
            class="mt-3"
            @click="copyToClipboard(customCartCode, 'Custom cart code')"
          >
            Copy Code
          </UButton>
        </div>

        <!-- JavaScript API -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            JavaScript API
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Control the widget programmatically using the global <code class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs">BH</code> object.
          </p>

          <div class="space-y-3">
            <div
              v-for="method in jsApiMethods"
              :key="method.name"
              class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <code class="text-orange-600 dark:text-orange-400 font-semibold text-sm">{{ method.signature }}</code>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {{ method.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Events -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Events
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Listen for widget events on the window object.
          </p>
          <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ eventsCode }}</pre>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-copy"
            class="mt-3"
            @click="copyToClipboard(eventsCode, 'Events code')"
          >
            Copy Code
          </UButton>
        </div>

        <!-- URL Parameters & Deep Linking -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-link"
              class="w-5 h-5 text-orange-500"
            />
            URL Parameters & Deep Linking
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Pass parameters via URL query strings to customize widget behavior. Perfect for category pages, product pages, or shareable links.
          </p>

          <div class="overflow-x-auto mb-6">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">
                    Parameter
                  </th>
                  <th class="text-left py-2 pr-4 font-semibold text-gray-900 dark:text-white">
                    Example
                  </th>
                  <th class="text-left py-2 font-semibold text-gray-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="param in urlParams"
                  :key="param.name"
                >
                  <td class="py-2 pr-4">
                    <code class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs">{{ param.name }}</code>
                  </td>
                  <td class="py-2 pr-4 text-gray-500 dark:text-gray-400">
                    <code class="text-xs">{{ param.example }}</code>
                  </td>
                  <td class="py-2 text-gray-600 dark:text-gray-400">
                    {{ param.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <UIcon
                name="i-lucide-info"
                class="w-4 h-4"
              />
              How Deep Linking Works
            </h4>
            <p class="text-blue-800 dark:text-blue-200 text-sm">
              When users click products, the URL is updated with <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">bh_product=slug</code>.
              This enables back-button navigation and shareable links. When the page loads with this parameter, the product modal opens automatically.
            </p>
          </div>

          <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ deepLinkCode }}</pre>
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-copy"
            class="mt-3"
            @click="copyToClipboard(deepLinkCode, 'Deep link examples')"
          >
            Copy Examples
          </UButton>
        </div>

        <!-- Navigate Mode: Custom Product Pages -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-navigation"
              class="w-5 h-5 text-orange-500"
            />
            Custom Product & Category Pages
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Use <code class="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded text-xs">behavior="navigate"</code> to integrate widgets with your existing website structure.
            Create dedicated pages for each product or category.
          </p>

          <div class="space-y-6">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                Single Product Page
              </h4>
              <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ navigateModeCode }}</pre>
              <UButton
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-lucide-copy"
                class="mt-3"
                @click="copyToClipboard(navigateModeCode, 'Product page code')"
              >
                Copy Code
              </UButton>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                Category Page
              </h4>
              <pre class="p-4 bg-gray-900 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto">{{ categoryPageCode }}</pre>
              <UButton
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-lucide-copy"
                class="mt-3"
                @click="copyToClipboard(categoryPageCode, 'Category page code')"
              >
                Copy Code
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal for Widget Preview -->
    <UModal
      v-model:open="showProductModal"
      class="max-w-4xl"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Product Details Preview
          </h3>
        </div>
      </template>
      <template #body>
        <div
          :class="[
            'rounded-lg overflow-hidden',
            config.theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          ]"
          style="height: 600px;"
        >
          <iframe
            v-if="productModalUrl"
            :src="productModalUrl"
            class="w-full h-full border-0"
            title="Product Details Preview"
          />
        </div>
      </template>
      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton
            color="neutral"
            variant="outline"
            @click="close"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
