# Email Templates & QA Testing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add email template preview page, hook emails to booking flow, implement demo payment mode, and create QA testing package with pre-seeded accounts.

**Architecture:**
- Email preview page in Nuxt settings with iframe rendering and test send functionality
- Payload afterChange hooks trigger emails on booking/payment events
- DEMO_MODE env flag bypasses Stripe and auto-completes payments
- Seed script creates QA accounts with realistic booking/payment history

**Tech Stack:** Nuxt 4, Payload CMS, Brevo email, Stripe (sandbox), Vitest

---

## Task 1: Email Template Preview API Endpoint

**Files:**
- Create: `nuxt/server/routes/api/email-templates/index.get.ts`
- Create: `nuxt/server/routes/api/email-templates/[name]/preview.get.ts`
- Create: `nuxt/server/routes/api/email-templates/[name]/send-test.post.ts`

**Step 1: Create template list endpoint**

```typescript
// nuxt/server/routes/api/email-templates/index.get.ts
export default defineEventHandler(async () => {
  const templates = [
    {
      id: 'BOOKING_CONFIRMATION',
      name: 'Booking Confirmation',
      description: 'Sent when a booking is confirmed',
      trigger: 'On booking creation'
    },
    {
      id: 'BOOKING_REMINDER',
      name: 'Booking Reminder',
      description: 'Sent 24 hours before event',
      trigger: 'Scheduled - 24h before'
    },
    {
      id: 'BOOKING_CANCELLED',
      name: 'Booking Cancelled',
      description: 'Sent when booking is cancelled',
      trigger: 'On booking cancellation'
    },
    {
      id: 'PAYMENT_RECEIVED',
      name: 'Payment Received',
      description: 'Receipt sent after payment',
      trigger: 'On payment success'
    },
    {
      id: 'PASSWORD_RESET',
      name: 'Password Reset',
      description: 'Password reset link',
      trigger: 'On password reset request'
    },
    {
      id: 'WELCOME',
      name: 'Welcome',
      description: 'Welcome email for new users',
      trigger: 'On user registration'
    }
  ]

  return { templates }
})
```

**Step 2: Create template preview endpoint**

```typescript
// nuxt/server/routes/api/email-templates/[name]/preview.get.ts
import { emailTemplates } from '../../../../payload/src/lib/email/templates'

const sampleData: Record<string, Record<string, any>> = {
  BOOKING_CONFIRMATION: {
    customerName: 'John Smith',
    bookingId: 'BK-2024-001',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Saturday, December 14, 2024',
    eventTime: '10:00 AM - 4:00 PM',
    location: '123 Party Lane, Austin, TX 78701',
    totalAmount: '299.00',
    bookingUrl: 'https://app.bouncepro.com/bookings/BK-2024-001'
  },
  BOOKING_REMINDER: {
    customerName: 'John Smith',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Tomorrow, December 14, 2024',
    eventTime: '10:00 AM - 4:00 PM',
    location: '123 Party Lane, Austin, TX 78701',
    bookingUrl: 'https://app.bouncepro.com/bookings/BK-2024-001'
  },
  BOOKING_CANCELLED: {
    customerName: 'John Smith',
    bookingId: 'BK-2024-001',
    itemName: 'Princess Castle Bounce House',
    eventDate: 'Saturday, December 14, 2024',
    refundAmount: '149.50'
  },
  PAYMENT_RECEIVED: {
    customerName: 'John Smith',
    paymentId: 'PAY-2024-001',
    paymentDate: 'December 2, 2024',
    paymentMethod: 'Credit Card',
    bookingId: 'BK-2024-001',
    amount: '149.50',
    remainingBalance: '149.50',
    receiptUrl: 'https://app.bouncepro.com/receipts/PAY-2024-001'
  },
  PASSWORD_RESET: {
    userName: 'John Smith',
    resetLink: 'https://app.bouncepro.com/auth/reset-password?token=abc123'
  },
  WELCOME: {
    userName: 'John Smith',
    userEmail: 'john@example.com',
    tenantName: 'Bounce Kingdom Party Rentals',
    planName: 'Growth Plan',
    dashboardUrl: 'https://app.bouncepro.com/app'
  }
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')

  if (!name || !emailTemplates[name as keyof typeof emailTemplates]) {
    throw createError({ statusCode: 404, message: 'Template not found' })
  }

  const template = emailTemplates[name as keyof typeof emailTemplates]
  const data = sampleData[name] || {}

  return {
    name,
    subject: template.subject,
    html: template.html(data),
    text: template.text(data),
    sampleData: data
  }
})
```

