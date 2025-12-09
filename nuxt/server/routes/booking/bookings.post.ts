/**
 * POST /api/rb-payload/bookings
 * Create a booking in rb-payload
 * Requires API key for authentication
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  // Check for API key - required for booking operations
  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured. Set RB_PAYLOAD_API_KEY in your .env file. Get the key from rb-payload admin panel: Tenants > bounce-kingdom > API Key'
    })
  }

  const body = await readBody(event)

  // Validate required fields
  if (!body.customerId) {
    throw createError({
      statusCode: 400,
      message: 'Customer ID is required'
    })
  }

  if (!body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one item is required'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    // Get first available staff member if not specified
    let staffId = body.staffId

    if (!staffId) {
      const staffUrl = `${rbPayloadUrl}/api/staff?where[tenantId][equals]=${TENANT_ID}&where[isActive][equals]=true&limit=1`
      const staffResponse = await $fetch<{ docs: Record<string, unknown>[] }>(staffUrl, { headers })

      if (staffResponse.docs && staffResponse.docs.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        staffId = (staffResponse.docs[0] as any).id
      } else {
        throw createError({
          statusCode: 400,
          message: 'No staff members available for booking'
        })
      }
    }

    // Create the booking
    const createUrl = `${rbPayloadUrl}/api/bookings`

    const bookingData = {
      tenantId: TENANT_ID,
      items: body.items.map((item: Record<string, unknown>) => ({
        serviceId: item.serviceId,
        label: item.label,
        price: item.price,
        duration: item.duration || 240, // Default 4 hours
        staffId,
        // Pass through metadata for bounce-house specific fields
        // (delivery address, setup instructions, dimensions, etc.)
        metadata: item.metadata || null
      })),
      totalPrice: body.totalPrice,
      staffId,
      customerId: body.customerId,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status || 'pending',
      notes: body.notes || '',
      paymentStatus: body.paymentStatus || 'unpaid'
    }

    const createResponse = await $fetch<Record<string, unknown>>(createUrl, {
      method: 'POST',
      headers,
      body: bookingData
    })

    return {
      success: true,
      booking: createResponse.doc || createResponse
    }
  } catch (error: unknown) {
    console.error('Failed to create booking in rb-payload:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to create booking'
    })
  }
})
