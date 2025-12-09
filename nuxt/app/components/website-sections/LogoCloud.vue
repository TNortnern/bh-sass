<script setup lang="ts">
interface LogoItem {
  id: string
  name: string
  logo: string
  link?: string
}

interface Props {
  data: {
    headline?: string
    subheadline?: string
    logos: LogoItem[]
    style: 'grid' | 'row' | 'marquee'
    grayscale?: boolean
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

// Duplicate logos for marquee effect
const marqueeLogos = computed(() => {
  if (props.data.style === 'marquee') {
    return [...props.data.logos, ...props.data.logos]
  }
  return props.data.logos
})
</script>

<template>
  <section
    class="logo-cloud-section"
    :class="{ grayscale: data.grayscale }"
  >
    <div class="container">
      <div
        v-if="data.headline"
        class="section-header"
      >
        <p
          class="section-headline"
          :contenteditable="editable"
          @blur="handleTextUpdate('headline', $event)"
        >
          {{ data.headline }}
        </p>
        <p
          v-if="data.subheadline"
          class="section-subheadline"
          :contenteditable="editable"
          @blur="handleTextUpdate('subheadline', $event)"
        >
          {{ data.subheadline }}
        </p>
      </div>

      <!-- Grid Layout -->
      <div
        v-if="data.style === 'grid'"
        class="logos-grid"
      >
        <component
          :is="logo.link ? 'a' : 'div'"
          v-for="logo in data.logos"
          :key="logo.id"
          :href="logo.link"
          :target="logo.link ? '_blank' : undefined"
          :rel="logo.link ? 'noopener noreferrer' : undefined"
          class="logo-item"
        >
          <img
            :src="logo.logo"
            :alt="logo.name"
          >
        </component>
      </div>

      <!-- Row Layout -->
      <div
        v-else-if="data.style === 'row'"
        class="logos-row"
      >
        <component
          :is="logo.link ? 'a' : 'div'"
          v-for="logo in data.logos"
          :key="logo.id"
          :href="logo.link"
          :target="logo.link ? '_blank' : undefined"
          :rel="logo.link ? 'noopener noreferrer' : undefined"
          class="logo-item"
        >
          <img
            :src="logo.logo"
            :alt="logo.name"
          >
        </component>
      </div>

      <!-- Marquee Layout -->
      <div
        v-else
        class="logos-marquee"
      >
        <div class="marquee-track">
          <component
            :is="logo.link ? 'a' : 'div'"
            v-for="(logo, index) in marqueeLogos"
            :key="`${logo.id}-${index}`"
            :href="logo.link"
            :target="logo.link ? '_blank' : undefined"
            :rel="logo.link ? 'noopener noreferrer' : undefined"
            class="logo-item"
          >
            <img
              :src="logo.logo"
              :alt="logo.name"
            >
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.logo-cloud-section {
  padding: 4rem 0;
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-headline {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.section-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.section-subheadline {
  font-size: 0.875rem;
  color: #9ca3af;
}

.section-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

/* Grid Layout */
.logos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  align-items: center;
  justify-items: center;
}

/* Row Layout */
.logos-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 3rem;
}

/* Marquee Layout */
.logos-marquee {
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

.marquee-track {
  display: flex;
  gap: 4rem;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Logo Item */
.logo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

a.logo-item:hover {
  opacity: 0.7;
}

.logo-item img {
  max-height: 48px;
  max-width: 140px;
  width: auto;
  object-fit: contain;
}

/* Grayscale Mode */
.grayscale .logo-item img {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.2s;
}

.grayscale .logo-item:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

@media (max-width: 768px) {
  .logos-row {
    gap: 2rem;
  }

  .logo-item img {
    max-height: 36px;
    max-width: 100px;
  }

  .marquee-track {
    gap: 2.5rem;
  }
}

@media (max-width: 480px) {
  .logo-cloud-section {
    padding: 3rem 0;
  }

  .logos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .logo-item img {
    max-height: 32px;
    max-width: 80px;
  }
}
</style>
