<script setup lang="ts">
interface Props {
  data: {
    image: string
    headline: string
    content: string
    stats: { value: string, label: string }[]
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
  emit('update', 'image', url)
  showImagePicker.value = false
}

const openImagePicker = () => {
  showImagePicker.value = true
}
</script>

<template>
  <section class="about-section">
    <div class="container">
      <div class="about-grid">
        <div
          class="about-image-wrapper"
          :class="{ 'edit-mode': editable }"
          @click="editable && openImagePicker()"
        >
          <img
            :src="data.image"
            alt="About our company"
            class="about-image"
          >
          <div class="image-accent" />

          <!-- Edit indicator badge -->
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
          :model-value="data.image"
          :open="showImagePicker"
          @update:model-value="handleImageUpdate"
          @update:open="showImagePicker = $event"
        />

        <div class="about-content">
          <span class="section-eyebrow">About Us</span>

          <h2
            class="about-headline"
            :contenteditable="editable"
            @blur="handleTextUpdate('headline', $event)"
          >
            {{ data.headline }}
          </h2>

          <div
            class="about-text"
            :contenteditable="editable"
            @blur="handleTextUpdate('content', $event)"
            v-html="data.content"
          />

          <div class="about-stats">
            <div
              v-for="(stat, index) in data.stats"
              :key="index"
              class="stat-item"
            >
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>

          <div class="about-features">
            <div class="feature">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
              </div>
              <div class="feature-text">
                <strong>Safety Certified</strong>
                <span>All equipment regularly inspected</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg>
              </div>
              <div class="feature-text">
                <strong>Dedicated Support</strong>
                <span>Available 7 days a week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 6rem 0;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-image-wrapper {
  position: relative;
}

.about-image {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.image-accent {
  position: absolute;
  top: -1.5rem;
  right: -1.5rem;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  border-radius: 1rem;
  z-index: -1;
}

.about-content {
  padding: 1rem 0;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f59e0b;
  margin-bottom: 1rem;
}

.about-headline {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #111;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.about-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.about-text {
  font-size: 1.0625rem;
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 2rem;
}

.about-text:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.about-stats {
  display: flex;
  gap: 2.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.feature-text {
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
}

.feature-text strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111;
}

.feature-text span {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .image-accent {
    display: none;
  }
}

@media (max-width: 640px) {
  .about-section {
    padding: 4rem 0;
  }

  .about-stats {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
}

/* Edit mode styles */
.about-image-wrapper.edit-mode {
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
  border-radius: 1rem;
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
</style>
