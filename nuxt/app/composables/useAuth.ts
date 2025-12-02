export interface User {
  id: string
  email: string
  role?: 'tenant_admin' | 'staff' | 'customer'
  tenantId?: string | { id: string; name: string; slug: string }
  profile?: {
    businessName?: string
    name?: string
    phone?: string
    avatar?: any
  }
  createdAt: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  businessName: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
}

export interface ForgotPasswordData {
  email: string
}

export const useAuth = () => {
  const currentUser = useState<User | null>('auth:user', () => null)
  const isLoading = useState<boolean>('auth:loading', () => true)
  const error = useState<string | null>('auth:error', () => null)
  const toast = useToast()

  const isAuthenticated = computed(() => !!currentUser.value)

  /**
   * Fetch current user from Payload
   */
  const fetchUser = async () => {
    isLoading.value = true
    try {
      // Get cookies from the request headers during SSR
      const headers: Record<string, string> = {}
      if (import.meta.server) {
        const requestHeaders = useRequestHeaders(['cookie'])
        if (requestHeaders.cookie) {
          headers.cookie = requestHeaders.cookie
        }
      }

      const response = await $fetch<{ user: User | null }>('/v1/users/me', {
        credentials: 'include',
        headers
      })
      currentUser.value = response.user
      return { success: true, user: response.user }
    } catch (err) {
      currentUser.value = null
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Login user with email and password
   */
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User; token: string }>('/v1/users/login', {
        method: 'POST',
        body: { email: credentials.email, password: credentials.password },
        credentials: 'include'
      })

      currentUser.value = response.user

      toast.add({
        title: 'Welcome back!',
        description: `Signed in as ${response.user.email}`,
        color: 'green'
      })

      // Redirect to dashboard
      await navigateTo('/app')

      return { success: true }
    } catch (err: any) {
      const message = err?.data?.errors?.[0]?.message || 'Invalid email or password'
      error.value = message
      toast.add({
        title: 'Login failed',
        description: message,
        color: 'red'
      })
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register new user
   */
  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Validate terms acceptance
      if (!data.acceptedTerms) {
        throw new Error('You must accept the terms and conditions')
      }

      // Create user via Payload API
      const response = await $fetch<{ doc: User }>('/v1/users', {
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
          role: 'tenant_admin',
          profile: {
            businessName: data.businessName
          }
        },
        credentials: 'include'
      })

      // Auto-login after registration
      await login({ email: data.email, password: data.password })

      toast.add({
        title: 'Account created!',
        description: 'Welcome to your new bounce house business dashboard',
        color: 'green'
      })

      // Redirect to onboarding for new users
      await navigateTo('/app/onboarding')

      return { success: true, user: response.doc }
    } catch (err: any) {
      const message = err?.data?.errors?.[0]?.message || err.message || 'Registration failed. Please try again.'
      error.value = message
      toast.add({
        title: 'Registration failed',
        description: message,
        color: 'red'
      })
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Request password reset
   */
  const forgotPassword = async (data: ForgotPasswordData) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/v1/users/forgot-password', {
        method: 'POST',
        body: { email: data.email }
      })

      toast.add({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions',
        color: 'green'
      })

      return { success: true }
    } catch (err: any) {
      const message = err?.data?.errors?.[0]?.message || 'Failed to send reset email. Please try again.'
      error.value = message
      toast.add({
        title: 'Reset failed',
        description: message,
        color: 'red'
      })
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/v1/users/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch {
      // Ignore logout errors
    } finally {
      currentUser.value = null
      isLoading.value = false
      navigateTo('/auth/login')
    }
  }

  /**
   * Social login (Google, etc.)
   */
  const loginWithProvider = async (provider: 'google') => {
    // TODO: Implement OAuth flow with Payload
    console.log(`Initiating ${provider} login...`)
    error.value = 'Social login not yet implemented'
    return { success: false, error: error.value }
  }

  // Computed helpers
  const displayName = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.profile?.businessName ||
           currentUser.value.profile?.name ||
           currentUser.value.email.split('@')[0]
  })

  const initials = computed(() => {
    const name = displayName.value
    if (!name) return ''
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })

  return {
    // State
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,

    // Computed
    displayName,
    initials,

    // Actions
    fetchUser,
    login,
    register,
    logout,
    forgotPassword,
    loginWithProvider
  }
}
