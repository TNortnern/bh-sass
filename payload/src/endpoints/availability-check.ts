import type { Endpoint } from 'payload'

/**
 * GET /api/availability-check
 * Check if a rental item is available for a specific date range
 *
 * Query params:
 * - rentalItemId: ID of the rental item
 * - startDate: ISO date string for rental start
 * - endDate: ISO date string for rental end
 * - tenantId: (optional) Tenant ID for multi-tenant support
 *
 * Returns:
 * - available: boolean indicating if the item is available
 * - conflicts: array of conflicting bookings/blackouts
 */
export const availabilityCheckEndpoint: Endpoint = {
  path: '/availability-check',
  method: 'get',
  handler: async (req) => {
    try {
      if (!req.url) {
        return Response.json({ error: 'Invalid request' }, { status: 400 })
      }
      const url = new URL(req.url)
      const rentalItemId = url.searchParams.get('rentalItemId')
      const startDate = url.searchParams.get('startDate')
      const endDate = url.searchParams.get('endDate')
      const tenantId = url.searchParams.get('tenantId')

      // Validate required parameters
      if (!rentalItemId || !startDate || !endDate) {
        return Response.json({
          error: 'Missing required parameters: rentalItemId, startDate, endDate',
        }, { status: 400 })
      }

      // Parse dates
      const requestStart = new Date(startDate)
      const requestEnd = new Date(endDate)

      if (isNaN(requestStart.getTime()) || isNaN(requestEnd.getTime())) {
        return Response.json({
          error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-15T10:00:00Z)',
        }, { status: 400 })
      }

      if (requestStart >= requestEnd) {
        return Response.json({
          error: 'startDate must be before endDate',
        }, { status: 400 })
      }

      // Check if the rental item exists and is active
      const rentalItem = await req.payload.findByID({
        collection: 'rental-items',
        id: rentalItemId,
      })

      if (!rentalItem) {
        return Response.json({
          error: 'Rental item not found',
        }, { status: 404 })
      }

      if (!rentalItem.isActive) {
        return Response.json({
          available: false,
          reason: 'Rental item is not currently active',
          conflicts: [],
        })
      }

      // Build query for conflicting bookings
      const bookingQuery: any = {
        rentalItemId: { equals: rentalItemId },
        status: {
          not_in: ['cancelled', 'completed'],
        },
        or: [
          // Booking starts during requested period
          {
            and: [
              { startDate: { greater_than_equal: requestStart.toISOString() } },
              { startDate: { less_than: requestEnd.toISOString() } },
            ],
          },
          // Booking ends during requested period
          {
            and: [
              { endDate: { greater_than: requestStart.toISOString() } },
              { endDate: { less_than_equal: requestEnd.toISOString() } },
            ],
          },
          // Booking spans entire requested period
          {
            and: [
              { startDate: { less_than_equal: requestStart.toISOString() } },
              { endDate: { greater_than_equal: requestEnd.toISOString() } },
            ],
          },
        ],
      }

      // Add tenant filter if provided
      if (tenantId) {
        bookingQuery.tenantId = { equals: tenantId }
      }

      // Check for conflicting bookings
      const conflictingBookings = await req.payload.find({
        collection: 'bookings',
        where: bookingQuery,
        limit: 100,
      })

      // Build query for blackout periods
      const blackoutQuery: any = {
        rentalItemId: { equals: rentalItemId },
        isActive: { equals: true },
        or: [
          // Blackout starts during requested period
          {
            and: [
              { startDate: { greater_than_equal: requestStart.toISOString() } },
              { startDate: { less_than: requestEnd.toISOString() } },
            ],
          },
          // Blackout ends during requested period
          {
            and: [
              { endDate: { greater_than: requestStart.toISOString() } },
              { endDate: { less_than_equal: requestEnd.toISOString() } },
            ],
          },
          // Blackout spans entire requested period
          {
            and: [
              { startDate: { less_than_equal: requestStart.toISOString() } },
              { endDate: { greater_than_equal: requestEnd.toISOString() } },
            ],
          },
        ],
      }

      // Add tenant filter if provided
      if (tenantId) {
        blackoutQuery.tenantId = { equals: tenantId }
      }

      // Check for blackout periods
      const blackoutPeriods = await req.payload.find({
        collection: 'availability',
        where: blackoutQuery,
        limit: 100,
      })

      // Check quantity availability
      const totalConflicts = conflictingBookings.totalDocs
      const availableQuantity = (rentalItem.quantity || 1) - totalConflicts

      const isAvailable = totalConflicts === 0 && blackoutPeriods.totalDocs === 0 && availableQuantity > 0

      // Format conflicts for response
      const conflicts = [
        ...conflictingBookings.docs.map(booking => ({
          type: 'booking',
          id: booking.id,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
        })),
        ...blackoutPeriods.docs.map(blackout => ({
          type: 'blackout',
          id: blackout.id,
          startDate: blackout.startDate,
          endDate: blackout.endDate,
          reason: blackout.reason,
        })),
      ]

      return Response.json({
        available: isAvailable,
        rentalItem: {
          id: rentalItem.id,
          name: rentalItem.name,
          quantity: rentalItem.quantity || 1,
          availableQuantity,
        },
        requestedPeriod: {
          startDate: requestStart.toISOString(),
          endDate: requestEnd.toISOString(),
        },
        conflicts,
        conflictCount: conflicts.length,
      })

    } catch (error) {
      req.payload.logger.error(`Availability check error: ${error instanceof Error ? error.message : String(error)}`)
      return Response.json({
        error: 'Internal server error while checking availability',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}
