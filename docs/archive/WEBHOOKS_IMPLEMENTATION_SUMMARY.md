# Webhooks System Implementation Summary

## Overview
Implemented a comprehensive tenant webhooks system for external integrations (Phase 7.3).

## What Was Built

### 1. Collections

#### WebhookEndpoints Collection (`/payload/src/collections/WebhookEndpoints.ts`)
- **Updated fields:**
  - `name` - Friendly name for the webhook endpoint
  - `url` - HTTPS URL where webhooks are sent (validated)
  - `secret` - Auto-generated HMAC signing secret
  - `events[]` - Array of events that trigger this webhook
  - `isActive` - Enable/disable toggle
  - `lastDeliveryAt` - Timestamp of last delivery
  - `lastDeliveryStatus` - 'success' or 'failed'
  - `failedDeliveriesCount` - Consecutive failed deliveries

#### WebhookDeliveries Collection (`/payload/src/collections/WebhookDeliveries.ts`)
- **New collection for tracking webhook delivery attempts:**
  - `endpointId` - Relationship to webhook endpoint
  - `tenantId` - Tenant this delivery belongs to
  - `event` - Event that triggered the webhook
  - `payload` - JSON data sent
  - `status` - 'pending' | 'delivered' | 'failed' | 'retrying'
  - `attempts` - Number of delivery attempts
  - `maxAttempts` - Max retry attempts (default: 5)
  - `nextRetryAt` - When to retry next
  - `response` - HTTP response details (status, body, headers)
  - `error` - Error message if failed
  - `deliveredAt` - Successful delivery timestamp

### 2. Webhook Utilities (`/payload/src/lib/webhooks.ts`)

#### Core Functions:
- **`generateWebhookSecret()`** - Generates secure `whsec_*` secrets
- **`signPayload(payload, secret)`** - Creates HMAC SHA-256 signature
- **`verifySignature(payload, signature, secret)`** - Verifies webhook signatures
- **`calculateNextRetry(attempt)`** - Exponential backoff (1min, 5min, 15min, 1hr, 4hr)
- **`queueWebhook(payload, tenantId, event, data)`** - Queues webhook for delivery
- **`deliverWebhook(payload, deliveryId)`** - Delivers webhook with retry logic
- **`processWebhookRetries(payload)`** - Processes pending retries

#### Delivery Logic:
- 5 second timeout per delivery
- Exponential backoff retry strategy
- Max 5 retry attempts
- Updates endpoint status on success/failure
- Tracks consecutive failed deliveries

### 3. API Endpoints (`/payload/src/endpoints/webhooks.ts`)

#### POST `/api/webhooks/register`
- Create new webhook endpoint
- Validates HTTPS URLs
- Auto-generates secret
- Returns secret (only shown once)

#### PATCH `/api/webhooks/:id`
- Update endpoint URL, events, active status
- Cannot change secret directly

#### DELETE `/api/webhooks/:id`
- Deactivate and delete endpoint

#### POST `/api/webhooks/:id/regenerate-secret`
- Generate new secret
- Returns new secret (only shown once)

#### POST `/api/webhooks/test`
- Send test webhook to endpoint
- Uses fake data matching real webhook format
- Returns delivery result immediately

#### GET `/api/webhooks/:id/deliveries`
- List recent deliveries for endpoint
- Paginated results
- Filter by status

#### POST `/api/webhooks/:id/deliveries/:deliveryId/retry`
- Manually retry a failed delivery

### 4. Webhook Triggers

#### Bookings Collection (`/payload/src/collections/Bookings.ts`)
Triggers webhooks on:
- `booking.created` - New booking created
- `booking.updated` - Booking details updated
- `booking.confirmed` - Status changed to confirmed
- `booking.cancelled` - Status changed to cancelled
- `booking.delivered` - Status changed to delivered
- `booking.completed` - Status changed to completed

#### Payments Collection (`/payload/src/collections/Payments.ts`)
Triggers webhooks on:
- `payment.succeeded` - Payment succeeded
- `payment.failed` - Payment failed
- `payment.refunded` - Payment refunded

#### Customers Collection (`/payload/src/collections/Customers.ts`)
Triggers webhooks on:
- `customer.created` - New customer created
- `customer.updated` - Customer details updated

### 5. Scheduled Retry Job (`/payload/src/jobs/webhook-retry.ts`)

- **Function:** `startWebhookRetryJob(payload)`
- **Interval:** Runs every 60 seconds
- **Logic:**
  - Finds deliveries with `status = 'retrying' or 'pending'`
  - Checks if `nextRetryAt <= now`
  - Processes up to 50 deliveries per run
  - Runs `deliverWebhook()` for each

- **Initialized in:** `/payload/src/payload.config.ts` via `onInit` hook

### 6. Webhook Payload Format

```json
{
  "id": "delivery-id",
  "event": "booking.created",
  "created": 1234567890,
  "data": {
    // Full booking/payment/customer object
  }
}
```

### 7. Webhook Headers

```
Content-Type: application/json
X-Webhook-Signature: t=timestamp,v1=signature
X-Webhook-Event: booking.created
X-Webhook-Delivery-Id: delivery-id
User-Agent: BouncePro-Webhooks/1.0
```

## Security Features

1. **HTTPS Only:** All webhook URLs must use HTTPS
2. **HMAC Signatures:** Payloads signed with SHA-256 HMAC
3. **Timestamp Validation:** Signatures expire after 5 minutes
4. **Secrets:** Auto-generated 48-character secrets
5. **One-Time Secret Display:** Secrets only shown on creation/regeneration

## Event Types Supported

