<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

definePageMeta({
  layout: 'dashboard'
})

const { loading, dateRange, fetchInventoryReport, exportToCsv } = useReports()

const inventoryData = ref<any>(null)

async function loadData() {
  inventoryData.value = await fetchInventoryReport(dateRange.value)
}

function handleDateRangeChange() {
  loadData()
}

async function handleExport() {
  await exportToCsv('inventory', dateRange.value)
}

onMounted(() => {
  setTimeout(() => {
    if (dateRange.value.start && dateRange.value.end) {
      loadData()
    }
  }, 100)
})

// Utilization chart data
const utilizationChartData = computed(() => ({
  labels: (inventoryData.value?.utilizationByItem || []).map((item: any) => item.name),
  datasets: [
    {
      label: 'Utilization Rate',
      data: (inventoryData.value?.utilizationByItem || []).map((item: any) => item.utilizationRate),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: '#10b981',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const utilizationChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#000',
      titleColor: '#10b981',
      bodyColor: '#fff',
      borderColor: '#10b981',
      borderWidth: 2,
      padding: 12,
      displayColors: false,
      titleFont: { family: 'monospace', size: 12, weight: 'bold' },
      bodyFont: { family: 'monospace', size: 14 },
      callbacks: {
        label: (context) => {
          return `${context.parsed.x.toFixed(1)}% utilized`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(107, 116, 128, 0.1)', drawTicks: false },
      border: { color: '#374151', width: 2 },
      ticks: {
        color: '#6b7280',
        font: { family: 'monospace', size: 10 },
        padding: 8,
        callback: (value) => `${value}%`
      },
      max: 100
    },
    y: {
      grid: { display: false },
      border: { color: '#374151', width: 2 },
      ticks: {
        color: '#6b7280',
        font: { family: 'monospace', size: 11, weight: 'bold' },
        padding: 8
      }
    }
  },
  animation: { duration: 1000, easing: 'easeInOutQuart' }
}

const averageUtilization = computed(() => {
  if (!inventoryData.value?.utilizationByItem || inventoryData.value.utilizationByItem.length === 0) return 0
  const sum = inventoryData.value.utilizationByItem.reduce((acc: number, item: any) => acc + item.utilizationRate, 0)
  return (sum / inventoryData.value.utilizationByItem.length).toFixed(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <NuxtLink
            to="/app/reports"
            class="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-800 hover:border-green-500 flex items-center justify-center transition-all"
          >
            <UIcon name="i-lucide-chevron-left" class="w-5 h-5 text-gray-400" />
          </NuxtLink>
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <UIcon name="i-lucide-box" class="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white font-mono tracking-tight">
              INVENTORY REPORT
            </h1>
            <p class="text-gray-400 font-mono text-sm">
              Utilization, performance, and maintenance
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-refresh-cw"
          class="font-mono"
          :loading="loading"
          @click="loadData"
        >
          Refresh
        </UButton>
        <UButton
          color="neutral"
          variant="solid"
          icon="i-lucide-download"
          class="font-mono bg-emerald-500 hover:bg-emerald-400 text-black"
          @click="handleExport"
        >
          Export CSV
        </UButton>
      </div>
    </div>

    <!-- Date Range Picker -->
    <UCard
      class="bg-black border-2 border-gray-800"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <ReportsDateRangePicker
        v-model="dateRange"
        @change="handleDateRangeChange"
      />
    </UCard>

    <!-- Stats Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportsStatsCard
        label="Avg Utilization"
        :value="`${averageUtilization}%`"
        icon="i-lucide-activity"
        color="green"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Total Items"
        :value="inventoryData?.utilizationByItem?.length || 0"
        icon="i-lucide-box"
        color="cyan"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Maintenance Due"
        :value="inventoryData?.maintenanceSchedule?.length || 0"
        icon="i-lucide-truck"
        color="yellow"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Top Performer"
        :value="inventoryData?.topItems?.[0]?.utilizationRate ? `${inventoryData.topItems[0].utilizationRate.toFixed(1)}%` : '0%'"
        icon="i-lucide-trending-up"
        color="magenta"
        :loading="loading"
      />
    </div>

    <!-- Utilization Chart -->
    <UCard
      class="bg-black border-2 border-emerald-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-activity" class="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Utilization Rate by Item
            </h3>
            <p class="text-xs font-mono text-gray-500">Percentage of time booked</p>
          </div>
        </div>
      </template>

      <div class="relative">
        <div
          v-if="loading"
          class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
        >
          <div class="flex items-center gap-3 text-emerald-400">
            <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin" />
            <span class="font-mono text-sm">Loading chart data...</span>
          </div>
        </div>
        <div class="h-96">
          <Bar :data="utilizationChartData" :options="utilizationChartOptions" />
        </div>
      </div>
    </UCard>

    <!-- Performance Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Performing Items -->
      <UCard
        class="bg-black border-2 border-emerald-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Top Performers
              </h3>
              <p class="text-xs font-mono text-gray-500">Most utilized items</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(item, index) in inventoryData?.topItems || []"
            :key="item.name"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-emerald-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ item.name }}</span>
              <span class="font-mono text-sm text-emerald-400 font-bold">
                {{ item.utilizationRate.toFixed(1) }}%
              </span>
            </div>
            <div class="flex items-center justify-between text-xs font-mono text-gray-500">
              <span>{{ item.bookings }} bookings</span>
              <span>${{ item.revenue.toLocaleString('en-US') }}</span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                :style="{ width: `${item.utilizationRate}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Underutilized Items -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-trending-down" class="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Underutilized
              </h3>
              <p class="text-xs font-mono text-gray-500">Items needing attention</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(item, index) in inventoryData?.bottomItems || []"
            :key="item.name"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ item.name }}</span>
              <span class="font-mono text-sm text-yellow-400 font-bold">
                {{ item.utilizationRate.toFixed(1) }}%
              </span>
            </div>
            <div class="flex items-center justify-between text-xs font-mono text-gray-500">
              <span>{{ item.bookings }} bookings</span>
              <span>${{ item.revenue.toLocaleString('en-US') }}</span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                :style="{ width: `${item.utilizationRate}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Detailed Breakdown -->
    <UCard
      class="bg-black border-2 border-cyan-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-clipboard-list" class="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Complete Inventory Breakdown
            </h3>
            <p class="text-xs font-mono text-gray-500">All items with metrics</p>
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full font-mono text-sm">
          <thead>
            <tr class="border-b-2 border-gray-800">
              <th class="text-left py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Item
              </th>
              <th class="text-right py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Utilization
              </th>
              <th class="text-right py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Bookings
              </th>
              <th class="text-right py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in inventoryData?.utilizationByItem || []"
              :key="item.name"
              class="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="py-3 px-4 text-white">{{ item.name }}</td>
              <td class="py-3 px-4 text-right">
                <span
                  class="font-bold"
                  :class="item.utilizationRate >= 75 ? 'text-emerald-400' : item.utilizationRate >= 50 ? 'text-yellow-400' : 'text-red-400'"
                >
                  {{ item.utilizationRate.toFixed(1) }}%
                </span>
              </td>
              <td class="py-3 px-4 text-right text-white">{{ item.bookings }}</td>
              <td class="py-3 px-4 text-right text-cyan-400 font-bold">
                ${{ item.revenue.toLocaleString('en-US') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Maintenance & Availability -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Maintenance Schedule -->
      <UCard
        class="bg-black border-2 border-pink-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-truck" class="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Upcoming Maintenance
              </h3>
              <p class="text-xs font-mono text-gray-500">Scheduled service</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(schedule, index) in inventoryData?.maintenanceSchedule || []"
            :key="`${schedule.item}-${schedule.date}`"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-pink-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ schedule.item }}</span>
              <span class="px-2 py-1 rounded text-xs font-mono font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                {{ schedule.type }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs font-mono text-gray-500">
              <UIcon name="i-lucide-calendar" class="w-3 h-3" />
              <span>{{ new Date(schedule.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Availability Overview -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-calendar-check" class="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Availability Overview
              </h3>
              <p class="text-xs font-mono text-gray-500">Days available vs booked</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(item, index) in inventoryData?.availabilityOverview || []"
            :key="item.item"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ item.item }}</span>
              <span class="font-mono text-sm text-yellow-400 font-bold">
                {{ item.availableDays }}/{{ item.totalDays }} days
              </span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                :style="{ width: `${(item.availableDays / item.totalDays) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
