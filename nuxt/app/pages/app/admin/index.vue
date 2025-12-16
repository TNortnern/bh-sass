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
        @click="() => refresh()"
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
            to="/app/admin/tenants"
            class="action-button"
          >
            <UIcon
              name="i-lucide-building-2"
              class="size-5"
            />
            <span>View All Tenants</span>
          </NuxtLink>
          <NuxtLink
            to="/app/admin/revenue"
            class="action-button"
          >
            <UIcon
              name="i-lucide-dollar-sign"
              class="size-5"
            />
            <span>Revenue Analytics</span>
          </NuxtLink>
          <NuxtLink
            to="/app/admin/system"
            class="action-button"
          >
            <UIcon
              name="i-lucide-activity"
              class="size-5"
            />
            <span>System Health</span>
          </NuxtLink>
          <NuxtLink
            to="/app/admin/audit"
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

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

/* Page-specific styles that extend global admin styles */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stat-icon {
  @apply w-11 h-11 rounded-xl flex items-center justify-center;
  background-color: rgb(219 234 254);
  border: 1px solid rgb(191 219 254);
  color: rgb(37 99 235);
}
.dark .stat-icon {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: rgb(96 165 250);
}

.system-icon {
  background-color: rgb(220 252 231);
  border-color: rgb(187 247 208);
  color: rgb(22 163 74);
}
.dark .system-icon {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: rgb(74 222 128);
}

.revenue-icon {
  background-color: rgb(243 232 255);
  border-color: rgb(233 213 255);
  color: rgb(147 51 234);
}
.dark .revenue-icon {
  background-color: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.2);
  color: rgb(192 132 252);
}

.stat-footer {
  @apply flex gap-6 pt-5;
  border-top: 1px solid rgb(229 231 235);
}
.dark .stat-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.stat-detail {
  @apply flex flex-col gap-1;
}

.detail-value {
  @apply text-lg font-bold;
  color: rgb(55 65 81);
}
.dark .detail-value {
  color: rgb(229 231 235);
}

.detail-value.success {
  color: rgb(22 163 74);
}
.dark .detail-value.success {
  color: rgb(74 222 128);
}

.detail-value.warning {
  color: rgb(217 119 6);
}
.dark .detail-value.warning {
  color: rgb(251 191 36);
}

.detail-value.error {
  color: rgb(220 38 38);
}
.dark .detail-value.error {
  color: rgb(248 113 113);
}

.detail-value.primary {
  color: rgb(37 99 235);
}
.dark .detail-value.primary {
  color: rgb(96 165 250);
}

.detail-label {
  @apply text-xs uppercase tracking-wider font-medium;
  color: rgb(107 114 128);
}
.dark .detail-label {
  color: rgb(156 163 175);
}

/* System Health Card */
.system-health-card { grid-column: span 2; }

.health-metrics {
  @apply grid grid-cols-3 gap-6 pt-5;
  border-top: 1px solid rgb(229 231 235);
}
.dark .health-metrics {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.health-metric {
  @apply flex flex-col gap-2;
}

.metric-label {
  @apply text-sm font-medium;
  color: rgb(107 114 128);
}
.dark .metric-label {
  color: rgb(156 163 175);
}

.metric-value {
  @apply text-2xl font-bold tracking-tight;
  color: rgb(17 24 39);
}
.dark .metric-value {
  color: white;
}

/* Subscriptions Card */
.subscriptions-card { grid-column: span 2; }

.subscription-tiers {
  @apply flex flex-col gap-5;
}

.tier-item {
  @apply flex flex-col gap-2;
}

.tier-info {
  @apply flex items-center justify-between;
}

.tier-name {
  @apply text-base font-semibold;
  color: rgb(55 65 81);
}
.dark .tier-name {
  color: rgb(229 231 235);
}

.tier-count {
  @apply text-sm font-semibold;
  color: rgb(107 114 128);
}
.dark .tier-count {
  color: rgb(156 163 175);
}

.tier-bar {
  @apply h-2 rounded overflow-hidden;
  background-color: rgb(243 244 246);
}
.dark .tier-bar {
  background-color: rgba(255, 255, 255, 0.05);
}

.tier-progress {
  @apply h-full rounded transition-all duration-500;
}

.tier-progress.free { background: linear-gradient(90deg, #6b7280 0%, #9ca3af 100%); }
.tier-progress.growth { background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%); }
.tier-progress.pro { background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%); }
.tier-progress.scale { background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%); }

/* Quick Actions */
.quick-actions {
  @apply grid grid-cols-2 gap-4;
}

.action-button {
  @apply flex items-center gap-3 p-4 rounded-lg no-underline transition-all duration-200 text-base font-medium;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(229 231 235);
  color: rgb(55 65 81);
}
.dark .action-button {
  background-color: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
  color: rgb(229 231 235);
}

.action-button:hover {
  @apply -translate-y-0.5;
  background-color: rgb(243 244 246);
  border-color: rgb(147 197 253);
}
.dark .action-button:hover {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(59, 130, 246, 0.3);
}

@media (max-width: 1024px) {
  .system-health-card, .subscriptions-card { grid-column: span 1; }
  .health-metrics { @apply grid-cols-1; }
  .quick-actions { @apply grid-cols-1; }
}
</style>
