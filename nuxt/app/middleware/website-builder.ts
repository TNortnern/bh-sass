/**
 * Middleware to protect website builder routes
 * Checks if the user's plan has the websiteBuilder feature flag enabled
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Only protect routes under /app/website/ that are not settings
  if (!to.path.startsWith('/app/website')) {
    return
  }

  // Allow access to website settings page (basic config available to all plans)
  if (to.path === '/app/website' || to.path === '/app/website/settings') {
    return
  }

  const { hasWebsiteBuilder, fetchPlan, plan } = usePlanFeatures()

  // Fetch plan if not already loaded
  if (!plan.value) {
    await fetchPlan()
  }

  // Check if website builder is enabled
  if (!hasWebsiteBuilder.value) {
    // Redirect to website index with a message
    return navigateTo('/app/website')
  }
})
