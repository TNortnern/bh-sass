import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logAuditEvent, getRequestMetadata, createDiff } from '../../src/lib/audit'
import type { Payload } from 'payload'

/**
 * Unit Tests for Audit Logging System
 * Tests audit event creation, metadata extraction, and diff generation
 */

describe('Audit Logging System', () => {
  describe('logAuditEvent', () => {
    let mockPayload: Payload
    let consoleErrorSpy: any

    beforeEach(() => {
      // Mock Payload instance
      mockPayload = {
        create: vi.fn().mockResolvedValue({ id: 'audit_123' }),
        logger: {
          error: vi.fn(),
        },
      } as unknown as Payload

      // Spy on console.error to suppress error output
      consoleErrorSpy = vi.spyOn(mockPayload.logger, 'error')
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should create an audit log entry with all fields', async () => {
      // Arrange
      const event = {
        action: 'create' as const,
        collection: 'bookings',
        documentId: 'booking_123',
        userId: 'user_456',
        tenantId: 'tenant_789',
        changes: { document: { id: 'booking_123', status: 'pending' } },
        metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
      }

      // Act
      await logAuditEvent(mockPayload, event)

      // Assert
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'audit-logs',
        data: expect.objectContaining({
          action: 'create',
          collection: 'bookings',
          documentId: 'booking_123',
          userId: 'user_456',
          tenantId: 'tenant_789',
          changes: { document: { id: 'booking_123', status: 'pending' } },
          metadata: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0' },
          timestamp: expect.any(String),
        }),
      })
    })

    it('should create audit log with null optional fields', async () => {
      // Arrange
      const event = {
        action: 'delete' as const,
        collection: 'customers',
        documentId: 'customer_456',
      }

      // Act
      await logAuditEvent(mockPayload, event)

      // Assert
      expect(mockPayload.create).toHaveBeenCalledWith({
        collection: 'audit-logs',
        data: expect.objectContaining({
          action: 'delete',
          collection: 'customers',
          documentId: 'customer_456',
          userId: null,
          tenantId: null,
          changes: null,
          metadata: null,
          timestamp: expect.any(String),
        }),
      })
    })

    it('should not throw error if audit log creation fails', async () => {
      // Arrange
      mockPayload.create = vi.fn().mockRejectedValue(new Error('Database connection failed'))
      const event = {
        action: 'update' as const,
        collection: 'rental-items',
        documentId: 'item_789',
      }

      // Act & Assert - should not throw
      await expect(logAuditEvent(mockPayload, event)).resolves.not.toThrow()
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to create audit log'))
    })

    it('should log all action types correctly', async () => {
      // Test each action type
      const actions: Array<'create' | 'update' | 'delete' | 'login' | 'logout' | 'api_call'> = [
        'create',
        'update',
        'delete',
        'login',
        'logout',
        'api_call',
      ]

      for (const action of actions) {
        // Arrange
        const event = {
          action,
          collection: 'test-collection',
          documentId: 'doc_123',
        }

        // Act
        await logAuditEvent(mockPayload, event)

        // Assert
        expect(mockPayload.create).toHaveBeenCalledWith({
          collection: 'audit-logs',
          data: expect.objectContaining({
            action,
          }),
        })
      }
    })
  })

  describe('getRequestMetadata', () => {
    it('should extract IP address from req.ip', () => {
      // Arrange
      const req = {
        ip: '192.168.1.100',
        headers: {},
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata.ip).toBe('192.168.1.100')
    })

    it('should extract IP from x-forwarded-for header', () => {
      // Arrange
      const req = {
        headers: {
          'x-forwarded-for': '203.0.113.1, 198.51.100.1',
        },
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata.ip).toBe('203.0.113.1, 198.51.100.1')
    })

    it('should extract IP from x-real-ip header', () => {
      // Arrange
      const req = {
        headers: {
          'x-real-ip': '198.51.100.50',
        },
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata.ip).toBe('198.51.100.50')
    })

    it('should extract user agent', () => {
      // Arrange
      const req = {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata.userAgent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
    })

    it('should extract referer', () => {
      // Arrange
      const req = {
        headers: {
          referer: 'https://example.com/bookings',
        },
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata.referer).toBe('https://example.com/bookings')
    })

    it('should return empty object if no metadata available', () => {
      // Arrange
      const req = {
        headers: {},
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata).toEqual({})
    })

    it('should extract all available metadata', () => {
      // Arrange
      const req = {
        ip: '192.168.1.100',
        headers: {
          'user-agent': 'Mozilla/5.0',
          referer: 'https://example.com',
        },
      }

      // Act
      const metadata = getRequestMetadata(req)

      // Assert
      expect(metadata).toEqual({
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        referer: 'https://example.com',
      })
    })
  })

  describe('createDiff', () => {
    it('should detect changed fields', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
        totalPrice: 100,
      }
      const after = {
        id: 'booking_123',
        status: 'confirmed',
        totalPrice: 100,
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          status: 'pending',
        },
        after: {
          status: 'confirmed',
        },
      })
    })

    it('should detect added fields', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
      }
      const after = {
        id: 'booking_123',
        status: 'pending',
        notes: 'Customer requested early delivery',
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          notes: undefined,
        },
        after: {
          notes: 'Customer requested early delivery',
        },
      })
    })

    it('should detect removed fields', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
        tempNote: 'Temporary',
      }
      const after = {
        id: 'booking_123',
        status: 'pending',
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          tempNote: 'Temporary',
        },
        after: {
          tempNote: undefined,
        },
      })
    })

    it('should skip timestamps (updatedAt, createdAt)', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      }
      const after = {
        id: 'booking_123',
        status: 'confirmed',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          status: 'pending',
        },
        after: {
          status: 'confirmed',
        },
      })
      // Timestamps should not be in diff
      expect(diff.before).not.toHaveProperty('updatedAt')
      expect(diff.after).not.toHaveProperty('updatedAt')
    })

    it('should handle nested object changes', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
        },
      }
      const after = {
        id: 'booking_123',
        deliveryAddress: {
          street: '456 Oak Ave',
          city: 'New York',
        },
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          deliveryAddress: {
            street: '123 Main St',
            city: 'New York',
          },
        },
        after: {
          deliveryAddress: {
            street: '456 Oak Ave',
            city: 'New York',
          },
        },
      })
    })

    it('should return empty diff if nothing changed', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
        totalPrice: 100,
      }
      const after = {
        id: 'booking_123',
        status: 'pending',
        totalPrice: 100,
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {},
        after: {},
      })
    })

    it('should handle empty objects', () => {
      // Arrange
      const before = {}
      const after = {}

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {},
        after: {},
      })
    })

    it('should detect multiple field changes', () => {
      // Arrange
      const before = {
        id: 'booking_123',
        status: 'pending',
        totalPrice: 100,
        depositPaid: 0,
      }
      const after = {
        id: 'booking_123',
        status: 'confirmed',
        totalPrice: 150,
        depositPaid: 75,
      }

      // Act
      const diff = createDiff(before, after)

      // Assert
      expect(diff).toEqual({
        before: {
          status: 'pending',
          totalPrice: 100,
          depositPaid: 0,
        },
        after: {
          status: 'confirmed',
          totalPrice: 150,
          depositPaid: 75,
        },
      })
    })
  })
})
