<script setup lang="ts">
// Component uses Tailwind dark: variants for styling
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UCard class="max-w-md w-full">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-alert-circle"
              class="text-red-600 dark:text-red-400 text-xl"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Account Not Activated
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Tenant access required
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Your account hasn't been assigned to a business yet. To access booking, inventory, widget, and customer features, please contact support.
        </p>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-900 dark:text-blue-100">
            <span class="font-semibold">Need help?</span> Our support team will help you set up your business account and get you started.
          </p>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            color="primary"
            block
            to="/app"
            variant="outline"
          >
            Return to Dashboard
          </UButton>
          <UButton
            color="primary"
            block
            as="a"
            href="mailto:support@bouncepro.com"
            target="_blank"
          >
            Contact Support
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
