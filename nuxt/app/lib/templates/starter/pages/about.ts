/**
 * Modern Minimal - About Page
 */

import type { TemplatePage } from '../../types'

export const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About',
  slug: '/about',
  title: 'About Us',
  description: 'Learn about our party rental business',
  sections: [
    {
      id: 'about-hero',
      name: 'About Hero',
      html: `
<section class="relative py-20 lg:py-28 overflow-hidden">
  <!-- Background -->
  <div class="absolute inset-0 z-0">
    <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-alt)]"></div>
    <div class="absolute top-20 right-20 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
  </div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div>
        <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Our Story</span>
        <h1 class="text-display font-bold text-[var(--color-text)] mb-6">
          Bringing Joy to
          <span class="gradient-text">Every Party</span>
        </h1>
        <p class="text-xl text-[var(--color-text-muted)] mb-6">
          What started as a single bounce house in our backyard has grown into the area's most trusted party rental service. We're passionate about creating unforgettable memories for families.
        </p>
        <p class="text-lg text-[var(--color-text-muted)]">
          Every rental is personally inspected, cleaned, and delivered by our dedicated team. We're not just renting equipment—we're helping you create moments that last a lifetime.
        </p>
      </div>

      <!-- Image with overlapping elements -->
      <div class="relative">
        <div class="relative rounded-[var(--radius-xl)] overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
            alt="Kids having fun at a party"
            class="w-full h-auto"
          />
        </div>
        <!-- Overlapping stats card -->
        <div class="absolute -bottom-6 -left-6 bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-xl">
          <div class="text-4xl font-bold text-[var(--color-primary)] mb-1">10+</div>
          <div class="text-sm text-[var(--color-text-muted)]">Years of Experience</div>
        </div>
        <div class="absolute -top-6 -right-6 bg-[var(--color-primary)] rounded-[var(--radius-lg)] p-6 shadow-xl">
          <div class="text-4xl font-bold text-white mb-1">5000+</div>
          <div class="text-sm text-white/80">Happy Families</div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'about-values',
      name: 'Our Values',
      html: `
<section class="section bg-[var(--color-background)]">
  <div class="container">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-headline font-bold text-[var(--color-text)] mb-4">What Sets Us Apart</h2>
      <p class="text-lg text-[var(--color-text-muted)]">
        We're committed to providing the best experience for your family
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Value 1 -->
      <div class="text-center p-8">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">Safety First</h3>
        <p class="text-[var(--color-text-muted)]">
          All equipment is inspected before and after every rental. We're fully licensed and insured for your peace of mind.
        </p>
      </div>

      <!-- Value 2 -->
      <div class="text-center p-8">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">Spotless Clean</h3>
        <p class="text-[var(--color-text-muted)]">
          Commercial-grade cleaning and sanitization after every use. Your children's health is our priority.
        </p>
      </div>

      <!-- Value 3 -->
      <div class="text-center p-8">
        <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-3">On-Time Delivery</h3>
        <p class="text-[var(--color-text-muted)]">
          We arrive when we say we will. Professional setup and takedown so you can focus on enjoying your event.
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'about-cta',
      name: 'About CTA',
      html: `
<section class="section bg-[var(--color-surface)]">
  <div class="container">
    <div class="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[var(--radius-xl)] p-10 lg:p-16 text-center">
      <h2 class="text-headline font-bold text-white mb-4">Ready to Book Your Party?</h2>
      <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Let's make your next event one to remember. Browse our selection or give us a call!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/inventory" class="px-8 py-4 bg-white text-[var(--color-primary)] rounded-[var(--radius)] font-semibold hover:bg-white/90 transition-colors">
          Browse Rentals
        </a>
        <a href="/contact" class="px-8 py-4 border-2 border-white text-white rounded-[var(--radius)] font-semibold hover:bg-white/10 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
