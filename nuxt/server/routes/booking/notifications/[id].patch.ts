/**
 * PATCH /booking/notifications/:id
 * Update a notification (mark as read)
 * Proxies to rb-payload API with proper authentication
 */
interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  // Check for API key
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured. Set RB_PAYLOAD_API_KEY in your .env file.'
    })
  }

  const notificationId = getRouterParam(event, 'id')
  if (!notificationId) {
    throw createError({
      statusCode: 400,
      message: 'Notification ID is required'
    })
  }

  const body = await readBody(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/notifications/${notificationId}`
    console.log(`Updating notification in rb-payload: ${url}`, body)

    const response = await $fetch(url, {
      method: 'PATCH',
      headers,
      body
    })

    return {
      success: true,
      notification: response
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('Failed to update notification in rb-payload:', {
      url: `${rbPayloadUrl}/api/notifications/${notificationId}`,
      notificationId,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Provide helpful error messages
    let message = 'Failed to update notification'
    if (fetchError.statusCode === 401 || fetchError.statusCode === 403) {
      message = 'Authentication failed. Please check the API key configuration.'
    } else if (fetchError.statusCode === 404) {
      message = 'Notification not found'
    } else if (fetchError.data?.message) {
      message = fetchError.data.message
    } else if (fetchError.message) {
      message = fetchError.message
    }

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message
    })
  }
})
