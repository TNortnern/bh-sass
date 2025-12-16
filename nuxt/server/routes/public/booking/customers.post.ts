interface CustomerDoc {
  id: string
  [key: string]: any
}

interface CustomerResponse {
  doc?: CustomerDoc
  docs?: CustomerDoc[]
}

/**
 * POST /public/booking/customers
 * Create or find a customer for public booking
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.firstName || !body.lastName || !body.email || !body.phone) {
    throw createError({
      statusCode: 400,
      message: 'First name, last name, email, and phone are required'
    })
  }

  if (!body.tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  // Build headers with API key for authentication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  // Combine firstName and lastName into name (Payload Customers collection uses 'name' field)
  const customerName = `${body.firstName} ${body.lastName}`.trim()

  try {
    // For public booking, always create a new customer record
    // The customer sync system will handle deduplication in rb-payload
    // This avoids needing read access which requires authentication

    // Map address fields to match Payload Customers collection schema
    // Frontend sends 'zip' but collection expects 'zipCode'
    const mappedAddress = body.address ? {
      street: body.address.street,
      city: body.address.city,
      state: body.address.state,
      zipCode: body.address.zip || body.address.zipCode
    } : undefined

    const createResponse = await $fetch<CustomerResponse>(`${payloadUrl}/api/customers`, {
      method: 'POST',
      headers,
      body: {
        tenantId: body.tenantId,
        name: customerName,
        email: body.email,
        phone: body.phone,
        address: mappedAddress
      }
    })

    return {
      customer: {
        id: createResponse.doc?.id || '',
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        isNew: true
      }
    }
  } catch (error: unknown) {
    console.error('Failed to create customer:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: message || 'Failed to create customer'
    })
  }
})
