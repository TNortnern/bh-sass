/**
 * DELETE /booking/bookings/:id
 * Delete a booking from rb-payload
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/bookings/${id}`
    await $fetch(url, {
      method: 'DELETE',
      headers
    })

    return {
      success: true,
      message: 'Booking deleted successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to delete booking from rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to delete booking'
    })
  }
})
