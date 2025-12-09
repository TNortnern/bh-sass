<script setup lang="ts">
interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    features: FeatureItem[]
    columns: 2 | 3 | 4
    style: 'cards' | 'minimal' | 'centered'
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
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    truck: '<path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0="0 0 0-5C13 2 12 7 12 7z"/>',
    sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>'
  }
  return icons[icon] || icons.star
}
</script>

<template>
  <section class="features-section">
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

      <div
        class="features-grid"
        :class="[`cols-${data.columns}`, data.style]"
      >
        <div
          v-for="feature in data.features"
          :key="feature.id"
          class="feature-card"
        >
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
              v-html="getIconSvg(feature.icon)"
            />
          </div>
          <h3 class="feature-title">
            {{ feature.title }}
          </h3>
          <p class="feature-description">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
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

.features-grid {
  display: grid;
  gap: 2rem;
}

.features-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.features-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.features-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Cards Style */
.features-grid.cards .feature-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.2s;
}

.features-grid.cards .feature-card:hover {
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

/* Minimal Style */
.features-grid.minimal .feature-card {
  padding: 1.5rem 0;
}

/* Centered Style */
.features-grid.centered .feature-card {
  text-align: center;
  padding: 2rem 1rem;
}

.features-grid.centered .feature-icon {
  margin-left: auto;
  margin-right: auto;
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-bottom: 1.25rem;
  color: #d97706;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.75rem;
}

.feature-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .features-grid.cols-3,
  .features-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-section {
    padding: 4rem 0;
  }

  .features-grid.cols-2,
  .features-grid.cols-3,
  .features-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
