import { getPayload } from 'payload'
import config from './payload.config.js'

async function createDemoUsers() {
  const payload = await getPayload({ config })

  // Get first tenant
  const tenants = await payload.find({ collection: 'tenants', limit: 1 })
  let tenantId = tenants.docs[0]?.id

  if (!tenantId) {
    console.log('No tenant found, creating one...')
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'BouncePro Demo',
        slug: 'bouncepro-demo',
        plan: 'pro',
        status: 'active',
        settings: {
          timezone: 'America/Chicago',
          currency: 'USD',
          locale: 'en-US'
        }
      } as any,  // Payload 3.x type workaround
    })
    tenantId = tenant.id
    console.log('Created tenant:', tenantId)
  } else {
    console.log('Using existing tenant:', tenantId)
  }

  // Demo users to create/update
  const demoUsers = [
    { email: 'admin@bouncepro.demo', password: 'demo123!', role: 'super_admin', name: 'Demo Admin', needsTenant: false },
    { email: 'owner@bouncepro.demo', password: 'demo123!', role: 'tenant_admin', name: 'Demo Owner', needsTenant: true },
    { email: 'staff@bouncepro.demo', password: 'demo123!', role: 'staff', name: 'Demo Staff', needsTenant: true }
  ]

  for (const user of demoUsers) {
    try {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: user.email } }
      })

      if (existing.totalDocs === 0) {
        const userData: any = {
          email: user.email,
          password: user.password,
          role: user.role,
          profile: { name: user.name }
        }
        if (user.needsTenant) {
          userData.tenantId = tenantId
        }
        await payload.create({
          collection: 'users',
          data: userData
        })
        console.log('✓ Created:', user.email)
      } else {
        // Update password
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          data: { password: user.password }
        })
        console.log('✓ Updated:', user.email)
      }
    } catch (err: any) {
      console.error('✗ Failed:', user.email, err.message)
    }
  }

  console.log('\n✅ Demo users ready!')
  console.log('  admin@bouncepro.demo / demo123!')
  console.log('  owner@bouncepro.demo / demo123!')
  console.log('  staff@bouncepro.demo / demo123!')

  process.exit(0)
}

createDemoUsers()
