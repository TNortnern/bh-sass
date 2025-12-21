import type { Access, CollectionConfig, CollectionAfterChangeHook, CollectionBeforeValidateHook } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { auditCreateAndUpdate, auditDelete } from '../hooks/auditHooks'
import { syncRentalItemToRbPayload } from '../lib/inventory-sync'

/**
 * Generate a unique serial number for rental items
 * Format: RH-{TIMESTAMP}-{RANDOM}
 * Example: RH-1725000000000-A7B9K
 * This ensures uniqueness without needing database lookups
 */
const generateSerialNumber = (): string => {
  const timestamp = Date.now()
  // Generate 5 random alphanumeric characters for additional uniqueness
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let random = ''
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `RH-${timestamp}-${random}`
}

/**
 * Layer 3: Business Logic Validation Hook
 * Comprehensive validation of all required fields before database write
 * Prevents invalid data from reaching the database
 *
 * This hook runs on both create and update operations to prevent data corruption.
 * - On create: Validates all required fields exist and have valid values
 * - On update: Ensures updated values maintain data integrity (e.g., pricing can't become invalid)
 */
const validateRequiredFieldsHook: CollectionBeforeValidateHook = async ({ data, operation }) => {
  if (!data) return data

  // Validate name (required on create, validated on update if provided)
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new Error('Rental item name is required and must be a non-empty string')
    }
  } else if (operation === 'create') {
    throw new Error('Rental item name is required and must be a non-empty string')
  }

  // Validate pricing structure exists and has valid values
  if (data.pricing !== undefined) {
    if (!data.pricing) {
      throw new Error('Pricing information is required')
    }

    const dailyRate = data.pricing.dailyRate

    // Check if dailyRate is a valid positive number (rejects NaN, Infinity, negative, zero)
    if (dailyRate !== undefined) {
      if (typeof dailyRate !== 'number' || !Number.isFinite(dailyRate) || dailyRate <= 0) {
        throw new Error(`Daily rate is required and must be a valid positive number (received: ${String(dailyRate)})`)
      }
    } else if (operation === 'create') {
      throw new Error('Daily rate is required and must be a positive number')
    }
  } else if (operation === 'create') {
    throw new Error('Pricing information is required')
  }

  // Validation passed
  return data
}

/**
 * Hook to automatically sync rental items to rb-payload after create/update
 */
const syncToRbPayloadHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Skip if sync is disabled or item is not active
  if (!doc.isActive) {
    console.log(`[Inventory Sync] Skipping inactive item ${doc.id}`)
    return doc
  }

  // Skip if this is just a sync status update (prevents infinite loop)
  // Only check specific business fields that should trigger a resync
  if (operation === 'update' && previousDoc) {
    // Fields that, when changed, should trigger a resync to rb-payload
    const syncTriggerFields = [
      'name',
      'description',
      'category',
      'pricing',
      'dimensions',
      'capacity',
      'quantity',
      'isActive',
      'images',
    ]

    // Check if any sync-triggering field actually changed
    const needsResync = syncTriggerFields.some((key) => {
      const docValue = JSON.stringify(doc[key])
      const prevValue = JSON.stringify(previousDoc[key])
      return docValue !== prevValue
    })

    // If no business fields changed, skip syncing (this is just a status update)
    if (!needsResync) {
      console.log(`[Inventory Sync] Skipping item ${doc.id} - no sync-relevant fields changed`)
      return doc
    }
  }

  // Skip if already synced and has a service ID
  if (operation === 'update' && doc.syncStatus === 'synced' && doc.rbPayloadServiceId) {
    console.log(`[Inventory Sync] Item ${doc.id} already synced, will update rb-payload`)
  }

  // Run sync in background to not block the response
  setImmediate(async () => {
    try {
      await syncRentalItemToRbPayload(req.payload, doc)
    } catch (error) {
      console.error(`[Inventory Sync] Background sync failed for item ${doc.id}:`, error)
    }
  })

  return doc
}

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

      // Authenticated user without tenantId - deny access (shouldn't happen normally)
      if (req.user) {
        console.warn(`[RentalItems] User ${req.user.id} has no tenantId, denying access`)
        return false
      }

      // Public access (for booking widget ONLY): allow reading active items
      // This should only be used by unauthenticated widget requests
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
        if (role === 'tenant_admin' || role === 'staff') {
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
        // Allow tenant_admin and staff to update
        if (context.authMethod === 'api_key' ||
            role === 'tenant_admin' || role === 'staff') {
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
          ({ req, data, operation }) => {
            // Layer 3: Authorization - User must have associated tenant
            // This hook only runs on CREATE operations to auto-assign the tenant
            // On UPDATE operations, preserve the existing tenantId (don't auto-set)
            if (operation !== 'create') {
              // On update, return the provided tenantId if updating that field
              // If not updating tenantId field, return undefined (Payload will preserve existing value)
              return data?.tenantId
            }

            // On CREATE: Always use the authenticated user's tenant
            // Never allow client-provided tenantId (prevents data leakage across tenants)
            const tenantId = getTenantId(req.user)

            // If no user but tenantId is explicitly provided (seed script or system operation)
            // Allow it through - this enables database seeding
            if (!tenantId && data?.tenantId) {
              return data.tenantId
            }

            // If no user or no tenant associated, throw error
            if (!tenantId) {
              throw new Error('User must be associated with a tenant to create rental items')
            }

            // Override client-provided value with user's tenant
            // This prevents data leakage across tenants
            return tenantId
          },
        ],
      },
    },
    {
      name: 'serialNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated unique serial number for this rental item (e.g., RH-1725000000000-A7B9K)',
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            // Auto-generate serial number on create only
            // Never allow updating the serial number
            if (operation === 'create' && !data?.serialNumber) {
              return generateSerialNumber()
            }
            // On update, preserve the existing serial number
            return data?.serialNumber
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
    // Layer 3: Business logic validation before database write
    // Field-level tenantId hook already handles tenant authorization and assignment
    // This collection-level hook validates remaining required fields and data integrity
    beforeValidate: [validateRequiredFieldsHook],
    // Layer 4: Audit and sync hooks after successful database write
    afterChange: [auditCreateAndUpdate, syncToRbPayloadHook],
    afterDelete: [auditDelete],
  },
}
