/**
 * Bounce Template - Inventory Page
 * Playful grid layout with fun filters
 */

import type { TemplatePage } from '../../types'

const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'Our Inflatables',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="relative py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
  <!-- Floating shapes -->
  <div class="absolute inset-0 opacity-30">
    <div class="absolute top-10 left-20 w-20 h-20 bg-yellow-300 rounded-full"></div>
    <div class="absolute bottom-10 right-20 w-16 h-16 bg-cyan-300 rounded-full"></div>
  </div>

  <div class="container relative z-10 text-center">
    <span class="text-5xl mb-4 block">🏰</span>
    <h1 class="text-4xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
      Pick Your Bounce!
    </h1>
    <p class="text-xl text-white/90 max-w-2xl mx-auto">
      From classic bounce houses to epic water slides, we've got everything to make your party unforgettable!
    </p>
  </div>

  <!-- Wave divider -->
  <div class="absolute bottom-0 left-0 right-0">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 80L48 74.7C96 69.3 192 58.7 288 53.3C384 48 480 48 576 53.3C672 58.7 768 69.3 864 69.3C960 69.3 1056 58.7 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="white"/>
    </svg>
  </div>
</section>
      `.trim()
    },
    {
      id: 'filters',
      name: 'Filters',
      html: `
<section class="py-8 bg-white border-b border-gray-100 sticky top-0 z-20">
  <div class="container">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        <input type="text" placeholder="Search inflatables..." class="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-full focus:border-purple-400 focus:bg-white focus:outline-none font-medium"/>
      </div>

      <!-- Category filters -->
      <div class="flex flex-wrap gap-2">
        <button class="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-full">
          All 🎯
        </button>
        <button class="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-purple-100 transition-colors">
          Bounce Houses 🏰
        </button>
        <button class="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-purple-100 transition-colors">
          Water Slides 💦
        </button>
        <button class="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-purple-100 transition-colors">
          Combos ⚡
        </button>
        <button class="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-purple-100 transition-colors">
          Games 🎮
        </button>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'inventory-grid',
      name: 'Inventory Grid',
      html: `
<section class="py-12 bg-gradient-to-b from-white to-purple-50">
  <div class="container">
    <!-- Smart Block: Inventory Grid -->
    <div data-smart-block="inventory-grid" data-props='{"columns": 3, "showFilters": false}'></div>

    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <div class="flex items-center gap-2">
        <button class="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-purple-100 transition-colors font-bold text-gray-600">
          ←
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-purple-600 text-white rounded-full shadow-md font-bold">
          1
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-purple-100 transition-colors font-bold text-gray-600">
          2
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-purple-100 transition-colors font-bold text-gray-600">
          3
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-purple-100 transition-colors font-bold text-gray-600">
          →
        </button>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default inventoryPage
