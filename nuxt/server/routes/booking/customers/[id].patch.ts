/**
 * PATCH /booking/customers/:id
 * Update a customer in rb-payload
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
      message: 'Customer ID is required'
    })
  }

  // Check for API key - required for customer operations
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
    const url = `${rbPayloadUrl}/api/customers/${id}`
    const response = await $fetch<Record<string, unknown>>(url, {
      method: 'PATCH',
      headers,
      body
    })

    return {
      success: true,
      customer: response.doc || response
    }
  } catch (error: unknown) {
    console.error('Failed to update customer in rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to update customer'
    })
  }
})
