<script setup lang="ts">
interface TenantWebsite {
  enabled?: boolean
  seo?: {
    title?: string
    description?: string
  }
  aboutContent?: string
  showServices?: boolean
}

interface TenantBranding {
  businessName?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

interface TenantAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
}

interface TenantServiceArea {
  radius?: number
  unit?: string
}

interface TenantSettings {
  currency?: string
}

interface TenantLogo {
  url: string
  alt: string
}

interface Tenant {
  id: string
  name: string
  slug: string
  description?: string
  phone?: string
  email?: string
  website?: TenantWebsite
  branding?: TenantBranding
  businessHours?: Record<string, { enabled?: boolean, open?: string, close?: string }>
  settings?: TenantSettings
  logo?: TenantLogo
  address?: TenantAddress
  serviceArea?: TenantServiceArea
}

interface RentalItem {
  id: string
  slug: string
  name: string
  description?: string
  images?: Array<{ url: string, alt?: string }>
  pricing?: {
    fullDayRate?: number
  }
}

interface ItemsResponse {
  items: RentalItem[]
}

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string

// Fetch tenant with website settings
const { data: tenant, error: tenantError, status } = await useFetch<Tenant>(`/api/tenants-public/${tenantSlug}`)

// Fetch rental items for services section
const { data: itemsData } = await useFetch<ItemsResponse>('/public/items/dummy', {
  query: computed(() => {
    if (!tenant.value?.id) return {}
    return { tenantId: tenant.value.id }
  }),
  immediate: false
})

// Fetch items when tenant is loaded
watch(() => tenant.value?.id, async (tenantId) => {
  if (tenantId) {
    const response = await $fetch<ItemsResponse>(`/public/items/${tenantId}`)
    itemsData.value = response
  }
}, { immediate: true })

const items = computed(() => itemsData.value?.items || [])

// Redirect to 404 if tenant not found or website not enabled
if (tenantError.value || !tenant.value) {
  await navigateTo('/404')
}

if (tenant.value && !tenant.value.website?.enabled) {
  await navigateTo('/404')
}

// Set SEO meta tags
useSeoMeta({
  title: tenant.value?.website?.seo?.title || tenant.value?.name || 'Party Rentals',
  description: tenant.value?.website?.seo?.description || tenant.value?.description || 'Book party equipment online',
  ogTitle: tenant.value?.website?.seo?.title || tenant.value?.name,
  ogDescription: tenant.value?.website?.seo?.description || tenant.value?.description,
  ogImage: tenant.value?.logo?.url,
  twitterCard: 'summary_large_image'
})

// Apply theme colors via CSS variables
const themeStyles = computed(() => {
  if (!tenant.value?.branding) return {}

  return {
    '--primary-color': tenant.value.branding.primaryColor || '#fbbf24',
    '--secondary-color': tenant.value.branding.secondaryColor || '#3b82f6',
    '--accent-color': tenant.value.branding.accentColor || '#10b981'
  }
})

// Format business hours for display
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatBusinessHours = (hours: any) => {
  if (!hours) return []

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  return days.map(day => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    enabled: hours[day]?.enabled || false,
    open: hours[day]?.open || '09:00',
    close: hours[day]?.close || '17:00'
  })).filter(d => d.enabled)
}

const businessHours = computed(() => formatBusinessHours(tenant.value?.businessHours))

// Format phone number
const formatPhone = (phone: string) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

// Format price
const formatPrice = (price: number) => {
  const currency = tenant.value?.settings?.currency || 'USD'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(price)
}

// Featured items (first 6)
const featuredItems = computed(() => items.value.slice(0, 6))
</script>

