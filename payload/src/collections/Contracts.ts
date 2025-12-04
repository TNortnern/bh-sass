import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Contracts: CollectionConfig = {
  slug: 'contracts',
  admin: {
    useAsTitle: 'contractNumber',
    defaultColumns: ['contractNumber', 'bookingId', 'customerId', 'type', 'status'],
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
      name: 'contractNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated contract number (e.g., CTR-2025-001)',
      },
      hooks: {
        beforeValidate: [
          async ({ req, value, data }) => {
            // Auto-generate contract number if not provided
            if (!value) {
              const year = new Date().getFullYear()
              // Get tenantId from data being created (for API calls) or from user (for admin)
              let tenantId = data?.tenantId
              if (typeof tenantId === 'object' && tenantId !== null) {
                tenantId = tenantId.id
              }
              if (!tenantId) {
                tenantId = getTenantId(req.user)
              }

              // Find the last contract number for this tenant
              const lastContract = await req.payload.find({
                collection: 'contracts',
                where: {
                  tenantId: {
                    equals: tenantId,
                  },
                  contractNumber: {
                    contains: `CTR-${year}`,
                  },
                },
                sort: '-contractNumber',
                limit: 1,
              })

              let nextNumber = 1
              if (lastContract.docs.length > 0) {
                const lastNumber = lastContract.docs[0].contractNumber
                const match = lastNumber.match(/CTR-\d{4}-(\d+)/)
                if (match) {
                  nextNumber = parseInt(match[1], 10) + 1
                }
              }

              return `CTR-${year}-${nextNumber.toString().padStart(3, '0')}`
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
        description: 'Customer signing this contract',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'rental-agreement',
      options: [
        {
          label: 'Rental Agreement',
          value: 'rental-agreement',
        },
        {
          label: 'Liability Waiver',
          value: 'liability-waiver',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Contract type',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Contract terms and conditions',
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
          label: 'Signed',
          value: 'signed',
        },
        {
          label: 'Void',
          value: 'void',
        },
      ],
      admin: {
        description: 'Contract status',
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        description: 'Date contract was sent to customer',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'signedAt',
      type: 'date',
      admin: {
        description: 'Date contract was signed',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'signatureUrl',
      type: 'text',
      admin: {
        description: 'URL to digital signature image',
      },
    },
    {
      name: 'signerName',
      type: 'text',
      admin: {
        description: 'Name of person who signed',
      },
    },
    {
      name: 'signerIP',
      type: 'text',
      admin: {
        description: 'IP address of signer (for verification)',
      },
    },
    {
      name: 'pdfUrl',
      type: 'text',
      admin: {
        description: 'URL to generated PDF document',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
