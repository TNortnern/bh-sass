import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'stripePaymentIntentId',
    defaultColumns: ['booking', 'amount', 'type', 'status', 'createdAt'],
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

      return false
    }) as Access,
    create: async ({ req }) => {
      // Anyone can create payments (webhook or public booking flow)
      // But will be scoped to tenant via hooks
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
      // Payments should rarely be deleted
      return req.user?.role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this payment belongs to',
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
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: {
        description: 'The booking this payment is for',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: {
        description: 'Payment amount in cents (e.g., 5000 for $50.00)',
        step: 1,
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      admin: {
        description: 'Currency code',
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
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Succeeded',
          value: 'succeeded',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
        {
          label: 'Partially Refunded',
          value: 'partially_refunded',
        },
      ],
      admin: {
        description: 'Payment status',
      },
    },
    {
      name: 'refundAmount',
      type: 'number',
      admin: {
        description: 'Amount refunded in cents (for partial refunds)',
        step: 1,
      },
    },
    {
      name: 'refundReason',
      type: 'textarea',
      admin: {
        description: 'Reason for refund',
      },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stripe Payment Intent ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      admin: {
        description: 'Stripe Checkout Session ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeChargeId',
      type: 'text',
      admin: {
        description: 'Stripe Charge ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeRefundId',
      type: 'text',
      admin: {
        description: 'Stripe Refund ID (if payment was refunded)',
        readOnly: true,
      },
    },
    {
      name: 'platformFee',
      type: 'number',
      admin: {
        description: 'Platform fee in cents (deducted from payment)',
        step: 1,
        readOnly: true,
      },
    },
    {
      name: 'netAmount',
      type: 'number',
      admin: {
        description: 'Net amount tenant receives in cents (after platform fee)',
        step: 1,
        readOnly: true,
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Deposit',
          value: 'deposit',
        },
        {
          label: 'Balance',
          value: 'balance',
        },
        {
          label: 'Full Payment',
          value: 'full',
        },
        {
          label: 'Refund',
          value: 'refund',
        },
      ],
      admin: {
        description: 'Type of payment',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional payment metadata',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      auditCreateAndUpdate,
      // Trigger payment webhooks
      async ({ doc, operation, previousDoc, req }) => {
        const { queueWebhook } = await import('../lib/webhooks')
        const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId

        setImmediate(async () => {
          try {
            // Trigger webhooks on status changes
            if (operation === 'update' && previousDoc.status !== doc.status) {
              if (doc.status === 'succeeded') {
                await queueWebhook(req.payload, tenantId, 'payment.succeeded', doc)
              } else if (doc.status === 'failed') {
                await queueWebhook(req.payload, tenantId, 'payment.failed', doc)
              } else if (doc.status === 'refunded') {
                await queueWebhook(req.payload, tenantId, 'payment.refunded', doc)
              }
            }
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            req.payload.logger.error(`Failed to queue payment webhooks: ${message}`)
          }
        })
      },
    ],
    afterDelete: [auditDelete],
  },
}
