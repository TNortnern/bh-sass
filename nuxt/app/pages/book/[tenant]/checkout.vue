<script setup lang="ts">
import type { CustomerInfo } from '~/composables/useBookingFlow'

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string

const { items, total, clear } = useCart()
const { loadTenant, createBooking, createCheckoutSession, loading, error } = usePublicBooking()
const customerInfo = ref<CustomerInfo | null>(null)
const tenantData = ref<any>(null)

// Load tenant and redirect if cart is empty
onMounted(async () => {
  if (items.value.length === 0) {
    router.push(`/book/${tenantSlug}`)
    return
  }

  // Load tenant for checkout
  const loadedTenant = await loadTenant(tenantSlug)
  tenantData.value = loadedTenant
})

const isFormValid = computed(() => {
  if (!customerInfo.value) return false

  const c = customerInfo.value
  return !!(
    c.firstName &&
    c.lastName &&
    c.email &&
    c.phone &&
    c.address.street &&
    c.address.city &&
    c.address.state &&
    c.address.zip &&
    c.eventDetails.type &&
    c.termsAccepted
  )
})

const isProcessing = ref(false)
const bookingError = ref<string | null>(null)

const proceedToPayment = async (paymentType: 'deposit' | 'full' = 'deposit') => {
  if (!isFormValid.value || !customerInfo.value) return

  isProcessing.value = true
  bookingError.value = null

  try {
    // Calculate payment amount
    const paymentAmount = paymentType === 'deposit' ? depositAmount.value : total.value

    // Create booking in rb-payload
    const booking = await createBooking({
      customer: {
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName,
        email: customerInfo.value.email,
        phone: customerInfo.value.phone,
        address: customerInfo.value.address
      },
      eventDetails: {
        type: customerInfo.value.eventDetails.type,
        date: items.value[0]?.startDate || new Date().toISOString(),
        attendees: customerInfo.value.eventDetails.attendees,
        specialInstructions: customerInfo.value.eventDetails.specialInstructions
      },
      items: items.value.map((item: any) => ({
        itemId: item.itemId,
        serviceId: item.itemId, // Use itemId as serviceId for now
        startDate: item.startDate,
        endDate: item.endDate,
        quantity: item.quantity,
        addOns: item.addOns?.map((a: any) => a.id) || []
      })),
      totalPrice: total.value,
      depositAmount: depositAmount.value
    })

    if (!booking || !booking.id) {
      throw new Error('Failed to create booking')
    }

    // Create Stripe checkout session
    const session = await createCheckoutSession(
      booking.id,
      paymentAmount,
      customerInfo.value.email,
      tenantSlug
    )

    if (!session || !session.url) {
      throw new Error('Failed to create checkout session')
    }

    // Clear cart
    clear()

    // Redirect to Stripe Checkout
    window.location.href = session.url
  } catch (err: any) {
    console.error('Payment error:', err)
    bookingError.value = err.message || 'Failed to process booking. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const depositAmount = computed(() => total.value * 0.5)
</script>

<template>
  <div>
    <!-- Error Alert -->
    <div v-if="bookingError" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-start gap-3">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-900 dark:text-red-100 mb-1">Booking Error</h3>
          <p class="text-sm text-red-700 dark:text-red-300">{{ bookingError }}</p>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Checkout
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Complete your booking information to reserve your equipment
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Forms -->
      <div class="lg:col-span-2">
        <BookingCustomerForm v-model="customerInfo" />
      </div>

      <!-- Right Column - Cart Summary -->
      <div class="space-y-6">
        <!-- Cart -->
        <BookingCartSummary :show-actions="false" />

        <!-- Payment Options -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon name="lucide:credit-card" class="w-5 h-5" />
            Payment Options
          </h3>

          <div class="space-y-4">
            <!-- Pay Deposit -->
            <div class="p-4 border-2 border-orange-600 dark:border-orange-500 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    Pay Deposit (Recommended)
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    50% now, balance due on delivery
                  </div>
                </div>
                <div class="text-xl font-bold text-orange-600 dark:text-orange-500">
                  {{ formatCurrency(depositAmount) }}
                </div>
              </div>
              <UButton
                block
                size="lg"
                :disabled="!isFormValid || isProcessing"
                :loading="isProcessing"
                @click="() => proceedToPayment('deposit')"
              >
                Pay Deposit Now
              </UButton>
            </div>

            <!-- Pay Full Amount -->
            <div class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <div class="font-semibold text-gray-900 dark:text-white">
                    Pay Full Amount
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Pay in full today
                  </div>
                </div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(total) }}
                </div>
              </div>
              <UButton
                block
                size="lg"
                color="neutral"
                variant="outline"
                :disabled="!isFormValid || isProcessing"
                :loading="isProcessing"
                @click="() => proceedToPayment('full')"
              >
                Pay Full Amount
              </UButton>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <UIcon name="lucide:shield-check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white mb-1">
                  Secure Payment Processing
                </p>
                <p>
                  Your payment information is encrypted and processed securely through Stripe. We never store your credit card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Trust Signals -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            What Happens Next?
          </h3>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="lucide:check-circle" class="w-4 h-4 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Instant Confirmation
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  You'll receive a confirmation email immediately
                </div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="lucide:phone" class="w-4 h-4 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Confirmation Call
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  We'll call to confirm details 48 hours before
                </div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="lucide:truck" class="w-4 h-4 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Delivery & Setup
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  We'll deliver and set up on your event day
                </div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="lucide:party-popper" class="w-4 h-4 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Enjoy Your Event!
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  Have fun while we handle pickup after
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
