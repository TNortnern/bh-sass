<script setup lang="ts">
/**
 * Alert shown when a bh-saas tenant is not linked to an rb-payload tenant
 *
 * This can happen when:
 * - rb-payload provisioning failed during tenant creation
 * - The tenant was created before rb-payload integration was set up
 * - The rb-payload tenant was manually deleted
 */

defineProps<{
  syncStatus?: 'pending' | 'provisioned' | 'failed' | null
  syncError?: string | null
}>()
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
            <span class="font-semibold">Action needed:</span> Please contact support to complete your booking system setup.
          </p>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            color="primary"
            block
            to="/app/settings"
            variant="outline"
          >
            View Settings
          </UButton>
          <UButton
            color="primary"
            block
            as="a"
            href="mailto:support@bouncepro.com?subject=Booking%20System%20Setup%20Request"
            target="_blank"
          >
            Contact Support
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
