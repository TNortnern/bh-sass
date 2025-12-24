import type { Endpoint } from 'payload'

/**
 * POST /api/admin/seed-demo-users
 * Creates demo users for testing if they don't exist.
 * Protected by PAYLOAD_SECRET (for admin use only)
 *
 * Demo accounts created:
 * - admin@bouncepro.demo (super_admin)
 * - owner@bouncepro.demo (tenant_admin with demo tenant)
 * - staff@bouncepro.demo (staff with demo tenant)
 */
export const seedDemoUsersEndpoint: Endpoint = {
  path: '/admin/seed-demo-users',
  method: 'post',
  handler: async (req) => {
    try {
      const body = req.json ? await req.json() : {}
      const { secret } = body

      // Verify the secret key from body
      const expectedSecret = process.env.PAYLOAD_SECRET

      if (!secret || secret !== expectedSecret) {
        return Response.json(
          { error: 'Unauthorized. Invalid or missing secret in body.' },
          { status: 401 }
        )
      }

      const payload = req.payload
      const results: string[] = []
      const password = 'demo123!'

      // 1. Create or update super_admin user
      const existingAdmin = await payload.find({
        collection: 'users',
        where: { email: { equals: 'admin@bouncepro.demo' } },
        limit: 1
      })

      if (existingAdmin.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'admin@bouncepro.demo',
            password,
            role: 'super_admin',
            profile: { name: 'Demo Admin' }
          }
        })
        results.push('✓ Created admin@bouncepro.demo (super_admin)')
      } else {
        // Update password in case it changed
        await payload.update({
          collection: 'users',
          id: existingAdmin.docs[0].id,
          data: { password }
        })
        results.push('✓ Updated admin@bouncepro.demo')
      }

      // 2. Create or find demo tenant
      let demoTenant = await payload.find({
        collection: 'tenants',
        where: { slug: { equals: 'demo-rentals' } },
        limit: 1
      })

      let tenantId: number | string
      if (demoTenant.docs.length === 0) {
        const newTenant = await payload.create({
          collection: 'tenants',
          data: {
            name: 'Demo Bounce Rentals',
            slug: 'demo-rentals',
            plan: 'pro',
            status: 'active',
            email: 'demo@bouncepro.demo',
            settings: {
              timezone: 'America/New_York',
              currency: 'USD',
              bookingSettings: {
                leadTime: 48,
                cancellationPolicy: 'Free cancellation up to 48 hours',
                depositPercentage: 50,
                requireApproval: false,
              },
              deliverySettings: {
                baseDeliveryFee: 50,
                deliveryRadius: 50,
                setupTime: 30,
                pickupTime: 30,
              },
            }
          } as any
        })
        tenantId = newTenant.id
        results.push('✓ Created Demo Bounce Rentals tenant')
      } else {
        tenantId = demoTenant.docs[0].id
        results.push('✓ Found existing Demo Bounce Rentals tenant')
      }

      // 3. Create or update tenant_admin user
      const existingOwner = await payload.find({
        collection: 'users',
        where: { email: { equals: 'owner@bouncepro.demo' } },
        limit: 1
      })

      if (existingOwner.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'owner@bouncepro.demo',
            password,
            role: 'tenant_admin',
            tenantId: tenantId,
            profile: { name: 'Demo Owner' }
          }
        })
        results.push('✓ Created owner@bouncepro.demo (tenant_admin)')
      } else {
        await payload.update({
          collection: 'users',
          id: existingOwner.docs[0].id,
          data: { password, tenantId }
        })
        results.push('✓ Updated owner@bouncepro.demo')
      }

      // 4. Create or update staff user
      const existingStaff = await payload.find({
        collection: 'users',
        where: { email: { equals: 'staff@bouncepro.demo' } },
        limit: 1
      })

      if (existingStaff.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'staff@bouncepro.demo',
            password,
            role: 'staff',
            tenantId: tenantId,
            profile: { name: 'Demo Staff' }
          }
        })
        results.push('✓ Created staff@bouncepro.demo (staff)')
      } else {
        await payload.update({
          collection: 'users',
          id: existingStaff.docs[0].id,
          data: { password, tenantId }
        })
        results.push('✓ Updated staff@bouncepro.demo')
      }

      payload.logger.info(`Seeded demo users: ${results.join(', ')}`)

      return Response.json({
        success: true,
        message: 'Demo users seeded successfully',
        results,
        credentials: {
          admin: { email: 'admin@bouncepro.demo', password, role: 'super_admin' },
          owner: { email: 'owner@bouncepro.demo', password, role: 'tenant_admin' },
          staff: { email: 'staff@bouncepro.demo', password, role: 'staff' }
        }
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      req.payload.logger.error(`Error seeding demo users: ${errorMessage}`)
      return Response.json(
        { error: 'Failed to seed demo users', details: errorMessage },
        { status: 500 }
      )
    }
  },
}
