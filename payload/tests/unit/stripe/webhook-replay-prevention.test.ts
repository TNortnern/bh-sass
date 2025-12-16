import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { PayloadRequest, Payload } from 'payload'
import type Stripe from 'stripe'
import { handleWebhook } from '../../../src/endpoints/stripe/webhook'

/**
 * Webhook Replay Attack Prevention Tests
 *
 * Tests timestamp validation and event deduplication
 * to prevent replay attacks on Stripe webhooks.
 */

// Mock Payload API
const mockPayload = {
  find: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
} as unknown as Payload

// Helper to create a mock Stripe event
function createMockEvent(overrides?: Partial<Stripe.Event>): Stripe.Event {
  const now = Math.floor(Date.now() / 1000)
  return {
    id: `evt_${Math.random().toString(36).substring(7)}`,
    object: 'event',
    api_version: '2023-10-16',
    created: now, // Current timestamp
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        object: 'checkout.session',
        metadata: { bookingId: 'test-booking-id' },
        payment_status: 'paid',
        amount_total: 10000,
      } as unknown as Stripe.Checkout.Session,
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    ...overrides,
  } as unknown as Stripe.Event
}

// Helper to create a mock request
function createMockRequest(
  event: Stripe.Event,
  signature: string = 'valid_signature',
): PayloadRequest {
  const body = JSON.stringify(event)

  return {
    headers: {
      get: (name: string) => {
        if (name === 'stripe-signature') return signature
        return null
      },
    },
    text: async () => body,
    payload: mockPayload,
  } as unknown as PayloadRequest
}

// Mock the Stripe signature verification
vi.mock('../../../src/lib/stripe/client', () => ({
  constructWebhookEvent: vi.fn((rawBody: string, signature: string) => {
    if (signature === 'invalid_signature') {
      throw new Error('Invalid signature')
    }
    return JSON.parse(rawBody)
  }),
}))

describe('Webhook Replay Attack Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Timestamp Validation', () => {
    it('should reject webhooks older than 5 minutes', async () => {
      const FIVE_MINUTES_AGO = Math.floor(Date.now() / 1000) - 301 // 301 seconds ago
      const oldEvent = createMockEvent({ created: FIVE_MINUTES_AGO })
      const req = createMockRequest(oldEvent)

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Bad Request')
      expect(data.message).toBe('Webhook event too old')

      // Should not check for duplicates or process the event
      expect(mockPayload.find).not.toHaveBeenCalled()
    })

    it('should accept webhooks within the 5-minute tolerance', async () => {
      const recentEvent = createMockEvent() // Current timestamp
      const req = createMockRequest(recentEvent)

      // Mock: Event doesn't exist (not a duplicate)
      mockPayload.find = vi.fn().mockResolvedValue({ docs: [] })
      mockPayload.create = vi.fn().mockResolvedValue({})

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Should check for duplicates
      expect(mockPayload.find).toHaveBeenCalledWith({
        collection: 'stripe-webhook-events',
        where: { stripeEventId: { equals: recentEvent.id } },
        limit: 1,
      })
    })

    it('should accept webhooks exactly at the 5-minute boundary', async () => {
      const FIVE_MINUTES_AGO = Math.floor(Date.now() / 1000) - 300 // Exactly 300 seconds ago
      const boundaryEvent = createMockEvent({ created: FIVE_MINUTES_AGO })
      const req = createMockRequest(boundaryEvent)

      // Mock: Event doesn't exist (not a duplicate)
      mockPayload.find = vi.fn().mockResolvedValue({ docs: [] })
      mockPayload.create = vi.fn().mockResolvedValue({})

      const response = await handleWebhook(req)
      const data = await response.json()

      // Should be accepted (300 seconds is NOT greater than 300)
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('Event Deduplication', () => {
    it('should reject duplicate event IDs', async () => {
      const event = createMockEvent()
      const req = createMockRequest(event)

      // Mock: Event already exists (duplicate)
      mockPayload.find = vi.fn().mockResolvedValue({
        docs: [
          {
            id: '123',
            stripeEventId: event.id,
            processedAt: new Date().toISOString(),
          },
        ],
      })

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(200) // Return 200 to avoid Stripe retries
      expect(data.success).toBe(true)
      expect(data.message).toBe('Event already processed')

      // Should NOT create a new event record
      expect(mockPayload.create).not.toHaveBeenCalled()
    })

    it('should accept and store new event IDs', async () => {
      const event = createMockEvent()
      const req = createMockRequest(event)

      // Mock: Event doesn't exist (not a duplicate)
      mockPayload.find = vi.fn().mockResolvedValue({ docs: [] })
      mockPayload.create = vi.fn().mockResolvedValue({})

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Should store the event ID
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'stripe-webhook-events',
        data: {
          stripeEventId: event.id,
          eventType: event.type,
          processedAt: expect.any(String),
          eventCreatedAt: expect.any(String),
        },
      })
    })

    it('should still process event if storage fails', async () => {
      const event = createMockEvent()
      const req = createMockRequest(event)

      // Mock: Event doesn't exist, but storage fails
      mockPayload.find = vi.fn().mockResolvedValue({ docs: [] })
      mockPayload.create = vi.fn().mockRejectedValue(new Error('Database error'))

      const response = await handleWebhook(req)
      const data = await response.json()

      // Should still process the event (fail-open for storage issues)
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Should have attempted to create the record
      expect(mockPayload.create).toHaveBeenCalled()
    })
  })

  describe('Combined Validation', () => {
    it('should check timestamp before checking for duplicates', async () => {
      const FIVE_MINUTES_AGO = Math.floor(Date.now() / 1000) - 301
      const oldDuplicateEvent = createMockEvent({ created: FIVE_MINUTES_AGO })
      const req = createMockRequest(oldDuplicateEvent)

      const response = await handleWebhook(req)
      const data = await response.json()

      // Should reject due to timestamp, not even check for duplicates
      expect(response.status).toBe(400)
      expect(data.message).toBe('Webhook event too old')
      expect(mockPayload.find).not.toHaveBeenCalled()
    })

    it('should process valid event and store it', async () => {
      const event = createMockEvent()
      const req = createMockRequest(event)

      // Mock: Event doesn't exist (not a duplicate)
      mockPayload.find = vi.fn().mockResolvedValue({ docs: [] })
      mockPayload.create = vi.fn().mockResolvedValue({})

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Should pass both validations
      expect(mockPayload.find).toHaveBeenCalled()
      expect(mockPayload.create).toHaveBeenCalled()
    })
  })

  describe('Signature Validation (Pre-existing)', () => {
    it('should reject webhooks with invalid signatures before replay checks', async () => {
      const event = createMockEvent()
      const req = createMockRequest(event, 'invalid_signature')

      const response = await handleWebhook(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Invalid signature')

      // Should not proceed to replay checks
      expect(mockPayload.find).not.toHaveBeenCalled()
    })
  })
})
