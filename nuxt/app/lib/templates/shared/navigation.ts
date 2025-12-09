/**
 * Shared Navigation Section
 *
 * A reusable navigation bar section that can be included in all templates.
 * Uses variable placeholders that get replaced with actual tenant data.
 */

import type { TemplatePageSection } from '../types'

export const createNavigationSection = (options?: {
  transparent?: boolean
  sticky?: boolean
  logoUrl?: string
}): TemplatePageSection => {
  const { transparent = false, sticky = true, logoUrl } = options || {}

  return {
    id: 'navigation',
    name: 'Navigation',
    html: `
<nav class="navigation-bar ${transparent ? 'transparent' : ''} ${sticky ? 'sticky top-0 z-50' : ''}">
  <div class="nav-container">
    <!-- Logo / Business Name -->
    <a href="/" class="nav-brand">
      ${logoUrl
        ? `
        <img src="${logoUrl}" alt="{{business.name}}" class="nav-logo" />
      `
        : `
        <div class="nav-logo-placeholder">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
          </svg>
        </div>
      `}
      <span class="brand-name" data-variable="business.name">{{business.name}}</span>
    </a>

    <!-- Desktop Navigation -->
    <div class="nav-links">
      <a href="#rentals" class="nav-link">Rentals</a>
      <a href="#how-it-works" class="nav-link">How It Works</a>
      <a href="#about" class="nav-link">About</a>
      <a href="#testimonials" class="nav-link">Reviews</a>
      <a href="#contact" class="nav-link">Contact</a>
    </div>

    <!-- CTA Button -->
    <div class="nav-actions">
      <a href="/booking" class="nav-cta">
        Book Now
      </a>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" onclick="this.closest('.navigation-bar').classList.toggle('menu-open')">
        <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div class="mobile-menu">
    <a href="#rentals" class="mobile-link">Rentals</a>
    <a href="#how-it-works" class="mobile-link">How It Works</a>
    <a href="#about" class="mobile-link">About</a>
    <a href="#testimonials" class="mobile-link">Reviews</a>
    <a href="#contact" class="mobile-link">Contact</a>
    <a href="/booking" class="mobile-cta">Book Now</a>
  </div>
</nav>
    `.trim(),
    css: `
/* Navigation Bar Styles */
.navigation-bar {
  background: var(--color-surface, #ffffff);
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  transition: all 0.3s ease;
}

.navigation-bar.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--color-surface, #ffffff) 90%, transparent);
}

.navigation-bar.transparent:not(.scrolled) {
  background: transparent;
  border-bottom: none;
}

.navigation-bar.transparent .nav-link,
.navigation-bar.transparent .brand-name {
  color: white;
}

.navigation-bar.transparent .mobile-menu-btn {
  color: white;
}

.nav-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.nav-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.nav-logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-primary, #3b82f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text, #111);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-muted, #4b5563);
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--color-primary, #3b82f6);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background: var(--color-primary, #3b82f6);
  color: var(--color-text-on-primary, white);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius, 8px);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text, #111);
  cursor: pointer;
}

.mobile-menu-btn .close-icon {
  display: none;
}

.navigation-bar.menu-open .mobile-menu-btn .hamburger-icon {
  display: none;
}

.navigation-bar.menu-open .mobile-menu-btn .close-icon {
  display: block;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  background: var(--color-surface, white);
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.navigation-bar.menu-open .mobile-menu {
  display: flex;
}

.mobile-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-muted, #4b5563);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.mobile-link:hover {
  background: var(--color-surface-alt, #f5f5f5);
  color: var(--color-text, #111);
}

.mobile-cta {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary, #3b82f6);
  color: var(--color-text-on-primary, white);
  font-weight: 600;
  text-align: center;
  border-radius: var(--radius, 8px);
  text-decoration: none;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .nav-cta {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}
    `.trim()
  }
}

// Pre-configured navigation sections for different styles
export const navigationSection = createNavigationSection()
export const transparentNavigationSection = createNavigationSection({ transparent: true })
export const stickyNavigationSection = createNavigationSection({ sticky: true })
