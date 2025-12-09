<template>
  <section class="landing-content">
    <div class="content-wrapper">
      <!-- Left Side: Text Content -->
      <div class="content-text">
        <h2 class="content-headline">
          Getting started with BouncePro is easier than ever
        </h2>
        <p class="content-description">
          With our intuitive platform, you can easily set up your rental business online.
          Start accepting bookings in minutes, not days.
        </p>
        <button class="cta-button">
          <span>Get started for free</span>
          <svg
            class="arrow-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Right Side: Floating Card Mockups -->
      <div class="content-visual">
        <div class="cards-container">
          <!-- User Profile Card -->
          <div class="mock-card card-profile">
            <div class="card-header">
              <div class="avatar-placeholder" />
              <div class="header-text">
                <div class="text-line line-name" />
                <div class="text-line line-subtitle" />
              </div>
            </div>
            <div class="card-divider" />
            <div class="card-stats">
              <div class="stat-block">
                <div class="stat-bar bar-purple" />
                <div class="stat-label-line" />
              </div>
              <div class="stat-block">
                <div class="stat-bar bar-blue" />
                <div class="stat-label-line" />
              </div>
            </div>
          </div>

          <!-- Event Details Card -->
          <div class="mock-card card-event">
            <div class="event-image-placeholder">
              <div class="image-overlay" />
              <div class="play-button">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M8 5V19L19 12L8 5Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div class="event-content">
              <div class="event-title-line" />
              <div class="event-meta">
                <div class="meta-item">
                  <div class="meta-icon icon-calendar" />
                  <div class="meta-line" />
                </div>
                <div class="meta-item">
                  <div class="meta-icon icon-location" />
                  <div class="meta-line" />
                </div>
              </div>
              <div class="event-button" />
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="float-accent accent-1" />
          <div class="float-accent accent-2" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing-content {
  width: 100%;
  padding: 6rem 2rem;
  background: #F4F7FA;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* === LEFT SIDE: TEXT CONTENT === */
.content-text {
  opacity: 0;
  animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

.content-headline {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.2;
  color: #161C2D;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

.content-description {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #5A6477;
  margin-bottom: 2.5rem;
  max-width: 480px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #473BF0;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    0 4px 12px rgba(71, 59, 240, 0.2),
    0 1px 3px rgba(71, 59, 240, 0.1);
}

.cta-button:hover {
  background: #3D32D8;
  transform: translateY(-2px);
  box-shadow:
    0 8px 20px rgba(71, 59, 240, 0.3),
    0 2px 6px rgba(71, 59, 240, 0.15);
}

.cta-button:active {
  transform: translateY(0);
}

.arrow-icon {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

/* === RIGHT SIDE: FLOATING CARDS === */
.content-visual {
  position: relative;
  height: 500px;
  opacity: 0;
  animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

.cards-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.mock-card {
  position: absolute;
  background: white;
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(22, 28, 45, 0.1),
    0 4px 12px rgba(22, 28, 45, 0.05);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.mock-card:hover {
  transform: translateY(-8px) scale(1.02);
}

/* User Profile Card */
.card-profile {
  width: 320px;
  padding: 1.75rem;
  top: 50px;
  left: 0;
  transform: rotate(-2deg);
  z-index: 2;
  animation: floatCard 6s ease-in-out infinite;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #473BF0 0%, #6B5FFF 100%);
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.text-line {
  height: 12px;
  background: #E4E7EB;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.line-name {
  width: 120px;
  height: 14px;
  background: linear-gradient(90deg, #D1D5DB 0%, #E4E7EB 100%);
}

.line-subtitle {
  width: 80px;
  margin-bottom: 0;
}

.card-divider {
  height: 1px;
  background: #E4E7EB;
  margin-bottom: 1.5rem;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-bar {
  height: 8px;
  border-radius: 4px;
  flex: 1;
}

.bar-purple {
  background: linear-gradient(90deg, #473BF0 0%, #6B5FFF 100%);
  width: 70%;
}

.bar-blue {
  background: linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%);
  width: 50%;
}

.stat-label-line {
  width: 60px;
  height: 8px;
  background: #E4E7EB;
  border-radius: 4px;
}

/* Event Details Card */
.card-event {
  width: 340px;
  top: 180px;
  right: 0;
  transform: rotate(3deg);
  z-index: 3;
  overflow: hidden;
  animation: floatCard 6s ease-in-out 1s infinite;
}

.event-image-placeholder {
  position: relative;
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #6B5FFF 0%, #473BF0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
    linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
}

.play-button {
  position: relative;
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
}

.event-content {
  padding: 1.75rem;
}

.event-title-line {
  height: 16px;
  width: 80%;
  background: linear-gradient(90deg, #D1D5DB 0%, #E4E7EB 100%);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.meta-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
}

.icon-calendar {
  background: linear-gradient(135deg, #473BF0 0%, #6B5FFF 100%);
}

.icon-location {
  background: linear-gradient(135deg, #EC4899 0%, #F472B6 100%);
}

.meta-line {
  height: 10px;
  flex: 1;
  background: #E4E7EB;
  border-radius: 5px;
}

.event-button {
  height: 44px;
  background: linear-gradient(135deg, #473BF0 0%, #6B5FFF 100%);
  border-radius: 10px;
}

/* Floating Accent Elements */
.float-accent {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: floatAccent 8s ease-in-out infinite;
}

.accent-1 {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(71, 59, 240, 0.15) 0%, transparent 70%);
  top: 0;
  right: 20%;
  animation-delay: 0.5s;
}

.accent-2 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(107, 95, 255, 0.1) 0%, transparent 70%);
  bottom: 0;
  left: 10%;
  animation-delay: 1.5s;
}

/* === ANIMATIONS === */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes floatCard {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotate, 0deg));
  }
  50% {
    transform: translateY(-15px) rotate(var(--rotate, 0deg));
  }
}

@keyframes floatAccent {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.2);
  }
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 3rem;
  }

  .content-visual {
    height: 450px;
  }

  .card-profile {
    width: 280px;
  }

  .card-event {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .landing-content {
    padding: 4rem 1.5rem;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .content-text {
    text-align: center;
  }

  .content-description {
    margin-left: auto;
    margin-right: auto;
  }

  .content-visual {
    height: 400px;
    margin: 0 auto;
    max-width: 500px;
  }

  .card-profile {
    left: 50%;
    transform: translateX(-50%) rotate(-2deg);
  }

  .card-event {
    right: auto;
    left: 50%;
    transform: translateX(-40%) rotate(3deg);
  }
}

@media (max-width: 480px) {
  .content-headline {
    font-size: 1.75rem;
  }

  .content-description {
    font-size: 1rem;
  }

  .card-profile,
  .card-event {
    width: 260px;
  }

  .event-image-placeholder {
    height: 140px;
  }
}

/* Scroll-triggered animation setup */
@media (prefers-reduced-motion: no-preference) {
  .content-text,
  .content-visual {
    view-timeline: --content-timeline;
    animation-timeline: --content-timeline;
    animation-range: entry 0% cover 30%;
  }
}
</style>
