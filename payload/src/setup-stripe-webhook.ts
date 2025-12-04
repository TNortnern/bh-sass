import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

// Events we need for subscription management
const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.created',
  'customer.updated',
]

async function setupStripeWebhook() {
  const webhookUrl = process.env.STRIPE_WEBHOOK_URL || process.env.PAYLOAD_PUBLIC_URL

  if (!webhookUrl) {
    console.error('❌ Error: STRIPE_WEBHOOK_URL or PAYLOAD_PUBLIC_URL must be set')
    console.log('   Set STRIPE_WEBHOOK_URL to your production URL, e.g.:')
    console.log('   STRIPE_WEBHOOK_URL=https://your-app.railway.app/api/stripe/webhook')
    process.exit(1)
  }

  const fullWebhookUrl = `${webhookUrl}/api/stripe/webhook`

  console.log('🔗 Setting up Stripe webhook...')
  console.log(`   URL: ${fullWebhookUrl}`)
  console.log(`   Events: ${WEBHOOK_EVENTS.length} event types\n`)

  try {
    // Check for existing webhooks with the same URL
    const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 })
    const existingWebhook = existingWebhooks.data.find(
      (wh) => wh.url === fullWebhookUrl && wh.status === 'enabled',
    )

    if (existingWebhook) {
      console.log(`✓ Webhook already exists: ${existingWebhook.id}`)

      // Update the webhook to ensure it has all the right events
      const updated = await stripe.webhookEndpoints.update(existingWebhook.id, {
        enabled_events: WEBHOOK_EVENTS,
      })

      console.log(`✓ Updated webhook events`)
      console.log(`\n📋 Webhook Details:`)
      console.log(`   ID: ${updated.id}`)
      console.log(`   URL: ${updated.url}`)
      console.log(`   Status: ${updated.status}`)
      console.log(`   Events: ${updated.enabled_events?.length || 0}`)

      // Note: Can't retrieve signing secret for existing webhook
      console.log(`\n⚠️  Note: Signing secret unchanged. Check Stripe Dashboard if needed.`)
    } else {
      // Create new webhook
      const webhook = await stripe.webhookEndpoints.create({
        url: fullWebhookUrl,
        enabled_events: WEBHOOK_EVENTS,
        description: 'BouncePro SaaS subscription webhooks',
      })

      console.log(`✓ Created new webhook: ${webhook.id}`)
      console.log(`\n📋 Webhook Details:`)
      console.log(`   ID: ${webhook.id}`)
      console.log(`   URL: ${webhook.url}`)
      console.log(`   Status: ${webhook.status}`)
      console.log(`   Events: ${webhook.enabled_events?.length || 0}`)

      // The signing secret is only available at creation time
      if (webhook.secret) {
        console.log(`\n🔑 IMPORTANT: Save this webhook signing secret!`)
        console.log(`   STRIPE_WEBHOOK_SECRET=${webhook.secret}`)
        console.log(`\n   Add this to your environment variables.`)
        console.log(`   This secret is only shown once and cannot be retrieved later.`)
      }
    }

    console.log(`\n✅ Stripe webhook setup complete!`)
  } catch (error) {
    console.error('❌ Failed to setup webhook:', error)
    process.exit(1)
  }

  process.exit(0)
}

setupStripeWebhook()
