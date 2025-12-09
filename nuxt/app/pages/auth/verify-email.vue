<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const toast = useToast()
const { verifyEmail } = useAuth()

const token = computed(() => route.query.token as string)

const status = ref<'loading' | 'success' | 'error'>('loading')
const error = ref<string | null>(null)

// Auto-verify on mount
onMounted(async () => {
  if (!token.value) {
    status.value = 'error'
    error.value = 'Invalid verification link. Please check your email.'
    return
  }

  const result = await verifyEmail({ token: token.value })

  if (result.success) {
    status.value = 'success'
    toast.add({
      title: 'Email verified!',
      description: 'Your email has been successfully verified',
      color: 'success'
    })

    // Redirect based on user state
    setTimeout(() => {
      if (result.user?.profile?.businessName) {
        // Existing user with business - go to dashboard
        navigateTo('/app')
      } else {
        // New user - go to onboarding
        navigateTo('/app/onboarding')
      }
    }, 2000)
  } else {
    status.value = 'error'
    error.value = result.error || 'Failed to verify email'
  }
})

useHead({
  title: 'Verify Email - BouncePro'
})
</script>

<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-white mb-2">
            Email Verification
          </h1>
        </div>
      </template>

      <!-- Loading State -->
      <div
        v-if="status === 'loading'"
        class="py-12"
      >
        <div class="flex flex-col items-center gap-4">
          <UIcon
            name="i-lucide-loader-circle"
            class="w-12 h-12 text-orange-400 animate-spin"
          />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-1">
              Verifying your email...
            </h3>
            <p class="text-sm text-gray-400">
              Please wait while we verify your email address
            </p>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div
        v-else-if="status === 'success'"
        class="py-12"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <div class="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
            <div class="relative w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center ring-4 ring-green-500/20">
              <UIcon
                name="i-lucide-check-circle"
                class="w-8 h-8 text-green-400"
              />
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-2">
              Email verified successfully!
            </h3>
            <p class="text-sm text-gray-400 mb-4">
              Your email has been verified. Redirecting you...
            </p>
            <div class="flex items-center justify-center gap-2 text-xs text-gray-500">
              <UIcon
                name="i-lucide-loader-circle"
                class="w-3 h-3 animate-spin"
              />
              <span>Taking you to your dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else
        class="py-12"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <div class="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
            <div class="relative w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center ring-4 ring-red-500/20">
              <UIcon
                name="i-lucide-x-circle"
                class="w-8 h-8 text-red-400"
              />
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-2">
              Verification failed
            </h3>
            <p class="text-sm text-gray-400 mb-6">
              {{ error }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <UButton
                to="/auth/login"
                color="neutral"
                variant="outline"
              >
                <template #leading>
                  <UIcon
                    name="i-lucide-log-in"
                    class="w-4 h-4"
                  />
                </template>
                Back to login
              </UButton>
              <UButton
                color="primary"
                class="bg-gradient-to-r from-orange-500 to-orange-600"
                @click="navigateTo('/auth/resend-verification')"
              >
                <template #leading>
                  <UIcon
                    name="i-lucide-mail"
                    class="w-4 h-4"
                  />
                </template>
                Resend verification email
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
