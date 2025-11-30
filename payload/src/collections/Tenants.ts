import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

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
          label: 'Pro',
          value: 'pro',
        },
        {
          label: 'Enterprise',
          value: 'enterprise',
        },
      ],
      admin: {
        description: 'Subscription plan tier',
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
}
