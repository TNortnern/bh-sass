/**
 * GET /booking/notifications
 * Fetch notifications from rb-payload
 * Proxies to rb-payload API with proper authentication
 */
interface RbPayloadNotification {
  id: string
  tenantId: string | { id: string } | null
  type?: string
  title?: string
  body?: string
  link?: string
  read?: boolean
  relatedBookingId?: string | { id: string }
  relatedCustomerId?: string | { id: string }
  metadata?: unknown
  createdAt?: string
  updatedAt?: string
}

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

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
      docs: RbPayloadNotification[]
      totalDocs: number
      totalPages: number
      hasNextPage: boolean
      hasPrevPage: boolean
      page: number
      limit: number
    }>(url, { headers })

    // Transform response to flatten nested objects for easier client-side consumption
    const notifications = response.docs.map(notification => ({
      id: notification.id,
      tenantId: typeof notification.tenantId === 'object' && notification.tenantId !== null
        ? notification.tenantId.id
        : notification.tenantId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      read: notification.read,
      relatedBookingId: typeof notification.relatedBookingId === 'object' && notification.relatedBookingId !== null
        ? (notification.relatedBookingId as { id: string }).id
        : notification.relatedBookingId,
      relatedCustomerId: typeof notification.relatedCustomerId === 'object' && notification.relatedCustomerId !== null
        ? (notification.relatedCustomerId as { id: string }).id
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
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('Failed to fetch notifications from rb-payload:', {
      url: `${rbPayloadUrl}/api/notifications`,
      tenantId: TENANT_ID,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch notifications'
    if (fetchError.statusCode === 401 || fetchError.statusCode === 403) {
      message = 'Authentication failed. Please check the API key configuration.'
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
