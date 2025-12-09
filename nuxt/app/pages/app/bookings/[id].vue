<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, parseISO } from 'date-fns'
import { getCategoryLabel, getStatusLabel, getPaymentStatusLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
// const router = useRouter()
const { currentBooking, fetchBooking, updateStatus, updatePaymentStatus, cancelBooking } = useBookings()
const toast = useToast()

const bookingId = route.params.id as string

// Modals
const showCancelModal = ref(false)
const showRefundModal = ref(false)
const showEmailModal = ref(false)
const cancelReason = ref('')

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format date
const formatDate = (date: string, formatStr = 'MMM dd, yyyy') => {
  return format(parseISO(date), formatStr)
}

// Format date time
const _formatDateTime = (date: string) => {
  return format(parseISO(date), 'MMM dd, yyyy h:mm a')
}

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'green'
    case 'pending': return 'yellow'
    case 'delivered': return 'blue'
    case 'completed': return 'gray'
    case 'cancelled': return 'red'
    default: return 'neutral'
  }
}

// Get payment status color
const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid': return 'green'
    case 'deposit': return 'blue'
    case 'unpaid': return 'red'
    case 'refunded': return 'orange'
    default: return 'neutral'
  }
}

// Status actions
const statusActions = computed(() => {
  if (!currentBooking.value) return []

  const actions = []

  if (currentBooking.value.status === 'pending') {
    actions.push({
      label: 'Confirm Booking',
      icon: 'i-lucide-check-circle',
      color: 'success',
      onSelect: () => handleStatusUpdate('confirmed')
    })
  }

  if (currentBooking.value.status === 'confirmed') {
    actions.push({
      label: 'Mark as Delivered',
      icon: 'i-lucide-truck',
      color: 'info',
      onSelect: () => handleStatusUpdate('delivered')
    })
  }

  if (currentBooking.value.status === 'delivered') {
    actions.push({
      label: 'Complete Booking',
      icon: 'i-lucide-check-circle-2',
      color: 'success',
      onSelect: () => handleStatusUpdate('completed')
    })
  }

  return actions
})

