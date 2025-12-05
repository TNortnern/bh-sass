/**
 * Maintenance mode middleware - redirects non-admin users to maintenance page
 * when platform-wide maintenance is enabled
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip check for maintenance page itself, admin routes, and API routes
  if (to.path === '/maintenance' || to.path.startsWith('/admin') || to.path.startsWith('/api') || to.path.startsWith('/v1')) {
    return
  }

  try {
    // Fetch platform settings via public endpoint that doesn't require auth
    const settings = await $fetch<{
      maintenanceMode?: {
        enabled: boolean
        message?: string
        endTime?: string
        isIPAllowed?: boolean
      }
    }>('/api/platform-settings/public', {
      credentials: 'include',
    })

    // Check if maintenance mode is enabled
    if (settings?.maintenanceMode?.enabled) {
      // Get current user to check if they're a super admin
      const { currentUser } = useAuth()

      // Super admins can bypass maintenance mode
      if (currentUser.value?.role === 'super_admin') {
        return
      }

      // Check if user's IP is in the allowed list
      if (settings.maintenanceMode.isIPAllowed) {
        return
      }

      // Redirect to maintenance page
      return navigateTo('/maintenance')
    }
  } catch (error) {
    // If we can't fetch settings, assume maintenance is off
    // This prevents blocking users if the API is temporarily unavailable
    console.error('Failed to check maintenance mode:', error)
  }
})
