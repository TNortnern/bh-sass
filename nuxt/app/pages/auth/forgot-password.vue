<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <div v-if="!emailSent">
            <h1 class="text-2xl font-bold text-white mb-2">Forgot password?</h1>
            <p class="text-gray-400 text-sm">No worries, we'll send you reset instructions</p>
          </div>
          <div v-else>
            <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lucide:mail-check" class="w-8 h-8 text-green-400" />
            </div>
            <h1 class="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p class="text-gray-400 text-sm">We sent a password reset link to</p>
            <p class="text-purple-400 text-sm font-medium mt-1">{{ form.email }}</p>
          </div>
        </div>
      </template>

      <!-- Form (shown when email not sent) -->
      <form v-if="!emailSent" @submit.prevent="handleForgotPassword" class="space-y-4">
        <!-- Email -->
        <UFormGroup label="Email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@company.com"
            size="lg"
            :disabled="isLoading"
            required
            autocomplete="email"
            icon="lucide:mail"
          />
        </UFormGroup>

        <!-- Error Message -->
        <UAlert
          v-if="error"
          color="red"
          variant="subtle"
          :title="error"
          :close-button="{ icon: 'lucide:x', color: 'red', variant: 'link' }"
          @close="error = null"
        />

        <!-- Submit Button -->
        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          :loading="isLoading"
          class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <template #leading>
            <Icon name="lucide:send" class="w-5 h-5" />
          </template>
          Send reset link
        </UButton>

        <!-- Back to Login -->
        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-gray-400 hover:text-gray-300 inline-flex items-center gap-2 transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Back to login
          </NuxtLink>
        </div>
      </form>

      <!-- Success State -->
      <div v-else class="space-y-4">
        <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p class="text-sm text-gray-300 mb-3">Didn't receive the email? Check your spam folder or:</p>
          <UButton
            block
            color="gray"
            variant="outline"
            @click="handleResend"
            :loading="isLoading"
          >
            <template #leading>
              <Icon name="lucide:refresh-cw" class="w-4 h-4" />
            </template>
            Resend email
          </UButton>
        </div>

        <!-- Back to Login -->
        <div class="text-center pt-2">
          <NuxtLink
            to="/auth/login"
            class="text-sm text-gray-400 hover:text-gray-300 inline-flex items-center gap-2 transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-4 h-4" />
            Back to login
          </NuxtLink>
        </div>
      </div>

      <!-- Footer (shown on success) -->
      <template #footer v-if="emailSent">
        <div class="text-center">
          <p class="text-xs text-gray-500">
            If you don't see the email in your inbox within a few minutes, please check your spam folder.
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { forgotPassword, isLoading, error } = useAuth()

const form = ref({
  email: ''
})

const emailSent = ref(false)

const handleForgotPassword = async () => {
  const result = await forgotPassword({
    email: form.value.email
  })

  if (result.success) {
    emailSent.value = true
  }
}

const handleResend = async () => {
  await forgotPassword({
    email: form.value.email
  })

  // Show toast notification
  const toast = useToast()
  toast.add({
    title: 'Email sent',
    description: 'We sent another reset link to your email',
    icon: 'lucide:mail-check',
    color: 'green'
  })
}

// Set page title
useHead({
  title: 'Forgot Password - BouncePro'
})
</script>
