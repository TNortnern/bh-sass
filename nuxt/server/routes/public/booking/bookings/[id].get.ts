/**
 * GET /public/booking/bookings/:id
 * Get booking details by ID (public endpoint)
 */

interface BookingCustomer {
  id: string | number
  firstName?: string
  lastName?: string
  email?: string
}

interface BookingItem {
  rentalItemId?: string | number | { id: string | number; name?: string }
  quantity?: number
  price?: number
}

interface BookingResponse {
  id?: string | number
  bookingNumber?: string
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  totalPrice?: number
  depositAmount?: number
  customerId?: string | number | BookingCustomer
  items?: BookingItem[]
  eventType?: string
  eventAddress?: unknown
  specialInstructions?: string
  createdAt?: string
}

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

    const booking = await $fetch<BookingResponse>(url, {
      headers
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }

    // Type guard for customer
    const customer = booking.customerId && typeof booking.customerId === 'object'
      ? booking.customerId as BookingCustomer
      : null

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
        customer: customer ? {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email
        } : null,
        items: booking.items?.map((item: BookingItem) => {
          const rentalItem = item.rentalItemId && typeof item.rentalItemId === 'object'
            ? item.rentalItemId as { id: string | number; name?: string }
            : null
          return {
            id: rentalItem?.id || item.rentalItemId,
            name: rentalItem?.name,
            quantity: item.quantity,
            price: item.price
          }
        }) || [],
        eventType: booking.eventType,
        eventAddress: booking.eventAddress,
        specialInstructions: booking.specialInstructions,
        createdAt: booking.createdAt
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch booking:', error)

    // Type guard for error with statusCode
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch booking details'
    })
  }
})
