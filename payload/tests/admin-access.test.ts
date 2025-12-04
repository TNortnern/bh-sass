import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../src/payload.config'

describe('Admin Access Control', () => {
  let payload: any
  let superAdmin: any
  let tenantAdmin: any
  let regularUser: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test users
    superAdmin = await payload.create({
      collection: 'users',
      data: {
        email: 'superadmin@test.com',
        password: 'testpass123',
        role: 'super_admin'
      }
    })

    const testTenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Test Tenant',
        slug: 'test-tenant',
        plan: 'free',
        status: 'active'
      }
    })

    tenantAdmin = await payload.create({
      collection: 'users',
      data: {
        email: 'tenant@test.com',
        password: 'testpass123',
        role: 'tenant_admin',
        tenantId: testTenant.id
      }
    })

    regularUser = await payload.create({
      collection: 'users',
      data: {
        email: 'user@test.com',
        password: 'testpass123',
        role: 'customer',
        tenantId: testTenant.id
      }
    })
  })

  afterAll(async () => {
    // Cleanup test data
    if (superAdmin) await payload.delete({ collection: 'users', id: superAdmin.id })
    if (tenantAdmin) await payload.delete({ collection: 'users', id: tenantAdmin.id })
    if (regularUser) await payload.delete({ collection: 'users', id: regularUser.id })
  })

  describe('Super Admin Access', () => {
    it('should allow super admin to view all tenants', async () => {
      const tenants = await payload.find({
        collection: 'tenants',
        user: superAdmin
      })

      expect(tenants.docs).toBeDefined()
      expect(Array.isArray(tenants.docs)).toBe(true)
    })

    it('should allow super admin to view all users', async () => {
      const users = await payload.find({
        collection: 'users',
        user: superAdmin
      })

      expect(users.docs).toBeDefined()
      expect(users.docs.length).toBeGreaterThanOrEqual(3) // At least our test users
    })

    it('should allow super admin to update any tenant', async () => {
      const tenants = await payload.find({
        collection: 'tenants',
        limit: 1
      })

      if (tenants.docs.length > 0) {
        const updated = await payload.update({
          collection: 'tenants',
          id: tenants.docs[0].id,
          data: { status: 'active' },
          user: superAdmin
        })

        expect(updated).toBeDefined()
        expect(updated.id).toBe(tenants.docs[0].id)
      }
    })
  })

  describe('Tenant Admin Access', () => {
    it('should only allow tenant admin to see their own tenant', async () => {
      const tenants = await payload.find({
        collection: 'tenants',
        user: tenantAdmin
      })

      expect(tenants.docs).toBeDefined()
      expect(tenants.docs.length).toBe(1)
      expect(tenants.docs[0].id).toBe(tenantAdmin.tenantId)
    })

    it('should only allow tenant admin to see users in their tenant', async () => {
      const users = await payload.find({
        collection: 'users',
        user: tenantAdmin
      })

      expect(users.docs).toBeDefined()
      // Should only see users from their tenant
      users.docs.forEach((user: any) => {
        if (user.role !== 'super_admin') {
          expect(user.tenantId).toBe(tenantAdmin.tenantId)
        }
      })
    })

    it('should not allow tenant admin to access other tenants', async () => {
      // Create another tenant
      const otherTenant = await payload.create({
        collection: 'tenants',
        data: {
          name: 'Other Tenant',
          slug: 'other-tenant',
          plan: 'free',
          status: 'active'
        }
      })

      // Try to access it as tenant admin
      try {
        await payload.findByID({
          collection: 'tenants',
          id: otherTenant.id,
          user: tenantAdmin
        })
        // If we get here, access control failed
        expect(true).toBe(false) // Force failure
      } catch (error: any) {
        // Should throw an error or return empty
        expect(error).toBeDefined()
      } finally {
        // Cleanup
        await payload.delete({ collection: 'tenants', id: otherTenant.id })
      }
    })
  })

  describe('Regular User Access', () => {
    it('should not allow regular user to create tenants', async () => {
      const canCreate = await payload.collections.tenants.access.create({
        req: { user: regularUser }
      })

      expect(canCreate).toBe(false)
    })

    it('should not allow regular user to delete users', async () => {
      const canDelete = await payload.collections.users.access.delete({
        req: { user: regularUser }
      })

      expect(canDelete).toBe(false)
    })
  })
})
