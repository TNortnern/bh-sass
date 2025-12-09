<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06] gap-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
          Booking Settings
        </h2>
        <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888]">
          Configure rental policies and requirements
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        :loading="saving"
        :disabled="!hasUnsavedChanges"
        class="bg-gradient-to-br from-amber-400 to-amber-600 border-none text-gray-900 font-semibold tracking-tight transition-all hover:not(:disabled):-translate-y-px hover:not(:disabled):shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
        @click="saveSettings"
      >
        Save Changes
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]"
    >
      <div class="w-8 h-8 border-3 border-amber-200 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
      <p>Loading settings...</p>
    </div>

    <div
      v-else-if="booking"
      class="flex flex-col gap-6"
    >
      <!-- Booking Requirements -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-clock"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-[1.125rem] font-semibold tracking-tight text-gray-900 dark:text-white mb-1">
                Booking Requirements
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Lead time and advance booking limits
              </p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup
            label="Minimum Lead Time"
            help="Minimum hours before rental date"
            required
            class="flex flex-col gap-2"
          >
            <div class="relative flex items-center">
              <UInput
                v-model.number="booking.leadTime"
                type="number"
                size="lg"
                min="0"
                step="1"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="absolute right-4 text-gray-500 dark:text-[#666] text-[0.9375rem] font-medium pointer-events-none [font-variant-numeric:tabular-nums]">hours</span>
            </div>
          </UFormGroup>

          <UFormGroup
            label="Maximum Advance Booking"
            help="How far in advance customers can book"
            required
            class="flex flex-col gap-2"
          >
            <div class="relative flex items-center">
              <UInput
                v-model.number="booking.maxAdvanceBooking"
                type="number"
                size="lg"
                min="1"
                step="1"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="absolute right-4 text-gray-500 dark:text-[#666] text-[0.9375rem] font-medium pointer-events-none [font-variant-numeric:tabular-nums]">days</span>
            </div>
          </UFormGroup>

          <UFormGroup
            label="Buffer Time Between Rentals"
            help="Time needed between bookings for setup/cleanup"
            required
            class="flex flex-col gap-2"
          >
            <div class="relative flex items-center">
              <UInput
                v-model.number="booking.bufferTime"
                type="number"
                size="lg"
                min="0"
                step="15"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="absolute right-4 text-gray-500 dark:text-[#666] text-[0.9375rem] font-medium pointer-events-none [font-variant-numeric:tabular-nums]">minutes</span>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Payment & Deposits -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-currency-dollar"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-[1.125rem] font-semibold tracking-tight text-gray-900 dark:text-white mb-1">
                Payment & Deposits
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Deposit requirements and payment terms
              </p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup
            label="Deposit Percentage"
            help="Percentage of total required as deposit"
            required
            class="flex flex-col gap-2"
          >
            <div class="flex items-center gap-6 mt-2">
              <input
                v-model.number="booking.depositPercentage"
                type="range"
                min="0"
                max="100"
                step="5"
                class="flex-1 h-2 bg-gray-200 dark:bg-white/[0.05] rounded-2xl outline-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-[#0a0a0a] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(251,191,36,0.3)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:hover:shadow-[0_4px_12px_rgba(251,191,36,0.5)] [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-amber-600 [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-[#0a0a0a] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(251,191,36,0.3)] [&::-moz-range-thumb]:transition-all"
                @input="markHasChanges"
              >
              <div class="flex items-baseline gap-1 min-w-[80px] py-2 px-4 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg justify-center">
                <span class="text-2xl font-bold text-amber-600 dark:text-amber-400 [font-variant-numeric:tabular-nums]">{{ booking.depositPercentage }}</span>
                <span class="text-base font-semibold text-amber-600/70 dark:text-amber-400/70">%</span>
              </div>
            </div>
            <div class="flex flex-col md:flex-row gap-3 md:gap-6 mt-3 p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] rounded-lg">
              <div class="flex flex-col gap-1">
                <span class="text-[0.8125rem] text-gray-500 dark:text-[#666]">$100 rental:</span>
                <span class="text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5] [font-variant-numeric:tabular-nums]">${{ (100 * booking.depositPercentage / 100).toFixed(2) }} deposit</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[0.8125rem] text-gray-500 dark:text-[#666]">$500 rental:</span>
                <span class="text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5] [font-variant-numeric:tabular-nums]">${{ (500 * booking.depositPercentage / 100).toFixed(2) }} deposit</span>
              </div>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Cancellation Policy -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-x-circle"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-[1.125rem] font-semibold tracking-tight text-gray-900 dark:text-white mb-1">
                Cancellation Policy
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Refund terms for cancelled bookings
              </p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <div class="flex flex-col gap-4">
            <div
              v-for="policy in cancellationPolicies"
              :key="policy.value"
              class="p-5 bg-gray-50 dark:bg-white/[0.02] border-2 rounded-xl cursor-pointer transition-all"
              :class="booking.cancellationPolicy === policy.value ? 'border-amber-300 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/[0.08] shadow-[0_0_0_3px_rgba(251,191,36,0.1)]' : 'border-gray-200 dark:border-white/[0.06] hover:border-amber-200 hover:dark:border-amber-500/30 hover:bg-amber-50 hover:dark:bg-amber-500/[0.03]'"
              @click="selectPolicy(policy.value)"
            >
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-5 h-5 border-2 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  :class="booking.cancellationPolicy === policy.value ? 'border-amber-600 dark:border-amber-400' : 'border-gray-300 dark:border-white/20'"
                >
                  <div
                    v-if="booking.cancellationPolicy === policy.value"
                    class="w-2.5 h-2.5 bg-amber-600 dark:bg-amber-400 rounded-full"
                  />
                </div>
                <div>
                  <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {{ policy.name }}
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888]">
                    {{ policy.description }}
                  </p>
                </div>
              </div>
              <ul class="m-0 pl-9 list-none flex flex-col gap-2">
                <li
                  v-for="(detail, index) in policy.details"
                  :key="index"
                  class="text-sm text-gray-500 dark:text-[#999] pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-amber-600 before:dark:text-amber-400 before:font-bold"
                >
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Booking Behavior -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-[1.125rem] font-semibold tracking-tight text-gray-900 dark:text-white mb-1">
                Booking Behavior
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Automation and inventory management
              </p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all hover:bg-gray-100 hover:dark:bg-white/[0.03] hover:border-gray-300 hover:dark:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-check-badge"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white mb-1">
                    Auto-Confirm Bookings
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Automatically approve bookings without manual review
                  </p>
                </div>
              </div>
              <UToggle
                v-model="booking.autoConfirm"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all hover:bg-gray-100 hover:dark:bg-white/[0.03] hover:border-gray-300 hover:dark:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-shield-check"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white mb-1">
                    Prevent Overbooking
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Block bookings when inventory is unavailable
                  </p>
                </div>
              </div>
              <UToggle
                v-model="booking.preventOverbooking"
                size="lg"
                @change="markHasChanges"
              />
            </div>
          </div>

          <div
            v-if="!booking.autoConfirm"
            class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg mt-2"
          >
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
            />
            <div>
              <p class="m-0 text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                Manual review is enabled. You'll need to approve each booking before
                customers are charged.
              </p>
            </div>
          </div>

          <div
            v-if="!booking.preventOverbooking"
            class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-lg mt-2"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            />
            <div>
              <p class="m-0 text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>Warning:</strong> Disabling overbooking prevention may allow
                double bookings of the same equipment.
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { booking, loading, saving, hasUnsavedChanges, updateSettings, markHasChanges }
  = useSettings()

const cancellationPolicies = [
  {
    value: 'flexible',
    name: 'Flexible',
    description: 'Full refund up to 24 hours before event',
    details: [
      'Full refund if cancelled 24+ hours before event',
      '50% refund if cancelled 12-24 hours before',
      'No refund if cancelled less than 12 hours before'
    ]
  },
  {
    value: 'moderate',
    name: 'Moderate',
    description: 'Full refund up to 5 days before event',
    details: [
      'Full refund if cancelled 5+ days before event',
      '50% refund if cancelled 2-5 days before',
      'No refund if cancelled less than 2 days before'
    ]
  },
  {
    value: 'strict',
    name: 'Strict',
    description: 'Full refund up to 14 days before event',
    details: [
      'Full refund if cancelled 14+ days before event',
      '50% refund if cancelled 7-14 days before',
      'No refund if cancelled less than 7 days before'
    ]
  }
]

const selectPolicy = (value: string) => {
  if (booking.value) {
    booking.value.cancellationPolicy = value as 'flexible' | 'moderate' | 'strict'
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (booking.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateSettings('booking', booking.value as any)
  }
}
</script>
