<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight m-0 mb-1.5 text-gray-900 dark:text-white">Payment Settings</h2>
        <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888]">Manage Stripe integration and payout preferences</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        :loading="saving"
        :disabled="!hasUnsavedChanges"
        @click="saveSettings"
        class="bg-gradient-to-br from-amber-400 to-amber-600 border-none text-black font-semibold tracking-tight transition-all duration-200 hover:enabled:-translate-y-px hover:enabled:shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)]"
      >
        Save Changes
      </UButton>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]">
      <div class="w-8 h-8 border-[3px] border-amber-200 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin"></div>
      <p>Loading settings...</p>
    </div>

    <div v-else-if="payments" class="flex flex-col gap-6">
      <!-- Stripe Connection Status -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon name="i-heroicons-credit-card" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Stripe Connection</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Accept payments from your customers</p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div v-if="payments.stripeConnected" class="flex flex-col gap-6">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 shrink-0">
                <UIcon name="i-heroicons-check-circle-solid" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-semibold m-0 mb-2 text-gray-900 dark:text-white">Connected to Stripe</h4>
                <p class="m-0 mb-4 text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed">
                  Your account is connected and ready to accept payments
                </p>
                <div class="flex items-center gap-3 p-3 px-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-lg text-sm">
                  <span class="text-gray-500 dark:text-[#666] font-medium">Account ID:</span>
                  <code class="text-green-600 dark:text-green-400 font-mono text-[0.8125rem] tabular-nums">{{ payments.stripeAccountId }}</code>
                </div>
              </div>
            </div>

            <div class="flex gap-3 pt-2">
              <UButton
                variant="outline"
                size="lg"
                icon="i-heroicons-arrow-top-right-on-square"
                to="https://dashboard.stripe.com"
                target="_blank"
              >
                View Stripe Dashboard
              </UButton>
              <UButton
                variant="ghost"
                color="red"
                size="lg"
                @click="showDisconnectModal = true"
              >
                Disconnect
              </UButton>
            </div>

            <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05] rounded-xl">
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span class="block text-[0.8125rem] text-gray-500 dark:text-[#666] mb-0.5">Last Payout</span>
                  <span class="block text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5]">{{ formatDate(payments.lastPayoutDate) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-clock" class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span class="block text-[0.8125rem] text-gray-500 dark:text-[#666] mb-0.5">Payout Schedule</span>
                  <span class="block text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5]">{{ capitalizeFirst(payments.payoutSchedule) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col gap-6">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shrink-0">
                <UIcon name="i-heroicons-exclamation-circle" class="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div class="flex-1">
                <h4 class="text-xl font-semibold m-0 mb-2 text-gray-900 dark:text-white">Stripe Not Connected</h4>
                <p class="m-0 mb-4 text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed">
                  Connect your Stripe account to start accepting payments from customers
                </p>
              </div>
            </div>

            <div class="p-5 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/15 rounded-xl">
              <h5 class="text-sm font-semibold m-0 mb-3 text-amber-600 dark:text-amber-400 uppercase tracking-wider">What you'll get:</h5>
              <ul class="m-0 p-0 list-none flex flex-col gap-2.5">
                <li class="flex items-center gap-3 text-[0.9375rem] text-gray-800 dark:text-[#e5e5e5]">
                  <UIcon name="i-heroicons-check" class="w-[1.125rem] h-[1.125rem] text-amber-600 dark:text-amber-400 shrink-0" />
                  Accept credit card and digital wallet payments
                </li>
                <li class="flex items-center gap-3 text-[0.9375rem] text-gray-800 dark:text-[#e5e5e5]">
                  <UIcon name="i-heroicons-check" class="w-[1.125rem] h-[1.125rem] text-amber-600 dark:text-amber-400 shrink-0" />
                  Automatic payouts to your bank account
                </li>
                <li class="flex items-center gap-3 text-[0.9375rem] text-gray-800 dark:text-[#e5e5e5]">
                  <UIcon name="i-heroicons-check" class="w-[1.125rem] h-[1.125rem] text-amber-600 dark:text-amber-400 shrink-0" />
                  Built-in fraud protection and security
                </li>
                <li class="flex items-center gap-3 text-[0.9375rem] text-gray-800 dark:text-[#e5e5e5]">
                  <UIcon name="i-heroicons-check" class="w-[1.125rem] h-[1.125rem] text-amber-600 dark:text-amber-400 shrink-0" />
                  Detailed transaction reporting
                </li>
              </ul>
            </div>

            <UButton
              color="primary"
              size="xl"
              icon="i-heroicons-link"
              :loading="connecting"
              @click="handleConnectStripe"
              class="w-full bg-gradient-to-br from-amber-400 to-amber-600 border-none text-black font-semibold text-base py-4 px-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(251,191,36,0.5)]"
            >
              Connect with Stripe
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Platform Fees (if connected) -->
      <UCard v-if="payments.stripeConnected" class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon name="i-heroicons-receipt-percent" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Platform Fees</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Fees charged on each transaction</p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl">
              <div class="flex flex-col gap-1">
                <span class="text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5]">BouncePro Platform Fee</span>
                <span class="text-[0.8125rem] text-amber-600 dark:text-amber-400 font-medium">Based on your plan</span>
              </div>
              <div class="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{{ payments.platformFee }}%</div>
            </div>

            <div class="flex items-center justify-between p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl">
              <div class="flex flex-col gap-1">
                <span class="text-[0.9375rem] font-semibold text-gray-800 dark:text-[#e5e5e5]">Stripe Processing Fee</span>
                <span class="text-[0.8125rem] text-gray-500 dark:text-[#666]">2.9% + $0.30 per transaction</span>
              </div>
              <div class="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">Variable</div>
            </div>
          </div>

          <div class="mt-4 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl">
            <h5 class="text-sm font-semibold m-0 mb-4 text-gray-600 dark:text-[#888] uppercase tracking-wider">Example: $100 Booking</h5>
            <div class="flex flex-col gap-2.5">
              <div class="flex justify-between items-center py-2 text-[0.9375rem]">
                <span class="text-gray-900 dark:text-white">Booking Total</span>
                <span class="tabular-nums font-semibold text-gray-900 dark:text-white">$100.00</span>
              </div>
              <div class="flex justify-between items-center py-2 text-[0.9375rem] text-gray-500 dark:text-[#666] pl-4 border-l-2 border-gray-200 dark:border-white/[0.05]">
                <span>Platform Fee ({{ payments.platformFee }}%)</span>
                <span class="tabular-nums font-semibold">-${{ (100 * payments.platformFee / 100).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center py-2 text-[0.9375rem] text-gray-500 dark:text-[#666] pl-4 border-l-2 border-gray-200 dark:border-white/[0.05]">
                <span>Stripe Fee (~3.2%)</span>
                <span class="tabular-nums font-semibold">-$3.20</span>
              </div>
              <div class="flex justify-between items-center mt-2 pt-4 border-t border-gray-200 dark:border-white/10 font-semibold text-green-600 dark:text-green-400 text-[1.0625rem]">
                <span>You Receive</span>
                <span class="tabular-nums">${{ (100 - (100 * payments.platformFee / 100) - 3.20).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Payout Schedule (if connected) -->
      <UCard v-if="payments.stripeConnected" class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon name="i-heroicons-banknotes" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Payout Schedule</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">How often you receive payments</p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <UFormGroup label="Payout Frequency">
            <div class="flex flex-col gap-3 mt-2">
              <div
                v-for="schedule in payoutSchedules"
                :key="schedule.value"
                class="flex items-start gap-4 p-4 px-5 bg-white dark:bg-white/[0.02] border-2 border-gray-200 dark:border-white/[0.06] rounded-xl cursor-pointer transition-all duration-200 hover:border-amber-200 dark:hover:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/[0.03]"
                :class="{ 'border-amber-300 dark:!border-amber-500/50 bg-amber-50 dark:!bg-amber-500/[0.08]': payments.payoutSchedule === schedule.value }"
                @click="selectPayoutSchedule(schedule.value)"
              >
                <div class="w-5 h-5 border-2 border-gray-300 dark:border-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
                     :class="{ '!border-amber-500 dark:!border-amber-400': payments.payoutSchedule === schedule.value }">
                  <div v-if="payments.payoutSchedule === schedule.value" class="w-2.5 h-2.5 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">{{ schedule.name }}</h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888]">{{ schedule.description }}</p>
                </div>
              </div>
            </div>
          </UFormGroup>

          <div class="flex items-start gap-3 p-4 mt-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 rounded-lg">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p class="m-0 text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Payouts are automatically transferred to your connected bank account.
              First payout may take 7-14 days for verification.
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Disconnect Confirmation Modal -->
    <UModal v-model:open="showDisconnectModal">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Disconnect Stripe?</h3>
            </div>
          </template>

          <div class="p-6 flex flex-col gap-4">
            <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888] leading-relaxed">
              Are you sure you want to disconnect your Stripe account? You won't be able
              to accept new payments until you reconnect.
            </p>
            <div class="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-sm text-red-900 dark:text-red-300">
              <strong class="block mb-2 text-red-600 dark:text-red-400">This will:</strong>
              <ul class="m-0 pl-5 flex flex-col gap-1">
                <li>Stop processing of new payments</li>
                <li>Disable automatic payouts</li>
                <li>Require reconnection to resume payments</li>
              </ul>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton variant="ghost" @click="showDisconnectModal = false">
                Cancel
              </UButton>
              <UButton color="red" @click="handleDisconnect">
                Disconnect Stripe
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { payments, loading, saving, hasUnsavedChanges, updateSettings, connectStripe, markHasChanges } =
  useSettings()

const showDisconnectModal = ref(false)
const connecting = ref(false)

const payoutSchedules = [
  {
    value: 'daily',
    name: 'Daily',
    description: 'Receive payouts every business day',
  },
  {
    value: 'weekly',
    name: 'Weekly',
    description: 'Receive payouts once per week on Friday',
  },
  {
    value: 'monthly',
    name: 'Monthly',
    description: 'Receive payouts on the 1st of each month',
  },
]

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleConnectStripe = async () => {
  connecting.value = true
  try {
    await connectStripe()
    // In production, this would redirect to Stripe
  } catch (error) {
    console.error('Failed to connect Stripe:', error)
  } finally {
    connecting.value = false
  }
}

const handleDisconnect = async () => {
  if (payments.value) {
    payments.value.stripeConnected = false
    payments.value.stripeAccountId = null
    showDisconnectModal.value = false
    markHasChanges()
  }
}

const selectPayoutSchedule = (value: string) => {
  if (payments.value) {
    payments.value.payoutSchedule = value as 'daily' | 'weekly' | 'monthly'
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (payments.value) {
    await updateSettings('payments', payments.value)
  }
}
</script>
