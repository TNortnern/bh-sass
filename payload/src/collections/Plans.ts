import type { Access, CollectionConfig } from 'payload'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'price', 'transactionFee', 'active'],
    group: 'Subscription',
  },
  access: {
    // Only super admins can manage plans
    create: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
    read: () => true, // Plans are publicly readable for signup pages
    update: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Plan name (e.g., "Free", "Pro", "Enterprise")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "free", "pro", "enterprise")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              // Auto-generate slug from name
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Monthly price in cents (e.g., 2900 for $29.00)',
        step: 1,
      },
    },
    {
      name: 'annualPrice',
      type: 'number',
      admin: {
        description: 'Annual price in cents (typically 20% discount, e.g., 27840 for $278.40/year = $23.20/mo)',
        step: 1,
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order to display plans (lower = first)',
      },
    },
    {
      name: 'transactionFee',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Transaction fee percentage (e.g., 6 for 6%)',
        step: 0.01,
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'List of features included in this plan',
      },
    },
    {
      name: 'limits',
      type: 'group',
      fields: [
        {
          name: 'maxItems',
          type: 'number',
          required: true,
          defaultValue: 10,
          admin: {
            description: 'Maximum number of rental items allowed',
          },
        },
        {
          name: 'maxBookings',
          type: 'number',
          required: true,
          defaultValue: 50,
          admin: {
            description: 'Maximum number of bookings per month',
          },
        },
        {
          name: 'maxUsers',
          type: 'number',
          required: true,
          defaultValue: 1,
          admin: {
            description: 'Maximum number of team members allowed',
          },
        },
      ],
    },
    {
      name: 'featureFlags',
      type: 'group',
      admin: {
        description: 'Feature toggles for this plan',
      },
      fields: [
        {
          name: 'websiteBuilder',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Access to website builder',
          },
        },
        {
          name: 'customRoles',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Access to custom roles and permissions',
          },
        },
        {
          name: 'customWebsite',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can request custom website development',
          },
        },
        {
          name: 'prioritySupport',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Access to priority support',
          },
        },
        {
          name: 'whiteLabel',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Remove BouncePro branding',
          },
        },
        {
          name: 'apiAccess',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Access to API keys and webhooks',
          },
        },
      ],
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        description: 'Stripe Monthly Price ID (e.g., price_xxx)',
        readOnly: false,
      },
    },
    {
      name: 'stripeAnnualPriceId',
      type: 'text',
      admin: {
        description: 'Stripe Annual Price ID (e.g., price_xxx)',
        readOnly: false,
      },
    },
    {
      name: 'highlighted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Highlight this plan on pricing page (recommended plan)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description shown on pricing page',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this plan available for new signups?',
      },
    },
  ],
  timestamps: true,
}
