<template>
  <div class="bookings-list-page">
    <NoTenantAlert v-if="!hasTenant" />
    <div
      v-else
      class="space-y-4"
    >
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
              Bookings
            </h1>
            <p class="text-gray-600 dark:text-slate-400 text-lg">
              Manage your bounce house rentals and reservations
            </p>
          </div>

          <UButton
            color="primary"
            size="lg"
            icon="i-lucide-plus"
            class="rounded-xl"
            @click="navigateTo('/app/bookings/new')"
          >
            New Booking
          </UButton>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{
              body: 'p-5'
            }"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Total Bookings
                </div>
                <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ stats.total }}
                </div>
              </div>
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <UIcon
                  name="i-lucide-clipboard-list"
                  class="w-6 h-6 text-blue-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{
              body: 'p-5'
            }"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Confirmed
                </div>
                <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ stats.confirmed }}
                </div>
              </div>
              <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-6 h-6 text-green-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{
              body: 'p-5'
            }"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Total Revenue
                </div>
                <div class="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {{ formatCurrency(stats.totalRevenue) }}
                </div>
              </div>
              <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <UIcon
                  name="i-lucide-dollar-sign"
                  class="w-6 h-6 text-amber-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{
              body: 'p-5'
            }"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Outstanding
                </div>
                <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ formatCurrency(stats.outstandingBalance) }}
                </div>
              </div>
              <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <UIcon
                  name="i-lucide-alert-circle"
                  class="w-6 h-6 text-red-500"
                />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Search and Filters -->
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="Search by booking number, customer name, or email..."
              size="lg"
              class="w-full bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 rounded-xl"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-search"
                  class="w-5 h-5 text-gray-500 dark:text-slate-500"
                />
              </template>
              <template
                v-if="searchQuery"
                #trailing
              >
                <UButton
                  color="neutral"
                  variant="link"
                  icon="i-lucide-x"
                  :padded="false"
                  @click="clearSearch"
                />
              </template>
            </UInput>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-filter"
            class="rounded-xl"
            @click="showFilters = !showFilters"
          >
            Filters
            <UBadge
              v-if="activeFiltersCount > 0"
              color="primary"
              size="xs"
              class="ml-2"
            >
              {{ activeFiltersCount }}
            </UBadge>
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-download"
            class="rounded-xl"
            @click="handleExport"
          >
            Export
          </UButton>
        </div>

        <!-- Filter Panel -->
        <div
          v-if="showFilters"
          class="mt-4 p-6 bg-gray-100 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700/50 animate-slide-down"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Status
              </label>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="status in availableStatuses"
                  :key="status.value"
                  :color="selectedStatuses.includes(status.value) ? 'primary' : 'neutral'"
                  :variant="selectedStatuses.includes(status.value) ? 'solid' : 'outline'"
                  size="sm"
                  class="rounded-full"
                  @click="toggleStatus(status.value)"
                >
                  {{ status.label }}
                  <UIcon
                    v-if="selectedStatuses.includes(status.value)"
                    name="i-lucide-check"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
              </div>
            </div>

            <!-- Payment Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Payment Status
              </label>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="status in availablePaymentStatuses"
                  :key="status.value"
                  :color="selectedPaymentStatuses.includes(status.value) ? 'primary' : 'neutral'"
                  :variant="selectedPaymentStatuses.includes(status.value) ? 'solid' : 'outline'"
                  size="sm"
                  class="rounded-full"
                  @click="togglePaymentStatus(status.value)"
                >
                  {{ status.label }}
                  <UIcon
                    v-if="selectedPaymentStatuses.includes(status.value)"
                    name="i-lucide-check"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
              </div>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Date Range
              </label>
              <div class="space-y-3">
                <UInput
                  v-model="dateFilters.start"
                  type="date"
                  size="md"
                  class="w-full bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 rounded-lg"
                />
                <UInput
                  v-model="dateFilters.end"
                  type="date"
                  size="md"
                  class="w-full bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 rounded-lg"
                />
              </div>
            </div>

            <!-- Total Amount Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Total Amount
              </label>
              <div class="space-y-3">
                <UInput
                  v-model.number="amountFilters.min"
                  type="number"
                  placeholder="Min"
                  size="md"
                  class="w-full bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 rounded-lg"
                >
                  <template #leading>
                    <span class="text-gray-600 dark:text-slate-500">$</span>
                  </template>
                </UInput>
                <UInput
                  v-model.number="amountFilters.max"
                  type="number"
                  placeholder="Max"
                  size="md"
                  class="w-full bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 rounded-lg"
                >
                  <template #leading>
                    <span class="text-gray-600 dark:text-slate-500">$</span>
                  </template>
                </UInput>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <UButton
              color="primary"
              size="md"
              class="rounded-lg"
              @click="applyFilters"
            >
              Apply Filters
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="rounded-lg"
              @click="clearFilters"
            >
              Clear All
            </UButton>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Toolbar -->
      <div
        v-if="selectedBookings.length > 0"
        class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-check-circle"
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
          <span class="text-sm font-medium text-blue-900 dark:text-blue-200">
            {{ selectedBookings.length }} booking(s) selected
          </span>
        </div>
        <div class="flex items-center gap-2">
          <UDropdownMenu :items="bulkActions">
            <UButton
              color="primary"
              variant="outline"
              size="md"
            >
              Bulk Actions
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 ml-1"
              />
            </UButton>
          </UDropdownMenu>
          <UButton
            color="neutral"
            variant="ghost"
            size="md"
            @click="selectedBookings = []"
          >
            Clear Selection
          </UButton>
        </div>
      </div>

      <!-- Bookings Table -->
      <UCard
        class="bg-white dark:bg-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
        :ui="{
          body: 'p-0'
        }"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/50">
              <tr>
                <th class="px-6 py-4 w-12">
                  <UCheckbox
                    :model-value="selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0"
                    @update:model-value="toggleSelectAll"
                  />
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Booking #
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Customer
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Item
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Dates
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Payment
                </th>
                <th class="text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Total
                </th>
                <th class="text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4 w-12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700/30">
              <tr
                v-for="booking in paginatedBookings"
                :key="booking.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors cursor-pointer"
                @click="handleRowClick(booking)"
              >
                <td
                  class="px-6 py-5"
                  @click.stop
                >
                  <UCheckbox
                    :model-value="isSelected(booking.id)"
                    @update:model-value="toggleSelect(booking.id)"
                  />
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <span class="font-mono font-semibold text-gray-900 dark:text-slate-200">
                    {{ booking.bookingNumber }}
                  </span>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-slate-200">
                      {{ booking.customer.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-slate-400">
                      {{ booking.customer.email }}
                    </div>
                  </div>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-slate-200">
                      {{ booking.item.name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-slate-400">
                      {{ formatCurrency(booking.item.dailyRate) }}/day
                    </div>
                  </div>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <div>
                    <div class="font-medium text-gray-900 dark:text-slate-200">
                      {{ formatDate(booking.dates.start) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-slate-400">
                      to {{ formatDate(booking.dates.end) }}
                    </div>
                  </div>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <UBadge
                    :color="getStatusColor(booking.status)"
                    variant="subtle"
                  >
                    {{ formatStatus(booking.status) }}
                  </UBadge>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                  <UBadge
                    :color="getPaymentColor(booking.paymentStatus)"
                    variant="subtle"
                  >
                    {{ formatPaymentStatus(booking.paymentStatus) }}
                  </UBadge>
                </td>
                <td class="text-sm px-6 py-5 text-right">
                  <div class="font-semibold text-amber-400">
                    {{ formatCurrency(booking.payment.total) }}
                  </div>
                  <div
                    v-if="booking.payment.balance > 0"
                    class="text-xs text-red-400"
                  >
                    {{ formatCurrency(booking.payment.balance) }} due
                  </div>
                </td>
                <td
                  class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5"
                  @click.stop
                >
                  <div class="flex justify-end">
                    <UDropdownMenu :items="getBookingActions(booking)">
                      <UButton
                        icon="i-lucide-more-vertical"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                      />
                    </UDropdownMenu>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Loading State -->
          <div
            v-if="isLoading || !hasFetched"
            class="flex justify-center py-12"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 animate-spin text-gray-500 dark:text-slate-500"
            />
          </div>

          <!-- Empty State (no bookings at all) -->
          <div
            v-else-if="hasFetched && bookings.length === 0"
            class="text-center py-16"
          >
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center">
              <UIcon
                name="i-lucide-calendar-plus"
                class="w-10 h-10 text-gray-400 dark:text-slate-600"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
              No bookings yet
            </h3>
            <p class="text-gray-600 dark:text-slate-500 mb-6">
              Get started by creating your first booking
            </p>
            <UButton
              color="primary"
              size="lg"
              class="rounded-xl"
              @click="navigateTo('/app/bookings/new')"
            >
              <UIcon
                name="i-lucide-plus"
                class="w-5 h-5 mr-2"
              />
              New Booking
            </UButton>
          </div>

          <!-- Empty State (filtered results empty) -->
          <div
            v-else-if="hasFetched && bookings.length > 0 && paginatedBookings.length === 0"
            class="text-center py-16"
          >
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center">
              <UIcon
                name="i-lucide-calendar-x"
                class="w-10 h-10 text-gray-400 dark:text-slate-600"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
              No bookings found
            </h3>
            <p class="text-gray-600 dark:text-slate-500 mb-6">
              {{ searchQuery || activeFiltersCount > 0 ? 'Try adjusting your search or filters' : 'Get started by creating your first booking' }}
            </p>
            <UButton
              v-if="!searchQuery && activeFiltersCount === 0"
              color="primary"
              size="lg"
              class="rounded-xl"
              @click="navigateTo('/app/bookings/new')"
            >
              <UIcon
                name="i-lucide-plus"
                class="w-5 h-5 mr-2"
              />
              New Booking
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Pagination -->
      <div
        v-if="paginatedBookings.length > 0"
        class="flex items-center justify-between mt-6"
      >
        <div class="text-sm text-gray-600 dark:text-slate-400">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, displayedBookings.length) }} of {{ displayedBookings.length }} bookings
        </div>

        <UPagination
          v-model="currentPage"
          :page-count="pageSize"
          :total="displayedBookings.length"
          class="flex items-center gap-1"
        />
      </div>

      <!-- Cancel Booking Modal -->
      <UModal
        v-model:open="showCancelModal"
        title="Cancel Booking"
      >
        <template #content>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-x-circle"
                  class="text-red-600 dark:text-red-400 text-xl"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Cancel Booking
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p class="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to cancel booking
              <strong>{{ bookingToCancel?.bookingNumber }}</strong>
              for <strong>{{ bookingToCancel?.customer.name }}</strong>?
            </p>

            <UTextarea
              v-model="cancelReason"
              placeholder="Cancellation reason (optional)"
              :rows="3"
              class="mb-4 bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500 rounded-xl"
            />

            <div class="flex justify-end gap-3">
              <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="showCancelModal = false"
              />
              <UButton
                label="Confirm Cancellation"
                color="error"
                icon="i-lucide-x-circle"
                @click="confirmCancel"
              />
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, parseISO } from 'date-fns'
import type { Booking } from '~/composables/useBookings'
import NoTenantAlert from '~/components/NoTenantAlert.vue'

definePageMeta({
  layout: 'dashboard'
})

const { bookings, filteredBookings, filters, stats, fetchBookings, updateStatus, bulkUpdateStatus, cancelBooking, isLoading } = useBookings()
const toast = useToast()
const { currentUser } = useAuth()

// Track if initial fetch is complete
const hasFetched = ref(false)

// Check if user has tenant ID assigned
const hasTenant = computed(() => {
  return currentUser.value?.tenantId !== null && currentUser.value?.tenantId !== undefined
})

const searchQuery = ref('')
const showFilters = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedBookings = ref<string[]>([])
const showCancelModal = ref(false)
const bookingToCancel = ref<Booking | null>(null)
const cancelReason = ref('')

const selectedStatuses = ref<string[]>([])
const selectedPaymentStatuses = ref<string[]>([])
const dateFilters = reactive({
  start: '',
  end: ''
})
const amountFilters = reactive({
  min: undefined as number | undefined,
  max: undefined as number | undefined
})

const availableStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const availablePaymentStatuses = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' }
]

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedStatuses.value.length > 0) count++
  if (selectedPaymentStatuses.value.length > 0) count++
  if (dateFilters.start || dateFilters.end) count++
  if (amountFilters.min !== undefined || amountFilters.max !== undefined) count++
  return count
})

