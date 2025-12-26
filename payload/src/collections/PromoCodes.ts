import type { CollectionConfig } from 'payload'

export const PromoCodes: CollectionConfig = {
  slug: 'promo-codes',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'usageCount', 'maxUses', 'active'],
    group: 'Subscription',
  },
  access: {
    // Only super admins can manage promo codes
    create: ({ req: { user } }) => user?.role === 'super_admin',
    read: ({ req: { user } }) => user?.role === 'super_admin',
    update: ({ req: { user } }) => user?.role === 'super_admin',
    delete: ({ req: { user } }) => user?.role === 'super_admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Promo code customers will enter (e.g., LAUNCH20, HOLIDAY50)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            // Normalize to uppercase, remove spaces
            if (value) {
              return value.toUpperCase().replace(/\s+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Internal description for this promo code',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage Off', value: 'percentage' },
        { label: 'Fixed Amount Off', value: 'fixed' },
        { label: 'Free Trial Days', value: 'trial' },
        { label: 'First Month Free', value: 'first_month_free' },
      ],
      admin: {
        description: 'Type of discount to apply',
      },
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      admin: {
        description: 'Discount value (percentage 0-100, or cents for fixed, or days for trial)',
        step: 1,
      },
    },
    {
      name: 'duration',
      type: 'select',
      defaultValue: 'once',
      options: [
        { label: 'Once (first payment only)', value: 'once' },
        { label: 'Repeating (X months)', value: 'repeating' },
        { label: 'Forever', value: 'forever' },
      ],
      admin: {
        description: 'How long the discount applies',
        condition: (data) => data?.discountType === 'percentage' || data?.discountType === 'fixed',
      },
    },
    {
      name: 'durationMonths',
      type: 'number',
      admin: {
        description: 'Number of months discount applies (for repeating duration)',
        condition: (data) => data?.duration === 'repeating',
      },
    },
    {
      name: 'applicablePlans',
      type: 'relationship',
      relationTo: 'plans',
      hasMany: true,
      admin: {
        description: 'Leave empty to apply to all plans, or select specific plans',
      },
    },
    {
      name: 'minPlanPrice',
      type: 'number',
      admin: {
        description: 'Minimum plan price in cents (optional, e.g., 2900 for $29+)',
      },
    },
    {
      name: 'maxUses',
      type: 'number',
      admin: {
        description: 'Maximum total uses (leave empty for unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Current usage count (auto-updated)',
        readOnly: true,
      },
    },
    {
      name: 'maxUsesPerCustomer',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Maximum uses per customer (usually 1)',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'When promo code becomes active (optional)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'When promo code expires (optional)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'stripeCouponId',
      type: 'text',
      admin: {
        description: 'Stripe Coupon ID (auto-generated when synced)',
        readOnly: true,
      },
    },
    {
      name: 'stripePromotionCodeId',
      type: 'text',
      admin: {
        description: 'Stripe Promotion Code ID (auto-generated when synced)',
        readOnly: true,
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this promo code currently active?',
      },
    },
  ],
  timestamps: true,
}
