/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Smart Blocks - Data-Connected Components
 *
 * Smart blocks are GrapesJS components that fetch and display
 * dynamic data from the Payload CMS backend.
 *
 * Each block:
 * - Has configurable props via the editor's trait panel
 * - Renders placeholder content in editor mode
 * - Fetches real data when rendered on live site
 * - Respects the active theme
 */

import type { SmartBlockDefinition, SmartBlockContext } from '../types'

// ============================================================================
// BUSINESS INFO BLOCK
// Displays tenant business information (name, phone, email, etc.)
// ============================================================================

const businessInfoBlock: SmartBlockDefinition = {
  id: 'business-info',
  label: 'Business Info',
  category: 'Smart Blocks',
  description: 'Display your business name, phone, email, or address',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>`,
  props: {
    field: {
      type: 'select',
      label: 'Display Field',
      default: 'name',
      options: [
        { value: 'name', label: 'Business Name' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'email', label: 'Email Address' },
        { value: 'address', label: 'Full Address' },
        { value: 'hours', label: 'Business Hours' },
        { value: 'tagline', label: 'Tagline' }
      ]
    },
    style: {
      type: 'select',
      label: 'Display Style',
      default: 'text',
      options: [
        { value: 'text', label: 'Text Only' },
        { value: 'icon', label: 'With Icon' },
        { value: 'link', label: 'As Link' }
      ]
    },
    size: {
      type: 'select',
      label: 'Text Size',
      default: 'base',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'base', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' }
      ]
    }
  },
  dataSource: {
    endpoint: '/api/tenants/current',
    transform: data => data.tenant
  },
  render: (props, context) => {
    const { field, style, size } = props
    const sizeClasses: Record<string, string> = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl font-semibold'
    }

    const icons: Record<string, string> = {
      name: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
      phone: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`,
      email: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
      address: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
      hours: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      tagline: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`
    }

    // Placeholder values for editor preview
    const placeholders: Record<string, string> = {
      name: 'Your Business Name',
      phone: '(555) 123-4567',
      email: 'hello@yourbusiness.com',
      address: '123 Main Street, City, ST 12345',
      hours: 'Mon-Fri 9am-6pm, Sat 10am-4pm',
      tagline: 'Making every party unforgettable!'
    }

    const value = context.editorMode ? placeholders[field] : `{{business.${field}}}`
    const icon = icons[field] || ''

    if (style === 'icon') {
      return `
        <div class="smart-block-business-info flex items-center gap-2 ${sizeClasses[size as string] || sizeClasses.base}" data-smart-block="business-info" data-field="${field}">
          <span class="text-[var(--color-primary)]">${icon}</span>
          <span>${value}</span>
        </div>
      `
    }

    if (style === 'link') {
      const href = field === 'phone' ? `tel:${value}` : field === 'email' ? `mailto:${value}` : '#'
      return `
        <a href="${href}" class="smart-block-business-info ${sizeClasses[size as string] || sizeClasses.base} text-[var(--color-primary)] hover:underline" data-smart-block="business-info" data-field="${field}">
          ${value}
        </a>
      `
    }

    return `
      <span class="smart-block-business-info ${sizeClasses[size as string] || sizeClasses.base}" data-smart-block="business-info" data-field="${field}">
        ${value}
      </span>
    `
  }
}

// ============================================================================
// INVENTORY GRID BLOCK
// Displays rental items in a filterable grid with virtual scrolling
// ============================================================================

const inventoryGridBlock: SmartBlockDefinition = {
  id: 'inventory-grid',
  label: 'Inventory Grid',
  category: 'Smart Blocks',
  description: 'Display your rental items in a filterable grid',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>`,
  props: {
    layout: {
      type: 'select',
      label: 'Layout Style',
      default: 'grid',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'masonry', label: 'Masonry' },
        { value: 'list', label: 'List' }
      ]
    },
    columns: {
      type: 'select',
      label: 'Columns',
      default: '3',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' }
      ]
    },
    showFilters: {
      type: 'checkbox',
      label: 'Show Category Filters',
      default: true
    },
    showPricing: {
      type: 'checkbox',
      label: 'Show Pricing',
      default: true
    },
    showSearch: {
      type: 'checkbox',
      label: 'Show Search Bar',
      default: true
    },
    categoryFilter: {
      type: 'text',
      label: 'Filter by Category',
      default: '',
      help: 'Leave empty to show all categories'
    },
    maxItems: {
      type: 'number',
      label: 'Max Items',
      default: 12,
      min: 1,
      max: 100
    }
  },
  dataSource: {
    endpoint: '/api/rental-items',
    params: props => ({
      limit: props.maxItems,
      where: props.categoryFilter ? { category: { equals: props.categoryFilter } } : undefined
    }),
    transform: data => data.docs || data
  },
  render: (props, context) => {
    const { layout, columns, showFilters, showPricing, showSearch, maxItems } = props
    const colClassMap: Record<string, string> = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }
    const colClass = colClassMap[columns as string] || 'grid-cols-3'

    // Generate placeholder items for editor preview
    const placeholderItems = Array.from({ length: Math.min(6, maxItems) }, (_, i) => ({
      id: i + 1,
      name: ['Princess Castle', 'Water Slide Combo', 'Obstacle Course', 'Sports Arena', 'Tropical Paradise', 'Monster Truck'][i] || `Item ${i + 1}`,
      category: ['bounce_house', 'water_slide', 'obstacle_course', 'combo', 'water_slide', 'bounce_house'][i] || 'bounce_house',
      price: [199, 349, 299, 249, 399, 279][i] || 199,
      image: `https://placehold.co/400x300/e2e8f0/64748b?text=Item+${i + 1}`
    }))

    const filterHtml = showFilters
      ? `
      <div class="flex flex-wrap gap-2 mb-6">
        <button class="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-text-on-primary)] text-sm font-medium">All</button>
        <button class="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-alt)]">Bounce Houses</button>
        <button class="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-alt)]">Water Slides</button>
        <button class="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-alt)]">Combos</button>
        <button class="px-4 py-2 rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-alt)]">Games</button>
      </div>
    `
      : ''

    const searchHtml = showSearch
      ? `
      <div class="relative mb-6">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" placeholder="Search rentals..." class="w-full pl-10 pr-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"/>
      </div>
    `
      : ''

    const itemsHtml = placeholderItems.map(item => `
      <div class="group relative bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
        <div class="aspect-[4/3] overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-[var(--color-text)] text-lg">${item.name}</h3>
          <p class="text-sm text-[var(--color-text-muted)] capitalize">${item.category.replace('_', ' ')}</p>
          ${showPricing
            ? `
            <div class="mt-3 flex items-baseline gap-1">
              <span class="text-xl font-bold text-[var(--color-primary)]">$${item.price}</span>
              <span class="text-sm text-[var(--color-text-muted)]">/day</span>
            </div>
          `
            : ''}
          <button class="mt-4 w-full py-2.5 px-4 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity">
            View Details
          </button>
        </div>
      </div>
    `).join('')

    return `
      <div class="smart-block-inventory-grid" data-smart-block="inventory-grid" data-layout="${layout}">
        ${searchHtml}
        ${filterHtml}
        <div class="grid ${colClass} gap-6 md:gap-8">
          ${itemsHtml}
        </div>
      </div>
    `
  }
}

