<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Subscription {
  id: string
  tenant: string
  tenantSlug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'trialing' | 'suspended'
  monthlyRevenue: number
  startDate: string
  nextBillingDate?: string
}

interface SubscriptionsData {
  subscriptions: Subscription[]
  stats: {
    total: number
    active: number
    trialing: number
    suspended: number
    mrr: number
  }
}

// Fetch real subscription data
const { data, pending, error, refresh } = await useLazyFetch<SubscriptionsData>('/api/admin/subscriptions')

const subscriptions = computed(() => data.value?.subscriptions || [])
const subscriptionStats = computed(() => data.value?.stats || {
  total: 0,
  active: 0,
  trialing: 0,
  suspended: 0,
  mrr: 0
})

// Show error toast if fetch fails
const toast = useToast()
watch(error, (newError) => {
  if (newError) {
    toast.add({
      title: 'Error',
      description: 'Failed to load subscriptions',
      color: 'error'
    })
  }
})

const getPlanColor = (plan: string): 'neutral' | 'primary' | 'warning' | 'error' => {
  const colors: Record<string, 'neutral' | 'primary' | 'warning' | 'error'> = {
    free: 'neutral',
    growth: 'primary',
    pro: 'warning',
    scale: 'error'
  }
  return colors[plan] || 'neutral'
}

const getStatusColor = (status: string): 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    active: 'success',
    trialing: 'info',
    past_due: 'warning',
    canceled: 'error'
  }
  return colors[status] || 'neutral'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Subscriptions
        </h1>
        <p class="page-description">
          Manage platform subscriptions and billing
        </p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        label="Refresh"
        variant="outline"
        :loading="pending"
        @click="refresh()"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="flex items-center justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!pending"
      class="stats-grid"
    >
      <div class="stat-card stat-card-highlight">
        <div class="stat-icon-wrapper stat-icon-mrr">
          <UIcon
            name="i-lucide-dollar-sign"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ formatCurrency(subscriptionStats.mrr) }}</span>
          <span class="stat-label">Monthly Recurring Revenue</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-total">
          <UIcon
            name="i-lucide-credit-card"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ subscriptionStats.total }}</span>
          <span class="stat-label">Total Subscriptions</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-active">
          <UIcon
            name="i-lucide-check-circle"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ subscriptionStats.active }}</span>
          <span class="stat-label">Active</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-trial">
          <UIcon
            name="i-lucide-clock"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ subscriptionStats.trialing }}</span>
          <span class="stat-label">Trialing</span>
        </div>
      </div>
    </div>

    <!-- Subscriptions List -->
    <div
      v-if="!pending"
      class="subscriptions-container"
    >
      <div class="subscriptions-header">
        <h3 class="section-title">
          Active Subscriptions
        </h3>
      </div>

      <!-- Empty State -->
      <div
        v-if="!subscriptions.length"
        class="flex flex-col items-center justify-center py-16 text-gray-500"
      >
        <UIcon
          name="i-lucide-credit-card"
          class="text-6xl mb-4 text-gray-300"
        />
        <p class="text-lg font-medium">
          No Subscriptions Found
        </p>
        <p class="text-sm text-center max-w-sm">
          Tenant subscriptions will appear here once businesses sign up.
        </p>
      </div>

      <div
        v-else
        class="subscriptions-list"
      >
        <div
          v-for="sub in subscriptions"
          :key="sub.id"
          class="subscription-card"
        >
          <div class="subscription-main">
            <div class="subscription-tenant">
              <div class="tenant-avatar">
                {{ sub.tenant.charAt(0) }}
              </div>
              <div>
                <h4 class="tenant-name">
                  {{ sub.tenant }}
                </h4>
                <p class="tenant-slug">
                  {{ sub.tenantSlug }}
                </p>
              </div>
            </div>

            <div class="subscription-details">
              <div class="detail-group">
                <span class="detail-label">Plan</span>
                <UBadge
                  :label="sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)"
                  :color="getPlanColor(sub.plan)"
                  variant="subtle"
                />
              </div>
              <div class="detail-group">
                <span class="detail-label">Status</span>
                <UBadge
                  :label="sub.status.charAt(0).toUpperCase() + sub.status.slice(1)"
                  :color="getStatusColor(sub.status)"
                  variant="subtle"
                />
              </div>
              <div class="detail-group">
                <span class="detail-label">Monthly</span>
                <span class="detail-value">{{ formatCurrency(sub.monthlyRevenue) }}</span>
              </div>
              <div
                v-if="sub.nextBillingDate"
                class="detail-group"
              >
                <span class="detail-label">Next Billing</span>
                <span class="detail-value">{{ formatDate(sub.nextBillingDate) }}</span>
              </div>
            </div>
          </div>

          <div class="subscription-footer">
            <div class="payment-method payment-method-pending">
              <UIcon
                name="i-lucide-alert-circle"
                class="size-3.5"
              />
              <span>Payment integration coming soon</span>
            </div>
            <div class="subscription-actions">
              <UButton
                icon="i-lucide-external-link"
                label="View Tenant"
                variant="ghost"
                size="xs"
                color="neutral"
                :to="`/app/admin/tenants/${sub.id}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <UIcon
        name="i-lucide-info"
        class="size-5"
      />
      <div>
        <p class="info-title">
          Stripe Connect Integration
        </p>
        <p class="info-text">
          When complete, you'll be able to manage subscriptions, view payment history, handle refunds, and access detailed billing analytics directly from this dashboard. Each tenant's subscription will be linked to their Stripe Customer account.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

