# Stripe Rate Limits - Quick Reference

## Rate Limits by Endpoint Type

| Endpoint Type | Rate Limit | Purpose |
|--------------|------------|---------|
| **Checkout** | 5 req/min | Prevent checkout spam/fraud |
| **Refunds** | 3 req/min | Prevent refund abuse |
| **Webhooks** | 100 req/min | Allow Stripe webhook traffic |
| **Connect** | 10 req/min | Onboarding/disconnect protection |
| **Subscriptions** | 10 req/min | Subscription management |
| **General** | 20 req/min | Read operations |

## All Protected Endpoints

### Critical Financial Endpoints (Strictest Limits)

```
POST /api/stripe/checkout/create-session       (5/min)  ⚠️ CRITICAL
POST /api/stripe/payments/:id/refund           (3/min)  ⚠️ CRITICAL
POST /api/stripe/webhook                       (100/min) ⚠️ HIGH TRAFFIC
```

### Connect Endpoints

```
POST /api/stripe/connect/onboard               (10/min)
POST /api/stripe/connect/refresh               (10/min)
POST /api/stripe/connect/disconnect            (10/min)
GET  /api/stripe/connect/status                (20/min)
```

### Subscription Endpoints

```
GET  /api/stripe/subscription                  (10/min)
POST /api/stripe/subscription/create           (10/min)
POST /api/stripe/subscription/cancel           (10/min)
GET  /api/stripe/portal                        (10/min)
```

### Read Endpoints

```
GET  /api/stripe/checkout/session/:sessionId   (20/min)
GET  /api/stripe/payments/:id                  (20/min)
```

## Testing Rate Limits

### Checkout Limit Test (5/min)
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3004/api/stripe/checkout/create-session \
    -H "Content-Type: application/json" \
    -d '{"tenantId":"1","bookingId":"test","amount":1000,"customerEmail":"test@test.com"}'
  echo "Request $i"
done
```
Expected: Requests 1-5 succeed, 6-10 return 429

### Refund Limit Test (3/min)
```bash
for i in {1..5}; do
  curl -X POST http://localhost:3004/api/stripe/payments/1/refund \
    -H "Content-Type: application/json" \
    -d '{"amount":500}'
  echo "Request $i"
done
```
Expected: Requests 1-3 succeed, 4-5 return 429

## Rate Limit Response

When exceeded:
```json
{
  "error": "Too many requests",
  "message": "Too many [action] attempts, please try again later"
}
```
HTTP Status: **429 Too Many Requests**

## Response Headers

All responses include:
- `RateLimit-Limit`: Max requests in window
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Reset timestamp

## Adjusting Limits

Edit `/payload/src/lib/stripe/rateLimiter.ts`:

```typescript
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000,    // Time window
  max: 5,                  // Max requests
  // Change max value to adjust limit
})
```

## Files Modified

1. `/payload/src/lib/stripe/rateLimiter.ts` - Rate limiter configs
2. `/payload/src/endpoints/stripe-endpoints.ts` - Applied to endpoints
3. `/payload/package.json` - Added express-rate-limit

## IP Detection Priority

1. `X-Forwarded-For` header
2. `X-Real-IP` header
3. Fallback: 'unknown'

## Production Deployment

✅ Rate limiting is ACTIVE in development
✅ Will automatically apply in production
⚠️ Consider Redis-backed store for multi-server deployments

## Monitoring

Watch for these in logs:
- 429 responses by endpoint
- IPs hitting limits repeatedly
- Time-of-day patterns
- Correlation with security events

## Emergency Rollback

To disable (NOT recommended):
```typescript
// In stripe-endpoints.ts, change:
handler: withRateLimit(checkoutLimiter, createCheckoutSession)
// To:
handler: createCheckoutSession
```

## Security Status

🛡️ **DDoS Protection**: ENABLED
🛡️ **Abuse Prevention**: ACTIVE
🛡️ **Fraud Protection**: DEPLOYED
🛡️ **Cost Control**: IMPLEMENTED
