/**
 * GET /api/inventory-units/:id
 * Get a single inventory unit by ID
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

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Unit ID is required'
    })
  }

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units/${id}`, {
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
        message: data.errors?.[0]?.message || 'Failed to fetch inventory unit'
      })
    }

    return {
      success: true,
      unit: data
    }
  } catch (error: unknown) {
    console.error('Error fetching inventory unit:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: (error as Error).message || 'Failed to fetch inventory unit'
    })
  }
})
