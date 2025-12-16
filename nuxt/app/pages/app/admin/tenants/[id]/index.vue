<script setup lang="ts">
interface TenantDetails {
  id: string
  name: string
  slug: string
  plan: string
  status: 'active' | 'suspended' | 'deleted'
  createdAt: string
  stripeConnected: boolean
  rbPayloadTenantId: number | null
  rbPayloadSyncStatus: 'pending' | 'provisioned' | 'failed'
  rbPayloadSyncError: string | null
  businessInfo?: {
    email?: string
    phone?: string
    website?: string
  }
  totalBookings?: number
  monthlyRevenue?: number
  totalUsers?: number
  totalInventory?: number
}

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const tenantId = route.params.id as string
const { startImpersonation } = useImpersonation()
const toast = useToast()

const syncing = ref(false)

const { data: tenant, pending, refresh } = useLazyFetch<TenantDetails>(`/v1/admin/tenants/${tenantId}`, {
  credentials: 'include'
})

// Computed property to check if tenant needs sync
const needsSync = computed(() => {
  if (!tenant.value) return false
  return tenant.value.rbPayloadSyncStatus !== 'provisioned' || !tenant.value.rbPayloadTenantId
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const handleImpersonate = async () => {
  await startImpersonation(tenantId)
}

const handleSuspend = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ($fetch as any)(`/v1/admin/tenants/${tenantId}/suspend`, {
      method: 'POST',
      body: { status: 'suspended' },
      credentials: 'include'
    })

    toast.add({
      title: 'Tenant suspended',
      description: 'The tenant has been suspended',
      color: 'success'
    })

    navigateTo('/app/admin/tenants')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.data?.message || 'Failed to suspend tenant',
      color: 'error'
    })
  }
}

// Sync tenant to rb-payload
const handleSyncTenant = async () => {
  syncing.value = true
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
    syncing.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <UButton
          icon="i-lucide-arrow-left"
          label="Back to Tenants"
          variant="ghost"
          to="/app/admin/tenants"
          class="mb-4"
        />
        <h1
          v-if="tenant"
          class="page-title"
        >
          {{ tenant.name }}
        </h1>
        <p
          v-if="tenant"
          class="page-description"
        >
          @{{ tenant.slug }}
        </p>
      </div>
      <div class="header-actions">
        <UButton
          v-if="needsSync"
          :icon="syncing ? 'i-lucide-loader-2' : 'i-lucide-refresh-cw'"
          :label="syncing ? 'Syncing...' : 'Sync to rb-payload'"
          color="primary"
          :loading="syncing"
          @click="handleSyncTenant"
        />
        <UButton
          icon="i-lucide-user-cog"
          label="Impersonate"
          variant="outline"
          @click="handleImpersonate"
        />
        <UButton
          icon="i-lucide-pause"
          label="Suspend"
          color="error"
          variant="outline"
          @click="handleSuspend"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="loading-state"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Tenant Details -->
    <div
      v-else-if="tenant"
      class="tenant-details"
    >
      <!-- Overview Section -->
      <div class="detail-section">
        <h2 class="section-title">
          Overview
        </h2>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Plan</span>
            <UBadge
              :label="tenant.plan"
              :color="tenant.plan === 'scale' ? 'warning' : tenant.plan === 'pro' ? 'secondary' : 'primary'"
              variant="subtle"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <UBadge
              :label="tenant.status"
              :color="tenant.status === 'active' ? 'success' : 'warning'"
              variant="subtle"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">Created</span>
            <span class="detail-value">{{ formatDate(tenant.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Stripe Connected</span>
            <UBadge
              :icon="tenant.stripeConnected ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
              :label="tenant.stripeConnected ? 'Connected' : 'Not Connected'"
              :color="tenant.stripeConnected ? 'success' : 'neutral'"
              variant="subtle"
            />
          </div>
          <div class="detail-item">
            <span class="detail-label">Booking Sync</span>
            <div class="flex flex-col gap-1">
              <UBadge
                :icon="tenant.rbPayloadSyncStatus === 'provisioned' ? 'i-lucide-check-circle' : tenant.rbPayloadSyncStatus === 'pending' ? 'i-lucide-clock' : 'i-lucide-x-circle'"
                :label="tenant.rbPayloadSyncStatus === 'provisioned' && tenant.rbPayloadTenantId ? `Synced (#${tenant.rbPayloadTenantId})` : tenant.rbPayloadSyncStatus === 'pending' ? 'Pending' : 'Failed'"
                :color="tenant.rbPayloadSyncStatus === 'provisioned' ? 'success' : tenant.rbPayloadSyncStatus === 'pending' ? 'warning' : 'error'"
                variant="subtle"
              />
              <span
                v-if="tenant.rbPayloadSyncError"
                class="text-xs text-red-500 dark:text-red-400"
              >
                {{ tenant.rbPayloadSyncError }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Info -->
      <div class="detail-section">
        <h2 class="section-title">
          Business Information
        </h2>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ tenant.businessInfo?.email || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Phone</span>
            <span class="detail-value">{{ tenant.businessInfo?.phone || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Website</span>
            <a
              v-if="tenant.businessInfo?.website"
              :href="tenant.businessInfo.website"
              target="_blank"
              class="detail-link"
            >
              {{ tenant.businessInfo.website }}
            </a>
            <span
              v-else
              class="detail-value"
            >N/A</span>
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="detail-section">
        <h2 class="section-title">
          Metrics
        </h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">
              Total Bookings
            </div>
            <div class="metric-value">
              {{ tenant.totalBookings || 0 }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">
              Monthly Revenue
            </div>
            <div class="metric-value">
              {{ formatCurrency(tenant.monthlyRevenue || 0) }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">
              Total Users
            </div>
            <div class="metric-value">
              {{ tenant.totalUsers || 0 }}
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">
              Total Inventory
            </div>
            <div class="metric-value">
              {{ tenant.totalInventory || 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

/* Page-specific styles extending global admin styles */
.admin-page {
  @apply max-w-6xl;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-actions {
  @apply flex gap-3;
}

.tenant-details {
  @apply flex flex-col gap-6;
}

.detail-section {
  @apply rounded-2xl p-7;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .detail-section {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.section-title {
  @apply text-xl font-bold m-0 mb-6 tracking-tight;
  color: rgb(17 24 39);
}
.dark .section-title {
  color: white;
}

.detail-grid {
  @apply grid gap-6;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.detail-item {
  @apply flex flex-col gap-2;
}

.detail-label {
  @apply text-sm font-medium uppercase tracking-wider;
  color: rgb(107 114 128);
}
.dark .detail-label {
  color: rgb(156 163 175);
}

.detail-value {
  @apply text-base font-medium;
  color: rgb(55 65 81);
}
.dark .detail-value {
  color: rgb(229 231 235);
}

.detail-link {
  @apply text-base font-medium no-underline hover:underline;
  color: rgb(37 99 235);
}
.dark .detail-link {
  color: rgb(96 165 250);
}

.metrics-grid {
  @apply grid gap-5;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.metric-card {
  @apply rounded-xl p-5;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
}
.dark .metric-card {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
}

.metric-label {
  @apply text-sm font-medium uppercase tracking-wider mb-3;
  color: rgb(107 114 128);
}
.dark .metric-label {
  color: rgb(156 163 175);
}

.metric-value {
  @apply text-3xl font-bold tracking-tight;
  color: rgb(17 24 39);
}
.dark .metric-value {
  color: white;
}
</style>
