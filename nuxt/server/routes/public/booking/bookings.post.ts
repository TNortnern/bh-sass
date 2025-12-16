/**
 * POST /public/booking/bookings
 * Create a new booking for public booking flow
 * Supports multiple items and add-ons per booking
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.customerId) {
    throw createError({
      statusCode: 400,
      message: 'Customer ID is required'
    })
  }

  if (!body.tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  if (!body.items || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one item is required'
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

  try {
    // Generate booking number
    const bookingNumber = `BH-${Date.now().toString(36).toUpperCase()}`

    // Calculate dates from items (use first item's dates as booking dates)
    const startDate = body.items[0]?.startDate
    const endDate = body.items[0]?.endDate

    if (!startDate || !endDate) {
      throw createError({
        statusCode: 400,
        message: 'Start and end dates are required'
      })
    }

    // Get delivery address from eventDetails or deliveryAddress
    const address = body.eventDetails?.address || body.deliveryAddress || {}

    // Transform all items to the new rentalItems array format
    const rentalItems = body.items.map((item: {
      itemId: number
      quantity?: number
      price?: number
      startDate?: string
      endDate?: string
    }) => ({
      rentalItemId: item.itemId,
      quantity: item.quantity || 1,
      price: item.price || 0
    }))

    // Transform add-ons if present
    const addOns = body.addOns?.map((addOn: {
      name: string
      price: number
      quantity?: number
    }) => ({
      name: addOn.name,
      price: addOn.price || 0,
      quantity: addOn.quantity || 1
    })) || []

    // Create booking in Payload with multi-item support
    const bookingData = {
      tenantId: body.tenantId,
      bookingNumber,
      customerId: body.customerId,
      rentalItems, // Array of items
      addOns, // Array of add-ons
      startDate,
      endDate,
      status: 'pending',
      totalPrice: body.totalPrice || 0,
      depositPaid: 0,
      deliveryAddress: {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zip || address.zipCode || ''
      },
      eventType: body.eventDetails?.type || 'other',
      specialInstructions: body.eventDetails?.specialInstructions || body.notes || ''
    }

    const createResponse = await $fetch<{ doc: Record<string, unknown> }>(`${payloadUrl}/api/bookings`, {
      method: 'POST',
      headers,
      body: bookingData
    })

    const booking = createResponse.doc

    return {
      success: true,
      booking: {
        id: booking?.id,
        bookingNumber: booking?.bookingNumber || bookingNumber,
        status: booking?.status || 'pending',
        totalPrice: body.totalPrice,
        startDate,
        endDate,
        itemCount: rentalItems.length,
        addOnCount: addOns.length
      }
    }
  } catch (error: unknown) {
    console.error('Failed to create booking:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: message || 'Failed to create booking'
    })
  }
})
