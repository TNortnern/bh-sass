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
  createdAt: string
}

const { startImpersonation } = useImpersonation()
const toast = useToast()

const searchQuery = ref('')
const selectedStatus = ref<string>('')
const selectedPlan = ref<string>('')

// Fetch tenants
const { data: tenants, pending, refresh } = useLazyFetch<Tenant[]>('/v1/admin/tenants', {
  credentials: 'include',
  query: {
    search: searchQuery,
    status: selectedStatus,
    plan: selectedPlan
  }
})

const statusItems = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Deleted', value: 'deleted' }
]

const planItems = [
  { label: 'All Plans', value: '' },
  { label: 'Free', value: 'free' },
  { label: 'Growth', value: 'growth' },
  { label: 'Pro', value: 'pro' },
  { label: 'Scale', value: 'scale' }
]

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
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string)
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const tenant = row.original
      return h(UDropdown, {
        items: [
          [{
            label: 'View Details',
            icon: 'i-lucide-eye',
            click: () => navigateTo(`/admin/tenants/${tenant.id}`)
          }],
          [{
            label: 'Impersonate',
            icon: 'i-lucide-user-cog',
            click: () => handleImpersonate(tenant.id)
          }],
          [{
            label: tenant.status === 'suspended' ? 'Activate' : 'Suspend',
            icon: tenant.status === 'suspended' ? 'i-lucide-play' : 'i-lucide-pause',
            click: () => handleToggleSuspend(tenant.id, tenant.status)
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

const handleImpersonate = async (tenantId: string) => {
  const result = await startImpersonation(tenantId)
  if (result.success) {
    // Navigation happens in the composable
  }
}

const handleToggleSuspend = async (tenantId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended'
  try {
    await $fetch(`/v1/admin/tenants/${tenantId}/suspend`, {
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
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.data?.message || 'Failed to update tenant status',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Tenants</h1>
        <p class="page-description">Manage all rental businesses on the platform</p>
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
    <div v-if="!pending && (!tenants || tenants.length === 0)" class="empty-state">
      <UIcon name="i-lucide-building-2" class="empty-icon" />
      <p class="empty-title">No tenants found</p>
      <p class="empty-description">
        {{ searchQuery || selectedStatus || selectedPlan ? 'Try adjusting your filters' : 'Tenants will appear here once they sign up' }}
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

.tenant-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tenant-name {
  font-weight: 600;
  color: #ffffff;
}

.tenant-slug {
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
