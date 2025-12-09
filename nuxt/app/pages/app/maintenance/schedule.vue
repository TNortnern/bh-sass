<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const toast = useToast()

const {
  schedules,
  isLoading,
  fetchSchedules,
  deleteSchedule
} = useMaintenance()

const { items: rentalItems, fetchItems } = useInventory()
const { currentUser } = useAuth()

// Get tenant ID from current user
const getTenantId = (): string | number | null => {
  if (!currentUser.value?.tenantId) return null
  if (typeof currentUser.value.tenantId === 'object') {
    return (currentUser.value.tenantId as any).id
  }
  return currentUser.value.tenantId
}

// Fetch schedules and rental items on mount
onMounted(() => {
  fetchSchedules()
  fetchItems()
})

// Modal state
const isCreateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedSchedule = ref<any>(null)

// Form state
const form = reactive({
  rentalItem: '',
  name: '',
  frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'after_x_rentals',
  frequencyValue: 1,
  maintenanceType: 'inspection' as 'inspection' | 'cleaning' | 'repair' | 'certification',
  reminderDaysBefore: 7,
  estimatedDuration: undefined as number | undefined,
  instructions: '',
  isActive: true,
})

// Options
const frequencyItems = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annually', value: 'annually' },
  { label: 'After X Rentals', value: 'after_x_rentals' },
]

const maintenanceTypeItems = [
  { label: 'Inspection', value: 'inspection' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Repair', value: 'repair' },
  { label: 'Certification', value: 'certification' },
]

const rentalItemsSelect = computed(() => {
  return (rentalItems.value || []).map(item => ({
    label: item.name,
    value: item.id
  }))
})

// Format frequency display
const formatFrequency = (schedule: any) => {
  if (schedule.frequency === 'after_x_rentals') {
    return `After ${schedule.frequencyValue} rental${schedule.frequencyValue !== 1 ? 's' : ''}`
  }

  const freqLabel = frequencyItems.find(f => f.value === schedule.frequency)?.label || schedule.frequency
  return schedule.frequencyValue === 1 ? freqLabel : `Every ${schedule.frequencyValue} ${freqLabel.toLowerCase()}`
}

// Format date helper
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM dd, yyyy')
}

// Get type icon
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    inspection: 'i-lucide-search',
    cleaning: 'i-lucide-sparkles',
    repair: 'i-lucide-wrench',
    certification: 'i-lucide-shield-check'
  }
  return icons[type] || 'i-lucide-tool'
}

// Calculate days until next due
const getDaysUntilDue = (nextDueDate?: string) => {
  if (!nextDueDate) return null
  const days = Math.ceil((new Date(nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return days
}

const getDueStatus = (nextDueDate?: string) => {
  const days = getDaysUntilDue(nextDueDate)
  if (days === null) return { text: 'Not scheduled', color: 'neutral' }
  if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: 'error' }
  if (days === 0) return { text: 'Due today', color: 'warning' }
  if (days <= 7) return { text: `Due in ${days} days`, color: 'warning' }
  return { text: `Due in ${days} days`, color: 'neutral' }
}

// Handle create schedule
const handleCreateSchedule = async () => {
  if (!form.rentalItem || !form.name) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields.',
      color: 'error'
    })
    return
  }

  const tenantId = getTenantId()
  if (!tenantId) {
    toast.add({
      title: 'Error',
      description: 'Unable to determine tenant. Please try logging in again.',
      color: 'error'
    })
    return
  }

  const { createSchedule } = useMaintenance()

  const result = await createSchedule({
    tenantId: Number(tenantId),
    rentalItem: Number(form.rentalItem),
    name: form.name,
    frequency: form.frequency,
    frequencyValue: form.frequencyValue,
    maintenanceType: form.maintenanceType,
    reminderDaysBefore: form.reminderDaysBefore,
    estimatedDuration: form.estimatedDuration,
    instructions: form.instructions,
    isActive: form.isActive,
  })

  if (result.success) {
    toast.add({
      title: 'Success',
      description: 'Maintenance schedule created successfully.',
      color: 'success'
    })
    isCreateModalOpen.value = false
    // Reset form
    Object.assign(form, {
      rentalItem: '',
      name: '',
      frequency: 'monthly',
      frequencyValue: 1,
      maintenanceType: 'inspection',
      reminderDaysBefore: 7,
      estimatedDuration: undefined,
      instructions: '',
      isActive: true,
    })
    fetchSchedules()
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to create schedule.',
      color: 'error'
    })
  }
}

// Handle delete schedule
const openDeleteModal = (schedule: any) => {
  selectedSchedule.value = schedule
  isDeleteModalOpen.value = true
}

const handleDeleteSchedule = async () => {
  if (!selectedSchedule.value) return

  const result = await deleteSchedule(selectedSchedule.value.id)

  if (result.success) {
    toast.add({
      title: 'Success',
      description: 'Schedule deleted successfully.',
      color: 'success'
    })
    isDeleteModalOpen.value = false
    selectedSchedule.value = null
    fetchSchedules()
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to delete schedule.',
      color: 'error'
    })
  }
}

