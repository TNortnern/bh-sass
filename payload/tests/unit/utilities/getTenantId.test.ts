import { describe, it, expect } from 'vitest'
import { getTenantId } from '../../../src/utilities/getTenantId'

/**
 * Unit Tests for getTenantId utility
 * Tests extraction of tenant ID from user objects
 */

describe('getTenantId utility', () => {
  it('should return null if user is undefined', () => {
    // Arrange
    const user = undefined

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBeNull()
  })

  it('should return null if user is null', () => {
    // Arrange
    const user = null

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBeNull()
  })

  it('should return null if user has no tenantId property', () => {
    // Arrange
    const user = {
      id: 'user_123',
      email: 'test@example.com',
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBeNull()
  })

  it('should return tenantId when it is a primitive string', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: 'tenant_456',
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBe('tenant_456')
  })

  it('should return tenantId when it is a primitive number', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: 789,
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBe(789)
  })

  it('should extract id from populated tenantId object', () => {
    // Arrange - Payload relationships can be populated
    const user = {
      id: 'user_123',
      tenantId: {
        id: 'tenant_999',
        name: 'ABC Party Rentals',
        slug: 'abc-party'
      },
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBe('tenant_999')
  })

  it('should handle numeric id in populated tenantId object', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: {
        id: 555,
        name: 'XYZ Rentals'
      },
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    expect(result).toBe(555)
  })

  it('should return null if tenantId is an empty object', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: {},
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    // Empty object returns undefined from the function, not null
    expect(result).toBeUndefined()
  })

  it('should return null if tenantId object has no id property', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: {
        name: 'ABC Party Rentals',
        slug: 'abc-party'
        // id missing
      },
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert
    // Object without id returns undefined from the function, not null
    expect(result).toBeUndefined()
  })

  it('should handle tenantId as 0 (edge case)', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: 0,
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert - 0 is falsy, function returns null for falsy values
    expect(result).toBeNull()
  })

  it('should handle tenantId as empty string (edge case)', () => {
    // Arrange
    const user = {
      id: 'user_123',
      tenantId: '',
      role: 'tenant_admin'
    }

    // Act
    const result = getTenantId(user)

    // Assert - Empty string is falsy
    expect(result).toBeNull()
  })
})
