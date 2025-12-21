import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

/**
 * Custom Roles Collection
 *
 * Allows Pro and Platinum tier tenants to create custom roles with granular permissions.
 * This enables flexible team management beyond the default roles (super_admin, tenant_admin, staff, customer).
 *
 * Permission Structure:
 * - Permissions use a "resource.action" pattern (e.g., "bookings.view", "inventory.edit")
 * - Roles are tenant-scoped (each tenant has their own custom roles)
 * - System roles (tenant_admin, staff) can serve as templates
 *
 * Plan Gating:
 * - Feature available for Pro and Platinum plans only
 * - Enforced via featureFlags.customRoles in Plans collection
 * - Frontend shows upgrade prompt for Free plan users
 *
 * See CUSTOM_ROLES_PLAN.md for full implementation details
 */

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tenantId', 'isSystemRole', 'createdAt'],
    group: 'Multi-Tenancy',
    description: 'Custom roles and permissions for team members (Pro/Platinum feature)',
  },
  access: {
    // Only tenant admins can manage custom roles for their tenant
    read: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true

      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }

      return false
    }) as Access,

    create: (({ req: { user } }) => {
      // Only tenant admins can create custom roles
      return user?.role === 'super_admin' || user?.role === 'tenant_admin'
    }) as Access,

    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true

      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
        }
      }

      return false
    }) as Access,

    delete: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super_admin') return true

      // Tenant admins can delete their custom roles (but not system roles)
      if (user.role === 'tenant_admin') {
        const tenantId = getTenantId(user)
        if (!tenantId) return false
        return {
          tenantId: {
            equals: tenantId,
          },
          isSystemRole: {
            equals: false, // Cannot delete system roles
          },
        }
      }

      return false
    }) as Access,
  },
  fields: [
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this custom role belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign tenant for tenant admins
            if (!value && req.user?.role === 'tenant_admin') {
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Role name (e.g., "Operations Manager", "Delivery Driver")',
        placeholder: 'Operations Manager',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of what this role is for',
        placeholder: 'Manages day-to-day operations and booking logistics',
      },
    },
    {
      name: 'isSystemRole',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'System roles are built-in templates that cannot be deleted',
        readOnly: true,
        position: 'sidebar',
      },
      access: {
        // Only super admins can create system roles
        update: ({ req: { user } }) => {
          return user?.role === 'super_admin'
        },
      },
    },
    {
      name: 'permissions',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Granular permissions granted to users with this role',
      },
      fields: [
        {
          name: 'key',
          type: 'select',
          required: true,
          options: [
            // Bookings permissions
            {
              label: 'Bookings - View',
              value: 'bookings.view',
            },
            {
              label: 'Bookings - Create',
              value: 'bookings.create',
            },
            {
              label: 'Bookings - Edit',
              value: 'bookings.edit',
            },
            {
              label: 'Bookings - Delete',
              value: 'bookings.delete',
            },
            {
              label: 'Bookings - Manage Payments',
              value: 'bookings.manage_payments',
            },

            // Inventory permissions
            {
              label: 'Inventory - View',
              value: 'inventory.view',
            },
            {
              label: 'Inventory - Create',
              value: 'inventory.create',
            },
            {
              label: 'Inventory - Edit',
              value: 'inventory.edit',
            },
            {
              label: 'Inventory - Delete',
              value: 'inventory.delete',
            },
            {
              label: 'Inventory - Manage Pricing',
              value: 'inventory.manage_pricing',
            },

            // Customers permissions
            {
              label: 'Customers - View',
              value: 'customers.view',
            },
            {
              label: 'Customers - Create',
              value: 'customers.create',
            },
            {
              label: 'Customers - Edit',
              value: 'customers.edit',
            },
            {
              label: 'Customers - Delete',
              value: 'customers.delete',
            },
            {
              label: 'Customers - Export',
              value: 'customers.export',
            },

            // Availability permissions
            {
              label: 'Availability - View',
              value: 'availability.view',
            },
            {
              label: 'Availability - Manage',
              value: 'availability.manage',
            },

            // Team permissions
            {
              label: 'Team - View',
              value: 'team.view',
            },
            {
              label: 'Team - Invite',
              value: 'team.invite',
            },
            {
              label: 'Team - Edit Roles',
              value: 'team.edit_roles',
            },
            {
              label: 'Team - Remove',
              value: 'team.remove',
            },

            // Reports permissions
            {
              label: 'Reports - View Revenue',
              value: 'reports.view_revenue',
            },
            {
              label: 'Reports - View Customers',
              value: 'reports.view_customers',
            },
            {
              label: 'Reports - Export',
              value: 'reports.export',
            },

            // Settings permissions
            {
              label: 'Settings - View',
              value: 'settings.view',
            },
            {
              label: 'Settings - Edit Branding',
              value: 'settings.edit_branding',
            },
            {
              label: 'Settings - Edit Booking',
              value: 'settings.edit_booking',
            },
            {
              label: 'Settings - Edit Integrations',
              value: 'settings.edit_integrations',
            },
            {
              label: 'Settings - Edit Payments',
              value: 'settings.edit_payments',
            },

            // Documents permissions
            {
              label: 'Documents - View',
              value: 'documents.view',
            },
            {
              label: 'Documents - Create',
              value: 'documents.create',
            },
            {
              label: 'Documents - Delete',
              value: 'documents.delete',
            },

            // Contracts permissions
            {
              label: 'Contracts - View',
              value: 'contracts.view',
            },
            {
              label: 'Contracts - Create',
              value: 'contracts.create',
            },
            {
              label: 'Contracts - Delete',
              value: 'contracts.delete',
            },
          ],
          admin: {
            description: 'Permission key following resource.action pattern',
          },
        },
      ],
      validate: (value: unknown) => {
        // Ensure permissions array is not empty
        if (!Array.isArray(value) || value.length === 0) {
          return 'At least one permission is required'
        }

        // Check for duplicate permissions
        const keys = value.map((p: any) => p.key)
        const uniqueKeys = new Set(keys)
        if (keys.length !== uniqueKeys.size) {
          return 'Duplicate permissions are not allowed'
        }

        return true
      },
    },
    {
      name: 'color',
      type: 'select',
      admin: {
        description: 'Color for role badge in UI',
      },
      options: [
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Purple',
          value: 'purple',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
        {
          label: 'Pink',
          value: 'pink',
        },
        {
          label: 'Indigo',
          value: 'indigo',
        },
        {
          label: 'Teal',
          value: 'teal',
        },
      ],
      defaultValue: 'blue',
    },
    {
      name: 'memberCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of users assigned to this role (auto-calculated)',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeValidate: [
      // Validate that the tenant has access to custom roles feature
      async ({ data, req, operation }) => {
        // Skip validation for super admins
        if (req.user?.role === 'super_admin') return data

        // For create/update operations, check plan feature flags
        if (operation === 'create' || operation === 'update') {
          const tenantId = data?.tenantId || getTenantId(req.user)

          if (!tenantId) {
            throw new Error('Tenant ID is required')
          }

          try {
            // Fetch the tenant
            const tenant = await req.payload.findByID({
              collection: 'tenants',
              id: tenantId,
            })

            if (!tenant) {
              throw new Error('Tenant not found')
            }

            // Check if tenant's plan allows custom roles
            const plan = await req.payload.findByID({
              collection: 'plans',
              id: tenant.plan,
            })

            if (!plan?.featureFlags?.customRoles) {
              throw new Error(
                'Custom roles are only available on Pro and Platinum plans. Please upgrade your plan to use this feature.'
              )
            }
          } catch (error: any) {
            req.payload.logger.error(`Custom role validation failed: ${error.message}`)
            throw error
          }
        }

        return data
      },
    ],
    beforeChange: [
      // Prevent modification of system roles by non-super admins
      async ({ data, req, originalDoc }) => {
        if (req.user?.role === 'super_admin') return data

        // Check if trying to modify a system role
        if (originalDoc?.isSystemRole) {
          throw new Error('System roles cannot be deleted or have their core properties modified')
        }

        return data
      },
    ],
  },
}
