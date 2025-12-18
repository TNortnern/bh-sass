/**
 * GET /public/booking/bookings/:id
 * Get booking details by ID (public endpoint)
 * Proxies to Payload's public booking-confirmation endpoint
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

  try {
    // Use Payload's public booking-confirmation endpoint
    // This endpoint uses overrideAccess: true for public confirmation data
    const response = await $fetch<{
      booking: {
        id: string | number
        bookingNumber: string
        status: string
        paymentStatus: string
        startDate: string
        endDate: string
        deliveryTime?: string
        pickupTime?: string
        totalPrice: number
        depositPaid: number
        balanceDue: number
        customer: {
          id: string | number
          firstName: string
          lastName: string
          email: string
          phone?: string
        } | null
        items: Array<{
          id: string | number
          name: string
          quantity: number
          price: number
        }>
        deliveryAddress?: {
          street: string
          city: string
          state: string
          zipCode: string
        }
        notes?: string
        createdAt: string
      }
    }>(`${payloadUrl}/api/booking-confirmation?bookingId=${bookingId}`)

    return response
  } catch (error: unknown) {
    console.error('Failed to fetch booking:', error)

    // Return empty on error
    throw createError({
      statusCode: 404,
      message: 'Booking not found'
    })
  }
})
