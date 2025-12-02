# Stripe Connect - Quick Reference

## Platform Fee Rates

```typescript
free:   6%    // $250 booking = $15 platform fee
growth: 2.5%  // $250 booking = $6.25 platform fee
pro:    0.5%  // $250 booking = $1.25 platform fee
scale:  0%    // $250 booking = $0 platform fee
```

## API Endpoints Quick Reference

### Connect Account
```bash
# Create/get onboarding link
POST /api/stripe/connect/onboard
Headers: Authorization: Bearer {token}

# Refresh onboarding link
POST /api/stripe/connect/refresh
Headers: Authorization: Bearer {token}

# Get account status
GET /api/stripe/connect/status
Headers: Authorization: Bearer {token}

# Disconnect account
POST /api/stripe/connect/disconnect
Headers: Authorization: Bearer {token}
```

### Checkout
```bash
# Create session
POST /api/stripe/checkout/create-session
Content-Type: application/json
Body: {
  "tenantId": "string",
  "bookingId": "string",
  "amount": number,
  "depositPercentage": number?,
  "customerEmail": "string",
  "description": "string"
}

# Get session
GET /api/stripe/checkout/session/{sessionId}
```

### Webhook
```bash
# Handle webhooks (Stripe calls this)
POST /api/stripe/webhook
Headers: Stripe-Signature: {signature}
```

## Code Examples

### Calculate Fees
```typescript
import { calculatePayment } from '@/lib/stripe/fees'

const result = calculatePayment(
  25000,     // amount in cents
  'growth',  // pricing tier
  50         // deposit percentage (optional)
)
```

### Create Checkout
```typescript
const response = await fetch('/api/stripe/checkout/create-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tenantId: 'xyz',
    bookingId: 'abc',
    amount: 25000,
    depositPercentage: 50,
    customerEmail: 'customer@example.com',
    description: 'Bounce House Rental',
  }),
})

const { url } = await response.json()
window.location.href = url
```

### Check Account Status
```typescript
const response = await fetch('/api/stripe/connect/status', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
})

const status = await response.json()

if (status.connected && status.chargesEnabled) {
  // Ready to accept payments
}
```

## Tenant Collection Fields

```typescript
{
  stripeAccountId: string | null
  stripeAccountStatus: 'pending' | 'active' | 'restricted' | 'disabled' | null
  stripeDetailsSubmitted: boolean
  stripeChargesEnabled: boolean
  stripePayoutsEnabled: boolean
}
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_PLATFORM_ACCOUNT_ID=acct_...
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

## Test Cards

```
Success:         4242 4242 4242 4242
Auth Required:   4000 0025 0000 3155
Declined:        4000 0000 0000 9995
Expired:         4000 0000 0000 0069
```

## Webhook Events

Configure these in Stripe Dashboard:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `account.updated`
- `account.application.deauthorized`

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Stripe account not connected" | No onboarding | Call `/connect/onboard` |
| "Cannot accept charges" | Incomplete verification | Check account status |
| "Invalid signature" | Wrong webhook secret | Verify `STRIPE_WEBHOOK_SECRET` |
| "Missing required fields" | Invalid request body | Check API documentation |

## Payment Flow

```
1. Customer selects item
2. Frontend calls /checkout/create-session
3. Customer redirects to Stripe Checkout
4. Customer completes payment
5. Stripe sends webhook to /webhook
6. Backend updates booking status
7. Customer redirects to success page
```

## Fee Calculation Example

For a $250 booking on Growth tier (2.5%) with 50% deposit:

```
Booking Amount:    $250.00 (25000 cents)
Deposit (50%):     $125.00 (12500 cents)
Platform Fee:      $3.13   (313 cents, 2.5% of deposit)
Stripe Fee:        $3.93   (393 cents, 2.9% + $0.30 of deposit)
Tenant Receives:   $117.94 (11794 cents)
```

## Import Paths

```typescript
// Fee utilities
import {
  calculatePayment,
  calculatePlatformFee,
  formatCurrency,
} from '@/lib/stripe/fees'

// Client utilities
import {
  getStripeClient,
  constructWebhookEvent,
} from '@/lib/stripe/client'

// Types
import type {
  PricingTier,
  PaymentCalculation,
  StripeAccountStatus,
} from '@/lib/stripe/types'
```

## Production Checklist

- [ ] Switch to live API keys (sk_live_...)
- [ ] Create production webhook
- [ ] Update PAYLOAD_PUBLIC_SERVER_URL
- [ ] Test full payment flow
- [ ] Verify platform fees collected
- [ ] Monitor Stripe Dashboard
- [ ] Set up failure alerts

## Links

- [Full Integration Guide](../../../STRIPE_INTEGRATION.md)
- [Technical Docs](./README.md)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Connect Docs](https://stripe.com/docs/connect)
