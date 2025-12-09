/**
 * GET /booking/bookings
 * Fetch bookings from rb-payload
 * Requires API key for authentication
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
    const limit = query.limit || 100
    const page = query.page || 1

    const url = `${rbPayloadUrl}/api/bookings?where[tenantId][equals]=${TENANT_ID}&limit=${limit}&page=${page}`
    console.log(`Fetching bookings from rb-payload: ${url}`)

    const response = await $fetch<{ docs: Record<string, unknown>[], totalDocs: number, totalPages: number }>(url, { headers })

    return {
      success: true,
      bookings: response.docs || [],
      totalDocs: response.totalDocs,
      totalPages: response.totalPages
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('Failed to fetch bookings from rb-payload:', {
      url: `${rbPayloadUrl}/api/bookings`,
      tenantId: TENANT_ID,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch bookings'
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
