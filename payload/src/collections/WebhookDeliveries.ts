import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const WebhookDeliveries: CollectionConfig = {
  slug: 'webhook-deliveries',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['endpointId', 'event', 'status', 'attempts', 'deliveredAt', 'createdAt'],
    group: 'Settings',
    description: 'Webhook delivery logs and retry tracking',
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
      // Only system can create deliveries (via webhooks.ts)
      return req.user?.role === 'super_admin'
    },
    update: async ({ req }) => {
      // Only system can update deliveries
      return req.user?.role === 'super_admin'
    },
    delete: async ({ req }) => {
      // Only super admin can delete delivery logs
      return req.user?.role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'endpointId',
      type: 'relationship',
      relationTo: 'webhook-endpoints',
      required: true,
      admin: {
        description: 'The webhook endpoint this delivery was sent to',
      },
    },
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this delivery belongs to',
      },
    },
    {
      name: 'event',
      type: 'text',
      required: true,
      admin: {
        description: 'The event that triggered this webhook',
      },
    },
    {
      name: 'payload',
      type: 'json',
      required: true,
      admin: {
        description: 'The data that was sent in the webhook',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Retrying',
          value: 'retrying',
        },
      ],
      admin: {
        description: 'Current status of this delivery',
      },
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of delivery attempts',
      },
    },
    {
      name: 'maxAttempts',
      type: 'number',
      defaultValue: 5,
      admin: {
        description: 'Maximum number of retry attempts',
      },
    },
    {
      name: 'nextRetryAt',
      type: 'date',
      admin: {
        description: 'When to attempt the next retry',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'response',
      type: 'group',
      admin: {
        description: 'Response from the webhook endpoint',
      },
      fields: [
        {
          name: 'statusCode',
          type: 'number',
          admin: {
            description: 'HTTP status code',
          },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            description: 'Response body (truncated to 1000 chars)',
          },
        },
        {
          name: 'headers',
          type: 'json',
          admin: {
            description: 'Response headers',
          },
        },
      ],
    },
    {
      name: 'error',
      type: 'textarea',
      admin: {
        description: 'Error message if delivery failed',
      },
    },
    {
      name: 'deliveredAt',
      type: 'date',
      admin: {
        description: 'When the webhook was successfully delivered',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
