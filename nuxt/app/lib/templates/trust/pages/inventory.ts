/**
 * Trust Template - Inventory Page
 * Clean, organized inventory display
 */

import type { TemplatePage } from '../../types'

const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'Our Inventory',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-16 bg-gradient-to-b from-sky-50 to-white">
  <div class="container">
    <div class="max-w-2xl">
      <h1 class="text-4xl font-bold text-slate-900 mb-4">
        Our Rental Inventory
      </h1>
      <p class="text-lg text-slate-600">
        Browse our selection of safe, clean, and well-maintained party equipment. All items include delivery, setup, and pickup.
      </p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'filters',
      name: 'Filters',
      html: `
<section class="py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
  <div class="container">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" placeholder="Search inventory..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"/>
      </div>

      <!-- Category filters -->
      <div class="flex flex-wrap gap-2">
        <button class="px-4 py-2 bg-[#1e3a5f] text-white font-medium text-sm rounded-lg">
          All Items
        </button>
        <button class="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
          Bounce Houses
        </button>
        <button class="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
          Water Slides
        </button>
        <button class="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
          Combo Units
        </button>
        <button class="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
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
<section class="py-12 bg-slate-50">
  <div class="container">
    <!-- Smart Block: Inventory Grid -->
    <div data-smart-block="inventory-grid" data-props='{"columns": 3, "showFilters": false, "style": "trust"}'></div>

    <!-- Pagination -->
    <div class="flex justify-center mt-12">
      <div class="flex items-center gap-1">
        <button class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          ←
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-[#1e3a5f] text-white rounded-lg font-medium">
          1
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          2
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          3
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
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
