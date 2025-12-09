/**
 * Fiesta Template - Inventory Page
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
<section class="py-16 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Our Rental Collection
    </h1>
    <p class="text-xl text-orange-100 max-w-2xl mx-auto">
      Browse our selection of premium bounce houses and party equipment
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'inventory-grid',
      name: 'Inventory Grid',
      html: `
<section class="py-16 bg-gradient-to-b from-amber-50 to-white">
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
