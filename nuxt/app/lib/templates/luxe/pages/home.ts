/**
 * Luxe Template - Home Page
 * Elegant, sophisticated design for upscale events
 */

import type { TemplatePage } from '../../types'
import { navigationSection } from '../../shared/navigation'

const homePage: TemplatePage = {
  id: 'home',
  name: 'Home',
  slug: '/',
  title: 'Home',
  sections: [
    // Navigation Bar
    navigationSection,
    {
      id: 'hero',
      name: 'Hero',
      html: `
<section class="relative min-h-screen bg-stone-950 overflow-hidden">
  <!-- Elegant gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-stone-950 to-stone-950"></div>

  <!-- Subtle pattern -->
  <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><path d=%22M30 0L60 30L30 60L0 30Z%22 fill=%22none%22 stroke=%22%23d4af37%22 stroke-width=%220.5%22/></svg>');"></div>

  <div class="container relative z-10 py-24 lg:py-32">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
          <span class="text-amber-400 text-sm font-medium tracking-[0.3em] uppercase">Premium Event Rentals</span>
        </div>

        <h1 class="text-5xl lg:text-7xl font-light text-white mb-8 leading-tight tracking-tight">
          Elevate Your
          <span class="block font-serif italic text-amber-400">Celebration</span>
        </h1>

        <p class="text-xl text-stone-400 mb-10 leading-relaxed max-w-lg">
          Curated collection of premium inflatables for distinguished events. White-glove service for those who expect nothing less than perfection.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="/booking" class="group px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-semibold tracking-wide hover:from-amber-300 hover:to-amber-400 transition-all inline-flex items-center gap-3">
            <span>Request Consultation</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="px-8 py-4 border border-stone-700 text-stone-300 font-medium tracking-wide hover:bg-stone-900 hover:border-stone-600 transition-all">
            View Collection
          </a>
        </div>

        <!-- Prestige indicators -->
        <div class="flex items-center gap-8 mt-12 pt-8 border-t border-stone-800">
          <div>
            <p class="text-3xl font-light text-white">12+</p>
            <p class="text-xs text-stone-500 tracking-wider uppercase">Years Excellence</p>
          </div>
          <div class="w-px h-12 bg-stone-800"></div>
          <div>
            <p class="text-3xl font-light text-white">500+</p>
            <p class="text-xs text-stone-500 tracking-wider uppercase">Elite Events</p>
          </div>
          <div class="w-px h-12 bg-stone-800"></div>
          <div>
            <p class="text-3xl font-light text-amber-400">5★</p>
            <p class="text-xs text-stone-500 tracking-wider uppercase">Rating</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="aspect-[4/5] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80" alt="Elegant event setup" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
        </div>
        <!-- Decorative frame -->
        <div class="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-amber-400/50"></div>
        <div class="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-amber-400/50"></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'featured',
      name: 'Featured Collection',
      html: `
<section class="py-24 bg-stone-950">
  <div class="container">
    <div class="max-w-xl mb-16">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-px bg-amber-400"></div>
        <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Curated Selection</span>
      </div>
      <h2 class="text-4xl lg:text-5xl font-light text-white mb-4">
        The <span class="font-serif italic text-amber-400">Collection</span>
      </h2>
      <p class="text-stone-400 leading-relaxed">
        Meticulously maintained and styled for the most discerning clientele.
      </p>
    </div>

    <!-- Smart Block: Featured Items - replaced with real inventory data -->
    <div data-smart-block="featured-items">
      <!-- Placeholder grid shown in editor -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group bg-stone-900 rounded-xl overflow-hidden border border-amber-500/20">
          <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center">
            <span class="text-5xl opacity-50">✨</span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-light text-white tracking-wide mb-3">Item Name</h3>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-light text-amber-400">$XXX</span>
              <span class="px-5 py-2 bg-amber-500 text-stone-900 font-semibold">Reserve</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-16">
      <a href="/inventory" class="inline-flex items-center gap-3 px-8 py-4 border border-amber-400/30 text-amber-400 font-medium tracking-wide hover:bg-amber-400/10 transition-all">
        <span>Explore Full Collection</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'services',
      name: 'Services',
      html: `
<section class="py-24 bg-gradient-to-b from-stone-950 to-stone-900">
  <div class="container">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Our Commitment</span>
      <h2 class="text-4xl font-light text-white mt-4 mb-6">
        White-Glove <span class="font-serif italic text-amber-400">Service</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="p-8 bg-stone-900/50 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-12 h-12 mb-6 flex items-center justify-center">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-3">Premium Quality</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Each piece is inspected, sanitized, and maintained to the highest standards before every event.
        </p>
      </div>

      <div class="p-8 bg-stone-900/50 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-12 h-12 mb-6 flex items-center justify-center">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-3">Punctual Service</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Our professional team arrives on time, every time. Setup and teardown handled with care.
        </p>
      </div>

      <div class="p-8 bg-stone-900/50 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-12 h-12 mb-6 flex items-center justify-center">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-3">Dedicated Support</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Personal event coordinator assigned to ensure your experience exceeds expectations.
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      html: `
<section class="py-24 bg-stone-900">
  <div class="container">
    <div class="text-center mb-16">
      <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Client Experiences</span>
      <h2 class="text-4xl font-light text-white mt-4">
        Words of <span class="font-serif italic text-amber-400">Distinction</span>
      </h2>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"limit": 3, "style": "luxe"}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-24 bg-stone-950 relative overflow-hidden">
  <!-- Decorative elements -->
  <div class="absolute top-0 left-0 w-64 h-64 border-t border-l border-amber-400/20"></div>
  <div class="absolute bottom-0 right-0 w-64 h-64 border-b border-r border-amber-400/20"></div>

  <div class="container relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Begin Your Journey</span>
      <h2 class="text-4xl lg:text-5xl font-light text-white mt-6 mb-8">
        Ready to Create Something
        <span class="block font-serif italic text-amber-400">Extraordinary?</span>
      </h2>
      <p class="text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed">
        Let us help you craft an unforgettable event. Our team is ready to bring your vision to life.
      </p>
      <a href="/booking" class="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-semibold tracking-wide hover:from-amber-300 hover:to-amber-400 transition-all">
        <span>Schedule Consultation</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default homePage
