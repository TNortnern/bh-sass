import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    useAsTitle: 'name',
    group: 'Settings',
    defaultColumns: ['name', 'templateKey', 'isCustomized', 'updatedAt'],
    description: 'Customize email templates for your business',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'super_admin') return true
      if (req.user?.tenantId) {
        return { tenantId: { equals: req.user.tenantId } }
      }
      return false
    },
    create: ({ req }) => {
      return req.user?.role === 'super_admin' || req.user?.role === 'tenant_admin'
    },
    update: ({ req }) => {
      if (req.user?.role === 'super_admin') return true
      if (req.user?.role === 'tenant_admin' && req.user?.tenantId) {
        return { tenantId: { equals: req.user.tenantId } }
      }
      return false
    },
    delete: ({ req }) => {
      if (req.user?.role === 'super_admin') return true
      if (req.user?.role === 'tenant_admin' && req.user?.tenantId) {
        return { tenantId: { equals: req.user.tenantId } }
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
        description: 'The tenant this template belongs to',
      },
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (!value && req.user && (req.user.role === 'tenant_admin' || req.user.role === 'staff')) {
              return getTenantId(req.user)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'templateKey',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking Confirmation', value: 'BOOKING_CONFIRMATION' },
        { label: 'Booking Reminder', value: 'BOOKING_REMINDER' },
        { label: 'Booking Cancelled', value: 'BOOKING_CANCELLED' },
        { label: 'Payment Received', value: 'PAYMENT_RECEIVED' },
        { label: 'Password Reset', value: 'PASSWORD_RESET' },
        { label: 'Welcome Email', value: 'WELCOME' },
      ],
      admin: {
        description: 'Which template type to customize',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this template',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Email subject line (supports variables like {{customerName}})',
      },
    },
    {
      name: 'htmlBody',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'HTML email body (supports variables like {{customerName}}, {{bookingId}}, etc.)',
      },
    },
    {
      name: 'textBody',
      type: 'textarea',
      admin: {
        description: 'Plain text version (optional, auto-generated from HTML if empty)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether to use this custom template instead of the default',
      },
    },
    {
      name: 'variables',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Available template variables (auto-populated based on template type)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-populate available variables based on template type
        const variablesByType: Record<string, string[]> = {
          BOOKING_CONFIRMATION: ['customerName', 'bookingId', 'itemName', 'eventDate', 'eventTime', 'location', 'totalAmount', 'bookingUrl'],
          BOOKING_REMINDER: ['customerName', 'itemName', 'eventDate', 'eventTime', 'location', 'bookingUrl'],
          BOOKING_CANCELLED: ['customerName', 'bookingId', 'itemName', 'eventDate', 'refundAmount'],
          PAYMENT_RECEIVED: ['customerName', 'paymentId', 'paymentDate', 'paymentMethod', 'bookingId', 'amount', 'remainingBalance', 'receiptUrl'],
          PASSWORD_RESET: ['userName', 'resetLink'],
          WELCOME: ['userName', 'userEmail', 'tenantName', 'planName', 'dashboardUrl'],
        }

        if (data?.templateKey) {
          data.variables = variablesByType[data.templateKey] || []
        }

        return data
      }
    ]
  },
  timestamps: true,
}
