<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">API Keys & Webhooks</h2>
        <p class="section-description">Manage programmatic access to your data</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading settings...</p>
    </div>

    <div v-else class="settings-grid">
      <!-- API Keys -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-key" class="icon" />
            </div>
            <div>
              <h3 class="card-title">API Keys</h3>
              <p class="card-description">
                {{ apiKeys.length }} active
                {{ apiKeys.length === 1 ? 'key' : 'keys' }}
              </p>
            </div>
            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-plus"
              @click="showCreateKeyModal = true"
              class="header-action"
            >
              Create API Key
            </UButton>
          </div>
        </template>

        <div class="card-content">
          <div v-if="apiKeys.length === 0" class="empty-state">
            <UIcon name="i-heroicons-key" class="empty-icon" />
            <p class="empty-text">No API keys created yet</p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-plus"
              @click="showCreateKeyModal = true"
            >
              Create Your First API Key
            </UButton>
          </div>

          <div v-else class="api-keys-list">
            <div v-for="key in apiKeys" :key="key.id" class="api-key-item">
              <div class="key-header">
                <div class="key-info">
                  <h4 class="key-name">{{ key.name }}</h4>
                  <div class="key-meta">
                    <span class="meta-item">
                      <UIcon name="i-heroicons-calendar" class="meta-icon" />
                      Created {{ formatDate(key.createdAt) }}
                    </span>
                    <span v-if="key.lastUsed" class="meta-item">
                      <UIcon name="i-heroicons-clock" class="meta-icon" />
                      Last used {{ formatDate(key.lastUsed) }}
                    </span>
                    <span v-else class="meta-item unused">Never used</span>
                  </div>
                </div>
                <UButton
                  variant="ghost"
                  size="sm"
                  color="error"
                  @click="confirmDeleteKey(key)"
                >
                  Delete
                </UButton>
              </div>

              <div class="key-value-container">
                <div class="key-value">
                  <code>{{ showKey[key.id] ? key.key : maskKey(key.key) }}</code>
                </div>
                <div class="key-actions">
                  <UButton
                    variant="ghost"
                    size="sm"
                    :icon="showKey[key.id] ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    @click="toggleShowKey(key.id)"
                  >
                    {{ showKey[key.id] ? 'Hide' : 'Show' }}
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-clipboard-document"
                    @click="copyKey(key.key)"
                  >
                    Copy
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <div class="api-info">
            <UIcon name="i-heroicons-information-circle" class="info-icon" />
            <div>
              <p class="info-text">
                <strong>Keep your API keys secure.</strong> Never share them publicly
                or commit them to version control. Use environment variables in your
                applications.
              </p>
              <a href="#" class="info-link">View API Documentation →</a>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Webhooks -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-bolt" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Webhook Endpoints</h3>
              <p class="card-description">
                {{ webhooks.length }} configured
                {{ webhooks.length === 1 ? 'endpoint' : 'endpoints' }}
              </p>
            </div>
            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-plus"
              @click="showCreateWebhookModal = true"
              class="header-action"
            >
              Add Endpoint
            </UButton>
          </div>
        </template>

        <div class="card-content">
          <div v-if="webhooks.length === 0" class="empty-state">
            <UIcon name="i-heroicons-bolt" class="empty-icon" />
            <p class="empty-text">No webhook endpoints configured</p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-plus"
              @click="showCreateWebhookModal = true"
            >
              Add Your First Endpoint
            </UButton>
          </div>

          <div v-else class="webhooks-list">
            <div v-for="webhook in webhooks" :key="webhook.id" class="webhook-item">
              <div class="webhook-header">
                <div class="webhook-info">
                  <div class="webhook-url">
                    <code>{{ webhook.url }}</code>
                    <div
                      class="webhook-status"
                      :class="`status-${webhook.status}`"
                    >
                      {{ capitalizeFirst(webhook.status) }}
                    </div>
                  </div>
                  <div class="webhook-meta">
                    <span class="meta-item">
                      <UIcon name="i-heroicons-calendar" class="meta-icon" />
                      Created {{ formatDate(webhook.createdAt) }}
                    </span>
                  </div>
                </div>
                <div class="webhook-actions">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrow-path"
                    @click="testWebhookEndpoint(webhook.id)"
                  >
                    Test
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    color="error"
                    @click="confirmDeleteWebhook(webhook)"
                  >
                    Delete
                  </UButton>
                </div>
              </div>

              <div class="webhook-events">
                <span class="events-label">Events:</span>
                <div class="events-tags">
                  <div
                    v-for="event in webhook.events"
                    :key="event"
                    class="event-tag"
                  >
                    {{ event }}
                  </div>
                </div>
              </div>

              <div class="webhook-secret">
                <div class="secret-label">Signing Secret:</div>
                <div class="secret-value">
                  <code>{{ showWebhookSecret[webhook.id] ? webhook.secret : maskKey(webhook.secret) }}</code>
                  <div class="secret-actions">
                    <UButton
                      variant="ghost"
                      size="sm"
                      :icon="showWebhookSecret[webhook.id] ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                      @click="toggleShowWebhookSecret(webhook.id)"
                    />
                    <UButton
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-clipboard-document"
                      @click="copyKey(webhook.secret)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="webhook-info">
            <UIcon name="i-heroicons-information-circle" class="info-icon" />
            <div>
              <p class="info-text">
                <strong>Webhook endpoints</strong> receive real-time event notifications.
                Use the signing secret to verify webhook authenticity.
              </p>
              <a href="#" class="info-link">View Webhook Documentation →</a>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Available Events -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-list-bullet" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Available Events</h3>
              <p class="card-description">Events you can subscribe to</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="events-grid">
            <div
              v-for="event in availableEvents"
              :key="event.name"
              class="event-card"
            >
              <div class="event-icon-wrapper">
                <UIcon :name="event.icon" class="icon" />
              </div>
              <div class="event-info">
                <h4 class="event-name">{{ event.name }}</h4>
                <p class="event-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Create API Key Modal -->
    <UModal v-model:open="showCreateKeyModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="modal-title">Create API Key</h3>
          </template>

          <div class="modal-content">
            <UFormGroup label="Key Name" required help="A descriptive name for this key">
              <UInput
                v-model="newKeyName"
                size="lg"
                placeholder="Production API Key"
                class="w-full"
              />
            </UFormGroup>

            <div v-if="createdKey" class="created-key-display">
              <div class="key-warning">
                <UIcon name="i-heroicons-exclamation-triangle" class="warning-icon" />
                <strong>Important:</strong> Copy your API key now. You won't be able to see it again!
              </div>
              <div class="key-display">
                <code>{{ createdKey.key }}</code>
                <UButton
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyKey(createdKey.key)"
                >
                  Copy
                </UButton>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="modal-actions">
              <UButton v-if="createdKey" @click="closeCreateKeyModal">
                Done
              </UButton>
              <template v-else>
                <UButton variant="ghost" @click="showCreateKeyModal = false">
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  :loading="saving"
                  :disabled="!newKeyName"
                  @click="handleCreateKey"
                >
                  Create API Key
                </UButton>
              </template>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Create Webhook Modal -->
    <UModal v-model:open="showCreateWebhookModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="modal-title">Add Webhook Endpoint</h3>
          </template>

          <div class="modal-content">
            <UFormGroup
              label="Endpoint URL"
              required
              help="The URL where events will be sent"
            >
              <UInput
                v-model="webhookForm.url"
                size="lg"
                type="url"
                placeholder="https://api.yourapp.com/webhooks"
                class="w-full"
              />
            </UFormGroup>

            <UFormGroup label="Events to Subscribe" required>
              <div class="event-checkboxes">
                <label
                  v-for="event in availableEvents"
                  :key="event.name"
                  class="event-checkbox"
                >
                  <input
                    v-model="webhookForm.events"
                    type="checkbox"
                    :value="event.name"
                    class="checkbox-input"
                  />
                  <div class="checkbox-content">
                    <UIcon :name="event.icon" class="checkbox-icon" />
                    <div>
                      <span class="checkbox-label">{{ event.name }}</span>
                      <span class="checkbox-description">{{ event.description }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </UFormGroup>
          </div>

          <template #footer>
            <div class="modal-actions">
              <UButton variant="ghost" @click="showCreateWebhookModal = false">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :loading="saving"
                :disabled="!webhookForm.url || webhookForm.events.length === 0"
                @click="handleCreateWebhook"
              >
                Add Endpoint
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete API Key Confirmation Modal -->
    <UModal v-model:open="showDeleteKeyModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="modal-header">
              <UIcon name="i-heroicons-exclamation-triangle" class="modal-icon" />
              <h3 class="modal-title">Delete API Key?</h3>
            </div>
          </template>

          <div class="modal-content">
            <p class="modal-text">
              Are you sure you want to delete <strong>{{ selectedKey?.name }}</strong>?
              This action cannot be undone and any applications using this key will stop working immediately.
            </p>
          </div>

          <template #footer>
            <div class="modal-actions">
              <UButton variant="ghost" @click="showDeleteKeyModal = false">
                Cancel
              </UButton>
              <UButton
                color="error"
                :loading="saving"
                @click="deleteKey"
              >
                Delete API Key
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Webhook Confirmation Modal -->
    <UModal v-model:open="showDeleteWebhookModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="modal-header">
              <UIcon name="i-heroicons-exclamation-triangle" class="modal-icon" />
              <h3 class="modal-title">Delete Webhook Endpoint?</h3>
            </div>
          </template>

          <div class="modal-content">
            <p class="modal-text">
              Are you sure you want to delete the webhook endpoint
              <code class="webhook-url-text">{{ selectedWebhook?.url }}</code>?
              This action cannot be undone and you will stop receiving events at this endpoint.
            </p>
          </div>

          <template #footer>
            <div class="modal-actions">
              <UButton variant="ghost" @click="showDeleteWebhookModal = false">
                Cancel
              </UButton>
              <UButton
                color="error"
                :loading="saving"
                @click="deleteWebhook"
              >
                Delete Endpoint
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ApiKey } from '~/composables/useSettings'

