/**
 * Admin endpoint for manual inventory sync to rb-payload
 *
 * POST /api/admin/inventory-sync - Sync all pending items
 * POST /api/admin/inventory-sync/:id - Sync specific item
 * GET /api/admin/inventory-sync/status - Get sync status summary
 */

import type { Endpoint, Payload } from 'payload'
import { syncRentalItemToRbPayload, syncPendingItems } from '../../lib/inventory-sync'

// Sync all pending items
const syncAllPending: Endpoint = {
  path: '/inventory-sync',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload as Payload

    // Check admin access
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
      const result = await syncPendingItems(payload)

      return Response.json({
        success: true,
        message: `Synced ${result.synced} items, ${result.failed} failed`,
        ...result,
      })
    } catch (error) {
      console.error('[Admin] Inventory sync failed:', error)
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}

// Sync a specific item
const syncSingleItem: Endpoint = {
  path: '/inventory-sync/:id',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload as Payload
    const { id } = req.routeParams || {}

    // Check admin access
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!id) {
      return Response.json({ error: 'Item ID required' }, { status: 400 })
    }

    try {
      const item = await payload.findByID({
        collection: 'rental-items',
        id: parseInt(id),
      })

      if (!item) {
        return Response.json({ error: 'Item not found' }, { status: 404 })
      }

      const result = await syncRentalItemToRbPayload(payload, item as any)

      return Response.json({
        success: result.success,
        serviceId: result.serviceId,
        error: result.error,
      })
    } catch (error) {
      console.error(`[Admin] Failed to sync item ${id}:`, error)
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}

// Get sync status summary
const getSyncStatus: Endpoint = {
  path: '/inventory-sync/status',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload as Payload

    // Check admin access
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    try {
      // Count items by sync status
      const [synced, pending, failed, total] = await Promise.all([
        payload.count({ collection: 'rental-items', where: { syncStatus: { equals: 'synced' } } }),
        payload.count({ collection: 'rental-items', where: { syncStatus: { equals: 'pending' } } }),
        payload.count({ collection: 'rental-items', where: { syncStatus: { equals: 'failed' } } }),
        payload.count({ collection: 'rental-items' }),
      ])

      return Response.json({
        total: total.totalDocs,
        synced: synced.totalDocs,
        pending: pending.totalDocs,
        failed: failed.totalDocs,
        unsynced: total.totalDocs - synced.totalDocs,
      })
    } catch (error) {
      console.error('[Admin] Failed to get sync status:', error)
      return Response.json({
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}

export const inventorySyncEndpoints = [syncAllPending, syncSingleItem, getSyncStatus]
