import { getPayload } from 'payload'
import config from './payload.config.js'
import { seedCategories } from './seed-categories.js'
import { seedContractTemplates } from './lib/documents/seed-templates.js'

export async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // Initialize Payload
    const payload = await getPayload({ config })

    console.log('✓ Payload initialized')

    // Clear existing data (in order due to foreign key constraints)
    console.log('Clearing existing data...')

    // Delete bookings first
    const existingBookings = await payload.find({ collection: 'bookings', limit: 1000 })
    for (const booking of existingBookings.docs) {
      await payload.delete({ collection: 'bookings', id: booking.id })
    }

    // Delete customers
    const existingCustomers = await payload.find({ collection: 'customers', limit: 1000 })
    for (const customer of existingCustomers.docs) {
      await payload.delete({ collection: 'customers', id: customer.id })
    }

    // Delete inventory units
    const existingUnits = await payload.find({ collection: 'inventory-units', limit: 1000 })
    for (const unit of existingUnits.docs) {
      await payload.delete({ collection: 'inventory-units', id: unit.id })
    }

    // Delete rental items
    const existingItems = await payload.find({ collection: 'rental-items', limit: 1000 })
    for (const item of existingItems.docs) {
      await payload.delete({ collection: 'rental-items', id: item.id })
    }

    // Delete add-ons
    const existingAddOns = await payload.find({ collection: 'add-ons', limit: 1000 })
    for (const addOn of existingAddOns.docs) {
      await payload.delete({ collection: 'add-ons', id: addOn.id })
    }

    // Delete bundles
    const existingBundles = await payload.find({ collection: 'bundles', limit: 1000 })
    for (const bundle of existingBundles.docs) {
      await payload.delete({ collection: 'bundles', id: bundle.id })
    }

    // Delete ALL users (we'll recreate them)
    const existingUsers = await payload.find({ collection: 'users', limit: 1000 })
    for (const user of existingUsers.docs) {
      await payload.delete({ collection: 'users', id: user.id })
    }

    // Delete tenants
    const existingTenants = await payload.find({ collection: 'tenants', limit: 1000 })
    for (const tenant of existingTenants.docs) {
      await payload.delete({ collection: 'tenants', id: tenant.id })
    }

    console.log('✓ Cleared existing data')

    // ========================================================================
    // CREATE DEMO TENANT
    // ========================================================================
    console.log('Creating demo tenant...')
    // @ts-expect-error - Payload strict types require draft field but it's optional at runtime
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'BouncePro Demo Rentals',
        slug: 'bouncepro-demo',
        plan: 'pro',
        settings: {
          timezone: 'America/Chicago',
          currency: 'USD',
          locale: 'en-US',
          bookingSettings: {
            leadTime: 24,
            maxAdvanceBooking: 90,
            cancellationPolicy: 'Full refund if cancelled 48 hours before delivery',
            requireApproval: false,
            depositPercentage: 50,
          },
          deliverySettings: {
            deliveryRadius: 30,
            baseDeliveryFee: 75,
            setupTime: 45,
            pickupTime: 30,
          },
        },
        status: 'active',
      },
    })

    console.log(`✓ Created tenant: ${tenant.name} (ID: ${tenant.id})`)

    // ========================================================================
    // CREATE DEMO USERS
    // ========================================================================
    console.log('Creating demo users...')

    // Demo Admin: admin@bouncepro.demo / demo123!
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@bouncepro.demo',
        password: 'demo123!',
        role: 'super_admin',
        profile: {
          name: 'Demo Admin',
        },
      },
    })
    console.log(`✓ Created demo admin: ${adminUser.email}`)

    // Demo Owner: owner@bouncepro.demo / demo123!
    const ownerUser = await payload.create({
      collection: 'users',
      data: {
        email: 'owner@bouncepro.demo',
        password: 'demo123!',
        role: 'tenant_admin',
        tenantId: tenant.id,
        profile: {
          name: 'Demo Owner',
          phone: '555-1000',
        },
      },
    })
    console.log(`✓ Created demo owner: ${ownerUser.email}`)

    // Demo Staff: staff@bouncepro.demo / demo123!
    const staffUser = await payload.create({
      collection: 'users',
      data: {
        email: 'staff@bouncepro.demo',
        password: 'demo123!',
        role: 'staff',
        tenantId: tenant.id,
        profile: {
          name: 'Demo Staff',
          phone: '555-1001',
        },
      },
    })
    console.log(`✓ Created demo staff: ${staffUser.email}`)

    // ========================================================================
    // SEED CATEGORIES
    // ========================================================================
    console.log('Seeding categories...')
    await seedCategories(payload, tenant.id)
    console.log('✓ Categories seeded')

    // Fetch created categories for use in rental items
    const categoriesResult = await payload.find({
      collection: 'categories',
      where: {
        tenantId: {
          equals: tenant.id,
        },
      },
    })
    const categories = categoriesResult.docs

    // Helper to find category by name
    const getCategoryId = (name: string) => {
      const cat = categories.find((c) => c.name === name)
      return cat ? cat.id : undefined
    }

    // ========================================================================
    // CREATE RENTAL ITEMS
    // ========================================================================
    console.log('Creating rental items...')
    const rentalItems = await Promise.all([
      payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: 'Small Bounce House',
          description: '15x15 bounce house perfect for backyard parties. Ages 3-10.',
          categoryId: getCategoryId('Bounce Houses'),
          category: 'bounce_house',
          pricing: {
            hourlyRate: 25,
            dailyRate: 150,
            weekendRate: 275,
            weeklyRate: 650,
          },
          dimensions: {
            length: 15,
            width: 15,
            height: 12,
          },
          capacity: 8,
          ageRange: {
            minAge: 3,
            maxAge: 10,
          },
          setupRequirements: {
            spaceRequired: '15x15 flat area',
            powerRequired: true,
            waterRequired: false,
            surfaceType: 'grass',
          },
          quantity: 2,
          isActive: true,
        },
      }),
      payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: 'Large Bounce House',
          description: '20x20 bounce house with slide. Perfect for bigger events.',
          categoryId: getCategoryId('Bounce Houses'),
          category: 'bounce_house',
          pricing: {
            hourlyRate: 40,
            dailyRate: 250,
            weekendRate: 450,
            weeklyRate: 950,
          },
          dimensions: {
            length: 20,
            width: 20,
            height: 15,
          },
          capacity: 12,
          ageRange: {
            minAge: 3,
            maxAge: 12,
          },
          setupRequirements: {
            spaceRequired: '20x20 flat area',
            powerRequired: true,
            waterRequired: false,
            surfaceType: 'grass',
          },
          quantity: 2,
          isActive: true,
        },
      }),
      payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: 'Water Slide',
          description: '25ft water slide - perfect for summer parties!',
          categoryId: getCategoryId('Water Slides'),
          category: 'water_slide',
          pricing: {
            hourlyRate: 50,
            dailyRate: 300,
            weekendRate: 550,
            weeklyRate: 1200,
          },
          dimensions: {
            length: 30,
            width: 12,
            height: 25,
          },
          capacity: 1,
          ageRange: {
            minAge: 5,
            maxAge: 99,
          },
          setupRequirements: {
            spaceRequired: '30x15 flat area',
            powerRequired: true,
            waterRequired: true,
            surfaceType: 'grass',
          },
          quantity: 1,
          isActive: true,
        },
      }),
      payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: 'Obstacle Course',
          description: '40ft inflatable obstacle course. Great for competitive fun!',
          categoryId: getCategoryId('Obstacle Courses'),
          category: 'obstacle_course',
          pricing: {
            hourlyRate: 65,
            dailyRate: 400,
            weekendRate: 750,
            weeklyRate: 1600,
          },
          dimensions: {
            length: 40,
            width: 12,
            height: 15,
          },
          capacity: 2,
          ageRange: {
            minAge: 6,
            maxAge: 99,
          },
          setupRequirements: {
            spaceRequired: '40x15 flat area',
            powerRequired: true,
            waterRequired: false,
            surfaceType: 'grass',
          },
          quantity: 1,
          isActive: true,
        },
      }),
      payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: 'Combo Bounce + Slide',
          description: 'Best seller! Bounce house with attached slide.',
          categoryId: getCategoryId('Combo Units'),
          category: 'combo_unit',
          pricing: {
            hourlyRate: 55,
            dailyRate: 350,
            weekendRate: 650,
            weeklyRate: 1400,
          },
          dimensions: {
            length: 25,
            width: 15,
            height: 18,
          },
          capacity: 10,
          ageRange: {
            minAge: 3,
            maxAge: 12,
          },
          setupRequirements: {
            spaceRequired: '25x18 flat area',
            powerRequired: true,
            waterRequired: false,
            surfaceType: 'grass',
          },
          quantity: 3,
          isActive: true,
          featured: true,
        },
      }),
    ])

    console.log(`✓ Created ${rentalItems.length} rental items`)

    // ========================================================================
    // CREATE SAMPLE CUSTOMERS
    // ========================================================================
    console.log('Creating sample customers...')
    const customers = await Promise.all([
      payload.create({
        collection: 'customers',
        data: {
          tenantId: tenant.id,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '555-0101',
          address: {
            street: '123 Oak Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
          },
          notes: 'VIP customer, always books for weekend parties',
          tags: [{ tag: 'VIP' }],
          totalBookings: 0,
        },
      }),
      payload.create({
        collection: 'customers',
        data: {
          tenantId: tenant.id,
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '555-0102',
          address: {
            street: '456 Maple Avenue',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62702',
          },
          notes: 'Prefers morning delivery',
          tags: [{ tag: 'Regular' }],
          totalBookings: 0,
        },
      }),
      payload.create({
        collection: 'customers',
        data: {
          tenantId: tenant.id,
          name: 'Emily Rodriguez',
          email: 'emily.r@example.com',
          phone: '555-0103',
          address: {
            street: '789 Pine Road',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62703',
          },
          notes: 'First time customer',
          tags: [],
          totalBookings: 0,
        },
      }),
    ])

    console.log(`✓ Created ${customers.length} customers`)

    console.log('\nℹ️  Skipping bookings - create them via the admin panel or API as needed')

    // ========================================================================
    // SEED CONTRACT TEMPLATES
    // ========================================================================
    console.log('\n')
    await seedContractTemplates(payload)

    console.log('\n✅ Seed complete!')
    console.log('\nDemo User Credentials:')
    console.log('  Admin:  admin@bouncepro.demo / demo123!')
    console.log('  Owner:  owner@bouncepro.demo / demo123!')
    console.log('  Staff:  staff@bouncepro.demo / demo123!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run if called directly (ESM style)
seedDatabase()
