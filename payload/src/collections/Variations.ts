import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Variations: CollectionConfig = {
  slug: 'variations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'rentalItemId', 'pricingType', 'quantity', 'status'],
    group: 'Rental Management',
  },
  access: {
    // Tenant-scoped access with public widget support and API key auth
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

      // Public access (for booking widget): allow reading active variations
      return {
        status: {
          equals: 'active',
        },
      }
    }) as Access,
    create: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create variations
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
        description: 'The tenant this variation belongs to',
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
      name: 'rentalItemId',
      type: 'relationship',
      relationTo: 'rental-items',
      required: true,
      admin: {
        description: 'The parent rental item this variation belongs to',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Variation name (e.g., "Large Blue Theme", "Medium Princess")',
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: false, // Unique per tenant, enforced via index
      index: true,
      admin: {
        description: 'Stock keeping unit (SKU) - must be unique within tenant',
      },
    },
    {
      name: 'attributes',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Attribute name (e.g., "Size", "Theme", "Color")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Attribute value (e.g., "Large", "Princess", "Blue")',
          },
        },
      ],
      admin: {
        description: 'Variation attributes that differentiate this from the parent item',
      },
    },
    {
      name: 'pricingType',
      type: 'select',
      required: true,
      defaultValue: 'same_as_parent',
      options: [
        { label: 'Same as Parent', value: 'same_as_parent' },
        { label: 'Price Adjustment', value: 'adjustment' },
        { label: 'Override Price', value: 'override' },
      ],
      admin: {
        description: 'How pricing is calculated for this variation',
      },
    },
    {
      name: 'priceAdjustment',
      type: 'number',
      admin: {
        description: 'Amount to add/subtract from parent price (use negative for discount)',
        step: 0.01,
        condition: (data) => data.pricingType === 'adjustment',
      },
    },
    {
      name: 'overridePrice',
      type: 'group',
      fields: [
        {
          name: 'hourlyRate',
          type: 'number',
          admin: {
            description: 'Hourly rental rate',
            step: 0.01,
          },
        },
        {
          name: 'dailyRate',
          type: 'number',
          admin: {
            description: 'Daily rental rate',
            step: 0.01,
          },
        },
        {
          name: 'weekendRate',
          type: 'number',
          admin: {
            description: 'Weekend rental rate',
            step: 0.01,
          },
        },
        {
          name: 'weeklyRate',
          type: 'number',
          admin: {
            description: 'Weekly rental rate',
            step: 0.01,
          },
        },
      ],
      admin: {
        description: 'Custom pricing for this variation (overrides parent entirely)',
        condition: (data) => data.pricingType === 'override',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
      required: true,
      admin: {
        description: 'Number of units available for this variation',
      },
    },
    {
      name: 'trackInventory',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Track inventory for this variation separately',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Image URL (Bunny CDN or external)',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
      ],
      admin: {
        description: 'Optional images for this variation (if empty, uses parent item images)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: {
        description: 'Variation status',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