// ============================================================================
// FEATURED ITEMS BLOCK
// Highlights selected rental items in various layouts
// ============================================================================

const featuredItemsBlock: SmartBlockDefinition = {
  id: 'featured-items',
  label: 'Featured Items',
  category: 'Smart Blocks',
  description: 'Showcase your best rental items',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,
  props: {
    layout: {
      type: 'select',
      label: 'Layout Style',
      default: 'cards',
      options: [
        { value: 'cards', label: 'Card Row' },
        { value: 'hero', label: 'Hero Feature' },
        { value: 'carousel', label: 'Carousel' }
      ]
    },
    count: {
      type: 'number',
      label: 'Number of Items',
      default: 3,
      min: 1,
      max: 6
    },
    showBadge: {
      type: 'checkbox',
      label: 'Show "Featured" Badge',
      default: true
    }
  },
  dataSource: {
    endpoint: '/api/rental-items',
    params: props => ({
      limit: props.count,
      where: { tags: { contains: 'featured' } }
    })
  },
  render: (props, context) => {
    const { layout, count, showBadge } = props

    const items = Array.from({ length: count }, (_, i) => ({
      name: ['Princess Castle Deluxe', 'Mega Water Slide', 'Ultimate Obstacle Course'][i] || `Featured Item ${i + 1}`,
      description: ['Perfect for birthday parties!', 'Summer fun for everyone', 'Challenge your guests'][i] || 'Amazing rental item',
      price: [249, 399, 349][i] || 299,
      image: `https://placehold.co/600x400/3b82f6/ffffff?text=Featured+${i + 1}`
    }))

    if (layout === 'hero') {
      const item = items[0]
      if (!item) return ''
      return `
        <div class="smart-block-featured-items relative overflow-hidden rounded-[var(--radius-xl)]" data-smart-block="featured-items" data-layout="hero">
          <div class="grid lg:grid-cols-2 gap-0">
            <div class="relative aspect-[4/3] lg:aspect-auto">
              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
              ${showBadge ? '<span class="absolute top-4 left-4 px-3 py-1 bg-[var(--color-accent)] text-white text-sm font-bold rounded-full">Featured</span>' : ''}
            </div>
            <div class="flex flex-col justify-center p-8 lg:p-12 bg-[var(--color-surface)]">
              <h3 class="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">${item.name}</h3>
              <p class="text-lg text-[var(--color-text-muted)] mb-6">${item.description}</p>
              <div class="flex items-baseline gap-2 mb-6">
                <span class="text-3xl font-bold text-[var(--color-primary)]">$${item.price}</span>
                <span class="text-[var(--color-text-muted)]">/day</span>
              </div>
              <button class="self-start px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `
    }

    // Cards layout (default)
    const cardsHtml = items.map((item, i) => `
      <div class="relative bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)] group">
        ${showBadge ? '<span class="absolute top-3 right-3 z-10 px-2 py-1 bg-[var(--color-accent)] text-white text-xs font-bold rounded-full">Featured</span>' : ''}
        <div class="aspect-[4/3] overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        </div>
        <div class="p-5">
          <h3 class="text-xl font-bold text-[var(--color-text)] mb-2">${item.name}</h3>
          <p class="text-[var(--color-text-muted)] mb-4">${item.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-[var(--color-primary)]">$${item.price}<span class="text-sm font-normal text-[var(--color-text-muted)]">/day</span></span>
            <button class="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-medium hover:opacity-90 transition-opacity">
              Book
            </button>
          </div>
        </div>
      </div>
    `).join('')

    return `
      <div class="smart-block-featured-items" data-smart-block="featured-items" data-layout="cards">
        <div class="grid md:grid-cols-${count} gap-6 lg:gap-8">
          ${cardsHtml}
        </div>
      </div>
    `
  }
}

