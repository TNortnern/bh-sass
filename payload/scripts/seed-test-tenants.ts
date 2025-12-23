/**
 * Seed Test Tenants Script
 *
 * Creates 3 test tenants with known credentials for QA testing:
 * - Free Test Co (free plan)
 * - Pro Test Co (pro plan)
 * - Platinum Test Co (platinum plan)
 *
 * Run with: npx tsx scripts/seed-test-tenants.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const TEST_PASSWORD = 'Test123!'

const testTenants: Array<{
  name: string
  slug: string
  plan: 'free' | 'pro' | 'platinum'
  email: string
  description: string
}> = [
  {
    name: 'Free Test Co',
    slug: 'free-test-co',
    plan: 'free',
    email: 'free@test.bouncepro.com',
    description: 'Test tenant on Free plan for QA testing',
  },
  {
    name: 'Pro Test Co',
    slug: 'pro-test-co',
    plan: 'pro',
    email: 'pro@test.bouncepro.com',
    description: 'Test tenant on Pro plan for QA testing',
  },
  {
    name: 'Platinum Test Co',
    slug: 'platinum-test-co',
    plan: 'platinum',
    email: 'platinum@test.bouncepro.com',
    description: 'Test tenant on Platinum plan for QA testing',
  },
]

async function seedTestTenants() {
  console.log('🌱 Seeding test tenants...')

  const payload = await getPayload({ config })

  for (const testTenant of testTenants) {
    try {
      // Check if tenant already exists
      const existingTenants = await payload.find({
        collection: 'tenants',
        where: { slug: { equals: testTenant.slug } },
        limit: 1,
      })

      let tenantId: number

      if (existingTenants.docs.length > 0) {
        console.log(`✓ Tenant "${testTenant.name}" already exists (ID: ${existingTenants.docs[0].id})`)
        tenantId = existingTenants.docs[0].id

        // Update plan if different
        if (existingTenants.docs[0].plan !== testTenant.plan) {
          await payload.update({
            collection: 'tenants',
            id: tenantId,
            data: { plan: testTenant.plan },
          })
          console.log(`  Updated plan to "${testTenant.plan}"`)
        }
      } else {
        // Create tenant
        const tenant = await payload.create({
          collection: 'tenants',
          data: {
            name: testTenant.name,
            slug: testTenant.slug,
            plan: testTenant.plan,
            status: 'active',
          },
        })
        tenantId = tenant.id
        console.log(`✓ Created tenant "${testTenant.name}" (ID: ${tenantId})`)
      }

      // Check if user already exists
      const existingUsers = await payload.find({
        collection: 'users',
        where: { email: { equals: testTenant.email } },
        limit: 1,
      })

      if (existingUsers.docs.length > 0) {
        console.log(`  User "${testTenant.email}" already exists`)

        // Update password and tenantId if needed
        await payload.update({
          collection: 'users',
          id: existingUsers.docs[0].id,
          data: {
            password: TEST_PASSWORD,
            tenantId,
            role: 'tenant_admin',
            isActive: true,
          },
        })
        console.log(`  Updated user password and settings`)
      } else {
        // Create user for tenant
        await payload.create({
          collection: 'users',
          data: {
            email: testTenant.email,
            password: TEST_PASSWORD,
            tenantId,
            role: 'tenant_admin',
            isActive: true,
            profile: {
              name: `${testTenant.name} Admin`,
            },
          },
        })
        console.log(`  Created user "${testTenant.email}"`)
      }
    } catch (error) {
      console.error(`✗ Error seeding "${testTenant.name}":`, error)
    }
  }

  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('                     TEST TENANT CREDENTIALS')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('Free Plan Test Account:')
  console.log(`  Email:    free@test.bouncepro.com`)
  console.log(`  Password: ${TEST_PASSWORD}`)
  console.log('')
  console.log('Pro Plan Test Account:')
  console.log(`  Email:    pro@test.bouncepro.com`)
  console.log(`  Password: ${TEST_PASSWORD}`)
  console.log('')
  console.log('Platinum Plan Test Account:')
  console.log(`  Email:    platinum@test.bouncepro.com`)
  console.log(`  Password: ${TEST_PASSWORD}`)
  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('✅ Test tenant seeding complete!')

  process.exit(0)
}

seedTestTenants().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
