import type { PayloadRequest } from 'payload'
import type { Endpoint } from 'payload'

/**
 * Get maintenance records due within the next N days
 * GET /api/maintenance/due?days=7&itemId=123&tenantId=abc
 */
export const maintenanceDueEndpoint: Endpoint = {
  path: '/maintenance/due',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { days = 7, itemId, tenantId } = req.query

    try {
      const daysAhead = parseInt(days as string, 10)
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + daysAhead)

      const where: any = {
        and: [
          {
            status: {
              in: ['scheduled', 'in_progress'],
            },
          },
          {
            scheduledDate: {
              less_than_equal: futureDate.toISOString(),
            },
          },
        ],
      }

      if (tenantId) {
        where.and.push({
          tenantId: {
            equals: tenantId,
          },
        })
      }

      if (itemId) {
        where.and.push({
          rentalItem: {
            equals: itemId,
          },
        })
      }

      const records = await req.payload.find({
        collection: 'maintenance-records' as any,
        where,
        limit: 100,
        sort: 'scheduledDate',
      })

      // Categorize by urgency
      const now = new Date()
      const overdue = records.docs.filter((r: any) => new Date(r.scheduledDate) < now)
      const dueSoon = records.docs.filter(
        (r: any) => new Date(r.scheduledDate) >= now && new Date(r.scheduledDate) <= futureDate
      )

      return Response.json({
        success: true,
        total: records.docs.length,
        overdue: overdue.length,
        dueSoon: dueSoon.length,
        records: {
          overdue,
          dueSoon,
          all: records.docs,
        },
      })
    } catch (error: any) {
      return Response.json(
        {
          success: false,
          error: error.message || 'Failed to fetch due maintenance',
        },
        { status: 500 }
      )
    }
  },
}

/**
 * Complete a maintenance record
 * POST /api/maintenance/complete
 * Body: { recordId, completedDate, performedBy, checklist, notes, cost, nextMaintenanceDate }
 */
export const maintenanceCompleteEndpoint: Endpoint = {
  path: '/maintenance/complete',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    try {
      const body = await req.json?.()
      const { recordId, completedDate, performedBy, checklist, notes, cost, nextMaintenanceDate } = body || {}

      if (!recordId) {
        return Response.json(
          {
            success: false,
            error: 'recordId is required',
          },
          { status: 400 }
        )
      }

      // Update the maintenance record
      const updated = await req.payload.update({
        collection: 'maintenance-records' as any,
        id: recordId,
        data: {
          status: 'completed',
          completedDate: completedDate || new Date().toISOString(),
          performedBy,
          checklist,
          notes,
          cost,
          nextMaintenanceDate,
        } as any,
      })

      return Response.json({
        success: true,
        record: updated,
      })
    } catch (error: any) {
      return Response.json(
        {
          success: false,
          error: error.message || 'Failed to complete maintenance',
        },
        { status: 500 }
      )
    }
  },
}

/**
 * Get maintenance history for a rental item
 * GET /api/rental-items/:id/maintenance-history
 */
export const maintenanceHistoryEndpoint: Endpoint = {
  path: '/rental-items/:id/maintenance-history',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { id } = req.routeParams as { id: string }

    try {
      const records = await req.payload.find({
        collection: 'maintenance-records' as any,
        where: {
          rentalItem: {
            equals: id,
          },
        },
        limit: 100,
        sort: '-completedDate',
      })

      // Calculate stats
      const totalCost = records.docs.reduce((sum: number, r: any) => sum + (r.cost || 0), 0)
      const completedCount = records.docs.filter((r: any) => r.status === 'completed').length
      const avgCost = completedCount > 0 ? totalCost / completedCount : 0

      const typeBreakdown = records.docs.reduce((acc: any, r: any) => {
        acc[r.type] = (acc[r.type] || 0) + 1
        return acc
      }, {})

      return Response.json({
        success: true,
        stats: {
          totalRecords: records.docs.length,
          completedCount,
          totalCost,
          avgCost,
          typeBreakdown,
        },
        records: records.docs,
      })
    } catch (error: any) {
      return Response.json(
        {
          success: false,
          error: error.message || 'Failed to fetch maintenance history',
        },
        { status: 500 }
      )
    }
  },
}
