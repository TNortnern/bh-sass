# Email Integration with Brevo

This directory contains the complete email integration for the Bounce House Rental SaaS using Brevo (formerly Sendinblue).

## Overview

The email system consists of three main components:

1. **Brevo Client** (`brevo.ts`) - API client for sending emails via Brevo
2. **Email Templates** (`templates.ts`) - Professional HTML email templates
3. **Email Service** (`index.ts`) - High-level service combining client and templates

## Setup

### 1. Get Brevo API Key

1. Sign up for a free account at [Brevo](https://www.brevo.com/)
2. Navigate to Settings > API Keys
3. Create a new API key with the required permissions
4. Copy the API key

### 2. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Required
BREVO_API_KEY=your-brevo-api-key-here

# Optional (defaults shown)
EMAIL_FROM_ADDRESS=noreply@bouncepro.com
EMAIL_FROM_NAME=BouncePro
NEXT_PUBLIC_APP_URL=https://app.bouncepro.com
```

### 3. Verify Sender Domain

In Brevo, verify your sender domain to avoid emails going to spam:

1. Go to Settings > Senders & IP
2. Add your domain (e.g., bouncepro.com)
3. Follow DNS verification steps

## Email Templates

The system includes 6 pre-built email templates:

### 1. Booking Confirmation
Sent when a booking is created or confirmed.

**Triggers:**
- New booking with status "confirmed"
- Booking status changes from "pending" to "confirmed"

### 2. Booking Reminder
Sent 24 hours before the event (requires scheduled job).

**Triggers:**
- Scheduled job checks bookings with eventDate = tomorrow

### 3. Booking Cancellation
Sent when a booking is cancelled.

**Triggers:**
- Booking status changes to "cancelled"

### 4. Payment Receipt
Sent when a payment is successfully processed.

**Triggers:**
- Payment status changes to "succeeded"

### 5. Password Reset
Sent when a user requests a password reset.

**Triggers:**
- Manual trigger via password reset flow

### 6. Welcome Email
Sent when a new user is created.

**Triggers:**
- New user account created (tenant_admin or staff role)

## Usage

### Basic Usage

```typescript
import { emailService } from '@/lib/email'

// Send booking confirmation
await emailService.sendBookingConfirmation(booking, customer, tenant)

// Send payment receipt
await emailService.sendPaymentReceipt(payment, booking, customer, tenant, remainingBalance)

// Send password reset
await emailService.sendPasswordReset(user, resetLink)

// Send welcome email
await emailService.sendWelcome(user, tenant)
```

### Using Payload Hooks

The email hooks are already configured for automatic sending:

```typescript
// In your collection config
import { sendBookingEmails } from '@/hooks/email'

export const Bookings: CollectionConfig = {
  // ... other config
  hooks: {
    afterChange: [sendBookingEmails]
  }
}
```

### Custom Emails

For one-off or custom emails:

```typescript
import { emailService } from '@/lib/email'

await emailService.sendCustomEmail(
  { email: 'customer@example.com', name: 'John Doe' },
  'Custom Subject',
  '<h1>Custom HTML Content</h1>',
  'Custom text content',
  ['custom-tag']
)
```

### Using Brevo Client Directly

For advanced use cases:

```typescript
import { brevo } from '@/lib/email/brevo'

// Send transactional email
await brevo.sendTransactionalEmail({
  to: [{ email: 'customer@example.com', name: 'John Doe' }],
  subject: 'Your Subject',
  htmlContent: '<h1>HTML Content</h1>',
  textContent: 'Text content',
  tags: ['custom-tag']
})

// Send using Brevo template (created in Brevo dashboard)
await brevo.sendTemplateEmail({
  to: [{ email: 'customer@example.com', name: 'John Doe' }],
  templateId: 1, // Your Brevo template ID
  params: {
    FIRSTNAME: 'John',
    LASTNAME: 'Doe',
    // ... other template variables
  }
})
```

## Automated Email Triggers

### Current Hooks

The following hooks are already implemented in `/src/hooks/email.ts`:

1. **Bookings Hook** (`sendBookingEmails`)
   - Sends confirmation on create with status "confirmed"
   - Sends confirmation when status changes to "confirmed"
   - Sends cancellation when status changes to "cancelled"

2. **Payments Hook** (`sendPaymentEmails`)
   - Sends receipt when payment status = "succeeded"
   - Calculates and includes remaining balance

3. **Users Hook** (`sendUserWelcomeEmail`)
   - Sends welcome email to new tenant admins and staff

### Adding Hooks to Collections

To add email hooks to a collection:

```typescript
// In your collection config file
import { sendBookingEmails } from '../hooks/email'

export const Bookings: CollectionConfig = {
  // ... existing config
  hooks: {
    afterChange: [
      // ... existing hooks
      sendBookingEmails, // Add this
    ],
  },
}
```

## Scheduled Emails (Reminders)

For booking reminders, you'll need to set up a scheduled job (cron):

```typescript
// Example: Daily job to send booking reminders
import { emailService } from '@/lib/email'

async function sendBookingReminders() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Find bookings for tomorrow
  const bookings = await payload.find({
    collection: 'bookings',
    where: {
      startDate: {
        greater_than_equal: startOfDay(tomorrow),
        less_than: endOfDay(tomorrow)
      },
      status: {
        equals: 'confirmed'
      }
    }
  })

  // Send reminder for each booking
  for (const booking of bookings.docs) {
    const customer = await payload.findByID({
      collection: 'customers',
      id: booking.customerId
    })

    const tenant = await payload.findByID({
      collection: 'tenants',
      id: booking.tenantId
    })

    await emailService.sendBookingReminder(booking, customer, tenant)
  }
}

