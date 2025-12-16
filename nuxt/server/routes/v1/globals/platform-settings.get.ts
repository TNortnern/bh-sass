/**
 * GET /v1/globals/platform-settings
 * Get platform-wide settings (super admin only)
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  try {
    // Try to fetch from Payload globals
    const settings = await $fetch<{
      maintenanceMode?: {
        enabled?: boolean
        message?: string
        endTime?: string | null
        allowedIPs?: { ip: string }[]
      }
      platformAnnouncements?: {
        enabled?: boolean
        message?: string
        type?: string
      }
    }>(`${payloadUrl}/api/globals/platform-settings`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    })

    return settings
  } catch (error: unknown) {
    const fetchError = error as FetchError

    // If 404, return default settings (global doesn't exist yet)
    if (fetchError.statusCode === 404) {
      return {
        maintenanceMode: {
          enabled: false,
          message: 'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!',
          endTime: null,
          allowedIPs: []
        },
        platformAnnouncements: {
          enabled: false,
          message: '',
          type: 'info'
        }
      }
    }

    console.error('[Admin] Failed to fetch platform settings:', {
      statusCode: fetchError.statusCode,
      message: fetchError.message
    })

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message: fetchError.message || 'Failed to fetch platform settings'
    })
  }
})
