<template>
  <div class="max-w-5xl mx-auto">
    <!-- Page Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Plan & Billing
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your subscription and payment methods
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div class="w-8 h-8 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      <p class="text-gray-500 dark:text-gray-400">
        Loading billing information...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center"
    >
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-12 h-12 text-red-500 mx-auto mb-3"
      />
      <p class="text-red-700 dark:text-red-300 font-medium mb-2">
        Failed to load billing information
      </p>
      <p class="text-red-600 dark:text-red-400 text-sm mb-4">
        {{ error }}
      </p>
      <UButton
        color="primary"
        @click="fetchBillingData"
      >
        Try Again
      </UButton>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Current Plan Card -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-star"
              class="w-6 h-6 text-orange-600 dark:text-orange-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Current Plan
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Your active subscription
            </p>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <!-- Plan Badge -->
            <div class="flex items-center gap-3">
              <div
                class="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                :class="planBadgeClasses"
              >
                <UIcon
                  :name="getPlanIcon(subscription?.planId)"
                  class="w-5 h-5"
                />
                <span>{{ getPlanName(subscription?.planId) }} Plan</span>
              </div>
              <UBadge
                v-if="subscription?.status === 'trialing'"
                color="warning"
                variant="subtle"
              >
                Trial
              </UBadge>
              <UBadge
                v-else-if="subscription?.cancelAtPeriodEnd"
                color="error"
                variant="subtle"
              >
                Canceling
              </UBadge>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <UButton
                v-if="canUpgrade"
                color="primary"
                @click="showUpgradeModal = true"
              >
                Upgrade Plan
              </UButton>
              <UButton
                v-if="canCancel"
                variant="ghost"
                color="neutral"
                @click="showCancelModal = true"
              >
                Cancel Subscription
              </UButton>
            </div>
          </div>

          <!-- Plan Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Monthly Price
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                ${{ getPlanPrice(subscription?.planId) }}<span class="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Transaction Fee
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ getPlanFee(subscription?.planId) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ subscription?.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing' }}
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ formatDate(subscription?.currentPeriodEnd) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Plans -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Available Plans
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              v-for="plan in plans"
              :key="plan.value"
              class="relative rounded-xl border-2 p-5 transition-all duration-200"
              :class="[
                subscription?.planId === plan.value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                  : plan.recommended
                    ? 'border-orange-300 dark:border-orange-500/50 hover:border-orange-400 dark:hover:border-orange-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <!-- Recommended Badge -->
              <div
                v-if="plan.recommended"
                class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg"
              >
                RECOMMENDED
              </div>

              <!-- Plan Icon -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                :class="planIconClasses(plan.value)"
              >
                <UIcon
                  :name="plan.icon"
                  class="w-6 h-6"
                />
              </div>

              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {{ plan.name }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {{ plan.description }}
              </p>

              <!-- Pricing -->
              <div class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">${{ plan.price }}</span>
                  <span class="text-gray-500 dark:text-gray-400">/mo</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ plan.transactionFee }}
                </p>
              </div>

              <!-- Features -->
              <ul class="space-y-2 mb-5">
                <li
                  v-for="(feature, idx) in plan.features.slice(0, 4)"
                  :key="idx"
                  class="flex items-start gap-2 text-sm"
                >
                  <UIcon
                    name="i-heroicons-check"
                    class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                  />
                  <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                </li>
              </ul>

              <!-- Action Button -->
              <UButton
                v-if="subscription?.planId === plan.value"
                variant="outline"
                color="neutral"
                class="w-full"
                disabled
              >
                Current Plan
              </UButton>
              <UButton
                v-else-if="getPlanLevel(plan.value) > getPlanLevel(subscription?.planId)"
                color="primary"
                class="w-full"
                :loading="upgradingTo === plan.value"
                @click="handleUpgrade(plan.value)"
              >
                Upgrade
              </UButton>
              <UButton
                v-else
                variant="ghost"
                color="neutral"
                class="w-full"
                @click="handleDowngrade(plan.value)"
              >
                Downgrade
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-credit-card"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Method
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Manage your payment details
            </p>
          </div>
        </div>

        <div class="p-6">
          <div
            v-if="paymentMethod"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <UIcon
                  :name="getCardIcon(paymentMethod.brand)"
                  class="w-8 h-8 text-gray-700 dark:text-gray-300"
                />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ capitalizeFirst(paymentMethod.brand) }} ending in {{ paymentMethod.last4 }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Expires {{ paymentMethod.expMonth }}/{{ paymentMethod.expYear }}
                </p>
              </div>
            </div>
            <UButton
              variant="outline"
              color="neutral"
              :loading="openingPortal"
              @click="openBillingPortal"
            >
              Update Payment Method
            </UButton>
          </div>

          <div
            v-else
            class="text-center py-8"
          >
            <UIcon
              name="i-heroicons-credit-card"
              class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
            />
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              No payment method on file
            </p>
            <UButton
              color="primary"
              :loading="openingPortal"
              @click="openBillingPortal"
            >
              Add Payment Method
            </UButton>
          </div>
        </div>
      </div>

      <!-- Invoice History -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-document-text"
              class="w-6 h-6 text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Invoice History
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ invoices.length }} {{ invoices.length === 1 ? 'invoice' : 'invoices' }}
            </p>
          </div>
        </div>

        <div class="p-6">
          <div
            v-if="invoices.length === 0"
            class="text-center py-8"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
            />
            <p class="text-gray-600 dark:text-gray-400">
              No invoices yet
            </p>
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="invoice in invoices"
              :key="invoice.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="hidden sm:block">
                  <UIcon
                    name="i-heroicons-document"
                    class="w-8 h-8 text-gray-400 dark:text-gray-500"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ invoice.number }}
                  </p>
                  <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(invoice.date) }}</span>
                    <span>${{ invoice.amount.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <UBadge
                  :color="invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'"
                  variant="subtle"
                >
                  {{ capitalizeFirst(invoice.status) }}
                </UBadge>
                <UButton
                  v-if="invoice.invoiceUrl"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  icon="i-heroicons-arrow-down-tray"
                  @click="downloadInvoice(invoice)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UModal v-model:open="showUpgradeModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Upgrade Your Plan
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Choose the plan you'd like to upgrade to. Your new plan will be active immediately,
            and you'll be charged a prorated amount for the remainder of your billing cycle.
          </p>

          <div class="space-y-3 mb-6">
            <div
              v-for="plan in availableUpgrades"
              :key="plan.value"
              class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
              :class="selectedPlan === plan.value
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
              @click="selectedPlan = plan.value"
            >
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="selectedPlan === plan.value ? 'border-orange-500' : 'border-gray-300 dark:border-gray-600'"
              >
                <div
                  v-if="selectedPlan === plan.value"
                  class="w-2.5 h-2.5 rounded-full bg-orange-500"
                />
              </div>
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="planIconClasses(plan.value)"
              >
                <UIcon
                  :name="plan.icon"
                  class="w-5 h-5"
                />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ plan.name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ${{ plan.price }}/mo &middot; {{ plan.transactionFee }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <UButton
              variant="ghost"
              color="neutral"
              @click="showUpgradeModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="upgradingTo !== null"
              :disabled="!selectedPlan"
              @click="confirmUpgrade"
            >
              Upgrade Now
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Cancel Modal -->
    <UModal v-model:open="showCancelModal">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-5 h-5 text-red-600 dark:text-red-400"
              />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Cancel Subscription?
            </h3>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
          </p>

          <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
            <p class="text-amber-800 dark:text-amber-200 font-medium mb-2">
              You'll lose access to:
            </p>
            <ul class="text-amber-700 dark:text-amber-300 text-sm space-y-1">
              <li>- Advanced booking features</li>
              <li>- Priority support</li>
              <li>- API access</li>
              <li>- Lower transaction fees</li>
            </ul>
          </div>

          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Your subscription will remain active until <strong class="text-gray-900 dark:text-white">{{ formatDate(subscription?.currentPeriodEnd) }}</strong>.
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              variant="ghost"
              color="neutral"
              @click="showCancelModal = false"
            >
              Keep Subscription
            </UButton>
            <UButton
              color="error"
              :loading="canceling"
              @click="confirmCancel"
            >
              Cancel Subscription
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()

// State
const loading = ref(true)
const error = ref<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subscription = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paymentMethod = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const invoices = ref<any[]>([])
const showUpgradeModal = ref(false)
const showCancelModal = ref(false)
const selectedPlan = ref<string | null>(null)
const upgradingTo = ref<string | null>(null)
const canceling = ref(false)
const openingPortal = ref(false)

// Plans data
const plans = [
  {
    value: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    price: 0,
    transactionFee: '6% + Stripe fees',
    icon: 'i-heroicons-paper-airplane',
    features: [
      'Basic booking management',
      'Up to 20 bookings/month',
      'Email support',
      'Redirect booking flow'
    ]
  },
  {
    value: 'growth',
    name: 'Growth',
    description: 'For growing rental businesses',
    price: 39,
    transactionFee: '2.5% + Stripe fees',
    icon: 'i-heroicons-chart-bar',
    recommended: true,
    features: [
      'Unlimited bookings',
      'Bundles & packages',
      'Webhook notifications',
      'Priority email support',
      'Customer portal'
    ]
  },
  {
    value: 'pro',
    name: 'Pro',
    description: 'Advanced features for professionals',
    price: 99,
    transactionFee: '0.5% + Stripe fees',
    icon: 'i-heroicons-rocket-launch',
    features: [
      'Everything in Growth',
      'API access',
      'Custom branding',
      'Advanced analytics',
      'Phone support',
      'Team collaboration'
    ]
  },
  {
    value: 'scale',
    name: 'Scale',
    description: 'For high-volume operations',
    price: 249,
    transactionFee: 'Stripe fees only',
    icon: 'i-heroicons-building-office',
    features: [
      'Everything in Pro',
      'Zero platform fees',
      'White-label solution',
      'Custom domain',
      'Dedicated support',
      'Custom integrations'
    ]
  }
]

// Computed
const canUpgrade = computed(() => {
  const currentLevel = getPlanLevel(subscription.value?.planId)
  return currentLevel < 3 && !subscription.value?.cancelAtPeriodEnd
})

const canCancel = computed(() => {
  return subscription.value?.planId !== 'free' && !subscription.value?.cancelAtPeriodEnd
})

const availableUpgrades = computed(() => {
  const currentLevel = getPlanLevel(subscription.value?.planId)
  return plans.filter(plan => getPlanLevel(plan.value) > currentLevel)
})

const planBadgeClasses = computed(() => {
  const plan = subscription.value?.planId || 'free'
  const classes: Record<string, string> = {
    free: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    growth: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pro: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    scale: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
  }
  return classes[plan] || classes.free
})

// Methods
const getPlanLevel = (plan: string | undefined): number => {
  const levels: Record<string, number> = { free: 0, growth: 1, pro: 2, scale: 3 }
  return levels[plan || 'free'] || 0
}

const getPlanName = (plan: string | undefined): string => {
  const planData = plans.find(p => p.value === plan)
  return planData?.name || 'Free'
}

const getPlanIcon = (plan: string | undefined): string => {
  const planData = plans.find(p => p.value === plan)
  return planData?.icon || 'i-heroicons-paper-airplane'
}

const getPlanPrice = (plan: string | undefined): number => {
  const planData = plans.find(p => p.value === plan)
  return planData?.price || 0
}

const getPlanFee = (plan: string | undefined): string => {
  const planData = plans.find(p => p.value === plan)
  return planData?.transactionFee || 'N/A'
}

const planIconClasses = (plan: string): string => {
  const classes: Record<string, string> = {
    free: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    growth: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    pro: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    scale: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }
  return (classes[plan] || classes.free) as string
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getCardIcon = (brand: string): string => {
  const icons: Record<string, string> = {
    visa: 'i-simple-icons-visa',
    mastercard: 'i-simple-icons-mastercard',
    amex: 'i-simple-icons-americanexpress'
  }
  return icons[brand?.toLowerCase()] || 'i-heroicons-credit-card'
}

// API Methods
const fetchBillingData = async () => {
  loading.value = true
  error.value = null

  try {
    // Fetch subscription data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subResponse = await $fetch<any>('/api/stripe/subscription', {
      credentials: 'include'
    })

    if (subResponse) {
      subscription.value = {
        planId: subResponse.planId?.slug || subResponse.plan?.slug || 'free',
        status: subResponse.status,
        currentPeriodEnd: subResponse.currentPeriodEnd,
        cancelAtPeriodEnd: subResponse.cancelAtPeriodEnd,
        trialEnd: subResponse.trialEnd
      }

      // If we have payment method info
      if (subResponse.paymentMethod) {
        paymentMethod.value = subResponse.paymentMethod
      }

      // If we have invoices
      if (subResponse.invoices) {
        invoices.value = subResponse.invoices
      }
    } else {
      // No subscription = free plan
      subscription.value = {
        planId: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // If 404 or no subscription, user is on free plan
    if (err.statusCode === 404 || err.message?.includes('not found')) {
      subscription.value = {
        planId: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      }
    } else {
      console.error('Failed to fetch billing data:', err)
      error.value = err.message || 'Failed to load billing information'
    }
  } finally {
    loading.value = false
  }
}

const handleUpgrade = (plan: string) => {
  selectedPlan.value = plan
  showUpgradeModal.value = true
}

const handleDowngrade = (_plan: string) => {
  toast.add({
    title: 'Contact Support',
    description: 'Please contact support to downgrade your plan.',
    color: 'primary'
  })
}

const confirmUpgrade = async () => {
  if (!selectedPlan.value) return

  upgradingTo.value = selectedPlan.value

  try {
    // Create checkout session for upgrade
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>('/api/stripe/subscription/create', {
      method: 'POST',
      credentials: 'include',
      body: {
        planId: selectedPlan.value
      }
    })

    if (response?.url) {
      // Redirect to Stripe Checkout
      window.location.href = response.url
    } else {
      toast.add({
        title: 'Plan upgraded',
        description: 'Your plan has been upgraded successfully.',
        color: 'success'
      })
      showUpgradeModal.value = false
      await fetchBillingData()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Upgrade failed:', err)
    toast.add({
      title: 'Upgrade failed',
      description: err.message || 'Failed to upgrade plan. Please try again.',
      color: 'error'
    })
  } finally {
    upgradingTo.value = null
    selectedPlan.value = null
  }
}

const confirmCancel = async () => {
  canceling.value = true

  try {
    await $fetch('/api/stripe/subscription/cancel', {
      method: 'POST',
      credentials: 'include',
      body: {
        immediately: false // Cancel at period end
      }
    })

    toast.add({
      title: 'Subscription cancelled',
      description: 'Your subscription will end at the current billing period.',
      color: 'success'
    })

    showCancelModal.value = false
    await fetchBillingData()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Cancel failed:', err)
    toast.add({
      title: 'Cancellation failed',
      description: err.message || 'Failed to cancel subscription. Please try again.',
      color: 'error'
    })
  } finally {
    canceling.value = false
  }
}

const openBillingPortal = async () => {
  openingPortal.value = true

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await $fetch<any>('/api/stripe/portal', {
      credentials: 'include'
    })

    if (response?.url) {
      window.location.href = response.url
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Failed to open portal:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to open billing portal. Please try again.',
      color: 'error'
    })
  } finally {
    openingPortal.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadInvoice = (invoice: any) => {
  if (invoice.invoiceUrl) {
    window.open(invoice.invoiceUrl, '_blank')
  } else {
    toast.add({
      title: 'Invoice unavailable',
      description: 'Invoice download is not available for this invoice.',
      color: 'warning'
    })
  }
}

// Lifecycle
onMounted(() => {
  fetchBillingData()
})
</script>
