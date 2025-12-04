import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collection', 'userId', 'tenantId', 'timestamp'],
    group: 'System',
    description: 'Audit trail of all system actions',
  },
  access: {
    // Super admins can read all logs
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true

      // Business owners can only see their tenant's logs
      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }

      // Other users cannot access audit logs
      return false
    }) as Access,

    // Only system can create audit logs (no manual creation)
    create: () => true,

    // Audit logs are READ-ONLY - no updates allowed
    update: () => false,

    // Audit logs are READ-ONLY - no deletes allowed (except super admin)
    delete: ({ req: { user } }) => {
      return user?.role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Create',
          value: 'create',
        },
        {
          label: 'Update',
          value: 'update',
        },
        {
          label: 'Delete',
          value: 'delete',
        },
        {
          label: 'Login',
          value: 'login',
        },
        {
          label: 'Logout',
          value: 'logout',
        },
        {
          label: 'API Call',
          value: 'api_call',
        },
      ],
      admin: {
        description: 'Type of action performed',
      },
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      admin: {
        description: 'Collection name that was affected',
      },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the affected document',
      },
    },
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who performed the action',
      },
    },
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        description: 'Tenant context for this action',
      },
    },
    {
      name: 'changes',
      type: 'json',
      admin: {
        description: 'Before/after data for updates, full document for create/delete',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (IP address, user agent, etc.)',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When this action occurred',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  timestamps: true,
  // Sort by timestamp descending (newest first)
  defaultSort: '-timestamp',
}
