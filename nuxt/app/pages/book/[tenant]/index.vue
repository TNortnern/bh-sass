<script setup lang="ts">
definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string

// Mock rental items data - in production, this would be fetched from API
const items = ref([
  {
    id: '1',
    name: 'Princess Castle',
    slug: 'princess-castle',
    description: 'Perfect for little princesses! This beautiful pink castle features turrets, a slide, and plenty of bouncing space.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=400&h=300&fit=crop',
    category: 'Bounce Houses',
    capacity: 8,
    ageRange: '3-12',
    featured: true
  },
  {
    id: '2',
    name: 'Superhero Combo',
    slug: 'superhero-combo',
    description: 'Action-packed combo with bounce area, basketball hoop, and climb & slide. Great for active kids!',
    price: 249,
    image: 'https://images.unsplash.com/photo-1587731556938-38755d4d7de2?w=400&h=300&fit=crop',
    category: 'Combo Units',
    capacity: 10,
    ageRange: '5-14',
    featured: true
  },
  {
    id: '3',
    name: 'Tropical Water Slide',
    slug: 'tropical-water-slide',
    description: 'Beat the heat with this amazing tropical-themed water slide. Includes splash pool at the bottom.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop',
    category: 'Water Slides',
    capacity: 6,
    ageRange: '6-16',
    featured: true
  },
  {
    id: '4',
    name: 'Obstacle Course',
    slug: 'obstacle-course',
    description: 'Challenge your guests with this exciting obstacle course featuring tunnels, pop-ups, and climbing walls.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=300&fit=crop',
    category: 'Obstacle Courses',
    capacity: 8,
    ageRange: '7-16',
    featured: false
  },
  {
    id: '5',
    name: 'Unicorn Bounce House',
    slug: 'unicorn-bounce-house',
    description: 'Magical unicorn-themed bounce house with rainbow colors. Perfect for unicorn-loving kids!',
    price: 189,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
    category: 'Bounce Houses',
    capacity: 8,
    ageRange: '3-12',
    featured: false
  },
  {
    id: '6',
    name: 'Sports Arena',
    slug: 'sports-arena',
    description: 'Multi-sport inflatable with basketball, soccer, and baseball. Great for sports-themed parties!',
    price: 229,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    category: 'Interactive',
    capacity: 10,
    ageRange: '6-16',
    featured: false
  }
])

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(items.value.map(item => item.category))
  return ['All', ...Array.from(cats)]
})

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
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
</script>

<template>
  <div>
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
            <UIcon name="lucide:shield-check" class="w-5 h-5" />
            <span>Fully Insured</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="lucide:truck" class="w-5 h-5" />
            <span>Free Delivery</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="lucide:sparkles" class="w-5 h-5" />
            <span>Clean & Sanitized</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            icon="lucide:search"
            size="lg"
            placeholder="Search for bounce houses, water slides..."
          />
        </div>

        <!-- Category Filter -->
        <USelect
          v-model="selectedCategory"
          :options="categories"
          size="lg"
          icon="lucide:filter"
          class="w-full md:w-64"
        />
      </div>
    </div>

    <!-- Featured Items -->
    <div v-if="featuredItems.length > 0 && selectedCategory === 'All' && !searchQuery" class="mb-12">
      <div class="flex items-center gap-2 mb-6">
        <UIcon name="lucide:star" class="w-6 h-6 text-orange-600 dark:text-orange-500" />
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
              <div class="absolute top-3 right-3">
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-semibold rounded">
                  <UIcon name="lucide:star" class="w-3 h-3" />
                  Featured
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
                  <UIcon name="lucide:users" class="w-4 h-4" />
                  <span>Up to {{ item.capacity }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="lucide:calendar" class="w-4 h-4" />
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
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ selectedCategory === 'All' ? 'More Rentals' : selectedCategory }}
      </h2>

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
                  <UIcon name="lucide:users" class="w-4 h-4" />
                  <span>Up to {{ item.capacity }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="lucide:calendar" class="w-4 h-4" />
                  <span>Ages {{ item.ageRange }}</span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- No Results -->
    <div v-if="filteredItems.length === 0" class="text-center py-12">
      <UIcon name="lucide:search" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No items found
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Try adjusting your search or filters
      </p>
      <UButton
        label="Clear Filters"
        @click="() => { searchQuery = ''; selectedCategory = 'All' }"
      />
    </div>
  </div>
</template>
