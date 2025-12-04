import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const Availability: CollectionConfig = {
  slug: 'availability',
  admin: {
    useAsTitle: 'reason',
    defaultColumns: ['rentalItemId', 'reason', 'startDate', 'endDate', 'isActive'],
    group: 'Rental Management',
    description: 'Manage blackout dates and maintenance windows for rental items',
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

      // Public access: allow reading active blackouts
      return {
        isActive: {
          equals: true,
        },
      }
    }) as Access,
    create: (async ({ req }) => {
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create blackouts
      const context = await getAccessContext(req)
      return context.authMethod === 'api_key'
    }) as Access,
    update: (async ({ req }) => {
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
    }) as Access,
    delete: (async ({ req }) => {
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
    }) as Access,
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this availability rule belongs to',
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
      name: 'rentalItemId',
      type: 'relationship',
      relationTo: 'rental-items',
      required: true,
      admin: {
        description: 'The rental item this blackout applies to',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Blackout start date and time',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Blackout end date and time',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Repair', value: 'repair' },
        { label: 'Already Booked', value: 'booked' },
        { label: 'Seasonal Closure', value: 'seasonal' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Reason for unavailability',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this blackout period',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this blackout currently active?',
      },
    },
  ],
  timestamps: true,
}