// Apply all filters to bookings
const displayedBookings = computed(() => {
  let result = [...filteredBookings.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.bookingNumber.toLowerCase().includes(search)
      || b.customer.name.toLowerCase().includes(search)
      || b.customer.email.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedStatuses.value.length > 0) {
    result = result.filter(b => selectedStatuses.value.includes(b.status))
  }

  // Payment status filter
  if (selectedPaymentStatuses.value.length > 0) {
    result = result.filter(b => selectedPaymentStatuses.value.includes(b.paymentStatus))
  }

  // Date range filter
  if (dateFilters.start && dateFilters.end) {
    result = result.filter((b) => {
      const bookingStart = parseISO(b.dates.start)
      const rangeStart = parseISO(dateFilters.start)
      const rangeEnd = parseISO(dateFilters.end)
      return bookingStart >= rangeStart && bookingStart <= rangeEnd
    })
  }

  // Amount filter
  if (amountFilters.min !== undefined) {
    result = result.filter(b => b.payment.total >= amountFilters.min!)
  }
  if (amountFilters.max !== undefined) {
    result = result.filter(b => b.payment.total <= amountFilters.max!)
  }

  return result
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return displayedBookings.value.slice(start, end)
})

// Load bookings on mount
onMounted(async () => {
  await fetchBookings()
  hasFetched.value = true
})