// Schedule to run daily at 10 AM
// Use node-cron, bull, or your preferred scheduler
```

## Email Template Customization

### Modifying Existing Templates

Edit the templates in `templates.ts`:

```typescript
export const BOOKING_CONFIRMATION: EmailTemplate = {
  subject: 'Booking Confirmation - BouncePro',

  html: (params) => emailWrapper(`
    <!-- Your custom HTML here -->
    <h2>Custom Heading</h2>
    <p>Hello ${params.customerName}</p>
  `),

  text: (params) => `
    Custom plain text version
    Hello ${params.customerName}
  `
}
```

### Adding New Templates

1. Add to `templates.ts`:

```typescript
export const CUSTOM_TEMPLATE: EmailTemplate = {
  subject: 'Custom Email Subject',
  html: (params) => emailWrapper(`
    <!-- Your HTML -->
  `),
  text: (params) => `Your text version`
}

// Add to exports
export const emailTemplates = {
  // ... existing templates
  CUSTOM_TEMPLATE,
}
```

2. Add service method in `index.ts`:

```typescript
async sendCustomNotification(data: CustomData): Promise<void> {
  const template = emailTemplates.CUSTOM_TEMPLATE

  const params = {
    // Map your data to template params
  }

  await brevo.sendTransactionalEmail({
    to: [{ email: data.email, name: data.name }],
    subject: template.subject,
    htmlContent: template.html(params),
    textContent: template.text(params),
    tags: ['custom-notification']
  })
}
```

## Testing

### Test in Development

```typescript
// Create a test route or script
import { emailService } from '@/lib/email'

const testData = {
  booking: {
    id: 'test-123',
    eventDate: '2025-12-01',
    eventTime: '2:00 PM',
    location: '123 Main St, City, ST 12345',
    totalAmount: 299.99,
    status: 'confirmed',
  },
  customer: {
    id: 'cust-123',
    name: 'John Doe',
    email: 'your-test-email@example.com',
  },
  tenant: {
    id: 'tenant-123',
    name: 'ABC Bounce Rentals',
  }
}

