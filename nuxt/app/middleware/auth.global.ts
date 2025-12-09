export default defineNuxtRouteMiddleware(async (to) => {
  // Define route access rules - these paths don't require authentication
  const publicPaths = [
    '/', // Landing page
    '/auth/', // Auth pages (login, register, etc.)
    '/booking/', // Legacy booking routes
    '/book/', // Public booking pages
    '/site/', // Public tenant websites
    '/widget/', // Embedded booking widgets
    '/pricing', // Pricing page
    '/features', // Features page
    '/admin/', // Payload admin (has its own auth)
    '/maintenance' // Maintenance mode page
  ]

  const isPublicPath = publicPaths.some(path =>
    to.path === path || (path.endsWith('/') && to.path.startsWith(path))
  )

  // Allow public paths (but not /app)
  if (isPublicPath && !to.path.startsWith('/app')) {
    return
  }

  const { fetchUser, isAuthenticated } = useAuth()

  // Always try to fetch user if not authenticated yet
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  // DASHBOARD ROUTES: Require authentication
  if (to.path.startsWith('/app')) {
    if (!isAuthenticated.value) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }

    return // Allow authenticated access
  }

  // AUTH PAGES: Redirect authenticated users to dashboard
  if (to.path.startsWith('/auth/')) {
    if (isAuthenticated.value) {
      return navigateTo('/app')
    }
  }
})
