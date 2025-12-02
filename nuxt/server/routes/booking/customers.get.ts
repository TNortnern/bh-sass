/**
 * GET /booking/customers
 * Fetch customers from rb-payload
 * Requires API key for authentication
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  // Check for API key - required for customer operations
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured. Set RB_PAYLOAD_API_KEY in your .env file.'
    })
  }

  const query = getQuery(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    // Build query string with tenant filter
    const limit = query.limit || 100
    const page = query.page || 1

    const url = `${rbPayloadUrl}/api/customers?where[tenantId][equals]=${TENANT_ID}&limit=${limit}&page=${page}`

    const response = await $fetch<{ docs: any[]; totalDocs: number; totalPages: number }>(url, { headers })

    return {
      success: true,
      customers: response.docs || [],
      totalDocs: response.totalDocs,
      totalPages: response.totalPages
    }
  } catch (error: any) {
    console.error('Failed to fetch customers from rb-payload:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch customers'
    })
  }
})
