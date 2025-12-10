# Stripe Logging Sanitization

**Date:** 2025-12-10
**Status:** COMPLETED

## Overview

Removed all sensitive data from Stripe endpoint logging to ensure PCI/PII compliance.

## Critical Issue Resolved

Full Stripe objects and payment metadata were being logged without sanitization, creating compliance violations.

## Files Modified

### 1. `/payload/src/endpoints/stripe/webhook.ts`

**Changes:**
- ✅ Removed `metadata` from checkout session logging (line 156-161)
- ✅ Removed `transferData` from payment intent logging (line 203-209)
- ✅ Removed `lastPaymentError` full object, kept only `errorCode` (line 240-244)
- ✅ Sanitized all error logging - changed from full error objects to `{ type: error.name }` pattern
- ✅ Removed full error messages from API responses - replaced with generic messages

**Handlers Sanitized:**
- `handleCheckoutSessionCompleted()`
- `handlePaymentIntentSucceeded()`
- `handlePaymentIntentFailed()`
- `handleAccountUpdated()`
- `handleAccountDeauthorized()`
- `handleSubscriptionCreated()`
- `handleSubscriptionUpdated()`
- `handleSubscriptionDeleted()`
- `handleInvoicePaid()`
- `handleInvoicePaymentFailed()`

### 2. `/payload/src/endpoints/stripe/checkout.ts`

**Changes:**
- ✅ Removed `customerEmail` from session retrieval response (line 227-234)
- ✅ Removed `metadata` from session retrieval response (line 227-234)
- ✅ Sanitized error logging in `createCheckoutSession()` (line 189-199)
- ✅ Sanitized error logging in `getCheckoutSession()` (line 236-246)
- ✅ Removed error messages from API responses

### 3. `/payload/src/endpoints/stripe/refund.ts`

**Changes:**
- ✅ Sanitized error logging in `refundPayment()` (line 197-207)
- ✅ Sanitized error logging in `getPayment()` (line 341-351)
- ✅ Sanitized Stripe data fetch error logging (line 297-300)
- ✅ Removed error messages from API responses

### 4. `/payload/src/endpoints/stripe/connect.ts`

**Changes:**
- ✅ Sanitized error logging in `onboardStripeConnect()` (line 120-130)
- ✅ Sanitized error logging in `refreshOnboardingLink()` (line 204-214)
- ✅ Removed error messages from API responses

## Logging Pattern Changes

### Before (WRONG - Compliance Violation)

```typescript
console.log('Checkout session completed:', {
  sessionId: session.id,
  bookingId,
  amount: session.amount_total,
  metadata: session.metadata,  // ❌ May contain sensitive data
  customer: session.customer_email  // ❌ PII
})

console.error('Stripe error:', error)  // ❌ Full error object may contain secrets

const message = error instanceof Error ? error.message : 'Unknown error'
return Response.json({
  message: `Failed: ${message}`  // ❌ May expose internal details
})
```

### After (CORRECT - Compliant)

```typescript
console.log('Checkout session completed:', {
  sessionId: session.id,
  bookingId,
  amount: session.amount_total,
  paymentStatus: session.payment_status
  // ✅ Never log metadata, customer email, or full objects
})

console.error('Stripe error:', {
  type: error instanceof Error ? error.name : 'Unknown'
  // ✅ Only log error type, never message (may contain secrets)
})

return Response.json({
  error: 'Internal Server Error',
  message: 'Failed to create checkout session'
  // ✅ Generic message, no internal details
})
```

## Compliance Rules Applied

### ✅ Safe to Log
- Session IDs, Payment Intent IDs, Booking IDs
- Amounts, status values, timestamps
- Error types (error.name)
- Boolean flags (chargesEnabled, payoutsEnabled)

### ❌ Never Log
- Full error objects or error messages (may contain API keys)
- Customer email addresses (PII)
- Payment metadata (may contain sensitive customer data)
- Full Stripe objects (may contain PII)
- Transfer data details
- Last payment error messages (may contain sensitive info)

## Security Benefits

1. **PCI Compliance:** No payment metadata or customer PII in logs
2. **Data Privacy:** No customer emails or personal information exposed
3. **Secret Protection:** Error messages can't leak API keys or credentials
4. **Audit Trail:** Still maintain useful logging for debugging (IDs, amounts, statuses)

## Testing Recommendations

To verify the changes:

1. Trigger a checkout session creation
2. Check logs - should NOT contain customer email or metadata
3. Trigger an error (invalid API key)
4. Check error logs - should only show error type, not full message
5. Review all Stripe webhook events - verify no sensitive data in logs

## Future Maintenance

When adding new Stripe endpoints:

1. ✅ Log: IDs, amounts, statuses, timestamps
2. ❌ Don't log: metadata, customer data, full objects, error messages
3. Always use: `{ type: error instanceof Error ? error.name : 'Unknown' }` for error logging
4. Never expose internal error details in API responses

## References

- PCI DSS 3.2.1 - Requirement 3 (Protect Stored Cardholder Data)
- GDPR Article 32 (Security of Processing)
- Stripe Best Practices: https://stripe.com/docs/security/best-practices
