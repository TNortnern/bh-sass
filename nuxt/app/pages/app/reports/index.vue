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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Performance metrics and analytics
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-cw"
          :loading="loading"
          @click="loadData"
        >
          Refresh
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-download"
          @click="handleExport"
        >
          Export CSV
        </UButton>
      </div>
    </div>

    <!-- Date Range Picker -->
    <UCard class="bg-white dark:bg-gray-900">
      <ReportsDateRangePicker
        v-model="dateRange"
        @change="handleDateRangeChange"
      />
    </UCard>

    <!-- Report Type Navigation -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        to="/app/reports/revenue"
        class="group p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 dark:from-cyan-500/20 dark:to-cyan-600/10 border-2 border-cyan-500/20 dark:border-cyan-500/30 hover:border-cyan-500/50 dark:hover:border-cyan-500/60 rounded-lg transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 flex items-center justify-center transition-colors">
            <UIcon name="i-lucide-dollar-sign" class="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Revenue breakdown, top customers, and payment methods
        </p>
      </NuxtLink>

      <NuxtLink
        to="/app/reports/bookings"
        class="group p-6 bg-gradient-to-br from-pink-500/10 to-pink-600/5 dark:from-pink-500/20 dark:to-pink-600/10 border-2 border-pink-500/20 dark:border-pink-500/30 hover:border-pink-500/50 dark:hover:border-pink-500/60 rounded-lg transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-pink-500/20 group-hover:bg-pink-500/30 flex items-center justify-center transition-colors">
            <UIcon name="i-lucide-calendar-check" class="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bookings</h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Booking trends, cancellation rates, and busy periods
        </p>
      </NuxtLink>

      <NuxtLink
        to="/app/reports/inventory"
        class="group p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/20 dark:to-emerald-600/10 border-2 border-emerald-500/20 dark:border-emerald-500/30 hover:border-emerald-500/50 dark:hover:border-emerald-500/60 rounded-lg transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center transition-colors">
            <UIcon name="i-lucide-box" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Inventory</h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Utilization rates, top performers, and maintenance
        </p>
      </NuxtLink>

      <NuxtLink
        to="/app/reports/customers"
        class="group p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-600/10 border-2 border-purple-500/20 dark:border-purple-500/30 hover:border-purple-500/50 dark:hover:border-purple-500/60 rounded-lg transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center transition-colors">
            <UIcon name="i-lucide-users" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Customers</h3>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Customer behavior, lifetime value, and acquisition
        </p>
      </NuxtLink>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportsStatsCard
        label="Total Revenue"
        :value="revenueData ? `$${revenueData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        :trend="revenueData?.percentageChange"
        :previous-value="revenueData ? `$${revenueData.previousTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-dollar-sign"
        color="primary"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Total Bookings"
        :value="bookingsData?.total || 0"
        :trend="bookingsData?.percentageChange"
        :previous-value="bookingsData?.previousTotal || 0"
        icon="i-lucide-calendar-check"
        color="success"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Avg Order Value"
        :value="averageOrderValue ? `$${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-trending-up"
        color="warning"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Conversion Rate"
        :value="bookingsData ? `${bookingsData.conversionRate}%` : '0%'"
        icon="i-lucide-activity"
        color="info"
        :loading="loading"
      />
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <UCard class="bg-white dark:bg-gray-900">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <UIcon name="i-lucide-trending-up" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Trend
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Daily revenue over time</p>
            </div>
          </div>
        </template>

        <ReportsRevenueChart
          :data="revenueData?.byDay || []"
          :loading="loading"
        />
      </UCard>

      <!-- Bookings Chart -->
      <UCard class="bg-white dark:bg-gray-900">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <UIcon name="i-lucide-calendar" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Bookings by Status
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Distribution across statuses</p>
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
    <UCard class="bg-white dark:bg-gray-900">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <UIcon name="i-lucide-box" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Top Items by Revenue
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Best performing inventory</p>
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
    <UCard class="bg-white dark:bg-gray-900">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-clock" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Busiest Days
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Peak booking activity</p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="day in bookingsData?.busiestDays || []"
          :key="day.day"
          class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ day.day }}
          </div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ day.bookings }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            bookings
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
