# Stripe Subscription Sync Implementation

This document describes the Stripe subscription sync system that connects tenant subscriptions to Stripe.

## Overview

The subscription system manages SaaS billing for bounce house rental businesses using Stripe's subscription API. It includes:

1. **Backend webhook handlers** that sync Stripe subscription events to Payload
2. **API endpoints** for managing subscriptions
3. **Frontend composable** for subscription operations
4. **Real-time sync** via Stripe webhooks

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Stripe                                   │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  Subscriptions   │  │   Webhooks       │                     │
│  │  - created       │──│  - updated       │─────────┐           │
│  │  - updated       │  │  - deleted       │         │           │
│  │  - deleted       │  │  - invoice.paid  │         │           │
│  └──────────────────┘  └──────────────────┘         │           │
└─────────────────────────────────────────────────────│───────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Payload CMS Backend                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Webhook Handler (/api/stripe/webhook)                    │   │
│  │  - customer.subscription.created                         │   │
│  │  - customer.subscription.updated                         │   │
│  │  - customer.subscription.deleted                         │   │
│  │  - invoice.paid                                          │   │
│  │  - invoice.payment_failed                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Subscriptions Collection                                 │   │
│  │  - stripeSubscriptionId                                  │   │
│  │  - stripeCustomerId                                      │   │
│  │  - stripePriceId                                         │   │
│  │  - status (active, past_due, canceled, etc.)            │   │
│  │  - currentPeriodStart / currentPeriodEnd                │   │
│  │  - cancelAtPeriodEnd                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Endpoints                                            │   │
│  │  GET  /api/stripe/subscription                          │   │
│  │  POST /api/stripe/subscription/create                   │   │
│  │  POST /api/stripe/subscription/cancel                   │   │
│  │  GET  /api/stripe/portal                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Nuxt Frontend                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ useSubscription() Composable                             │   │
│  │  - getSubscription()                                     │   │
│  │  - createCheckoutSession()                               │   │
│  │  - cancelSubscription()                                  │   │
│  │  - getCustomerPortal()                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ /app/settings/billing.vue                                │   │
│  │  - Display current plan                                  │   │
│  │  - Upgrade/downgrade buttons                             │   │
│  │  - Link to Stripe Customer Portal                        │   │
│  │  - Payment history                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Collections Updated

### 1. Subscriptions Collection

**File:** `/payload/src/collections/Subscriptions.ts`

**New Fields:**
- `stripeSubscriptionId` (text, unique) - Stripe subscription ID
- `stripeCustomerId` (text) - Stripe customer ID
- `stripePriceId` (text) - Stripe price ID
- `canceledAt` (date) - When subscription was canceled
- `trialStart` (date) - Trial period start
- `trialEnd` (date) - Trial period end

**Updated Fields:**
- `status` - Added more Stripe statuses:
  - `incomplete` - Payment incomplete
  - `incomplete_expired` - Payment incomplete and expired
  - `unpaid` - Payment failed

### 2. Plans Collection

**File:** `/payload/src/collections/Plans.ts`

**New Fields:**
- `stripePriceId` (text) - Stripe Price ID to link plans to Stripe products

## Webhook Handlers

**File:** `/payload/src/endpoints/stripe/webhook.ts`

### customer.subscription.created
Creates a new subscription record in Payload when a customer subscribes.

**What it does:**
1. Extracts `tenantId` from subscription metadata
2. Finds the plan by `stripePriceId`
3. Creates subscription record with all Stripe data
4. Logs the creation

### customer.subscription.updated
Updates existing subscription when changes occur in Stripe.

**What it does:**
1. Finds existing subscription by `stripeSubscriptionId`
2. If not found, creates it instead (fallback)
3. Updates plan, status, periods, cancellation data
4. Logs the update

### customer.subscription.deleted
Marks subscription as canceled when deleted in Stripe.

**What it does:**
1. Finds existing subscription
2. Sets status to `canceled`
3. Sets `canceledAt` timestamp
4. Logs the deletion

### invoice.paid
Updates subscription status when invoice is paid.

**What it does:**
1. Finds subscription by Stripe subscription ID
2. If status was `past_due`, changes it to `active`
3. Logs the payment

### invoice.payment_failed
Updates subscription status when payment fails.

**What it does:**
1. Finds subscription by Stripe subscription ID
2. Sets status to `past_due`
3. Logs the failure

## API Endpoints

**File:** `/payload/src/endpoints/stripe/subscription.ts`

### GET /api/stripe/subscription
Get current subscription for authenticated tenant.

**Authentication:** Required (user must be logged in)

**Response:**
```json
{
  "subscription": {
    "id": "123",
    "tenantId": "456",
    "plan": "789",
    "status": "active",
    "stripeSubscriptionId": "sub_xxx",
    "currentPeriodEnd": "2025-02-01T00:00:00Z",
    ...
  },
  "stripeSubscription": {
    // Full Stripe subscription object
  }
}
```

