<script setup lang="ts">
interface Props {
  data: {
    headline: string
    subheadline: string
    placeholder: string
    buttonText: string
    note?: string
    style: 'simple' | 'card' | 'split'
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

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

// Determine if background is dark
const isDark = computed(() => {
  const bg = props.data.backgroundColor || ''
  return bg.includes('#111') || bg.includes('#0a0a0a') || bg.includes('#1f2937') || bg.includes('dark')
})
</script>

<template>
  <section
    class="newsletter-section"
    :class="[`style-${data.style}`, { dark: isDark }]"
    :style="{ background: data.backgroundColor || undefined }"
  >
    <div class="container">
      <!-- Simple Style -->
      <div
        v-if="data.style === 'simple'"
        class="simple-layout"
      >
        <div class="content">
          <h2
            class="headline"
            :contenteditable="editable"
            @blur="handleTextUpdate('headline', $event)"
          >
            {{ data.headline }}
          </h2>
          <p
            class="subheadline"
            :contenteditable="editable"
            @blur="handleTextUpdate('subheadline', $event)"
          >
            {{ data.subheadline }}
          </p>
        </div>
        <form
          class="newsletter-form"
          @submit.prevent
        >
          <input
            type="email"
            :placeholder="data.placeholder"
            class="email-input"
          >
          <button
            type="submit"
            class="submit-btn"
          >
            {{ data.buttonText }}
          </button>
        </form>
        <p
          v-if="data.note"
          class="note"
        >
          {{ data.note }}
        </p>
      </div>

      <!-- Card Style -->
      <div
        v-else-if="data.style === 'card'"
        class="card-layout"
      >
        <div class="card">
          <div class="card-icon">
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
            >
              <rect
                width="20"
                height="16"
                x="2"
                y="4"
                rx="2"
              />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2
            class="headline"
            :contenteditable="editable"
            @blur="handleTextUpdate('headline', $event)"
          >
            {{ data.headline }}
          </h2>
          <p
            class="subheadline"
            :contenteditable="editable"
            @blur="handleTextUpdate('subheadline', $event)"
          >
            {{ data.subheadline }}
          </p>
          <form
            class="newsletter-form"
            @submit.prevent
          >
            <input
              type="email"
              :placeholder="data.placeholder"
              class="email-input"
            >
            <button
              type="submit"
              class="submit-btn"
            >
              {{ data.buttonText }}
            </button>
          </form>
          <p
            v-if="data.note"
            class="note"
          >
            {{ data.note }}
          </p>
        </div>
      </div>

      <!-- Split Style -->
      <div
        v-else
        class="split-layout"
      >
        <div class="content">
          <span class="eyebrow">Newsletter</span>
          <h2
            class="headline"
            :contenteditable="editable"
            @blur="handleTextUpdate('headline', $event)"
          >
            {{ data.headline }}
          </h2>
          <p
            class="subheadline"
            :contenteditable="editable"
            @blur="handleTextUpdate('subheadline', $event)"
          >
            {{ data.subheadline }}
          </p>
        </div>
        <div class="form-side">
          <form
            class="newsletter-form"
            @submit.prevent
          >
            <input
              type="email"
              :placeholder="data.placeholder"
              class="email-input"
            >
            <button
              type="submit"
              class="submit-btn"
            >
              {{ data.buttonText }}
            </button>
          </form>
          <p
            v-if="data.note"
            class="note"
          >
            {{ data.note }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.newsletter-section {
  padding: 5rem 0;
  background: #f9fafb;
}

.newsletter-section.dark {
  background: #111;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Simple Style */
.simple-layout {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.headline {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #111;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.dark .headline {
  color: white;
}

.headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.subheadline {
  font-size: 1.0625rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.dark .subheadline {
  color: rgba(255, 255, 255, 0.7);
}

.subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.newsletter-form {
  display: flex;
  gap: 0.75rem;
  max-width: 450px;
  margin: 0 auto;
}

.email-input {
  flex: 1;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  color: #111;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.dark .email-input {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.dark .email-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.email-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.submit-btn {
  padding: 1rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  background: #f59e0b;
  color: #000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.15s;
}

.submit-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.note {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-top: 1rem;
}

.dark .note {
  color: rgba(255, 255, 255, 0.5);
}

/* Card Style */
.card-layout {
  display: flex;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 1.5rem;
  padding: 3rem;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.dark .card {
  background: #1f2937;
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 1rem;
  color: #d97706;
}

.card .headline {
  font-size: 1.5rem;
}

.card .newsletter-form {
  flex-direction: column;
}

/* Split Style */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.split-layout .content {
  text-align: left;
}

.eyebrow {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #f59e0b;
  margin-bottom: 0.75rem;
}

.split-layout .headline {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  text-align: left;
}

.split-layout .subheadline {
  text-align: left;
  margin-bottom: 0;
}

.form-side .newsletter-form {
  flex-direction: column;
  max-width: 100%;
}

.form-side .note {
  text-align: left;
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 4rem 0;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .split-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .split-layout .content,
  .split-layout .headline,
  .split-layout .subheadline {
    text-align: center;
  }
}
</style>
