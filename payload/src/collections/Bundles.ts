import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const Bundles: CollectionConfig = {
  slug: 'bundles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pricing', 'featured', 'active'],
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

      // Public access: allow reading active bundles
      return {
        active: {
          equals: true,
        },
      }
    }) as Access,
    create: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin' || req.user?.role === 'staff') return true

      // API key auth can create bundles
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
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this bundle belongs to',
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Bundle name (e.g., "Birthday Party Package", "Ultimate Party Bundle")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the bundle',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'rentalItem',
          type: 'relationship',
          relationTo: 'rental-items',
          required: true,
          admin: {
            description: 'Rental item included in bundle',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          admin: {
            description: 'Quantity of this item',
          },
        },
      ],
      admin: {
        description: 'Items included in this bundle',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'fixed',
          options: [
            {
              label: 'Fixed Price',
              value: 'fixed',
            },
            {
              label: 'Calculated (sum of items)',
              value: 'calculated',
            },
            {
              label: 'Discounted',
              value: 'discounted',
            },
          ],
          admin: {
            description: 'Pricing strategy for this bundle',
          },
        },
        {
          name: 'fixedPrice',
          type: 'number',
          admin: {
            description: 'Fixed price (if pricing type is "fixed")',
            step: 0.01,
            condition: (data) => data.pricing?.type === 'fixed',
          },
        },
        {
          name: 'discountPercent',
          type: 'number',
          admin: {
            description: 'Discount percentage (if pricing type is "discounted")',
            step: 0.01,
            condition: (data) => data.pricing?.type === 'discounted',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Bundle image',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this bundle on homepage',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this bundle currently available?',
      },
    },
  ],
  timestamps: true,
}
