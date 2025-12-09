/**
 * Public endpoint to check platform maintenance mode status
 * Proxies to Payload's public platform-settings endpoint
 * Does not require authentication
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // Forward client IP to Payload for IP allowlist check
    const clientIP = getRequestIP(event, { xForwardedFor: true })

    // Fetch platform settings from Payload's public endpoint
    const settings = await $fetch<{
      maintenanceMode?: {
        enabled: boolean
        message?: string
        endTime?: string
        isIPAllowed?: boolean
      }
    }>(`${config.payloadApiUrl}/api/platform-settings/public`, {
      headers: {
        'Content-Type': 'application/json',
        // Forward client IP to Payload
        'X-Forwarded-For': clientIP || 'unknown'
      }
    })

    return settings
  } catch (error) {
    // If we can't fetch settings, return maintenance disabled
    // This prevents blocking users if Payload is temporarily unavailable
    console.error('Failed to fetch platform settings:', error)
    return {
      maintenanceMode: {
        enabled: false
      }
    }
  }
})
