/**
 * Modern Minimal - Home Page
 *
 * Features:
 * - Sticky navigation bar
 * - Full-width hero with overlapping elements
 * - Featured items showcase
 * - Trust indicators
 * - Testimonials
 * - CTA section
 */

import type { TemplatePage } from '../../types'
import { navigationSection } from '../../shared/navigation'

export const homePage: TemplatePage = {
  id: 'home',
  name: 'Home',
  slug: '/',
  title: 'Home',
  description: 'Welcome to our party rental service',
  sections: [
    // =========================================================================
    // NAVIGATION BAR
    // Sticky header with logo, links, and CTA
    // =========================================================================
    navigationSection,

    // =========================================================================
    // HERO SECTION
    // Full-bleed background with overlapping content card
    // =========================================================================
    {
      id: 'hero',
      name: 'Hero',
      html: `
<section class="relative min-h-[90vh] flex items-center overflow-hidden">
  <!-- Background with gradient overlay -->
  <div class="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80"
      alt="Party celebration"
      class="w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
  </div>

  <!-- Content -->
  <div class="container relative z-10 py-20 lg:py-32">
    <div class="max-w-2xl">
      <!-- Eyebrow -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm font-medium mb-6 animate-fade-in-up">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>Trusted by 500+ families</span>
      </div>

      <!-- Headline with gradient accent -->
      <h1 class="text-display font-bold text-[var(--color-text)] mb-6 animate-fade-in-up stagger-1">
        Make Every Party
        <span class="gradient-text block">Unforgettable</span>
      </h1>

      <!-- Subheadline -->
      <p class="text-xl text-[var(--color-text-muted)] mb-8 animate-fade-in-up stagger-2 max-w-xl">
        Premium bounce house rentals delivered to your door. Safe, clean, and ready for fun. Serving the entire metro area with same-day availability.
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-4 animate-fade-in-up stagger-3">
        <a href="/booking" class="btn-primary shadow-primary">
          <span>Book Now</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <a href="/inventory" class="btn-secondary">
          Browse Rentals
        </a>
      </div>

      <!-- Trust badges -->
      <div class="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-[var(--color-border)] animate-fade-in-up stagger-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm text-[var(--color-text-muted)]">Free delivery</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm text-[var(--color-text-muted)]">Same-day setup</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm text-[var(--color-text-muted)]">Fully insured</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating decorative element -->
  <div class="hidden lg:block absolute right-20 bottom-20 animate-float">
    <div class="w-24 h-24 rounded-2xl bg-[var(--color-accent)] shadow-xl transform rotate-12"></div>
  </div>
</section>
      `.trim()
    },

    // =========================================================================
    // FEATURED ITEMS SECTION
    // Uses smart block for dynamic inventory data
    // =========================================================================
    {
      id: 'featured',
      name: 'Featured Items',
      html: `
<section class="section-lg bg-[var(--color-surface)]">
  <div class="container">
    <!-- Section header with asymmetric layout -->
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
      <div>
        <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Popular Rentals</span>
        <h2 class="text-headline font-bold text-[var(--color-text)]">
          Party Favorites
        </h2>
      </div>
      <a href="/inventory" class="link-underline text-[var(--color-primary)] font-medium inline-flex items-center gap-2 group">
        View all rentals
        <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>

    <!-- Smart block: Featured items grid - replaced with real inventory data -->
    <div data-smart-block="featured-items">
      <!-- Placeholder grid shown in editor - replaced with real data when template is applied -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group bg-[var(--color-surface)] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow)] hover:shadow-[var(--shadow-xl)] transition-all duration-300 hover-lift">
          <div class="relative aspect-[4/3] overflow-hidden img-zoom bg-gray-200">
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <span class="absolute top-4 right-4 px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full">Category</span>
          </div>
          <div class="p-6">
            <span class="text-sm text-[var(--color-text-muted)] font-medium">Category</span>
            <h3 class="text-xl font-bold text-[var(--color-text)] mt-1 mb-3">Item Name</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-[var(--color-primary)]">$XXX</span>
                <span class="text-sm text-[var(--color-text-muted)]">/day</span>
              </div>
              <a href="#" class="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity">View Details</a>
            </div>
          </div>
        </div>
        <!-- More placeholder cards would repeat here -->
      </div>
    </div>
  </div>
</section>
      `.trim()
    },

    // =========================================================================
    // HOW IT WORKS SECTION
    // Clean process steps with numbered badges
    // =========================================================================
    {
      id: 'how-it-works',
      name: 'How It Works',
      html: `
<section class="section bg-[var(--color-background)]">
  <div class="container">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Simple Process</span>
      <h2 class="text-headline font-bold text-[var(--color-text)] mb-4">
        Book Your Party in 3 Easy Steps
      </h2>
      <p class="text-lg text-[var(--color-text-muted)]">
        We handle all the heavy lifting so you can focus on enjoying your event
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
      <!-- Step 1 -->
      <div class="relative text-center group">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)] text-[var(--color-text-on-primary)] flex items-center justify-center text-2xl font-bold shadow-primary group-hover:scale-110 transition-transform">
          1
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">Choose Your Rental</h3>
        <p class="text-[var(--color-text-muted)]">
          Browse our selection of bounce houses, water slides, and party equipment. Filter by size, theme, or occasion.
        </p>
        <!-- Connector line (hidden on mobile) -->
        <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[var(--color-border)]"></div>
      </div>

      <!-- Step 2 -->
      <div class="relative text-center group">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)] text-[var(--color-text-on-primary)] flex items-center justify-center text-2xl font-bold shadow-primary group-hover:scale-110 transition-transform">
          2
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">Pick Your Date</h3>
        <p class="text-[var(--color-text-muted)]">
          Select your event date and see real-time availability. Book online in minutes with instant confirmation.
        </p>
        <!-- Connector line -->
        <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[var(--color-border)]"></div>
      </div>

      <!-- Step 3 -->
      <div class="text-center group">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-accent)] text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
          3
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">We Deliver & Setup</h3>
        <p class="text-[var(--color-text-muted)]">
          Our team arrives on time, sets everything up safely, and returns to pick it up when your event is over.
        </p>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-12">
      <a href="/booking" class="btn-primary">
        Start Booking
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
      `.trim()
    },

    // =========================================================================
    // TESTIMONIALS SECTION
    // Customer reviews with overlapping cards
    // =========================================================================
    {
      id: 'testimonials',
      name: 'Testimonials',
      html: `
<section class="section-lg bg-[var(--color-surface-alt)] overflow-hidden">
  <div class="container">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Testimonials</span>
      <h2 class="text-headline font-bold text-[var(--color-text)]">
        What Our Customers Say
      </h2>
    </div>

    <!-- Testimonials grid with offset -->
    <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
      <!-- Testimonial 1 -->
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow)] hover-lift">
        <div class="flex gap-1 mb-4">
          ${Array(5).fill('<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('')}
        </div>
        <p class="text-[var(--color-text)] mb-6 leading-relaxed">
          "The kids had an absolute blast! Setup was quick and professional. The bounce house was spotless and in perfect condition. Will definitely book again!"
        </p>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-on-primary)] font-semibold">
            SM
          </div>
          <div>
            <p class="font-semibold text-[var(--color-text)]">Sarah Mitchell</p>
            <p class="text-sm text-[var(--color-text-muted)]">Birthday Party</p>
          </div>
        </div>
      </div>

      <!-- Testimonial 2 - offset up -->
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow)] hover-lift md:-mt-8">
        <div class="flex gap-1 mb-4">
          ${Array(5).fill('<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('')}
        </div>
        <p class="text-[var(--color-text)] mb-6 leading-relaxed">
          "Best party rental experience we've ever had. The equipment was clean, safe, and the delivery team was fantastic. Our school event was a huge success!"
        </p>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-semibold">
            MT
          </div>
          <div>
            <p class="font-semibold text-[var(--color-text)]">Mike Thompson</p>
            <p class="text-sm text-[var(--color-text-muted)]">School Event</p>
          </div>
        </div>
      </div>

      <!-- Testimonial 3 -->
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow)] hover-lift">
        <div class="flex gap-1 mb-4">
          ${Array(5).fill('<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('')}
        </div>
        <p class="text-[var(--color-text)] mb-6 leading-relaxed">
          "Made my daughter's 7th birthday unforgettable! Great customer service from start to finish. The princess castle was exactly what she wanted."
        </p>
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-semibold">
            JL
          </div>
          <div>
            <p class="font-semibold text-[var(--color-text)]">Jennifer Lopez</p>
            <p class="text-sm text-[var(--color-text-muted)]">Birthday Party</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },

    // =========================================================================
    // CTA SECTION
    // Bold call-to-action with gradient background
    // =========================================================================
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="relative overflow-hidden">
  <!-- Gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-secondary)]"></div>

  <!-- Decorative shapes -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
  <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

  <div class="container relative z-10 py-20 lg:py-28">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-headline font-bold text-white mb-6">
        Ready to Make Your Event Unforgettable?
      </h2>
      <p class="text-xl text-white/80 mb-8">
        Book your bounce house today and get free delivery within 10 miles. Same-day availability for last-minute parties!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-white text-[var(--color-primary)] rounded-[var(--radius)] font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2">
          Book Now
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <a href="/contact" class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-[var(--radius)] font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          Call Us
        </a>
      </div>

      <!-- Contact info -->
      <div class="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span data-variable="business.phone">{{business.phone}}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span data-variable="business.email">{{business.email}}</span>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
