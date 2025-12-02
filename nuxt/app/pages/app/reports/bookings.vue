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

const { loading, dateRange, fetchBookingsReport, exportToCsv } = useReports()

const bookingsData = ref<any>(null)

async function loadData() {
  bookingsData.value = await fetchBookingsReport(dateRange.value)
}

function handleDateRangeChange() {
  loadData()
}

async function handleExport() {
  await exportToCsv('bookings', dateRange.value)
}

onMounted(() => {
  setTimeout(() => {
    if (dateRange.value.start && dateRange.value.end) {
      loadData()
    }
  }, 100)
})

// Busiest hours chart data
const busiestHoursChartData = computed(() => ({
  labels: (bookingsData.value?.busiestHours || []).map((h: any) => `${h.hour}:00`),
  datasets: [
    {
      label: 'Bookings',
      data: (bookingsData.value?.busiestHours || []).map((h: any) => h.bookings),
      backgroundColor: 'rgba(234, 179, 8, 0.8)',
      borderColor: '#eab308',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const busiestHoursChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#000',
      titleColor: '#eab308',
      bodyColor: '#fff',
      borderColor: '#eab308',
      borderWidth: 2,
      padding: 12,
      displayColors: false,
      titleFont: { family: 'monospace', size: 12, weight: 'bold' },
      bodyFont: { family: 'monospace', size: 14 }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { color: '#374151', width: 2 },
      ticks: {
        color: '#6b7280',
        font: { family: 'monospace', size: 11, weight: 'bold' },
        padding: 8
      }
    },
    y: {
      grid: { color: 'rgba(107, 116, 128, 0.1)', drawTicks: false },
      border: { color: '#374151', width: 2 },
      ticks: {
        color: '#6b7280',
        font: { family: 'monospace', size: 10 },
        padding: 8
      }
    }
  },
  animation: { duration: 1000, easing: 'easeInOutQuart' }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <NuxtLink
            to="/app/reports"
            class="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-800 hover:border-pink-500 flex items-center justify-center transition-all"
          >
            <UIcon name="i-lucide-chevron-left" class="w-5 h-5 text-gray-400" />
          </NuxtLink>
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
            <UIcon name="i-lucide-calendar-check" class="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white font-mono tracking-tight">
              BOOKINGS REPORT
            </h1>
            <p class="text-gray-400 font-mono text-sm">
              Detailed booking analytics and trends
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
          class="font-mono bg-pink-500 hover:bg-pink-400 text-black"
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportsStatsCard
        label="Total Bookings"
        :value="bookingsData?.total || 0"
        :trend="bookingsData?.percentageChange"
        icon="i-lucide-calendar-check"
        color="magenta"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Avg Duration"
        :value="bookingsData ? `${bookingsData.averageDuration} hrs` : '0 hrs'"
        icon="i-lucide-clock"
        color="cyan"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Conversion Rate"
        :value="bookingsData ? `${bookingsData.conversionRate}%` : '0%'"
        icon="i-lucide-trending-up"
        color="green"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Cancellation Rate"
        :value="bookingsData ? `${bookingsData.cancellationRate}%` : '0%'"
        icon="i-lucide-trending-down"
        color="yellow"
        :loading="loading"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bookings by Status -->
      <UCard
        class="bg-black border-2 border-pink-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Bookings by Status
              </h3>
              <p class="text-xs font-mono text-gray-500">Distribution breakdown</p>
            </div>
          </div>
        </template>

        <ReportsBookingsChart
          :data="bookingsData?.byStatus || []"
          :loading="loading"
        />
      </UCard>

      <!-- Busiest Hours -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Busiest Hours
              </h3>
              <p class="text-xs font-mono text-gray-500">Peak booking times</p>
            </div>
          </div>
        </template>

        <div class="relative">
          <div
            v-if="loading"
            class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
          >
            <div class="flex items-center gap-3 text-yellow-400">
              <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin" />
              <span class="font-mono text-sm">Loading chart data...</span>
            </div>
          </div>
          <div class="h-80">
            <Bar :data="busiestHoursChartData" :options="busiestHoursChartOptions" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Bookings by Item -->
    <UCard
      class="bg-black border-2 border-cyan-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-box" class="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Bookings by Item
            </h3>
            <p class="text-xs font-mono text-gray-500">Most booked inventory</p>
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
                Bookings
              </th>
              <th class="text-right py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Revenue
              </th>
              <th class="text-right py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Avg Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in bookingsData?.byItem || []"
              :key="item.name"
              class="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="py-3 px-4 text-white">{{ item.name }}</td>
              <td class="py-3 px-4 text-right text-pink-400 font-bold">{{ item.bookings }}</td>
              <td class="py-3 px-4 text-right text-cyan-400 font-bold">
                ${{ item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </td>
              <td class="py-3 px-4 text-right text-white">
                ${{ (item.revenue / item.bookings).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Analysis Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Busiest Days -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-calendar-clock" class="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Busiest Days
              </h3>
              <p class="text-xs font-mono text-gray-500">Weekly distribution</p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(day, index) in bookingsData?.busiestDays || []"
            :key="day.day"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm text-white font-bold">{{ day.day }}</span>
              <span class="font-mono text-sm text-yellow-400 font-bold">{{ day.bookings }} bookings</span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                :style="{ width: `${(day.bookings / bookingsData.busiestDays[0].bookings) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Cancellation Analysis -->
      <UCard
        class="bg-black border-2 border-red-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-x" class="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Cancellation Reasons
              </h3>
              <p class="text-xs font-mono text-gray-500">Why bookings are cancelled</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg">
            <div class="text-xs font-mono text-gray-400 mb-2">Cancellation Rate</div>
            <div class="text-3xl font-mono font-bold text-red-400">
              {{ bookingsData?.cancellationRate || 0 }}%
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(reason, index) in bookingsData?.cancellationReasons || []"
              :key="reason.reason"
              class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-red-500/50 transition-all"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono text-sm text-white">{{ reason.reason }}</span>
                <span class="font-mono text-sm text-red-400 font-bold">{{ reason.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
