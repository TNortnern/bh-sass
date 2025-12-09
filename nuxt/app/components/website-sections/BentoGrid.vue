<script setup lang="ts">
interface BentoItem {
  id: string
  title: string
  description: string
  icon: string
  size: 'small' | 'medium' | 'large'
  color: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    items: BentoItem[]
  }
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

// Icon SVG paths
const getIconSvg = (icon: string) => {
  const icons: Record<string, string> = {
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'
  }
  return icons[icon] || icons.sparkles
}

// Color gradients
const getGradient = (color: string) => {
  const gradients: Record<string, string> = {
    amber: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
    blue: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
    green: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)',
    purple: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 100%)',
    pink: 'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)',
    red: 'linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)',
    cyan: 'linear-gradient(135deg, #cffafe 0%, #67e8f9 100%)',
    dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
  }
  return gradients[color] || gradients.amber
}

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    amber: '#d97706',
    blue: '#2563eb',
    green: '#059669',
    purple: '#7c3aed',
    pink: '#db2777',
    red: '#dc2626',
    cyan: '#0891b2',
    dark: '#f59e0b'
  }
  return colors[color] || colors.amber
}
</script>

<template>
  <section class="bento-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Features</span>
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

      <div class="bento-grid">
        <div
          v-for="item in data.items"
          :key="item.id"
          class="bento-item"
          :class="[`size-${item.size}`]"
          :style="{ background: getGradient(item.color) }"
        >
          <div
            class="bento-content"
            :class="{ 'dark-text': item.color === 'dark' }"
          >
            <div
              class="bento-icon"
              :style="{ color: item.color === 'dark' ? '#f59e0b' : getIconColor(item.color) }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="getIconSvg(item.icon)"
              />
            </div>
            <h3 class="bento-title">
              {{ item.title }}
            </h3>
            <p class="bento-description">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento-section {
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
  margin-bottom: 4rem;
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

/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.bento-item {
  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.bento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Size variations */
.bento-item.size-small {
  grid-column: span 1;
  grid-row: span 1;
}

.bento-item.size-medium {
  grid-column: span 2;
  grid-row: span 1;
}

.bento-item.size-large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-content {
  position: relative;
  z-index: 1;
}

.bento-content.dark-text {
  color: white;
}

.bento-icon {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.bento-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.5rem;
}

.dark-text .bento-title {
  color: white;
}

.bento-description {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
}

.dark-text .bento-description {
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bento-item.size-large {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 640px) {
  .bento-section {
    padding: 4rem 0;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }

  .bento-item.size-small,
  .bento-item.size-medium,
  .bento-item.size-large {
    grid-column: span 1;
    grid-row: span 1;
  }

  .bento-item {
    padding: 2rem;
    min-height: 160px;
  }
}
</style>
