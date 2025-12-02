import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

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
      ],
      admin: {
        description: 'Payment status',
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
      name: 'stripeChargeId',
      type: 'text',
      admin: {
        description: 'Stripe Charge ID',
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
}
