<script setup lang="ts">
import { format, parseISO } from 'date-fns'
import type { Booking } from '~/composables/useBookings'
import { getCategoryLabel, getStatusLabel, getPaymentStatusLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { filteredBookings, filters, stats, fetchBookings, updateStatus, bulkUpdateStatus } = useBookings()

// View mode
const viewMode = ref<'table' | 'cards'>('table')

// Pagination
const page = ref(1)
const pageSize = ref(10)

const paginatedBookings = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBookings.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / pageSize.value))

// Selected bookings for bulk actions
const selectedBookings = ref<string[]>([])

// Table columns
const columns = [
  { key: 'select', label: '' },
  { key: 'bookingNumber', label: 'Booking #' },
  { key: 'customer', label: 'Customer' },
  { key: 'item', label: 'Item' },
  { key: 'dates', label: 'Dates' },
  { key: 'status', label: 'Status' },
  { key: 'payment', label: 'Payment' },
  { key: 'total', label: 'Total' },
  { key: 'actions', label: '' }
]

// Toggle all selection
const toggleSelectAll = () => {
  if (selectedBookings.value.length === paginatedBookings.value.length) {
    selectedBookings.value = []
  } else {
    selectedBookings.value = paginatedBookings.value.map(b => b.id)
  }
}

// Toggle single selection
const toggleSelect = (id: string) => {
  const index = selectedBookings.value.indexOf(id)
  if (index > -1) {
    selectedBookings.value.splice(index, 1)
  } else {
    selectedBookings.value.push(id)
  }
}

// Check if booking is selected
const isSelected = (id: string) => selectedBookings.value.includes(id)

// Bulk actions
const bulkActions = [
  [
    {
      label: 'Confirm Selected',
      icon: 'i-lucide-check-circle',
      click: () => handleBulkAction('confirmed')
    },
    {
      label: 'Mark as Delivered',
      icon: 'i-lucide-truck',
      click: () => handleBulkAction('delivered')
    }
  ],
  [
    {
      label: 'Cancel Selected',
      icon: 'i-lucide-x-circle',
      click: () => handleBulkAction('cancelled')
    }
  ]
]

const handleBulkAction = async (status: Booking['status']) => {
  await bulkUpdateStatus(selectedBookings.value, status)
  selectedBookings.value = []
}

// Status change handler
const handleStatusChange = async (id: string, status: Booking['status']) => {
  await updateStatus(id, status)
}

// Navigate to booking detail
const viewBooking = (booking: Booking) => {
  router.push(`/app/bookings/${booking.id}`)
}

// Navigate to new booking
const createNewBooking = () => {
  router.push('/app/bookings/new')
}

// Reset filters
const resetFilters = () => {
  filters.value = {}
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Format date
const formatDate = (date: string) => {
  return format(parseISO(date), 'MMM dd')
}

// Get status color (Nuxt UI v3 colors: primary, secondary, success, info, warning, error, neutral)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success'
    case 'pending': return 'warning'
    case 'delivered': return 'info'
    case 'completed': return 'neutral'
    case 'cancelled': return 'error'
    default: return 'neutral'
  }
}

// Get payment status color (Nuxt UI v3 colors: primary, secondary, success, info, warning, error, neutral)
const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid': return 'success'
    case 'deposit': return 'info'
    case 'unpaid': return 'error'
    case 'refunded': return 'warning'
    default: return 'neutral'
  }
}

// Row actions
const getRowActions = (booking: Booking) => [
  [
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      click: () => viewBooking(booking)
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      click: () => router.push(`/app/bookings/${booking.id}/edit`)
    }
  ],
  [
    {
      label: 'Send Email',
      icon: 'i-lucide-mail',
      click: () => console.log('Send email', booking.id)
    },
    {
      label: 'Print',
      icon: 'i-lucide-printer',
      click: () => console.log('Print', booking.id)
    }
  ],
  [
    {
      label: 'Cancel Booking',
      icon: 'i-lucide-x-circle',
      click: () => handleStatusChange(booking.id, 'cancelled')
    }
  ]
]

