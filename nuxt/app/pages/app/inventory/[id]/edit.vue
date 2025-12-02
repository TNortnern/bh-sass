<script setup lang="ts">
import type { InventoryItem } from '~/composables/useInventory'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchItem, updateItem, isLoading } = useInventory()

const itemId = computed(() => route.params.id as string)
const isFetching = ref(true)
const currentStep = ref(1)
const totalSteps = 4

// Form data
const formData = ref({
  // Step 1: Basic Info
  name: '',
  category: 'bounce_house',
  description: '',
  status: 'active',

  // Step 2: Specifications
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  weight: 0,
  capacity: {
    maxOccupants: 0,
    maxWeight: 0
  },
  ageRange: {
    min: 0,
    max: 0
  },
  setupTime: 0,
  requiredSpace: {
    length: 0,
    width: 0
  },

  // Step 3: Pricing
  pricing: {
    hourly: 0,
    daily: 0,
    weekend: 0,
    weekly: 0
  },

  // Step 4: Setup & Images
  setupRequirements: {
    powerOutlet: false,
    waterSource: false,
    anchoringMethod: 'stakes' as 'stakes' | 'sandbags' | 'both',
    setupCrew: 1
  },
  images: [] as string[]
})

// Fetch existing item data
onMounted(async () => {
  try {
    const item = await fetchItem(itemId.value)
    if (item) {
      populateFormData(item)
    } else {
      toast.add({
        title: 'Error',
        description: 'Item not found',
        color: 'error'
      })
      router.push('/app/inventory')
    }
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Failed to load item',
      color: 'error'
    })
  } finally {
    isFetching.value = false
  }
})

const populateFormData = (item: InventoryItem) => {
  formData.value.name = item.name || ''
  formData.value.category = item.category || 'bounce-house'
  formData.value.description = item.description || ''
  formData.value.status = item.status || 'active'

  if (item.specifications) {
    formData.value.dimensions = item.specifications.dimensions || { length: 0, width: 0, height: 0 }
    formData.value.weight = item.specifications.weight || 0
    formData.value.capacity = item.specifications.capacity || { maxOccupants: 0, maxWeight: 0 }
    formData.value.ageRange = item.specifications.ageRange || { min: 0, max: 0 }
    formData.value.setupTime = item.specifications.setupTime || 0
    formData.value.requiredSpace = item.specifications.requiredSpace || { length: 0, width: 0 }
  }

  if (item.pricing) {
    formData.value.pricing = {
      hourly: item.pricing.hourly || 0,
      daily: item.pricing.daily || 0,
      weekend: item.pricing.weekend || 0,
      weekly: item.pricing.weekly || 0
    }
  }

  if (item.setupRequirements) {
    formData.value.setupRequirements = {
      powerOutlet: item.setupRequirements.powerOutlet || false,
      waterSource: item.setupRequirements.waterSource || false,
      anchoringMethod: item.setupRequirements.anchoringMethod || 'stakes',
      setupCrew: item.setupRequirements.setupCrew || 1
    }
  }

  formData.value.images = item.images || []
}

const categoryItems = [
  { label: 'Bounce House', value: 'bounce_house' },
  { label: 'Water Slide', value: 'water_slide' },
  { label: 'Obstacle Course', value: 'obstacle_course' },
  { label: 'Game', value: 'game' },
  { label: 'Combo', value: 'combo' },
  { label: 'Other', value: 'other' }
]

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const anchoringItems = [
  { label: 'Stakes', value: 'stakes' },
  { label: 'Sandbags', value: 'sandbags' },
  { label: 'Both', value: 'both' }
]

