<script setup lang="ts">
import type { BookingFilters } from '~/composables/useBookings'
import { getStatusLabel, getPaymentStatusLabel } from '~/utils/formatters'

interface Props {
  modelValue: BookingFilters
}

interface Emits {
  (e: 'update:modelValue', value: BookingFilters): void
  (e: 'reset'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local filter state
const localFilters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Filter options
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]

const paymentStatusOptions = [
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Paid', value: 'paid' },
  { label: 'Refunded', value: 'refunded' }
]

// Search input
const searchQuery = computed({
  get: () => localFilters.value.search || '',
  set: (value) => {
    localFilters.value = { ...localFilters.value, search: value }
  }
})

// Status filter
const selectedStatuses = computed({
  get: () => localFilters.value.status || [],
  set: (value) => {
    localFilters.value = { ...localFilters.value, status: value }
  }
})

// Payment status filter
const selectedPaymentStatuses = computed({
  get: () => localFilters.value.paymentStatus || [],
  set: (value) => {
    localFilters.value = { ...localFilters.value, paymentStatus: value }
  }
})

// Date range
const dateRange = computed({
  get: () => localFilters.value.dateRange,
  set: (value) => {
    localFilters.value = { ...localFilters.value, dateRange: value }
  }
})

// Reset all filters
const resetFilters = () => {
  emit('reset')
}

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.search ||
    (localFilters.value.status && localFilters.value.status.length > 0) ||
    (localFilters.value.paymentStatus && localFilters.value.paymentStatus.length > 0) ||
    localFilters.value.dateRange
  )
})

// Active filter count
const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.value.search) count++
  if (localFilters.value.status && localFilters.value.status.length > 0) count++
  if (localFilters.value.paymentStatus && localFilters.value.paymentStatus.length > 0) count++
  if (localFilters.value.dateRange) count++
  return count
})
</script>

<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          size="lg"
          placeholder="Search by booking #, customer name, or email..."
          class="w-full"
        />
      </div>

      <!-- Filter Toggle for Mobile -->
      <div class="flex gap-2">
        <UPopover>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-filter"
            class="flex-1 sm:flex-none"
          >
            Filters
            <UBadge
              v-if="activeFilterCount > 0"
              :label="String(activeFilterCount)"
              color="orange"
              class="ml-2"
            />
          </UButton>

          <template #panel>
            <div class="p-4 space-y-4 w-80">
              <!-- Status Filter -->
              <div>
                <label class="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Status
                </label>
                <div class="space-y-2">
                  <UCheckbox
                    v-for="option in statusOptions"
                    :key="option.value"
                    v-model="selectedStatuses"
                    :value="option.value"
                    :label="option.label"
                  />
                </div>
              </div>

              <UDivider />

              <!-- Payment Status Filter -->
              <div>
                <label class="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Payment Status
                </label>
                <div class="space-y-2">
                  <UCheckbox
                    v-for="option in paymentStatusOptions"
                    :key="option.value"
                    v-model="selectedPaymentStatuses"
                    :value="option.value"
                    :label="option.label"
                  />
                </div>
              </div>

              <UDivider />

              <!-- Date Range -->
              <div>
                <label class="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                  Date Range
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <UInput
                    v-model="dateRange.start"
                    type="date"
                    placeholder="Start date"
                    size="md"
                  />
                  <UInput
                    v-model="dateRange.end"
                    type="date"
                    placeholder="End date"
                    size="md"
                  />
                </div>
              </div>

              <!-- Reset Button -->
              <UButton
                v-if="hasActiveFilters"
                color="neutral"
                variant="outline"
                block
                icon="i-lucide-x"
                @click="resetFilters"
              >
                Clear Filters
              </UButton>
            </div>
          </template>
        </UPopover>

        <UButton
          v-if="hasActiveFilters"
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-x"
          class="sm:hidden"
          @click="resetFilters"
        />
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <!-- Search Badge -->
      <UBadge
        v-if="searchQuery"
        color="orange"
        variant="subtle"
        size="md"
      >
        Search: {{ searchQuery }}
        <UButton
          color="orange"
          variant="ghost"
          size="2xs"
          icon="i-lucide-x"
          class="ml-1 -mr-1"
          @click="searchQuery = ''"
        />
      </UBadge>

      <!-- Status Badges -->
      <UBadge
        v-for="status in selectedStatuses"
        :key="status"
        color="orange"
        variant="subtle"
        size="md"
      >
        Status: {{ getStatusLabel(status) }}
        <UButton
          color="orange"
          variant="ghost"
          size="2xs"
          icon="i-lucide-x"
          class="ml-1 -mr-1"
          @click="selectedStatuses = selectedStatuses.filter(s => s !== status)"
        />
      </UBadge>

      <!-- Payment Status Badges -->
      <UBadge
        v-for="paymentStatus in selectedPaymentStatuses"
        :key="paymentStatus"
        color="orange"
        variant="subtle"
        size="md"
      >
        Payment: {{ getPaymentStatusLabel(paymentStatus) }}
        <UButton
          color="orange"
          variant="ghost"
          size="2xs"
          icon="i-lucide-x"
          class="ml-1 -mr-1"
          @click="selectedPaymentStatuses = selectedPaymentStatuses.filter(p => p !== paymentStatus)"
        />
      </UBadge>

      <!-- Date Range Badge -->
      <UBadge
        v-if="dateRange"
        color="orange"
        variant="subtle"
        size="md"
      >
        {{ dateRange.start }} - {{ dateRange.end }}
        <UButton
          color="orange"
          variant="ghost"
          size="2xs"
          icon="i-lucide-x"
          class="ml-1 -mr-1"
          @click="dateRange = undefined"
        />
      </UBadge>
    </div>
  </div>
</template>
