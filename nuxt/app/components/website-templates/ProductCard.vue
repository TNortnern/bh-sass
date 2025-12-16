<script setup lang="ts">
/**
 * ProductCard - Product card for website templates
 * Features: Image, name, price, category badge, View Details + Add to Cart buttons
 */
interface Props {
  id: string | number
  name: string
  price: number
  image?: string
  category?: string
  description?: string
  bookingUrl?: string
  cardStyle?: 'minimal' | 'vibrant' | 'dark' | 'playful' | 'garden' | 'neon' | 'energy'
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  cardStyle: 'minimal',
  bookingUrl: '/book',
  primaryColor: '#f59e0b'
})

const { addItem, formatPrice } = useTemplateCart()
const toast = useToast()

const handleAddToCart = () => {
  addItem({
    id: props.id,
    name: props.name,
    price: props.price,
    image: props.image
  })
  toast.add({
    title: 'Added to Cart',
    description: `${props.name} has been added to your cart.`,
    color: 'success'
  })
}

const cardStyles = computed(() => ({
  '--card-primary': props.primaryColor
}))
</script>

<template>
  <div
    class="product-card"
    :class="[`style-${cardStyle}`]"
    :style="cardStyles"
  >
    <!-- Image -->
    <div class="product-image-wrapper">
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="product-image"
        loading="lazy"
      >
      <div
        v-else
        class="product-image-placeholder"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect
            width="18"
            height="18"
            x="3"
            y="3"
            rx="2"
            ry="2"
          />
          <circle
            cx="9"
            cy="9"
            r="2"
          />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <!-- Category Badge -->
      <span
        v-if="category"
        class="product-category"
      >{{ category }}</span>
    </div>

    <!-- Content -->
    <div class="product-content">
      <h3 class="product-name">
        {{ name }}
      </h3>
      <p
        v-if="description"
        class="product-description"
      >
        {{ description }}
      </p>
      <p class="product-price">
        <span class="price-value">{{ formatPrice(price) }}</span>
        <span class="price-suffix">/day</span>
      </p>
    </div>

    <!-- Actions -->
    <div class="product-actions">
      <a
        :href="`${bookingUrl}?item=${id}`"
        class="btn-view-details"
      >
        View Details
      </a>
      <button
        class="btn-add-to-cart"
        @click="handleAddToCart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle
            cx="8"
            cy="21"
            r="1"
          />
          <circle
            cx="19"
            cy="21"
            r="1"
          />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        Add to Cart
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border, #e5e7eb);
  border-radius: var(--card-radius, 12px);
  overflow: hidden;
  transition: all 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Style variants */
.product-card.style-dark,
.product-card.style-neon,
.product-card.style-energy {
  --card-bg: #1f1f1f;
  --card-border: rgba(255, 255, 255, 0.1);
  --card-text: #ffffff;
  --card-text-muted: #a1a1aa;
}

.product-card.style-minimal {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-text: #111111;
  --card-text-muted: #6b7280;
}

.product-card.style-vibrant {
  --card-bg: #ffffff;
  --card-border: transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-card.style-playful {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-radius: 20px;
}

.product-card.style-garden {
  --card-bg: #ffffff;
  --card-border: #d1d5db;
  --card-radius: 16px;
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--card-bg, #f5f5f5);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #9ca3af;
}

.style-dark .product-image-placeholder,
.style-neon .product-image-placeholder,
.style-energy .product-image-placeholder {
  background: #2a2a2a;
  color: #525252;
}

.product-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: var(--card-primary, #f59e0b);
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
}

.product-content {
  padding: 1.25rem;
  flex: 1;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--card-text, #111);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-description {
  font-size: 0.875rem;
  color: var(--card-text-muted, #6b7280);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--card-primary, #f59e0b);
}

.price-suffix {
  font-size: 0.875rem;
  color: var(--card-text-muted, #6b7280);
}

.product-actions {
  display: flex;
  gap: 8px;
  padding: 0 1.25rem 1.25rem;
}

.btn-view-details {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid var(--card-border, #e5e7eb);
  color: var(--card-text, #111);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-view-details:hover {
  border-color: var(--card-primary, #f59e0b);
  color: var(--card-primary, #f59e0b);
}

.btn-add-to-cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.75rem 1rem;
  background: var(--card-primary, #f59e0b);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-add-to-cart:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
