/**
 * Seed Plans Script
 *
 * Creates the 3 pricing tiers: Free, Pro, Platinum
 *
 * Run with: npx tsx scripts/seed-plans.ts
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const plans = [
  {
    name: 'Free',
    slug: 'free',
    price: 0,
    annualPrice: 0,
    transactionFee: 6,
    description: 'Perfect for getting started',
    displayOrder: 0,
    highlighted: false,
    features: [
      { feature: 'Up to 10 rental items' },
      { feature: 'Up to 50 bookings/month' },
      { feature: '1 team member' },
      { feature: 'Email notifications' },
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
    price: 2900, // $29/mo
    annualPrice: 27840, // $278.40/yr (save 20%)
    transactionFee: 3.5,
    description: 'For growing rental businesses',
    displayOrder: 1,
    highlighted: true, // Recommended plan
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
      customWebsite: false,
      prioritySupport: false,
      whiteLabel: false,
      apiAccess: true,
    },
    active: true,
  },
  {
    name: 'Platinum',
    slug: 'platinum',
    price: 10000, // $100/mo
    annualPrice: 96000, // $960/yr (save 20%)
    transactionFee: 1,
    description: 'For established rental companies',
    displayOrder: 2,
    highlighted: false,
    features: [
      { feature: 'Unlimited rental items' },
      { feature: 'Unlimited bookings' },
      { feature: 'Unlimited team members' },
      { feature: 'Priority support' },
      { feature: 'White-label solution' },
      { feature: 'Free custom website (after 2 months)' },
      { feature: 'All Pro features included' },
    ],
    limits: {
      maxItems: -1, // Unlimited
      maxBookings: -1, // Unlimited
      maxUsers: -1, // Unlimited
    },
    featureFlags: {
      websiteBuilder: true,
      customRoles: true,
      customWebsite: true,
      prioritySupport: true,
      whiteLabel: true,
      apiAccess: true,
    },
    active: true,
  },
]

async function seedPlans() {
  console.log('🌱 Seeding plans...')

  const payload = await getPayload({ config })

  for (const plan of plans) {
    try {
      // Check if plan already exists
      const existing = await payload.find({
        collection: 'plans',
        where: { slug: { equals: plan.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`✓ Plan "${plan.name}" already exists (ID: ${existing.docs[0].id})`)

        // Update existing plan
        await payload.update({
          collection: 'plans',
          id: existing.docs[0].id,
          data: plan,
        })
        console.log(`  Updated plan settings`)
      } else {
        // Create new plan
        const created = await payload.create({
          collection: 'plans',
          data: plan,
        })
        console.log(`✓ Created plan "${plan.name}" (ID: ${created.id})`)
      }
    } catch (error) {
      console.error(`✗ Error seeding plan "${plan.name}":`, error)
    }
  }

  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('                        PLANS SEEDED')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('Free Plan:     $0/mo + 6% transaction fee')
  console.log('Pro Plan:      $29/mo + 3.5% transaction fee')
  console.log('Platinum Plan: $100/mo + 1% transaction fee')
  console.log('')
  console.log('═══════════════════════════════════════════════════════════════')
  console.log('')
  console.log('✅ Plans seeding complete!')

  process.exit(0)
}

seedPlans().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
