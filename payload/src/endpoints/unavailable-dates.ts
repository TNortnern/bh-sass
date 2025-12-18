import type { Endpoint } from 'payload'

/**
 * GET /api/unavailable-dates
 * Public endpoint to get all unavailable dates for a rental item
 * Used by the public booking calendar to show which dates are already booked
 *
 * Query params:
 * - rentalItemId: ID of the rental item
 * - days: (optional) Number of days to look ahead (default: 90)
 *
 * Returns:
 * - unavailableDates: array of ISO date strings that are fully booked
 * - dateBookedQuantity: map of dates to booked quantity (for partial availability)
 */
export const unavailableDatesEndpoint: Endpoint = {
  path: '/unavailable-dates',
  method: 'get',
  handler: async (req) => {
    try {
      if (!req.url) {
        return Response.json({ error: 'Invalid request' }, { status: 400 })
      }
      const url = new URL(req.url)
      const rentalItemId = url.searchParams.get('rentalItemId')
      const daysParam = url.searchParams.get('days')
      const days = daysParam ? parseInt(daysParam, 10) : 90

      // Validate required parameters
      if (!rentalItemId) {
        return Response.json({
          error: 'Missing required parameter: rentalItemId',
        }, { status: 400 })
      }

      // Get the rental item to check quantity
      const rentalItem = await req.payload.findByID({
        collection: 'rental-items',
        id: rentalItemId,
        overrideAccess: true, // Public endpoint
      })

      if (!rentalItem) {
        return Response.json({
          error: 'Rental item not found',
        }, { status: 404 })
      }

      const totalQuantity = rentalItem.quantity || 1

      // Calculate date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)

      // Query bookings for this item that aren't cancelled
      // Note: Using overrideAccess to make this public
      const bookingsResult = await req.payload.find({
        collection: 'bookings',
        where: {
          'rentalItems.rentalItemId': { equals: parseInt(rentalItemId, 10) },
          status: { not_equals: 'cancelled' },
          endDate: { greater_than_equal: today.toISOString() },
          startDate: { less_than_equal: futureDate.toISOString() },
        },
        limit: 500,
        overrideAccess: true, // Public endpoint - bypass tenant access control
        depth: 0, // Don't populate relationships for performance
      })

      const bookings = bookingsResult.docs

      // Build a map of dates to booked quantity
      const dateBookedQuantity: Record<string, number> = {}

      for (const booking of bookings) {
        const startDate = new Date(booking.startDate as string)
        const endDate = new Date(booking.endDate as string)

        // Find the quantity for this item in this booking
        let bookedQty = 0
        const rentalItems = booking.rentalItems as Array<{
          rentalItemId: number | { id: number }
          quantity: number
        }> | undefined

        if (rentalItems) {
          for (const item of rentalItems) {
            const itemId = typeof item.rentalItemId === 'object'
              ? item.rentalItemId.id
              : item.rentalItemId
            if (String(itemId) === String(rentalItemId)) {
              bookedQty += item.quantity || 1
            }
          }
        }

        // Mark all dates in the range
        const current = new Date(startDate)
        while (current <= endDate) {
          const dateStr = current.toISOString().split('T')[0]
          dateBookedQuantity[dateStr] = (dateBookedQuantity[dateStr] || 0) + bookedQty
          current.setDate(current.getDate() + 1)
        }
      }

      // Also check for blackout periods
      const blackoutsResult = await req.payload.find({
        collection: 'availability',
        where: {
          rentalItemId: { equals: parseInt(rentalItemId, 10) },
          isActive: { equals: true },
          endDate: { greater_than_equal: today.toISOString() },
          startDate: { less_than_equal: futureDate.toISOString() },
        },
        limit: 100,
        overrideAccess: true,
        depth: 0,
      })

      // Add blackout dates as fully booked
      for (const blackout of blackoutsResult.docs) {
        const startDate = new Date(blackout.startDate as string)
        const endDate = new Date(blackout.endDate as string)

        const current = new Date(startDate)
        while (current <= endDate) {
          const dateStr = current.toISOString().split('T')[0]
          // Mark as fully booked (total quantity)
          dateBookedQuantity[dateStr] = totalQuantity
          current.setDate(current.getDate() + 1)
        }
      }

      // Find dates where all units are booked
      const unavailableDates: string[] = []
      for (const [date, bookedQty] of Object.entries(dateBookedQuantity)) {
        if (bookedQty >= totalQuantity) {
          unavailableDates.push(date)
        }
      }

      // Sort dates
      unavailableDates.sort()

      return Response.json({
        rentalItemId,
        totalQuantity,
        unavailableDates,
        dateBookedQuantity,
        daysChecked: days,
      })

    } catch (error) {
      req.payload.logger.error(`Unavailable dates error: ${error instanceof Error ? error.message : String(error)}`)
      return Response.json({
        error: 'Internal server error while checking unavailable dates',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}
