<script setup lang="ts">
interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  priceNote?: string
  features: string[]
  popular?: boolean
  ctaText: string
  ctaLink: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    tiers: PricingTier[]
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
  <section class="pricing-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Pricing</span>
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
        class="pricing-grid"
        :class="`cols-${data.tiers.length}`"
      >
        <div
          v-for="tier in data.tiers"
          :key="tier.id"
          class="pricing-card"
          :class="{ popular: tier.popular }"
        >
          <div
            v-if="tier.popular"
            class="popular-badge"
          >
            Most Popular
          </div>

          <div class="card-header">
            <h3 class="tier-name">
              {{ tier.name }}
            </h3>
            <p class="tier-description">
              {{ tier.description }}
            </p>
          </div>

          <div class="card-price">
            <span class="price">{{ tier.price }}</span>
            <span
              v-if="tier.priceNote"
              class="price-note"
            >{{ tier.priceNote }}</span>
          </div>

          <ul class="features-list">
            <li
              v-for="(feature, index) in tier.features"
              :key="index"
              class="feature-item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="check-icon"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <a
            :href="tier.ctaLink"
            class="tier-cta"
            :class="{ primary: tier.popular }"
          >
            {{ tier.ctaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  padding: 6rem 0;
  background: #f9fafb;
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

.pricing-grid {
  display: grid;
  gap: 1.5rem;
  align-items: stretch;
}

.pricing-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
  max-width: 800px;
  margin: 0 auto;
}

.pricing-grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.pricing-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.2s;
}

.pricing-card:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.pricing-card.popular {
  border: 2px solid #f59e0b;
  box-shadow: 0 10px 40px rgba(245, 158, 11, 0.15);
  transform: scale(1.02);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.375rem 1rem;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 99px;
  white-space: nowrap;
}

.card-header {
  margin-bottom: 1.5rem;
}

.tier-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.5rem;
}

.tier-description {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.5;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.02em;
}

.price-note {
  font-size: 0.9375rem;
  color: #6b7280;
}

.features-list {
  flex: 1;
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9375rem;
  color: #4b5563;
}

.check-icon {
  flex-shrink: 0;
  color: #10b981;
  margin-top: 2px;
}

.tier-cta {
  display: block;
  padding: 0.875rem 1.5rem;
  background: #f5f5f5;
  color: #111;
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s;
}

.tier-cta:hover {
  background: #e5e5e5;
}

.tier-cta.primary {
  background: #111;
  color: white;
}

.tier-cta.primary:hover {
  background: #333;
}

@media (max-width: 1024px) {
  .pricing-grid.cols-3,
  .pricing-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .pricing-card.popular {
    transform: none;
  }
}

@media (max-width: 640px) {
  .pricing-section {
    padding: 4rem 0;
  }

  .pricing-grid.cols-2,
  .pricing-grid.cols-3,
  .pricing-grid.cols-4 {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
