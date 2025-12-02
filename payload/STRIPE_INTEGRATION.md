# Stripe Connect Integration Guide

Complete implementation guide for the BouncePro Stripe Connect integration.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)

---

## Overview

This integration implements **Stripe Connect Express accounts** for multi-tenant payment processing. Each tenant gets their own Stripe account, and the platform collects fees based on the tenant's pricing tier.

### Key Features

- Multi-tenant payment processing via Stripe Connect
- Tiered platform fees (0% - 6% based on plan)
- Full deposit or partial deposit support
- Automatic account status synchronization via webhooks
- Production-ready error handling and validation

### Platform Fee Structure

| Tier   | Monthly Cost | Platform Fee | Use Case              |
|--------|--------------|--------------|------------------------|
| Free   | $0           | 6%           | Testing/small volume   |
| Growth | $49          | 2.5%         | Growing businesses     |
| Pro    | $149         | 0.5%         | Established businesses |
| Scale  | $499         | 0%           | High-volume operations |

**Note**: Stripe's standard processing fees (2.9% + $0.30) apply to all transactions.

---

## Setup Instructions

### 1. Install Dependencies

Already completed - Stripe SDK is installed.

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Stripe credentials:

```bash
cp .env.example .env
```

Required Stripe variables:
```bash
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_PLATFORM_ACCOUNT_ID=acct_...
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### 3. Get Stripe Credentials

#### 3.1 Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers → API Keys**
3. Copy the **Secret key** (starts with `sk_test_` for test mode)

#### 3.2 Webhook Secret
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `account.application.deauthorized`
5. Copy the **Signing secret** (starts with `whsec_`)

#### 3.3 Connect Client ID
1. Go to **Settings → Connect settings**
2. Copy the **Client ID** (starts with `ca_`)

#### 3.4 Platform Account ID
1. Go to **Settings → Account details**
2. Copy the **Account ID** (starts with `acct_`)

### 4. Database Migration

The Stripe fields have been added to the Tenants collection. Run Payload to auto-sync the schema:

```bash
pnpm dev
```

Payload will automatically push schema changes to your database.

---

## API Endpoints

### Connect Endpoints

#### 1. Onboard Stripe Connect Account

**POST** `/api/stripe/connect/onboard`

Creates a Stripe Connect Express account and returns an onboarding link.

**Authentication**: Required (Tenant Admin)

**Response**:
```json
{
  "url": "https://connect.stripe.com/express/oauth/authorize?...",
  "expiresAt": 1234567890
}
```

**Usage**:
```typescript
const response = await fetch('/api/stripe/connect/onboard', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe
```

#### 2. Refresh Onboarding Link

**POST** `/api/stripe/connect/refresh`

Generates a new onboarding link if the previous one expired.

**Authentication**: Required (Tenant Admin)

#### 3. Get Account Status

**GET** `/api/stripe/connect/status`

Retrieves the current status of the tenant's Stripe Connect account.

**Authentication**: Required (Tenant Admin)

**Response**:
```json
{
  "connected": true,
  "id": "acct_1234567890",
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

**Usage**:
```typescript
const response = await fetch('/api/stripe/connect/status', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
})

const status = await response.json()

if (status.connected && status.chargesEnabled) {
  // Ready to accept payments
} else {
  // Need to complete onboarding
}
```

#### 4. Disconnect Account

**POST** `/api/stripe/connect/disconnect`

Removes the Stripe Connect account from the tenant.

**Authentication**: Required (Tenant Admin)

### Checkout Endpoints

#### 5. Create Checkout Session

**POST** `/api/stripe/checkout/create-session`

Creates a Stripe Checkout session for a booking.

**Authentication**: Not required (public endpoint)

**Request Body**:
```json
{
  "tenantId": "tenant_123",
  "bookingId": "booking_456",
  "amount": 25000,
  "depositPercentage": 50,
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "description": "Princess Castle Bounce House",
  "metadata": {
    "eventDate": "2024-06-15",
    "itemId": "item_789"
  }
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Usage**:
```typescript
const response = await fetch('/api/stripe/checkout/create-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tenantId: 'tenant_123',
    bookingId: 'booking_456',
    amount: 25000, // $250.00 in cents
    depositPercentage: 50, // 50% deposit
    customerEmail: 'customer@example.com',
    description: 'Bounce House Rental',
  }),
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe Checkout
```

#### 6. Get Checkout Session

**GET** `/api/stripe/checkout/session/:sessionId`

Retrieves checkout session details after payment.

**Response**:
```json
{
  "id": "cs_test_...",
  "status": "complete",
  "paymentStatus": "paid",
  "amountTotal": 12500,
  "currency": "usd",
  "customerEmail": "customer@example.com",
  "metadata": { ... }
}
```

### Webhook Endpoint

#### 7. Stripe Webhook Handler

**POST** `/api/stripe/webhook`

Receives and processes Stripe webhook events.

**Headers**: `Stripe-Signature` (automatically added by Stripe)

**Events Handled**:
- `checkout.session.completed` - Payment completed
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed
- `account.updated` - Connect account status changed
- `account.application.deauthorized` - Account disconnected

---

## Frontend Integration

### React Example: Connect Flow

```typescript
import { useState } from 'react'

export function StripeConnectButton() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  // Check current status
  async function checkStatus() {
    const response = await fetch('/api/stripe/connect/status', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
    const data = await response.json()
    setStatus(data)
  }

  // Start onboarding
  async function connectStripe() {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Failed to create onboarding link:', error)
      setLoading(false)
    }
  }

  return (
    <div>
      {status?.connected ? (
        <div>
          <p>✓ Stripe Connected</p>
          <p>Status: {status.status}</p>
          {status.chargesEnabled ? (
            <p>✓ Ready to accept payments</p>
          ) : (
            <p>⚠ Complete onboarding to accept payments</p>
          )}
        </div>
      ) : (
        <button onClick={connectStripe} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Stripe'}
        </button>
      )}
    </div>
  )
}
```

### React Example: Checkout Flow

```typescript
export function CheckoutButton({ booking }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: booking.tenantId,
          bookingId: booking.id,
          amount: booking.totalPrice,
          depositPercentage: 50,
          customerEmail: booking.customerEmail,
          description: booking.itemName,
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout failed:', error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with Stripe'}
    </button>
  )
}
```

### Success Page

After successful payment, Stripe redirects to your success URL with the session ID:

```typescript
// pages/booking/success.tsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BookingSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe/checkout/session/${sessionId}`)
        .then(res => res.json())
        .then(setSession)
    }
  }, [sessionId])

  if (!session) return <div>Loading...</div>

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Amount paid: ${session.amountTotal / 100}</p>
      <p>Confirmation email sent to: {session.customerEmail}</p>
    </div>
  )
}
```

---

## Testing

### Test Mode

Use Stripe's test mode for development:

1. Use test API keys (start with `sk_test_`)
2. Use test Connect accounts
3. Use test credit cards

### Test Credit Cards

| Card Number         | Scenario                  |
|---------------------|---------------------------|
| 4242 4242 4242 4242 | Successful payment        |
| 4000 0025 0000 3155 | Requires authentication   |
| 4000 0000 0000 9995 | Declined (insufficient)   |
| 4000 0000 0000 0069 | Expired card              |

Use any future expiration date and any 3-digit CVC.

### Testing Platform Fees

```typescript
import { calculatePayment } from './src/lib/stripe/fees'

