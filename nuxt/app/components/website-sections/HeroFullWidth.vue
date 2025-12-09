<script setup lang="ts">
interface Props {
  data: {
    backgroundImage: string
    headline: string
    subheadline: string
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    trustBadges?: Array<{ icon: string, text: string }>
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

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

const handleImageUpdate = (url: string) => {
  emit('update', 'backgroundImage', url)
  showImagePicker.value = false
}

const openImagePicker = () => {
  showImagePicker.value = true
}

// Icon mapping for trust badges
const getIconSvg = (icon: string) => {
  const icons: Record<string, string> = {
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    truck: '<path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
  }
  return icons[icon] || icons.shield
}
</script>

<template>
  <section class="hero-fullwidth">
    <div
      class="hero-background"
      :class="{ 'edit-mode': editable }"
      :style="{ backgroundImage: `url(${data.backgroundImage})` }"
      @click="editable && openImagePicker()"
    >
      <div class="hero-overlay" />

      <!-- Edit indicator badge (always visible in edit mode) -->
      <div
        v-if="editable"
        class="edit-indicator"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
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
        <span>Edit Image</span>
      </div>
    </div>

    <!-- Image Picker Modal -->
    <WebsiteSectionsImagePicker
      :model-value="data.backgroundImage"
      :open="showImagePicker"
      @update:model-value="handleImageUpdate"
      @update:open="showImagePicker = $event"
    />

    <div class="hero-content">
      <h1
        class="hero-headline"
        :contenteditable="editable"
        @blur="handleTextUpdate('headline', $event)"
      >
        {{ data.headline }}
      </h1>

      <p
        class="hero-subheadline"
        :contenteditable="editable"
        @blur="handleTextUpdate('subheadline', $event)"
      >
        {{ data.subheadline }}
      </p>

      <div class="hero-buttons">
        <a
          v-if="data.primaryButtonText"
          :href="data.primaryButtonLink || '#'"
          class="hero-button primary"
        >
          <span
            :contenteditable="editable"
            @blur="handleTextUpdate('primaryButtonText', $event)"
          >{{ data.primaryButtonText }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
        <a
          v-if="data.secondaryButtonText"
          :href="data.secondaryButtonLink || '#'"
          class="hero-button secondary"
        >
          <span
            :contenteditable="editable"
            @blur="handleTextUpdate('secondaryButtonText', $event)"
          >{{ data.secondaryButtonText }}</span>
        </a>
      </div>

      <div
        v-if="data.trustBadges && data.trustBadges.length > 0"
        class="hero-badges"
      >
        <div
          v-for="(badge, index) in data.trustBadges"
          :key="index"
          class="badge"
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
            v-html="getIconSvg(badge.icon)"
          />
          <span>{{ badge.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-fullwidth {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.edit-image-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.edit-image-btn:hover {
  background: rgba(0, 0, 0, 0.85);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}

.hero-headline {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.hero-headline:focus {
  outline: 2px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 8px;
}

.hero-subheadline {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-subheadline:focus {
  outline: 2px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 4px;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1.0625rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.hero-button.primary {
  background: white;
  color: #111;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.hero-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.hero-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.hero-button.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-button span:focus {
  outline: 2px dashed currentColor;
  outline-offset: 2px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Edit mode styles */
.hero-background.edit-mode {
  cursor: pointer;
}

.image-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.edit-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}

.edit-prompt svg {
  opacity: 0.9;
}

.edit-prompt span {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.edit-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  z-index: 10;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .hero-fullwidth {
    min-height: 80vh;
  }

  .hero-badges {
    flex-direction: column;
    align-items: center;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .edit-indicator {
    top: 12px;
    right: 12px;
    padding: 6px 10px;
    font-size: 11px;
  }
}
</style>