// Handle toggle active
const handleToggleActive = async (schedule: any) => {
  const { updateSchedule } = useMaintenance()

  const result = await updateSchedule(schedule.id, {
    isActive: !schedule.isActive
  })

  if (result.success) {
    toast.add({
      title: 'Success',
      description: `Schedule ${schedule.isActive ? 'deactivated' : 'activated'}.`,
      color: 'success'
    })
    fetchSchedules()
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to update schedule.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Maintenance Schedules</h1>
        <p class="text-gray-600 dark:text-gray-400">Set up recurring maintenance schedules for your rental items</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-arrow-left"
          label="Back"
          color="neutral"
          variant="ghost"
          @click="router.push('/app/maintenance')"
        />
        <UButton
          icon="i-lucide-plus"
          label="New Schedule"
          @click="isCreateModalOpen = true"
        />
      </div>
    </div>

    <div class="space-y-6">
      <!-- Active Schedules -->
      <div v-if="schedules.filter((s: any) => s.isActive).length > 0">
        <h2 class="text-lg font-semibold mb-4">Active Schedules</h2>
        <div class="space-y-3">
          <UCard v-for="schedule in schedules.filter((s: any) => s.isActive)" :key="schedule.id">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UIcon :name="getTypeIcon(schedule.maintenanceType)" class="text-gray-400" />
                  <h3 class="font-medium">{{ schedule.name }}</h3>
                  <UBadge :label="schedule.maintenanceType" color="primary" variant="subtle" />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Item:</strong>
                    {{ typeof schedule.rentalItem === 'object' ? schedule.rentalItem.name : schedule.rentalItem }}
                  </span>
                  <span>
                    <strong>Frequency:</strong> {{ formatFrequency(schedule) }}
                  </span>
                  <span v-if="schedule.nextDueDate">
                    <strong>Next Due:</strong> {{ formatDate(schedule.nextDueDate) }}
                    <UBadge
                      :label="getDueStatus(schedule.nextDueDate).text"
                      :color="getDueStatus(schedule.nextDueDate).color"
                      variant="subtle"
                      class="ml-2"
                    />
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-power"
                  color="warning"
                  variant="ghost"
                  @click="handleToggleActive(schedule)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  @click="openDeleteModal(schedule)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Inactive Schedules -->
      <div v-if="schedules.filter((s: any) => !s.isActive).length > 0">
        <h2 class="text-lg font-semibold mb-4 text-gray-500">Inactive Schedules</h2>
        <div class="space-y-3 opacity-60">
          <UCard v-for="schedule in schedules.filter((s: any) => !s.isActive)" :key="schedule.id">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <UIcon :name="getTypeIcon(schedule.maintenanceType)" class="text-gray-400" />
                  <h3 class="font-medium">{{ schedule.name }}</h3>
                  <UBadge label="inactive" color="neutral" variant="subtle" />
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    <strong>Item:</strong>
                    {{ typeof schedule.rentalItem === 'object' ? schedule.rentalItem.name : schedule.rentalItem }}
                  </span>
                  <span>
                    <strong>Frequency:</strong> {{ formatFrequency(schedule) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-power"
                  color="success"
                  variant="ghost"
                  @click="handleToggleActive(schedule)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  @click="openDeleteModal(schedule)"
                />
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && schedules.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
        <UIcon name="i-lucide-calendar" class="text-6xl mb-4 text-gray-300" />
        <p class="text-lg font-medium">No Schedules Yet</p>
        <p class="text-sm mb-6 text-center max-w-sm">
          Create maintenance schedules to automatically track recurring maintenance tasks for your rental items.
        </p>
        <UButton
          icon="i-lucide-plus"
          label="Create First Schedule"
          @click="isCreateModalOpen = true"
        />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
      </div>
    </div>

    <!-- Create Schedule Modal -->
    <UModal v-model:open="isCreateModalOpen" title="Create Maintenance Schedule">
      <template #body>
        <form @submit.prevent="handleCreateSchedule" class="space-y-4">
          <UFormField label="Rental Item" required>
            <USelect
              v-model="form.rentalItem"
              :items="rentalItemsSelect"
              placeholder="Select rental item"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Schedule Name" required>
            <UInput
              v-model="form.name"
              placeholder="e.g., Monthly Safety Inspection"
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Maintenance Type" required>
              <USelect
                v-model="form.maintenanceType"
                :items="maintenanceTypeItems"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Frequency" required>
              <USelect
                v-model="form.frequency"
                :items="frequencyItems"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Frequency Value">
              <UInput
                v-model.number="form.frequencyValue"
                type="number"
                min="1"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Reminder (days before)">
              <UInput
                v-model.number="form.reminderDaysBefore"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>
          </div>

          <UFormField label="Estimated Duration (minutes)">
            <UInput
              v-model.number="form.estimatedDuration"
              type="number"
              min="0"
              placeholder="Optional"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Instructions">
            <UTextarea
              v-model="form.instructions"
              placeholder="Detailed instructions for performing this maintenance..."
              rows="4"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Status">
            <div class="flex items-center gap-2">
              <input
                v-model="form.isActive"
                type="checkbox"
                class="rounded border-gray-300"
              />
              <span class="text-sm">Active</span>
            </div>
          </UFormField>
        </form>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
          <UButton label="Create Schedule" @click="handleCreateSchedule" />
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" title="Delete Schedule">
      <template #body>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon name="i-lucide-trash-2" class="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <div>
              <h3 class="text-lg font-semibold">Delete Maintenance Schedule</h3>
            </div>
          </div>
          <p>Are you sure you want to delete the schedule <strong>{{ selectedSchedule?.name }}</strong>?</p>
          <p class="text-sm text-gray-500 mt-2">This will not delete existing maintenance records, but future scheduled items will not be created.</p>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
          <UButton label="Delete" color="error" @click="handleDeleteSchedule" />
        </div>
      </template>
    </UModal>
  </div>
</template>