const steps = [
  { number: 1, title: 'Basic Info', icon: 'i-lucide-info' },
  { number: 2, title: 'Specifications', icon: 'i-lucide-ruler' },
  { number: 3, title: 'Pricing', icon: 'i-lucide-dollar-sign' },
  { number: 4, title: 'Setup & Images', icon: 'i-lucide-settings' }
]

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return formData.value.name.trim() !== '' && formData.value.description.trim() !== ''
    case 2:
      // Check for valid numbers (not NaN, not 0, not empty)
      const dims = formData.value.dimensions
      return Number(dims.length) > 0 &&
             Number(dims.width) > 0 &&
             Number(dims.height) > 0
    case 3:
      const pricing = formData.value.pricing
      return Number(pricing.hourly) > 0 &&
             Number(pricing.daily) > 0 &&
             Number(pricing.weekend) > 0
    case 4:
      return true
    default:
      return false
  }
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  try {
    await updateItem(itemId.value, {
      name: formData.value.name,
      category: formData.value.category as any,
      description: formData.value.description,
      images: formData.value.images,
      specifications: {
        dimensions: formData.value.dimensions,
        weight: formData.value.weight,
        capacity: formData.value.capacity,
        ageRange: formData.value.ageRange,
        setupTime: formData.value.setupTime,
        requiredSpace: formData.value.requiredSpace
      },
      pricing: formData.value.pricing,
      setupRequirements: formData.value.setupRequirements,
      status: formData.value.status as any
    })

    toast.add({
      title: 'Success',
      description: 'Item updated successfully',
      color: 'success'
    })

    router.push(`/app/inventory/${itemId.value}`)
  } catch (err) {
    toast.add({
      title: 'Error',
      description: 'Failed to update item',
      color: 'error'
    })
  }
}

