<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import type { Booking } from '~/composables/useBookings'
import { getStatusLabel, getPaymentStatusLabel } from '~/utils/formatters'

interface Props {
  booking: Booking
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [booking: Booking]
  statusChange: [id: string, status: Booking['status']]
}>()

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format date
const formatDate = (date: string) => {
  return format(parseISO(date), 'MMM dd, yyyy')
}

// Get status color (Nuxt UI v3 colors: primary, secondary, success, info, warning, error, neutral)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'delivered':
      return 'info'
    case 'completed':
      return 'neutral'
    case 'cancelled':
      return 'error'
    default:
      return 'neutral'
  }
}

// Get payment status color (Nuxt UI v3 colors: primary, secondary, success, info, warning, error, neutral)
const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'success'
    case 'deposit':
      return 'info'
    case 'unpaid':
      return 'error'
    case 'refunded':
      return 'warning'
    default:
      return 'neutral'
  }
}

// Quick status update dropdown
const statusActions = [
  [
    { label: 'Pending', click: () => emit('statusChange', props.booking.id, 'pending') },
    { label: 'Confirmed', click: () => emit('statusChange', props.booking.id, 'confirmed') },
    { label: 'Delivered', click: () => emit('statusChange', props.booking.id, 'delivered') }
  ],
  [
    { label: 'Completed', click: () => emit('statusChange', props.booking.id, 'completed') },
    { label: 'Cancelled', click: () => emit('statusChange', props.booking.id, 'cancelled') }
  ]
]

const handleCardClick = () => {
  emit('click', props.booking)
}
</script>

<template>
  <div
    class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 bg-white dark:bg-gray-900 cursor-pointer"
    @click="handleCardClick"
  >
    <div class="flex flex-col sm:flex-row sm:items-start gap-4">
      <!-- Item Image/Icon -->
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center">
          <UIcon name="i-lucide-tent" class="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-mono font-medium text-gray-900 dark:text-white">
                {{ booking.bookingNumber }}
              </span>
              <UBadge
                :color="getStatusColor(booking.status)"
                variant="subtle"
                size="sm"
              >
                {{ getStatusLabel(booking.status) }}
              </UBadge>
            </div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
              {{ booking.customer.name }}
            </h3>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-1" @click.stop>
            <UDropdownMenu :items="statusActions">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-more-vertical"
              />
            </UDropdownMenu>
          </div>
        </div>

        <!-- Item -->
        <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {{ booking.item.name }}
        </p>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <!-- Dates -->
          <div class="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-calendar" class="w-4 h-4 flex-shrink-0" />
            <span class="text-xs truncate">
              {{ formatDate(booking.dates.start) }} - {{ formatDate(booking.dates.end) }}
            </span>
          </div>

          <!-- Payment Status -->
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-credit-card" class="w-4 h-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
            <UBadge
              :color="getPaymentColor(booking.paymentStatus)"
              variant="subtle"
              size="sm"
            >
              {{ getPaymentStatusLabel(booking.paymentStatus) }}
            </UBadge>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span class="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
              {{ booking.deliveryAddress.city }}, {{ booking.deliveryAddress.state }}
            </span>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(booking.payment.total) }}
            </p>
            <p v-if="booking.payment.balance > 0" class="text-xs text-orange-600 dark:text-orange-400">
              {{ formatCurrency(booking.payment.balance) }} due
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
