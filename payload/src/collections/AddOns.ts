import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const AddOns: CollectionConfig = {
  slug: 'add-ons',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pricing', 'required', 'active'],
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

      // Public access: allow reading active add-ons
      return {
        active: {
          equals: true,
        },
      }
    }) as Access,
    create: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create add-ons
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
        description: 'The tenant this add-on belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign tenant for tenant admins
            if (!value && req.user?.role === 'tenant_admin') {
              return req.user.tenantId
            }
            return value
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Add-on name (e.g., "Delivery", "Setup", "Generator Rental")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the add-on service',
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
              label: 'Fixed',
              value: 'fixed',
            },
            {
              label: 'Per Item',
              value: 'perItem',
            },
            {
              label: 'Per Day',
              value: 'perDay',
            },
          ],
          admin: {
            description: 'Pricing calculation method',
          },
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: {
            description: 'Price amount',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this add-on required for all bookings?',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this add-on currently available?',
      },
    },
  ],
  timestamps: true,
}