### Bookings
- `booking.created`
- `booking.updated`
- `booking.confirmed`
- `booking.cancelled`
- `booking.delivered`
- `booking.completed`

### Payments
- `payment.succeeded`
- `payment.failed`
- `payment.refunded`

### Customers
- `customer.created`
- `customer.updated`

### Future Events (defined but not implemented)
- `inventory.low`
- `maintenance.due`

## Retry Strategy

| Attempt | Delay |
|---------|-------|
| 1 | 1 minute |
| 2 | 5 minutes |
| 3 | 15 minutes |
| 4 | 1 hour |
| 5 | 4 hours |
| 6+ | Failed (no more retries) |

## Dashboard UI (To Be Built)

### Planned Pages:
- `/nuxt/app/pages/app/settings/webhooks.vue` - List and manage webhook endpoints
- `/nuxt/app/components/settings/WebhookEndpointCard.vue` - Endpoint details card
- `/nuxt/app/components/settings/WebhookDeliveryList.vue` - Recent deliveries table

### Features:
- Create/edit/delete webhook endpoints
- Select events to listen to
- View webhook secret (on creation only)
- Regenerate secret
- Test webhook button
- View delivery logs
- Retry failed deliveries
- Active/inactive toggle

## Known Issues & TODO

### TypeScript Errors:
- Some type mismatches between Payload's generated types and webhook code
- Need to add proper type casting for collection slugs
- Endpoint request JSON parsing needs type refinement

### Missing Features:
1. Dashboard UI not built yet
2. Unit tests for webhook functions
3. Integration tests for delivery flow
4. Webhook signature verification example code for clients
5. Webhook retry dashboard visualization

### Recommended Next Steps:
1. Fix TypeScript errors in webhook endpoints
2. Build Nuxt UI for webhook management
3. Write unit tests for webhook signing/verification
4. Add webhook documentation for tenants
5. Create example webhook receiver code (Node.js, Python, PHP)
6. Add webhook event history visualization
7. Implement webhook filtering/search in dashboard

## Files Modified/Created

### Collections:
- `/payload/src/collections/WebhookEndpoints.ts` (updated)
- `/payload/src/collections/WebhookDeliveries.ts` (created)
- `/payload/src/collections/Bookings.ts` (updated with hooks)
- `/payload/src/collections/Payments.ts` (updated with hooks)
- `/payload/src/collections/Customers.ts` (updated with hooks)

### Libraries:
- `/payload/src/lib/webhooks.ts` (created)

### Endpoints:
- `/payload/src/endpoints/webhooks.ts` (created)

### Jobs:
- `/payload/src/jobs/webhook-retry.ts` (created)

### Config:
- `/payload/src/payload.config.ts` (updated - registered WebhookDeliveries collection, webhook endpoints, onInit hook)

## Usage Example

### Creating a Webhook Endpoint (API)

```bash
curl -X POST https://api.bouncepro.com/api/webhooks/register \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zapier Integration",
    "url": "https://hooks.zapier.com/hooks/catch/12345/abcde/",
    "events": ["booking.created", "booking.confirmed", "payment.succeeded"]
  }'
```

Response:
```json
{
  "id": "123",
  "name": "Zapier Integration",
  "url": "https://hooks.zapier.com/hooks/catch/12345/abcde/",
  "secret": "whsec_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
  "events": [
    { "event": "booking.created" },
    { "event": "booking.confirmed" },
    { "event": "payment.succeeded" }
  ],
  "isActive": true,
  "createdAt": "2025-12-02T..."
}
```

### Verifying Webhook Signatures (Client Side)

```javascript
// Node.js example
const crypto = require('crypto');

function verifyWebhook(payload, signatureHeader, secret) {
  const [timestampPart, signaturePart] = signatureHeader.split(',');
  const timestamp = timestampPart.split('=')[1];
  const signature = signaturePart.split('=')[1];

  // Check timestamp is within 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) {
    return false;
  }

  // Recompute signature
  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js webhook receiver
app.post('/webhooks/bouncepro', express.json(), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  if (!verifyWebhook(req.body, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;

  switch (event) {
    case 'booking.created':
      // Handle new booking
      break;
    case 'payment.succeeded':
      // Handle successful payment
      break;
    // ... more events
  }

  res.status(200).json({ received: true });
});
```

## Testing

### Manual Testing Steps:
1. Create a webhook endpoint via API
2. Use webhook.site or similar service as URL
3. Create a booking in Payload admin
4. Check webhook.site for received webhook
5. Verify signature matches
6. Check WebhookDeliveries collection for logged delivery

### Unit Tests (TODO):
- `generateWebhookSecret()` format validation
- `signPayload()` signature generation
- `verifySignature()` with valid/invalid signatures
- `calculateNextRetry()` exponential backoff
- Webhook queuing logic
- Delivery with mocked HTTP responses

## Production Checklist

- [ ] Fix all TypeScript errors
- [ ] Write unit tests for webhook library
- [ ] Build dashboard UI
- [ ] Add webhook event history pruning (delete old deliveries)
- [ ] Add webhook rate limiting per tenant
- [ ] Monitor webhook delivery performance
- [ ] Add webhook payload size limits
- [ ] Document webhook events for API docs
- [ ] Create example webhook receivers (Node, Python, PHP, Ruby)
- [ ] Add webhook verification SDK
- [ ] Implement webhook replay functionality
- [ ] Add webhook failure alerting (email tenant after N failures)
- [ ] Consider webhook IP allowlisting
- [ ] Add webhook event filtering (don't send all fields)

---

**Status:** Backend implementation complete, types partially working, UI not built yet
**Last Updated:** 2025-12-02
