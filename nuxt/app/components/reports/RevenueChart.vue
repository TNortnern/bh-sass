<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  data: Array<{ date: string, amount: number }>
  previousData?: Array<{ date: string, amount: number }>
  loading?: boolean
}>()

const chartData = computed(() => {
  const datasets = [
    {
      label: 'Current Period',
      data: props.data.map(d => d.amount),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#06b6d4',
      pointHoverBorderColor: '#000',
      pointHoverBorderWidth: 2,
      tension: 0.4,
      fill: true
    }
  ]

  if (props.previousData) {
    datasets.push({
      label: 'Previous Period',
      data: props.previousData.map(d => d.amount),
      borderColor: '#6b7280',
      backgroundColor: 'rgba(107, 116, 128, 0.05)',
      borderWidth: 2,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      borderDash: [5, 5] as any,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#6b7280',
      pointHoverBorderColor: '#000',
      pointHoverBorderWidth: 2,
      tension: 0.4,
      fill: false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  }

  return {
    labels: props.data.map(d => d.date),
    datasets
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#9ca3af',
        font: {
          family: 'monospace',
          size: 11,
          weight: 'bold'
        },
        padding: 16,
        usePointStyle: true,
        pointStyle: 'line'
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
          const y = context.parsed.y ?? 0
          return `$${y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
        maxRotation: 0,
        autoSkip: true,
        autoSkipPadding: 20
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
        callback: (value) => {
          return '$' + (value as number).toLocaleString('en-US', { maximumFractionDigits: 0 })
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
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
      <Line
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
