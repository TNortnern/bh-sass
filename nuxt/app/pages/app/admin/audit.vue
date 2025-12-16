<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Placeholder audit log entries for UI demonstration
const mockAuditLogs = [
  {
    id: '1',
    action: 'tenant.created',
    actor: 'admin@bouncepro.com',
    actorRole: 'super_admin',
    target: 'Bounce Kingdom Party Rentals',
    targetType: 'tenant',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    details: { tenantId: 6, plan: 'pro' }
  },
  {
    id: '2',
    action: 'user.login',
    actor: 'john@bouncekingdom.com',
    actorRole: 'tenant_admin',
    target: 'Dashboard',
    targetType: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    details: { ip: '192.168.1.1' }
  },
  {
    id: '3',
    action: 'booking.created',
    actor: 'customer@example.com',
    actorRole: 'customer',
    target: 'Booking #BH-2025-001',
    targetType: 'booking',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    details: { amount: 350, itemId: 12 }
  },
  {
    id: '4',
    action: 'inventory.synced',
    actor: 'System',
    actorRole: 'system',
    target: '8 rental items',
    targetType: 'inventory',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    details: { success: 8, failed: 0 }
  }
]

const getActionIcon = (action: string) => {
  const icons: Record<string, string> = {
    'tenant.created': 'i-lucide-building-2',
    'tenant.updated': 'i-lucide-building-2',
    'user.login': 'i-lucide-log-in',
    'user.logout': 'i-lucide-log-out',
    'user.created': 'i-lucide-user-plus',
    'booking.created': 'i-lucide-calendar-plus',
    'booking.updated': 'i-lucide-calendar',
    'inventory.synced': 'i-lucide-refresh-cw',
    'settings.updated': 'i-lucide-settings'
  }
  return icons[action] || 'i-lucide-activity'
}

const getActionColor = (action: string) => {
  if (action.includes('created')) return 'bg-green-500/15 text-green-400'
  if (action.includes('updated') || action.includes('synced')) return 'bg-blue-500/15 text-blue-400'
  if (action.includes('deleted')) return 'bg-red-500/15 text-red-400'
  if (action.includes('login')) return 'bg-purple-500/15 text-purple-400'
  return 'bg-gray-500/15 text-gray-400'
}

const getRoleBadgeColor = (role: string): 'error' | 'warning' | 'primary' | 'neutral' | 'info' => {
  const colors: Record<string, 'error' | 'warning' | 'primary' | 'neutral' | 'info'> = {
    super_admin: 'error',
    tenant_admin: 'warning',
    staff: 'primary',
    customer: 'neutral',
    system: 'info'
  }
  return colors[role] || 'neutral'
}

