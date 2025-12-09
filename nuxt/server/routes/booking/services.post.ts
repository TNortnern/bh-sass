/**
 * POST /booking/services
 * Create a new service in rb-payload
 * Requires API key for authentication
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  // Check for API key - required for service operations
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
    const url = `${rbPayloadUrl}/api/services`
    const response = await $fetch<Record<string, unknown>>(url, {
      method: 'POST',
      headers,
      body: {
        tenantId: TENANT_ID,
        ...body
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
