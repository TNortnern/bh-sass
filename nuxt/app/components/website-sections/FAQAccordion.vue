<script setup lang="ts">
interface FAQItem {
  id: string
  question: string
  answer: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    items: FAQItem[]
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

const openItems = ref<Set<string>>(new Set())

const toggleItem = (id: string) => {
  if (openItems.value.has(id)) {
    openItems.value.delete(id)
  } else {
    openItems.value.add(id)
  }
  openItems.value = new Set(openItems.value)
}

const isOpen = (id: string) => openItems.value.has(id)
</script>

<template>
  <section class="faq-section">
    <div class="container">
      <div class="faq-layout">
        <div class="faq-header">
          <span class="section-eyebrow">FAQ</span>
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

          <div class="contact-cta">
            <p>Still have questions?</p>
            <a
              href="#contact"
              class="contact-link"
            >
              Get in touch
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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

        <div class="faq-list">
          <div
            v-for="item in data.items"
            :key="item.id"
            class="faq-item"
            :class="{ 'is-open': isOpen(item.id) }"
          >
            <button
              class="faq-trigger"
              @click="toggleItem(item.id)"
            >
              <span class="faq-question">{{ item.question }}</span>
              <span class="faq-icon">
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
                ><path d="m6 9 6 6 6-6" /></svg>
              </span>
            </button>
            <div class="faq-content">
              <div class="faq-answer">
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  padding: 6rem 0;
  background: #f9fafb;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.faq-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;
}

.faq-header {
  position: sticky;
  top: 2rem;
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
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #111;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-headline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 8px;
}

.section-subheadline {
  font-size: 1.0625rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.section-subheadline:focus {
  outline: 2px dashed #f59e0b;
  outline-offset: 4px;
}

.contact-cta {
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.contact-cta p {
  font-size: 0.9375rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f59e0b;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.contact-link:hover {
  gap: 0.625rem;
}

/* FAQ List */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.faq-trigger {
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.faq-question {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
  line-height: 1.4;
}

.faq-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.3s ease;
}

.faq-item.is-open .faq-icon {
  background: #f59e0b;
  color: white;
  transform: rotate(180deg);
}

.faq-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.faq-item.is-open .faq-content {
  grid-template-rows: 1fr;
}

.faq-answer {
  overflow: hidden;
  padding: 0 1.5rem;
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.7;
}

.faq-item.is-open .faq-answer {
  padding-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .faq-section {
    padding: 4rem 0;
  }

  .faq-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .faq-header {
    position: static;
    text-align: center;
  }

  .contact-cta {
    display: none;
  }
}
</style>
