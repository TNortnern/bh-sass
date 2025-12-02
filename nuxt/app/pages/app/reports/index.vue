<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { loading, dateRange, fetchRevenueReport, fetchBookingsReport, exportToCsv } = useReports()

const revenueData = ref<any>(null)
const bookingsData = ref<any>(null)

async function loadData() {
  loading.value = true
  try {
    const [revenue, bookings] = await Promise.all([
      fetchRevenueReport(dateRange.value),
      fetchBookingsReport(dateRange.value)
    ])
    revenueData.value = revenue
    bookingsData.value = bookings
  } catch (error) {
    console.error('Error loading report data:', error)
  } finally {
    loading.value = false
  }
}

function handleDateRangeChange() {
  loadData()
}

async function handleExport() {
  await exportToCsv('revenue', dateRange.value)
}

onMounted(() => {
  // Data will load after DateRangePicker initializes
  setTimeout(() => {
    if (dateRange.value.start && dateRange.value.end) {
      loadData()
    }
  }, 100)
})

const averageOrderValue = computed(() => {
  if (!revenueData.value || !bookingsData.value) return 0
  return revenueData.value.total / bookingsData.value.total
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center">
            <UIcon name="i-lucide-bar-chart-3" class="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
              REPORTS OVERVIEW
            </h1>
            <p class="text-gray-600 dark:text-gray-400 font-mono text-sm">
              Performance metrics and analytics
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
          class="font-mono bg-cyan-500 hover:bg-cyan-400 text-black"
          @click="handleExport"
        >
          Export CSV
        </UButton>
      </div>
    </div>

    <!-- Date Range Picker -->
    <UCard
      class="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <ReportsDateRangePicker
        v-model="dateRange"
        @change="handleDateRangeChange"
      />
    </UCard>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportsStatsCard
        label="Total Revenue"
        :value="revenueData ? `$${revenueData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        :trend="revenueData?.percentageChange"
        :previous-value="revenueData ? `$${revenueData.previousTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-dollar-sign"
        color="cyan"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Total Bookings"
        :value="bookingsData?.total || 0"
        :trend="bookingsData?.percentageChange"
        :previous-value="bookingsData?.previousTotal || 0"
        icon="i-lucide-calendar-check"
        color="magenta"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Avg Order Value"
        :value="averageOrderValue ? `$${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-trending-up"
        color="yellow"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Conversion Rate"
        :value="bookingsData ? `${bookingsData.conversionRate}%` : '0%'"
        icon="i-lucide-activity"
        color="green"
        :loading="loading"
      />
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <UCard
        class="bg-white dark:bg-black border-2 border-cyan-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                Revenue Trend
              </h3>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-500">Daily revenue over time</p>
            </div>
          </div>
        </template>

        <ReportsRevenueChart
          :data="revenueData?.byDay || []"
          :loading="loading"
        />
      </UCard>

      <!-- Bookings Chart -->
      <UCard
        class="bg-white dark:bg-black border-2 border-pink-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                Bookings by Status
              </h3>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-500">Distribution across statuses</p>
            </div>
          </div>
        </template>

        <ReportsBookingsChart
          :data="bookingsData?.byStatus || []"
          :loading="loading"
        />
      </UCard>
    </div>

    <!-- Top Items Chart -->
    <UCard
      class="bg-white dark:bg-black border-2 border-pink-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-box" class="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                Top Items by Revenue
              </h3>
              <p class="text-xs font-mono text-gray-500 dark:text-gray-500">Best performing inventory</p>
            </div>
          </div>
        </div>
      </template>

      <ReportsTopItemsChart
        :data="revenueData?.byItem || []"
        :loading="loading"
        metric="revenue"
      />
    </UCard>

    <!-- Busiest Days -->
    <UCard
      class="bg-white dark:bg-black border-2 border-yellow-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Busiest Days
            </h3>
            <p class="text-xs font-mono text-gray-500 dark:text-gray-500">Peak booking activity</p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(day, index) in bookingsData?.busiestDays || []"
          :key="day.day"
          class="p-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="text-sm font-mono text-gray-600 dark:text-gray-400 mb-2">
            {{ day.day }}
          </div>
          <div class="text-3xl font-mono font-bold text-yellow-400">
            {{ day.bookings }}
          </div>
          <div class="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">
            bookings
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