<template>
  <div
    v-if="tenant"
    :style="themeStyles"
    class="min-h-screen"
  >
    <!-- Loading State -->
    <div
      v-if="status === 'pending'"
      class="flex items-center justify-center py-16"
    >
      <div class="text-center">
        <UIcon
          name="lucide:loader-circle"
          class="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="tenantError"
      class="text-center py-16 px-4"
    >
      <UIcon
        name="lucide:alert-circle"
        class="w-16 h-16 text-red-600 mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Not Found
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <UButton
        to="/"
        label="Go Home"
      />
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700 text-white overflow-hidden">
        <div class="absolute inset-0 bg-black/20" />
        <div class="relative container mx-auto px-4 py-16 md:py-24">
          <div class="max-w-3xl">
            <!-- Logo -->
            <div
              v-if="tenant.logo"
              class="mb-6"
            >
              <img
                :src="tenant.logo.url"
                :alt="tenant.logo.alt"
                class="h-16 md:h-20 w-auto"
              >
            </div>

            <!-- Heading -->
            <h1 class="text-4xl md:text-6xl font-bold mb-4">
              {{ tenant.branding?.businessName || tenant.name }}
            </h1>

            <!-- Tagline -->
            <p
              v-if="tenant.branding?.tagline"
              class="text-xl md:text-2xl text-orange-100 mb-6"
            >
              {{ tenant.branding.tagline }}
            </p>

            <!-- Description -->
            <p
              v-if="tenant.description"
              class="text-lg text-white/90 mb-8 max-w-2xl"
            >
              {{ tenant.description }}
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <UButton
                :to="`/book/${tenant.slug}`"
                size="xl"
                color="neutral"
                label="Browse Rentals"
                icon="i-lucide-calendar"
              />
              <UButton
                v-if="tenant.phone"
                :href="`tel:${tenant.phone}`"
                size="xl"
                variant="outline"
                color="neutral"
                :label="formatPhone(tenant.phone)"
                icon="i-lucide-phone"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section
        v-if="tenant.website?.aboutContent"
        class="py-16 bg-white dark:bg-gray-950"
      >
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              About Us
            </h2>
            <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ tenant.website.aboutContent }}
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section
        v-if="tenant.website?.showServices && featuredItems.length > 0"
        class="py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Rentals
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our selection of party equipment and bounce houses
            </p>
          </div>

          <!-- Items Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <NuxtLink
              v-for="item in featuredItems"
              :key="item.id"
              :to="`/book/${tenant.slug}/${item.slug}`"
              class="group"
            >
              <div class="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                <!-- Image -->
                <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    :src="item.images?.[0]?.url || 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop'"
                    :alt="item.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  >
                </div>

                <!-- Content -->
                <div class="p-4">
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                      {{ item.name }}
                    </h3>
                    <span class="text-lg font-bold text-orange-600 dark:text-orange-500 whitespace-nowrap">
                      {{ formatPrice(item.pricing?.fullDayRate || 0) }}
                    </span>
                  </div>

                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- View All Button -->
          <div class="text-center">
            <UButton
              :to="`/book/${tenant.slug}`"
              size="lg"
              label="View All Rentals"
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="py-16 bg-white dark:bg-gray-950">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Get In Touch
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Contact Info -->
              <div class="space-y-6">
                <div
                  v-if="tenant.phone"
                  class="flex items-start gap-4"
                >
                  <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <UIcon
                      name="i-lucide-phone"
                      class="text-orange-600 dark:text-orange-500 text-xl"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Phone
                    </h3>
                    <a
                      :href="`tel:${tenant.phone}`"
                      class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500"
                    >
                      {{ formatPhone(tenant.phone) }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="tenant.email"
                  class="flex items-start gap-4"
                >
                  <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <UIcon
                      name="i-lucide-mail"
                      class="text-orange-600 dark:text-orange-500 text-xl"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <a
                      :href="`mailto:${tenant.email}`"
                      class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500"
                    >
                      {{ tenant.email }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="tenant.address"
                  class="flex items-start gap-4"
                >
                  <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <UIcon
                      name="i-lucide-map-pin"
                      class="text-orange-600 dark:text-orange-500 text-xl"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Address
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      <span v-if="tenant.address.street">{{ tenant.address.street }}<br></span>
                      <span v-if="tenant.address.city || tenant.address.state">
                        {{ tenant.address.city }}<span v-if="tenant.address.city && tenant.address.state">, </span>{{ tenant.address.state }} {{ tenant.address.zip }}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  v-if="tenant.serviceArea"
                  class="flex items-start gap-4"
                >
                  <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <UIcon
                      name="i-lucide-truck"
                      class="text-orange-600 dark:text-orange-500 text-xl"
                    />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      Service Area
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      Within {{ tenant.serviceArea.radius }} {{ tenant.serviceArea.unit }} radius
                    </p>
                  </div>
                </div>
              </div>

              <!-- Business Hours -->
              <div v-if="businessHours.length > 0">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
                  Business Hours
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="day in businessHours"
                    :key="day.day"
                    class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800"
                  >
                    <span class="text-gray-700 dark:text-gray-300">{{ day.day }}</span>
                    <span class="text-gray-600 dark:text-gray-400">{{ day.open }} - {{ day.close }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book?
          </h2>
          <p class="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Browse our inventory and book your party equipment online in minutes
          </p>
          <UButton
            :to="`/book/${tenant.slug}`"
            size="xl"
            color="neutral"
            label="Start Booking"
            trailing-icon="i-lucide-arrow-right"
          />
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 bg-gray-900 text-gray-400">
        <div class="container mx-auto px-4">
          <div class="text-center">
            <p class="text-sm">
              &copy; {{ new Date().getFullYear() }} {{ tenant.branding?.businessName || tenant.name }}. All rights reserved.
            </p>
            <p class="text-xs mt-2">
              Powered by <a
                href="/"
                class="text-orange-500 hover:text-orange-400"
              >BouncePro</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Apply theme colors */
:deep(.bg-primary) {
  background-color: var(--primary-color);
}

:deep(.text-primary) {
  color: var(--primary-color);
}

:deep(.border-primary) {
  border-color: var(--primary-color);
}
</style>
