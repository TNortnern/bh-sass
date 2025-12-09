<script setup lang="ts">
interface Props {
  data: {
    image: string
    imagePosition?: 'left' | 'right'
    eyebrow?: string
    headline: string
    subheadline: string
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    stats?: { value: string, label: string }[]
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
  <section
    class="hero-split"
    :class="{ 'image-left': data.imagePosition === 'left' }"
  >
    <div
      class="hero-image-container"
      :class="{ 'edit-mode': editable }"
      @click="editable && openImagePicker()"
    >
      <img
        :src="data.image"
        alt="Party rentals"
        class="hero-image"
      >
      <div class="image-decoration" />

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

    <div class="hero-content">
      <div class="content-inner">
        <span
          v-if="data.eyebrow"
          class="hero-eyebrow"
          :contenteditable="editable"
          @blur="handleTextUpdate('eyebrow', $event)"
        >{{ data.eyebrow }}</span>

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

        <div class="hero-actions">
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
          v-if="data.stats && data.stats.length > 0"
          class="hero-stats"
        >
          <div
            v-for="(stat, index) in data.stats"
            :key="index"
            class="stat"
          >
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 90vh;
  background: #fafafa;
}

.hero-split.image-left {
  direction: rtl;
}

.hero-split.image-left > * {
  direction: ltr;
}

.hero-image-container {
  position: relative;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-decoration {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  border-radius: 50%;
  opacity: 0.1;
}

.hero-content {
  display: flex;
  align-items: center;
  padding: 4rem;
}

.content-inner {
  max-width: 540px;
}

.hero-eyebrow {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
}

.hero-headline {
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  color: #111;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.hero-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.hero-subheadline {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.hero-button.primary {
  background: #111;
  color: white;
}

.hero-button.primary:hover {
  background: #333;
  transform: translateY(-1px);
}

.hero-button.secondary {
  background: white;
  color: #111;
  border: 1px solid #e5e7eb;
}

.hero-button.secondary:hover {
  border-color: #111;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.stat {
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

@media (max-width: 1024px) {
  .hero-split {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .hero-split.image-left {
    direction: ltr;
  }

  .hero-image-container {
    height: 50vh;
    min-height: 400px;
  }

  .hero-content {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 640px) {
  .hero-stats {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
}

/* Edit mode styles */
.hero-image-container.edit-mode {
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
</style>
