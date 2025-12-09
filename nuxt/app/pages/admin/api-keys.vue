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
  scopes: string[]
  lastUsedAt?: string
  expiresAt?: string
  isActive: boolean
  createdAt: string
}

const searchQuery = ref('')
const selectedTenant = ref<string>('')
const toast = useToast()

// Fetch all API keys across tenants
const { data: apiKeys, pending, refresh } = useLazyFetch<ApiKey[]>('/v1/admin/api-keys', {
  credentials: 'include',
  query: {
    search: searchQuery,
    tenantId: selectedTenant
  }
})

// Fetch tenants for filter
const { data: tenants } = useLazyFetch<Array<{ id: string, name: string }>>('/v1/admin/tenants', {
  credentials: 'include'
})

const tenantItems = computed(() => {
  if (!tenants.value) return [{ label: 'All Tenants', value: '' }]
  return [
    { label: 'All Tenants', value: '' },
    ...tenants.value.map(t => ({ label: t.name, value: String(t.id) }))
  ]
})

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
const UDropdown = resolveComponent('UDropdown')

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
      return h(UDropdown, {
        items: [
          [{
            label: 'View Tenant',
            icon: 'i-lucide-building-2',
            click: () => navigateTo(`/admin/tenants/${apiKey.tenantId}`)
          }],
          [{
            label: 'Revoke Key',
            icon: 'i-lucide-trash-2',
            click: () => handleRevokeKey(apiKey.id),
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
      <UButton
        icon="i-lucide-refresh-cw"
        label="Refresh"
        variant="outline"
        :loading="pending"
        @click="refresh"
      />
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
        {{ searchQuery || selectedTenant ? 'Try adjusting your filters' : 'API keys will appear here once tenants create them' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1920px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0.5rem 0 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 180px;
}

.table-container {
  background: linear-gradient(180deg, #161616 0%, #0f0f0f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.key-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.key-name {
  font-weight: 600;
  color: #ffffff;
}

.tenant-name {
  font-size: 0.8125rem;
  color: #737373;
}

.api-key-code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #a3a3a3;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.scopes-list {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: #404040;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0 0 0.5rem;
}

.empty-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0;
}
</style>
