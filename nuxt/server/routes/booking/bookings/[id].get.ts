/**
 * GET /booking/bookings/:id
 * Fetch a single booking from rb-payload
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

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required'
    })
  }

  // Check for API key - required for booking operations
  if (!apiKey) {
    console.error('rb-payload API key not configured in runtime config')
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured. Please check RB_PAYLOAD_API_KEY environment variable.'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/bookings/${id}`
    console.log(`Fetching booking from rb-payload: ${url}`)

    const response: Record<string, unknown> = await $fetch(url, { headers })

    // rb-payload returns the booking directly, not wrapped
    return {
      success: true,
      booking: response
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('Failed to fetch booking from rb-payload:', {
      id,
      url: `${rbPayloadUrl}/api/bookings/${id}`,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch booking'
    if (fetchError.statusCode === 404) {
      message = `Booking with ID ${id} not found. It may not exist in rb-payload yet.`
    } else if (fetchError.statusCode === 401 || fetchError.statusCode === 403) {
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
