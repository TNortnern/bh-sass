<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  trend?: number
  previousValue?: string | number
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'info' | 'cyan' | 'magenta' | 'green' | 'yellow'
  loading?: boolean
}>()

const colorClasses = {
  primary: 'bg-blue-100 dark:bg-blue-900/20',
  success: 'bg-green-100 dark:bg-green-900/20',
  warning: 'bg-orange-100 dark:bg-orange-900/20',
  info: 'bg-purple-100 dark:bg-purple-900/20',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/20',
  magenta: 'bg-pink-100 dark:bg-pink-900/20',
  green: 'bg-emerald-100 dark:bg-emerald-900/20',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/20'
}

const iconColorClasses = {
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  info: 'text-purple-600 dark:text-purple-400',
  cyan: 'text-cyan-600 dark:text-cyan-400',
  magenta: 'text-pink-600 dark:text-pink-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  yellow: 'text-yellow-600 dark:text-yellow-400'
}

const iconBgClass = computed(() => colorClasses[props.color || 'primary'])
const iconClass = computed(() => iconColorClasses[props.color || 'primary'])

const formattedTrend = computed(() => {
  if (props.trend === undefined) return null
  const sign = props.trend > 0 ? '+' : ''
  return `${sign}${props.trend.toFixed(1)}%`
})

const isPositiveTrend = computed(() => props.trend && props.trend > 0)
</script>

<template>
  <UCard class="bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ label }}
        </p>

        <!-- Loading state -->
        <div
          v-if="loading"
          class="mt-1 space-y-2"
        >
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
        </div>

        <!-- Value -->
        <div v-else>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ value }}
            </p>

            <!-- Trend indicator -->
            <span
              v-if="trend !== undefined"
              class="text-sm font-medium"
              :class="isPositiveTrend ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              <UIcon
                :name="isPositiveTrend ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                class="w-3 h-3 inline"
              />
              {{ formattedTrend }}
            </span>
          </div>

          <!-- Previous value comparison -->
          <p
            v-if="previousValue"
            class="text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            vs {{ previousValue }} prev period
          </p>
        </div>
      </div>

      <!-- Icon -->
      <div
        v-if="icon"
        class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="iconBgClass"
      >
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="iconClass"
        />
      </div>
    </div>
  </UCard>
</template>
