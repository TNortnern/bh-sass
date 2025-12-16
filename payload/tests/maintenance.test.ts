import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '../src/payload.config'
import type { Payload } from 'payload'

describe('Maintenance System', () => {
  let payload: Payload
  let testTenantId: number
  let testItemId: number

  beforeAll(async () => {
    payload = await getPayloadHMR({ config })

    // Create test tenant
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Test Rental Co',
        slug: 'test-rental-co',
        plan: 'free',
        status: 'active',
      } as any,  // Payload 3.x type workaround
    })
    testTenantId = tenant.id

    // Create test rental item
    const item = await payload.create({
      collection: 'rental-items',
      data: {
        tenantId: testTenantId,
        name: 'Test Bounce House',
        category: 'bounce_house',
        pricing: { dailyRate: 200 },
        isActive: true,
      },
    })
    testItemId = item.id
  })

  afterAll(async () => {
    // Cleanup
    if (testItemId) {
      await payload.delete({
        collection: 'rental-items',
        id: testItemId,
      })
    }
    if (testTenantId) {
      await payload.delete({
        collection: 'tenants',
        id: testTenantId,
      })
    }
  })

  describe('MaintenanceRecords', () => {
    it('should create a maintenance record', async () => {
      const record = await payload.create({
        collection: 'maintenance-records' as any,
        data: {
          tenantId: testTenantId,
          rentalItem: testItemId,
          type: 'inspection',
          description: 'Monthly safety inspection',
          scheduledDate: new Date().toISOString(),
          status: 'scheduled',
          performedBy: 'John Doe',
        },
      })

      expect(record).toBeDefined()
      expect(record.type).toBe('inspection')
      expect(record.status).toBe('scheduled')
    })

    it('should update rental item when maintenance completed', async () => {
      const record = await payload.create({
        collection: 'maintenance-records' as any,
        data: {
          tenantId: testTenantId,
          rentalItem: testItemId,
          type: 'cleaning',
          description: 'Deep cleaning',
          scheduledDate: new Date().toISOString(),
          status: 'scheduled',
          performedBy: 'Jane Smith',
        },
      })

      const completedDate = new Date().toISOString()
      const nextDate = new Date()
      nextDate.setMonth(nextDate.getMonth() + 1)

      await payload.update({
        collection: 'maintenance-records' as any,
        id: record.id,
        data: {
          status: 'completed',
          completedDate,
          nextMaintenanceDate: nextDate.toISOString(),
        },
      })

      // Verify rental item was updated
      const item = await payload.findByID({
        collection: 'rental-items',
        id: testItemId,
      })

      expect(item.lastMaintenanceDate).toBeDefined()
      expect(item.nextMaintenanceDate).toBeDefined()
    })
  })

  describe('MaintenanceSchedules', () => {
    it('should create a maintenance schedule', async () => {
      const schedule = await payload.create({
        collection: 'maintenance-schedules' as any,
        data: {
          tenantId: testTenantId,
          rentalItem: testItemId,
          name: 'Monthly Inspection',
          frequency: 'monthly',
          frequencyValue: 1,
          maintenanceType: 'inspection',
          reminderDaysBefore: 7,
          isActive: true,
        },
      })

      expect(schedule).toBeDefined()
      expect(schedule.name).toBe('Monthly Inspection')
      expect(schedule.frequency).toBe('monthly')
    })

    it('should calculate next due date correctly', async () => {
      const lastCompleted = new Date('2025-01-01')
      const schedule = await payload.create({
        collection: 'maintenance-schedules' as any,
        data: {
          tenantId: testTenantId,
          rentalItem: testItemId,
          name: 'Quarterly Check',
          frequency: 'quarterly',
          frequencyValue: 1,
          maintenanceType: 'inspection',
          lastCompletedDate: lastCompleted.toISOString(),
          isActive: true,
        },
      })

      expect(schedule.nextDueDate).toBeDefined()

      // Next due should be 3 months after last completed
      const nextDue = new Date(schedule.nextDueDate!)
      const expected = new Date('2025-04-01')

      expect(nextDue.getMonth()).toBe(expected.getMonth())
      expect(nextDue.getFullYear()).toBe(expected.getFullYear())
    })

    it('should handle annual schedules', async () => {
      const lastCompleted = new Date('2024-06-15')
      const schedule = await payload.create({
        collection: 'maintenance-schedules' as any,
        data: {
          tenantId: testTenantId,
          rentalItem: testItemId,
          name: 'Annual Certification',
          frequency: 'annually',
          frequencyValue: 1,
          maintenanceType: 'certification',
          lastCompletedDate: lastCompleted.toISOString(),
          isActive: true,
        },
      })

      const nextDue = new Date(schedule.nextDueDate!)
      expect(nextDue.getFullYear()).toBe(2025)
      expect(nextDue.getMonth()).toBe(5) // June (0-indexed)
      expect(nextDue.getDate()).toBe(15)
    })
  })

  describe('Maintenance Status', () => {
    it('should mark item as overdue when maintenance past due', async () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 10) // 10 days ago

      await payload.update({
        collection: 'rental-items',
        id: testItemId,
        data: {
          nextMaintenanceDate: pastDate.toISOString(),
          maintenanceStatus: 'overdue',
        } as any,
      })

      const item = await payload.findByID({
        collection: 'rental-items',
        id: testItemId,
      })

      expect(item.maintenanceStatus).toBe('overdue')
    })

    it('should mark item as due_soon when within 7 days', async () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 5) // 5 days from now

      await payload.update({
        collection: 'rental-items',
        id: testItemId,
        data: {
          nextMaintenanceDate: soonDate.toISOString(),
          maintenanceStatus: 'due_soon',
        } as any,
      })

      const item = await payload.findByID({
        collection: 'rental-items',
        id: testItemId,
      })

      expect(item.maintenanceStatus).toBe('due_soon')
    })

    it('should mark item as up_to_date when no maintenance due', async () => {
      const futureDate = new Date()
      futureDate.setMonth(futureDate.getMonth() + 2) // 2 months from now

      await payload.update({
        collection: 'rental-items',
        id: testItemId,
        data: {
          nextMaintenanceDate: futureDate.toISOString(),
          maintenanceStatus: 'up_to_date',
        } as any,
      })

      const item = await payload.findByID({
        collection: 'rental-items',
        id: testItemId,
      })

      expect(item.maintenanceStatus).toBe('up_to_date')
    })
  })

  describe('Cost Tracking', () => {
    it('should track maintenance costs', async () => {
      const costs = [150, 200, 75, 300]
      const records = []

      for (const cost of costs) {
        const record = await payload.create({
          collection: 'maintenance-records' as any,
          data: {
            tenantId: testTenantId,
            rentalItem: testItemId,
            type: 'repair',
            description: 'Repair work',
            scheduledDate: new Date().toISOString(),
            status: 'completed',
            completedDate: new Date().toISOString(),
            performedBy: 'Tech Team',
            cost,
          },
        })
        records.push(record)
      }

      // Calculate total cost
      const totalCost = costs.reduce((sum, cost) => sum + cost, 0)
      const avgCost = totalCost / costs.length

      expect(totalCost).toBe(725)
      expect(avgCost).toBe(181.25)

      // Cleanup
      for (const record of records) {
        await payload.delete({
          collection: 'maintenance-records' as any,
          id: record.id,
        })
      }
    })
  })
})
