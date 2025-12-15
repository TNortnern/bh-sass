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
 */

import NoTenantAlert from '~/components/NoTenantAlert.vue'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const config = useRuntimeConfig()
const colorMode = useColorMode()
const { currentUser } = useAuth()

// Check if user has tenant ID assigned
const hasTenant = computed(() => {
  return currentUser.value?.tenantId !== null && currentUser.value?.tenantId !== undefined
})

// Use authenticated user's rb-payload tenant ID (NO fallback - show error if not set)
const tenantId = computed(() => {
  if (hasTenant.value && currentUser.value?.tenantId) {
    // tenantId could be string or number from Payload
    const id = currentUser.value.tenantId
    return typeof id === 'string' ? parseInt(id) : id
  }
  return null // No fallback - will trigger NoTenantAlert
})

// rb-payload widget base URL
const rbPayloadUrl = computed(() => {
  return config.public?.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
})

// Widget config editor URL (embedded from rb-payload)
const widgetConfigUrl = computed(() => {
  const theme = colorMode.value === 'dark' ? 'dark' : 'light'
  return `${rbPayloadUrl.value}/widget/config/${tenantId.value}?theme=${theme}`
})

// Direct widget link
const directWidgetLink = computed(() => {
  const theme = colorMode.value === 'dark' ? 'dark' : 'light'
  return `${rbPayloadUrl.value}/widget/${tenantId.value}?theme=${theme}`
})

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

// View mode: 'embedded' (full config editor) or 'simple' (just links)
const viewMode = ref<'embedded' | 'simple'>('embedded')
</script>

<template>
  <!-- Show NoTenantAlert if user doesn't have a tenant assigned -->
  <NoTenantAlert v-if="!hasTenant" />

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
      v-else
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
  </div>
</template>
