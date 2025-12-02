# Stripe Connect Integration

This directory contains the Stripe Connect implementation for the BouncePro platform, enabling multi-tenant payment processing with platform fees.

## Overview

The integration uses **Stripe Connect Express accounts** to enable each tenant to accept payments directly into their own Stripe account. The platform takes a fee based on the tenant's pricing tier.

## Architecture

### Files

- `client.ts` - Stripe SDK initialization and utilities
- `fees.ts` - Platform fee calculation logic
- `types.ts` - TypeScript type definitions

### Endpoints

Located in `/src/endpoints/stripe/`:

- `connect.ts` - Stripe Connect account onboarding
- `account-status.ts` - Account status retrieval and management
- `checkout.ts` - Checkout session creation
- `webhook.ts` - Stripe webhook event handlers

## Environment Variables

Add these to your `.env` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...          # Stripe secret key (test or live)
STRIPE_WEBHOOK_SECRET=whsec_...        # Webhook signing secret
STRIPE_CONNECT_CLIENT_ID=ca_...        # Connect platform client ID
STRIPE_PLATFORM_ACCOUNT_ID=acct_...    # Your platform Stripe account ID

# Application URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### Getting Stripe Credentials

1. **Secret Key**: Dashboard → Developers → API Keys → Secret key
2. **Webhook Secret**: Dashboard → Developers → Webhooks → Add endpoint → Signing secret
3. **Connect Client ID**: Dashboard → Settings → Connect settings → Client ID
4. **Platform Account ID**: Dashboard → Settings → Account details → Account ID

## Platform Fees

Fees are automatically calculated based on the tenant's pricing tier:

| Tier   | Platform Fee | Description                    |
|--------|--------------|--------------------------------|
| Free   | 6%           | Free tier with highest fee     |
| Growth | 2.5%         | Growth tier with reduced fee   |
| Pro    | 0.5%         | Pro tier with minimal fee      |
| Scale  | 0%           | Enterprise tier with no fee    |

**Note**: Stripe's processing fees (2.9% + $0.30) are separate and apply to all transactions.

## Stripe Connect Flow

### 1. Onboarding Flow

```typescript
// 1. Tenant clicks "Connect Stripe" button
// 2. Frontend calls POST /api/stripe/connect/onboard
// 3. Backend creates Express account if needed
// 4. Returns onboarding link
// 5. Tenant redirects to Stripe
// 6. Tenant completes onboarding
// 7. Stripe redirects back to return_url
// 8. Frontend checks account status
```

### 2. Payment Flow

```typescript
// 1. Customer selects bounce house and books
// 2. Frontend calls POST /api/stripe/checkout/create-session
// 3. Backend calculates fees and creates session
// 4. Customer redirects to Stripe Checkout
// 5. Customer completes payment
// 6. Stripe sends webhook to /api/stripe/webhook
// 7. Backend processes webhook and updates booking
// 8. Customer redirects to success page
```

## API Endpoints

### Connect Endpoints

#### Create Onboarding Link
```
POST /api/stripe/connect/onboard
Authorization: Bearer <token>
```

Response:
```json
{
  "url": "https://connect.stripe.com/...",
  "expiresAt": 1234567890
}
```

#### Get Account Status
```
GET /api/stripe/connect/status
Authorization: Bearer <token>
```

Response:
```json
{
  "connected": true,
  "id": "acct_...",
  "status": "active",
  "detailsSubmitted": true,
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "requirements": {
    "currentlyDue": [],
    "eventuallyDue": [],
    "pastDue": []
  }
}
```

#### Disconnect Account
```
POST /api/stripe/connect/disconnect
Authorization: Bearer <token>
```

### Checkout Endpoints

#### Create Checkout Session
```
POST /api/stripe/checkout/create-session
Content-Type: application/json
```

Body:
```json
{
  "tenantId": "tenant_123",
  "bookingId": "booking_456",
  "amount": 25000,
  "depositPercentage": 50,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "description": "Bounce House Rental - Princess Castle",
  "metadata": {
    "eventDate": "2024-06-15",
    "itemId": "item_789"
  }
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Get Session Details
```
GET /api/stripe/checkout/session/:sessionId
```

### Webhook Endpoint

#### Handle Webhook Events
```
POST /api/stripe/webhook
Stripe-Signature: <signature>
Content-Type: application/json
```

**Important**: This endpoint requires raw body parsing. Configure in Next.js:

```typescript
export const config = {
  api: {
    bodyParser: false,
  },
}
```

## Webhook Events

Configure these events in your Stripe webhook settings:

- `checkout.session.completed` - Payment completed
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed
- `account.updated` - Connect account status changed
- `account.application.deauthorized` - Account disconnected

## Payment Calculation Example

For a $250.00 booking on the Growth tier (2.5% platform fee):

```typescript
import { calculatePayment } from './fees'

const payment = calculatePayment(25000, 'growth', 50)
// {
//   subtotal: 25000,        // $250.00
//   platformFee: 625,       // $6.25 (2.5%)
//   stripeFee: 755,         // $7.55 (2.9% + $0.30)
//   total: 25000,           // $250.00
//   tenantReceives: 23620,  // $236.20
//   depositAmount: 12500    // $125.00 (50% deposit)
// }
```

## Security Considerations

1. **Webhook Signatures**: Always verify webhook signatures using `constructWebhookEvent()`
2. **Authentication**: All endpoints except webhook require user authentication
3. **Authorization**: Tenants can only access their own Stripe accounts
4. **Field Access**: Stripe fields are read-only and restricted to admins
5. **API Keys**: Never expose secret keys in frontend code

## Testing

Use Stripe test mode for development:

1. Use test API keys (start with `sk_test_`)
2. Use test webhook secret (start with `whsec_`)
3. Use test credit cards:
   - Success: `4242 4242 4242 4242`
   - Requires authentication: `4000 0025 0000 3155`
   - Declined: `4000 0000 0000 9995`

## Common Issues

### "Stripe account not connected"
- Tenant hasn't completed onboarding
- Check `stripeAccountStatus` field
- Generate new onboarding link

### "Account cannot accept charges"
- Onboarding incomplete
- Additional verification required
- Check `requirements` in account status

### "Webhook signature verification failed"
- Incorrect `STRIPE_WEBHOOK_SECRET`
- Body parser interfering (must use raw body)
- Request not from Stripe

## References

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Platform Fees](https://stripe.com/docs/connect/charges#application-fee-amounts)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
