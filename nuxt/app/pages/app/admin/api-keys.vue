<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface ApiKey {
  id: string
  name: string
  key: string
  tenantId: string
  tenantName: string
  scopeType: string
  scopes: string[]
  lastUsedAt?: string
  expiresAt?: string
  isActive: boolean
  createdAt: string
}

interface Tenant {
  id: string
  name: string
  slug: string
  status: string
}

const searchQuery = ref('')
const selectedTenant = ref<string>('all')
const toast = useToast()

// Modal state
const isCreateModalOpen = ref(false)
const isKeyDisplayModalOpen = ref(false)
const newlyCreatedKey = ref<string | null>(null)
const newlyCreatedKeyName = ref<string | null>(null)

// Form state
const formData = reactive({
  name: '',
  tenantId: '',
  scopeType: 'full_access',
  expiresAt: ''
})

// Fetch all API keys across tenants
const { data: apiKeysResponse, pending, refresh } = useLazyFetch<{ data: ApiKey[], success: boolean }>('/v1/admin/api-keys', {
  credentials: 'include',
  query: {
    search: searchQuery,
    tenantId: selectedTenant
  }
})

const apiKeys = computed(() => apiKeysResponse.value?.data || [])

// Fetch tenants for filter
const { data: tenantsResponse } = useLazyFetch<{ data: Tenant[], success: boolean }>('/v1/admin/tenants', {
  credentials: 'include'
})

const tenants = computed(() => tenantsResponse.value?.data || [])

const tenantItems = computed(() => {
  if (!tenants.value || tenants.value.length === 0) return [{ label: 'All Tenants', value: 'all' }]
  return [
    { label: 'All Tenants', value: 'all' },
    ...tenants.value.map(t => ({ label: t.name, value: String(t.id) }))
  ]
})

const tenantFormItems = computed(() => {
  if (!tenants.value || tenants.value.length === 0) return []
  return tenants.value.map(t => ({ label: t.name, value: String(t.id) }))
})

const scopeTypeItems = [
  { label: 'Full Access', value: 'full_access' },
  { label: 'Read Only', value: 'read_only' },
  { label: 'Booking Management', value: 'booking_management' }
]

const formatDate = (date?: string) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatRelativeTime = (date?: string) => {
  if (!date) return 'Never'
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = now - then

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const isCreating = ref(false)

const openCreateModal = () => {
  // Reset form
  formData.name = ''
  formData.tenantId = ''
  formData.scopeType = 'full_access'
  formData.expiresAt = ''
  isCreateModalOpen.value = true
}

const handleCreateKey = async () => {
  if (!formData.name || !formData.tenantId) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields',
      color: 'error'
    })
    return
  }

  isCreating.value = true

  try {
    const response = await $fetch<{ data: ApiKey, success: boolean, message: string }>('/v1/admin/api-keys', {
      method: 'POST',
      credentials: 'include',
      body: {
        name: formData.name,
        tenantId: formData.tenantId,
        scopeType: formData.scopeType,
        expiresAt: formData.expiresAt || null
      }
    })

    // Close create modal
    isCreateModalOpen.value = false

    // Store the newly created key and show it
    newlyCreatedKey.value = response.data.key
    newlyCreatedKeyName.value = response.data.name
    isKeyDisplayModalOpen.value = true

    toast.add({
      title: 'API key created',
      description: response.message,
      color: 'success'
    })

    // Refresh the list
    refresh()
  } catch (err) {
    const error = err as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to create API key',
      color: 'error'
    })
  } finally {
    isCreating.value = false
  }
}

const handleRevokeKey = async (keyId: string) => {
  try {
    await $fetch(`/v1/admin/api-keys/${keyId}/revoke`, {
      method: 'POST',
      credentials: 'include'
    })

    toast.add({
      title: 'API key revoked',
      description: 'The API key has been revoked successfully',
      color: 'success'
    })

    refresh()
  } catch (err) {
    const error = err as { data?: { message?: string } }
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to revoke API key',
      color: 'error'
    })
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      title: 'Copied',
      description: 'API key copied to clipboard',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Error',
      description: 'Failed to copy to clipboard',
      color: 'error'
    })
  }
}

