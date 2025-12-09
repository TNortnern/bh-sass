<script setup lang="ts">
import { format, addDays, isBefore, parse, isValid } from 'date-fns'

interface Props {
  modelValue?: {
    deliveryDate: string
    deliveryTime: string
    pickupDate: string
    pickupTime: string
  } | null
  unavailableDates?: string[]
  minLeadTimeHours?: number
  timezone?: string
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'valid', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  unavailableDates: () => [],
  minLeadTimeHours: 24,
  timezone: 'America/New_York'
})

const emit = defineEmits<Emits>()

// Internal state
const deliveryDate = ref('')
const deliveryTime = ref('')
const pickupDate = ref('')
const pickupTime = ref('')
const activeField = ref<'delivery' | 'pickup' | null>(null)

// Time options in AM/PM format
const timeOptions = computed(() => {
  const times = []
  for (let hour = 7; hour <= 20; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    const time24 = `${hour.toString().padStart(2, '0')}:00`
    times.push({
      label: `${displayHour}:00 ${period}`,
      value: time24
    })
    if (hour < 20) {
      times.push({
        label: `${displayHour}:30 ${period}`,
        value: `${hour.toString().padStart(2, '0')}:30`
      })
    }
  }
  return times
})

// Minimum date (respecting lead time)
const minDeliveryDate = computed(() => {
  const now = new Date()
  const minDate = addDays(now, Math.ceil(props.minLeadTimeHours / 24))
  return format(minDate, 'yyyy-MM-dd')
})

// Minimum pickup date (must be same day or after delivery)
const minPickupDate = computed(() => {
  if (!deliveryDate.value) return minDeliveryDate.value
  return deliveryDate.value
})

// Check if a date is unavailable
const _isDateUnavailable = (dateStr: string): boolean => {
  return props.unavailableDates.includes(dateStr)
}

// Format date for display with timezone
const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = parse(dateStr, 'yyyy-MM-dd', new Date())
  if (!isValid(date)) return ''
  return format(date, 'EEEE, MMMM d, yyyy')
}

// Format time for display
const formatDisplayTime = (time24: string): string => {
  if (!time24) return ''
  const parts = time24.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Get timezone abbreviation using native Intl API
const timezoneAbbr = computed(() => {
  try {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: props.timezone,
      timeZoneName: 'short'
    }).formatToParts(now)
    return parts.find(part => part.type === 'timeZoneName')?.value || 'EST'
  } catch {
    return 'EST'
  }
})

// Calculate rental duration
const rentalDuration = computed(() => {
  if (!deliveryDate.value || !pickupDate.value) return null
  const start = parse(deliveryDate.value, 'yyyy-MM-dd', new Date())
  const end = parse(pickupDate.value, 'yyyy-MM-dd', new Date())
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 0 ? 'Same day rental' : diffDays === 1 ? '1 day rental' : `${diffDays} day rental`
})

// Validation
const isFormValid = computed((): boolean => {
  return Boolean(deliveryDate.value && deliveryTime.value && pickupDate.value && pickupTime.value)
})

// Watch for changes and emit
watch([deliveryDate, deliveryTime, pickupDate, pickupTime], () => {
  if (isFormValid.value) {
    emit('update:modelValue', {
      deliveryDate: deliveryDate.value,
      deliveryTime: deliveryTime.value,
      pickupDate: pickupDate.value,
      pickupTime: pickupTime.value
    })
  }
  emit('valid', isFormValid.value)
}, { immediate: true })

// Initialize from modelValue
watch(() => props.modelValue, (value) => {
  if (value) {
    deliveryDate.value = value.deliveryDate || ''
    deliveryTime.value = value.deliveryTime || ''
    pickupDate.value = value.pickupDate || ''
    pickupTime.value = value.pickupTime || ''
  }
}, { immediate: true })

// Auto-set pickup date when delivery date changes
watch(deliveryDate, (newDate) => {
  if (newDate && (!pickupDate.value || isBefore(parse(pickupDate.value, 'yyyy-MM-dd', new Date()), parse(newDate, 'yyyy-MM-dd', new Date())))) {
    pickupDate.value = newDate
  }
})
</script>