await emailService.sendBookingConfirmation(
  testData.booking,
  testData.customer,
  testData.tenant
)
```

### Email Preview

To preview emails without sending:

```typescript
import { emailTemplates } from '@/lib/email/templates'

const template = emailTemplates.BOOKING_CONFIRMATION

const params = {
  customerName: 'John Doe',
  bookingId: 'BK-12345',
  // ... other params
}

const htmlPreview = template.html(params)
// Save to file or render in browser for preview
```

## Error Handling

All email functions are wrapped in try-catch blocks and will:

1. Log errors to Payload logger
2. Not throw exceptions (emails are non-blocking)
3. Return the document unchanged

```typescript
try {
  await emailService.sendBookingConfirmation(booking, customer, tenant)
} catch (error) {
  // Error is logged but doesn't break the flow
  console.error('Email failed:', error)
}
```

## Monitoring

### Brevo Dashboard

Monitor email delivery in your Brevo dashboard:

1. Go to Statistics > Email
2. View sent, delivered, opened, clicked metrics
3. Check bounce rates and spam reports

### Application Logs

Check Payload logs for email-related events:

```bash
# Search for email logs
grep "email" logs/payload.log

# Common log messages:
# - "Booking confirmation email sent for booking {id}"
# - "Payment receipt email sent for payment {id}"
# - "Failed to send booking email: {error}"
```

## Best Practices

1. **Always verify sender domain** to avoid spam filters
2. **Include plain text versions** for all emails (already implemented)
3. **Use email tags** for tracking and analytics
4. **Test with real email addresses** in different providers (Gmail, Outlook, etc.)
5. **Monitor bounce rates** and maintain list hygiene
6. **Respect unsubscribe requests** (implement when needed)
7. **Use environment checks** for production vs development

## Troubleshooting

### Emails Not Sending

1. **Check API key**: Ensure `BREVO_API_KEY` is set correctly
2. **Check logs**: Look for error messages in Payload logs
3. **Verify sender**: Make sure sender email is verified in Brevo
4. **Check Brevo limits**: Free tier has sending limits

### Emails Going to Spam

1. **Verify domain**: Complete domain verification in Brevo
2. **Add SPF/DKIM**: Configure DNS records
3. **Avoid spam triggers**: Don't use all caps, excessive links
4. **Test spam score**: Use mail-tester.com

### Template Not Rendering

1. **Check params**: Ensure all required params are passed
2. **Test locally**: Preview HTML in browser
3. **Validate HTML**: Use HTML validator
4. **Check dark mode**: Test in light and dark mode email clients

## API Reference

### emailService

#### `sendBookingConfirmation(booking, customer, tenant)`
Sends booking confirmation email.

**Parameters:**
- `booking: BookingData` - Booking information
- `customer: CustomerData` - Customer information
- `tenant: TenantData` - Tenant information

#### `sendBookingReminder(booking, customer, tenant)`
Sends 24-hour reminder email.

#### `sendBookingCancellation(booking, customer, tenant, refundAmount?)`
Sends cancellation notification.

**Parameters:**
- `refundAmount?: number` - Optional refund amount

#### `sendPaymentReceipt(payment, booking, customer, tenant, remainingBalance?)`
Sends payment receipt.

**Parameters:**
- `payment: PaymentData` - Payment information
- `remainingBalance?: number` - Optional remaining balance

#### `sendPasswordReset(user, resetLink)`
Sends password reset email.

**Parameters:**
- `user: UserData` - User information
- `resetLink: string` - Password reset URL

#### `sendWelcome(user, tenant)`
Sends welcome email to new users.

#### `sendCustomEmail(to, subject, htmlContent, textContent?, tags?)`
Sends custom email.

**Parameters:**
- `to: BrevoEmailAddress | BrevoEmailAddress[]` - Recipients
- `subject: string` - Email subject
- `htmlContent: string` - HTML content
- `textContent?: string` - Plain text content
- `tags?: string[]` - Email tags for tracking

## License

MIT
