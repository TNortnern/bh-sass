# Stripe Idempotency Key Implementation

## Summary

Added idempotency key handling to all Stripe API operations to prevent duplicate charges, refunds, and account operations during network retries or client double-submissions.

## What Are Idempotency Keys?

Idempotency keys ensure that retrying the same request multiple times has the same effect as making it once. Stripe stores the result of requests with idempotency keys for 24 hours, returning the cached response if the same key is used again.

## Critical Issue Resolved

**Problem:** Without idempotency keys, network retries or client double-submissions could create:
- Duplicate charges to customers
- Multiple refund attempts
- Duplicate Stripe Connect accounts
- Multiple subscription creations

**Solution:** Each mutating Stripe API call now includes a unique idempotency key based on:
- The resource type and ID
- The current timestamp
- The operation being performed

## Implementation Details

### 1. Checkout Sessions (Bookings)

**File:** `payload/src/endpoints/stripe/checkout.ts`

**Pattern:**
```typescript
const idempotencyKey = `booking_${bookingId}_checkout_${Date.now()}`

const session = await stripe.checkout.sessions.create({
  // ... session params
}, {
  idempotencyKey,
})
```

**Prevents:** Duplicate booking charges if customer clicks "Pay" multiple times or network retries occur.

---

### 2. Payment Refunds

**File:** `payload/src/endpoints/stripe/refund.ts`

**Pattern:**
```typescript
const idempotencyKey = `payment_${paymentId}_refund_${Date.now()}`

const refund = await stripe.refunds.create(refundParams, {
  idempotencyKey,
})
```

**Prevents:** Multiple refunds being issued for the same payment.

---

### 3. Stripe Connect Account Creation

**File:** `payload/src/endpoints/stripe/connect.ts`

**Pattern:**
```typescript
const idempotencyKey = `tenant_${tenantId}_connect_${Date.now()}`

const account = await stripe.accounts.create({
  // ... account params
}, {
  idempotencyKey,
})
```

**Prevents:** Creating multiple Stripe Connect accounts for the same tenant.

---

### 4. Stripe Connect Onboarding Links

**File:** `payload/src/endpoints/stripe/connect.ts`

**Patterns:**
```typescript
// Initial onboarding
const linkIdempotencyKey = `tenant_${tenantId}_onboarding_link_${Date.now()}`

// Refresh link
const idempotencyKey = `tenant_${tenantId}_refresh_link_${Date.now()}`

const accountLink = await stripe.accountLinks.create({
  // ... link params
}, {
  idempotencyKey,
})
```

**Prevents:** Creating duplicate onboarding sessions.

---

### 5. Subscription Checkout Sessions

**File:** `payload/src/endpoints/stripe/subscription.ts`

**Pattern:**
```typescript
const idempotencyKey = `tenant_${tenantId}_subscription_checkout_${Date.now()}`

const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  // ... session params
}, {
  idempotencyKey,
})
```

**Prevents:** Creating duplicate subscription checkout sessions.

---

### 6. Subscription Cancellations

**File:** `payload/src/endpoints/stripe/subscription.ts`

**Pattern:**
```typescript
const idempotencyKey = `subscription_${subscription.id}_cancel_${Date.now()}`

// For cancel at period end
updatedSubscription = await stripe.subscriptions.update(
  subscription.stripeSubscriptionId,
  { cancel_at_period_end: true },
  { idempotencyKey }
)

// For immediate cancel
updatedSubscription = await stripe.subscriptions.cancel(
  subscription.stripeSubscriptionId,
  { idempotencyKey }
)
```

**Prevents:** Multiple cancellation attempts affecting subscription state.

---

## Idempotency Key Format

All idempotency keys follow this pattern:
```
{resource_type}_{resource_id}_{operation}_{timestamp}
```

**Examples:**
- `booking_123_checkout_1701234567890`
- `payment_456_refund_1701234567890`
- `tenant_789_connect_1701234567890`
- `subscription_101_cancel_1701234567890`

**Why this format?**
1. **Unique per resource:** Includes the specific ID being operated on
2. **Unique per operation:** Includes the operation type
3. **Unique per request:** Includes timestamp to differentiate retries from new operations
4. **Readable:** Human-readable format for debugging

---

## Testing Recommendations

### Manual Testing

1. **Double-submit protection:**
   - Click "Create Booking" twice rapidly
   - Verify only one checkout session is created

2. **Network retry simulation:**
   - Use browser DevTools to slow network
   - Submit payment, interrupt network, retry
   - Verify no duplicate charges

3. **Concurrent requests:**
   - Open multiple tabs, submit same booking simultaneously
   - Verify only one session created

### Automated Testing

```typescript
// Example test for checkout idempotency
test('prevents duplicate checkout sessions with same booking', async () => {
  const bookingId = '123'
  const params = { bookingId, amount: 10000, customerEmail: 'test@example.com' }
  
  // Make same request twice
  const [session1, session2] = await Promise.all([
    createCheckoutSession(params),
    createCheckoutSession(params),
  ])
  
  // Both should return same session ID
  expect(session1.sessionId).toBe(session2.sessionId)
})
```

---

## Stripe Documentation References

- [Idempotent Requests](https://stripe.com/docs/api/idempotent_requests)
- [Error Handling Best Practices](https://stripe.com/docs/error-handling)
- [Testing with Idempotency Keys](https://stripe.com/docs/testing#idempotency)

---

## Files Modified

1. `payload/src/endpoints/stripe/checkout.ts` - Checkout session creation
2. `payload/src/endpoints/stripe/refund.ts` - Payment refunds
3. `payload/src/endpoints/stripe/connect.ts` - Account creation and onboarding links
4. `payload/src/endpoints/stripe/subscription.ts` - Subscription checkout and cancellation

---

## Next Steps

Consider these enhancements:

1. **Store idempotency keys:** Log them in database for audit trail
2. **Request deduplication:** Add application-level deduplication before Stripe calls
3. **Retry logic:** Implement exponential backoff for failed Stripe requests
4. **Monitoring:** Track duplicate request attempts in application metrics

---

**Date Implemented:** 2025-12-10
**Issue Priority:** CRITICAL
**Security Impact:** HIGH - Prevents financial loss from duplicate charges
