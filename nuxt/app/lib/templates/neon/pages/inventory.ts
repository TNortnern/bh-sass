/**
 * Neon Template - Inventory Page
 */

import type { TemplatePage } from '../../types'

const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'Our Rentals',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Our Collection
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto">
      Premium bounce houses and party equipment for epic events
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'inventory-grid',
      name: 'Inventory Grid',
      html: `
<section class="py-16 bg-slate-950">
  <div class="container">
    <!-- Smart Block: Inventory Grid -->
    <div data-smart-block="inventory-grid" data-props='{"showFilters": true, "columns": 3}'></div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default inventoryPage
