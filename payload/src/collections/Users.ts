import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'
import { sendUserWelcomeEmail } from '../hooks/email'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'tenantId', 'createdAt'],
    group: 'Multi-Tenancy',
  },
  auth: {
    // Configure cookie settings for auth persistence
    // In production (HTTPS), use secure cookies; in development (HTTP), allow insecure
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      domain: undefined,
    },
    // Token expiration: 7 days (in seconds)
    tokenExpiration: 7 * 24 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes in milliseconds
  },
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
    create: ({ req: { user }, data }) => {
      // Allow public registration for tenant_admin and customer roles
      if (!user) {
        // Unauthenticated users can only create tenant_admin or customer accounts
        return data?.role === 'tenant_admin' || data?.role === 'customer' || !data?.role
      }
      // Authenticated users: super admins and tenant admins can create users
      return user.role === 'super_admin' || user.role === 'tenant_admin'
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this user account is active',
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
  hooks: {
    beforeValidate: [
      // Check plan limits before creating new team members
      async ({ req, operation, data }) => {
        // Only check on create operations
        if (operation !== 'create') return

        // Skip for super_admins (they don't belong to a tenant)
        if (data?.role === 'super_admin') return

        // Skip for customers (they count differently than team members)
        if (data?.role === 'customer') return

        // Get tenant ID from data or current user
        const tenantId = data?.tenantId || getTenantId(req.user)
        if (!tenantId) return // No tenant to check limits for

        try {
          // Fetch the tenant to get their plan
          const tenant = await req.payload.findByID({
            collection: 'tenants',
            id: tenantId,
          })

          if (!tenant?.plan) return // No plan to check

          // Fetch the plan details
          const planResponse = await req.payload.find({
            collection: 'plans',
            where: { slug: { equals: tenant.plan } },
            limit: 1,
          })

          const plan = planResponse.docs[0]
          if (!plan?.limits?.maxUsers) return // No limit to enforce

          // Check if limit is unlimited (-1)
          if (plan.limits.maxUsers === -1) return

          // Count existing team members (exclude customers)
          const existingUsers = await req.payload.find({
            collection: 'users',
            where: {
              and: [
                { tenantId: { equals: tenantId } },
                { role: { not_equals: 'customer' } },
                { isActive: { equals: true } },
              ],
            },
            limit: 0, // Just get the count
          })

          // Check if at limit
          if (existingUsers.totalDocs >= plan.limits.maxUsers) {
            throw new Error(
              `Team member limit reached. Your ${plan.name} plan allows ${plan.limits.maxUsers} team ${plan.limits.maxUsers === 1 ? 'member' : 'members'}. Please upgrade your plan to add more team members.`
            )
          }
        } catch (error) {
          // Re-throw the error if it's our limit check error
          if (error instanceof Error && error.message.includes('limit reached')) {
            throw error
          }
          // Log other errors but don't block user creation
          req.payload.logger.error({ err: error, msg: 'Error checking user limits' })
        }
      },
    ],
    afterChange: [auditCreateAndUpdate, sendUserWelcomeEmail],
    afterDelete: [auditDelete],
  },
}
