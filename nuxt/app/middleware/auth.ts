export default defineNuxtRouteMiddleware(async (to) => {
  // Define route access rules
  const publicPaths = ['/', '/auth/', '/booking/']

  const isPublicPath = publicPaths.some(path =>
    to.path === path || (path.endsWith('/') && to.path.startsWith(path))
  )

  // Allow public paths (but not /app)
  if (isPublicPath && !to.path.startsWith('/app')) {
    return
  }

  const { fetchUser, isAuthenticated, isLoading } = useAuth()

  // Fetch user if not already loaded
  if (isLoading.value) {
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
