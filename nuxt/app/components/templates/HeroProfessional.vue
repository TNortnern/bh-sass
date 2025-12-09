<script setup lang="ts">
/**
 * Professional Template Hero
 *
 * Dark theme, centered layout, trust-focused
 * Inspired by Lexend Home 1 - authoritative, confident, corporate
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
  primaryColor: '#FF6B6B',
  secondaryColor: '#FFB347',
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
    class="hero-professional"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Background with gradient overlay -->
    <div class="hero-bg">
      <div class="hero-gradient" />
      <div class="hero-pattern" />
    </div>

    <!-- Floating decorative elements -->
    <div class="hero-decorations">
      <div class="deco deco-1" />
      <div class="deco deco-2" />
      <div class="deco deco-3" />
    </div>

    <div class="hero-container">
      <!-- Main content - centered -->
      <div class="hero-content">
        <!-- Trust badge -->
        <div class="hero-badge">
          <span class="badge-icon">★</span>
          <span>Trusted by 500+ Happy Families</span>
        </div>

        <!-- Main headline -->
        <h1 class="hero-title">
          <span class="title-line-1">Make Every Event</span>
          <span class="title-line-2">Unforgettable</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          Premium bounce houses and party equipment delivered to your door.
          Professional setup, fully insured, and memories that last a lifetime.
        </p>

        <!-- Trust indicators -->
        <div class="trust-badges">
          <div class="trust-badge">
            <div class="trust-icon">
              <UIcon
                name="i-lucide-shield-check"
                class="w-5 h-5"
              />
            </div>
            <span>Fully Insured</span>
          </div>
          <div class="trust-badge">
            <div class="trust-icon">
              <UIcon
                name="i-lucide-truck"
                class="w-5 h-5"
              />
            </div>
            <span>Free Delivery</span>
          </div>
          <div class="trust-badge">
            <div class="trust-icon">
              <UIcon
                name="i-lucide-sparkles"
                class="w-5 h-5"
              />
            </div>
            <span>Sanitized</span>
          </div>
          <div class="trust-badge">
            <div class="trust-icon">
              <UIcon
                name="i-lucide-clock"
                class="w-5 h-5"
              />
            </div>
            <span>Same Day Setup</span>
          </div>
        </div>

        <!-- CTA buttons -->
        <div class="hero-actions">
          <a
            href="#browse"
            class="btn-primary"
          >
            <span>Browse Rentals</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="w-5 h-5"
            />
          </a>
          <NuxtLink
            :to="`/site/${tenantSlug}/contact`"
            class="btn-outline"
          >
            Contact Us
          </NuxtLink>
        </div>

        <!-- Social proof -->
        <div class="social-proof">
          <div class="avatars">
            <div
              class="avatar"
              style="background: #FF6B6B;"
            >
              J
            </div>
            <div
              class="avatar"
              style="background: #FFB347;"
            >
              S
            </div>
            <div
              class="avatar"
              style="background: #10B981;"
            >
              M
            </div>
            <div
              class="avatar"
              style="background: #6366F1;"
            >
              K
            </div>
          </div>
          <span class="proof-text">Join 2,400+ happy customers this year</span>
        </div>
      </div>

      <!-- Featured items preview -->
      <div
        v-if="featuredItems.length > 0"
        class="hero-preview"
      >
        <div class="preview-grid">
          <NuxtLink
            v-for="(item, index) in featuredItems.slice(0, 3)"
            :key="item.id"
            :to="`/book/${tenantSlug}/${item.id}`"
            class="preview-card"
            :style="{ '--delay': `${0.6 + index * 0.15}s` }"
          >
            <img
              :src="item.image"
              :alt="item.name"
            >
            <div class="preview-overlay">
              <span class="preview-name">{{ item.name }}</span>
              <span class="preview-price">{{ formatPrice(item.price) }}/day</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <UIcon
        name="i-lucide-chevron-down"
        class="w-6 h-6"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-professional {
  --hero-primary: v-bind(primaryColor);
  --hero-secondary: v-bind(secondaryColor);

  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 6rem 0;
  overflow: hidden;
  background: #0a0a0b;
  color: white;
}

/* Background layers */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, var(--hero-primary), transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 80%, var(--hero-secondary), transparent 40%);
  opacity: 0.15;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Decorations */
