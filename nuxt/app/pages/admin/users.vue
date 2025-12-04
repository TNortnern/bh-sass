<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface User {
  id: string
  email: string
  role: 'super_admin' | 'business_owner' | 'staff' | 'customer'
  tenantId?: string
  tenantName?: string
  firstName?: string
  lastName?: string
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

const searchQuery = ref('')
const selectedRole = ref<string>('')
const selectedStatus = ref<string>('')
const toast = useToast()

// Fetch users
const { data: users, pending, refresh } = useLazyFetch<User[]>('/v1/admin/users', {
  credentials: 'include',
  query: {
    search: searchQuery,
    role: selectedRole,
    status: selectedStatus
  }
})

const roleItems = [
  { label: 'All Roles', value: '' },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Staff', value: 'staff' },
  { label: 'Customer', value: 'customer' }
]

const statusItems = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const formatDate = (date: string) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    super_admin: 'error',
    business_owner: 'purple',
    staff: 'primary',
    customer: 'neutral'
  }
  return colors[role] || 'neutral'
}

const formatRoleName = (role: string) => {
  return role.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdown = resolveComponent('UDropdown')

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'email',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original
      const fullName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : null

      return h('div', { class: 'user-cell' }, [
        fullName ? h('div', { class: 'user-name' }, fullName) : null,
        h('div', { class: fullName ? 'user-email' : 'user-name' }, user.email)
      ].filter(Boolean))
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return h(UBadge, {
        label: formatRoleName(role),
        color: getRoleBadgeColor(role),
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'tenantName',
    header: 'Tenant',
    cell: ({ row }) => {
      const tenantName = row.getValue('tenantName')
      return tenantName || h('span', { class: 'text-gray-500' }, 'Platform')
    }
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive')
      return h(UBadge, {
        label: isActive ? 'Active' : 'Inactive',
        color: isActive ? 'success' : 'neutral',
        variant: 'subtle'
      })
    }
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Login',
    cell: ({ row }) => formatDate(row.getValue('lastLoginAt') as string)
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
      const user = row.original
      return h(UDropdown, {
        items: [
          [{
            label: 'View Details',
            icon: 'i-lucide-eye',
            click: () => handleViewUser(user.id)
          }],
          [{
            label: user.isActive ? 'Deactivate' : 'Activate',
            icon: user.isActive ? 'i-lucide-user-x' : 'i-lucide-user-check',
            click: () => handleToggleStatus(user.id, user.isActive)
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

const handleViewUser = (userId: string) => {
  // TODO: Navigate to user detail page or open modal
  console.log('View user:', userId)
}

const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
  try {
    await $fetch(`/v1/admin/users/${userId}/status`, {
      method: 'POST',
      body: { isActive: !currentStatus },
      credentials: 'include'
    })

    toast.add({
      title: 'Status updated',
      description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      color: 'success'
    })

    refresh()
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.data?.message || 'Failed to update user status',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Platform Users</h1>
        <p class="page-description">Manage all users across all tenants</p>
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
        placeholder="Search users..."
        class="search-input"
      />
      <USelect
        v-model="selectedRole"
        :items="roleItems"
        placeholder="Filter by role"
        class="filter-select"
      />
      <USelect
        v-model="selectedStatus"
        :items="statusItems"
        placeholder="Filter by status"
        class="filter-select"
      />
    </div>

    <!-- Table -->
    <div class="table-container">
      <UTable
        :data="users || []"
        :columns="columns"
        :loading="pending"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!pending && (!users || users.length === 0)" class="empty-state">
      <UIcon name="i-lucide-users" class="empty-icon" />
      <p class="empty-title">No users found</p>
      <p class="empty-description">
        {{ searchQuery || selectedRole || selectedStatus ? 'Try adjusting your filters' : 'Users will appear here once they sign up' }}
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

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: #ffffff;
}

.user-email {
  font-size: 0.8125rem;
  color: #737373;
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