</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isFetching" class="space-y-6">
      <USkeleton class="h-12 w-96" />
      <USkeleton class="h-20" />
      <USkeleton class="h-96" />
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          :to="`/app/inventory/${itemId}`"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Inventory Item</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Update {{ formData.name }}</p>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div
            v-for="step in steps"
            :key="step.number"
            class="flex items-center flex-1"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all"
                :class="currentStep >= step.number
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
              >
                <UIcon v-if="currentStep > step.number" name="i-lucide-check" class="w-5 h-5" />
                <span v-else>{{ step.number }}</span>
              </div>
              <div class="hidden md:block">
                <p
                  class="text-sm font-medium"
                  :class="currentStep >= step.number
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-500 dark:text-gray-400'"
                >
                  {{ step.title }}
                </p>
              </div>
            </div>
            <div
              v-if="step.number < totalSteps"
              class="flex-1 h-0.5 mx-4"
              :class="currentStep > step.number
                ? 'bg-orange-500'
                : 'bg-gray-200 dark:bg-gray-700'"
            />
          </div>
        </div>
      </div>

      <!-- Form -->
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <form @submit.prevent="currentStep === totalSteps ? handleSubmit() : nextStep()">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6">
            <UFormField label="Item Name" required>
              <UInput
                v-model="formData.name"
                size="lg"
                placeholder="e.g., Castle Bounce House XL"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Category" required>
              <USelect
                v-model="formData.category"
                :items="categoryItems"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Description" required>
              <UTextarea
                v-model="formData.description"
                size="lg"
                placeholder="Describe the item, its features, and what makes it special..."
                :rows="4"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Status">
              <USelect
                v-model="formData.status"
                :items="statusItems"
                size="lg"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Step 2: Specifications -->
          <div v-if="currentStep === 2" class="space-y-6">
            <UFormField label="Dimensions (feet)" required>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length</label>
                  <UInput
                    v-model.number="formData.dimensions.length"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="15"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                  <UInput
                    v-model.number="formData.dimensions.width"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="15"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Height</label>
                  <UInput
                    v-model.number="formData.dimensions.height"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="14"
                    class="w-full"
                  />
                </div>
              </div>
            </UFormField>

            <UFormField label="Weight (lbs)">
              <UInput
                v-model.number="formData.weight"
                type="number"
                min="0"
                size="lg"
                placeholder="185"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Capacity">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Occupants</label>
                  <UInput
                    v-model.number="formData.capacity.maxOccupants"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="8"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Weight (lbs)</label>
                  <UInput
                    v-model.number="formData.capacity.maxWeight"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="1000"
                    class="w-full"
                  />
                </div>
              </div>
            </UFormField>

            <UFormField label="Age Range (years)">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum Age</label>
                  <UInput
                    v-model.number="formData.ageRange.min"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="3"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum Age</label>
                  <UInput
                    v-model.number="formData.ageRange.max"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="12"
                    class="w-full"
                  />
                </div>
              </div>
            </UFormField>

            <UFormField label="Setup Time (minutes)">
              <UInput
                v-model.number="formData.setupTime"
                type="number"
                min="0"
                size="lg"
                placeholder="30"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Required Space (feet)">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Length</label>
                  <UInput
                    v-model.number="formData.requiredSpace.length"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="18"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Width</label>
                  <UInput
                    v-model.number="formData.requiredSpace.width"
                    type="number"
                    min="0"
                    size="lg"
                    placeholder="18"
                    class="w-full"
                  />
                </div>
              </div>
            </UFormField>
          </div>

          <!-- Step 3: Pricing -->
          <div v-if="currentStep === 3" class="space-y-6">
            <UFormField label="Hourly Rate" required>
              <UInput
                v-model.number="formData.pricing.hourly"
                type="number"
                min="0"
                step="0.01"
                size="lg"
                placeholder="75.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField label="Daily Rate" required>
              <UInput
                v-model.number="formData.pricing.daily"
                type="number"
                min="0"
                step="0.01"
                size="lg"
                placeholder="250.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField label="Weekend Rate" required>
              <UInput
                v-model.number="formData.pricing.weekend"
                type="number"
                min="0"
                step="0.01"
                size="lg"
                placeholder="400.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </template>
              </UInput>
            </UFormField>

            <UFormField label="Weekly Rate" help="Optional">
              <UInput
                v-model.number="formData.pricing.weekly"
                type="number"
                min="0"
                step="0.01"
                size="lg"
                placeholder="800.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </template>
              </UInput>
            </UFormField>

            <!-- Pricing Preview -->
            <div class="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p class="text-sm font-medium text-orange-900 dark:text-orange-100 mb-3">Pricing Preview</p>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-orange-700 dark:text-orange-300">Hourly:</span>
                  <span class="font-semibold text-orange-900 dark:text-orange-100">
                    ${{ formData.pricing.hourly || 0 }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-orange-700 dark:text-orange-300">Daily:</span>
                  <span class="font-semibold text-orange-900 dark:text-orange-100">
                    ${{ formData.pricing.daily || 0 }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-orange-700 dark:text-orange-300">Weekend:</span>
                  <span class="font-semibold text-orange-900 dark:text-orange-100">
                    ${{ formData.pricing.weekend || 0 }}
                  </span>
                </div>
                <div v-if="formData.pricing.weekly" class="flex justify-between">
                  <span class="text-orange-700 dark:text-orange-300">Weekly:</span>
                  <span class="font-semibold text-orange-900 dark:text-orange-100">
                    ${{ formData.pricing.weekly }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Setup & Images -->
          <div v-if="currentStep === 4" class="space-y-6">
            <UFormField label="Setup Requirements">
              <div class="space-y-3">
                <label class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                  <UCheckbox v-model="formData.setupRequirements.powerOutlet" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Power Outlet Required</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Requires access to electrical outlet</p>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                  <UCheckbox v-model="formData.setupRequirements.waterSource" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Water Source Required</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Requires access to water hookup</p>
                  </div>
                </label>
              </div>
            </UFormField>

            <UFormField label="Anchoring Method">
              <USelect
                v-model="formData.setupRequirements.anchoringMethod"
                :items="anchoringItems"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Setup Crew Size">
              <UInput
                v-model.number="formData.setupRequirements.setupCrew"
                type="number"
                min="1"
                size="lg"
                placeholder="2"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Images">
              <UiImageUploader v-model="formData.images" :max-images="10" />
            </UFormField>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <UButton
              v-if="currentStep > 1"
              type="button"
              color="neutral"
              variant="outline"
              size="lg"
              @click="previousStep"
            >
              <UIcon name="i-lucide-arrow-left" class="w-5 h-5 mr-2" />
              Previous
            </UButton>
            <UButton
              v-else
              type="button"
              color="neutral"
              variant="ghost"
              size="lg"
              :to="`/app/inventory/${itemId}`"
            >
              Cancel
            </UButton>

            <UButton
              v-if="currentStep < totalSteps"
              type="submit"
              color="primary"
              size="lg"
              :disabled="!canProceed"
            >
              Next
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5 ml-2" />
            </UButton>
            <UButton
              v-else
              type="submit"
              color="primary"
              size="lg"
              :loading="isLoading"
            >
              <UIcon name="i-lucide-check" class="w-5 h-5 mr-2" />
              Save Changes
            </UButton>
          </div>
        </form>
      </UCard>
    </template>
  </div>
</template>
