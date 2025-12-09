/**
 * Bounce Template - Home Page
 * Modern, clean family-friendly design with professional polish
 * Inspired by successful party rental brands
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
<section class="relative bg-white overflow-hidden">
  <!-- Subtle gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-sky-50"></div>

  <!-- Decorative shapes -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-transparent rounded-full blur-3xl"></div>
  <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-200/30 to-transparent rounded-full blur-3xl"></div>

  <div class="container relative z-10 py-20 lg:py-28">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div class="text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-full mb-6 shadow-lg shadow-pink-500/25">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Rated 5 Stars by 500+ Families</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Make Your Party
          <span class="block bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">Unforgettable</span>
        </h1>

        <p class="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Premium bounce houses and party rentals delivered to your doorstep. Safe, clean, and ready for fun. We handle everything so you can focus on celebrating.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a href="/booking" class="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 inline-flex items-center justify-center gap-2">
            Book Your Party
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm inline-flex items-center justify-center gap-2">
            Browse Rentals
          </a>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap gap-6 mt-10 pt-8 border-t border-slate-200 justify-center lg:justify-start">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-slate-900 text-sm">Fully Insured</p>
              <p class="text-slate-500 text-xs">$2M Coverage</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-slate-900 text-sm">On-Time Delivery</p>
              <p class="text-slate-500 text-xs">Free Setup</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-slate-900 text-sm">Sanitized Clean</p>
              <p class="text-slate-500 text-xs">After Every Use</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="relative">
          <!-- Main image -->
          <div class="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Kids enjoying bounce house at birthday party" class="w-full h-full object-cover"/>
          </div>
          <!-- Floating card -->
          <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full bg-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">J</div>
                <div class="w-8 h-8 rounded-full bg-sky-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
                <div class="w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
              </div>
              <div>
                <p class="text-slate-900 font-semibold text-sm">500+ Happy Parties</p>
                <p class="text-slate-500 text-xs">This Year Alone</p>
              </div>
            </div>
          </div>
          <!-- Decorative badge -->
          <div class="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
            Same-Day Available
          </div>
        </div>
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
<section class="py-20 bg-slate-50">
  <div class="container">
    <div class="text-center mb-12">
      <p class="text-pink-500 font-semibold mb-2">Most Popular</p>
      <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
        Customer Favorites
      </h2>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        Our most-booked rentals loved by families across the area. Quality guaranteed.
      </p>
    </div>

    <!-- Smart Block: Featured Items - replaced with real inventory data -->
    <div data-smart-block="featured-items">
      <!-- Placeholder grid shown in editor -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
          <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-16 h-16 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="absolute top-3 left-3 px-2 py-1 bg-pink-500 text-white text-xs font-semibold rounded-md">Popular</div>
          </div>
          <div class="p-5">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Item Name</h3>
            <p class="text-slate-500 text-sm mb-4">Perfect for birthday parties</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-slate-900">$XXX</span>
                <span class="text-slate-500 text-sm">/day</span>
              </div>
              <button class="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-12">
      <a href="/inventory" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all border border-slate-200 shadow-sm">
        View All Rentals
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
      id: 'how-it-works',
      name: 'How It Works',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-16">
      <p class="text-pink-500 font-semibold mb-2">Simple Process</p>
      <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
        How It Works
      </h2>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        We make party planning effortless. Three simple steps to the perfect celebration.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <!-- Step 1 -->
      <div class="relative text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/30">
          <span class="text-2xl font-bold text-white">1</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Choose Your Rental</h3>
        <p class="text-slate-600">
          Browse our selection and pick the perfect bounce house or party rental for your event.
        </p>
        <!-- Connector line (hidden on mobile) -->
        <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-pink-200 to-transparent"></div>
      </div>

      <!-- Step 2 -->
      <div class="relative text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/30">
          <span class="text-2xl font-bold text-white">2</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Book Your Date</h3>
        <p class="text-slate-600">
          Select your party date and time. We'll confirm availability instantly.
        </p>
        <!-- Connector line (hidden on mobile) -->
        <div class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-sky-200 to-transparent"></div>
      </div>

      <!-- Step 3 -->
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
          <span class="text-2xl font-bold text-white">3</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">We Handle the Rest</h3>
        <p class="text-slate-600">
          We deliver, set up, and pick up. You just enjoy the party with your guests!
        </p>
      </div>
    </div>

    <div class="text-center mt-12">
      <a href="/booking" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-500/30">
        Start Booking Now
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      html: `
<section class="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <div class="container">
    <div class="text-center mb-12">
      <p class="text-pink-400 font-semibold mb-2">Testimonials</p>
      <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
        Loved by Families
      </h2>
      <p class="text-lg text-slate-400 max-w-2xl mx-auto">
        See what our customers are saying about their party experience.
      </p>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"limit": 3}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="relative bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-3xl p-10 lg:p-14 shadow-2xl shadow-pink-500/20 overflow-hidden">
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 text-center">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make Memories?
          </h2>
          <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Book your party rental today and give your guests an unforgettable experience.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" class="px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-lg inline-flex items-center justify-center gap-2">
              Book Your Party
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a href="/contact" class="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/30 inline-flex items-center justify-center">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default homePage
