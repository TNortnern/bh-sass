<template>
  <div class="animate-slide-in">
    <!-- Step Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
        <Icon
          name="lucide:calendar-clock"
          class="w-4 h-4"
        />
        Step 3: Business Hours
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
        Set your business hours
      </h1>
      <p class="text-gray-400 max-w-xl mx-auto">
        Define when you're available to take bookings
      </p>
    </div>

    <!-- Form Card -->
    <div class="relative">
      <div class="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-xl" />

      <UCard class="relative bg-gray-900/90 backdrop-blur-xl border-gray-700/50">
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="flex flex-wrap gap-3">
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              @click="copyToWeekdays"
            >
              <template #leading>
                <Icon
                  name="lucide:copy"
                  class="w-4 h-4"
                />
              </template>
              Copy Monday to all weekdays
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              @click="enableAll"
            >
              <template #leading>
                <Icon
                  name="lucide:check"
                  class="w-4 h-4"
                />
              </template>
              Enable all days
            </UButton>
          </div>

          <!-- Days of Week -->
          <div class="space-y-3">
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="flex items-center gap-4 p-4 rounded-xl transition-all"
              :class="[
                availability[day]?.enabled
                  ? 'bg-gray-800/50 border border-gray-700/50'
                  : 'bg-gray-800/20 border border-gray-700/20 opacity-60'
              ]"
            >
              <!-- Day Toggle -->
              <div
                v-if="availability[day]"
                class="flex items-center gap-3 min-w-[140px]"
              >
                <USwitch
                  v-model="availability[day].enabled"
                  size="lg"
                  color="warning"
                  @update:model-value="debouncedSave"
                />
                <label class="font-medium text-white capitalize cursor-pointer select-none">
                  {{ day }}
                </label>
              </div>

              <!-- Time Inputs -->
              <div
                v-if="availability[day] && availability[day]?.enabled"
                class="flex items-center gap-3 flex-1"
              >
                <div class="flex-1">
                  <UInput
                    v-model="availability[day].open"
                    type="time"
                    size="lg"
                    class="dark-time-input"
                    :ui="{
                      base: 'bg-gray-800/50 border-gray-700 text-white focus:border-amber-500'
                    }"
                    @change="debouncedSave"
                  />
                </div>
                <span class="text-gray-400">to</span>
                <div class="flex-1">
                  <UInput
                    v-model="availability[day].close"
                    type="time"
                    size="lg"
                    class="dark-time-input"
                    :ui="{
                      base: 'bg-gray-800/50 border-gray-700 text-white focus:border-amber-500'
                    }"
                    @change="debouncedSave"
                  />
                </div>
              </div>

              <div
                v-else
                class="flex-1 text-sm text-gray-500"
              >
                Closed
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Info Card -->
    <div class="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
      <div class="flex gap-3">
        <Icon
          name="lucide:info"
          class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <p class="text-sm text-blue-300">
            <strong>Tip:</strong> You can always change your availability later and set custom hours for holidays or special events.
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

      <UButton
        size="lg"
        :loading="isSaving"
        :disabled="isSaving"
        class="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
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
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, nextStep, prevStep, saveBusinessHours } = useOnboarding()
const toast = useToast()

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const availability = reactive({ ...state.value.availability })

const isSaving = ref(false)

const copyToWeekdays = () => {
  const mondaySchedule = availability.monday as { open: string, close: string, enabled: boolean } | undefined
  if (!mondaySchedule) return

  const weekdays = ['tuesday', 'wednesday', 'thursday', 'friday'] as const

  weekdays.forEach((day) => {
    availability[day] = { ...mondaySchedule }
  })

  debouncedSave()
}

const enableAll = () => {
  daysOfWeek.forEach((day) => {
    const dayAvailability = availability[day]
    if (dayAvailability) {
      availability[day] = { ...dayAvailability, enabled: true }
    }
  })
  debouncedSave()
}

const debouncedSave = useDebounceFn(() => {
  // Update local state only for UI feedback
  if (state.value.availability) {
    Object.assign(state.value.availability, availability)
  }
}, 500)

const handleNext = async () => {
  isSaving.value = true

  try {
    // Update local state
    if (state.value.availability) {
      Object.assign(state.value.availability, availability)
    }

    // Save to database
    await saveBusinessHours(availability)

    toast.add({
      title: 'Business hours saved',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    nextStep()
    navigateTo('/app/onboarding/complete')
  } catch (error) {
    console.error('Failed to save business hours:', error)
    toast.add({
      title: 'Failed to save',
      description: 'Please try again',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isSaving.value = false
  }
}

const handleBack = () => {
  prevStep()
  navigateTo('/app/onboarding/business')
}

useHead({
  title: 'Availability - Onboarding | BouncePro'
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

/* Fix for dark mode time inputs */
.dark-time-input :deep(input[type="time"]) {
  color-scheme: dark;
  color: white;
}

.dark-time-input :deep(input[type="time"]::-webkit-calendar-picker-indicator) {
  filter: invert(1);
}
</style>
