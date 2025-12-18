<script setup lang="ts">
import type { BookingDateRange } from '~/composables/useBookingFlow'

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string
const itemSlug = route.params.item as string

const { addItem } = useCart()
const { loadTenant, loadItems, loadAddOns, loading, error: _error } = usePublicBooking()

// Item and add-ons data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const item = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addOns = ref<any[]>([])
const unavailableDates = ref<string[]>([])

// Load item and add-ons on mount
onMounted(async () => {
  // Load tenant first
  const loadedTenant = await loadTenant(tenantSlug)

  if (!loadedTenant) {
    router.push('/404')
    return
  }

  // Load all items for this tenant
  const { items: loadedItems } = await loadItems(loadedTenant.id)

  // Find the specific item by slug
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const foundItem = loadedItems.find((i: any) => i.slug === itemSlug)

  if (!foundItem) {
    router.push(`/book/${tenantSlug}`)
    return
  }

  // Map item to display format
  item.value = {
    id: foundItem.id,
    name: foundItem.name,
    slug: foundItem.slug,
    description: foundItem.description,
    longDescription: foundItem.description, // Use description as long description
    price: foundItem.pricing?.fullDayRate || 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: foundItem.images?.map((img: any) => img.url) || [
      'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=800&h=600&fit=crop'
    ],
    category: foundItem.category || 'Bounce Houses',
    capacity: foundItem.specifications?.capacity || 0,
    ageRange: foundItem.specifications?.ageRange || 'All ages',
    dimensions: foundItem.specifications?.dimensions
      ? `${foundItem.specifications.dimensions.length}ft x ${foundItem.specifications.dimensions.width}ft x ${foundItem.specifications.dimensions.height}ft`
      : 'Standard size',
    setupSpace: foundItem.specifications?.requiredSpace || 'Contact for details',
    powerRequired: foundItem.specifications?.powerRequired ? '1 standard 110v outlet' : 'No power required',
    features: [
      'Professionally cleaned and sanitized',
      'Commercial-grade materials',
      'Safety netting and secure entrance',
      'Delivered and set up by trained staff',
      'Insurance and safety certified'
    ],
    rbPayloadServiceId: foundItem.rbPayloadServiceId
  }

  // Load add-ons
  const loadedAddOns = await loadAddOns(loadedTenant.id)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addOns.value = loadedAddOns.map((addOn: any) => ({
    id: addOn.id,
    name: addOn.name,
    description: addOn.description,
    price: addOn.price,
    selected: false
  }))

  // Load unavailable dates from availability API
  try {
    const availabilityData = await $fetch<{ unavailableDates: string[] }>(
      `/public/items/${foundItem.id}/unavailable-dates`
    )
    unavailableDates.value = availabilityData.unavailableDates || []
  } catch (e) {
    console.error('Failed to load unavailable dates:', e)
    unavailableDates.value = []
  }
})

const selectedDates = ref<BookingDateRange | null>(null)
const selectedImage = ref(0)
const quantity = ref(1)

const selectedAddOns = computed(() => addOns.value.filter(a => a.selected))

const calculateDays = (start: string, end: string): number => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

const totalPrice = computed(() => {
  if (!selectedDates.value) return item.value.price

  const days = calculateDays(selectedDates.value.start, selectedDates.value.end)
  const basePrice = item.value.price * days * quantity.value
  const addOnsPrice = selectedAddOns.value.reduce((sum, a) => sum + a.price, 0) * days * quantity.value

  return basePrice + addOnsPrice
})

const canAddToCart = computed(() => {
  return !!(selectedDates.value && selectedDates.value.start && selectedDates.value.end)
})

