/**
 * PATCH /booking/notifications/:id
 * Update a notification (mark as read)
 * Proxies to rb-payload API with proper authentication
 */
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
  } catch (error: any) {
    console.error('Failed to update notification in rb-payload:', {
      url: `${rbPayloadUrl}/api/notifications/${notificationId}`,
      notificationId,
      statusCode: error.statusCode,
      message: error.message,
      data: error.data
    })

    // Provide helpful error messages
    let message = 'Failed to update notification'
    if (error.statusCode === 401 || error.statusCode === 403) {
      message = 'Authentication failed. Please check the API key configuration.'
    } else if (error.statusCode === 404) {
      message = 'Notification not found'
    } else if (error.data?.message) {
      message = error.data.message
    } else if (error.message) {
      message = error.message
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message
    })
  }
})
