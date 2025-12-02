/**
 * DELETE /api/inventory-units/:id
 * Delete an inventory unit
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
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
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
  } catch (error: any) {
    console.error('Error deleting inventory unit:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete inventory unit'
    })
  }
})
