<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { data: stats, pending, refresh } = useLazyFetch<{
  tenants: {
    total: number
    active: number
    suspended: number
    newThisMonth: number
  }
  subscriptions: {
    free: number
    growth: number
    pro: number
    scale: number
  }
  revenue: {
    mrr: number
    totalPlatformFees: number
    growth: number
  }
  systemHealth: {
    status: 'healthy' | 'degraded' | 'down'
    apiRequests24h: number
    errorRate: number
    avgResponseTime: number
  }
}>('/v1/admin/stats', {
  credentials: 'include'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const statusColor = computed(() => {
  const status = stats.value?.systemHealth?.status
  if (status === 'healthy') return 'success'
  if (status === 'degraded') return 'warning'
  return 'error'
})
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Platform Overview
        </h1>
        <p class="page-description">
          Real-time metrics and system health for BouncePro
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

    <!-- Loading State -->
    <div
      v-if="pending && !stats"
      class="loading-state"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Stats Content -->
    <div
      v-else-if="stats"
      class="stats-grid"
    >
      <!-- System Health Card -->
      <div class="stat-card system-health-card">
        <div class="stat-header">
          <div class="stat-icon system-icon">
            <UIcon
              name="i-lucide-activity"
              class="size-5"
            />
          </div>
          <UBadge
            :label="stats.systemHealth.status"
            :color="statusColor"
            variant="subtle"
            size="sm"
          />
        </div>
        <div class="stat-value">
          System Health
        </div>
        <div class="health-metrics">
          <div class="health-metric">
            <span class="metric-label">API Requests (24h)</span>
            <span class="metric-value">{{ formatNumber(stats.systemHealth.apiRequests24h) }}</span>
          </div>
          <div class="health-metric">
            <span class="metric-label">Error Rate</span>
            <span class="metric-value">{{ stats.systemHealth.errorRate.toFixed(2) }}%</span>
          </div>
          <div class="health-metric">
            <span class="metric-label">Avg Response</span>
            <span class="metric-value">{{ stats.systemHealth.avgResponseTime }}ms</span>
          </div>
        </div>
      </div>

      <!-- Tenants Card -->
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <UIcon
              name="i-lucide-building-2"
              class="size-5"
            />
          </div>
          <span class="stat-label">Total Tenants</span>
        </div>
        <div class="stat-value">
          {{ formatNumber(stats.tenants.total) }}
        </div>
        <div class="stat-footer">
          <div class="stat-detail">
            <span class="detail-value success">{{ stats.tenants.active }}</span>
            <span class="detail-label">Active</span>
          </div>
          <div class="stat-detail">
            <span class="detail-value warning">{{ stats.tenants.suspended }}</span>
            <span class="detail-label">Suspended</span>
          </div>
          <div class="stat-detail">
            <span class="detail-value primary">+{{ stats.tenants.newThisMonth }}</span>
            <span class="detail-label">New This Month</span>
          </div>
        </div>
      </div>

      <!-- MRR Card -->
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon revenue-icon">
            <UIcon
              name="i-lucide-trending-up"
              class="size-5"
            />
          </div>
          <span class="stat-label">Monthly Recurring Revenue</span>
        </div>
        <div class="stat-value">
          {{ formatCurrency(stats.revenue.mrr) }}
        </div>
        <div class="stat-footer">
          <div class="stat-detail">
            <span
              class="detail-value"
              :class="stats.revenue.growth >= 0 ? 'success' : 'error'"
            >
              {{ stats.revenue.growth >= 0 ? '+' : '' }}{{ stats.revenue.growth.toFixed(1) }}%
            </span>
            <span class="detail-label">Growth</span>
          </div>
          <div class="stat-detail">
            <span class="detail-value">{{ formatCurrency(stats.revenue.totalPlatformFees) }}</span>
            <span class="detail-label">Platform Fees</span>
          </div>
        </div>
      </div>

      <!-- Subscriptions Distribution -->
      <div class="stat-card subscriptions-card">
        <div class="stat-header">
          <div class="stat-icon">
            <UIcon
              name="i-lucide-credit-card"
              class="size-5"
            />
          </div>
          <span class="stat-label">Subscription Distribution</span>
        </div>
        <div class="subscription-tiers">
          <div class="tier-item">
            <div class="tier-info">
              <span class="tier-name">Free</span>
              <span class="tier-count">{{ stats.subscriptions.free }}</span>
            </div>
            <div class="tier-bar">
              <div
                class="tier-progress free"
                :style="{ width: `${(stats.subscriptions.free / stats.tenants.total) * 100}%` }"
              />
            </div>
          </div>
          <div class="tier-item">
            <div class="tier-info">
              <span class="tier-name">Growth</span>
              <span class="tier-count">{{ stats.subscriptions.growth }}</span>
            </div>
            <div class="tier-bar">
              <div
                class="tier-progress growth"
                :style="{ width: `${(stats.subscriptions.growth / stats.tenants.total) * 100}%` }"
              />
            </div>
          </div>
          <div class="tier-item">
            <div class="tier-info">
              <span class="tier-name">Pro</span>
              <span class="tier-count">{{ stats.subscriptions.pro }}</span>
            </div>
            <div class="tier-bar">
              <div
                class="tier-progress pro"
                :style="{ width: `${(stats.subscriptions.pro / stats.tenants.total) * 100}%` }"
              />
            </div>
          </div>
          <div class="tier-item">
            <div class="tier-info">
              <span class="tier-name">Scale</span>
              <span class="tier-count">{{ stats.subscriptions.scale }}</span>
            </div>
            <div class="tier-bar">
              <div
                class="tier-progress scale"
                :style="{ width: `${(stats.subscriptions.scale / stats.tenants.total) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="stat-card quick-actions-card">
        <div class="stat-header">
          <div class="stat-icon">
            <UIcon
              name="i-lucide-zap"
              class="size-5"
            />
          </div>
          <span class="stat-label">Quick Actions</span>
        </div>
        <div class="quick-actions">
          <NuxtLink
            to="/admin/tenants"
            class="action-button"
          >
            <UIcon
              name="i-lucide-building-2"
              class="size-5"
            />
            <span>View All Tenants</span>
          </NuxtLink>
          <NuxtLink
            to="/admin/revenue"
            class="action-button"
          >
            <UIcon
              name="i-lucide-dollar-sign"
              class="size-5"
            />
            <span>Revenue Analytics</span>
          </NuxtLink>
          <NuxtLink
            to="/admin/system"
            class="action-button"
          >
            <UIcon
              name="i-lucide-activity"
              class="size-5"
            />
            <span>System Health</span>
          </NuxtLink>
          <NuxtLink
            to="/admin/audit"
            class="action-button"
          >
            <UIcon
              name="i-lucide-file-text"
              class="size-5"
            />
            <span>Audit Logs</span>
          </NuxtLink>
        </div>
      </div>
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

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Stat Cards */
.stat-card {
  background: linear-gradient(180deg, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.system-icon {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.revenue-icon {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.stat-label {
  font-size: 0.875rem;
  color: #a3a3a3;
  font-weight: 500;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
  line-height: 1;
}

.stat-footer {
  display: flex;
  gap: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-detail {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #e5e5e5;
}

.detail-value.success {
  color: #22c55e;
}

.detail-value.warning {
  color: #f59e0b;
}

.detail-value.error {
  color: #ef4444;
}

.detail-value.primary {
  color: #3b82f6;
}

.detail-label {
  font-size: 0.75rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* System Health Card */
.system-health-card {
  grid-column: span 2;
}

.health-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.health-metric {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-label {
  font-size: 0.8125rem;
  color: #737373;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

/* Subscriptions Card */
.subscriptions-card {
  grid-column: span 2;
}

.subscription-tiers {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tier-item {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tier-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tier-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
}

.tier-count {
  font-size: 0.875rem;
  color: #a3a3a3;
  font-weight: 600;
}

.tier-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.tier-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.tier-progress.free {
  background: linear-gradient(90deg, #6b7280 0%, #9ca3af 100%);
}

.tier-progress.growth {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.tier-progress.pro {
  background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
}

.tier-progress.scale {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #e5e5e5;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .system-health-card,
  .subscriptions-card {
    grid-column: span 1;
  }

  .health-metrics {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
