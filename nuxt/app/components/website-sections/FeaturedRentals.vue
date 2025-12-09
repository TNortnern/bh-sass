<script setup lang="ts">
interface RentalItem {
  id: string
  name: string
  image: string
  price: number
  category: string
  slug: string
}

interface Props {
  data: {
    headline: string
    subheadline: string
    items: RentalItem[]
    showPrices: boolean
    columns: 3 | 4
  }
  editable?: boolean
  tenantSlug?: string
}

withDefaults(defineProps<Props>(), {
  editable: false,
  tenantSlug: ''
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

const handleTextUpdate = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  emit('update', field, target.innerText)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <section class="featured-rentals">
    <div class="container">
      <div class="section-header">
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
        class="rentals-grid"
        :class="{ 'cols-4': data.columns === 4 }"
      >
        <a
          v-for="item in data.items"
          :key="item.id"
          :href="tenantSlug ? `/book/${tenantSlug}/${item.slug}` : '#'"
          class="rental-card"
        >
          <div class="card-image">
            <img
              :src="item.image"
              :alt="item.name"
            >
            <div class="card-overlay">
              <span class="view-details">View Details</span>
            </div>
          </div>
          <div class="card-content">
            <span class="card-category">{{ item.category }}</span>
            <h3 class="card-title">{{ item.name }}</h3>
            <div
              v-if="data.showPrices"
              class="card-price"
            >
              <span class="price-value">{{ formatPrice(item.price) }}</span>
              <span class="price-unit">/ day</span>
            </div>
          </div>
        </a>
      </div>

      <div class="section-footer">
        <a
          :href="tenantSlug ? `/book/${tenantSlug}` : '#'"
          class="view-all-button"
        >
          View All Rentals
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
          ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-rentals {
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

.rentals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.rentals-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.rental-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.rental-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #f9fafb;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.rental-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rental-card:hover .card-overlay {
  opacity: 1;
}

.view-details {
  padding: 0.625rem 1.25rem;
  background: white;
  color: #111;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
}

.card-content {
  padding: 1.25rem;
}

.card-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111;
}

.price-unit {
  font-size: 0.875rem;
  color: #9ca3af;
}

.section-footer {
  text-align: center;
  margin-top: 3rem;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: #111;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all-button:hover {
  background: #333;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .rentals-grid,
  .rentals-grid.cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .featured-rentals {
    padding: 4rem 0;
  }

  .rentals-grid,
  .rentals-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