// ============================================================================
// CONTACT FORM BLOCK
// Customizable contact form with various field options
// ============================================================================

const contactFormBlock: SmartBlockDefinition = {
  id: 'contact-form',
  label: 'Contact Form',
  category: 'Smart Blocks',
  description: 'Add a contact form to your page',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>`,
  props: {
    showPhone: {
      type: 'checkbox',
      label: 'Include Phone Field',
      default: true
    },
    showEventDate: {
      type: 'checkbox',
      label: 'Include Event Date',
      default: true
    },
    showItemInterest: {
      type: 'checkbox',
      label: 'Include Item Interest Dropdown',
      default: false
    },
    buttonText: {
      type: 'text',
      label: 'Submit Button Text',
      default: 'Send Message'
    },
    successMessage: {
      type: 'text',
      label: 'Success Message',
      default: 'Thanks! We\'ll be in touch soon.'
    }
  },
  render: (props, context) => {
    const { showPhone, showEventDate, showItemInterest, buttonText } = props

    return `
      <form class="smart-block-contact-form space-y-6" data-smart-block="contact-form">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Name *</label>
            <input type="text" name="name" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="Your name"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Email *</label>
            <input type="email" name="email" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="you@example.com"/>
          </div>
        </div>
        ${showPhone
          ? `
          <div>
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Phone</label>
            <input type="tel" name="phone" class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="(555) 123-4567"/>
          </div>
        `
          : ''}
        ${showEventDate
          ? `
          <div>
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Event Date</label>
            <input type="date" name="eventDate" class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"/>
          </div>
        `
          : ''}
        ${showItemInterest
          ? `
          <div>
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Interested In</label>
            <select name="interest" class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent">
              <option value="">Select a category...</option>
              <option value="bounce_house">Bounce Houses</option>
              <option value="water_slide">Water Slides</option>
              <option value="obstacle_course">Obstacle Courses</option>
              <option value="combo">Combo Units</option>
              <option value="other">Other</option>
            </select>
          </div>
        `
          : ''}
        <div>
          <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Message *</label>
          <textarea name="message" rows="5" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none" placeholder="Tell us about your event..."></textarea>
        </div>
        <button type="submit" class="w-full md:w-auto px-8 py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity">
          ${buttonText}
        </button>
      </form>
    `
  }
}

// ============================================================================
// BOOKING WIDGET BLOCK
// Embedded booking functionality
// ============================================================================

const bookingWidgetBlock: SmartBlockDefinition = {
  id: 'booking-widget',
  label: 'Booking Widget',
  category: 'Smart Blocks',
  description: 'Add the booking widget to your page',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>`,
  props: {
    style: {
      type: 'select',
      label: 'Widget Style',
      default: 'embedded',
      options: [
        { value: 'embedded', label: 'Embedded' },
        { value: 'compact', label: 'Compact' },
        { value: 'full', label: 'Full Page' }
      ]
    },
    showCalendar: {
      type: 'checkbox',
      label: 'Show Calendar View',
      default: true
    },
    primaryColor: {
      type: 'color',
      label: 'Accent Color',
      default: '#3b82f6'
    }
  },
  render: (props, context) => {
    const { style, showCalendar } = props

    // In editor mode, show a placeholder
    if (context.editorMode) {
      return `
        <div class="smart-block-booking-widget bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-8 border-2 border-dashed border-[var(--color-border)]" data-smart-block="booking-widget" data-style="${style}">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
            </svg>
            <h3 class="text-xl font-semibold text-[var(--color-text)] mb-2">Booking Widget</h3>
            <p class="text-[var(--color-text-muted)]">The interactive booking calendar will appear here on your live site.</p>
            <p class="text-sm text-[var(--color-text-muted)] mt-4">Style: <span class="font-medium capitalize">${style}</span></p>
          </div>
        </div>
      `
    }

    // On live site, render the actual widget iframe/component
    return `
      <div class="smart-block-booking-widget" data-smart-block="booking-widget" data-style="${style}">
        <iframe src="/widget/{{tenant.slug}}" width="100%" height="${style === 'compact' ? '400' : '700'}" frameborder="0" allow="payment"></iframe>
      </div>
    `
  }
}

