import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getStripeClient } from '@/lib/stripe/client'

describe('Stripe Client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('getStripeClient', () => {
    it('should throw error if STRIPE_SECRET_KEY is not set', () => {
      delete process.env.STRIPE_SECRET_KEY

      expect(() => getStripeClient()).toThrow('STRIPE_SECRET_KEY environment variable is not set')
    })

    it('should create Stripe client when key is set', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'

      const client = getStripeClient()
      expect(client).toBeDefined()
      // Don't test internal Stripe API properties
    })

    it('should return same instance on multiple calls (singleton)', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'

      const client1 = getStripeClient()
      const client2 = getStripeClient()

      expect(client1).toBe(client2)
    })

    it('should initialize without errors', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'

      expect(() => getStripeClient()).not.toThrow()
    })
  })

  describe('Stripe Client Configuration', () => {
    it('should accept valid test keys', () => {
      const testKeys = [
        'sk_test_51ABC123',
        'sk_test_PLACEHOLDER_KEY',
      ]

      testKeys.forEach((key) => {
        process.env.STRIPE_SECRET_KEY = key
        expect(() => getStripeClient()).not.toThrow()
      })
    })

    it('should accept valid live keys', () => {
      const liveKey = 'sk_live_51ABC123'
      process.env.STRIPE_SECRET_KEY = liveKey

      expect(() => getStripeClient()).not.toThrow()
    })
  })
})
