<script setup lang="ts">
/**
 * Festive Template Hero
 *
 * Warm tones, split two-column layout, photo collages
 * Inspired by Lexend Home 2 - friendly, inviting, fun
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

// Animation state
const heroVisible = ref(false)
onMounted(() => {
  setTimeout(() => {
    heroVisible.value = true
  }, 100)
})

// Sample party photos for collage
const partyImages = [
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=400&fit=crop',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=350&fit=crop'
]
</script>

<template>
  <section
    class="hero-festive"
    :class="{ 'is-visible': heroVisible }"
  >
    <!-- Decorative elements -->
    <div class="hero-decorations">
      <div class="confetti confetti-1" />
      <div class="confetti confetti-2" />
      <div class="confetti confetti-3" />
      <div class="balloon balloon-1">
        🎈
      </div>
      <div class="balloon balloon-2">
        🎉
      </div>
      <div class="star star-1">
        ✦
      </div>
      <div class="star star-2">
        ✦
      </div>
      <div class="star star-3">
        ✦
      </div>
    </div>

    <div class="hero-container">
      <!-- Left column: Content -->
      <div class="hero-content">
        <!-- Badge -->
        <div class="hero-badge">
          <span class="badge-emoji">🎊</span>
          <span>Let's Party!</span>
        </div>

        <!-- Headline -->
        <h1 class="hero-title">
          <span class="title-fun">Fun &amp; Bounce</span>
          <span class="title-main">For Every Celebration</span>
        </h1>

        <!-- Description -->
        <p class="hero-description">
          Transform your backyard into the ultimate party zone! We bring the fun with bounce houses, water slides, and party equipment the kids will love.
        </p>

        <!-- Quick booking form -->
        <div class="booking-form">
          <div class="form-header">
            <UIcon
              name="i-lucide-calendar"
              class="w-5 h-5"
            />
            <span>Plan Your Party</span>
          </div>
          <div class="form-content">
            <a
              :href="`/book/${tenantSlug}#browse`"
              class="form-btn-primary"
            >
              <span>Browse All Rentals</span>
              <UIcon
                name="i-lucide-arrow-right"
                class="w-5 h-5"
              />
            </a>
            <NuxtLink
              :to="`/site/${tenantSlug}/contact`"
              class="form-btn-secondary"
            >
              <UIcon
                name="i-lucide-phone"
                class="w-4 h-4"
              />
              <span>Call Us</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Trust features -->
        <div class="trust-features">
          <div class="feature">
            <div class="feature-icon">
              🚚
            </div>
            <div class="feature-text">
              <strong>Free Delivery</strong>
              <span>Within 20 miles</span>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              🧹
            </div>
            <div class="feature-text">
              <strong>Clean & Safe</strong>
              <span>Sanitized equipment</span>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              ⭐
            </div>
            <div class="feature-text">
              <strong>5-Star Rated</strong>
              <span>200+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: Photo collage -->
      <div class="hero-collage">
        <div class="collage-container">
          <!-- Main large image -->
          <div class="collage-item collage-main">
            <img
              :src="featuredItems[0]?.image || partyImages[0]"
              alt="Kids having fun on bounce house"
            >
            <div class="collage-badge">
              Most Popular! 🔥
            </div>
          </div>

          <!-- Secondary images -->
          <div class="collage-item collage-secondary-1">
            <img
              :src="featuredItems[1]?.image || partyImages[1]"
              alt="Party setup"
            >
          </div>

          <div class="collage-item collage-secondary-2">
            <img
              :src="featuredItems[2]?.image || partyImages[2]"
              alt="Birthday celebration"
            >
          </div>

          <!-- Floating card -->
          <div class="floating-card">
            <div class="card-emoji">
              🎂
            </div>
            <div class="card-text">
              <strong>Birthday Special!</strong>
              <span>10% off packages</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wave decoration at bottom -->
    <div class="hero-wave">
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,40 C320,100 420,0 740,60 C1060,120 1120,30 1440,80 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.hero-festive {
  --hero-primary: v-bind(primaryColor);
  --hero-secondary: v-bind(secondaryColor);
  --bg-warm: #FFF8F0;
  --bg-cream: #FFFAF5;

  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 4rem 0 8rem;
  overflow: hidden;
  background: linear-gradient(135deg, var(--bg-warm) 0%, var(--bg-cream) 100%);
}

/* Decorations */
.hero-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 1s ease;
}

