<template>
  <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06] max-md:flex-col max-md:items-start max-md:gap-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-1.5 text-gray-900 dark:text-white">Profile Settings</h2>
        <p class="m-0 text-base text-gray-600 dark:text-[#888]">Manage your business information and service area</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        :loading="saving"
        :disabled="!hasUnsavedChanges"
        @click="saveSettings"
        class="bg-gradient-to-br from-amber-400 to-amber-500 border-none text-black font-semibold tracking-tight transition-all duration-200 shadow-none disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:-translate-y-px hover:enabled:shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)]"
      >
        Save Changes
      </UButton>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]">
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin"></div>
      <p>Loading settings...</p>
    </div>

    <div v-else-if="business" class="flex flex-col gap-6">
      <!-- Business Information -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-building-storefront" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Business Information</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Your business name and description</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="Business Name" required class="flex flex-col gap-2">
            <UInput
              v-model="business.name"
              size="lg"
              placeholder="Enter business name"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="Business Logo" class="flex flex-col gap-2">
            <div class="mt-2">
              <!-- Hidden file input -->
              <input
                ref="logoFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoChange"
              />

              <div v-if="business.logo" class="relative w-[120px] h-[120px] rounded-xl overflow-hidden border-2 border-amber-300 dark:border-amber-500/30">
                <img :src="business.logo" alt="Business logo" class="w-full h-full object-cover" />
                <button class="absolute top-2 right-2 w-7 h-7 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:bg-red-500 hover:border-red-500" @click="handleRemoveLogo">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>
              <div v-else class="w-[200px] p-8 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center gap-3 text-center transition-all duration-200 cursor-pointer hover:border-amber-300 hover:dark:border-amber-500/30 hover:bg-amber-50 hover:dark:bg-amber-500/[0.03]" @click="triggerLogoUpload">
                <UIcon v-if="uploadingLogo" name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 dark:text-[#666] animate-spin" />
                <UIcon v-else name="i-heroicons-photo" class="w-8 h-8 text-gray-500 dark:text-[#666]" />
                <p class="m-0 text-sm text-gray-600 dark:text-[#888]">{{ uploadingLogo ? 'Uploading...' : 'Upload logo' }}</p>
                <UButton size="sm" variant="outline" :loading="uploadingLogo" @click.stop="triggerLogoUpload">
                  Choose File
                </UButton>
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="Description" class="flex flex-col gap-2">
            <UTextarea
              v-model="business.description"
              :rows="4"
              size="lg"
              placeholder="Tell customers about your business"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Contact Information -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-phone" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Contact Information</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">How customers can reach you</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-md:grid-cols-1">
            <UFormGroup label="Phone Number" required class="flex flex-col gap-2">
              <UInput
                v-model="business.phone"
                size="lg"
                type="tel"
                placeholder="(555) 123-4567"
                class="w-full"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="Email Address" required class="flex flex-col gap-2">
              <UInput
                v-model="business.email"
                size="lg"
                type="email"
                placeholder="hello@yourbusiness.com"
                class="w-full"
                @input="markHasChanges"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Street Address" required class="flex flex-col gap-2">
            <UInput
              v-model="business.address.street"
              size="lg"
              placeholder="123 Main Street"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-md:grid-cols-1">
            <UFormGroup label="City" required class="flex flex-col gap-2">
              <UInput
                v-model="business.address.city"
                size="lg"
                placeholder="Austin"
                class="w-full"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="State" required class="flex flex-col gap-2">
              <USelect
                v-model="business.address.state"
                :items="states"
                size="lg"
                class="w-full"
                @change="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="ZIP Code" required class="flex flex-col gap-2">
              <UInput
                v-model="business.address.zip"
                size="lg"
                placeholder="78701"
                class="w-full"
                @input="markHasChanges"
              />
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <!-- Timezone & Hours -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-clock" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Timezone & Business Hours</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">When you're available for rentals</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="Timezone" required class="flex flex-col gap-2">
            <USelect
              v-model="business.timezone"
              :items="timezones"
              size="lg"
              class="w-full"
              @change="markHasChanges"
            />
          </UFormGroup>

          <div class="mt-2 flex flex-col gap-3">
            <div class="text-sm font-semibold text-gray-800 dark:text-[#e5e5e5] uppercase tracking-widest mb-2">
              <span>Business Hours</span>
            </div>
            <div
              v-for="(day, key) in business.businessHours"
              :key="key"
              class="flex items-center gap-4 p-3 px-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] rounded-lg tabular-nums max-md:flex-wrap"
            >
              <UToggle
                v-model="day.enabled"
                size="md"
                @change="markHasChanges"
              />
              <span class="w-[100px] text-[15px] font-medium text-gray-800 dark:text-[#e5e5e5]">{{ formatDayName(key) }}</span>
              <div v-if="day.enabled" class="flex items-center gap-3 flex-1 max-md:w-full">
                <UInput
                  v-model="day.open"
                  type="time"
                  size="md"
                  @input="markHasChanges"
                />
                <span class="text-gray-500 dark:text-[#666] text-sm">to</span>
                <UInput
                  v-model="day.close"
                  type="time"
                  size="md"
                  @input="markHasChanges"
                />
              </div>
              <span v-else class="text-gray-500 dark:text-[#666] text-sm italic">Closed</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Service Area -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Service Area</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Define where you deliver rentals</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-md:grid-cols-1">
            <UFormGroup label="Service Radius" required class="flex flex-col gap-2">
              <UInput
                v-model.number="business.serviceArea.radius"
                type="number"
                size="lg"
                placeholder="25"
                class="w-full"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="Unit" required class="flex flex-col gap-2">
              <USelect
                v-model="business.serviceArea.unit"
                :items="['miles', 'km']"
                size="lg"
                class="w-full"
                @change="markHasChanges"
              />
            </UFormGroup>
          </div>

          <UFormGroup
            label="Service ZIP Codes (optional)"
            help="Add specific ZIP codes you serve"
            class="flex flex-col gap-2"
          >
            <div class="flex flex-wrap gap-2 mt-2">
              <div v-for="(zip, index) in business.serviceArea.zipCodes" :key="index" class="flex items-center gap-2 py-2 px-3 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-700 dark:text-amber-400 text-sm font-medium tabular-nums">
                <span>{{ zip }}</span>
                <button class="flex items-center justify-center w-[18px] h-[18px] bg-black/30 border-none rounded-full text-amber-700 dark:text-amber-400 cursor-pointer transition-all duration-200 hover:bg-black/50" @click="removeZipCode(index)">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>
              <button class="flex items-center gap-1.5 py-2 px-3 bg-transparent border border-dashed border-gray-300 dark:border-white/20 rounded-lg text-gray-600 dark:text-[#888] text-sm font-medium cursor-pointer transition-all duration-200 hover:border-amber-300 hover:dark:border-amber-500/40 hover:text-amber-600 hover:dark:text-amber-400 hover:bg-amber-50 hover:dark:bg-amber-500/[0.05]" @click="showAddZipModal = true">
                <UIcon name="i-heroicons-plus" />
                Add ZIP
              </button>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Change Password -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Change Password</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Update your account password</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="Current Password" required :error="passwordErrors.current" class="flex flex-col gap-2">
            <div class="relative">
              <UInput
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                size="lg"
                placeholder="Enter current password"
                class="w-full"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#666] hover:text-gray-700 dark:hover:text-[#888] transition-colors"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <UIcon :name="showCurrentPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </button>
            </div>
          </UFormGroup>

          <UFormGroup label="New Password" required :error="passwordErrors.new" class="flex flex-col gap-2">
            <div class="relative">
              <UInput
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                size="lg"
                placeholder="Enter new password (min. 8 characters)"
                class="w-full"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#666] hover:text-gray-700 dark:hover:text-[#888] transition-colors"
                @click="showNewPassword = !showNewPassword"
              >
                <UIcon :name="showNewPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="passwordForm.newPassword && passwordForm.newPassword.length < 8" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Password must be at least 8 characters long
            </p>
          </UFormGroup>

          <UFormGroup label="Confirm New Password" required :error="passwordErrors.confirm" class="flex flex-col gap-2">
            <div class="relative">
              <UInput
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                size="lg"
                placeholder="Re-enter new password"
                class="w-full"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#666] hover:text-gray-700 dark:hover:text-[#888] transition-colors"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <UIcon :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="w-5 h-5" />
              </button>
            </div>
            <p v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="text-xs text-red-600 dark:text-red-400 mt-1">
              Passwords do not match
            </p>
          </UFormGroup>

          <div class="flex justify-end">
            <UButton
              color="primary"
              size="lg"
              :loading="changingPassword"
              :disabled="!isPasswordFormValid"
              @click="handleChangePassword"
              class="bg-gradient-to-br from-amber-400 to-amber-500 border-none text-black font-semibold tracking-tight transition-all duration-200 shadow-none disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:-translate-y-px hover:enabled:shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)]"
            >
              Update Password
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add ZIP Code Modal -->
    <UModal v-model:open="showAddZipModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Add ZIP Code</h3>
          </template>

          <div class="p-6">
            <UFormGroup label="ZIP Code" required>
              <UInput
                v-model="newZipCode"
                size="lg"
                placeholder="78701"
                maxlength="5"
                class="w-full"
              />
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton variant="ghost" @click="showAddZipModal = false">
                Cancel
              </UButton>
              <UButton color="primary" @click="addZipCode">Add ZIP Code</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const {
  business,
  loading,
  saving,
  hasUnsavedChanges,
  updateSettings,
  uploadLogo,
  removeLogo: removeLogoFromSettings,
  changePassword,
  markHasChanges
} = useSettings()

const showAddZipModal = ref(false)
const newZipCode = ref('')
const logoFileInput = ref<HTMLInputElement | null>(null)
const uploadingLogo = ref(false)

// Password change state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  current: '',
  new: '',
  confirm: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const changingPassword = ref(false)

// Computed property for password form validation
const isPasswordFormValid = computed(() => {
  const { currentPassword, newPassword, confirmPassword } = passwordForm.value
  return (
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword
  )
})

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
]

