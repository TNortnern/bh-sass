<script setup lang="ts">
interface Props {
  data: {
    headline: string
    subheadline: string
    buttonText: string
    buttonLink: string
    backgroundImage?: string
    backgroundColor?: string
  }
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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

const backgroundStyle = computed(() => {
  if (props.data.backgroundImage) {
    return { backgroundImage: `url(${props.data.backgroundImage})` }
  }
  return { background: props.data.backgroundColor || 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' }
})
</script>

<template>
  <section
    class="cta-banner"
    :style="backgroundStyle"
    :class="{ 'has-image': data.backgroundImage, 'edit-mode': editable }"
    @click="editable && openImagePicker()"
  >
    <div
      v-if="data.backgroundImage"
      class="banner-overlay"
    />

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
      <span>Edit Background</span>
    </div>

    <!-- Image Picker Modal -->
    <WebsiteSectionsImagePicker
      :model-value="data.backgroundImage || ''"
      :open="showImagePicker"
      @update:model-value="handleImageUpdate"
      @update:open="showImagePicker = $event"
    />

    <div
      class="container"
      @click.stop
    >
      <div class="banner-content">
        <h2
          class="banner-headline"
          :contenteditable="editable"
          @blur="handleTextUpdate('headline', $event)"
        >
          {{ data.headline }}
        </h2>

        <p
          class="banner-subheadline"
          :contenteditable="editable"
          @blur="handleTextUpdate('subheadline', $event)"
        >
          {{ data.subheadline }}
        </p>

        <a
          :href="data.buttonLink"
          class="banner-button"
        >
          <span
            :contenteditable="editable"
            @blur="handleTextUpdate('buttonText', $event)"
          >{{ data.buttonText }}</span>
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-banner {
  position: relative;
  padding: 5rem 0;
  background-size: cover;
  background-position: center;
}

.cta-banner.has-image .banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.banner-content {
  text-align: center;
}

.banner-headline {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.banner-headline:focus {
  outline: 2px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 8px;
}

.banner-subheadline {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.banner-subheadline:focus {
  outline: 2px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 4px;
}

.banner-button {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  background: white;
  color: #111;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.banner-button span:focus {
  outline: 2px dashed #111;
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .cta-banner {
    padding: 4rem 0;
  }
}

/* Edit mode styles */
.cta-banner.edit-mode {
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