// Load bookings on mount
onMounted(() => {
  fetchBookings()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage all your rental bookings
        </p>
      </div>

      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-plus"
        @click="createNewBooking"
      >
        New Booking
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.confirmed }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatCurrency(stats.totalRevenue) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-dollar-sign" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatCurrency(stats.outstandingBalance) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-alert-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Filters -->
    <BookingsBookingFilters v-model="filters" @reset="resetFilters" />

    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <!-- Bulk Actions -->
        <UDropdownMenu
          v-if="selectedBookings.length > 0"
          :items="bulkActions"
        >
          <UButton color="neutral" variant="outline" size="md">
            Actions ({{ selectedBookings.length }})
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4 ml-1" />
          </UButton>
        </UDropdownMenu>

        <span v-else class="text-sm text-gray-600 dark:text-gray-400">
          {{ filteredBookings.length }} booking(s)
        </span>
      </div>

      <!-- View Toggle -->
      <div class="flex items-center gap-2">
        <UButton
          :color="viewMode === 'table' ? 'primary' : 'neutral'"
          :variant="viewMode === 'table' ? 'solid' : 'ghost'"
          size="md"
          icon="i-lucide-table"
          @click="viewMode = 'table'"
        />
        <UButton
          :color="viewMode === 'cards' ? 'primary' : 'neutral'"
          :variant="viewMode === 'cards' ? 'solid' : 'ghost'"
          size="md"
          icon="i-lucide-layout-grid"
          @click="viewMode = 'cards'"
        />
      </div>
    </div>

    <!-- Table View -->
    <UCard v-if="viewMode === 'table'" class="bg-white dark:bg-gray-900 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">
                <UCheckbox
                  :model-value="selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0"
                  @update:model-value="toggleSelectAll"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Booking #
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Customer
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Item
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Dates
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Payment
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Total
              </th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="booking in paginatedBookings"
              :key="booking.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              @click="viewBooking(booking)"
            >
              <td class="px-4 py-4" @click.stop>
                <UCheckbox
                  :model-value="isSelected(booking.id)"
                  @update:model-value="toggleSelect(booking.id)"
                />
              </td>
              <td class="px-4 py-4">
                <span class="text-sm font-mono font-medium text-gray-900 dark:text-white">
                  {{ booking.bookingNumber }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.customer.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ booking.customer.email }}
                  </p>
                </div>
              </td>
              <td class="px-4 py-4">
                <p class="text-sm text-gray-900 dark:text-white">{{ booking.item.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ getCategoryLabel(booking.item.category) }}</p>
              </td>
              <td class="px-4 py-4">
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(booking.dates.start) }} - {{ formatDate(booking.dates.end) }}
                </p>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="getStatusColor(booking.status)"
                  variant="subtle"
                >
                  {{ getStatusLabel(booking.status) }}
                </UBadge>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="getPaymentColor(booking.paymentStatus)"
                  variant="subtle"
                >
                  {{ getPaymentStatusLabel(booking.paymentStatus) }}
                </UBadge>
              </td>
              <td class="px-4 py-4 text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(booking.payment.total) }}
                </p>
                <p v-if="booking.payment.balance > 0" class="text-xs text-orange-600 dark:text-orange-400">
                  {{ formatCurrency(booking.payment.balance) }} due
                </p>
              </td>
              <td class="px-4 py-4" @click.stop>
                <UDropdownMenu :items="getRowActions(booking)">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-more-vertical"
                  />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="paginatedBookings.length === 0" class="text-center py-12">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No bookings found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters or create a new booking
        </p>
        <UButton color="primary" icon="i-lucide-plus" @click="createNewBooking">
          New Booking
        </UButton>
      </div>
    </UCard>

    <!-- Card View -->
    <div v-if="viewMode === 'cards'" class="space-y-4">
      <BookingsBookingCard
        v-for="booking in paginatedBookings"
        :key="booking.id"
        :booking="booking"
        @click="viewBooking"
        @status-change="handleStatusChange"
      />

      <!-- Empty State -->
      <UCard v-if="paginatedBookings.length === 0" class="bg-white dark:bg-gray-900">
        <div class="text-center py-12">
          <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No bookings found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters or create a new booking
          </p>
          <UButton color="primary" icon="i-lucide-plus" @click="createNewBooking">
            New Booking
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="page"
        :total="filteredBookings.length"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>