**Step 3: Create send test email endpoint**

```typescript
// nuxt/server/routes/api/email-templates/[name]/send-test.post.ts
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email address required' })
  }

  // Forward to Payload API
  const config = useRuntimeConfig()
  const response = await $fetch(`${config.payloadApiUrl}/api/email/send-test`, {
    method: 'POST',
    body: { templateName: name, toEmail: email }
  })

  return { success: true, message: `Test email sent to ${email}` }
})
```

**Step 4: Commit**

```bash
git add nuxt/server/routes/api/email-templates/
git commit -m "feat: add email template API endpoints for list, preview, and test send"
```

---

## Task 2: Email Template Preview Page

**Files:**
- Create: `nuxt/app/pages/app/settings/emails.vue`

**Step 1: Create the email settings page**

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

interface EmailTemplate {
  id: string
  name: string
  description: string
  trigger: string
}

const toast = useToast()
const { data: templatesData, pending } = useFetch('/api/email-templates')

const templates = computed(() => templatesData.value?.templates || [])

const selectedTemplate = ref<string | null>(null)
const previewHtml = ref('')
const previewSubject = ref('')
const isLoadingPreview = ref(false)

const testEmailAddress = ref('')
const isSendingTest = ref(false)
const showTestModal = ref(false)

// Load preview when template selected
async function loadPreview(templateId: string) {
  selectedTemplate.value = templateId
  isLoadingPreview.value = true

  try {
    const data = await $fetch(`/api/email-templates/${templateId}/preview`)
    previewHtml.value = data.html
    previewSubject.value = data.subject
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load preview', color: 'error' })
  } finally {
    isLoadingPreview.value = false
  }
}

// Send test email
async function sendTestEmail() {
  if (!testEmailAddress.value || !selectedTemplate.value) return

  isSendingTest.value = true

  try {
    await $fetch(`/api/email-templates/${selectedTemplate.value}/send-test`, {
      method: 'POST',
      body: { email: testEmailAddress.value }
    })

    toast.add({
      title: 'Test Email Sent',
      description: `Email sent to ${testEmailAddress.value}`,
      color: 'success'
    })
    showTestModal.value = false
    testEmailAddress.value = ''
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to send test email', color: 'error' })
  } finally {
    isSendingTest.value = false
  }
}

