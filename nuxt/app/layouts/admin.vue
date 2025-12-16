<script setup lang="ts">
const colorMode = useColorMode()
const { currentUser, logout } = useAuth()
const { isImpersonating, impersonatedTenant, stopImpersonation } = useImpersonation()

const route = useRoute()

// Set dark mode as default
onMounted(() => {
  if (!colorMode.preference) {
    colorMode.preference = 'dark'
  }
})

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navigation = [
  {
    label: 'Platform Overview',
    icon: 'i-lucide-layout-dashboard',
    to: '/app/admin'
  },
  {
    label: 'Tenants',
    icon: 'i-lucide-building-2',
    to: '/app/admin/tenants'
  },
  {
    label: 'Bookings',
    icon: 'i-lucide-calendar',
    to: '/app/admin/bookings'
  },
  {
    label: 'Users',
    icon: 'i-lucide-users',
    to: '/app/admin/users'
  },
  {
    label: 'API Keys',
    icon: 'i-lucide-key',
    to: '/app/admin/api-keys'
  },
  {
    label: 'Plans',
    icon: 'i-lucide-package',
    to: '/app/admin/plans'
  },
  {
    label: 'Subscriptions',
    icon: 'i-lucide-credit-card',
    to: '/app/admin/subscriptions'
  },
  {
    label: 'Revenue',
    icon: 'i-lucide-trending-up',
    to: '/app/admin/revenue'
  },
  {
    label: 'System Settings',
    icon: 'i-lucide-settings',
    to: '/app/admin/system'
  },
  {
    label: 'Audit Log',
    icon: 'i-lucide-file-text',
    to: '/app/admin/audit'
  }
]

const isActive = (path: string) => {
  if (path === '/app/admin') {
    return route.path === '/app/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
    <UToaster />

    <!-- Impersonation Banner -->
    <div
      v-if="isImpersonating"
      class="bg-gradient-to-r from-amber-500 to-red-600 border-b-2 border-white/20 backdrop-blur-sm sticky top-0 z-[100] animate-slideDown"
    >
      <div class="max-w-[1920px] mx-auto px-6">
        <div class="flex items-center justify-between py-3.5">
          <div class="flex items-center gap-3 text-white text-sm font-medium">
            <UIcon
              name="i-lucide-eye"
              class="size-5"
            />
            <span>
              Viewing as: <strong class="font-bold">{{ impersonatedTenant?.name }}</strong>
            </span>
          </div>
          <UButton
            color="neutral"
            variant="solid"
            size="sm"
            label="Exit Impersonation"
            icon="i-lucide-log-out"
            @click="() => { stopImpersonation() }"
          />
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-[280px_1fr] min-h-screen">
      <!-- Sidebar -->
      <aside class="bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-white/[0.08] flex flex-col sticky top-0 h-screen overflow-y-auto">
        <!-- Platform Branding -->
        <div class="p-6 pb-4 border-b border-gray-200 dark:border-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <UIcon
                name="i-lucide-shield-check"
                class="size-6"
              />
            </div>
            <div class="flex-1">
              <div class="text-xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                BouncePro
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                Platform Admin
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 flex flex-col gap-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3.5 px-4 py-3 rounded-lg text-gray-500 dark:text-gray-400 text-sm font-medium transition-all duration-200 relative overflow-hidden hover:bg-gray-100 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-gray-100 hover:translate-x-0.5"
            :class="{
              'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-white ring-1 ring-blue-500/30': isActive(item.to)
            }"
          >
            <span
              v-if="isActive(item.to)"
              class="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 rounded-r"
            />
            <UIcon
              :name="item.icon"
              class="size-5 flex-shrink-0"
            />
            <span class="flex-1">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-white/[0.06] flex items-center gap-3">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-amber-500/25">
              <UIcon
                name="i-lucide-shield"
                class="size-4"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ currentUser?.email }}
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                Super Admin
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="toggleColorMode"
            />
            <UButton
              icon="i-lucide-log-out"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="async () => { await logout() }"
            />
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="bg-gray-50 dark:bg-[#0a0a0a] min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid-cols-\[280px_1fr\] {
    grid-template-columns: 1fr;
  }
}
</style>
