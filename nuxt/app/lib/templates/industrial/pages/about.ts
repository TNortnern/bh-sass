import type { TemplatePage } from '../../types'

export const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About',
  path: '/about',
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
        <a href="/about" class="text-white font-medium transition-colors border-b-2 border-orange-500">About</a>
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
    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">About Us</h1>
    <p class="text-xl text-gray-300">Professional equipment rentals you can trust</p>
  </div>
</section>
      `
    },
    {
      id: 'story',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
        <p class="text-lg text-gray-700 mb-4">
          Founded in 2015, Industrial Rentals has been providing professional-grade party equipment to families and businesses throughout the metro area.
        </p>
        <p class="text-lg text-gray-700 mb-4">
          What started as a small family business with just three bounce houses has grown into a comprehensive party rental service with over 50 premium units.
        </p>
        <p class="text-lg text-gray-700">
          We take pride in our commitment to safety, cleanliness, and exceptional customer service. Every rental is cleaned, inspected, and maintained to the highest standards.
        </p>
      </div>
      <div class="relative">
        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop" alt="Our Team" class="rounded-lg shadow-lg">
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'stats',
      type: 'content',
      html: `
<section class="section bg-orange-500 text-white">
  <div class="container">
    <div class="grid grid-2 md:grid-4 gap-8 text-center">
      <div>
        <div class="text-5xl font-bold mb-2">10+</div>
        <div class="text-xl opacity-90">Years Experience</div>
      </div>
      <div>
        <div class="text-5xl font-bold mb-2">50+</div>
        <div class="text-xl opacity-90">Equipment Units</div>
      </div>
      <div>
        <div class="text-5xl font-bold mb-2">5000+</div>
        <div class="text-xl opacity-90">Happy Events</div>
      </div>
      <div>
        <div class="text-5xl font-bold mb-2">100%</div>
        <div class="text-xl opacity-90">Satisfaction Rate</div>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'values',
      type: 'content',
      html: `
<section class="section bg-gray-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
      <p class="text-xl text-gray-600">What drives us every day</p>
    </div>
    <div class="grid md:grid-3 gap-8">
      <div class="card p-8 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">Safety First</h3>
        <p class="text-gray-600">Every unit is inspected, cleaned, and maintained to exceed safety standards.</p>
      </div>
      <div class="card p-8 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">Quality Equipment</h3>
        <p class="text-gray-600">Only professional-grade equipment that's built to last and impress.</p>
      </div>
      <div class="card p-8 text-center">
        <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">Reliable Service</h3>
        <p class="text-gray-600">On-time delivery, professional setup, and hassle-free pickup guaranteed.</p>
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
