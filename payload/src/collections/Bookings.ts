import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'customerId',
    defaultColumns: ['customerId', 'rentalItemId', 'startDate', 'endDate', 'status', 'totalPrice'],
    group: 'Rental Management',
  },
  access: {
    read: async ({ req }) => {
      // Super admin has full access
      if (req.user?.role === 'super_admin') return true

      // Check for both session and API key auth
      const context = await getAccessContext(req)

      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    },
    create: async ({ req }) => {
      // Anyone can create bookings (public bookings via widget)
      // But API key users are scoped to their tenant
      const context = await getAccessContext(req)

      // If authenticated (session or API key), they can create
      if (context.authMethod) return true

      // Public access for widget bookings
      return true
    },
    update: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // API key auth has full tenant access
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      // Session auth - check roles
      if (req.user?.role === 'tenant_admin' || req.user?.role === 'staff') {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }
      return false
    },
    delete: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // API key auth has full tenant access
      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      // Session auth - only tenant_admin can delete
      if (req.user?.role === 'tenant_admin') {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (!value && req.user) {
              // Use getTenantId to handle populated tenantId objects
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'rentalItemId',
      type: 'relationship',
      relationTo: 'rental-items',
      required: true,
      admin: {
        description: 'The rental item being booked',
      },
    },
    {
      name: 'customerId',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        description: 'Customer who made the booking',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Rental start date and time',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Rental end date and time',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
          admin: {
            description: 'Delivery street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
          admin: {
            description: 'ZIP/Postal code',
          },
        },
        {
          name: 'specialInstructions',
          type: 'textarea',
          admin: {
            description: 'Special delivery/setup instructions',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Booking status',
      },
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      admin: {
        description: 'Total rental price',
        step: 0.01,
      },
    },
    {
      name: 'depositPaid',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Deposit amount paid',
        step: 0.01,
      },
    },
    {
      name: 'balanceDue',
      type: 'number',
      admin: {
        description: 'Remaining balance due',
        step: 0.01,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            // Calculate balance due
            const total = siblingData.totalPrice || data?.totalPrice || 0
            const deposit = siblingData.depositPaid || data?.depositPaid || 0
            return total - deposit
          },
        ],
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        {
          label: 'Unpaid',
          value: 'unpaid',
        },
        {
          label: 'Deposit Paid',
          value: 'deposit_paid',
        },
        {
          label: 'Paid in Full',
          value: 'paid_full',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Payment status',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Special instructions or notes',
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal staff notes (not visible to customer)',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      ({ doc, operation, req }) => {
        // Update customer totalBookings when a new booking is created
        // Run async without blocking the response
        if (operation === 'create' && doc.customerId) {
          const customerId = typeof doc.customerId === 'object' ? doc.customerId.id : doc.customerId

          // Fire and forget - don't await to avoid blocking
          setImmediate(async () => {
            try {
              const customer = await req.payload.findByID({
                collection: 'customers',
                id: customerId,
              })

              await req.payload.update({
                collection: 'customers',
                id: customerId,
                data: {
                  totalBookings: (customer.totalBookings || 0) + 1,
                },
              })
            } catch (error) {
              req.payload.logger.error('Failed to update customer totalBookings')
            }
          })
        }
      },
    ],
  },
}
