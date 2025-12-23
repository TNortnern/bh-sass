import type { CollectionConfig, Access } from 'payload'

/**
 * QuoteRequests Collection
 *
 * Handles customer quote requests for events where they need a custom price.
 * Workflow: PENDING → RESPONDED → CONVERTED (to booking) or DECLINED
 */
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'eventType', 'eventDate', 'status', 'createdAt'],
    group: 'Business',
    description: 'Customer quote requests for custom events',
  },
  access: {
    // Public can create quotes (for the widget)
    create: () => true,
    // Only authenticated users can read/update/delete
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.tenantId) {
        return { tenantId: { equals: user.tenantId } }
      }
      return false
    }) as Access,
    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.tenantId) {
        return { tenantId: { equals: user.tenantId } }
      }
      return false
    }) as Access,
    delete: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.tenantId) {
        return { tenantId: { equals: user.tenantId } }
      }
      return false
    }) as Access,
  },
  fields: [
    // Tenant relationship
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Tenant this quote belongs to',
      },
    },
    // Status tracking
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Responded', value: 'responded' },
        { label: 'Converted', value: 'converted' },
        { label: 'Declined', value: 'declined' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Customer Information
    {
      name: 'customerName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: {
        description: 'Customer phone number',
      },
    },
    // Event Details
    {
      name: 'eventType',
      type: 'text',
      required: true,
      admin: {
        description: 'Type of event (Birthday, Corporate, Wedding, etc.)',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date of the event',
        date: {
          displayFormat: 'MMMM d, yyyy',
        },
      },
    },
    {
      name: 'eventStartTime',
      type: 'text',
      defaultValue: '10:00',
      admin: {
        description: 'Event start time (HH:MM)',
      },
    },
    {
      name: 'eventEndTime',
      type: 'text',
      defaultValue: '16:00',
      admin: {
        description: 'Event end time (HH:MM)',
      },
    },
    {
      name: 'guestCount',
      type: 'number',
      min: 1,
      admin: {
        description: 'Expected number of guests',
      },
    },
    {
      name: 'venueType',
      type: 'select',
      defaultValue: 'outdoor',
      options: [
        { label: 'Indoor', value: 'indoor' },
        { label: 'Outdoor', value: 'outdoor' },
      ],
      admin: {
        description: 'Indoor or outdoor venue',
      },
    },
    {
      name: 'ageRange',
      type: 'text',
      admin: {
        description: 'Age range of guests (e.g., "5-12 years")',
      },
    },
    // Fulfillment
    {
      name: 'fulfillmentType',
      type: 'select',
      defaultValue: 'delivery',
      options: [
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pickup', value: 'pickup' },
      ],
      admin: {
        description: 'How the equipment will be obtained',
      },
    },
    {
      name: 'deliveryAddress',
      type: 'textarea',
      admin: {
        description: 'Delivery address (if delivery selected)',
        condition: (data) => data.fulfillmentType === 'delivery',
      },
    },
    // What they want
    {
      name: 'budgetRange',
      type: 'text',
      admin: {
        description: 'Customer\'s budget range (e.g., "$200-$400")',
      },
    },
    {
      name: 'productsRequested',
      type: 'json',
      admin: {
        description: 'Array of products/items requested (JSON)',
      },
    },
    {
      name: 'additionalServices',
      type: 'json',
      admin: {
        description: 'Additional services requested (setup, generators, etc.)',
      },
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      admin: {
        description: 'Special requests or notes from customer',
      },
    },
    // Media attachments
    {
      name: 'attachments',
      type: 'json',
      admin: {
        description: 'File attachments (images, documents)',
      },
    },
    // Admin response
    {
      name: 'response',
      type: 'group',
      admin: {
        description: 'Admin response to the quote request',
        condition: (data) => data.status !== 'pending',
      },
      fields: [
        {
          name: 'totalAmount',
          type: 'number',
          admin: {
            description: 'Quoted total amount in cents',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          admin: {
            description: 'Message to customer',
          },
        },
        {
          name: 'validityDays',
          type: 'number',
          defaultValue: 30,
          admin: {
            description: 'Quote validity in days',
          },
        },
        {
          name: 'termsConditions',
          type: 'textarea',
          admin: {
            description: 'Terms and conditions for this quote',
          },
        },
        {
          name: 'respondedAt',
          type: 'date',
          admin: {
            description: 'When the response was sent',
            readOnly: true,
          },
        },
        {
          name: 'respondedBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'Staff member who responded',
            readOnly: true,
          },
        },
      ],
    },
    // Admin notes (internal)
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (not visible to customer)',
      },
    },
    // Conversion tracking
    {
      name: 'convertedBookingId',
      type: 'relationship',
      relationTo: 'bookings',
      admin: {
        description: 'Booking created from this quote',
        condition: (data) => data.status === 'converted',
        readOnly: true,
      },
    },
    // Source tracking
    {
      name: 'source',
      type: 'select',
      defaultValue: 'website',
      options: [
        { label: 'Website Widget', value: 'website' },
        { label: 'Phone Call', value: 'phone' },
        { label: 'Email', value: 'email' },
        { label: 'Walk-in', value: 'walkin' },
        { label: 'Referral', value: 'referral' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How this quote request came in',
      },
    },
    // Client IP for audit
    {
      name: 'clientIP',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'IP address of submitter',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      // Set respondedAt when status changes to responded
      async ({ data, originalDoc }) => {
        if (data.status === 'responded' && originalDoc?.status !== 'responded') {
          if (!data.response) {
            data.response = {}
          }
          data.response.respondedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