const columns: TableColumn<ApiKey>[] = [
  {
    accessorKey: 'name',
    header: 'API Key',
    cell: ({ row }) => {
      const apiKey = row.original
      return h('div', { class: 'key-cell' }, [
        h('div', { class: 'key-name' }, apiKey.name),
        h('div', { class: 'tenant-name' }, apiKey.tenantName)
      ])
    }
  },
  {
    accessorKey: 'key',
    header: 'Key',
    cell: ({ row }) => {
      const key = row.getValue('key') as string
      const masked = key.substring(0, 8) + '...' + key.substring(key.length - 4)
      return h('code', { class: 'api-key-code' }, masked)
    }
  },
  {
    accessorKey: 'scopes',
    header: 'Scopes',
    cell: ({ row }) => {
      const scopes = row.getValue('scopes') as string[]
      return h('div', { class: 'scopes-list' },
        scopes.slice(0, 3).map(scope =>
          h(UBadge, {
            label: scope,
            variant: 'subtle',
            size: 'sm',
            color: 'primary'
          })
        )
      )
    }
  },
  {
    accessorKey: 'lastUsedAt',
    header: 'Last Used',
    cell: ({ row }) => formatRelativeTime(row.getValue('lastUsedAt') as string | undefined)
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive')
      return h(UBadge, {
        label: isActive ? 'Active' : 'Revoked',
        color: isActive ? 'success' : 'error',
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string)
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const apiKey = row.original
      return h(UDropdownMenu, {
        items: [
          [{
            label: 'View Tenant',
            icon: 'i-lucide-building-2',
            onSelect: () => navigateTo(`/app/admin/tenants/${apiKey.tenantId}`)
          }],
          [{
            label: 'Revoke Key',
            icon: 'i-lucide-trash-2',
            onSelect: () => handleRevokeKey(apiKey.id),
            disabled: !apiKey.isActive
          }]
        ]
      }, {
        default: () => h(UButton, {
          icon: 'i-lucide-more-vertical',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm'
        })
      })
    }
  }
]
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          API Keys
        </h1>
        <p class="page-description">
          Manage API keys across all tenants
        </p>
      </div>
      <div class="header-actions">
        <UButton
          icon="i-lucide-refresh-cw"
          label="Refresh"
          variant="outline"
          :loading="pending"
          @click="refresh"
        />
        <UButton
          icon="i-lucide-plus"
          label="Create API Key"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Search API keys..."
        class="search-input"
      />
      <USelect
        v-model="selectedTenant"
        :items="tenantItems"
        placeholder="Filter by tenant"
        class="filter-select"
      />
    </div>

    <!-- Table -->
    <div class="table-container">
      <UTable
        :data="apiKeys || []"
        :columns="columns"
        :loading="pending"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="!pending && (!apiKeys || apiKeys.length === 0)"
      class="empty-state"
    >
      <UIcon
        name="i-lucide-key"
        class="empty-icon"
      />
      <p class="empty-title">
        No API keys found
      </p>
      <p class="empty-description">
        {{ searchQuery || selectedTenant !== 'all' ? 'Try adjusting your filters' : 'API keys will appear here once tenants create them' }}
      </p>
    </div>

    <!-- Create API Key Modal -->
    <UModal
      v-model:open="isCreateModalOpen"
      title="Create API Key"
    >
      <template #body>
        <div class="modal-form">
          <UFormField
            label="API Key Name"
            required
          >
            <UInput
              v-model="formData.name"
              placeholder="Production API Key"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Tenant"
            required
          >
            <USelect
              v-model="formData.tenantId"
              :items="tenantFormItems"
              placeholder="Select a tenant"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Scope Type"
            required
          >
            <USelect
              v-model="formData.scopeType"
              :items="scopeTypeItems"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Expires At"
            help="Optional expiration date"
          >
            <UInput
              v-model="formData.expiresAt"
              type="date"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="close"
          />
          <UButton
            label="Create API Key"
            :loading="isCreating"
            @click="handleCreateKey"
          />
        </div>
      </template>
    </UModal>

    <!-- Display New API Key Modal -->
    <UModal
      v-model:open="isKeyDisplayModalOpen"
      title="API Key Created"
    >
      <template #body>
        <div class="key-display-modal">
          <div class="warning-banner">
            <UIcon
              name="i-lucide-alert-triangle"
              class="warning-icon"
            />
            <div>
              <p class="warning-title">
                Save this API key now
              </p>
              <p class="warning-description">
                For security reasons, you won't be able to view this key again. Make sure to copy it and store it in a safe place.
              </p>
            </div>
          </div>

          <UFormField :label="`API Key: ${newlyCreatedKeyName}`">
            <div class="key-display">
              <code class="key-value">{{ newlyCreatedKey }}</code>
              <UButton
                icon="i-lucide-copy"
                variant="outline"
                size="sm"
                @click="copyToClipboard(newlyCreatedKey!)"
              />
            </div>
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end">
          <UButton
            label="Done"
            @click="close"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

