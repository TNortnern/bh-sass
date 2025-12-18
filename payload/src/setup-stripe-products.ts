/**
 * Setup Stripe Products and Prices
 *
 * This script creates the required Stripe products and prices for the
 * subscription billing system, then updates the Plans collection with
 * the real Stripe price IDs.
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY must be set in environment
 * - Plans must be seeded first (run seed-plans.ts)
 *
 * Usage:
 *   pnpm tsx src/setup-stripe-products.ts
 */

import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from './payload.config.js'

interface PlanConfig {
  slug: string
  name: string
  price: number // in cents
  interval: 'month' | 'year'
  features: string[]
}

const PLANS: PlanConfig[] = [
  {
    slug: 'growth',
    name: 'BouncePro Growth',
    price: 3900, // $39/month
    interval: 'month',
    features: [
      'Unlimited bookings',
      'Bundles & packages',
      'Webhook notifications',
      'Priority email support',
    ],
  },
  {
    slug: 'pro',
    name: 'BouncePro Pro',
    price: 9900, // $99/month
    interval: 'month',
    features: [
      'Everything in Growth',
      'API access',
      'Custom branding',
      'Advanced analytics',
    ],
  },
  {
    slug: 'scale',
    name: 'BouncePro Scale',
    price: 24900, // $249/month
    interval: 'month',
    features: [
      'Everything in Pro',
      'Zero platform fees',
      'White-label solution',
      'Custom domain',
    ],
  },
]

async function setupStripeProducts() {
  console.log('🔧 Setting up Stripe products and prices...\n')

  // Validate Stripe key
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    console.error('❌ STRIPE_SECRET_KEY is not set in environment')
    console.log('\nTo fix this:')
    console.log('1. Get your Stripe secret key from https://dashboard.stripe.com/apikeys')
    console.log('2. Set it in your environment: export STRIPE_SECRET_KEY=sk_...')
    console.log('3. Run this script again')
    process.exit(1)
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia',
  })

  // Initialize Payload
  const payload = await getPayload({ config })

  const priceIdMap: Record<string, string> = {}

  for (const plan of PLANS) {
    console.log(`\n📦 Setting up ${plan.name}...`)

    try {
      // Check if product already exists
      const existingProducts = await stripe.products.search({
        query: `metadata['bouncepro_slug']:'${plan.slug}'`,
      })

      let product: Stripe.Product

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0]
        console.log(`   ✓ Found existing product: ${product.id}`)
      } else {
        // Create new product
        product = await stripe.products.create({
          name: plan.name,
          description: plan.features.join(' • '),
          metadata: {
            bouncepro_slug: plan.slug,
          },
        })
        console.log(`   ✓ Created product: ${product.id}`)
      }

      // Check if price already exists for this product
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
      })

      let price: Stripe.Price

      const matchingPrice = existingPrices.data.find(
        (p) =>
          p.unit_amount === plan.price &&
          p.recurring?.interval === plan.interval
      )

      if (matchingPrice) {
        price = matchingPrice
        console.log(`   ✓ Found existing price: ${price.id}`)
      } else {
        // Create new price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price,
          currency: 'usd',
          recurring: {
            interval: plan.interval,
          },
          metadata: {
            bouncepro_slug: plan.slug,
          },
        })
        console.log(`   ✓ Created price: ${price.id}`)
      }

      priceIdMap[plan.slug] = price.id
    } catch (error) {
      console.error(`   ❌ Failed to set up ${plan.name}:`, error)
    }
  }

  // Update Plans collection with real price IDs
  console.log('\n📝 Updating Plans collection...')

  for (const [slug, priceId] of Object.entries(priceIdMap)) {
    try {
      const plans = await payload.find({
        collection: 'plans',
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      })

      if (plans.docs.length > 0) {
        await payload.update({
          collection: 'plans',
          id: plans.docs[0].id,
          data: {
            stripePriceId: priceId,
          },
        })
        console.log(`   ✓ Updated ${slug} with price ID: ${priceId}`)
      } else {
        console.log(`   ⚠️  Plan not found: ${slug}`)
      }
    } catch (error) {
      console.error(`   ❌ Failed to update ${slug}:`, error)
    }
  }

  console.log('\n✅ Stripe products setup complete!')
  console.log('\nPrice IDs:')
  for (const [slug, priceId] of Object.entries(priceIdMap)) {
    console.log(`   ${slug}: ${priceId}`)
  }

  process.exit(0)
}

setupStripeProducts()
