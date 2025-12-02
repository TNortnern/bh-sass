<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Booking Settings</h2>
        <p class="section-description">Configure rental policies and requirements</p>
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

    <div v-else-if="booking" class="settings-grid">
      <!-- Booking Requirements -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-clock" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Booking Requirements</h3>
              <p class="card-description">Lead time and advance booking limits</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup
            label="Minimum Lead Time"
            help="Minimum hours before rental date"
            required
            class="form-group"
          >
            <div class="input-with-suffix">
              <UInput
                v-model.number="booking.leadTime"
                type="number"
                size="lg"
                min="0"
                step="1"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="input-suffix">hours</span>
            </div>
          </UFormGroup>

          <UFormGroup
            label="Maximum Advance Booking"
            help="How far in advance customers can book"
            required
            class="form-group"
          >
            <div class="input-with-suffix">
              <UInput
                v-model.number="booking.maxAdvanceBooking"
                type="number"
                size="lg"
                min="1"
                step="1"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="input-suffix">days</span>
            </div>
          </UFormGroup>

          <UFormGroup
            label="Buffer Time Between Rentals"
            help="Time needed between bookings for setup/cleanup"
            required
            class="form-group"
          >
            <div class="input-with-suffix">
              <UInput
                v-model.number="booking.bufferTime"
                type="number"
                size="lg"
                min="0"
                step="15"
                class="w-full"
                @input="markHasChanges"
              />
              <span class="input-suffix">minutes</span>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Payment & Deposits -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-currency-dollar" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Payment & Deposits</h3>
              <p class="card-description">Deposit requirements and payment terms</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup
            label="Deposit Percentage"
            help="Percentage of total required as deposit"
            required
            class="form-group"
          >
            <div class="slider-group">
              <input
                v-model.number="booking.depositPercentage"
                type="range"
                min="0"
                max="100"
                step="5"
                class="deposit-slider"
                @input="markHasChanges"
              />
              <div class="slider-value">
                <span class="value-number">{{ booking.depositPercentage }}</span>
                <span class="value-unit">%</span>
              </div>
            </div>
            <div class="deposit-examples">
              <div class="example-item">
                <span class="example-label">$100 rental:</span>
                <span class="example-value">${{ (100 * booking.depositPercentage / 100).toFixed(2) }} deposit</span>
              </div>
              <div class="example-item">
                <span class="example-label">$500 rental:</span>
                <span class="example-value">${{ (500 * booking.depositPercentage / 100).toFixed(2) }} deposit</span>
              </div>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- Cancellation Policy -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-x-circle" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Cancellation Policy</h3>
              <p class="card-description">Refund terms for cancelled bookings</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="policy-options">
            <div
              v-for="policy in cancellationPolicies"
              :key="policy.value"
              class="policy-option"
              :class="{ active: booking.cancellationPolicy === policy.value }"
              @click="selectPolicy(policy.value)"
            >
              <div class="policy-header">
                <div class="policy-radio">
                  <div v-if="booking.cancellationPolicy === policy.value" class="radio-dot"></div>
                </div>
                <div>
                  <h4 class="policy-name">{{ policy.name }}</h4>
                  <p class="policy-description">{{ policy.description }}</p>
                </div>
              </div>
              <ul class="policy-details">
                <li v-for="(detail, index) in policy.details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Booking Behavior -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-cog-6-tooth" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Booking Behavior</h3>
              <p class="card-description">Automation and inventory management</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="toggle-group">
            <div class="toggle-item">
              <div class="toggle-content">
                <div class="toggle-icon">
                  <UIcon name="i-heroicons-check-badge" class="icon" />
                </div>
                <div class="toggle-info">
                  <h4 class="toggle-label">Auto-Confirm Bookings</h4>
                  <p class="toggle-description">
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

            <div class="toggle-item">
              <div class="toggle-content">
                <div class="toggle-icon">
                  <UIcon name="i-heroicons-shield-check" class="icon" />
                </div>
                <div class="toggle-info">
                  <h4 class="toggle-label">Prevent Overbooking</h4>
                  <p class="toggle-description">
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

          <div v-if="!booking.autoConfirm" class="info-banner">
            <UIcon name="i-heroicons-information-circle" class="banner-icon" />
            <div>
              <p class="banner-text">
                Manual review is enabled. You'll need to approve each booking before
                customers are charged.
              </p>
            </div>
          </div>

          <div v-if="!booking.preventOverbooking" class="warning-banner">
            <UIcon name="i-heroicons-exclamation-triangle" class="banner-icon" />
            <div>
              <p class="banner-text">
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
const { booking, loading, saving, hasUnsavedChanges, updateSettings, markHasChanges } =
  useSettings()

const cancellationPolicies = [
  {
    value: 'flexible',
    name: 'Flexible',
    description: 'Full refund up to 24 hours before event',
    details: [
      'Full refund if cancelled 24+ hours before event',
      '50% refund if cancelled 12-24 hours before',
      'No refund if cancelled less than 12 hours before',
    ],
  },
  {
    value: 'moderate',
    name: 'Moderate',
    description: 'Full refund up to 5 days before event',
    details: [
      'Full refund if cancelled 5+ days before event',
      '50% refund if cancelled 2-5 days before',
      'No refund if cancelled less than 2 days before',
    ],
  },
  {
    value: 'strict',
    name: 'Strict',
    description: 'Full refund up to 14 days before event',
    details: [
      'Full refund if cancelled 14+ days before event',
      '50% refund if cancelled 7-14 days before',
      'No refund if cancelled less than 7 days before',
    ],
  },
]

const selectPolicy = (value: string) => {
  if (booking.value) {
    booking.value.cancellationPolicy = value as 'flexible' | 'moderate' | 'strict'
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (booking.value) {
    await updateSettings('booking', booking.value)
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  color: #666;
  font-size: 0.9375rem;
  font-weight: 500;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.deposit-slider {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.deposit-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: 3px solid #0a0a0a;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
  transition: all 0.2s;
}

.deposit-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
}

.deposit-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: 3px solid #0a0a0a;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
  transition: all 0.2s;
}

.slider-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  min-width: 80px;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.5rem;
  justify-content: center;
}

.value-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

.value-unit {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(251, 191, 36, 0.7);
}

.deposit-examples {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.example-label {
  font-size: 0.8125rem;
  color: #666;
}

.example-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
  font-variant-numeric: tabular-nums;
}

.policy-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.policy-option {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.policy-option:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.03);
}

.policy-option.active {
  border-color: rgba(251, 191, 36, 0.5);
  background: rgba(251, 191, 36, 0.08);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.policy-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.policy-radio {
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

.policy-option.active .policy-radio {
  border-color: #fbbf24;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #fbbf24;
  border-radius: 50%;
}

.policy-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.policy-description {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
}

.policy-details {
  margin: 0;
  padding-left: 2.25rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.policy-details li {
  font-size: 0.875rem;
  color: #999;
  padding-left: 1.25rem;
  position: relative;
}

.policy-details li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #fbbf24;
  font-weight: bold;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
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

.toggle-item:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.toggle-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.toggle-icon {
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

.toggle-info {
  flex: 1;
}

.toggle-label {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.toggle-description {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
  line-height: 1.5;
}

.info-banner,
.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.info-banner {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.warning-banner {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.banner-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-banner .banner-icon {
  color: #3b82f6;
}

.warning-banner .banner-icon {
  color: #fbbf24;
}

.banner-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.info-banner .banner-text {
  color: #93c5fd;
}

.warning-banner .banner-text {
  color: #fde68a;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .deposit-examples {
    flex-direction: column;
    gap: 0.75rem;
  }

  .toggle-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
