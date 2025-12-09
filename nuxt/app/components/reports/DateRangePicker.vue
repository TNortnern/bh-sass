<script setup lang="ts">
import { subDays, startOfYear } from 'date-fns'

interface DateRange {
  start: Date | null
  end: Date | null
}

const emit = defineEmits<{
  'update:modelValue': [DateRange]
  'change': [DateRange]
}>()

const props = defineProps<{
  modelValue: DateRange
}>()

const selectedPreset = ref<string>('30d')
const showCustom = ref(false)
const customStart = ref<Date | null>(null)
const customEnd = ref<Date | null>(null)
const compareEnabled = ref(false)

const presets = [
  { label: 'Today', value: 'today', days: 0 },
  { label: '7 Days', value: '7d', days: 7 },
  { label: '30 Days', value: '30d', days: 30 },
  { label: '90 Days', value: '90d', days: 90 },
  { label: 'YTD', value: 'ytd', days: -1 },
  { label: 'Custom', value: 'custom', days: -2 }
]

function selectPreset(preset: typeof presets[0]) {
  selectedPreset.value = preset.value

  if (preset.value === 'custom') {
    showCustom.value = true
    return
  }

  showCustom.value = false
  const end = new Date()
  let start: Date

  if (preset.value === 'today') {
    start = new Date()
  } else if (preset.value === 'ytd') {
    start = startOfYear(new Date())
  } else {
    start = subDays(end, preset.days)
  }

  const range = { start, end }
  emit('update:modelValue', range)
  emit('change', range)
}

function applyCustomRange() {
  if (customStart.value && customEnd.value) {
    const range = { start: customStart.value, end: customEnd.value }
    emit('update:modelValue', range)
    emit('change', range)
    showCustom.value = false
  }
}

// Initialize with 30 days
onMounted(() => {
  selectPreset(presets[2])
})
</script>

<template>
  <div class="space-y-4">
    <!-- Preset buttons -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 border-2"
        :class="selectedPreset === preset.value
          ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-[0_0_20px_rgba(251,191,36,0.5)]'
          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400'"
        @click="selectPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Custom date range -->
    <div
      v-if="showCustom"
      class="p-4 border-2 border-amber-500/30 rounded-lg bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-mono text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wider">
            Start Date
          </label>
          <input
            v-model="customStart"
            type="date"
            class="w-full px-4 py-2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none transition-colors"
          >
        </div>
        <div>
          <label class="block text-xs font-mono text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-wider">
            End Date
          </label>
          <input
            v-model="customEnd"
            type="date"
            class="w-full px-4 py-2 bg-white dark:bg-black border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono focus:border-amber-500 focus:outline-none transition-colors"
          >
        </div>
      </div>
      <button
        class="w-full px-4 py-2 bg-amber-500 text-white font-mono font-bold rounded-lg hover:bg-amber-400 transition-colors"
        @click="applyCustomRange"
      >
        Apply Range
      </button>
    </div>

    <!-- Compare toggle -->
    <div class="flex items-center gap-3">
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 font-mono text-sm"
        :class="compareEnabled
          ? 'bg-pink-500 border-pink-500 text-white font-bold'
          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-pink-500/50'"
        @click="compareEnabled = !compareEnabled"
      >
        <div
          class="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
          :class="compareEnabled ? 'border-white bg-white' : 'border-gray-400 dark:border-gray-600'"
        >
          <UIcon
            v-if="compareEnabled"
            name="i-lucide-check"
            class="w-3 h-3 text-pink-500"
          />
        </div>
        Compare to previous period
      </button>
    </div>
  </div>
</template>

