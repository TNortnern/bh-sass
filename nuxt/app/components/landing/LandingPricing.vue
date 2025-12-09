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

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative rounded-2xl p-8 transition-all duration-300"
          :class="plan.featured
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border-2 border-orange-500 shadow-xl shadow-orange-500/20 scale-105'
            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800'"
        >
          <!-- Featured Badge -->
          <div
            v-if="plan.featured"
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
              :class="plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'"
            >
              {{ plan.name }}
            </h3>
            <p
              class="text-sm mb-4"
              :class="plan.featured ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'"
            >
              {{ plan.description }}
            </p>
            <div class="flex items-baseline justify-center gap-1">
              <span
                class="text-4xl font-bold"
                :class="plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'"
              >
                ${{ annual ? plan.annualPrice : plan.monthlyPrice }}
              </span>
              <span :class="plan.featured ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'">/mo</span>
            </div>
            <p
              v-if="plan.fee"
              class="text-xs mt-2"
              :class="plan.featured ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'"
            >
              + {{ plan.fee }} transaction fee
            </p>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-8">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-center gap-3 text-sm"
              :class="plan.featured ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'"
            >
              <UIcon
                name="i-lucide-check"
                class="w-5 h-5 flex-shrink-0"
                :class="plan.featured ? 'text-orange-400' : 'text-orange-500'"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <UButton
            to="/auth/register"
            :class="plan.featured
              ? 'w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              : 'w-full bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'"
            size="lg"
          >
            {{ plan.cta }}
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
const annual = ref(false)

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    annualPrice: 0,
    fee: '6%',
    features: [
      'Up to 10 bookings/month',
      '5 inventory items',
      'Basic booking calendar',
      'Email notifications',
      'Customer management'
    ],
    cta: 'Start Free',
    featured: false
  },
  {
    name: 'Growth',
    description: 'For growing rental businesses',
    monthlyPrice: 39,
    annualPrice: 31,
    fee: '2.5%',
    features: [
      'Unlimited bookings',
      'Unlimited inventory',
      'Embeddable booking widget',
      'Route planning',
      'SMS notifications',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    featured: true
  },
  {
    name: 'Pro',
    description: 'For established businesses',
    monthlyPrice: 99,
    annualPrice: 79,
    fee: '0.5%',
    features: [
      'Everything in Growth',
      'API access',
      'White-label options',
      'Custom contracts',
      'Advanced analytics',
      'Dedicated account manager'
    ],
    cta: 'Start Free Trial',
    featured: false
  }
]
</script>
