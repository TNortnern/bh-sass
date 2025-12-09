<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const toast = useToast()

// Fetch platform settings
const { data: settings, pending, refresh } = useLazyFetch('/v1/globals/platform-settings', {
  credentials: 'include',
  headers: useRequestHeaders(['cookie'])
})

// Form state
const maintenanceEnabled = ref(false)
const maintenanceMessage = ref('')
const maintenanceEndTime = ref<string | null>(null)
const allowedIPs = ref<{ ip: string }[]>([])
const saving = ref(false)

// Watch settings data and populate form
watch(settings, (newSettings) => {
  if (newSettings) {
    const maintenanceMode = (newSettings as { maintenanceMode?: { enabled?: boolean, message?: string, endTime?: string | null, allowedIPs?: { ip: string }[] } }).maintenanceMode
    maintenanceEnabled.value = maintenanceMode?.enabled || false
    maintenanceMessage.value = maintenanceMode?.message || 'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!'
    maintenanceEndTime.value = maintenanceMode?.endTime || null
    allowedIPs.value = maintenanceMode?.allowedIPs || []
  }
}, { immediate: true })

// Add IP address
const addIP = () => {
  allowedIPs.value.push({ ip: '' })
}

// Remove IP address
const removeIP = (index: number) => {
  allowedIPs.value.splice(index, 1)
}

// Save settings
const saveSettings = async () => {
  saving.value = true
  try {
    await $fetch('/v1/globals/platform-settings', {
      method: 'POST',
      credentials: 'include',
      body: {
        maintenanceMode: {
          enabled: maintenanceEnabled.value,
          message: maintenanceMessage.value,
          endTime: maintenanceEndTime.value,
          allowedIPs: allowedIPs.value
        }
      }
    })

    toast.add({
      title: 'Settings saved',
      description: 'Platform settings have been updated successfully',
      color: 'success'
    })

    await refresh()
  } catch (err) {
    const error = err as { data?: { errors?: Array<{ message?: string }> } }
    console.error('Failed to save settings:', error)
    toast.add({
      title: 'Failed to save',
      description: error?.data?.errors?.[0]?.message || 'Could not save platform settings',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          System Settings
        </h1>
        <p class="page-description">
          Platform-wide configuration and maintenance
        </p>
      </div>
      <UButton
        icon="i-lucide-save"
        label="Save Settings"
        :loading="saving"
        @click="saveSettings"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="loading-state"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="loading-icon"
      />
      <p>Loading settings...</p>
    </div>

    <!-- Settings Form -->
    <div
      v-else
      class="settings-grid"
    >
      <!-- Maintenance Mode Card -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-content">
            <div class="header-icon maintenance">
              <UIcon
                name="i-lucide-construction"
                class="size-5"
              />
            </div>
            <div>
              <h3 class="card-title">
                Maintenance Mode
              </h3>
              <p class="card-description">
                Control platform-wide maintenance mode
              </p>
            </div>
          </div>
          <UToggle v-model="maintenanceEnabled" />
        </div>

        <div
          v-if="maintenanceEnabled"
          class="card-body"
        >
          <!-- Maintenance Message -->
          <div class="form-group">
            <label class="form-label">Maintenance Message</label>
            <p class="form-hint">
              Message displayed to users during maintenance
            </p>
            <UTextarea
              v-model="maintenanceMessage"
              :rows="4"
              placeholder="Enter maintenance message..."
              class="w-full"
            />
          </div>

          <!-- End Time -->
          <div class="form-group">
            <label class="form-label">Expected End Time (Optional)</label>
            <p class="form-hint">
              When maintenance is expected to complete
            </p>
            <UInput
              v-model="maintenanceEndTime"
              type="datetime-local"
              icon="i-lucide-calendar"
              class="w-full"
            />
          </div>

          <!-- Allowed IPs -->
          <div class="form-group">
            <label class="form-label">Allowed IP Addresses (Optional)</label>
            <p class="form-hint">
              IP addresses that can access during maintenance
            </p>

            <div
              v-if="allowedIPs.length"
              class="ip-list"
            >
              <div
                v-for="(item, index) in allowedIPs"
                :key="index"
                class="ip-item"
              >
                <UInput
                  v-model="item.ip"
                  placeholder="192.168.1.1"
                  icon="i-lucide-globe"
                  class="flex-1"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeIP(index)"
                />
              </div>
            </div>

            <UButton
              icon="i-lucide-plus"
              label="Add IP Address"
              variant="outline"
              size="sm"
              @click="addIP"
            />
          </div>

          <!-- Warning Banner -->
          <div class="warning-banner">
            <UIcon
              name="i-lucide-alert-triangle"
              class="size-5"
            />
            <div>
              <p class="warning-title">
                Maintenance Mode Active
              </p>
              <p class="warning-text">
                All non-super-admin users will be redirected to the maintenance page.
                You can still access the admin panel as a super admin.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Future: System Health Monitoring -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-content">
            <div class="header-icon health">
              <UIcon
                name="i-lucide-activity"
                class="size-5"
              />
            </div>
            <div>
              <h3 class="card-title">
                System Health
              </h3>
              <p class="card-description">
                Monitor platform performance
              </p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="placeholder">
            <UIcon
              name="i-lucide-activity"
              class="placeholder-icon"
            />
            <p class="placeholder-text">
              System monitoring coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1920px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
  margin: 0;
}

.page-description {
  font-size: 0.9375rem;
  color: #737373;
  margin: 0.5rem 0 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #737373;
}

.loading-icon {
  font-size: 3rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  background: rgba(23, 23, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon.maintenance {
  background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.header-icon.health {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-description {
  font-size: 0.875rem;
  color: #737373;
  margin: 0.25rem 0 0;
}

.card-body {
  padding: 1.5rem;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #e5e5e5;
  margin-bottom: 0.375rem;
}

.form-hint {
  font-size: 0.8125rem;
  color: #737373;
  margin-bottom: 0.75rem;
}

/* IP List */
.ip-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ip-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* Warning Banner */
.warning-banner {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  color: #fbbf24;
  margin-top: 1.5rem;
}

.warning-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.warning-text {
  font-size: 0.8125rem;
  color: #a3a3a3;
  margin: 0;
}

/* Placeholder */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.placeholder-icon {
  font-size: 3rem;
  color: #404040;
  margin-bottom: 0.75rem;
}

.placeholder-text {
  font-size: 1rem;
  color: #737373;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
