import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const MaintenanceRecords: CollectionConfig = {
  slug: 'maintenance-records',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['rentalItem', 'type', 'scheduledDate', 'status', 'performedBy'],
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
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin' || req.user?.role === 'staff') return true

      // API key auth can create maintenance records
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

      if (req.user?.role === 'tenant_admin' || req.user?.role === 'staff') {
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
        description: 'The tenant this maintenance record belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req }) => {
            // Always use the authenticated user's tenant - never allow client-provided tenantId
            if (req.user?.tenantId) {
              return getTenantId(req.user)
            }
            return undefined
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
        description: 'The rental item being maintained',
      },
    },
    {
      name: 'inventoryUnit',
      type: 'relationship',
      relationTo: 'inventory-units',
      admin: {
        description: 'Specific unit if tracking individual units (optional)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Inspection', value: 'inspection' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Repair', value: 'repair' },
        { label: 'Replacement', value: 'replacement' },
        { label: 'Certification', value: 'certification' },
      ],
      admin: {
        description: 'Type of maintenance performed',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Description of the maintenance work',
      },
    },
    {
      name: 'scheduledDate',
      type: 'date',
      required: true,
      admin: {
        description: 'When the maintenance was scheduled',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'completedDate',
      type: 'date',
      admin: {
        description: 'When the maintenance was actually completed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current status of the maintenance',
      },
    },
    {
      name: 'performedBy',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of staff member or vendor who performed the maintenance',
      },
    },
    {
      name: 'cost',
      type: 'number',
      admin: {
        description: 'Cost of maintenance (parts + labor)',
        step: 0.01,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Detailed notes about the maintenance work',
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
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'notes',
          type: 'text',
        },
      ],
      admin: {
        description: 'Checklist items completed during maintenance',
      },
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Photo URL (before/after photos)',
          },
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Photo description',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Before', value: 'before' },
            { label: 'After', value: 'after' },
            { label: 'During', value: 'during' },
          ],
        },
      ],
      admin: {
        description: 'Photos documenting the maintenance',
      },
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Document URL (certificates, receipts, etc.)',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Certificate', value: 'certificate' },
            { label: 'Receipt', value: 'receipt' },
            { label: 'Invoice', value: 'invoice' },
            { label: 'Report', value: 'report' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
      admin: {
        description: 'Related documents (certificates, receipts, etc.)',
      },
    },
    {
      name: 'nextMaintenanceDate',
      type: 'date',
      admin: {
        description: 'When the next maintenance is recommended',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    // rb-payload sync field
    {
      name: 'rbPayloadBlackoutId',
      type: 'number',
      admin: {
        description: 'Blackout ID in rb-payload booking system',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    // Update the rental item's last maintenance date when a record is completed
    afterChange: [
      // Sync maintenance to rb-payload as blackout (background, non-blocking)
      async ({ doc, req }) => {
        const { queueMaintenanceSync } = await import('../lib/blackout-sync')
        queueMaintenanceSync(req.payload, doc as any)
      },
      async ({ doc, req, operation }) => {
        if (operation === 'update' && doc.status === 'completed' && doc.completedDate) {
          try {
            const payload = req.payload

            // Update the rental item's last maintenance date
            if (doc.rentalItem) {
              await payload.update({
                collection: 'rental-items',
                id: typeof doc.rentalItem === 'object' ? doc.rentalItem.id : doc.rentalItem,
                data: {
                  lastMaintenanceDate: doc.completedDate as any,
                  nextMaintenanceDate: doc.nextMaintenanceDate as any,
                  maintenanceStatus: doc.nextMaintenanceDate
                    ? new Date(doc.nextMaintenanceDate) < new Date()
                      ? 'overdue'
                      : new Date(doc.nextMaintenanceDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                      ? 'due_soon'
                      : 'up_to_date'
                    : 'up_to_date',
                } as any,
              })
            }

            // Update the inventory unit if specified
            if (doc.inventoryUnit) {
              await payload.update({
                collection: 'inventory-units',
                id: typeof doc.inventoryUnit === 'object' ? doc.inventoryUnit.id : doc.inventoryUnit,
                data: {
                  lastMaintenanceDate: doc.completedDate as any,
                } as any,
              })
            }
          } catch (error) {
            console.error('Failed to update maintenance dates:', error)
          }
        }
      },
    ],
  },
}
