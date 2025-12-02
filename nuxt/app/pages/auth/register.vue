<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { register, isLoading, error } = useAuth()

const form = ref({
  businessName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => {
  if (!form.value.confirmPassword) return true
  return form.value.password === form.value.confirmPassword
})

const isFormValid = computed(() => {
  return (
    form.value.businessName.trim() !== '' &&
    form.value.email.trim() !== '' &&
    form.value.password.length >= 8 &&
    passwordsMatch.value &&
    form.value.acceptedTerms
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  await register({
    businessName: form.value.businessName,
    email: form.value.email,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    acceptedTerms: form.value.acceptedTerms
  })
}

// Set page title
useHead({
  title: 'Sign Up - BouncePro'
})
</script>

<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p class="text-gray-400 text-sm">Start managing your bounce house business today</p>
        </div>
      </template>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Business Name -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
          <UInput
            v-model="form.businessName"
            type="text"
            placeholder="Your Bounce House Company"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="organization"
          >
            <template #leading>
              <UIcon name="i-lucide-building-2" class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@company.com"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="email"
          >
            <template #leading>
              <UIcon name="i-lucide-mail" class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Create a strong password"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="new-password"
          >
            <template #leading>
              <UIcon name="i-lucide-lock" class="w-5 h-5 text-gray-400" />
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
          <p class="text-xs text-gray-500 mt-1">
            At least 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
          <UInput
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="new-password"
            :color="!passwordsMatch ? 'error' : undefined"
          >
            <template #leading>
              <UIcon name="i-lucide-lock-keyhole" class="w-5 h-5 text-gray-400" />
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
          <p v-if="form.confirmPassword && !passwordsMatch" class="text-xs text-red-400 mt-1">
            Passwords do not match
          </p>
        </div>

        <!-- Terms Acceptance -->
        <div class="pt-2">
          <UCheckbox
            v-model="form.acceptedTerms"
            :disabled="isLoading"
            required
          >
            <template #label>
              <span class="text-sm text-gray-300">
                I agree to the
                <NuxtLink to="/terms" class="text-orange-400 hover:text-orange-300" target="_blank">
                  Terms of Service
                </NuxtLink>
                and
                <NuxtLink to="/privacy" class="text-orange-400 hover:text-orange-300" target="_blank">
                  Privacy Policy
                </NuxtLink>
              </span>
            </template>
          </UCheckbox>
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
          :disabled="!isFormValid"
        >
          <template #leading>
            <UIcon name="i-lucide-user-plus" class="w-5 h-5" />
          </template>
          Create account
        </UButton>
      </form>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm text-gray-400">
          Already have an account?
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
