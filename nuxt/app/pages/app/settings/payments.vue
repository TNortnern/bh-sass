<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Payment Settings</h2>
        <p class="section-description">Manage Stripe integration and payout preferences</p>
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

    <div v-else-if="payments" class="settings-grid">
      <!-- Stripe Connection Status -->
      <UCard class="settings-card status-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-credit-card" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Stripe Connection</h3>
              <p class="card-description">Accept payments from your customers</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div v-if="payments.stripeConnected" class="connection-status connected">
            <div class="status-header">
              <div class="status-icon-wrapper">
                <UIcon name="i-heroicons-check-circle-solid" class="status-icon" />
              </div>
              <div class="status-info">
                <h4 class="status-title">Connected to Stripe</h4>
                <p class="status-description">
                  Your account is connected and ready to accept payments
                </p>
                <div class="account-id">
                  <span class="label">Account ID:</span>
                  <code>{{ payments.stripeAccountId }}</code>
                </div>
              </div>
            </div>

            <div class="connection-actions">
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

            <div class="connection-stats">
              <div class="stat-item">
                <UIcon name="i-heroicons-calendar" class="stat-icon" />
                <div>
                  <span class="stat-label">Last Payout</span>
                  <span class="stat-value">{{ formatDate(payments.lastPayoutDate) }}</span>
                </div>
              </div>
              <div class="stat-item">
                <UIcon name="i-heroicons-clock" class="stat-icon" />
                <div>
                  <span class="stat-label">Payout Schedule</span>
                  <span class="stat-value">{{ capitalizeFirst(payments.payoutSchedule) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="connection-status disconnected">
            <div class="status-header">
              <div class="status-icon-wrapper">
                <UIcon name="i-heroicons-exclamation-circle" class="status-icon" />
              </div>
              <div class="status-info">
                <h4 class="status-title">Stripe Not Connected</h4>
                <p class="status-description">
                  Connect your Stripe account to start accepting payments from customers
                </p>
              </div>
            </div>

            <div class="connection-benefits">
              <h5 class="benefits-title">What you'll get:</h5>
              <ul class="benefits-list">
                <li>
                  <UIcon name="i-heroicons-check" class="benefit-icon" />
                  Accept credit card and digital wallet payments
                </li>
                <li>
                  <UIcon name="i-heroicons-check" class="benefit-icon" />
                  Automatic payouts to your bank account
                </li>
                <li>
                  <UIcon name="i-heroicons-check" class="benefit-icon" />
                  Built-in fraud protection and security
                </li>
                <li>
                  <UIcon name="i-heroicons-check" class="benefit-icon" />
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
              class="connect-button"
            >
              Connect with Stripe
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Platform Fees (if connected) -->
      <UCard v-if="payments.stripeConnected" class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-receipt-percent" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Platform Fees</h3>
              <p class="card-description">Fees charged on each transaction</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="fee-breakdown">
            <div class="fee-item">
              <div class="fee-label">
                <span>BouncePro Platform Fee</span>
                <span class="fee-badge">Based on your plan</span>
              </div>
              <div class="fee-value">{{ payments.platformFee }}%</div>
            </div>

            <div class="fee-item">
              <div class="fee-label">
                <span>Stripe Processing Fee</span>
                <span class="fee-note">2.9% + $0.30 per transaction</span>
              </div>
              <div class="fee-value">Variable</div>
            </div>
          </div>

          <div class="fee-example">
            <h5 class="example-title">Example: $100 Booking</h5>
            <div class="example-breakdown">
              <div class="example-row">
                <span>Booking Total</span>
                <span class="amount">$100.00</span>
              </div>
              <div class="example-row fee-row">
                <span>Platform Fee ({{ payments.platformFee }}%)</span>
                <span class="amount">-${{ (100 * payments.platformFee / 100).toFixed(2) }}</span>
              </div>
              <div class="example-row fee-row">
                <span>Stripe Fee (~3.2%)</span>
                <span class="amount">-$3.20</span>
              </div>
              <div class="example-row total-row">
                <span>You Receive</span>
                <span class="amount">${{ (100 - (100 * payments.platformFee / 100) - 3.20).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Payout Schedule (if connected) -->
      <UCard v-if="payments.stripeConnected" class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-banknotes" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Payout Schedule</h3>
              <p class="card-description">How often you receive payments</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup label="Payout Frequency" class="form-group">
            <div class="payout-options">
              <div
                v-for="schedule in payoutSchedules"
                :key="schedule.value"
                class="payout-option"
                :class="{ active: payments.payoutSchedule === schedule.value }"
                @click="selectPayoutSchedule(schedule.value)"
              >
                <div class="option-radio">
                  <div v-if="payments.payoutSchedule === schedule.value" class="radio-dot"></div>
                </div>
                <div class="option-content">
                  <h4 class="option-name">{{ schedule.name }}</h4>
                  <p class="option-description">{{ schedule.description }}</p>
                </div>
              </div>
            </div>
          </UFormGroup>

          <div class="payout-info">
            <UIcon name="i-heroicons-information-circle" class="info-icon" />
            <p class="info-text">
              Payouts are automatically transferred to your connected bank account.
              First payout may take 7-14 days for verification.
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Disconnect Confirmation Modal -->
    <UModal v-model:open="showDisconnectModal">
      <UCard>
        <template #header>
          <div class="modal-header">
            <UIcon name="i-heroicons-exclamation-triangle" class="modal-icon" />
            <h3 class="modal-title">Disconnect Stripe?</h3>
          </div>
        </template>

        <div class="modal-content">
          <p class="modal-text">
            Are you sure you want to disconnect your Stripe account? You won't be able
            to accept new payments until you reconnect.
          </p>
          <div class="warning-box">
            <strong>This will:</strong>
            <ul>
              <li>Stop processing of new payments</li>
              <li>Disable automatic payouts</li>
              <li>Require reconnection to resume payments</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="modal-actions">
            <UButton variant="ghost" @click="showDisconnectModal = false">
              Cancel
            </UButton>
            <UButton color="red" @click="handleDisconnect">
              Disconnect Stripe
            </UButton>
          </div>
        </template>
      </UCard>
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

.status-card.connected {
  border-color: rgba(34, 197, 94, 0.3);
}

.status-card.connected:hover {
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 8px 32px -8px rgba(34, 197, 94, 0.2);
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

.connection-status {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.status-icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.connected .status-icon-wrapper {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.disconnected .status-icon-wrapper {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-icon {
  width: 2rem;
  height: 2rem;
}

.connected .status-icon {
  color: #22c55e;
}

.disconnected .status-icon {
  color: #fbbf24;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #ffffff;
}

.status-description {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  color: #888;
  line-height: 1.6;
}

.account-id {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.account-id .label {
  color: #666;
  font-weight: 500;
}

.account-id code {
  color: #22c55e;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.connection-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.connection-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.stat-label {
  display: block;
  font-size: 0.8125rem;
  color: #666;
  margin-bottom: 0.125rem;
}

.stat-value {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
}

.connection-benefits {
  padding: 1.25rem;
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.15);
  border-radius: 0.75rem;
}

.benefits-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.benefits-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: #e5e5e5;
}

.benefit-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.connect-button {
  width: 100%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border: none;
  color: #000;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 2rem;
  transition: all 0.2s;
}

.connect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(251, 191, 36, 0.5);
}

.fee-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fee-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
}

.fee-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fee-label > span:first-child {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
}

.fee-badge {
  font-size: 0.8125rem;
  color: #fbbf24;
  font-weight: 500;
}

.fee-note {
  font-size: 0.8125rem;
  color: #666;
}

.fee-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

.fee-example {
  margin-top: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
}

.example-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.example-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.example-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9375rem;
}

.example-row.fee-row {
  color: #666;
  padding-left: 1rem;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
}

.example-row.total-row {
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: #22c55e;
  font-size: 1.0625rem;
}

.amount {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.payout-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.payout-option {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.payout-option:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.03);
}

.payout-option.active {
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

.payout-option.active .option-radio {
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

.option-name {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #ffffff;
}

.option-description {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
}

.payout-info {
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

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #ef4444;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.modal-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-text {
  margin: 0;
  font-size: 0.9375rem;
  color: #888;
  line-height: 1.6;
}

.warning-box {
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #fca5a5;
}

.warning-box strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #ef4444;
}

.warning-box ul {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .connection-actions {
    flex-direction: column;
  }

  .connection-stats {
    grid-template-columns: 1fr;
  }
}
</style>
