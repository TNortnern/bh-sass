# Email Integration Guide

## Quick Setup

To enable automated emails in your Bounce House Rental SaaS, follow these steps:

### 1. Configure Environment Variables

Add to your `.env` file:

```bash
# Get your API key from https://app.brevo.com/settings/keys/api
BREVO_API_KEY=your-actual-brevo-api-key-here

# Configure sender information
EMAIL_FROM_ADDRESS=noreply@bouncepro.com
EMAIL_FROM_NAME=BouncePro

# Application URL for email links
NEXT_PUBLIC_APP_URL=https://app.bouncepro.com
```

### 2. Add Hooks to Collections

Update your collection files to include the email hooks:

#### Update `src/collections/Bookings.ts`

Add the email hook import at the top:

```typescript
import { sendBookingEmails } from '../hooks/email'
```

Then add to the hooks section (around line 307):

```typescript
hooks: {
  afterChange: [
    // Existing hook for updating customer totalBookings
    ({ doc, operation, req }) => {
      // ... existing code ...
    },
    // Add email hook
    sendBookingEmails,
  ],
},
```

#### Update `src/collections/Payments.ts`

Add the email hook import at the top:

```typescript
import { sendPaymentEmails } from '../hooks/email'
```

Then add the hooks section at the end (before timestamps):

```typescript
timestamps: true,
hooks: {
  afterChange: [sendPaymentEmails],
},
```

#### Update `src/collections/Users.ts`

Add the email hook import at the top:

```typescript
import { sendUserWelcomeEmail } from '../hooks/email'
```

Then add to the hooks section:

```typescript
hooks: {
  afterChange: [sendUserWelcomeEmail],
},
```

### 3. Test the Integration

#### Test Booking Confirmation Email

1. Create a new booking via the admin panel
2. Set the status to "confirmed"
3. Check that the customer receives a confirmation email
4. Check Payload logs for success message

#### Test Payment Receipt Email

1. Create a new payment record
2. Set the status to "succeeded"
3. Check that the customer receives a receipt email
4. Verify the remaining balance is calculated correctly

#### Test Welcome Email

1. Create a new user account
2. Set role to "tenant_admin" or "staff"
3. Check that the user receives a welcome email

### 4. Verify Email Delivery

Check your Brevo dashboard:
1. Go to https://app.brevo.com/
2. Navigate to Statistics > Email
3. Verify emails are being sent successfully

## Advanced Configuration

### Setting Up Booking Reminders

Create a scheduled job to send 24-hour reminders:

```typescript
// Example: In a cron job or background worker
import { emailService } from './src/lib/email'
import payload from 'payload'

async function sendDailyReminders() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(dayAfter.getDate() + 1)

  // Find all confirmed bookings for tomorrow
  const bookings = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        {
          startDate: {
            greater_than_equal: tomorrow.toISOString(),
          },
        },
        {
          startDate: {
            less_than: dayAfter.toISOString(),
          },
        },
        {
          status: {
            equals: 'confirmed',
          },
        },
      ],
    },
  })

  // Send reminder for each booking
  for (const booking of bookings.docs) {
    try {
      const customer = await payload.findByID({
        collection: 'customers',
        id: booking.customerId,
      })

      const tenant = await payload.findByID({
        collection: 'tenants',
        id: booking.tenantId,
      })

      const item = await payload.findByID({
        collection: 'rental-items',
        id: booking.rentalItemId,
      })

      const bookingData = {
        id: booking.id,
        eventDate: booking.startDate,
        eventTime: formatTime(booking.startDate),
        location: formatAddress(booking.deliveryAddress),
        totalAmount: booking.totalPrice,
        status: booking.status,
        item: {
          id: item.id,
          name: item.name,
        },
      }

      await emailService.sendBookingReminder(
        bookingData,
        {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
        {
          id: tenant.id,
          name: tenant.name,
        }
      )

      console.log(`Sent reminder for booking ${booking.id}`)
    } catch (error) {
      console.error(`Failed to send reminder for booking ${booking.id}:`, error)
    }
  }
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatAddress(address) {
  if (!address) return 'Location TBD'
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
}

// Run daily at 10 AM
// Use your preferred scheduler (node-cron, bull, etc.)
```

### Customizing Email Templates

To customize the email designs:

1. Open `/src/lib/email/templates.ts`
2. Find the template you want to modify (e.g., `BOOKING_CONFIRMATION`)
3. Edit the HTML and text content
4. Save and restart the server

The templates use inline CSS for maximum email client compatibility.

### Adding Custom Emails

To add a new email type:

1. **Add template** in `templates.ts`:
```typescript
export const MY_CUSTOM_EMAIL: EmailTemplate = {
  subject: 'Custom Subject',
  html: (params) => emailWrapper(`
    <h2>Hello ${params.name}!</h2>
    <p>${params.message}</p>
  `),
  text: (params) => `Hello ${params.name}!\n\n${params.message}`
}
```

2. **Add service method** in `index.ts`:
```typescript
async sendCustomEmail(data: CustomData): Promise<void> {
  const template = emailTemplates.MY_CUSTOM_EMAIL

  await brevo.sendTransactionalEmail({
    to: [{ email: data.email, name: data.name }],
    subject: template.subject,
    htmlContent: template.html(data),
    textContent: template.text(data),
    tags: ['custom-email']
  })
}
```

3. **Use in your code**:
```typescript
await emailService.sendCustomEmail({
  email: 'customer@example.com',
  name: 'John Doe',
  message: 'Your custom message here'
})
```

## Troubleshooting

### Emails Not Sending

1. **Check environment variables**: Ensure `BREVO_API_KEY` is set
2. **Check Payload logs**: Look for error messages
3. **Verify API key**: Log into Brevo and verify the key is valid
4. **Check Brevo dashboard**: Look for errors or bounces

### Development vs Production

In development, you may want to override the recipient email:

```typescript
// In development, send all emails to a test address
const testEmail = process.env.NODE_ENV === 'development'
  ? 'test@example.com'
  : customer.email
```

### Disabling Emails Temporarily

Set `BREVO_API_KEY` to an empty string or remove it from `.env`:

```bash
# Emails will be skipped
BREVO_API_KEY=
```

The hooks will detect this and log a message instead of sending emails.

## Next Steps

1. **Verify sender domain** in Brevo (Settings > Senders & IP)
2. **Set up SPF/DKIM records** for better deliverability
3. **Test all email templates** with real data
4. **Monitor email metrics** in Brevo dashboard
5. **Set up booking reminder cron job** for automated reminders

## Support

For issues or questions:
- Check the [Email README](/src/lib/email/README.md) for detailed documentation
- Review Brevo documentation: https://developers.brevo.com/
- Check Payload logs for error messages

## Complete Example

Here's a complete example of the Bookings collection with email hooks:

```typescript
import type { CollectionConfig } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'
import { sendBookingEmails } from '../hooks/email'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  // ... all your existing config ...
  hooks: {
    afterChange: [
      // Existing hook
      ({ doc, operation, req }) => {
        if (operation === 'create' && doc.customerId) {
          const customerId = typeof doc.customerId === 'object' ? doc.customerId.id : doc.customerId
          setImmediate(async () => {
            try {
              const customer = await req.payload.findByID({
                collection: 'customers',
                id: customerId,
              })
              await req.payload.update({
                collection: 'customers',
                id: customerId,
                data: {
                  totalBookings: (customer.totalBookings || 0) + 1,
                },
              })
            } catch (error) {
              req.payload.logger.error('Failed to update customer totalBookings')
            }
          })
        }
      },
      // Email hook
      sendBookingEmails,
    ],
  },
}
```
