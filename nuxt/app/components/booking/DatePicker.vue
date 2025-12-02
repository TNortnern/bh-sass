<script setup lang="ts">
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, startOfDay } from 'date-fns'

interface Props {
  modelValue?: { start: string; end: string } | null
  unavailableDates?: string[]
  minDate?: Date
}

interface Emits {
  (e: 'update:modelValue', value: { start: string; end: string } | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  unavailableDates: () => [],
  minDate: () => new Date()
})

const emit = defineEmits<Emits>()

const currentMonth = ref(new Date())
const selectingStart = ref(true)
const tempStartDate = ref<Date | null>(null)
const tempEndDate = ref<Date | null>(null)

// Initialize from modelValue
watch(() => props.modelValue, (value) => {
  if (value) {
    tempStartDate.value = new Date(value.start)
    tempEndDate.value = new Date(value.end)
    selectingStart.value = false
  } else {
    tempStartDate.value = null
    tempEndDate.value = null
    selectingStart.value = true
  }
}, { immediate: true })

const monthStart = computed(() => startOfMonth(currentMonth.value))
const monthEnd = computed(() => endOfMonth(currentMonth.value))
const monthDays = computed(() => eachDayOfInterval({ start: monthStart.value, end: monthEnd.value }))

// Get day of week for first day of month (0 = Sunday)
const monthStartDay = computed(() => monthStart.value.getDay())

// Empty cells before first day
const emptyDays = computed(() => Array(monthStartDay.value).fill(null))

const previousMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, -1)
}

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

const isDateUnavailable = (date: Date): boolean => {
  const dateStr = format(date, 'yyyy-MM-dd')
  return props.unavailableDates.includes(dateStr)
}

const isDateDisabled = (date: Date): boolean => {
  const today = startOfDay(new Date())
  return isBefore(date, props.minDate) || isBefore(date, today) || isDateUnavailable(date)
}

const isSelected = (date: Date): boolean => {
  if (!tempStartDate.value && !tempEndDate.value) return false
  if (tempStartDate.value && isSameDay(date, tempStartDate.value)) return true
  if (tempEndDate.value && isSameDay(date, tempEndDate.value)) return true
  return false
}

const isInRange = (date: Date): boolean => {
  if (!tempStartDate.value || !tempEndDate.value) return false
  return isAfter(date, tempStartDate.value) && isBefore(date, tempEndDate.value)
}

const selectDate = (date: Date) => {
  if (isDateDisabled(date)) return

  if (selectingStart.value) {
    // Selecting start date
    tempStartDate.value = date
    tempEndDate.value = null
    selectingStart.value = false
  } else {
    // Selecting end date
    if (tempStartDate.value && isBefore(date, tempStartDate.value)) {
      // If end date is before start date, swap them
      tempEndDate.value = tempStartDate.value
      tempStartDate.value = date
    } else {
      tempEndDate.value = date
    }

    // Emit the selected range
    if (tempStartDate.value && tempEndDate.value) {
      emit('update:modelValue', {
        start: format(tempStartDate.value, 'yyyy-MM-dd'),
        end: format(tempEndDate.value, 'yyyy-MM-dd')
      })
      selectingStart.value = true
    }
  }
}

const clearSelection = () => {
  tempStartDate.value = null
  tempEndDate.value = null
  selectingStart.value = true
  emit('update:modelValue', null)
}

const getDayClasses = (date: Date) => {
  const classes = ['w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors']

  if (isDateDisabled(date)) {
    classes.push('text-gray-300 dark:text-gray-700 cursor-not-allowed line-through')
  } else if (isSelected(date)) {
    classes.push('bg-orange-600 text-white')
  } else if (isInRange(date)) {
    classes.push('bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100')
  } else {
    classes.push('hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer')
  }

  return classes.join(' ')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Select Rental Dates
      </h3>
      <UButton
        v-if="tempStartDate || tempEndDate"
        color="neutral"
        variant="ghost"
        size="xs"
        label="Clear"
        @click="clearSelection"
      />
    </div>

    <!-- Selected Range Display -->
    <div v-if="tempStartDate || tempEndDate" class="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
      <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
        Selected Dates:
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <span v-if="tempStartDate">{{ format(tempStartDate, 'MMM d, yyyy') }}</span>
        <span v-if="tempStartDate && tempEndDate"> - </span>
        <span v-if="tempEndDate">{{ format(tempEndDate, 'MMM d, yyyy') }}</span>
        <span v-if="tempStartDate && !tempEndDate" class="text-orange-600 dark:text-orange-400 ml-2">
          (Select end date)
        </span>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <div class="flex items-center justify-between mb-4">
      <UButton
        color="neutral"
        variant="ghost"
        icon="lucide:chevron-left"
        @click="previousMonth"
      />
      <div class="text-base font-semibold text-gray-900 dark:text-white">
        {{ format(currentMonth, 'MMMM yyyy') }}
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="lucide:chevron-right"
        @click="nextMonth"
      />
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <!-- Day Headers -->
      <div
        v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
        :key="day"
        class="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
      >
        {{ day }}
      </div>

      <!-- Empty cells before month starts -->
      <div
        v-for="(_, index) in emptyDays"
        :key="`empty-${index}`"
        class="w-10 h-10"
      />

      <!-- Month days -->
      <button
        v-for="date in monthDays"
        :key="date.toString()"
        :class="getDayClasses(date)"
        :disabled="isDateDisabled(date)"
        type="button"
        @click="selectDate(date)"
      >
        {{ format(date, 'd') }}
      </button>
    </div>

    <!-- Legend -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-orange-600 rounded" />
          <span>Selected</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded line-through" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  </div>
</template>
