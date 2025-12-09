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
  data: Array<{ status: string, count: number, value: number }>
  loading?: boolean
}>()

const statusColors: Record<string, { bg: string, border: string }> = {
  Confirmed: { bg: 'rgba(6, 182, 212, 0.8)', border: '#06b6d4' },
  Completed: { bg: 'rgba(16, 185, 129, 0.8)', border: '#10b981' },
  Pending: { bg: 'rgba(234, 179, 8, 0.8)', border: '#eab308' },
  Cancelled: { bg: 'rgba(239, 68, 68, 0.8)', border: '#ef4444' }
}

const chartData = computed(() => ({
  labels: props.data.map(d => d.status),
  datasets: [
    {
      label: 'Bookings',
      data: props.data.map(d => d.count),
      backgroundColor: props.data.map(d => statusColors[d.status]?.bg || 'rgba(107, 116, 128, 0.8)'),
      borderColor: props.data.map(d => statusColors[d.status]?.border || '#6b7280'),
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false
    }
  ]
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#000',
      titleColor: '#06b6d4',
      bodyColor: '#fff',
      borderColor: '#06b6d4',
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
          const dataItem = props.data[context.dataIndex]
          if (!dataItem) return ''
          return [
            `Count: ${context.parsed.y}`,
            `Value: $${dataItem.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          ]
        }
      }
    }
  },
  scales: {
    x: {
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
    },
    y: {
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
        stepSize: 50
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
      <div class="flex items-center gap-3 text-cyan-400">
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 animate-spin"
        />
        <span class="font-mono text-sm">Loading chart data...</span>
      </div>
    </div>

    <!-- Chart container -->
    <div class="h-80">
      <Bar
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
