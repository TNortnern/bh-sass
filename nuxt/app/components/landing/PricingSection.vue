<script setup lang="ts">
import { ref } from 'vue'

interface PricingPlan {
  name: string
  price: string
  priceAnnual?: string
  subtitle: string
  features: string[]
  cta: string
  ctaVariant: 'solid' | 'outline'
  ctaColor?: string
  highlighted?: boolean
  badge?: string
}

const billingCycle = ref<'monthly' | 'annual'>('monthly')

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    priceAnnual: '$0',
    subtitle: 'Perfect for getting started',
    features: [
      'Up to 10 bookings/month',
      '5 inventory items',
      'Basic calendar',
      'Email support',
      'BouncePro branding on widget'
    ],
    cta: 'Start Free',
    ctaVariant: 'outline'
  },
  {
    name: 'Growth',
    price: '$39',
    priceAnnual: '$33',
    subtitle: 'For growing rental businesses',
    features: [
      'Unlimited bookings',
      'Unlimited inventory',
      'Advanced calendar + route planning',
      'Priority support',
      'Custom branding',
      'Customer analytics',
      'SMS notifications',
      '2.5% transaction fee'
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'solid',
    ctaColor: 'primary',
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    name: 'Pro',
    price: '$99',
    priceAnnual: '$83',
    subtitle: 'For established businesses',
    features: [
      'Everything in Growth',
      '0.5% transaction fee',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'White-label options'
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline'
  }
]

function getCurrentPrice(plan: PricingPlan): string {
  if (billingCycle.value === 'annual' && plan.priceAnnual) {
    return plan.priceAnnual
  }
  return plan.price
}
</script>

<template>
  <section
    id="pricing"
    class="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, transparent pricing
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start free, upgrade when you're ready. No hidden fees.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-4 mt-8">
          <span
            class="text-sm font-medium transition-colors"
            :class="billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'"
          >
            Monthly
          </span>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            :class="billingCycle === 'annual' ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'"
            @click="billingCycle = billingCycle === 'monthly' ? 'annual' : 'monthly'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span
            class="text-sm font-medium transition-colors"
            :class="billingCycle === 'annual' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'"
          >
            Annual
            <span class="ml-1.5 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
              Save 15%
            </span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative group"
          :class="plan.highlighted ? 'md:-mt-4 md:mb-4' : ''"
        >
          <!-- Most Popular Badge -->
          <div
            v-if="plan.badge"
            class="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
          >
            <span class="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
              {{ plan.badge }}
            </span>
          </div>

          <!-- Card -->
          <div
            class="relative h-full rounded-2xl bg-white dark:bg-gray-900 p-8 transition-all duration-300"
            :class="[
              plan.highlighted
                ? 'shadow-2xl ring-2 ring-orange-500 dark:ring-orange-600 scale-105 hover:scale-110'
                : 'shadow-lg hover:shadow-xl hover:scale-105 ring-1 ring-gray-200 dark:ring-gray-800'
            ]"
          >
            <!-- Plan Header -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ plan.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ plan.subtitle }}
              </p>
            </div>

            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-baseline gap-1">
                <span class="text-5xl font-bold text-gray-900 dark:text-white">
                  {{ getCurrentPrice(plan) }}
                </span>
                <span class="text-gray-600 dark:text-gray-400">
                  {{ plan.price === '$0' ? '' : '/month' }}
                </span>
              </div>
              <p
                v-if="billingCycle === 'annual' && plan.priceAnnual && plan.price !== '$0'"
                class="text-sm text-gray-500 dark:text-gray-500 mt-1"
              >
                Billed annually ({{ plan.price }}/mo if billed monthly)
              </p>
            </div>

            <!-- CTA Button -->
            <UButton
              :label="plan.cta"
              :color="plan.ctaColor || 'neutral'"
              :variant="plan.ctaVariant"
              size="lg"
              block
              class="mb-8"
              :class="plan.highlighted ? 'shadow-lg hover:shadow-xl' : ''"
            />

            <!-- Features List -->
            <div class="space-y-4">
              <div
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-lucide-check-circle"
                  class="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{ feature }}
                </span>
              </div>
            </div>

            <!-- Highlight Gradient Border Effect -->
            <div
              v-if="plan.highlighted"
              class="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Need a custom plan for your enterprise?
          <a
            href="#contact"
            class="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 font-medium underline"
          >
            Contact our sales team
          </a>
        </p>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
    </div>
  </section>
</template>

<style scoped>
/* Ensure smooth transitions on all interactive elements */
button,
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient animation for highlighted card */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.group:hover .absolute.inset-0 {
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}
</style>
