/**
 * Admin middleware - ensures only super_admin users can access /admin routes
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchUser, currentUser, isAuthenticated } = useAuth()

  // Fetch user if not already loaded
  if (!currentUser.value) {
    await fetchUser()
  }

  // Must be authenticated
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  // Must be super_admin role
  if (currentUser.value?.role !== 'super_admin') {
    // Redirect non-super-admins to their tenant dashboard
    return navigateTo('/app')
  }

  // Allow access
})
