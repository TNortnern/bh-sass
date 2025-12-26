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

// Flag to prevent circular updates
const isUpdatingFromParent = ref(false)

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
  deliveryTime: '',
  pickupTime: '',
  termsAccepted: false
})

// Initialize from modelValue (only on mount or significant parent changes)
watch(() => props.modelValue, (value) => {
  if (value && !isUpdatingFromParent.value) {
    // Only update if the values are actually different
    const currentJSON = JSON.stringify(formData.value)
    const newJSON = JSON.stringify(value)
    if (currentJSON !== newJSON) {
      isUpdatingFromParent.value = true
      formData.value = JSON.parse(JSON.stringify(value))
      nextTick(() => {
        isUpdatingFromParent.value = false
      })
    }
  }
}, { immediate: true })

// Emit updates when form data changes (but not when parent triggered the change)
watch(formData, (value) => {
  if (!isUpdatingFromParent.value) {
    emit('update:modelValue', JSON.parse(JSON.stringify(value)))
  }
}, { deep: true })

const eventTypeItems = [
  { label: 'Birthday Party', value: 'birthday_party' },
  { label: 'School Event', value: 'school_event' },
  { label: 'Church Event', value: 'church_event' },
  { label: 'Corporate Event', value: 'corporate_event' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Graduation Party', value: 'graduation_party' },
  { label: 'Family Reunion', value: 'family_reunion' },
  { label: 'Community Event', value: 'community_event' },
  { label: 'Other', value: 'other' }
]

const stateItems = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' }
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

// Time slot options for delivery and pickup
const timeSlotItems = [
  { label: '8:00 AM', value: '8:00 AM' },
  { label: '9:00 AM', value: '9:00 AM' },
  { label: '10:00 AM', value: '10:00 AM' },
  { label: '11:00 AM', value: '11:00 AM' },
  { label: '12:00 PM', value: '12:00 PM' },
  { label: '1:00 PM', value: '1:00 PM' },
  { label: '2:00 PM', value: '2:00 PM' },
  { label: '3:00 PM', value: '3:00 PM' },
  { label: '4:00 PM', value: '4:00 PM' },
  { label: '5:00 PM', value: '5:00 PM' },
  { label: '6:00 PM', value: '6:00 PM' },
  { label: '7:00 PM', value: '7:00 PM' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Contact Information -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-lucide-user"
          class="w-5 h-5"
        />
        Contact Information
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <UFormField
          label="Email"
          required
        >
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            size="lg"
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
            class="w-full"
            @input="onPhoneInput"
          />
        </UFormField>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-lucide-map-pin"
          class="w-5 h-5"
        />
        Delivery Address
      </h3>

      <div class="space-y-4">
        <UFormField
          label="Street Address"
          required
        >
          <UInput
            v-model="formData.address.street"
            placeholder="123 Main St"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UFormField
            label="City"
            required
            class="md:col-span-1"
          >
            <UInput
              v-model="formData.address.city"
              placeholder="Austin"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="State"
            required
          >
            <USelect
              v-model="formData.address.state"
              :items="stateItems"
              placeholder="Select state"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="ZIP Code"
            required
          >
            <UInput
              v-model="formData.address.zip"
              placeholder="78701"
              size="lg"
              class="w-full"
              maxlength="5"
            />
          </UFormField>
        </div>
      </div>
    </div>

    <!-- Event Details -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-lucide-party-popper"
          class="w-5 h-5"
        />
        Event Details
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField
            label="Event Type"
            required
          >
            <USelect
              v-model="formData.eventDetails.type"
              :items="eventTypeItems"
              placeholder="Select event type"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Expected Attendees"
            hint="Optional"
          >
            <UInput
              v-model.number="formData.eventDetails.attendees"
              type="number"
              placeholder="50"
              size="lg"
              class="w-full"
              min="1"
            />
          </UFormField>
        </div>

        <UFormField
          label="Special Requests"
          hint="Optional"
        >
          <UTextarea
            v-model="formData.eventDetails.specialRequests"
            placeholder="Any special setup instructions or requests..."
            :rows="4"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <!-- Delivery & Pickup Times -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <UIcon
          name="i-lucide-clock"
          class="w-5 h-5"
        />
        Preferred Delivery & Pickup Times
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField
            label="Preferred Delivery Time"
            hint="Optional"
          >
            <USelect
              v-model="formData.deliveryTime"
              :items="timeSlotItems"
              placeholder="Select time"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Preferred Pickup Time"
            hint="Optional"
          >
            <USelect
              v-model="formData.pickupTime"
              :items="timeSlotItems"
              placeholder="Select time"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
            <UIcon
              name="i-lucide-info"
              class="w-4 h-4 flex-shrink-0 mt-0.5"
            />
            <p>
              We'll do our best to accommodate your preferred times. Exact delivery and pickup times will be confirmed based on our schedule and route availability.
            </p>
          </div>
        </div>
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
              <a
                href="#"
                class="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
              >terms and conditions</a>
              and
              <a
                href="#"
                class="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400"
              >cancellation policy</a>
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
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
            />
            <span>Equipment will be delivered and set up on the selected start date</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
            />
            <span>Pickup will occur on or after the selected end date</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
            />
            <span>A 50% deposit is required to confirm your reservation</span>
          </li>
          <li class="flex items-start gap-2">
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
            />
            <span>Cancellations made 7+ days before event receive full refund</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
