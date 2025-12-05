<script setup lang="ts">
definePageMeta({
  layout: false, // No layout wrapper
  middleware: [] // Skip all middleware for this page
})

// Fetch platform settings from public endpoint
const { data: settings } = await useFetch<{
  maintenanceMode?: {
    enabled: boolean
    message?: string
    endTime?: string
    isIPAllowed?: boolean
  }
}>('/api/platform-settings/public', {
  credentials: 'include'
})

const maintenanceMessage = computed(() =>
  settings.value?.maintenanceMode?.message ||
  'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!'
)

const maintenanceEndTime = computed(() => settings.value?.maintenanceMode?.endTime)

// Countdown timer
const timeRemaining = ref('')
const updateCountdown = () => {
  if (!maintenanceEndTime.value) {
    timeRemaining.value = ''
    return
  }

  const now = new Date().getTime()
  const end = new Date(maintenanceEndTime.value).getTime()
  const distance = end - now

  if (distance < 0) {
    timeRemaining.value = 'Maintenance should be complete. Please refresh the page.'
    return
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  timeRemaining.value = parts.join(' ')
}

// Update countdown every second
let interval: NodeJS.Timeout | null = null
onMounted(() => {
  if (maintenanceEndTime.value) {
    updateCountdown()
    interval = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// Refresh page function
const refreshPage = () => {
  window.location.reload()
}
</script>

<template>
  <div class="maintenance-page">
    <!-- Background Elements -->
    <div class="bg-grid" />
    <div class="bg-gradient" />

    <!-- Content -->
    <div class="content">
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <UIcon name="i-lucide-construction" class="size-10" />
        </div>
        <h1 class="logo-text">BouncePro</h1>
      </div>

      <!-- Status Badge -->
      <div class="status-badge">
        <div class="status-dot" />
        <span>Under Maintenance</span>
      </div>

      <!-- Main Message -->
      <div class="message-box">
        <UIcon name="i-lucide-wrench" class="message-icon" />
        <h2 class="message-title">We'll Be Right Back</h2>
        <p class="message-text">{{ maintenanceMessage }}</p>
      </div>

      <!-- Countdown Timer -->
      <div v-if="timeRemaining" class="countdown">
        <div class="countdown-label">Expected completion in:</div>
        <div class="countdown-timer">{{ timeRemaining }}</div>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <UButton
          icon="i-lucide-refresh-cw"
          label="Refresh Page"
          size="lg"
          @click="refreshPage"
        />
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          Need immediate assistance? Contact our support team at
          <a href="mailto:support@bouncepro.com" class="footer-link">support@bouncepro.com</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Maintenance Page - Modern Dark Design */

.maintenance-page {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Background Elements */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(245, 158, 11, 0.1) 0%,
    transparent 50%
  );
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Content */
.content {
  position: relative;
  z-index: 10;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

/* Logo */
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 999px;
  color: #fbbf24;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Message Box */
.message-box {
  background: rgba(23, 23, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
}

.message-icon {
  font-size: 3rem;
  color: #fbbf24;
  margin-bottom: 1rem;
}

.message-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.message-text {
  font-size: 1rem;
  color: #a3a3a3;
  line-height: 1.6;
  margin: 0;
}

/* Countdown Timer */
.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.countdown-label {
  font-size: 0.875rem;
  color: #737373;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.countdown-timer {
  font-size: 2rem;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
}

/* Footer */
.footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-text {
  font-size: 0.875rem;
  color: #737373;
  margin: 0;
}

.footer-link {
  color: #fbbf24;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #f59e0b;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .maintenance-page {
    padding: 1.5rem;
  }

  .logo-icon {
    width: 64px;
    height: 64px;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .message-box {
    padding: 2rem 1.5rem;
  }

  .message-icon {
    font-size: 2.5rem;
  }

  .message-title {
    font-size: 1.5rem;
  }

  .message-text {
    font-size: 0.9375rem;
  }

  .countdown-timer {
    font-size: 1.5rem;
  }
}
</style>
