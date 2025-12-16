import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'
import { provisionRbPayloadTenant, isRbPayloadProvisioningEnabled } from '../lib/rbPayloadProvisioning'

// Debug log only in development
if (process.env.NODE_ENV === 'development' && process.env.DEBUG_COLLECTIONS) {
  console.log('[TENANTS] Tenants collection module loaded')
}

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
        description: 'API key for widget authentication (BH-SaaS internal)',
        readOnly: true,
        position: 'sidebar',
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
    // rb-payload Integration Fields
    {
      name: 'rbPayloadTenantId',
      type: 'number',
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'Tenant ID in rb-payload booking engine',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'rbPayloadApiKey',
      type: 'text',
      access: {
        read: ({ req: { user } }) => {
          return user?.role === 'super_admin' || user?.role === 'tenant_admin'
        },
      },
      admin: {
        description: 'API key for rb-payload booking engine',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'rbPayloadSyncStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Provisioned', value: 'provisioned' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Status of rb-payload tenant provisioning',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'rbPayloadSyncError',
      type: 'textarea',
      admin: {
        description: 'Error message if rb-payload provisioning failed',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.rbPayloadSyncStatus === 'failed',
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
      name: 'website',
      type: 'group',
      admin: {
        description: 'Public website configuration',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Enable public website for this tenant' },
        },
        {
          name: 'templateId',
          type: 'select',
          defaultValue: 'classic',
          options: [
            { label: 'Classic', value: 'classic' },
            { label: 'Modern', value: 'modern' },
            { label: 'Bold', value: 'bold' },
            { label: 'Playful', value: 'playful' },
            { label: 'Elegant', value: 'elegant' },
          ],
          admin: {
            description: 'Website design template - choose the style that fits your brand',
          },
        },
        {
          name: 'heroTitle',
          type: 'text',
          admin: { description: 'Main headline on the website', placeholder: 'Book Your Party Equipment Today!' },
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          admin: { description: 'Subheadline text', placeholder: 'Premium bounce houses and party rentals for your next event' },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero background image' },
        },
        {
          name: 'aboutTitle',
          type: 'text',
          defaultValue: 'About Us',
          admin: { description: 'About section title' },
        },
        {
          name: 'aboutContent',
          type: 'textarea',
          admin: { description: 'About section content' },
        },
        {
          name: 'showServices',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show services/inventory section' },
        },
        {
          name: 'servicesTitle',
          type: 'text',
          defaultValue: 'Our Rentals',
          admin: { description: 'Services section title' },
        },
        {
          name: 'showTestimonials',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show testimonials section' },
        },
        {
          name: 'testimonials',
          type: 'array',
          admin: {
            description: 'Customer testimonials',
            condition: (data) => data.website?.showTestimonials,
          },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'content', type: 'textarea', required: true },
            { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
          ],
        },
        {
          name: 'showGallery',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show photo gallery section' },
        },
        {
          name: 'galleryImages',
          type: 'array',
          admin: {
            description: 'Gallery images',
            condition: (data) => data.website?.showGallery,
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true },
            { name: 'caption', type: 'text' },
          ],
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Book Now',
          admin: { description: 'Call-to-action button text' },
        },
        {
          name: 'seo',
          type: 'group',
          admin: { description: 'SEO settings' },
          fields: [
            { name: 'title', type: 'text', admin: { description: 'Page title (defaults to business name)' } },
            { name: 'description', type: 'textarea', admin: { description: 'Meta description for search engines' } },
            { name: 'keywords', type: 'text', admin: { description: 'Comma-separated keywords' } },
          ],
        },
      ],
    },
    {
      name: 'websiteBuilder',
      type: 'json',
      admin: {
        description: 'Website builder data (pages, sections, theme)',
        hidden: true, // Hidden from admin UI - managed by the builder
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
  hooks: {
    afterChange: [
      // Create default waiver template for new tenants (only on create, not update)
      async ({ doc, req, operation }: { doc: any; req: any; operation: 'create' | 'update' }) => {
        // Only run on create, not update
        if (operation !== 'create') return doc
        try {
          console.log(`Creating default waiver template for tenant "${doc.name}"...`)

          await req.payload.create({
            collection: 'contract-templates',
            data: {
              tenantId: doc.id,
              name: 'Equipment Rental Waiver & Agreement',
              templateType: 'liability-waiver',
              description: 'Standard liability waiver and rental agreement for equipment rentals. Covers safety rules, liability release, and rental terms.',
              isDefault: false, // Tenant can delete this
              requiresSignature: true,
              isActive: true,
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'heading',
                      tag: 'h1',
                      children: [{ type: 'text', text: 'EQUIPMENT RENTAL AGREEMENT & LIABILITY WAIVER' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'This Agreement is entered into between {{tenantName}} ("Company") and {{customerName}} ("Renter") on {{bookingDate}}.' }],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '1. RENTAL DETAILS' }],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        { type: 'text', text: 'Equipment: {{itemName}}', format: ['bold'] },
                        { type: 'linebreak' },
                        { type: 'text', text: 'Rental Period: {{startDate}} to {{endDate}}' },
                        { type: 'linebreak' },
                        { type: 'text', text: 'Delivery Address: {{deliveryAddress}}' },
                        { type: 'linebreak' },
                        { type: 'text', text: 'Total Amount: {{totalAmount}}' },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '2. ASSUMPTION OF RISK & RELEASE OF LIABILITY' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'I, {{customerName}}, acknowledge that the use of inflatable equipment and party rental items involves inherent risks, including but not limited to: physical injury, falls, collisions with other users, equipment malfunction, and other hazards.' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'I VOLUNTARILY ASSUME ALL RISKS associated with the use of the rented equipment. I hereby RELEASE, WAIVE, AND DISCHARGE {{tenantName}}, its owners, employees, agents, and representatives from any and all liability, claims, demands, and causes of action arising from any injury, loss, or damage to myself, my family members, guests, or property that may occur during the rental period.' }],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '3. SAFETY RULES & GUIDELINES' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'The Renter agrees to enforce the following safety rules at all times:' }],
                    },
                    {
                      type: 'list',
                      listType: 'bullet',
                      children: [
                        { type: 'listitem', children: [{ type: 'text', text: 'Adult supervision is REQUIRED at all times when equipment is in use' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'Remove shoes, eyeglasses, jewelry, and sharp objects before use' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'No food, drinks, gum, silly string, or water near equipment' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'No flips, wrestling, rough play, or climbing on walls' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'Separate users by age and size groups' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'Do not exceed maximum capacity as specified' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'Do not use in high winds (15+ mph), rain, or severe weather' }] },
                        { type: 'listitem', children: [{ type: 'text', text: 'Keep blower running at all times during use' }] },
                      ],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '4. DAMAGE & RESPONSIBILITY' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'The Renter is responsible for the equipment from delivery until pickup. The Renter agrees to pay for any damage, excessive cleaning, or loss of equipment caused by misuse, negligence, or failure to follow safety guidelines. A damage assessment will be conducted upon pickup.' }],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '5. WEATHER & CANCELLATION' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'Equipment must be deflated and secured in case of rain, high winds, or severe weather. The Company reserves the right to cancel or postpone rentals due to unsafe weather conditions. Cancellation policy: {{cancellationPolicy}}' }],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '6. INDEMNIFICATION' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'The Renter agrees to INDEMNIFY and HOLD HARMLESS {{tenantName}} from any claims, lawsuits, costs, and expenses (including attorney fees) arising from the rental, use, or misuse of the equipment by the Renter, their guests, or any third parties.' }],
                    },
                    {
                      type: 'heading',
                      tag: 'h2',
                      children: [{ type: 'text', text: '7. AGREEMENT' }],
                    },
                    {
                      type: 'paragraph',
                      children: [{ type: 'text', text: 'I have read this Agreement and Waiver in its entirety. I understand and agree to all terms and conditions. I confirm that I am at least 18 years of age and legally authorized to sign this agreement.' }],
                    },
                    {
                      type: 'paragraph',
                      children: [
                        { type: 'linebreak' },
                        { type: 'text', text: 'Renter Signature: _______________________  Date: {{signatureDate}}', format: ['bold'] },
                        { type: 'linebreak' },
                        { type: 'linebreak' },
                        { type: 'text', text: 'Printed Name: {{customerName}}', format: ['bold'] },
                        { type: 'linebreak' },
                        { type: 'text', text: 'Phone: {{customerPhone}}  Email: {{customerEmail}}', format: ['bold'] },
                      ],
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
            },
          })

          console.log(`✓ Created default waiver template for tenant "${doc.name}"`)
        } catch (error) {
          console.error(`Failed to create default waiver template for tenant "${doc.name}":`, error)
          // Don't fail tenant creation if template creation fails
        }

        return doc
      },
      // Provision rb-payload tenant (only on create, not update)
      async ({ doc, req, operation }: { doc: any; req: any; operation: 'create' | 'update' }) => {
        // Only run on create, not update
        if (operation !== 'create') return doc

        // Only provision if rb-payload is configured
        if (!isRbPayloadProvisioningEnabled()) {
          console.log('rb-payload provisioning skipped (not configured)')
          return doc
        }

        // Skip if already provisioned
        if (doc.rbPayloadTenantId) {
          console.log(`Tenant ${doc.id} already has rb-payload tenant ${doc.rbPayloadTenantId}`)
          return doc
        }

        console.log(`Auto-provisioning rb-payload tenant for "${doc.name}"...`)

        try {
          const result = await provisionRbPayloadTenant({
            id: doc.id,
            name: doc.name,
            slug: doc.slug,
            plan: doc.plan,
            settings: {
              timezone: doc.settings?.timezone,
              currency: doc.settings?.currency,
              locale: doc.settings?.locale,
              bookingSettings: {
                leadTime: doc.settings?.bookingSettings?.leadTime,
                cancellationPolicy: doc.settings?.bookingSettings?.cancellationPolicy,
                requireApproval: doc.settings?.bookingSettings?.requireApproval,
              },
            },
          })

          if (result.success && result.rbPayloadTenantId) {
            // Try to update the tenant with rb-payload data
            try {
              await req.payload.update({
                collection: 'tenants',
                id: doc.id,
                data: {
                  rbPayloadTenantId: result.rbPayloadTenantId,
                  rbPayloadApiKey: result.rbPayloadApiKey,
                  rbPayloadSyncStatus: 'provisioned',
                  rbPayloadSyncError: result.error || null, // Store warning if API key failed
                },
              })
              console.log(`✓ Successfully provisioned rb-payload tenant ${result.rbPayloadTenantId} for "${doc.name}"`)
            } catch (updateError) {
              console.error('Failed to update tenant with rb-payload data:', updateError)
            }
          } else {
            // Try to update status to failed, but don't fail if this also errors
            try {
              await req.payload.update({
                collection: 'tenants',
                id: doc.id,
                data: {
                  rbPayloadSyncStatus: 'failed',
                  rbPayloadSyncError: result.error || 'Unknown error during provisioning',
                },
              })
            } catch (updateError) {
              console.error('Failed to update tenant sync status:', updateError)
            }

            console.error(`✗ Failed to provision rb-payload tenant for "${doc.name}":`, result.error)
          }
        } catch (error) {
          console.error('Error in rb-payload provisioning hook:', error)

          // Try to update status to failed, but don't fail if this also errors
          try {
            await req.payload.update({
              collection: 'tenants',
              id: doc.id,
              data: {
                rbPayloadSyncStatus: 'failed',
                rbPayloadSyncError: error instanceof Error ? error.message : 'Unknown error',
              },
            })
          } catch (updateError) {
            console.error('Failed to update tenant sync status:', updateError)
            // Don't re-throw - we want the tenant creation to succeed
          }
        }

        return doc
      },
      auditCreateAndUpdate,
      // Sync business hours and timezone to rb-payload (background, non-blocking)
      async ({ doc, req, operation }) => {
        // Only sync on update (not create - handled by provisioning hook)
        if (operation !== 'update') return doc

        // Skip if tenant doesn't have rb-payload tenant ID
        if (!doc.rbPayloadTenantId) return doc

        const { queueBusinessHoursSync } = await import('../lib/business-hours-sync')

        // Transform tenant data to expected interface
        const businessHours: Array<{
          enabled: boolean
          dayOfWeek: string
          openTime: string
          closeTime: string
        }> = []

        // Convert businessHours group structure to array format
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        for (const day of daysOfWeek) {
          const dayHours = doc.businessHours?.[day as keyof typeof doc.businessHours]
          if (dayHours) {
            businessHours.push({
              enabled: (dayHours as any).enabled ?? true,
              dayOfWeek: day,
              openTime: (dayHours as any).open || '09:00',
              closeTime: (dayHours as any).close || '18:00',
            })
          }
        }

        const tenantSettings = {
          id: doc.id as number,
          rbPayloadTenantId: doc.rbPayloadTenantId,
          name: doc.name,
          settings: {
            timezone: doc.settings?.timezone,
            currency: doc.settings?.currency,
            locale: doc.settings?.locale,
            bookingSettings: {
              leadTime: doc.settings?.bookingSettings?.leadTime,
              maxAdvanceBooking: doc.settings?.bookingSettings?.maxAdvanceBooking,
              cancellationPolicy: doc.settings?.bookingSettings?.cancellationPolicy,
              requireApproval: doc.settings?.bookingSettings?.requireApproval,
            },
            businessHours,
          },
        }

        queueBusinessHoursSync(req.payload, tenantSettings)

        return doc
      },
    ],
    afterDelete: [auditDelete],
  },
}
