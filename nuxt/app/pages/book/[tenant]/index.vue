<script setup lang="ts">
definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string

const { loadTenant, loadItems, checkAvailability, loading, error } = usePublicBooking()

// Load tenant and items on mount
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tenantData = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categories = ref<any[]>([])
const loadingCategories = ref(false)
const availabilityMap = ref<Record<string, boolean>>({})
const checkingAvailability = ref(false)

onMounted(async () => {
  // Load tenant first
  const loadedTenant = await loadTenant(tenantSlug)

  if (!loadedTenant) {
    // Tenant not found - redirect to 404 or show error
    router.push('/404')
    return
  }

  tenantData.value = loadedTenant

  // Load items and categories in parallel
  const [loadedItems, loadedCategories] = await Promise.all([
    loadItems(loadedTenant.id),
    fetchCategories(loadedTenant.id)
  ])

  // Map items to display format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items.value = loadedItems.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: item.pricing?.fullDayRate || 0,
    image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop',
    category: item.category,
    categoryId: item.categoryId,
    capacity: item.specifications?.capacity || 0,
    ageRange: item.specifications?.ageRange || 'All ages',
    featured: item.tags?.includes('featured') || false
  }))

  categories.value = loadedCategories
})

// Fetch categories from Payload API
async function fetchCategories(tenantId: string) {
  loadingCategories.value = true
  try {
    const config = useRuntimeConfig()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<{ docs: any[] }>(`${config.public.payloadUrl}/api/categories`, {
      params: {
        'where[tenantId][equals]': tenantId,
        'where[isActive][equals]': true,
        'sort': 'sortOrder',
        'limit': 100
      }
    })
    return response?.docs || []
  } catch (err) {
    console.error('Failed to fetch categories:', err)
    return []
  } finally {
    loadingCategories.value = false
  }
}

// Filter state
const searchQuery = ref('')
const selectedCategory = ref('all')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const selectedDate = ref<string>('')
const sortBy = ref('name')

// Category items for USelect
const categoryItems = computed(() => {
  const items = [{ label: 'All Categories', value: 'all' }]

  categories.value.forEach((cat) => {
    items.push({
      label: cat.name,
      value: cat.id
    })
  })

  return items
})

// Sort options
const sortItems = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Price (High to Low)', value: 'price-desc' },
  { label: 'Popular First', value: 'popular' }
]

// Price range computed
const priceRange = computed(() => {
  if (items.value.length === 0) return { min: 0, max: 1000 }

  const prices = items.value.map(item => item.price).filter(p => p > 0)
  if (prices.length === 0) return { min: 0, max: 1000 }

  return {
    min: Math.floor(Math.min(...prices) / 10) * 10,
    max: Math.ceil(Math.max(...prices) / 10) * 10
  }
})

// Filtered and sorted items
const filteredItems = computed(() => {
  const result = items.value.filter((item) => {
    // Search filter
    const matchesSearch = !searchQuery.value
      || item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || item.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory.value === 'all'
      || item.categoryId === selectedCategory.value

    // Price range filter
    const matchesMinPrice = minPrice.value === null || item.price >= minPrice.value
    const matchesMaxPrice = maxPrice.value === null || item.price <= maxPrice.value

    // Date availability filter - uses availability map when date is selected
    const matchesDate = !selectedDate.value
      || !Object.keys(availabilityMap.value).length
      || availabilityMap.value[item.id] !== false

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesDate
  })

  // Sort items
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'name-desc') {
    result.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortBy.value === 'price') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }

  return result
})

const featuredItems = computed(() => {
  return filteredItems.value.filter(item => item.featured)
})

