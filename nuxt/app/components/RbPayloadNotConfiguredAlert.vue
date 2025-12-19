<script setup lang="ts">
/**
 * Alert shown when a bh-saas tenant is not linked to an rb-payload tenant
 *
 * This can happen when:
 * - rb-payload provisioning failed during tenant creation
 * - The tenant was created before rb-payload integration was set up
 * - The rb-payload tenant was manually deleted
 */

const props = defineProps<{
  syncStatus?: 'pending' | 'provisioned' | 'failed' | null
  syncError?: string | null
}>()

const emit = defineEmits<{
  (e: 'retry-complete'): void
}>()

const toast = useToast()
const { tenant, fetchTenant } = useTenant()
const isRetrying = ref(false)

const retrySetup = async () => {
  if (!tenant.value?.id) {
    toast.add({
      title: 'Error',
      description: 'Could not determine your account ID. Please refresh the page.',
      color: 'error'
    })
    return
  }

  isRetrying.value = true

  try {
    await $fetch(`/v1/admin/tenants/${tenant.value.id}/sync-rb-payload`, {
      method: 'POST',
      credentials: 'include'
    })

    toast.add({
      title: 'Setup Complete',
      description: 'Your booking system has been configured successfully!',
      color: 'success'
    })

    // Refresh tenant data to update the sync status
    await fetchTenant()
    emit('retry-complete')
  } catch (err: unknown) {
    const error = err as { data?: { error?: string } }
    toast.add({
      title: 'Setup Failed',
      description: error.data?.error || 'Failed to configure booking system. Please try again or contact support.',
      color: 'error'
    })
  } finally {
    isRetrying.value = false
  }
}

// Determine if retry is available (not pending, and not already provisioned)
const canRetry = computed(() => {
  return props.syncStatus !== 'pending' && props.syncStatus !== 'provisioned'
})
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <UCard class="max-w-lg w-full">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-settings"
              class="text-amber-600 dark:text-amber-400 text-xl"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Booking System Not Configured
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Your account needs additional setup
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Your business account is not yet connected to the booking system. This connection is required for:
        </p>

        <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center gap-2">
            <UIcon
              name="i-lucide-calendar"
              class="text-gray-400"
            />
            Booking widget on your website
          </li>
          <li class="flex items-center gap-2">
            <UIcon
              name="i-lucide-package"
              class="text-gray-400"
            />
            Syncing inventory to the booking engine
          </li>
          <li class="flex items-center gap-2">
            <UIcon
              name="i-lucide-users"
              class="text-gray-400"
            />
            Customer self-service bookings
          </li>
        </ul>

        <!-- Show specific status/error info -->
        <div
          v-if="syncStatus === 'failed' && syncError"
          class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
        >
          <p class="text-sm text-red-900 dark:text-red-100">
            <span class="font-semibold">Configuration failed:</span> {{ syncError }}
          </p>
        </div>

        <div
          v-else-if="syncStatus === 'pending'"
          class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p class="text-sm text-blue-900 dark:text-blue-100">
            <span class="font-semibold">Setup in progress:</span> Your booking system is being configured. This usually takes a few minutes.
          </p>
        </div>

        <div
          v-else
          class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
        >
          <p class="text-sm text-amber-900 dark:text-amber-100">
            <span class="font-semibold">Action needed:</span> Click the button below to set up your booking system.
          </p>
        </div>

        <div class="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <!-- Retry Setup Button -->
          <UButton
            v-if="canRetry"
            color="primary"
            block
            :loading="isRetrying"
            :disabled="isRetrying"
            @click="retrySetup"
          >
            <UIcon
              v-if="!isRetrying"
              name="i-lucide-refresh-cw"
              class="w-4 h-4 mr-2"
            />
            {{ isRetrying ? 'Setting up...' : 'Set Up Booking System' }}
          </UButton>

          <div class="flex gap-3">
            <UButton
              color="neutral"
              block
              to="/app/settings"
              variant="outline"
            >
              View Settings
            </UButton>
            <UButton
              color="neutral"
              block
              as="a"
              href="mailto:support@bouncepro.com?subject=Booking%20System%20Setup%20Request"
              target="_blank"
              variant="outline"
            >
              Contact Support
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
