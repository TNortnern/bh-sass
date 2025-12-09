/**
 * SignedDocuments Collection
 *
 * Stores signed copies of documents with customer signatures.
 * Each signed document captures:
 * - The original document template
 * - The rendered content with merge fields replaced
 * - The signature (drawn or typed)
 * - Metadata for legal compliance (timestamp, IP, user agent)
 */

import type { CollectionConfig, Access } from 'payload'

// Access control - tenants can only see their own signed documents
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

export const SignedDocuments: CollectionConfig = {
  slug: 'signed-documents',
  admin: {
    useAsTitle: 'displayTitle',
    defaultColumns: ['displayTitle', 'documentType', 'signerName', 'signedAt', 'booking'],
    group: 'Website',
    description: 'Signed document records with customer signatures',
  },
  access: {
    read: tenantAccess,
    create: () => true, // Allow public submission
    update: tenantAccess,
    delete: tenantAccess,
  },
  fields: [
    {
      name: 'displayTitle',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.signerName} - ${siblingData.documentType || 'Document'}`
          },
        ],
      },
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
      admin: {
        description: 'The original document template',
      },
    },
    {
      name: 'documentType',
      type: 'select',
      options: [
        { label: 'Terms & Conditions', value: 'terms' },
        { label: 'Liability Waiver', value: 'waiver' },
        { label: 'Rental Contract', value: 'contract' },
        { label: 'Policy Document', value: 'policy' },
      ],
      admin: {
        description: 'Type of document signed',
      },
    },
    {
      name: 'documentVersion',
      type: 'number',
      admin: {
        description: 'Version of the document at time of signing',
        readOnly: true,
      },
    },
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      hasMany: false,
      admin: {
        description: 'Associated booking (if applicable)',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      hasMany: false,
      admin: {
        description: 'Customer who signed',
      },
    },
    // Signer Information
    {
      name: 'signerInfo',
      type: 'group',
      fields: [
        {
          name: 'signerName',
          type: 'text',
          required: true,
          admin: {
            description: 'Full legal name as entered by signer',
          },
        },
        {
          name: 'signerEmail',
          type: 'email',
          admin: {
            description: 'Email address of signer',
          },
        },
        {
          name: 'signerPhone',
          type: 'text',
          admin: {
            description: 'Phone number of signer',
          },
        },
      ],
    },
    // Signer name at root for display title
    {
      name: 'signerName',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Name that appears in the signature',
      },
    },
    // Signed Content (snapshot with merge fields replaced)
    {
      name: 'signedContent',
      type: 'richText',
      admin: {
        description: 'Snapshot of document content at time of signing with merge fields replaced',
        readOnly: true,
      },
    },
    // Signature Data
    {
      name: 'signature',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Drawn Signature', value: 'drawn' },
            { label: 'Typed Signature', value: 'typed' },
          ],
          required: true,
        },
        {
          name: 'data',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Base64 image data for drawn signatures, or text for typed',
          },
        },
        {
          name: 'fontFamily',
          type: 'text',
          admin: {
            description: 'Font used for typed signatures',
            condition: (data, siblingData) => siblingData?.type === 'typed',
          },
        },
      ],
    },
    // Legal Metadata
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'signedAt',
          type: 'date',
          required: true,
          admin: {
            description: 'Timestamp when document was signed',
            date: {
              pickerAppearance: 'dayAndTime',
            },
            readOnly: true,
          },
        },
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            description: 'IP address of signer',
            readOnly: true,
          },
        },
        {
          name: 'userAgent',
          type: 'textarea',
          admin: {
            description: 'Browser/device information',
            readOnly: true,
          },
        },
        {
          name: 'consentGiven',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Signer confirmed agreement to terms',
            readOnly: true,
          },
        },
      ],
    },
    // Shortcut to signedAt for admin columns
    {
      name: 'signedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Status
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Valid', value: 'valid' },
        { label: 'Superseded', value: 'superseded' },
        { label: 'Revoked', value: 'revoked' },
      ],
      defaultValue: 'valid',
      admin: {
        position: 'sidebar',
        description: 'Current status of this signed document',
      },
    },
    // Tenant
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'The tenant this signed document belongs to',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Set signedAt and capture document version
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          data.signedAt = new Date().toISOString()

          // Copy signedAt to metadata
          if (!data.metadata) data.metadata = {}
          data.metadata.signedAt = data.signedAt

          // Capture document version
          if (data.document && req.payload) {
            try {
              const doc = await req.payload.findByID({
                collection: 'documents',
                id: typeof data.document === 'string' ? data.document : data.document.id,
              })
              if (doc) {
                data.documentVersion = doc.version
                data.documentType = doc.type
              }
            } catch (e) {
              // Document might not be found, continue anyway
            }
          }
        }
        return data
      },
    ],
    afterChange: [
      // Mark previous signed documents of same type for same booking as superseded
      async ({ doc, operation, req }) => {
        if (operation === 'create' && doc.booking) {
          const payload = req.payload
          await payload.update({
            collection: 'signed-documents',
            where: {
              and: [
                { booking: { equals: doc.booking } },
                { documentType: { equals: doc.documentType } },
                { id: { not_equals: doc.id } },
                { status: { equals: 'valid' } },
              ],
            },
            data: { status: 'superseded' },
          })
        }
        return doc
      },
    ],
  },
}

export default SignedDocuments
