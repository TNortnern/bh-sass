// Lazy-load express-rate-limit to avoid Next.js bundling Express middleware at build time
// This module is only needed at runtime when requests are actually processed
let rateLimitModule: any = null

function getRateLimitModule() {
  if (!rateLimitModule) {
    // Use require() instead of import to defer loading until runtime
    // This prevents Next.js from trying to bundle express-rate-limit at build time
    rateLimitModule = require('express-rate-limit')
    // Handle both default export and named export patterns
    return rateLimitModule.default || rateLimitModule
  }
  return rateLimitModule
}

/**
 * Normalize IPv6 addresses to handle IPv6 rate limiting properly
 * Converts IPv4-mapped IPv6 addresses back to IPv4 format
 */
function normalizeIP(ip: string | undefined): string {
  if (!ip) return 'unknown'

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1)
  if (ip.startsWith('::ffff:')) {
    return ip.slice(7)
  }

  // Handle localhost
  if (ip === '::1') {
    return '127.0.0.1'
  }

  return ip
}

/**
 * Extract tenant ID from request for per-tenant rate limiting
 * Supports both authenticated users and API keys
 */
function getTenantKeyGenerator(req: any): string {
  // For authenticated users with tenantId in payload
  if (req.user?.tenantId) {
    return `tenant_${req.user.tenantId}`
  }

  // For API key authentication, extract from headers
  const apiKey = req.headers?.['x-api-key'] || req.headers?.['authorization']
  if (apiKey) {
    // Use the API key itself as part of the limiter key
    const key = typeof apiKey === 'string' ? apiKey.replace('Bearer ', '') : ''
    return `apikey_${key.substring(0, 20)}`
  }

  // Fallback to IP for public endpoints, properly normalized
  const ip = normalizeIP(req.ip || req.socket?.remoteAddress)
  return `ip_${ip}`
}

/**
 * Create rate limiters lazily on first use
 * This ensures express-rate-limit is only loaded at runtime, not during Next.js build
 */
let _checkoutLimiter: any = null
let _refundLimiter: any = null
let _webhookLimiter: any = null
let _connectLimiter: any = null
let _subscriptionLimiter: any = null
let _generalStripeLimiter: any = null

/**
 * Rate limiter for checkout session creation
 * 5 checkout sessions per minute per tenant to prevent abuse
 */
export const checkoutLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_checkoutLimiter) {
      const rateLimit = getRateLimitModule()
      _checkoutLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 5, // 5 checkout sessions per minute per tenant
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many checkout attempts, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _checkoutLimiter(req, res, next)
  }
}

/**
 * Rate limiter for refund attempts
 * 3 refund attempts per minute per tenant to prevent abuse
 */
export const refundLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_refundLimiter) {
      const rateLimit = getRateLimitModule()
      _refundLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 3, // 3 refund attempts per minute per tenant
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many refund attempts, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _refundLimiter(req, res, next)
  }
}

/**
 * Rate limiter for Stripe webhooks
 * Higher limit for webhooks from Stripe (100 per minute per tenant)
 */
export const webhookLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_webhookLimiter) {
      const rateLimit = getRateLimitModule()
      _webhookLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100, // Higher for webhooks from Stripe
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many webhook requests, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _webhookLimiter(req, res, next)
  }
}

/**
 * Rate limiter for Stripe Connect onboarding
 * 10 attempts per minute per tenant
 */
export const connectLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_connectLimiter) {
      const rateLimit = getRateLimitModule()
      _connectLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 10, // 10 attempts per minute per tenant
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many Stripe Connect attempts, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _connectLimiter(req, res, next)
  }
}

/**
 * Rate limiter for subscription endpoints
 * 10 attempts per minute per tenant
 */
export const subscriptionLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_subscriptionLimiter) {
      const rateLimit = getRateLimitModule()
      _subscriptionLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 10, // 10 attempts per minute per tenant
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many subscription attempts, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _subscriptionLimiter(req, res, next)
  }
}

/**
 * Rate limiter for general Stripe API endpoints
 * 20 requests per minute per tenant
 */
export const generalStripeLimiter = {
  use: function(req: any, res: any, next: any) {
    if (!_generalStripeLimiter) {
      const rateLimit = getRateLimitModule()
      _generalStripeLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 20, // 20 requests per minute per tenant
        keyGenerator: getTenantKeyGenerator,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests, please try again later',
        validate: { xForwardedForHeader: false }, // We handle IP normalization ourselves
      })
    }
    return _generalStripeLimiter(req, res, next)
  }
}
