/**
 * Client-side plugin to initialize impersonation state
 * This ensures the banner appears immediately when the page loads
 */
export default defineNuxtPlugin(async () => {
  const { initializeState } = useImpersonation()

  // Initialize impersonation state from server cookie
  await initializeState()
})
