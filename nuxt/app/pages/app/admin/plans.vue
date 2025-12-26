<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const toast = useToast()

interface PlanLimits {
  maxItems: number
  maxBookings: number
  maxUsers: number
}

interface PlanFeature {
  feature: string
}

interface PlanStats {
  subscriberCount: number
  monthlyRevenue: number
  annualRevenue: number
}

interface Plan {
  id: string
  name: string
  slug: string
  price: number
  annualPrice?: number
  description?: string
  displayOrder?: number
  transactionFee: number
  features?: PlanFeature[]
  limits?: PlanLimits
  stripePriceId?: string
  stripeAnnualPriceId?: string
  highlighted?: boolean
  active: boolean
  stats: PlanStats
}

// Fetch plans with real stats from API
const { data: plans, pending: loadingPlans, refresh } = await useLazyFetch<Plan[]>('/v1/admin/plans')

// Edit modal state
const showEditModal = ref(false)
const editingPlan = ref<Plan | null>(null)
const editForm = ref({
  name: '',
  price: 0,
  annualPrice: 0,
  transactionFee: 0,
  description: '',
  displayOrder: 0,
  highlighted: false,
  active: true,
  limits: {
    maxItems: 10,
    maxBookings: 50,
    maxUsers: 1
  },
  stripePriceId: '',
  stripeAnnualPriceId: ''
})
const isSaving = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value)
}

const formatCurrencyFromCents = (cents: number) => {
  return formatCurrency(cents / 100)
}

