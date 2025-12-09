/**
 * GET /api/inventory-units
 * Get all inventory units (optionally filtered by rentalItemId)
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Payload API key not configured'
    })
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
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
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