.admin-page {
  @apply p-8 max-w-[1920px] mx-auto;
}

.page-header {
  @apply flex items-start justify-between gap-4 mb-6 flex-wrap;
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

.stat-icon-mrr {
  background-color: rgb(220 252 231);
  color: rgb(22 163 74);
}
.dark .stat-icon-mrr {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-total {
  background-color: rgb(243 232 255);
  color: rgb(147 51 234);
}
.dark .stat-icon-total {
  background-color: rgba(168, 85, 247, 0.15);
  color: rgb(192 132 252);
}

.stat-icon-active {
  background-color: rgb(220 252 231);
  color: rgb(22 163 74);
}
.dark .stat-icon-active {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-trial {
  background-color: rgb(219 234 254);
  color: rgb(37 99 235);
}
.dark .stat-icon-trial {
  background-color: rgba(59, 130, 246, 0.15);
  color: rgb(96 165 250);
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

/* Subscriptions Container */
.subscriptions-container {
  @apply rounded-2xl overflow-hidden mb-6;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .subscriptions-container {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.subscriptions-header {
  @apply p-5;
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .subscriptions-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.section-title {
  @apply text-base font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .section-title {
  color: white;
}

.subscriptions-list {
  @apply flex flex-col;
}

.subscription-card {
  @apply p-5 transition-colors duration-200;
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .subscription-card {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.subscription-card:last-child {
  border-bottom: none;
}

.subscription-card:hover {
  background-color: rgb(249 250 251);
}
.dark .subscription-card:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.subscription-main {
  @apply flex items-center justify-between gap-6 flex-wrap;
}

.subscription-tenant {
  @apply flex items-center gap-3.5;
}

.tenant-avatar {
  @apply w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0;
  background-color: rgb(243 232 255);
  color: rgb(147 51 234);
}
.dark .tenant-avatar {
  background-color: rgba(168, 85, 247, 0.15);
  color: rgb(192 132 252);
}

.tenant-name {
  @apply text-sm font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .tenant-name {
  color: white;
}

.tenant-slug {
  @apply text-xs m-0;
  color: rgb(107 114 128);
}
.dark .tenant-slug {
  color: rgb(156 163 175);
}

.subscription-details {
  @apply flex items-center gap-8 flex-wrap;
}

.detail-group {
  @apply flex flex-col gap-1;
}

.detail-label {
  @apply text-xs uppercase tracking-wider;
  color: rgb(107 114 128);
}
.dark .detail-label {
  color: rgb(156 163 175);
}

.detail-value {
  @apply text-sm font-semibold;
  color: rgb(55 65 81);
}
.dark .detail-value {
  color: rgb(229 231 235);
}

.subscription-footer {
  @apply flex items-center justify-between mt-4 pt-4;
  border-top: 1px solid rgb(229 231 235);
}
.dark .subscription-footer {
  border-top-color: rgba(255, 255, 255, 0.04);
}

.payment-method {
  @apply flex items-center gap-2 text-xs;
  color: rgb(107 114 128);
}
.dark .payment-method {
  color: rgb(156 163 175);
}

.payment-method-pending {
  color: rgb(245 158 11);
}
.dark .payment-method-pending {
  color: rgb(251 191 36);
}

.subscription-actions {
  @apply flex gap-2;
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
</style>
