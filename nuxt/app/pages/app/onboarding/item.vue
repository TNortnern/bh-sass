<template>
  <div class="animate-slide-in">
    <!-- Step Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
        <Icon
          name="lucide:package-plus"
          class="w-4 h-4"
        />
        Step 2: Your First Rental Item
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
        Add your first rental item
      </h1>
      <p class="text-gray-400 max-w-xl mx-auto">
        This will be the first item customers can book on your page. You can add more items later.
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
          <!-- Photo Upload Placeholder -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-3">
              Item Photo <span class="text-gray-500">(optional)</span>
            </label>
            <div
              class="relative border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-amber-500/50 transition-colors cursor-pointer group"
              @click="handlePhotoClick"
            >
              <div
                v-if="!form.photo"
                class="text-center"
              >
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4 group-hover:bg-amber-500/10 transition-colors">
                  <Icon
                    name="lucide:image"
                    class="w-8 h-8 text-gray-500 group-hover:text-amber-400 transition-colors"
                  />
                </div>
                <p class="text-gray-400 mb-2">
                  Click to upload a photo
                </p>
                <p class="text-sm text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <div
                v-else
                class="text-center"
              >
                <div class="inline-flex items-center gap-2 text-amber-400">
                  <Icon
                    name="lucide:check-circle"
                    class="w-5 h-5"
                  />
                  Photo selected (mock)
                </div>
              </div>
            </div>
          </div>

          <!-- Item Name -->
          <UFormField
            label="Item Name"
            required
            help="What's the name of this rental item?"
            size="xl"
          >
            <UInput
              v-model="form.name"
              type="text"
              placeholder="e.g., Castle Bounce House, Water Slide, etc."
              size="xl"
              icon="i-lucide-castle"
              class="w-full"
              @input="debouncedSave"
            />
          </UFormField>

          <!-- Description -->
          <UFormField
            label="Short Description"
            help="A brief description for customers (2-3 sentences)"
            size="xl"
          >
            <UTextarea
              v-model="form.description"
              placeholder="Describe your item, its features, dimensions, age group, etc."
              :rows="4"
              size="xl"
              class="w-full"
              @input="debouncedSave"
            />
          </UFormField>

          <!-- Price -->
          <UFormField
            label="Daily Rental Price"
            required
            help="How much do you charge per day?"
            size="xl"
          >
            <UInput
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              size="xl"
              class="w-full"
              @input="debouncedSave"
            >
              <template #leading>
                <span class="text-gray-400">$</span>
              </template>
            </UInput>
          </UFormField>

          <!-- Preview Card -->
          <div
            v-if="form.name || form.description || form.price"
            class="pt-4"
          >
            <label class="block text-sm font-medium text-gray-300 mb-3">
              Preview
            </label>
            <div class="border border-gray-700/50 rounded-xl p-5 bg-gray-800/30">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-700/50 flex items-center justify-center">
                  <Icon
                    name="lucide:image"
                    class="w-8 h-8 text-gray-600"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-semibold text-lg mb-1">
                    {{ form.name || 'Item Name' }}
                  </h3>
                  <p class="text-sm text-gray-400 mb-2 line-clamp-2">
                    {{ form.description || 'Item description will appear here' }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-amber-400">
                      ${{ form.price || '0' }}
                    </span>
                    <span class="text-sm text-gray-500">/ day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Auto-save indicator -->
          <div
            v-if="isSaving"
            class="flex items-center gap-2 text-sm text-amber-400"
          >
            <Icon
              name="lucide:loader-circle"
              class="w-4 h-4 animate-spin"
            />
            Saving progress...
          </div>
          <div
            v-else-if="savedRecently"
            class="flex items-center gap-2 text-sm text-green-400"
          >
            <Icon
              name="lucide:check-circle"
              class="w-4 h-4"
            />
            Progress saved
          </div>
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

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          class="text-gray-400 hover:text-white"
          @click="handleSkip"
        >
          Skip for now
        </UButton>

        <UButton
          size="lg"
          :disabled="!isFormValid"
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding'
})

const { state, nextStep, prevStep, saveProgress } = useOnboarding()

const form = reactive({
  name: state.value.firstItem?.name || '',
  description: state.value.firstItem?.description || '',
  price: state.value.firstItem?.price || 0,
  photo: state.value.firstItem?.photo || null
})

const isSaving = ref(false)
const savedRecently = ref(false)

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && form.price > 0
})

const handlePhotoClick = () => {
  // Mock photo upload
  form.photo = 'mock-photo.jpg'
  debouncedSave()
}

const debouncedSave = useDebounceFn(() => {
  isSaving.value = true

  // Update state
  if (state.value) {
    state.value.firstItem = {
      name: form.name,
      description: form.description,
      price: form.price,
      photo: form.photo
    }
  }

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
  if (state.value) {
    state.value.firstItem = {
      name: form.name,
      description: form.description,
      price: form.price,
      photo: form.photo
    }
  }

  saveProgress()
  nextStep()
  navigateTo('/app/onboarding/availability')
}

const handleBack = () => {
  prevStep()
  navigateTo('/app/onboarding/business')
}

const handleSkip = () => {
  if (state.value) {
    state.value.firstItem = null
  }
  saveProgress()
  nextStep()
  navigateTo('/app/onboarding/availability')
}

useHead({
  title: 'Add Item - Onboarding | BouncePro'
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
