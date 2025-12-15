<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO
} from 'date-fns'
import type { Blackout } from '~/composables/useAvailability'

definePageMeta({
  layout: 'dashboard'
})

// Composables
const { blackouts, isLoading, fetchBlackouts, createBlackout, updateBlackout, deleteBlackout } = useAvailability()
const { items: rentalItems, fetchItems } = useInventory()
// const toast = useToast()

// State
const viewMode = ref<'calendar' | 'list'>('calendar')
const currentDate = ref(new Date())
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteDialog = ref(false)
const selectedBlackout = ref<Blackout | null>(null)
const blackoutToDelete = ref<Blackout | null>(null)

// Filters
const selectedType = ref<string>('all')
const selectedItem = ref<string | null>(null)
const selectedReason = ref<string | null>(null)

// Form state
const blackoutForm = reactive({
  title: '',
  type: 'item' as 'business' | 'item' | 'unit' | 'staff',
  rentalItemId: '',
  unitId: '',
  staffId: '',
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  allDay: true,
  startTime: '09:00',
  endTime: '17:00',
  reason: 'maintenance' as Blackout['reason'],
  notes: '',
  isRecurring: false,
  recurringPattern: {
    frequency: 'yearly' as 'yearly' | 'monthly' | 'weekly',
    interval: 1
  }
})

// Load data on mount
onMounted(async () => {
  await Promise.all([
    fetchBlackouts(),
    fetchItems()
  ])
})

// Calendar days computation
interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  blackouts: Blackout[]
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  let day = startDate
  while (day <= endDate) {
    const dayBlackouts = filteredBlackouts.value.filter((blackout) => {
      const blackoutStart = parseISO(blackout.startDate)
      const blackoutEnd = parseISO(blackout.endDate)
      return day >= blackoutStart && day <= blackoutEnd
    })

    days.push({
      date: day,
      isCurrentMonth: isSameMonth(day, currentDate.value),
      isToday: isToday(day),
      blackouts: dayBlackouts
    })

    day = addDays(day, 1)
  }

  return days
})

// Filtered blackouts
const filteredBlackouts = computed(() => {
  return blackouts.value.filter((blackout) => {
    if (selectedType.value !== 'all') {
      if (selectedType.value === 'business' && blackout.rentalItemId) return false
      if (selectedType.value === 'item' && !blackout.rentalItemId) return false
    }
    if (selectedItem.value && blackout.rentalItemId !== selectedItem.value) return false
    if (selectedReason.value && blackout.reason !== selectedReason.value) return false
    return true
  })
})

// Type options
const typeItems = [
  { label: 'All Types', value: 'all' },
  { label: 'Business Closure', value: 'business' },
  { label: 'Item Unavailable', value: 'item' }
]

