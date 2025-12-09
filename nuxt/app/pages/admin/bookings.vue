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

const statusItems = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const tenantItems = computed(() => {
  if (!tenants.value) return [{ label: 'All Tenants', value: '' }]
  return [
    { label: 'All Tenants', value: '' },
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
const UDropdown = resolveComponent('UDropdown')

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
      return h(UDropdown, {
        items: [
          [{
            label: 'View Details',
            icon: 'i-lucide-eye',
            click: () => navigateTo(`/admin/bookings/${booking.id}`)
          }],
          [{
            label: 'View Tenant',
            icon: 'i-lucide-building-2',
            click: () => navigateTo(`/admin/tenants/${booking.tenantId}`)
          }]
        ]
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
          View bookings across all tenants
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

    <!-- Filters -->
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
  </div>
</template>

<style scoped>
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
  color: #ffffff;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0.5rem 0 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  background: linear-gradient(180deg, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
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
  color: #ffffff;
}

.tenant-name,
.customer-email {
  font-size: 0.8125rem;
  color: #737373;
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
  color: #404040;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0 0 0.5rem;
}

.empty-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0;
}
</style>
