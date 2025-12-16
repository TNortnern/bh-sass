/**
 * Composable for SSO (Single Sign-On) with rb-payload
 *
 * This composable generates SSO URLs that allow users to automatically
 * log into rb-payload's dashboard from BH-SaaS without re-entering credentials.
 *
 * Flow:
 * 1. BH-SaaS generates a signed JWT token with user info
 * 2. User is redirected to rb-payload's /api/auth/sso endpoint
 * 3. rb-payload validates the token and creates a session
 * 4. User is redirected to the target page, logged in
 *
 * NOTE: We redirect to /app (Nuxt dashboard) NOT /admin (Payload CMS admin)
 * The /app routes provide a better UX for tenant users.
 */

export const useSso = () => {
  const { currentUser } = useAuth()
  const { tenant: _tenant, rbPayloadTenantId, bhSaasTenantId } = useTenant()
  const toast = useToast()

  // Loading state for SSO operations
  const isGeneratingSsoUrl = ref(false)

  /**
   * Generate an SSO URL to auto-login to rb-payload
   * @param redirect - Where to redirect after login (default: /app dashboard)
   * @returns The SSO URL or null if failed
   */
  const generateSsoUrl = async (redirect: string = '/app'): Promise<string | null> => {
    if (!currentUser.value?.email) {
      toast.add({
        title: 'Authentication Required',
        description: 'Please log in to access the booking system',
        color: 'error'
      })
      return null
    }

    if (!rbPayloadTenantId.value) {
      toast.add({
        title: 'Setup Required',
        description: 'Your booking system is not yet configured',
        color: 'warning'
      })
      return null
    }

    isGeneratingSsoUrl.value = true

    try {
      // Get user's name from profile
      const firstName = currentUser.value.profile?.name?.split(' ')[0] || ''
      const lastName = currentUser.value.profile?.name?.split(' ').slice(1).join(' ') || ''

      const response = await $fetch<{ ssoUrl: string }>('/api/sso/generate-token', {
        method: 'POST',
        body: {
          email: currentUser.value.email,
          tenantId: bhSaasTenantId.value,
          rbPayloadTenantId: rbPayloadTenantId.value,
          firstName,
          lastName,
          redirect
        },
        credentials: 'include'
      })

      return response.ssoUrl
    } catch (err) {
      console.error('Failed to generate SSO URL:', err)
      toast.add({
        title: 'SSO Failed',
        description: 'Could not generate login link. Please try again.',
        color: 'error'
      })
      return null
    } finally {
      isGeneratingSsoUrl.value = false
    }
  }

  /**
   * Navigate to rb-payload with SSO authentication
   * @param redirect - Where to redirect after login (default: /app dashboard)
   */
  const navigateToRbPayload = async (redirect: string = '/app') => {
    const ssoUrl = await generateSsoUrl(redirect)
    if (ssoUrl) {
      window.open(ssoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  /**
   * Navigate to a specific section of rb-payload's /app dashboard
   * Maps BH-SaaS collection names to rb-payload /app routes:
   * - services → /app/services
   * - customers → /app/customers
   * - bookings → /app/bookings
   * - staff → /app/staff
   * - blackouts → /app/settings (blackouts are in settings)
   * - notifications → /app (no dedicated page, go to dashboard)
   */
  const navigateToCollection = async (collection: string, _tenantFilter: boolean = true) => {
    // Map collection names to /app routes
    const routeMap: Record<string, string> = {
      services: '/app/services',
      customers: '/app/customers',
      bookings: '/app/bookings',
      staff: '/app/staff',
      blackouts: '/app/settings', // Blackouts are managed in settings
      notifications: '/app' // No dedicated notifications page, go to dashboard
    }

    const redirect = routeMap[collection] || `/app/${collection}`
    await navigateToRbPayload(redirect)
  }

  /**
   * Navigate to the main rb-payload dashboard
   */
  const navigateToDashboard = async () => {
    await navigateToRbPayload('/app')
  }

  /**
   * Navigate to the Payload CMS admin panel (for advanced users)
   */
  const navigateToAdmin = async () => {
    await navigateToRbPayload('/admin')
  }

  return {
    // State
    isGeneratingSsoUrl: readonly(isGeneratingSsoUrl),

    // Actions
    generateSsoUrl,
    navigateToRbPayload,
    navigateToCollection,
    navigateToDashboard,
    navigateToAdmin
  }
}
