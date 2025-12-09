/**
 * PATCH /booking/services/:id
 * Update a service in rb-payload
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

  const body = await readBody(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/services/${id}`
    const response = await $fetch<Record<string, unknown>>(url, {
      method: 'PATCH',
      headers,
      body
    })

    return {
      success: true,
      service: response.doc || response
    }
  } catch (error: unknown) {
    console.error('Failed to update service in rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to update service'
    })
  }
})
