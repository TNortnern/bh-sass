<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'suspended' | 'deleted'
  totalBookings: number
  monthlyRevenue: number
  stripeConnected: boolean
  rbPayloadTenantId: number | null
  rbPayloadSyncStatus: 'pending' | 'provisioned' | 'failed'
  rbPayloadSyncError: string | null
  createdAt: string
}

const { startImpersonation } = useImpersonation()
const toast = useToast()
const route = useRoute()

const searchQuery = ref('')
const selectedStatus = ref<string>('')
const selectedPlan = ref<string>(route.query.plan as string || '')
const selectedSyncStatus = ref<string>('')
const syncingTenantId = ref<string | null>(null)
const bulkSyncing = ref(false)

// Fetch tenants
const { data: tenants, pending, refresh } = useLazyFetch<Tenant[]>('/v1/admin/tenants', {
  credentials: 'include',
  query: computed(() => {
    const params: Record<string, string> = {}
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedStatus.value && selectedStatus.value !== 'all') params.status = selectedStatus.value
    if (selectedPlan.value && selectedPlan.value !== 'all') params.plan = selectedPlan.value
    if (selectedSyncStatus.value && selectedSyncStatus.value !== 'all') params.syncStatus = selectedSyncStatus.value
    return params
  })
})

const statusItems = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Deleted', value: 'deleted' }
]

