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
    // Check if customer already exists by email for this tenant
    const existingUrl = `${payloadUrl}/api/customers?where[email][equals]=${encodeURIComponent(body.email)}&where[tenantId][equals]=${body.tenantId}&limit=1`

    const existingResponse = await $fetch<CustomerResponse>(existingUrl, {
      headers
    })

    if (existingResponse.docs && existingResponse.docs.length > 0) {
      // Update existing customer with new info
      const existingCustomer = existingResponse.docs[0]

      if (!existingCustomer?.id) {
        throw createError({
          statusCode: 500,
          message: 'Invalid customer data returned'
        })
      }

      const updateResponse = await $fetch<CustomerResponse>(`${payloadUrl}/api/customers/${existingCustomer.id}`, {
        method: 'PATCH',
        headers,
        body: {
          name: customerName,
          phone: body.phone,
          address: body.address
        }
      })

      return {
        customer: {
          id: updateResponse.doc?.id || existingCustomer.id,
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          isNew: false
        }
      }
    }

    // Create new customer
    const createResponse = await $fetch<CustomerResponse>(`${payloadUrl}/api/customers`, {
      method: 'POST',
      headers,
      body: {
        tenantId: body.tenantId,
        name: customerName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        source: 'website'
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
    console.error('Failed to create/find customer:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: message || 'Failed to create customer'
    })
  }
})