const {
  apiKeys,
  webhooks,
  loading,
  saving,
  createApiKey,
  deleteApiKey,
  addWebhookEndpoint,
  deleteWebhookEndpoint,
  testWebhook,
} = useSettings()

const toast = useToast()

const showCreateKeyModal = ref(false)
const showCreateWebhookModal = ref(false)
const showDeleteKeyModal = ref(false)
const showDeleteWebhookModal = ref(false)
const newKeyName = ref('')
const createdKey = ref<ApiKey | null>(null)
const showKey = ref<Record<string, boolean>>({})
const showWebhookSecret = ref<Record<string, boolean>>({})
const selectedKey = ref<any>(null)
const selectedWebhook = ref<any>(null)

const webhookForm = ref({
  url: '',
  events: [] as string[],
})

const availableEvents = [
  {
    name: 'booking.created',
    description: 'Sent when a new booking is created',
    icon: 'i-heroicons-calendar-days',
  },
  {
    name: 'booking.updated',
    description: 'Sent when a booking is updated',
    icon: 'i-heroicons-pencil-square',
  },
  {
    name: 'booking.cancelled',
    description: 'Sent when a booking is cancelled',
    icon: 'i-heroicons-x-circle',
  },
  {
    name: 'payment.succeeded',
    description: 'Sent when a payment is successful',
    icon: 'i-heroicons-check-circle',
  },
  {
    name: 'payment.failed',
    description: 'Sent when a payment fails',
    icon: 'i-heroicons-exclamation-circle',
  },
  {
    name: 'inventory.updated',
    description: 'Sent when inventory availability changes',
    icon: 'i-heroicons-cube',
  },
]

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const maskKey = (key: string) => {
  const prefix = key.substring(0, 12)
  return `${prefix}${'•'.repeat(20)}`
}