.admin-page {
  @apply p-8 max-w-[1920px] mx-auto;
}

.page-header {
  @apply flex items-start justify-between mb-8 gap-6;
}

.header-actions {
  @apply flex gap-3 items-center;
}

.page-title {
  @apply text-3xl font-bold tracking-tight m-0;
  color: rgb(17 24 39);
}
.dark .page-title {
  color: white;
}

.page-description {
  @apply text-sm mt-2 mb-0;
  color: rgb(107 114 128);
}
.dark .page-description {
  color: rgb(156 163 175);
}

.filters {
  @apply flex gap-4 mb-6 flex-wrap;
}

.search-input {
  @apply flex-1 min-w-[250px];
}

.filter-select {
  @apply min-w-[180px];
}

.table-container {
  @apply rounded-xl overflow-hidden;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .table-container {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.key-cell {
  @apply flex flex-col gap-1;
}

.key-name {
  @apply font-semibold;
  color: rgb(17 24 39);
}
.dark .key-name {
  color: white;
}

.tenant-name {
  @apply text-[0.8125rem];
  color: rgb(107 114 128);
}
.dark .tenant-name {
  color: rgb(156 163 175);
}

.api-key-code {
  @apply font-mono text-sm px-2 py-1 rounded;
  color: rgb(75 85 99);
  background-color: rgb(243 244 246);
}
.dark .api-key-code {
  color: rgb(156 163 175);
  background-color: rgba(255, 255, 255, 0.05);
}

.scopes-list {
  @apply flex gap-1.5 flex-wrap;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 px-8 text-center;
}

.empty-icon {
  @apply text-6xl mb-4;
  color: rgb(209 213 219);
}
.dark .empty-icon {
  color: rgb(75 85 99);
}

.empty-title {
  @apply text-xl font-semibold m-0 mb-2;
  color: rgb(17 24 39);
}
.dark .empty-title {
  color: white;
}

.empty-description {
  @apply text-sm m-0;
  color: rgb(107 114 128);
}
.dark .empty-description {
  color: rgb(156 163 175);
}

.modal-form {
  @apply flex flex-col gap-5 py-4;
}

.key-display-modal {
  @apply flex flex-col gap-6 py-4;
}

.warning-banner {
  @apply flex gap-4 p-4 rounded-lg;
  background-color: rgb(255 251 235);
  border: 1px solid rgb(253 230 138);
}
.dark .warning-banner {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.warning-icon {
  @apply text-2xl flex-shrink-0;
  color: rgb(245 158 11);
}
.dark .warning-icon {
  color: rgb(251 191 36);
}

.warning-title {
  @apply font-semibold m-0 mb-1;
  color: rgb(180 83 9);
}
.dark .warning-title {
  color: rgb(251 191 36);
}

.warning-description {
  @apply text-sm m-0;
  color: rgb(75 85 99);
}
.dark .warning-description {
  color: rgb(156 163 175);
}

.key-display {
  @apply flex gap-2 items-center;
}

.key-value {
  @apply flex-1 font-mono text-sm px-3 py-3 rounded-md break-all;
  color: rgb(17 24 39);
  background-color: rgb(243 244 246);
}
.dark .key-value {
  color: white;
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