// ============================================================================
// TESTIMONIALS BLOCK
// Customer reviews and testimonials
// ============================================================================

const testimonialsBlock: SmartBlockDefinition = {
  id: 'testimonials',
  label: 'Testimonials',
  category: 'Smart Blocks',
  description: 'Display customer reviews',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>`,
  props: {
    layout: {
      type: 'select',
      label: 'Layout Style',
      default: 'cards',
      options: [
        { value: 'cards', label: 'Card Grid' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'single', label: 'Single Feature' }
      ]
    },
    count: {
      type: 'number',
      label: 'Number of Testimonials',
      default: 3,
      min: 1,
      max: 6
    },
    showRating: {
      type: 'checkbox',
      label: 'Show Star Rating',
      default: true
    },
    showPhoto: {
      type: 'checkbox',
      label: 'Show Customer Photo',
      default: true
    }
  },
  render: (props, context) => {
    const { layout, count, showRating, showPhoto } = props

    const testimonials = [
      { name: 'Sarah M.', text: 'The kids had an absolute blast! Setup was quick and professional. Will definitely book again!', rating: 5 },
      { name: 'Mike T.', text: 'Best party rental experience we\'ve ever had. The equipment was clean and safe.', rating: 5 },
      { name: 'Jennifer L.', text: 'Made my daughter\'s birthday unforgettable. Great customer service!', rating: 5 },
      { name: 'David K.', text: 'Professional, on-time, and the kids loved it. Highly recommend!', rating: 5 },
      { name: 'Lisa R.', text: 'Amazing value for the quality. Our neighborhood block party was a hit!', rating: 5 },
      { name: 'Chris P.', text: 'Easy booking process and excellent communication throughout.', rating: 5 }
    ].slice(0, count)

    const starsHtml = (rating: number) => showRating
      ? `
      <div class="flex gap-1 mb-3">
        ${Array.from({ length: 5 }, (_, i) => `
          <svg class="w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        `).join('')}
      </div>
    `
      : ''

    const photoHtml = (name: string) => showPhoto
      ? `
      <div class="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-on-primary)] font-semibold text-lg">
        ${name.charAt(0)}
      </div>
    `
      : ''

    const cardsHtml = testimonials.map(t => `
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow)]">
        ${starsHtml(t.rating)}
        <p class="text-[var(--color-text)] mb-4">"${t.text}"</p>
        <div class="flex items-center gap-3">
          ${photoHtml(t.name)}
          <span class="font-medium text-[var(--color-text)]">${t.name}</span>
        </div>
      </div>
    `).join('')

    return `
      <div class="smart-block-testimonials" data-smart-block="testimonials" data-layout="${layout}">
        <div class="grid md:grid-cols-${Math.min(count, 3)} gap-6">
          ${cardsHtml}
        </div>
      </div>
    `
  }
}

// ============================================================================
// DOCUMENT SIGN BLOCK
// For terms, waivers, and contracts with e-signature
// ============================================================================

const documentSignBlock: SmartBlockDefinition = {
  id: 'document-sign',
  label: 'Document & Signature',
  category: 'Smart Blocks',
  description: 'Display terms, waivers, or contracts with signature capture',
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <path d="M12 18v-6"/>
    <path d="M9 15l3 3 3-3"/>
  </svg>`,
  props: {
    documentType: {
      type: 'select',
      label: 'Document Type',
      default: 'waiver',
      options: [
        { value: 'terms', label: 'Terms & Conditions' },
        { value: 'waiver', label: 'Liability Waiver' },
        { value: 'contract', label: 'Rental Contract' },
        { value: 'policy', label: 'Policy Document' }
      ]
    },
    requireSignature: {
      type: 'checkbox',
      label: 'Require Signature',
      default: true
    },
    signatureType: {
      type: 'select',
      label: 'Signature Type',
      default: 'draw',
      options: [
        { value: 'draw', label: 'Draw Signature' },
        { value: 'type', label: 'Type Name' },
        { value: 'both', label: 'Either Option' }
      ]
    },
    prefillFromBooking: {
      type: 'checkbox',
      label: 'Prefill from Booking',
      default: true,
      help: 'Automatically fill customer info from their booking'
    }
  },
  render: (props, context) => {
    const { documentType, requireSignature, signatureType, prefillFromBooking } = props

    const typeLabels: Record<string, string> = {
      terms: 'Terms & Conditions',
      waiver: 'Liability Waiver',
      contract: 'Rental Contract',
      policy: 'Policy Document'
    }

    return `
      <div class="smart-block-document-sign bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden" data-smart-block="document-sign" data-type="${documentType}">
        <!-- Document Header -->
        <div class="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
          <h2 class="text-xl font-semibold text-[var(--color-text)]">${typeLabels[documentType as string] || 'Document'}</h2>
          <p class="text-sm text-[var(--color-text-muted)]">Please read and ${requireSignature ? 'sign' : 'acknowledge'} below</p>
        </div>

        <!-- Document Content -->
        <div class="px-6 py-6 max-h-96 overflow-y-auto prose prose-sm text-[var(--color-text)]">
          <p class="text-[var(--color-text-muted)] italic">[Document content will be loaded from your admin settings]</p>

          <h3>1. Agreement</h3>
          <p>This ${(typeLabels[documentType as string] || 'document').toLowerCase()} is entered into between <strong>{{business.name}}</strong> ("Provider") and <strong>{{customer.name}}</strong> ("Customer").</p>

          <h3>2. Rental Period</h3>
          <p>The rental period begins on <strong>{{booking.date}}</strong> and includes the following items: <strong>{{booking.items}}</strong>.</p>

          <h3>3. Terms</h3>
          <p>By signing below, you agree to all terms and conditions outlined in this document...</p>

          <p class="text-sm text-[var(--color-text-muted)]">[Full document content loads from admin]</p>
        </div>

        ${requireSignature
          ? `
          <!-- Signature Section -->
          <div class="px-6 py-6 border-t border-[var(--color-border)] bg-[var(--color-background)]">
            <div class="mb-4">
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Full Legal Name *</label>
              <input type="text" name="signerName" ${prefillFromBooking ? 'value="{{customer.name}}"' : ''} required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Enter your full legal name"/>
            </div>

            ${signatureType === 'draw' || signatureType === 'both'
              ? `
              <div class="mb-4">
                <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Signature *</label>
                <div class="relative border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius)] bg-white h-32 flex items-center justify-center">
                  <p class="text-[var(--color-text-muted)] text-center">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Draw your signature here
                  </p>
                </div>
                <button type="button" class="mt-2 text-sm text-[var(--color-primary)] hover:underline">Clear signature</button>
              </div>
            `
              : ''}

            <div class="flex items-start gap-3 mb-6">
              <input type="checkbox" id="agreeTerms" required class="mt-1 w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
              <label for="agreeTerms" class="text-sm text-[var(--color-text)]">
                I have read and agree to the ${(typeLabels[documentType as string] || 'document').toLowerCase()}. I understand that this is a legally binding agreement.
              </label>
            </div>

            <button type="submit" class="w-full py-3 px-6 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity">
              Sign & Submit
            </button>

            <p class="mt-4 text-xs text-center text-[var(--color-text-muted)]">
              By clicking "Sign & Submit", you agree that your electronic signature is legally binding.
            </p>
          </div>
        `
          : `
          <!-- Acknowledge Only -->
          <div class="px-6 py-6 border-t border-[var(--color-border)]">
            <div class="flex items-start gap-3 mb-4">
              <input type="checkbox" id="acknowledge" required class="mt-1 w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
              <label for="acknowledge" class="text-sm text-[var(--color-text)]">
                I have read and acknowledge the ${(typeLabels[documentType as string] || 'document').toLowerCase()}.
              </label>
            </div>
            <button type="submit" class="w-full py-3 px-6 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity">
              I Acknowledge
            </button>
          </div>
        `}
      </div>
    `
  }
}

// ============================================================================
// SMART BLOCKS REGISTRY
// ============================================================================

export const smartBlocks: Record<string, SmartBlockDefinition> = {
  'business-info': businessInfoBlock,
  'inventory-grid': inventoryGridBlock,
  'featured-items': featuredItemsBlock,
  'contact-form': contactFormBlock,
  'booking-widget': bookingWidgetBlock,
  'testimonials': testimonialsBlock,
  'document-sign': documentSignBlock
}

export const getSmartBlock = (id: string): SmartBlockDefinition | undefined => {
  return smartBlocks[id]
}

export const getAllSmartBlocks = (): SmartBlockDefinition[] => {
  return Object.values(smartBlocks)
}
