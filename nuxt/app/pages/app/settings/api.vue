<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-1.5 text-gray-900 dark:text-white">
          API Keys & Webhooks
        </h2>
        <p class="text-[0.9375rem] text-gray-600 dark:text-[#888] m-0">
          Manage programmatic access to your data
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]"
    >
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
      <p>Loading settings...</p>
    </div>

    <div
      v-else
      class="flex flex-col gap-6"
    >
      <!-- API Keys -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon
                name="i-heroicons-key"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                API Keys
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                {{ apiKeys.length }} active
                {{ apiKeys.length === 1 ? 'key' : 'keys' }}
              </p>
            </div>
            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-plus"
              class="ml-auto bg-gradient-to-br from-amber-400 to-amber-600 border-none text-black font-semibold"
              @click="showCreateKeyModal = true"
            >
              Create API Key
            </UButton>
          </div>
        </template>

        <div class="p-6">
          <div
            v-if="apiKeys.length === 0"
            class="flex flex-col items-center justify-center py-12 px-8 gap-4"
          >
            <UIcon
              name="i-heroicons-key"
              class="w-12 h-12 text-gray-300 dark:text-[#333]"
            />
            <p class="text-[0.9375rem] text-gray-500 dark:text-[#666] m-0">
              No API keys created yet
            </p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-plus"
              @click="showCreateKeyModal = true"
            >
              Create Your First API Key
            </UButton>
          </div>

          <div
            v-else
            class="flex flex-col gap-4"
          >
            <div
              v-for="key in apiKeys"
              :key="key.id"
              class="p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex flex-col gap-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 flex-wrap mb-2">
                    <h4 class="text-[0.9375rem] font-semibold m-0 text-gray-900 dark:text-white">
                      {{ key.name }}
                    </h4>
                    <div class="flex gap-2 flex-wrap">
                      <UBadge
                        :color="getScopeTypeBadgeColor(key.scopeType)"
                        variant="subtle"
                        size="sm"
                      >
                        {{ getScopeTypeLabel(key.scopeType) }}
                      </UBadge>
                      <UBadge
                        v-if="!key.isActive"
                        color="neutral"
                        variant="subtle"
                        size="sm"
                      >
                        Disabled
                      </UBadge>
                      <UBadge
                        v-if="isKeyExpired(key.expiresAt)"
                        color="error"
                        variant="subtle"
                        size="sm"
                      >
                        Expired
                      </UBadge>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-4">
                    <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]">
                      <UIcon
                        name="i-heroicons-calendar"
                        class="w-3.5 h-3.5"
                      />
                      Created {{ formatDate(key.createdAt) }}
                    </span>
                    <span
                      v-if="key.lastRotatedAt"
                      class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]"
                    >
                      <UIcon
                        name="i-heroicons-arrow-path"
                        class="w-3.5 h-3.5"
                      />
                      Rotated {{ formatDate(key.lastRotatedAt) }}
                    </span>
                    <span
                      v-if="key.expiresAt"
                      class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]"
                    >
                      <UIcon
                        name="i-heroicons-clock"
                        class="w-3.5 h-3.5"
                      />
                      Expires {{ formatDate(key.expiresAt) }}
                    </span>
                    <span
                      v-if="key.lastUsed"
                      class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]"
                    >
                      <UIcon
                        name="i-heroicons-chart-bar"
                        class="w-3.5 h-3.5"
                      />
                      Last used {{ formatDate(key.lastUsed) }}
                    </span>
                    <span
                      v-else
                      class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888] italic"
                    >Never used</span>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <UButton
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-arrow-path"
                    @click="confirmRotateKey(key)"
                  >
                    Rotate
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    :color="key.isActive ? 'neutral' : 'success'"
                    @click="handleToggleKeyStatus(key.id, !key.isActive)"
                  >
                    {{ key.isActive ? 'Disable' : 'Enable' }}
                  </UButton>
                  <UButton
                    variant="ghost"
                    size="sm"
                    color="error"
                    @click="confirmDeleteKey(key)"
                  >
                    Delete
                  </UButton>
                </div>
              </div>

              <div class="flex items-center gap-4 py-3.5 px-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg">
                <div class="flex-1 min-w-0">
                  <code class="font-mono text-sm text-green-600 dark:text-green-500 break-all tabular-nums">{{ showKey[key.id] ? key.key : maskKey(key.key) }}</code>
                </div>
                <div class="flex gap-2 flex-shrink-0">
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

          <div class="flex items-start gap-3 p-4 mt-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 rounded-lg">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p class="mb-2 text-sm text-blue-900 dark:text-blue-200 leading-relaxed m-0">
                <strong>Keep your API keys secure.</strong> Never share them publicly
                or commit them to version control. Use environment variables in your
                applications.
              </p>
              <a
                href="#"
                class="text-sm text-blue-700 dark:text-blue-400 no-underline font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >View API Documentation →</a>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Webhooks -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon
                name="i-heroicons-bolt"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Webhook Endpoints
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                {{ webhooks.length }} configured
                {{ webhooks.length === 1 ? 'endpoint' : 'endpoints' }}
              </p>
            </div>
            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-plus"
              class="ml-auto bg-gradient-to-br from-amber-400 to-amber-600 border-none text-black font-semibold"
              @click="showCreateWebhookModal = true"
            >
              Add Endpoint
            </UButton>
          </div>
        </template>

        <div class="p-6">
          <div
            v-if="webhooks.length === 0"
            class="flex flex-col items-center justify-center py-12 px-8 gap-4"
          >
            <UIcon
              name="i-heroicons-bolt"
              class="w-12 h-12 text-gray-300 dark:text-[#333]"
            />
            <p class="text-[0.9375rem] text-gray-500 dark:text-[#666] m-0">
              No webhook endpoints configured
            </p>
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-plus"
              @click="showCreateWebhookModal = true"
            >
              Add Your First Endpoint
            </UButton>
          </div>

          <div
            v-else
            class="flex flex-col gap-4"
          >
            <div
              v-for="webhook in webhooks"
              :key="webhook.id"
              class="p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex flex-col gap-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 flex-wrap mb-2">
                    <code class="font-mono text-sm text-blue-600 dark:text-blue-400 break-all">{{ webhook.url }}</code>
                    <div
                      class="py-1 px-2.5 rounded-md text-xs font-semibold uppercase tracking-wider"
                      :class="{
                        'bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-500': webhook.status === 'active',
                        'bg-gray-100 dark:bg-[#666]/10 border border-gray-200 dark:border-[#666]/30 text-gray-700 dark:text-[#666]': webhook.status === 'inactive'
                      }"
                    >
                      {{ capitalizeFirst(webhook.status) }}
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-4">
                    <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-500 dark:text-[#666]">
                      <UIcon
                        name="i-heroicons-calendar"
                        class="w-3.5 h-3.5"
                      />
                      Created {{ formatDate(webhook.createdAt) }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">
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

              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-[0.8125rem] text-gray-500 dark:text-[#666] font-semibold">Events:</span>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="event in webhook.events"
                    :key="event"
                    class="py-1.5 px-3 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-md text-[0.8125rem] font-medium text-amber-700 dark:text-amber-400 font-mono"
                  >
                    {{ event }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <div class="text-[0.8125rem] text-gray-500 dark:text-[#666] font-semibold">
                  Signing Secret:
                </div>
                <div class="flex items-center gap-4 py-3.5 px-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg">
                  <code class="flex-1 font-mono text-sm text-purple-600 dark:text-purple-400 break-all tabular-nums">{{ showWebhookSecret[webhook.id] ? webhook.secret : maskKey(webhook.secret) }}</code>
                  <div class="flex gap-2 flex-shrink-0">
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

          <div class="flex items-start gap-3 p-4 mt-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 rounded-lg">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p class="mb-2 text-sm text-blue-900 dark:text-blue-200 leading-relaxed m-0">
                <strong>Webhook endpoints</strong> receive real-time event notifications.
                Use the signing secret to verify webhook authenticity.
              </p>
              <a
                href="#"
                class="text-sm text-blue-700 dark:text-blue-400 no-underline font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >View Webhook Documentation →</a>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Available Events -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon
                name="i-heroicons-list-bullet"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Available Events
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Events you can subscribe to
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            <div
              v-for="event in availableEvents"
              :key="event.name"
              class="flex items-start gap-4 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl"
            >
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon
                  :name="event.icon"
                  class="w-5 h-5"
                />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold mb-1 text-gray-900 dark:text-white font-mono m-0">
                  {{ event.name }}
                </h4>
                <p class="text-[0.8125rem] text-gray-600 dark:text-[#888] leading-snug m-0">
                  {{ event.description }}
                </p>
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
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
              Create API Key
            </h3>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <template v-if="!createdKey">
              <UFormField
                label="Key Name"
                required
                help="A descriptive name for this key"
              >
                <UInput
                  v-model="newKeyName"
                  size="lg"
                  placeholder="Production API Key"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Access Level"
                required
                help="Choose the level of access this key will have"
              >
                <USelect
                  v-model="newKeyScopeType"
                  :items="scopeTypeOptions"
                  value-attribute="value"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <div class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 rounded-lg">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                />
                <p class="text-sm text-blue-900 dark:text-blue-200 leading-relaxed m-0">
                  {{ scopeTypeOptions.find((o: typeof scopeTypeOptions[0]) => o.value === newKeyScopeType)?.description }}
                </p>
              </div>

              <UFormField
                label="Expiration Date (Optional)"
                help="Leave empty for keys that never expire"
              >
                <UInput
                  v-model="newKeyExpiresAt"
                  type="date"
                  size="lg"
                  class="w-full"
                  :min="new Date().toISOString().split('T')[0]"
                />
              </UFormField>
            </template>

            <div
              v-if="createdKey"
              class="flex flex-col gap-4"
            >
              <div class="flex items-center gap-3 p-4 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-lg text-amber-900 dark:text-amber-200 text-sm">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                />
                <strong>Important:</strong> Copy your API key now. You won't be able to see it again!
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg">
                <code class="flex-1 font-mono text-sm text-green-600 dark:text-green-500 break-all tabular-nums">{{ createdKey.key }}</code>
                <UButton
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyKey(createdKey.key)"
                >
                  Copy
                </UButton>
              </div>
              <div class="flex flex-col gap-3 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-gray-600 dark:text-[#888] font-semibold">Access Level:</span>
                  <UBadge
                    :color="getScopeTypeBadgeColor(createdKey.scopeType)"
                    variant="subtle"
                  >
                    {{ getScopeTypeLabel(createdKey.scopeType) }}
                  </UBadge>
                </div>
                <div
                  v-if="createdKey.expiresAt"
                  class="flex items-center justify-between gap-4"
                >
                  <span class="text-sm text-gray-600 dark:text-[#888] font-semibold">Expires:</span>
                  <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(createdKey.expiresAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                v-if="createdKey"
                @click="closeCreateKeyModal"
              >
                Done
              </UButton>
              <template v-else>
                <UButton
                  variant="ghost"
                  @click="showCreateKeyModal = false"
                >
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
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
              Add Webhook Endpoint
            </h3>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <UFormField
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
            </UFormField>

            <UFormField
              label="Events to Subscribe"
              required
            >
              <div class="flex flex-col gap-2 mt-2">
                <label
                  v-for="event in availableEvents"
                  :key="event.name"
                  class="flex items-start gap-4 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10"
                >
                  <input
                    v-model="webhookForm.events"
                    type="checkbox"
                    :value="event.name"
                    class="w-[18px] h-[18px] mt-0.5 flex-shrink-0 cursor-pointer"
                  >
                  <div class="flex items-start gap-3 flex-1">
                    <UIcon
                      :name="event.icon"
                      class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span class="block text-sm font-semibold text-gray-900 dark:text-white font-mono mb-0.5">{{ event.name }}</span>
                      <span class="block text-[0.8125rem] text-gray-600 dark:text-[#888]">{{ event.description }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                variant="ghost"
                @click="showCreateWebhookModal = false"
              >
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

    <!-- Rotate API Key Modal -->
    <UModal v-model:open="showRotateKeyModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-6 h-6 text-amber-600 dark:text-amber-400"
              />
              <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
                Rotate API Key
              </h3>
            </div>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <template v-if="!rotatedKey">
              <p class="text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed m-0">
                Are you sure you want to rotate <strong class="text-gray-900 dark:text-white">{{ selectedKey?.name }}</strong>?
              </p>
              <div class="flex items-center gap-3 p-4 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-lg text-amber-900 dark:text-amber-200 text-sm">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                />
                <div>
                  <strong>Warning:</strong> The old key will be invalidated immediately.
                  Any applications using the old key will stop working until you update them with the new key.
                </div>
              </div>
            </template>

            <div
              v-if="rotatedKey"
              class="flex flex-col gap-4"
            >
              <div class="flex items-center gap-3 p-4 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-lg text-amber-900 dark:text-amber-200 text-sm">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0"
                />
                <strong>Important:</strong> Copy your new API key now. You won't be able to see it again!
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/[0.08] rounded-lg">
                <code class="flex-1 font-mono text-sm text-green-600 dark:text-green-500 break-all tabular-nums">{{ rotatedKey.key }}</code>
                <UButton
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyKey(rotatedKey.key)"
                >
                  Copy
                </UButton>
              </div>
              <div class="flex flex-col gap-3 p-4 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-gray-600 dark:text-[#888] font-semibold">Key Name:</span>
                  <span class="text-sm text-gray-900 dark:text-white">{{ rotatedKey.name }}</span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-gray-600 dark:text-[#888] font-semibold">Access Level:</span>
                  <UBadge
                    :color="getScopeTypeBadgeColor(rotatedKey.scopeType)"
                    variant="subtle"
                  >
                    {{ getScopeTypeLabel(rotatedKey.scopeType) }}
                  </UBadge>
                </div>
                <div
                  v-if="rotatedKey.expiresAt"
                  class="flex items-center justify-between gap-4"
                >
                  <span class="text-sm text-gray-600 dark:text-[#888] font-semibold">Expires:</span>
                  <span class="text-sm text-gray-900 dark:text-white">{{ formatDate(rotatedKey.expiresAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                v-if="rotatedKey"
                @click="closeRotateKeyModal"
              >
                Done
              </UButton>
              <template v-else>
                <UButton
                  variant="ghost"
                  @click="showRotateKeyModal = false"
                >
                  Cancel
                </UButton>
                <UButton
                  color="warning"
                  :loading="saving"
                  @click="handleRotateKey"
                >
                  Rotate Key
                </UButton>
              </template>
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
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-6 h-6 text-amber-600 dark:text-amber-400"
              />
              <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
                Delete API Key?
              </h3>
            </div>
          </template>

          <div class="p-6">
            <p class="text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed m-0">
              Are you sure you want to delete <strong class="text-gray-900 dark:text-white">{{ selectedKey?.name }}</strong>?
              This action cannot be undone and any applications using this key will stop working immediately.
            </p>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                variant="ghost"
                @click="showDeleteKeyModal = false"
              >
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
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-6 h-6 text-amber-600 dark:text-amber-400"
              />
              <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
                Delete Webhook Endpoint?
              </h3>
            </div>
          </template>

          <div class="p-6">
            <p class="text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed m-0">
              Are you sure you want to delete the webhook endpoint
              <code class="inline font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 py-0.5 px-1.5 rounded break-all">{{ selectedWebhook?.url }}</code>?
              This action cannot be undone and you will stop receiving events at this endpoint.
            </p>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                variant="ghost"
                @click="showDeleteWebhookModal = false"
              >
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
  toggleApiKeyStatus,
  rotateApiKey,
  deleteApiKey,
  addWebhookEndpoint,
  deleteWebhookEndpoint,
  testWebhook
} = useSettings()

const toast = useToast()

const showCreateKeyModal = ref(false)
const showCreateWebhookModal = ref(false)
const showDeleteKeyModal = ref(false)
const showDeleteWebhookModal = ref(false)
const showRotateKeyModal = ref(false)
const newKeyName = ref('')
const newKeyScopeType = ref<'full_access' | 'read_only' | 'booking_management'>('full_access')
const newKeyExpiresAt = ref<string>('')
const createdKey = ref<ApiKey | null>(null)
const rotatedKey = ref<ApiKey | null>(null)
const showKey = ref<Record<string, boolean>>({})
const showWebhookSecret = ref<Record<string, boolean>>({})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedKey = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedWebhook = ref<any>(null)

const webhookForm = ref({
  url: '',
  events: [] as string[]
})

const scopeTypeOptions = [
  {
    label: 'Full Access',
    value: 'full_access',
    description: 'Complete read and write access to all resources including inventory, bookings, customers, and settings'
  },
  {
    label: 'Read Only',
    value: 'read_only',
    description: 'View-only access to all data. Cannot create, update, or delete any resources'
  },
  {
    label: 'Booking Management',
    value: 'booking_management',
    description: 'Read and write access to bookings, customers, and availability. Read-only for inventory'
  }
]

const getScopeTypeBadgeColor = (scopeType: string) => {
  switch (scopeType) {
    case 'full_access':
      return 'warning'
    case 'read_only':
      return 'primary'
    case 'booking_management':
      return 'success'
    default:
      return 'neutral'
  }
}

const getScopeTypeLabel = (scopeType: string) => {
  const option = scopeTypeOptions.find(o => o.value === scopeType)
  return option?.label || scopeType
}

const isKeyExpired = (expiresAt: string | null) => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

const availableEvents = [
  {
    name: 'booking.created',
    description: 'Sent when a new booking is created',
    icon: 'i-heroicons-calendar-days'
  },
  {
    name: 'booking.updated',
    description: 'Sent when a booking is updated',
    icon: 'i-heroicons-pencil-square'
  },
  {
    name: 'booking.cancelled',
    description: 'Sent when a booking is cancelled',
    icon: 'i-heroicons-x-circle'
  },
  {
    name: 'payment.succeeded',
    description: 'Sent when a payment is successful',
    icon: 'i-heroicons-check-circle'
  },
  {
    name: 'payment.failed',
    description: 'Sent when a payment fails',
    icon: 'i-heroicons-exclamation-circle'
  },
  {
    name: 'inventory.updated',
    description: 'Sent when inventory availability changes',
    icon: 'i-heroicons-cube'
  }
]

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Failed to copy',
      color: 'error'
    })
  }
}

const handleCreateKey = async () => {
  try {
    const key = await createApiKey(
      newKeyName.value,
      newKeyScopeType.value,
      newKeyExpiresAt.value || null
    )
    createdKey.value = key
  } catch (err) {
    console.error('Failed to create API key:', err)
  }
}

const closeCreateKeyModal = () => {
  showCreateKeyModal.value = false
  newKeyName.value = ''
  newKeyScopeType.value = 'full_access'
  newKeyExpiresAt.value = ''
  createdKey.value = null
}

const handleToggleKeyStatus = async (keyId: string, isActive: boolean) => {
  try {
    await toggleApiKeyStatus(keyId, isActive)
  } catch (err) {
    console.error('Failed to toggle API key status:', err)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const confirmRotateKey = (key: any) => {
  selectedKey.value = key
  rotatedKey.value = null // Reset rotated key
  showRotateKeyModal.value = true
}

const handleRotateKey = async () => {
  if (selectedKey.value) {
    try {
      const newKey = await rotateApiKey(selectedKey.value.id)
      rotatedKey.value = newKey
      // Keep modal open to show the new key
    } catch (err) {
      console.error('Failed to rotate API key:', err)
      showRotateKeyModal.value = false
      selectedKey.value = null
    }
  }
}

const closeRotateKeyModal = () => {
  showRotateKeyModal.value = false
  selectedKey.value = null
  rotatedKey.value = null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to delete API key:', err)
      toast.add({
        title: 'Failed to delete API key',
        color: 'error'
      })
    }
  }
}

const handleCreateWebhook = async () => {
  try {
    await addWebhookEndpoint(webhookForm.value.url, webhookForm.value.events)
    showCreateWebhookModal.value = false
    webhookForm.value = { url: '', events: [] }
  } catch (err) {
    console.error('Failed to create webhook:', err)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        color: 'success'
      })
    } catch (err) {
      console.error('Failed to delete webhook:', err)
      toast.add({
        title: 'Failed to delete webhook',
        color: 'error'
      })
    }
  }
}

const testWebhookEndpoint = async (webhookId: string) => {
  try {
    await testWebhook(webhookId)
  } catch (err) {
    console.error('Failed to test webhook:', err)
  }
}
</script>
