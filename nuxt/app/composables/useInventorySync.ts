/**
 * Inventory Sync Composable
 * Handles 2-way sync between BH-SaaS Payload (master) and rb-payload (booking engine)
 *
 * Sync Direction:
 * - CREATE/UPDATE rental items in BH-SaaS → sync to rb-payload services
 * - Booking events from rb-payload → update inventory status in BH-SaaS
 */

interface RentalItem {
  id: number
  name: string
  description?: string
  category: string
  pricing: {
    hourlyRate?: number
    dailyRate: number
    weekendRate?: number
    weeklyRate?: number
  }
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  capacity?: number
  quantity: number
  isActive: boolean
  rbPayloadServiceId?: number
  syncStatus?: 'pending' | 'synced' | 'failed' | 'out_of_sync'
  lastSyncedAt?: string
  syncError?: string
}

interface RbPayloadService {
  id?: number
  tenantId: number
  name: string
  description?: string
  category?: string
  duration: number
  price: number
  bufferBefore?: number
  bufferAfter?: number
  requiresStaff: boolean
  isActive: boolean
  quantity?: number
  maxConcurrentBookings?: number
  externalId?: string
  metadata?: Record<string, unknown>
}

export function useInventorySync() {
  // const config = useRuntimeConfig()

  /**
   * Transform RentalItem to rb-payload Service format
   */
  function rentalItemToService(item: RentalItem): Omit<RbPayloadService, 'id' | 'tenantId'> {
    return {
      name: item.name,
      description: typeof item.description === 'string' ? item.description : '',
      category: getCategoryLabel(item.category),
      duration: 480, // Default 8 hours for bounce houses
      price: item.pricing.dailyRate,
      bufferBefore: 60, // 1 hour setup
      bufferAfter: 60, // 1 hour teardown
      requiresStaff: true, // Delivery required
      isActive: item.isActive,
      quantity: item.quantity,
      maxConcurrentBookings: item.quantity,
      externalId: `bh-saas-${item.id}`,
      metadata: {
        bhSaasId: item.id,
        category: item.category,
        pricing: item.pricing,
        dimensions: item.dimensions,
        capacity: item.capacity,
        syncedAt: new Date().toISOString()
      }
    }
  }

  /**
   * Map category value to display label
   */
  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      bounce_house: 'Bounce Houses',
      water_slide: 'Water Slides',
      combo_unit: 'Combo Units',
      obstacle_course: 'Obstacle Courses',
      interactive_game: 'Interactive Games',
      tent_canopy: 'Tents & Canopies',
      table_chair: 'Tables & Chairs',
      concession: 'Concessions',
      other: 'Other'
    }
    return labels[category] || category
  }

  /**
   * Sync a single rental item to rb-payload
   */
  async function syncToRbPayload(item: RentalItem): Promise<{
    success: boolean
    rbPayloadServiceId?: number
    error?: string
  }> {
    try {
      const serviceData = rentalItemToService(item)
      const tenantId = 6 // TODO: Get from config or context

      if (item.rbPayloadServiceId) {
        // UPDATE existing service
        const response = await $fetch<{ success: boolean, service: { id: number } }>(
          `/booking/services/${item.rbPayloadServiceId}`,
          {
            method: 'PATCH',
            body: {
              ...serviceData,
              tenantId
            }
          }
        )
        return {
          success: true,
          rbPayloadServiceId: response.service?.id || item.rbPayloadServiceId
        }
      } else {
        // CREATE new service
        const response = await $fetch<{ success: boolean, service: { id: number } }>(
          '/booking/services',
          {
            method: 'POST',
            body: {
              ...serviceData,
              tenantId
            }
          }
        )
        return {
          success: true,
          rbPayloadServiceId: response.service?.id
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to sync to rb-payload:', error)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Delete a service from rb-payload
   */
  async function deleteFromRbPayload(rbPayloadServiceId: number): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      await $fetch(`/booking/services/${rbPayloadServiceId}`, {
        method: 'DELETE'
      })
      return { success: true }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Failed to delete from rb-payload:', error)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Fetch all services from rb-payload for comparison
   */
  async function fetchRbPayloadServices(): Promise<RbPayloadService[]> {
    try {
      const response = await $fetch<{ success: boolean, services: RbPayloadService[] }>(
        '/booking/services'
      )
      return response.services || []
    } catch (error) {
      console.error('Failed to fetch rb-payload services:', error)
      return []
    }
  }

  /**
   * Bulk sync all rental items to rb-payload
   */
  async function syncAllToRbPayload(
    items: RentalItem[],
    onProgress?: (current: number, total: number, item: RentalItem) => void
  ): Promise<{
    success: number
    failed: number
    errors: Array<{ itemId: number, error: string }>
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ itemId: number, error: string }>
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item) continue

      onProgress?.(i + 1, items.length, item)

      const result = await syncToRbPayload(item)
      if (result.success) {
        results.success++
      } else {
        results.failed++
        results.errors.push({
          itemId: item.id,
          error: result.error || 'Unknown error'
        })
      }
    }

    return results
  }

  /**
   * Check sync status by comparing BH-SaaS items with rb-payload services
   */
  async function checkSyncStatus(items: RentalItem[]): Promise<{
    synced: number
    outOfSync: number
    notSynced: number
    details: Array<{
      itemId: number
      name: string
      status: 'synced' | 'out_of_sync' | 'not_synced'
    }>
  }> {
    const services = await fetchRbPayloadServices()
    const serviceMap = new Map(
      services
        .filter(s => s.externalId?.startsWith('bh-saas-'))
        .map(s => [s.externalId, s])
    )

    const details: Array<{
      itemId: number
      name: string
      status: 'synced' | 'out_of_sync' | 'not_synced'
    }> = []

    let synced = 0
    let outOfSync = 0
    let notSynced = 0

    for (const item of items) {
      const externalId = `bh-saas-${item.id}`
      const service = serviceMap.get(externalId)

      if (!service) {
        notSynced++
        details.push({ itemId: item.id, name: item.name, status: 'not_synced' })
      } else if (
        service.name !== item.name
        || service.price !== item.pricing.dailyRate
        || service.isActive !== item.isActive
        || service.quantity !== item.quantity
      ) {
        outOfSync++
        details.push({ itemId: item.id, name: item.name, status: 'out_of_sync' })
      } else {
        synced++
        details.push({ itemId: item.id, name: item.name, status: 'synced' })
      }
    }

    return { synced, outOfSync, notSynced, details }
  }

  return {
    syncToRbPayload,
    deleteFromRbPayload,
    fetchRbPayloadServices,
    syncAllToRbPayload,
    checkSyncStatus,
    rentalItemToService
  }
}
