<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06] max-md:flex-col max-md:items-start max-md:gap-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight m-0 mb-1.5 text-gray-900 dark:text-white">
          Notification Settings
        </h2>
        <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888]">
          Manage how and when you receive alerts
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        :loading="saving"
        :disabled="!hasUnsavedChanges"
        class="bg-gradient-to-br from-amber-400 to-amber-500 border-none text-black font-semibold tracking-tight transition-all duration-200 hover:enabled:-translate-y-px hover:enabled:shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
        @click="saveSettings"
      >
        Save Changes
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]"
    >
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin" />
      <p>Loading settings...</p>
    </div>

    <div
      v-else-if="notifications"
      class="flex flex-col gap-6"
    >
      <!-- Email Notifications -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-envelope"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Email Notifications
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Receive updates via email
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    New Bookings
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Get notified when a new booking is created
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.email.newBooking"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-x-circle"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Cancellations
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Get notified when a booking is cancelled
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.email.cancellation"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-banknotes"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Payments
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Get notified when a payment is received
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.email.payment"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Upcoming Rental Reminders
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Reminders before scheduled rentals
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.email.reminder"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-document-text"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Daily Summary
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Receive a daily summary of bookings and activity
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.email.dailySummary"
                size="lg"
                @change="markHasChanges"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- In-App Notifications -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-bell"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                In-App Notifications
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Alerts within the dashboard
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-calendar-days"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    New Bookings
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Show in-app alerts for new bookings
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.inApp.newBooking"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-x-circle"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Cancellations
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Show in-app alerts for cancellations
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.inApp.cancellation"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-banknotes"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Payments
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Show in-app alerts for payments
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.inApp.payment"
                size="lg"
                @change="markHasChanges"
              />
            </div>

            <div class="flex items-center justify-between gap-6 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.03] hover:border-gray-300 dark:hover:border-white/10">
              <div class="flex items-start gap-4 flex-1">
                <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-5 h-5"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    Upcoming Rental Reminders
                  </h4>
                  <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                    Show in-app alerts for upcoming rentals
                  </p>
                </div>
              </div>
              <UToggle
                v-model="notifications.inApp.reminder"
                size="lg"
                @change="markHasChanges"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Reminder Timing -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-clock"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Reminder Timing
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                When to send rental reminders
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <UFormField
            label="Send reminders before rental"
            help="How many hours in advance to send reminders"
            class="flex flex-col gap-2"
          >
            <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mt-2 max-md:grid-cols-1">
              <div
                v-for="option in reminderOptions"
                :key="option.value"
                class="flex items-start gap-3 p-4 bg-white dark:bg-white/[0.02] border-2 border-gray-200 dark:border-white/[0.06] rounded-xl cursor-pointer transition-all duration-200 hover:border-amber-300 dark:hover:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/[0.03]"
                :class="{ 'border-amber-400 dark:!border-amber-500/50 bg-amber-50 dark:!bg-amber-500/[0.08]': notifications.reminderTiming === option.value }"
                @click="selectReminderTiming(option.value)"
              >
                <div
                  class="w-5 h-5 border-2 border-gray-300 dark:border-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
                  :class="{ 'border-amber-500 dark:!border-amber-400': notifications.reminderTiming === option.value }"
                >
                  <div
                    v-if="notifications.reminderTiming === option.value"
                    class="w-2.5 h-2.5 bg-amber-500 dark:bg-amber-400 rounded-full"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-[0.9375rem] font-semibold m-0 mb-1 text-gray-900 dark:text-white">
                    {{ option.label }}
                  </h4>
                  <p class="m-0 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                    {{ option.description }}
                  </p>
                </div>
              </div>
            </div>
          </UFormField>

          <div class="flex items-start gap-3 p-4 mt-4 bg-blue-50 dark:bg-blue-500/[0.05] border border-blue-200 dark:border-blue-500/[0.15] rounded-lg">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
            />
            <p class="m-0 text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              Reminders will be sent {{ notifications.reminderTiming }} hours before the
              scheduled rental time. Both email and in-app notifications will be sent
              if enabled.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[0.625rem] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-heroicons-bolt"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Bulk notification controls
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6 max-md:grid-cols-1">
            <UButton
              variant="outline"
              size="lg"
              icon="i-heroicons-check-circle"
              class="w-full justify-center"
              @click="enableAllNotifications"
            >
              Enable All Notifications
            </UButton>

            <UButton
              variant="outline"
              size="lg"
              icon="i-heroicons-x-circle"
              class="w-full justify-center"
              @click="disableAllNotifications"
            >
              Disable All Notifications
            </UButton>
          </div>

          <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl max-md:grid-cols-1">
            <div class="flex flex-col gap-2">
              <span class="text-[0.8125rem] text-gray-500 dark:text-[#666] uppercase tracking-wider font-semibold">Email Notifications Enabled</span>
              <span class="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{{ enabledEmailCount }} / 5</span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-[0.8125rem] text-gray-500 dark:text-[#666] uppercase tracking-wider font-semibold">In-App Notifications Enabled</span>
              <span class="text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{{ enabledInAppCount }} / 4</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { notifications, loading, saving, hasUnsavedChanges, updateSettings, markHasChanges }
  = useSettings()

const reminderOptions = [
  {
    value: 12,
    label: '12 Hours',
    description: 'Half day before rental'
  },
  {
    value: 24,
    label: '24 Hours',
    description: 'One day before rental'
  },
  {
    value: 48,
    label: '48 Hours',
    description: 'Two days before rental'
  },
  {
    value: 72,
    label: '72 Hours',
    description: 'Three days before rental'
  }
]

const enabledEmailCount = computed(() => {
  if (!notifications.value) return 0
  return Object.values(notifications.value.email).filter(Boolean).length
})

const enabledInAppCount = computed(() => {
  if (!notifications.value) return 0
  return Object.values(notifications.value.inApp).filter(Boolean).length
})

const selectReminderTiming = (value: number) => {
  if (notifications.value) {
    notifications.value.reminderTiming = value
    markHasChanges()
  }
}

const enableAllNotifications = () => {
  if (notifications.value) {
    notifications.value.email = {
      newBooking: true,
      cancellation: true,
      payment: true,
      reminder: true,
      dailySummary: true
    }
    notifications.value.inApp = {
      newBooking: true,
      cancellation: true,
      payment: true,
      reminder: true
    }
    markHasChanges()
  }
}

const disableAllNotifications = () => {
  if (notifications.value) {
    notifications.value.email = {
      newBooking: false,
      cancellation: false,
      payment: false,
      reminder: false,
      dailySummary: false
    }
    notifications.value.inApp = {
      newBooking: false,
      cancellation: false,
      payment: false,
      reminder: false
    }
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (notifications.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateSettings('notifications', notifications.value as any)
  }
}
</script>
