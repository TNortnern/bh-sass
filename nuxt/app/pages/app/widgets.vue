<script setup lang="ts">
/**
 * Widgets Page
 *
 * This page embeds the rb-payload widget configuration editor, which provides:
 * - Live preview with customization options
 * - Auto-generated embed codes (iframe, JavaScript)
 * - Automatic updates when rb-payload improves the widget
 *
 * The config editor posts messages back to this page when config changes,
 * allowing BH-SaaS to optionally save widget preferences per tenant.
 *
 * IMPORTANT: Uses rbPayloadTenantId (from rb-payload) NOT the bh-saas tenant ID
 */

import NoTenantAlert from '~/components/NoTenantAlert.vue'
import RbPayloadNotConfiguredAlert from '~/components/RbPayloadNotConfiguredAlert.vue'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const _colorMode = useColorMode()

// Use tenant composable to get rb-payload integration data
const {
  tenant,
  loading: tenantLoading,
  hasTenant,
  rbPayloadTenantId,
  isRbPayloadConfigured,
  rbPayloadUrl: _rbPayloadUrl,
  fetchTenant
} = useTenant()

// Use widget URL composable for generating URLs with customer pre-fill
const {
  baseWidgetUrl: _baseWidgetUrl,
  configEditorUrl,
  generateWidgetUrl,
  generateCustomerWidgetUrl,
  generateEmbedCode
} = useWidgetUrl()

// Use SSO composable for auto-login to rb-payload admin
const {
  isGeneratingSsoUrl,
  navigateToRbPayload: _navigateToRbPayload,
  navigateToCollection,
  navigateToAdmin
} = useSso()

// Fetch tenant data on mount
onMounted(async () => {
  await fetchTenant()
})

// Widget config editor URL (uses composable)
const widgetConfigUrl = configEditorUrl

// Direct widget link (uses composable with auto theme)
const directWidgetLink = computed(() => {
  return generateWidgetUrl({ theme: 'auto' })
})

// Customer pre-fill form
const customerPreFill = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Generate customer-specific widget URL
const customerWidgetUrl = computed(() => {
  if (!customerPreFill.value.firstName && !customerPreFill.value.email) {
    return ''
  }
  return generateCustomerWidgetUrl(customerPreFill.value, { theme: 'auto' })
})

// Generate customer-specific embed code
const customerEmbedCode = computed(() => {
  if (!customerWidgetUrl.value) return ''
  return generateEmbedCode({
    theme: 'auto',
    customer: customerPreFill.value
  })
})

// Clear pre-fill form
const clearCustomerPreFill = () => {
  customerPreFill.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }
}

// Listen for config updates from embedded iframe
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const latestConfig = ref<any>(null)
const latestEmbedCode = ref<string>('')

// Set up message listener with proper cleanup to avoid memory leaks
onMounted(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'rb-widget-config-update') {
      latestConfig.value = event.data.config
      latestEmbedCode.value = event.data.embedCode
    }
  }

  window.addEventListener('message', handleMessage)

  // Clean up listener when component unmounts
  onUnmounted(() => {
    window.removeEventListener('message', handleMessage)
  })
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
      description: 'Please manually select and copy the code',
      color: 'error'
    })
  }
}

// View mode: 'embedded' (full config editor), 'simple' (just links), 'embed' (embeddable widgets), or 'manage' (rb-payload admin)
const viewMode = ref<'embedded' | 'simple' | 'embed' | 'manage'>('embedded')

// Embed widget configuration
const embedConfig = ref({
  widgetType: 'products' as 'products' | 'categories' | 'featured',
  theme: 'auto' as 'auto' | 'light' | 'dark',
  layout: 'grid' as 'grid' | 'list' | 'carousel',
  columns: 3,
  limit: 12,
  showFilters: true,
  showCart: true,
  showPrice: true,
  showDescription: true,
  featuredOnly: false
})

// Widget type options
type WidgetType = 'products' | 'categories' | 'featured'
const widgetTypeOptions: Array<{ label: string, value: WidgetType, description: string }> = [
  { label: 'Products Grid', value: 'products', description: 'Full product catalog with filters and cart' },
  { label: 'Categories', value: 'categories', description: 'Category tiles for navigation' },
  { label: 'Featured Items', value: 'featured', description: 'Showcase your top rentals' }
]

