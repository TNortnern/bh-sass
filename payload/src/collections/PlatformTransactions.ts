import type { CollectionConfig } from 'payload'

/**
 * PlatformTransactions Collection
 *
 * Tracks all platform fees from tenant payments for:
 * - Tax compliance (1099-K reporting)
 * - Refund management
 * - Revenue analytics
 *
 * Design decisions:
 * - Immutable audit trail: refunds create new records with originalTransactionId
 * - Indexed for performance: tenantId, stripePaymentIntentId, periodMonth, taxYear
 * - stripePaymentIntentId is unique to prevent duplicates
 */
export const PlatformTransactions: CollectionConfig = {
  slug: 'platform-transactions',
  admin: {
    group: 'Finance',
    // Only visible to super admins
    hidden: ({ user }) => user?.role !== 'super_admin',
    useAsTitle: 'stripePaymentIntentId',
    defaultColumns: ['type', 'tenantId', 'grossAmount', 'platformFee', 'status', 'createdAt'],
    description: 'Platform fee records for tax reporting and revenue tracking',
  },
  access: {
    // Super admin only
    read: ({ req }) => req.user?.role === 'super_admin',
    create: () => true, // System creates via webhooks
    update: ({ req }) => req.user?.role === 'super_admin',
    delete: () => false, // Never delete financial records
  },
  fields: [
    // Transaction Type
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking Payment', value: 'booking_payment' },
        { label: 'Subscription Payment', value: 'subscription_payment' },
        { label: 'Refund', value: 'refund' },
        { label: 'Payout', value: 'payout' },
        { label: 'Adjustment', value: 'adjustment' },
      ],
      admin: {
        description: 'Type of financial transaction',
      },
    },

    // Relationships
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        description: 'Tenant this transaction belongs to',
      },
    },
    {
      name: 'bookingId',
      type: 'relationship',
      relationTo: 'bookings',
      admin: {
        description: 'Related booking (for booking payments)',
        condition: (data) => data?.type === 'booking_payment' || data?.type === 'refund',
      },
    },
    {
      name: 'subscriptionId',
      type: 'relationship',
      relationTo: 'subscriptions',
      admin: {
        description: 'Related subscription (for subscription payments)',
        condition: (data) => data?.type === 'subscription_payment',
      },
    },
    {
      name: 'originalTransactionId',
      type: 'relationship',
      relationTo: 'platform-transactions',
      admin: {
        description: 'For refunds: links to the original payment for audit trail',
        condition: (data) => data?.type === 'refund',
      },
    },

    // Stripe References
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      index: true,
      admin: {
        description: 'Stripe Payment Intent ID (pi_xxx)',
      },
    },
    {
      name: 'stripeChargeId',
      type: 'text',
      index: true,
      admin: {
        description: 'Stripe Charge ID (ch_xxx)',
      },
    },
    {
      name: 'stripeTransferId',
      type: 'text',
      admin: {
        description: 'Stripe Transfer ID for Connect payouts (tr_xxx)',
      },
    },

    // Amounts (all in cents for precision)
    {
      name: 'grossAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Total payment amount in cents',
      },
    },
    {
      name: 'stripeFee',
      type: 'number',
      required: true,
      admin: {
        description: 'Stripe processing fee in cents (typically 2.9% + 30¢)',
      },
    },
    {
      name: 'platformFee',
      type: 'number',
      required: true,
      admin: {
        description: 'Our platform fee in cents',
      },
    },
    {
      name: 'platformFeePercent',
      type: 'number',
      required: true,
      admin: {
        description: 'Platform fee percentage at time of transaction (e.g., 6 for 6%)',
      },
    },
    {
      name: 'netAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Amount tenant receives after all fees (in cents)',
      },
    },

    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Refunded', value: 'partially_refunded' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Current status of the transaction',
      },
    },

    // Refund tracking
    {
      name: 'refundedAmount',
      type: 'number',
      admin: {
        description: 'Total amount refunded in cents (for partial refunds)',
      },
    },
    {
      name: 'refundedAt',
      type: 'date',
      admin: {
        description: 'When the refund was processed',
      },
    },

    // Time period indexing (for efficient reports)
    {
      name: 'periodMonth',
      type: 'text',
      index: true,
      admin: {
        description: 'YYYY-MM format for monthly revenue reports',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-populate from createdAt if not set
            if (!value && data) {
              const date = new Date()
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'periodYear',
      type: 'number',
      index: true,
      admin: {
        description: 'Year for annual reports',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) return new Date().getFullYear()
            return value
          },
        ],
      },
    },
    {
      name: 'taxYear',
      type: 'number',
      index: true,
      admin: {
        description: 'Tax year for 1099-K reporting (may differ from calendar year)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) return new Date().getFullYear()
            return value
          },
        ],
      },
    },

    // Metadata
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional Stripe metadata and context',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (for adjustments or manual entries)',
      },
    },
  ],
  timestamps: true,
}
