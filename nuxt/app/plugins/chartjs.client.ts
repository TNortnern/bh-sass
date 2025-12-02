import { Chart, defaults } from 'chart.js'

export default defineNuxtPlugin(() => {
  // Set global defaults for Chart.js
  defaults.font.family = "'IBM Plex Mono', 'Courier New', monospace"
  defaults.color = '#6b7280' // gray-500
  defaults.borderColor = '#374151' // gray-700
  defaults.backgroundColor = 'rgba(0, 0, 0, 0.8)'

  // Enable animations globally
  defaults.animation = {
    duration: 1000,
    easing: 'easeInOutQuart'
  }

  // Responsive settings
  defaults.responsive = true
  defaults.maintainAspectRatio = false

  return {
    provide: {
      chart: Chart
    }
  }
})
