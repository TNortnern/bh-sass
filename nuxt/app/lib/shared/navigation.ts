/**
 * Shared Navigation Section
 * CSS-only responsive navbar (no JavaScript required)
 * Uses checkbox hack for mobile menu toggle
 */

import type { TemplatePageSection } from '../templates/types'

export const navigationSection: TemplatePageSection = {
  id: 'navbar',
  name: 'Navigation',
  html: `
<style>
  /* CSS-only mobile menu toggle */
  .nav-toggle { display: none; }
  .nav-toggle:checked ~ .mobile-menu { display: flex; }
  .nav-toggle:checked ~ .nav-container .hamburger-open { display: none; }
  .nav-toggle:checked ~ .nav-container .hamburger-close { display: block; }
  .hamburger-close { display: none; }
  @media (min-width: 768px) {
    .mobile-menu { display: none !important; }
    .hamburger-btn { display: none !important; }
  }
</style>
<nav class="sticky top-0 z-50 bg-white shadow-sm">
  <input type="checkbox" id="nav-toggle" class="nav-toggle" />
  <div class="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 text-xl font-bold text-gray-900 no-underline">
        <span class="text-2xl">🎪</span>
        <span>Party Rentals</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-1">
        <a href="/" class="px-4 py-2 text-gray-700 hover:text-rose-600 font-medium rounded-lg hover:bg-gray-50 transition-colors no-underline">Home</a>
        <a href="/inventory" class="px-4 py-2 text-gray-700 hover:text-rose-600 font-medium rounded-lg hover:bg-gray-50 transition-colors no-underline">Rentals</a>
        <a href="/about" class="px-4 py-2 text-gray-700 hover:text-rose-600 font-medium rounded-lg hover:bg-gray-50 transition-colors no-underline">About</a>
        <a href="/contact" class="px-4 py-2 text-gray-700 hover:text-rose-600 font-medium rounded-lg hover:bg-gray-50 transition-colors no-underline">Contact</a>
      </div>

      <!-- Desktop CTA -->
      <a href="/booking" class="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 no-underline">
        Book Now
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>

      <!-- Mobile Menu Button -->
      <label for="nav-toggle" class="hamburger-btn md:hidden p-2 text-gray-700 hover:text-gray-900 cursor-pointer">
        <svg class="hamburger-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg class="hamburger-close w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </label>
    </div>
  </div>

  <!-- Mobile Menu (CSS-only toggle) -->
  <div class="mobile-menu hidden flex-col bg-white border-t border-gray-100 md:hidden">
    <div class="px-4 py-4 space-y-1">
      <a href="/" class="block px-4 py-3 text-gray-700 hover:text-rose-600 hover:bg-gray-50 font-medium rounded-lg transition-colors no-underline">Home</a>
      <a href="/inventory" class="block px-4 py-3 text-gray-700 hover:text-rose-600 hover:bg-gray-50 font-medium rounded-lg transition-colors no-underline">Rentals</a>
      <a href="/about" class="block px-4 py-3 text-gray-700 hover:text-rose-600 hover:bg-gray-50 font-medium rounded-lg transition-colors no-underline">About</a>
      <a href="/contact" class="block px-4 py-3 text-gray-700 hover:text-rose-600 hover:bg-gray-50 font-medium rounded-lg transition-colors no-underline">Contact</a>
      <a href="/booking" class="block mt-3 px-4 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 text-center transition-colors no-underline">
        Book Now →
      </a>
    </div>
  </div>
</nav>
  `.trim()
}
