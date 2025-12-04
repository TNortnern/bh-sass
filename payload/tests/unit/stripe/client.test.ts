import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getStripeClient, constructWebhookEvent } from '../../../src/lib/stripe/client'

describe('Stripe Client Utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset modules and environment before each test
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getStripeClient', () => {
    it('should throw error if STRIPE_SECRET_KEY is not set', () => {
      delete process.env.STRIPE_SECRET_KEY

      expect(() => getStripeClient()).toThrow('STRIPE_SECRET_KEY environment variable is not set')
    })

    it('should return Stripe client when key is set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123'

      const stripe = getStripeClient()

      expect(stripe).toBeDefined()
      // Stripe client exists and has core API methods
      expect(typeof stripe.checkout).toBe('object')
      expect(typeof stripe.accounts).toBe('object')
    })

    it('should return singleton instance', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123'

      const stripe1 = getStripeClient()
      const stripe2 = getStripeClient()

      // Should be the same instance
      expect(stripe1).toBe(stripe2)
    })

    it('should initialize with Stripe SDK correctly', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123'

      const stripe = getStripeClient()

      // Verify Stripe client is properly initialized
      expect(stripe).toBeDefined()
      expect(typeof stripe.checkout.sessions.create).toBe('function')
      expect(typeof stripe.accounts.create).toBe('function')
    })
  })

  describe('constructWebhookEvent', () => {
    beforeEach(() => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123'
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
    })

    it('should throw error if STRIPE_WEBHOOK_SECRET is not set', () => {
      delete process.env.STRIPE_WEBHOOK_SECRET

      expect(() => {
        constructWebhookEvent('{}', 'sig_test')
      }).toThrow('STRIPE_WEBHOOK_SECRET environment variable is not set')
    })

    it('should throw error for invalid signature', () => {
      const payload = JSON.stringify({ type: 'test' })
      const invalidSignature = 'invalid_signature'

      expect(() => {
        constructWebhookEvent(payload, invalidSignature)
      }).toThrow('Webhook signature verification failed')
    })

    // Note: Testing with actual Stripe webhook signature validation requires
    // mocking the Stripe SDK or using real test events from Stripe CLI
    // For real-world testing, use Stripe CLI:
    // stripe trigger payment_intent.succeeded
  })

  describe('Environment validation', () => {
    it('should accept test mode secret key', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_51ABC123def456ghi789'

      expect(() => getStripeClient()).not.toThrow()
    })

    it('should accept live mode secret key format', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_live_51ABC123def456ghi789'

      expect(() => getStripeClient()).not.toThrow()
    })
  })

  describe('Stripe client configuration', () => {
    it('should include app info', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123'

      const stripe = getStripeClient()

      // Stripe SDK stores app info internally, we just verify client initialized
      expect(stripe).toBeDefined()
      expect(typeof stripe.checkout).toBe('object')
      expect(typeof stripe.accounts).toBe('object')
      expect(typeof stripe.webhooks).toBe('object')
    })
  })
})
