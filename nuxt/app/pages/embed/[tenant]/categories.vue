<script setup lang="ts">
import type { PublicTenant, PublicRentalItem } from '~/composables/usePublicBooking'

/**
 * Embeddable Categories Widget
 *
 * URL: /embed/{tenant}/categories
 *
 * Query parameters:
 * - featured: Show only featured categories (true/false)
 * - limit: Max categories to show (default: all)
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - layout: 'grid' | 'list' | 'carousel' (default: 'grid')
 * - columns: Number of columns for grid (2-6, default: 3)
 * - onClick: 'embed' | 'book' | 'custom' - where clicks navigate
 *   - 'embed': Opens products widget filtered by category
 *   - 'book': Opens full booking page filtered by category
 *   - 'custom': Posts message to parent with category ID
 */
definePageMeta({
  layout: 'embed'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string

// Query params
const featuredOnly = computed(() => route.query.featured === 'true')
const maxCategories = computed(() => parseInt(route.query.limit as string) || 0)
const theme = computed(() => (route.query.theme as string) || 'auto')
const layout = computed(() => (route.query.layout as string) || 'grid')
const columns = computed(() => Math.min(6, Math.max(2, parseInt(route.query.columns as string) || 3)))
const onClick = computed(() => (route.query.onClick as string) || 'book')

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
const categories = ref<Array<{
  id: string
  name: string
  description: string
  image: string
  itemCount: number
  featured: boolean
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

    // Fetch categories and items in parallel
    const [loadedCategories, loadedItems] = await Promise.all([
      fetchCategories(loadedTenant.id as string),
      loadItems(loadedTenant.id as string)
    ])

    // Count items per category
    const categoryItemCounts: Record<string, number> = {}
    loadedItems.forEach((item: PublicRentalItem) => {
      const catId = String(item.category || '')
      if (catId) {
        categoryItemCounts[catId] = (categoryItemCounts[catId] || 0) + 1
      }
    })

    categories.value = loadedCategories.map((cat: Record<string, unknown>) => ({
      id: String(cat.id),
      name: String(cat.name || ''),
      description: String(cat.description || ''),
      image: String((cat.image as { url?: string })?.url || 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop'),
      itemCount: categoryItemCounts[String(cat.id)] || 0,
      featured: Boolean(cat.featured)
    }))
  } catch (err) {
    console.error('Failed to load categories:', err)
    error.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
})

// Fetch categories from API
async function fetchCategories(tenantId: string) {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ docs: Array<Record<string, unknown>> }>(`${config.public.payloadUrl}/api/categories`, {
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

// Filtered categories
const displayedCategories = computed(() => {
  let result = [...categories.value]

  // Featured filter
  if (featuredOnly.value) {
    result = result.filter(cat => cat.featured)
  }

  // Limit
  if (maxCategories.value > 0) {
    result = result.slice(0, maxCategories.value)
  }

  return result
})

// Handle category click
function handleCategoryClick(category: typeof categories.value[0]) {
  if (onClick.value === 'embed') {
    // Navigate to products widget filtered by category
    navigateTo(`/embed/${tenantSlug}/products?category=${category.id}`)
  } else if (onClick.value === 'book') {
    // Navigate to full booking page filtered by category
    navigateTo(`/book/${tenantSlug}?category=${category.id}`)
  } else {
    // Post message to parent window
    window.parent.postMessage({
      type: 'bh-widget-category-click',
      tenantSlug,
      category: {
        id: category.id,
        name: category.name,
        itemCount: category.itemCount
      }
    }, '*')
  }
}

// Grid columns class
const gridColsClass = computed(() => {
  const colsMap: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  }
  return colsMap[columns.value] || colsMap[3]
})
</script>

<template>
  <div class="embed-categories p-4 bg-white dark:bg-gray-900 min-h-screen">
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
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ featuredOnly ? 'Featured Categories' : 'Browse Categories' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ displayedCategories.length }} categories available
        </p>
      </div>

      <!-- Grid Layout -->
      <div
        v-if="layout === 'grid'"
        :class="['grid gap-4', gridColsClass]"
      >
        <button
          v-for="category in displayedCategories"
          :key="category.id"
          class="group text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
          @click="handleCategoryClick(category)"
        >
          <!-- Image -->
          <div class="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-lg font-bold text-white">
                {{ category.name }}
              </h3>
              <p class="text-sm text-white/80">
                {{ category.itemCount }} {{ category.itemCount === 1 ? 'item' : 'items' }}
              </p>
            </div>
            <div
              v-if="category.featured"
              class="absolute top-2 right-2"
            >
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                <UIcon
                  name="i-lucide-star"
                  class="w-3 h-3"
                />
                Featured
              </span>
            </div>
          </div>
        </button>
      </div>

      <!-- List Layout -->
      <div
        v-else-if="layout === 'list'"
        class="space-y-3"
      >
        <button
          v-for="category in displayedCategories"
          :key="category.id"
          class="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
          @click="handleCategoryClick(category)"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="w-20 h-20 rounded-lg object-cover"
          >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ category.name }}
              </h3>
              <span
                v-if="category.featured"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded"
              >
                <UIcon
                  name="i-lucide-star"
                  class="w-3 h-3"
                />
                Featured
              </span>
            </div>
            <p
              v-if="category.description"
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1"
            >
              {{ category.description }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {{ category.itemCount }} {{ category.itemCount === 1 ? 'item' : 'items' }} available
            </p>
          </div>
          <UIcon
            name="i-lucide-chevron-right"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </div>

      <!-- Carousel Layout -->
      <div
        v-else-if="layout === 'carousel'"
        class="overflow-x-auto pb-4 -mx-4 px-4"
      >
        <div
          class="flex gap-4"
          style="min-width: max-content;"
        >
          <button
            v-for="category in displayedCategories"
            :key="category.id"
            class="group flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all text-left"
            @click="handleCategoryClick(category)"
          >
            <!-- Image -->
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-lg font-bold text-white">
                  {{ category.name }}
                </h3>
                <p class="text-sm text-white/80">
                  {{ category.itemCount }} {{ category.itemCount === 1 ? 'item' : 'items' }}
                </p>
              </div>
              <div
                v-if="category.featured"
                class="absolute top-2 right-2"
              >
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                  <UIcon
                    name="i-lucide-star"
                    class="w-3 h-3"
                  />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="displayedCategories.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-folder-open"
          class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          No categories available.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embed-categories {
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
