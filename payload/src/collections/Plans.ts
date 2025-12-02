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
      ],
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
