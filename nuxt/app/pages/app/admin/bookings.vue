<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Booking {
  id: string
  bookingNumber: string
  tenantName: string
  tenantId: string
  customerName: string
  customerEmail: string
  itemName: string
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: string
}

const searchQuery = ref('')
const selectedStatus = ref<string>('')
const selectedTenant = ref<string>('')
const toast = useToast()

// Fetch all bookings across tenants
const { data: bookings, pending, refresh } = useLazyFetch<Booking[]>('/v1/admin/bookings', {
  credentials: 'include',
  query: {
    search: searchQuery,
    status: selectedStatus,
    tenantId: selectedTenant
  }
})

// Fetch tenants for filter
const { data: tenants } = useLazyFetch<Array<{ id: string, name: string }>>('/v1/admin/tenants', {
  credentials: 'include'
})

// Computed stats
const bookingStats = computed(() => {
  if (!bookings.value) return { total: 0, confirmed: 0, totalRevenue: 0, pending: 0 }
  return {
    total: bookings.value.length,
    confirmed: bookings.value.filter(b => b.status === 'confirmed' || b.status === 'delivered' || b.status === 'completed').length,
    pending: bookings.value.filter(b => b.status === 'pending').length,
    totalRevenue: bookings.value
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  }
})

const statusItems = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const tenantItems = computed(() => {
  if (!tenants.value) return [{ label: 'All Tenants', value: 'all' }]
  return [
    { label: 'All Tenants', value: 'all' },
    ...tenants.value.map(t => ({ label: t.name, value: String(t.id) }))
  ]
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// Modal state
const showCancelModal = ref(false)
const selectedBooking = ref<Booking | null>(null)

const handleCancelBooking = (booking: Booking) => {
  selectedBooking.value = booking
  showCancelModal.value = true
}

const confirmCancelBooking = async () => {
  if (!selectedBooking.value) return

  try {
    // TODO: Implement actual cancel API call to rb-payload
    toast.add({
      title: 'Booking cancelled',
      description: `Booking ${selectedBooking.value.bookingNumber} has been cancelled`,
      color: 'warning'
    })
    showCancelModal.value = false
    selectedBooking.value = null
    await refresh()
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to cancel booking',
      color: 'error'
    })
  }
}

