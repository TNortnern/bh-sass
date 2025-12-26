<template>
  <div class="animate-slide-in">
    <!-- Step Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
        <Icon
          name="lucide:building"
          class="w-4 h-4"
        />
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
      <div class="absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-xl" />

      <UCard class="relative bg-gray-900/90 backdrop-blur-xl border-gray-700/50">
        <form
          class="space-y-6"
          @submit.prevent="handleNext"
        >
          <!-- Business Name -->
          <UFormField
            label="Business Name"
            required
            :help="businessNameHelp"
            size="xl"
          >
            <UInput
              v-model="form.name"
              type="text"
              placeholder="e.g., Happy Jumpers Party Rentals"
              size="xl"
              icon="i-lucide-building"
              class="w-full"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500 autofill:bg-gray-800'
              }"
              @input="debouncedSave"
            />
          </UFormField>

          <!-- Business Type -->
          <UFormField
            label="Business Type"
            required
            help="What types of rentals do you offer? (Select all that apply)"
            size="xl"
          >
            <USelectMenu
              v-model="form.types"
              :items="businessTypes as any"
              placeholder="Select your business types"
              size="xl"
              multiple
              class="w-full bg-gray-800/50 border-gray-700 text-white"
              @change="debouncedSave"
            />
          </UFormField>

          <!-- Timezone -->
          <UFormField
            label="Timezone"
            required
            help="We've detected your timezone automatically"
            size="xl"
          >
            <USelect
              v-model="form.timezone"
              :items="timezones"
              placeholder="Select your timezone"
              size="xl"
              icon="i-lucide-clock"
              class="w-full"
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 text-white focus:border-amber-500'
              }"
              @change="debouncedSave"
            />
          </UFormField>

          <!-- Service Area -->
          <UFormField
            label="Primary Service Area"
            help="Start typing to search for your city"
            size="xl"
          >
            <UInputMenu
              v-model="form.serviceArea"
              :items="filteredCities"
              placeholder="Search for your city..."
              size="xl"
              icon="i-lucide-map-pin"
              class="w-full"
              open-on-focus
              create-item
              :ui="{
                base: 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500',
                content: 'bg-gray-800 border-gray-700',
                item: 'text-white hover:bg-gray-700'
              }"
              @update:model-value="debouncedSave"
            />
          </UFormField>
        </form>
      </UCard>
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
        :disabled="!isFormValid || isSaving"
        :loading="isSaving"
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

const { state, nextStep, prevStep, saveBusinessInfo } = useOnboarding()
const toast = useToast()

const form = reactive({
  name: state.value.business.name || '',
  types: state.value.business.types || [] as string[],
  timezone: state.value.business.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  serviceArea: state.value.business.serviceArea || ''
})

const businessTypes = [
  { label: 'Bounce Houses', value: 'bounce_houses' },
  { label: 'Water Slides', value: 'water_slides' },
  { label: 'Inflatables', value: 'inflatables' },
  { label: 'Party Rentals', value: 'party_rentals' },
  { label: 'Event Equipment', value: 'event_equipment' },
  { label: 'Tables & Chairs', value: 'tables_chairs' },
  { label: 'Tents & Canopies', value: 'tents_canopies' },
  { label: 'Games & Activities', value: 'games' },
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

// Popular US cities for autocomplete (top 100 metro areas)
const usCities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ',
  'Sacramento, CA', 'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO', 'Omaha, NE',
  'Raleigh, NC', 'Miami, FL', 'Long Beach, CA', 'Virginia Beach, VA', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Tampa, FL', 'Arlington, TX', 'New Orleans, LA',
  'Wichita, KS', 'Cleveland, OH', 'Bakersfield, CA', 'Aurora, CO', 'Anaheim, CA',
  'Honolulu, HI', 'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY',
  'Henderson, NV', 'Stockton, CA', 'Saint Paul, MN', 'Cincinnati, OH', 'St. Louis, MO',
  'Pittsburgh, PA', 'Greensboro, NC', 'Lincoln, NE', 'Anchorage, AK', 'Plano, TX',
  'Orlando, FL', 'Irvine, CA', 'Newark, NJ', 'Durham, NC', 'Chula Vista, CA',
  'Toledo, OH', 'Fort Wayne, IN', 'St. Petersburg, FL', 'Laredo, TX', 'Jersey City, NJ',
  'Chandler, AZ', 'Madison, WI', 'Lubbock, TX', 'Scottsdale, AZ', 'Reno, NV',
  'Buffalo, NY', 'Gilbert, AZ', 'Glendale, AZ', 'North Las Vegas, NV', 'Winston-Salem, NC',
  'Chesapeake, VA', 'Norfolk, VA', 'Fremont, CA', 'Garland, TX', 'Irving, TX',
  'Hialeah, FL', 'Richmond, VA', 'Boise, ID', 'Spokane, WA', 'Baton Rouge, LA'
]

const filteredCities = computed(() => usCities)

const isSaving = ref(false)

const businessNameHelp = computed(() => {
  if (!form.name) return 'This will appear on your booking page'
  return `Your booking page will be at bouncepro.com/${slugify(form.name)}`
})

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && form.types.length > 0
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
  // Update local state only for UI feedback
  Object.assign(state.value.business, {
    name: form.name,
    types: form.types,
    timezone: form.timezone,
    serviceArea: form.serviceArea
  })
}, 500)

const handleNext = async () => {
  if (!isFormValid.value) return

  isSaving.value = true

  try {
    // Update local state
    Object.assign(state.value.business, {
      name: form.name,
      types: form.types,
      timezone: form.timezone,
      serviceArea: form.serviceArea
    })

    // Save to database
    await saveBusinessInfo({
      name: form.name,
      types: form.types,
      timezone: form.timezone,
      serviceArea: form.serviceArea
    })

    toast.add({
      title: 'Business info saved',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    nextStep()
    navigateTo('/app/onboarding/availability')
  } catch (error) {
    console.error('Failed to save business info:', error)
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
