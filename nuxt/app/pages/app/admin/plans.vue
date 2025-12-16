<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface PlanStats {
  subscriberCount: number
  monthlyRevenue: number
}

interface Plan {
  id: string
  name: string
  slug: string
  price: number
  features: string[]
  transactionFee: number
  isActive: boolean
  stats: PlanStats
}

// Fetch plans with real stats from API
const { data: plans, pending: loadingPlans, refresh } = await useLazyFetch<Plan[]>('/v1/admin/plans')

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const getPlanColor = (slug: string): 'neutral' | 'primary' | 'warning' => {
  const colors: Record<string, 'neutral' | 'primary' | 'warning'> = {
    free: 'neutral',
    growth: 'primary',
    pro: 'primary',
    scale: 'warning'
  }
  return colors[slug] || 'neutral'
}

// Calculate total metrics
const totalSubscribers = computed(() => {
  if (!plans.value) return 0
  return plans.value.reduce((sum, plan) => sum + plan.stats.subscriberCount, 0)
})

const totalMonthlyRevenue = computed(() => {
  if (!plans.value) return 0
  return plans.value.reduce((sum, plan) => sum + plan.stats.monthlyRevenue, 0)
})

// Navigate to tenants page filtered by plan
const viewSubscribers = (planSlug: string) => {
  navigateTo(`/app/admin/tenants?plan=${planSlug}`)
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Subscription Plans
        </h1>
        <p class="page-description">
          Manage platform pricing tiers and features
        </p>
      </div>
      <div class="page-actions">
        <UButton
          icon="i-lucide-refresh-cw"
          label="Refresh Stats"
          variant="outline"
          :loading="loadingPlans"
          @click="() => refresh()"
        />
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-icon-wrapper">
          <UIcon
            name="i-lucide-users"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <div class="stat-label">
            Total Subscribers
          </div>
          <div class="stat-value">
            {{ totalSubscribers }}
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper revenue">
          <UIcon
            name="i-lucide-dollar-sign"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <div class="stat-label">
            Monthly Recurring Revenue
          </div>
          <div class="stat-value">
            {{ formatCurrency(totalMonthlyRevenue) }}
          </div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper success">
          <UIcon
            name="i-lucide-trending-up"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <div class="stat-label">
            Annual Run Rate
          </div>
          <div class="stat-value">
            {{ formatCurrency(totalMonthlyRevenue * 12) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loadingPlans && !plans"
      class="loading-state"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
      <p class="text-gray-400 mt-4">
        Loading plans...
      </p>
    </div>

    <!-- Plans Grid -->
    <div
      v-else-if="plans && plans.length > 0"
      class="plans-grid"
    >
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :class="{ featured: plan.slug === 'pro' }"
      >
        <!-- Plan Header -->
        <div class="plan-header">
          <div class="header-top">
            <UBadge
              :label="plan.name"
              :color="getPlanColor(plan.slug)"
              variant="subtle"
              size="lg"
            />
            <UBadge
              v-if="plan.isActive"
              label="Active"
              color="success"
              variant="subtle"
              size="sm"
            />
          </div>

          <div class="plan-pricing">
            <div class="price-amount">
              {{ formatCurrency(plan.price) }}
              <span
                v-if="plan.price > 0"
                class="price-period"
              >/month</span>
            </div>
            <div class="transaction-fee">
              {{ plan.transactionFee }}% transaction fee
              <span v-if="plan.transactionFee > 0">+ Stripe fees</span>
              <span v-else>(Stripe fees only)</span>
            </div>
          </div>
        </div>

        <!-- Plan Features -->
        <div class="plan-features">
          <div class="features-label">
            Features
          </div>
          <ul class="features-list">
            <li
              v-for="(feature, index) in plan.features"
              :key="index"
              class="feature-item"
            >
              <UIcon
                name="i-lucide-check"
                class="feature-icon"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Plan Stats -->
        <div class="plan-stats">
          <div class="stat-item">
            <span class="stat-label">Active Subscriptions</span>
            <span class="stat-value">{{ plan.stats.subscriberCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Monthly Revenue</span>
            <span class="stat-value">{{ formatCurrency(plan.stats.monthlyRevenue) }}</span>
          </div>
        </div>

        <!-- Plan Actions -->
        <div class="plan-actions">
          <UButton
            label="View Subscribers"
            icon="i-lucide-users"
            variant="outline"
            block
            size="sm"
            :disabled="plan.stats.subscriberCount === 0"
            @click="viewSubscribers(plan.slug)"
          />
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
          Plan Configuration
        </p>
        <p class="info-text">
          Plans are defined in code and automatically tracked. Subscriber counts and revenue are calculated in real-time from active tenants.
          Transaction fees apply on top of Stripe's standard processing fees.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

/* Page-specific styles - most global styles inherited from main.css */
.page-header {
  @apply mb-8 flex justify-between items-start gap-6;
}

.page-actions {
  @apply flex gap-3;
}

/* Summary Stats */
.summary-stats {
  @apply grid gap-6 mb-8;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.stat-icon-wrapper {
  @apply w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0;
  background-color: rgb(243 232 255);
  border: 1px solid rgb(233 213 255);
}
.dark .stat-icon-wrapper {
  background-color: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.2);
}

.stat-icon-wrapper.revenue {
  background-color: rgb(220 252 231);
  border-color: rgb(187 247 208);
}
.dark .stat-icon-wrapper.revenue {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
}

.stat-icon-wrapper.success {
  background-color: rgb(219 234 254);
  border-color: rgb(191 219 254);
}
.dark .stat-icon-wrapper.success {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.stat-icon {
  @apply w-7 h-7;
  color: rgb(147 51 234);
}
.dark .stat-icon {
  color: rgb(192 132 252);
}

.stat-icon-wrapper.revenue .stat-icon {
  color: rgb(22 163 74);
}
.dark .stat-icon-wrapper.revenue .stat-icon {
  color: rgb(74 222 128);
}

.stat-icon-wrapper.success .stat-icon {
  color: rgb(37 99 235);
}
.dark .stat-icon-wrapper.success .stat-icon {
  color: rgb(96 165 250);
}

.stat-label {
  @apply text-sm mb-1.5 block;
  color: rgb(107 114 128);
}
.dark .stat-label {
  color: rgb(156 163 175);
}

.stat-value {
  @apply text-3xl font-bold tracking-tight leading-none;
  color: rgb(17 24 39);
}
.dark .stat-value {
  color: white;
}

/* Loading State */
.loading-state {
  @apply flex flex-col items-center justify-center py-16;
}

/* Plans Grid */
.plans-grid {
  @apply grid gap-6 mb-8;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.plan-card {
  @apply rounded-2xl p-7 flex flex-col gap-6 transition-all duration-300;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .plan-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.plan-card:hover {
  @apply -translate-y-0.5 shadow-xl;
  border-color: rgb(209 213 219);
}
.dark .plan-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.plan-card.featured {
  border-color: rgb(216 180 254);
  background: linear-gradient(180deg, rgb(249, 245, 255) 0%, white 100%);
}
.dark .plan-card.featured {
  border-color: rgba(168, 85, 247, 0.3);
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, #161616 100%);
}

.plan-header {
  @apply flex flex-col gap-6;
}

.header-top {
  @apply flex items-center justify-between;
}

.plan-pricing {
  @apply flex flex-col gap-2;
}

.price-amount {
  @apply text-4xl font-bold tracking-tight leading-none;
  color: rgb(17 24 39);
}
.dark .price-amount {
  color: white;
}

.price-period {
  @apply text-base font-normal;
  color: rgb(107 114 128);
}
.dark .price-period {
  color: rgb(156 163 175);
}

.transaction-fee {
  @apply text-sm font-medium;
  color: rgb(75 85 99);
}
.dark .transaction-fee {
  color: rgb(156 163 175);
}

/* Plan Features */
.plan-features {
  @apply flex flex-col gap-4 pt-6;
  border-top: 1px solid rgb(229 231 235);
}
.dark .plan-features {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.features-label {
  @apply text-sm font-semibold uppercase tracking-wider;
  color: rgb(107 114 128);
}
.dark .features-label {
  color: rgb(156 163 175);
}

.features-list {
  @apply list-none p-0 m-0 flex flex-col gap-3.5;
}

.feature-item {
  @apply flex items-start gap-3 text-sm;
  color: rgb(55 65 81);
}
.dark .feature-item {
  color: rgb(229 231 235);
}

.feature-icon {
  @apply w-4.5 h-4.5 flex-shrink-0 mt-0.5;
  color: rgb(22 163 74);
}
.dark .feature-icon {
  color: rgb(74 222 128);
}

/* Plan Stats */
.plan-stats {
  @apply flex flex-col gap-3.5 pt-6;
  border-top: 1px solid rgb(229 231 235);
}
.dark .plan-stats {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.stat-item {
  @apply flex justify-between items-center;
}

.plan-stats .stat-label {
  @apply text-sm;
  color: rgb(107 114 128);
}
.dark .plan-stats .stat-label {
  color: rgb(156 163 175);
}

.plan-stats .stat-value {
  @apply text-sm font-semibold;
  color: rgb(55 65 81);
}
.dark .plan-stats .stat-value {
  color: rgb(229 231 235);
}

/* Plan Actions */
.plan-actions {
  @apply mt-auto pt-6;
  border-top: 1px solid rgb(229 231 235);
}
.dark .plan-actions {
  border-top-color: rgba(255, 255, 255, 0.06);
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

@media (max-width: 1024px) {
  .plans-grid {
    @apply grid-cols-1;
  }

  .summary-stats {
    @apply grid-cols-1;
  }
}

@media (max-width: 768px) {
  .page-header {
    @apply flex-col items-start;
  }

  .page-actions {
    @apply w-full;
  }

  .stat-value {
    @apply text-2xl;
  }
}
</style>