// Handle status update
const handleStatusUpdate = async (status: string) => {
  try {
    await updateStatus(bookingId, status as 'pending' | 'confirmed' | 'preparing' | 'in_route' | 'delivered' | 'picked_up' | 'completed' | 'cancelled')
    await fetchBooking(bookingId)
    toast.add({
      title: 'Status Updated',
      description: `Booking status changed to ${getStatusLabel(status)}`,
      color: 'success'
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to update booking status')
    console.error('Failed to update status:', error)
    toast.add({
      title: 'Update Failed',
      description: error.message,
      color: 'error'
    })
  }
}

// Handle cancel
const handleCancel = async () => {
  try {
    await cancelBooking(bookingId, cancelReason.value)
    showCancelModal.value = false
    cancelReason.value = ''
    await fetchBooking(bookingId)
    toast.add({
      title: 'Booking Cancelled',
      description: 'The booking has been cancelled',
      color: 'success'
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to cancel booking')
    console.error('Failed to cancel booking:', error)
    toast.add({
      title: 'Cancellation Failed',
      description: error.message,
      color: 'error'
    })
  }
}

// Handle print
const handlePrint = () => {
  window.print()
}

// Handle send email
const handleSendEmail = () => {
  showEmailModal.value = true
}

// Contact customer
const callCustomer = () => {
  if (currentBooking.value) {
    window.location.href = `tel:${currentBooking.value.customer.phone}`
  }
}

const emailCustomer = () => {
  if (currentBooking.value) {
    window.location.href = `mailto:${currentBooking.value.customer.email}`
  }
}

// Timeline event icons
const getTimelineIcon = (event: string) => {
  switch (event) {
    case 'created': return 'i-lucide-plus-circle'
    case 'confirmed': return 'i-lucide-check-circle'
    case 'delivered': return 'i-lucide-truck'
    case 'completed': return 'i-lucide-check-circle-2'
    case 'cancelled': return 'i-lucide-x-circle'
    default: return 'i-lucide-circle'
  }
}

const getTimelineColor = (event: string) => {
  switch (event) {
    case 'created': return 'blue'
    case 'confirmed': return 'green'
    case 'delivered': return 'blue'
    case 'completed': return 'green'
    case 'cancelled': return 'red'
    default: return 'gray'
  }
}

// Error state
const fetchError = ref<string | null>(null)
const isLoadingBooking = ref(true)

// Load booking on mount
onMounted(async () => {
  isLoadingBooking.value = true
  fetchError.value = null

  const result = await fetchBooking(bookingId)

  if (!result.success) {
    fetchError.value = result.error || 'Failed to load booking'
  }

  isLoadingBooking.value = false
})
</script>

<template>
  <div
    v-if="currentBooking"
    class="space-y-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-4 no-print">
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          @click="router.back()"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ currentBooking.bookingNumber }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Created {{ formatDateTime(currentBooking.createdAt) }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          icon="i-lucide-printer"
          @click="handlePrint"
        >
          Print
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          icon="i-lucide-mail"
          @click="handleSendEmail"
        >
          Email
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          icon="i-lucide-pencil"
          @click="router.push(`/app/bookings/${bookingId}/edit`)"
        >
          Edit
        </UButton>
      </div>
    </div>

    <!-- Print Header (visible only when printing) -->
    <div class="print-only print-header">
      <h1 class="text-2xl font-bold">
        {{ currentBooking.bookingNumber }}
      </h1>
      <p class="text-sm text-gray-600">
        Created {{ formatDateTime(currentBooking.createdAt) }}
      </p>
    </div>

    <!-- Status Actions -->
    <div
      v-if="statusActions.length > 0"
      class="flex gap-3 no-print"
    >
      <UButton
        v-for="action in statusActions"
        :key="action.label"
        :color="action.color"
        :icon="action.icon"
        @click="action.click"
      >
        {{ action.label }}
      </UButton>
    </div>

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Booking Overview -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Booking Details
              </h2>
              <div class="flex items-center gap-2">
                <UBadge
                  :color="getStatusColor(currentBooking.status)"
                  variant="subtle"
                >
                  {{ getStatusLabel(currentBooking.status) }}
                </UBadge>
                <UBadge
                  :color="getPaymentColor(currentBooking.paymentStatus)"
                  variant="subtle"
                >
                  {{ getPaymentStatusLabel(currentBooking.paymentStatus) }}
                </UBadge>
              </div>
            </div>
          </template>

          <!-- Rental Item -->
          <div class="space-y-4">
            <div class="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-tent"
                  class="w-10 h-10 text-orange-600 dark:text-orange-400"
                />
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  Rental Item
                </p>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {{ currentBooking.item.name }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getCategoryLabel(currentBooking.item.category) }}
                </p>
                <p class="text-sm font-medium text-gray-900 dark:text-white mt-2">
                  {{ formatCurrency(currentBooking.item.dailyRate) }} / day
                </p>
              </div>
            </div>

            <!-- Dates -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Event Dates
                  </p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(currentBooking.dates.start) }} - {{ formatDate(currentBooking.dates.end) }}
                </p>
              </div>

              <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 mb-2">
                  <UIcon
                    name="i-lucide-truck"
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                  />
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Delivery & Pickup
                  </p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Delivery: {{ formatDate(currentBooking.dates.delivery!) }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Pickup: {{ formatDate(currentBooking.dates.pickup!) }}
                </p>
              </div>
            </div>

            <!-- Delivery Address -->
            <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-start gap-2 mb-2">
                <UIcon
                  name="i-lucide-map-pin"
                  class="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Delivery Address
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ currentBooking.deliveryAddress.street }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ currentBooking.deliveryAddress.city }}, {{ currentBooking.deliveryAddress.state }} {{ currentBooking.deliveryAddress.zip }}
                  </p>
                  <p
                    v-if="currentBooking.deliveryAddress.instructions"
                    class="text-sm text-gray-500 dark:text-gray-400 mt-2 italic"
                  >
                    {{ currentBooking.deliveryAddress.instructions }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Payment Information -->
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
                {{ formatCurrency(currentBooking.payment.subtotal) }}
              </span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Deposit (50%)</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(currentBooking.payment.deposit) }}
              </span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
              <span class="text-base font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(currentBooking.payment.total) }}
              </span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Amount Paid</span>
              <span class="text-sm font-medium text-green-600 dark:text-green-400">
                {{ formatCurrency(currentBooking.payment.paid) }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-base font-semibold text-gray-900 dark:text-white">Balance Due</span>
              <span
                class="text-base font-bold"
                :class="currentBooking.payment.balance > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'"
              >
                {{ formatCurrency(currentBooking.payment.balance) }}
              </span>
            </div>
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
            <div v-if="currentBooking.notes.customer">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Customer Notes
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                {{ currentBooking.notes.customer }}
              </p>
            </div>

            <div v-if="currentBooking.notes.internal">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Internal Notes
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10">
                {{ currentBooking.notes.internal }}
              </p>
            </div>

            <div v-if="!currentBooking.notes.customer && !currentBooking.notes.internal">
              <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                No notes added
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Right Column -->
      <div class="space-y-6 print-right-column">
        <!-- Customer Information -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Customer
            </h2>
          </template>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                {{ currentBooking.customer.name.split(' ').map((n: string) => n[0]).join('') }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {{ currentBooking.customer.name }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Customer ID: {{ currentBooking.customer.id }}
                </p>
              </div>
            </div>

            <UDivider />

            <div class="space-y-3">
              <button
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                @click="emailCustomer"
              >
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-mail"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ currentBooking.customer.email }}
                  </p>
                </div>
              </button>

              <button
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                @click="callCustomer"
              >
                <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-phone"
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ currentBooking.customer.phone }}
                  </p>
                </div>
              </button>
            </div>

            <UButton
              color="neutral"
              variant="outline"
              block
              icon="i-lucide-user"
              @click="router.push(`/app/customers/${currentBooking.customer.id}`)"
            >
              View Customer Profile
            </UButton>
          </div>
        </UCard>

        <!-- Timeline -->
        <UCard class="bg-white dark:bg-gray-900 no-print">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Timeline
            </h2>
          </template>

          <div class="space-y-4">
            <div
              v-for="(event, index) in currentBooking.timeline"
              :key="event.id"
              class="flex gap-3"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="`bg-${getTimelineColor(event.event)}-100 dark:bg-${getTimelineColor(event.event)}-900/20`"
                >
                  <UIcon
                    :name="getTimelineIcon(event.event)"
                    class="w-4 h-4"
                    :class="`text-${getTimelineColor(event.event)}-600 dark:text-${getTimelineColor(event.event)}-400`"
                  />
                </div>
                <div
                  v-if="index < currentBooking.timeline.length - 1"
                  class="w-px h-full bg-gray-200 dark:bg-gray-700 mt-2"
                />
              </div>
              <div class="flex-1 pb-4">
                <p class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {{ event.event }}
                </p>
                <p
                  v-if="event.description"
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ event.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDateTime(event.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Actions -->
        <UCard class="bg-white dark:bg-gray-900 no-print">
          <template #header>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Actions
            </h2>
          </template>

          <div class="space-y-2">
            <UButton
              v-if="currentBooking.status !== 'cancelled'"
              color="red"
              variant="outline"
              block
              icon="i-lucide-x-circle"
              @click="showCancelModal = true"
            >
              Cancel Booking
            </UButton>
            <UButton
              v-if="currentBooking.paymentStatus === 'paid'"
              color="orange"
              variant="outline"
              block
              icon="i-lucide-rotate-ccw"
              @click="showRefundModal = true"
            >
              Process Refund
            </UButton>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Email Modal -->
    <BookingsEmailModal
      v-if="currentBooking"
      v-model:open="showEmailModal"
      :booking="currentBooking"
      @sent="toast.add({
        title: 'Email Sent',
        description: 'Email sent successfully to customer',
        color: 'green',
        icon: 'i-lucide-check-circle'
      })"
    />

    <!-- Cancel Modal -->
    <UModal v-model:open="showCancelModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cancel Booking
          </h3>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>

          <UTextarea
            v-model="cancelReason"
            placeholder="Cancellation reason (optional)"
            :rows="3"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              @click="showCancelModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              @click="handleCancel"
            >
              Confirm Cancellation
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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
      <UButton
        icon="i-lucide-refresh-cw"
        @click="async () => {
          isLoadingBooking = true
          fetchError = null
          const result = await fetchBooking(bookingId)
          if (!result.success) {
            fetchError = result.error || 'Failed to load booking'
          }
          isLoadingBooking = false
        }"
      >
        Retry
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