// Watch search query
watch(searchQuery, () => {
  currentPage.value = 1
})

function clearSearch() {
  searchQuery.value = ''
}

function toggleStatus(status: string) {
  const index = selectedStatuses.value.indexOf(status)
  if (index === -1) {
    selectedStatuses.value.push(status)
  } else {
    selectedStatuses.value.splice(index, 1)
  }
}

function togglePaymentStatus(status: string) {
  const index = selectedPaymentStatuses.value.indexOf(status)
  if (index === -1) {
    selectedPaymentStatuses.value.push(status)
  } else {
    selectedPaymentStatuses.value.splice(index, 1)
  }
}

function applyFilters() {
  currentPage.value = 1
  // Filters are already reactive
}

function clearFilters() {
  selectedStatuses.value = []
  selectedPaymentStatuses.value = []
  dateFilters.start = ''
  dateFilters.end = ''
  amountFilters.min = undefined
  amountFilters.max = undefined
  currentPage.value = 1
}

function toggleSelectAll() {
  if (selectedBookings.value.length === paginatedBookings.value.length) {
    selectedBookings.value = []
  } else {
    selectedBookings.value = paginatedBookings.value.map(b => b.id)
  }
}

function toggleSelect(id: string) {
  const index = selectedBookings.value.indexOf(id)
  if (index === -1) {
    selectedBookings.value.push(id)
  } else {
    selectedBookings.value.splice(index, 1)
  }
}