.hero-festive.is-visible .confetti {
  opacity: 0.5;
}

.confetti-1 {
  background: radial-gradient(circle, var(--hero-primary) 0%, transparent 70%);
  top: 10%;
  right: 20%;
  filter: blur(60px);
}

.confetti-2 {
  background: radial-gradient(circle, var(--hero-secondary) 0%, transparent 70%);
  bottom: 20%;
  left: 10%;
  filter: blur(50px);
}

.confetti-3 {
  background: radial-gradient(circle, #FFD93D 0%, transparent 70%);
  top: 50%;
  left: 40%;
  width: 150px;
  height: 150px;
  filter: blur(40px);
}

.balloon {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.hero-festive.is-visible .balloon {
  opacity: 0.8;
  transform: translateY(0);
  animation: float 4s ease-in-out infinite;
}

.balloon-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.balloon-2 {
  top: 25%;
  right: 12%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.star {
  position: absolute;
  font-size: 1.5rem;
  color: var(--hero-secondary);
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-festive.is-visible .star {
  opacity: 0.6;
  animation: twinkle 2s ease-in-out infinite;
}

.star-1 { top: 20%; left: 25%; animation-delay: 0s; }
.star-2 { top: 35%; right: 30%; animation-delay: 0.5s; }
.star-3 { bottom: 35%; left: 15%; animation-delay: 1s; }

@keyframes twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
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
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr 1.1fr;
    gap: 4rem;
  }
}

/* Content */
.hero-content {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
}

.hero-festive.is-visible .hero-content {
  opacity: 1;
  transform: translateX(0);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 9999px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.badge-emoji {
  font-size: 1.25rem;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.title-fun {
  display: block;
  font-family: 'Quicksand', 'Nunito', system-ui, sans-serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--hero-primary);
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  color: #2D2D2D;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #666;
  margin-bottom: 2rem;
  max-width: 480px;
}

/* Booking form */
.booking-form {
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .form-content {
    flex-direction: row;
  }
}

.form-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--hero-primary) 0%, var(--hero-secondary) 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.form-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
}

.form-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f8f8f8;
  color: #333;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.form-btn-secondary:hover {
  background: #f0f0f0;
}

/* Trust features */
.trust-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  display: flex;
  flex-direction: column;
}

.feature-text strong {
  font-size: 0.875rem;
  font-weight: 700;
  color: #333;
}

.feature-text span {
  font-size: 0.8125rem;
  color: #888;
}

/* Collage */
.hero-collage {
  display: none;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}

@media (min-width: 1024px) {
  .hero-collage {
    display: block;
  }
}

.hero-festive.is-visible .hero-collage {
  opacity: 1;
  transform: translateX(0);
}

.collage-container {
  position: relative;
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  min-height: 500px;
}

.collage-item {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  transform: rotate(0);
  transition: transform 0.3s ease;
}

.collage-item:hover {
  transform: scale(1.02) rotate(0);
}

.collage-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collage-main {
  grid-row: span 2;
  transform: rotate(-2deg);
}

.collage-main:hover {
  transform: scale(1.02) rotate(-2deg);
}

.collage-secondary-1 {
  transform: rotate(3deg);
}

.collage-secondary-1:hover {
  transform: scale(1.02) rotate(3deg);
}

.collage-secondary-2 {
  transform: rotate(-1deg);
}

.collage-secondary-2:hover {
  transform: scale(1.02) rotate(-1deg);
}

.collage-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Floating card */
.floating-card {
  position: absolute;
  bottom: 2rem;
  left: -1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 10;
  animation: card-bounce 3s ease-in-out infinite;
}

@keyframes card-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.card-emoji {
  font-size: 2rem;
}

.card-text {
  display: flex;
  flex-direction: column;
}

.card-text strong {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #333;
}

.card-text span {
  font-size: 0.8125rem;
  color: var(--hero-primary);
  font-weight: 500;
}

/* Wave */
.hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  color: white;
}

.hero-wave svg {
  width: 100%;
  height: 100%;
}
</style>
