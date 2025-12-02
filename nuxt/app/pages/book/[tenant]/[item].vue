<script setup lang="ts">
import type { DateRange } from '~/composables/useBookingFlow'

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string
const itemSlug = route.params.item as string

const { addItem } = useCart()

// Mock item data - in production, this would be fetched from API
const item = ref({
  id: '1',
  name: 'Princess Castle',
  slug: 'princess-castle',
  description: 'Perfect for little princesses! This beautiful pink castle features turrets, a slide, and plenty of bouncing space. Made with commercial-grade vinyl and includes safety netting on all sides.',
  longDescription: 'Transform your backyard into a magical kingdom with our Princess Castle bounce house. This enchanting inflatable features beautiful pink and purple colors, castle turrets, and a fun slide. The spacious bouncing area can accommodate up to 8 children at once, making it perfect for birthday parties and special events. Safety is our top priority - the castle includes reinforced netting on all sides, secure entrance steps, and is made from commercial-grade, fire-resistant vinyl.',
  price: 199,
  images: [
    'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop'
  ],
  category: 'Bounce Houses',
  capacity: 8,
  ageRange: '3-12 years',
  dimensions: '15ft x 15ft x 12ft',
  setupSpace: '18ft x 18ft',
  powerRequired: '1 standard 110v outlet',
  features: [
    'Large bouncing area',
    'Built-in slide',
    'Safety netting on all sides',
    'Princess castle theme with turrets',
    'Commercial-grade vinyl',
    'Fire-resistant materials'
  ]
})

// Mock add-ons
const addOns = ref([
  {
    id: 'addon-1',
    name: 'Cotton Candy Machine',
    description: 'Make fluffy cotton candy for your guests',
    price: 49,
    selected: false
  },
  {
    id: 'addon-2',
    name: 'Popcorn Machine',
    description: 'Movie theater style popcorn maker',
    price: 39,
    selected: false
  },
  {
    id: 'addon-3',
    name: 'Table & Chairs Set',
    description: '6ft table with 8 folding chairs',
    price: 29,
    selected: false
  },
  {
    id: 'addon-4',
    name: 'Generator',
    description: 'Backup power supply if outlet not available',
    price: 75,
    selected: false
  }
])

// Mock unavailable dates
const unavailableDates = ref([
  '2025-12-05',
  '2025-12-06',
  '2025-12-12',
  '2025-12-13',
  '2025-12-25',
  '2025-12-26'
])

const selectedDates = ref<DateRange | null>(null)
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
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <NuxtLink :to="`/book/${tenantSlug}`" class="hover:text-orange-600 dark:hover:text-orange-400">
        Rentals
      </NuxtLink>
      <UIcon name="lucide:chevron-right" class="w-4 h-4" />
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
              <img :src="image" :alt="`${item.name} ${index + 1}`" class="w-full h-full object-cover">
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
              <UIcon name="lucide:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
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
              <div class="text-sm text-gray-600 dark:text-gray-400">Capacity</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.capacity }} children</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Age Range</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.ageRange }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Dimensions</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.dimensions }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Setup Space</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.setupSpace }}</div>
            </div>
            <div class="md:col-span-2">
              <div class="text-sm text-gray-600 dark:text-gray-400">Power Required</div>
              <div class="font-medium text-gray-900 dark:text-white">{{ item.powerRequired }}</div>
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

          <p v-if="!canAddToCart" class="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            Select dates to continue
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
