import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'totalBookings', 'createdAt'],
    group: 'Rental Management',
  },
  access: {
    read: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    },
    create: async ({ req }) => {
      // Anyone can create customers (public bookings via widget)
      // API key users are also allowed
      return true
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
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (!value && req.user?.role === 'tenant_admin') {
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
        description: 'Customer full name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer phone number',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          admin: {
            description: 'ZIP/Postal code',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this customer',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Tags for customer segmentation (e.g., "VIP", "Regular", "Corporate")',
      },
    },
    {
      name: 'totalBookings',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of bookings',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
