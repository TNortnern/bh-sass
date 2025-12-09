import type { TemplatePage } from '../../types'

export const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Equipment',
  path: '/inventory',
  sections: [
    {
      id: 'header',
      type: 'header',
      html: `
<header class="bg-slate-900 text-white">
  <div class="container mx-auto px-4">
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
        <a href="/" class="text-gray-300 hover:text-white font-medium transition-colors">Home</a>
        <a href="/inventory" class="text-white font-medium transition-colors border-b-2 border-orange-500">Equipment</a>
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
      <button class="md:hidden p-2 text-gray-300" aria-label="Menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
</header>
      `
    },
    {
      id: 'page-header',
      type: 'content',
      html: `
<section class="bg-slate-900 text-white py-16">
  <div class="container">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">Our Equipment</h1>
    <p class="text-xl text-gray-300">Professional-grade party rentals for every occasion</p>
  </div>
</section>
      `
    },
    {
      id: 'filters',
      type: 'content',
      html: `
<section class="bg-gray-50 py-6 border-b border-gray-200">
  <div class="container">
    <div class="flex flex-wrap gap-3">
      <button class="px-4 py-2 bg-orange-500 text-white font-medium rounded hover:bg-orange-600 transition-colors">
        All Equipment
      </button>
      <button class="px-4 py-2 bg-white text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors border border-gray-300">
        Bounce Houses
      </button>
      <button class="px-4 py-2 bg-white text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors border border-gray-300">
        Water Slides
      </button>
      <button class="px-4 py-2 bg-white text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors border border-gray-300">
        Combo Units
      </button>
      <button class="px-4 py-2 bg-white text-gray-700 font-medium rounded hover:bg-gray-100 transition-colors border border-gray-300">
        Party Extras
      </button>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'equipment-grid',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container">
    <div data-smart-block="rental-item-grid" class="grid grid-2 md:grid-3 gap-8">
      <!-- Rental items will be dynamically inserted here -->
      <div class="card">
        <div class="relative">
          <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop" alt="Bounce House" class="w-full h-64 object-cover">
          <span class="absolute top-4 right-4 badge">$199/day</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Castle Bounce House</h3>
          <p class="text-gray-600 mb-4">Perfect for birthday parties and events. Ages 3-12.</p>
          <div class="space-y-2 mb-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Capacity: 8-10 kids</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              <span>Size: 15ft x 15ft</span>
            </div>
          </div>
          <a href="/booking" class="btn btn-primary w-full text-center">Book Now</a>
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
          <div class="space-y-2 mb-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Height: 18ft</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              <span>Size: 12ft x 25ft</span>
            </div>
          </div>
          <a href="/booking" class="btn btn-primary w-full text-center">Book Now</a>
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
          <div class="space-y-2 mb-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>Capacity: 12-15 kids</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
              <span>Size: 20ft x 30ft</span>
            </div>
          </div>
          <a href="/booking" class="btn btn-primary w-full text-center">Book Now</a>
        </div>
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
