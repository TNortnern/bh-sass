<template>
  <div class="animate-fade-in">
    <!-- Welcome Card -->
    <div class="relative">
      <!-- Glow effect -->
      <div class="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-50" />

      <div class="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
        <!-- Decorative pattern -->
        <div class="absolute inset-0 opacity-5">
          <div
            class="absolute inset-0"
            style="background-image: radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0); background-size: 40px 40px;"
          />
        </div>

        <div class="relative p-8 sm:p-12">
          <!-- Welcome Icon -->
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div class="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6">
                <Icon
                  name="lucide:sparkles"
                  class="w-12 h-12 text-white"
                />
              </div>
            </div>
          </div>

          <!-- Welcome Text -->
          <div class="text-center mb-8">
            <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Welcome{{ userName ? ', ' + userName : '' }}!
            </h1>
            <p class="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Let's get your bounce house business set up in just a few minutes. We'll walk you through everything you need to start taking bookings.
            </p>
          </div>

          <!-- Feature Overview -->
          <div class="grid sm:grid-cols-2 gap-4 mb-10">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="flex items-start gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-amber-500/30 transition-all duration-300 group"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all">
                <Icon
                  :name="feature.icon"
                  class="w-5 h-5 text-amber-400"
                />
              </div>
              <div>
                <h3 class="text-white font-semibold mb-1">
                  {{ feature.title }}
                </h3>
                <p class="text-sm text-gray-400 leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Time Estimate -->
          <div class="flex items-center justify-center gap-2 mb-8 text-gray-400">
            <Icon
              name="lucide:clock"
              class="w-4 h-4"
            />
            <span class="text-sm">Takes about 2-3 minutes to complete</span>
          </div>

          <!-- CTA Button -->
          <div class="flex flex-col items-center gap-4">
            <UButton
              size="xl"
              class="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 px-12 py-4"
              @click="handleGetStarted"
            >
              <template #leading>
                <Icon
                  name="lucide:rocket"
                  class="w-5 h-5"
                />
              </template>
              <span class="text-lg font-semibold">Let's Get Started</span>
              <template #trailing>
                <Icon
                  name="lucide:arrow-right"
                  class="w-5 h-5"
                />
              </template>
            </UButton>

            <button
              class="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              @click="handleSkip"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-500">
        Don't worry, you can always change these settings later in your dashboard.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { currentUser } = useAuth()
const { nextStep, loadProgress } = useOnboarding()

const userName = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (currentUser.value && (currentUser.value.profile as any)?.firstName) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (currentUser.value.profile as any).firstName
  }
  return null
})

const features = [
  {
    icon: 'lucide:building',
    title: 'Business Details',
    description: 'Add your business name, location, and service area'
  },
  {
    icon: 'lucide:package-plus',
    title: 'Your First Item',
    description: 'Create your first rental item to showcase'
  },
  {
    icon: 'lucide:calendar-clock',
    title: 'Set Availability',
    description: 'Define your business hours and lead time'
  },
  {
    icon: 'lucide:credit-card',
    title: 'Payment Setup',
    description: 'Connect Stripe to start accepting payments'
  }
]

const handleGetStarted = () => {
  nextStep()
  navigateTo('/app/onboarding/business')
}

const handleSkip = async () => {
  if (confirm('Skip onboarding? You can always complete this later from your dashboard.')) {
    await navigateTo('/app')
  }
}

// Load saved progress on mount
onMounted(() => {
  loadProgress()
})

useHead({
  title: 'Welcome - Onboarding | BouncePro'
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>
