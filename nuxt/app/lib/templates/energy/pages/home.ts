/**
 * Energy Template - Home Page
 * Bold, dynamic dark theme for sports events and active entertainment
 * Refined professional aesthetic with high contrast accents
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
<section class="relative min-h-screen bg-zinc-950 overflow-hidden">
  <!-- Gradient accents -->
  <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 via-transparent to-transparent"></div>
  <div class="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent"></div>

  <!-- Subtle grid pattern -->
  <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 60px 60px;"></div>

  <div class="container relative z-10 py-24 lg:py-32">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="w-2 h-8 bg-emerald-500"></div>
          <span class="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Premier Party Rentals</span>
        </div>

        <h1 class="text-5xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
          Bring the
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">Energy</span>
        </h1>

        <p class="text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg">
          High-impact inflatables and obstacle courses for unforgettable events. Professional setup, premium equipment, guaranteed fun.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="/booking" class="group px-8 py-4 bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400 transition-all inline-flex items-center gap-3">
            <span>Book Now</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-900 hover:border-zinc-600 transition-all">
            View Equipment
          </a>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-12 mt-14 pt-10 border-t border-zinc-800">
          <div>
            <p class="text-4xl font-bold text-white">50+</p>
            <p class="text-sm text-zinc-500 mt-1">Rental Units</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-emerald-400">2K+</p>
            <p class="text-sm text-zinc-500 mt-1">Events Completed</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-cyan-400">5.0</p>
            <p class="text-sm text-zinc-500 mt-1">Star Rating</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="aspect-[4/5] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80" alt="Active outdoor event" class="w-full h-full object-cover"/>
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
        </div>
        <!-- Accent corners -->
        <div class="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-emerald-500"></div>
        <div class="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-cyan-500"></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'featured',
      name: 'Featured Items',
      html: `
<section class="py-24 bg-zinc-900">
  <div class="container">
    <div class="flex items-start justify-between mb-12">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-0.5 bg-emerald-500"></div>
          <span class="text-emerald-400 text-xs tracking-widest uppercase font-semibold">Featured</span>
        </div>
        <h2 class="text-3xl lg:text-4xl font-bold text-white">
          Popular Rentals
        </h2>
      </div>
      <a href="/inventory" class="hidden md:inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors font-medium">
        View All
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>

    <!-- Smart Block: Featured Items -->
    <div data-smart-block="featured-items">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="group bg-zinc-800/50 border border-zinc-800 hover:border-emerald-500/30 transition-all">
          <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-16 h-16 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-2">Item Name</h3>
            <p class="text-zinc-500 text-sm mb-4">High-impact entertainment</p>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-emerald-400">$XXX</span>
              <button class="px-4 py-2 bg-zinc-700 text-white text-sm font-semibold hover:bg-emerald-500 hover:text-zinc-950 transition-colors">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-12 md:hidden">
      <a href="/inventory" class="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-semibold hover:border-emerald-500 hover:text-emerald-400 transition-all">
        View All Equipment
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
      id: 'features',
      name: 'Features',
      html: `
<section class="py-24 bg-zinc-950">
  <div class="container">
    <div class="text-center mb-16">
      <span class="text-emerald-400 text-xs tracking-widest uppercase font-semibold">Why Choose Us</span>
      <h2 class="text-3xl lg:text-4xl font-bold text-white mt-4">
        Built for <span class="text-emerald-400">Performance</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors">
        <div class="w-12 h-12 bg-emerald-500/10 flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-3">Safety First</h3>
        <p class="text-zinc-400">
          Every unit inspected before each rental. Fully insured with professional-grade equipment.
        </p>
      </div>

      <div class="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/30 transition-colors">
        <div class="w-12 h-12 bg-cyan-500/10 flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-3">Fast Setup</h3>
        <p class="text-zinc-400">
          Professional crew gets everything running in under 30 minutes. Ready when you are.
        </p>
      </div>

      <div class="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors">
        <div class="w-12 h-12 bg-emerald-500/10 flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-3">Best Value</h3>
        <p class="text-zinc-400">
          Premium equipment at competitive prices. No hidden fees, transparent pricing always.
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
<section class="py-24 bg-zinc-900">
  <div class="container">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-0.5 bg-cyan-500"></div>
      <span class="text-cyan-400 text-xs tracking-widest uppercase font-semibold">Testimonials</span>
    </div>
    <div class="flex items-start justify-between mb-12">
      <h2 class="text-3xl lg:text-4xl font-bold text-white">
        What Customers Say
      </h2>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"limit": 3, "style": "energy"}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-24 bg-zinc-950 relative overflow-hidden">
  <!-- Background accents -->
  <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5"></div>

  <div class="container relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
        Ready to Bring the <span class="text-emerald-400">Energy?</span>
      </h2>
      <p class="text-xl text-zinc-400 mb-10">
        Book your event today. Limited availability on peak weekends.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-10 py-5 bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all inline-flex items-center gap-3">
          <span>Book Now</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <a href="/contact" class="px-10 py-5 border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-900 transition-all">
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

export default homePage
