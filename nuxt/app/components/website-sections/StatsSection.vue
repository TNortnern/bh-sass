<script setup lang="ts">
interface StatItem {
  id: string
  value: string
  label: string
  description?: string
}

interface Props {
  data: {
    headline?: string
    subheadline?: string
    stats: StatItem[]
    style: 'light' | 'dark' | 'gradient'
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
</script>

<template>
  <section
    class="stats-section"
    :class="data.style"
  >
    <div class="container">
      <div
        v-if="data.headline"
        class="section-header"
      >
        <h2
          class="section-headline"
          :contenteditable="editable"
          @blur="handleTextUpdate('headline', $event)"
        >
          {{ data.headline }}
        </h2>
        <p
          v-if="data.subheadline"
          class="section-subheadline"
          :contenteditable="editable"
          @blur="handleTextUpdate('subheadline', $event)"
        >
          {{ data.subheadline }}
        </p>
      </div>

      <div
        class="stats-grid"
        :class="`cols-${data.stats.length}`"
      >
        <div
          v-for="stat in data.stats"
          :key="stat.id"
          class="stat-card"
        >
          <div class="stat-value">
            {{ stat.value }}
          </div>
          <div class="stat-label">
            {{ stat.label }}
          </div>
          <p
            v-if="stat.description"
            class="stat-description"
          >
            {{ stat.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 5rem 0;
}

.stats-section.light {
  background: white;
}

.stats-section.dark {
  background: #111;
}

.stats-section.gradient {
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
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

.section-headline {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.light .section-headline {
  color: #111;
}

.dark .section-headline,
.gradient .section-headline {
  color: white;
}

.section-headline:focus {
  outline: 2px dashed currentColor;
  outline-offset: 8px;
}

.section-subheadline {
  font-size: 1.125rem;
  max-width: 500px;
  margin: 0 auto;
}

.light .section-subheadline {
  color: #6b7280;
}

.dark .section-subheadline,
.gradient .section-subheadline {
  color: rgba(255, 255, 255, 0.8);
}

.section-subheadline:focus {
  outline: 2px dashed currentColor;
  outline-offset: 4px;
}

.stats-grid {
  display: grid;
  gap: 2rem;
}

.stats-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.stats-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.stats-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
}

.light .stat-card {
  border-radius: 1rem;
  background: #f9fafb;
}

.stat-value {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.light .stat-value {
  color: #111;
}

.dark .stat-value,
.gradient .stat-value {
  color: white;
}

.stat-label {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.light .stat-label {
  color: #374151;
}

.dark .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.gradient .stat-label {
  color: rgba(255, 255, 255, 0.95);
}

.stat-description {
  font-size: 0.9375rem;
  line-height: 1.5;
}

.light .stat-description {
  color: #6b7280;
}

.dark .stat-description,
.gradient .stat-description {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 1024px) {
  .stats-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-section {
    padding: 4rem 0;
  }

  .stats-grid.cols-2,
  .stats-grid.cols-3,
  .stats-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }
}
</style>