const planItems = [
  { label: 'All Plans', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Growth', value: 'growth' },
  { label: 'Pro', value: 'pro' },
  { label: 'Scale', value: 'scale' }
]

const syncStatusItems = [
  { label: 'All Sync Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Provisioned', value: 'provisioned' },
  { label: 'Failed', value: 'failed' }
]

// Count of unsynced tenants
const unsyncedCount = computed(() => {
  if (!tenants.value) return 0
  return tenants.value.filter(t =>
    t.rbPayloadSyncStatus !== 'provisioned' || !t.rbPayloadTenantId
  ).length
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

const columns: TableColumn<Tenant>[] = [
  {
    accessorKey: 'name',
    header: 'Tenant',
    cell: ({ row }) => {
      const tenant = row.original
      return h('div', { class: 'tenant-cell' }, [
        h('div', { class: 'tenant-name' }, tenant.name),
        h('div', { class: 'tenant-slug' }, `@${tenant.slug}`)
      ])
    }
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => {
      const plan = row.getValue('plan') as string
      const planColors: Record<string, string> = {
        free: 'neutral',
        growth: 'primary',
        pro: 'purple',
        scale: 'warning'
      }
      return h(UBadge, {
        label: plan.charAt(0).toUpperCase() + plan.slice(1),
        color: planColors[plan] || 'neutral',
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusColors: Record<string, string> = {
        active: 'success',
        suspended: 'warning',
        deleted: 'error'
      }
      return h(UBadge, {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: statusColors[status] || 'neutral',
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'totalBookings',
    header: 'Bookings',
    cell: ({ row }) => row.getValue('totalBookings')
  },
  {
    accessorKey: 'monthlyRevenue',
    header: 'MRR',
    cell: ({ row }) => formatCurrency(row.getValue('monthlyRevenue') as number)
  },
  {
    accessorKey: 'stripeConnected',
    header: 'Stripe',
    cell: ({ row }) => {
      const connected = row.getValue('stripeConnected')
      return h(UBadge, {
        icon: connected ? 'i-lucide-check-circle' : 'i-lucide-x-circle',
        label: connected ? 'Connected' : 'Not Connected',
        color: connected ? 'success' : 'neutral',
        variant: 'subtle',
        size: 'sm'
      })
    }
  },
  {
    accessorKey: 'rbPayloadSyncStatus',
    header: 'Booking Sync',
    cell: ({ row }) => {
      const tenant = row.original
      const syncStatus = tenant.rbPayloadSyncStatus
      const syncColors: Record<string, string> = {
        pending: 'warning',
        provisioned: 'success',
        failed: 'error'
      }
      const syncIcons: Record<string, string> = {
        pending: 'i-lucide-clock',
        provisioned: 'i-lucide-check-circle',
        failed: 'i-lucide-x-circle'
      }
      const syncLabels: Record<string, string> = {
        pending: 'Pending',
        provisioned: tenant.rbPayloadTenantId ? `Synced (#${tenant.rbPayloadTenantId})` : 'Synced',
        failed: 'Failed'
      }
      return h('div', { class: 'flex flex-col gap-1' }, [
        h(UBadge, {
          icon: syncIcons[syncStatus] || 'i-lucide-help-circle',
          label: syncLabels[syncStatus] || syncStatus,
          color: syncColors[syncStatus] || 'neutral',
          variant: 'subtle',
          size: 'sm'
        }),
        tenant.rbPayloadSyncError
          ? h('span', {
              class: 'text-xs text-red-400 truncate max-w-[150px]',
              title: tenant.rbPayloadSyncError
            }, tenant.rbPayloadSyncError)
          : null
      ])
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string)
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const tenant = row.original
      const needsSync = tenant.rbPayloadSyncStatus !== 'provisioned' || !tenant.rbPayloadTenantId
      const isSyncing = syncingTenantId.value === tenant.id

      // Build menu items
      const items: Array<Array<{ label: string, icon: string, disabled?: boolean, onSelect: () => void }>> = [
        [{
          label: 'View Details',
          icon: 'i-lucide-eye',
          onSelect: () => navigateTo(`/app/admin/tenants/${tenant.id}`)
        }],
        [{
          label: 'Impersonate',
          icon: 'i-lucide-user-cog',
          onSelect: () => handleImpersonate(tenant.id)
        }],
        // Always show sync option - label indicates current status
        [{
          label: isSyncing ? 'Syncing...' : (needsSync ? 'Sync to rb-payload' : 'Re-sync to rb-payload'),
          icon: isSyncing ? 'i-lucide-loader-2' : 'i-lucide-refresh-cw',
          disabled: isSyncing,
          onSelect: () => handleSyncTenant(tenant.id)
        }],
        [{
          label: tenant.status === 'suspended' ? 'Activate' : 'Suspend',
          icon: tenant.status === 'suspended' ? 'i-lucide-play' : 'i-lucide-pause',
          onSelect: () => handleToggleSuspend(tenant.id, tenant.status)
        }]
      ]

      return h(UDropdownMenu, { items }, {
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

const handleImpersonate = async (tenantId: string) => {
  const result = await startImpersonation(tenantId)
  if (result.success) {
    // Navigation happens in the composable
  }
}

const handleToggleSuspend = async (tenantId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended'
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ($fetch as any)(`/v1/admin/tenants/${tenantId}/suspend`, {
      method: 'POST',
      body: { status: newStatus },
      credentials: 'include'
    })

    toast.add({
      title: 'Status updated',
      description: `Tenant ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`,
      color: 'success'
    })

    refresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.data?.message || 'Failed to update tenant status',
      color: 'error'
    })
  }
}

// Sync single tenant to rb-payload
const handleSyncTenant = async (tenantId: string) => {
  syncingTenantId.value = tenantId
  try {
    const result = await $fetch<{ success: boolean, message?: string, error?: string }>(`/v1/admin/tenants/${tenantId}/sync-rb-payload`, {
      method: 'POST',
      credentials: 'include'
    })

    if (result.success) {
      toast.add({
        title: 'Sync successful',
        description: result.message || 'Tenant synced to rb-payload',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Sync failed',
        description: result.error || 'Failed to sync tenant',
        color: 'error'
      })
    }

    refresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Sync error',
      description: err?.data?.error || err?.message || 'Failed to sync tenant to rb-payload',
      color: 'error'
    })
  } finally {
    syncingTenantId.value = null
  }
}

// Bulk sync all unsynced tenants
const handleBulkSync = async () => {
  bulkSyncing.value = true
  try {
    const result = await $fetch<{
      success: boolean
      message?: string
      error?: string
      results?: { synced: number, failed: number, skipped: number }
    }>('/v1/admin/tenants/sync-all-rb-payload', {
      method: 'POST',
      credentials: 'include'
    })

    if (result.success) {
      toast.add({
        title: 'Bulk sync completed',
        description: result.message || `${result.results?.synced || 0} tenants synced`,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Bulk sync failed',
        description: result.error || 'Failed to run bulk sync',
        color: 'error'
      })
    }

    refresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Bulk sync error',
      description: err?.data?.error || err?.message || 'Failed to run bulk sync',
      color: 'error'
    })
  } finally {
    bulkSyncing.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Tenants
        </h1>
        <p class="page-description">
          Manage all rental businesses on the platform
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="unsyncedCount > 0"
          icon="i-lucide-cloud-upload"
          :label="`Sync All (${unsyncedCount})`"
          color="primary"
          :loading="bulkSyncing"
          @click="handleBulkSync"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          label="Refresh"
          variant="outline"
          :loading="pending"
          @click="refresh"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Search tenants..."
        class="search-input"
      />
      <USelect
        v-model="selectedStatus"
        :items="statusItems"
        placeholder="Filter by status"
        class="filter-select"
      />
      <USelect
        v-model="selectedPlan"
        :items="planItems"
        placeholder="Filter by plan"
        class="filter-select"
      />
      <USelect
        v-model="selectedSyncStatus"
        :items="syncStatusItems"
        placeholder="Filter by sync"
        class="filter-select"
      />
    </div>

    <!-- Table -->
    <div class="table-container">
      <UTable
        :data="tenants || []"
        :columns="columns"
        :loading="pending"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="!pending && (!tenants || tenants.length === 0)"
      class="empty-state"
    >
      <UIcon
        name="i-lucide-building-2"
        class="empty-icon"
      />
      <p class="empty-title">
        No tenants found
      </p>
      <p class="empty-description">
        {{ searchQuery || (selectedStatus && selectedStatus !== 'all') || (selectedPlan && selectedPlan !== 'all') || (selectedSyncStatus && selectedSyncStatus !== 'all') ? 'Try adjusting your filters' : 'Tenants will appear here once they sign up' }}
      </p>
    </div>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

/* Page-specific styles extending global admin styles */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

/* Table styling for proper light/dark mode */
.table-container th {
  @apply font-semibold uppercase text-xs tracking-wider;
  color: rgb(107 114 128);
}
.dark .table-container th {
  color: rgb(156 163 175);
}

.table-container td {
  color: rgb(55 65 81);
}
.dark .table-container td {
  color: rgb(229 231 235);
}

.tenant-cell {
  @apply flex flex-col gap-1;
}

.tenant-name {
  @apply font-semibold;
  color: rgb(17 24 39);
}
.dark .tenant-name {
  color: white;
}

.tenant-slug {
  @apply text-sm;
  color: rgb(107 114 128);
}
.dark .tenant-slug {
  color: rgb(156 163 175);
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-icon {
  @apply text-6xl mb-4;
  color: rgb(209 213 219);
}
.dark .empty-icon {
  color: rgb(75 85 99);
}

.empty-title {
  @apply text-xl font-semibold m-0 mb-2;
  color: rgb(55 65 81);
}
.dark .empty-title {
  color: rgb(229 231 235);
}

.empty-description {
  @apply text-base m-0;
  color: rgb(107 114 128);
}
.dark .empty-description {
  color: rgb(156 163 175);
}
</style>
