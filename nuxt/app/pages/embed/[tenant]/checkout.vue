<script setup lang="ts">
import type { PublicTenant } from '~/composables/usePublicBooking'

/**
 * Embeddable Checkout Widget
 *
 * URL: /embed/{tenant}/checkout
 *
 * Query parameters:
 * - theme: 'light' | 'dark' | 'auto' (default: 'auto')
 * - cart: JSON-encoded cart data (optional, also checks localStorage)
 * - successUrl: URL to redirect after successful payment
 * - cancelUrl: URL to redirect if user cancels
 */
definePageMeta({
  layout: 'embed'
})

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

const route = useRoute()
const tenantSlug = route.params.tenant as string

// PostMessage API for iframe communication
const {
  isEmbedded,
  sendToParent,
  onMessage
} = useEmbedMessaging(tenantSlug, 'checkout')

// Query params
const theme = computed(() => (route.query.theme as string) || 'auto')
const successUrl = computed(() => route.query.successUrl as string || '')
const cancelUrl = computed(() => route.query.cancelUrl as string || '')

// Apply theme
onMounted(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme.value === 'light') {
    document.documentElement.classList.remove('dark')
  }
})

const { loadTenant } = usePublicBooking()
const _config = useRuntimeConfig()

// Data
const tenantData = ref<PublicTenant | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)

// Cart state
const cart = ref<CartItem[]>([])

// Form state
const customer = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const eventDetails = ref({
  date: '',
  endDate: '',
  deliveryTime: '09:00',
  pickupTime: '18:00',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  },
  type: 'birthday',
  specialInstructions: ''
})

// Generate time options (7am - 9pm in 30min increments)
const timeOptions = computed(() => {
  const options = []
  for (let hour = 7; hour <= 21; hour++) {
    for (const min of [0, 30]) {
      const h = hour.toString().padStart(2, '0')
      const m = min.toString().padStart(2, '0')
      const time = `${h}:${m}`
      const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      options.push({ label, value: time })
    }
  }
  return options
})

// Min date for calendar (today)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Validation
const formErrors = ref<Record<string, string>>({})
const currentStep = ref(1) // 1: Cart Review, 2: Customer Info, 3: Event Details

// Load data on mount
onMounted(async () => {
  try {
    // Load tenant
    const loadedTenant = await loadTenant(tenantSlug)
    if (!loadedTenant) {
      error.value = 'Business not found'
      loading.value = false
      return
    }
    tenantData.value = loadedTenant

    // Load cart from query param or localStorage
    loadCart()
  } catch (err) {
    console.error('Failed to load checkout:', err)
    error.value = 'Failed to load checkout'
  } finally {
    loading.value = false
  }

  // Listen for theme changes
  onMessage('bh:theme:set', (data: { theme?: unknown }) => {
    const newTheme = data.theme as string
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    }
  })
})

function loadCart() {
  // Try query param first
  const cartParam = route.query.cart as string
  if (cartParam) {
    try {
      cart.value = JSON.parse(decodeURIComponent(cartParam))
      return
    } catch {
      console.warn('Failed to parse cart from URL')
    }
  }

  // Try localStorage
  if (import.meta.client) {
    const savedCart = localStorage.getItem('bh_cart')
    const savedTenant = localStorage.getItem('bh_cart_tenant')

    if (savedCart && savedTenant === tenantSlug) {
      try {
        cart.value = JSON.parse(savedCart)
        // Clear after loading
        localStorage.removeItem('bh_cart')
        localStorage.removeItem('bh_cart_tenant')
      } catch {
        console.warn('Failed to parse cart from localStorage')
      }
    }
  }
}

// Computed
const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const depositAmount = computed(() => {
  // 50% deposit
  return cartTotal.value * 0.5
})

const isCartEmpty = computed(() => cart.value.length === 0)

// Validation
function validateStep(step: number): boolean {
  formErrors.value = {}

  if (step === 2) {
    if (!customer.value.firstName) formErrors.value.firstName = 'First name is required'
    if (!customer.value.lastName) formErrors.value.lastName = 'Last name is required'
    if (!customer.value.email) formErrors.value.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.value.email)) {
      formErrors.value.email = 'Invalid email address'
    }
    if (!customer.value.phone) formErrors.value.phone = 'Phone is required'
  }

  if (step === 3) {
    if (!eventDetails.value.date) formErrors.value.date = 'Event date is required'
    if (!eventDetails.value.address.street) formErrors.value.street = 'Street address is required'
    if (!eventDetails.value.address.city) formErrors.value.city = 'City is required'
    if (!eventDetails.value.address.state) formErrors.value.state = 'State is required'
    if (!eventDetails.value.address.zip) formErrors.value.zip = 'ZIP code is required'
  }

  return Object.keys(formErrors.value).length === 0
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Remove item from cart
function removeItem(itemId: string) {
  cart.value = cart.value.filter(item => item.id !== itemId)
}

