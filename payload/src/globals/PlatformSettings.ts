import type { GlobalConfig } from 'payload'

export const PlatformSettings: GlobalConfig = {
  slug: 'platform-settings',
  admin: {
    group: 'Platform',
    description: 'Global platform configuration and maintenance settings',
  },
  access: {
    // Only super admins can read/update platform settings
    read: ({ req: { user } }) => user?.role === 'super_admin',
    update: ({ req: { user } }) => user?.role === 'super_admin',
  },
  fields: [
    {
      name: 'maintenanceMode',
      type: 'group',
      admin: {
        description: 'Configure platform-wide maintenance mode',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable maintenance mode (blocks all non-admin users)',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          defaultValue:
            'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!',
          admin: {
            description: 'Message displayed to users during maintenance',
            condition: (data) => data.maintenanceMode?.enabled,
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Expected end time of maintenance (optional)',
            condition: (data) => data.maintenanceMode?.enabled,
          },
        },
        {
          name: 'allowedIPs',
          type: 'array',
          admin: {
            description: 'IP addresses allowed to access during maintenance (optional)',
            condition: (data) => data.maintenanceMode?.enabled,
          },
          fields: [
            {
              name: 'ip',
              type: 'text',
              required: true,
              admin: {
                placeholder: '192.168.1.1',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'platformAnnouncements',
      type: 'group',
      admin: {
        description: 'Platform-wide announcements and notifications',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show announcement banner to all users',
          },
        },
        {
          name: 'message',
          type: 'text',
          admin: {
            description: 'Announcement message',
            condition: (data) => data.platformAnnouncements?.enabled,
          },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'info',
          options: [
            { label: 'Info', value: 'info' },
            { label: 'Warning', value: 'warning' },
            { label: 'Success', value: 'success' },
            { label: 'Error', value: 'error' },
          ],
          admin: {
            description: 'Announcement type/color',
            condition: (data) => data.platformAnnouncements?.enabled,
          },
        },
      ],
    },
  ],
}
