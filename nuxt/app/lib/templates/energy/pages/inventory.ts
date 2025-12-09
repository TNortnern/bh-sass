/**
 * Energy Template - Inventory Page
 * Bold, high-contrast inventory display
 */

import type { TemplatePage } from '../../types'

const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'Equipment',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-20 bg-stone-950 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>

  <div class="container relative z-10">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-2 h-16 bg-orange-600"></div>
      <div>
        <h1 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight">
          Equipment
        </h1>
        <p class="text-xl text-stone-400">
          Choose your adventure
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'filters',
      name: 'Filters',
      html: `
<section class="py-6 bg-stone-900 border-y border-stone-800 sticky top-0 z-20">
  <div class="container">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" placeholder="Search equipment..." class="w-full pl-12 pr-4 py-3 bg-stone-800 border-2 border-stone-700 text-white placeholder-stone-500 focus:border-orange-500 focus:outline-none font-medium"/>
      </div>

      <!-- Category filters -->
      <div class="flex flex-wrap gap-2">
        <button class="px-5 py-2.5 bg-orange-600 text-white font-bold text-sm uppercase">
          All
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-bold text-sm uppercase border border-stone-700 hover:border-orange-500 transition-colors">
          Bounce Houses
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-bold text-sm uppercase border border-stone-700 hover:border-orange-500 transition-colors">
          Obstacle Courses
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-bold text-sm uppercase border border-stone-700 hover:border-orange-500 transition-colors">
          Water Slides
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-bold text-sm uppercase border border-stone-700 hover:border-orange-500 transition-colors">
          Games
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
<section class="py-16 bg-stone-950">
  <div class="container">
    <!-- Smart Block: Inventory Grid -->
    <div data-smart-block="inventory-grid" data-props='{"columns": 3, "showFilters": false, "style": "energy"}'></div>

    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <div class="flex items-center gap-2">
        <button class="w-12 h-12 flex items-center justify-center bg-stone-800 border border-stone-700 text-stone-400 hover:border-orange-500 transition-colors font-bold">
          ←
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-orange-600 text-white font-bold">
          1
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-stone-800 border border-stone-700 text-stone-400 hover:border-orange-500 transition-colors font-bold">
          2
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-stone-800 border border-stone-700 text-stone-400 hover:border-orange-500 transition-colors font-bold">
          3
        </button>
        <button class="w-12 h-12 flex items-center justify-center bg-stone-800 border border-stone-700 text-stone-400 hover:border-orange-500 transition-colors font-bold">
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
