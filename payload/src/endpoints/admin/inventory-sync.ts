/**
 * Admin endpoint for manual inventory sync to rb-payload
 *
 * POST /api/admin/inventory-sync - Sync all pending items
 * POST /api/admin/inventory-sync/:id - Sync specific item
 * POST /api/admin/inventory-sync/force/:tenantId - Force resync ALL items for a tenant
 * GET /api/admin/inventory-sync/status - Get sync status summary
 */

import type { Endpoint, Payload } from 'payload'
import { syncRentalItemToRbPayload, syncPendingItems, forceResyncAllInventory } from '../../lib/inventory-sync'
import { forceResyncAllCustomers } from '../../lib/customer-sync'

// Sync all pending items
const syncAllPending: Endpoint = {
  path: '/admin/inventory-sync',
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
  path: '/admin/inventory-sync/:id',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload as Payload
    const id = req.routeParams?.id as string | undefined

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
        id: parseInt(id, 10),
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
  path: '/admin/inventory-sync/status',
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

// Force resync ALL inventory for a specific tenant (even already synced items)
const forceResyncInventory: Endpoint = {
  path: '/admin/inventory-sync/force/:tenantId',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload as Payload
    const tenantId = req.routeParams?.tenantId as string | undefined

    // Check admin access
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!tenantId) {
      return Response.json({ error: 'Tenant ID required' }, { status: 400 })
    }

    try {
      const result = await forceResyncAllInventory(payload, parseInt(tenantId, 10))

      return Response.json({
        success: true,
        message: `Force resync completed: ${result.synced} synced, ${result.failed} failed, ${result.skipped} skipped`,
        ...result,
      })
    } catch (error) {
      console.error(`[Admin] Force resync failed for tenant ${tenantId}:`, error)
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}

// Force resync ALL (inventory + customers) for a specific tenant
const forceResyncAll: Endpoint = {
  path: '/admin/force-resync-all/:tenantId',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload as Payload
    const tenantId = req.routeParams?.tenantId as string | undefined

    // Check admin access
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'tenant_admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!tenantId) {
      return Response.json({ error: 'Tenant ID required' }, { status: 400 })
    }

    const parsedTenantId = parseInt(tenantId, 10)

    try {
      // Run inventory and customer sync in parallel
      const [inventoryResult, customerResult] = await Promise.all([
        forceResyncAllInventory(payload, parsedTenantId),
        forceResyncAllCustomers(payload, parsedTenantId),
      ])

      return Response.json({
        success: true,
        message: 'Force resync completed',
        inventory: {
          synced: inventoryResult.synced,
          failed: inventoryResult.failed,
          skipped: inventoryResult.skipped,
        },
        customers: {
          synced: customerResult.synced,
          failed: customerResult.failed,
          skipped: customerResult.skipped,
        },
      })
    } catch (error) {
      console.error(`[Admin] Force resync all failed for tenant ${tenantId}:`, error)
      return Response.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  },
}

export const inventorySyncEndpoints = [
  syncAllPending,
  syncSingleItem,
  getSyncStatus,
  forceResyncInventory,
  forceResyncAll,
]