// Theme options
const themeOptions = [
  { label: 'Auto (System)', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

// Layout options for embed
const layoutOptions = computed(() => {
  if (embedConfig.value.widgetType === 'products') {
    return [{ label: 'Grid', value: 'grid' }]
  }
  return [
    { label: 'Grid', value: 'grid' },
    { label: 'List', value: 'list' },
    { label: 'Carousel', value: 'carousel' }
  ]
})

// Generate embed URL
const embedWidgetUrl = computed(() => {
  if (!tenant.value?.slug) return ''

  const base = `${window.location.origin}/embed/${tenant.value.slug}/${embedConfig.value.widgetType}`
  const params = new URLSearchParams()

  if (embedConfig.value.theme !== 'auto') params.set('theme', embedConfig.value.theme)
  if (embedConfig.value.layout !== 'grid') params.set('layout', embedConfig.value.layout)
  if (embedConfig.value.columns !== 3) params.set('columns', String(embedConfig.value.columns))
  if (embedConfig.value.limit !== 12) params.set('limit', String(embedConfig.value.limit))
  if (!embedConfig.value.showFilters) params.set('hideFilters', 'true')
  if (!embedConfig.value.showCart) params.set('hideCart', 'true')
  if (!embedConfig.value.showPrice) params.set('showPrice', 'false')
  if (!embedConfig.value.showDescription) params.set('showDescription', 'false')
  if (embedConfig.value.featuredOnly) params.set('featured', 'true')

  const queryString = params.toString()
  return queryString ? `${base}?${queryString}` : base
})

// Generate iframe embed code
const embedIframeCode = computed(() => {
  if (!embedWidgetUrl.value) return ''
  return `<iframe
  src="${embedWidgetUrl.value}"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Booking Widget"
></iframe>`
})

// rb-payload collections with SSO - click handlers instead of URLs
const rbPayloadCollections = computed(() => {
  if (!rbPayloadTenantId.value) return []

  return [
    {
      name: 'Services (Inventory)',
      description: 'Manage bookable items synced from your inventory',
      icon: 'i-lucide-package',
      color: 'orange',
      collection: 'services'
    },
    {
      name: 'Customers',
      description: 'View and manage customer records',
      icon: 'i-lucide-users',
      color: 'blue',
      collection: 'customers'
    },
    {
      name: 'Bookings',
      description: 'View and manage all bookings',
      icon: 'i-lucide-calendar',
      color: 'green',
      collection: 'bookings'
    },
    {
      name: 'Staff',
      description: 'Manage staff members and schedules',
      icon: 'i-lucide-user-check',
      color: 'purple',
      collection: 'staff'
    },
    {
      name: 'Blackout Dates',
      description: 'Set unavailable dates and holidays',
      icon: 'i-lucide-calendar-off',
      color: 'red',
      collection: 'blackouts'
    },
    {
      name: 'Notifications',
      description: 'View booking notifications and alerts',
      icon: 'i-lucide-bell',
      color: 'amber',
      collection: 'notifications'
    }
  ]
})

// Handle clicking on a collection card - opens with SSO
const handleCollectionClick = async (collection: string) => {
  await navigateToCollection(collection, true)
}
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="tenantLoading"
    class="flex items-center justify-center min-h-[60vh]"
  >
    <UIcon
      name="i-lucide-loader-2"
      class="w-8 h-8 animate-spin text-gray-400"
    />
  </div>

  <!-- Show NoTenantAlert if user doesn't have a tenant assigned -->
  <NoTenantAlert v-else-if="!hasTenant" />

  <!-- Show RbPayloadNotConfiguredAlert if tenant is not linked to rb-payload -->
  <RbPayloadNotConfiguredAlert
    v-else-if="!isRbPayloadConfigured"
    :sync-status="tenant?.rbPayloadSyncStatus"
    :sync-error="tenant?.rbPayloadSyncError"
  />

  <div
    v-else
    class="max-w-7xl mx-auto"
  >
    <!-- Page Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Booking Widgets
        </h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          Customize and embed your booking widget on your website
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          :color="viewMode === 'embedded' ? 'primary' : 'neutral'"
          :variant="viewMode === 'embedded' ? 'soft' : 'ghost'"
          size="sm"
          icon="i-lucide-sliders"
          @click="viewMode = 'embedded'"
        >
          Full Editor
        </UButton>
        <UButton
          :color="viewMode === 'simple' ? 'primary' : 'neutral'"
          :variant="viewMode === 'simple' ? 'soft' : 'ghost'"
          size="sm"
          icon="i-lucide-link"
          @click="viewMode = 'simple'"
        >
          Quick Links
        </UButton>
        <UButton
          :color="viewMode === 'embed' ? 'primary' : 'neutral'"
          :variant="viewMode === 'embed' ? 'soft' : 'ghost'"
          size="sm"
          icon="i-lucide-code"
          @click="viewMode = 'embed'"
        >
          Embed Code
        </UButton>
        <UButton
          :color="viewMode === 'manage' ? 'primary' : 'neutral'"
          :variant="viewMode === 'manage' ? 'soft' : 'ghost'"
          size="sm"
          icon="i-lucide-database"
          @click="viewMode = 'manage'"
        >
          Manage Data
        </UButton>
      </div>
    </div>

    <!-- Embedded Config Editor (Full Editor Mode) -->
    <div
      v-if="viewMode === 'embedded'"
      class="space-y-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UIcon
              name="i-lucide-external-link"
              class="w-4 h-4"
            />
            <span>Powered by ReusableBook Widget Editor</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-external-link"
            :to="widgetConfigUrl"
            target="_blank"
          >
            Open in New Tab
          </UButton>
        </div>
        <iframe
          :src="widgetConfigUrl"
          class="w-full border-0"
          style="height: calc(100vh - 200px); min-height: 700px;"
          title="Widget Configuration Editor"
        />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
        This editor is provided by the booking system and automatically stays up-to-date with the latest features.
      </p>
    </div>

    <!-- Simple Links Mode -->
    <div
      v-else-if="viewMode === 'simple'"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <!-- Direct Booking Link -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-link"
                class="w-5 h-5 text-orange-600 dark:text-orange-400"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Booking Page Link
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Share with customers
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Use this link in emails, social media, or anywhere you want customers to book directly.
          </p>
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <code class="text-sm text-orange-600 dark:text-orange-400 break-all">
              {{ directWidgetLink }}
            </code>
          </div>
          <div class="flex gap-2">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-copy"
              @click="copyToClipboard(directWidgetLink, 'Booking link')"
            >
              Copy Link
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-external-link"
              :to="directWidgetLink"
              target="_blank"
            >
              Preview
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Widget Editor Link -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-sliders"
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Widget Editor
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Customize & get embed code
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Customize colors, display options, and generate embed codes for your website.
          </p>
          <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <code class="text-sm text-purple-600 dark:text-purple-400 break-all">
              {{ widgetConfigUrl }}
            </code>
          </div>
          <div class="flex gap-2">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-sliders"
              @click="viewMode = 'embedded'"
            >
              Open Editor
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-lucide-external-link"
              :to="widgetConfigUrl"
              target="_blank"
            >
              New Tab
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Customer Pre-fill Link Generator -->
      <UCard class="md:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-user-plus"
                  class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
                />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Customer Pre-fill Link
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Generate personalized booking links
                </p>
              </div>
            </div>
            <UButton
              v-if="customerWidgetUrl"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-lucide-x"
              @click="clearCustomerPreFill"
            >
              Clear
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Generate a booking link with customer info pre-filled. Great for follow-up emails or personalized marketing.
          </p>

          <!-- Customer form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="First Name">
              <UInput
                v-model="customerPreFill.firstName"
                placeholder="John"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Last Name">
              <UInput
                v-model="customerPreFill.lastName"
                placeholder="Doe"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Email">
              <UInput
                v-model="customerPreFill.email"
                type="email"
                placeholder="john@example.com"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Phone">
              <UInput
                v-model="customerPreFill.phone"
                placeholder="(555) 123-4567"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Generated URL -->
          <div
            v-if="customerWidgetUrl"
            class="space-y-3"
          >
            <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <code class="text-sm text-cyan-600 dark:text-cyan-400 break-all">
                {{ customerWidgetUrl }}
              </code>
            </div>
            <div class="flex gap-2">
              <UButton
                color="primary"
                variant="soft"
                icon="i-lucide-copy"
                @click="copyToClipboard(customerWidgetUrl, 'Customer link')"
              >
                Copy Link
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                icon="i-lucide-external-link"
                :to="customerWidgetUrl"
                target="_blank"
              >
                Preview
              </UButton>
              <UButton
                color="neutral"
                variant="soft"
                icon="i-lucide-code"
                @click="copyToClipboard(customerEmbedCode, 'Embed code')"
              >
                Copy Embed
              </UButton>
            </div>
          </div>
          <p
            v-else
            class="text-sm text-gray-500 dark:text-gray-400 italic"
          >
            Enter at least a first name or email to generate a personalized link.
          </p>
        </div>
      </UCard>

      <!-- Integration Tips -->
      <UCard class="md:col-span-2">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-lightbulb"
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Quick Tips
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Getting started with widgets
              </p>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-medium text-gray-900 dark:text-white mb-1">
              Direct Link
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Perfect for email campaigns, social media, and direct customer communication.
            </p>
          </div>
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-medium text-gray-900 dark:text-white mb-1">
              iFrame Embed
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Works on WordPress, Wix, Squarespace, and any website. No coding required.
            </p>
          </div>
          <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="font-medium text-gray-900 dark:text-white mb-1">
              Customization
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Match your brand colors and choose what information to display.
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Embed Code Generator Mode -->
    <div
      v-else-if="viewMode === 'embed'"
      class="space-y-6"
    >
      <!-- Info Banner -->
      <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-start gap-3">
        <UIcon
          name="i-lucide-code"
          class="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0"
        />
        <div>
          <h4 class="font-medium text-purple-900 dark:text-purple-100 mb-1">
            Embeddable Widgets
          </h4>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            Generate embed codes for your products, categories, or featured items.
            These widgets support multi-item selection and can be embedded on any website.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Configuration Panel -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-settings"
                  class="w-5 h-5 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Widget Configuration
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Customize your embed widget
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-5">
            <!-- Widget Type -->
            <UFormField label="Widget Type">
              <USelect
                v-model="embedConfig.widgetType"
                :items="widgetTypeOptions"
                class="w-full"
              />
            </UFormField>

            <!-- Theme -->
            <UFormField label="Theme">
              <USelect
                v-model="embedConfig.theme"
                :items="themeOptions"
                class="w-full"
              />
            </UFormField>

            <!-- Layout (for categories/featured) -->
            <UFormField
              v-if="embedConfig.widgetType !== 'products'"
              label="Layout"
            >
              <USelect
                v-model="embedConfig.layout"
                :items="layoutOptions"
                class="w-full"
              />
            </UFormField>

            <!-- Columns -->
            <UFormField label="Columns">
              <UInput
                v-model.number="embedConfig.columns"
                type="number"
                :min="2"
                :max="6"
                class="w-full"
              />
            </UFormField>

            <!-- Limit -->
            <UFormField label="Items Limit">
              <UInput
                v-model.number="embedConfig.limit"
                type="number"
                :min="1"
                :max="50"
                class="w-full"
              />
            </UFormField>

            <!-- Product-specific options -->
            <div
              v-if="embedConfig.widgetType === 'products'"
              class="space-y-3"
            >
              <UCheckbox
                v-model="embedConfig.showFilters"
                label="Show filters"
              />
              <UCheckbox
                v-model="embedConfig.showCart"
                label="Show cart sidebar"
              />
              <UCheckbox
                v-model="embedConfig.featuredOnly"
                label="Featured items only"
              />
            </div>

            <!-- Featured-specific options -->
            <div
              v-if="embedConfig.widgetType === 'featured'"
              class="space-y-3"
            >
              <UCheckbox
                v-model="embedConfig.showPrice"
                label="Show prices"
              />
              <UCheckbox
                v-model="embedConfig.showDescription"
                label="Show descriptions"
              />
            </div>
          </div>
        </UCard>

        <!-- Generated Code Panel -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-copy"
                  class="w-5 h-5 text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Generated Code
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Copy and paste into your website
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Direct URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Direct URL
              </label>
              <div class="flex gap-2">
                <UInput
                  :model-value="embedWidgetUrl"
                  readonly
                  class="flex-1 font-mono text-sm"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-lucide-copy"
                  @click="copyToClipboard(embedWidgetUrl, 'Widget URL')"
                />
              </div>
            </div>

            <!-- iFrame Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                iFrame Embed Code
              </label>
              <div class="relative">
                <pre class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">{{ embedIframeCode }}</pre>
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-lucide-copy"
                  size="sm"
                  class="absolute top-2 right-2"
                  @click="copyToClipboard(embedIframeCode, 'Embed code')"
                />
              </div>
            </div>

            <!-- Preview Button -->
            <div class="flex gap-2">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-lucide-external-link"
                :to="embedWidgetUrl"
                target="_blank"
              >
                Preview Widget
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Widget Type Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="widget in widgetTypeOptions"
          :key="widget.value"
          :class="[
            'p-4 rounded-xl border-2 text-left transition-all',
            embedConfig.widgetType === widget.value
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          ]"
          @click="embedConfig.widgetType = widget.value"
        >
          <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
            {{ widget.label }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ widget.description }}
          </p>
        </button>
      </div>
    </div>

    <!-- Manage Data Mode - Direct rb-payload access -->
    <div
      v-else-if="viewMode === 'manage'"
      class="space-y-6"
    >
      <!-- Info Banner -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
        <UIcon
          name="i-lucide-info"
          class="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"
        />
        <div>
          <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Direct Booking System Access
          </h4>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Access the booking system's admin panel directly to manage customers, bookings, and inventory synced from BouncePro.
            Changes here will be reflected in the booking widget.
          </p>
        </div>
      </div>

      <!-- Collection Links Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="item in rbPayloadCollections"
          :key="item.name"
          :disabled="isGeneratingSsoUrl"
          class="group block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 text-left w-full disabled:opacity-50 disabled:cursor-wait"
          @click="handleCollectionClick(item.collection)"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-orange-100 dark:bg-orange-900/30': item.color === 'orange',
                'bg-blue-100 dark:bg-blue-900/30': item.color === 'blue',
                'bg-green-100 dark:bg-green-900/30': item.color === 'green',
                'bg-purple-100 dark:bg-purple-900/30': item.color === 'purple',
                'bg-red-100 dark:bg-red-900/30': item.color === 'red',
                'bg-amber-100 dark:bg-amber-900/30': item.color === 'amber'
              }"
            >
              <UIcon
                :name="item.icon"
                class="w-6 h-6"
                :class="{
                  'text-orange-600 dark:text-orange-400': item.color === 'orange',
                  'text-blue-600 dark:text-blue-400': item.color === 'blue',
                  'text-green-600 dark:text-green-400': item.color === 'green',
                  'text-purple-600 dark:text-purple-400': item.color === 'purple',
                  'text-red-600 dark:text-red-400': item.color === 'red',
                  'text-amber-600 dark:text-amber-400': item.color === 'amber'
                }"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {{ item.name }}
                </h3>
                <UIcon
                  v-if="!isGeneratingSsoUrl"
                  name="i-lucide-external-link"
                  class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <UIcon
                  v-else
                  name="i-lucide-loader-2"
                  class="w-4 h-4 text-gray-400 animate-spin"
                />
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </div>
          </div>
        </button>
      </div>

      <!-- Full Admin Access -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Full Admin Panel
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Access the complete booking system admin panel with all features and settings
            </p>
          </div>
          <UButton
            color="primary"
            icon="i-lucide-external-link"
            :loading="isGeneratingSsoUrl"
            @click="navigateToAdmin"
          >
            Open Admin Panel
          </UButton>
        </div>
      </div>

      <!-- Help Text -->
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        The booking system admin panel opens in a new tab. You will be automatically logged in with your BouncePro account.
      </p>
    </div>
  </div>
</template>
