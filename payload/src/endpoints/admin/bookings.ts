import type { Endpoint } from 'payload'

/**
 * GET /api/admin/bookings
 * List all bookings across all tenants
 */
export const adminBookingsListEndpoint: Endpoint = {
  path: '/admin/bookings',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const url = new URL(req.url || '')
      const search = url.searchParams.get('search') || ''
      const status = url.searchParams.get('status') || ''
      const tenantId = url.searchParams.get('tenantId') || ''

      // Build where clause
      const where: any = {}

      if (search) {
        where.or = [
          { bookingNumber: { contains: search } },
          { 'customer.firstName': { contains: search } },
          { 'customer.lastName': { contains: search } },
          { 'customer.email': { contains: search } }
        ]
      }

      if (status) {
        where.status = { equals: status }
      }

      if (tenantId) {
        where.tenant = { equals: tenantId }
      }

      const bookingsResult = await payload.find({
        collection: 'bookings',
        where,
        limit: 100,
        sort: '-createdAt',
        depth: 2 // Include tenant, customer, and service relationships
      })

      // Enrich with tenant and customer info
      const enrichedBookings = bookingsResult.docs.map(booking => {
        const tenant = typeof booking.tenant === 'object' ? booking.tenant : null
        const customer = typeof booking.customer === 'object' ? booking.customer : null
        const service = typeof booking.service === 'object' ? booking.service : null

        return {
          id: String(booking.id),
          bookingNumber: booking.bookingNumber || `BK-${String(booking.id).slice(0, 8)}`,
          tenantId: tenant?.id ? String(tenant.id) : '',
          tenantName: tenant?.name || 'Unknown',
          customerName: customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : 'Unknown',
          customerEmail: customer?.email || '',
          itemName: service?.name || 'Unknown',
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status,
          totalPrice: booking.totalPrice || 0,
          createdAt: booking.createdAt
        }
      })

      return Response.json(enrichedBookings)
    } catch (error: any) {
      req.payload.logger.error('Error fetching bookings:', error)
      return Response.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
  }
}
