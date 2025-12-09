/**
 * Documents Collection
 *
 * Stores document templates (terms, waivers, contracts, policies)
 * that can be used across the tenant's website. Supports merge fields
 * for dynamic content replacement.
 *
 * Merge Fields Available:
 * - {{business.name}} - Tenant business name
 * - {{business.phone}} - Business phone
 * - {{business.email}} - Business email
 * - {{business.address}} - Full address
 * - {{customer.name}} - Customer full name
 * - {{customer.email}} - Customer email
 * - {{customer.phone}} - Customer phone
 * - {{booking.number}} - Booking reference number
 * - {{booking.date}} - Event date
 * - {{booking.items}} - List of booked items
 * - {{booking.total}} - Total price
 * - {{today.date}} - Current date
 * - {{today.time}} - Current time
 */

import type { CollectionConfig, Access } from 'payload'

// Access control - tenants can only see their own documents
const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  // Super admins see all
  if (user.role === 'super_admin') return true

  // Business owners see their tenant's documents
  if (user.tenantId) {
    return {
      tenantId: { equals: user.tenantId },
    }
  }

  return false
}

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'isDefault', 'version', 'updatedAt'],
    group: 'Website',
    description: 'Document templates for terms, waivers, and contracts',
  },
  access: {
    read: tenantAccess,
    create: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for this document',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Terms & Conditions', value: 'terms' },
        { label: 'Liability Waiver', value: 'waiver' },
        { label: 'Rental Contract', value: 'contract' },
        { label: 'Policy Document', value: 'policy' },
      ],
      defaultValue: 'terms',
      admin: {
        description: 'The type of document',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Document content. Use merge fields like {{customer.name}} for dynamic content.',
      },
    },
    {
      name: 'requiresSignature',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, customers must provide a signature',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use this as the default document for its type',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this document is currently in use',
      },
    },
    {
      name: 'version',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Document version number',
        readOnly: true,
      },
    },
    {
      name: 'effectiveDate',
      type: 'date',
      admin: {
        description: 'When this version becomes effective',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'The tenant this document belongs to',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Auto-increment version on update
      async ({ operation, data, originalDoc }) => {
        if (operation === 'update' && originalDoc?.content !== data?.content) {
          data.version = (originalDoc?.version || 0) + 1
        }
        return data
      },
    ],
    afterChange: [
      // If setting as default, unset other defaults of same type
      async ({ doc, operation, req }) => {
        if (doc.isDefault && (operation === 'create' || operation === 'update')) {
          const payload = req.payload
          await payload.update({
            collection: 'documents',
            where: {
              and: [
                { tenantId: { equals: doc.tenantId } },
                { type: { equals: doc.type } },
                { id: { not_equals: doc.id } },
                { isDefault: { equals: true } },
              ],
            },
            data: { isDefault: false },
          })
        }
        return doc
      },
    ],
  },
}

export default Documents