// Update quantity
function updateQuantity(itemId: string, qty: number) {
  const item = cart.value.find(i => i.id === itemId)
  if (item) {
    if (qty <= 0) {
      removeItem(itemId)
    } else {
      item.quantity = qty
    }
  }
}

// Submit checkout
async function submitCheckout() {
  if (!validateStep(3)) return

  submitting.value = true

  try {
    // Create customer
    const customerResponse = await $fetch('/public/booking/customers', {
      method: 'POST',
      body: {
        firstName: customer.value.firstName,
        lastName: customer.value.lastName,
        email: customer.value.email,
        phone: customer.value.phone,
        address: eventDetails.value.address,
        tenantId: tenantData.value?.id
      }
    })

    if (!customerResponse.customer?.id) {
      throw new Error('Failed to create customer')
    }

    // Calculate end date (default to same day if not specified)
    const endDate = eventDetails.value.endDate || eventDetails.value.date

    // Create booking
    const bookingResponse = await $fetch('/public/booking/bookings', {
      method: 'POST',
      body: {
        customerId: customerResponse.customer.id,
        tenantId: tenantData.value?.id,
        items: cart.value.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
          startDate: eventDetails.value.date,
          endDate: endDate
        })),
        totalPrice: cartTotal.value,
        eventDetails: {
          type: eventDetails.value.type,
          address: eventDetails.value.address,
          specialInstructions: eventDetails.value.specialInstructions
        }
      }
    })

    if (!bookingResponse.booking?.id) {
      throw new Error('Failed to create booking')
    }

    // Create Stripe checkout session
    const stripeResponse = await $fetch<{ success: boolean, session?: { id: string, url: string | null } }>('/stripe/checkout/create-session', {
      method: 'POST',
      body: {
        bookingId: bookingResponse.booking.id,
        amount: Math.round(depositAmount.value * 100), // Convert to cents
        customerEmail: customer.value.email,
        successUrl: successUrl.value || `${window.location.origin}/book/${tenantSlug}/success?booking=${bookingResponse.booking.id}`,
        cancelUrl: cancelUrl.value || window.location.href,
        paymentType: 'deposit'
      }
    })

    // Redirect to Stripe
    if (stripeResponse?.session?.url) {
      // Notify parent before redirect
      if (isEmbedded.value) {
        sendToParent('bh:checkout:started', {
          bookingId: bookingResponse.booking.id,
          stripeUrl: stripeResponse.session.url
        })
      }
      window.location.href = stripeResponse.session.url
    } else {
      throw new Error('Failed to create payment session')
    }
  } catch (err: unknown) {
    console.error('Checkout failed:', err)
    error.value = err instanceof Error ? err.message : 'Checkout failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

const eventTypes = [
  { label: 'Birthday Party', value: 'birthday' },
  { label: 'Corporate Event', value: 'corporate' },
  { label: 'School Event', value: 'school' },
  { label: 'Church Event', value: 'church' },
  { label: 'Community Event', value: 'community' },
  { label: 'Other', value: 'other' }
]
</script>

<template>
  <div class="embed-checkout p-4 bg-white dark:bg-gray-900 min-h-screen">
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

    <!-- Empty Cart -->
    <div
      v-else-if="isCartEmpty"
      class="text-center py-16"
    >
      <UIcon
        name="i-lucide-shopping-cart"
        class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
      />
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Your cart is empty
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Add some items to get started
      </p>
    </div>

    <!-- Checkout Flow -->
    <div
      v-else
      class="max-w-2xl mx-auto"
    >
      <!-- Progress Steps -->
      <div class="flex items-center justify-center mb-8">
        <div
          v-for="step in 3"
          :key="step"
          class="flex items-center"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
              currentStep >= step
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ step }}
          </div>
          <div
            v-if="step < 3"
            :class="[
              'w-12 h-1 mx-2 transition-colors',
              currentStep > step
                ? 'bg-orange-600'
                : 'bg-gray-200 dark:bg-gray-700'
            ]"
          />
        </div>
      </div>

      <!-- Step 1: Cart Review -->
      <div v-if="currentStep === 1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Review Your Cart
        </h2>

        <div class="space-y-4 mb-6">
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 rounded-lg object-cover"
            >
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ item.name }}
              </h3>
              <p class="text-orange-600 dark:text-orange-500 font-semibold">
                {{ formatPrice(item.price) }}/day
              </p>
              <div class="flex items-center gap-2 mt-2">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-minus"
                  @click="updateQuantity(item.id, item.quantity - 1)"
                />
                <span class="w-8 text-center">{{ item.quantity }}</span>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="outline"
                  icon="i-lucide-plus"
                  @click="updateQuantity(item.id, item.quantity + 1)"
                />
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ formatPrice(item.price * item.quantity) }}
              </p>
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                class="mt-2"
                @click="removeItem(item.id)"
              />
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6 space-y-2">
          <div class="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>{{ formatPrice(cartTotal) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Deposit Due (50%)</span>
            <span class="text-orange-600">{{ formatPrice(depositAmount) }}</span>
          </div>
        </div>

        <UButton
          block
          size="lg"
          icon="i-lucide-arrow-right"
          trailing
          @click="nextStep"
        >
          Continue to Details
        </UButton>
      </div>

      <!-- Step 2: Customer Info -->
      <div v-else-if="currentStep === 2">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Your Information
        </h2>

        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="First Name"
              :error="formErrors.firstName"
            >
              <UInput
                v-model="customer.firstName"
                placeholder="John"
              />
            </UFormField>
            <UFormField
              label="Last Name"
              :error="formErrors.lastName"
            >
              <UInput
                v-model="customer.lastName"
                placeholder="Doe"
              />
            </UFormField>
          </div>

          <UFormField
            label="Email"
            :error="formErrors.email"
          >
            <UInput
              v-model="customer.email"
              type="email"
              placeholder="john@example.com"
            />
          </UFormField>

          <UFormField
            label="Phone"
            :error="formErrors.phone"
          >
            <UInput
              v-model="customer.phone"
              type="tel"
              placeholder="(555) 123-4567"
            />
          </UFormField>
        </div>

        <div class="flex gap-3">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            @click="prevStep"
          >
            Back
          </UButton>
          <UButton
            class="flex-1"
            icon="i-lucide-arrow-right"
            trailing
            @click="nextStep"
          >
            Continue
          </UButton>
        </div>
      </div>

      <!-- Step 3: Event Details -->
      <div v-else-if="currentStep === 3">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Event Details
        </h2>

        <div class="space-y-4 mb-6">
          <!-- Date Selection -->
          <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
              <UIcon
                name="i-lucide-calendar"
                class="w-4 h-4"
              />
              Rental Dates & Times
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <UFormField
                label="Delivery Date"
                :error="formErrors.date"
              >
                <UInput
                  v-model="eventDetails.date"
                  type="date"
                  :min="minDate"
                />
              </UFormField>
              <UFormField label="Return Date">
                <UInput
                  v-model="eventDetails.endDate"
                  type="date"
                  :min="eventDetails.date || minDate"
                  :placeholder="eventDetails.date ? 'Same day' : ''"
                />
              </UFormField>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Delivery Time">
                <USelect
                  v-model="eventDetails.deliveryTime"
                  :items="timeOptions"
                />
              </UFormField>
              <UFormField label="Pickup Time">
                <USelect
                  v-model="eventDetails.pickupTime"
                  :items="timeOptions"
                />
              </UFormField>
            </div>
            <p class="text-xs text-orange-600 dark:text-orange-400 mt-2">
              <UIcon
                name="i-lucide-info"
                class="w-3 h-3 inline mr-1"
              />
              Equipment will be delivered before your event and picked up after.
            </p>
          </div>

          <UFormField label="Event Type">
            <USelect
              v-model="eventDetails.type"
              :items="eventTypes"
            />
          </UFormField>

          <UFormField
            label="Street Address"
            :error="formErrors.street"
          >
            <UInput
              v-model="eventDetails.address.street"
              placeholder="123 Main St"
            />
          </UFormField>

          <div class="grid grid-cols-3 gap-4">
            <UFormField
              label="City"
              :error="formErrors.city"
            >
              <UInput
                v-model="eventDetails.address.city"
                placeholder="City"
              />
            </UFormField>
            <UFormField
              label="State"
              :error="formErrors.state"
            >
              <UInput
                v-model="eventDetails.address.state"
                placeholder="TX"
              />
            </UFormField>
            <UFormField
              label="ZIP"
              :error="formErrors.zip"
            >
              <UInput
                v-model="eventDetails.address.zip"
                placeholder="12345"
              />
            </UFormField>
          </div>

          <UFormField label="Special Instructions (optional)">
            <UTextarea
              v-model="eventDetails.specialInstructions"
              placeholder="Any special setup requirements, gate codes, etc."
              :rows="3"
            />
          </UFormField>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            Order Summary
          </h3>
          <div class="space-y-1 text-sm">
            <div
              v-for="item in cart"
              :key="item.id"
              class="flex justify-between text-gray-600 dark:text-gray-400"
            >
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
            <div class="flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Deposit Due Today</span>
              <span class="text-orange-600">{{ formatPrice(depositAmount) }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Remaining balance of {{ formatPrice(cartTotal - depositAmount) }} due at delivery
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            @click="prevStep"
          >
            Back
          </UButton>
          <UButton
            class="flex-1"
            size="lg"
            color="success"
            icon="i-lucide-credit-card"
            :loading="submitting"
            @click="submitCheckout"
          >
            Pay {{ formatPrice(depositAmount) }} Deposit
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embed-checkout {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
