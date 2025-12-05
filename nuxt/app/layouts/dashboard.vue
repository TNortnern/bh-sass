<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const { logout, currentUser, displayName, initials } = useAuth()

// Set dark mode as default
onMounted(() => {
  if (!colorMode.preference) {
    colorMode.preference = 'dark'
  }
})

// Mobile sidebar state
const isMobileSidebarOpen = ref(false)

// Navigation items
const navigationItems = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/app'
  },
  {
    label: 'Calendar',
    icon: 'i-lucide-calendar',
    to: '/app/calendar'
  },
  {
    label: 'Bookings',
    icon: 'i-lucide-clipboard-list',
    to: '/app/bookings'
  },
  {
    label: 'Inventory',
    icon: 'i-lucide-box',
    to: '/app/inventory'
  },
  {
    label: 'Categories',
    icon: 'i-lucide-tags',
    to: '/app/categories'
  },
  {
    label: 'Add-ons',
    icon: 'i-lucide-plus-circle',
    to: '/app/addons'
  },
  {
    label: 'Bundles',
    icon: 'i-lucide-package',
    to: '/app/bundles'
  },
  {
    label: 'Customers',
    icon: 'i-lucide-users',
    to: '/app/customers'
  },
  {
    label: 'Documents',
    icon: 'i-lucide-file-text',
    to: '/app/documents'
  },
  {
    label: 'Contracts',
    icon: 'i-lucide-file-signature',
    to: '/app/contracts'
  },
  {
    label: 'Templates',
    icon: 'i-lucide-layout-template',
    to: '/app/templates'
  },
  {
    label: 'Maintenance',
    icon: 'i-lucide-wrench',
    to: '/app/maintenance'
  },
  {
    label: 'Reports',
    icon: 'i-lucide-bar-chart-3',
    to: '/app/reports'
  },
  {
    label: 'Widgets',
    icon: 'i-lucide-puzzle',
    to: '/app/widgets'
  },
  {
    label: 'Website',
    icon: 'i-lucide-globe',
    to: '/app/settings/website'
  },
  {
    label: 'Notifications',
    icon: 'i-lucide-bell',
    to: '/app/notifications'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/app/settings'
  }
]

// User dropdown items
const userDropdownItems = [
  [{
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/app/profile'
  }],
  [{
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/app/settings'
  }],
  [{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onSelect: () => logout()
  }]
]

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Check if route is active
const isActiveRoute = (path: string) => {
  if (path === '/app') {
    return route.path === '/app'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

// Close mobile sidebar when route changes
watch(() => route.path, () => {
  isMobileSidebarOpen.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Toast notifications -->
    <UToaster />
    <!-- Mobile sidebar overlay -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
      @click="isMobileSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col"
      :class="isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
          <UIcon name="i-lucide-tent" class="w-5 h-5 text-white" />
        </div>
        <span class="text-xl font-bold text-gray-900 dark:text-white">BouncePro</span>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1 flex-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :class="isActiveRoute(item.to)
            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        >
          <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'top-start' }">
          <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                {{ initials || 'BP' }}
              </div>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ displayName || 'BouncePro Demo' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ currentUser?.email || 'demo@bouncepro.com' }}</p>
            </div>
            <UIcon name="i-lucide-chevron-up" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        </UDropdownMenu>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Navbar -->
      <header class="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <!-- Left: Mobile menu button -->
          <div class="flex items-center gap-4">
            <UButton
              color="neutral"
              variant="ghost"
              size="lg"
              icon="i-lucide-menu"
              class="lg:hidden"
              @click="isMobileSidebarOpen = !isMobileSidebarOpen"
            />

            <!-- Search -->
            <div class="hidden sm:block">
              <DashboardGlobalSearch />
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2">
            <!-- Dark mode toggle -->
            <UButton
              color="neutral"
              variant="ghost"
              size="lg"
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              @click="toggleColorMode"
            />

            <!-- Notifications -->
            <DashboardNotificationsDropdown />

            <!-- User dropdown -->
            <UDropdownMenu :items="userDropdownItems" :popper="{ placement: 'bottom-end' }">
              <UButton
                color="neutral"
                variant="ghost"
                size="lg"
                class="flex items-center gap-2"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-xs">
                  {{ initials || 'BP' }}
                </div>
              </UButton>
            </UDropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <!-- Breadcrumbs -->
        <div class="mb-6">
          <DashboardBreadcrumbs />
        </div>

        <slot />
      </main>
    </div>
  </div>
</template>
