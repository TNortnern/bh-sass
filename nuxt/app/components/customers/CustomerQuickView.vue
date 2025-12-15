<template>
  <USlideover
    v-model:open="isOpen"
    class="bg-slate-900 max-w-2xl"
  >
    <template #content>
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="sticky top-0 z-10 px-8 py-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900/95 border-b border-slate-800/50">
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <UAvatar
                :src="customer?.avatar"
                :alt="`${customer?.firstName} ${customer?.lastName}`"
                size="2xl"
                class="bg-gradient-to-br from-amber-500 to-orange-600"
                :ui="{
                  fallback: 'text-white font-semibold text-2xl'
                }"
              >
                {{ initials }}
              </UAvatar>

              <div class="flex-1 min-w-0">
                <h2 class="text-3xl font-bold text-slate-50 mb-2 tracking-tight">
                  {{ customer?.firstName }} {{ customer?.lastName }}
                </h2>

                <div class="flex flex-col gap-2">
                  <a
                    :href="`mailto:${customer?.email}`"
                    class="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors group"
                  >
                    <UIcon
                      name="i-lucide-mail"
                      class="w-4 h-4"
                    />
                    <span class="text-sm group-hover:underline">{{ customer?.email }}</span>
                  </a>
                  <a
                    :href="`tel:${customer?.phone}`"
                    class="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors group"
                  >
                    <UIcon
                      name="i-lucide-phone"
                      class="w-4 h-4"
                    />
                    <span class="text-sm group-hover:underline">{{ customer?.phone }}</span>
                  </a>
                </div>
              </div>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              size="lg"
              square
              @click="close"
            />
          </div>

          <!-- Tags -->
          <div
            v-if="customer?.tags && customer.tags.length > 0"
            class="flex flex-wrap gap-2"
          >
            <UBadge
              v-for="tag in customer.tags"
              :key="tag"
              :color="getTagColor(tag)"
              variant="subtle"
              class="rounded-full font-medium tracking-wide"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-8 py-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <UCard
              class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
              :ui="{
              }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Total Spent
                  </div>
                  <div class="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    {{ formatCurrency(customer?.totalSpent || 0) }}
                  </div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-dollar-sign"
                    class="w-6 h-6 text-amber-500"
                  />
                </div>
              </div>
            </UCard>

            <UCard
              class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
              :ui="{
              }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Total Bookings
                  </div>
                  <div class="text-3xl font-bold text-slate-200">
                    {{ customer?.bookings.total || 0 }}
                  </div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-calendar"
                    class="w-6 h-6 text-blue-500"
                  />
                </div>
              </div>
            </UCard>

            <UCard
              class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
              :ui="{
              }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Average Order
                  </div>
                  <div class="text-3xl font-bold text-slate-200">
                    {{ formatCurrency(customer?.averageOrder || 0) }}
                  </div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="w-6 h-6 text-green-500"
                  />
                </div>
              </div>
            </UCard>

            <UCard
              class="bg-gradient-to-br from-slate-800/60 to-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
              :ui="{
              }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Last Booking
                  </div>
                  <div class="text-lg font-semibold text-slate-200">
                    {{ formatRelativeDate(customer?.lastBooking) }}
                  </div>
                </div>
                <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-clock"
                    class="w-6 h-6 text-purple-500"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Recent Bookings -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-calendar-days"
                class="w-5 h-5 text-amber-500"
              />
              Recent Bookings
            </h3>

            <UCard
              class="bg-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
              :ui="{
              }"
            >
              <div class="divide-y divide-slate-700/50">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="p-5 hover:bg-slate-700/20 transition-colors"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h4 class="text-sm font-semibold text-slate-200">
                          Birthday Party - Premium Bounce House
                        </h4>
                        <UBadge
                          color="success"
                          variant="subtle"
                          size="xs"
                        >
                          Completed
                        </UBadge>
                      </div>
                      <div class="text-xs text-slate-400">
                        {{ formatDate(new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-bold text-amber-400">
                        ${{ (Math.random() * 400 + 100).toFixed(0) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Notes -->
          <div
            v-if="customer?.notes && customer.notes.length > 0"
            class="mb-8"
          >
            <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <UIcon
                name="i-lucide-file-text"
                class="w-5 h-5 text-amber-500"
              />
              Notes
            </h3>

            <div class="space-y-3">
              <UCard
                v-for="note in customer.notes.slice(0, 3)"
                :key="note.id"
                class="bg-slate-800/40 ring-1 ring-slate-700/50 rounded-xl"
                :ui="{
                }"
              >
                <p class="text-sm text-slate-300 mb-2">
                  {{ note.content }}
                </p>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span>{{ note.createdBy }}</span>
                  <span>•</span>
                  <span>{{ formatRelativeDate(note.createdAt) }}</span>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="sticky bottom-0 px-8 py-6 bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/95 border-t border-slate-800/50">
          <div class="flex gap-3">
            <UButton
              color="primary"
              size="lg"
              block
              class="rounded-xl"
              @click="navigateToDetail"
            >
              <UIcon
                name="i-lucide-arrow-right"
                class="w-5 h-5 mr-2"
              />
              View Full Profile
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="rounded-xl"
              @click="handleEdit"
            >
              <UIcon
                name="i-lucide-pencil"
                class="w-5 h-5"
              />
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              class="rounded-xl"
              @click="handleEmail"
            >
              <UIcon
                name="i-lucide-mail"
                class="w-5 h-5"
              />
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

const props = defineProps<{
  modelValue: boolean
  customer: Customer | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'edit': [customer: Customer]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const initials = computed(() => {
  if (!props.customer) return ''
  return `${props.customer.firstName.charAt(0)}${props.customer.lastName.charAt(0)}`.toUpperCase()
})

function close() {
  isOpen.value = false
}

function navigateToDetail() {
  if (props.customer) {
    navigateTo(`/app/customers/${props.customer.id}`)
    close()
  }
}

function handleEdit() {
  if (props.customer) {
    emit('edit', props.customer)
    close()
  }
}

function handleEmail() {
  if (props.customer) {
    window.location.href = `mailto:${props.customer.email}`
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
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
