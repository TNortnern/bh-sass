<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Notification Settings</h2>
        <p class="section-description">Manage how and when you receive alerts</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        :loading="saving"
        :disabled="!hasUnsavedChanges"
        @click="saveSettings"
        class="save-button"
      >
        Save Changes
      </UButton>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading settings...</p>
    </div>

    <div v-else-if="notifications" class="settings-grid">
      <!-- Email Notifications -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-envelope" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Email Notifications</h3>
              <p class="card-description">Receive updates via email</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="notification-group">
            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-calendar-days" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">New Bookings</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-x-circle" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Cancellations</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-banknotes" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Payments</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-clock" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Upcoming Rental Reminders</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-document-text" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Daily Summary</h4>
                  <p class="notification-description">
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
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-bell" class="icon" />
            </div>
            <div>
              <h3 class="card-title">In-App Notifications</h3>
              <p class="card-description">Alerts within the dashboard</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="notification-group">
            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-calendar-days" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">New Bookings</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-x-circle" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Cancellations</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-banknotes" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Payments</h4>
                  <p class="notification-description">
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

            <div class="notification-item">
              <div class="notification-content">
                <div class="notification-icon">
                  <UIcon name="i-heroicons-clock" class="icon" />
                </div>
                <div class="notification-info">
                  <h4 class="notification-label">Upcoming Rental Reminders</h4>
                  <p class="notification-description">
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
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-clock" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Reminder Timing</h3>
              <p class="card-description">When to send rental reminders</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup
            label="Send reminders before rental"
            help="How many hours in advance to send reminders"
            class="form-group"
          >
            <div class="timing-selector">
              <div
                v-for="option in reminderOptions"
                :key="option.value"
                class="timing-option"
                :class="{ active: notifications.reminderTiming === option.value }"
                @click="selectReminderTiming(option.value)"
              >
                <div class="option-radio">
                  <div v-if="notifications.reminderTiming === option.value" class="radio-dot"></div>
                </div>
                <div class="option-content">
                  <h4 class="option-label">{{ option.label }}</h4>
                  <p class="option-description">{{ option.description }}</p>
                </div>
              </div>
            </div>
          </UFormGroup>

          <div class="timing-info">
            <UIcon name="i-heroicons-information-circle" class="info-icon" />
            <p class="info-text">
              Reminders will be sent {{ notifications.reminderTiming }} hours before the
              scheduled rental time. Both email and in-app notifications will be sent
              if enabled.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-bolt" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Quick Actions</h3>
              <p class="card-description">Bulk notification controls</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="quick-actions">
            <UButton
              variant="outline"
              size="lg"
              icon="i-heroicons-check-circle"
              @click="enableAllNotifications"
              class="action-button"
            >
              Enable All Notifications
            </UButton>

            <UButton
              variant="outline"
              size="lg"
              icon="i-heroicons-x-circle"
              @click="disableAllNotifications"
              class="action-button"
            >
              Disable All Notifications
            </UButton>
          </div>

          <div class="notification-summary">
            <div class="summary-item">
              <span class="summary-label">Email Notifications Enabled</span>
              <span class="summary-value">{{ enabledEmailCount }} / 5</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">In-App Notifications Enabled</span>
              <span class="summary-value">{{ enabledInAppCount }} / 4</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { notifications, loading, saving, hasUnsavedChanges, updateSettings, markHasChanges } =
  useSettings()

const reminderOptions = [
  {
    value: 12,
    label: '12 Hours',
    description: 'Half day before rental',
  },
  {
    value: 24,
    label: '24 Hours',
    description: 'One day before rental',
  },
  {
    value: 48,
    label: '48 Hours',
    description: 'Two days before rental',
  },
  {
    value: 72,
    label: '72 Hours',
    description: 'Three days before rental',
  },
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
      dailySummary: true,
    }
    notifications.value.inApp = {
      newBooking: true,
      cancellation: true,
      payment: true,
      reminder: true,
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
      dailySummary: false,
    }
    notifications.value.inApp = {
      newBooking: false,
      cancellation: false,
      payment: false,
      reminder: false,
    }
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (notifications.value) {
    await updateSettings('notifications', notifications.value)
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.375rem;
  color: #ffffff;
}

.section-description {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
}

.save-button {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  color: #000;
  font-weight: 600;
  letter-spacing: -0.01em;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px -4px rgba(251, 191, 36, 0.4);
}

.save-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #888;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(251, 191, 36, 0.1);
  border-top-color: #fbbf24;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-card:hover {
  border-color: rgba(251, 191, 36, 0.2);
  box-shadow: 0 8px 32px -8px rgba(251, 191, 36, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.625rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.card-content {
  padding: 1.5rem;
}

.notification-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.notification-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.5rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.notification-info {
  flex: 1;
}

.notification-label {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.notification-description {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.timing-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.timing-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.timing-option:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.03);
}

.timing-option.active {
  border-color: rgba(251, 191, 36, 0.5);
  background: rgba(251, 191, 36, 0.08);
}

.option-radio {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s;
}

.timing-option.active .option-radio {
  border-color: #fbbf24;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #fbbf24;
  border-radius: 50%;
}

.option-content {
  flex: 1;
}

.option-label {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.option-description {
  margin: 0;
  font-size: 0.8125rem;
  color: #888;
}

.timing-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 0.5rem;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-text {
  margin: 0;
  font-size: 0.875rem;
  color: #93c5fd;
  line-height: 1.5;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  width: 100%;
  justify-content: center;
}

.notification-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.8125rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .timing-selector {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .notification-summary {
    grid-template-columns: 1fr;
  }
}
</style>
