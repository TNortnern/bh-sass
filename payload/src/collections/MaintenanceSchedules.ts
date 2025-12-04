import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const MaintenanceSchedules: CollectionConfig = {
  slug: 'maintenance-schedules',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rentalItem', 'frequency', 'maintenanceType', 'isActive', 'nextDueDate'],
    group: 'Maintenance',
  },
  access: {
    read: (async ({ req }) => {
      // Super admin can read all
      if (req.user?.role === 'super_admin') return true

      // Check for API key or session auth
      const context = await getAccessContext(req)

      // Authenticated users (session or API key): filter by tenant
      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    }) as Access,
    create: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create schedules
      const context = await getAccessContext(req)
      return context.authMethod === 'api_key'
    },
    update: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // API key auth has full tenant access
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      if (req.user?.role === 'tenant_admin') {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }
      return false
    },
    delete: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      const context = await getAccessContext(req)

      // API key auth has full tenant access
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    },
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this maintenance schedule belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign tenant for tenant admins or staff
            if (!value && req.user && (req.user.role === 'tenant_admin' || req.user.role === 'staff')) {
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'rentalItem',
      type: 'relationship',
      relationTo: 'rental-items',
      required: true,
      admin: {
        description: 'The rental item this schedule applies to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Schedule name (e.g., "Monthly Inspection", "Annual Certification")',
      },
    },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annually', value: 'annually' },
        { label: 'After X Rentals', value: 'after_x_rentals' },
      ],
      admin: {
        description: 'How often maintenance should occur',
      },
    },
    {
      name: 'frequencyValue',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Frequency interval (e.g., every 2 weeks, after 10 rentals)',
      },
    },
    {
      name: 'maintenanceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Inspection', value: 'inspection' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Repair', value: 'repair' },
        { label: 'Certification', value: 'certification' },
      ],
      admin: {
        description: 'Type of maintenance to perform',
      },
    },
    {
      name: 'checklist',
      type: 'array',
      fields: [
        {
          name: 'task',
          type: 'text',
          required: true,
          admin: {
            description: 'Task description',
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this task required?',
          },
        },
      ],
      admin: {
        description: 'Checklist of tasks to perform during maintenance',
      },
    },
    {
      name: 'instructions',
      type: 'richText',
      admin: {
        description: 'Detailed instructions for performing the maintenance',
      },
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      admin: {
        description: 'Estimated duration in minutes',
      },
    },
    {
      name: 'reminderDaysBefore',
      type: 'number',
      defaultValue: 7,
      admin: {
        description: 'Send reminder X days before due date',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this schedule currently active?',
      },
    },
    {
      name: 'lastCompletedDate',
      type: 'date',
      admin: {
        description: 'When was maintenance last completed?',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nextDueDate',
      type: 'date',
      admin: {
        description: 'When is the next maintenance due? (auto-calculated)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'rentalCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of rentals since last maintenance (for rental-based schedules)',
        condition: (data) => data.frequency === 'after_x_rentals',
      },
    },
  ],
  timestamps: true,
  hooks: {
    // Calculate next due date based on frequency
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || (operation === 'update' && data.lastCompletedDate)) {
          const lastDate = data.lastCompletedDate ? new Date(data.lastCompletedDate) : new Date()

          if (data.frequency && data.frequency !== 'after_x_rentals') {
            const interval = data.frequencyValue || 1

            switch (data.frequency) {
              case 'daily':
                data.nextDueDate = new Date(lastDate.getTime() + interval * 24 * 60 * 60 * 1000)
                break
              case 'weekly':
                data.nextDueDate = new Date(lastDate.getTime() + interval * 7 * 24 * 60 * 60 * 1000)
                break
              case 'monthly':
                const monthDate = new Date(lastDate)
                monthDate.setMonth(monthDate.getMonth() + interval)
                data.nextDueDate = monthDate
                break
              case 'quarterly':
                const quarterDate = new Date(lastDate)
                quarterDate.setMonth(quarterDate.getMonth() + interval * 3)
                data.nextDueDate = quarterDate
                break
              case 'annually':
                const yearDate = new Date(lastDate)
                yearDate.setFullYear(yearDate.getFullYear() + interval)
                data.nextDueDate = yearDate
                break
            }
          }
        }

        return data
      },
    ],
    // Create a maintenance record when schedule is triggered
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        // Auto-create maintenance record when schedule becomes due
        if (
          doc.isActive &&
          doc.nextDueDate &&
          new Date(doc.nextDueDate) <= new Date() &&
          (!previousDoc || previousDoc.nextDueDate !== doc.nextDueDate)
        ) {
          try {
            const payload = req.payload

            // Check if a record already exists for this due date
            const existing = await payload.find({
              collection: 'maintenance-records' as any,
              where: {
                and: [
                  {
                    rentalItem: {
                      equals: typeof doc.rentalItem === 'object' ? doc.rentalItem.id : doc.rentalItem,
                    },
                  },
                  {
                    type: {
                      equals: doc.maintenanceType,
                    },
                  },
                  {
                    scheduledDate: {
                      equals: doc.nextDueDate,
                    },
                  },
                ],
              },
            })

            if (!existing.docs.length) {
              // Create new maintenance record
              await payload.create({
                collection: 'maintenance-records' as any,
                data: {
                  tenantId: doc.tenantId,
                  rentalItem: doc.rentalItem,
                  type: doc.maintenanceType,
                  description: `Scheduled ${doc.name}`,
                  scheduledDate: doc.nextDueDate,
                  status: 'scheduled',
                  performedBy: '', // To be filled when completed
                  checklist: doc.checklist?.map((item: any) => ({
                    task: item.task,
                    completed: false,
                    notes: '',
                  })),
                } as any,
              })
            }
          } catch (error) {
            console.error('Failed to create maintenance record from schedule:', error)
          }
        }
      },
    ],
  },
}
