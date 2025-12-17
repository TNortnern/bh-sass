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
      try {
        // Super admin can read all
        if (req.user?.role === 'super_admin') return true

        // Check for API key or session auth
        const context = await getAccessContext(req)

        // Authenticated users (session or API key): filter by tenant
        if (context.tenantId !== null) {
          return {
            tenantId: {
              equals: context.tenantId,
            },
          }
        }

        return false
      } catch (error) {
        console.error('ApiKeys read access error:', error)
        return false
      }
    }) as Access,
    create: async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create new API keys
      const context = await getAccessContext(req)
      return context.authMethod === 'api_key'
    },
    update: async ({ req }) => {
      try {
        if (req.user?.role === 'super_admin') return true

        const context = await getAccessContext(req)

        // API key auth has full tenant access
        if (context.authMethod === 'api_key' && context.tenantId !== null) {
          return {
            tenantId: {
              equals: context.tenantId,
            },
          }
        }

        if (req.user?.role === 'tenant_admin') {
          const tenantId = getTenantId(req.user)
          if (!tenantId) return false
          const tenantIdNum = typeof tenantId === 'number' ? tenantId : parseInt(String(tenantId), 10)
          if (!isNaN(tenantIdNum)) {
            return {
              tenantId: {
                equals: tenantIdNum,
              },
            }
          }
        }
        return false
      } catch (error) {
        console.error('ApiKeys update access error:', error)
        return false
      }
    },
    delete: async ({ req }) => {
      try {
        if (req.user?.role === 'super_admin') return true

        const context = await getAccessContext(req)

        // API key auth has full tenant access
        if (context.authMethod === 'api_key' && context.tenantId !== null) {
          return {
            tenantId: {
              equals: context.tenantId,
            },
          }
        }

        if (req.user?.role === 'tenant_admin') {
          const tenantId = getTenantId(req.user)
          if (!tenantId) return false
          const tenantIdNum = typeof tenantId === 'number' ? tenantId : parseInt(String(tenantId), 10)
          if (!isNaN(tenantIdNum)) {
            return {
              tenantId: {
                equals: tenantIdNum,
              },
            }
          }
        }
        return false
      } catch (error) {
        console.error('ApiKeys delete access error:', error)
        return false
      }
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
              // Generate secure API key with tk_ prefix (32 random characters)
              const randomPart = Array.from({ length: 32 }, () =>
                Math.random().toString(36).charAt(2)
              ).join('')
              return `tk_${randomPart}`
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
      name: 'lastRotatedAt',
      type: 'date',
      admin: {
        description: 'When this API key was last rotated',
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
      name: 'scopeType',
      type: 'select',
      required: true,
      defaultValue: 'full_access',
      options: [
        {
          label: 'Full Access',
          value: 'full_access',
        },
        {
          label: 'Read Only',
          value: 'read_only',
        },
        {
          label: 'Booking Management',
          value: 'booking_management',
        },
        {
          label: 'Custom Scopes',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Access level for this API key',
      },
    },
    {
      name: 'scopes',
      type: 'json',
      admin: {
        description: 'Computed scopes based on scope type (stored as JSON array)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // Auto-populate scopes based on scopeType
            const scopeType = siblingData?.scopeType

            if (scopeType === 'full_access') {
              return [
                'rental-items:read',
                'rental-items:write',
                'rental-items:delete',
                'bookings:read',
                'bookings:write',
                'bookings:delete',
                'customers:read',
                'customers:write',
                'customers:delete',
                'inventory-units:read',
                'inventory-units:write',
                'inventory-units:delete',
                'add-ons:read',
                'add-ons:write',
                'add-ons:delete',
                'bundles:read',
                'bundles:write',
                'bundles:delete',
                'availability:read',
                'availability:write',
                'availability:delete',
                'payments:read',
                'invoices:read',
                'notifications:read',
                'webhooks:manage',
                'settings:manage',
                'reports:read',
              ]
            }

            if (scopeType === 'read_only') {
              return [
                'rental-items:read',
                'bookings:read',
                'customers:read',
                'inventory-units:read',
                'add-ons:read',
                'bundles:read',
                'availability:read',
                'payments:read',
                'invoices:read',
                'notifications:read',
                'reports:read',
              ]
            }

            if (scopeType === 'booking_management') {
              return [
                'rental-items:read',
                'bookings:read',
                'bookings:write',
                'bookings:delete',
                'customers:read',
                'customers:write',
                'inventory-units:read',
                'add-ons:read',
                'bundles:read',
                'availability:read',
                'availability:write',
                'notifications:read',
              ]
            }

            // For custom, return the existing value or empty array
            return siblingData?.scopes || []
          },
        ],
      },
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
