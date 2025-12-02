import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'keyPrefix', 'lastUsed', 'createdAt'],
    group: 'Settings',
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

      // API key auth can create new API keys
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
        description: 'The tenant this API key belongs to',
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
        description: 'A descriptive name for this API key',
        placeholder: 'Production API Key',
      },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The API key value (only shown once at creation)',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate secure API key with tenant prefix
              const randomPart = Array.from({ length: 32 }, () =>
                Math.random().toString(36).charAt(2)
              ).join('')
              return `bp_live_${randomPart}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'keyPrefix',
      type: 'text',
      admin: {
        description: 'First 12 characters of the key for identification',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            // Extract prefix from key for safe display
            const key = siblingData?.key || data?.key
            if (key) {
              return key.substring(0, 12)
            }
            return data?.keyPrefix
          },
        ],
      },
    },
    {
      name: 'lastUsed',
      type: 'date',
      admin: {
        description: 'When this API key was last used',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this API key active?',
      },
    },
    {
      name: 'permissions',
      type: 'array',
      admin: {
        description: 'Specific permissions for this API key (empty = full access)',
      },
      fields: [
        {
          name: 'permission',
          type: 'select',
          options: [
            { label: 'Read Inventory', value: 'inventory:read' },
            { label: 'Write Inventory', value: 'inventory:write' },
            { label: 'Read Bookings', value: 'bookings:read' },
            { label: 'Write Bookings', value: 'bookings:write' },
            { label: 'Read Customers', value: 'customers:read' },
            { label: 'Write Customers', value: 'customers:write' },
            { label: 'Read Reports', value: 'reports:read' },
            { label: 'Manage Webhooks', value: 'webhooks:manage' },
          ],
        },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration date for this API key',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
  timestamps: true,
}
