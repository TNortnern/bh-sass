<script setup lang="ts">
// Redirect to the actual profile settings page
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

// Immediate redirect on mount
onMounted(() => {
  navigateTo('/app/settings/profile')
})
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
  </div>
</template>
