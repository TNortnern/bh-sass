import type { Access, CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

export const ContractTemplates: CollectionConfig = {
  slug: 'contract-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'templateType', 'isDefault', 'createdAt'],
    group: 'Documents',
    description: 'Reusable contract and document templates',
  },
  access: {
    read: (async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.tenantId) {
        return {
          or: [
            {
              tenantId: {
                equals: context.tenantId,
              },
            },
            {
              isDefault: {
                equals: true,
              },
            },
          ],
        }
      }

      return false
    }) as Access,
    create: (async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.authMethod && context.tenantId) return true

      return false
    }) as Access,
    update: (async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      // Tenant admin and staff can update their tenant's templates
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
    }) as Access,
    delete: (async ({ req }) => {
      if (req.user?.role === 'super_admin') return true

      const context = await getAccessContext(req)

      if (context.authMethod === 'api_key' && context.tenantId) {
        return {
          and: [
            {
              tenantId: {
                equals: context.tenantId,
              },
            },
            {
              isDefault: {
                not_equals: true,
              },
            },
          ],
        }
      }

      // Tenant admin and staff can delete their tenant's non-default templates
      if (req.user?.role === 'tenant_admin' || req.user?.role === 'staff') {
        const tenantId = getTenantId(req.user)
        if (!tenantId) return false
        return {
          and: [
            {
              tenantId: {
                equals: tenantId,
              },
            },
            {
              isDefault: {
                not_equals: true,
              },
            },
          ],
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
      admin: {
        description:
          'Leave empty for platform-wide default templates, or set to make it tenant-specific',
      },
      hooks: {
        beforeValidate: [
          ({ req, value, data }) => {
            // If it's a default template, don't set tenantId
            if (data?.isDefault) return null

            // Otherwise, auto-populate from user
            if (!value && req.user) {
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
        description: 'Template name (e.g., "Standard Rental Agreement")',
      },
    },
    {
      name: 'templateType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Rental Agreement',
          value: 'rental-agreement',
        },
        {
          label: 'Liability Waiver',
          value: 'liability-waiver',
        },
        {
          label: 'Damage Policy',
          value: 'damage-policy',
        },
        {
          label: 'Safety Rules',
          value: 'safety-rules',
        },
        {
          label: 'Weather Policy',
          value: 'weather-policy',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Type of contract template',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this template is for',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Template content. Use {{variableName}} for dynamic fields like {{customerName}}, {{itemName}}, {{startDate}}, etc.',
      },
    },
    {
      name: 'variables',
      type: 'array',
      admin: {
        description: 'Available variables that can be used in the template (auto-populated)',
        readOnly: true,
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
      defaultValue: [
        { key: 'tenantName', description: 'Business name' },
        { key: 'tenantPhone', description: 'Business phone' },
        { key: 'tenantEmail', description: 'Business email' },
        { key: 'tenantAddress', description: 'Business address' },
        { key: 'customerName', description: 'Customer full name' },
        { key: 'customerPhone', description: 'Customer phone' },
        { key: 'customerEmail', description: 'Customer email' },
        { key: 'customerAddress', description: 'Customer address' },
        { key: 'itemName', description: 'Rental item name' },
        { key: 'itemCategory', description: 'Rental item category' },
        { key: 'startDate', description: 'Rental start date' },
        { key: 'endDate', description: 'Rental end date' },
        { key: 'deliveryAddress', description: 'Delivery address' },
        { key: 'totalPrice', description: 'Total rental price' },
        { key: 'depositPaid', description: 'Deposit amount paid' },
        { key: 'balanceDue', description: 'Balance due' },
        { key: 'currentDate', description: 'Current date' },
      ],
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Platform-wide default template (only super_admins can create/edit default templates)',
      },
      access: {
        create: ({ req }) => req.user?.role === 'super_admin',
        update: ({ req }) => req.user?.role === 'super_admin',
      },
    },
    {
      name: 'requiresSignature',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this contract requires customer signature',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active templates are available for use',
      },
    },
  ],
  timestamps: true,
}
