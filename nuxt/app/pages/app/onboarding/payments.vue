<template>
  <div class="animate-slide-in">
    <!-- Step Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
        <Icon
          name="lucide:credit-card"
          class="w-4 h-4"
        />
        Step 4: Payment Setup
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
        Connect your payments
      </h1>
      <p class="text-gray-400 max-w-xl mx-auto">
        Start accepting payments securely with Stripe
      </p>
    </div>

    <!-- Main Card -->
    <div class="relative">
      <div class="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-xl" />

      <UCard class="relative bg-gray-900/90 backdrop-blur-xl border-gray-700/50">
        <div class="space-y-6">
          <!-- Stripe Logo & Description -->
          <div class="text-center py-6">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6">
              <Icon
                name="lucide:credit-card"
                class="w-10 h-10 text-purple-400"
              />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">
              Secure payments powered by Stripe
            </h3>
            <p class="text-gray-400 max-w-md mx-auto">
              Stripe is the industry-leading payment processor trusted by millions of businesses worldwide.
            </p>
          </div>

          <!-- Benefits -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="(benefit, index) in benefits"
              :key="index"
              class="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Icon
                  :name="benefit.icon"
                  class="w-5 h-5 text-green-400"
                />
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">
                  {{ benefit.title }}
                </h4>
                <p class="text-sm text-gray-400">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Platform Fee Info -->
          <div class="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div class="flex items-start gap-3">
              <Icon
                name="lucide:info"
                class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 class="text-white font-semibold mb-2">
                  Platform Fee
                </h4>
                <p class="text-sm text-gray-300 mb-3">
                  As a free tier user, BouncePro charges <strong class="text-amber-400">6%</strong> per transaction. Upgrade to a paid plan to reduce this to 3% or lower.
                </p>
                <UButton
                  color="warning"
                  variant="soft"
                  size="xs"
                  to="/app/settings/billing"
                  target="_blank"
                >
                  View Pricing Plans
                  <template #trailing>
                    <Icon
                      name="lucide:external-link"
                      class="w-3 h-3"
                    />
                  </template>
                </UButton>
              </div>
            </div>
          </div>

          <!-- Connect Button or Status -->
          <div class="text-center pt-4">
            <div
              v-if="!isConnected"
              class="space-y-4"
            >
              <UButton
                size="xl"
                :loading="isConnecting"
                class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                @click="handleConnectStripe"
              >
                <template #leading>
                  <Icon
                    name="lucide:credit-card"
                    class="w-5 h-5"
                  />
                </template>
                Connect with Stripe
              </UButton>

              <p class="text-sm text-gray-500">
                You'll be redirected to Stripe to complete the setup
              </p>
            </div>

            <div
              v-else
              class="space-y-4"
            >
              <div class="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <Icon
                  name="lucide:check-circle"
                  class="w-6 h-6 text-green-400"
                />
                <span class="text-white font-medium">Stripe Connected Successfully</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Info Card -->
    <div class="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/30">
      <div class="flex gap-3">
        <Icon
          name="lucide:shield-check"
          class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <p class="text-sm text-gray-400">
            <strong class="text-gray-300">Secure & Compliant:</strong> Stripe handles all payment processing and security. BouncePro never stores your customers' card information.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between mt-8">
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        class="text-gray-400 hover:text-white"
        @click="handleBack"
      >
        <template #leading>
          <Icon
            name="lucide:arrow-left"
            class="w-5 h-5"
          />
        </template>
        Back
      </UButton>

      <div class="flex items-center gap-3">
        <UButton
          v-if="!isConnected"
          color="neutral"
          variant="ghost"
          size="lg"
          class="text-gray-400 hover:text-white"
          @click="handleSkip"
        >
          Set up later
        </UButton>

        <UButton
          size="lg"
          :disabled="!isConnected"
          class="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleNext"
        >
          Continue
          <template #trailing>
            <Icon
              name="lucide:arrow-right"
              class="w-5 h-5"
            />
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, nextStep, prevStep, saveProgress } = useOnboarding()

const isConnected = ref(state.value.paymentsConnected)
const isConnecting = ref(false)

const benefits = [
  {
    icon: 'lucide:shield-check',
    title: 'Bank-level Security',
    description: 'PCI-compliant with advanced fraud protection'
  },
  {
    icon: 'lucide:zap',
    title: 'Instant Deposits',
    description: 'Get paid faster with daily automatic transfers'
  },
  {
    icon: 'lucide:credit-card',
    title: 'All Payment Methods',
    description: 'Accept cards, digital wallets, and more'
  },
  {
    icon: 'lucide:activity',
    title: 'Real-time Analytics',
    description: 'Track revenue and payments in your dashboard'
  }
]

const handleConnectStripe = async () => {
  isConnecting.value = true

  // Simulate Stripe OAuth flow
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock successful connection
  isConnected.value = true
  if (state.value) {
    state.value.paymentsConnected = true
  }
  saveProgress()

  isConnecting.value = false

  // Show success toast
  useToast().add({
    title: 'Stripe Connected!',
    description: 'Your payment account has been set up successfully.',
    icon: 'lucide:check-circle',
    color: 'success'
  })
}

const handleNext = () => {
  if (!isConnected.value) return

  nextStep()
  navigateTo('/app/onboarding/complete')
}

const handleBack = () => {
  prevStep()
  navigateTo('/app/onboarding/availability')
}

const handleSkip = () => {
  if (state.value) {
    state.value.paymentsConnected = false
  }
  saveProgress()
  nextStep()
  navigateTo('/app/onboarding/complete')
}

useHead({
  title: 'Payment Setup - Onboarding | BouncePro'
})
</script>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out;
}
</style>