### POST /api/stripe/subscription/create
Create Stripe Checkout session for new subscription.

**Authentication:** Required

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "successUrl": "https://app.example.com/billing?success=true",
  "cancelUrl": "https://app.example.com/billing?canceled=true"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

**What it does:**
1. Creates Stripe Checkout session for subscription
2. Sets metadata with `tenantId` and `userId`
3. Returns URL to redirect user to Stripe Checkout

### POST /api/stripe/subscription/cancel
Cancel current subscription.

**Authentication:** Required

**Request Body:**
```json
{
  "cancelAtPeriodEnd": true  // Optional, defaults to true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the billing period",
  "subscription": {
    // Updated Stripe subscription object
  }
}
```

**What it does:**
1. Finds current subscription
2. Cancels in Stripe (immediately or at period end)
3. Updates local record
4. Returns updated subscription

### GET /api/stripe/portal
Get Stripe Customer Portal link.

**Authentication:** Required

**Response:**
```json
{
  "url": "https://billing.stripe.com/p/session/xxx"
}
```

**What it does:**
1. Finds subscription with Stripe customer ID
2. Creates billing portal session
3. Returns URL to redirect user

## Frontend Integration

### Composable: useSubscription()

**File:** `/nuxt/app/composables/useSubscription.ts`

**Methods:**

#### getSubscription()
Fetches current subscription.

```typescript
const { getSubscription } = useSubscription()
const subscription = await getSubscription()
```

#### createCheckoutSession(priceId, successUrl?, cancelUrl?)
Creates checkout session and redirects to Stripe.

```typescript
const { createCheckoutSession } = useSubscription()
await createCheckoutSession('price_xxx')
// User is redirected to Stripe Checkout
```

#### cancelSubscription(cancelAtPeriodEnd?)
Cancels subscription.

```typescript
const { cancelSubscription } = useSubscription()
await cancelSubscription(true) // Cancel at period end
```

#### getCustomerPortal()
Opens Stripe Customer Portal.

```typescript
const { getCustomerPortal } = useSubscription()
await getCustomerPortal()
// User is redirected to Stripe billing portal
```

## Plan Tiers

From CLAUDE.md, the pricing tiers are:

| Tier   | Monthly | Transaction Fee       | Stripe Price ID (to configure) |
|--------|---------|----------------------|--------------------------------|
| Free   | $0      | 6% + Stripe fees     | price_free                     |
| Growth | $39/mo  | 2.5% + Stripe fees   | price_growth                   |
| Pro    | $99/mo  | 0.5% + Stripe fees   | price_pro                      |
| Scale  | $249/mo | 0% (Stripe only)     | price_scale                    |

**To configure:**
1. Create products and prices in Stripe Dashboard
2. Copy the Price IDs (format: `price_xxx`)
3. Update the Plans collection in Payload with the `stripePriceId` field
4. Use these IDs in the frontend billing page

## Setup Instructions

### 1. Configure Stripe Products

In your Stripe Dashboard:

1. Go to **Products** → **Add product**
2. Create products for each tier:
   - **Free Plan** - $0/month
   - **Growth Plan** - $39/month
   - **Pro Plan** - $99/month
   - **Scale Plan** - $249/month
3. For each product, copy the **Price ID** (starts with `price_`)

### 2. Update Plans in Payload

1. Go to Payload Admin: `http://localhost:3004/admin`
2. Navigate to **Plans** collection
3. For each plan, add the `stripePriceId`:
   - Free → `price_xxx` (your Free price ID)
   - Growth → `price_xxx` (your Growth price ID)
   - Pro → `price_xxx` (your Pro price ID)
   - Scale → `price_xxx` (your Scale price ID)

### 3. Configure Stripe Webhooks

In Stripe Dashboard:

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

### 4. Enable Customer Portal

In Stripe Dashboard:

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable the portal
3. Configure what customers can do:
   - ✅ Update payment method
   - ✅ View invoices
   - ✅ Cancel subscription
   - ✅ Update subscription (upgrade/downgrade)

### 5. Test the Integration

1. **Create a test subscription:**
   ```bash
   # Use Stripe test mode
   # Go to /app/settings/billing
   # Click "Upgrade Plan"
   # Use test card: 4242 4242 4242 4242
   ```

2. **Verify webhook:**
   ```bash
   # Check Payload logs
   docker compose logs -f payload

   # Should see:
   # "Received Stripe webhook: customer.subscription.created"
   # "Subscription created: { tenantId: '...', subscriptionId: '...' }"
   ```

3. **Test cancellation:**
   ```bash
   # Go to /app/settings/billing
   # Click "Cancel Subscription"
   # Verify webhook: customer.subscription.updated
   # Status should change to "canceled" with cancelAtPeriodEnd: true
   ```

## Subscription Lifecycle

### New Subscription Flow

