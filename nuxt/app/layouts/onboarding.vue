<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
      <div
        class="absolute -bottom-20 -left-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s;"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s;"
      />
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-950/50">
      <div class="max-w-5xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 group"
          >
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div class="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-2.5">
                <Icon
                  name="lucide:party-popper"
                  class="w-6 h-6 text-white"
                />
              </div>
            </div>
            <div>
              <div class="text-xl font-bold text-white tracking-tight">BouncePro</div>
              <div class="text-xs text-gray-500 font-medium">Getting Started</div>
            </div>
          </NuxtLink>

          <!-- Progress Info & Exit -->
          <div class="flex items-center gap-6">
            <div class="hidden sm:flex items-center gap-3">
              <div class="text-sm text-gray-400">
                Step <span class="text-amber-400 font-semibold">{{ state.currentStep }}</span> of {{ state.totalSteps }}
              </div>
              <div class="h-4 w-px bg-gray-700" />
              <div class="text-xs text-gray-500">
                {{ Math.round((state.currentStep / state.totalSteps) * 100) }}% complete
              </div>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-gray-400 hover:text-white"
              @click="handleExit"
            >
              <template #leading>
                <Icon
                  name="lucide:x"
                  class="w-4 h-4"
                />
              </template>
              Exit
            </UButton>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 relative h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        <!-- Step indicators (desktop) -->
        <div class="hidden md:flex items-center justify-between mt-6 relative">
          <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-800 -translate-y-1/2" />
          <div
            class="absolute top-1/2 left-0 h-px bg-gradient-to-r from-amber-500 to-orange-500 -translate-y-1/2 transition-all duration-700"
            :style="{ width: `${((state.currentStep - 1) / (state.totalSteps - 1)) * 100}%` }"
          />

          <div
            v-for="step in steps"
            :key="step.number"
            class="relative flex flex-col items-center gap-2 cursor-pointer group"
            @click="goToStep(step.number)"
          >
            <div
              class="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300"
              :class="[
                step.number < state.currentStep
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                  : step.number === state.currentStep
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/50 scale-110 ring-4 ring-amber-500/20'
                    : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300'
              ]"
            >
              <Icon
                v-if="step.number < state.currentStep"
                name="lucide:check"
                class="w-5 h-5"
              />
              <span v-else>{{ step.number }}</span>
            </div>
            <div
              class="text-xs font-medium text-center max-w-20 transition-colors"
              :class="[
                step.number <= state.currentStep
                  ? 'text-amber-400'
                  : 'text-gray-500 group-hover:text-gray-400'
              ]"
            >
              {{ step.label }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 py-8 sm:py-12">
      <div class="max-w-3xl mx-auto px-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { state, progress, goToStep } = useOnboarding()

const steps = [
  { number: 1, label: 'Welcome' },
  { number: 2, label: 'Business' },
  { number: 3, label: 'First Item' },
  { number: 4, label: 'Hours' },
  { number: 5, label: 'Payments' },
  { number: 6, label: 'Complete' }
]

const handleExit = async () => {
  if (confirm('Are you sure you want to exit onboarding? Your progress will be saved.')) {
    await navigateTo('/app')
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
