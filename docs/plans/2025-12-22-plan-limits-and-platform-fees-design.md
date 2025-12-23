# Plan Limits & Platform Fee Tracking Design

**Date:** 2025-12-22
**Status:** Approved
**Priority:** Critical (Production launch this week)

---

## Overview

Build a complete, scalable plan management and financial tracking system for BouncePro SaaS:
1. Configurable plan limits (maxUsers, maxItems, maxBookings, transactionFee%)
2. Dynamic pricing page reflecting database values
3. Platform fee tracking for tax compliance and refunds
4. Test tenants for QA testing
5. Super admin revenue dashboard with real data

---

## Section 1: Data Architecture

### New Collection: PlatformTransactions

Tracks all platform fees from tenant payments for tax reporting and refund management.

**Key Design Decisions:**
- Immutable audit trail: refunds create new records with `originalTransactionId`
- Indexed for performance: `tenantId`, `stripePaymentIntentId`, `periodMonth`, `taxYear`
- `stripePaymentIntentId` is unique to prevent duplicates

```typescript
export const PlatformTransactions: CollectionConfig = {
  slug: 'platform-transactions',
  admin: {
    group: 'Finance',
    hidden: ({ user }) => user?.role !== 'super_admin',
    useAsTitle: 'stripePaymentIntentId',
    defaultColumns: ['type', 'tenantId', 'grossAmount', 'platformFee', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'super_admin',
    create: ({ req }) => req.user?.role === 'super_admin',
    update: ({ req }) => req.user?.role === 'super_admin',
    delete: ({ req }) => req.user?.role === 'super_admin',
  },
  fields: [
    // Transaction Type
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking Payment', value: 'booking_payment' },
        { label: 'Subscription Payment', value: 'subscription_payment' },
        { label: 'Refund', value: 'refund' },
        { label: 'Payout', value: 'payout' },
        { label: 'Adjustment', value: 'adjustment' },
      ],
    },
    // Relationships
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'bookingId',
      type: 'relationship',
      relationTo: 'bookings',
      admin: { condition: (data) => data?.type === 'booking_payment' || data?.type === 'refund' },
    },
    {
      name: 'subscriptionId',
      type: 'relationship',
      relationTo: 'subscriptions',
      admin: { condition: (data) => data?.type === 'subscription_payment' },
    },
    {
      name: 'originalTransactionId',
      type: 'relationship',
      relationTo: 'platform-transactions',
      admin: {
        description: 'For refunds: links to the original payment',
        condition: (data) => data?.type === 'refund',
      },
    },
    // Stripe References
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Stripe Payment Intent ID (pi_xxx)' },
    },
    {
      name: 'stripeChargeId',
      type: 'text',
      index: true,
      admin: { description: 'Stripe Charge ID (ch_xxx)' },
    },
    // Amounts (all in cents)
    {
      name: 'grossAmount',
      type: 'number',
      required: true,
      admin: { description: 'Total payment amount in cents' },
    },
    {
      name: 'stripeFee',
      type: 'number',
      required: true,
      admin: { description: 'Stripe processing fee in cents (2.9% + 30¢)' },
    },
    {
      name: 'platformFee',
      type: 'number',
      required: true,
      admin: { description: 'Our platform fee in cents' },
    },
    {
      name: 'platformFeePercent',
      type: 'number',
      required: true,
      admin: { description: 'Platform fee % at time of transaction' },
    },
    {
      name: 'netAmount',
      type: 'number',
      required: true,
      admin: { description: 'Amount tenant receives after all fees' },
    },
    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'completed',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Partially Refunded', value: 'partially_refunded' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    // Refund tracking
    {
      name: 'refundedAmount',
      type: 'number',
      admin: { description: 'Total amount refunded in cents' },
    },
    {
      name: 'refundedAt',
      type: 'date',
    },
    // Time period indexing (for reports)
    {
      name: 'periodMonth',
      type: 'text',
      index: true,
      admin: { description: 'YYYY-MM format for monthly reports' },
    },
    {
      name: 'periodYear',
      type: 'number',
      index: true,
    },
    {
      name: 'taxYear',
      type: 'number',
      index: true,
      admin: { description: 'Tax year for 1099-K reporting' },
    },
    // Metadata
    {
      name: 'metadata',
      type: 'json',
      admin: { description: 'Additional Stripe metadata' },
    },
  ],
  timestamps: true,
}
```

### Update: Payments Collection

Add `stripeFee` field to track Stripe's processing fee separately:

```typescript
{
  name: 'stripeFee',
  type: 'number',
  admin: { description: 'Stripe processing fee in cents' },
}
```

---

## Section 2: Backend Limit Enforcement

### Problem

Frontend shows "unlimited" users but backend enforces Free plan = 1 user. This indicates:
- Tenant's `plan` field may be stale/incorrect
- Or Plans collection data doesn't match seed data

### Solution

1. **Single source of truth**: Tenant's `plan` field is canonical
2. **Stripe webhook updates**: On `customer.subscription.created/updated`, update tenant.plan
3. **Consistent lookup**: Both frontend and backend fetch plan by tenant's plan slug

### Validation Points

All limits enforced in Payload hooks (already exists for users, need for items/bookings):
- `Users.beforeValidate`: Check maxUsers (EXISTS)
- `RentalItems.beforeValidate`: Check maxItems (ADD)
- `Bookings.beforeValidate`: Check maxBookings (ADD)