<style scoped>
/* Print Styles */
.print-only {
  display: none;
}

@media print {
  /* Hide elements that shouldn't print */
  .no-print {
    display: none !important;
  }

  /* Show print-only elements */
  .print-only {
    display: block !important;
  }

  /* Print header styling */
  .print-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  /* Remove page margins and backgrounds */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Reset layout for print */
  .space-y-6 {
    display: block !important;
  }

  /* Single column layout for print */
  .grid {
    display: block !important;
  }

  .lg\:col-span-2 {
    width: 100% !important;
  }

  .print-right-column {
    width: 100% !important;
    page-break-before: auto;
    margin-top: 2rem;
  }

  /* Card styling for print */
  .bg-white,
  .dark\:bg-gray-900 {
    background: white !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: none !important;
    page-break-inside: avoid;
    margin-bottom: 1.5rem;
  }

  /* Ensure text is readable */
  .text-gray-900,
  .dark\:text-white {
    color: #111827 !important;
  }

  .text-gray-600,
  .dark\:text-gray-400 {
    color: #4b5563 !important;
  }

  .text-gray-500 {
    color: #6b7280 !important;
  }

  /* Badge styling for print */
  [class*='bg-green'],
  [class*='bg-blue'],
  [class*='bg-yellow'],
  [class*='bg-red'],
  [class*='bg-orange'] {
    border: 1px solid currentColor !important;
    padding: 0.25rem 0.5rem;
  }

  /* Remove gradient backgrounds for print */
  .bg-gradient-to-br {
    background: #f3f4f6 !important;
  }

  /* Icon colors for print */
  .text-orange-600,
  .text-blue-600,
  .text-green-600 {
    color: #000 !important;
  }

  /* Ensure borders are visible */
  .border-gray-200,
  .dark\:border-gray-700 {
    border-color: #e5e7eb !important;
  }

  /* Payment section emphasis */
  .font-bold {
    font-weight: 700 !important;
  }

  /* Remove unnecessary spacing */
  .gap-6,
  .gap-4 {
    gap: 1rem !important;
  }

  /* Page breaks */
  .space-y-6 > * {
    page-break-inside: avoid;
  }

  /* Hover states don't apply in print */
  button:hover,
  .hover\:bg-gray-50 {
    background: transparent !important;
  }

  /* Clean up rounded corners for print */
  .rounded-lg,
  .rounded-full {
    border-radius: 0.5rem !important;
  }
}
</style>