function isSelected(id: string) {
  return selectedBookings.value.includes(id)
}

const bulkActions = [[
  {
    label: 'Confirm Selected',
    icon: 'i-lucide-check-circle',
    onSelect: () => handleBulkAction('confirmed')
  },
  {
    label: 'Mark as Delivered',
    icon: 'i-lucide-truck',
    onSelect: () => handleBulkAction('delivered')
  }
], [
  {
    label: 'Cancel Selected',
    icon: 'i-lucide-x-circle',
    color: 'error',
    onSelect: () => handleBulkAction('cancelled')
  }
]]

async function handleBulkAction(status: Booking['status']) {
  await bulkUpdateStatus(selectedBookings.value, status)
  selectedBookings.value = []
}

function handleRowClick(booking: Booking) {
  navigateTo(`/app/bookings/${booking.id}`)
}

function getBookingActions(booking: Booking) {
  return [[
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/app/bookings/${booking.id}`)
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/app/bookings/${booking.id}/edit`)
    },
    {
      label: 'View Customer',
      icon: 'i-lucide-user',
      onSelect: () => navigateTo(`/app/customers/${booking.customer.id}`)
    }
  ], [
    {
      label: 'Send Email',
      icon: 'i-lucide-mail',
      onSelect: () => console.log('Send email', booking.id)
    },
    {
      label: 'Print',
      icon: 'i-lucide-printer',
      onSelect: () => console.log('Print', booking.id)
    }
  ], [
    {
      label: 'Cancel Booking',
      icon: 'i-lucide-x-circle',
      color: 'error',
      onSelect: () => openCancelDialog(booking)
    }
  ]]
}

function openCancelDialog(booking: Booking) {
  bookingToCancel.value = booking
  showCancelModal.value = true
}

async function confirmCancel() {
  if (!bookingToCancel.value) return

  await cancelBooking(bookingToCancel.value.id, cancelReason.value)
  showCancelModal.value = false
  bookingToCancel.value = null
  cancelReason.value = ''
  await fetchBookings()
}

function handleExport() {
  if (displayedBookings.value.length === 0) {
    toast.add({
      title: 'No bookings to export',
      description: 'Add some bookings first before exporting.',
      color: 'warning'
    })
    return
  }

  // Create CSV content
  const headers = ['Booking #', 'Customer', 'Email', 'Item', 'Start Date', 'End Date', 'Status', 'Payment Status', 'Total', 'Balance']
  const rows = displayedBookings.value.map(b => [
    b.bookingNumber,
    b.customer.name,
    b.customer.email,
    b.item.name,
    b.dates.start,
    b.dates.end,
    b.status,
    b.paymentStatus,
    b.payment.total,
    b.payment.balance
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)

  toast.add({
    title: 'Export successful',
    description: `Exported ${displayedBookings.value.length} bookings to CSV.`,
    color: 'success'
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy')
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    unpaid: 'Unpaid',
    deposit: 'Deposit Paid',
    paid: 'Paid in Full',
    refunded: 'Refunded'
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' {
  const colors: Record<string, 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'> = {
    pending: 'warning',
    confirmed: 'success',
    delivered: 'primary',
    completed: 'neutral',
    cancelled: 'error'
  }
  return colors[status] || 'neutral'
}

function getPaymentColor(status: string): 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' {
  const colors: Record<string, 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'> = {
    unpaid: 'error',
    deposit: 'warning',
    paid: 'success',
    refunded: 'neutral'
  }
  return colors[status] || 'neutral'
}
</script>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>
