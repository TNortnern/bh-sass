import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'plan', 'status', 'createdAt'],
    group: 'Multi-Tenancy',
  },
  access: {
    // Only super admins can create/read/update/delete tenants
    create: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
    read: (({ req: { user } }) => {
      // Allow public read for active tenants (needed for widget)
      // Sensitive fields are restricted via field-level access
      if (!user) {
        return {
          status: { equals: 'active' },
        }
      }
      if (user?.role === 'super_admin') return true
      // Tenant admins can only read their own tenant
      if (user?.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          id: {
            equals: tenantId,
          },
        }
      }
      return false
    }) as Access,
    update: ({ req: { user } }) => {
      if (user?.role === 'super_admin') return true
      // Tenant admins can update their own tenant
      if (user?.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          id: {
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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Business or organization name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., jump-for-joy-rentals)',
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
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Custom domain (e.g., rentals.jumpforjoy.com)',
        placeholder: 'rentals.example.com',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Company logo for branding',
      },
    },
    {
      name: 'plan',
      type: 'select',
      required: true,
      defaultValue: 'free',
      options: [
        {
          label: 'Free',
          value: 'free',
        },
        {
          label: 'Growth',
          value: 'growth',
        },
        {
          label: 'Pro',
          value: 'pro',
        },
        {
          label: 'Scale',
          value: 'scale',
        },
      ],
      admin: {
        description: 'Subscription plan tier',
      },
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Stripe Connect account ID',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'stripeAccountStatus',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Restricted',
          value: 'restricted',
        },
        {
          label: 'Disabled',
          value: 'disabled',
        },
      ],
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Stripe Connect account status',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Whether Stripe onboarding is complete',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'stripeChargesEnabled',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Whether the account can accept charges',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'stripePayoutsEnabled',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Whether the account can receive payouts',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      required: true,
      unique: true,
      access: {
        // Only admins can read the API key
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'API key for widget authentication',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate secure API key
              return `tk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
            }
            return value
          },
        ],
      },
    },
    // Business Contact Information
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Business phone number',
        placeholder: '(555) 123-4567',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Business email address',
        placeholder: 'hello@yourbusiness.com',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Business description for customers',
      },
    },
    {
      name: 'address',
      type: 'group',
      admin: {
        description: 'Business address',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: { placeholder: '123 Main Street' },
        },
        {
          name: 'city',
          type: 'text',
          admin: { placeholder: 'Austin' },
        },
        {
          name: 'state',
          type: 'text',
          admin: { placeholder: 'TX' },
        },
        {
          name: 'zip',
          type: 'text',
          admin: { placeholder: '78701' },
        },
      ],
    },
    {
      name: 'businessHours',
      type: 'group',
      admin: {
        description: 'Weekly business hours',
      },
      fields: [
        {
          name: 'monday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '09:00' },
            { name: 'close', type: 'text', defaultValue: '18:00' },
          ],
        },
        {
          name: 'tuesday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '09:00' },
            { name: 'close', type: 'text', defaultValue: '18:00' },
          ],
        },
        {
          name: 'wednesday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '09:00' },
            { name: 'close', type: 'text', defaultValue: '18:00' },
          ],
        },
        {
          name: 'thursday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '09:00' },
            { name: 'close', type: 'text', defaultValue: '18:00' },
          ],
        },
        {
          name: 'friday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '09:00' },
            { name: 'close', type: 'text', defaultValue: '20:00' },
          ],
        },
        {
          name: 'saturday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '08:00' },
            { name: 'close', type: 'text', defaultValue: '20:00' },
          ],
        },
        {
          name: 'sunday',
          type: 'group',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'open', type: 'text', defaultValue: '10:00' },
            { name: 'close', type: 'text', defaultValue: '16:00' },
          ],
        },
      ],
    },
    {
      name: 'serviceArea',
      type: 'group',
      admin: {
        description: 'Service delivery area',
      },
      fields: [
        {
          name: 'radius',
          type: 'number',
          defaultValue: 25,
          admin: { description: 'Service radius in miles/km' },
        },
        {
          name: 'unit',
          type: 'select',
          defaultValue: 'miles',
          options: [
            { label: 'Miles', value: 'miles' },
            { label: 'Kilometers', value: 'km' },
          ],
        },
        {
          name: 'zipCodes',
          type: 'array',
          admin: { description: 'Specific ZIP codes served' },
          fields: [
            {
              name: 'code',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'branding',
      type: 'group',
      admin: {
        description: 'Brand identity and theming',
      },
      fields: [
        {
          name: 'businessName',
          type: 'text',
          admin: {
            description: 'Business name for branding (overrides tenant name)',
          },
        },
        {
          name: 'tagline',
          type: 'text',
          admin: {
            description: 'Short tagline or slogan',
            placeholder: 'We bring the fun to your event!',
          },
        },
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#fbbf24',
          admin: {
            description: 'Primary brand color (hex)',
            placeholder: '#fbbf24',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#3b82f6',
          admin: {
            description: 'Secondary brand color (hex)',
            placeholder: '#3b82f6',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#10b981',
          admin: {
            description: 'Accent color for buttons and CTAs (hex)',
            placeholder: '#10b981',
          },
        },
        {
          name: 'emailHeaderBg',
          type: 'text',
          defaultValue: '#fbbf24',
          admin: {
            description: 'Email header background color (hex)',
          },
        },
        {
          name: 'emailButtonColor',
          type: 'text',
          defaultValue: '#10b981',
          admin: {
            description: 'Email button color (hex)',
          },
        },
        {
          name: 'emailFooter',
          type: 'textarea',
          admin: {
            description: 'Custom footer text for emails',
          },
        },
        {
          name: 'invoiceHeader',
          type: 'text',
          defaultValue: 'INVOICE',
          admin: {
            description: 'Invoice header text',
          },
        },
        {
          name: 'termsAndConditions',
          type: 'textarea',
          admin: {
            description: 'Terms & Conditions for contracts',
          },
        },
        {
          name: 'safetyGuidelines',
          type: 'textarea',
          admin: {
            description: 'Safety guidelines for rental agreements',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'timezone',
          type: 'select',
          defaultValue: 'America/New_York',
          options: [
            { label: 'Eastern Time', value: 'America/New_York' },
            { label: 'Central Time', value: 'America/Chicago' },
            { label: 'Mountain Time', value: 'America/Denver' },
            { label: 'Pacific Time', value: 'America/Los_Angeles' },
            { label: 'UTC', value: 'UTC' },
          ],
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'US Dollar', value: 'USD' },
            { label: 'Euro', value: 'EUR' },
            { label: 'British Pound', value: 'GBP' },
            { label: 'Canadian Dollar', value: 'CAD' },
          ],
        },
        {
          name: 'locale',
          type: 'select',
          defaultValue: 'en-US',
          options: [
            { label: 'English (US)', value: 'en-US' },
            { label: 'English (UK)', value: 'en-GB' },
            { label: 'Spanish', value: 'es-ES' },
            { label: 'French', value: 'fr-FR' },
          ],
        },
        {
          name: 'bookingSettings',
          type: 'group',
          fields: [
            {
              name: 'leadTime',
              type: 'number',
              defaultValue: 24,
              admin: {
                description: 'Minimum hours in advance for bookings',
              },
            },
            {
              name: 'maxAdvanceBooking',
              type: 'number',
              defaultValue: 365,
              admin: {
                description: 'Maximum days in advance for bookings',
              },
            },
            {
              name: 'cancellationPolicy',
              type: 'textarea',
              admin: {
                description: 'Cancellation policy text shown to customers',
              },
            },
            {
              name: 'requireApproval',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Bookings require manual approval',
              },
            },
            {
              name: 'depositPercentage',
              type: 'number',
              defaultValue: 50,
              admin: {
                description: 'Required deposit percentage (0-100)',
                step: 1,
              },
            },
          ],
        },
        {
          name: 'deliverySettings',
          type: 'group',
          admin: {
            description: 'Delivery and setup settings',
          },
          fields: [
            {
              name: 'deliveryRadius',
              type: 'number',
              defaultValue: 25,
              admin: {
                description: 'Maximum delivery distance in miles',
              },
            },
            {
              name: 'baseDeliveryFee',
              type: 'number',
              defaultValue: 50,
              admin: {
                description: 'Base delivery fee',
                step: 0.01,
              },
            },
            {
              name: 'setupTime',
              type: 'number',
              defaultValue: 30,
              admin: {
                description: 'Average setup time in minutes',
              },
            },
            {
              name: 'pickupTime',
              type: 'number',
              defaultValue: 20,
              admin: {
                description: 'Average pickup time in minutes',
              },
            },
          ],
        },
      ],
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
          label: 'Suspended',
          value: 'suspended',
        },
        {
          label: 'Deleted',
          value: 'deleted',
        },
      ],
      admin: {
        description: 'Tenant account status',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
