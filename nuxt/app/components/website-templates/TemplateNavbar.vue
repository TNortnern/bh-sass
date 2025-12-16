<script setup lang="ts">
/**
 * TemplateNavbar - Persistent navbar for website templates
 * Features: Logo, nav links, cart icon with count, Book Now CTA, mobile menu
 */
interface Props {
  businessName: string
  logoUrl?: string
  links?: Array<{ label: string, href: string }>
  theme?: 'light' | 'dark' | 'transparent'
  primaryColor?: string
  bookingUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [
    { label: 'Rentals', href: '#inventory' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ],
  theme: 'light',
  primaryColor: '#f59e0b',
  bookingUrl: '/book'
})

const mobileMenuOpen = ref(false)

// Get cart count from composable
const { itemCount } = useTemplateCart()

// Computed styles based on theme
const navStyles = computed(() => {
  const styles: Record<string, string> = {
    '--nav-primary': props.primaryColor
  }
  return styles
})
</script>

<template>
  <nav
    class="template-navbar"
    :class="[`theme-${theme}`]"
    :style="navStyles"
  >
    <div class="navbar-container">
      <!-- Logo / Brand -->
      <a
        href="/"
        class="navbar-brand"
      >
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="businessName"
          class="navbar-logo"
        >
        <span class="navbar-brand-text">{{ businessName }}</span>
      </a>

      <!-- Desktop Links -->
      <div class="navbar-links">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="navbar-link"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Actions -->
      <div class="navbar-actions">
        <!-- Cart Icon -->
        <a
          :href="`${bookingUrl}/checkout`"
          class="navbar-cart"
          title="View Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="8"
              cy="21"
              r="1"
            />
            <circle
              cx="19"
              cy="21"
              r="1"
            />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span
            v-if="itemCount > 0"
            class="cart-badge"
          >{{ itemCount }}</span>
        </a>

        <!-- Book Now CTA -->
        <a
          :href="bookingUrl"
          class="navbar-cta"
        >Book Now</a>

        <!-- Mobile Menu Toggle -->
        <button
          class="navbar-mobile-toggle"
          aria-label="Toggle menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg
            v-if="!mobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line
              x1="4"
              x2="20"
              y1="12"
              y2="12"
            />
            <line
              x1="4"
              x2="20"
              y1="6"
              y2="6"
            />
            <line
              x1="4"
              x2="20"
              y1="18"
              y2="18"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div
        v-if="mobileMenuOpen"
        class="navbar-mobile-menu"
      >
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="navbar-mobile-link"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </a>
        <a
          :href="bookingUrl"
          class="navbar-mobile-cta"
        >Book Now</a>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.template-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--navbar-bg, #ffffff);
  border-bottom: 1px solid var(--navbar-border, #e5e7eb);
  backdrop-filter: blur(12px);
}

.template-navbar.theme-dark {
  --navbar-bg: rgba(17, 17, 17, 0.95);
  --navbar-border: rgba(255, 255, 255, 0.1);
  --navbar-text: #ffffff;
  --navbar-text-muted: #a1a1aa;
}

.template-navbar.theme-light {
  --navbar-bg: rgba(255, 255, 255, 0.95);
  --navbar-border: #e5e7eb;
  --navbar-text: #111111;
  --navbar-text-muted: #6b7280;
}

.template-navbar.theme-transparent {
  position: absolute;
  left: 0;
  right: 0;
  background: transparent;
  border-bottom: none;
  --navbar-text: #ffffff;
  --navbar-text-muted: rgba(255, 255, 255, 0.7);
}

.navbar-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.navbar-brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--navbar-text, #111);
  letter-spacing: -0.02em;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--navbar-text-muted, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}

.navbar-link:hover {
  color: var(--navbar-text, #111);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--navbar-text-muted, #6b7280);
  transition: color 0.15s;
}

.navbar-cart:hover {
  color: var(--navbar-text, #111);
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--nav-primary, #f59e0b);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background: var(--nav-primary, #f59e0b);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s;
}

.navbar-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.navbar-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--navbar-text, #111);
  cursor: pointer;
}

.navbar-mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  background: var(--navbar-bg, white);
  border-top: 1px solid var(--navbar-border, #e5e7eb);
}

.navbar-mobile-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--navbar-text-muted, #6b7280);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.navbar-mobile-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--navbar-text, #111);
}

.navbar-mobile-cta {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--nav-primary, #f59e0b);
  color: white;
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-cta {
    display: none;
  }

  .navbar-mobile-toggle {
    display: flex;
  }

  .navbar-mobile-menu {
    display: flex;
  }
}
</style>
