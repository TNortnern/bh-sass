import type { Endpoint } from 'payload'

/**
 * GET /api/booking-confirmation
 * Public endpoint to get booking confirmation details
 * Used by the public confirmation page after checkout
 *
 * Query params:
 * - bookingId: ID of the booking
 *
 * Returns sanitized booking details safe for public display
 */
export const bookingConfirmationEndpoint: Endpoint = {
  path: '/booking-confirmation',
  method: 'get',
  handler: async (req) => {
    try {
      if (!req.url) {
        return Response.json({ error: 'Invalid request' }, { status: 400 })
      }
      const url = new URL(req.url)
      const bookingId = url.searchParams.get('bookingId')

      // Validate required parameters
      if (!bookingId) {
        return Response.json({
          error: 'Missing required parameter: bookingId',
        }, { status: 400 })
      }

      // Get the booking with populated relations
      const booking = await req.payload.findByID({
        collection: 'bookings',
        id: bookingId,
        overrideAccess: true, // Public endpoint for confirmation
        depth: 2, // Populate customer and items
      })

      if (!booking) {
        return Response.json({
          error: 'Booking not found',
        }, { status: 404 })
      }

      // Extract customer info (handle both populated and non-populated)
      const customer = typeof booking.customerId === 'object' && booking.customerId !== null
        ? {
            id: booking.customerId.id,
            firstName: booking.customerId.firstName,
            lastName: booking.customerId.lastName,
            email: booking.customerId.email,
            phone: booking.customerId.phone,
          }
        : null

      // Extract rental items info
      const rentalItems = (booking.rentalItems as Array<{
        rentalItemId: number | { id: number; name?: string }
        quantity: number
        priceAtBooking?: number
      }> | undefined)?.map(item => {
        const rentalItem = typeof item.rentalItemId === 'object' && item.rentalItemId !== null
          ? item.rentalItemId
          : null
        return {
          id: rentalItem?.id || item.rentalItemId,
          name: rentalItem?.name || 'Rental Item',
          quantity: item.quantity || 1,
          price: item.priceAtBooking || 0,
        }
      }) || []

      // Return sanitized booking data for public confirmation
      return Response.json({
        booking: {
          id: booking.id,
          bookingNumber: booking.bookingNumber || `BK-${booking.id}`,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          startDate: booking.startDate,
          endDate: booking.endDate,
          deliveryTime: booking.deliveryTime,
          pickupTime: booking.pickupTime,
          totalPrice: booking.totalPrice,
          depositPaid: booking.depositPaid || 0,
          balanceDue: booking.balanceDue || (Number(booking.totalPrice) - Number(booking.depositPaid || 0)),
          customer,
          items: rentalItems,
          deliveryAddress: booking.deliveryAddress,
          notes: booking.notes,
          createdAt: booking.createdAt,
        },
      })

    } catch (error) {
      req.payload.logger.error(`Booking confirmation error: ${error instanceof Error ? error.message : String(error)}`)
      return Response.json({
        error: 'Internal server error while fetching booking confirmation',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}
