<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-1.5 text-gray-900 dark:text-white">Webhook Endpoints</h2>
        <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888]">
          Receive real-time event notifications at your server
        </p>
      </div>
      <UButton
        color="primary"
        size="md"
        icon="i-lucide-plus"
        @click="showCreateModal = true"
      >
        Add Endpoint
      </UButton>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]">
      <div class="w-8 h-8 border-[3px] border-amber-200 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin"></div>
      <p>Loading webhooks...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Webhook Endpoints List -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg dark:hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-webhook" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Configured Endpoints</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                {{ endpoints.length }} {{ endpoints.length === 1 ? 'endpoint' : 'endpoints' }}
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div v-if="endpoints.length === 0" class="flex flex-col items-center justify-center py-12 px-8 gap-4">
            <UIcon name="i-lucide-webhook" class="w-12 h-12 text-gray-300 dark:text-[#333]" />
            <p class="m-0 text-lg font-semibold text-gray-900 dark:text-white">No webhook endpoints configured</p>
            <p class="m-0 text-sm text-gray-500 dark:text-[#666] text-center max-w-[400px]">
              Set up webhooks to receive real-time notifications about bookings, payments, and more.
            </p>
            <UButton
              color="primary"
              size="lg"
              icon="i-lucide-plus"
              @click="showCreateModal = true"
            >
              Add Your First Endpoint
            </UButton>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div
              v-for="endpoint in endpoints"
              :key="endpoint.id"
              class="p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex flex-col gap-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 flex-wrap mb-2">
                    <code class="font-mono text-sm text-blue-600 dark:text-blue-400 break-all">{{ endpoint.url }}</code>
                    <UBadge
                      :color="endpoint.isActive ? 'success' : 'neutral'"
                      variant="subtle"
                      size="sm"
                    >
                      {{ endpoint.isActive ? 'Active' : 'Disabled' }}
                    </UBadge>
                  </div>
                  <p class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white m-0 mb-2">{{ endpoint.name }}</p>
                  <div class="flex flex-wrap gap-4">
                    <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]">
                      <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                      Created {{ formatDate(endpoint.createdAt) }}
                    </span>
                    <span v-if="endpoint.lastDeliveryAt" class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]">
                      <UIcon name="i-lucide-send" class="w-3.5 h-3.5" />
                      Last delivery {{ formatDate(endpoint.lastDeliveryAt) }}
                    </span>
                    <span
                      v-if="endpoint.lastDeliveryStatus === 'failed'"
                      class="flex items-center gap-1.5 text-[0.8125rem] text-red-600 dark:text-red-400"
                    >
                      <UIcon name="i-lucide-alert-circle" class="w-3.5 h-3.5" />
                      {{ endpoint.failedDeliveriesCount }} failed
                      {{ endpoint.failedDeliveriesCount === 1 ? 'delivery' : 'deliveries' }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0 flex-wrap">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-send"
                    @click="testEndpoint(endpoint.id)"
                  >
                    Test
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-list"
                    @click="viewDeliveries(endpoint.id)"
                  >
                    Logs
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    :color="endpoint.isActive ? 'neutral' : 'success'"
                    @click="toggleEndpoint(endpoint.id, !endpoint.isActive)"
                  >
                    {{ endpoint.isActive ? 'Disable' : 'Enable' }}
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    color="error"
                    @click="confirmDelete(endpoint)"
                  >
                    Delete
                  </UButton>
                </div>
              </div>

              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-[0.8125rem] text-gray-500 dark:text-[#666] font-semibold">Events:</span>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="evt in endpoint.events"
                    :key="evt.event"
                    color="primary"
                    variant="subtle"
                    size="sm"
                  >
                    {{ evt.event }}
                  </UBadge>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div class="text-[0.8125rem] text-gray-500 dark:text-[#666] font-semibold">Signing Secret:</div>
                <div class="flex items-center gap-4 py-3.5 px-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg">
                  <code class="flex-1 font-mono text-sm text-purple-600 dark:text-purple-400 break-all tabular-nums">{{
                    showSecret[endpoint.id] ? endpoint.secret : maskSecret(endpoint.secret)
                  }}</code>
                  <div class="flex gap-2 flex-shrink-0">
                    <UButton
                      variant="ghost"
                      size="sm"
                      :icon="showSecret[endpoint.id] ? 'i-lucide-eye-slash' : 'i-lucide-eye'"
                      @click="toggleSecret(endpoint.id)"
                    />
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-lucide-copy"
                      @click="copySecret(endpoint.secret)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Available Events -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg dark:hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-zap" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Available Events</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Events you can subscribe to</p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            <div
              v-for="event in availableEvents"
              :key="event.value"
              class="flex items-start gap-4 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl"
            >
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon :name="event.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold m-0 mb-1 text-gray-900 dark:text-white font-mono">{{ event.label }}</h4>
                <p class="m-0 text-[0.8125rem] text-gray-600 dark:text-[#888] leading-snug">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Webhook Documentation -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg dark:hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-book-open" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Implementation Guide</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">How to verify webhook signatures</p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <p class="m-0 text-[0.9375rem] text-gray-700 dark:text-[#ccc] leading-relaxed">
              All webhook requests include an <code class="font-mono text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 py-0.5 px-1.5 rounded">X-Webhook-Signature</code> header
              that you should verify to ensure the request came from BouncePro.
            </p>

            <div class="bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg overflow-hidden">
              <div class="flex items-center justify-between py-3 px-4 bg-gray-100 dark:bg-black/20 border-b border-gray-200 dark:border-white/[0.06]">
                <span class="text-[0.8125rem] font-semibold text-gray-600 dark:text-[#888] uppercase tracking-wider">Node.js Example</span>
                <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-copy"
                  @click="copyCode(nodeExample)"
                >
                  Copy
                </UButton>
              </div>
              <pre class="m-0 p-4 overflow-x-auto"><code class="font-mono text-[0.8125rem] text-green-700 dark:text-green-400 leading-relaxed whitespace-pre">{{ nodeExample }}</code></pre>
            </div>

            <div class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/[0.05] border border-blue-200 dark:border-blue-500/15 rounded-lg">
              <UIcon name="i-lucide-info" class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="m-0 mb-2 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>Signature Format:</strong> <code class="font-mono text-[0.8125rem] text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10 py-0.5 px-1.5 rounded">t=timestamp,v1=signature</code>
                </p>
                <p class="m-0 mb-2 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>Timestamp Tolerance:</strong> Signatures are valid for 5 minutes
                </p>
                <p class="m-0 text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>Response:</strong> Return HTTP 200-299 for successful processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Create Webhook Modal -->
    <UModal v-model:open="showCreateModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Add Webhook Endpoint</h3>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <UFormField label="Name" required help="A friendly name for this endpoint">
              <UInput
                v-model="webhookForm.name"
                size="lg"
                placeholder="Zapier Integration"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Endpoint URL"
              required
              help="Must be a valid HTTPS URL"
            >
              <UInput
                v-model="webhookForm.url"
                size="lg"
                type="url"
                placeholder="https://api.yourapp.com/webhooks/bouncepro"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Events to Subscribe" required>
              <div class="flex flex-col gap-2 mt-2">
                <label
                  v-for="event in availableEvents"
                  :key="event.value"
                  class="flex items-start gap-4 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10"
                >
                  <input
                    v-model="webhookForm.events"
                    type="checkbox"
                    :value="event.value"
                    class="w-[18px] h-[18px] mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <div class="flex items-start gap-3 flex-1">
                    <UIcon :name="event.icon" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span class="block text-sm font-semibold text-gray-900 dark:text-white font-mono mb-0.5">{{ event.label }}</span>
                      <span class="block text-[0.8125rem] text-gray-600 dark:text-[#888]">{{ event.description }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton variant="ghost" @click="showCreateModal = false">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :loading="saving"
                :disabled="!webhookForm.name || !webhookForm.url || webhookForm.events.length === 0"
                @click="createEndpoint"
              >
                Add Endpoint
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Delete Webhook Endpoint?</h3>
            </div>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed">
              Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ selectedEndpoint?.name }}</strong>?
              You will stop receiving events at this endpoint.
            </p>
            <div class="p-3 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg mt-2">
              <code class="font-mono text-sm text-blue-600 dark:text-blue-400 break-all">{{ selectedEndpoint?.url }}</code>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton variant="ghost" @click="showDeleteModal = false">
                Cancel
              </UButton>
              <UButton
                color="error"
                :loading="saving"
                @click="deleteEndpoint"
              >
                Delete Endpoint
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delivery Logs Modal -->
    <UModal v-model:open="showDeliveriesModal">
      <template #content>
        <UCard class="max-w-[700px]">
          <template #header>
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Webhook Delivery Logs</h3>
          </template>

          <div class="p-6">
            <div v-if="loadingDeliveries" class="flex flex-col items-center justify-center py-8 gap-3 text-gray-600 dark:text-[#888]">
              <div class="w-6 h-6 border-2 border-amber-200 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin"></div>
              <p>Loading deliveries...</p>
            </div>

            <div v-else-if="deliveries.length === 0" class="flex flex-col items-center justify-center py-8 gap-2">
              <UIcon name="i-lucide-inbox" class="w-8 h-8 text-gray-400 dark:text-[#666]" />
              <p>No deliveries yet</p>
            </div>

            <div v-else class="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
              <div
                v-for="delivery in deliveries"
                :key="delivery.id"
                class="p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg flex flex-col gap-2"
              >
                <div class="flex items-center gap-3 flex-wrap">
                  <UBadge
                    :color="getDeliveryStatusColor(delivery.status)"
                    variant="subtle"
                  >
                    {{ delivery.status }}
                  </UBadge>
                  <span class="font-mono text-[0.8125rem] text-amber-600 dark:text-amber-400">{{ delivery.event }}</span>
                  <span class="text-[0.8125rem] text-gray-500 dark:text-[#666] ml-auto">{{ formatDate(delivery.createdAt) }}</span>
                </div>
                <div v-if="delivery.response" class="flex items-center gap-3 text-[0.8125rem]">
                  <span class="font-mono text-green-700 dark:text-green-400">HTTP {{ delivery.response.statusCode }}</span>
                  <span v-if="delivery.attempts > 1" class="text-gray-500 dark:text-[#666]">
                    Attempt {{ delivery.attempts }}/{{ delivery.maxAttempts }}
                  </span>
                </div>
                <div v-if="delivery.error" class="flex items-center gap-2 p-2 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-[0.8125rem] text-red-700 dark:text-red-300">
                  <UIcon name="i-lucide-alert-circle" class="w-4 h-4 flex-shrink-0" />
                  <span>{{ delivery.error }}</span>
                </div>
                <div v-if="delivery.status === 'retrying'" class="flex items-center gap-2 p-2 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-md text-[0.8125rem] text-amber-800 dark:text-amber-200">
                  <UIcon name="i-lucide-clock" class="w-4 h-4 flex-shrink-0" />
                  <span>Next retry: {{ formatDate(delivery.nextRetryAt) }}</span>
                  <UButton
                    variant="ghost"
                    size="sm"
                    @click="retryDelivery(delivery.id)"
                  >
                    Retry Now
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton @click="showDeliveriesModal = false">
                Close
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const showDeliveriesModal = ref(false)
const loadingDeliveries = ref(false)
const showSecret = ref<Record<string, boolean>>({})
const selectedEndpoint = ref<any>(null)
const selectedEndpointId = ref<string | null>(null)

const endpoints = ref<any[]>([])
const deliveries = ref<any[]>([])

const webhookForm = ref({
  name: '',
  url: '',
  events: [] as string[],
})

const availableEvents = [
  {
    label: 'Booking Created',
    value: 'booking.created',
    description: 'Triggered when a new booking is created',
    icon: 'i-lucide-calendar-plus',
  },
  {
    label: 'Booking Updated',
    value: 'booking.updated',
    description: 'Triggered when booking details are modified',
    icon: 'i-lucide-calendar-edit',
  },
  {
    label: 'Booking Confirmed',
    value: 'booking.confirmed',
    description: 'Triggered when a booking is confirmed',
    icon: 'i-lucide-calendar-check',
  },
  {
    label: 'Booking Cancelled',
    value: 'booking.cancelled',
    description: 'Triggered when a booking is cancelled',
    icon: 'i-lucide-calendar-x',
  },
  {
    label: 'Booking Delivered',
    value: 'booking.delivered',
    description: 'Triggered when items are delivered',
    icon: 'i-lucide-truck',
  },
  {
    label: 'Booking Completed',
    value: 'booking.completed',
    description: 'Triggered when booking is completed and items picked up',
    icon: 'i-lucide-circle-check',
  },
  {
    label: 'Payment Succeeded',
    value: 'payment.succeeded',
    description: 'Triggered when a payment is successfully processed',
    icon: 'i-lucide-circle-dollar-sign',
  },
  {
    label: 'Payment Failed',
    value: 'payment.failed',
    description: 'Triggered when a payment fails',
    icon: 'i-lucide-circle-x',
  },
  {
    label: 'Payment Refunded',
    value: 'payment.refunded',
    description: 'Triggered when a refund is issued',
    icon: 'i-lucide-rotate-ccw',
  },
  {
    label: 'Customer Created',
    value: 'customer.created',
    description: 'Triggered when a new customer record is created',
    icon: 'i-lucide-user-plus',
  },
  {
    label: 'Customer Updated',
    value: 'customer.updated',
    description: 'Triggered when customer details are modified',
    icon: 'i-lucide-user-edit',
  },
  {
    label: 'Inventory Low',
    value: 'inventory.low',
    description: 'Triggered when inventory falls below threshold',
    icon: 'i-lucide-box-alert',
  },
  {
    label: 'Maintenance Due',
    value: 'maintenance.due',
    description: 'Triggered when equipment maintenance is due',
    icon: 'i-lucide-wrench',
  },
]

const nodeExample = `const crypto = require('crypto');

function verifyWebhook(req) {
  const signature = req.headers['x-webhook-signature'];
  const secret = 'whsec_...'; // Your signing secret

  // Parse signature: t=timestamp,v1=signature
  const parts = signature.split(',');
  const timestamp = parts[0].split('=')[1];
  const sig = parts[1].split('=')[1];

  // Check timestamp (5 minute tolerance)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    throw new Error('Signature expired');
  }

  // Verify signature
  const payload = timestamp + '.' + JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  )) {
    throw new Error('Invalid signature');
  }

  return true;
}`

onMounted(async () => {
  await loadEndpoints()
})

const loadEndpoints = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/webhook-endpoints')
    endpoints.value = response.docs || []
  } catch (error) {
    console.error('Failed to load webhooks:', error)
    toast.add({
      title: 'Failed to load webhooks',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const createEndpoint = async () => {
  saving.value = true
  try {
    const events = webhookForm.value.events.map((event) => ({ event }))
    await $fetch('/api/webhook-endpoints', {
      method: 'POST',
      body: {
        name: webhookForm.value.name,
        url: webhookForm.value.url,
        events,
      },
    })
    showCreateModal.value = false
    webhookForm.value = { name: '', url: '', events: [] }
    await loadEndpoints()
    toast.add({
      title: 'Webhook endpoint created',
      color: 'success',
    })
  } catch (error: any) {
    console.error('Failed to create webhook:', error)
    toast.add({
      title: 'Failed to create webhook',
      description: error.data?.message || 'Please check your URL and try again',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

const testEndpoint = async (id: string) => {
  try {
    await $fetch(`/api/webhook-endpoints/${id}/test`, {
      method: 'POST',
    })
    toast.add({
      title: 'Test event sent',
      description: 'Check your endpoint for the test payload',
      color: 'success',
    })
  } catch (error) {
    console.error('Test failed:', error)
    toast.add({
      title: 'Test failed',
      color: 'error',
    })
  }
}

const toggleEndpoint = async (id: string, isActive: boolean) => {
  try {
    await $fetch(`/api/webhook-endpoints/${id}`, {
      method: 'PATCH',
      body: { isActive },
    })
    await loadEndpoints()
    toast.add({
      title: `Endpoint ${isActive ? 'enabled' : 'disabled'}`,
      color: 'success',
    })
  } catch (error) {
    console.error('Failed to toggle endpoint:', error)
    toast.add({
      title: 'Failed to update endpoint',
      color: 'error',
    })
  }
}

const confirmDelete = (endpoint: any) => {
  selectedEndpoint.value = endpoint
  showDeleteModal.value = true
}

const deleteEndpoint = async () => {
  if (!selectedEndpoint.value) return

  saving.value = true
  try {
    await $fetch(`/api/webhook-endpoints/${selectedEndpoint.value.id}`, {
      method: 'DELETE',
    })
    showDeleteModal.value = false
    selectedEndpoint.value = null
    await loadEndpoints()
    toast.add({
      title: 'Webhook endpoint deleted',
      color: 'success',
    })
  } catch (error) {
    console.error('Failed to delete webhook:', error)
    toast.add({
      title: 'Failed to delete webhook',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

const viewDeliveries = async (endpointId: string) => {
  selectedEndpointId.value = endpointId
  showDeliveriesModal.value = true
  loadingDeliveries.value = true

  try {
    const response = await $fetch(`/api/webhook-deliveries?endpointId=${endpointId}`)
    deliveries.value = response.docs || []
  } catch (error) {
    console.error('Failed to load deliveries:', error)
    toast.add({
      title: 'Failed to load delivery logs',
      color: 'error',
    })
  } finally {
    loadingDeliveries.value = false
  }
}

const retryDelivery = async (deliveryId: string) => {
  try {
    await $fetch(`/api/webhook-deliveries/${deliveryId}/retry`, {
      method: 'POST',
    })
    toast.add({
      title: 'Retry triggered',
      color: 'success',
    })
    // Reload deliveries after a short delay
    setTimeout(() => {
      if (selectedEndpointId.value) {
        viewDeliveries(selectedEndpointId.value)
      }
    }, 1000)
  } catch (error) {
    console.error('Failed to retry delivery:', error)
    toast.add({
      title: 'Retry failed',
      color: 'error',
    })
  }
}

const toggleSecret = (id: string) => {
  showSecret.value[id] = !showSecret.value[id]
}

const maskSecret = (secret: string) => {
  const prefix = secret.substring(0, 12)
  return `${prefix}${'•'.repeat(32)}`
}

const copySecret = async (secret: string) => {
  try {
    await navigator.clipboard.writeText(secret)
    toast.add({
      title: 'Secret copied to clipboard',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'Failed to copy',
      color: 'error',
    })
  }
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    toast.add({
      title: 'Code copied to clipboard',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'Failed to copy',
      color: 'error',
    })
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

const getDeliveryStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'success'
    case 'failed':
      return 'error'
    case 'retrying':
      return 'warning'
    case 'pending':
      return 'primary'
    default:
      return 'neutral'
  }
}
</script>
