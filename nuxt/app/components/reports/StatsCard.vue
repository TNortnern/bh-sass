<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  trend?: number
  previousValue?: string | number
  icon?: string
  color?: 'cyan' | 'magenta' | 'yellow' | 'green'
  loading?: boolean
}>()

const colorClasses = {
  cyan: 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
  magenta: 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
  yellow: 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  green: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
}

const iconColorClasses = {
  cyan: 'text-cyan-500',
  magenta: 'text-pink-500',
  yellow: 'text-yellow-500',
  green: 'text-emerald-500'
}

const trendColorClasses = {
  cyan: 'text-cyan-400 bg-cyan-500/10',
  magenta: 'text-pink-400 bg-pink-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10',
  green: 'text-emerald-400 bg-emerald-500/10'
}

const cardClass = computed(() => colorClasses[props.color || 'cyan'])
const iconClass = computed(() => iconColorClasses[props.color || 'cyan'])
const trendClass = computed(() => trendColorClasses[props.color || 'cyan'])

const formattedTrend = computed(() => {
  if (props.trend === undefined) return null
  const sign = props.trend > 0 ? '+' : ''
  return `${sign}${props.trend.toFixed(1)}%`
})

const isPositiveTrend = computed(() => props.trend && props.trend > 0)
</script>

<template>
  <div
    class="relative p-6 bg-black border-2 rounded-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
    :class="cardClass"
  >
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px); background-size: 100% 4px;" />
    </div>

    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div
            v-if="icon"
            class="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-800 flex items-center justify-center"
          >
            <UIcon
              :name="icon"
              class="w-5 h-5"
              :class="iconClass"
            />
          </div>
          <h3 class="text-xs font-mono uppercase tracking-wider text-gray-400">
            {{ label }}
          </h3>
        </div>

        <!-- Trend indicator -->
        <div
          v-if="trend !== undefined"
          class="flex items-center gap-1 px-2 py-1 rounded font-mono text-xs font-bold"
          :class="trendClass"
        >
          <UIcon
            :name="isPositiveTrend ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            class="w-3 h-3"
          />
          {{ formattedTrend }}
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-3">
        <div class="h-12 bg-gray-800 rounded animate-pulse" />
        <div class="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
      </div>

      <!-- Value -->
      <div v-else>
        <div class="text-4xl font-mono font-bold text-white mb-2 tracking-tight">
          {{ value }}
        </div>

        <!-- Previous value comparison -->
        <div v-if="previousValue" class="flex items-center gap-2 text-sm font-mono text-gray-500">
          <span>vs</span>
          <span class="text-gray-400">{{ previousValue }}</span>
          <span>prev period</span>
        </div>
      </div>
    </div>

    <!-- Glitch effect line -->
    <div
      class="absolute bottom-0 left-0 right-0 h-0.5 opacity-50"
      :class="iconClass"
      style="background: linear-gradient(90deg, transparent, currentColor, transparent);"
    />
  </div>
</template>
