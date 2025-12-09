<script setup lang="ts">
/**
 * Testimonials Section
 *
 * Displays customer testimonials with template-specific styling
 */
interface Testimonial {
  id: string
  name: string
  role?: string
  avatar?: string
  content: string
  rating: number
  event?: string
}

interface Props {
  variant?: 'professional' | 'festive' | 'minimal'
  primaryColor?: string
  secondaryColor?: string
  testimonials?: Testimonial[]
}

withDefaults(defineProps<Props>(), {
  variant: 'minimal',
  primaryColor: '#FF6B6B',
  secondaryColor: '#FFB347',
  testimonials: () => [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Birthday Party Mom',
      content: 'Absolutely amazing! The kids had the best time ever. Setup was quick, equipment was super clean, and the team was so professional. Already booked for next year!',
      rating: 5,
      event: 'Birthday Party'
    },
    {
      id: '2',
      name: 'Mike Thompson',
      role: 'Event Coordinator',
      content: 'We\'ve used their services for multiple corporate family days. Always reliable, always on time, and the quality is top-notch. Highly recommend!',
      rating: 5,
      event: 'Corporate Event'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'School Event Planner',
      content: 'The bounce houses were a huge hit at our school carnival. Great communication throughout and very fair pricing. Will definitely use again!',
      rating: 5,
      event: 'School Carnival'
    },
    {
      id: '4',
      name: 'David Chen',
      role: 'Backyard Party Host',
      content: 'First time renting a bounce house and it couldn\'t have been easier. The kids didn\'t want to stop playing! Worth every penny.',
      rating: 5,
      event: 'Backyard Party'
    }
  ]
})

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<template>
  <section
    class="testimonials"
    :class="`variant-${variant}`"
  >
    <div class="testimonials-container">
      <!-- Header -->
      <div class="testimonials-header">
        <template v-if="variant === 'professional'">
          <span class="header-badge">
            <span class="badge-stars">★★★★★</span>
            <span>5-Star Reviews</span>
          </span>
          <h2 class="header-title">
            What Our Customers Say
          </h2>
          <p class="header-subtitle">
            Real feedback from real families
          </p>
        </template>

        <template v-else-if="variant === 'festive'">
          <span class="header-emoji">🎉</span>
          <h2 class="header-title">
            Happy Party People!
          </h2>
          <p class="header-subtitle">
            See why families love us
          </p>
        </template>

        <template v-else>
          <span class="header-label">Testimonials</span>
          <h2 class="header-title">
            Trusted by Families Like Yours
          </h2>
          <p class="header-subtitle">
            Join 500+ happy customers who chose us for their celebrations
          </p>
        </template>
      </div>

      <!-- Testimonials Grid -->
      <div class="testimonials-grid">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="testimonial-card"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <!-- Rating Stars -->
          <div class="testimonial-rating">
            <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ filled: i <= testimonial.rating }"
            >★</span>
          </div>

          <!-- Content -->
          <p class="testimonial-content">
            "{{ testimonial.content }}"
          </p>

          <!-- Author -->
          <div class="testimonial-author">
            <div
              v-if="testimonial.avatar"
              class="author-avatar"
            >
              <img
                :src="testimonial.avatar"
                :alt="testimonial.name"
              >
            </div>
            <div
              v-else
              class="author-initials"
            >
              {{ getInitials(testimonial.name) }}
            </div>
            <div class="author-info">
              <span class="author-name">{{ testimonial.name }}</span>
              <span class="author-role">{{ testimonial.role || testimonial.event }}</span>
            </div>
          </div>

          <!-- Event Badge (Festive variant) -->
          <div
            v-if="variant === 'festive' && testimonial.event"
            class="event-badge"
          >
            {{ testimonial.event }}
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="testimonials-cta">
        <p class="cta-text">
          Ready to create your own unforgettable memories?
        </p>
        <a
          href="#browse"
          class="cta-button"
        >
          <span>Browse Rentals</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="w-4 h-4"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  --t-primary: v-bind(primaryColor);
  --t-secondary: v-bind(secondaryColor);
  padding: 5rem 0;
}

