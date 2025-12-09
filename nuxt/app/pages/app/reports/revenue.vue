<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { loading, dateRange, fetchRevenueReport, exportToCsv } = useReports()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revenueData = ref<any>(null)

async function loadData() {
  revenueData.value = await fetchRevenueReport(dateRange.value)
}

function handleDateRangeChange() {
  loadData()
}

async function handleExport() {
  await exportToCsv('revenue', dateRange.value)
}

onMounted(() => {
  setTimeout(() => {
    if (dateRange.value.start && dateRange.value.end) {
      loadData()
    }
  }, 100)
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
            class="w-10 h-10 rounded-lg bg-gray-900 border-2 border-gray-800 hover:border-cyan-500 flex items-center justify-center transition-all"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="w-5 h-5 text-gray-400"
            />
          </NuxtLink>
          <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <UIcon
              name="i-lucide-dollar-sign"
              class="w-6 h-6 text-black"
            />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white font-mono tracking-tight">
              REVENUE REPORT
            </h1>
            <p class="text-gray-400 font-mono text-sm">
              Detailed revenue breakdown and analysis
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
      class="bg-black border-2 border-gray-800"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <ReportsDateRangePicker
        v-model="dateRange"
        @change="handleDateRangeChange"
      />
    </UCard>

    <!-- Revenue Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ReportsStatsCard
        label="Gross Revenue"
        :value="revenueData ? `$${revenueData.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        :trend="revenueData?.percentageChange"
        icon="i-lucide-dollar-sign"
        color="cyan"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Platform Fees"
        :value="revenueData ? `$${revenueData.platformFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-credit-card"
        color="yellow"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Refunds"
        :value="revenueData ? `$${revenueData.refunds.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-trending-down"
        color="magenta"
        :loading="loading"
      />

      <ReportsStatsCard
        label="Net Revenue"
        :value="revenueData ? `$${revenueData.netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'"
        icon="i-lucide-activity"
        color="green"
        :loading="loading"
      />
    </div>

    <!-- Revenue Trend Chart -->
    <UCard
      class="bg-black border-2 border-cyan-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-trending-up"
              class="w-4 h-4 text-cyan-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Revenue Trend
            </h3>
            <p class="text-xs font-mono text-gray-500">
              Daily revenue breakdown
            </p>
          </div>
        </div>
      </template>

      <ReportsRevenueChart
        :data="revenueData?.byDay || []"
        :loading="loading"
      />
    </UCard>

    <!-- Revenue Breakdown Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- By Item Category -->
      <UCard
        class="bg-black border-2 border-pink-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-pink-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-box"
                class="w-4 h-4 text-pink-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                Revenue by Item
              </h3>
              <p class="text-xs font-mono text-gray-500">
                Top performing items
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(item, index) in revenueData?.byItem || []"
            :key="item.name"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-pink-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ item.name }}</span>
              <span class="font-mono text-sm text-pink-400 font-bold">
                ${{ item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs font-mono text-gray-500">
              <span>{{ item.bookings }} bookings</span>
              <span>${{ (item.revenue / item.bookings).toFixed(2) }} avg</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- By Payment Method -->
      <UCard
        class="bg-black border-2 border-yellow-500/30"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-credit-card"
                class="w-4 h-4 text-yellow-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
                By Payment Method
              </h3>
              <p class="text-xs font-mono text-gray-500">
                Payment breakdown
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="(method, index) in revenueData?.byPaymentMethod || []"
            :key="method.method"
            class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg hover:border-yellow-500/50 transition-all"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-mono text-sm text-white font-bold">{{ method.method }}</span>
              <span class="font-mono text-sm text-yellow-400 font-bold">
                ${{ method.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs font-mono text-gray-500">
              <span>{{ method.count }} transactions</span>
              <span>${{ (method.amount / method.count).toFixed(2) }} avg</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Top Customers -->
    <UCard
      class="bg-black border-2 border-cyan-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-users"
              class="w-4 h-4 text-cyan-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Top Customers by Revenue
            </h3>
            <p class="text-xs font-mono text-gray-500">
              Best customers
            </p>
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full font-mono text-sm">
          <thead>
            <tr class="border-b-2 border-gray-800">
              <th class="text-left py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Customer
              </th>
              <th class="text-left py-3 px-4 text-cyan-400 font-bold uppercase text-xs">
                Email
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
              v-for="(customer, index) in revenueData?.byCustomer || []"
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
              <td class="py-3 px-4 text-right text-cyan-400 font-bold">
                ${{ customer.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Refunds Breakdown -->
    <UCard
      class="bg-black border-2 border-red-500/30"
      :ui="{ body: { padding: 'p-6' } }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-trending-down"
              class="w-4 h-4 text-red-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-mono font-bold text-white uppercase tracking-wide">
              Refunds Analysis
            </h3>
            <p class="text-xs font-mono text-gray-500">
              Refund reasons and totals
            </p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 bg-gray-900 border-2 border-gray-800 rounded-lg">
            <div class="text-xs font-mono text-gray-400 mb-2">
              Total Refunded
            </div>
            <div class="text-3xl font-mono font-bold text-red-400">
              ${{ revenueData?.refunds.total.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00' }}
            </div>
            <div class="text-xs font-mono text-gray-500 mt-1">
              {{ revenueData?.refunds.count || 0 }} refunds
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(reason, index) in revenueData?.refunds.reasons || []"
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
</template>
