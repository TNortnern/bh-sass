<script setup lang="ts">
/**
 * Minimal Template Hero
 *
 * Clean whites, product-focused, modern SaaS aesthetic
 * Inspired by Lexend Home 3 - minimalist, conversion-focused
 */
interface Props {
  businessName: string
  tagline: string
  primaryColor?: string
  secondaryColor?: string
  featuredItems?: Array<{
    id: string
    name: string
    slug: string
    image: string
    price: number
    category?: string
  }>
  tenantSlug: string
}

withDefaults(defineProps<Props>(), {
  primaryColor: '#10B981',
  secondaryColor: '#3B82F6',
  featuredItems: () => []
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Animation state
const heroVisible = ref(false)
onMounted(() => {
  setTimeout(() => {
    heroVisible.value = true
  }, 100)
})
</script>

<template>
  <section
    class="hero-minimal"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Subtle background elements -->
    <div class="hero-bg">
      <div class="bg-gradient" />
      <div class="bg-grid" />
    </div>

    <div class="hero-container">
      <!-- Top section: Centered headline -->
      <div class="hero-header">
        <div class="hero-badge">
          <span class="badge-dot" />
          <span>Available for Weekend Bookings</span>
        </div>

        <h1 class="hero-title">
          Party Equipment Rentals
          <span class="title-highlight">Made Simple</span>
        </h1>

        <p class="hero-subtitle">
          Browse our collection of premium bounce houses and party equipment.
          Easy online booking, flexible delivery, and hassle-free setup.
        </p>

        <!-- Dual CTAs -->
        <div class="hero-actions">
          <a
            href="#browse"
            class="btn-primary"
          >
            <span>View All Rentals</span>
            <UIcon
              name="i-lucide-arrow-down"
              class="w-4 h-4"
            />
          </a>
          <NuxtLink
            :to="`/site/${tenantSlug}/contact`"
            class="btn-secondary"
          >
            <UIcon
              name="i-lucide-calendar"
              class="w-4 h-4"
            />
            <span>Request Quote</span>
          </NuxtLink>
        </div>

        <!-- Trust line -->
        <p class="trust-line">
          <UIcon
            name="i-lucide-check-circle"
            class="w-4 h-4"
          />
          <span>No credit card required to browse • Free delivery on orders $200+</span>
        </p>
      </div>

      <!-- Product showcase grid -->
      <div class="product-showcase">
        <div class="showcase-header">
          <h2 class="showcase-title">
            Popular Rentals
          </h2>
          <NuxtLink
            :to="`/book/${tenantSlug}#browse`"
            class="showcase-link"
          >
            View all
            <UIcon
              name="i-lucide-arrow-right"
              class="w-4 h-4"
            />
          </NuxtLink>
        </div>

        <div class="showcase-grid">
          <NuxtLink
            v-for="(item, index) in featuredItems.slice(0, 4)"
            :key="item.id"
            :to="`/book/${tenantSlug}/${item.slug}`"
            class="product-card"
            :style="{ '--delay': `${0.4 + index * 0.1}s` }"
          >
            <div class="product-image">
              <img
                :src="item.image"
                :alt="item.name"
              >
              <div class="product-quick-view">
                <span>Quick View</span>
              </div>
            </div>
            <div class="product-info">
              <span
                v-if="item.category"
                class="product-category"
              >{{ item.category }}</span>
              <h3 class="product-name">{{ item.name }}</h3>
              <div class="product-footer">
                <span class="product-price">{{ formatPrice(item.price) }}<small>/day</small></span>
                <span class="product-cta">
                  <UIcon
                    name="i-lucide-plus"
                    class="w-4 h-4"
                  />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-number">500+</span>
          <span class="stat-label">Happy Events</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-number">4.9</span>
          <span class="stat-label">Star Rating</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-number">Same Day</span>
          <span class="stat-label">Setup Available</span>
        </div>
        <div class="stat-divider" />
        <div class="stat">
          <span class="stat-number">100%</span>
          <span class="stat-label">Satisfaction</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-minimal {
  --hero-primary: v-bind(primaryColor);
  --hero-secondary: v-bind(secondaryColor);

  position: relative;
  min-height: 100vh;
  padding: 3rem 0 4rem;
  overflow: hidden;
  background: #FAFBFC;
}

/* Background */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 150%;
  height: 100%;
  background: radial-gradient(ellipse at center, var(--hero-primary) 0%, transparent 60%);
  opacity: 0.03;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Container */
.hero-container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header section */
.hero-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.hero-minimal.is-visible .hero-badge {
  opacity: 1;
  transform: translateY(0);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--hero-primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: #111827;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}

.hero-minimal.is-visible .hero-title {
  opacity: 1;
  transform: translateY(0);
}

.title-highlight {
  display: block;
  color: var(--hero-primary);
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #6B7280;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.hero-minimal.is-visible .hero-subtitle {
  opacity: 1;
  transform: translateY(0);
}

/* Actions */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.3s;
}

.hero-minimal.is-visible .hero-actions {
  opacity: 1;
  transform: translateY(0);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--hero-primary);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.625rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--hero-primary) 90%, black);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: white;
  color: #374151;
  font-weight: 600;
  font-size: 0.9375rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.625rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--hero-primary);
  color: var(--hero-primary);
}

.trust-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #9CA3AF;
  opacity: 0;
  transition: opacity 0.6s ease 0.4s;
}

.hero-minimal.is-visible .trust-line {
  opacity: 1;
}

.trust-line .w-4 {
  color: var(--hero-primary);
}

/* Product showcase */
.product-showcase {
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s ease 0.3s;
}

.hero-minimal.is-visible .product-showcase {
  opacity: 1;
  transform: translateY(0);
}

.showcase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.showcase-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.showcase-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--hero-primary);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.showcase-link:hover {
  gap: 0.625rem;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .showcase-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
}

.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #F3F4F6;
  opacity: 0;
  transform: translateY(20px);
  animation: card-appear 0.5s ease forwards;
  animation-delay: var(--delay, 0.4s);
}

@keyframes card-appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  background: #F9FAFB;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-quick-view {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-quick-view {
  opacity: 1;
}

.product-quick-view span {
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.product-info {
  padding: 1rem;
}

.product-category {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9CA3AF;
  margin-bottom: 0.375rem;
}

.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--hero-primary);
}

.product-price small {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9CA3AF;
}

.product-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #F3F4F6;
  border-radius: 0.5rem;
  color: #6B7280;
  transition: all 0.2s ease;
}

.product-card:hover .product-cta {
  background: var(--hero-primary);
  color: white;
}

/* Stats bar */
.stats-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #F3F4F6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.5s;
}

.hero-minimal.is-visible .stats-bar {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 768px) {
  .stats-bar {
    gap: 0;
    justify-content: space-around;
  }
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.5rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8125rem;
  color: #9CA3AF;
}

.stat-divider {
  display: none;
  width: 1px;
  height: 40px;
  background: #E5E7EB;
}

@media (min-width: 768px) {
  .stat-divider {
    display: block;
  }
}
</style>
