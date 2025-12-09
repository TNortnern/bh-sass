<script setup lang="ts">
interface Step {
  id: string
  number: string
  title: string
  description: string
  icon: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    steps: Step[]
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

const iconMap: Record<string, string> = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  partyPopper: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`
}
</script>

<template>
  <section class="how-it-works">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">How It Works</span>
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

      <div class="steps-wrapper">
        <div class="steps-connector" />
        <div class="steps-grid">
          <div
            v-for="(step, index) in data.steps"
            :key="step.id"
            class="step-item"
          >
            <div class="step-number">
              {{ step.number || index + 1 }}
            </div>
            <div
              class="step-icon"
              v-html="iconMap[step.icon] || iconMap.checkCircle"
            />
            <h3 class="step-title">
              {{ step.title }}
            </h3>
            <p class="step-description">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how-it-works {
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

.steps-wrapper {
  position: relative;
}

.steps-connector {
  position: absolute;
  top: 60px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, #e5e7eb 0%, #f59e0b 50%, #e5e7eb 100%);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #f59e0b;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
}

.step-icon {
  width: 72px;
  height: 72px;
  background: #f9fafb;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.step-item:hover .step-icon {
  background: #fef3c7;
  transform: translateY(-4px);
}

.step-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.625rem;
}

.step-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 220px;
}

@media (max-width: 1024px) {
  .steps-connector {
    display: none;
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem 2rem;
  }
}

@media (max-width: 640px) {
  .how-it-works {
    padding: 4rem 0;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
