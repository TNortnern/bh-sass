/**
 * PATCH /booking/bookings/:id
 * Update a booking in rb-payload
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
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured'
    })
  }

  const body = await readBody(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/bookings/${id}`
    const response = await $fetch<any>(url, {
      method: 'PATCH',
      headers,
      body
    })

    return {
      success: true,
      booking: response.doc || response
    }
  } catch (error: any) {
    console.error('Failed to update booking in rb-payload:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update booking'
    })
  }
})
