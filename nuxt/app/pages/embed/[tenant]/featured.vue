<script setup lang="ts">
import type { PublicTenant, PublicRentalItem } from '~/composables/usePublicBooking'

/**
 * Embeddable Featured Products Widget
 *
 * URL: /embed/{tenant}/featured
 *
 * Query parameters:
 * - limit: Number of featured items (default: 6)
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - layout: 'grid' | 'carousel' (default: 'grid')
 * - columns: Number of columns for grid (2-4, default: 3)
 * - showPrice: Show prices (true/false, default: true)
 * - showDescription: Show descriptions (true/false, default: true)
 * - cta: Custom call-to-action text (default: 'Book Now')
 */
definePageMeta({
  layout: 'embed'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string

// Query params
const maxItems = computed(() => parseInt(route.query.limit as string) || 6)
const theme = computed(() => (route.query.theme as string) || 'auto')
const layout = computed(() => (route.query.layout as string) || 'grid')
const columns = computed(() => Math.min(4, Math.max(2, parseInt(route.query.columns as string) || 3)))
const showPrice = computed(() => route.query.showPrice !== 'false')
const showDescription = computed(() => route.query.showDescription !== 'false')
const ctaText = computed(() => (route.query.cta as string) || 'Book Now')

// Apply theme
onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme.value === 'light') {
    document.documentElement.classList.remove('dark')
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
  capacity: number
  ageRange: string
}>>([])
const loading = ref(true)
const error = ref<string | null>(null)

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

    const { items: loadedItems } = await loadItems(loadedTenant.id as string)

    // Filter to featured items (for now we just take first N items since PublicRentalItem doesn't have tags)
    // and limit
    items.value = loadedItems
      .slice(0, maxItems.value)
      .map((item: PublicRentalItem) => ({
        id: String(item.id),
        name: String(item.name || ''),
        slug: String(item.slug || ''),
        description: String(item.description || ''),
        price: item.pricing?.fullDayRate || 0,
        image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop',
        category: String(item.category || ''),
        capacity: item.specifications?.capacity || 0,
        ageRange: String(item.specifications?.ageRange || 'All ages')
      }))
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = 'Failed to load featured items'
  } finally {
    loading.value = false
  }
})

// Handle item click
function handleItemClick(item: typeof items.value[0]) {
  // Post message to parent for embedded context
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'bh-widget-item-click',
      tenantSlug,
      item: {
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price
      }
    }, '*')
  }
  // Also navigate to the item page
  navigateTo(`/book/${tenantSlug}/${item.slug}`)
}

// Format price
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Grid columns class
const gridColsClass = computed(() => {
  const colsMap: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }
  return colsMap[columns.value] || colsMap[3]
})
</script>

<template>
  <div class="embed-featured p-4 bg-white dark:bg-gray-900 min-h-screen">
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
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center gap-2 mb-6">
        <UIcon
          name="i-lucide-star"
          class="w-6 h-6 text-orange-600"
        />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Featured Rentals
        </h1>
      </div>

      <!-- Grid Layout -->
      <div
        v-if="layout === 'grid'"
        :class="['grid gap-6', gridColsClass]"
      >
        <button
          v-for="item in items"
          :key="item.id"
          class="group text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all"
          @click="handleItemClick(item)"
        >
          <!-- Image -->
          <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute top-3 left-3">
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded shadow-lg">
                <UIcon
                  name="i-lucide-star"
                  class="w-3 h-3"
                />
                Featured
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
              {{ item.name }}
            </h3>

            <p
              v-if="showDescription"
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
            >
              {{ item.description }}
            </p>

            <div class="flex items-center justify-between">
              <div>
                <span
                  v-if="showPrice"
                  class="text-xl font-bold text-orange-600 dark:text-orange-500"
                >
                  {{ formatPrice(item.price) }}
                </span>
                <span
                  v-if="showPrice"
                  class="text-sm text-gray-500 dark:text-gray-400"
                >/day</span>
              </div>

              <span class="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:gap-2 transition-all">
                {{ ctaText }}
                <UIcon
                  name="i-lucide-arrow-right"
                  class="w-4 h-4"
                />
              </span>
            </div>
          </div>
        </button>
      </div>

      <!-- Carousel Layout -->
      <div
        v-else-if="layout === 'carousel'"
        class="overflow-x-auto pb-4 -mx-4 px-4"
      >
        <div
          class="flex gap-6"
          style="min-width: max-content;"
        >
          <button
            v-for="item in items"
            :key="item.id"
            class="group flex-shrink-0 w-80 text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all"
            @click="handleItemClick(item)"
          >
            <!-- Image -->
            <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div class="absolute top-3 left-3">
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded shadow-lg">
                  <UIcon
                    name="i-lucide-star"
                    class="w-3 h-3"
                  />
                  Featured
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
                {{ item.name }}
              </h3>

              <p
                v-if="showDescription"
                class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
              >
                {{ item.description }}
              </p>

              <div class="flex items-center justify-between">
                <div>
                  <span
                    v-if="showPrice"
                    class="text-xl font-bold text-orange-600 dark:text-orange-500"
                  >
                    {{ formatPrice(item.price) }}
                  </span>
                  <span
                    v-if="showPrice"
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >/day</span>
                </div>

                <span class="inline-flex items-center gap-1 text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:gap-2 transition-all">
                  {{ ctaText }}
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="w-4 h-4"
                  />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="items.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-star-off"
          class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          No featured items available.
        </p>
      </div>

      <!-- View All Link -->
      <div
        v-if="items.length > 0"
        class="mt-6 text-center"
      >
        <NuxtLink
          :to="`/book/${tenantSlug}`"
          class="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:underline font-medium"
        >
          View All Rentals
          <UIcon
            name="i-lucide-arrow-right"
            class="w-4 h-4"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embed-featured {
  font-family: system-ui, -apple-system, sans-serif;
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
