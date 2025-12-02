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

const props = defineProps<{
  data: Array<{ name: string; revenue: number; bookings: number }>
  loading?: boolean
  metric?: 'revenue' | 'bookings'
}>()

const metric = computed(() => props.metric || 'revenue')

const sortedData = computed(() => {
  const sorted = [...props.data].sort((a, b) => b[metric.value] - a[metric.value])
  return sorted.slice(0, 10)
})

const chartData = computed(() => ({
  labels: sortedData.value.map(d => d.name),
  datasets: [
    {
      label: metric.value === 'revenue' ? 'Revenue' : 'Bookings',
      data: sortedData.value.map(d => d[metric.value]),
      backgroundColor: 'rgba(236, 72, 153, 0.8)',
      borderColor: '#ec4899',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#000',
      titleColor: '#ec4899',
      bodyColor: '#fff',
      borderColor: '#ec4899',
      borderWidth: 2,
      padding: 12,
      displayColors: false,
      titleFont: {
        family: 'monospace',
        size: 12,
        weight: 'bold'
      },
      bodyFont: {
        family: 'monospace',
        size: 14
      },
      callbacks: {
        label: (context) => {
          const dataItem = sortedData.value[context.dataIndex]
          if (metric.value === 'revenue') {
            return [
              `Revenue: $${context.parsed.x.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
              `Bookings: ${dataItem.bookings}`
            ]
          } else {
            return [
              `Bookings: ${context.parsed.x}`,
              `Revenue: $${dataItem.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            ]
          }
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(107, 116, 128, 0.1)',
        drawTicks: false
      },
      border: {
        color: '#374151',
        width: 2
      },
      ticks: {
        color: '#6b7280',
        font: {
          family: 'monospace',
          size: 10
        },
        padding: 8,
        callback: (value) => {
          if (metric.value === 'revenue') {
            return '$' + (value as number).toLocaleString('en-US', { maximumFractionDigits: 0 })
          }
          return value.toString()
        }
      }
    },
    y: {
      grid: {
        display: false
      },
      border: {
        color: '#374151',
        width: 2
      },
      ticks: {
        color: '#6b7280',
        font: {
          family: 'monospace',
          size: 11,
          weight: 'bold'
        },
        padding: 8
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  }
}
</script>

<template>
  <div class="relative">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
    >
      <div class="flex items-center gap-3 text-pink-400">
        <UIcon name="i-lucide-loader-circle" class="w-6 h-6 animate-spin" />
        <span class="font-mono text-sm">Loading chart data...</span>
      </div>
    </div>

    <!-- Chart container -->
    <div class="h-96">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