function openTestModal() {
  if (!selectedTemplate.value) {
    toast.add({ title: 'Select Template', description: 'Please select a template first', color: 'warning' })
    return
  }
  showTestModal.value = true
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-100">Email Templates</h1>
        <p class="text-slate-400 mt-1">Preview and test your email templates</p>
      </div>
      <UButton
        icon="i-lucide-send"
        label="Send Test Email"
        color="primary"
        @click="openTestModal"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Template List -->
      <div class="lg:col-span-1">
        <UCard :ui="{ background: 'bg-slate-800/50', ring: 'ring-slate-700/50' }">
          <template #header>
            <h3 class="text-lg font-semibold text-slate-100">Templates</h3>
          </template>

          <div v-if="pending" class="space-y-3">
            <USkeleton v-for="i in 6" :key="i" class="h-16" />
          </div>

          <div v-else class="space-y-2">
            <button
              v-for="template in templates"
              :key="template.id"
              class="w-full text-left p-4 rounded-lg transition-all"
              :class="selectedTemplate === template.id
                ? 'bg-amber-500/20 ring-1 ring-amber-500/50'
                : 'bg-slate-700/30 hover:bg-slate-700/50'"
              @click="loadPreview(template.id)"
            >
              <div class="font-medium text-slate-100">{{ template.name }}</div>
              <div class="text-sm text-slate-400 mt-1">{{ template.description }}</div>
              <div class="flex items-center gap-1 mt-2 text-xs text-slate-500">
                <UIcon name="i-lucide-zap" class="w-3 h-3" />
                {{ template.trigger }}
              </div>
            </button>
          </div>
        </UCard>
      </div>

      <!-- Preview Panel -->
      <div class="lg:col-span-2">
        <UCard :ui="{ background: 'bg-slate-800/50', ring: 'ring-slate-700/50' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-100">Preview</h3>
              <UBadge v-if="previewSubject" color="neutral" variant="subtle">
                {{ previewSubject }}
              </UBadge>
            </div>
          </template>

          <div v-if="!selectedTemplate" class="flex flex-col items-center justify-center py-16 text-slate-500">
            <UIcon name="i-lucide-mail" class="w-12 h-12 mb-4" />
            <p>Select a template to preview</p>
          </div>

          <div v-else-if="isLoadingPreview" class="flex items-center justify-center py-16">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-amber-500" />
          </div>

          <div v-else class="relative">
            <!-- Email Preview in iframe -->
            <div class="bg-white rounded-lg overflow-hidden" style="min-height: 500px;">
              <iframe
                :srcdoc="previewHtml"
                class="w-full h-[600px] border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Test Email Modal -->
    <UModal v-model:open="showTestModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-slate-100 mb-4">Send Test Email</h3>
          <p class="text-slate-400 mb-4">
            Send a test email using the selected template with sample data.
          </p>

          <UFormField label="Email Address" required>
            <UInput
              v-model="testEmailAddress"
              type="email"
              placeholder="test@example.com"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="showTestModal = false"
            />
            <UButton
              color="primary"
              label="Send Test"
              icon="i-lucide-send"
              :loading="isSendingTest"
              :disabled="!testEmailAddress"
              @click="sendTestEmail"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
```

**Step 2: Commit**

```bash
git add nuxt/app/pages/app/settings/emails.vue
git commit -m "feat: add email template preview page with test send functionality"
```

---

## Task 3: Payload Email Send Test Endpoint

**Files:**
- Create: `payload/src/endpoints/email-test.ts`
- Modify: `payload/src/payload.config.ts`

**Step 1: Create the test email endpoint**

```typescript
// payload/src/endpoints/email-test.ts
import { Endpoint } from 'payload'
import { emailService } from '../lib/email'
import { emailTemplates } from '../lib/email/templates'

const sampleData: Record<string, Record<string, any>> = {
  BOOKING_CONFIRMATION: {
    customerName: 'Test User',
    bookingId: 'TEST-001',
    itemName: 'Test Bounce House',
    eventDate: 'Saturday, December 14, 2024',
    eventTime: '10:00 AM',
    location: '123 Test St, Austin, TX',
    totalAmount: '299.00',
    bookingUrl: 'https://example.com/booking/TEST-001'
  },
  BOOKING_REMINDER: {
    customerName: 'Test User',
    itemName: 'Test Bounce House',
    eventDate: 'Tomorrow',
    eventTime: '10:00 AM',
    location: '123 Test St, Austin, TX',
    bookingUrl: 'https://example.com/booking/TEST-001'
  },
  BOOKING_CANCELLED: {
    customerName: 'Test User',
    bookingId: 'TEST-001',
    itemName: 'Test Bounce House',
    eventDate: 'December 14, 2024',
    refundAmount: '149.50'
  },
  PAYMENT_RECEIVED: {
    customerName: 'Test User',
    paymentId: 'PAY-TEST-001',
    paymentDate: 'December 2, 2024',
    paymentMethod: 'Credit Card',
    bookingId: 'TEST-001',
    amount: '149.50',
    remainingBalance: '149.50',
    receiptUrl: 'https://example.com/receipt/PAY-TEST-001'
  },
  PASSWORD_RESET: {
    userName: 'Test User',
    resetLink: 'https://example.com/reset?token=test123'
  },
  WELCOME: {
    userName: 'Test User',
    userEmail: 'test@example.com',
    tenantName: 'Test Business',
    planName: 'Free Trial',
    dashboardUrl: 'https://example.com/app'
  }
}

export const sendTestEmailEndpoint: Endpoint = {
  path: '/email/send-test',
  method: 'post',
  handler: async (req) => {
    try {
      const body = await req.json?.() || {}
      const { templateName, toEmail } = body

      if (!templateName || !toEmail) {
        return Response.json(
          { error: 'templateName and toEmail are required' },
          { status: 400 }
        )
      }

      const template = emailTemplates[templateName as keyof typeof emailTemplates]
      if (!template) {
        return Response.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      const data = sampleData[templateName] || {}

      await emailService.sendCustomEmail(
        { email: toEmail, name: 'Test Recipient' },
        `[TEST] ${template.subject}`,
        template.html(data),
        template.text(data),
        ['test-email']
      )

      return Response.json({ success: true, message: `Test email sent to ${toEmail}` })
    } catch (error) {
      console.error('Failed to send test email:', error)
      return Response.json(
        { error: error instanceof Error ? error.message : 'Failed to send email' },
        { status: 500 }
      )
    }
  }
}
```

**Step 2: Register endpoint in payload.config.ts**

Add to the endpoints array:
```typescript
import { sendTestEmailEndpoint } from './endpoints/email-test'

// In endpoints array:
endpoints: [
  // ... existing endpoints
  sendTestEmailEndpoint,
]
```

**Step 3: Commit**

```bash
git add payload/src/endpoints/email-test.ts payload/src/payload.config.ts
git commit -m "feat: add email test send endpoint for template testing"
```

---

## Task 4: Hook Emails to Booking Creation

**Files:**
- Modify: `payload/src/collections/Bookings.ts`

**Step 1: Add afterChange hook for email sending**

Add to the Bookings collection hooks:

```typescript
import { emailService } from '../lib/email'

// In hooks section:
hooks: {
  afterChange: [
    async ({ doc, operation, req }) => {
      // Send confirmation email on booking creation
      if (operation === 'create' && doc.status === 'confirmed') {
        try {
          // Fetch related data
          const customer = typeof doc.customer === 'object'
            ? doc.customer
            : await req.payload.findByID({ collection: 'customers', id: doc.customer })

          const tenant = typeof doc.tenantId === 'object'
            ? doc.tenantId
            : await req.payload.findByID({ collection: 'tenants', id: doc.tenantId })

          const item = doc.items?.[0]
          const service = item?.service
            ? (typeof item.service === 'object' ? item.service : await req.payload.findByID({ collection: 'services', id: item.service }))
            : null

          if (customer?.email && tenant) {
            await emailService.sendBookingConfirmation(
              {
                id: doc.id || doc.bookingNumber,
                eventDate: doc.startDate,
                eventTime: doc.startTime || 'TBD',
                location: doc.deliveryAddress?.street
                  ? `${doc.deliveryAddress.street}, ${doc.deliveryAddress.city}, ${doc.deliveryAddress.state}`
                  : 'TBD',
                totalAmount: doc.totalAmount || 0,
                status: doc.status,
                item: service ? { id: service.id, name: service.name } : undefined
              },
              {
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`,
                email: customer.email,
                phone: customer.phone
              },
              {
                id: tenant.id,
                name: tenant.name,
                domain: tenant.slug
              }
            )
            console.log(`Booking confirmation email sent to ${customer.email}`)
          }
        } catch (error) {
          console.error('Failed to send booking confirmation email:', error)
          // Don't throw - email failure shouldn't block booking creation
        }
      }

      // Send cancellation email
      if (operation === 'update' && doc.status === 'cancelled') {
        try {
          const customer = typeof doc.customer === 'object'
            ? doc.customer
            : await req.payload.findByID({ collection: 'customers', id: doc.customer })

          const tenant = typeof doc.tenantId === 'object'
            ? doc.tenantId
            : await req.payload.findByID({ collection: 'tenants', id: doc.tenantId })

          if (customer?.email && tenant) {
            await emailService.sendBookingCancellation(
              {
                id: doc.id || doc.bookingNumber,
                eventDate: doc.startDate,
                eventTime: doc.startTime || '',
                location: '',
                totalAmount: doc.totalAmount || 0,
                status: doc.status
              },
              {
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`,
                email: customer.email
              },
              {
                id: tenant.id,
                name: tenant.name
              },
              doc.refundAmount
            )
          }
        } catch (error) {
          console.error('Failed to send cancellation email:', error)
        }
      }
    }
  ]
}
```

**Step 2: Commit**

```bash
git add payload/src/collections/Bookings.ts
git commit -m "feat: hook email sending to booking creation and cancellation"
```

---

## Task 5: Demo Payment Mode

**Files:**
- Modify: `docker-compose.yml` - add DEMO_MODE env var
- Create: `payload/src/lib/demo-mode.ts`
- Modify: `payload/src/endpoints/stripe/checkout.ts`

**Step 1: Add DEMO_MODE to docker-compose.yml**

```yaml
# In payload service environment section:
DEMO_MODE: ${DEMO_MODE:-false}
```

**Step 2: Create demo mode utility**

```typescript
// payload/src/lib/demo-mode.ts
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === 'true'
}

export interface DemoCheckoutResult {
  success: true
  checkoutUrl: string
  sessionId: string
  mode: 'demo'
}

export function createDemoCheckoutSession(bookingId: string): DemoCheckoutResult {
  // Generate a fake session ID
  const sessionId = `demo_cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Return URL that will auto-complete the payment
  const baseUrl = process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3005'
  const successUrl = `${baseUrl}/book/confirmation?session_id=${sessionId}&booking_id=${bookingId}&demo=true`

  return {
    success: true,
    checkoutUrl: successUrl,
    sessionId,
    mode: 'demo'
  }
}

export async function completeDemoPayment(payload: any, bookingId: string, amount: number) {
  // Create a payment record marking it as demo/succeeded
  const payment = await payload.create({
    collection: 'payments',
    data: {
      bookingId,
      amount,
      status: 'succeeded',
      stripePaymentIntentId: `demo_pi_${Date.now()}`,
      paymentMethod: 'demo',
      metadata: { demoMode: true }
    }
  })

  // Update booking status
  await payload.update({
    collection: 'bookings',
    id: bookingId,
    data: {
      paymentStatus: 'paid',
      status: 'confirmed'
    }
  })

  return payment
}
```

**Step 3: Modify checkout endpoint to support demo mode**

In `payload/src/endpoints/stripe/checkout.ts`, add at the start of the handler:

```typescript
import { isDemoMode, createDemoCheckoutSession } from '../../lib/demo-mode'

// At the start of the handler:
if (isDemoMode()) {
  const { bookingId } = await req.json()
  const result = createDemoCheckoutSession(bookingId)
  return Response.json(result)
}
```

**Step 4: Commit**

```bash
git add docker-compose.yml payload/src/lib/demo-mode.ts payload/src/endpoints/stripe/checkout.ts
git commit -m "feat: add demo payment mode for QA testing without Stripe"
```

---

## Task 6: QA Seed Script

**Files:**
- Create: `payload/src/seed-qa.ts`
- Modify: `payload/package.json` - add seed:qa script

**Step 1: Create QA seed script**

```typescript
// payload/src/seed-qa.ts
import { getPayload } from 'payload'
import config from './payload.config'

async function seedQA() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding QA test data...')

  // 1. Create QA Tenant
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'QA Test Rentals',
      slug: 'qa-test',
      email: 'qa@bouncepro.test',
      phone: '555-QA-TEST',
      status: 'active',
      plan: 'growth',
      settings: {
        timezone: 'America/Chicago',
        currency: 'USD'
      }
    }
  })
  console.log('✅ Created QA tenant:', tenant.id)

  // 2. Create QA User (no real email)
  const qaUser = await payload.create({
    collection: 'users',
    data: {
      email: 'qa@bouncepro.test',
      password: 'QATest123!',
      firstName: 'QA',
      lastName: 'Tester',
      role: 'business_owner',
      tenantId: tenant.id
    }
  })
  console.log('✅ Created QA user:', qaUser.email)

  // 3. Create sample rental items
  const items = [
    { name: 'Castle Bounce House', category: 'bounce_house', price: 199 },
    { name: 'Water Slide Combo', category: 'water_slide', price: 349 },
    { name: 'Obstacle Course', category: 'obstacle_course', price: 449 },
    { name: 'Party Package Deluxe', category: 'combo_unit', price: 599 }
  ]

  const createdItems = []
  for (const item of items) {
    const created = await payload.create({
      collection: 'rental-items',
      data: {
        tenantId: tenant.id,
        name: item.name,
        category: item.category,
        status: 'active',
        pricing: { daily: item.price },
        quantity: 3
      }
    })
    createdItems.push(created)
  }
  console.log('✅ Created', createdItems.length, 'rental items')

  // 4. Create sample customers
  const customers = [
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.test', phone: '555-0101' },
    { firstName: 'Mike', lastName: 'Williams', email: 'mike@example.test', phone: '555-0102' },
    { firstName: 'Emily', lastName: 'Brown', email: 'emily@example.test', phone: '555-0103' },
    { firstName: 'David', lastName: 'Miller', email: 'david@example.test', phone: '555-0104' },
    { firstName: 'Lisa', lastName: 'Davis', email: 'lisa@example.test', phone: '555-0105' }
  ]

  const createdCustomers = []
  for (const customer of customers) {
    const created = await payload.create({
      collection: 'customers',
      data: {
        tenantId: tenant.id,
        ...customer,
        address: {
          street: '123 Test St',
          city: 'Austin',
          state: 'TX',
          zip: '78701'
        }
      }
    })
    createdCustomers.push(created)
  }
  console.log('✅ Created', createdCustomers.length, 'customers')

  // 5. Create sample bookings with various statuses
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled']
  const bookings = []

  for (let i = 0; i < 20; i++) {
    const customer = createdCustomers[i % createdCustomers.length]
    const item = createdItems[i % createdItems.length]
    const status = statuses[i % statuses.length]
    const daysFromNow = i - 10 // Some past, some future

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + daysFromNow)

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        tenantId: tenant.id,
        customer: customer.id,
        bookingNumber: `QA-${String(i + 1).padStart(4, '0')}`,
        status,
        paymentStatus: status === 'completed' ? 'paid' : status === 'cancelled' ? 'refunded' : 'pending',
        startDate: startDate.toISOString(),
        endDate: new Date(startDate.getTime() + 86400000).toISOString(),
        totalAmount: item.pricing?.daily || 199,
        items: [{ service: item.id, quantity: 1 }],
        deliveryAddress: {
          street: '456 Party Ave',
          city: 'Austin',
          state: 'TX',
          zip: '78702'
        }
      }
    })
    bookings.push(booking)
  }
  console.log('✅ Created', bookings.length, 'bookings')

  // 6. Create sample payments for completed bookings
  const completedBookings = bookings.filter(b => b.status === 'completed')
  for (const booking of completedBookings) {
    await payload.create({
      collection: 'payments',
      data: {
        tenantId: tenant.id,
        bookingId: booking.id,
        amount: booking.totalAmount,
        status: 'succeeded',
        paymentMethod: 'card',
        stripePaymentIntentId: `demo_pi_qa_${booking.id}`
      }
    })
  }
  console.log('✅ Created payments for completed bookings')

  console.log('\n🎉 QA Seed Complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('QA Login Credentials:')
  console.log('  Email: qa@bouncepro.test')
  console.log('  Password: QATest123!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  process.exit(0)
}

seedQA().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
```

**Step 2: Add script to package.json**

```json
"scripts": {
  "seed:qa": "tsx src/seed-qa.ts"
}
```

**Step 3: Commit**

```bash
git add payload/src/seed-qa.ts payload/package.json
git commit -m "feat: add QA seed script with test accounts and sample data"
```

---

## Task 7: QA Testing Guide Document

**Files:**
- Create: `docs/QA_TESTING_GUIDE.md`

**Step 1: Create comprehensive QA testing guide**

```markdown
# BouncePro QA Testing Guide

## Quick Start

### 1. Setup QA Environment

```bash
# Enable demo mode (no real payments)
echo "DEMO_MODE=true" >> .env

# Start the app
docker compose up -d

# Seed QA test data
docker compose exec payload pnpm seed:qa
```

### 2. QA Login Credentials

| Account | Email | Password | Notes |
|---------|-------|----------|-------|
| QA Tester | qa@bouncepro.test | QATest123! | Business owner with full data |
| Admin | admin@admin.com | Loloo123! | Platform super admin |

---

## Testing Scenarios

### A. Dashboard & Navigation

**Pre-seeded data available:**
- 4 rental items
- 5 customers
- 20 bookings (various statuses)
- Payment history

**Test checklist:**
- [ ] Login with QA account
- [ ] Dashboard loads with stats
- [ ] Navigation works (sidebar links)
- [ ] Cmd+K global search works
- [ ] Notifications bell shows updates
- [ ] Breadcrumbs display correctly

### B. Inventory Management

**URL:** `/app/inventory`

- [ ] View all rental items (4 pre-seeded)
- [ ] Create new item
- [ ] Edit existing item
- [ ] Delete item
- [ ] View item details
- [ ] Check availability calendar

### C. Booking Management

**URL:** `/app/bookings`

- [ ] View bookings list (20 pre-seeded)
- [ ] Filter by status (pending, confirmed, completed, cancelled)
- [ ] Search bookings
- [ ] View booking details
- [ ] Create new booking (existing customer)
- [ ] Create new booking (new customer)
- [ ] Update booking status

### D. Customer Management

**URL:** `/app/customers`

- [ ] View customer list (5 pre-seeded)
- [ ] Search customers
- [ ] View customer details
- [ ] View customer booking history
- [ ] Create new customer
- [ ] Edit customer
- [ ] Quick book from customer profile

### E. Calendar View

**URL:** `/app/calendar`

- [ ] Month view displays bookings
- [ ] Week view works
- [ ] Day view works
- [ ] Click booking to view details
- [ ] Color coding by status

### F. Reports

**URL:** `/app/reports`

- [ ] Revenue report loads
- [ ] Booking analytics display
- [ ] Inventory utilization shows
- [ ] Customer insights work
- [ ] Date range picker functions
- [ ] Export to CSV works

### G. Settings

**URL:** `/app/settings`

- [ ] Profile settings save
- [ ] Booking settings update
- [ ] Email templates preview (new!)
- [ ] Send test email works
- [ ] Team management
- [ ] API keys visible

### H. Public Booking Flow (Demo Mode)

**URL:** `/book/qa-test`

**Note:** With DEMO_MODE=true, payments auto-complete

- [ ] View rental catalog
- [ ] Select item
- [ ] Choose dates
- [ ] Fill customer info
- [ ] Add to cart
- [ ] Checkout (auto-completes in demo mode)
- [ ] Confirmation page shows

### I. Email Templates

**URL:** `/app/settings/emails`

- [ ] All 6 templates listed
- [ ] Preview renders correctly
- [ ] Send test email works (use temp-mail.org)

---

## Payment Testing (Demo Mode)

When `DEMO_MODE=true`:

1. **Checkout flows skip Stripe** - redirects directly to success
2. **Payments auto-mark as "succeeded"**
3. **No real charges occur**

This allows full flow testing without Stripe sandbox.

---

## Email Testing

Use [temp-mail.org](https://temp-mail.org) for email testing:

1. Go to temp-mail.org
2. Copy the temporary email
3. Use it in booking flow or test email send
4. Check inbox for received emails

---

## Known Test Data

### Rental Items
| Name | Category | Price |
|------|----------|-------|
| Castle Bounce House | bounce_house | $199 |
| Water Slide Combo | water_slide | $349 |
| Obstacle Course | obstacle_course | $449 |
| Party Package Deluxe | combo_unit | $599 |

### Sample Customers
| Name | Email |
|------|-------|
| Sarah Johnson | sarah@example.test |
| Mike Williams | mike@example.test |
| Emily Brown | emily@example.test |
| David Miller | david@example.test |
| Lisa Davis | lisa@example.test |

### Bookings
- 5 pending
- 5 confirmed
- 5 completed (with payments)
- 5 cancelled

---

## Reporting Issues

When reporting bugs, include:
1. URL where issue occurred
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshot if applicable
5. Browser/device info

---

## Resetting Test Data

To reset QA data to fresh state:

```bash
# Drop and recreate database
docker compose down -v
docker compose up -d

# Re-run seed
docker compose exec payload pnpm seed:qa
```
```

**Step 2: Commit**

```bash
git add docs/QA_TESTING_GUIDE.md
git commit -m "docs: add comprehensive QA testing guide"
```

---

## Task 8: Verification & Chrome DevTools Testing

**Manual testing steps:**

1. **Start app with demo mode:**
   ```bash
   DEMO_MODE=true docker compose up -d
   ```

2. **Seed QA data:**
   ```bash
   docker compose exec payload pnpm seed:qa
   ```

3. **Test email preview page:**
   - Navigate to `/app/settings/emails`
   - Select each template
   - Verify preview renders
   - Send test to temp-mail.org address
   - Verify email received

4. **Test booking flow with email:**
   - Create new booking
   - Verify confirmation email sent
   - Cancel booking
   - Verify cancellation email sent

5. **Test demo payment mode:**
   - Go to `/book/qa-test`
   - Complete booking flow
   - Verify auto-redirect to confirmation (no Stripe)
   - Verify payment record created

6. **Use Chrome DevTools MCP to verify:**
   - No console errors
   - Network requests succeed
   - Pages render correctly

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Email template API endpoints |
| 2 | Email preview settings page |
| 3 | Payload email test endpoint |
| 4 | Hook emails to booking flow |
| 5 | Demo payment mode |
| 6 | QA seed script |
| 7 | QA testing guide |
| 8 | Verification testing |