const addToCart = () => {
  if (!canAddToCart.value || !selectedDates.value) return

  addItem({
    itemId: item.value.id,
    itemName: item.value.name,
    itemSlug: item.value.slug,
    itemImage: item.value.images[0],
    startDate: selectedDates.value.start,
    endDate: selectedDates.value.end,
    basePrice: item.value.price,
    addOns: selectedAddOns.value.map(a => ({
      id: a.id,
      name: a.name,
      price: a.price
    })),
    quantity: quantity.value
  })

  // Redirect to checkout
  router.push(`/book/${tenantSlug}/checkout`)
}

const bookNow = () => {
  addToCart()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="loading || !item"
      class="flex items-center justify-center py-16"
    >
      <div class="text-center">
        <UIcon
          name="lucide:loader-circle"
          class="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Loading item details...
        </p>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <NuxtLink
          :to="`/book/${tenantSlug}`"
          class="hover:text-orange-600 dark:hover:text-orange-400"
        >
          Rentals
        </NuxtLink>
        <UIcon
          name="lucide:chevron-right"
          class="w-4 h-4"
        />
        <span class="text-gray-900 dark:text-white">{{ item.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Images & Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <!-- Main Image -->
            <div class="aspect-[4/3] bg-gray-100 dark:bg-gray-800">
              <img
                :src="item.images[selectedImage]"
                :alt="item.name"
                class="w-full h-full object-cover"
              >
            </div>

            <!-- Thumbnails -->
            <div class="p-4 flex gap-2">
              <button
                v-for="(image, index) in item.images"
                :key="index"
                type="button"
                class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors"
                :class="selectedImage === index ? 'border-orange-600' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'"
                @click="selectedImage = index"
              >
                <img
                  :src="image"
                  :alt="`${item.name} ${index + 1}`"
                  class="w-full h-full object-cover"
                >
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h2>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {{ item.longDescription }}
            </p>

            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
              Features:
            </h3>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li
                v-for="feature in item.features"
                :key="feature"
                class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <UIcon
                  name="lucide:check"
                  class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Specifications -->
          <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Specifications
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Capacity
                </div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ item.capacity }} children
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Age Range
                </div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ item.ageRange }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Dimensions
                </div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ item.dimensions }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Setup Space
                </div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ item.setupSpace }}
                </div>
              </div>
              <div class="md:col-span-2">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Power Required
                </div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ item.powerRequired }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Booking -->
        <div class="space-y-6">
          <!-- Pricing Card -->
          <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-20">
            <div class="mb-6">
              <div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {{ formatCurrency(item.price) }}
                <span class="text-lg font-normal text-gray-600 dark:text-gray-400">/day</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Additional days available at discounted rates
              </p>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <UInput
                v-model.number="quantity"
                type="number"
                :min="1"
                :max="5"
                size="lg"
              />
            </div>

            <!-- Date Picker -->
            <div class="mb-6">
              <BookingDatePicker
                v-model="selectedDates"
                :unavailable-dates="unavailableDates"
              />
            </div>

            <!-- Add-ons -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Add-ons (Optional)
              </h3>
              <div class="space-y-3">
                <div
                  v-for="addOn in addOns"
                  :key="addOn.id"
                  class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <UCheckbox
                    v-model="addOn.selected"
                    :label="addOn.name"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm text-gray-900 dark:text-white">
                      {{ addOn.name }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {{ addOn.description }}
                    </div>
                  </div>
                  <div class="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    +{{ formatCurrency(addOn.price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Estimated Total</span>
                <span class="text-2xl font-bold text-orange-600 dark:text-orange-500">
                  {{ formatCurrency(totalPrice) }}
                </span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Final price includes delivery, setup, and tax
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <UButton
                block
                size="lg"
                :disabled="!canAddToCart"
                @click="bookNow"
              >
                Book Now
              </UButton>
              <UButton
                block
                size="lg"
                color="neutral"
                variant="outline"
                :disabled="!canAddToCart"
                @click="addToCart"
              >
                Add to Cart
              </UButton>
            </div>

            <p
              v-if="!canAddToCart"
              class="text-xs text-center text-gray-500 dark:text-gray-400 mt-3"
            >
              Select dates to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
