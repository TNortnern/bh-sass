import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const InventoryUnits: CollectionConfig = {
  slug: 'inventory-units',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'rentalItem', 'status', 'condition', 'barcode'],
    group: 'Rental Management',
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

      // API key auth can create inventory units
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
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this inventory unit belongs to',
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
        description: 'The rental item this unit represents',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Unit identifier (e.g., "Unit #1", "Castle A")',
      },
    },
    {
      name: 'serialNumber',
      type: 'text',
      admin: {
        description: 'Manufacturer serial number',
      },
    },
    {
      name: 'barcode',
      type: 'text',
      index: true,
      admin: {
        description: 'Barcode for scanning',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        {
          label: 'Available',
          value: 'available',
        },
        {
          label: 'Rented',
          value: 'rented',
        },
        {
          label: 'Maintenance',
          value: 'maintenance',
        },
        {
          label: 'Retired',
          value: 'retired',
        },
      ],
      admin: {
        description: 'Current status of the unit',
      },
    },
    {
      name: 'condition',
      type: 'select',
      required: true,
      defaultValue: 'excellent',
      options: [
        {
          label: 'Excellent',
          value: 'excellent',
        },
        {
          label: 'Good',
          value: 'good',
        },
        {
          label: 'Fair',
          value: 'fair',
        },
        {
          label: 'Poor',
          value: 'poor',
        },
      ],
      admin: {
        description: 'Physical condition of the unit',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'General notes about this unit',
      },
    },
    {
      name: 'purchaseDate',
      type: 'date',
      admin: {
        description: 'Date of purchase',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'purchasePrice',
      type: 'number',
      admin: {
        description: 'Purchase price (for asset tracking)',
        step: 0.01,
      },
    },
    {
      name: 'lastMaintenanceDate',
      type: 'date',
      admin: {
        description: 'Date of last maintenance/inspection',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nextMaintenanceDate',
      type: 'date',
      admin: {
        description: 'Date when next maintenance is due',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'maintenanceStatus',
      type: 'select',
      defaultValue: 'up_to_date',
      options: [
        { label: 'Up to Date', value: 'up_to_date' },
        { label: 'Due Soon', value: 'due_soon' },
        { label: 'Overdue', value: 'overdue' },
      ],
      admin: {
        description: 'Current maintenance status',
      },
    },
    {
      name: 'maintenanceNotes',
      type: 'textarea',
      admin: {
        description: 'Maintenance notes specific to this unit',
      },
    },
  ],
  timestamps: true,
}
