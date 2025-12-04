import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'tenantId',
    defaultColumns: ['tenantId', 'plan', 'status', 'currentPeriodEnd', 'cancelAtPeriodEnd'],
    group: 'Subscription',
  },
  access: {
    create: ({ req: { user } }) => {
      // Only super admins can create subscriptions directly
      return user?.role === 'super_admin'
    },
    read: (({ req: { user } }) => {
      if (user?.role === 'super_admin') return true

      // Tenant admins can only read their own subscription
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
    }) as Access,
    update: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true

      // Tenant admins can update their own subscription (for cancellation)
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
    delete: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this subscription belongs to',
      },
    },
    {
      name: 'plan',
      type: 'relationship',
      relationTo: 'plans',
      required: true,
      admin: {
        description: 'Subscription plan',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Canceled',
          value: 'canceled',
        },
        {
          label: 'Past Due',
          value: 'past_due',
        },
        {
          label: 'Trialing',
          value: 'trialing',
        },
        {
          label: 'Incomplete',
          value: 'incomplete',
        },
        {
          label: 'Incomplete Expired',
          value: 'incomplete_expired',
        },
        {
          label: 'Unpaid',
          value: 'unpaid',
        },
      ],
      admin: {
        description: 'Subscription status',
      },
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stripe subscription ID',
        readOnly: true,
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        description: 'Stripe customer ID for the tenant',
        readOnly: true,
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'Stripe price ID for the subscription plan',
        readOnly: true,
      },
    },
    {
      name: 'currentPeriodStart',
      type: 'date',
      admin: {
        description: 'Current billing period start date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      admin: {
        description: 'Current billing period end date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Cancel subscription at end of current period',
      },
    },
    {
      name: 'canceledAt',
      type: 'date',
      admin: {
        description: 'Date when subscription was canceled',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'trialStart',
      type: 'date',
      admin: {
        description: 'Trial period start date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'trialEnd',
      type: 'date',
      admin: {
        description: 'Trial period end date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
}