---

## Section 3: Dynamic Pricing API

### New Endpoint: `GET /api/plans/public`

Public endpoint (no auth) returns all active plans for pricing page:

```typescript
// nuxt/server/routes/api/plans/public.get.ts
export default defineEventHandler(async () => {
  const response = await $fetch('/api/plans', {
    baseURL: process.env.PAYLOAD_URL,
    query: {
      where: { isActive: { equals: true } },
      sort: 'price',
      limit: 10,
    },
  })

  return response.docs.map(plan => ({
    slug: plan.slug,
    name: plan.name,
    price: plan.price, // cents
    transactionFee: plan.transactionFee,
    limits: plan.limits,
    features: plan.features,
    featureFlags: plan.featureFlags,
    stripePriceId: plan.stripePriceId,
  }))
})
```

### Frontend Usage

```vue
<!-- LandingPricing.vue -->
<script setup>
const { data: plans } = await useFetch('/api/plans/public')
</script>
```

---

## Section 4: Stripe Connect & Platform Fees

### Application Fee Flow

1. Tenant's customer pays for booking via Stripe Checkout
2. Payment processed through tenant's Stripe Connect Express account
3. We take `application_fee_amount` = grossAmount × transactionFee%
4. Stripe takes their fee from tenant's portion
5. Create PlatformTransactions record

### Webhook Handler Update

```typescript
// In payment_intent.succeeded handler
const platformFeePercent = tenant.plan?.transactionFee || 6
const platformFee = Math.round(amount * (platformFeePercent / 100))
const stripeFee = Math.round(amount * 0.029) + 30 // 2.9% + 30¢
const netAmount = amount - platformFee - stripeFee

await payload.create({
  collection: 'platform-transactions',
  data: {
    type: 'booking_payment',
    tenantId: tenant.id,
    bookingId: booking?.id,
    stripePaymentIntentId: paymentIntent.id,
    stripeChargeId: paymentIntent.latest_charge,
    grossAmount: amount,
    stripeFee,
    platformFee,
    platformFeePercent,
    netAmount,
    status: 'completed',
    periodMonth: new Date().toISOString().slice(0, 7),
    periodYear: new Date().getFullYear(),
    taxYear: new Date().getFullYear(),
  },
})
```

---

## Section 5: Test Tenants

### Seeder Script

Creates 3 tenants with known credentials for QA testing:

| Tenant | Plan | Email | Password |
|--------|------|-------|----------|
| Free Test Co | free | free@test.bouncepro.com | Test123! |
| Pro Test Co | pro | pro@test.bouncepro.com | Test123! |
| Platinum Test Co | platinum | platinum@test.bouncepro.com | Test123! |

```typescript
// payload/scripts/seed-test-tenants.ts
const testTenants = [
  { name: 'Free Test Co', plan: 'free', email: 'free@test.bouncepro.com' },
  { name: 'Pro Test Co', plan: 'pro', email: 'pro@test.bouncepro.com' },
  { name: 'Platinum Test Co', plan: 'platinum', email: 'platinum@test.bouncepro.com' },
]
```

### Quick Login Buttons

Super admin dashboard shows quick-login buttons for each test tenant.

---

## Section 6: Revenue Dashboard

### Fix Reports Tenant ID

Replace hardcoded `TENANT_ID = 6` with dynamic extraction from authenticated user.

### Real Revenue Endpoint

```typescript
// GET /api/reports/revenue (super_admin only)
{
  mrr: 2900, // sum of active subscriptions
  platformFeesThisMonth: 15420, // sum from PlatformTransactions
  totalRevenue: 45670, // all time
  byTenant: [
    { tenant: 'Acme Rentals', mrr: 2900, platformFees: 5420, payments: [...] },
  ],
  failedPayments: [...],
  refunds: [...],
}
```

---

## Implementation Order

1. **PlatformTransactions collection** - Core data structure
2. **Add stripeFee to Payments** - Track Stripe fees
3. **Public plans API endpoint** - For dynamic pricing page
4. **Update pricing page** - Fetch from API
5. **Update Stripe webhook** - Record platform fees
6. **Fix report tenant IDs** - Use authenticated user's tenant
7. **Test tenant seeder** - QA testing accounts
8. **Revenue dashboard** - Real super admin data

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `payload/src/collections/PlatformTransactions.ts` | CREATE |
| `payload/src/payload.config.ts` | ADD PlatformTransactions |
| `payload/src/collections/Payments.ts` | ADD stripeFee field |
| `nuxt/server/routes/api/plans/public.get.ts` | CREATE |
| `nuxt/app/components/landing/LandingPricing.vue` | UPDATE to fetch |
| `payload/src/endpoints/stripe/webhook.ts` | UPDATE handler |
| `payload/scripts/seed-test-tenants.ts` | CREATE |
| `nuxt/server/routes/reports/revenue.get.ts` | FIX tenant ID |

---

## Verification Checklist

- [ ] PlatformTransactions records created on payments
- [ ] Plans editable in Payload Admin
- [ ] Public pricing page shows database values
- [ ] Team member limits enforced correctly
- [ ] Test tenants accessible via quick-login
- [ ] Revenue dashboard shows real data
- [ ] Refunds tracked properly
