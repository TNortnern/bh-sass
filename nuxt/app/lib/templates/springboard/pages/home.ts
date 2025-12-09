import type { TemplatePage } from '../../types'

export const homePage: TemplatePage = {
  id: 'home',
  name: 'Home',
  path: '/',
  sections: [
    {
      id: 'navbar',
      type: 'header',
      html: `
<style>
  .spring-nav-toggle { display: none; }
  .spring-nav-toggle:checked ~ .spring-mobile-menu { display: flex; }
  .spring-nav-toggle:checked ~ .spring-nav-inner .spring-hamburger-open { display: none; }
  .spring-nav-toggle:checked ~ .spring-nav-inner .spring-hamburger-close { display: block; }
  .spring-hamburger-close { display: none; }
  @media (min-width: 768px) {
    .spring-mobile-menu { display: none !important; }
    .spring-hamburger-btn { display: none !important; }
  }
</style>
<header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
  <input type="checkbox" id="spring-nav-toggle" class="spring-nav-toggle" />
  <nav class="spring-nav-inner container mx-auto px-6">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="font-bold text-xl gradient-text">Springboard</span>
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="/" class="font-medium text-gray-700 hover:text-orange-500 transition-colors">Home</a>
        <a href="/inventory" class="font-medium text-gray-700 hover:text-orange-500 transition-colors">Rentals</a>
        <a href="/about" class="font-medium text-gray-700 hover:text-orange-500 transition-colors">About</a>
        <a href="/contact" class="font-medium text-gray-700 hover:text-orange-500 transition-colors">Contact</a>
      </div>
      <div class="hidden md:flex items-center gap-4">
        <a href="tel:5551234567" class="text-gray-600 hover:text-orange-500 flex items-center gap-2 font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          (555) 123-4567
        </a>
        <a href="/booking" class="btn btn-primary">
          Book Now
        </a>
      </div>
      <label for="spring-nav-toggle" class="spring-hamburger-btn md:hidden p-2 text-gray-700 cursor-pointer" aria-label="Menu">
        <svg class="spring-hamburger-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg class="spring-hamburger-close w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </label>
    </div>
  </nav>
  <!-- Mobile Menu -->
  <div class="spring-mobile-menu hidden flex-col bg-white border-t border-gray-100 md:hidden">
    <div class="px-4 py-4 space-y-1">
      <a href="/" class="block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors">Home</a>
      <a href="/inventory" class="block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors">Rentals</a>
      <a href="/about" class="block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors">About</a>
      <a href="/contact" class="block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors">Contact</a>
      <a href="tel:5551234567" class="block px-4 py-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 font-medium rounded-lg transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        (555) 123-4567
      </a>
      <a href="/booking" class="block mt-3 px-4 py-3 btn btn-primary text-center">
        Book Now
      </a>
    </div>
  </div>
</header>
      `
    },
    {
      id: 'hero',
      type: 'hero',
      html: `
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
          <!-- Decorative Elements -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div class="container relative z-10">
            <div class="max-w-4xl mx-auto text-center text-white py-20">
              <!-- Safety Badge -->
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Safety Certified & Insured
              </div>

              <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style="animation-delay: 0.1s;">
                Make Every Party<br>
                <span class="text-white drop-shadow-lg">Bounce-tastic!</span>
              </h1>

              <p class="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s;">
                Premium bounce houses, water slides, and party rentals delivered to your door with real-time booking.
              </p>

              <!-- Zip Code Checker Card -->
              <div class="max-w-lg mx-auto mb-12 animate-fade-in-up" style="animation-delay: 0.3s;">
                <div class="bg-white rounded-2xl p-6 shadow-2xl">
                  <h3 class="text-gray-900 font-bold text-lg mb-4">Check Availability in Your Area</h3>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter ZIP code"
                      class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors text-gray-900"
                      maxlength="5"
                    />
                    <button class="btn btn-primary px-6">
                      Check
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                  <p class="text-sm text-gray-500 mt-3">Free delivery within 20 miles</p>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.4s;">
                <a href="/inventory" class="btn btn-white px-8 py-4 text-lg">
                  Browse Rentals
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
                <a href="/booking" class="btn btn-outline btn-white px-8 py-4 text-lg">
                  Quick Quote
                </a>
              </div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </section>
      `
    },
    {
      id: 'trust-bar',
      type: 'features',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <!-- Real-Time Booking -->
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-lg mb-2">Real-Time Booking</h3>
                <p class="text-gray-600">Instant availability & confirmation</p>
              </div>

              <!-- Same-Day Delivery -->
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                  </svg>
                </div>
                <h3 class="font-bold text-lg mb-2">Same-Day Delivery</h3>
                <p class="text-gray-600">Book morning, party afternoon</p>
              </div>

              <!-- Safety First -->
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h3 class="font-bold text-lg mb-2">Safety First</h3>
                <p class="text-gray-600">Certified, cleaned & inspected</p>
              </div>

              <!-- Secure Payment -->
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-lg mb-2">Secure Payment</h3>
                <p class="text-gray-600">Multiple payment options</p>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'featured-rentals',
      type: 'content',
      html: `
        <section class="section gradient-bg-subtle">
          <div class="container">
            <div class="text-center mb-12">
              <span class="badge mb-4">Popular Rentals</span>
              <h2 class="text-4xl md:text-5xl font-bold mb-4">Featured Bounce Houses</h2>
              <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Our most popular party rentals - cleaned, inspected, and ready to make your event unforgettable
              </p>
            </div>

            <!-- Smart Block: Dynamic Rental Items Grid -->
            <div data-smart-block="rental-item-grid" data-limit="6" data-featured="true"></div>

            <div class="text-center mt-12">
              <a href="/inventory" class="btn btn-primary px-8 py-4 text-lg">
                View All Rentals
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'how-it-works',
      type: 'steps',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="text-center mb-16">
              <span class="badge mb-4">Simple Process</span>
              <h2 class="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
              <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                From browsing to bouncing in just 4 easy steps
              </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <!-- Step 1 -->
              <div class="text-center relative">
                <div class="relative inline-block mb-6">
                  <div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                    1
                  </div>
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full animate-ping"></div>
                </div>
                <h3 class="font-bold text-xl mb-3">Browse & Select</h3>
                <p class="text-gray-600">
                  Choose from our wide selection of bounce houses, water slides, and party rentals
                </p>
              </div>

              <!-- Step 2 -->
              <div class="text-center relative">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold mb-6">
                  2
                </div>
                <h3 class="font-bold text-xl mb-3">Pick Your Date</h3>
                <p class="text-gray-600">
                  Check real-time availability and select your party date with instant confirmation
                </p>
              </div>

              <!-- Step 3 -->
              <div class="text-center relative">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold mb-6">
                  3
                </div>
                <h3 class="font-bold text-xl mb-3">Book Online</h3>
                <p class="text-gray-600">
                  Complete your booking securely online with flexible payment options
                </p>
              </div>

              <!-- Step 4 -->
              <div class="text-center relative">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold mb-6">
                  4
                </div>
                <h3 class="font-bold text-xl mb-3">We Deliver & Setup</h3>
                <p class="text-gray-600">
                  Sit back and relax - we'll deliver, setup, and pick up everything for you
                </p>
              </div>
            </div>

            <!-- CTA -->
            <div class="text-center mt-12">
              <a href="/booking" class="btn btn-primary px-8 py-4 text-lg">
                Get Started Now
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      html: `
        <section class="section gradient-bg-subtle">
          <div class="container">
            <div class="text-center mb-16">
              <span class="badge mb-4">Testimonials</span>
              <h2 class="text-4xl md:text-5xl font-bold mb-4">What Parents Say</h2>
              <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of happy families who made their parties unforgettable
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
              <!-- Testimonial 1 -->
              <div class="card">
                <div class="flex items-center gap-1 mb-4">
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <p class="text-gray-600 mb-4">
                  "The booking process was so easy! The bounce house arrived on time, was super clean, and the kids had an absolute blast. Highly recommend!"
                </p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-teal-500"></div>
                  <div>
                    <p class="font-semibold">Sarah Johnson</p>
                    <p class="text-sm text-gray-500">Birthday Party, Austin TX</p>
                  </div>
                </div>
              </div>

              <!-- Testimonial 2 -->
              <div class="card">
                <div class="flex items-center gap-1 mb-4">
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <p class="text-gray-600 mb-4">
                  "Professional service from start to finish. The water slide was a huge hit at our summer party. Will definitely book again!"
                </p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-teal-500"></div>
                  <div>
                    <p class="font-semibold">Mike Rodriguez</p>
                    <p class="text-sm text-gray-500">Summer BBQ, Dallas TX</p>
                  </div>
                </div>
              </div>

              <!-- Testimonial 3 -->
              <div class="card">
                <div class="flex items-center gap-1 mb-4">
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <p class="text-gray-600 mb-4">
                  "Best rental experience ever! Real-time booking made it so convenient. The setup crew was friendly and efficient. Five stars!"
                </p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-teal-500"></div>
                  <div>
                    <p class="font-semibold">Emily Chen</p>
                    <p class="text-sm text-gray-500">School Event, Houston TX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'cta',
      type: 'cta',
      html: `
        <section class="section gradient-bg text-white relative overflow-hidden">
          <!-- Decorative Elements -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>

          <div class="container relative z-10">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-4xl md:text-5xl font-bold mb-6">
                Ready to Make Your Party Amazing?
              </h2>
              <p class="text-xl mb-10 text-white/90">
                Book your bounce house now and get instant confirmation with real-time availability
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/booking" class="btn btn-white px-8 py-4 text-lg">
                  Book Now
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
                <a href="/inventory" class="btn btn-outline btn-white px-8 py-4 text-lg">
                  Browse Rentals
                </a>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default homePage
