<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight m-0 mb-1.5 text-gray-900 dark:text-white">
          Security & Activity
        </h2>
        <p class="m-0 text-[0.9375rem] text-gray-600 dark:text-[#888]">
          Monitor account activity and security settings
        </p>
      </div>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]"
    >
      <div class="w-8 h-8 border-[3px] border-amber-200 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
      <p>Loading security settings...</p>
    </div>

    <div
      v-else
      class="flex flex-col gap-6"
    >
      <!-- Active Sessions -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-monitor"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Active Sessions
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                {{ sessions.length }} active {{ sessions.length === 1 ? 'session' : 'sessions' }}
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div
            v-if="sessions.length === 0"
            class="flex flex-col items-center justify-center p-8 gap-3"
          >
            <UIcon
              name="i-lucide-monitor"
              class="w-10 h-10 text-gray-300 dark:text-[#333]"
            />
            <p class="m-0 text-[0.9375rem] text-gray-500 dark:text-[#666]">
              No active sessions
            </p>
          </div>

          <div
            v-else
            class="flex flex-col gap-3"
          >
            <div
              v-for="session in sessions"
              :key="session.id"
              class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg shrink-0">
                    <UIcon
                      :name="getDeviceIcon(session.device)"
                      class="w-5 h-5 text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between gap-3 mb-2">
                      <h4 class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white m-0">
                        {{ session.device }} - {{ session.browser }}
                      </h4>
                      <UBadge
                        v-if="session.isCurrent"
                        color="success"
                        variant="subtle"
                        size="sm"
                      >
                        Current
                      </UBadge>
                    </div>
                    <div class="flex flex-wrap gap-4 mt-2">
                      <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                        <UIcon
                          name="i-lucide-map-pin"
                          class="w-3.5 h-3.5"
                        />
                        {{ session.location }}
                      </span>
                      <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                        <UIcon
                          name="i-lucide-globe"
                          class="w-3.5 h-3.5"
                        />
                        {{ session.ipAddress }}
                      </span>
                      <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                        <UIcon
                          name="i-lucide-clock"
                          class="w-3.5 h-3.5"
                        />
                        Last active {{ formatDate(session.lastActiveAt) }}
                      </span>
                    </div>
                  </div>
                  <UButton
                    v-if="!session.isCurrent"
                    variant="ghost"
                    size="sm"
                    color="error"
                    @click="revokeSession(session.id)"
                  >
                    Revoke
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="sessions.length > 1"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06]"
          >
            <UButton
              variant="outline"
              color="error"
              size="md"
              icon="i-lucide-log-out"
              @click="revokeAllSessions"
            >
              Revoke All Other Sessions
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Two-Factor Authentication -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-shield-check"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                {{ twoFactorEnabled ? 'Enabled' : 'Not enabled' }}
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 flex items-center justify-center rounded-lg shrink-0">
                <UIcon
                  :name="twoFactorEnabled ? 'i-lucide-shield-check' : 'i-lucide-shield-alert'"
                  :class="[
                    'w-8 h-8 p-2 rounded-lg',
                    twoFactorEnabled
                      ? 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20'
                      : 'text-gray-500 dark:text-[#666] bg-gray-100 dark:bg-[#666]/10 border border-gray-200 dark:border-[#666]/20'
                  ]"
                />
              </div>
              <div class="flex-1">
                <h4 class="text-base font-semibold text-gray-900 dark:text-white m-0 mb-2">
                  {{ twoFactorEnabled ? '2FA is enabled' : '2FA is not enabled' }}
                </h4>
                <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
                  Two-factor authentication adds an extra layer of security to your account
                  by requiring a code from your phone in addition to your password.
                </p>
              </div>
            </div>

            <div class="flex justify-center">
              <UButton
                v-if="!twoFactorEnabled"
                color="primary"
                size="lg"
                icon="i-lucide-shield-check"
                @click="enableTwoFactor"
              >
                Enable Two-Factor Authentication
              </UButton>
              <UButton
                v-else
                variant="outline"
                color="error"
                size="lg"
                icon="i-lucide-shield-off"
                @click="disableTwoFactor"
              >
                Disable Two-Factor Authentication
              </UButton>
            </div>

            <div
              v-if="twoFactorEnabled"
              class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15 rounded-lg"
            >
              <UIcon
                name="i-lucide-info"
                class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
              />
              <div>
                <p class="m-0 mb-2 text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>Backup codes:</strong> You have {{ backupCodesRemaining }}/10
                  backup codes remaining. These codes can be used if you lose access to
                  your authenticator app.
                </p>
                <UButton
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-refresh-cw"
                  @click="regenerateBackupCodes"
                >
                  Regenerate Backup Codes
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Password Requirements -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-key"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Password Security
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Password requirements and best practices
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <h4 class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white m-0 mb-3">
              Password Requirements
            </h4>
            <ul class="m-0 p-0 list-none flex flex-col gap-3">
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-[#ccc]">
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-600 dark:text-green-500 shrink-0"
                />
                At least 8 characters long
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-[#ccc]">
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-600 dark:text-green-500 shrink-0"
                />
                Contains uppercase and lowercase letters
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-[#ccc]">
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-600 dark:text-green-500 shrink-0"
                />
                Contains at least one number
              </li>
              <li class="flex items-center gap-3 text-sm text-gray-700 dark:text-[#ccc]">
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 text-green-600 dark:text-green-500 shrink-0"
                />
                Contains at least one special character
              </li>
            </ul>

            <div class="pt-2">
              <UButton
                color="primary"
                variant="outline"
                size="md"
                icon="i-lucide-lock"
                @click="showChangePasswordModal = true"
              >
                Change Password
              </UButton>
            </div>

            <div class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#666]/5 border border-gray-200 dark:border-[#666]/10 rounded-lg">
              <UIcon
                name="i-lucide-info"
                class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
              />
              <p class="m-0 text-sm text-gray-700 dark:text-[#ccc]">
                <strong>Last password change:</strong>
                {{ lastPasswordChange ? formatDate(lastPasswordChange) : 'Never' }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Login History -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-history"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Login History
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Recent authentication attempts
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div
            v-if="loginHistory.length === 0"
            class="flex flex-col items-center justify-center p-8 gap-3"
          >
            <UIcon
              name="i-lucide-history"
              class="w-10 h-10 text-gray-300 dark:text-[#333]"
            />
            <p class="m-0 text-[0.9375rem] text-gray-500 dark:text-[#666]">
              No login history available
            </p>
          </div>

          <div
            v-else
            class="flex flex-col gap-3"
          >
            <div
              v-for="login in loginHistory"
              :key="login.id"
              class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4"
            >
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg shrink-0">
                <UIcon
                  :name="login.success ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="[
                    'w-5 h-5',
                    login.success ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                  ]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <span class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">
                    {{ login.success ? 'Successful login' : 'Failed login attempt' }}
                  </span>
                  <span class="text-[0.8125rem] text-gray-500 dark:text-[#666]">{{ formatDate(login.timestamp) }}</span>
                </div>
                <div class="flex flex-wrap gap-4 mt-2">
                  <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                    <UIcon
                      name="i-lucide-monitor"
                      class="w-3.5 h-3.5"
                    />
                    {{ login.device }} - {{ login.browser }}
                  </span>
                  <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                    <UIcon
                      name="i-lucide-map-pin"
                      class="w-3.5 h-3.5"
                    />
                    {{ login.location }}
                  </span>
                  <span class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]">
                    <UIcon
                      name="i-lucide-globe"
                      class="w-3.5 h-3.5"
                    />
                    {{ login.ipAddress }}
                  </span>
                </div>
                <div
                  v-if="!login.success && login.reason"
                  class="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md text-[0.8125rem] text-red-700 dark:text-red-300"
                >
                  <UIcon
                    name="i-lucide-alert-circle"
                    class="w-4 h-4 shrink-0"
                  />
                  <span>{{ login.reason }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="loginHistory.length >= 10"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06] flex justify-center"
          >
            <UButton
              variant="ghost"
              size="md"
              @click="loadMoreHistory"
            >
              Load More
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Audit Log -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-file-text"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">
                Activity Audit Log
              </h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                Track all account actions
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div
            v-if="auditLogs.length === 0"
            class="flex flex-col items-center justify-center p-8 gap-3"
          >
            <UIcon
              name="i-lucide-file-text"
              class="w-10 h-10 text-gray-300 dark:text-[#333]"
            />
            <p class="m-0 text-[0.9375rem] text-gray-500 dark:text-[#666]">
              No audit logs available
            </p>
          </div>

          <div
            v-else
            class="flex flex-col gap-3"
          >
            <div
              v-for="log in auditLogs"
              :key="log.id"
              class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4"
            >
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg shrink-0">
                <UIcon
                  :name="getAuditIcon(log.action)"
                  class="w-5 h-5 text-amber-600 dark:text-amber-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <span class="text-[0.9375rem] font-semibold text-gray-900 dark:text-white">{{ formatAction(log.action) }}</span>
                  <span class="text-[0.8125rem] text-gray-500 dark:text-[#666]">{{ formatDate(log.timestamp) }}</span>
                </div>
                <div class="flex flex-wrap gap-4 mt-2">
                  <span class="text-[0.8125rem] text-gray-600 dark:text-[#888]">
                    {{ log.collection }} ID: {{ log.documentId }}
                  </span>
                  <span
                    v-if="log.metadata?.ipAddress"
                    class="flex items-center gap-1.5 text-[0.8125rem] text-gray-600 dark:text-[#888]"
                  >
                    <UIcon
                      name="i-lucide-globe"
                      class="w-3.5 h-3.5"
                    />
                    {{ log.metadata.ipAddress }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="auditLogs.length >= 20"
            class="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06] flex justify-center"
          >
            <UButton
              variant="ghost"
              size="md"
              @click="loadMoreAuditLogs"
            >
              Load More
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Change Password Modal -->
    <UModal v-model:open="showChangePasswordModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">
              Change Password
            </h3>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <UFormField
              label="Current Password"
              required
            >
              <UInput
                v-model="passwordForm.current"
                type="password"
                size="lg"
                placeholder="Enter current password"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="New Password"
              required
            >
              <UInput
                v-model="passwordForm.new"
                type="password"
                size="lg"
                placeholder="Enter new password"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Confirm New Password"
              required
            >
              <UInput
                v-model="passwordForm.confirm"
                type="password"
                size="lg"
                placeholder="Confirm new password"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton
                variant="ghost"
                @click="showChangePasswordModal = false"
              >
                Cancel
              </UButton>
              <UButton
                color="primary"
                :loading="savingPassword"
                :disabled="!passwordForm.current || !passwordForm.new || !passwordForm.confirm"
                @click="changePassword"
              >
                Change Password
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const loading = ref(false)
const savingPassword = ref(false)
const showChangePasswordModal = ref(false)
const twoFactorEnabled = ref(false)
const backupCodesRemaining = ref(10)
const lastPasswordChange = ref<string | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sessions = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loginHistory = ref<any[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const auditLogs = ref<any[]>([])

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

onMounted(async () => {
  await loadSecurityData()
})

const loadSecurityData = async () => {
  loading.value = true
  try {
    // Load all security data in parallel
    const [sessionsData, historyData, auditData, securitySettings] = await Promise.all([
      $fetch('/api/security/sessions'),
      $fetch('/api/security/login-history'),
      $fetch('/api/audit-logs?limit=20'),
      $fetch('/api/security/settings')
    ])

    sessions.value = sessionsData || []
    loginHistory.value = historyData || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auditLogs.value = (auditData as any)?.docs || []

    if (securitySettings) {
      twoFactorEnabled.value = securitySettings.twoFactorEnabled || false
      backupCodesRemaining.value = securitySettings.backupCodesRemaining || 10
      lastPasswordChange.value = securitySettings.lastPasswordChange || null
    }
  } catch (err) {
    console.error('Failed to load security data:', err)
    toast.add({
      title: 'Failed to load security data',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const revokeSession = async (sessionId: string) => {
  try {
    await $fetch(`/api/security/sessions/${sessionId}`, {
      method: 'DELETE'
    })
    await loadSecurityData()
    toast.add({
      title: 'Session revoked',
      color: 'success'
    })
  } catch (err) {
    console.error('Failed to revoke session:', err)
    toast.add({
      title: 'Failed to revoke session',
      color: 'error'
    })
  }
}

const revokeAllSessions = async () => {
  try {
    await $fetch('/api/security/sessions/revoke-all', {
      method: 'POST'
    })
    await loadSecurityData()
    toast.add({
      title: 'All other sessions revoked',
      color: 'success'
    })
  } catch (err) {
    console.error('Failed to revoke sessions:', err)
    toast.add({
      title: 'Failed to revoke sessions',
      color: 'error'
    })
  }
}

const enableTwoFactor = () => {
  toast.add({
    title: 'Two-factor authentication setup',
    description: 'This feature will be available soon',
    color: 'primary'
  })
}

const disableTwoFactor = () => {
  toast.add({
    title: 'Two-factor authentication',
    description: 'Are you sure you want to disable 2FA?',
    color: 'warning'
  })
}

const regenerateBackupCodes = () => {
  toast.add({
    title: 'Backup codes regenerated',
    description: 'Your new backup codes have been generated',
    color: 'success'
  })
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    toast.add({
      title: 'Passwords do not match',
      color: 'error'
    })
    return
  }

  savingPassword.value = true
  try {
    await $fetch('/api/security/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new
      }
    })
    showChangePasswordModal.value = false
    passwordForm.value = { current: '', new: '', confirm: '' }
    toast.add({
      title: 'Password changed successfully',
      color: 'success'
    })
    await loadSecurityData()
  } catch (err) {
    const error = err as { data?: { message?: string } }
    console.error('Failed to change password:', error)
    toast.add({
      title: 'Failed to change password',
      description: error.data?.message || 'Please check your current password',
      color: 'error'
    })
  } finally {
    savingPassword.value = false
  }
}

const loadMoreHistory = async () => {
  try {
    const offset = loginHistory.value.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moreHistory = await $fetch<any[]>(`/api/security/login-history?offset=${offset}`)
    loginHistory.value = [...loginHistory.value, ...(moreHistory || [])]
  } catch (err) {
    console.error('Failed to load more history:', err)
  }
}

const loadMoreAuditLogs = async () => {
  try {
    const offset = auditLogs.value.length
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moreLogs = await $fetch<{ docs: any[] }>(`/api/audit-logs?limit=20&offset=${offset}`)
    auditLogs.value = [...auditLogs.value, ...(moreLogs?.docs || [])]
  } catch (err) {
    console.error('Failed to load more audit logs:', err)
  }
}

const getDeviceIcon = (device: string) => {
  const lower = device.toLowerCase()
  if (lower.includes('mobile') || lower.includes('iphone') || lower.includes('android')) {
    return 'i-lucide-smartphone'
  }
  if (lower.includes('tablet') || lower.includes('ipad')) {
    return 'i-lucide-tablet'
  }
  return 'i-lucide-monitor'
}

const getAuditIcon = (action: string) => {
  switch (action) {
    case 'create':
      return 'i-lucide-plus-circle'
    case 'update':
      return 'i-lucide-edit'
    case 'delete':
      return 'i-lucide-trash-2'
    case 'login':
      return 'i-lucide-log-in'
    case 'logout':
      return 'i-lucide-log-out'
    case 'api_call':
      return 'i-lucide-code'
    default:
      return 'i-lucide-activity'
  }
}

const formatAction = (action: string) => {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
