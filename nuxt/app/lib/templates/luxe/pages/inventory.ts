/**
 * Luxe Template - Inventory Page
 * Elegant gallery-style inventory display
 */

import type { TemplatePage } from '../../types'

const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'The Collection',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-24 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent"></div>

  <div class="container relative z-10">
    <div class="max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
        <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Our Collection</span>
      </div>
      <h1 class="text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
        Premium
        <span class="font-serif italic text-amber-400">Inflatables</span>
      </h1>
      <p class="text-xl text-stone-400 leading-relaxed">
        Each piece in our collection has been carefully selected for quality, aesthetics, and the discerning taste of our clientele.
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
<section class="py-6 bg-stone-900 border-y border-stone-800 sticky top-0 z-20">
  <div class="container">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-md">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" placeholder="Search collection..." class="w-full pl-12 pr-4 py-3 bg-stone-800 border border-stone-700 text-stone-300 placeholder-stone-500 focus:border-amber-400/50 focus:outline-none transition-colors"/>
      </div>

      <!-- Category filters -->
      <div class="flex flex-wrap gap-2">
        <button class="px-5 py-2.5 bg-amber-400 text-stone-900 font-medium text-sm">
          All
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-medium text-sm border border-stone-700 hover:border-amber-400/50 transition-colors">
          Bounce Houses
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-medium text-sm border border-stone-700 hover:border-amber-400/50 transition-colors">
          Water Features
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-medium text-sm border border-stone-700 hover:border-amber-400/50 transition-colors">
          Combinations
        </button>
        <button class="px-5 py-2.5 bg-stone-800 text-stone-400 font-medium text-sm border border-stone-700 hover:border-amber-400/50 transition-colors">
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
    <div data-smart-block="inventory-grid" data-props='{"columns": 3, "showFilters": false, "style": "luxe"}'></div>

    <!-- Pagination -->
    <div class="flex justify-center mt-16">
      <div class="flex items-center gap-2">
        <button class="w-10 h-10 flex items-center justify-center border border-stone-700 text-stone-400 hover:border-amber-400/50 transition-colors">
          ←
        </button>
        <button class="w-10 h-10 flex items-center justify-center bg-amber-400 text-stone-900 font-medium">
          1
        </button>
        <button class="w-10 h-10 flex items-center justify-center border border-stone-700 text-stone-400 hover:border-amber-400/50 transition-colors">
          2
        </button>
        <button class="w-10 h-10 flex items-center justify-center border border-stone-700 text-stone-400 hover:border-amber-400/50 transition-colors">
          3
        </button>
        <button class="w-10 h-10 flex items-center justify-center border border-stone-700 text-stone-400 hover:border-amber-400/50 transition-colors">
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