const regularItems = computed(() => {
  return filteredItems.value.filter(item => !item.featured)
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Check availability for all items on a specific date
async function checkAllAvailability(date: string) {
  if (!date || !items.value.length) {
    availabilityMap.value = {}
    return
  }

  checkingAvailability.value = true
  const newAvailabilityMap: Record<string, boolean> = {}

  try {
    // Check availability for each item in parallel
    const promises = items.value.map(async (item) => {
      try {
        const result = await checkAvailability(item.id, date, date)
        newAvailabilityMap[item.id] = result.available
      } catch {
        // If check fails, assume available
        newAvailabilityMap[item.id] = true
      }
    })

    await Promise.all(promises)
    availabilityMap.value = newAvailabilityMap
  } finally {
    checkingAvailability.value = false
  }
}

// Watch for date changes to check availability
watch(selectedDate, async (newDate) => {
  if (newDate) {
    await checkAllAvailability(newDate)
  } else {
    availabilityMap.value = {}
  }
})

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  minPrice.value = null
  maxPrice.value = null
  selectedDate.value = ''
  sortBy.value = 'name'
  availabilityMap.value = {}
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedCategory.value !== 'all') count++
  if (minPrice.value !== null) count++
  if (maxPrice.value !== null) count++
  if (selectedDate.value) count++
  return count
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-16"
    >
      <div class="text-center">
        <UIcon
          name="lucide:loader-circle"
          class="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Loading rentals...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-16"
    >
      <UIcon
        name="lucide:alert-circle"
        class="w-16 h-16 text-red-600 mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <UButton @click="() => router.go(0)">
        Try Again
      </UButton>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 md:p-12 mb-8 text-white">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Book Your Party Equipment
          </h1>
          <p class="text-xl text-orange-100 mb-6">
            Browse our selection of bounce houses, water slides, and party rentals. Easy online booking with instant confirmation.
          </p>
          <div class="flex flex-wrap gap-4 text-sm">
            <div class="flex items-center gap-2">
              <UIcon
                name="lucide:shield-check"
                class="w-5 h-5"
              />
              <span>Fully Insured</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                name="lucide:truck"
                class="w-5 h-5"
              />
              <span>Free Delivery</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                name="lucide:sparkles"
                class="w-5 h-5"
              />
              <span>Clean & Sanitized</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="mb-8 space-y-4">
        <!-- Main Search Bar -->
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              size="lg"
              placeholder="Search for bounce houses, water slides..."
            />
          </div>

          <!-- Sort -->
          <USelect
            v-model="sortBy"
            :items="sortItems"
            size="lg"
            icon="i-lucide-arrow-up-down"
            class="w-full md:w-56"
          />
        </div>

        <!-- Category Chips for Quick Filtering -->
        <div
          v-if="categories.length > 0"
          class="flex flex-wrap gap-2"
        >
          <button
            v-for="cat in [{ id: 'all', name: 'All' }, ...categories]"
            :key="cat.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            ]"
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }}
            <span
              v-if="cat.id !== 'all'"
              class="ml-1 text-xs opacity-75"
            >
              ({{ items.filter((i: any) => i.categoryId === cat.id).length }})
            </span>
          </button>
        </div>

        <!-- Advanced Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Category Filter -->
          <UFormField label="Category">
            <USelect
              v-model="selectedCategory"
              :items="categoryItems"
              icon="i-lucide-filter"
              class="w-full"
            />
          </UFormField>

          <!-- Price Range - Min -->
          <UFormField label="Min Price">
            <UInput
              v-model.number="minPrice"
              type="number"
              :min="priceRange.min"
              :max="priceRange.max"
              :placeholder="`$${priceRange.min}`"
              icon="i-lucide-dollar-sign"
              class="w-full"
            />
          </UFormField>

          <!-- Price Range - Max -->
          <UFormField label="Max Price">
            <UInput
              v-model.number="maxPrice"
              type="number"
              :min="priceRange.min"
              :max="priceRange.max"
              :placeholder="`$${priceRange.max}`"
              icon="i-lucide-dollar-sign"
              class="w-full"
            />
          </UFormField>

          <!-- Date Filter -->
          <UFormField label="Availability Date">
            <div class="relative">
              <UInput
                v-model="selectedDate"
                type="date"
                icon="i-lucide-calendar"
                class="w-full"
                placeholder="Check availability"
                :min="new Date().toISOString().split('T')[0]"
              />
              <div
                v-if="checkingAvailability"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <UIcon
                  name="i-lucide-loader-circle"
                  class="w-4 h-4 text-orange-600 animate-spin"
                />
              </div>
            </div>
          </UFormField>
        </div>

        <!-- Availability Status -->
        <div
          v-if="selectedDate && Object.keys(availabilityMap).length > 0"
          class="flex items-center gap-4 text-sm px-1"
        >
          <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
            <UIcon
              name="i-lucide-check-circle"
              class="w-4 h-4"
            />
            <span>{{ Object.values(availabilityMap).filter(v => v).length }} available</span>
          </div>
          <div
            v-if="Object.values(availabilityMap).filter(v => !v).length > 0"
            class="flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <UIcon
              name="i-lucide-x-circle"
              class="w-4 h-4"
            />
            <span>{{ Object.values(availabilityMap).filter(v => !v).length }} booked</span>
          </div>
        </div>

        <!-- Active Filters & Clear -->
        <div
          v-if="activeFiltersCount > 0"
          class="flex items-center gap-3 text-sm"
        >
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon
              name="i-lucide-filter"
              class="w-4 h-4"
            />
            <span>{{ activeFiltersCount }} filter{{ activeFiltersCount > 1 ? 's' : '' }} active</span>
          </div>
          <UButton
            label="Clear All"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="clearFilters"
          />
        </div>
      </div>

      <!-- Featured Items -->
      <div
        v-if="featuredItems.length > 0 && selectedCategory === 'all' && !searchQuery && activeFiltersCount === 0"
        class="mb-12"
      >
        <div class="flex items-center gap-2 mb-6">
          <UIcon
            name="lucide:star"
            class="w-6 h-6 text-orange-600 dark:text-orange-500"
          />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Rentals
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in featuredItems"
            :key="item.id"
            :to="`/book/${tenantSlug}/${item.slug}`"
            class="group"
          >
            <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Image -->
              <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <div class="absolute top-3 right-3 flex flex-col gap-2">
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                    <UIcon
                      name="lucide:star"
                      class="w-3 h-3"
                    />
                    Featured
                  </span>
                  <!-- Availability Badge -->
                  <span
                    v-if="selectedDate && availabilityMap[item.id] !== undefined"
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded',
                      availabilityMap[item.id]
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    ]"
                  >
                    <UIcon
                      :name="availabilityMap[item.id] ? 'lucide:check' : 'lucide:x'"
                      class="w-3 h-3"
                    />
                    {{ availabilityMap[item.id] ? 'Available' : 'Booked' }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-4">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                    {{ item.name }}
                  </h3>
                  <span class="text-lg font-bold text-orange-600 dark:text-orange-500 whitespace-nowrap">
                    {{ formatPrice(item.price) }}/day
                  </span>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {{ item.description }}
                </p>

                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="lucide:users"
                      class="w-4 h-4"
                    />
                    <span>Up to {{ item.capacity }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="lucide:calendar"
                      class="w-4 h-4"
                    />
                    <span>Ages {{ item.ageRange }}</span>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- All Items -->
      <div v-if="regularItems.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ selectedCategory === 'all' ? 'All Rentals' : categoryItems.find((c: any) => c.value === selectedCategory)?.label }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ filteredItems.length }} {{ filteredItems.length === 1 ? 'item' : 'items' }} found
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="item in regularItems"
            :key="item.id"
            :to="`/book/${tenantSlug}/${item.slug}`"
            class="group"
          >
            <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Image -->
              <div class="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                <!-- Availability Badge -->
                <div
                  v-if="selectedDate && availabilityMap[item.id] !== undefined"
                  class="absolute top-3 right-3"
                >
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded',
                      availabilityMap[item.id]
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    ]"
                  >
                    <UIcon
                      :name="availabilityMap[item.id] ? 'lucide:check' : 'lucide:x'"
                      class="w-3 h-3"
                    />
                    {{ availabilityMap[item.id] ? 'Available' : 'Booked' }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-4">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                    {{ item.name }}
                  </h3>
                  <span class="text-lg font-bold text-orange-600 dark:text-orange-500 whitespace-nowrap">
                    {{ formatPrice(item.price) }}/day
                  </span>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {{ item.description }}
                </p>

                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="lucide:users"
                      class="w-4 h-4"
                    />
                    <span>Up to {{ item.capacity }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="lucide:calendar"
                      class="w-4 h-4"
                    />
                    <span>Ages {{ item.ageRange }}</span>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="filteredItems.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="lucide:search"
          class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4"
        />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your search or filters
        </p>
        <UButton
          label="Clear Filters"
          @click="clearFilters"
        />
      </div>
    </div>
  </div>
</template>