1. User clicks "Upgrade to Pro" on billing page
2. Frontend calls `createCheckoutSession('price_pro')`
3. User redirected to Stripe Checkout
4. User enters payment info and confirms
5. Stripe sends `customer.subscription.created` webhook
6. Payload creates subscription record
7. User redirected back to app with `?success=true`
8. Frontend shows success message

### Update Subscription Flow

1. User clicks "Manage Subscription" on billing page
2. Frontend calls `getCustomerPortal()`
3. User redirected to Stripe Customer Portal
4. User updates plan or payment method
5. Stripe sends `customer.subscription.updated` webhook
6. Payload updates subscription record
7. User returns to app

### Cancel Subscription Flow

1. User clicks "Cancel Subscription" on billing page
2. Frontend shows confirmation modal
3. User confirms cancellation
4. Frontend calls `cancelSubscription(true)`
5. Stripe marks subscription with `cancel_at_period_end: true`
6. Stripe sends `customer.subscription.updated` webhook
7. Payload updates subscription with `cancelAtPeriodEnd: true`
8. At end of period, Stripe sends `customer.subscription.deleted`
9. Payload marks subscription as `canceled`

### Payment Failure Flow

1. Stripe attempts to charge customer
2. Payment fails
3. Stripe sends `invoice.payment_failed` webhook
4. Payload updates subscription status to `past_due`
5. Stripe retries payment (configured in Stripe settings)
6. If payment succeeds, sends `invoice.paid` webhook
7. Payload updates status back to `active`

## Environment Variables

Required in `.env`:

```bash
# Stripe API keys
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Stripe webhook secret
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Application URL for redirects
NEXT_PUBLIC_APP_URL=https://app.bouncepro.com
```

## Error Handling

All endpoints include:
- Authentication checks
- Tenant validation
- Stripe API error handling
- Detailed logging
- Toast notifications on frontend

**Example error response:**
```json
{
  "error": "Bad Request",
  "message": "No tenant associated with user"
}
```

## Monitoring

Monitor subscription events in:

1. **Stripe Dashboard**
   - Webhooks → View webhook attempts
   - Subscriptions → View all subscriptions

2. **Payload Admin**
   - Subscriptions collection
   - Audit Logs (if enabled)

3. **Application Logs**
   ```bash
   docker compose logs -f payload | grep -i subscription
   ```

## Security Considerations

1. **Webhook signature verification** - All webhooks verify Stripe signature
2. **Authentication required** - All subscription endpoints require login
3. **Tenant isolation** - Users can only access their tenant's subscription
4. **Read-only Stripe fields** - Stripe IDs are read-only in Payload admin
5. **Metadata for tracking** - Always include `tenantId` in Stripe metadata

## Testing

### Test Cards (Stripe Test Mode)

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

### Test Webhooks Locally

Use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3004/api/stripe/webhook

# Trigger test events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

## Troubleshooting

### Webhook not received

1. Check webhook endpoint is publicly accessible
2. Verify webhook secret matches `.env`
3. Check Stripe Dashboard → Webhooks → Attempts
4. Check Payload logs for errors

### Subscription not created

1. Check webhook handler logs
2. Verify `tenantId` is in subscription metadata
3. Check `stripePriceId` is configured in Plans collection
4. Verify plan exists in Payload

### Payment fails

1. Check Stripe Dashboard → Payments → Failed
2. Verify payment method is valid
3. Check customer has no outstanding balance
4. Review Stripe logs for decline reason

## Next Steps

To complete the billing page integration:

1. Update `/nuxt/app/pages/app/settings/billing.vue` to use real API
2. Replace mock data with `useSubscription()` composable
3. Add loading states during API calls
4. Handle success/error from query params (`?success=true`, `?canceled=true`)
5. Add invoice fetching from Stripe
6. Style with real plan data from Plans collection

## Files Modified/Created

### Backend (Payload)
- ✅ `/payload/src/collections/Subscriptions.ts` - Added Stripe fields
- ✅ `/payload/src/collections/Plans.ts` - Added stripePriceId
- ✅ `/payload/src/endpoints/stripe/webhook.ts` - Added subscription webhooks
- ✅ `/payload/src/endpoints/stripe/subscription.ts` - New subscription endpoints
- ✅ `/payload/src/endpoints/stripe-endpoints.ts` - Registered new endpoints
- ✅ `/payload/src/payload.config.ts` - Added endpoints to config

### Frontend (Nuxt)
- ✅ `/nuxt/app/composables/useSubscription.ts` - New composable
- ⏳ `/nuxt/app/pages/app/settings/billing.vue` - Needs update to use real API

### Documentation
- ✅ `/STRIPE_SUBSCRIPTION_SYNC.md` - This file

## Summary

The Stripe subscription sync system is now fully implemented and ready for testing. It provides:

- **Real-time sync** of subscription data from Stripe to Payload
- **Complete subscription management** via API endpoints
- **Frontend composable** for easy integration
- **Webhook handlers** for all subscription lifecycle events
- **Secure authentication** and tenant isolation

The only remaining task is updating the billing page to use the real API instead of mock data.
