<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

definePageMeta({
  layout: 'dashboard'
})

const { loading, dateRange, fetchCustomersReport, exportToCsv } = useReports()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customersData = ref<any>(null)

async function loadData() {
  customersData.value = await fetchCustomersReport(dateRange.value)
}

function handleDateRangeChange() {
  loadData()
}

async function handleExport() {
  await exportToCsv('customers', dateRange.value)
}

onMounted(() => {
  setTimeout(() => {
    if (dateRange.value.start && dateRange.value.end) {
      loadData()
    }
  }, 100)
})

// Customer segment chart data
const customerSegmentChartData = computed(() => {
  const newCount = customersData.value?.newCustomers || 0
  const returningCount = customersData.value?.returningCustomers || 0

  return {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [newCount, returningCount],
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)', // cyan
          'rgba(236, 72, 153, 0.8)' // pink
        ],
        borderColor: ['#06b6d4', '#ec4899'],
        borderWidth: 2
      }
    ]
  }
})

const customerSegmentChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#9ca3af',
        font: { family: 'monospace', size: 12, weight: 'bold' },
        padding: 20
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#000',
      titleColor: '#06b6d4',
      bodyColor: '#fff',
      borderColor: '#06b6d4',
      borderWidth: 2,
      padding: 12,
      displayColors: true,
      titleFont: { family: 'monospace', size: 12, weight: 'bold' },
      bodyFont: { family: 'monospace', size: 14 }
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
            class="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-800 hover:border-purple-500 flex items-center justify-center transition-all"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="w-5 h-5 text-gray-400"
            />
          </NuxtLink>
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <UIcon
              name="i-lucide-users"
              class="w-6 h-6 text-black"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white font-mono tracking-tight">
              CUSTOMER INSIGHTS
            </h1>
            <p class="text-gray-400 font-mono text-sm">
              Customer behavior and lifetime value
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
          class="font-mono bg-purple-500 hover:bg-purple-400 text-black"
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
        label="Total Customers"
        :value="customersData?.totalCustomers || 0"
        :trend="customersData?.percentageChange"
        icon="i-lucide-users"
        color="cyan"
        :loading="loading"
      />

      <ReportsStatsCard
        label="New Customers"
        :value="customersData?.newCustomers || 0"
        icon="i-lucide-user-plus"
        color="green"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Avg Lifetime Value"
        :value="customersData?.averageLifetimeValue ? `$${customersData.averageLifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-dollar-sign"
        color="magenta"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Repeat Rate"
        :value="customersData?.repeatRate ? `${customersData.repeatRate.toFixed(1)}%` : '0%'"
        icon="i-lucide-repeat"
        color="yellow"
        :loading="loading"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Customer Segment -->
      <UCard
        class="bg-black border-2 border-purple-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-pie-chart"
                class="w-4 h-4 text-purple-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Customer Segments
              </h3>
              <p class="text-xs font-mono text-gray-500">
                New vs returning
              </p>
            </div>
          </div>
        </template>

        <div class="relative">
          <div
            v-if="loading"
            class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
          >
            <div class="flex items-center gap-3 text-purple-400">
              <UIcon
                name="i-lucide-loader-circle"
                class="w-6 h-6 animate-spin"
              />
              <span class="font-mono text-sm">Loading chart data...</span>
            </div>
          </div>
          <div class="h-80 flex items-center justify-center">
            <Doughnut
              :data="customerSegmentChartData"
              :options="customerSegmentChartOptions"
            />
          </div>
        </div>
      </UCard>

      <!-- Acquisition Sources -->
      <UCard
        class="bg-black border-2 border-cyan-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-globe"
                class="w-4 h-4 text-cyan-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Acquisition Sources
              </h3>
              <p class="text-xs font-mono text-gray-500">
                Where customers come from
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(source, index) in customersData?.acquisitionSources || []"
            :key="source.source"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-cyan-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ source.source }}</span>
              <span class="font-mono text-sm text-cyan-400 font-bold">{{ source.count }} customers</span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                :style="{ width: `${(source.count / (customersData?.totalCustomers || 1)) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Top Customers Table -->
    <UCard
      class="bg-black border-2 border-purple-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-crown"
              class="w-4 h-4 text-purple-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Top Customers by Lifetime Value
            </h3>
            <p class="text-xs font-mono text-gray-500">
              VIP customers
            </p>
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full font-mono text-sm">
          <thead>
            <tr class="border-b-2 border-gray-800">
              <th class="text-left py-3 px-4 text-purple-400 font-bold uppercase text-xs">
                Customer
              </th>
              <th class="text-left py-3 px-4 text-purple-400 font-bold uppercase text-xs">
                Email
              </th>
              <th class="text-right py-3 px-4 text-purple-400 font-bold uppercase text-xs">
                Bookings
              </th>
              <th class="text-right py-3 px-4 text-purple-400 font-bold uppercase text-xs">
                Lifetime Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(customer, index) in customersData?.topCustomers || []"
              :key="customer.email"
              class="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="py-3 px-4 text-white">
                {{ customer.name }}
              </td>
              <td class="py-3 px-4 text-gray-400">
                {{ customer.email }}
              </td>
              <td class="py-3 px-4 text-right text-white">
                {{ customer.bookings }}
              </td>
              <td class="py-3 px-4 text-right text-purple-400 font-bold">
                ${{ customer.lifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Analysis Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Booking Frequency -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-calendar-clock"
                class="w-4 h-4 text-yellow-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Booking Frequency
              </h3>
              <p class="text-xs font-mono text-gray-500">
                Customer behavior
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(freq, index) in customersData?.bookingFrequency || []"
            :key="freq.frequency"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-sm text-white font-bold">{{ freq.frequency }}</span>
              <span class="font-mono text-sm text-yellow-400 font-bold">{{ freq.count }} customers</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Geographic Distribution -->
      <UCard
        class="bg-black border-2 border-green-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-map-pin"
                class="w-4 h-4 text-green-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Geographic Distribution
              </h3>
              <p class="text-xs font-mono text-gray-500">
                Top locations
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(location, index) in customersData?.geographicDistribution || []"
            :key="location.city"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-green-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ location.city }}, {{ location.state }}</span>
              <span class="font-mono text-sm text-green-400 font-bold">{{ location.count }} customers</span>
            </div>
            <div class="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-500 rounded-full transition-all duration-1000"
                :style="{ width: `${(location.count / (customersData?.totalCustomers || 1)) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
