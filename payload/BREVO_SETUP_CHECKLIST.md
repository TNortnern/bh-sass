# Brevo Email Integration - Setup Checklist

Use this checklist to ensure your Brevo email integration is properly configured.

## Pre-Setup

- [ ] Sign up for a free Brevo account at https://www.brevo.com/
- [ ] Verify your email address with Brevo
- [ ] Navigate to Settings > API Keys in Brevo dashboard

## Configuration

- [ ] Create a new API key in Brevo (with full permissions)
- [ ] Copy the API key
- [ ] Add to `.env` file:
  ```bash
  BREVO_API_KEY=your-actual-api-key-here
  EMAIL_FROM_ADDRESS=noreply@yourdomain.com
  EMAIL_FROM_NAME=YourCompanyName
  NEXT_PUBLIC_APP_URL=https://your-app-url.com
  ```
- [ ] Restart your Payload server

## Domain Verification (Recommended)

- [ ] In Brevo, go to Settings > Senders & IP
- [ ] Add your domain (e.g., yourdomain.com)
- [ ] Copy the DNS records provided by Brevo
- [ ] Add DNS records to your domain registrar:
  - [ ] SPF record (TXT)
  - [ ] DKIM record (TXT)
  - [ ] DMARC record (TXT) - optional but recommended
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify domain in Brevo dashboard

## Code Integration

- [ ] Add email hook to Bookings collection (`src/collections/Bookings.ts`)
  ```typescript
  import { sendBookingEmails } from '../hooks/email'
  
  hooks: {
    afterChange: [
      // ... existing hooks
      sendBookingEmails,
    ]
  }
  ```

- [ ] Add email hook to Payments collection (`src/collections/Payments.ts`)
  ```typescript
  import { sendPaymentEmails } from '../hooks/email'
  
  hooks: {
    afterChange: [sendPaymentEmails]
  }
  ```

- [ ] Add email hook to Users collection (`src/collections/Users.ts`)
  ```typescript
  import { sendUserWelcomeEmail } from '../hooks/email'
  
  hooks: {
    afterChange: [sendUserWelcomeEmail]
  }
  ```

## Testing

### Test Email Sending

- [ ] Update email addresses in `src/lib/email/example.ts` to your test email
- [ ] Test booking confirmation:
  - [ ] Create a new booking in admin panel
  - [ ] Set status to "confirmed"
  - [ ] Check email inbox
  - [ ] Verify email looks correct

- [ ] Test payment receipt:
  - [ ] Create a payment record
  - [ ] Set status to "succeeded"
  - [ ] Check email inbox

- [ ] Test welcome email:
  - [ ] Create a new user
  - [ ] Set role to "tenant_admin"
  - [ ] Check email inbox

- [ ] Test cancellation:
  - [ ] Update a booking status to "cancelled"
  - [ ] Check email inbox

### Email Rendering

- [ ] Test in Gmail (light mode)
- [ ] Test in Gmail (dark mode)
- [ ] Test in Outlook
- [ ] Test in Apple Mail
- [ ] Test on mobile device (iOS)
- [ ] Test on mobile device (Android)

### Links and Content

- [ ] Click all links in test emails
- [ ] Verify booking URLs work
- [ ] Verify receipt URLs work
- [ ] Verify dashboard URLs work
- [ ] Check all images load
- [ ] Verify all dynamic content displays correctly

## Monitoring

- [ ] Set up Brevo dashboard monitoring
- [ ] Check email delivery rates (should be >95%)
- [ ] Check bounce rates (should be <5%)
- [ ] Check spam complaint rates (should be <0.1%)
- [ ] Set up alerts for delivery issues

## Production Checklist

- [ ] Update `EMAIL_FROM_ADDRESS` to production domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Verify all DNS records are active
- [ ] Test all email types in production
- [ ] Set up booking reminder cron job
- [ ] Monitor first week of production emails closely
- [ ] Document any issues and fixes

## Optional Enhancements

- [ ] Customize email templates with your branding
- [ ] Add company logo to emails
- [ ] Create additional email templates
- [ ] Set up email preference center
- [ ] Implement unsubscribe functionality
- [ ] Add email analytics tracking
- [ ] Set up A/B testing for subject lines
- [ ] Create email drip campaigns
- [ ] Add email scheduling features

## Troubleshooting

If emails are not sending:

1. **Check API key**
   ```bash
   echo $BREVO_API_KEY
   # Should output your API key
   ```

2. **Check Payload logs**
   ```bash
   grep "email" logs/payload.log
   # Look for error messages
   ```

3. **Check Brevo dashboard**
   - Go to Statistics > Email
   - Check for failed sends

4. **Verify environment variables**
   ```bash
   # In your Payload server
   console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Set' : 'Not set')
   console.log('EMAIL_FROM_ADDRESS:', process.env.EMAIL_FROM_ADDRESS)
   ```

5. **Test with example script**
   ```typescript
   import { exampleBookingConfirmation } from '@/lib/email/example'
   await exampleBookingConfirmation()
   ```

## Support

- **Brevo Support**: https://help.brevo.com/
- **Brevo API Docs**: https://developers.brevo.com/
- **Email README**: `/src/lib/email/README.md`
- **Integration Guide**: `/INTEGRATION_GUIDE.md`

## Completion

Once all items are checked:

- [ ] Email system is fully operational
- [ ] All test emails received successfully
- [ ] DNS records verified and active
- [ ] Monitoring in place
- [ ] Team trained on email features
- [ ] Documentation updated

**Date Completed**: ________________

**Completed By**: ________________

**Notes**:
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
