<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface User {
  id: string
  email: string
  role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer'
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

// User detail modal
const showUserModal = ref(false)
const selectedUser = ref<User | null>(null)
const impersonatingUserId = ref<string | null>(null)

// Fetch users
const { data: users, pending, refresh } = useLazyFetch<User[]>('/v1/admin/users', {
  credentials: 'include',
  query: {
    search: searchQuery,
    role: selectedRole,
    status: selectedStatus
  }
})

// Computed stats
const userStats = computed(() => {
  if (!users.value) return { total: 0, active: 0, admins: 0, tenantAdmins: 0 }
  return {
    total: users.value.length,
    active: users.value.filter(u => u.isActive).length,
    admins: users.value.filter(u => u.role === 'super_admin').length,
    tenantAdmins: users.value.filter(u => u.role === 'tenant_admin').length
  }
})

const roleItems = [
  { label: 'All Roles', value: 'all' },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Tenant Admin', value: 'tenant_admin' },
  { label: 'Staff', value: 'staff' },
  { label: 'Customer', value: 'customer' }
]

const statusItems = [
  { label: 'All Statuses', value: 'all' },
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

const formatRelativeTime = (date: string) => {
  if (!date) return 'Never'
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

const getRoleBadgeColor = (role: string): 'error' | 'warning' | 'primary' | 'neutral' => {
  const colors: Record<string, 'error' | 'warning' | 'primary' | 'neutral'> = {
    super_admin: 'error',
    tenant_admin: 'warning',
    staff: 'primary',
    customer: 'neutral'
  }
  return colors[role] || 'neutral'
}

const getRoleIcon = (role: string) => {
  const icons: Record<string, string> = {
    super_admin: 'i-lucide-shield-check',
    tenant_admin: 'i-lucide-building-2',
    staff: 'i-lucide-user',
    customer: 'i-lucide-user-circle'
  }
  return icons[role] || 'i-lucide-user'
}

const formatRoleName = (role: string) => {
  return role.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getInitials = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }
  return user.email?.[0]?.toUpperCase() || '?'
}

const getAvatarColor = (role: string) => {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-500/20 text-red-400',
    tenant_admin: 'bg-amber-500/20 text-amber-400',
    staff: 'bg-blue-500/20 text-blue-400',
    customer: 'bg-gray-500/20 text-gray-400'
  }
  return colors[role] || 'bg-gray-500/20 text-gray-400'
}

const handleViewUser = (user: User) => {
  selectedUser.value = user
  showUserModal.value = true
}

const handleImpersonateUser = async (user: User) => {
  if (!user.tenantId) {
    toast.add({
      title: 'Cannot impersonate',
      description: 'User is not associated with a tenant',
      color: 'error'
    })
    return
  }

  impersonatingUserId.value = user.id
  try {
    // Use the tenant impersonation endpoint
    const response = await $fetch<{
      success: boolean
      tenant: { id: string, name: string, slug: string }
    }>(`/v1/admin/tenants/${user.tenantId}/impersonate`, {
      method: 'POST',
      credentials: 'include'
    })

    if (response.success) {
      toast.add({
        title: 'Logged in as user',
        description: `Now viewing as ${user.email} (${response.tenant.name})`,
        color: 'warning'
      })
      await navigateTo('/app')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Impersonation failed',
      description: err?.data?.error || 'Failed to login as user',
      color: 'error'
    })
  } finally {
    impersonatingUserId.value = null
  }
}

