<script setup lang="ts">
interface Props {
  data: {
    logo?: string
    businessName: string
    links: Array<{ id: string, label: string, href: string }>
    ctaText?: string
    ctaLink?: string
    transparent?: boolean
  }
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

const showImagePicker = ref(false)
const isHoveringLogo = ref(false)
const mobileMenuOpen = ref(false)

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

const handleLogoUpdate = (url: string) => {
  emit('update', 'logo', url)
  showImagePicker.value = false
}
</script>

<template>
  <nav
    class="navigation-bar"
    :class="{ transparent: data.transparent }"
  >
    <div class="nav-container">
      <!-- Logo / Business Name -->
      <div class="nav-brand">
        <div
          v-if="data.logo"
          class="logo-wrapper"
          :class="{ 'edit-mode': editable }"
          @mouseenter="isHoveringLogo = true"
          @mouseleave="isHoveringLogo = false"
          @click="editable && (showImagePicker = true)"
        >
          <img
            :src="data.logo"
            :alt="data.businessName"
            class="nav-logo"
          >
          <div
            v-if="editable && isHoveringLogo"
            class="logo-edit-overlay"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect
                width="18"
                height="18"
                x="3"
                y="3"
                rx="2"
                ry="2"
              />
              <circle
                cx="9"
                cy="9"
                r="2"
              />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        </div>
        <span
          class="brand-name"
          :contenteditable="editable"
          @blur="handleTextUpdate('businessName', $event)"
        >{{ data.businessName }}</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="nav-links">
        <a
          v-for="link in data.links"
          :key="link.id"
          :href="link.href"
          class="nav-link"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- CTA Button -->
      <div class="nav-actions">
        <a
          v-if="data.ctaText"
          :href="data.ctaLink || '#'"
          class="nav-cta"
        >
          <span
            :contenteditable="editable"
            @blur="handleTextUpdate('ctaText', $event)"
          >{{ data.ctaText }}</span>
        </a>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-btn"
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
            stroke-linecap="round"
            stroke-linejoin="round"
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
            stroke-linecap="round"
            stroke-linejoin="round"
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
        class="mobile-menu"
      >
        <a
          v-for="link in data.links"
          :key="link.id"
          :href="link.href"
          class="mobile-link"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </a>
        <a
          v-if="data.ctaText"
          :href="data.ctaLink || '#'"
          class="mobile-cta"
        >
          {{ data.ctaText }}
        </a>
      </div>
    </Transition>

    <!-- Image Picker Modal -->
    <WebsiteSectionsImagePicker
      :model-value="data.logo || ''"
      :open="showImagePicker"
      @update:model-value="handleLogoUpdate"
      @update:open="showImagePicker = $event"
    />
  </nav>
</template>

<style scoped>
.navigation-bar {
  position: relative;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.navigation-bar.transparent {
  background: transparent;
  border-bottom: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navigation-bar.transparent .nav-link,
.navigation-bar.transparent .brand-name {
  color: white;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.logo-wrapper.edit-mode {
  cursor: pointer;
}

.nav-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
}

.brand-name:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover {
  color: #111;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background: #111;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s;
}

.nav-cta:hover {
  background: #333;
  transform: translateY(-1px);
}

.nav-cta span:focus {
  outline: 2px dashed white;
  outline-offset: 2px;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #111;
  cursor: pointer;
}

.transparent .mobile-menu-btn {
  color: white;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.mobile-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.mobile-link:hover {
  background: #f5f5f5;
  color: #111;
}

.mobile-cta {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: #111;
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
  .nav-links {
    display: none;
  }

  .nav-cta {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
