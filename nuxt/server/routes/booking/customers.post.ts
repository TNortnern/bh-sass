/**
 * POST /api/rb-payload/customers
 * Create or find a customer in rb-payload
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
      message: 'rb-payload API key not configured. Set RB_PAYLOAD_API_KEY in your .env file. Get the key from rb-payload admin panel: Tenants > bounce-kingdom > API Key'
    })
  }

  const body = await readBody(event)

  if (!body.email) {
    throw createError({
      statusCode: 400,
      message: 'Email is required'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    // First, try to find existing customer by email
    const searchUrl = `${rbPayloadUrl}/api/customers?where%5BtenantId%5D%5Bequals%5D=${TENANT_ID}&where%5Bemail%5D%5Bequals%5D=${encodeURIComponent(body.email)}&limit=1`

    const searchResponse = await $fetch<{ docs: Record<string, unknown>[] }>(searchUrl, { headers })

    if (searchResponse.docs && searchResponse.docs.length > 0) {
      return {
        success: true,
        customer: searchResponse.docs[0],
        created: false
      }
    }

    // Customer not found, create new one
    const createUrl = `${rbPayloadUrl}/api/customers`

    // rb-payload uses 'name' field, not firstName/lastName
    const fullName = body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim()

    const customerData = {
      tenantId: TENANT_ID,
      name: fullName,
      email: body.email,
      phone: body.phone || ''
    }

    const createResponse = await $fetch<Record<string, unknown>>(createUrl, {
      method: 'POST',
      headers,
      body: customerData
    })

    return {
      success: true,
      customer: createResponse.doc || createResponse,
      created: true
    }
  } catch (error: unknown) {
    console.error('Failed to create/find customer in rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    const errorData = (error && typeof error === 'object' && 'data' in error) ? error.data as Record<string, unknown> : null
    const errors = errorData?.errors as Array<{ message?: string }> | undefined
    const errorMessage = (errors && errors[0]?.message) || message || 'Failed to create customer'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: errorMessage as string
    })
  }
})
