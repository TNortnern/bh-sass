<script setup lang="ts">
/**
 * FeaturedProductsGrid - Grid of featured products with toggle visibility
 * Features: Toggle switch to show/hide, configurable columns, link to all products
 */
interface Product {
  id: string | number
  name: string
  price: number
  image?: string
  category?: string
  description?: string
}

interface Props {
  products: Product[]
  headline?: string
  subheadline?: string
  showToggle?: boolean
  initiallyVisible?: boolean
  columns?: 2 | 3 | 4
  limit?: number
  bookingUrl?: string
  cardStyle?: 'minimal' | 'vibrant' | 'dark' | 'playful' | 'garden' | 'neon' | 'energy'
  sectionStyle?: 'light' | 'dark'
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  headline: 'Featured Rentals',
  subheadline: 'Browse our most popular items',
  showToggle: true,
  initiallyVisible: true,
  columns: 3,
  limit: 6,
  bookingUrl: '/book',
  cardStyle: 'minimal',
  sectionStyle: 'light',
  primaryColor: '#f59e0b'
})

const isVisible = ref(props.initiallyVisible)

const displayedProducts = computed(() => {
  return props.products.slice(0, props.limit)
})

const gridCols = computed(() => {
  switch (props.columns) {
    case 2:
      return 'grid-cols-1 sm:grid-cols-2'
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }
})

const sectionStyles = computed(() => ({
  '--section-primary': props.primaryColor
}))
</script>

<template>
  <section
    class="featured-products-section"
    :class="[`style-${sectionStyle}`]"
    :style="sectionStyles"
  >
    <div class="section-container">
      <!-- Header with Toggle -->
      <div class="section-header">
        <div>
          <h2 class="section-headline">
            {{ headline }}
          </h2>
          <p class="section-subheadline">
            {{ subheadline }}
          </p>
        </div>
        <div
          v-if="showToggle"
          class="section-toggle"
        >
          <label class="toggle-label">
            <span>Show Featured</span>
            <button
              class="toggle-switch"
              :class="{ active: isVisible }"
              @click="isVisible = !isVisible"
            >
              <span class="toggle-knob" />
            </button>
          </label>
        </div>
      </div>

      <!-- Products Grid -->
      <Transition name="fade">
        <div
          v-if="isVisible && displayedProducts.length > 0"
          class="products-grid"
          :class="gridCols"
        >
          <ProductCard
            v-for="product in displayedProducts"
            :id="product.id"
            :key="product.id"
            :name="product.name"
            :price="product.price"
            :image="product.image"
            :category="product.category"
            :description="product.description"
            :booking-url="bookingUrl"
            :card-style="cardStyle"
            :primary-color="primaryColor"
          />
        </div>
      </Transition>

      <!-- Empty State -->
      <div
        v-if="isVisible && displayedProducts.length === 0"
        class="empty-state"
      >
        <p>No products available at this time.</p>
      </div>

      <!-- View All Link -->
      <div
        v-if="isVisible && products.length > limit"
        class="view-all-wrapper"
      >
        <a
          :href="`${bookingUrl}/inventory`"
          class="view-all-link"
        >
          View All {{ products.length }} Items
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-products-section {
  padding: 4rem 0;
  background: var(--section-bg, #f9fafb);
}

.featured-products-section.style-dark {
  --section-bg: #111111;
  --section-text: #ffffff;
  --section-text-muted: #a1a1aa;
}

.featured-products-section.style-light {
  --section-bg: #f9fafb;
  --section-text: #111111;
  --section-text-muted: #6b7280;
}

.section-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-headline {
  font-size: 2rem;
  font-weight: 700;
  color: var(--section-text, #111);
  margin-bottom: 0.5rem;
}

.section-subheadline {
  font-size: 1.125rem;
  color: var(--section-text-muted, #6b7280);
}

.section-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--section-text-muted, #6b7280);
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  background: #e5e7eb;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-switch.active {
  background: var(--section-primary, #f59e0b);
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(22px);
}

.products-grid {
  display: grid;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--section-text-muted, #6b7280);
}

.view-all-wrapper {
  margin-top: 2.5rem;
  text-align: center;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--section-primary, #f59e0b);
  text-decoration: none;
  transition: gap 0.2s;
}

.view-all-link:hover {
  gap: 0.75rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
