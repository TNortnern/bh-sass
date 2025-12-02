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
            <Icon name="heroicons:user" class="w-5 h-5 text-amber-500" />
            Personal Information
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup
              label="First Name"
              name="firstName"
              required
              :ui="{
                label: { base: 'text-sm font-medium text-slate-300' }
              }"
            >
              <UInput
                v-model="formState.firstName"
                placeholder="Enter first name"
                size="lg"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
              />
            </UFormGroup>

            <UFormGroup
              label="Last Name"
              name="lastName"
              required
              :ui="{
                label: { base: 'text-sm font-medium text-slate-300' }
              }"
            >
              <UInput
                v-model="formState.lastName"
                placeholder="Enter last name"
                size="lg"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Icon name="heroicons:phone" class="w-5 h-5 text-amber-500" />
            Contact Information
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup
              label="Email"
              name="email"
              required
              :ui="{
                label: { base: 'text-sm font-medium text-slate-300' }
              }"
            >
              <UInput
                v-model="formState.email"
                type="email"
                placeholder="email@example.com"
                size="lg"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
              >
                <template #leading>
                  <Icon name="heroicons:envelope" class="w-5 h-5 text-slate-500" />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup
              label="Phone"
              name="phone"
              required
              :ui="{
                label: { base: 'text-sm font-medium text-slate-300' }
              }"
            >
              <UInput
                v-model="formState.phone"
                type="tel"
                placeholder="(555) 123-4567"
                size="lg"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
              >
                <template #leading>
                  <Icon name="heroicons:phone" class="w-5 h-5 text-slate-500" />
                </template>
              </UInput>
            </UFormGroup>
          </div>
        </div>

        <!-- Address Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Icon name="heroicons:map-pin" class="w-5 h-5 text-amber-500" />
            Address
          </h3>

          <div class="space-y-4">
            <UFormGroup
              label="Street Address"
              name="address.street"
              :ui="{
                label: { base: 'text-sm font-medium text-slate-300' }
              }"
            >
              <UInput
                v-model="formState.address.street"
                placeholder="123 Main St"
                size="lg"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
              />
            </UFormGroup>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormGroup
                label="City"
                name="address.city"
                :ui="{
                  label: { base: 'text-sm font-medium text-slate-300' }
                }"
              >
                <UInput
                  v-model="formState.address.city"
                  placeholder="Austin"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                    rounded: 'rounded-xl'
                  }"
                />
              </UFormGroup>

              <UFormGroup
                label="State"
                name="address.state"
                :ui="{
                  label: { base: 'text-sm font-medium text-slate-300' }
                }"
              >
                <UInput
                  v-model="formState.address.state"
                  placeholder="TX"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                    rounded: 'rounded-xl'
                  }"
                />
              </UFormGroup>

              <UFormGroup
                label="ZIP Code"
                name="address.zip"
                :ui="{
                  label: { base: 'text-sm font-medium text-slate-300' }
                }"
              >
                <UInput
                  v-model="formState.address.zip"
                  placeholder="78701"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                    rounded: 'rounded-xl'
                  }"
                />
              </UFormGroup>
            </div>
          </div>
        </div>

        <!-- Tags Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Icon name="heroicons:tag" class="w-5 h-5 text-amber-500" />
            Tags
          </h3>

          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="tag in availableTags"
                :key="tag"
                :color="formState.tags.includes(tag) ? 'amber' : 'gray'"
                :variant="formState.tags.includes(tag) ? 'solid' : 'outline'"
                size="sm"
                :ui="{ rounded: 'rounded-full' }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
                <Icon
                  v-if="formState.tags.includes(tag)"
                  name="heroicons:check"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
            </div>

            <UFormGroup
              label="Add Custom Tag"
              :ui="{
                label: { base: 'text-xs font-medium text-slate-400' }
              }"
            >
              <div class="flex gap-2">
                <UInput
                  v-model="customTag"
                  placeholder="Enter custom tag"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                    rounded: 'rounded-xl'
                  }"
                  @keyup.enter="addCustomTag"
                />
                <UButton
                  color="gray"
                  variant="outline"
                  size="lg"
                  :ui="{ rounded: 'rounded-xl' }"
                  @click="addCustomTag"
                >
                  <Icon name="heroicons:plus" class="w-5 h-5" />
                </UButton>
              </div>
            </UFormGroup>
          </div>
        </div>

        <!-- Notes Section -->
        <div>
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Icon name="heroicons:document-text" class="w-5 h-5 text-amber-500" />
            Notes
          </h3>

          <UFormGroup
            name="notes"
            :ui="{
              label: { base: 'text-sm font-medium text-slate-300' }
            }"
          >
            <UTextarea
              v-model="formState.notes"
              placeholder="Add any notes about this customer..."
              :rows="4"
              size="lg"
              :ui="{
                base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                rounded: 'rounded-xl'
              }"
            />
          </UFormGroup>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <UButton
            type="submit"
            color="amber"
            size="lg"
            block
            :loading="loading"
            :ui="{ rounded: 'rounded-xl' }"
          >
            <Icon name="heroicons:check" class="w-5 h-5 mr-2" />
            {{ submitLabel }}
          </UButton>

          <UButton
            v-if="showCreateAnother"
            color="gray"
            variant="outline"
            size="lg"
            :ui="{ rounded: 'rounded-xl' }"
            @click="handleCreateAnother"
          >
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            Create & Add Another
          </UButton>

          <UButton
            v-if="showCancel"
            color="gray"
            variant="ghost"
            size="lg"
            :ui="{ rounded: 'rounded-xl' }"
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
import type { FormSubmitEvent } from '#ui/types'
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

async function handleSubmit(event: FormSubmitEvent<CustomerInput>) {
  emit('submit', event.data)
}

async function handleCreateAnother() {
  emit('createAnother', formState)
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.customer-form :deep(.u-form-group) {
  margin-bottom: 0;
}
</style>
