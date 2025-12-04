/**
 * Maintenance mode middleware - redirects non-admin users to maintenance page
 * when platform-wide maintenance is enabled
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server-side during SSR (only check client-side)
  if (import.meta.server) {
    return
  }

  // Skip check for maintenance page itself and admin routes
  if (to.path === '/maintenance' || to.path.startsWith('/admin')) {
    return
  }

  try {
    // Fetch platform settings to check maintenance mode
    const settings = await $fetch('/v1/globals/platform-settings', {
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

      // Check if user's IP is in allowed list (optional feature for future)
      // const allowedIPs = settings.maintenanceMode?.allowedIPs || []
      // const userIP = await getUserIP() // Would need to implement this
      // if (allowedIPs.some(item => item.ip === userIP)) {
      //   return
      // }

      // Redirect to maintenance page
      return navigateTo('/maintenance')
    }
  } catch (error) {
    // If we can't fetch settings, assume maintenance is off
    console.error('Failed to check maintenance mode:', error)
  }
})