// Test Free tier (6% fee)
const freeResult = calculatePayment(25000, 'free', 50)
console.log('Free tier:', {
  total: freeResult.total, // $250.00
  platformFee: freeResult.platformFee, // $15.00 (6%)
  deposit: freeResult.depositAmount, // $125.00 (50%)
})

// Test Growth tier (2.5% fee)
const growthResult = calculatePayment(25000, 'growth', 50)
console.log('Growth tier:', {
  total: growthResult.total, // $250.00
  platformFee: growthResult.platformFee, // $6.25 (2.5%)
  deposit: growthResult.depositAmount, // $125.00 (50%)
})
```

### Manual Testing Checklist

- [ ] Tenant can initiate Stripe onboarding
- [ ] Tenant completes Stripe onboarding flow
- [ ] Account status updates correctly
- [ ] Cannot create checkout before onboarding complete
- [ ] Checkout session creates successfully
- [ ] Payment completes and webhook fires
- [ ] Platform fee is calculated correctly
- [ ] Tenant receives correct amount in their account
- [ ] Account disconnect works properly

---

## Production Deployment

### Pre-Launch Checklist

1. **Switch to Live Mode**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... # Create new webhook for production
   ```

2. **Update Webhook Endpoint**
   - Create new webhook for production URL
   - Use production domain: `https://api.yourdomain.com/api/stripe/webhook`

3. **Verify Environment Variables**
   ```bash
   # All should start with live mode prefixes
   echo $STRIPE_SECRET_KEY # Should start with sk_live_
   ```

4. **Test Production Onboarding**
   - Complete full Connect onboarding with real business
   - Verify account appears in Stripe Dashboard

5. **Test Production Payment**
   - Make a real payment (you can refund it)
   - Verify webhook fires correctly
   - Verify platform fee is deducted
   - Verify transfer to Connect account

### Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** (already implemented)
3. **Use HTTPS** for all API endpoints
4. **Rotate keys** if compromised
5. **Monitor webhook failures** in Stripe Dashboard
6. **Set up alerts** for failed transfers or disputes

### Monitoring

Monitor these in Stripe Dashboard:

- **Failed webhooks**: Developers → Webhooks → View failures
- **Connect account issues**: Connect → Accounts → Filter by status
- **Platform fee collection**: Reports → Balance → Filter by fees
- **Transfers to Connect accounts**: Balance → Transfers

### Support Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Express Accounts Guide](https://stripe.com/docs/connect/express-accounts)
- [Platform Fees](https://stripe.com/docs/connect/charges#application-fee-amounts)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Stripe Support](https://support.stripe.com/)

---

## Troubleshooting

### "Stripe account not connected"
**Cause**: Tenant hasn't completed onboarding
**Solution**: Generate new onboarding link via `/api/stripe/connect/refresh`

### "Account cannot accept charges"
**Cause**: Incomplete verification
**Solution**: Check `requirements` in account status, complete missing items

### "Webhook signature verification failed"
**Cause**: Incorrect webhook secret or body parsing
**Solution**:
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure raw body parsing is enabled for webhook endpoint

### Platform fee not appearing
**Cause**: Incorrect fee calculation
**Solution**: Verify tenant's plan tier matches fee structure

### Transfer to Connect account failed
**Cause**: Account not verified or payouts disabled
**Solution**: Check account status via `/api/stripe/connect/status`

---

## Next Steps

1. **Implement Bookings Collection**: Update webhook handlers to modify booking records
2. **Add Email Notifications**: Send confirmation emails on successful payment
3. **Create Admin Dashboard**: View platform fee collection and transfers
4. **Add Refund Support**: Implement refund API for cancellations
5. **Implement Disputes**: Handle chargebacks and disputes
6. **Add Payment Methods**: Support additional payment methods (ACH, etc.)

---

For questions or issues, refer to the README.md in `/src/lib/stripe/` or contact the development team.