<template>
  <div class="date-time-selector">
    <!-- Timezone Notice -->
    <div class="timezone-notice">
      <UIcon
        name="i-lucide-globe"
        class="w-4 h-4"
      />
      <span>All times shown in {{ timezoneAbbr }} ({{ timezone }})</span>
    </div>

    <div class="selector-grid">
      <!-- Delivery Section -->
      <div
        class="date-section"
        :class="{ 'is-active': activeField === 'delivery', 'is-complete': deliveryDate && deliveryTime }"
      >
        <div class="section-header">
          <div class="section-icon delivery-icon">
            <UIcon
              name="i-lucide-truck"
              class="w-5 h-5"
            />
          </div>
          <div class="section-title">
            <h3>Delivery</h3>
            <p>When should we deliver?</p>
          </div>
          <div
            v-if="deliveryDate && deliveryTime"
            class="check-badge"
          >
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4"
            />
          </div>
        </div>

        <div class="input-row">
          <div class="input-group date-input">
            <label>Date</label>
            <UInput
              v-model="deliveryDate"
              type="date"
              :min="minDeliveryDate"
              size="lg"
              class="w-full"
              @focus="activeField = 'delivery'"
              @blur="activeField = null"
            />
            <span
              v-if="deliveryDate"
              class="date-preview"
            >
              {{ formatDisplayDate(deliveryDate) }}
            </span>
          </div>

          <div class="input-group time-input">
            <label>Time</label>
            <USelect
              v-model="deliveryTime"
              :items="timeOptions"
              placeholder="Select time"
              size="lg"
              class="w-full"
              @focus="activeField = 'delivery'"
              @blur="activeField = null"
            />
          </div>
        </div>
      </div>

      <!-- Visual Connector -->
      <div class="connector">
        <div class="connector-line" />
        <div
          v-if="rentalDuration"
          class="duration-badge"
        >
          <UIcon
            name="i-lucide-calendar-range"
            class="w-4 h-4"
          />
          <span>{{ rentalDuration }}</span>
        </div>
        <div class="connector-line" />
      </div>

      <!-- Pickup Section -->
      <div
        class="date-section"
        :class="{ 'is-active': activeField === 'pickup', 'is-complete': pickupDate && pickupTime }"
      >
        <div class="section-header">
          <div class="section-icon pickup-icon">
            <UIcon
              name="i-lucide-package-check"
              class="w-5 h-5"
            />
          </div>
          <div class="section-title">
            <h3>Pickup</h3>
            <p>When should we pick up?</p>
          </div>
          <div
            v-if="pickupDate && pickupTime"
            class="check-badge"
          >
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4"
            />
          </div>
        </div>

        <div class="input-row">
          <div class="input-group date-input">
            <label>Date</label>
            <UInput
              v-model="pickupDate"
              type="date"
              :min="minPickupDate"
              size="lg"
              class="w-full"
              :disabled="!deliveryDate"
              @focus="activeField = 'pickup'"
              @blur="activeField = null"
            />
            <span
              v-if="pickupDate"
              class="date-preview"
            >
              {{ formatDisplayDate(pickupDate) }}
            </span>
          </div>

          <div class="input-group time-input">
            <label>Time</label>
            <USelect
              v-model="pickupTime"
              :items="timeOptions"
              placeholder="Select time"
              size="lg"
              class="w-full"
              :disabled="!deliveryDate"
              @focus="activeField = 'pickup'"
              @blur="activeField = null"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <Transition name="fade-slide">
      <div
        v-if="isFormValid"
        class="booking-summary"
      >
        <div class="summary-content">
          <UIcon
            name="i-lucide-sparkles"
            class="w-5 h-5 text-amber-500"
          />
          <div class="summary-text">
            <strong>{{ formatDisplayDate(deliveryDate) }}</strong>
            <span class="text-gray-500 dark:text-gray-400">at</span>
            <strong>{{ formatDisplayTime(deliveryTime) }}</strong>
            <span class="text-gray-500 dark:text-gray-400">→</span>
            <strong>{{ formatDisplayDate(pickupDate) }}</strong>
            <span class="text-gray-500 dark:text-gray-400">at</span>
            <strong>{{ formatDisplayTime(pickupTime) }}</strong>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.date-time-selector {
  --accent-coral: #FF6B6B;
  --accent-amber: #FFB347;
  --accent-gradient: linear-gradient(135deg, var(--accent-coral) 0%, var(--accent-amber) 100%);
}

.timezone-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #b45309;
  margin-bottom: 1.5rem;
}

.dark .timezone-notice {
  background: rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.selector-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-section {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .date-section {
  background: #1f2937;
  border-color: #374151;
}

.date-section.is-active {
  border-color: var(--accent-coral);
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.1);
}

.date-section.is-complete {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.dark .date-section.is-complete {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.delivery-icon {
  background: var(--accent-gradient);
}

.pickup-icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.section-title {
  flex: 1;
}

.section-title h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dark .section-title h3 {
  color: white;
}

.section-title p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.check-badge {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes pop-in {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .input-row {
    grid-template-columns: 1fr;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.dark .input-group label {
  color: #9ca3af;
}

.date-preview {
  font-size: 0.75rem;
  color: #10b981;
  margin-top: 0.25rem;
}

.connector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.connector-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%);
}

.dark .connector-line {
  background: linear-gradient(90deg, transparent 0%, #374151 20%, #374151 80%, transparent 100%);
}

.duration-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
  white-space: nowrap;
}

.dark .duration-badge {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
  color: #fbbf24;
}

.booking-summary {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.1) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.75rem;
}

.summary-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.summary-text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.summary-text strong {
  color: #065f46;
}

.dark .summary-text strong {
  color: #34d399;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
