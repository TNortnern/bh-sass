<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const route = useRoute()
const toast = useToast()
const { fetchAddOn, updateAddOn } = useAddOns()

const addonId = route.params.id as string

// Form state
const form = ref({
  name: '',
  description: '',
  icon: 'i-lucide-circle-plus',
  category: 'other',
  pricing: {
    type: 'fixed',
    amount: 0
  },
  required: false,
  active: true
})

const isLoading = ref(true)
const isSubmitting = ref(false)

// Load addon data
onMounted(async () => {
  try {
    const addon = await fetchAddOn(addonId)

    form.value = {
      name: addon.name,
      description: addon.description || '',
      icon: addon.icon || 'i-lucide-circle-plus',
      category: addon.category || 'other',
      pricing: {
        type: addon.pricing.type,
        amount: addon.pricing.amount
      },
      required: addon.required,
      active: addon.active
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load add-on',
      color: 'red'
    })
    router.push('/app/addons')
  } finally {
    isLoading.value = false
  }
})

// Category options
const categoryOptions = [
  { label: 'Delivery & Setup', value: 'delivery' },
  { label: 'Setup', value: 'setup' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Services', value: 'service' },
  { label: 'Other', value: 'other' }
]

// Pricing type options
const pricingTypeOptions = [
  { label: 'Fixed Amount', value: 'fixed' },
  { label: 'Per Item', value: 'perItem' },
  { label: 'Per Day', value: 'perDay' }
]

// Handle submit
const handleSubmit = async () => {
  // Validation
  if (!form.value.name) {
    toast.add({
      title: 'Validation Error',
      description: 'Add-on name is required',
      color: 'red'
    })
    return
  }

  if (!form.value.pricing.amount || form.value.pricing.amount <= 0) {
    toast.add({
      title: 'Validation Error',
      description: 'Price must be greater than 0',
      color: 'red'
    })
    return
  }

  isSubmitting.value = true

  const result = await updateAddOn(addonId, form.value)

  if (result.success) {
    toast.add({
      title: 'Add-on updated',
      description: `${form.value.name} has been updated`,
      color: 'green'
    })
    router.push('/app/addons')
  } else {
    toast.add({
      title: 'Failed to update add-on',
      description: result.error,
      color: 'red'
    })
  }

  isSubmitting.value = false
}

// Handle cancel
const handleCancel = () => {
  router.push('/app/addons')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        @click="handleCancel"
      />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Add-On Service</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Update service details and pricing
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
    </div>

    <!-- Form -->
    <div v-else class="max-w-3xl">
      <div class="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>

          <UFormField label="Service Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Delivery & Setup, Generator Rental"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="form.description"
              placeholder="Describe this add-on service..."
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Category" required>
            <USelect
              v-model="form.category"
              :items="categoryOptions"
              value-attribute="value"
              option-attribute="label"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Icon Selection -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Icon</h2>
          <IconPicker v-model="form.icon" />
        </div>

        <!-- Pricing -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h2>

          <UFormField label="Pricing Type" required>
            <USelect
              v-model="form.pricing.type"
              :items="pricingTypeOptions"
              value-attribute="value"
              option-attribute="label"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Price" required>
            <UInput
              v-model.number="form.pricing.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              icon="i-lucide-dollar-sign"
              class="w-full"
            />
            <template #help>
              <p v-if="form.pricing.type === 'fixed'" class="text-xs text-gray-500">
                This is a one-time charge added to the booking
              </p>
              <p v-else-if="form.pricing.type === 'perItem'" class="text-xs text-gray-500">
                This will be multiplied by the number of items in the booking
              </p>
              <p v-else-if="form.pricing.type === 'perDay'" class="text-xs text-gray-500">
                This will be multiplied by the number of rental days
              </p>
            </template>
          </UFormField>
        </div>

        <!-- Options -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Options</h2>

          <div class="space-y-3">
            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                v-model="form.required"
                type="checkbox"
                class="w-4 h-4 text-amber-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-amber-500 focus:ring-offset-2"
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">Required</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  This add-on will be automatically included in all bookings
                </p>
              </div>
            </label>

            <label class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-amber-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-amber-500 focus:ring-offset-2"
              />
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">Active</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  This add-on will be available for selection
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="handleCancel"
            :disabled="isSubmitting"
          />
          <UButton
            label="Save Changes"
            icon="i-lucide-check"
            :loading="isSubmitting"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
