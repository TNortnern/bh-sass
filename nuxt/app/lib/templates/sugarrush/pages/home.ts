/**
 * Sugar Rush Template - Home Page
 * Clean, bright, modern design inspired by successful party rental brands
 * Bright white backgrounds, coral/pink accents, playful but professional
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
  <!-- Background pattern -->
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#f43f5e 1px, transparent 1px); background-size: 32px 32px;"></div>

  <div class="container relative z-10 py-16 lg:py-24">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-sm font-medium rounded-full mb-6 border border-rose-100">
          <span class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          Trusted by 1,000+ Families
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1]">
          Party Rentals
          <span class="block text-rose-500">Made Easy</span>
        </h1>

        <p class="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
          Premium bounce houses, water slides, and party equipment delivered right to your door. Safe, clean, and guaranteed fun for every celebration.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <a href="/booking" class="px-8 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/25 inline-flex items-center justify-center gap-2">
            Book Your Party
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-colors border border-slate-200 inline-flex items-center justify-center gap-2">
            Browse Rentals
          </a>
        </div>

        <!-- Trust badges -->
        <div class="flex flex-wrap gap-8 mt-10 pt-8 border-t border-slate-100 justify-center lg:justify-start">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-slate-600 font-medium">Fully Insured</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-slate-600 font-medium">Free Delivery</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-slate-600 font-medium">Same Day Available</span>
          </div>
        </div>
      </div>

      <div class="relative">
        <!-- Main hero image -->
        <div class="relative">
          <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-100">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Kids enjoying bounce house party" class="w-full h-full object-cover"/>
          </div>

          <!-- Floating review card -->
          <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 max-w-xs">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex -space-x-1">
                <div class="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-xs">S</div>
                <div class="w-8 h-8 rounded-full bg-sky-100 border-2 border-white flex items-center justify-center text-sky-600 font-bold text-xs">J</div>
                <div class="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-amber-600 font-bold text-xs">M</div>
              </div>
              <div class="flex text-amber-400">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
            </div>
            <p class="text-sm text-slate-600">"Best party rental experience! Kids had a blast."</p>
            <p class="text-xs text-slate-400 mt-1">- Sarah M., Austin TX</p>
          </div>

          <!-- Stats badge -->
          <div class="absolute -top-4 -right-4 bg-rose-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            500+ Reviews
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
<section class="py-16 bg-slate-50">
  <div class="container">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-slate-900 mb-3">Shop by Category</h2>
      <p class="text-slate-600">Find the perfect rental for your event</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a href="/inventory?category=bounce_house" class="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200">
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div class="text-5xl mb-3">🏰</div>
          <h3 class="font-bold text-slate-900">Bounce Houses</h3>
          <p class="text-sm text-slate-600 mt-1">20+ options</p>
        </div>
        <div class="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors"></div>
      </a>

      <a href="/inventory?category=water_slide" class="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-sky-200">
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div class="text-5xl mb-3">🌊</div>
          <h3 class="font-bold text-slate-900">Water Slides</h3>
          <p class="text-sm text-slate-600 mt-1">15+ options</p>
        </div>
        <div class="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors"></div>
      </a>

      <a href="/inventory?category=combo" class="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div class="text-5xl mb-3">🎢</div>
          <h3 class="font-bold text-slate-900">Combos</h3>
          <p class="text-sm text-slate-600 mt-1">10+ options</p>
        </div>
        <div class="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
      </a>

      <a href="/inventory?category=obstacle" class="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div class="text-5xl mb-3">🏃</div>
          <h3 class="font-bold text-slate-900">Obstacle Courses</h3>
          <p class="text-sm text-slate-600 mt-1">8+ options</p>
        </div>
        <div class="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors"></div>
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
<section class="py-16 bg-white">
  <div class="container">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Customer Favorites</h2>
        <p class="text-slate-600">Our most popular rentals</p>
      </div>
      <a href="/inventory" class="hidden md:inline-flex items-center gap-2 text-rose-500 font-semibold hover:text-rose-600 transition-colors">
        View All
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>

    <!-- Smart Block: Featured Items -->
    <div data-smart-block="featured-items">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300">
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 bg-rose-500 text-white text-xs font-semibold rounded-md">Popular</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-lg font-semibold text-slate-900 mb-1">Item Name</h3>
            <p class="text-sm text-slate-500 mb-4">Perfect for birthday parties</p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-slate-900">$XXX</span>
                <span class="text-slate-400 text-sm">/day</span>
              </div>
              <button class="px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-lg hover:bg-rose-600 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-10 md:hidden">
      <a href="/inventory" class="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-600 transition-colors">
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
<section class="py-16 bg-rose-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
      <p class="text-slate-600 max-w-xl mx-auto">
        Three simple steps to the perfect party. We handle everything.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg border border-rose-100">
          <span class="text-3xl">1️⃣</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Choose & Book</h3>
        <p class="text-slate-600 text-sm">
          Browse our selection and book online in minutes. Pick your date and rental.
        </p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg border border-rose-100">
          <span class="text-3xl">2️⃣</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">We Deliver & Set Up</h3>
        <p class="text-slate-600 text-sm">
          Our team delivers and professionally sets up your rental at your location.
        </p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg border border-rose-100">
          <span class="text-3xl">3️⃣</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Party Time!</h3>
        <p class="text-slate-600 text-sm">
          Enjoy your event worry-free. We'll pick up when you're done celebrating.
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
<section class="py-16 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-3">What Our Customers Say</h2>
      <p class="text-slate-600">Join thousands of happy families</p>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"limit": 3, "style": "sugarrush"}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-16 bg-gradient-to-r from-rose-500 to-pink-500">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
        Ready to Make Memories?
      </h2>
      <p class="text-xl text-rose-100 mb-8">
        Book your party rental today and create an unforgettable celebration.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-white text-rose-600 font-semibold rounded-full hover:bg-rose-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2">
          Book Your Party
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
        <a href="/contact" class="px-8 py-4 bg-transparent text-white font-semibold rounded-full hover:bg-white/10 transition-colors border-2 border-white/30 inline-flex items-center justify-center">
          Contact Us
        </a>
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
<footer class="bg-slate-50 border-t border-slate-100">
  <div class="container py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="md:col-span-1">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Party Rentals</h3>
        <p class="text-sm text-slate-600 mb-4">
          Premium bounce houses and party equipment for unforgettable celebrations.
        </p>
        <!-- Social Links -->
        <div class="flex items-center gap-3">
          <a href="#" class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 uppercase mb-4">Quick Links</h4>
        <ul class="space-y-2">
          <li><a href="/" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Home</a></li>
          <li><a href="/inventory" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Rentals</a></li>
          <li><a href="/about" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">About Us</a></li>
          <li><a href="/contact" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Contact</a></li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 uppercase mb-4">Categories</h4>
        <ul class="space-y-2">
          <li><a href="/inventory?category=bounce_house" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Bounce Houses</a></li>
          <li><a href="/inventory?category=water_slide" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Water Slides</a></li>
          <li><a href="/inventory?category=combo" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Combos</a></li>
          <li><a href="/inventory?category=obstacle" class="text-slate-600 hover:text-rose-500 text-sm transition-colors">Obstacle Courses</a></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h4 class="text-sm font-semibold text-slate-900 uppercase mb-4">Contact</h4>
        <ul class="space-y-3 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>(555) 123-4567</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span>info@partyrentals.com</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>123 Party Lane<br>Fun City, CA 90210</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-slate-200 mt-8 pt-6 text-center">
      <p class="text-sm text-slate-500">
        &copy; 2024 Party Rentals. All rights reserved.
      </p>
    </div>
  </div>
</footer>
      `.trim()
    }
  ]
}

export default homePage
