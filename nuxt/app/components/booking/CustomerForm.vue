<script setup lang="ts">
import type { CustomerInfo } from '~/composables/useBookingFlow'

interface Props {
  modelValue?: CustomerInfo | null
}

interface Emits {
  (e: 'update:modelValue', value: CustomerInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<CustomerInfo>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  },
  eventDetails: {
    type: '',
    attendees: undefined,
    specialRequests: ''
  },
  termsAccepted: false
})

// Initialize from modelValue
watch(() => props.modelValue, (value) => {
  if (value) {
    formData.value = { ...value }
  }
}, { immediate: true })

// Emit updates
watch(formData, (value) => {
  emit('update:modelValue', value)
}, { deep: true })

const eventTypes = [
  'Birthday Party',
  'School Event',
  'Church Event',
  'Corporate Event',
  'Wedding',
  'Graduation Party',
  'Family Reunion',
  'Community Event',
  'Other'
]

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const formatPhone = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Format as (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

const onPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.phone = formatPhone(input.value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Contact Information -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="lucide:user" class="w-5 h-5" />
        Contact Information
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="First Name" required>
          <UInput
            v-model="formData.firstName"
            placeholder="John"
            size="lg"
          />
        </UFormField>

        <UFormField label="Last Name" required>
          <UInput
            v-model="formData.lastName"
            placeholder="Doe"
            size="lg"
          />
        </UFormField>

        <UFormField label="Email" required>
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            size="lg"
          />
        </UFormField>

        <UFormField label="Phone" required>
          <UInput
            v-model="formData.phone"
            type="tel"
            placeholder="(555) 123-4567"
            size="lg"
            @input="onPhoneInput"
          />
        </UFormField>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="lucide:map-pin" class="w-5 h-5" />
        Delivery Address
      </h3>

      <div class="space-y-4">
        <UFormField label="Street Address" required>
          <UInput
            v-model="formData.address.street"
            placeholder="123 Main St"
            size="lg"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField label="City" required class="md:col-span-1">
            <UInput
              v-model="formData.address.city"
              placeholder="Austin"
              size="lg"
            />
          </UFormField>

          <UFormField label="State" required>
            <USelect
              v-model="formData.address.state"
              :options="states"
              placeholder="Select state"
              size="lg"
            />
          </UFormField>

          <UFormField label="ZIP Code" required>
            <UInput
              v-model="formData.address.zip"
              placeholder="78701"
              size="lg"
              maxlength="5"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <!-- Event Details -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon name="lucide:party-popper" class="w-5 h-5" />
        Event Details
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Event Type" required>
            <USelect
              v-model="formData.eventDetails.type"
              :options="eventTypes"
              placeholder="Select event type"
              size="lg"
            />
          </UFormField>

          <UFormField label="Expected Attendees" hint="Optional">
            <UInput
              v-model.number="formData.eventDetails.attendees"
              type="number"
              placeholder="50"
              size="lg"
              min="1"
            />
          </UFormField>
        </div>

        <UFormField label="Special Requests" hint="Optional">
          <UTextarea
            v-model="formData.eventDetails.specialRequests"
            placeholder="Any special setup instructions or requests..."
            :rows="4"
            size="lg"
          />
        </UFormField>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <UFormField>
        <UCheckbox
          v-model="formData.termsAccepted"
          label="I agree to the terms and conditions"
          required
        >
          <template #label>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              I agree to the
              <a href="#" class="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400">terms and conditions</a>
              and
              <a href="#" class="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400">cancellation policy</a>
            </span>
          </template>
        </UCheckbox>
      </UFormField>

      <div class="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Important Information:
        </h4>
        <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Equipment will be delivered and set up on the selected start date</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Pickup will occur on or after the selected end date</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>A 50% deposit is required to confirm your reservation</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Cancellations made 7+ days before event receive full refund</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
