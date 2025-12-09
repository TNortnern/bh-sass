<script setup lang="ts">
import { format } from 'date-fns'

interface Props {
  showActions?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  compact: false
})

const { items, removeItem, getItemTotal, calculateDays, subtotal, deliveryFee, tax, total } = useCart()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

const formatTime = (time24: string): string => {
  if (!time24) return ''
  const parts = time24.split(':').map(Number)
  const hours = parts[0] ?? 0
  const minutes = parts[1] ?? 0
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-lucide-shopping-cart" class="w-5 h-5" />
        Cart Summary
      </h3>
    </div>

    <!-- Items -->
    <div v-if="items.length === 0" class="p-8 text-center">
      <UIcon name="i-lucide-shopping-cart" class="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Your cart is empty
      </p>
    </div>

    <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-4"
      >
        <div class="flex gap-3">
          <!-- Item Image -->
          <div v-if="!compact && item.itemImage" class="flex-shrink-0">
            <img
              :src="item.itemImage"
              :alt="item.itemName"
              class="w-16 h-16 rounded-lg object-cover"
            >
          </div>

          <!-- Item Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 dark:text-white truncate">
                  {{ item.itemName }}
                </h4>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                  <p class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-truck" class="w-3.5 h-3.5 text-green-600" />
                    <span>{{ formatDate(item.startDate) }}</span>
                    <span v-if="item.deliveryTime" class="text-gray-500">at {{ formatTime(item.deliveryTime) }}</span>
                  </p>
                  <p class="flex items-center gap-1.5">
                    <UIcon name="i-lucide-package-check" class="w-3.5 h-3.5 text-blue-600" />
                    <span>{{ formatDate(item.endDate) }}</span>
                    <span v-if="item.pickupTime" class="text-gray-500">at {{ formatTime(item.pickupTime) }}</span>
                  </p>
                  <span class="text-xs text-gray-500 dark:text-gray-500">
                    ({{ calculateDays(item.startDate, item.endDate) }} {{ calculateDays(item.startDate, item.endDate) === 1 ? 'day' : 'days' }})
                  </span>
                </div>

                <!-- Add-ons -->
                <div v-if="item.addOns.length > 0" class="mt-2">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Add-ons:
                  </p>
                  <ul class="space-y-0.5">
                    <li
                      v-for="addOn in item.addOns"
                      :key="addOn.id"
                      class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
                    >
                      <UIcon name="i-lucide-plus" class="w-3 h-3" />
                      {{ addOn.name }} (+{{ formatCurrency(addOn.price) }})
                    </li>
                  </ul>
                </div>

                <!-- Quantity -->
                <div v-if="item.quantity > 1" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Quantity: {{ item.quantity }}
                </div>
              </div>

              <!-- Remove Button -->
              <UButton
                v-if="showActions"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="xs"
                @click="removeItem(item.id)"
              />
            </div>

            <!-- Item Total -->
            <div class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(getItemTotal(item)) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Totals -->
    <div v-if="items.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <UIcon name="i-lucide-truck" class="w-4 h-4" />
          Delivery
        </span>
        <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(deliveryFee) }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Tax (8.25%)</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(tax) }}</span>
      </div>

      <div class="pt-2 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-gray-900 dark:text-white">Total</span>
          <span class="text-lg font-bold text-orange-600 dark:text-orange-500">{{ formatCurrency(total) }}</span>
        </div>
      </div>

      <!-- Deposit Info -->
      <div class="pt-2 text-xs text-gray-500 dark:text-gray-400">
        <p>A 50% deposit of {{ formatCurrency(total * 0.5) }} is required to confirm your booking.</p>
      </div>
    </div>
  </div>
</template>
