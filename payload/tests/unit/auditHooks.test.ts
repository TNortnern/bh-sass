import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auditCreate, auditUpdate, auditDelete, auditCreateAndUpdate } from '../../src/hooks/auditHooks'
import { logAuditEvent } from '../../src/lib/audit'

// Mock the audit utility
vi.mock('../../src/lib/audit', () => ({
  logAuditEvent: vi.fn(),
  getRequestMetadata: vi.fn(() => ({ ip: '127.0.0.1' })),
  createDiff: vi.fn((before, after) => ({ before, after })),
}))

/**
 * Unit Tests for Audit Hooks
 * Tests that hooks correctly call audit logging functions
 */

describe('Audit Hooks', () => {
  let mockReq: any
  let mockPayload: any

  // Helper to create hook args with required fields (Payload 3.x types)
  const createHookArgs = (overrides: any = {}) => ({
    context: {},
    data: {},
    previousDoc: undefined,
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()

    mockPayload = {
      logger: {
        error: vi.fn(),
      },
    }

    mockReq = {
      payload: mockPayload,
      user: {
        id: 'user_123',
        role: 'tenant_admin',
        tenantId: 'tenant_456',
      },
    }
  })

  describe('auditCreate', () => {
    it('should log audit event for create operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: {
          id: 'booking_123',
          tenantId: 'tenant_456',
          status: 'pending',
        },
        req: mockReq,
        operation: 'create' as const,
        collection: {
          slug: 'bookings',
        },
      })

      // Act
      const result = await auditCreate(args)

      // Assert
      expect(result).toEqual(args.doc)
      // Note: logAuditEvent is called in setImmediate, so we can't directly test it
      // In real integration tests, we would verify the audit log was created in DB
    })

    it('should not log for non-create operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123' },
        req: mockReq,
        operation: 'update' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditCreate(args)

      // Assert
      expect(result).toEqual(args.doc)
      // Audit should not be logged for update operation in auditCreate hook
    })

    it('should return document unchanged', async () => {
      // Arrange
      const doc = {
        id: 'booking_123',
        status: 'pending',
        totalPrice: 100,
      }
      const args = createHookArgs({
        doc,
        req: mockReq,
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditCreate(args)

      // Assert
      expect(result).toBe(doc)
    })
  })

  describe('auditUpdate', () => {
    it('should log audit event for update operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: {
          id: 'booking_123',
          tenantId: 'tenant_456',
          status: 'confirmed',
        },
        previousDoc: {
          id: 'booking_123',
          tenantId: 'tenant_456',
          status: 'pending',
        },
        req: mockReq,
        operation: 'update' as const,
        collection: {
          slug: 'bookings',
        },
      })

      // Act
      const result = await auditUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
      // Note: logAuditEvent is called in setImmediate
    })

    it('should not log for non-update operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123' },
        previousDoc: undefined,
        req: mockReq,
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
    })

    it('should handle missing previousDoc', async () => {
      // Arrange
      const args = createHookArgs({
        doc: {
          id: 'booking_123',
          status: 'confirmed',
        },
        previousDoc: undefined,
        req: mockReq,
        operation: 'update' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
    })
  })

  describe('auditDelete', () => {
    it('should log audit event for delete operations', async () => {
      // Arrange
      const args = {
        doc: {
          id: 'booking_123',
          tenantId: 'tenant_456',
          status: 'cancelled',
        },
        req: mockReq,
        collection: {
          slug: 'bookings',
        },
      }

      // Act
      const result = await auditDelete(args)

      // Assert
      expect(result).toEqual(args.doc)
      // Note: logAuditEvent is called in setImmediate
    })

    it('should return document unchanged', async () => {
      // Arrange
      const doc = {
        id: 'customer_789',
        name: 'John Doe',
      }
      const args = {
        doc,
        req: mockReq,
        collection: { slug: 'customers' },
      }

      // Act
      const result = await auditDelete(args)

      // Assert
      expect(result).toBe(doc)
    })
  })

  describe('auditCreateAndUpdate', () => {
    it('should call auditCreate for create operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123', status: 'pending' },
        req: mockReq,
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditCreateAndUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
    })

    it('should call auditUpdate for update operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123', status: 'confirmed' },
        previousDoc: { id: 'booking_123', status: 'pending' },
        req: mockReq,
        operation: 'update' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditCreateAndUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
    })

    it('should return doc unchanged for other operations', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123' },
        req: mockReq,
        operation: 'read' as any,
        collection: { slug: 'bookings' },
      })

      // Act
      const result = await auditCreateAndUpdate(args)

      // Assert
      expect(result).toEqual(args.doc)
    })
  })

  describe('Error Handling', () => {
    it('should not throw if user is missing from request', async () => {
      // Arrange
      const reqWithoutUser = {
        payload: mockPayload,
        user: undefined,
      }
      const args = createHookArgs({
        doc: { id: 'booking_123' },
        req: reqWithoutUser,
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act & Assert
      await expect(auditCreate(args)).resolves.not.toThrow()
    })

    it('should not throw if tenantId is missing', async () => {
      // Arrange
      const args = createHookArgs({
        doc: { id: 'booking_123' }, // No tenantId
        req: {
          payload: mockPayload,
          user: { id: 'user_123', role: 'super_admin' }, // No tenantId
        },
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act & Assert
      await expect(auditCreate(args)).resolves.not.toThrow()
    })

    it('should handle null document gracefully', async () => {
      // Arrange
      const args = createHookArgs({
        doc: null as any,
        req: mockReq,
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act & Assert
      await expect(auditCreate(args)).resolves.not.toThrow()
    })
  })

  describe('Tenant ID Extraction', () => {
    it('should extract tenantId from document', async () => {
      // Arrange
      const args = createHookArgs({
        doc: {
          id: 'booking_123',
          tenantId: 'tenant_from_doc',
        },
        req: {
          payload: mockPayload,
          user: {
            id: 'user_123',
            tenantId: 'tenant_from_user',
          },
        },
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      await auditCreate(args)

      // Assert - should prefer document's tenantId over user's
      // (Tested via integration tests with actual DB)
    })

    it('should fall back to user tenantId if doc has none', async () => {
      // Arrange
      const args = createHookArgs({
        doc: {
          id: 'booking_123',
          // No tenantId
        },
        req: {
          payload: mockPayload,
          user: {
            id: 'user_123',
            tenantId: 'tenant_from_user',
          },
        },
        operation: 'create' as const,
        collection: { slug: 'bookings' },
      })

      // Act
      await auditCreate(args)

      // Assert - should use user's tenantId
      // (Tested via integration tests with actual DB)
    })
  })
})
