<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const { resetPassword } = useAuth()

const token = computed(() => route.query.token as string)

const form = ref({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const isLoading = ref(false)

// Validate token on mount
const tokenValid = ref<boolean | null>(null)

onMounted(async () => {
  if (!token.value) {
    tokenValid.value = false
    error.value = 'Invalid reset link. Please request a new password reset.'
    return
  }

  // Validate token with backend
  try {
    await $fetch(`/v1/users/verify-reset-token`, {
      method: 'POST',
      body: { token: token.value }
    })
    tokenValid.value = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    tokenValid.value = false
    error.value = err?.data?.errors?.[0]?.message || 'Invalid or expired reset link.'
  }
})

const handleResetPassword = async () => {
  error.value = null
  isLoading.value = true

  try {
    // Validate passwords match
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    // Validate password strength
    if (form.value.password.length < 8) {
      error.value = 'Password must be at least 8 characters'
      return
    }

    const result = await resetPassword({
      token: token.value,
      password: form.value.password
    })

    if (result.success) {
      success.value = true
      setTimeout(() => {
        navigateTo('/auth/login')
      }, 2000)
    } else {
      error.value = result.error || 'Failed to reset password'
    }
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Reset Password - BouncePro'
})
</script>

<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-white mb-2">
            Reset your password
          </h1>
          <p class="text-gray-400 text-sm">
            Enter your new password below
          </p>
        </div>
      </template>

      <!-- Success State -->
      <div
        v-if="success"
        class="py-8"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-check-circle"
              class="w-8 h-8 text-green-400"
            />
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-1">
              Password reset successful!
            </h3>
            <p class="text-sm text-gray-400">
              Redirecting you to login...
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-else-if="tokenValid === null"
        class="py-8"
      >
        <div class="flex flex-col items-center gap-4">
          <UIcon
            name="i-lucide-loader-circle"
            class="w-8 h-8 text-gray-400 animate-spin"
          />
          <p class="text-sm text-gray-400">
            Validating reset link...
          </p>
        </div>
      </div>

      <!-- Invalid Token -->
      <div
        v-else-if="tokenValid === false"
        class="py-8"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-x-circle"
              class="w-8 h-8 text-red-400"
            />
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-1">
              Invalid reset link
            </h3>
            <p class="text-sm text-gray-400 mb-6">
              {{ error }}
            </p>
            <UButton
              to="/auth/forgot-password"
              color="primary"
              class="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              Request new reset link
            </UButton>
          </div>
        </div>
      </div>

      <!-- Reset Form -->
      <form
        v-else
        class="space-y-4"
        @submit.prevent="handleResetPassword"
      >
        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter new password"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="new-password"
          >
            <template #leading>
              <UIcon
                name="i-lucide-lock"
                class="w-5 h-5 text-gray-400"
              />
            </template>
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
          <p class="mt-1 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
          <UInput
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm new password"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="new-password"
          >
            <template #leading>
              <UIcon
                name="i-lucide-lock"
                class="w-5 h-5 text-gray-400"
              />
            </template>
            <template #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </div>

        <!-- Error Message -->
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="error"
          icon="i-lucide-alert-circle"
        />

        <!-- Submit Button -->
        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          :loading="isLoading"
        >
          <template #leading>
            <UIcon
              name="i-lucide-key"
              class="w-5 h-5"
            />
          </template>
          Reset Password
        </UButton>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm text-gray-400">
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign in
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
