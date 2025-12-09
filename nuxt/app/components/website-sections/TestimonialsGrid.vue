<script setup lang="ts">
interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  image: string
  rating: number
}

interface Props {
  data: {
    headline: string
    subheadline: string
    testimonials: Testimonial[]
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
  <section class="testimonials-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Testimonials</span>
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

      <div class="testimonials-grid">
        <div
          v-for="testimonial in data.testimonials"
          :key="testimonial.id"
          class="testimonial-card"
        >
          <div class="card-rating">
            <svg
              v-for="star in 5"
              :key="star"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              :fill="star <= testimonial.rating ? '#f59e0b' : 'none'"
              :stroke="star <= testimonial.rating ? '#f59e0b' : '#d1d5db'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <blockquote class="card-quote">
            "{{ testimonial.quote }}"
          </blockquote>

          <div class="card-author">
            <img
              :src="testimonial.image"
              :alt="testimonial.name"
              class="author-image"
            >
            <div class="author-info">
              <strong class="author-name">{{ testimonial.name }}</strong>
              <span class="author-role">{{ testimonial.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section {
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

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.testimonial-card {
  background: #f9fafb;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.card-rating {
  display: flex;
  gap: 0.125rem;
  margin-bottom: 1.25rem;
}

.card-quote {
  font-size: 1.0625rem;
  color: #374151;
  line-height: 1.7;
  margin: 0;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.card-author {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.author-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111;
}

.author-role {
  font-size: 0.8125rem;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .testimonials-section {
    padding: 4rem 0;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-card {
    padding: 1.5rem;
  }
}
</style>
