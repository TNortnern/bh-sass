<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h2 class="section-title">Profile Settings</h2>
        <p class="section-description">Manage your business information and service area</p>
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

    <div v-else-if="business" class="settings-grid">
      <!-- Business Information -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-building-storefront" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Business Information</h3>
              <p class="card-description">Your business name and description</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup label="Business Name" required class="form-group">
            <UInput
              v-model="business.name"
              size="lg"
              placeholder="Enter business name"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="Business Logo" class="form-group">
            <div class="logo-upload">
              <div v-if="business.logo" class="logo-preview">
                <img :src="business.logo" alt="Business logo" />
                <button class="logo-remove" @click="removeLogo">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>
              <div v-else class="logo-placeholder">
                <UIcon name="i-heroicons-photo" class="placeholder-icon" />
                <p>Upload logo</p>
                <UButton size="sm" variant="outline">Choose File</UButton>
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="Description" class="form-group">
            <UTextarea
              v-model="business.description"
              :rows="4"
              size="lg"
              placeholder="Tell customers about your business"
              @input="markHasChanges"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Contact Information -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-phone" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Contact Information</h3>
              <p class="card-description">How customers can reach you</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="form-row">
            <UFormGroup label="Phone Number" required class="form-group">
              <UInput
                v-model="business.phone"
                size="lg"
                type="tel"
                placeholder="(555) 123-4567"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="Email Address" required class="form-group">
              <UInput
                v-model="business.email"
                size="lg"
                type="email"
                placeholder="hello@yourbusiness.com"
                @input="markHasChanges"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Street Address" required class="form-group">
            <UInput
              v-model="business.address.street"
              size="lg"
              placeholder="123 Main Street"
              @input="markHasChanges"
            />
          </UFormGroup>

          <div class="form-row">
            <UFormGroup label="City" required class="form-group">
              <UInput
                v-model="business.address.city"
                size="lg"
                placeholder="Austin"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="State" required class="form-group">
              <USelect
                v-model="business.address.state"
                :options="states"
                size="lg"
                @change="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="ZIP Code" required class="form-group">
              <UInput
                v-model="business.address.zip"
                size="lg"
                placeholder="78701"
                @input="markHasChanges"
              />
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <!-- Timezone & Hours -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-clock" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Timezone & Business Hours</h3>
              <p class="card-description">When you're available for rentals</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <UFormGroup label="Timezone" required class="form-group">
            <USelect
              v-model="business.timezone"
              :options="timezones"
              size="lg"
              @change="markHasChanges"
            />
          </UFormGroup>

          <div class="business-hours">
            <div class="hours-header">
              <span class="hours-label">Business Hours</span>
            </div>
            <div
              v-for="(day, key) in business.businessHours"
              :key="key"
              class="hours-row"
            >
              <UToggle
                v-model="day.enabled"
                size="md"
                @change="markHasChanges"
              />
              <span class="day-name">{{ formatDayName(key) }}</span>
              <div v-if="day.enabled" class="time-inputs">
                <UInput
                  v-model="day.open"
                  type="time"
                  size="md"
                  @input="markHasChanges"
                />
                <span class="time-separator">to</span>
                <UInput
                  v-model="day.close"
                  type="time"
                  size="md"
                  @input="markHasChanges"
                />
              </div>
              <span v-else class="closed-label">Closed</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Service Area -->
      <UCard class="settings-card">
        <template #header>
          <div class="card-header">
            <div class="card-header-icon">
              <UIcon name="i-heroicons-map-pin" class="icon" />
            </div>
            <div>
              <h3 class="card-title">Service Area</h3>
              <p class="card-description">Define where you deliver rentals</p>
            </div>
          </div>
        </template>

        <div class="card-content">
          <div class="form-row">
            <UFormGroup label="Service Radius" required class="form-group">
              <UInput
                v-model.number="business.serviceArea.radius"
                type="number"
                size="lg"
                placeholder="25"
                @input="markHasChanges"
              />
            </UFormGroup>

            <UFormGroup label="Unit" required class="form-group">
              <USelect
                v-model="business.serviceArea.unit"
                :options="['miles', 'km']"
                size="lg"
                @change="markHasChanges"
              />
            </UFormGroup>
          </div>

          <UFormGroup
            label="Service ZIP Codes (optional)"
            help="Add specific ZIP codes you serve"
            class="form-group"
          >
            <div class="zip-codes">
              <div v-for="(zip, index) in business.serviceArea.zipCodes" :key="index" class="zip-tag">
                <span>{{ zip }}</span>
                <button @click="removeZipCode(index)">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>
              <button class="add-zip-button" @click="showAddZipModal = true">
                <UIcon name="i-heroicons-plus" />
                Add ZIP
              </button>
            </div>
          </UFormGroup>
        </div>
      </UCard>
    </div>

    <!-- Add ZIP Code Modal -->
    <UModal v-model:open="showAddZipModal">
      <UCard>
        <template #header>
          <h3 class="modal-title">Add ZIP Code</h3>
        </template>

        <div class="modal-content">
          <UFormGroup label="ZIP Code" required>
            <UInput
              v-model="newZipCode"
              size="lg"
              placeholder="78701"
              maxlength="5"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="modal-actions">
            <UButton variant="ghost" @click="showAddZipModal = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="addZipCode">Add ZIP Code</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { business, loading, saving, hasUnsavedChanges, updateSettings, markHasChanges } =
  useSettings()

const showAddZipModal = ref(false)
const newZipCode = ref('')

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
]

const formatDayName = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

const removeLogo = () => {
  if (business.value) {
    business.value.logo = null
    markHasChanges()
  }
}

const addZipCode = () => {
  if (newZipCode.value && business.value) {
    business.value.serviceArea.zipCodes.push(newZipCode.value)
    newZipCode.value = ''
    showAddZipModal.value = false
    markHasChanges()
  }
}

const removeZipCode = (index: number) => {
  if (business.value) {
    business.value.serviceArea.zipCodes.splice(index, 1)
    markHasChanges()
  }
}

const saveSettings = async () => {
  if (business.value) {
    await updateSettings('business', business.value)
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
  box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
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

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.logo-upload {
  margin-top: 0.5rem;
}

.logo-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid rgba(251, 191, 36, 0.3);
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.logo-remove:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.logo-placeholder {
  width: 200px;
  padding: 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}

.logo-placeholder:hover {
  border-color: rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.03);
}

.placeholder-icon {
  width: 2rem;
  height: 2rem;
  color: #666;
}

.logo-placeholder p {
  margin: 0;
  font-size: 0.875rem;
  color: #888;
}

.business-hours {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hours-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e5e5e5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.hours-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.day-name {
  width: 100px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #e5e5e5;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.time-separator {
  color: #666;
  font-size: 0.875rem;
}

.closed-label {
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
}

.zip-codes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.zip-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 0.5rem;
  color: #fbbf24;
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.zip-tag button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 50%;
  color: #fbbf24;
  cursor: pointer;
  transition: all 0.2s;
}

.zip-tag button:hover {
  background: rgba(0, 0, 0, 0.5);
}

.add-zip-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #888;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-zip-button:hover {
  border-color: rgba(251, 191, 36, 0.4);
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.05);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.modal-content {
  padding: 1.5rem;
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .hours-row {
    flex-wrap: wrap;
  }

  .time-inputs {
    width: 100%;
  }
}
</style>
