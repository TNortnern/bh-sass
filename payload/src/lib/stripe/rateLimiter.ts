import rateLimit, { Request } from 'express-rate-limit'

/**
 * Extract tenant ID from request for per-tenant rate limiting
 * Supports both authenticated users and API keys
 */
function getTenantKeyGenerator(req: Request): string {
  // For authenticated users with tenantId in payload
  if ((req as any).user?.tenantId) {
    return `tenant_${(req as any).user.tenantId}`
  }

  // For API key authentication, extract from headers
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']
  if (apiKey) {
    // Use the API key itself as part of the limiter key
    const key = typeof apiKey === 'string' ? apiKey.replace('Bearer ', '') : ''
    return `apikey_${key.substring(0, 20)}`
  }

  // Fallback to IP for public endpoints
  return `ip_${req.ip}`
}

/**
 * Rate limiter for checkout session creation
 * 5 checkout sessions per minute per tenant to prevent abuse
 */
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 checkout sessions per minute per tenant
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many checkout attempts, please try again later',
})

/**
 * Rate limiter for refund attempts
 * 3 refund attempts per minute per tenant to prevent abuse
 */
export const refundLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 refund attempts per minute per tenant
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many refund attempts, please try again later',
})

/**
 * Rate limiter for Stripe webhooks
 * Higher limit for webhooks from Stripe (100 per minute per tenant)
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Higher for webhooks from Stripe
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many webhook requests, please try again later',
})

/**
 * Rate limiter for Stripe Connect onboarding
 * 10 attempts per minute per tenant
 */
export const connectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 attempts per minute per tenant
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many Stripe Connect attempts, please try again later',
})

/**
 * Rate limiter for subscription endpoints
 * 10 attempts per minute per tenant
 */
export const subscriptionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 attempts per minute per tenant
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many subscription attempts, please try again later',
})

/**
 * Rate limiter for general Stripe API endpoints
 * 20 requests per minute per tenant
 */
export const generalStripeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per tenant
  keyGenerator: getTenantKeyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
})
