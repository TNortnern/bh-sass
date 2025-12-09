/**
 * Garden Template - Home Page
 * Natural, earthy design with greens and organic feel
 * Perfect for outdoor events, eco-friendly businesses, nature-themed parties
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
      name: 'Hero Section',
      html: `
<section class="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-stone-50 via-green-50 to-emerald-50">
  <!-- Decorative leaf patterns -->
  <div class="absolute inset-0 opacity-10">
    <svg class="absolute top-20 left-10 w-40 h-40 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.75 6c.69 0 1.25.56 1.25 1.25V12c0 .69-.56 1.25-1.25 1.25h-1.12l.62 6.92c.05.64-.44 1.2-1.08 1.25s-1.2-.44-1.25-1.08l-.67-7.09h-4.5l-.67 7.09c-.05.64-.61 1.13-1.25 1.08s-1.13-.61-1.08-1.25l.62-6.92H6.25C5.56 13.25 5 12.69 5 12V7.25C5 6.56 5.56 6 6.25 6h11.5zM12 2.5c1.38 0 2.5 1.12 2.5 2.5S13.38 7.5 12 7.5 9.5 6.38 9.5 5 10.62 2.5 12 2.5z"></path></svg>
    <svg class="absolute bottom-40 right-20 w-32 h-32 text-emerald-600 rotate-45" fill="currentColor" viewBox="0 0 24 24"><path d="M6.05 8.05a7 7 0 0 0 9.9 9.9l1.4 1.4a9 9 0 0 1-12.73-12.73l1.43 1.43z"></path></svg>
  </div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2.667c-.483.39-1.082 1.395-1.478 3.333h2.956c-.396-1.938-.995-2.943-1.478-3.333z" clip-rule="evenodd"></path></svg>
          Eco-Friendly Rentals
        </div>

        <h1 class="text-5xl lg:text-6xl font-bold text-stone-900 leading-tight">
          Outdoor Fun,
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Naturally</span>
        </h1>

        <p class="text-xl text-stone-600 leading-relaxed max-w-lg">
          Premium bounce houses and party equipment for your outdoor celebrations. Safe, clean, and environmentally conscious.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="/inventory" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
            Browse Rentals
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
          <a href="/contact" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-stone-700 font-semibold rounded-xl border-2 border-stone-200 hover:border-emerald-300 hover:text-emerald-600 transition-all">
            Get a Quote
          </a>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap items-center gap-8 pt-4">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-white"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-400 border-2 border-white"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 border-2 border-white"></div>
            </div>
            <span class="text-sm text-stone-600">500+ happy families</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="flex text-amber-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <span class="text-sm text-stone-600 ml-1">4.9/5</span>
          </div>
        </div>
      </div>

      <div class="relative">
        <!-- Decorative elements -->
        <div class="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-60 blur-2xl"></div>
        <div class="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-lime-200 to-green-200 rounded-full opacity-60 blur-2xl"></div>

        <!-- Image placeholder -->
        <div class="relative bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl aspect-[4/3] flex items-center justify-center border border-emerald-200">
          <div class="text-center p-8">
            <svg class="w-20 h-20 mx-auto mb-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p class="text-emerald-600 font-medium">Featured Rental Image</p>
          </div>
        </div>

        <!-- Floating badge -->
        <div class="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <p class="font-bold text-stone-900">Eco-Certified</p>
              <p class="text-sm text-stone-500">Clean & Safe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'categories',
      name: 'Categories',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-stone-900 mb-4">Explore Our Collection</h2>
      <p class="text-lg text-stone-600 max-w-2xl mx-auto">
        Quality equipment for outdoor celebrations of all kinds
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Bounce Houses -->
      <a href="/inventory?category=bounce_house" class="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 transition-all">
        <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        </div>
        <h3 class="font-bold text-stone-900 text-lg mb-2">Bounce Houses</h3>
        <p class="text-stone-600 text-sm">Classic outdoor fun</p>
        <div class="mt-4 text-emerald-600 font-medium text-sm group-hover:text-emerald-700">View Collection →</div>
      </a>

      <!-- Combo Units -->
      <a href="/inventory?category=combo" class="group relative bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-6 border border-lime-100 hover:border-lime-300 hover:shadow-lg hover:shadow-lime-100 transition-all">
        <div class="w-14 h-14 bg-gradient-to-br from-lime-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 class="font-bold text-stone-900 text-lg mb-2">Combo Units</h3>
        <p class="text-stone-600 text-sm">Bounce, slide, and climb</p>
        <div class="mt-4 text-lime-600 font-medium text-sm group-hover:text-lime-700">View Collection →</div>
      </a>

      <!-- Water Fun -->
      <a href="/inventory?category=water_slide" class="group relative bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-6 border border-cyan-100 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all">
        <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
        </div>
        <h3 class="font-bold text-stone-900 text-lg mb-2">Water Fun</h3>
        <p class="text-stone-600 text-sm">Beat the heat</p>
        <div class="mt-4 text-cyan-600 font-medium text-sm group-hover:text-cyan-700">View Collection →</div>
      </a>

      <!-- Party Extras -->
      <a href="/inventory?category=party_extras" class="group relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100 transition-all">
        <div class="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
        </div>
        <h3 class="font-bold text-stone-900 text-lg mb-2">Party Extras</h3>
        <p class="text-stone-600 text-sm">Complete your event</p>
        <div class="mt-4 text-amber-600 font-medium text-sm group-hover:text-amber-700">View Collection →</div>
      </a>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'featured',
      name: 'Featured Items',
      html: `
<section class="py-20 bg-gradient-to-b from-stone-50 to-white">
  <div class="container">
    <div class="flex justify-between items-end mb-12">
      <div>
        <h2 class="text-4xl font-bold text-stone-900 mb-4">Popular Rentals</h2>
        <p class="text-lg text-stone-600">Our most-loved outdoor equipment</p>
      </div>
      <a href="/inventory" class="hidden md:inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
        View All
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </a>
    </div>

    <!-- Smart Block: Featured Items Grid -->
    <div data-smart-block="featured-items" data-props='{"columns": 3, "limit": 6}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'why-us',
      name: 'Why Choose Us',
      html: `
<section class="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
  <div class="container">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4">Why Choose Us</h2>
      <p class="text-xl text-emerald-100 max-w-2xl mx-auto">
        Quality, safety, and service for your outdoor celebrations
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Safety First</h3>
        <p class="text-emerald-100">Inspected and sanitized before every rental</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">On-Time Delivery</h3>
        <p class="text-emerald-100">Always punctual so your party starts on time</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Eco-Friendly</h3>
        <p class="text-emerald-100">Green cleaning products, responsible practices</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Expert Team</h3>
        <p class="text-emerald-100">Professional setup and takedown included</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/20">
      <div class="text-center">
        <div class="text-4xl font-bold mb-1">500+</div>
        <div class="text-emerald-100">Happy Events</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold mb-1">50+</div>
        <div class="text-emerald-100">Rental Options</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold mb-1">4.9</div>
        <div class="text-emerald-100">Star Rating</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold mb-1">10+</div>
        <div class="text-emerald-100">Years Experience</div>
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
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-stone-900 mb-4">Customer Stories</h2>
      <p class="text-lg text-stone-600">Real reviews from happy families</p>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"layout": "grid", "limit": 3}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'CTA Section',
      html: `
<section class="py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
        Ready for Outdoor Fun?
      </h2>
      <p class="text-xl text-stone-300 mb-8">
        Book your rental today and create amazing outdoor memories. Free delivery within our service area!
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/inventory" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
          Browse Rentals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
        <a href="/contact" class="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
          Contact Us
        </a>
      </div>

      <div class="mt-12 flex flex-wrap justify-center gap-8 text-stone-400">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Free Setup
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Same-Day Available
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Weather Guarantee
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'footer',
      name: 'Footer',
      html: `
<footer class="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900 text-white">
  <div class="container py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <div class="md:col-span-1">
        <h3 class="text-lg font-bold mb-4">Garden Rentals</h3>
        <p class="text-sm text-stone-300 mb-4">Eco-friendly outdoor party equipment for nature-loving celebrations.</p>
        <div class="flex items-center gap-3">
          <a href="#" class="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
        </div>
      </div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Quick Links</h4><ul class="space-y-2"><li><a href="/" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Home</a></li><li><a href="/inventory" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Rentals</a></li><li><a href="/about" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">About</a></li><li><a href="/contact" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Contact</a></li></ul></div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Categories</h4><ul class="space-y-2"><li><a href="/inventory?category=bounce_house" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Bounce Houses</a></li><li><a href="/inventory?category=combo" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Combo Units</a></li><li><a href="/inventory?category=water_slide" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Water Fun</a></li><li><a href="/inventory?category=party_extras" class="text-stone-300 hover:text-emerald-400 text-sm transition-colors">Party Extras</a></li></ul></div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Contact</h4><ul class="space-y-3 text-sm text-stone-300"><li class="flex items-start gap-2"><svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>(555) 123-4567</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>info@gardenrentals.com</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>123 Garden Lane<br>Green City, OR 97202</span></li></ul></div>
    </div>
    <div class="border-t border-stone-700 mt-8 pt-6 text-center"><p class="text-sm text-stone-400">&copy; 2024 Garden Rentals. All rights reserved.</p></div>
  </div>
</footer>
      `.trim()
    }
  ]
}

export default homePage
