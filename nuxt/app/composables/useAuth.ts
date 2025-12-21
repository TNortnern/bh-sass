export interface User {
  id: string
  email: string
  role?: 'super_admin' | 'tenant_admin' | 'staff' | 'customer'
  tenantId?: string | { id: string, name: string, slug: string }
  profile?: {
    businessName?: string
    name?: string
    phone?: string
    avatar?: Record<string, unknown>
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

export interface ResetPasswordData {
  token: string
  password: string
}

export interface VerifyEmailData {
  token: string
}

export interface AcceptInviteData {
  token: string
  password?: string
}

export const useAuth = () => {
  const currentUser = useState<User | null>('auth:user', () => null)
  const isLoading = useState<boolean>('auth:loading', () => false)
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
    } catch {
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
      const response = await $fetch<{ user: User, token: string }>('/v1/auth/login', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe
        },
        credentials: 'include'
      })

      currentUser.value = response.user

      toast.add({
        title: 'Welcome back!',
        description: `Signed in as ${response.user.email}`,
        color: 'success'
      })

      // Redirect based on role - super admins go to admin panel, others to app
      const redirectTo = response.user.role === 'super_admin' ? '/app/admin' : '/app'
      await navigateTo(redirectTo)

      return { success: true }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> } }
      const message = errorData?.data?.errors?.[0]?.message || 'Invalid email or password'
      error.value = message
      toast.add({
        title: 'Login failed',
        description: message,
        color: 'error'
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

      // Create user and tenant via custom registration endpoint
      const response = await $fetch<{ user: User, tenant: Record<string, unknown>, token: string }>('/v1/register', {
        method: 'POST',
        body: {
          email: data.email,
          password: data.password,
          businessName: data.businessName
        },
        credentials: 'include'
      })

      // Set the user from registration response (already logged in)
      currentUser.value = response.user

      toast.add({
        title: 'Account created!',
        description: 'Welcome to your new bounce house business dashboard',
        color: 'success'
      })

      // Redirect to onboarding for new users
      await navigateTo('/app/onboarding')

      return { success: true, user: response.user }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> }, message?: string }
      const message = errorData?.data?.errors?.[0]?.message || errorData.message || 'Registration failed. Please try again.'
      error.value = message
      toast.add({
        title: 'Registration failed',
        description: message,
        color: 'error'
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
        color: 'success'
      })

      return { success: true }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> } }
      const message = errorData?.data?.errors?.[0]?.message || 'Failed to send reset email. Please try again.'
      error.value = message
      toast.add({
        title: 'Reset failed',
        description: message,
        color: 'error'
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

      toast.add({
        title: 'Signed out',
        description: 'You have been successfully signed out',
        color: 'success'
      })
    } catch {
      // Ignore logout errors - still clear local state
    } finally {
      currentUser.value = null
      isLoading.value = false

      // Clear localStorage items to prevent stale data for next user
      if (import.meta.client) {
        try {
          localStorage.removeItem('bouncepro_onboarding')
          localStorage.removeItem('bh_cart')
        } catch (e) {
          console.error('Failed to clear localStorage on logout:', e)
        }
      }

      // Clear Nuxt useState for notifications to prevent stale data
      clearNuxtState('notifications')

      await navigateTo('/auth/login')
    }
  }

  /**
   * Reset password with token
   */
  const resetPassword = async (data: ResetPasswordData) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/v1/users/reset-password', {
        method: 'POST',
        body: {
          token: data.token,
          password: data.password
        }
      })

      toast.add({
        title: 'Password reset successful',
        description: 'You can now sign in with your new password',
        color: 'success'
      })

      return { success: true }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> } }
      const message = errorData?.data?.errors?.[0]?.message || 'Failed to reset password. Please try again.'
      error.value = message
      toast.add({
        title: 'Reset failed',
        description: message,
        color: 'error'
      })
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verify email with token
   */
  const verifyEmail = async (data: VerifyEmailData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User }>('/v1/users/verify-email', {
        method: 'POST',
        body: { token: data.token },
        credentials: 'include'
      })

      currentUser.value = response.user

      return { success: true, user: response.user }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> } }
      const message = errorData?.data?.errors?.[0]?.message || 'Failed to verify email. Please try again.'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Accept team invite
   */
  const acceptInvite = async (data: AcceptInviteData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User }>('/v1/users/accept-invite', {
        method: 'POST',
        body: {
          token: data.token,
          password: data.password
        },
        credentials: 'include'
      })

      currentUser.value = response.user

      return { success: true, user: response.user }
    } catch (err: unknown) {
      const errorData = err as { data?: { errors?: Array<{ message?: string }> } }
      const message = errorData?.data?.errors?.[0]?.message || 'Failed to accept invite. Please try again.'
      error.value = message
      toast.add({
        title: 'Failed to accept invite',
        description: message,
        color: 'error'
      })
      return { success: false, error: message }
    } finally {
      isLoading.value = false
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
    return currentUser.value.profile?.businessName
      || currentUser.value.profile?.name
      || currentUser.value.email.split('@')[0]
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
    resetPassword,
    verifyEmail,
    acceptInvite,
    loginWithProvider
  }
}
