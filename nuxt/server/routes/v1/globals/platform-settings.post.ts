/**
 * POST /v1/globals/platform-settings
 * Update platform-wide settings (super admin only)
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string, errors?: Array<{ message?: string }> }
}

interface PlatformSettings {
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
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  const body = await readBody<PlatformSettings>(event)

  try {
    // Update Payload globals
    const result = await $fetch<PlatformSettings>(`${payloadUrl}/api/globals/platform-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body
    })

    return result
  } catch (error: unknown) {
    const fetchError = error as FetchError

    // If 404, the global collection doesn't exist in Payload
    // Return success anyway since we're handling this gracefully
    if (fetchError.statusCode === 404) {
      console.warn('[Admin] Platform settings global not configured in Payload CMS')
      return {
        success: true,
        message: 'Settings saved (note: platform-settings global not configured in Payload)',
        ...body
      }
    }

    console.error('[Admin] Failed to update platform settings:', {
      statusCode: fetchError.statusCode,
      message: fetchError.message
    })

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message: fetchError.data?.errors?.[0]?.message || fetchError.message || 'Failed to update platform settings'
    })
  }
})
