/**
 * Email API Endpoints
 * - GET /api/email/preview/:name - Preview email template with sample data
 * - POST /api/email/send-test - Send test email
 */
import type { Endpoint } from 'payload'
import { emailService } from '../lib/email'
import { emailTemplates, type EmailTemplateName, type EmailTemplateVariant, interpolate } from '../lib/email/templates'

/**
 * Helper to get a specific variant from a template
 */
function getTemplateVariant(templateName: EmailTemplateName, variantId: string): EmailTemplateVariant | null {
  const template = emailTemplates[templateName]
  if (!template) return null

  // Find the requested variant or fall back to default
  const variant = template.variants.find(v => v.id === variantId)
  if (variant) return variant

  // Fall back to default variant
  const defaultVariant = template.variants.find(v => v.id === template.defaultVariant)
  return defaultVariant || template.variants[0] || null
}

/**
 * Sample data for email template previews
 */
const sampleData: Record<string, Record<string, any>> = {
  BOOKING_CONFIRMATION: {
    customerName: 'John Smith',
    bookingId: 'BK-2024-001',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Saturday, December 14, 2024',
    eventTime: '10:00 AM - 4:00 PM',
    location: '123 Party Lane, Austin, TX 78701',
    totalAmount: '299.00',
    bookingUrl: 'https://app.bouncepro.com/bookings/BK-2024-001',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  BOOKING_REMINDER: {
    customerName: 'John Smith',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Tomorrow, December 14, 2024',
    eventTime: '10:00 AM - 4:00 PM',
    location: '123 Party Lane, Austin, TX 78701',
    bookingUrl: 'https://app.bouncepro.com/bookings/BK-2024-001',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  BOOKING_CANCELLED: {
    customerName: 'John Smith',
    bookingId: 'BK-2024-001',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Saturday, December 14, 2024',
    refundAmount: '149.50',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  PAYMENT_RECEIVED: {
    customerName: 'John Smith',
    paymentId: 'PAY-2024-001',
    paymentDate: 'December 2, 2024',
    paymentMethod: 'Credit Card',
    bookingId: 'BK-2024-001',
    amount: '149.50',
    remainingBalance: '149.50',
    receiptUrl: 'https://app.bouncepro.com/receipts/PAY-2024-001',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  PASSWORD_RESET: {
    userName: 'John Smith',
    resetLink: 'https://app.bouncepro.com/auth/reset-password?token=abc123xyz',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  WELCOME: {
    userName: 'John Smith',
    userEmail: 'john@example.com',
    tenantName: 'Bounce Kingdom Party Rentals',
    planName: 'Growth Plan',
    dashboardUrl: 'https://app.bouncepro.com/app',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  TEAM_INVITE: {
    inviteeName: 'Sarah Johnson',
    inviterName: 'John Smith',
    businessName: 'Bounce Kingdom Party Rentals',
    role: 'Staff Manager',
    inviteLink: 'https://app.bouncepro.com/auth/accept-invite?token=abc123xyz',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  API_KEY_CREATED: {
    userName: 'John Smith',
    keyName: 'Production API Key',
    createdAt: 'December 2, 2024 at 3:45 PM',
    expiresAt: 'December 2, 2025',
    scopes: 'read, write, bookings',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  API_KEY_EXPIRING: {
    userName: 'John Smith',
    keyName: 'Production API Key',
    expiresAt: 'December 31, 2024',
    daysRemaining: '7',
    renewLink: 'https://app.bouncepro.com/app/settings/api-keys',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  SUBSCRIPTION_CONFIRMED: {
    userName: 'John Smith',
    planName: 'Growth Plan',
    price: '$39/month',
    features: 'Unlimited bookings, Custom branding, Priority support, Advanced analytics',
    dashboardUrl: 'https://app.bouncepro.com/app',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  SUBSCRIPTION_CANCELLED: {
    userName: 'John Smith',
    planName: 'Growth Plan',
    effectiveDate: 'January 1, 2025',
    reactivateLink: 'https://app.bouncepro.com/app/settings/billing',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  PAYMENT_FAILED: {
    userName: 'John Smith',
    amount: '39.00',
    reason: 'Card declined - insufficient funds',
    updatePaymentLink: 'https://app.bouncepro.com/app/settings/billing',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  TEAM_REMOVED: {
    userName: 'Sarah Johnson',
    businessName: 'Bounce Kingdom Party Rentals',
    removalDate: 'December 2, 2024',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  PASSWORD_CHANGED: {
    userName: 'John Smith',
    changedAt: 'December 2, 2024 at 3:45 PM',
    ipAddress: '192.168.1.100',
    deviceInfo: 'Chrome on MacOS (Austin, TX)',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  LOGIN_NEW_DEVICE: {
    userName: 'John Smith',
    deviceInfo: 'Chrome on Windows 11',
    location: 'Austin, TX, United States',
    loginTime: 'December 2, 2024 at 3:45 PM',
    securityLink: 'https://app.bouncepro.com/app/settings/security',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  },
  INVOICE_CREATED: {
    customerName: 'Jane Doe',
    invoiceNumber: 'INV-2024-001',
    amount: '299.00',
    dueDate: 'December 15, 2024',
    viewLink: 'https://app.bouncepro.com/invoices/INV-2024-001',
    businessName: 'Bounce Kingdom Party Rentals',
    businessEmail: 'info@bouncekingdom.com',
    businessPhone: '(555) 123-4567',
    businessAddress: '123 Fun Street, Austin, TX 78701'
  }
}

/**
 * Helper to format address for display
 */
function formatAddress(address?: { street?: string; city?: string; state?: string; zip?: string }): string {
  if (!address) return ''
  const parts = [address.street, address.city, address.state, address.zip].filter(Boolean)
  if (parts.length === 0) return ''
  if (address.street && address.city && address.state && address.zip) {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  }
  return parts.join(', ')
}

/**
 * Email Preview Endpoint
 * GET /api/email/preview/:name?variant=modern
 *
 * When user is authenticated, fetches their real tenant data
 * to show actual business information in previews
 */
export const emailPreviewEndpoint: Endpoint = {
  path: '/email/preview/:name',
  method: 'get',
  handler: async (req) => {
    const url = new URL(req.url || '', 'http://localhost')
    const pathParts = url.pathname.split('/')
    const name = pathParts[pathParts.length - 1] as EmailTemplateName
    const variant = url.searchParams.get('variant') || 'modern'

    if (!name || !emailTemplates[name]) {
      return Response.json(
        { error: 'Template not found', available: Object.keys(emailTemplates) },
        { status: 404 }
      )
    }

    const templateVariant = getTemplateVariant(name, variant)
    if (!templateVariant) {
      return Response.json(
        { error: 'Template variant not found', requestedVariant: variant },
        { status: 404 }
      )
    }

    // Start with sample data
    let data = sampleData[name] ? { ...sampleData[name] } : {}

    // If user is authenticated, try to fetch their real tenant data
    const user = req.user
    if (user && user.tenantId) {
      try {
        const tenantId = typeof user.tenantId === 'object' ? user.tenantId.id : user.tenantId
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
        })

        if (tenant) {
          // Override sample business data with real tenant data
          const businessName = (tenant.branding as any)?.businessName || tenant.name || data.businessName
          const businessEmail = tenant.email || data.businessEmail
          const businessPhone = tenant.phone || data.businessPhone
          const businessAddress = formatAddress(tenant.address as any) || data.businessAddress

          data = {
            ...data,
            businessName,
            businessEmail,
            businessPhone,
            businessAddress,
            tenantName: businessName,
          }
        }
      } catch (error) {
        // If we can't fetch tenant data, continue with sample data
        console.warn('Could not fetch tenant data for email preview:', error)
      }
    }

    // Get raw template output and interpolate variables with data
    const rawHtml = templateVariant.html(data)
    const rawText = templateVariant.text(data)
    const rawSubject = templateVariant.subject

    return Response.json({
      name,
      variant: templateVariant.id,
      variantName: templateVariant.name,
      subject: interpolate(rawSubject, data),
      html: interpolate(rawHtml, data),
      text: interpolate(rawText, data),
      sampleData: data
    })
  }
}

/**
 * Send Test Email Endpoint
 * POST /api/email/send-test
 * Body: { templateName, variant?, toEmail }
 *
 * When user is authenticated, uses their real tenant data
 */
export const emailSendTestEndpoint: Endpoint = {
  path: '/email/send-test',
  method: 'post',
  handler: async (req) => {
    try {
      const body = await req.json?.() || {}
      const { templateName, variant = 'modern', toEmail } = body

      if (!templateName || !toEmail) {
        return Response.json(
          { error: 'templateName and toEmail are required' },
          { status: 400 }
        )
      }

      const templateVariant = getTemplateVariant(templateName as EmailTemplateName, variant)
      if (!templateVariant) {
        return Response.json(
          { error: 'Template not found', available: Object.keys(emailTemplates) },
          { status: 404 }
        )
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(toEmail)) {
        return Response.json(
          { error: 'Invalid email address format' },
          { status: 400 }
        )
      }

      // Start with sample data
      let data = sampleData[templateName] ? { ...sampleData[templateName] } : {}

      // If user is authenticated, try to fetch their real tenant data
      const user = req.user
      if (user && user.tenantId) {
        try {
          const tenantId = typeof user.tenantId === 'object' ? user.tenantId.id : user.tenantId
          const tenant = await req.payload.findByID({
            collection: 'tenants',
            id: tenantId,
          })

          if (tenant) {
            // Override sample business data with real tenant data
            const businessName = (tenant.branding as any)?.businessName || tenant.name || data.businessName
            const businessEmail = tenant.email || data.businessEmail
            const businessPhone = tenant.phone || data.businessPhone
            const businessAddress = formatAddress(tenant.address as any) || data.businessAddress

            data = {
              ...data,
              businessName,
              businessEmail,
              businessPhone,
              businessAddress,
              tenantName: businessName,
            }
          }
        } catch (error) {
          // If we can't fetch tenant data, continue with sample data
          console.warn('Could not fetch tenant data for test email:', error)
        }
      }

      // Interpolate variables with data
      const interpolatedSubject = interpolate(templateVariant.subject, data)
      const interpolatedHtml = interpolate(templateVariant.html(data), data)
      const interpolatedText = interpolate(templateVariant.text(data), data)

      await emailService.sendCustomEmail(
        { email: toEmail, name: 'Test Recipient' },
        `[TEST - ${templateVariant.name}] ${interpolatedSubject}`,
        interpolatedHtml,
        interpolatedText,
        ['test-email']
      )

      return Response.json({
        success: true,
        message: `Test email sent to ${toEmail}`,
        variant
      })
    } catch (error) {
      console.error('Failed to send test email:', error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Failed to send email' },
        { status: 500 }
      )
    }
  }
}

/**
 * List Email Templates Endpoint
 * GET /api/email/templates
 * Returns all templates with their variants
 */
export const emailTemplatesListEndpoint: Endpoint = {
  path: '/email/templates',
  method: 'get',
  handler: async () => {
    const templateInfo: Record<string, {
      name: string
      description: string
      trigger: string
      variants: Array<{ id: string; name: string }>
      defaultVariant: string
    }> = {
      BOOKING_CONFIRMATION: {
        name: 'Booking Confirmation',
        description: 'Sent when a booking is confirmed',
        trigger: 'On booking confirmation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      BOOKING_REMINDER: {
        name: 'Booking Reminder',
        description: 'Sent 24 hours before the event',
        trigger: '24 hours before event',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      BOOKING_CANCELLED: {
        name: 'Booking Cancelled',
        description: 'Sent when a booking is cancelled',
        trigger: 'On booking cancellation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      PAYMENT_RECEIVED: {
        name: 'Payment Received',
        description: 'Sent when a payment is processed',
        trigger: 'On successful payment',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      PASSWORD_RESET: {
        name: 'Password Reset',
        description: 'Sent when a user requests password reset',
        trigger: 'On password reset request',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      WELCOME: {
        name: 'Welcome Email',
        description: 'Sent to new users after registration',
        trigger: 'On user registration',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      TEAM_INVITE: {
        name: 'Team Invitation',
        description: 'Sent when owner invites staff to join their business',
        trigger: 'On team member invitation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      API_KEY_CREATED: {
        name: 'API Key Created',
        description: 'Notification when new API key is created',
        trigger: 'On API key creation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      API_KEY_EXPIRING: {
        name: 'API Key Expiring',
        description: 'Warning before API key expires',
        trigger: '7 days before key expiration',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      SUBSCRIPTION_CONFIRMED: {
        name: 'Subscription Confirmed',
        description: 'Sent when user subscribes to a plan',
        trigger: 'On subscription activation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      SUBSCRIPTION_CANCELLED: {
        name: 'Subscription Cancelled',
        description: 'Sent when subscription is cancelled',
        trigger: 'On subscription cancellation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      PAYMENT_FAILED: {
        name: 'Payment Failed',
        description: 'Sent when recurring payment fails',
        trigger: 'On payment failure',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      TEAM_REMOVED: {
        name: 'Team Member Removed',
        description: 'Sent when user is removed from a business',
        trigger: 'On team member removal',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      PASSWORD_CHANGED: {
        name: 'Password Changed',
        description: 'Security notification when password is changed',
        trigger: 'On password change',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      LOGIN_NEW_DEVICE: {
        name: 'New Device Login',
        description: 'Security notification for login from new device',
        trigger: 'On new device login detected',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      },
      INVOICE_CREATED: {
        name: 'Invoice Created',
        description: 'Sent when a new invoice is generated',
        trigger: 'On invoice creation',
        variants: [
          { id: 'modern', name: 'Modern Dark' },
          { id: 'classic', name: 'Classic Light' },
          { id: 'bold', name: 'Bold Gradient' }
        ],
        defaultVariant: 'modern'
      }
    }

    const templates = Object.entries(templateInfo).map(([id, info]) => ({
      id,
      ...info
    }))

    return Response.json({ templates })
  }
}

/**
 * Export all email endpoints
 */
export const emailEndpoints = [
  emailTemplatesListEndpoint,
  emailPreviewEndpoint,
  emailSendTestEndpoint
]
