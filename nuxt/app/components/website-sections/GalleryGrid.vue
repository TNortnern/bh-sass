<script setup lang="ts">
interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    images: GalleryImage[]
    columns: 2 | 3 | 4
  }
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

const selectedImage = ref<GalleryImage | null>(null)

const openLightbox = (image: GalleryImage) => {
  if (!props.editable) {
    selectedImage.value = image
  }
}

const closeLightbox = () => {
  selectedImage.value = null
}
</script>

<template>
  <section class="gallery-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Gallery</span>
        <h2
          class="section-headline"
          :contenteditable="editable"
          @blur="handleTextUpdate('headline', $event)"
        >
          {{ data.headline }}
        </h2>
        <p
          class="section-subheadline"
          :contenteditable="editable"
          @blur="handleTextUpdate('subheadline', $event)"
        >
          {{ data.subheadline }}
        </p>
      </div>

      <div
        class="gallery-grid"
        :class="`cols-${data.columns}`"
      >
        <div
          v-for="image in data.images"
          :key="image.id"
          class="gallery-item"
          @click="openLightbox(image)"
        >
          <img
            :src="image.src"
            :alt="image.alt"
          >
          <div class="gallery-overlay">
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
            ><circle
              cx="11"
              cy="11"
              r="8"
            /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="selectedImage"
          class="lightbox"
          @click="closeLightbox"
        >
          <button
            class="lightbox-close"
            @click="closeLightbox"
          >
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
            ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
          <div
            class="lightbox-content"
            @click.stop
          >
            <img
              :src="selectedImage.src"
              :alt="selectedImage.alt"
            >
            <p
              v-if="selectedImage.caption"
              class="lightbox-caption"
            >
              {{ selectedImage.caption }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-section {
  padding: 6rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f59e0b;
  margin-bottom: 0.75rem;
}

.section-headline {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #111;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.section-subheadline {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
}

.section-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.gallery-grid {
  display: grid;
  gap: 1rem;
}

.gallery-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.gallery-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.gallery-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 0.5rem;
}

.lightbox-caption {
  text-align: center;
  color: white;
  margin-top: 1rem;
  font-size: 0.9375rem;
}

/* Lightbox transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .gallery-grid.cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .gallery-grid.cols-3,
  .gallery-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .gallery-section {
    padding: 4rem 0;
  }

  .gallery-grid.cols-2,
  .gallery-grid.cols-3,
  .gallery-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
