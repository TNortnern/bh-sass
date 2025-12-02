<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-[#e5e5e5]">
    <!-- Header -->
    <div class="px-6 lg:px-12 pt-8 lg:pt-10 pb-6 lg:pb-8 border-b border-gray-200 dark:border-[#1a1a1a] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#0f0f0f] dark:to-[#0a0a0a] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
      <div class="flex-1">
        <h1 class="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Settings</h1>
        <p class="text-sm lg:text-base text-gray-600 dark:text-[#888] tracking-wide">Manage your account and application preferences</p>
      </div>
      <div v-if="hasUnsavedChanges" class="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 text-sm font-medium">
        <div class="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse"></div>
        <span>Unsaved changes</span>
      </div>
    </div>

    <!-- Navigation & Content -->
    <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 min-h-[calc(100vh-180px)]">
      <!-- Sidebar Navigation -->
      <nav class="bg-gray-50 dark:bg-[#0a0a0a] border-r-0 lg:border-r border-b lg:border-b-0 border-gray-200 dark:border-[#1a1a1a] p-4 lg:p-6 flex flex-col gap-1 relative">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex items-center gap-4 px-5 py-4 rounded-[10px] bg-transparent border border-transparent text-gray-600 dark:text-[#888] no-underline transition-all duration-200 relative overflow-hidden hover:bg-amber-50 dark:hover:bg-amber-500/5 hover:border-amber-200 dark:hover:border-amber-500/10 hover:text-gray-900 dark:hover:text-[#e5e5e5] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-amber-500 dark:before:bg-amber-400 before:scale-y-0 before:transition-transform before:duration-200"
          active-class="!bg-amber-100 dark:!bg-amber-500/8 !border-amber-200 dark:!border-amber-500/20 !text-amber-600 dark:!text-amber-400 before:!scale-y-100"
        >
          <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05] flex-shrink-0 transition-all duration-200">
            <UIcon :name="tab.icon" class="w-5 h-5" />
          </div>
          <div class="flex-1 flex flex-col gap-0.5 min-w-0">
            <span class="text-[15px] font-semibold tracking-tight">{{ tab.label }}</span>
            <span class="text-[13px] text-gray-500 dark:text-[#666] leading-snug transition-colors duration-200">{{ tab.description }}</span>
          </div>
          <div class="flex items-center justify-center opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </div>
        </NuxtLink>

        <!-- Grid pattern overlay -->
        <div class="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-50" style="background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, transparent 1px, transparent 40px, rgba(0,0,0,0.015) 41px), repeating-linear-gradient(90deg, rgba(0,0,0,0.015) 0px, transparent 1px, transparent 40px, rgba(0,0,0,0.015) 41px);"></div>
      </nav>

      <!-- Content Area -->
      <div class="bg-gray-50 dark:bg-[#0a0a0a] px-6 lg:px-12 py-8 lg:py-10 overflow-y-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const route = useRoute()
const { hasUnsavedChanges, fetchSettings } = useSettings()

const tabs = [
  {
    label: 'Profile',
    description: 'Business details and contact info',
    icon: 'i-heroicons-building-storefront',
    to: '/app/settings/profile',
  },
  {
    label: 'Booking',
    description: 'Rental policies and requirements',
    icon: 'i-heroicons-calendar-days',
    to: '/app/settings/booking',
  },
  {
    label: 'Payments',
    description: 'Stripe and payment settings',
    icon: 'i-heroicons-credit-card',
    to: '/app/settings/payments',
  },
  {
    label: 'Team',
    description: 'Manage team members and roles',
    icon: 'i-heroicons-user-group',
    to: '/app/settings/team',
  },
  {
    label: 'Notifications',
    description: 'Email and alert preferences',
    icon: 'i-heroicons-bell',
    to: '/app/settings/notifications',
  },
  {
    label: 'API Keys',
    description: 'API access and webhooks',
    icon: 'i-heroicons-key',
    to: '/app/settings/api',
  },
]

// Load settings on mount
onMounted(() => {
  fetchSettings()
})

// Redirect to profile if on base settings page
onMounted(() => {
  if (route.path === '/app/settings') {
    navigateTo('/app/settings/profile')
  }
})

// Warn before leaving if unsaved changes
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    )
    if (!answer) return false
  }
})
</script>
