<template>
  <div class="animate-fade-in-scale">
    <!-- Confetti Animation Container -->
    <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <div
        v-for="i in 50"
        :key="i"
        class="confetti"
        :style="getConfettiStyle(i)"
      />
    </div>

    <!-- Success Card -->
    <div class="relative">
      <div class="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-50 animate-pulse" />

      <div class="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
        <!-- Decorative pattern -->
        <div class="absolute inset-0 opacity-5">
          <div
            class="absolute inset-0"
            style="background-image: radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0); background-size: 40px 40px;"
          />
        </div>

        <div class="relative p-8 sm:p-12">
          <!-- Success Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div class="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-8">
                <Icon
                  name="lucide:party-popper"
                  class="w-16 h-16 text-white animate-bounce"
                  style="animation-duration: 2s;"
                />
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div class="text-center mb-8">
            <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              You're all set!
            </h1>
            <p class="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Congratulations! Your BouncePro account is ready to start accepting bookings.
            </p>
          </div>

          <!-- Setup Summary -->
          <div class="bg-gray-800/40 rounded-xl p-6 mb-8 border border-gray-700/30">
            <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
              <Icon
                name="lucide:check-circle"
                class="w-5 h-5 text-green-400"
              />
              What you've set up:
            </h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div
                v-for="item in setupSummary"
                :key="item.label"
                class="flex items-start gap-3"
              >
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Icon
                    name="lucide:check"
                    class="w-4 h-4 text-green-400"
                  />
                </div>
                <div>
                  <div class="text-sm font-medium text-white">
                    {{ item.label }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid sm:grid-cols-2 gap-4 mb-8">
            <UButton
              size="lg"
              color="primary"
              variant="solid"
              to="/app"
              class="justify-center"
            >
              <template #leading>
                <Icon
                  name="lucide:layout-dashboard"
                  class="w-5 h-5"
                />
              </template>
              Go to Dashboard
            </UButton>

            <UButton
              size="lg"
              color="neutral"
              variant="soft"
              to="/app/inventory"
              class="justify-center"
            >
              <template #leading>
                <Icon
                  name="lucide:package-plus"
                  class="w-5 h-5"
                />
              </template>
              Add Inventory Items
            </UButton>
          </div>

          <!-- Payment Setup Promotion -->
          <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 border border-purple-500/30 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl" />

            <div class="relative">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Icon
                    name="lucide:credit-card"
                    class="w-6 h-6 text-white"
                  />
                </div>
                <div class="flex-1">
                  <h3 class="text-white font-semibold text-lg mb-2">
                    Ready to Accept Payments?
                  </h3>
                  <p class="text-gray-300 text-sm mb-4">
                    Connect Stripe to start accepting secure online payments from your customers. Set up takes just a few minutes.
                  </p>
                  <div class="flex flex-wrap gap-3">
                    <UButton
                      color="primary"
                      size="sm"
                      :loading="isLoadingStripe"
                      @click="handleConnectStripe"
                    >
                      <template #leading>
                        <Icon
                          name="lucide:credit-card"
                          class="w-4 h-4"
                        />
                      </template>
                      Connect Stripe
                    </UButton>
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      to="/app/settings/payments"
                    >
                      Set up later
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="mt-8 text-center">
      <h3 class="text-gray-400 text-sm font-medium mb-4">
        Recommended next steps:
      </h3>
      <div class="flex flex-wrap justify-center gap-3">
        <div
          v-for="step in nextSteps"
          :key="step.label"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/30 text-sm text-gray-400"
        >
          <Icon
            :name="step.icon"
            class="w-4 h-4 text-amber-400"
          />
          {{ step.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, completeOnboarding } = useOnboarding()
const toast = useToast()

const isLoadingStripe = ref(false)

const setupSummary = computed(() => {
  const summary = []

  if (state.value.business.name) {
    summary.push({
      label: 'Business Name',
      value: state.value.business.name
    })
  }

  if (state.value.business.timezone) {
    summary.push({
      label: 'Timezone',
      value: state.value.business.timezone
    })
  }

  if (state.value.business.serviceArea) {
    summary.push({
      label: 'Service Area',
      value: state.value.business.serviceArea
    })
  }

  const enabledDays = Object.entries(state.value.availability).filter(([_, v]) => v.enabled).length
  if (enabledDays > 0) {
    summary.push({
      label: 'Business Hours',
      value: `${enabledDays} days per week`
    })
  }

  return summary
})

const nextSteps = [
  { icon: 'lucide:package-plus', label: 'Add rental items' },
  { icon: 'lucide:credit-card', label: 'Connect payment processing' },
  { icon: 'lucide:palette', label: 'Customize your booking page' },
  { icon: 'lucide:share-2', label: 'Share your booking link' }
]

async function handleConnectStripe() {
  isLoadingStripe.value = true

  try {
    const response = await $fetch<{ url?: string }>('/api/stripe/connect/onboard', {
      method: 'POST'
    })

    if (response.url) {
      window.location.href = response.url
    }
  } catch (error) {
    console.error('Failed to connect Stripe:', error)
    toast.add({
      title: 'Failed to connect Stripe',
      description: 'Please try again later',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isLoadingStripe.value = false
  }
}

function getConfettiStyle(_index: number) {
  const colors = ['#f59e0b', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomX = Math.random() * 100
  const randomDelay = Math.random() * 3
  const randomDuration = 3 + Math.random() * 2

  return {
    left: `${randomX}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

onMounted(() => {
  // Mark onboarding as complete
  completeOnboarding()
})

useHead({
  title: 'Setup Complete! - Onboarding | BouncePro'
})
</script>

<style scoped>
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fade-in-scale 0.6s ease-out;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confetti-fall linear infinite;
}
</style>
