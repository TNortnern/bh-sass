<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div
      v-if="loadingCustomer"
      class="flex items-center justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Error State -->
    <div
      v-else-if="loadError"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-alert-circle"
        class="text-5xl text-red-400 mb-4"
      />
      <p class="text-gray-600 dark:text-gray-400">
        {{ loadError }}
      </p>
      <UButton
        color="primary"
        variant="outline"
        class="mt-4"
        @click="loadCustomerData"
      >
        Try Again
      </UButton>
    </div>

    <!-- Form -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          :to="`/app/customers/${customerId}`"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Customer
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Update customer information for {{ formData.firstName }} {{ formData.lastName }}
          </p>
        </div>
      </div>

      <!-- Form Card -->
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <UFormField
                    label="First Name"
                    required
                  >
                    <UInput
                      v-model="formData.firstName"
                      placeholder="John"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField
                    label="Last Name"
                    required
                  >
                    <UInput
                      v-model="formData.lastName"
                      placeholder="Doe"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <UFormField
                  label="Email"
                  required
                >
                  <UInput
                    v-model="formData.email"
                    type="email"
                    placeholder="john.doe@example.com"
                    size="lg"
                    icon="i-lucide-mail"
                    class="w-full"
                  />
                </UFormField>

                <UFormField
                  label="Phone"
                  required
                >
                  <UInput
                    v-model="formData.phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    size="lg"
                    icon="i-lucide-phone"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-800" />

            <!-- Address -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Address
              </h3>

              <div class="space-y-4">
                <UFormField label="Street Address">
                  <UInput
                    v-model="formData.address!.street"
                    placeholder="123 Main St"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="City">
                    <UInput
                      v-model="formData.address!.city"
                      placeholder="San Antonio"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField label="State">
                    <USelect
                      v-model="formData.address!.state"
                      :items="states"
                      placeholder="Select state"
                      size="lg"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <UFormField label="ZIP Code">
                  <UInput
                    v-model="formData.address!.zip"
                    placeholder="78201"
                    size="lg"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-800" />

            <!-- Additional Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Information
              </h3>

              <div class="space-y-4">
                <UFormField
                  label="Tags"
                  help="Add tags to categorize this customer"
                >
                  <UInput
                    v-model="tagsInput"
                    placeholder="vip, corporate, repeat-customer (comma separated)"
                    size="lg"
                    icon="i-lucide-tag"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Notes">
                  <UTextarea
                    v-model="formData.notes"
                    placeholder="Add any internal notes about this customer..."
                    :rows="4"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              size="lg"
              @click="handleCancel"
            >
              Cancel
            </UButton>

            <UButton
              type="submit"
              color="primary"
              size="lg"
              :loading="saving"
              :disabled="!canSubmit"
            >
              <UIcon
                name="i-lucide-check"
                class="w-5 h-5 mr-2"
              />
              Save Changes
            </UButton>
          </div>
        </form>
      </UCard>
    </template>

    <!-- Unsaved Changes Dialog -->
    <UiConfirmDialog
      v-model:open="showLeaveDialog"
      title="Unsaved Changes"
      message="You have unsaved changes. Are you sure you want to leave without saving?"
      confirm-label="Leave"
      cancel-label="Stay"
      confirm-color="warning"
      icon="i-lucide-alert-triangle"
      @confirm="confirmLeave"
      @cancel="cancelLeave"
    />
  </div>
</template>

<script setup lang="ts">
import type { CustomerInput } from '~/composables/useCustomers'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { fetchCustomer, updateCustomer } = useCustomers()

const customerId = computed(() => route.params.id as string)

const loadingCustomer = ref(true)
const loadError = ref<string | null>(null)
const saving = ref(false)

// Unsaved changes dialog state
const showLeaveDialog = ref(false)
const pendingNavigation = ref<string | null>(null)

// Track if form was successfully submitted (to skip unsaved changes check)
const formSubmitted = ref(false)

// Original data to compare for changes
const originalData = ref<string>('')

// Form data
const formData = ref<Partial<CustomerInput>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: 'TX',
    zip: ''
  },
  tags: [],
  notes: ''
})

// Tags input - comma separated string
const tagsInput = ref('')

// US States
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

// Validation
const canSubmit = computed(() => {
  return !!(
    formData.value.firstName?.trim()
    && formData.value.lastName?.trim()
    && formData.value.email?.trim()
    && formData.value.phone?.trim()
  )
})

const hasUnsavedChanges = computed(() => {
  const currentData = JSON.stringify({
    ...formData.value,
    tags: parseTags()
  })
  return currentData !== originalData.value
})

// Parse tags from comma-separated input
const parseTags = (): string[] => {
  if (!tagsInput.value.trim()) return []
  return tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// Load customer data
async function loadCustomerData() {
  loadingCustomer.value = true
  loadError.value = null

  try {
    const customer = await fetchCustomer(customerId.value)

    if (!customer) {
      loadError.value = 'Customer not found'
      return
    }

    // Populate form with customer data
    formData.value = {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: {
        street: customer.address?.street || '',
        city: customer.address?.city || '',
        state: customer.address?.state || 'TX',
        zip: customer.address?.zip || ''
      },
      tags: customer.tags || [],
      notes: customer.notes?.[0]?.content || ''
    }

    // Set tags input from array
    tagsInput.value = (customer.tags || []).join(', ')

    // Store original data for comparison
    originalData.value = JSON.stringify({
      ...formData.value,
      tags: customer.tags || []
    })
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to load customer')
    console.error('Error loading customer:', error)
    loadError.value = error.message
  } finally {
    loadingCustomer.value = false
  }
}

// Submit handler
async function handleSubmit() {
  if (!canSubmit.value) {
    toast.add({
      title: 'Required Fields',
      description: 'Please fill in all required fields (First Name, Last Name, Email, Phone)',
      color: 'error'
    })
    return
  }

  saving.value = true

  try {
    // Parse tags and prepare data
    const customerData: Partial<CustomerInput> = {
      ...formData.value,
      tags: parseTags()
    }

    await updateCustomer(customerId.value, customerData)

    // Show success toast
    toast.add({
      title: 'Customer updated',
      description: `${formData.value.firstName} ${formData.value.lastName} has been updated successfully.`,
      color: 'success'
    })

    // Mark as submitted to skip unsaved changes check
    formSubmitted.value = true

    // Navigate back to the customer detail page
    router.push(`/app/customers/${customerId.value}`)
  } catch (err) {
    const error = err instanceof Error ? err : new Error('An error occurred while updating the customer.')
    // Show error toast
    toast.add({
      title: 'Error updating customer',
      description: error.message,
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  if (hasUnsavedChanges.value) {
    showLeaveDialog.value = true
    pendingNavigation.value = `/app/customers/${customerId.value}`
  } else {
    router.push(`/app/customers/${customerId.value}`)
  }
}

const confirmLeave = () => {
  showLeaveDialog.value = false
  if (pendingNavigation.value) {
    const path = pendingNavigation.value
    pendingNavigation.value = null
    router.push(path)
  }
}

const cancelLeave = () => {
  showLeaveDialog.value = false
  pendingNavigation.value = null
}

// Warn before leaving with unsaved changes
onBeforeRouteLeave((to) => {
  // Skip check if form was successfully submitted
  if (formSubmitted.value) {
    return true
  }
  if (hasUnsavedChanges.value && !pendingNavigation.value) {
    pendingNavigation.value = to.fullPath
    showLeaveDialog.value = true
    return false // Block navigation, show dialog
  }
  return true
})

// Load customer data on mount
onMounted(() => {
  loadCustomerData()
})
</script>
