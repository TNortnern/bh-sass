<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Fetch real revenue data
const { data: revenueData, pending, error, refresh } = await useLazyFetch('/v1/admin/revenue')

// Computed properties for easier template access
const revenueStats = computed(() => {
  if (!revenueData.value?.data?.stats) {
    return {
      totalRevenue: 0,
      thisMonth: 0,
      lastMonth: 0,
      growthRate: 0,
      avgRevenuePerTenant: 0,
      transactionFees: 0
    }
  }
  return revenueData.value.data.stats
})

const revenueByPlan = computed(() => {
  if (!revenueData.value?.data?.revenueByPlan) {
    return []
  }
  return revenueData.value.data.revenueByPlan
})

const recentTransactions = computed(() => {
  if (!revenueData.value?.data?.recentTransactions) {
    return []
  }
  return revenueData.value.data.recentTransactions
})

const metrics = computed(() => {
  if (!revenueData.value?.data?.metrics) {
    return {
      mrr: 0,
      arr: 0,
      activeTenants: 0,
      totalTenants: 0,
      bookingsThisMonth: 0,
      bookingsLastMonth: 0
    }
  }
  return revenueData.value.data.metrics
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const formatRelativeTime = (date: string) => {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getTransactionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    subscription: 'Subscription',
    booking_fee: 'Booking Fee',
    refund: 'Refund'
  }
  return labels[type] || type
}

const getTransactionColor = (type: string): 'primary' | 'success' | 'error' | 'neutral' => {
  const colors: Record<string, 'primary' | 'success' | 'error' | 'neutral'> = {
    subscription: 'primary',
    booking_fee: 'success',
    refund: 'error'
  }
  return colors[type] || 'neutral'
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Revenue Analytics
        </h1>
        <p class="page-description">
          Platform revenue from subscriptions and transaction fees
        </p>
      </div>
      <div>
        <UButton
          icon="i-lucide-refresh-cw"
          label="Refresh"
          color="neutral"
          variant="outline"
          :loading="pending"
          @click="refresh()"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending && !revenueData"
      class="flex items-center justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="error-banner"
    >
      <div class="error-banner-icon-wrapper">
        <UIcon
          name="i-lucide-alert-triangle"
          class="error-banner-icon"
        />
      </div>
      <div class="banner-content">
        <h3 class="error-banner-title">
          Failed to Load Revenue Data
        </h3>
        <p class="banner-text">
          {{ error.message || 'An error occurred while fetching revenue data. Please try again.' }}
        </p>
      </div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-card-highlight">
          <div class="stat-icon-wrapper stat-icon-revenue">
            <UIcon
              name="i-lucide-wallet"
              class="stat-icon"
            />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatCurrency(revenueStats.totalRevenue) }}</span>
            <span class="stat-label">Annual Revenue Estimate</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-month">
            <UIcon
              name="i-lucide-calendar"
              class="stat-icon"
            />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatCurrency(revenueStats.thisMonth) }}</span>
            <span class="stat-label">This Month</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-growth">
            <UIcon
              name="i-lucide-trending-up"
              class="stat-icon"
            />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ revenueStats.growthRate >= 0 ? '+' : '' }}{{ revenueStats.growthRate.toFixed(1) }}%</span>
            <span class="stat-label">Growth Rate</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-avg">
            <UIcon
              name="i-lucide-users"
              class="stat-icon"
            />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatCurrency(revenueStats.avgRevenuePerTenant) }}</span>
            <span class="stat-label">Avg per Tenant</span>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Revenue by Plan -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">
              Revenue by Plan
            </h3>
          </div>
          <div
            v-if="revenueByPlan.length === 0"
            class="flex items-center justify-center py-12 text-gray-500"
          >
            <p>No revenue data available</p>
          </div>
          <template v-else>
            <div class="plan-revenue-list">
              <div
                v-for="plan in revenueByPlan"
                :key="plan.plan"
                class="plan-revenue-item"
              >
                <div class="plan-info">
                  <div
                    class="plan-indicator"
                    :style="{ backgroundColor: plan.color }"
                  />
                  <div class="plan-details">
                    <span class="plan-name">{{ plan.plan }}</span>
                    <span class="plan-tenants">{{ plan.tenants }} {{ plan.tenants === 1 ? 'tenant' : 'tenants' }}</span>
                  </div>
                </div>
                <div class="plan-amount">
                  {{ formatCurrency(plan.revenue) }}/mo
                </div>
              </div>
            </div>

            <!-- Simple Bar Chart -->
            <div class="chart-container">
              <div class="chart-bars">
                <div
                  v-for="plan in revenueByPlan"
                  :key="plan.plan"
                  class="chart-bar-wrapper"
                >
                  <div
                    class="chart-bar"
                    :style="{
                      height: `${revenueStats.thisMonth > 0 ? (plan.revenue / revenueStats.thisMonth) * 100 : 0}%`,
                      backgroundColor: plan.color
                    }"
                  />
                  <span class="chart-label">{{ plan.plan.charAt(0) }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Recent Transactions -->
        <div class="content-card">
          <div class="card-header">
            <h3 class="card-title">
              Recent Transactions
            </h3>
          </div>
          <div
            v-if="recentTransactions.length === 0"
            class="flex items-center justify-center py-12 text-gray-500"
          >
            <p>No transactions yet</p>
          </div>
          <div
            v-else
            class="transactions-list"
          >
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="transaction-item"
            >
              <div class="transaction-main">
                <div class="transaction-tenant">
                  {{ tx.tenant }}
                </div>
                <div class="transaction-meta">
                  <UBadge
                    :label="getTransactionTypeLabel(tx.type)"
                    :color="getTransactionColor(tx.type)"
                    variant="subtle"
                    size="sm"
                  />
                  <span class="transaction-time">{{ formatRelativeTime(tx.date) }}</span>
                </div>
              </div>
              <div class="transaction-amounts">
                <span class="transaction-amount">{{ formatCurrency(tx.amount) }}</span>
                <span
                  v-if="tx.fee > 0"
                  class="transaction-fee"
                >-{{ formatCurrency(tx.fee) }} fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <UIcon
              name="i-lucide-percent"
              class="metric-icon"
            />
            <span class="metric-label">Transaction Fees This Month</span>
          </div>
          <span class="metric-value">{{ formatCurrency(revenueStats.transactionFees) }}</span>
          <span class="metric-note">From booking transaction fees</span>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <UIcon
              name="i-lucide-arrow-up-right"
              class="metric-icon"
            />
            <span class="metric-label">Month over Month</span>
          </div>
          <span
            class="metric-value"
            :class="{ positive: revenueStats.thisMonth > revenueStats.lastMonth }"
          >{{ revenueStats.thisMonth >= revenueStats.lastMonth ? '+' : '' }}{{ formatCurrency(revenueStats.thisMonth - revenueStats.lastMonth) }}</span>
          <span class="metric-note">Compared to last month</span>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <UIcon
              name="i-lucide-trending-up"
              class="metric-icon"
            />
            <span class="metric-label">Monthly Recurring Revenue</span>
          </div>
          <span class="metric-value">{{ formatCurrency(metrics.mrr) }}</span>
          <span class="metric-note">From {{ metrics.activeTenants }} active tenants</span>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div class="content-grid">
        <div class="metric-card">
          <div class="metric-header">
            <UIcon
              name="i-lucide-calendar-check"
              class="metric-icon"
            />
            <span class="metric-label">Bookings This Month</span>
          </div>
          <span class="metric-value">{{ metrics.bookingsThisMonth }}</span>
          <span class="metric-note">
            {{ metrics.bookingsThisMonth >= metrics.bookingsLastMonth ? '+' : '' }}{{ metrics.bookingsThisMonth - metrics.bookingsLastMonth }} vs last month
          </span>
        </div>
        <div class="metric-card">
          <div class="metric-header">
            <UIcon
              name="i-lucide-users"
              class="metric-icon"
            />
            <span class="metric-label">Total Tenants</span>
          </div>
          <span class="metric-value">{{ metrics.totalTenants }}</span>
          <span class="metric-note">{{ metrics.activeTenants }} active, {{ metrics.totalTenants - metrics.activeTenants }} inactive</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

.admin-page {
  @apply p-8 max-w-[1920px] mx-auto;
}

.page-header {
  @apply flex items-start justify-between mb-6 gap-4;
}

.page-title {
  @apply text-3xl font-bold tracking-tight m-0;
  color: rgb(17 24 39);
}
.dark .page-title {
  color: white;
}

.page-description {
  @apply text-sm mt-2 mb-0;
  color: rgb(107 114 128);
}
.dark .page-description {
  color: rgb(156 163 175);
}

/* Coming Soon Banner */
.coming-soon-banner {
  @apply flex items-start gap-4 p-5 rounded-xl mb-6;
  background-color: rgb(255 251 235);
  border: 1px solid rgb(253 230 138);
}
.dark .coming-soon-banner {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.banner-icon-wrapper {
  @apply w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0;
  background-color: rgb(254 243 199);
}
.dark .banner-icon-wrapper {
  background-color: rgba(245, 158, 11, 0.15);
}

.banner-icon {
  @apply text-xl;
  color: rgb(245 158 11);
}
.dark .banner-icon {
  color: rgb(251 191 36);
}

.banner-content {
  @apply flex-1;
}

.banner-title {
  @apply text-base font-semibold m-0 mb-1;
  color: rgb(180 83 9);
}
.dark .banner-title {
  color: rgb(251 191 36);
}

.banner-text {
  @apply text-sm m-0 leading-relaxed;
  color: rgb(75 85 99);
}
.dark .banner-text {
  color: rgb(156 163 175);
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.stat-card {
  @apply flex items-center gap-4 p-5 rounded-xl transition-all duration-200;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .stat-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.stat-card:hover {
  @apply -translate-y-0.5;
  border-color: rgb(209 213 219);
}
.dark .stat-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.stat-card-highlight {
  background: linear-gradient(to bottom right, rgb(240 253 244), white);
  border-color: rgb(187 247 208);
}
.dark .stat-card-highlight {
  background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), #0f0f0f);
  border-color: rgba(34, 197, 94, 0.2);
}

.stat-icon-wrapper {
  @apply flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0;
}

.stat-icon-revenue {
  background-color: rgb(220 252 231);
  color: rgb(22 163 74);
}
.dark .stat-icon-revenue {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-month {
  background-color: rgb(224 231 255);
  color: rgb(79 70 229);
}
.dark .stat-icon-month {
  background-color: rgba(99, 102, 241, 0.15);
  color: rgb(129 140 248);
}

.stat-icon-growth {
  background-color: rgb(220 252 231);
  color: rgb(22 163 74);
}
.dark .stat-icon-growth {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-avg {
  background-color: rgb(254 243 199);
  color: rgb(217 119 6);
}
.dark .stat-icon-avg {
  background-color: rgba(245, 158, 11, 0.15);
  color: rgb(251 191 36);
}

.stat-icon {
  @apply text-2xl;
}

.stat-content {
  @apply flex flex-col gap-0.5;
}

.stat-value {
  @apply text-3xl font-bold tracking-tight leading-none;
  color: rgb(17 24 39);
}
.dark .stat-value {
  color: white;
}

.stat-label {
  @apply text-sm font-medium;
  color: rgb(107 114 128);
}
.dark .stat-label {
  color: rgb(156 163 175);
}

/* Preview Label */
.preview-label {
  @apply flex items-center gap-3 mb-4;
}

.preview-text {
  @apply text-xs;
  color: rgb(107 114 128);
}
.dark .preview-text {
  color: rgb(156 163 175);
}

/* Content Grid */
.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6;
}

.content-card {
  @apply rounded-2xl overflow-hidden;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .content-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.card-header {
  @apply p-5;
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.card-title {
  @apply text-base font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .card-title {
  color: white;
}

/* Plan Revenue */
.plan-revenue-list {
  @apply p-4 px-6;
}

.plan-revenue-item {
  @apply flex items-center justify-between py-3;
  border-bottom: 1px solid rgb(243 244 246);
}
.dark .plan-revenue-item {
  border-bottom-color: rgba(255, 255, 255, 0.04);
}

.plan-revenue-item:last-child {
  @apply border-b-0;
}

.plan-info {
  @apply flex items-center gap-3;
}

.plan-indicator {
  @apply w-3 h-3 rounded;
}

.plan-details {
  @apply flex flex-col;
}

.plan-name {
  @apply text-sm font-semibold;
  color: rgb(31 41 55);
}
.dark .plan-name {
  color: rgb(229 231 235);
}

.plan-tenants {
  @apply text-xs;
  color: rgb(107 114 128);
}
.dark .plan-tenants {
  color: rgb(156 163 175);
}

.plan-amount {
  @apply text-sm font-semibold;
  color: rgb(17 24 39);
}
.dark .plan-amount {
  color: white;
}

/* Chart */
.chart-container {
  @apply p-4 px-6 pb-6;
}

.chart-bars {
  @apply flex items-end justify-around h-24 gap-4;
}

.chart-bar-wrapper {
  @apply flex flex-col items-center gap-2 flex-1;
}

.chart-bar {
  @apply w-full max-w-10 rounded-t-md transition-all duration-500;
}

.chart-label {
  @apply text-xs font-medium;
  color: rgb(107 114 128);
}
.dark .chart-label {
  color: rgb(156 163 175);
}

/* Transactions */
.transactions-list {
  @apply py-2;
}

.transaction-item {
  @apply flex items-center justify-between px-6 py-4 transition-colors duration-200;
  border-bottom: 1px solid rgb(243 244 246);
}
.dark .transaction-item {
  border-bottom-color: rgba(255, 255, 255, 0.04);
}

.transaction-item:last-child {
  @apply border-b-0;
}

.transaction-item:hover {
  background-color: rgb(249 250 251);
}
.dark .transaction-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.transaction-main {
  @apply flex flex-col gap-1.5;
}

.transaction-tenant {
  @apply text-sm font-medium;
  color: rgb(31 41 55);
}
.dark .transaction-tenant {
  color: rgb(229 231 235);
}

.transaction-meta {
  @apply flex items-center gap-2;
}

.transaction-time {
  @apply text-xs;
  color: rgb(107 114 128);
}
.dark .transaction-time {
  color: rgb(156 163 175);
}

.transaction-amounts {
  @apply flex flex-col items-end gap-0.5;
}

.transaction-amount {
  @apply text-sm font-semibold;
  color: rgb(22 163 74);
}
.dark .transaction-amount {
  color: rgb(74 222 128);
}

.transaction-fee {
  @apply text-xs;
  color: rgb(107 114 128);
}
.dark .transaction-fee {
  color: rgb(156 163 175);
}

/* Metrics Grid */
.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4 mb-6;
}

.metric-card {
  @apply rounded-xl p-5 flex flex-col gap-2;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .metric-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.metric-header {
  @apply flex items-center gap-2;
}

.metric-icon {
  @apply text-base;
  color: rgb(107 114 128);
}
.dark .metric-icon {
  color: rgb(156 163 175);
}

.metric-label {
  @apply text-xs;
  color: rgb(107 114 128);
}
.dark .metric-label {
  color: rgb(156 163 175);
}

.metric-value {
  @apply text-2xl font-bold;
  color: rgb(17 24 39);
}
.dark .metric-value {
  color: white;
}

.metric-value.positive {
  color: rgb(22 163 74);
}
.dark .metric-value.positive {
  color: rgb(74 222 128);
}

.metric-note {
  @apply text-xs;
  color: rgb(156 163 175);
}
.dark .metric-note {
  color: rgb(107 114 128);
}

/* Info Banner */
.info-banner {
  @apply flex gap-4 p-5 rounded-xl;
  background-color: rgb(239 246 255);
  border: 1px solid rgb(191 219 254);
  color: rgb(37 99 235);
}
.dark .info-banner {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: rgb(96 165 250);
}

.info-title {
  @apply text-sm font-semibold m-0 mb-1;
  color: rgb(17 24 39);
}
.dark .info-title {
  color: white;
}

.info-text {
  @apply text-sm m-0 leading-relaxed;
  color: rgb(75 85 99);
}
.dark .info-text {
  color: rgb(156 163 175);
}

/* Error Banner */
.error-banner {
  @apply flex items-start gap-4 p-5 rounded-xl mb-6;
  background-color: rgb(254 242 242);
  border: 1px solid rgb(254 202 202);
}
.dark .error-banner {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.error-banner-icon-wrapper {
  @apply w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0;
  background-color: rgb(254 226 226);
}
.dark .error-banner-icon-wrapper {
  background-color: rgba(239, 68, 68, 0.15);
}

.error-banner-icon {
  @apply text-xl;
  color: rgb(220 38 38);
}
.dark .error-banner-icon {
  color: rgb(248 113 113);
}

.error-banner-title {
  @apply text-base font-semibold m-0 mb-1;
  color: rgb(185 28 28);
}
.dark .error-banner-title {
  color: rgb(248 113 113);
}
</style>
