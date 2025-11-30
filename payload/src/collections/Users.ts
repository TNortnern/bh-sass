import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'tenantId', 'createdAt'],
    group: 'Multi-Tenancy',
  },
  auth: true,
  access: {
    // Super admins can see all users, tenant admins can see their tenant's users
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.role === 'tenant_admin' || user.role === 'staff') {
        const tenantId = getTenantId(user)
        if (!tenantId) return { id: { equals: user.id } } // Fallback to own profile
        return { tenantId: { equals: tenantId } }
      }
      // Users can read their own profile
      return { id: { equals: user.id } }
    }) as Access,
    create: ({ req: { user } }) => {
      // Super admins and tenant admins can create users
      return user?.role === 'super_admin' || user?.role === 'tenant_admin'
    },
    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return { id: { equals: user.id } }
        return { tenantId: { equals: tenantId } }
      }
      // Users can update their own profile
      return { id: { equals: user.id } }
    }) as Access,
    delete: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true
      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return { tenantId: { equals: tenantId } }
      }
      return false
    }) as Access,
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      // Not required - super_admins don't belong to a tenant
      required: false,
      admin: {
        description: 'The tenant this user belongs to (not required for super admins)',
        // Hide for super_admins since they don't need a tenant
        condition: (data) => {
          return data?.role !== 'super_admin'
        },
      },
      hooks: {
        beforeValidate: [
          ({ req, value, data }) => {
            // Auto-assign tenant for tenant admins creating users
            if (!value && req.user?.role === 'tenant_admin') {
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
      // Custom validation: require tenantId for non-super_admin roles
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        if (data?.role !== 'super_admin' && !value) {
          return 'Tenant is required for non-super admin users'
        }
        return true
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        {
          label: 'Super Admin',
          value: 'super_admin',
        },
        {
          label: 'Tenant Admin',
          value: 'tenant_admin',
        },
        {
          label: 'Staff',
          value: 'staff',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
      admin: {
        description: 'User role and permissions level',
      },
      access: {
        // Only super admins can assign super_admin role
        update: ({ req: { user } }) => {
          return user?.role === 'super_admin'
        },
      },
    },
    {
      name: 'profile',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            description: 'Full name',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Phone number',
            placeholder: '+1 (555) 123-4567',
          },
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Profile picture',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