const columns: TableColumn<Booking>[] = [
  {
    accessorKey: 'bookingNumber',
    header: 'Booking #',
    cell: ({ row }) => {
      const booking = row.original
      return h('div', { class: 'booking-cell' }, [
        h('div', { class: 'booking-number' }, booking.bookingNumber),
        h('div', { class: 'tenant-name' }, booking.tenantName)
      ])
    }
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => {
      const booking = row.original
      return h('div', { class: 'customer-cell' }, [
        h('div', { class: 'customer-name' }, booking.customerName),
        h('div', { class: 'customer-email' }, booking.customerEmail)
      ])
    }
  },
  {
    accessorKey: 'itemName',
    header: 'Item'
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.getValue('startDate') as string)
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => formatDate(row.getValue('endDate') as string)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColors: Record<string, string> = {
        pending: 'warning',
        confirmed: 'success',
        in_progress: 'primary',
        delivered: 'primary',
        completed: 'neutral',
        cancelled: 'error'
      }
      return h(UBadge, {
        label: status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        color: statusColors[status] || 'neutral',
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.getValue('totalPrice') as number)
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const booking = row.original
      const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed'

      return h(UDropdownMenu, {
        items: [
          [{
            label: 'View Details',
            icon: 'i-lucide-eye',
            onSelect: () => navigateTo(`/app/admin/bookings/${booking.id}`)
          }],
          [{
            label: 'View Tenant',
            icon: 'i-lucide-building-2',
            onSelect: () => navigateTo(`/app/admin/tenants/${booking.tenantId}`)
          }],
          canCancel
            ? [{
                label: 'Cancel Booking',
                icon: 'i-lucide-x-circle',
                color: 'error',
                onSelect: () => handleCancelBooking(booking)
              }]
            : []
        ].filter(group => group.length > 0)
      }, {
        default: () => h(UButton, {
          icon: 'i-lucide-more-vertical',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm'
        })
      })
    }
  }
]
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          All Bookings
        </h1>
        <p class="page-description">
          View and manage bookings across all tenants
        </p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        label="Refresh"
        variant="outline"
        :loading="pending"
        @click="refresh"
      />
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-total">
          <UIcon
            name="i-lucide-calendar"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ bookingStats.total }}</span>
          <span class="stat-label">Total Bookings</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-confirmed">
          <UIcon
            name="i-lucide-check-circle"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ bookingStats.confirmed }}</span>
          <span class="stat-label">Confirmed</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-pending">
          <UIcon
            name="i-lucide-clock"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ bookingStats.pending }}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-revenue">
          <UIcon
            name="i-lucide-dollar-sign"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatCurrency(bookingStats.totalRevenue) }}</span>
          <span class="stat-label">Total Revenue</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search bookings..."
          class="search-input"
        />
        <USelect
          v-model="selectedTenant"
          :items="tenantItems"
          placeholder="Filter by tenant"
          class="filter-select"
        />
        <USelect
          v-model="selectedStatus"
          :items="statusItems"
          placeholder="Filter by status"
          class="filter-select"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <UTable
        :data="bookings || []"
        :columns="columns"
        :loading="pending"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="!pending && (!bookings || bookings.length === 0)"
      class="empty-state"
    >
      <UIcon
        name="i-lucide-calendar"
        class="empty-icon"
      />
      <p class="empty-title">
        No bookings found
      </p>
      <p class="empty-description">
        {{ searchQuery || selectedStatus || selectedTenant ? 'Try adjusting your filters' : 'Bookings will appear here once tenants start making reservations' }}
      </p>
    </div>

    <!-- Cancel Booking Modal -->
    <UModal
      v-model:open="showCancelModal"
      title="Cancel Booking"
    >
      <template #content>
        <div
          v-if="selectedBooking"
          class="modal-content"
        >
          <div class="modal-header">
            <div class="modal-icon-wrapper">
              <UIcon
                name="i-lucide-alert-triangle"
                class="modal-icon"
              />
            </div>
            <div>
              <h3 class="modal-title">
                Cancel Booking
              </h3>
              <p class="modal-description">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div class="modal-body">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to cancel booking
              <strong class="text-gray-900 dark:text-white">{{ selectedBooking.bookingNumber }}</strong>
              for <strong class="text-gray-900 dark:text-white">{{ selectedBooking.customerName }}</strong>
              ({{ selectedBooking.tenantName }})?
            </p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Item:</span>
                <span class="detail-value">{{ selectedBooking.itemName }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dates:</span>
                <span class="detail-value">{{ formatDate(selectedBooking.startDate) }} - {{ formatDate(selectedBooking.endDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value">{{ formatCurrency(selectedBooking.totalPrice) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <UButton
              label="Keep Booking"
              variant="outline"
              @click="showCancelModal = false"
            />
            <UButton
              label="Cancel Booking"
              color="error"
              icon="i-lucide-x-circle"
              @click="confirmCancelBooking"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

.admin-page {
  padding: 2rem;
  max-width: 1920px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0;
  color: rgb(17 24 39);
}
.dark .page-title {
  color: white;
}

.page-description {
  font-size: 0.9375rem;
  margin: 0.5rem 0 0;
  color: rgb(107 114 128);
}
.dark .page-description {
  color: rgb(156 163 175);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .stat-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.stat-card:hover {
  transform: translateY(-1px);
  border-color: rgb(209 213 219);
}
.dark .stat-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-icon-total {
  background-color: rgb(243 232 255);
  color: rgb(147 51 234);
}
.dark .stat-icon-total {
  background-color: rgba(168, 85, 247, 0.15);
  color: rgb(192 132 252);
}

.stat-icon-confirmed {
  background-color: rgb(220 252 231);
  color: rgb(22 163 74);
}
.dark .stat-icon-confirmed {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-pending {
  background-color: rgb(254 243 199);
  color: rgb(217 119 6);
}
.dark .stat-icon-pending {
  background-color: rgba(245, 158, 11, 0.15);
  color: rgb(251 191 36);
}

.stat-icon-revenue {
  background-color: rgb(219 234 254);
  color: rgb(37 99 235);
}
.dark .stat-icon-revenue {
  background-color: rgba(59, 130, 246, 0.15);
  color: rgb(96 165 250);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: rgb(17 24 39);
}
.dark .stat-value {
  color: white;
}

.stat-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(107 114 128);
}
.dark .stat-label {
  color: rgb(156 163 175);
}

/* Filters Card */
.filters-card {
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .filters-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 180px;
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .table-container {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.booking-cell,
.customer-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.booking-number,
.customer-name {
  font-weight: 600;
  color: rgb(17 24 39);
}
.dark .booking-number,
.dark .customer-name {
  color: white;
}

.tenant-name,
.customer-email {
  font-size: 0.8125rem;
  color: rgb(107 114 128);
}
.dark .tenant-name,
.dark .customer-email {
  color: rgb(156 163 175);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: rgb(209 213 219);
}
.dark .empty-icon {
  color: rgb(75 85 99);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: rgb(17 24 39);
}
.dark .empty-title {
  color: rgb(229 231 235);
}

.empty-description {
  font-size: 0.9375rem;
  margin: 0;
  color: rgb(107 114 128);
}
.dark .empty-description {
  color: rgb(156 163 175);
}

/* Modal Styles */
.modal-content {
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: rgb(254 226 226);
}
.dark .modal-icon-wrapper {
  background-color: rgba(239, 68, 68, 0.15);
}

.modal-icon {
  font-size: 1.5rem;
  color: rgb(220 38 38);
}
.dark .modal-icon {
  color: rgb(248 113 113);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: rgb(17 24 39);
}
.dark .modal-title {
  color: white;
}

.modal-description {
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
  color: rgb(107 114 128);
}
.dark .modal-description {
  color: rgb(156 163 175);
}

.modal-body {
  margin-bottom: 1.5rem;
}

.booking-details {
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
}
.dark .booking-details {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem;
  color: rgb(107 114 128);
}
.dark .detail-label {
  color: rgb(156 163 175);
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
}
.dark .detail-value {
  color: rgb(229 231 235);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(229 231 235);
}
.dark .modal-actions {
  border-top-color: rgba(255, 255, 255, 0.08);
}
</style>
