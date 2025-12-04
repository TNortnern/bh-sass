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

    // Create plans matching the billing page
    const plans = [
      {
        name: 'Free',
        slug: 'free',
        price: 0,
        transactionFee: 6,
        features: [
          { feature: 'Basic booking management' },
          { feature: 'Up to 20 bookings/month' },
          { feature: 'Email support' },
          { feature: 'Redirect booking flow' },
        ],
        limits: {
          maxItems: 10,
          maxBookings: 20,
        },
        active: true,
      },
      {
        name: 'Growth',
        slug: 'growth',
        price: 3900, // $39 in cents
        transactionFee: 2.5,
        features: [
          { feature: 'Unlimited bookings' },
          { feature: 'Bundles & packages' },
          { feature: 'Webhook notifications' },
          { feature: 'Priority email support' },
        ],
        limits: {
          maxItems: 50,
          maxBookings: 500,
        },
        stripePriceId: 'price_growth_test', // Placeholder - replace with real Stripe price ID
        active: true,
      },
      {
        name: 'Pro',
        slug: 'pro',
        price: 9900, // $99 in cents
        transactionFee: 0.5,
        features: [
          { feature: 'Everything in Growth' },
          { feature: 'API access' },
          { feature: 'Custom branding' },
          { feature: 'Advanced analytics' },
        ],
        limits: {
          maxItems: 200,
          maxBookings: 2000,
        },
        stripePriceId: 'price_pro_test', // Placeholder - replace with real Stripe price ID
        active: true,
      },
      {
        name: 'Scale',
        slug: 'scale',
        price: 24900, // $249 in cents
        transactionFee: 0,
        features: [
          { feature: 'Everything in Pro' },
          { feature: 'Zero platform fees' },
          { feature: 'White-label solution' },
          { feature: 'Custom domain' },
        ],
        limits: {
          maxItems: 1000,
          maxBookings: 10000,
        },
        stripePriceId: 'price_scale_test', // Placeholder - replace with real Stripe price ID
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