.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ===============================
   HEADER STYLES
   =============================== */
.testimonials-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.badge-stars {
  color: #F59E0B;
}

.header-emoji {
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.header-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.header-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.header-subtitle {
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* ===============================
   GRID STYLES
   =============================== */
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (min-width: 640px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ===============================
   CARD STYLES
   =============================== */
.testimonial-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 1rem;
  opacity: 0;
  transform: translateY(20px);
  animation: card-in 0.5s ease forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes card-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.testimonial-rating {
  display: flex;
  gap: 0.125rem;
  margin-bottom: 1rem;
}

.star {
  font-size: 0.875rem;
  color: #E5E7EB;
}

.star.filled {
  color: #F59E0B;
}

.testimonial-content {
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar,
.author-initials {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 0.875rem;
  font-weight: 600;
}

.author-role {
  font-size: 0.75rem;
}

.event-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
}

/* ===============================
   CTA STYLES
   =============================== */
.testimonials-cta {
  text-align: center;
}

.cta-text {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

/* ===============================
   PROFESSIONAL VARIANT
   =============================== */
.variant-professional {
  background: #0a0a0b;
  color: white;
}

.variant-professional .header-badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.variant-professional .header-title {
  color: white;
}

.variant-professional .header-subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.variant-professional .testimonial-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.variant-professional .testimonial-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
}

.variant-professional .testimonial-content {
  color: rgba(255, 255, 255, 0.8);
}

.variant-professional .author-initials {
  background: linear-gradient(135deg, var(--t-primary), var(--t-secondary));
  color: white;
}

.variant-professional .author-name {
  color: white;
}

.variant-professional .author-role {
  color: rgba(255, 255, 255, 0.5);
}

.variant-professional .cta-text {
  color: rgba(255, 255, 255, 0.7);
}

.variant-professional .cta-button {
  background: linear-gradient(135deg, var(--t-primary), var(--t-secondary));
  color: white;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}

.variant-professional .cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
}

/* ===============================
   FESTIVE VARIANT
   =============================== */
.variant-festive {
  background: linear-gradient(180deg, #FFF8F0 0%, #FFFAF5 100%);
}

.variant-festive .header-title {
  font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
  color: #2D2D2D;
}

.variant-festive .header-subtitle {
  color: #666;
}

.variant-festive .testimonial-card {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border-radius: 1.25rem;
}

.variant-festive .testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.variant-festive .testimonial-content {
  color: #444;
}

.variant-festive .author-initials {
  background: linear-gradient(135deg, var(--t-primary), var(--t-secondary));
  color: white;
}

.variant-festive .author-name {
  color: #333;
}

.variant-festive .author-role {
  color: #888;
}

.variant-festive .event-badge {
  background: linear-gradient(135deg, var(--t-primary), var(--t-secondary));
  color: white;
}

.variant-festive .cta-text {
  color: #666;
}

.variant-festive .cta-button {
  background: linear-gradient(135deg, var(--t-primary), var(--t-secondary));
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.variant-festive .cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
}

/* ===============================
   MINIMAL VARIANT
   =============================== */
.variant-minimal {
  background: #FAFBFC;
}

.variant-minimal .header-label {
  color: var(--t-primary);
}

.variant-minimal .header-title {
  color: #111827;
}

.variant-minimal .header-subtitle {
  color: #6B7280;
}

.variant-minimal .testimonial-card {
  background: white;
  border: 1px solid #F3F4F6;
}

.variant-minimal .testimonial-card:hover {
  border-color: transparent;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.variant-minimal .testimonial-content {
  color: #4B5563;
}

.variant-minimal .author-initials {
  background: #F3F4F6;
  color: #6B7280;
}

.variant-minimal .author-name {
  color: #111827;
}

.variant-minimal .author-role {
  color: #9CA3AF;
}

.variant-minimal .cta-text {
  color: #6B7280;
}

.variant-minimal .cta-button {
  background: var(--t-primary);
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
}

.variant-minimal .cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}
</style>
