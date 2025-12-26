<template>
  <section
    id="pricing"
    class="py-24 bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-credit-card"
            class="w-3 h-3"
          />
          <span>SIMPLE PRICING</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Plans That Scale With Your Business
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Start free, upgrade when you're ready. No hidden fees, no surprises.
        </p>
      </div>

      <!-- Pricing Toggle -->
      <div class="flex justify-center items-center gap-4 mb-12">
        <span
          class="text-sm"
          :class="!annual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'"
        >Monthly</span>
        <button
          class="relative w-14 h-7 rounded-full transition-colors"
          :class="annual ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-700'"
          @click="annual = !annual"
        >
          <span
            class="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"
            :class="annual ? 'translate-x-7' : 'translate-x-0.5'"
          />
        </button>
        <span
          class="text-sm"
          :class="annual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'"
        >
          Annual
          <span class="ml-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">Save 20%</span>
        </span>
      </div>

      <!-- Loading State -->
      <div
        v-if="pending && !plans"
        class="flex justify-center py-16"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-8 h-8 animate-spin text-gray-400"
        />
      </div>

      <!-- Pricing Cards -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        <div
          v-for="plan in displayPlans"
          :key="plan.name"
          class="relative rounded-2xl p-8 transition-all duration-300"
          :class="plan.highlighted
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-2 border-orange-500 shadow-xl shadow-orange-500/20 scale-105'
            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800'"
        >
          <!-- Featured Badge -->
          <div
            v-if="plan.highlighted"
            class="absolute -top-4 left-1/2 -translate-x-1/2"
          >
            <span class="px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
              MOST POPULAR
            </span>
          </div>

          <!-- Plan Header -->
          <div class="text-center mb-8">
            <h3
              class="text-xl font-semibold mb-2"
              :class="plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'"
            >
              {{ plan.name }}
            </h3>
            <p
              class="text-sm mb-4"
              :class="plan.highlighted ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'"
            >
              {{ plan.description }}
            </p>
            <div class="flex items-baseline justify-center gap-1">
              <span
                class="text-4xl font-bold"
                :class="plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'"
              >
                ${{ getDisplayPrice(plan) }}
              </span>
              <span :class="plan.highlighted ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">/mo</span>
            </div>
            <p
              v-if="plan.transactionFee"
              class="text-xs mt-2"
              :class="plan.highlighted ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'"
            >
              + {{ plan.transactionFee }}% transaction fee
            </p>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-8">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-center gap-3 text-sm"
              :class="plan.highlighted ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'"
            >
              <UIcon
                name="i-lucide-check"
                class="w-5 h-5 flex-shrink-0"
                :class="plan.highlighted ? 'text-orange-400' : 'text-orange-500'"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <UButton
            to="/auth/register"
            :class="plan.highlighted
              ? 'w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              : 'w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'"
            size="lg"
          >
            {{ plan.price === 0 ? 'Start Free' : 'Start Free Trial' }}
          </UButton>
        </div>
      </div>

      <!-- Enterprise -->
      <div class="mt-12 max-w-3xl mx-auto text-center">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Need a Custom Solution?
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            For large fleets, multiple locations, or custom integrations, let's talk about an Enterprise plan.
          </p>
          <UButton
            variant="outline"
            size="lg"
            class="border-gray-300 dark:border-gray-700"
          >
            Contact Sales
            <UIcon
              name="i-lucide-arrow-right"
              class="w-4 h-4 ml-2"
            />
          </UButton>
        </div>
      </div>

      <!-- Trust Note -->
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        All plans include 14-day free trial • No credit card required • Cancel anytime
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Plan {
  id: string
  name: string
  slug: string
  price: number
  annualPrice?: number
  description?: string
  transactionFee: number
  features: string[]
  highlighted?: boolean
  limits?: {
    maxItems: number
    maxBookings: number
    maxUsers: number
  }
}

const annual = ref(false)

// Fetch plans from API
const { data: plans, pending } = await useLazyFetch<Plan[]>('/v1/plans', {
  default: () => []
})

// Fallback plans in case API fails
const fallbackPlans: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    slug: 'free',
    description: 'Perfect for getting started',
    price: 0,
    transactionFee: 6,
    features: [
      'Up to 10 bookings/month',
      '10 inventory items',
      'Basic booking calendar',
      'Email notifications',
      'Customer management'
    ],
    highlighted: false
  },
  {
    id: 'pro',
    name: 'Growth',
    slug: 'pro',
    description: 'For growing rental businesses',
    price: 2900,
    annualPrice: 27840,
    transactionFee: 3.5,
    features: [
      'Up to 500 bookings/month',
      '50 inventory items',
      'Embeddable booking widget',
      'SMS notifications',
      'Website builder',
      'Priority support'
    ],
    highlighted: true
  },
  {
    id: 'platinum',
    name: 'Pro',
    slug: 'platinum',
    description: 'For established businesses',
    price: 10000,
    annualPrice: 96000,
    transactionFee: 1,
    features: [
      'Everything in Growth',
      'Unlimited bookings',
      'Unlimited inventory',
      'API access',
      'White-label options',
      'Dedicated account manager'
    ],
    highlighted: false
  }
]

// Use fetched plans or fallback
const displayPlans = computed(() => {
  if (plans.value && plans.value.length > 0) {
    return plans.value
  }
  return fallbackPlans
})

// Calculate display price (monthly or annual)
const getDisplayPrice = (plan: Plan) => {
  if (annual.value && plan.annualPrice) {
    // Annual price divided by 12 for monthly equivalent
    return Math.round(plan.annualPrice / 12 / 100)
  }
  // Monthly price in cents, convert to dollars
  return Math.round(plan.price / 100)
}
</script>
