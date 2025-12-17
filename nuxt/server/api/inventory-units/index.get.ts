/**
 * GET /api/inventory-units
 * Get all inventory units (optionally filtered by rentalItemId)
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  // Get the cookie header to forward to Payload for session auth
  const cookieHeader = getHeader(event, 'cookie') || ''

  // Must have either session cookie or API key
  if (!cookieHeader.includes('payload-token') && !apiKey) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  // Build headers - prefer session auth, fall back to API key
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookieHeader.includes('payload-token')) {
    headers['Cookie'] = cookieHeader
  } else if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  // Get query params
  const query = getQuery(event)
  const rentalItemId = query.rentalItemId

  // Build query string
  let queryString = ''
  if (rentalItemId) {
    queryString = `?where[rentalItem][equals]=${rentalItemId}`
  }

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units${queryString}`, {
      method: 'GET',
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Payload error:', data)

      throw createError({
        statusCode: response.status,
        message: data.errors?.[0]?.message || 'Failed to fetch inventory units'
      })
    }

    return {
      success: true,
      units: data.docs || [],
      totalDocs: data.totalDocs || 0
    }
  } catch (error: unknown) {
    console.error('Error fetching inventory units:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: (error as Error).message || 'Failed to fetch inventory units'
    })
  }
})
