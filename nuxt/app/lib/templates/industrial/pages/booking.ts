import type { TemplatePage } from '../../types'

export const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Book Now',
  path: '/booking',
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
    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">Book Your Equipment</h1>
    <p class="text-xl text-gray-300">Select your rental and get instant pricing</p>
  </div>
</section>
      `
    },
    {
      id: 'booking-widget',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="card p-8">
        <div data-smart-block="booking-widget" class="min-h-[600px]">
          <!-- Booking widget will be dynamically inserted here -->
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Loading booking form...</h3>
            <p class="text-gray-600">Or call us directly at <a href="tel:5551234567" class="text-orange-500 font-semibold">(555) 123-4567</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'booking-info',
      type: 'content',
      html: `
<section class="section bg-gray-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">What to Expect</h2>
      <p class="text-xl text-gray-600">Our simple rental process</p>
    </div>
    <div class="grid md:grid-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          1
        </div>
        <h3 class="text-xl font-bold mb-3">Select & Book</h3>
        <p class="text-gray-600">Choose your equipment and preferred dates. Instant availability check.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          2
        </div>
        <h3 class="text-xl font-bold mb-3">We Deliver</h3>
        <p class="text-gray-600">Professional delivery and setup at your location on event day.</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          3
        </div>
        <h3 class="text-xl font-bold mb-3">Enjoy & Relax</h3>
        <p class="text-gray-600">We handle pickup after your event. You just focus on having fun.</p>
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
