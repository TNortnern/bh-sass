import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'totalBookings', 'createdAt'],
    group: 'Rental Management',
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
      // Anyone can create customers (public bookings via widget)
      // API key users are also allowed
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
          async ({ req, data, operation, originalDoc }) => {
            // On update, preserve existing tenantId
            if (operation === 'update' && originalDoc?.tenantId) {
              return typeof originalDoc.tenantId === 'object'
                ? originalDoc.tenantId.id
                : originalDoc.tenantId
            }

            // Try authenticated user's tenant first
            if (req.user?.tenantId) {
              return getTenantId(req.user)
            }

            // Try API key context
            const context = await getAccessContext(req)
            if (context.tenantId) {
              return context.tenantId
            }

            // For public widget, extract from request body if provided
            // This allows widget to create customers with proper tenant scope
            if (data?.tenantId) {
              return typeof data.tenantId === 'object' ? data.tenantId.id : data.tenantId
            }

            // Fail loudly - customer creation requires tenant context
            throw new Error('Customer creation requires authenticated tenant context or tenantId in request')
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer phone number',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          admin: {
            description: 'ZIP/Postal code',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this customer',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Tags for customer segmentation (e.g., "VIP", "Regular", "Corporate")',
      },
    },
    {
      name: 'totalBookings',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of bookings',
        readOnly: true,
      },
    },
    // rb-payload sync fields
    {
      name: 'rbPayloadCustomerId',
      type: 'number',
      admin: {
        description: 'Customer ID in rb-payload booking system',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'syncStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Failed', value: 'failed' },
        { label: 'Out of Sync', value: 'out_of_sync' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Sync status with rb-payload',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Last successful sync timestamp',
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'syncError',
      type: 'text',
      admin: {
        description: 'Last sync error message',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      auditCreateAndUpdate,
      // Trigger customer webhooks
      async ({ doc, operation, req }) => {
        const { queueWebhook } = await import('../lib/webhooks')
        const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId

        setImmediate(async () => {
          try {
            if (operation === 'create') {
              await queueWebhook(req.payload, tenantId, 'customer.created', doc)
            } else if (operation === 'update') {
              await queueWebhook(req.payload, tenantId, 'customer.updated', doc)
            }
          } catch (error) {
            req.payload.logger.error(`Failed to queue customer webhooks: ${error.message}`)
          }
        })
      },
      // Sync customer to rb-payload (background, non-blocking)
      async ({ doc, req }) => {
        const { queueCustomerSync } = await import('../lib/customer-sync')

        // Extract tenantId properly (handles both object and scalar)
        const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId

        // Transform to expected customer format
        const customer = {
          id: doc.id,
          tenantId, // Include tenantId for proper scoping
          firstName: doc.name?.split(' ')[0] || '',
          lastName: doc.name?.split(' ').slice(1).join(' ') || '',
          email: doc.email,
          phone: doc.phone,
          address: doc.address,
          notes: doc.notes,
          tags: doc.tags?.map((t: { tag: string }) => t.tag) || [],
          rbPayloadCustomerId: doc.rbPayloadCustomerId,
          syncStatus: doc.syncStatus,
          lastSyncedAt: doc.lastSyncedAt,
          syncError: doc.syncError,
        }

        queueCustomerSync(req.payload, customer)
      },
    ],
    afterDelete: [auditDelete],
  },
}
