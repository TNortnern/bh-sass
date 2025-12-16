/**
 * POST /booking/services
 * Create a new service in rb-payload
 * Requires API key for authentication
 *
 * Tenant ID is passed from client via body.tenantId (from useTenant composable)
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  // Check for API key - required for service operations
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured'
    })
  }

  const body = await readBody(event)

  // Get tenant ID from request body (passed from client's useTenant composable)
  const tenantId = body.tenantId
  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'tenantId is required - rb-payload tenant not configured for this account'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    const url = `${rbPayloadUrl}/api/services`
    const response = await $fetch<Record<string, unknown>>(url, {
      method: 'POST',
      headers,
      body: {
        ...body,
        tenantId // Override with validated tenantId
      }
    })

    return {
      success: true,
      service: response.doc || response
    }
  } catch (error: unknown) {
    console.error('Failed to create service in rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to create service'
    })
  }
})
