<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const toast = useToast()
const { acceptInvite, isLoading } = useAuth()

const token = computed(() => route.params.token as string)

const status = ref<'loading' | 'form' | 'success' | 'error'>('loading')
const inviteDetails = ref<{
  email: string
  tenantName: string
  invitedBy: string
  role: string
  existingUser: boolean
} | null>(null)

const form = ref({
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref<string | null>(null)

// Fetch invite details on mount
onMounted(async () => {
  if (!token.value) {
    status.value = 'error'
    error.value = 'Invalid invite link'
    return
  }

  try {
    const response = await $fetch<{
      email: string
      tenantName: string
      invitedBy: string
      role: string
      existingUser: boolean
    }>(`/v1/users/invites/${token.value}`)

    inviteDetails.value = response
    status.value = 'form'
  } catch (err: any) {
    status.value = 'error'
    error.value = err?.data?.errors?.[0]?.message || 'Invalid or expired invite link'
  }
})

const handleAcceptInvite = async () => {
  error.value = null

  // If new user, validate password
  if (!inviteDetails.value?.existingUser) {
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    if (form.value.password.length < 8) {
      error.value = 'Password must be at least 8 characters'
      return
    }
  }

  const result = await acceptInvite({
    token: token.value,
    password: inviteDetails.value?.existingUser ? undefined : form.value.password
  })

  if (result.success) {
    status.value = 'success'
    toast.add({
      title: 'Invite accepted!',
      description: `Welcome to ${inviteDetails.value?.tenantName}`,
      color: 'success'
    })

    setTimeout(() => {
      navigateTo('/app')
    }, 2000)
  } else {
    error.value = result.error || 'Failed to accept invite'
  }
}

useHead({
  title: 'Team Invite - BouncePro'
})
</script>

<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-white mb-2">Join Team</h1>
          <p class="text-gray-400 text-sm">Accept your invitation to collaborate</p>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="status === 'loading'" class="py-12">
        <div class="flex flex-col items-center gap-4">
          <UIcon name="i-lucide-loader-circle" class="w-8 h-8 text-gray-400 animate-spin" />
          <p class="text-sm text-gray-400">Loading invite details...</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-green-400" />
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-1">Welcome to the team!</h3>
            <p class="text-sm text-gray-400">Redirecting you to the dashboard...</p>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-x-circle" class="w-8 h-8 text-red-400" />
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-white mb-1">Invalid invite</h3>
            <p class="text-sm text-gray-400 mb-6">{{ error }}</p>
            <UButton
              to="/auth/login"
              color="primary"
              class="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              Go to login
            </UButton>
          </div>
        </div>
      </div>

      <!-- Invite Form -->
      <div v-else class="space-y-6">
        <!-- Invite Details Card -->
        <div class="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-building-2" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-white mb-1">{{ inviteDetails?.tenantName }}</h3>
              <p class="text-sm text-gray-400 mb-2">
                {{ inviteDetails?.invitedBy }} invited you to join as
                <span class="text-orange-400 font-medium">{{ inviteDetails?.role }}</span>
              </p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <UIcon name="i-lucide-mail" class="w-3 h-3" />
                <span>{{ inviteDetails?.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- New User: Password Setup -->
        <form v-if="!inviteDetails?.existingUser" @submit.prevent="handleAcceptInvite" class="space-y-4">
          <div class="text-sm text-gray-400 mb-4">
            Create a password to complete your account setup
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <UInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
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
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
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
            >
              <template #leading>
                <UIcon name="i-lucide-lock" class="w-5 h-5 text-gray-400" />
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
              <UIcon name="i-lucide-user-plus" class="w-5 h-5" />
            </template>
            Create Account & Join Team
          </UButton>
        </form>

        <!-- Existing User: Just Accept -->
        <div v-else class="space-y-4">
          <div class="text-sm text-gray-400 mb-4">
            You already have an account. Click below to join this team.
          </div>

          <!-- Error Message -->
          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :title="error"
            icon="i-lucide-alert-circle"
          />

          <!-- Accept Button -->
          <UButton
            block
            size="lg"
            color="primary"
            class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            :loading="isLoading"
            @click="handleAcceptInvite"
          >
            <template #leading>
              <UIcon name="i-lucide-user-check" class="w-5 h-5" />
            </template>
            Accept Invitation
          </UButton>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm text-gray-400">
          Need help?
          <a href="mailto:support@bouncepro.com" class="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Contact support
          </a>
        </div>
      </template>
    </UCard>
  </div>
</template>
