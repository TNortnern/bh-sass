/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Smart Block Renderer
 *
 * Renders smart block placeholders with real data from the database.
 * Used when applying templates to replace placeholder content with actual inventory items.
 */

import type { InventoryItem } from '~/composables/useInventory'

export interface SmartBlockContext {
  items: InventoryItem[]
  featuredItems: InventoryItem[]
  tenantSlug: string
  templateStyle: 'starter' | 'bounce' | 'luxe' | 'energy' | 'trust'
}

/**
 * Format category for display
 */
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    bounce_house: 'Bounce House',
    water_slide: 'Water Slide',
    obstacle_course: 'Obstacle Course',
    game: 'Game',
    combo: 'Combo',
    other: 'Other'
  }
  return categoryMap[category] || category
}

/**
 * Get the first image URL or a placeholder
 */
function getImageUrl(item: InventoryItem): string {
  if (item.images && item.images.length > 0) {
    const img = item.images[0]
    // Handle both string URLs and image objects
    if (typeof img === 'string') return img
    if (typeof img === 'object' && img !== null) {
      return (img as any).url || (img as any).thumbnailURL || ''
    }
  }
  // Return placeholder with item name
  return `https://placehold.co/600x450/e2e8f0/64748b?text=${encodeURIComponent(item.name)}`
}

/**
 * Generate inventory item card HTML based on template style
 */
export function generateItemCard(item: InventoryItem, style: string, bookingUrl: string): string {
  const imageUrl = getImageUrl(item)
  const category = formatCategory(item.category)
  const price = item.pricing?.daily || 0
  const itemUrl = `${bookingUrl}?item=${item.id}`

  switch (style) {
    case 'bounce':
      return `
        <div class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:rotate-1">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
            <div class="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
            <span class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold rounded-full">
              ${category}
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">${item.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-3xl font-black text-purple-600">$${price}</span>
                <span class="text-gray-500 text-sm">/day</span>
              </div>
              <a href="${itemUrl}" class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold hover:from-purple-500 hover:to-pink-400 transition-all">
                Book Now! 🎉
              </a>
            </div>
          </div>
        </div>
      `

    case 'luxe':
      return `
        <div class="group bg-stone-900 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
            <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>
            <span class="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-stone-900 text-xs font-semibold tracking-wider uppercase">
              ${category}
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-light text-white tracking-wide mb-3">${item.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-light text-amber-400">$${price}</span>
                <span class="text-stone-500 text-sm ml-1">per day</span>
              </div>
              <a href="${itemUrl}" class="px-5 py-2 bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 transition-colors">
                Reserve
              </a>
            </div>
          </div>
        </div>
      `

    case 'energy':
      return `
        <div class="group bg-stone-900 overflow-hidden border-l-4 border-orange-600 hover:border-blue-500 transition-all duration-300">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div class="absolute inset-0 bg-gradient-to-tr from-stone-900 via-transparent to-transparent"></div>
            <span class="absolute top-0 right-0 px-4 py-2 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transform skew-x-[-6deg]">
              <span class="inline-block skew-x-[6deg]">${category}</span>
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-black text-white uppercase tracking-tight mb-3">${item.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-3xl font-black text-orange-500">$${price}</span>
                <span class="text-stone-500 text-sm uppercase tracking-wider">/day</span>
              </div>
              <a href="${itemUrl}" class="px-6 py-2 bg-blue-600 text-white font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors">
                Book
              </a>
            </div>
          </div>
        </div>
      `

    case 'trust':
      return `
        <div class="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:border-sky-300 transition-all duration-300">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <span class="absolute top-4 right-4 px-3 py-1 bg-sky-600 text-white text-xs font-semibold rounded">
              ${category}
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">${item.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-[#1e3a5f]">$${price}</span>
                <span class="text-slate-500 text-sm">/day</span>
              </div>
              <a href="${itemUrl}" class="px-4 py-2 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#152d4a] transition-colors">
                View Details
              </a>
            </div>
          </div>
        </div>
      `

    case 'starter':
    default:
      return `
        <div class="group bg-[var(--color-surface)] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow)] hover:shadow-[var(--shadow-xl)] transition-all duration-300 hover-lift">
          <div class="relative aspect-[4/3] overflow-hidden img-zoom">
            <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover"/>
            <span class="absolute top-4 right-4 px-3 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full">
              ${category}
            </span>
          </div>
          <div class="p-6">
            <span class="text-sm text-[var(--color-text-muted)] font-medium">${category}</span>
            <h3 class="text-xl font-bold text-[var(--color-text)] mt-1 mb-3">${item.name}</h3>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-[var(--color-primary)]">$${price}</span>
                <span class="text-sm text-[var(--color-text-muted)]">/day</span>
              </div>
              <a href="${itemUrl}" class="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity">
                View Details
              </a>
            </div>
          </div>
        </div>
      `
  }
}

/**
 * Generate featured items grid HTML
 */
export function generateFeaturedItemsGrid(items: InventoryItem[], style: string, bookingUrl: string, limit = 6): string {
  const displayItems = items.slice(0, limit)

  if (displayItems.length === 0) {
    return `
      <div class="text-center py-12 text-gray-500">
        <p>No items available yet. Add some rental items to see them here!</p>
      </div>
    `
  }

  const gridClass = style === 'energy'
    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'

  return `
    <div class="${gridClass}">
      ${displayItems.map(item => generateItemCard(item, style, bookingUrl)).join('')}
    </div>
  `
}

/**
 * Generate full inventory grid HTML with search and filters
 */
export function generateInventoryGrid(items: InventoryItem[], style: string, bookingUrl: string): string {
  if (items.length === 0) {
    return `
      <div class="text-center py-16">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold mb-2">No Rental Items Yet</h3>
        <p class="text-gray-500">Add some rental items to your inventory to see them here.</p>
      </div>
    `
  }

  const gridClass = style === 'energy'
    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'

  return `
    <div class="${gridClass}">
      ${items.map(item => generateItemCard(item, style, bookingUrl)).join('')}
    </div>
  `
}

/**
 * Replace smart block placeholders in HTML with real data
 */
export function hydrateSmartBlocks(html: string, context: SmartBlockContext): string {
  const { items, featuredItems, tenantSlug, templateStyle } = context
  const bookingUrl = `/book/${tenantSlug}`

  // Replace featured-items smart blocks
  html = html.replace(
    /<div[^>]*data-smart-block="featured-items"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi,
    generateFeaturedItemsGrid(featuredItems.length > 0 ? featuredItems : items, templateStyle, bookingUrl)
  )

  // Replace inventory-grid smart blocks (more complex - includes the whole section content)
  html = html.replace(
    /<!-- Items grid \(placeholder[^>]*\) -->\s*<div class="grid[^"]*"[^>]*>[\s\S]*?<\/div>\s*(?=<!-- Pagination -->)/gi,
    `<!-- Items grid -->\n${generateInventoryGrid(items, templateStyle, bookingUrl)}\n`
  )

  return html
}
