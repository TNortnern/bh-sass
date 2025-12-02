/**
 * GET /booking/bookings/:id
 * Fetch a single booking from rb-payload
 * Requires API key for authentication
 */
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

    const response = await $fetch<any>(url, { headers })

    // rb-payload returns the booking directly, not wrapped
    return {
      success: true,
      booking: response
    }
  } catch (error: any) {
    console.error('Failed to fetch booking from rb-payload:', {
      id,
      url: `${rbPayloadUrl}/api/bookings/${id}`,
      statusCode: error.statusCode,
      message: error.message,
      data: error.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch booking'
    if (error.statusCode === 404) {
      message = `Booking with ID ${id} not found. It may not exist in rb-payload yet.`
    } else if (error.statusCode === 401 || error.statusCode === 403) {
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