const getPlanColor = (slug: string): 'neutral' | 'primary' | 'warning' => {
  const colors: Record<string, 'neutral' | 'primary' | 'warning'> = {
    free: 'neutral',
    growth: 'primary',
    pro: 'primary',
    scale: 'warning',
    platinum: 'warning'
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

// Open edit modal
const openEditModal = (plan: Plan) => {
  editingPlan.value = plan
  editForm.value = {
    name: plan.name,
    price: plan.price,
    annualPrice: plan.annualPrice || 0,
    transactionFee: plan.transactionFee,
    description: plan.description || '',
    displayOrder: plan.displayOrder || 0,
    highlighted: plan.highlighted || false,
    active: plan.active,
    limits: {
      maxItems: plan.limits?.maxItems || 10,
      maxBookings: plan.limits?.maxBookings || 50,
      maxUsers: plan.limits?.maxUsers || 1
    },
    stripePriceId: plan.stripePriceId || '',
    stripeAnnualPriceId: plan.stripeAnnualPriceId || ''
  }
  showEditModal.value = true
}

// Save plan changes
const savePlan = async () => {
  if (!editingPlan.value) return

  isSaving.value = true
  try {
    await $fetch(`/v1/admin/plans/${editingPlan.value.id}`, {
      method: 'PATCH',
      body: editForm.value
    })

    toast.add({
      title: 'Plan Updated',
      description: `${editForm.value.name} has been updated successfully`,
      color: 'success'
    })

    showEditModal.value = false
    await refresh()
  } catch (error) {
    console.error('Failed to save plan:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update plan. Please try again.',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

// Format limit display
const formatLimit = (value: number) => {
  return value === -1 ? 'Unlimited' : value.toLocaleString()
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
          Configure pricing, limits, and features for each plan
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
        :class="{ featured: plan.highlighted }"
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
            <div class="header-badges">
              <UBadge
                v-if="plan.highlighted"
                label="Featured"
                color="warning"
                variant="subtle"
                size="sm"
              />
              <UBadge
                :label="plan.active ? 'Active' : 'Inactive'"
                :color="plan.active ? 'success' : 'error'"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>

          <div class="plan-pricing">
            <div class="price-amount">
              {{ formatCurrencyFromCents(plan.price) }}
              <span
                v-if="plan.price > 0"
                class="price-period"
              >/month</span>
            </div>
            <div
              v-if="plan.annualPrice"
              class="annual-price"
            >
              {{ formatCurrencyFromCents(plan.annualPrice) }}/year (save {{ Math.round((1 - plan.annualPrice / (plan.price * 12)) * 100) }}%)
            </div>
            <div class="transaction-fee">
              {{ plan.transactionFee }}% platform fee
              <span v-if="plan.transactionFee > 0">+ Stripe fees</span>
              <span v-else>(Stripe fees only)</span>
            </div>
          </div>
        </div>

        <!-- Plan Limits -->
        <div class="plan-limits">
          <div class="limits-label">
            Limits
          </div>
          <div class="limits-grid">
            <div class="limit-item">
              <span class="limit-value">{{ formatLimit(plan.limits?.maxItems || 0) }}</span>
              <span class="limit-label">Items</span>
            </div>
            <div class="limit-item">
              <span class="limit-value">{{ formatLimit(plan.limits?.maxBookings || 0) }}</span>
              <span class="limit-label">Bookings/mo</span>
            </div>
            <div class="limit-item">
              <span class="limit-value">{{ formatLimit(plan.limits?.maxUsers || 0) }}</span>
              <span class="limit-label">Team Members</span>
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
              v-for="(feature, index) in (plan.features || []).slice(0, 4)"
              :key="index"
              class="feature-item"
            >
              <UIcon
                name="i-lucide-check"
                class="feature-icon"
              />
              <span>{{ feature.feature || feature }}</span>
            </li>
            <li
              v-if="(plan.features?.length || 0) > 4"
              class="feature-item more"
            >
              +{{ (plan.features?.length || 0) - 4 }} more features
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
            label="Edit Plan"
            icon="i-lucide-pencil"
            variant="soft"
            size="sm"
            @click="openEditModal(plan)"
          />
          <UButton
            label="View Subscribers"
            icon="i-lucide-users"
            variant="outline"
            size="sm"
            :disabled="plan.stats.subscriberCount === 0"
            @click="viewSubscribers(plan.slug)"
          />
        </div>
      </div>
    </div>

    <!-- Edit Plan Modal -->
    <UModal
      v-model:open="showEditModal"
      :title="`Edit ${editingPlan?.name || 'Plan'}`"
    >
      <template #body>
        <form
          class="edit-form"
          @submit.prevent="savePlan"
        >
          <div class="form-grid">
            <!-- Basic Info -->
            <div class="form-section">
              <h3 class="section-title">
                Basic Info
              </h3>
              <UFormField
                label="Plan Name"
                name="name"
              >
                <UInput
                  v-model="editForm.name"
                  placeholder="e.g., Pro"
                />
              </UFormField>
              <UFormField
                label="Description"
                name="description"
              >
                <UTextarea
                  v-model="editForm.description"
                  placeholder="Short description for pricing page"
                  :rows="2"
                />
              </UFormField>
            </div>

            <!-- Pricing -->
            <div class="form-section">
              <h3 class="section-title">
                Pricing
              </h3>
              <div class="form-row">
                <UFormField
                  label="Monthly Price (cents)"
                  name="price"
                >
                  <UInput
                    v-model.number="editForm.price"
                    type="number"
                    :min="0"
                    placeholder="2900 = $29"
                  />
                </UFormField>
                <UFormField
                  label="Annual Price (cents)"
                  name="annualPrice"
                >
                  <UInput
                    v-model.number="editForm.annualPrice"
                    type="number"
                    :min="0"
                    placeholder="27840 = $278.40"
                  />
                </UFormField>
              </div>
              <UFormField
                label="Platform Fee %"
                name="transactionFee"
              >
                <UInput
                  v-model.number="editForm.transactionFee"
                  type="number"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  placeholder="e.g., 3.5"
                />
              </UFormField>
            </div>

            <!-- Limits -->
            <div class="form-section">
              <h3 class="section-title">
                Plan Limits
              </h3>
              <p class="section-hint">
                Use -1 for unlimited
              </p>
              <div class="form-row three-col">
                <UFormField
                  label="Max Items"
                  name="maxItems"
                >
                  <UInput
                    v-model.number="editForm.limits.maxItems"
                    type="number"
                    :min="-1"
                    placeholder="10"
                  />
                </UFormField>
                <UFormField
                  label="Max Bookings/mo"
                  name="maxBookings"
                >
                  <UInput
                    v-model.number="editForm.limits.maxBookings"
                    type="number"
                    :min="-1"
                    placeholder="50"
                  />
                </UFormField>
                <UFormField
                  label="Max Users"
                  name="maxUsers"
                >
                  <UInput
                    v-model.number="editForm.limits.maxUsers"
                    type="number"
                    :min="-1"
                    placeholder="1"
                  />
                </UFormField>
              </div>
            </div>

            <!-- Stripe Integration -->
            <div class="form-section">
              <h3 class="section-title">
                Stripe Integration
              </h3>
              <div class="form-row">
                <UFormField
                  label="Monthly Price ID"
                  name="stripePriceId"
                >
                  <UInput
                    v-model="editForm.stripePriceId"
                    placeholder="price_xxx"
                  />
                </UFormField>
                <UFormField
                  label="Annual Price ID"
                  name="stripeAnnualPriceId"
                >
                  <UInput
                    v-model="editForm.stripeAnnualPriceId"
                    placeholder="price_xxx"
                  />
                </UFormField>
              </div>
            </div>

            <!-- Display Options -->
            <div class="form-section">
              <h3 class="section-title">
                Display Options
              </h3>
              <div class="form-row">
                <UFormField
                  label="Display Order"
                  name="displayOrder"
                >
                  <UInput
                    v-model.number="editForm.displayOrder"
                    type="number"
                    :min="0"
                    placeholder="0"
                  />
                </UFormField>
              </div>
              <div class="checkbox-row">
                <UCheckbox
                  v-model="editForm.highlighted"
                  label="Featured Plan (recommended)"
                />
                <UCheckbox
                  v-model="editForm.active"
                  label="Active (available for signup)"
                />
              </div>
            </div>
          </div>
        </form>
      </template>

      <template #footer="{ close }">
        <div class="modal-footer">
          <UButton
            label="Cancel"
            variant="outline"
            @click="close"
          />
          <UButton
            label="Save Changes"
            color="primary"
            :loading="isSaving"
            @click="savePlan"
          />
        </div>
      </template>
    </UModal>

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
          Edit plans to change pricing, limits, and features. Changes affect the public pricing page and billing.
          Platform fees are charged on top of Stripe's standard processing fees.
          Set limits to -1 for unlimited.
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
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}

.plan-card {
  @apply rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300;
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
  @apply flex flex-col gap-4;
}

.header-top {
  @apply flex items-center justify-between flex-wrap gap-2;
}

.header-badges {
  @apply flex gap-2;
}

.plan-pricing {
  @apply flex flex-col gap-1;
}

.price-amount {
  @apply text-3xl font-bold tracking-tight leading-none;
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

.annual-price {
  @apply text-sm font-medium;
  color: rgb(22 163 74);
}
.dark .annual-price {
  color: rgb(74 222 128);
}

.transaction-fee {
  @apply text-sm font-medium;
  color: rgb(75 85 99);
}
.dark .transaction-fee {
  color: rgb(156 163 175);
}

/* Plan Limits */
.plan-limits {
  @apply flex flex-col gap-3 pt-5;
  border-top: 1px solid rgb(229 231 235);
}
.dark .plan-limits {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.limits-label {
  @apply text-sm font-semibold uppercase tracking-wider;
  color: rgb(107 114 128);
}
.dark .limits-label {
  color: rgb(156 163 175);
}

.limits-grid {
  @apply grid grid-cols-3 gap-4;
}

.limit-item {
  @apply flex flex-col items-center gap-1 p-3 rounded-lg;
  background-color: rgb(249 250 251);
}
.dark .limit-item {
  background-color: rgba(255, 255, 255, 0.03);
}

.limit-value {
  @apply text-lg font-bold;
  color: rgb(17 24 39);
}
.dark .limit-value {
  color: white;
}

.limit-label {
  @apply text-xs text-center;
  color: rgb(107 114 128);
}
.dark .limit-label {
  color: rgb(156 163 175);
}

/* Plan Features */
.plan-features {
  @apply flex flex-col gap-3 pt-5;
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
  @apply list-none p-0 m-0 flex flex-col gap-2;
}

.feature-item {
  @apply flex items-start gap-2 text-sm;
  color: rgb(55 65 81);
}
.dark .feature-item {
  color: rgb(229 231 235);
}

.feature-item.more {
  color: rgb(107 114 128);
  font-style: italic;
}
.dark .feature-item.more {
  color: rgb(156 163 175);
}

.feature-icon {
  @apply w-4 h-4 flex-shrink-0 mt-0.5;
  color: rgb(22 163 74);
}
.dark .feature-icon {
  color: rgb(74 222 128);
}

/* Plan Stats */
.plan-stats {
  @apply flex flex-col gap-2 pt-5;
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
  @apply flex gap-3 mt-auto pt-5;
  border-top: 1px solid rgb(229 231 235);
}
.dark .plan-actions {
  border-top-color: rgba(255, 255, 255, 0.06);
}

/* Edit Form */
.edit-form {
  @apply flex flex-col gap-6;
}

.form-grid {
  @apply flex flex-col gap-6;
}

.form-section {
  @apply flex flex-col gap-4;
}

.section-title {
  @apply text-sm font-semibold uppercase tracking-wider pb-2;
  color: rgb(107 114 128);
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .section-title {
  color: rgb(156 163 175);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.section-hint {
  @apply text-xs -mt-2;
  color: rgb(107 114 128);
}
.dark .section-hint {
  color: rgb(156 163 175);
}

.form-row {
  @apply grid grid-cols-2 gap-4;
}

.form-row.three-col {
  @apply grid-cols-3;
}

.checkbox-row {
  @apply flex flex-wrap gap-6 pt-2;
}

.modal-footer {
  @apply flex justify-end gap-3;
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

  .form-row, .form-row.three-col {
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

  .limits-grid {
    @apply grid-cols-1;
  }
}
</style>