// Reason options
const reasonItems = [
  { label: 'Holiday', value: 'holiday' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Repair', value: 'repair' },
  { label: 'Private Event', value: 'private_event' },
  { label: 'Weather', value: 'weather' },
  { label: 'Staff Vacation', value: 'staff_vacation' },
  { label: 'Out of Service', value: 'out_of_service' },
  { label: 'Seasonal Closure', value: 'seasonal' },
  { label: 'Other', value: 'other' }
]

const allReasonItems = [
  { label: 'All Reasons', value: null },
  ...reasonItems
]

// Rental items for selector
const rentalItemsOptions = computed(() => {
  return rentalItems.value.map(item => ({
    label: item.name,
    value: item.id
  }))
})

const allRentalItemsOptions = computed(() => [
  { label: 'All Items', value: null },
  ...rentalItemsOptions.value
])

// Navigation
const goToToday = () => {
  currentDate.value = new Date()
}

const goToPrevious = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const goToNext = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

// Modal handlers
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const openEditModal = (blackout: Blackout) => {
  selectedBlackout.value = blackout

  // Populate form with blackout data
  blackoutForm.type = blackout.rentalItemId ? 'item' : 'business'
  blackoutForm.rentalItemId = blackout.rentalItemId || ''
  blackoutForm.startDate = format(parseISO(blackout.startDate), 'yyyy-MM-dd')
  blackoutForm.endDate = format(parseISO(blackout.endDate), 'yyyy-MM-dd')
  blackoutForm.reason = blackout.reason
  blackoutForm.notes = blackout.notes || ''
  blackoutForm.allDay = true

  showEditModal.value = true
}

const openDeleteDialog = (blackout: Blackout) => {
  blackoutToDelete.value = blackout
  showDeleteDialog.value = true
}

const resetForm = () => {
  blackoutForm.title = ''
  blackoutForm.type = 'item'
  blackoutForm.rentalItemId = ''
  blackoutForm.unitId = ''
  blackoutForm.staffId = ''
  blackoutForm.startDate = format(new Date(), 'yyyy-MM-dd')
  blackoutForm.endDate = format(new Date(), 'yyyy-MM-dd')
  blackoutForm.allDay = true
  blackoutForm.startTime = '09:00'
  blackoutForm.endTime = '17:00'
  blackoutForm.reason = 'maintenance'
  blackoutForm.notes = ''
  blackoutForm.isRecurring = false
}

// Form submission
const handleCreateBlackout = async () => {
  const result = await createBlackout({
    rentalItemId: blackoutForm.rentalItemId,
    startDate: blackoutForm.startDate,
    endDate: blackoutForm.endDate,
    reason: blackoutForm.reason,
    notes: blackoutForm.notes
  })

  if (result.success) {
    showAddModal.value = false
    resetForm()
  }
}

const handleUpdateBlackout = async () => {
  if (!selectedBlackout.value) return

  const updateData: Partial<Blackout> = {
    rentalItemId: blackoutForm.type === 'item' ? blackoutForm.rentalItemId : '',
    startDate: blackoutForm.startDate,
    endDate: blackoutForm.endDate,
    reason: blackoutForm.reason,
    notes: blackoutForm.notes
  }

  const result = await updateBlackout(selectedBlackout.value.id, updateData)

  if (result.success) {
    showEditModal.value = false
    selectedBlackout.value = null
    resetForm()
  }
}

const handleDeleteBlackout = async () => {
  if (!blackoutToDelete.value) return

  const result = await deleteBlackout(blackoutToDelete.value.id)

  if (result.success) {
    showDeleteDialog.value = false
    blackoutToDelete.value = null
  }
}

// Get color for blackout based on type
const getBlackoutColor = (blackout: Blackout): string => {
  if (!blackout.rentalItemId) return 'bg-red-500' // Business closure
  return 'bg-orange-500' // Item unavailable
}

const formatReason = (reason: Blackout['reason']): string => {
  return reasonItems.find(r => r.value === reason)?.label || reason
}

const canSubmit = computed(() => {
  if (blackoutForm.type === 'item' && !blackoutForm.rentalItemId) return false
  if (!blackoutForm.startDate || !blackoutForm.endDate) return false
  if (!blackoutForm.reason) return false
  return true
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
          Availability & Blackouts
        </h1>
        <p class="text-gray-600 dark:text-slate-400 text-lg">
          Manage blackout dates and item availability
        </p>
      </div>

      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-plus"
        class="rounded-xl"
        @click="openAddModal"
      >
        Add Blackout
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <UCard
        class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
        :ui="{ body: 'p-5' }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
              Total Blackouts
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
              {{ blackouts.length }}
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-calendar-x"
              class="w-6 h-6 text-red-500"
            />
          </div>
        </div>
      </UCard>

      <UCard
        class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
        :ui="{ body: 'p-5' }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
              Business Closures
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
              {{ blackouts.filter((b: Blackout) => !b.rentalItemId).length }}
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-store-x"
              class="w-6 h-6 text-orange-500"
            />
          </div>
        </div>
      </UCard>

      <UCard
        class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
        :ui="{ body: 'p-5' }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
              Item Blackouts
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
              {{ blackouts.filter((b: Blackout) => b.rentalItemId).length }}
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-box-x"
              class="w-6 h-6 text-yellow-500"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Controls -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- View Toggle -->
      <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800/40 rounded-lg">
        <UButton
          :color="viewMode === 'calendar' ? 'primary' : 'neutral'"
          :variant="viewMode === 'calendar' ? 'solid' : 'ghost'"
          size="md"
          icon="i-lucide-calendar"
          @click="viewMode = 'calendar'"
        >
          Calendar
        </UButton>
        <UButton
          :color="viewMode === 'list' ? 'primary' : 'neutral'"
          :variant="viewMode === 'list' ? 'solid' : 'ghost'"
          size="md"
          icon="i-lucide-list"
          @click="viewMode = 'list'"
        >
          List
        </UButton>
      </div>

      <!-- Filters -->
      <div class="flex-1 flex gap-4">
        <USelect
          v-model="selectedType"
          :items="typeItems"
          size="lg"
          class="w-full lg:w-60"
        />

        <USelect
          v-model="selectedItem"
          :items="allRentalItemsOptions"
          size="lg"
          class="w-full lg:w-60"
        />

        <USelect
          v-model="selectedReason"
          :items="allReasonItems"
          size="lg"
          class="w-full lg:w-60"
        />
      </div>
    </div>

    <!-- Calendar View -->
    <UCard
      v-if="viewMode === 'calendar'"
      class="bg-white dark:bg-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
      :ui="{ body: 'p-0' }"
    >
      <!-- Calendar Navigation -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700/50">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-slate-200">
            {{ format(currentDate, 'MMMM yyyy') }}
          </h2>
          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              @click="goToToday"
            >
              Today
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              icon="i-lucide-chevron-left"
              @click="goToPrevious"
            />
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              icon="i-lucide-chevron-right"
              @click="goToNext"
            />
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="p-4">
        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 mb-2">
          <div
            v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="day"
            class="py-2 text-center text-sm font-semibold text-gray-600 dark:text-slate-400"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="min-h-[100px] p-2 rounded-lg border transition-all"
            :class="[
              day.isCurrentMonth
                ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50',
              day.isToday ? 'ring-2 ring-amber-400' : ''
            ]"
          >
            <!-- Date Number -->
            <div
              class="text-sm font-semibold mb-1"
              :class="[
                day.isToday
                  ? 'text-amber-500'
                  : day.isCurrentMonth
                    ? 'text-gray-900 dark:text-slate-200'
                    : 'text-gray-400 dark:text-slate-600'
              ]"
            >
              {{ format(day.date, 'd') }}
            </div>

            <!-- Blackouts -->
            <div class="space-y-1">
              <div
                v-for="blackout in day.blackouts.slice(0, 2)"
                :key="blackout.id"
                class="px-2 py-1 rounded text-xs text-white cursor-pointer hover:opacity-80 transition-opacity"
                :class="getBlackoutColor(blackout)"
                @click="openEditModal(blackout)"
              >
                <div class="font-semibold truncate">
                  {{ blackout.rentalItemName || 'Business Closure' }}
                </div>
                <div class="text-[10px] opacity-90 truncate">
                  {{ formatReason(blackout.reason) }}
                </div>
              </div>

              <div
                v-if="day.blackouts.length > 2"
                class="text-xs text-gray-500 dark:text-slate-400 px-2"
              >
                +{{ day.blackouts.length - 2 }} more
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700/50">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-red-500" />
            <span class="text-sm text-gray-700 dark:text-slate-300">Business Closure</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-orange-500" />
            <span class="text-sm text-gray-700 dark:text-slate-300">Item Unavailable</span>
          </div>
        </div>
      </div>
    </UCard>

    <!-- List View -->
    <UCard
      v-else
      class="bg-white dark:bg-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
      :ui="{ body: 'p-0' }"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/50">
            <tr>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Type
              </th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Item
              </th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Start Date
              </th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                End Date
              </th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Reason
              </th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Notes
              </th>
              <th class="text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700/30">
            <tr
              v-for="blackout in filteredBlackouts"
              :key="blackout.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors"
            >
              <td class="px-6 py-4">
                <UBadge
                  :color="blackout.rentalItemId ? 'warning' : 'error'"
                  variant="subtle"
                >
                  {{ blackout.rentalItemId ? 'Item' : 'Business' }}
                </UBadge>
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-4">
                {{ blackout.rentalItemName || 'All Items' }}
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-4">
                {{ format(parseISO(blackout.startDate), 'MMM dd, yyyy') }}
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-4">
                {{ format(parseISO(blackout.endDate), 'MMM dd, yyyy') }}
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-4">
                {{ formatReason(blackout.reason) }}
              </td>
              <td class="text-sm text-gray-500 dark:text-slate-400 px-6 py-4 max-w-xs truncate">
                {{ blackout.notes || '—' }}
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    icon="i-lucide-pencil"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="openEditModal(blackout)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    variant="ghost"
                    size="sm"
                    @click="openDeleteDialog(blackout)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="!isLoading && filteredBlackouts.length === 0"
          class="text-center py-16"
        >
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center">
            <UIcon
              name="i-lucide-calendar-x"
              class="w-10 h-10 text-gray-400 dark:text-slate-600"
            />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
            No blackouts found
          </h3>
          <p class="text-gray-600 dark:text-slate-500 mb-6">
            Create your first blackout period to manage availability
          </p>
          <UButton
            color="primary"
            size="lg"
            class="rounded-xl"
            @click="openAddModal"
          >
            <UIcon
              name="i-lucide-plus"
              class="w-5 h-5 mr-2"
            />
            Add Blackout
          </UButton>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex justify-center py-12"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 animate-spin text-gray-500 dark:text-slate-500"
          />
        </div>
      </div>
    </UCard>

    <!-- Add Blackout Modal -->
    <UModal
      v-model:open="showAddModal"
      :ui="{ wrapper: 'sm:max-w-2xl' }"
    >
      <template #content>
        <div class="p-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add Blackout Period
          </h3>

          <div class="space-y-6">
            <!-- Blackout Type -->
            <UFormField
              label="Blackout Type"
              required
            >
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="p-4 rounded-lg border-2 transition-all text-left"
                  :class="blackoutForm.type === 'business'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'"
                  @click="blackoutForm.type = 'business'"
                >
                  <UIcon
                    name="i-lucide-store"
                    class="w-6 h-6 text-red-500 mb-2"
                  />
                  <div class="font-semibold text-gray-900 dark:text-white">
                    Business Closure
                  </div>
                  <div class="text-sm text-gray-500 dark:text-slate-400">
                    Close entire business
                  </div>
                </button>

                <button
                  type="button"
                  class="p-4 rounded-lg border-2 transition-all text-left"
                  :class="blackoutForm.type === 'item'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700'"
                  @click="blackoutForm.type = 'item'"
                >
                  <UIcon
                    name="i-lucide-box"
                    class="w-6 h-6 text-orange-500 mb-2"
                  />
                  <div class="font-semibold text-gray-900 dark:text-white">
                    Item Unavailable
                  </div>
                  <div class="text-sm text-gray-500 dark:text-slate-400">
                    Mark specific item unavailable
                  </div>
                </button>
              </div>
            </UFormField>

            <!-- Rental Item (only if type is item) -->
            <UFormField
              v-if="blackoutForm.type === 'item'"
              label="Select Item"
              required
            >
              <USelect
                v-model="blackoutForm.rentalItemId"
                :items="rentalItemsOptions"
                placeholder="Choose rental item"
                class="w-full"
              />
            </UFormField>

            <!-- Date Range -->
            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="Start Date"
                required
              >
                <UInput
                  v-model="blackoutForm.startDate"
                  type="date"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="End Date"
                required
              >
                <UInput
                  v-model="blackoutForm.endDate"
                  type="date"
                  class="w-full"
                />
              </UFormField>
            </div>

            <!-- Reason -->
            <UFormField
              label="Reason"
              required
            >
              <USelect
                v-model="blackoutForm.reason"
                :items="reasonItems"
                class="w-full"
              />
            </UFormField>

            <!-- Notes -->
            <UFormField label="Notes">
              <UTextarea
                v-model="blackoutForm.notes"
                placeholder="Additional information about this blackout period"
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="showAddModal = false"
            />
            <UButton
              label="Create Blackout"
              color="primary"
              icon="i-lucide-check"
              :disabled="!canSubmit"
              @click="handleCreateBlackout"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Blackout Modal -->
    <UModal
      v-model:open="showEditModal"
      :ui="{ wrapper: 'sm:max-w-2xl' }"
    >
      <template #content>
        <div class="p-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Blackout Period
          </h3>

          <div class="space-y-6">
            <!-- Blackout Type (read-only display) -->
            <UFormField label="Blackout Type">
              <div class="p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
                <UBadge
                  :color="blackoutForm.type === 'business' ? 'error' : 'warning'"
                  variant="subtle"
                >
                  {{ blackoutForm.type === 'business' ? 'Business Closure' : 'Item Unavailable' }}
                </UBadge>
              </div>
            </UFormField>

            <!-- Rental Item (only if type is item) -->
            <UFormField
              v-if="blackoutForm.type === 'item'"
              label="Select Item"
              required
            >
              <USelect
                v-model="blackoutForm.rentalItemId"
                :items="rentalItemsOptions"
                placeholder="Choose rental item"
                class="w-full"
              />
            </UFormField>

            <!-- Date Range -->
            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="Start Date"
                required
              >
                <UInput
                  v-model="blackoutForm.startDate"
                  type="date"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="End Date"
                required
              >
                <UInput
                  v-model="blackoutForm.endDate"
                  type="date"
                  class="w-full"
                />
              </UFormField>
            </div>

            <!-- Reason -->
            <UFormField
              label="Reason"
              required
            >
              <USelect
                v-model="blackoutForm.reason"
                :items="reasonItems"
                class="w-full"
              />
            </UFormField>

            <!-- Notes -->
            <UFormField label="Notes">
              <UTextarea
                v-model="blackoutForm.notes"
                placeholder="Additional information about this blackout period"
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="showEditModal = false"
            />
            <UButton
              label="Save Changes"
              color="primary"
              icon="i-lucide-check"
              :disabled="!canSubmit"
              @click="handleUpdateBlackout"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Dialog -->
    <UModal v-model:open="showDeleteDialog">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-trash-2"
                class="text-red-600 dark:text-red-400 text-xl"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Blackout
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this blackout period?
            {{ blackoutToDelete?.rentalItemName ? `This will make ${blackoutToDelete.rentalItemName} available again.` : 'This will remove the business closure.' }}
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              @click="showDeleteDialog = false"
            />
            <UButton
              label="Delete"
              color="error"
              icon="i-lucide-trash-2"
              @click="handleDeleteBlackout"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>
