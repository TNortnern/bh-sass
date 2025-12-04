# Email Test Functionality Fix - Summary

## Problem
The frontend email templates page (`/nuxt/app/pages/app/settings/emails.vue`) was calling non-existent endpoints:
- `GET /api/email-templates` - for listing templates
- `GET /api/email-templates/${templateId}/preview` - for preview
- `POST /api/email-templates/${templateId}/send-test` - for sending test

The backend had different endpoints:
- `GET /api/email/preview/:name` 
- `POST /api/email/send-test`

## Solution
Created three Nuxt server routes that bridge the frontend to the Payload backend:

### 1. `/nuxt/server/api/email-templates/index.get.ts`
Lists all available email templates with metadata.

**Endpoint:** `GET /api/email-templates`

**Response:**
```json
{
  "templates": [
    {
      "id": "BOOKING_CONFIRMATION",
      "name": "Booking Confirmation",
      "description": "Sent when a booking is confirmed",
      "trigger": "After booking creation"
    },
    // ... 5 more templates
  ]
}
```

### 2. `/nuxt/server/api/email-templates/[id]/preview.get.ts`
Proxies to Payload's email preview endpoint.

**Endpoint:** `GET /api/email-templates/:id/preview`

**Proxies to:** `http://payload:3000/api/email/preview/:id`

**Response:**
```json
{
  "name": "BOOKING_CONFIRMATION",
  "subject": "Booking Confirmation - BouncePro",
  "html": "<!DOCTYPE html>...",
  "text": "BOOKING CONFIRMED!...",
  "sampleData": {
    "customerName": "John Smith",
    "bookingId": "BK-2024-001",
    // ... sample data
  }
}
```

### 3. `/nuxt/server/api/email-templates/[id]/send-test.post.ts`
Proxies to Payload's send test email endpoint.

**Endpoint:** `POST /api/email-templates/:id/send-test`

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Proxies to:** `http://payload:3000/api/email/send-test`

**Transforms request body:**
- Frontend sends: `{ email: "test@example.com" }`
- Backend expects: `{ templateName: "BOOKING_CONFIRMATION", toEmail: "test@example.com" }`

## Testing Results

### ✅ Template List Endpoint
```bash
curl http://localhost:3005/api/email-templates
# Returns list of 6 templates
```

### ✅ Preview Endpoint
```bash
curl http://localhost:3005/api/email-templates/BOOKING_CONFIRMATION/preview
# Returns HTML preview with sample data
```

### ⚠️ Send Test Email Endpoint
```bash
curl -X POST http://localhost:3005/api/email-templates/WELCOME/send-test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Returns error: "BREVO_API_KEY is not configured"
```

**Note:** The send-test endpoint works correctly but requires Brevo configuration to actually send emails.

## Brevo Configuration Required

To enable test email sending, add these to `.env`:

```env
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM_ADDRESS=noreply@bouncepro.com
EMAIL_FROM_NAME=BouncePro
```

Get a free Brevo API key at: https://www.brevo.com

## Architecture

```
Frontend (emails.vue)
    ↓
    GET /api/email-templates
    GET /api/email-templates/:id/preview
    POST /api/email-templates/:id/send-test
    ↓
Nuxt Server Routes (proxy layer)
    ↓
    GET http://payload:3000/api/email/preview/:name
    POST http://payload:3000/api/email/send-test
    ↓
Payload Backend
    ↓
Brevo API (if configured)
```

## Files Created

1. `/nuxt/server/api/email-templates/index.get.ts`
2. `/nuxt/server/api/email-templates/[id]/preview.get.ts`
3. `/nuxt/server/api/email-templates/[id]/send-test.post.ts`

## Next Steps

To test email sending:

1. Sign up for Brevo (free tier includes 300 emails/day)
2. Get API key from Brevo dashboard
3. Add to `.env`:
   ```
   BREVO_API_KEY=xkeysib-your-key-here
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   EMAIL_FROM_NAME=Your Business Name
   ```
4. Restart Payload: `docker compose restart payload`
5. Test from frontend: `/app/settings/emails`

Alternatively, use a temporary email service like https://temp-mail.org to receive test emails.
