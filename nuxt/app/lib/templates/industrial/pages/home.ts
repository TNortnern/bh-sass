import type { TemplatePage } from '../../types'

export const homePage: TemplatePage = {
  id: 'home',
  name: 'Home',
  path: '/',
  sections: [
    {
      id: 'header',
      type: 'header',
      html: `
<style>
  .industrial-nav-toggle { display: none; }
  .industrial-nav-toggle:checked ~ .industrial-mobile-menu { display: flex; }
  .industrial-nav-toggle:checked ~ .industrial-nav-inner .industrial-hamburger-open { display: none; }
  .industrial-nav-toggle:checked ~ .industrial-nav-inner .industrial-hamburger-close { display: block; }
  .industrial-hamburger-close { display: none; }
  @media (min-width: 768px) {
    .industrial-mobile-menu { display: none !important; }
    .industrial-hamburger-btn { display: none !important; }
  }
</style>
<header class="bg-slate-900 text-white">
  <input type="checkbox" id="industrial-nav-toggle" class="industrial-nav-toggle" />
  <div class="industrial-nav-inner container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight">INDUSTRIAL</span>
      </a>
      <nav class="hidden md:flex items-center gap-8">
        <a href="/" class="text-white font-medium transition-colors border-b-2 border-orange-500">Home</a>
        <a href="/inventory" class="text-gray-300 hover:text-white font-medium transition-colors">Equipment</a>
        <a href="/about" class="text-gray-300 hover:text-white font-medium transition-colors">About</a>
        <a href="/contact" class="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
      </nav>
      <div class="hidden md:flex items-center gap-4">
        <a href="tel:5551234567" class="text-gray-300 hover:text-white flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          (555) 123-4567
        </a>
        <a href="/booking" class="px-5 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition-colors">
          Get Quote
        </a>
      </div>
      <label for="industrial-nav-toggle" class="industrial-hamburger-btn md:hidden p-2 text-gray-300 cursor-pointer" aria-label="Menu">
        <svg class="industrial-hamburger-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg class="industrial-hamburger-close w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </label>
    </div>
  </div>
  <!-- Mobile Menu -->
  <div class="industrial-mobile-menu hidden flex-col bg-slate-800 border-t border-slate-700 md:hidden">
    <div class="px-4 py-4 space-y-1">
      <a href="/" class="block px-4 py-3 text-white hover:bg-slate-700 font-medium rounded transition-colors">Home</a>
      <a href="/inventory" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 font-medium rounded transition-colors">Equipment</a>
      <a href="/about" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 font-medium rounded transition-colors">About</a>
      <a href="/contact" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 font-medium rounded transition-colors">Contact</a>
      <a href="tel:5551234567" class="block px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 font-medium rounded transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        (555) 123-4567
      </a>
      <a href="/booking" class="block mt-3 px-4 py-3 bg-orange-500 text-white font-semibold rounded text-center hover:bg-orange-600 transition-colors">
        Get Quote
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
<section class="bg-slate-900 text-white py-20 md:py-32">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-block px-4 py-2 bg-orange-500 bg-opacity-20 text-orange-400 rounded mb-6">
          <span class="font-semibold">Professional Equipment Rentals</span>
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
          Premium Party Equipment <span class="text-orange-500">For Every Event</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8 leading-relaxed">
          Licensed, insured, and ready to make your event unforgettable. Professional delivery and setup included.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <a href="/booking" class="btn btn-primary text-center">
            Get a Quote
            <svg class="inline-block w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="btn btn-outline text-center">
            View Equipment
          </a>
        </div>
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-gray-300">Licensed & Insured</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-gray-300">Professional Service</span>
          </div>
        </div>
      </div>
      <div class="hidden md:block">
        <div class="relative">
          <div class="absolute inset-0 bg-orange-500 opacity-20 rounded-lg blur-3xl"></div>
          <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop" alt="Party Equipment" class="relative rounded-lg shadow-2xl">
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'categories',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">Professional-grade equipment for events of all sizes</p>
    </div>
    <div class="grid grid-2 md:grid-4 gap-6">
      <a href="/inventory?cat=bounce" class="card text-center p-8 group">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
          <svg class="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Bounce Houses</h3>
        <p class="text-gray-600">Classic inflatables</p>
      </a>
      <a href="/inventory?cat=water" class="card text-center p-8 group">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
          <svg class="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Water Slides</h3>
        <p class="text-gray-600">Beat the heat</p>
      </a>
      <a href="/inventory?cat=combo" class="card text-center p-8 group">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
          <svg class="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Combo Units</h3>
        <p class="text-gray-600">Maximum fun</p>
      </a>
      <a href="/inventory?cat=extras" class="card text-center p-8 group">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
          <svg class="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Party Extras</h3>
        <p class="text-gray-600">Complete the experience</p>
      </a>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'featured-rentals',
      type: 'content',
      html: `
<section class="section bg-gray-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Featured Equipment</h2>
      <p class="text-xl text-gray-600">Popular rentals for your next event</p>
    </div>
    <div data-smart-block="rental-item-grid" data-limit="6" class="grid grid-2 md:grid-3 gap-8">
      <!-- Rental items will be dynamically inserted here -->
      <div class="card">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop" alt="Bounce House" class="w-full h-64 object-cover">
          <span class="absolute top-4 right-4 badge">$199/day</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Castle Bounce House</h3>
          <p class="text-gray-600 mb-4">Perfect for birthday parties and events. Ages 3-12.</p>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span class="font-semibold">Capacity:</span> 8-10 kids
            </div>
            <a href="/booking" class="text-orange-500 font-semibold hover:text-orange-600">
              Book Now →
            </a>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&h=300&fit=crop" alt="Water Slide" class="w-full h-64 object-cover">
          <span class="absolute top-4 right-4 badge">$299/day</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Tropical Water Slide</h3>
          <p class="text-gray-600 mb-4">Beat the heat with this exciting water slide.</p>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span class="font-semibold">Height:</span> 18ft
            </div>
            <a href="/booking" class="text-orange-500 font-semibold hover:text-orange-600">
              Book Now →
            </a>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop" alt="Combo Unit" class="w-full h-64 object-cover">
          <span class="absolute top-4 right-4 badge">$349/day</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Adventure Combo</h3>
          <p class="text-gray-600 mb-4">Bounce area, slide, and obstacles combined.</p>
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              <span class="font-semibold">Capacity:</span> 12-15 kids
            </div>
            <a href="/booking" class="text-orange-500 font-semibold hover:text-orange-600">
              Book Now →
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-12">
      <a href="/inventory" class="btn btn-primary">View All Equipment</a>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'how-it-works',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
      <p class="text-xl text-gray-600">Simple, professional rental process</p>
    </div>
    <div class="grid md:grid-3 gap-12">
      <div class="text-center">
        <div class="w-20 h-20 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
          1
        </div>
        <h3 class="text-xl font-bold mb-3">Choose Equipment</h3>
        <p class="text-gray-600">Browse our professional-grade inventory and select the perfect equipment for your event.</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
          2
        </div>
        <h3 class="text-xl font-bold mb-3">Book & Confirm</h3>
        <p class="text-gray-600">Submit your reservation and receive instant confirmation with delivery details.</p>
      </div>
      <div class="text-center">
        <div class="w-20 h-20 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
          3
        </div>
        <h3 class="text-xl font-bold mb-3">We Deliver & Setup</h3>
        <p class="text-gray-600">Our professional team delivers, sets up, and picks up. You just enjoy your event.</p>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'trust-indicators',
      type: 'content',
      html: `
<section class="section bg-slate-900 text-white">
  <div class="container">
    <div class="grid md:grid-3 gap-12 text-center">
      <div>
        <div class="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-2">Licensed & Insured</h3>
        <p class="text-gray-300">Fully licensed and insured for your peace of mind</p>
      </div>
      <div>
        <div class="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-2">Professional Service</h3>
        <p class="text-gray-300">Trained staff and quality equipment maintenance</p>
      </div>
      <div>
        <div class="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-2">On-Time Delivery</h3>
        <p class="text-gray-300">Punctual setup and pickup guaranteed</p>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'testimonials',
      type: 'content',
      html: `
<section class="section bg-gray-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
      <p class="text-xl text-gray-600">Trusted by hundreds of satisfied customers</p>
    </div>
    <div class="grid md:grid-3 gap-8">
      <div class="card p-8">
        <div class="flex items-center gap-1 mb-4">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        <p class="text-gray-700 mb-6">"Professional service from start to finish. The equipment was clean, setup was quick, and the kids had a blast!"</p>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
            SJ
          </div>
          <div>
            <div class="font-bold">Sarah Johnson</div>
            <div class="text-sm text-gray-500">Birthday Party</div>
          </div>
        </div>
      </div>
      <div class="card p-8">
        <div class="flex items-center gap-1 mb-4">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        <p class="text-gray-700 mb-6">"We've used them for multiple school events. Always reliable, always on time. Highly recommend!"</p>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
            MT
          </div>
          <div>
            <div class="font-bold">Mike Thompson</div>
            <div class="text-sm text-gray-500">School Event</div>
          </div>
        </div>
      </div>
      <div class="card p-8">
        <div class="flex items-center gap-1 mb-4">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        <p class="text-gray-700 mb-6">"Great value and excellent customer service. The booking process was super easy and straightforward."</p>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
            LC
          </div>
          <div>
            <div class="font-bold">Lisa Chen</div>
            <div class="text-sm text-gray-500">Graduation Party</div>
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
<section class="section bg-orange-500 text-white">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Book Your Event?</h2>
      <p class="text-xl mb-8 opacity-90">Get a free quote in minutes. Professional equipment, professional service.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/booking" class="btn bg-white text-orange-500 hover:bg-gray-100">
          Get Free Quote
        </a>
        <a href="tel:5551234567" class="btn btn-outline border-white text-white hover:bg-white hover:text-orange-500">
          Call (555) 123-4567
        </a>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'footer',
      type: 'footer',
      html: `
<footer class="bg-slate-900 text-white">
  <div class="container mx-auto px-4 py-16">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="text-xl font-bold">INDUSTRIAL</span>
        </div>
        <p class="text-gray-400 mb-6">Professional party equipment rentals for events of all sizes. Quality guaranteed.</p>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 bg-slate-800 text-xs font-medium rounded">Licensed</span>
          <span class="px-3 py-1 bg-slate-800 text-xs font-medium rounded">Insured</span>
        </div>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Navigation</h4>
        <ul class="space-y-3">
          <li><a href="/" class="text-gray-400 hover:text-orange-400 transition-colors">Home</a></li>
          <li><a href="/inventory" class="text-gray-400 hover:text-orange-400 transition-colors">Equipment</a></li>
          <li><a href="/about" class="text-gray-400 hover:text-orange-400 transition-colors">About Us</a></li>
          <li><a href="/contact" class="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Equipment</h4>
        <ul class="space-y-3">
          <li><a href="/inventory?cat=bounce" class="text-gray-400 hover:text-orange-400 transition-colors">Bounce Houses</a></li>
          <li><a href="/inventory?cat=water" class="text-gray-400 hover:text-orange-400 transition-colors">Water Slides</a></li>
          <li><a href="/inventory?cat=combo" class="text-gray-400 hover:text-orange-400 transition-colors">Combo Units</a></li>
          <li><a href="/inventory?cat=extras" class="text-gray-400 hover:text-orange-400 transition-colors">Party Extras</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Contact</h4>
        <ul class="space-y-3 text-gray-400">
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            (555) 123-4567
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            info@industrial.com
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            Metro Service Area
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-gray-500 text-sm">© 2024 Industrial Rentals. All rights reserved.</p>
      <div class="flex gap-6 text-sm">
        <a href="/terms" class="text-gray-500 hover:text-orange-400 transition-colors">Terms</a>
        <a href="/waiver" class="text-gray-500 hover:text-orange-400 transition-colors">Waiver</a>
        <a href="/privacy" class="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</a>
      </div>
    </div>
  </div>
</footer>
      `
    }
  ]
}
