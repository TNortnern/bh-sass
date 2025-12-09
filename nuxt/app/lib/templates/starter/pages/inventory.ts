/**
 * Modern Minimal - Inventory Page
 *
 * Filterable catalog of all rental items
 */

import type { TemplatePage } from '../../types'

export const inventoryPage: TemplatePage = {
  id: 'inventory',
  name: 'Inventory',
  slug: '/inventory',
  title: 'Our Rentals',
  description: 'Browse our complete selection of party rentals',
  sections: [
    {
      id: 'inventory-hero',
      name: 'Page Header',
      html: `
<section class="relative py-20 lg:py-28 bg-[var(--color-surface)]">
  <div class="container">
    <div class="max-w-2xl">
      <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Our Collection</span>
      <h1 class="text-display font-bold text-[var(--color-text)] mb-6">
        Party Rentals
      </h1>
      <p class="text-xl text-[var(--color-text-muted)]">
        From bounce houses to water slides, find the perfect entertainment for your next event. All equipment is cleaned and sanitized before every rental.
      </p>
    </div>
  </div>

  <!-- Decorative element -->
  <div class="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2">
    <div class="w-32 h-32 rounded-full bg-[var(--color-secondary)]/10"></div>
    <div class="w-20 h-20 rounded-full bg-[var(--color-accent)]/10 -mt-10 ml-16"></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'inventory-grid',
      name: 'Inventory Grid',
      html: `
<section class="section bg-[var(--color-background)]">
  <div class="container">
    <!-- Search -->
    <div class="relative mb-8">
      <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input type="text" placeholder="Search our rentals..." class="w-full pl-12 pr-4 py-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"/>
    </div>

    <!-- Category filters -->
    <div class="flex flex-wrap gap-3 mb-10">
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-text-on-primary)] font-medium transition-colors">
        All Items
      </button>
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)] transition-colors">
        Bounce Houses
      </button>
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)] transition-colors">
        Water Slides
      </button>
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)] transition-colors">
        Combos
      </button>
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)] transition-colors">
        Obstacle Courses
      </button>
      <button class="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)] transition-colors">
        Games
      </button>
    </div>

    <!-- Smart Block: Items grid - replaced with real inventory data -->
    <div data-smart-block="inventory-grid">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${generateItemCards()}
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center gap-2 mt-12">
      <button class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-text-on-primary)] font-medium">1</button>
      <button class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)]">2</button>
      <button class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)]">3</button>
      <span class="w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)]">...</span>
      <button class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-alt)]">8</button>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

function generateItemCards(): string {
  const items = [
    { name: 'Princess Castle', category: 'Bounce House', price: 199, badge: 'Popular' },
    { name: 'Water Slide Combo', category: 'Water Slide', price: 349, badge: null },
    { name: 'Mega Obstacle Course', category: 'Obstacle Course', price: 299, badge: null },
    { name: 'Sports Arena', category: 'Interactive', price: 249, badge: 'New' },
    { name: 'Tropical Paradise', category: 'Water Slide', price: 399, badge: null },
    { name: 'Monster Truck', category: 'Bounce House', price: 279, badge: null }
  ]

  return items.map((item, i) => `
    <div class="group bg-[var(--color-surface)] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow)] hover:shadow-[var(--shadow-xl)] transition-all duration-300 hover-lift">
      <div class="relative aspect-[4/3] overflow-hidden img-zoom">
        <img
          src="https://placehold.co/600x450/e2e8f0/64748b?text=${encodeURIComponent(item.name)}"
          alt="${item.name}"
          class="w-full h-full object-cover"
        />
        ${item.badge ? `<span class="absolute top-4 right-4 px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full">${item.badge}</span>` : ''}
      </div>
      <div class="p-6">
        <span class="text-sm text-[var(--color-text-muted)] font-medium">${item.category}</span>
        <h3 class="text-xl font-bold text-[var(--color-text)] mt-1 mb-3">${item.name}</h3>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-[var(--color-primary)]">$${item.price}</span>
            <span class="text-sm text-[var(--color-text-muted)]">/day</span>
          </div>
          <a href="/inventory/item-${i + 1}" class="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity">
            View Details
          </a>
        </div>
      </div>
    </div>
  `).join('')
}
