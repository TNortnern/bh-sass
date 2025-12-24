<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const { login, loginWithProvider, isLoading, error } = useAuth()

// Get tenant from query param (e.g., ?tenant=sugar-rush-party-co)
const tenantSlug = computed(() => {
  const tenant = route.query.tenant
  return typeof tenant === 'string' ? tenant : undefined
})

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const loginMethod = ref<'email' | 'google' | null>(null)

// Demo accounts for testing
const demoAccounts = [
  { label: 'Demo Admin', email: 'admin@bouncepro.demo', password: 'demo123!', color: 'from-orange-500 to-orange-600', icon: 'i-lucide-shield' },
  { label: 'Demo Staff', email: 'staff@bouncepro.demo', password: 'demo123!', color: 'from-blue-500 to-blue-600', icon: 'i-lucide-user' },
  { label: 'Demo Owner', email: 'owner@bouncepro.demo', password: 'demo123!', color: 'from-green-500 to-green-600', icon: 'i-lucide-building-2' }
]

function useDemoAccount(account: typeof demoAccounts[0]) {
  form.value.email = account.email
  form.value.password = account.password
}

const handleLogin = async () => {
  loginMethod.value = 'email'
  await login({
    email: form.value.email,
    password: form.value.password,
    rememberMe: form.value.rememberMe,
    tenant: tenantSlug.value // Pass tenant from query param if present
  })
  loginMethod.value = null
}

const handleSocialLogin = async (provider: 'google') => {
  loginMethod.value = provider
  await loginWithProvider(provider)
  loginMethod.value = null
}

// Set page title
useHead({
  title: 'Sign In - BouncePro'
})
</script>

<template>
  <div>
    <UCard class="bg-gray-900 border border-gray-800">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-white mb-2">
            Welcome back
          </h1>
          <p class="text-gray-400 text-sm">
            Sign in to your BouncePro account
          </p>
          <!-- Show tenant context when logging in via direct link -->
          <div
            v-if="tenantSlug"
            class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs"
          >
            <UIcon
              name="i-lucide-building-2"
              class="w-3.5 h-3.5"
            />
            <span>Logging in to: <strong>{{ tenantSlug }}</strong></span>
          </div>
        </div>
      </template>

      <!-- Social Login -->
      <div class="space-y-3 mb-6">
        <UButton
          block
          color="neutral"
          variant="outline"
          size="lg"
          class="w-full"
          :loading="isLoading && loginMethod === 'google'"
          @click="handleSocialLogin('google')"
        >
          <template #leading>
            <UIcon
              name="i-simple-icons-google"
              class="w-5 h-5"
            />
          </template>
          Continue with Google
        </UButton>
      </div>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-800" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-gray-900 text-gray-400">Or continue with email</span>
        </div>
      </div>

      <!-- Login Form -->
      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
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
              <UIcon
                name="i-lucide-mail"
                class="w-5 h-5 text-gray-400"
              />
            </template>
          </UInput>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            size="lg"
            class="w-full"
            :disabled="isLoading"
            required
            autocomplete="current-password"
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
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="form.rememberMe"
            label="Remember me"
            :disabled="isLoading"
          />
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Forgot password?
          </NuxtLink>
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
          :loading="isLoading && loginMethod === 'email'"
        >
          <template #leading>
            <UIcon
              name="i-lucide-log-in"
              class="w-5 h-5"
            />
          </template>
          Sign in
        </UButton>
      </form>

      <!-- Demo Accounts Section -->
      <div class="mt-6 pt-6 border-t border-gray-800">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-3">
          Quick login for testing:
        </p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="account in demoAccounts"
            :key="account.email"
            type="button"
            class="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-orange-500 hover:bg-gray-800 transition-all cursor-pointer"
            :class="{ 'border-orange-500 bg-orange-500/10': form.email === account.email }"
            @click="useDemoAccount(account)"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              :class="`bg-gradient-to-br ${account.color}`"
            >
              <UIcon
                :name="account.icon"
                class="w-4 h-4"
              />
            </div>
            <span class="text-xs font-medium text-gray-300">{{ account.label }}</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign up
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
