/**
 * DELETE /api/inventory-units/:id
 * Delete an inventory unit
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

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Unit ID is required'
    })
  }

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units/${id}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const data = await response.json()
      console.error('Payload error:', data)

      throw createError({
        statusCode: response.status,
        message: data.errors?.[0]?.message || 'Failed to delete inventory unit'
      })
    }

    return {
      success: true,
      message: 'Inventory unit deleted successfully'
    }
  } catch (error: unknown) {
    console.error('Error deleting inventory unit:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Failed to delete inventory unit'
    throw createError({
      statusCode: 500,
      message
    })
  }
})
