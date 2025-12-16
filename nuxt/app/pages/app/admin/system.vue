<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const toast = useToast()

// Fetch platform settings
const { data: settings, pending, error, refresh } = useLazyFetch('/v1/globals/platform-settings', {
  credentials: 'include',
  headers: useRequestHeaders(['cookie'])
})

// Handle fetch errors
watch(error, (newError) => {
  if (newError) {
    console.error('Failed to fetch platform settings:', newError)
    toast.add({
      title: 'Failed to load settings',
      description: 'Could not load platform settings. Please check your permissions.',
      color: 'error'
    })
  }
})

// Form state - Maintenance Mode
const maintenanceEnabled = ref(false)
const maintenanceMessage = ref('')
const maintenanceEndTime = ref<string | null>(null)
const allowedIPs = ref<{ ip: string }[]>([])

// Form state - Platform Announcements
const announcementEnabled = ref(false)
const announcementMessage = ref('')
const announcementType = ref('info')

const saving = ref(false)

// Platform settings type
interface PlatformSettings {
  maintenanceMode?: {
    enabled?: boolean
    message?: string
    endTime?: string | null
    allowedIPs?: { ip: string }[]
  }
  platformAnnouncements?: {
    enabled?: boolean
    message?: string
    type?: string
  }
}

// Watch settings data and populate form
watch(settings, (newSettings) => {
  if (newSettings) {
    const typedSettings = newSettings as PlatformSettings

    // Maintenance Mode
    const maintenanceMode = typedSettings.maintenanceMode
    maintenanceEnabled.value = maintenanceMode?.enabled || false
    maintenanceMessage.value = maintenanceMode?.message || 'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!'
    maintenanceEndTime.value = maintenanceMode?.endTime || null
    allowedIPs.value = maintenanceMode?.allowedIPs || []

    // Platform Announcements
    const announcements = typedSettings.platformAnnouncements
    announcementEnabled.value = announcements?.enabled || false
    announcementMessage.value = announcements?.message || ''
    announcementType.value = announcements?.type || 'info'
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
        },
        platformAnnouncements: {
          enabled: announcementEnabled.value,
          message: announcementMessage.value,
          type: announcementType.value
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

    <!-- Error State -->
    <div
      v-else-if="error"
      class="error-state"
    >
      <div class="error-icon-wrapper">
        <UIcon
          name="i-lucide-alert-circle"
          class="error-icon"
        />
      </div>
      <h3 class="error-title">
        Failed to Load Settings
      </h3>
      <p class="error-message">
        {{ error.message || 'An error occurred while loading platform settings.' }}
      </p>
      <UButton
        icon="i-lucide-refresh-cw"
        label="Retry"
        @click="() => refresh()"
      />
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

      <!-- Platform Announcements Card -->
      <div class="settings-card">
        <div class="card-header">
          <div class="header-content">
            <div class="header-icon announcements">
              <UIcon
                name="i-lucide-megaphone"
                class="size-5"
              />
            </div>
            <div>
              <h3 class="card-title">
                Platform Announcements
              </h3>
              <p class="card-description">
                Display banner messages to all users
              </p>
            </div>
          </div>
          <UToggle v-model="announcementEnabled" />
        </div>

        <div
          v-if="announcementEnabled"
          class="card-body"
        >
          <!-- Announcement Message -->
          <div class="form-group">
            <label class="form-label">Announcement Message</label>
            <p class="form-hint">
              Message displayed in banner across all pages
            </p>
            <UInput
              v-model="announcementMessage"
              placeholder="Enter announcement message..."
              class="w-full"
            />
          </div>

          <!-- Announcement Type -->
          <div class="form-group">
            <label class="form-label">Announcement Type</label>
            <p class="form-hint">
              Controls the banner color and icon
            </p>
            <USelect
              v-model="announcementType"
              :items="[
                { label: 'Info', value: 'info' },
                { label: 'Warning', value: 'warning' },
                { label: 'Success', value: 'success' },
                { label: 'Error', value: 'error' }
              ]"
              class="w-full"
            />
          </div>

          <!-- Preview Banner -->
          <div
            class="announcement-preview"
            :class="`announcement-${announcementType}`"
          >
            <UIcon
              :name="announcementType === 'info' ? 'i-lucide-info'
                : announcementType === 'warning' ? 'i-lucide-alert-triangle'
                  : announcementType === 'success' ? 'i-lucide-check-circle'
                    : 'i-lucide-alert-circle'"
              class="size-5"
            />
            <p class="announcement-text">
              {{ announcementMessage || 'Your announcement will appear here' }}
            </p>
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

<style>
/* Unscoped styles for proper dark mode support in Tailwind v4 */
@reference "tailwindcss";

.admin-page {
  @apply p-8 max-w-[1920px] mx-auto;
}

.page-header {
  @apply flex justify-between items-start mb-8;
}

.page-title {
  @apply text-3xl font-bold tracking-tight m-0;
  color: rgb(17 24 39);
}
.dark .page-title {
  color: white;
}

.page-description {
  @apply text-sm mt-2 mb-0;
  color: rgb(107 114 128);
}
.dark .page-description {
  color: rgb(156 163 175);
}

/* Loading State */
.loading-state {
  @apply flex flex-col items-center justify-center py-16 gap-4;
  color: rgb(107 114 128);
}
.dark .loading-state {
  color: rgb(156 163 175);
}

.loading-icon {
  @apply text-5xl;
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

/* Error State */
.error-state {
  @apply flex flex-col items-center justify-center py-16 gap-4 text-center;
}

.error-icon-wrapper {
  @apply w-20 h-20 rounded-full flex items-center justify-center mb-2;
  background-color: rgb(254 226 226);
  border: 2px solid rgb(254 202 202);
}
.dark .error-icon-wrapper {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.error-icon {
  @apply text-4xl;
  color: rgb(239 68 68);
}
.dark .error-icon {
  color: rgb(248 113 113);
}

.error-title {
  @apply text-xl font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .error-title {
  color: white;
}

.error-message {
  @apply text-base max-w-md m-0 mb-6;
  color: rgb(107 114 128);
}
.dark .error-message {
  color: rgb(156 163 175);
}

/* Settings Grid */
.settings-grid {
  @apply grid gap-6;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

.settings-card {
  @apply rounded-xl overflow-hidden backdrop-blur-lg;
  background-color: white;
  border: 1px solid rgb(229 231 235);
}
.dark .settings-card {
  background-color: #161616;
  border-color: rgba(255, 255, 255, 0.08);
}

.card-header {
  @apply p-6 flex justify-between items-center;
  border-bottom: 1px solid rgb(229 231 235);
}
.dark .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.header-content {
  @apply flex items-center gap-4;
}

.header-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center text-white;
}

.header-icon.maintenance {
  @apply bg-gradient-to-br from-amber-500 to-red-600;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.header-icon.health {
  @apply bg-gradient-to-br from-emerald-500 to-emerald-600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.header-icon.announcements {
  @apply bg-gradient-to-br from-blue-500 to-blue-600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.card-title {
  @apply text-lg font-semibold m-0;
  color: rgb(17 24 39);
}
.dark .card-title {
  color: white;
}

.card-description {
  @apply text-sm mt-1 mb-0;
  color: rgb(107 114 128);
}
.dark .card-description {
  color: rgb(156 163 175);
}

.card-body {
  @apply p-6;
}

/* Form Groups */
.form-group {
  @apply mb-6 last:mb-0;
}

.form-label {
  @apply block text-sm font-semibold mb-1;
  color: rgb(55 65 81);
}
.dark .form-label {
  color: rgb(229 231 235);
}

.form-hint {
  @apply text-xs mb-3;
  color: rgb(107 114 128);
}
.dark .form-hint {
  color: rgb(156 163 175);
}

/* IP List */
.ip-list {
  @apply flex flex-col gap-3 mb-4;
}

.ip-item {
  @apply flex gap-3 items-center;
}

/* Warning Banner */
.warning-banner {
  @apply flex gap-4 p-4 rounded-lg mt-6;
  background-color: rgb(255 251 235);
  border: 1px solid rgb(253 230 138);
  color: rgb(217 119 6);
}
.dark .warning-banner {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: rgb(251 191 36);
}

.warning-title {
  @apply text-sm font-semibold m-0 mb-1;
}

.warning-text {
  @apply text-xs m-0;
  color: rgb(75 85 99);
}
.dark .warning-text {
  color: rgb(156 163 175);
}

/* Placeholder */
.placeholder {
  @apply flex flex-col items-center justify-center py-12;
}

.placeholder-icon {
  @apply text-5xl mb-3;
  color: rgb(209 213 219);
}
.dark .placeholder-icon {
  color: rgb(75 85 99);
}

.placeholder-text {
  @apply text-base m-0;
  color: rgb(107 114 128);
}
.dark .placeholder-text {
  color: rgb(156 163 175);
}

/* Announcement Preview */
.announcement-preview {
  @apply flex items-center gap-4 p-4 rounded-lg mt-4;
}

.announcement-text {
  @apply m-0 text-sm;
}

.announcement-preview.announcement-info {
  background-color: rgb(239 246 255);
  border: 1px solid rgb(191 219 254);
  color: rgb(37 99 235);
}
.dark .announcement-preview.announcement-info {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: rgb(96 165 250);
}

.announcement-preview.announcement-warning {
  background-color: rgb(255 251 235);
  border: 1px solid rgb(253 230 138);
  color: rgb(217 119 6);
}
.dark .announcement-preview.announcement-warning {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: rgb(251 191 36);
}

.announcement-preview.announcement-success {
  background-color: rgb(240 253 244);
  border: 1px solid rgb(187 247 208);
  color: rgb(22 163 74);
}
.dark .announcement-preview.announcement-success {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: rgb(74 222 128);
}

.announcement-preview.announcement-error {
  background-color: rgb(254 242 242);
  border: 1px solid rgb(254 202 202);
  color: rgb(220 38 38);
}
.dark .announcement-preview.announcement-error {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: rgb(248 113 113);
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-grid {
    @apply grid-cols-1;
  }
}
</style>
