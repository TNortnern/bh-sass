<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'date-fns'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const toast = useToast()

const {
  records,
  dueSoon,
  overdue,
  stats,
  isLoading,
  fetchDueItems,
  fetchRecords,
  completeMaintenance
} = useMaintenance()

// Fetch both due items AND all records on mount
onMounted(() => {
  fetchDueItems(30) // Get items due in next 30 days
  fetchRecords() // Get all records for stats calculation
})

// Handle complete maintenance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleComplete = (record: any) => {
  router.push(`/app/maintenance/${record.id}`)
}

// Handle view details
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleView = (record: any) => {
  router.push(`/app/maintenance/${record.id}`)
}

// Format date helper
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

// Get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    scheduled: 'warning',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'neutral'
  }
  return colors[status] || 'neutral'
}

// Get type icon
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    inspection: 'i-lucide-search',
    cleaning: 'i-lucide-sparkles',
    repair: 'i-lucide-wrench',
    replacement: 'i-lucide-package',
    certification: 'i-lucide-shield-check'
  }
  return icons[type] || 'i-lucide-tool'
}

// Calculate urgency (days until due)
const getDaysUntilDue = (scheduledDate: string) => {
  const days = Math.ceil((new Date(scheduledDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return days
}

const getUrgencyColor = (scheduledDate: string) => {
  const days = getDaysUntilDue(scheduledDate)
  if (days < 0) return 'error'
  if (days <= 3) return 'warning'
  return 'neutral'
}

// Get recently completed records (last 10)
const recentlyCompleted = computed(() => {
  return records.value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((r: any) => r.status === 'completed')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => {
      const dateA = new Date(a.completedDate || a.updatedAt).getTime()
      const dateB = new Date(b.completedDate || b.updatedAt).getTime()
      return dateB - dateA // Most recent first
    })
    .slice(0, 10)
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Maintenance
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Track equipment maintenance and repair schedules
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-calendar"
          label="Schedules"
          color="neutral"
          variant="ghost"
          @click="router.push('/app/maintenance/schedule')"
        />
        <UButton
          icon="i-lucide-plus"
          label="Log Maintenance"
          @click="router.push('/app/maintenance/new')"
        />
      </div>
    </div>

    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Overdue
              </p>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                {{ stats.overdue }}
              </p>
            </div>
            <UIcon
              name="i-lucide-alert-triangle"
              class="text-4xl text-red-600 dark:text-red-400"
            />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Due Soon
              </p>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {{ stats.dueSoon }}
              </p>
            </div>
            <UIcon
              name="i-lucide-clock"
              class="text-4xl text-yellow-600 dark:text-yellow-400"
            />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                This Month
              </p>
              <p class="text-2xl font-bold">
                {{ stats.completedThisMonth }}
              </p>
            </div>
            <UIcon
              name="i-lucide-check-circle"
              class="text-4xl text-green-600 dark:text-green-400"
            />
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Total Cost
              </p>
              <p class="text-2xl font-bold">
                ${{ stats.totalCost.toFixed(2) }}
              </p>
            </div>
            <UIcon
              name="i-lucide-dollar-sign"
              class="text-4xl text-blue-600 dark:text-blue-400"
            />
          </div>
        </UCard>
      </div>

      <!-- Overdue Items -->
      <div v-if="overdue.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-lucide-alert-triangle"
              class="text-red-600 dark:text-red-400"
            />
            Overdue Maintenance
          </h2>
        </div>

        <div class="space-y-3">
          <UCard
            v-for="record in overdue"
            :key="record.id"
            class="border-l-4 border-red-500"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UIcon
                    :name="getTypeIcon(record.type)"
                    class="text-gray-400"
                  />
                  <h3 class="font-medium">
                    {{ record.description }}
                  </h3>
                  <UBadge
                    :label="record.type"
                    color="neutral"
                    variant="subtle"
                  />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Item:</strong>
                    {{ typeof record.rentalItem === 'object' ? record.rentalItem.name : record.rentalItem }}
                  </span>
                  <span>
                    <strong>Due:</strong> {{ formatDate(record.scheduledDate) }}
                  </span>
                  <span class="text-red-600 dark:text-red-400">
                    {{ Math.abs(getDaysUntilDue(record.scheduledDate)) }} days overdue
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-check"
                  label="Complete"
                  color="success"
                  @click="handleComplete(record)"
                />
                <UButton
                  icon="i-lucide-eye"
                  color="neutral"
                  variant="ghost"
                  @click="handleView(record)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Due Soon -->
      <div v-if="dueSoon.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-lucide-clock"
              class="text-yellow-600 dark:text-yellow-400"
            />
            Due Soon
          </h2>
        </div>

        <div class="space-y-3">
          <UCard
            v-for="record in dueSoon"
            :key="record.id"
            :class="[
              'border-l-4',
              getDaysUntilDue(record.scheduledDate) <= 3 ? 'border-yellow-500' : 'border-blue-500'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UIcon
                    :name="getTypeIcon(record.type)"
                    class="text-gray-400"
                  />
                  <h3 class="font-medium">
                    {{ record.description }}
                  </h3>
                  <UBadge
                    :label="record.type"
                    color="neutral"
                    variant="subtle"
                  />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Item:</strong>
                    {{ typeof record.rentalItem === 'object' ? record.rentalItem.name : record.rentalItem }}
                  </span>
                  <span>
                    <strong>Due:</strong> {{ formatDate(record.scheduledDate) }}
                  </span>
                  <UBadge
                    :label="`${getDaysUntilDue(record.scheduledDate)} days`"
                    :color="getUrgencyColor(record.scheduledDate)"
                    variant="subtle"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-check"
                  label="Complete"
                  color="success"
                  variant="outline"
                  @click="handleComplete(record)"
                />
                <UButton
                  icon="i-lucide-eye"
                  color="neutral"
                  variant="ghost"
                  @click="handleView(record)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Recently Completed -->
      <div v-if="recentlyCompleted.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="text-green-600 dark:text-green-400"
            />
            Recently Completed
          </h2>
        </div>

        <div class="space-y-3">
          <UCard
            v-for="record in recentlyCompleted"
            :key="record.id"
            class="border-l-4 border-green-500"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UIcon
                    :name="getTypeIcon(record.type)"
                    class="text-gray-400"
                  />
                  <h3 class="font-medium">
                    {{ record.description }}
                  </h3>
                  <UBadge
                    label="completed"
                    color="success"
                    variant="subtle"
                  />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Item:</strong>
                    {{ typeof record.rentalItem === 'object' ? record.rentalItem.name : record.rentalItem }}
                  </span>
                  <span>
                    <strong>Completed:</strong> {{ formatDate(record.completedDate || record.scheduledDate) }}
                  </span>
                  <span v-if="record.cost">
                    <strong>Cost:</strong> ${{ record.cost.toFixed(2) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-eye"
                  color="neutral"
                  variant="ghost"
                  @click="handleView(record)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoading && overdue.length === 0 && dueSoon.length === 0 && recentlyCompleted.length === 0"
        class="flex flex-col items-center justify-center py-16 text-gray-500"
      >
        <UIcon
          name="i-lucide-check-circle-2"
          class="text-6xl mb-4 text-green-400"
        />
        <p class="text-lg font-medium">
          All Caught Up!
        </p>
        <p class="text-sm mb-6 text-center max-w-sm">
          No maintenance items due in the next 30 days. Great job keeping everything up to date!
        </p>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-calendar"
            label="View Schedules"
            variant="outline"
            @click="router.push('/app/maintenance/schedule')"
          />
          <UButton
            icon="i-lucide-plus"
            label="Log Maintenance"
            @click="router.push('/app/maintenance/new')"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-4xl text-gray-400"
        />
      </div>
    </div>
  </div>
</template>
