import { getPayload } from 'payload'
import config from './payload.config.js'

export async function seedPlans() {
  console.log('🌱 Seeding plans...')

  try {
    const payload = await getPayload({ config })

    // Delete existing plans
    const existingPlans = await payload.find({ collection: 'plans', limit: 100 })
    for (const plan of existingPlans.docs) {
      await payload.delete({ collection: 'plans', id: plan.id })
    }
    console.log('✓ Cleared existing plans')

    // Create plans matching the new pricing tiers
    const plans = [
      {
        name: 'Free',
        slug: 'free',
        price: 0,
        transactionFee: 6,
        features: [
          { feature: 'Up to 10 rental items' },
          { feature: 'Up to 50 bookings/month' },
          { feature: '1 team member' },
          { feature: 'Basic email support' },
        ],
        limits: {
          maxItems: 10,
          maxBookings: 50,
          maxUsers: 1,
        },
        featureFlags: {
          websiteBuilder: false,
          customRoles: false,
          customWebsite: false,
          prioritySupport: false,
          whiteLabel: false,
          apiAccess: false,
        },
        active: true,
      },
      {
        name: 'Pro',
        slug: 'pro',
        price: 2900, // $29 in cents
        transactionFee: 3.5,
        features: [
          { feature: 'Up to 50 rental items' },
          { feature: '500 bookings/month' },
          { feature: '5 team members' },
          { feature: 'Website builder' },
          { feature: 'Custom roles & permissions' },
          { feature: 'API access & webhooks' },
        ],
        limits: {
          maxItems: 50,
          maxBookings: 500,
          maxUsers: 5,
        },
        featureFlags: {
          websiteBuilder: true,
          customRoles: true,
          customWebsite: true,
          prioritySupport: false,
          whiteLabel: false,
          apiAccess: true,
        },
        stripePriceId: 'price_pro', // Update with real Stripe Price ID
        active: true,
      },
      {
        name: 'Platinum',
        slug: 'platinum',
        price: 10000, // $100 in cents
        transactionFee: 1,
        features: [
          { feature: 'Unlimited rental items' },
          { feature: 'Unlimited bookings' },
          { feature: 'Unlimited team members' },
          { feature: 'Priority support' },
          { feature: 'White-label solution' },
          { feature: 'Free custom website (after 2 months)' },
        ],
        limits: {
          maxItems: -1, // -1 = unlimited
          maxBookings: -1,
          maxUsers: -1,
        },
        featureFlags: {
          websiteBuilder: true,
          customRoles: true,
          customWebsite: true,
          prioritySupport: true,
          whiteLabel: true,
          apiAccess: true,
        },
        stripePriceId: 'price_platinum', // Update with real Stripe Price ID
        active: true,
      },
    ]

    for (const planData of plans) {
      const plan = await payload.create({
        collection: 'plans',
        data: planData,
      })
      console.log(`✓ Created plan: ${plan.name} (slug: ${plan.slug})`)
    }

    console.log('\n✅ Plans seeded successfully!')
    console.log('\n⚠️  Note: stripePriceId values are placeholders.')
    console.log('   Replace with real Stripe Price IDs for actual checkout to work.')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedPlans()
