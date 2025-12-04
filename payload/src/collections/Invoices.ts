import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'bookingId', 'customerId', 'totalAmount', 'status'],
    group: 'Documents',
  },
  access: {
    read: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

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
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // Only authenticated users can create invoices
      if (context.authMethod && context.tenantId) return true

      return false
    },
    update: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

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

      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

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
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated invoice number (e.g., INV-2025-001)',
      },
      hooks: {
        beforeValidate: [
          async ({ req, value }) => {
            // Auto-generate invoice number if not provided
            if (!value) {
              const year = new Date().getFullYear()
              const tenantId = getTenantId(req.user)

              // Find the last invoice number for this tenant
              const lastInvoice = await req.payload.find({
                collection: 'invoices',
                where: {
                  tenantId: {
                    equals: tenantId,
                  },
                  invoiceNumber: {
                    contains: `INV-${year}`,
                  },
                },
                sort: '-invoiceNumber',
                limit: 1,
              })

              let nextNumber = 1
              if (lastInvoice.docs.length > 0) {
                const lastNumber = lastInvoice.docs[0].invoiceNumber
                const match = lastNumber.match(/INV-\d{4}-(\d+)/)
                if (match) {
                  nextNumber = parseInt(match[1], 10) + 1
                }
              }

              return `INV-${year}-${nextNumber.toString().padStart(3, '0')}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'bookingId',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
      admin: {
        description: 'Related booking',
      },
    },
    {
      name: 'customerId',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        description: 'Customer this invoice is for',
      },
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          admin: {
            description: 'Item description',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          min: 1,
          admin: {
            description: 'Quantity',
            step: 1,
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per unit',
            step: 0.01,
          },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          admin: {
            description: 'Line item total',
            step: 0.01,
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }) => {
                const quantity = siblingData.quantity || 1
                const unitPrice = siblingData.unitPrice || 0
                return quantity * unitPrice
              },
            ],
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Subtotal before tax and discounts',
        step: 0.01,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            const lineItems = siblingData.lineItems || data?.lineItems || []
            return lineItems.reduce((sum: number, item: any) => {
              const quantity = item.quantity || 1
              const unitPrice = item.unitPrice || 0
              return sum + quantity * unitPrice
            }, 0)
          },
        ],
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Tax amount',
        step: 0.01,
      },
    },
    {
      name: 'discountAmount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Discount amount',
        step: 0.01,
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        description: 'Total amount',
        step: 0.01,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            const subtotal = siblingData.subtotal || data?.subtotal || 0
            const taxAmount = siblingData.taxAmount || data?.taxAmount || 0
            const discountAmount = siblingData.discountAmount || data?.discountAmount || 0
            return subtotal + taxAmount - discountAmount
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Sent',
          value: 'sent',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Void',
          value: 'void',
        },
      ],
      admin: {
        description: 'Invoice status',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        description: 'Payment due date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        description: 'Date payment was received',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'pdfUrl',
      type: 'text',
      admin: {
        description: 'URL to generated PDF document',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes or payment terms',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
