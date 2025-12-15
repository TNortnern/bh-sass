<template>
  <UCard
    class="customer-card group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm ring-1 ring-slate-700/50 hover:ring-amber-500/50 rounded-xl"
    @click="handleClick"
  >
    <div class="flex items-start gap-5 p-6 sm:p-7">
      <!-- Avatar -->
      <div class="relative shrink-0">
        <UAvatar
          :src="customer.avatar"
          :alt="`${customer.firstName} ${customer.lastName}`"
          size="xl"
          class="bg-gradient-to-br from-amber-500 to-orange-600"
          :ui="{
            fallback: 'text-white font-semibold text-lg'
          }"
        >
          {{ initials }}
        </UAvatar>

        <!-- VIP Badge -->
        <div
          v-if="customer.tags.includes('VIP')"
          class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center ring-2 ring-slate-800 shadow-lg animate-pulse-slow"
        >
          <UIcon
            name="i-lucide-star"
            class="w-3 h-3 text-white"
          />
        </div>
      </div>

      <!-- Customer Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="min-w-0 flex-1">
            <h3 class="text-xl font-semibold text-slate-50 mb-1 truncate group-hover:text-amber-400 transition-colors">
              {{ customer.firstName }} {{ customer.lastName }}
            </h3>
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2 text-sm text-slate-400">
                <UIcon
                  name="i-lucide-mail"
                  class="w-4 h-4 shrink-0"
                />
                <span class="truncate">{{ customer.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-400">
                <UIcon
                  name="i-lucide-phone"
                  class="w-4 h-4 shrink-0"
                />
                <span>{{ customer.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats Badge -->
          <div class="flex flex-col items-end gap-1 shrink-0">
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Spent
            </div>
            <div class="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {{ formatCurrency(customer.totalSpent) }}
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div
          v-if="customer.tags.length > 0"
          class="flex flex-wrap gap-2 mb-4"
        >
          <UBadge
            v-for="tag in customer.tags.slice(0, 3)"
            :key="tag"
            :color="getTagColor(tag)"
            variant="subtle"
            size="xs"
            class="rounded-full font-medium tracking-wide"
          >
            {{ tag }}
          </UBadge>
          <UBadge
            v-if="customer.tags.length > 3"
            color="neutral"
            variant="subtle"
            size="xs"
            class="rounded-full"
          >
            +{{ customer.tags.length - 3 }}
          </UBadge>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div class="text-center">
            <div class="text-2xl font-bold text-slate-200 mb-1">
              {{ customer.bookings.total }}
            </div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">
              Bookings
            </div>
          </div>

          <div class="text-center border-x border-slate-700/50">
            <div class="text-2xl font-bold text-slate-200 mb-1">
              {{ formatCurrency(customer.averageOrder) }}
            </div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">
              Avg Order
            </div>
          </div>

          <div class="text-center">
            <div class="text-sm font-medium text-slate-300 mb-1">
              {{ formatRelativeDate(customer.lastBooking) }}
            </div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">
              Last Booking
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hover Arrow -->
    <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
      <UIcon
        name="i-lucide-arrow-right"
        class="w-5 h-5 text-amber-500"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

const props = defineProps<{
  customer: Customer
}>()

const emit = defineEmits<{
  click: [customer: Customer]
}>()

const initials = computed(() => {
  return `${props.customer.firstName.charAt(0)}${props.customer.lastName.charAt(0)}`.toUpperCase()
})

function handleClick() {
  emit('click', props.customer)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatRelativeDate(date?: string): string {
  if (!date) return 'Never'

  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

function getTagColor(tag: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    'VIP': 'warning',
    'Birthday Party': 'error',
    'Corporate': 'info',
    'Repeat Customer': 'success',
    'New': 'primary',
    'High Value': 'secondary',
    'Referral': 'info',
    'Email List': 'success',
    'SMS List': 'warning'
  }
  return colors[tag] || 'neutral'
}
</script>

<style scoped>
.customer-card {
  position: relative;
  overflow: hidden;
}

.customer-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(251 191 36 / 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.customer-card:hover::before {
  opacity: 1;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