const toggleShowKey = (keyId: string) => {
  showKey.value[keyId] = !showKey.value[keyId]
}

const toggleShowWebhookSecret = (webhookId: string) => {
  showWebhookSecret.value[webhookId] = !showWebhookSecret.value[webhookId]
}

const copyKey = async (key: string) => {
  try {
    await navigator.clipboard.writeText(key)
    toast.add({
      title: 'Copied to clipboard',
      color: 'success',
    })
  } catch (error) {
    toast.add({
      title: 'Failed to copy',
      color: 'error',
    })
  }
}

const handleCreateKey = async () => {
  try {
    const key = await createApiKey(newKeyName.value)
    createdKey.value = key
  } catch (error) {
    console.error('Failed to create API key:', error)
  }
}

const closeCreateKeyModal = () => {
  showCreateKeyModal.value = false
  newKeyName.value = ''
  createdKey.value = null
}

const confirmDeleteKey = (key: any) => {
  selectedKey.value = key
  showDeleteKeyModal.value = true
}

const deleteKey = async () => {
  if (selectedKey.value) {
    try {
      await deleteApiKey(selectedKey.value.id)
      showDeleteKeyModal.value = false
      selectedKey.value = null
      toast.add({
        title: 'API key deleted',
        color: 'success',
      })
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast.add({
        title: 'Failed to delete API key',
        color: 'error',
      })
    }
  }
}

