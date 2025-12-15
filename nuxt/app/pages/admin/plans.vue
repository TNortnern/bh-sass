<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface Plan {
  id: string
  name: string
  slug: string
  price: number
  features: string[]
  transactionFee: number
  isActive: boolean
}

// Hardcoded plans based on the pricing tiers from CLAUDE.md
const plans = ref<Plan[]>([
  {
    id: 'free',
    name: 'Free',
    slug: 'free',
    price: 0,
    features: [
      'Up to 10 bookings per month',
      'Basic inventory management',
      'Email notifications',
      'Customer database',
      'Basic reporting'
    ],
    transactionFee: 6.0,
    isActive: true
  },
  {
    id: 'growth',
    name: 'Growth',
    slug: 'growth',
    price: 39,
    features: [
      'Unlimited bookings',
      'Advanced inventory management',
      'Email & SMS notifications',
      'Customer portal',
      'Advanced reporting',
      'Custom branding',
      'Priority support'
    ],
    transactionFee: 2.5,
    isActive: true
  },
  {
    id: 'pro',
    name: 'Pro',
    slug: 'pro',
    price: 99,
    features: [
      'Everything in Growth',
      'Multi-location support',
      'API access',
      'Webhooks',
      'Contract management',
      'Advanced automation',
      'Dedicated support'
    ],
    transactionFee: 0.5,
    isActive: true
  },
  {
    id: 'scale',
    name: 'Scale',
    slug: 'scale',
    price: 249,
    features: [
      'Everything in Pro',
      'Custom integrations',
      'White-label options',
      'Franchise management',
      'Custom reporting',
      'SLA guarantee',
      'Account manager'
    ],
    transactionFee: 0,
    isActive: true
  }
])

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
    </div>

    <!-- Plans Grid -->
    <div class="plans-grid">
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
            <span class="stat-value">-</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Monthly Revenue</span>
            <span class="stat-value">-</span>
          </div>
        </div>

        <!-- Plan Actions -->
        <div class="plan-actions">
          <UButton
            label="View Subscribers"
            variant="outline"
            block
            size="sm"
            disabled
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
          Plans are currently hardcoded based on the platform pricing structure.
          Future versions will support dynamic plan management and customization through this interface.
        </p>
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
  margin-bottom: 2rem;
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

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.plan-card {
  background: linear-gradient(180deg, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.plan-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.plan-card.featured {
  border-color: rgba(139, 92, 246, 0.3);
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, #0f0f0f 100%);
}

.plan-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plan-pricing {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1;
}

.price-period {
  font-size: 1rem;
  color: #737373;
  font-weight: 400;
}

.transaction-fee {
  font-size: 0.9375rem;
  color: #a3a3a3;
  font-weight: 500;
}

/* Plan Features */
.plan-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.features-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #e5e5e5;
}

.feature-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

/* Plan Stats */
.plan-stats {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #737373;
}

.stat-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
}

/* Plan Actions */
.plan-actions {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

/* Info Banner */
.info-banner {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: #60a5fa;
}

.info-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.info-text {
  font-size: 0.875rem;
  color: #a3a3a3;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
