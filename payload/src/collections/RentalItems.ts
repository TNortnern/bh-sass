import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'

export const RentalItems: CollectionConfig = {
  slug: 'rental-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'pricing', 'capacity', 'isActive'],
    group: 'Rental Management',
  },
  access: {
    // Tenant-scoped access with public widget support and API key auth
    read: (async ({ req }) => {
      // Super admin can read all
      if (req.user?.role === 'super_admin') return true

      // Check for API key or session auth
      const context = await getAccessContext(req)

      // Authenticated users (session or API key): filter by tenant
      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      // Public access (for booking widget): allow reading active items
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

      // API key auth can create items
      if (context.authMethod === 'api_key' && context.tenantId) return true

      // Session auth: tenant_admin and staff can create items for their tenant
      if (context.authMethod === 'session' && context.tenantId) {
        const role = req.user?.role
        if (role === 'tenant_admin' || role === 'staff' || role === 'manager') {
          return true
        }
      }

      return false
    },
    update: async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      // Both API key and session auth can update items within their tenant
      if (context.tenantId) {
        const role = req.user?.role
        // Allow tenant_admin, staff, and manager to update
        if (context.authMethod === 'api_key' ||
            role === 'tenant_admin' || role === 'staff' || role === 'manager') {
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
      admin: {
        description: 'The tenant this rental item belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            // Auto-assign tenant for users with a tenantId
            if (!value && req.user?.tenantId) {
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
        description: 'Rental item name (e.g., "Princess Castle Bounce House", "Water Slide Deluxe")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description of the rental item',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: false, // Made optional to allow categoryId to be used instead
      options: [
        { label: 'Bounce House', value: 'bounce_house' },
        { label: 'Water Slide', value: 'water_slide' },
        { label: 'Combo Unit', value: 'combo_unit' },
        { label: 'Obstacle Course', value: 'obstacle_course' },
        { label: 'Interactive Game', value: 'interactive_game' },
        { label: 'Tent/Canopy', value: 'tent_canopy' },
        { label: 'Table/Chair', value: 'table_chair' },
        { label: 'Concession', value: 'concession' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Legacy category field (use categoryId relationship instead)',
        condition: (data) => !data.categoryId, // Only show if no categoryId set
      },
    },
    {
      name: 'categoryId',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Category for this rental item (recommended over legacy category field)',
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Image URL (Bunny CDN or external)',
          },
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility',
          },
        },
      ],
      admin: {
        description: 'Product images (first image is primary). Upload via Bunny CDN.',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'hourlyRate',
          type: 'number',
          admin: {
            description: 'Hourly rental rate (optional)',
            step: 0.01,
          },
        },
        {
          name: 'dailyRate',
          type: 'number',
          required: true,
          admin: {
            description: 'Full day rental rate',
            step: 0.01,
          },
        },
        {
          name: 'weekendRate',
          type: 'number',
          admin: {
            description: 'Weekend rental rate (Friday-Sunday)',
            step: 0.01,
          },
        },
        {
          name: 'weeklyRate',
          type: 'number',
          admin: {
            description: 'Weekly rental rate (7 days)',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'dimensions',
      type: 'group',
      fields: [
        {
          name: 'length',
          type: 'number',
          admin: {
            description: 'Length in feet',
          },
        },
        {
          name: 'width',
          type: 'number',
          admin: {
            description: 'Width in feet',
          },
        },
        {
          name: 'height',
          type: 'number',
          admin: {
            description: 'Height in feet',
          },
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      admin: {
        description: 'Maximum number of people/children',
      },
    },
    {
      name: 'ageRange',
      type: 'group',
      fields: [
        {
          name: 'minAge',
          type: 'number',
          admin: {
            description: 'Minimum age',
          },
        },
        {
          name: 'maxAge',
          type: 'number',
          admin: {
            description: 'Maximum age',
          },
        },
      ],
    },
    {
      name: 'setupRequirements',
      type: 'group',
      fields: [
        {
          name: 'spaceRequired',
          type: 'text',
          admin: {
            description: 'Space requirements (e.g., "15x15 flat area")',
          },
        },
        {
          name: 'powerRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Requires electrical outlet',
          },
        },
        {
          name: 'waterRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Requires water hookup',
          },
        },
        {
          name: 'surfaceType',
          type: 'select',
          options: [
            { label: 'Grass', value: 'grass' },
            { label: 'Concrete', value: 'concrete' },
            { label: 'Asphalt', value: 'asphalt' },
            { label: 'Indoor', value: 'indoor' },
            { label: 'Any', value: 'any' },
          ],
          admin: {
            description: 'Suitable surface types',
          },
        },
        {
          name: 'setupNotes',
          type: 'textarea',
          admin: {
            description: 'Additional setup instructions',
          },
        },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Number of units available',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this item currently available for rental?',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this item on homepage',
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
        description: 'Tags for filtering (e.g., "outdoor", "princess theme", "wet")',
      },
    },
    // rb-payload sync fields
    {
      name: 'rbPayloadServiceId',
      type: 'number',
      index: true,
      admin: {
        description: 'ID of corresponding service in rb-payload (for 2-way sync)',
        position: 'sidebar',
      },
    },
    {
      name: 'syncStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Sync', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Sync Failed', value: 'failed' },
        { label: 'Out of Sync', value: 'out_of_sync' },
      ],
      admin: {
        description: 'Status of sync with rb-payload',
        position: 'sidebar',
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Last successful sync with rb-payload',
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
        position: 'sidebar',
        condition: (data) => data.syncStatus === 'failed',
      },
    },
    // Variation support
    {
      name: 'hasVariations',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Does this item have variations (size, color, theme, etc.)?',
        position: 'sidebar',
      },
    },
    {
      name: 'variationAttributes',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Attribute name (e.g., "Size", "Theme", "Color")',
          },
        },
        {
          name: 'values',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Available values for this attribute',
          },
        },
      ],
      admin: {
        description: 'Available variation attributes and their possible values',
        condition: (data) => data.hasVariations === true,
      },
    },
    // Maintenance tracking fields
    {
      name: 'lastMaintenanceDate',
      type: 'date',
      admin: {
        description: 'Date of last maintenance/inspection',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nextMaintenanceDate',
      type: 'date',
      admin: {
        description: 'Date when next maintenance is due',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'maintenanceStatus',
      type: 'select',
      defaultValue: 'up_to_date',
      options: [
        { label: 'Up to Date', value: 'up_to_date' },
        { label: 'Due Soon', value: 'due_soon' },
        { label: 'Overdue', value: 'overdue' },
      ],
      admin: {
        description: 'Current maintenance status',
        position: 'sidebar',
      },
    },
    {
      name: 'maintenanceNotes',
      type: 'textarea',
      admin: {
        description: 'General maintenance notes and history',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditCreateAndUpdate],
    afterDelete: [auditDelete],
  },
}