const handleCreateWebhook = async () => {
  try {
    await addWebhookEndpoint(webhookForm.value.url, webhookForm.value.events)
    showCreateWebhookModal.value = false
    webhookForm.value = { url: '', events: [] }
  } catch (error) {
    console.error('Failed to create webhook:', error)
  }
}

const confirmDeleteWebhook = (webhook: any) => {
  selectedWebhook.value = webhook
  showDeleteWebhookModal.value = true
}

const deleteWebhook = async () => {
  if (selectedWebhook.value) {
    try {
      await deleteWebhookEndpoint(selectedWebhook.value.id)
      showDeleteWebhookModal.value = false
      selectedWebhook.value = null
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
    }
  }
}

const testWebhookEndpoint = async (webhookId: string) => {
  try {
    await testWebhook(webhookId)
  } catch (error) {
    console.error('Failed to test webhook:', error)
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
  color: #ffffff;
}

.section-description {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #888;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(251, 191, 36, 0.1);
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-card:hover {
  border-color: rgba(251, 191, 36, 0.2);
  box-shadow: 0 8px 32px -8px rgba(251, 191, 36, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.625rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.header-action {
  margin-left: auto;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  color: #000;
  font-weight: 600;
}

.card-content {
  padding: 1.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: #333;
}

.empty-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #666;
}

.api-keys-list,
.webhooks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-key-item {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.key-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.key-info {
  flex: 1;
}

.key-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #ffffff;
}

.key-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #666;
}

.meta-item.unused {
  color: #888;
  font-style: italic;
}

.meta-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.key-value-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
}

.key-value {
  flex: 1;
  min-width: 0;
}

.key-value code {
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #22c55e;
  word-break: break-all;
  font-variant-numeric: tabular-nums;
}

.key-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.api-info,
.webhook-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 0.5rem;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-text {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #93c5fd;
  line-height: 1.5;
}

.info-link {
  font-size: 0.875rem;
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
}

.info-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.webhook-item {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.webhook-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.webhook-info {
  flex: 1;
  min-width: 0;
}

.webhook-url {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.webhook-url code {
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #3b82f6;
  word-break: break-all;
}

.webhook-status {
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.webhook-status.status-active {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.webhook-status.status-inactive {
  background: rgba(102, 102, 102, 0.1);
  border: 1px solid rgba(102, 102, 102, 0.3);
  color: #666;
}

.webhook-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.webhook-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.webhook-events {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.events-label {
  font-size: 0.8125rem;
  color: #666;
  font-weight: 600;
}

.events-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.event-tag {
  padding: 0.375rem 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fbbf24;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.webhook-secret {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.secret-label {
  font-size: 0.8125rem;
  color: #666;
  font-weight: 600;
}

.secret-value {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
}

.secret-value code {
  flex: 1;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #a78bfa;
  word-break: break-all;
  font-variant-numeric: tabular-nums;
}

.secret-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.event-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
}

.event-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.5rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
}

.event-name {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
}

.event-description {
  margin: 0;
  font-size: 0.8125rem;
  color: #888;
  line-height: 1.4;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #fbbf24;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.modal-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
  line-height: 1.6;
}

.modal-text strong {
  color: #ffffff;
}

.webhook-url-text {
  display: inline;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  word-break: break-all;
}

.created-key-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.key-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  color: #fde68a;
  font-size: 0.875rem;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.key-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
}

.key-display code {
  flex: 1;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #22c55e;
  word-break: break-all;
  font-variant-numeric: tabular-nums;
}

.event-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.event-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.event-checkbox:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-top: 0.125rem;
  flex-shrink: 0;
  cursor: pointer;
}

.checkbox-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.checkbox-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  margin-bottom: 0.125rem;
}

.checkbox-description {
  display: block;
  font-size: 0.8125rem;
  color: #888;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-header {
    flex-wrap: wrap;
  }

  .header-action {
    width: 100%;
  }

  .key-value-container,
  .secret-value {
    flex-direction: column;
    align-items: stretch;
  }

  .key-actions,
  .secret-actions {
    justify-content: flex-start;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
