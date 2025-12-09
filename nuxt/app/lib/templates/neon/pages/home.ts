/**
 * Neon Template - Home Page
 * Vibrant dark theme with neon purple/pink accents
 * Perfect for teen parties, evening events, entertainment venues
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
<section class="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
  <!-- Gradient glow effects -->
  <div class="absolute inset-0">
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-20"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-20"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-10"></div>
  </div>

  <!-- Grid pattern -->
  <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px); background-size: 50px 50px;"></div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          Premium Party Rentals
        </div>

        <h1 class="text-5xl lg:text-7xl font-black text-white leading-tight">
          Light Up
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">Your Party</span>
        </h1>

        <p class="text-xl text-slate-400 leading-relaxed max-w-lg">
          Epic bounce houses and party equipment that turn ordinary events into extraordinary experiences.
        </p>

        <div class="flex flex-wrap gap-4">
          <a href="/inventory" class="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
            Browse Rentals
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
          <a href="/contact" class="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all">
            Get a Quote
          </a>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap items-center gap-8 pt-4">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-900"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-slate-900"></div>
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-slate-900"></div>
            </div>
            <span class="text-sm text-slate-400">500+ events</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="flex text-yellow-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            </div>
            <span class="text-sm text-slate-400 ml-1">5.0 rating</span>
          </div>
        </div>
      </div>

      <div class="relative">
        <!-- Glow effect behind image -->
        <div class="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-2xl opacity-20"></div>

        <!-- Image placeholder -->
        <div class="relative bg-slate-900 rounded-3xl aspect-[4/3] flex items-center justify-center border border-slate-800">
          <div class="text-center p-8">
            <svg class="w-20 h-20 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p class="text-purple-400 font-medium">Featured Rental Image</p>
          </div>
        </div>

        <!-- Floating badge -->
        <div class="absolute -bottom-4 -left-4 bg-slate-900 rounded-2xl shadow-xl p-4 border border-purple-500/30">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <p class="font-bold text-white">Licensed & Insured</p>
              <p class="text-sm text-slate-400">Safety first</p>
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
<section class="py-20 bg-slate-900">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-white mb-4">Explore Categories</h2>
      <p class="text-lg text-slate-400 max-w-2xl mx-auto">
        Find the perfect entertainment for your next event
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Bounce Houses -->
      <a href="/inventory?category=bounce_house" class="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative">
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <h3 class="font-bold text-white text-lg mb-2">Bounce Houses</h3>
          <p class="text-slate-400 text-sm">Classic fun for all ages</p>
          <div class="mt-4 text-purple-400 font-medium text-sm group-hover:text-purple-300">
            View Collection →
          </div>
        </div>
      </a>

      <!-- Obstacle Courses -->
      <a href="/inventory?category=obstacle_course" class="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative">
          <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 class="font-bold text-white text-lg mb-2">Obstacle Courses</h3>
          <p class="text-slate-400 text-sm">Challenge and excitement</p>
          <div class="mt-4 text-cyan-400 font-medium text-sm group-hover:text-cyan-300">
            View Collection →
          </div>
        </div>
      </a>

      <!-- Interactive -->
      <a href="/inventory?category=interactive" class="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative">
          <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="font-bold text-white text-lg mb-2">Interactive Games</h3>
          <p class="text-slate-400 text-sm">Competitive fun for groups</p>
          <div class="mt-4 text-pink-400 font-medium text-sm group-hover:text-pink-300">
            View Collection →
          </div>
        </div>
      </a>

      <!-- Party Extras -->
      <a href="/inventory?category=party_extras" class="group relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-yellow-500/50 transition-all overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative">
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
          </div>
          <h3 class="font-bold text-white text-lg mb-2">Party Extras</h3>
          <p class="text-slate-400 text-sm">Complete your event</p>
          <div class="mt-4 text-yellow-400 font-medium text-sm group-hover:text-yellow-300">
            View Collection →
          </div>
        </div>
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
<section class="py-20 bg-slate-950">
  <div class="container">
    <div class="flex justify-between items-end mb-12">
      <div>
        <h2 class="text-4xl font-bold text-white mb-4">Popular Picks</h2>
        <p class="text-lg text-slate-400">The crowd favorites everyone's booking</p>
      </div>
      <a href="/inventory" class="hidden md:inline-flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300">
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
<section class="py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold text-white mb-4">Why Choose Us</h2>
      <p class="text-xl text-slate-300 max-w-2xl mx-auto">
        Premium equipment and service that makes your event unforgettable
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-purple-500/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
          <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Safety Certified</h3>
        <p class="text-slate-400">Every unit inspected and sanitized</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-cyan-500/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
          <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Always On Time</h3>
        <p class="text-slate-400">Punctual delivery, every time</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-pink-500/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
          <svg class="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Premium Quality</h3>
        <p class="text-slate-400">Best-in-class equipment</p>
      </div>

      <div class="text-center">
        <div class="w-16 h-16 bg-yellow-500/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
          <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Expert Team</h3>
        <p class="text-slate-400">Professional setup included</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
      <div class="text-center">
        <div class="text-4xl font-bold text-white mb-1">500+</div>
        <div class="text-slate-400">Events</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-white mb-1">50+</div>
        <div class="text-slate-400">Rentals</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-white mb-1">5.0</div>
        <div class="text-slate-400">Rating</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-white mb-1">10+</div>
        <div class="text-slate-400">Years</div>
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
<section class="py-20 bg-slate-900">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-white mb-4">What People Say</h2>
      <p class="text-lg text-slate-400">Real reviews from our customers</p>
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
<section class="py-20 bg-slate-950 relative overflow-hidden">
  <!-- Glow effects -->
  <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-10"></div>
  <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-10"></div>

  <div class="container relative z-10">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
        Ready to Party?
      </h2>
      <p class="text-xl text-slate-400 mb-8">
        Book now and make your event legendary. Free delivery in our service area!
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/inventory" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
          Browse Rentals
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
        <a href="/contact" class="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all">
          Contact Us
        </a>
      </div>

      <div class="mt-12 flex flex-wrap justify-center gap-8 text-slate-500">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Free Setup
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Same-Day Available
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          Rain Guarantee
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
<footer class="bg-slate-950 text-white border-t border-slate-800">
  <div class="container py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <div class="md:col-span-1">
        <h3 class="text-lg font-bold mb-4">Neon Rentals</h3>
        <p class="text-sm text-slate-400 mb-4">Epic party equipment that lights up your celebration.</p>
        <div class="flex items-center gap-3">
          <a href="#" class="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
        </div>
      </div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Quick Links</h4><ul class="space-y-2"><li><a href="/" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Home</a></li><li><a href="/inventory" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Rentals</a></li><li><a href="/about" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">About</a></li><li><a href="/contact" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Contact</a></li></ul></div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Categories</h4><ul class="space-y-2"><li><a href="/inventory?category=bounce_house" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Bounce Houses</a></li><li><a href="/inventory?category=obstacle_course" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Obstacle Courses</a></li><li><a href="/inventory?category=interactive" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Interactive</a></li><li><a href="/inventory?category=party_extras" class="text-slate-400 hover:text-purple-400 text-sm transition-colors">Party Extras</a></li></ul></div>
      <div><h4 class="text-sm font-semibold uppercase mb-4">Contact</h4><ul class="space-y-3 text-sm text-slate-400"><li class="flex items-start gap-2"><svg class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>(555) 123-4567</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>info@neonrentals.com</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>123 Neon Ave<br>Night City, NY 10001</span></li></ul></div>
    </div>
    <div class="border-t border-slate-800 mt-8 pt-6 text-center"><p class="text-sm text-slate-500">&copy; 2024 Neon Rentals. All rights reserved.</p></div>
  </div>
</footer>
      `.trim()
    }
  ]
}

export default homePage
