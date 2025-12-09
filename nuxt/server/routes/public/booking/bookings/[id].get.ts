/**
 * GET /public/booking/bookings/:id
 * Get booking details by ID (public endpoint)
 */
export default defineEventHandler(async (event) => {
  const bookingId = getRouterParam(event, 'id')

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required'
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
    // Fetch booking from Payload with populated relations
    const url = `${payloadUrl}/api/bookings/${bookingId}?depth=2`

    const response: Record<string, any> = await $fetch(url, {
      headers
    })

    if (!response) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }

    const booking: Record<string, any> = response

    // Return sanitized booking data
    return {
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        depositAmount: booking.depositAmount,
        customer: booking.customerId ? {
          id: typeof booking.customerId === 'object' ? booking.customerId.id : booking.customerId,
          firstName: booking.customerId?.firstName,
          lastName: booking.customerId?.lastName,
          email: booking.customerId?.email
        } : null,
        items: booking.items?.map((item: any) => ({
          id: typeof item.rentalItemId === 'object' ? item.rentalItemId.id : item.rentalItemId,
          name: item.rentalItemId?.name,
          quantity: item.quantity,
          price: item.price
        })) || [],
        eventType: booking.eventType,
        eventAddress: booking.eventAddress,
        specialInstructions: booking.specialInstructions,
        createdAt: booking.createdAt
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch booking:', error)

    if (error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch booking details'
    })
  }
})
