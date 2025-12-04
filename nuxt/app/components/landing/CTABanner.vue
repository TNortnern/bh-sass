<template>
  <section class="cta-banner">
    <!-- Animated background gradient -->
    <div class="cta-gradient"></div>

    <!-- Decorative elements -->
    <div class="cta-particles">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
    </div>

    <!-- Geometric pattern overlay -->
    <div class="cta-pattern"></div>

    <!-- Content -->
    <div class="cta-content">
      <div class="cta-badge">
        <UIcon name="i-lucide-sparkles" class="badge-icon" />
        <span>Free 14-Day Trial</span>
      </div>

      <h2 class="cta-title">
        Ready to grow your
        <span class="title-highlight">rental business?</span>
      </h2>

      <p class="cta-subtitle">
        Join thousands of party rental companies using BouncePro to streamline
        their operations and delight their customers.
      </p>

      <div class="cta-actions">
        <div class="cta-email-form">
          <UInput
            v-model="email"
            type="email"
            placeholder="Enter your email"
            size="xl"
            class="email-input"
            icon="i-lucide-mail"
          />
          <UButton
            size="xl"
            class="cta-button"
            @click="handleSignup"
          >
            Start Free Trial
            <UIcon name="i-lucide-arrow-right" class="button-icon" />
          </UButton>
        </div>
        <p class="cta-note">
          <UIcon name="i-lucide-check-circle" class="note-icon" />
          No credit card required • Cancel anytime
        </p>
      </div>

      <!-- Stats bar -->
      <div class="cta-stats">
        <div class="stat-item">
          <div class="stat-value">10,000+</div>
          <div class="stat-label">Active Rentals</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">98%</div>
          <div class="stat-label">Customer Satisfaction</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">$2M+</div>
          <div class="stat-label">Revenue Processed</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')

const handleSignup = () => {
  if (email.value) {
    // Navigate to signup with email pre-filled
    navigateTo(`/auth/signup?email=${encodeURIComponent(email.value)}`)
  } else {
    navigateTo('/auth/signup')
  }
}
</script>

<style scoped>
.cta-banner {
  position: relative;
  overflow: hidden;
  padding: 8rem 2rem;
  isolation: isolate;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards;
}

/* Animated gradient background */
.cta-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #ea580c 0%,
    #f97316 25%,
    #fb923c 50%,
    #f59e0b 75%,
    #d97706 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  z-index: -3;
}

/* Geometric pattern overlay */
.cta-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 237, 213, 0.15) 0%, transparent 50%),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(255, 255, 255, 0.03) 40px,
      rgba(255, 255, 255, 0.03) 80px
    );
  z-index: -2;
}

/* Floating particles */
.cta-particles {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
  backdrop-filter: blur(2px);
}

.particle-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 25s;
}

.particle-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation-delay: 3s;
  animation-duration: 20s;
}

.particle-3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 70%;
  animation-delay: 5s;
  animation-duration: 22s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 25%;
  animation-delay: 7s;
  animation-duration: 28s;
}

.particle-5 {
  width: 50px;
  height: 50px;
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
  animation-duration: 18s;
}

/* Content container */
.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Badge */
.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  font-size: 1rem;
  animation: sparkle 2s ease-in-out infinite;
}

/* Title */
.cta-title {
  font-family: 'Instrument Serif', 'Georgia', serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 600;
  line-height: 1.1;
  color: white;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards;
}

.title-highlight {
  display: block;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  position: relative;
}

.title-highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.4);
  transform: scaleX(0);
  animation: underlineGrow 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
}

/* Subtitle */
.cta-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.375rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  margin: 0 auto 3rem;
  font-weight: 400;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
}

/* Actions */
.cta-actions {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s backwards;
}

.cta-email-form {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.email-input {
  flex: 1;
  min-width: 280px;
}

.email-input :deep(input) {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #1e293b;
  font-size: 1rem;
  padding: 1.5rem 1.25rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.email-input :deep(input:focus) {
  background: white;
  border-color: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.email-input :deep(input::placeholder) {
  color: #64748b;
}

.cta-button {
  background: white !important;
  color: #ea580c !important;
  font-weight: 700;
  font-size: 1rem;
  padding: 1.5rem 2.5rem !important;
  border: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  background: #fffbf5 !important;
}

.button-icon {
  margin-left: 0.5rem;
  font-size: 1.25rem;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-button:hover .button-icon {
  transform: translateX(4px);
}

.cta-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.note-icon {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Stats bar */
.cta-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s backwards;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: 'Instrument Serif', 'Georgia', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.25);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-15px, -40px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(30px, -25px) scale(1.05);
    opacity: 0.45;
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
}

@keyframes underlineGrow {
  to {
    transform: scaleX(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .cta-banner {
    padding: 5rem 1.5rem;
  }

  .cta-email-form {
    flex-direction: column;
    max-width: 100%;
  }

  .email-input {
    min-width: 100%;
  }

  .cta-stats {
    gap: 2rem;
  }

  .stat-divider {
    display: none;
  }
}
</style>
