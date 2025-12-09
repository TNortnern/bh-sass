<script setup lang="ts">
const { currentUser, logout } = useAuth()
const { isImpersonating, impersonatedTenant, stopImpersonation } = useImpersonation()

const route = useRoute()

const navigation = [
  {
    label: 'Platform Overview',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin'
  },
  {
    label: 'Tenants',
    icon: 'i-lucide-building-2',
    to: '/admin/tenants'
  },
  {
    label: 'Bookings',
    icon: 'i-lucide-calendar',
    to: '/admin/bookings'
  },
  {
    label: 'Users',
    icon: 'i-lucide-users',
    to: '/admin/users'
  },
  {
    label: 'API Keys',
    icon: 'i-lucide-key',
    to: '/admin/api-keys'
  },
  {
    label: 'Plans',
    icon: 'i-lucide-package',
    to: '/admin/plans'
  },
  {
    label: 'Subscriptions',
    icon: 'i-lucide-credit-card',
    to: '/admin/subscriptions'
  },
  {
    label: 'Revenue',
    icon: 'i-lucide-trending-up',
    to: '/admin/revenue'
  },
  {
    label: 'System Settings',
    icon: 'i-lucide-settings',
    to: '/admin/system'
  },
  {
    label: 'Audit Log',
    icon: 'i-lucide-file-text',
    to: '/admin/audit'
  }
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="admin-layout">
    <UToaster />
    <!-- Impersonation Banner -->
    <div
      v-if="isImpersonating"
      class="impersonation-banner"
    >
      <div class="container">
        <div class="banner-content">
          <div class="banner-info">
            <UIcon
              name="i-lucide-eye"
              class="size-5"
            />
            <span class="banner-text">
              Viewing as: <strong>{{ impersonatedTenant?.name }}</strong>
            </span>
          </div>
          <UButton
            color="neutral"
            variant="solid"
            size="sm"
            label="Exit Impersonation"
            icon="i-lucide-log-out"
            @click="stopImpersonation"
          />
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <!-- Platform Branding -->
        <div class="sidebar-header">
          <div class="platform-logo">
            <div class="logo-icon">
              <UIcon
                name="i-lucide-shield-check"
                class="size-6"
              />
            </div>
            <div class="logo-text">
              <div class="platform-name">
                BouncePro
              </div>
              <div class="platform-label">
                Platform Admin
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ active: isActive(item.to) }"
          >
            <UIcon
              :name="item.icon"
              class="nav-icon"
            />
            <span class="nav-label">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="admin-user">
            <div class="user-avatar">
              <UIcon
                name="i-lucide-shield"
                class="size-4"
              />
            </div>
            <div class="user-info">
              <div class="user-name">
                {{ currentUser?.email }}
              </div>
              <div class="user-role">
                Super Admin
              </div>
            </div>
          </div>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="logout"
          />
        </div>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Modern Admin Layout - Platform Command Center Aesthetic */

.admin-layout {
  min-height: 100vh;
  background: #0a0a0a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #e5e5e5;
}

/* Impersonation Banner */
.impersonation-banner {
  background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}

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

.container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 0;
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 500;
}

.banner-text strong {
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Admin Container */
.admin-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
}

/* Sidebar */
.admin-sidebar {
  background: linear-gradient(180deg, #111111 0%, #0d0d0d 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.platform-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.logo-text {
  flex: 1;
}

.platform-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.platform-label {
  font-size: 0.75rem;
  color: #737373;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.125rem;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: #a3a3a3;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  transform: translateX(-100%);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0 2px 2px 0;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #e5e5e5;
  transform: translateX(2px);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.12);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.nav-item.active::before {
  transform: translateX(0);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e5e5e5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 500;
}

/* Main Content */
.admin-main {
  background: #0a0a0a;
  min-height: 100vh;
  position: relative;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: fixed;
    left: -280px;
    transition: left 0.3s ease;
    z-index: 50;
  }

  .admin-sidebar.open {
    left: 0;
  }
}

/* Smooth scrollbar */
.admin-sidebar::-webkit-scrollbar {
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
