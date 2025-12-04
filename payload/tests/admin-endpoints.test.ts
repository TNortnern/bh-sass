import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../src/payload.config'

describe('Admin Endpoints', () => {
  let payload: any
  let superAdmin: any
  let tenantAdmin: any
  let testTenant: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create super admin
    superAdmin = await payload.create({
      collection: 'users',
      data: {
        email: 'admin-endpoint-test@test.com',
        password: 'testpass123',
        role: 'super_admin'
      }
    })

    // Create test tenant
    testTenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'Endpoint Test Tenant',
        slug: 'endpoint-test',
        plan: 'growth',
        status: 'active'
      }
    })

    // Create tenant admin
    tenantAdmin = await payload.create({
      collection: 'users',
      data: {
        email: 'tenant-endpoint-test@test.com',
        password: 'testpass123',
        role: 'tenant_admin',
        tenantId: testTenant.id
      }
    })
  })

  afterAll(async () => {
    // Cleanup
    if (superAdmin) await payload.delete({ collection: 'users', id: superAdmin.id })
    if (tenantAdmin) await payload.delete({ collection: 'users', id: tenantAdmin.id })
    if (testTenant) await payload.delete({ collection: 'tenants', id: testTenant.id })
  })

  describe('GET /api/admin/stats', () => {
    it('should return platform stats for super admin', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: 'http://localhost:3000/api/admin/stats'
      }

      const { adminStatsEndpoint } = await import('../src/endpoints/admin/stats')
      const response = await adminStatsEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(data).toBeDefined()
      expect(data.tenants).toBeDefined()
      expect(data.tenants.total).toBeGreaterThan(0)
      expect(data.subscriptions).toBeDefined()
      expect(data.revenue).toBeDefined()
      expect(data.systemHealth).toBeDefined()
    })

    it('should deny access to non-super admin', async () => {
      const mockReq = {
        payload,
        user: tenantAdmin,
        url: 'http://localhost:3000/api/admin/stats'
      }

      const { adminStatsEndpoint } = await import('../src/endpoints/admin/stats')
      const response = await adminStatsEndpoint.handler(mockReq as any)

      expect(response.status).toBe(403)
    })
  })

  describe('GET /api/admin/tenants', () => {
    it('should return list of tenants for super admin', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: 'http://localhost:3000/api/admin/tenants'
      }

      const { adminTenantsListEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminTenantsListEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)

      // Check structure of tenant data
      const tenant = data[0]
      expect(tenant.id).toBeDefined()
      expect(tenant.name).toBeDefined()
      expect(tenant.slug).toBeDefined()
      expect(tenant.plan).toBeDefined()
      expect(tenant.status).toBeDefined()
    })

    it('should support search filtering', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: 'http://localhost:3000/api/admin/tenants?search=endpoint-test'
      }

      const { adminTenantsListEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminTenantsListEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      // Should find our test tenant
      const found = data.some((t: any) => t.slug === 'endpoint-test')
      expect(found).toBe(true)
    })
  })

  describe('GET /api/admin/tenants/:id', () => {
    it('should return tenant details for super admin', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: `http://localhost:3000/api/admin/tenants/${testTenant.id}`,
        routeParams: { id: testTenant.id }
      }

      const { adminTenantDetailEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminTenantDetailEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(data).toBeDefined()
      expect(data.id).toBe(testTenant.id)
      expect(data.name).toBe('Endpoint Test Tenant')
      expect(data.slug).toBe('endpoint-test')
    })

    it('should return 404 for non-existent tenant', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: 'http://localhost:3000/api/admin/tenants/non-existent-id',
        routeParams: { id: 'non-existent-id' }
      }

      const { adminTenantDetailEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminTenantDetailEndpoint.handler(mockReq as any)

      expect(response.status).toBe(404)
    })
  })

  describe('POST /api/admin/tenants/:id/suspend', () => {
    it('should suspend tenant', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: `http://localhost:3000/api/admin/tenants/${testTenant.id}/suspend`,
        routeParams: { id: testTenant.id },
        json: async () => ({ status: 'suspended' }),
        headers: {
          get: () => 'test-ip'
        }
      }

      const { adminSuspendTenantEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminSuspendTenantEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.tenant.status).toBe('suspended')

      // Restore status for cleanup
      await payload.update({
        collection: 'tenants',
        id: testTenant.id,
        data: { status: 'active' }
      })
    })

    it('should require valid status', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: `http://localhost:3000/api/admin/tenants/${testTenant.id}/suspend`,
        routeParams: { id: testTenant.id },
        json: async () => ({ status: 'invalid' }),
        headers: {
          get: () => 'test-ip'
        }
      }

      const { adminSuspendTenantEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminSuspendTenantEndpoint.handler(mockReq as any)

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/admin/tenants/:id/impersonate', () => {
    it('should create impersonation session', async () => {
      const mockReq = {
        payload,
        user: superAdmin,
        url: `http://localhost:3000/api/admin/tenants/${testTenant.id}/impersonate`,
        routeParams: { id: testTenant.id },
        headers: {
          get: () => 'test-ip'
        }
      }

      const { adminImpersonateEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminImpersonateEndpoint.handler(mockReq as any)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.tenant).toBeDefined()
      expect(data.tenant.id).toBe(testTenant.id)
      expect(data.token).toBeDefined()
    })

    it('should deny impersonation for non-super admin', async () => {
      const mockReq = {
        payload,
        user: tenantAdmin,
        url: `http://localhost:3000/api/admin/tenants/${testTenant.id}/impersonate`,
        routeParams: { id: testTenant.id },
        headers: {
          get: () => 'test-ip'
        }
      }

      const { adminImpersonateEndpoint } = await import('../src/endpoints/admin/tenants')
      const response = await adminImpersonateEndpoint.handler(mockReq as any)

      expect(response.status).toBe(403)
    })
  })
})