const formatAction = (action: string) => {
  return action.split('.').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatRelativeTime = (date: string) => {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const filterAction = ref('all')
const filterActor = ref('')

const actionItems = [
  { label: 'All Actions', value: 'all' },
  { label: 'Tenant Events', value: 'tenant' },
  { label: 'User Events', value: 'user' },
  { label: 'Booking Events', value: 'booking' },
  { label: 'Inventory Events', value: 'inventory' }
]

// Filter the audit logs based on action and actor
const filteredLogs = computed(() => {
  return mockAuditLogs.filter((log) => {
    const matchesAction = filterAction.value === 'all' || log.action.startsWith(filterAction.value)
    const matchesActor = !filterActor.value || log.actor.toLowerCase().includes(filterActor.value.toLowerCase())
    return matchesAction && matchesActor
  })
})
</script>

<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">
          Audit Log
        </h1>
        <p class="page-description">
          View all platform activity and admin actions
        </p>
      </div>
    </div>

    <!-- Coming Soon Banner -->
    <div class="coming-soon-banner">
      <div class="banner-icon-wrapper">
        <UIcon
          name="i-lucide-construction"
          class="banner-icon"
        />
      </div>
      <div class="banner-content">
        <h3 class="banner-title">
          Audit Logging Coming Soon
        </h3>
        <p class="banner-text">
          Full audit logging is being implemented. Below is a preview of how the audit log will look with sample data.
        </p>
      </div>
    </div>

    <!-- Preview Label -->
    <div class="preview-label">
      <UBadge
        label="Preview Mode"
        color="warning"
        variant="subtle"
        icon="i-lucide-eye"
      />
      <span class="preview-text">Sample data for demonstration</span>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters">
        <UInput
          v-model="filterActor"
          icon="i-lucide-search"
          placeholder="Search by actor..."
          class="search-input"
        />
        <USelect
          v-model="filterAction"
          :items="actionItems"
          placeholder="Filter by action"
          class="filter-select"
        />
      </div>
    </div>

    <!-- Audit Log Timeline -->
    <div class="timeline-container">
      <div class="timeline">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="timeline-item"
        >
          <div class="timeline-connector">
            <div
              class="timeline-icon"
              :class="getActionColor(log.action)"
            >
              <UIcon
                :name="getActionIcon(log.action)"
                class="size-4"
              />
            </div>
            <div class="timeline-line" />
          </div>

          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-action">{{ formatAction(log.action) }}</span>
              <span class="timeline-time">{{ formatRelativeTime(log.timestamp) }}</span>
            </div>

            <div class="timeline-body">
              <div class="timeline-actor">
                <UBadge
                  :label="log.actorRole === 'system' ? 'System' : log.actor"
                  :color="getRoleBadgeColor(log.actorRole)"
                  variant="subtle"
                  size="sm"
                />
                <span class="timeline-verb">
                  {{ log.action.includes('created') ? 'created' : log.action.includes('updated') ? 'updated' : 'accessed' }}
                </span>
                <span class="timeline-target">{{ log.target }}</span>
              </div>

              <div
                v-if="log.details"
                class="timeline-details"
              >
                <code class="details-code">{{ JSON.stringify(log.details) }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <UIcon
        name="i-lucide-info"
        class="size-5"
      />
      <div>
        <p class="info-title">
          What will be logged
        </p>
        <p class="info-text">
          The audit log will capture all significant platform events including tenant management, user authentication, booking operations, inventory changes, and administrative actions with full actor attribution and timestamps.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

/* Filters card */
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

/* Timeline container */
.timeline-container {
  @apply rounded-2xl p-6 mb-6;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .timeline-container {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.timeline {
  @apply flex flex-col;
}

.timeline-item {
  @apply flex gap-4;
}

.timeline-connector {
  @apply flex flex-col items-center w-8 flex-shrink-0;
}

.timeline-icon {
  @apply flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0;
}

.timeline-line {
  @apply w-0.5 flex-1 my-2;
  background-color: rgb(229 231 235);
}
.dark .timeline-line {
  background-color: rgba(255, 255, 255, 0.08);
}

.timeline-item:last-child .timeline-line {
  @apply hidden;
}

.timeline-content {
  @apply flex-1 pb-6;
}

.timeline-item:last-child .timeline-content {
  @apply pb-0;
}

.timeline-header {
  @apply flex items-center justify-between mb-2;
}

.timeline-action {
  @apply text-sm font-semibold;
  color: rgb(17 24 39);
}
.dark .timeline-action {
  color: white;
}

.timeline-time {
  @apply text-xs;
  color: rgb(156 163 175);
}
.dark .timeline-time {
  color: rgb(107 114 128);
}

.timeline-body {
  @apply flex flex-col gap-2;
}

.timeline-actor {
  @apply flex items-center gap-2 flex-wrap;
}

.timeline-verb {
  @apply text-sm;
  color: rgb(107 114 128);
}
.dark .timeline-verb {
  color: rgb(156 163 175);
}

.timeline-target {
  @apply text-sm font-medium;
  color: rgb(55 65 81);
}
.dark .timeline-target {
  color: rgb(229 231 235);
}

.timeline-details {
  @apply mt-1;
}

.details-code {
  @apply font-mono text-xs px-2.5 py-1.5 rounded-md inline-block;
  color: rgb(75 85 99);
  background-color: rgb(243 244 246);
}
.dark .details-code {
  color: rgb(156 163 175);
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