const handleResetPassword = async (user: User) => {
  toast.add({
    title: 'Password reset',
    description: `Password reset email would be sent to ${user.email}`,
    color: 'info'
  })
  // TODO: Implement password reset email trigger
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <h1 class="page-title">
          Platform Users
        </h1>
        <p class="page-description">
          Manage all users across all tenants
        </p>
      </div>
      <UButton
        icon="i-lucide-refresh-cw"
        label="Refresh"
        variant="outline"
        :loading="pending"
        @click="() => refresh()"
      />
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-total">
          <UIcon
            name="i-lucide-users"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStats.total }}</span>
          <span class="stat-label">Total Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-active">
          <UIcon
            name="i-lucide-user-check"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStats.active }}</span>
          <span class="stat-label">Active Users</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-admin">
          <UIcon
            name="i-lucide-shield-check"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStats.admins }}</span>
          <span class="stat-label">Super Admins</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper stat-icon-tenant">
          <UIcon
            name="i-lucide-building-2"
            class="stat-icon"
          />
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ userStats.tenantAdmins }}</span>
          <span class="stat-label">Tenant Admins</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search by name or email..."
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
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="loading-state"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
      <p class="text-gray-500 mt-4">
        Loading users...
      </p>
    </div>

    <!-- Users Grid -->
    <div
      v-else-if="users && users.length > 0"
      class="users-grid"
    >
      <div
        v-for="user in users"
        :key="user.id"
        class="user-card"
      >
        <div class="user-card-header">
          <div
            class="user-avatar"
            :class="getAvatarColor(user.role)"
          >
            {{ getInitials(user) }}
          </div>
          <div
            class="user-status-indicator"
            :class="user.isActive ? 'status-active' : 'status-inactive'"
          />
        </div>

        <div class="user-card-body">
          <h3 class="user-name">
            {{ user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0] }}
          </h3>
          <p class="user-email">
            {{ user.email }}
          </p>

          <div class="user-meta">
            <UBadge
              :icon="getRoleIcon(user.role)"
              :label="formatRoleName(user.role)"
              :color="getRoleBadgeColor(user.role)"
              variant="subtle"
              size="sm"
            />
          </div>

          <div
            v-if="user.tenantName"
            class="user-tenant"
          >
            <UIcon
              name="i-lucide-building-2"
              class="size-3.5 text-gray-500"
            />
            <span>{{ user.tenantName }}</span>
          </div>
          <div
            v-else
            class="user-tenant"
          >
            <UIcon
              name="i-lucide-globe"
              class="size-3.5 text-gray-500"
            />
            <span>Platform User</span>
          </div>
        </div>

        <div class="user-card-footer">
          <div class="user-date">
            <UIcon
              name="i-lucide-clock"
              class="size-3.5"
            />
            <span>{{ user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : 'Never logged in' }}</span>
          </div>
          <UDropdownMenu
            :items="[
              [{
                label: 'View Details',
                icon: 'i-lucide-eye',
                onSelect: () => handleViewUser(user)
              }],
              user.tenantId && user.role !== 'super_admin' ? [{
                label: 'Login as User',
                icon: 'i-lucide-log-in',
                onSelect: () => handleImpersonateUser(user)
              }] : [],
              [{
                label: user.isActive ? 'Deactivate' : 'Activate',
                icon: user.isActive ? 'i-lucide-user-x' : 'i-lucide-user-check',
                onSelect: () => handleToggleStatus(user.id, user.isActive)
              }],
              user.role !== 'super_admin' ? [{
                label: 'Reset Password',
                icon: 'i-lucide-key',
                onSelect: () => handleResetPassword(user)
              }] : []
            ].filter(group => group.length > 0)"
            @click.stop
          >
            <UButton
              icon="i-lucide-more-vertical"
              color="neutral"
              variant="ghost"
              size="xs"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="empty-state"
    >
      <div class="empty-icon-wrapper">
        <UIcon
          name="i-lucide-users"
          class="empty-icon"
        />
      </div>
      <p class="empty-title">
        No users found
      </p>
      <p class="empty-description">
        {{ searchQuery || selectedRole || selectedStatus ? 'Try adjusting your filters' : 'Users will appear here once they sign up' }}
      </p>
    </div>

    <!-- User Detail Modal -->
    <UModal
      v-model:open="showUserModal"
      title="User Details"
    >
      <template #content>
        <div
          v-if="selectedUser"
          class="modal-content"
        >
          <!-- Modal Header with Avatar -->
          <div class="modal-header">
            <div
              class="modal-avatar"
              :class="getAvatarColor(selectedUser.role)"
            >
              {{ getInitials(selectedUser) }}
            </div>
            <div class="modal-user-info">
              <h3 class="modal-user-name">
                {{ selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}` : selectedUser.email }}
              </h3>
              <p class="modal-user-email">
                {{ selectedUser.email }}
              </p>
              <div class="modal-badges">
                <UBadge
                  :icon="getRoleIcon(selectedUser.role)"
                  :label="formatRoleName(selectedUser.role)"
                  :color="getRoleBadgeColor(selectedUser.role)"
                  variant="subtle"
                />
                <UBadge
                  :icon="selectedUser.isActive ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :label="selectedUser.isActive ? 'Active' : 'Inactive'"
                  :color="selectedUser.isActive ? 'success' : 'neutral'"
                  variant="subtle"
                />
              </div>
            </div>
          </div>

          <!-- Modal Details Grid -->
          <div class="modal-details">
            <div class="detail-item">
              <UIcon
                name="i-lucide-building-2"
                class="detail-icon"
              />
              <div>
                <span class="detail-label">Tenant</span>
                <span class="detail-value">{{ selectedUser.tenantName || 'Platform (No Tenant)' }}</span>
              </div>
            </div>
            <div class="detail-item">
              <UIcon
                name="i-lucide-fingerprint"
                class="detail-icon"
              />
              <div>
                <span class="detail-label">User ID</span>
                <span class="detail-value font-mono text-xs">{{ selectedUser.id }}</span>
              </div>
            </div>
            <div class="detail-item">
              <UIcon
                name="i-lucide-calendar-plus"
                class="detail-icon"
              />
              <div>
                <span class="detail-label">Created</span>
                <span class="detail-value">{{ formatDate(selectedUser.createdAt) }}</span>
              </div>
            </div>
            <div class="detail-item">
              <UIcon
                name="i-lucide-log-in"
                class="detail-icon"
              />
              <div>
                <span class="detail-label">Last Login</span>
                <span class="detail-value">{{ selectedUser.lastLoginAt ? formatRelativeTime(selectedUser.lastLoginAt) : 'Never' }}</span>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <UButton
              v-if="selectedUser.tenantId && selectedUser.role !== 'super_admin'"
              icon="i-lucide-log-in"
              label="Login as User"
              variant="outline"
              @click="handleImpersonateUser(selectedUser); showUserModal = false"
            />
            <UButton
              :icon="selectedUser.isActive ? 'i-lucide-user-x' : 'i-lucide-user-check'"
              :label="selectedUser.isActive ? 'Deactivate' : 'Activate'"
              :color="selectedUser.isActive ? 'error' : 'success'"
              variant="soft"
              @click="handleToggleStatus(selectedUser.id, selectedUser.isActive); showUserModal = false"
            />
          </div>
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

.page-title {
  @apply text-3xl font-bold tracking-tight m-0;
  color: rgb(17 24 39);
}
.dark .page-title {
  color: white;
}

.page-description {
  @apply text-[0.9375rem] mt-2 mb-0;
  color: rgb(107 114 128);
}
.dark .page-description {
  color: rgb(156 163 175);
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.stat-card {
  @apply flex items-center gap-4 p-5 rounded-xl transition-all duration-200;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .stat-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.stat-card:hover {
  @apply -translate-y-0.5;
  border-color: rgb(209 213 219);
}
.dark .stat-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.stat-icon-wrapper {
  @apply flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0;
}

.stat-icon-total {
  background-color: rgb(224 231 255);
  color: rgb(129 140 248);
}
.dark .stat-icon-total {
  background-color: rgba(99, 102, 241, 0.15);
  color: rgb(165 180 252);
}

.stat-icon-active {
  background-color: rgb(220 252 231);
  color: rgb(34 197 94);
}
.dark .stat-icon-active {
  background-color: rgba(34, 197, 94, 0.15);
  color: rgb(74 222 128);
}

.stat-icon-admin {
  background-color: rgb(254 226 226);
  color: rgb(239 68 68);
}
.dark .stat-icon-admin {
  background-color: rgba(239, 68, 68, 0.15);
  color: rgb(248 113 113);
}

.stat-icon-tenant {
  background-color: rgb(254 243 199);
  color: rgb(245 158 11);
}
.dark .stat-icon-tenant {
  background-color: rgba(245, 158, 11, 0.15);
  color: rgb(251 191 36);
}

.stat-icon {
  @apply text-2xl;
}

.stat-content {
  @apply flex flex-col gap-0.5;
}

.stat-value {
  @apply text-[1.75rem] font-bold tracking-tight leading-tight;
  color: rgb(17 24 39);
}
.dark .stat-value {
  color: white;
}

.stat-label {
  @apply text-[0.8125rem] font-medium;
  color: rgb(107 114 128);
}
.dark .stat-label {
  color: rgb(156 163 175);
}

/* Filters Card */
.filters-card {
  @apply rounded-xl p-4 mb-6;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .filters-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.filters {
  @apply flex gap-4 flex-wrap;
}

.search-input {
  @apply flex-1 min-w-[250px];
}

.filter-select {
  @apply min-w-[180px];
}

/* Loading State */
.loading-state {
  @apply flex flex-col items-center justify-center min-h-[400px];
}

/* Users Grid */
.users-grid {
  @apply grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4;
}

.user-card {
  @apply rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .user-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.user-card:hover {
  @apply -translate-y-0.5 shadow-xl;
  border-color: rgb(209 213 219);
}
.dark .user-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.user-card-header {
  @apply flex items-start justify-between;
}

.user-avatar {
  @apply w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base tracking-wide;
}

.user-status-indicator {
  @apply w-2.5 h-2.5 rounded-full mt-1;
}

.status-active {
  @apply bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)];
}

.status-inactive {
  @apply bg-gray-500;
}

.user-card-body {
  @apply flex flex-col gap-2;
}

.user-name {
  @apply text-base font-semibold m-0 leading-tight;
  color: rgb(17 24 39);
}
.dark .user-name {
  color: white;
}

.user-email {
  @apply text-[0.8125rem] m-0 break-words;
  color: rgb(107 114 128);
}
.dark .user-email {
  color: rgb(156 163 175);
}

.user-meta {
  @apply flex items-center gap-2 mt-1;
}

.user-tenant {
  @apply flex items-center gap-1.5 text-[0.8125rem] mt-1;
  color: rgb(107 114 128);
}
.dark .user-tenant {
  color: rgb(156 163 175);
}

.user-card-footer {
  @apply flex items-center justify-between pt-3 mt-auto;
  border-top: 1px solid rgb(229 231 235);
}
.dark .user-card-footer {
  border-top-color: rgba(255, 255, 255, 0.06);
}

.user-date {
  @apply flex items-center gap-1.5 text-xs;
  color: rgb(107 114 128);
}
.dark .user-date {
  color: rgb(156 163 175);
}

/* Empty State */
.empty-state {
  @apply flex flex-col items-center justify-center p-16 text-center rounded-2xl;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .empty-state {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.empty-icon-wrapper {
  @apply w-20 h-20 rounded-[20px] flex items-center justify-center mb-6;
  background-color: rgb(243 244 246);
}
.dark .empty-icon-wrapper {
  background-color: rgba(255, 255, 255, 0.05);
}

.empty-icon {
  @apply text-[2.5rem];
  color: rgb(209 213 219);
}
.dark .empty-icon {
  color: rgb(55 65 81);
}

.empty-title {
  @apply text-xl font-semibold m-0 mb-2;
  color: rgb(31 41 55);
}
.dark .empty-title {
  color: rgb(229 231 235);
}

.empty-description {
  @apply text-[0.9375rem] m-0;
  color: rgb(107 114 128);
}
.dark .empty-description {
  color: rgb(156 163 175);
}

/* Modal Styles */
.modal-content {
  @apply p-6;
}

.modal-header {
  @apply flex items-start gap-5 pb-6 mb-6;
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.modal-avatar {
  @apply w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl tracking-wide flex-shrink-0;
}

.modal-user-info {
  @apply flex flex-col gap-1;
}

.modal-user-name {
  @apply text-xl font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .modal-user-name {
  color: white;
}

.modal-user-email {
  @apply text-sm m-0 mb-2;
  color: rgb(107 114 128);
}
.dark .modal-user-email {
  color: rgb(156 163 175);
}

.modal-badges {
  @apply flex gap-2 flex-wrap;
}

.modal-details {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6;
}

.detail-item {
  @apply flex items-start gap-3 p-3.5 rounded-[10px];
  background-color: rgb(249 250 251);
}
.dark .detail-item {
  background-color: rgba(255, 255, 255, 0.03);
}

.detail-icon {
  @apply text-base mt-0.5 flex-shrink-0;
  color: rgb(107 114 128);
}
.dark .detail-icon {
  color: rgb(156 163 175);
}

.detail-label {
  @apply block text-xs uppercase tracking-wider mb-0.5;
  color: rgb(107 114 128);
}
.dark .detail-label {
  color: rgb(156 163 175);
}

.detail-value {
  @apply block text-sm font-medium;
  color: rgb(31 41 55);
}
.dark .detail-value {
  color: rgb(229 231 235);
}

.modal-actions {
  @apply flex justify-end gap-3 pt-6;
  border-top: 1px solid rgb(229 231 235);
}
.dark .modal-actions {
  border-top-color: rgba(255, 255, 255, 0.08);
}
</style>
