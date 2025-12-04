import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAccessContext,
  hasApiKeyAuth,
  hasSessionAuth,
  tenantScopedAccess,
  apiAccessible
} from '../../../src/utilities/accessControl'

/**
 * Unit Tests for Access Control Utilities
 * Tests tenant isolation and multi-tenant security
 */

describe('Access Control Utilities', () => {
  describe('hasSessionAuth', () => {
    it('should return true if user is present', () => {
      // Arrange
      const req = {
        user: {
          id: 'user_123',
          email: 'test@example.com',
          role: 'tenant_admin'
        }
      } as any

      // Act
      const result = hasSessionAuth(req)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false if user is not present', () => {
      // Arrange
      const req = {} as any

      // Act
      const result = hasSessionAuth(req)

      // Assert
      expect(result).toBe(false)
    })

    it('should return false if user is null', () => {
      // Arrange
      const req = { user: null } as any

      // Act
      const result = hasSessionAuth(req)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getAccessContext', () => {
    it('should extract tenant context from session user', async () => {
      // Arrange
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const context = await getAccessContext(req)

      // Assert
      expect(context.tenantId).toBe('tenant_456')
      expect(context.role).toBe('tenant_admin')
      expect(context.authMethod).toBe('session')
      expect(context.userId).toBe('user_123')
    })

    it('should handle populated tenantId in user object', async () => {
      // Arrange
      const req = {
        user: {
          id: 'user_123',
          tenantId: {
            id: 'tenant_789',
            name: 'ABC Rentals'
          },
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const context = await getAccessContext(req)

      // Assert
      expect(context.tenantId).toBe('tenant_789')
      expect(context.authMethod).toBe('session')
    })

    it('should return no auth context if no user and no API key', async () => {
      // Arrange
      const req = {
        headers: {}
      } as any

      // Act
      const context = await getAccessContext(req)

      // Assert
      expect(context.tenantId).toBeNull()
      expect(context.role).toBeNull()
      expect(context.authMethod).toBeNull()
      expect(context.userId).toBeNull()
    })
  })

  describe('tenantScopedAccess', () => {
    it('should allow super_admin full access', async () => {
      // Arrange
      const accessFn = tenantScopedAccess()
      const req = {
        user: {
          id: 'admin_123',
          role: 'super_admin'
        }
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toBe(true)
    })

    it('should return tenant-scoped filter for tenant_admin', async () => {
      // Arrange
      const accessFn = tenantScopedAccess()
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toEqual({
        tenantId: {
          equals: 'tenant_456'
        }
      })
    })

    it('should deny access if no authentication', async () => {
      // Arrange
      const accessFn = tenantScopedAccess()
      const req = { headers: {} } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toBe(false)
    })

    it('should allow public access if allowPublic is true', async () => {
      // Arrange
      const accessFn = tenantScopedAccess([], true)
      const req = { headers: {} } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toBe(true)
    })

    it('should enforce role restrictions', async () => {
      // Arrange - Only tenant_admin allowed
      const accessFn = tenantScopedAccess(['tenant_admin'])
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'staff' // Not in allowed roles
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toBe(false)
    })

    it('should allow access if role matches allowed roles', async () => {
      // Arrange
      const accessFn = tenantScopedAccess(['tenant_admin', 'staff'])
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'staff'
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toEqual({
        tenantId: {
          equals: 'tenant_456'
        }
      })
    })

    it('should handle missing tenantId gracefully', async () => {
      // Arrange
      const accessFn = tenantScopedAccess()
      const req = {
        user: {
          id: 'user_123',
          role: 'tenant_admin'
          // tenantId missing
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('apiAccessible', () => {
    it('should create access functions for CRUD operations', () => {
      // Arrange & Act
      const access = apiAccessible({
        read: { public: true },
        create: { roles: ['tenant_admin'] },
        update: { roles: ['tenant_admin'] },
        delete: { roles: ['tenant_admin'] }
      })

      // Assert
      expect(access).toHaveProperty('read')
      expect(access).toHaveProperty('create')
      expect(access).toHaveProperty('update')
      expect(access).toHaveProperty('delete')
    })

    it('should allow public read access if configured', async () => {
      // Arrange
      const access = apiAccessible({
        read: { public: true }
      })
      const req = { headers: {} } as any

      // Act
      const result = await access.read({ req } as any)

      // Assert
      expect(result).toBe(true)
    })

    it('should deny public write access by default', async () => {
      // Arrange
      const access = apiAccessible({})
      const req = { headers: {} } as any

      // Act
      const createResult = await access.create({ req } as any)
      const updateResult = await access.update({ req } as any)
      const deleteResult = await access.delete({ req } as any)

      // Assert
      expect(createResult).toBe(false)
      expect(updateResult).toBe(false)
      expect(deleteResult).toBe(false)
    })

    it('should allow super_admin full access', async () => {
      // Arrange
      const access = apiAccessible({})
      const req = {
        user: {
          id: 'admin_123',
          role: 'super_admin'
        }
      } as any

      // Act
      const readResult = await access.read({ req } as any)
      const createResult = await access.create({ req } as any)

      // Assert
      expect(readResult).toBe(true)
      expect(createResult).toBe(true)
    })

    it('should return tenant-scoped filter for authenticated users', async () => {
      // Arrange
      const access = apiAccessible({
        read: { roles: ['tenant_admin'] }
      })
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const result = await access.read({ req } as any)

      // Assert
      expect(result).toEqual({
        tenantId: {
          equals: 'tenant_456'
        }
      })
    })

    it('should enforce role-based access for session auth', async () => {
      // Arrange
      const access = apiAccessible({
        create: { roles: ['tenant_admin'] }
      })
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_456',
          role: 'staff' // Not in allowed roles
        },
        headers: {}
      } as any

      // Act
      const result = await access.create({ req } as any)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('Tenant Isolation Security', () => {
    it('should prevent cross-tenant data access', async () => {
      // Arrange - User from tenant A tries to access tenant B data
      const accessFn = tenantScopedAccess()
      const req = {
        user: {
          id: 'user_123',
          tenantId: 'tenant_AAA',
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert - Should only have access to tenant_AAA
      expect(result).toEqual({
        tenantId: {
          equals: 'tenant_AAA'
        }
      })
    })

    it('should handle numeric tenant IDs correctly', async () => {
      // Arrange
      const accessFn = tenantScopedAccess()
      const req = {
        user: {
          id: 'user_123',
          tenantId: 6, // Numeric tenant ID
          role: 'tenant_admin'
        },
        headers: {}
      } as any

      // Act
      const result = await accessFn({ req } as any)

      // Assert
      expect(result).toEqual({
        tenantId: {
          equals: '6' // Should be converted to string
        }
      })
    })
  })
})
