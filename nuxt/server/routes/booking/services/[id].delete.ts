/**
 * DELETE /booking/services/:id
 * Delete a service from rb-payload
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
      message: 'Service ID is required'
    })
  }

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
    const url = `${rbPayloadUrl}/api/services/${id}`
    await $fetch(url, {
      method: 'DELETE',
      headers
    })

    return {
      success: true,
      message: 'Service deleted successfully'
    }
  } catch (error: any) {
    console.error('Failed to delete service from rb-payload:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete service'
    })
  }
})
