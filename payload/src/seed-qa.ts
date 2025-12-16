/**
 * QA Seed Script
 * Creates test data for QA testing without affecting production data
 *
 * Run with: pnpm seed:qa
 */
import { getPayload } from 'payload'
import config from './payload.config.js'

async function seedQA() {
  console.log('🧪 Starting QA seed...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const payload = await getPayload({ config })
    console.log('✓ Payload initialized\n')

    // Check if QA tenant already exists
    const existingTenant = await payload.find({
      collection: 'tenants',
      where: { slug: { equals: 'qa-test' } },
      limit: 1,
    })

    if (existingTenant.docs.length > 0) {
      console.log('⚠️  QA tenant already exists. Skipping to avoid duplicates.')
      console.log('   To reset QA data, run: docker compose down -v && docker compose up -d')
      console.log('\n🔑 QA Login Credentials:')
      console.log('   Email: qa@bouncepro.test')
      console.log('   Password: QATest123!')
      process.exit(0)
    }

    // 1. Create QA Tenant
    console.log('📦 Creating QA tenant...')
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: 'QA Test Rentals',
        slug: 'qa-test',
        email: 'qa@bouncepro.test',
        phone: '555-555-0199',
        status: 'active',
        plan: 'growth',
        settings: {
          timezone: 'America/Chicago',
          currency: 'USD',
        },
      } as any,  // Payload 3.x type workaround
    })
    console.log(`   ✓ Created tenant: ${tenant.name} (ID: ${tenant.id})`)

    // 2. Create QA User
    console.log('\n👤 Creating QA user...')
    const qaUser = await payload.create({
      collection: 'users',
      data: {
        email: 'qa@bouncepro.test',
        password: 'QATest123!',
        role: 'tenant_admin',
        tenantId: tenant.id,
        profile: {
          name: 'QA Tester',
        },
      } as any,  // Payload 3.x type workaround
    })
    console.log(`   ✓ Created user: ${qaUser.email}`)

    // 3. Create Rental Items
    console.log('\n🏰 Creating rental items...')
    type CategoryType = 'bounce_house' | 'water_slide' | 'combo_unit' | 'obstacle_course' | 'interactive_game' | 'tent_canopy' | 'table_chair' | 'concession' | 'other'
    const itemsData: { name: string; category: CategoryType; description: string; dailyPrice: number }[] = [
      {
        name: 'Castle Bounce House',
        category: 'bounce_house',
        description: 'Classic castle design, perfect for birthday parties',
        dailyPrice: 199,
      },
      {
        name: 'Water Slide Combo',
        category: 'water_slide',
        description: 'Fun water slide with splash pool',
        dailyPrice: 349,
      },
      {
        name: 'Obstacle Course',
        category: 'obstacle_course',
        description: 'Dual-lane obstacle course for competitive fun',
        dailyPrice: 449,
      },
      {
        name: 'Party Package Deluxe',
        category: 'combo_unit',
        description: 'Bounce house with slide combo',
        dailyPrice: 599,
      },
    ]

    const createdItems: any[] = []
    for (const item of itemsData) {
      const created = await payload.create({
        collection: 'rental-items',
        data: {
          tenantId: tenant.id,
          name: item.name,
          category: item.category,
          isActive: true,
          pricing: {
            dailyRate: item.dailyPrice,
            hourlyRate: Math.round(item.dailyPrice / 6),
            weekendRate: Math.round(item.dailyPrice * 1.2),
          },
          dimensions: {
            length: 15 + Math.floor(Math.random() * 10),
            width: 15 + Math.floor(Math.random() * 10),
            height: 10 + Math.floor(Math.random() * 5),
          },
          capacity: 6 + Math.floor(Math.random() * 6),
          ageRange: {
            minAge: 3,
            maxAge: 12,
          },
          quantity: 2,
        },
      })
      createdItems.push(created)
      console.log(`   ✓ ${item.name} - $${item.dailyPrice}/day`)
    }

    // 4. Create Customers
    console.log('\n👥 Creating customers...')
    const customersData = [
      { name: 'Sarah Johnson', email: 'sarah@example.test', phone: '555-555-0101' },
      { name: 'Mike Williams', email: 'mike@example.test', phone: '555-555-0102' },
      { name: 'Emily Brown', email: 'emily@example.test', phone: '555-555-0103' },
      { name: 'David Miller', email: 'david@example.test', phone: '555-555-0104' },
      { name: 'Lisa Davis', email: 'lisa@example.test', phone: '555-555-0105' },
    ]

    const createdCustomers: any[] = []
    for (const customer of customersData) {
      const created = await payload.create({
        collection: 'customers',
        data: {
          tenantId: tenant.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: {
            street: `${100 + createdCustomers.length} Test Street`,
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
          },
        },
      })
      createdCustomers.push(created)
      console.log(`   ✓ ${customer.name}`)
    }

    // 5. Create Bookings
    console.log('\n📅 Creating bookings...')
    const statuses: ('pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled')[] = ['pending', 'confirmed', 'delivered', 'completed', 'cancelled']
    const paymentStatuses: ('unpaid' | 'deposit_paid' | 'paid_full' | 'refunded')[] = ['unpaid', 'deposit_paid', 'paid_full', 'paid_full', 'refunded']
    const createdBookings: any[] = []

    for (let i = 0; i < 20; i++) {
      const customer = createdCustomers[i % createdCustomers.length]
      const item = createdItems[i % createdItems.length]
      const statusIndex = i % statuses.length
      const status = statuses[statusIndex]
      const paymentStatus = paymentStatuses[statusIndex]

      // Create dates - some past, some future
      const daysFromNow = i - 10
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + daysFromNow)
      startDate.setHours(10, 0, 0, 0)

      const endDate = new Date(startDate)
      endDate.setHours(18, 0, 0, 0)

      const bookingNumber = `QA-${String(i + 1).padStart(4, '0')}`

      const booking = await payload.create({
        collection: 'bookings',
        data: {
          tenantId: tenant.id,
          customerId: customer.id,
          // Use new rentalItems array format
          rentalItems: [{
            rentalItemId: item.id,
            quantity: 1,
            price: item.pricing?.dailyRate || 199,
          }],
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status,
          paymentStatus,
          totalPrice: item.pricing?.dailyRate || 199,
          depositPaid: status === 'completed' || paymentStatus === 'paid_full' ? item.pricing?.dailyRate || 199 : 0,
          deliveryAddress: {
            street: '456 Party Avenue',
            city: 'Austin',
            state: 'TX',
            zipCode: '78702',
          },
          notes: `Test booking ${bookingNumber}`,
        },
      })
      createdBookings.push(booking)
    }
    console.log(`   ✓ Created ${createdBookings.length} bookings`)

    // Count by status
    const statusCounts: Record<string, number> = {}
    for (const booking of createdBookings) {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1
    }
    for (const [status, count] of Object.entries(statusCounts)) {
      console.log(`     - ${status}: ${count}`)
    }

    // 6. Create Payments for completed bookings
    console.log('\n💳 Creating payment records...')
    let paymentCount = 0
    for (const booking of createdBookings) {
      if (booking.status === 'completed' || booking.paymentStatus === 'paid_full') {
        await payload.create({
          collection: 'payments',
          data: {
            tenantId: tenant.id,
            booking: booking.id,
            amount: Math.round((booking.totalPrice || 199) * 100), // Amount in cents
            type: 'full',
            status: 'succeeded',
            stripePaymentIntentId: `demo_pi_qa_${booking.id}`,
          },
        })
        paymentCount++
      }
    }
    console.log(`   ✓ Created ${paymentCount} payment records`)

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 QA Seed Complete!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('📊 Summary:')
    console.log(`   • 1 Tenant: QA Test Rentals`)
    console.log(`   • 1 User: qa@bouncepro.test`)
    console.log(`   • ${createdItems.length} Rental Items`)
    console.log(`   • ${createdCustomers.length} Customers`)
    console.log(`   • ${createdBookings.length} Bookings`)
    console.log(`   • ${paymentCount} Payments\n`)

    console.log('🔑 QA Login Credentials:')
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   Email:    qa@bouncepro.test')
    console.log('   Password: QATest123!')
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('🌐 Access URLs:')
    console.log('   Dashboard: http://localhost:3005/app')
    console.log('   Admin:     http://localhost:3004/admin')
    console.log('   Widget:    http://localhost:3005/book/qa-test\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ QA Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed
seedQA()
