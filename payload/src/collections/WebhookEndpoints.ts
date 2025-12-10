import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { generateWebhookSecret } from '../lib/webhooks'

export const WebhookEndpoints: CollectionConfig = {
  slug: 'webhook-endpoints',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'events', 'isActive', 'lastDeliveryAt'],
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
        description: 'Friendly name for this webhook endpoint',
        placeholder: 'Zapier Integration',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Webhook endpoint URL (must be HTTPS)',
        placeholder: 'https://example.com/webhooks/bouncepro',
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') return 'URL is required'
        if (!value.startsWith('https://')) {
          return 'Webhook URLs must use HTTPS for security'
        }
        try {
          new URL(value)
          return true
        } catch {
          return 'Invalid URL format'
        }
      },
    },
    {
      name: 'secret',
      type: 'text',
      required: true,
      admin: {
        description: 'Webhook signing secret for verification (auto-generated)',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            // Only generate secret on create, not update
            if (operation === 'create' && !value) {
              return generateWebhookSecret()
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
              label: 'Booking Updated',
              value: 'booking.updated',
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
            {
              label: 'Customer Created',
              value: 'customer.created',
            },
            {
              label: 'Customer Updated',
              value: 'customer.updated',
            },
            {
              label: 'Inventory Low',
              value: 'inventory.low',
            },
            {
              label: 'Maintenance Due',
              value: 'maintenance.due',
            },
          ],
        },
      ],
      admin: {
        description: 'Events that will trigger this webhook',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable or disable this webhook endpoint',
      },
    },
    {
      name: 'lastDeliveryAt',
      type: 'date',
      admin: {
        description: 'Last time a webhook was delivered to this endpoint',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastDeliveryStatus',
      type: 'select',
      options: [
        {
          label: 'Success',
          value: 'success',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      admin: {
        description: 'Status of the last delivery attempt',
        readOnly: true,
      },
    },
    {
      name: 'failedDeliveriesCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of consecutive failed deliveries',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
