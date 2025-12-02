<template>
  <div class="animate-slide-in">
    <!-- Step Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
        <Icon name="lucide:building" class="w-4 h-4" />
        Step 1: Business Information
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
        Tell us about your business
      </h1>
      <p class="text-gray-400 max-w-xl mx-auto">
        This helps us customize your experience and create your booking page
      </p>
    </div>

    <!-- Form Card -->
    <div class="relative">
      <div class="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-xl"></div>

      <UCard class="relative bg-gray-900/90 backdrop-blur-xl border-gray-700/50">
        <form @submit.prevent="handleNext" class="space-y-6">
          <!-- Business Name -->
          <UFormGroup
            label="Business Name"
            required
            :help="businessNameHelp"
          >
            <UInput
              v-model="form.name"
              type="text"
              placeholder="e.g., Happy Jumpers Party Rentals"
              size="xl"
              icon="lucide:building"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 focus:border-amber-500',
                icon: { trailing: { pointer: '' } }
              }"
              @input="debouncedSave"
            />
          </UFormGroup>

          <!-- Business Type -->
          <UFormGroup
            label="Business Type"
            required
            help="What type of rentals do you offer?"
          >
            <USelect
              v-model="form.type"
              :options="businessTypes"
              placeholder="Select your business type"
              size="xl"
              icon="lucide:briefcase"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 focus:border-amber-500'
              }"
              @change="debouncedSave"
            />
          </UFormGroup>

          <!-- Timezone -->
          <UFormGroup
            label="Timezone"
            required
            help="We've detected your timezone automatically"
          >
            <USelect
              v-model="form.timezone"
              :options="timezones"
              placeholder="Select your timezone"
              size="xl"
              icon="lucide:clock"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 focus:border-amber-500'
              }"
              @change="debouncedSave"
            />
          </UFormGroup>

          <!-- Service Area -->
          <UFormGroup
            label="Primary Service Area"
            help="City, ZIP code, or region you serve"
          >
            <UInput
              v-model="form.serviceArea"
              type="text"
              placeholder="e.g., Austin, TX or 78701"
              size="xl"
              icon="lucide:map-pin"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 focus:border-amber-500',
                icon: { trailing: { pointer: '' } }
              }"
              @input="debouncedSave"
            />
          </UFormGroup>

          <!-- Auto-save indicator -->
          <div v-if="isSaving" class="flex items-center gap-2 text-sm text-amber-400">
            <Icon name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
            Saving progress...
          </div>
          <div v-else-if="savedRecently" class="flex items-center gap-2 text-sm text-green-400">
            <Icon name="lucide:check-circle" class="w-4 h-4" />
            Progress saved
          </div>
        </form>
      </UCard>
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between mt-8">
      <UButton
        color="gray"
        variant="ghost"
        size="lg"
        @click="handleBack"
        class="text-gray-400 hover:text-white"
      >
        <template #leading>
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
        </template>
        Back
      </UButton>

      <UButton
        size="lg"
        :disabled="!isFormValid"
        @click="handleNext"
        class="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
      >
        Continue
        <template #trailing>
          <Icon name="lucide:arrow-right" class="w-5 h-5" />
        </template>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, nextStep, prevStep, saveProgress } = useOnboarding()

const form = reactive({
  name: state.value.business.name || '',
  type: state.value.business.type || '',
  timezone: state.value.business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  serviceArea: state.value.business.serviceArea || ''
})

const businessTypes = [
  { label: 'Bounce Houses', value: 'bounce_houses' },
  { label: 'Party Rentals', value: 'party_rentals' },
  { label: 'Inflatables', value: 'inflatables' },
  { label: 'Events & Entertainment', value: 'events' },
  { label: 'Other', value: 'other' }
]

const timezones = [
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Alaska Time (AKT)', value: 'America/Anchorage' },
  { label: 'Hawaii Time (HT)', value: 'Pacific/Honolulu' }
]

const isSaving = ref(false)
const savedRecently = ref(false)

const businessNameHelp = computed(() => {
  if (!form.name) return 'This will appear on your booking page'
  return `Your booking page will be at bouncepro.com/${slugify(form.name)}`
})

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && form.type.length > 0
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const debouncedSave = useDebounceFn(() => {
  isSaving.value = true

  // Update state
  state.value.business.name = form.name
  state.value.business.type = form.type
  state.value.business.timezone = form.timezone
  state.value.business.serviceArea = form.serviceArea

  saveProgress()

  setTimeout(() => {
    isSaving.value = false
    savedRecently.value = true
    setTimeout(() => {
      savedRecently.value = false
    }, 2000)
  }, 300)
}, 500)

const handleNext = () => {
  if (!isFormValid.value) return

  // Save final state
  state.value.business.name = form.name
  state.value.business.type = form.type
  state.value.business.timezone = form.timezone
  state.value.business.serviceArea = form.serviceArea

  saveProgress()
  nextStep()
  navigateTo('/app/onboarding/item')
}

const handleBack = () => {
  prevStep()
  navigateTo('/app/onboarding')
}

useHead({
  title: 'Business Info - Onboarding | BouncePro'
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