.hero-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.deco {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 1s ease, transform 1s ease;
}

.hero-professional.is-visible .deco {
  opacity: 1;
  transform: scale(1);
}

.deco-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--hero-primary) 0%, transparent 70%);
  top: -200px;
  right: -100px;
  opacity: 0.1;
  filter: blur(80px);
}

.deco-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--hero-secondary) 0%, transparent 70%);
  bottom: -100px;
  left: -100px;
  opacity: 0.1;
  filter: blur(60px);
  transition-delay: 0.2s;
}

.deco-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--hero-primary) 0%, transparent 70%);
  top: 40%;
  left: 30%;
  opacity: 0.05;
  filter: blur(40px);
  transition-delay: 0.4s;
}

/* Container */
.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-container {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* Content */
.hero-content {
  text-align: center;
}

@media (min-width: 1024px) {
  .hero-content {
    text-align: left;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.hero-professional.is-visible .hero-badge {
  opacity: 1;
  transform: translateY(0);
}

.badge-icon {
  color: var(--hero-primary);
}

.hero-title {
  margin-bottom: 1.5rem;
}

.title-line-1,
.title-line-2 {
  display: block;
  font-family: 'Cal Sans', 'DM Sans', system-ui, sans-serif;
  line-height: 1.05;
  letter-spacing: -0.03em;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-professional.is-visible .title-line-1 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.1s;
}

.hero-professional.is-visible .title-line-2 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.2s;
}

.title-line-1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.title-line-2 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--hero-primary) 0%, var(--hero-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.7);
  max-width: 540px;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.3s;
}

@media (min-width: 1024px) {
  .hero-subtitle {
    margin-left: 0;
    margin-right: auto;
  }
}

.hero-professional.is-visible .hero-subtitle {
  opacity: 1;
  transform: translateY(0);
}

/* Trust badges */
.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.4s;
}

@media (min-width: 1024px) {
  .trust-badges {
    justify-content: flex-start;
  }
}

.hero-professional.is-visible .trust-badges {
  opacity: 1;
  transform: translateY(0);
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.8);
}

.trust-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--hero-primary);
}

/* Actions */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.5s;
}

@media (min-width: 1024px) {
  .hero-actions {
    justify-content: flex-start;
  }
}

.hero-professional.is-visible .hero-actions {
  opacity: 1;
  transform: translateY(0);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--hero-primary) 0%, var(--hero-secondary) 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: var(--hero-primary);
  color: var(--hero-primary);
}

/* Social proof */
.social-proof {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.6s;
}

@media (min-width: 1024px) {
  .social-proof {
    justify-content: flex-start;
  }
}

.hero-professional.is-visible .social-proof {
  opacity: 1;
  transform: translateY(0);
}

.avatars {
  display: flex;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #0a0a0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  margin-left: -0.5rem;
}

.avatar:first-child {
  margin-left: 0;
}

.proof-text {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Preview section */
.hero-preview {
  display: none;
  opacity: 0;
  transform: translateX(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}

@media (min-width: 1024px) {
  .hero-preview {
    display: block;
  }
}

.hero-professional.is-visible .hero-preview {
  opacity: 1;
  transform: translateX(0);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.preview-card {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 1rem;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  animation: card-reveal 0.6s ease forwards;
  animation-delay: var(--delay, 0.6s);
}

.preview-card:first-child {
  grid-row: span 2;
  aspect-ratio: auto;
}

@keyframes card-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.preview-card:hover img {
  transform: scale(1.05);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
}

.preview-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: white;
  margin-bottom: 0.25rem;
}

.preview-price {
  font-size: 0.8125rem;
  color: var(--hero-primary);
  font-weight: 600;
}

/* Scroll indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.4);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}
</style>
