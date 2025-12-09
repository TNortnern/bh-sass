<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const tenantId = route.params.id as string
const { startImpersonation } = useImpersonation()
const toast = useToast()

const { data: tenant, pending } = useLazyFetch(`/v1/admin/tenants/${tenantId}`, {
  credentials: 'include'
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
    await $fetch(`/v1/admin/tenants/${tenantId}/suspend`, {
      method: 'POST',
      body: { status: 'suspended' },
      credentials: 'include'
    })

    toast.add({
      title: 'Tenant suspended',
      description: 'The tenant has been suspended',
      color: 'success'
    })

    navigateTo('/admin/tenants')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.data?.message || 'Failed to suspend tenant',
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
        <UButton
          icon="i-lucide-arrow-left"
          label="Back to Tenants"
          variant="ghost"
          to="/admin/tenants"
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
              :color="tenant.plan === 'scale' ? 'warning' : tenant.plan === 'pro' ? 'purple' : 'primary'"
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

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1400px;
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

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.tenant-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: linear-gradient(180deg, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem;
  letter-spacing: -0.02em;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #737373;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 1rem;
  color: #e5e5e5;
  font-weight: 500;
}

.detail-link {
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1.25rem;
}

.metric-label {
  font-size: 0.8125rem;
  color: #737373;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.metric-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}
</style>
