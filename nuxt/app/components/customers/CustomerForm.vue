<template>
  <div class="customer-form">
    <UForm
      :state="formState"
      :schema="schema"
      @submit="handleSubmit"
    >
      <div class="space-y-6">
        <!-- Personal Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-user"
              class="w-5 h-5 text-amber-500"
            />
            Personal Information
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField
              label="First Name"
              name="firstName"
              required
            >
              <UInput
                v-model="formState.firstName"
                placeholder="Enter first name"
                size="lg"
                class="rounded-xl"
              />
            </UFormField>

            <UFormField
              label="Last Name"
              name="lastName"
              required
            >
              <UInput
                v-model="formState.lastName"
                placeholder="Enter last name"
                size="lg"
                class="rounded-xl"
              />
            </UFormField>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-phone"
              class="w-5 h-5 text-amber-500"
            />
            Contact Information
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField
              label="Email"
              name="email"
              required
            >
              <UInput
                v-model="formState.email"
                type="email"
                placeholder="email@example.com"
                size="lg"
                class="rounded-xl"
              >
                <template #leading>
                  <UIcon
                    name="i-lucide-mail"
                    class="w-5 h-5 text-slate-500"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Phone"
              name="phone"
              required
            >
              <UInput
                v-model="formState.phone"
                type="tel"
                placeholder="(555) 123-4567"
                size="lg"
                class="rounded-xl"
              >
                <template #leading>
                  <UIcon
                    name="i-lucide-phone"
                    class="w-5 h-5 text-slate-500"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>

        <!-- Address Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-map-pin"
              class="w-5 h-5 text-amber-500"
            />
            Address
          </h3>

          <div class="space-y-4">
            <UFormField
              label="Street Address"
              name="address.street"
            >
              <UInput
                v-model="formState.address!.street"
                placeholder="123 Main St"
                size="lg"
                class="rounded-xl"
              />
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField
                label="City"
                name="address.city"
              >
                <UInput
                  v-model="formState.address!.city"
                  placeholder="Austin"
                  size="lg"
                  class="rounded-xl"
                />
              </UFormField>

              <UFormField
                label="State"
                name="address.state"
              >
                <UInput
                  v-model="formState.address!.state"
                  placeholder="TX"
                  size="lg"
                  class="rounded-xl"
                />
              </UFormField>

              <UFormField
                label="ZIP Code"
                name="address.zip"
              >
                <UInput
                  v-model="formState.address!.zip"
                  placeholder="78701"
                  size="lg"
                  class="rounded-xl"
                />
              </UFormField>
            </div>
          </div>
        </div>

        <!-- Tags Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-tag"
              class="w-5 h-5 text-amber-500"
            />
            Tags
          </h3>

          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="tag in availableTags"
                :key="tag"
                :color="formState.tags!.includes(tag) ? 'primary' : 'neutral'"
                :variant="formState.tags!.includes(tag) ? 'solid' : 'outline'"
                size="sm"
                class="rounded-full"
                @click="toggleTag(tag)"
              >
                {{ tag }}
                <UIcon
                  v-if="formState.tags!.includes(tag)"
                  name="i-lucide-check"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
            </div>

            <UFormField
              label="Add Custom Tag"
            >
              <div class="flex gap-2">
                <UInput
                  v-model="customTag"
                  placeholder="Enter custom tag"
                  size="lg"
                  class="rounded-xl"
                  @keyup.enter="addCustomTag"
                />
                <UButton
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="rounded-xl"
                  @click="addCustomTag"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="w-5 h-5"
                  />
                </UButton>
              </div>
            </UFormField>
          </div>
        </div>

        <!-- Notes Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-file-text"
              class="w-5 h-5 text-amber-500"
            />
            Notes
          </h3>

          <UFormField
            name="notes"
          >
            <UTextarea
              v-model="formState.notes"
              placeholder="Add any notes about this customer..."
              :rows="4"
              size="lg"
              class="rounded-xl"
            />
          </UFormField>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
            class="rounded-xl"
          >
            <UIcon
              name="i-lucide-check"
              class="w-5 h-5 mr-2"
            />
            {{ submitLabel }}
          </UButton>

          <UButton
            v-if="showCreateAnother"
            color="neutral"
            variant="outline"
            size="lg"
            class="rounded-xl"
            @click="handleCreateAnother"
          >
            <UIcon
              name="i-lucide-plus"
              class="w-5 h-5 mr-2"
            />
            Create & Add Another
          </UButton>

          <UButton
            v-if="showCancel"
            color="neutral"
            variant="ghost"
            size="lg"
            class="rounded-xl"
            @click="handleCancel"
          >
            Cancel
          </UButton>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { CustomerInput } from '~/composables/useCustomers'

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<CustomerInput>
    loading?: boolean
    submitLabel?: string
    showCreateAnother?: boolean
    showCancel?: boolean
  }>(),
  {
    modelValue: () => ({}),
    loading: false,
    submitLabel: 'Save Customer',
    showCreateAnother: false,
    showCancel: true
  }
)

const emit = defineEmits<{
  submit: [data: CustomerInput]
  createAnother: [data: CustomerInput]
  cancel: []
}>()

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional()
  }).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional()
})

const availableTags = [
  'VIP',
  'Birthday Party',
  'Corporate',
  'Repeat Customer',
  'New',
  'High Value',
  'Referral',
  'Email List',
  'SMS List'
]

const customTag = ref('')

const formState = reactive<CustomerInput>({
  firstName: props.modelValue.firstName || '',
  lastName: props.modelValue.lastName || '',
  email: props.modelValue.email || '',
  phone: props.modelValue.phone || '',
  address: {
    street: props.modelValue.address?.street || '',
    city: props.modelValue.address?.city || '',
    state: props.modelValue.address?.state || 'TX',
    zip: props.modelValue.address?.zip || ''
  },
  tags: props.modelValue.tags || [],
  notes: props.modelValue.notes || ''
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      formState.firstName = newValue.firstName || ''
      formState.lastName = newValue.lastName || ''
      formState.email = newValue.email || ''
      formState.phone = newValue.phone || ''
      formState.address = {
        street: newValue.address?.street || '',
        city: newValue.address?.city || '',
        state: newValue.address?.state || 'TX',
        zip: newValue.address?.zip || ''
      }
      formState.tags = newValue.tags || []
      formState.notes = newValue.notes || ''
    }
  },
  { deep: true }
)

function toggleTag(tag: string) {
  const index = formState.tags!.indexOf(tag)
  if (index === -1) {
    formState.tags!.push(tag)
  } else {
    formState.tags!.splice(index, 1)
  }
}

function addCustomTag() {
  if (customTag.value && !formState.tags!.includes(customTag.value)) {
    formState.tags!.push(customTag.value)
    customTag.value = ''
  }
}

async function handleSubmit(): Promise<void> {
  emit('submit', formState)
}

async function handleCreateAnother(): Promise<void> {
  emit('createAnother', formState)
}

function handleCancel(): void {
  emit('cancel')
}
</script>

<style scoped>
.customer-form :deep(.u-form-field) {
  margin-bottom: 0;
}
</style>
