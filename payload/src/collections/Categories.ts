import type { Access, CollectionConfig } from 'payload'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'
import { getTenantId } from '../utilities/getTenantId'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sortOrder', 'isActive', 'itemCount'],
    group: 'Rental Management',
  },
  access: {
    // Public can read active categories (for booking widget)
    read: (async ({ req }) => {
      // Super admin can read all
      if (req.user?.role === 'super_admin') return true

      // Check for API key or session auth
      const context = await getAccessContext(req)

      // Authenticated users: filter by tenant
      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      // Public access: only active categories
      return {
        isActive: {
          equals: true,
        },
      }
    }) as Access,
    create: async ({ req }) => {
      // Super admin can create anything
      if (req.user?.role === 'super_admin') return true

      // Check for API key or session auth
      const context = await getAccessContext(req)

      // API key auth can create categories
      if (context.authMethod === 'api_key' && context.tenantId) return true

      // Session auth: tenant_admin, manager, and staff can create categories
      if (context.authMethod === 'session' && context.tenantId) {
        const role = req.user?.role
        if (role === 'tenant_admin' || role === 'manager' || role === 'staff') {
          return true
        }
      }

      return false
    },
    update: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // Both API key and session auth can update categories within their tenant
      if (context.tenantId) {
        const role = req.user?.role
        // Allow tenant_admin, manager, and staff to update
        if (
          context.authMethod === 'api_key' ||
          role === 'tenant_admin' ||
          role === 'manager' ||
          role === 'staff'
        ) {
          return {
            tenantId: {
              equals: context.tenantId,
            },
          }
        }
      }

      return false
    },
    delete: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // Only tenant_admin and API keys can delete
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
      admin: {
        description: 'The tenant this category belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req }) => {
            // Always use the authenticated user's tenant - never allow client-provided tenantId
            if (req.user?.tenantId) {
              return getTenantId(req.user)
            }
            return undefined
          },
        ],
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name (e.g., "Bounce Houses", "Water Slides")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req }) => {
            if (!value && data?.name) {
              // Auto-generate slug from name + tenantId for uniqueness
              const baseslug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')

              // Add tenant ID to ensure uniqueness across tenants
              const tenantId = data.tenantId || req.user?.tenantId
              return tenantId ? `${tenantId}-${baseslug}` : baseslug
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon name (e.g., "i-lucide-castle", "i-lucide-tent")',
        placeholder: 'i-lucide-castle',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category image (optional)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
        step: 1,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this category currently active?',
      },
    },
    {
      name: 'itemCount',
      type: 'number',
      admin: {
        description: 'Number of rental items in this category (computed)',
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          async ({ req, data }) => {
            // Count rental items in this category
            if (data.id) {
              try {
                const count = await req.payload.count({
                  collection: 'rental-items',
                  where: {
                    categoryId: {
                      equals: data.id,
                    },
                  },
                })
                return count.totalDocs
              } catch (error) {
                // If error, return 0
                return 0
              }
            }
            return 0
          },
        ],
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
