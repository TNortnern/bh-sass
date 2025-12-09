import type { TemplatePage } from '../../types'

export const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Rentals',
  path: '/inventory',
  sections: [
    {
      id: 'inventory-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg-subtle">
          <div class="container">
            <div class="text-center max-w-3xl mx-auto">
              <span class="badge mb-4">Browse Our Collection</span>
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Premium Party Rentals
              </h1>
              <p class="text-xl text-gray-600">
                From classic bounce houses to exciting water slides - all cleaned, inspected, and ready for your event
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'inventory-filters',
      type: 'filters',
      html: `
        <section class="py-8 bg-white border-b border-gray-100">
          <div class="container">
            <div class="flex flex-wrap gap-3 justify-center">
              <button class="px-6 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-teal-500 hover:shadow-lg transition-all">
                All Rentals
              </button>
              <button class="px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Bounce Houses
              </button>
              <button class="px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Water Slides
              </button>
              <button class="px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Combo Units
              </button>
              <button class="px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Obstacle Courses
              </button>
              <button class="px-6 py-2.5 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Party Extras
              </button>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'inventory-grid',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <!-- Smart Block: Dynamic Rental Items Grid -->
            <div data-smart-block="rental-item-grid" data-show-filters="true"></div>
          </div>
        </section>
      `
    },
    {
      id: 'inventory-cta',
      type: 'cta',
      html: `
        <section class="section gradient-bg text-white">
          <div class="container">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Need Help Choosing?
              </h2>
              <p class="text-lg mb-8 text-white/90">
                Our team is here to help you find the perfect rental for your event
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" class="btn btn-white">
                  Contact Us
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </a>
                <a href="tel:555-123-4567" class="btn btn-outline btn-white">
                  Call (555) 123-4567
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default inventoryPage
