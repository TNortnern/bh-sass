import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const WebhookEndpoints: CollectionConfig = {
  slug: 'webhook-endpoints',
  admin: {
    useAsTitle: 'url',
    defaultColumns: ['url', 'events', 'active'],
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

      // API key auth can create webhook endpoints
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
        description: 'The tenant this webhook endpoint belongs to',
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
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Webhook endpoint URL',
        placeholder: 'https://example.com/webhooks/bouncepro',
      },
    },
    {
      name: 'secret',
      type: 'text',
      required: true,
      admin: {
        description: 'Webhook signing secret for verification',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate secure webhook secret
              return `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'events',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'event',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Booking Created',
              value: 'booking.created',
            },
            {
              label: 'Booking Confirmed',
              value: 'booking.confirmed',
            },
            {
              label: 'Booking Cancelled',
              value: 'booking.cancelled',
            },
            {
              label: 'Booking Delivered',
              value: 'booking.delivered',
            },
            {
              label: 'Booking Completed',
              value: 'booking.completed',
            },
            {
              label: 'Payment Succeeded',
              value: 'payment.succeeded',
            },
            {
              label: 'Payment Failed',
              value: 'payment.failed',
            },
            {
              label: 'Payment Refunded',
              value: 'payment.refunded',
            },
          ],
        },
      ],
      admin: {
        description: 'Events to listen for',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this webhook endpoint active?',
      },
    },
  ],
  timestamps: true,
}
