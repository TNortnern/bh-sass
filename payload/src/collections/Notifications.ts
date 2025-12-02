import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'user', 'read', 'createdAt'],
    group: 'Settings',
  },
  access: {
    read: (async ({ req }) => {
      // Super admin can read all
      if (req.user?.role === 'super_admin') return true

      // Check for API key or session auth
      const context = await getAccessContext(req)

      // For session auth: users can only read their own notifications or all tenant notifications
      if (context.authMethod === 'session' && req.user) {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false

        // Return notifications for this tenant that are either for this user or for all users
        return {
          and: [
            {
              tenantId: {
                equals: tenantId,
              },
            },
            {
              or: [
                {
                  user: {
                    equals: req.user.id,
                  },
                },
                {
                  user: {
                    exists: false,
                  },
                },
              ],
            },
          ],
        }
      }

      // API key auth: tenant-scoped
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    }) as Access,
    create: async ({ req }) => {
      // System and admins can create notifications
      if (req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin') return true

      // API key auth can create notifications
      const context = await getAccessContext(req)
      return context.authMethod === 'api_key'
    },
    update: (async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // Users can update their own notifications (to mark as read)
      if (context.authMethod === 'session' && req.user) {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false

        return {
          and: [
            {
              tenantId: {
                equals: tenantId,
              },
            },
            {
              user: {
                equals: req.user.id,
              },
            },
          ],
        }
      }

      // API key auth has full tenant access
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    }) as Access,
    delete: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      // Tenant admins can delete notifications
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
        description: 'The tenant this notification belongs to',
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User to notify (leave empty for all users in tenant)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Booking Created',
          value: 'booking_created',
        },
        {
          label: 'Booking Confirmed',
          value: 'booking_confirmed',
        },
        {
          label: 'Booking Cancelled',
          value: 'booking_cancelled',
        },
        {
          label: 'Payment Received',
          value: 'payment_received',
        },
        {
          label: 'Payment Failed',
          value: 'payment_failed',
        },
        {
          label: 'Reminder',
          value: 'reminder',
        },
        {
          label: 'System',
          value: 'system',
        },
      ],
      admin: {
        description: 'Type of notification',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Notification title',
      },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Notification message',
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Has this notification been read?',
      },
    },
    {
      name: 'data',
      type: 'json',
      admin: {
        description: 'Additional data (e.g., booking ID, payment amount)',
      },
    },
  ],
  timestamps: true,
}