const formatDayName = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

const triggerLogoUpload = () => {
  logoFileInput.value?.click()
}

const handleLogoChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    return
  }

  uploadingLogo.value = true
  try {
    await uploadLogo(file)
  } finally {
    uploadingLogo.value = false
    // Reset input
    if (logoFileInput.value) {
      logoFileInput.value.value = ''
    }
  }
}

const handleRemoveLogo = async () => {
  await removeLogoFromSettings()
}

const addZipCode = () => {
  if (newZipCode.value && business.value) {
    business.value.serviceArea.zipCodes.push(newZipCode.value)
    newZipCode.value = ''
    showAddZipModal.value = false
    markHasChanges()
  }
}

const removeZipCode = (index: number) => {
  if (business.value) {
    business.value.serviceArea.zipCodes.splice(index, 1)
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (business.value) {
    await updateSettings('business', business.value)
  }
}

const handleChangePassword = async () => {
  // Clear previous errors
  passwordErrors.value = {
    current: '',
    new: '',
    confirm: ''
  }

  // Validate form
  const { currentPassword, newPassword, confirmPassword } = passwordForm.value

  if (!currentPassword) {
    passwordErrors.value.current = 'Current password is required'
    return
  }

  if (newPassword.length < 8) {
    passwordErrors.value.new = 'Password must be at least 8 characters'
    return
  }

  if (newPassword !== confirmPassword) {
    passwordErrors.value.confirm = 'Passwords do not match'
    return
  }

  // Call the changePassword function from composable
  changingPassword.value = true
  try {
    const result = await changePassword(currentPassword, newPassword)

    if (result.success) {
      // Clear the form on success
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      // Hide passwords
      showCurrentPassword.value = false
      showNewPassword.value = false
      showConfirmPassword.value = false
    } else {
      // Handle specific error cases
      if (result.error?.includes('current')) {
        passwordErrors.value.current = result.error
      } else {
        passwordErrors.value.new = result.error || 'Failed to change password'
      }
    }
  } finally {
    changingPassword.value = false
  }
}
</script>
