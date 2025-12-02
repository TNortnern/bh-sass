<script setup lang="ts">
import type { InventoryUnit } from '~/composables/useInventory'
import { getStatusLabel } from '~/utils/formatters'

const props = defineProps<{
  units: InventoryUnit[]
}>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'green'
    case 'rented':
      return 'blue'
    case 'maintenance':
      return 'orange'
    case 'retired':
      return 'red'
    default:
      return 'gray'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available':
      return 'i-lucide-check-circle'
    case 'rented':
      return 'i-lucide-calendar'
    case 'maintenance':
      return 'i-lucide-wrench'
    case 'retired':
      return 'i-lucide-archive'
    default:
      return 'i-lucide-circle'
  }
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'excellent':
      return 'text-green-600 dark:text-green-400'
    case 'good':
      return 'text-blue-600 dark:text-blue-400'
    case 'fair':
      return 'text-orange-600 dark:text-orange-400'
    case 'poor':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

const formatDate = (date?: string) => {
  if (!date) return 'Never'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount)
}

const daysSinceRental = (date?: string) => {
  if (!date) return null
  const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  return days
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="unit in units"
      :key="unit.id"
      class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors bg-white dark:bg-gray-900"
    >
      <div class="flex items-start justify-between gap-4">
        <!-- Left: Unit Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-green-100 dark:bg-green-900/20': unit.status === 'available',
                'bg-blue-100 dark:bg-blue-900/20': unit.status === 'rented',
                'bg-orange-100 dark:bg-orange-900/20': unit.status === 'maintenance',
                'bg-red-100 dark:bg-red-900/20': unit.status === 'retired'
              }"
            >
              <UIcon
                :name="getStatusIcon(unit.status)"
                class="w-5 h-5"
                :class="{
                  'text-green-600 dark:text-green-400': unit.status === 'available',
                  'text-blue-600 dark:text-blue-400': unit.status === 'rented',
                  'text-orange-600 dark:text-orange-400': unit.status === 'maintenance',
                  'text-red-600 dark:text-red-400': unit.status === 'retired'
                }"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg font-semibold text-gray-900 dark:text-white font-mono">
                  {{ unit.serialNumber }}
                </span>
                <UBadge
                  :color="getStatusColor(unit.status)"
                  variant="subtle"
                  size="sm"
                >
                  {{ getStatusLabel(unit.status) }}
                </UBadge>
              </div>
              <div class="flex items-center gap-4 text-sm">
                <div v-if="unit.barcode" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-barcode" class="w-3.5 h-3.5" />
                  <span>{{ unit.barcode }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-star" class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  <span class="text-gray-500 dark:text-gray-400">Condition:</span>
                  <span :class="getConditionColor(unit.condition)" class="font-medium capitalize">
                    {{ unit.condition }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Purchase Date</p>
              <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(unit.purchaseDate) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Purchase Price</p>
              <p class="text-gray-900 dark:text-white font-medium">{{ formatCurrency(unit.purchasePrice) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Last Rental</p>
              <div class="flex items-center gap-1.5">
                <p class="text-gray-900 dark:text-white font-medium">{{ formatDate(unit.lastRentalDate) }}</p>
                <span
                  v-if="daysSinceRental(unit.lastRentalDate) !== null"
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  ({{ daysSinceRental(unit.lastRentalDate) }}d ago)
                </span>
              </div>
            </div>
            <div v-if="unit.status === 'maintenance' && unit.maintenanceNotes">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Maintenance Notes</p>
              <p class="text-orange-600 dark:text-orange-400 font-medium">{{ unit.maintenanceNotes }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex flex-col gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-edit"
            square
          />
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-more-vertical"
            square
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="units.length === 0"
      class="text-center py-12"
    >
      <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-box" class="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <p class="text-gray-500 dark:text-gray-400 mb-4">No units found</p>
      <UButton color="primary" variant="outline" size="sm">
        Add First Unit
        <UIcon name="i-lucide-plus" class="w-4 h-4 ml-2" />
      </UButton>
    </div>
  </div>
</template>
