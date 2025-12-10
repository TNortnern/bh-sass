import type { CollectionConfig } from 'payload'

/**
 * StripeWebhookEvents Collection
 *
 * Stores processed Stripe webhook event IDs to prevent replay attacks
 * and duplicate event processing.
 *
 * Security features:
 * - Timestamp validation (reject events older than 5 minutes)
 * - Event ID deduplication (reject already-processed events)
 * - Auto-cleanup of old events (optional, can be done via cron)
 */
export const StripeWebhookEvents: CollectionConfig = {
  slug: 'stripe-webhook-events',
  admin: {
    useAsTitle: 'stripeEventId',
    defaultColumns: ['stripeEventId', 'eventType', 'processedAt', 'createdAt'],
    group: 'System',
    description: 'Processed Stripe webhook events for replay attack prevention',
    hidden: ({ user }) => user?.role !== 'super_admin',
  },
  access: {
    // Only super admins can view these logs
    read: ({ req }) => req.user?.role === 'super_admin',
    // System creates these automatically
    create: () => true,
    // No updates allowed
    update: () => false,
    // Only super admin can delete old events
    delete: ({ req }) => req.user?.role === 'super_admin',
  },
  fields: [
    {
      name: 'stripeEventId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique Stripe event ID (evt_xxx)',
        readOnly: true,
      },
    },
    {
      name: 'eventType',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Stripe event type (e.g., checkout.session.completed)',
        readOnly: true,
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When this event was successfully processed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'eventCreatedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When Stripe created this event (used for timestamp validation)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Optional metadata about the event processing',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  // Optional: Add TTL index to auto-delete events older than 30 days
  // This would require a custom database migration or cron job
}
