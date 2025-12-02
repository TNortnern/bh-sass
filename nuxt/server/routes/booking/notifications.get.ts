/**
 * GET /booking/notifications
 * Fetch notifications from rb-payload
 * Proxies to rb-payload API with proper authentication
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  // Check for API key - required for booking operations
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured. Set RB_PAYLOAD_API_KEY in your .env file.'
    })
  }

  const query = getQuery(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    // Build query string with tenant filter
    const limit = query.limit || 10
    const page = query.page || 1
    const sort = query.sort || '-createdAt'

    // Build URL with query parameters
    let url = `${rbPayloadUrl}/api/notifications?where[tenantId][equals]=${TENANT_ID}&limit=${limit}&page=${page}&sort=${sort}`

    // Add unread filter if requested
    if (query.unreadOnly === 'true') {
      url += '&where[read][equals]=false'
    }

    console.log(`Fetching notifications from rb-payload: ${url}`)

    const response = await $fetch<{
      docs: any[]
      totalDocs: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
      page: number
      limit: number
    }>(url, { headers })

    // Transform response to flatten nested objects for easier client-side consumption
    const notifications = response.docs.map((notification) => ({
      id: notification.id,
      tenantId: typeof notification.tenantId === 'object' ? notification.tenantId.id : notification.tenantId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      read: notification.read,
      relatedBookingId: typeof notification.relatedBookingId === 'object'
        ? notification.relatedBookingId?.id
        : notification.relatedBookingId,
      relatedCustomerId: typeof notification.relatedCustomerId === 'object'
        ? notification.relatedCustomerId?.id
        : notification.relatedCustomerId,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt
    }))

    return {
      success: true,
      docs: notifications,
      totalDocs: response.totalDocs,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      page: response.page,
      limit: response.limit
    }
  } catch (error: any) {
    console.error('Failed to fetch notifications from rb-payload:', {
      url: `${rbPayloadUrl}/api/notifications`,
      tenantId: TENANT_ID,
      statusCode: error.statusCode,
      message: error.message,
      data: error.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch notifications'
    if (error.statusCode === 401 || error.statusCode === 403) {
      message = 'Authentication failed. Please check the API key configuration.'
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
