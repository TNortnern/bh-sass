import { getPayload } from 'payload'
import Stripe from 'stripe'
import config from './payload.config.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

interface PlanConfig {
  slug: string
  name: string
  description: string
  priceInCents: number
  features: string[]
}

const planConfigs: PlanConfig[] = [
  {
    slug: 'growth',
    name: 'Growth Plan',
    description: 'For growing rental businesses - Unlimited bookings, bundles & packages, webhooks',
    priceInCents: 3900, // $39
    features: [
      'Unlimited bookings',
      'Bundles & packages',
      'Webhook notifications',
      'Priority email support',
    ],
  },
  {
    slug: 'pro',
    name: 'Pro Plan',
    description: 'Advanced features for professionals - API access, custom branding, analytics',
    priceInCents: 9900, // $99
    features: [
      'Everything in Growth',
      'API access',
      'Custom branding',
      'Advanced analytics',
    ],
  },
  {
    slug: 'scale',
    name: 'Scale Plan',
    description: 'For high-volume operations - Zero platform fees, white-label, custom domain',
    priceInCents: 24900, // $249
    features: [
      'Everything in Pro',
      'Zero platform fees',
      'White-label solution',
      'Custom domain',
    ],
  },
]

async function setupStripePlans() {
  console.log('🚀 Setting up Stripe products and prices...\n')

  const payload = await getPayload({ config })
  console.log('✓ Payload initialized\n')

  for (const planConfig of planConfigs) {
    console.log(`📦 Creating ${planConfig.name}...`)

    // Check if product already exists by searching for metadata
    const existingProducts = await stripe.products.search({
      query: `metadata['bouncepro_plan']:'${planConfig.slug}'`,
    })

    let product: Stripe.Product
    let price: Stripe.Price

    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0]
      console.log(`   Found existing product: ${product.id}`)

      // Get the active price
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 1,
      })

      if (prices.data.length > 0) {
        price = prices.data[0]
        console.log(`   Found existing price: ${price.id}`)
      } else {
        // Create new price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: planConfig.priceInCents,
          currency: 'usd',
          recurring: {
            interval: 'month',
          },
        })
        console.log(`   Created new price: ${price.id}`)
      }
    } else {
      // Create new product
      product = await stripe.products.create({
        name: planConfig.name,
        description: planConfig.description,
        metadata: {
          bouncepro_plan: planConfig.slug,
          features: planConfig.features.join(', '),
        },
      })
      console.log(`   Created product: ${product.id}`)

      // Create price
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: planConfig.priceInCents,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          bouncepro_plan: planConfig.slug,
        },
      })
      console.log(`   Created price: ${price.id}`)
    }

    // Update the plan in Payload with the Stripe price ID
    const plans = await payload.find({
      collection: 'plans',
      where: {
        slug: { equals: planConfig.slug },
      },
      limit: 1,
    })

    if (plans.docs.length > 0) {
      await payload.update({
        collection: 'plans',
        id: plans.docs[0].id,
        data: {
          stripePriceId: price.id,
        },
      })
      console.log(`   ✓ Updated plan in database with price ID: ${price.id}\n`)
    } else {
      console.log(`   ⚠️  Plan "${planConfig.slug}" not found in database. Run seed-plans.ts first.\n`)
    }
  }

  console.log('✅ Stripe setup complete!\n')
  console.log('Your plans are now connected to Stripe. Users can upgrade via the billing page.')

  process.exit(0)
}

setupStripePlans().catch((error) => {
  console.error('❌ Setup failed:', error)
  process.exit(1)
})
