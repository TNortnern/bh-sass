import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'tenantId', 'createdAt'],
    group: 'Multi-Tenancy',
  },
  access: {
    read: () => true, // Public read for all media
    create: ({ req: { user } }) => {
      // Anyone can upload (for public bookings), but tenantId will be auto-assigned
      return true
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      if (user?.role === 'tenant_admin' || user?.role === 'staff') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      if (user?.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
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
      admin: {
        description: 'Leave empty for platform-wide assets',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign tenant for tenant admins if not specified
            if (!value && req.user?.role === 'tenant_admin') {
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text for accessibility',
      },
    },
  ],
  upload: true,
  timestamps: true,
}
