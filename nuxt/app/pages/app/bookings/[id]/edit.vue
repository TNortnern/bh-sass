<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import { getCategoryLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { currentBooking, fetchBooking, updateBooking } = useBookings()
const toast = useToast()

const bookingId = route.params.id as string

// Form state
const formData = ref({
  // Dates
  startDate: '',
  endDate: '',
  // Customer info
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  // Delivery address
  deliveryStreet: '',
  deliveryCity: '',
  deliveryState: '',
  deliveryZip: '',
  deliveryInstructions: '',
  // Status
  status: 'pending' as 'pending' | 'confirmed' | 'preparing' | 'in_route' | 'delivered' | 'picked_up' | 'completed' | 'cancelled',
  paymentStatus: 'unpaid' as 'unpaid' | 'deposit' | 'paid' | 'refunded',
  // Notes
  customerNotes: '',
  internalNotes: ''
})

const isSaving = ref(false)
const isLoadingBooking = ref(true)
const fetchError = ref<string | null>(null)

// Load booking on mount
onMounted(async () => {
  isLoadingBooking.value = true
  fetchError.value = null

  const result = await fetchBooking(bookingId)

  if (!result.success) {
    fetchError.value = result.error || 'Failed to load booking'
  } else if (currentBooking.value) {
    // Populate form with current booking data
    formData.value = {
      startDate: currentBooking.value.dates.start,
      endDate: currentBooking.value.dates.end,
      customerName: currentBooking.value.customer.name,
      customerEmail: currentBooking.value.customer.email,
      customerPhone: currentBooking.value.customer.phone,
      deliveryStreet: currentBooking.value.deliveryAddress.street,
      deliveryCity: currentBooking.value.deliveryAddress.city,
      deliveryState: currentBooking.value.deliveryAddress.state,
      deliveryZip: currentBooking.value.deliveryAddress.zip,
      deliveryInstructions: currentBooking.value.deliveryAddress.instructions || '',
      status: currentBooking.value.status,
      paymentStatus: currentBooking.value.paymentStatus,
      customerNotes: currentBooking.value.notes.customer || '',
      internalNotes: currentBooking.value.notes.internal || ''
    }
  }

  isLoadingBooking.value = false
})

// Status options
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const paymentStatusOptions = [
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Deposit Paid', value: 'deposit' },
  { label: 'Paid in Full', value: 'paid' },
  { label: 'Refunded', value: 'refunded' }
]

// Save changes
const saveChanges = async () => {
  if (isSaving.value) return

  isSaving.value = true

  try {
    // Prepare update data
    const updates = {
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      status: formData.value.status,
      paymentStatus: formData.value.paymentStatus,
      notes: {
        customer: formData.value.customerNotes,
        internal: formData.value.internalNotes
      },
      deliveryAddress: {
        street: formData.value.deliveryStreet,
        city: formData.value.deliveryCity,
        state: formData.value.deliveryState,
        zip: formData.value.deliveryZip,
        instructions: formData.value.deliveryInstructions
      },
      customerInfo: {
        name: formData.value.customerName,
        email: formData.value.customerEmail,
        phone: formData.value.customerPhone
      }
    }

    // Update booking via composable
    const result = await updateBooking(bookingId, updates)

    if (result.success) {
      // Redirect back to booking detail page
      router.push(`/app/bookings/${bookingId}`)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Failed to update booking:', err)
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update booking',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

// Cancel editing
const cancelEdit = () => {
  router.push(`/app/bookings/${bookingId}`)
}
</script>

<template>
  <div
    v-if="currentBooking"
    class="space-y-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          @click="cancelEdit"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Booking {{ currentBooking.bookingNumber }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Update booking details and customer information
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          :disabled="isSaving"
          @click="cancelEdit"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          size="md"
          icon="i-lucide-save"
          :loading="isSaving"
          :disabled="isSaving"
          @click="saveChanges"
        >
          Save Changes
        </UButton>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Left Column - Editable Fields -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Dates Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Event Dates
            </h2>
          </template>

          <div class="grid sm:grid-cols-2 gap-4">
            <UFormField
              label="Start Date"
              required
            >
              <UInput
                v-model="formData.startDate"
                type="date"
                icon="i-lucide-calendar"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="End Date"
              required
            >
              <UInput
                v-model="formData.endDate"
                type="date"
                icon="i-lucide-calendar"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>Delivery:</strong> {{ format(parseISO(formData.startDate), 'MMM dd, yyyy') }}<br>
              <strong>Pickup:</strong> {{ format(parseISO(formData.endDate), 'MMM dd, yyyy') }}
            </p>
          </div>
        </UCard>

        <!-- Customer Information -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Information
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField
              label="Full Name"
              required
            >
              <UInput
                v-model="formData.customerName"
                icon="i-lucide-user"
                placeholder="John Doe"
                class="w-full"
              />
            </UFormField>

            <div class="grid sm:grid-cols-2 gap-4">
              <UFormField
                label="Email"
                required
              >
                <UInput
                  v-model="formData.customerEmail"
                  type="email"
                  icon="i-lucide-mail"
                  placeholder="john@example.com"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Phone"
                required
              >
                <UInput
                  v-model="formData.customerPhone"
                  type="tel"
                  icon="i-lucide-phone"
                  placeholder="(555) 123-4567"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>
        </UCard>

        <!-- Delivery Address -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Delivery Address
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField
              label="Street Address"
              required
            >
              <UInput
                v-model="formData.deliveryStreet"
                icon="i-lucide-map-pin"
                placeholder="123 Main Street"
                class="w-full"
              />
            </UFormField>

            <div class="grid sm:grid-cols-3 gap-4">
              <UFormField
                label="City"
                required
                class="sm:col-span-1"
              >
                <UInput
                  v-model="formData.deliveryCity"
                  placeholder="San Francisco"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="State"
                required
              >
                <UInput
                  v-model="formData.deliveryState"
                  placeholder="CA"
                  maxlength="2"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="ZIP Code"
                required
              >
                <UInput
                  v-model="formData.deliveryZip"
                  placeholder="94102"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Delivery Instructions">
              <UTextarea
                v-model="formData.deliveryInstructions"
                placeholder="Gate code, parking instructions, etc."
                :rows="2"
              />
            </UFormField>
          </div>
        </UCard>

        <!-- Notes -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Notes
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField label="Customer Notes">
              <UTextarea
                v-model="formData.customerNotes"
                placeholder="Special requests from customer..."
                :rows="3"
              />
            </UFormField>

            <UFormField label="Internal Notes">
              <UTextarea
                v-model="formData.internalNotes"
                placeholder="Internal team notes..."
                :rows="3"
              />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Right Column - Status and Item Info -->
      <div class="space-y-6">
        <!-- Rental Item (Read-only) -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Rental Item
            </h2>
          </template>

          <div class="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center flex-shrink-0">
              <UIcon
                name="i-lucide-tent"
                class="w-8 h-8 text-orange-600 dark:text-orange-400"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                {{ currentBooking.item.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ getCategoryLabel(currentBooking.item.category) }}
              </p>
              <p class="text-sm font-medium text-gray-900 dark:text-white mt-2">
                ${{ currentBooking.item.dailyRate }} / day
              </p>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              To change the rental item, please create a new booking.
            </p>
          </div>
        </UCard>

        <!-- Status -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Booking Status
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField
              label="Booking Status"
              required
            >
              <USelect
                v-model="formData.status"
                :options="statusOptions"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Payment Status"
              required
            >
              <USelect
                v-model="formData.paymentStatus"
                :options="paymentStatusOptions"
                class="w-full"
              />
            </UFormField>
          </div>
        </UCard>

        <!-- Payment Info (Read-only) -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Information
            </h2>
          </template>

          <div class="space-y-3">
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                ${{ currentBooking.payment.subtotal.toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Deposit (50%)</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                ${{ currentBooking.payment.deposit.toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">
                ${{ currentBooking.payment.total.toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Payment amounts are calculated automatically based on dates and rates.
            </p>
          </div>
        </UCard>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2">
          <UButton
            color="primary"
            size="lg"
            block
            icon="i-lucide-save"
            :loading="isSaving"
            :disabled="isSaving"
            @click="saveChanges"
          >
            Save Changes
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            block
            :disabled="isSaving"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="fetchError"
    class="flex flex-col items-center justify-center py-12"
  >
    <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-8 h-8 text-red-600 dark:text-red-400"
      />
    </div>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Failed to Load Booking
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
      {{ fetchError }}
    </p>
    <div class="flex gap-3">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-arrow-left"
        @click="router.push('/app/bookings')"
      >
        Back to Bookings
      </UButton>
    </div>
  </div>

  <!-- Loading State -->
  <div
    v-else-if="isLoadingBooking"
    class="flex items-center justify-center py-12"
  >
    <div class="text-center">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3"
      />
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Loading booking details...
      </p>
    </div>
  </div>
</template>
