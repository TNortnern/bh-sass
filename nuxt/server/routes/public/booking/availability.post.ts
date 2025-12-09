/**
 * POST /public/booking/availability
 * Check availability for a rental item on specific dates
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.itemId) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required'
    })
  }

  if (!body.startDate || !body.endDate) {
    throw createError({
      statusCode: 400,
      message: 'Start and end dates are required'
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
    // Get the rental item details
    const itemResponse = await $fetch<Record<string, unknown>>(`${payloadUrl}/api/rental-items/${body.itemId}`, {
      headers
    })

    if (!itemResponse) {
      throw createError({
        statusCode: 404,
        message: 'Item not found'
      })
    }

    const item = itemResponse
    const quantity = body.quantity || 1
    const itemQuantity = item.quantity || 1

    // Check for existing bookings that overlap the requested dates
    // A booking conflicts if it starts before endDate AND ends after startDate
    const bookingsUrl = `${payloadUrl}/api/bookings?where[items.rentalItemId][equals]=${body.itemId}&where[status][not_equals]=cancelled&where[startDate][less_than_equal]=${body.endDate}&where[endDate][greater_than_equal]=${body.startDate}&limit=100`

    const bookingsResponse = await $fetch<{ docs: Record<string, unknown>[] }>(bookingsUrl, {
      headers
    })

    const conflictingBookings = bookingsResponse.docs || []

    // Calculate total booked quantity for the date range
    let bookedQuantity = 0
    conflictingBookings.forEach((booking: Record<string, unknown>) => {
      const items = booking.items as Array<Record<string, unknown>> | undefined
      const bookingItem = items?.find((i: Record<string, unknown>) => {
        const rentalItemId = i.rentalItemId
        const itemIdValue = typeof rentalItemId === 'object' && rentalItemId !== null
          ? (rentalItemId as Record<string, unknown>).id
          : rentalItemId
        return itemIdValue === body.itemId
      })
      if (bookingItem) {
        bookedQuantity += (bookingItem.quantity as number) || 1
      }
    })

    const availableQuantity = Number(itemQuantity) - bookedQuantity
    const isAvailable = availableQuantity >= quantity

    // Calculate pricing
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))

    const pricing = item.pricing as Record<string, unknown> | undefined
    const basePrice = ((pricing?.fullDayRate as number) || 0) * days * quantity
    const deliveryFee = 50 // Standard delivery fee
    const taxRate = 0.0825 // 8.25% tax
    const subtotal = basePrice + deliveryFee
    const tax = subtotal * taxRate
    const total = subtotal + tax

    return {
      available: isAvailable,
      availableQuantity,
      requestedQuantity: quantity,
      conflicts: conflictingBookings.map((b: Record<string, unknown>) => ({
        bookingNumber: b.bookingNumber,
        startDate: b.startDate,
        endDate: b.endDate
      })),
      pricing: {
        basePrice: Math.round(basePrice * 100) / 100,
        deliveryFee,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        days,
        dailyRate: ((pricing?.fullDayRate as number) || 0)
      }
    }
  } catch (error: unknown) {
    console.error('Failed to check availability:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to check availability'
    })
  }
})
