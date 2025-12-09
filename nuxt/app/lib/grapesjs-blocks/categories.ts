/**
 * Block Categories for GrapesJS Editor
 */

export interface BlockCategory {
  id: string
  label: string
  icon: string
  order: number
  open?: boolean
}

export const blockCategories: BlockCategory[] = [
  // Marketing categories (from HyperUI + Nuxt UI)
  {
    id: 'hero',
    label: 'Hero Sections',
    icon: 'i-lucide-layout-template',
    order: 1,
    open: true // Open by default
  },
  {
    id: 'cta',
    label: 'Call to Action',
    icon: 'i-lucide-megaphone',
    order: 2
  },
  {
    id: 'features',
    label: 'Features',
    icon: 'i-lucide-grid-3x3',
    order: 3
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'i-lucide-message-square-quote',
    order: 4
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: 'i-lucide-credit-card',
    order: 5
  },
  {
    id: 'products',
    label: 'Products & Inventory',
    icon: 'i-lucide-shopping-bag',
    order: 6
  },
  {
    id: 'team',
    label: 'Team Sections',
    icon: 'i-lucide-users',
    order: 7
  },
  {
    id: 'stats',
    label: 'Stats & Metrics',
    icon: 'i-lucide-trending-up',
    order: 8
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: 'i-lucide-help-circle',
    order: 9
  },
  {
    id: 'contact',
    label: 'Contact Forms',
    icon: 'i-lucide-mail',
    order: 10
  },
  {
    id: 'footer',
    label: 'Footers',
    icon: 'i-lucide-panel-bottom',
    order: 11
  },
  {
    id: 'header',
    label: 'Headers & Navigation',
    icon: 'i-lucide-panel-top',
    order: 12
  },

  // Application UI categories (from HyperUI)
  {
    id: 'forms',
    label: 'Form Elements',
    icon: 'i-lucide-text-cursor-input',
    order: 20
  },
  {
    id: 'tables',
    label: 'Tables',
    icon: 'i-lucide-table',
    order: 21
  },
  {
    id: 'cards',
    label: 'Cards',
    icon: 'i-lucide-credit-card',
    order: 22
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'i-lucide-menu',
    order: 23
  },
  {
    id: 'modals',
    label: 'Modals & Dialogs',
    icon: 'i-lucide-square',
    order: 24
  },
  {
    id: 'notifications',
    label: 'Alerts & Toasts',
    icon: 'i-lucide-bell-ring',
    order: 25
  },

  // Layout categories
  {
    id: 'layout',
    label: 'Layout',
    icon: 'i-lucide-layout-grid',
    order: 30
  },
  {
    id: 'sections',
    label: 'Sections',
    icon: 'i-lucide-square',
    order: 31
  },

  // Media
  {
    id: 'media',
    label: 'Media & Galleries',
    icon: 'i-lucide-image',
    order: 40
  },

  // Interactive
  {
    id: 'interactive',
    label: 'Interactive Elements',
    icon: 'i-lucide-mouse-pointer-click',
    order: 50
  },

  // Neobrutalism (special style)
  {
    id: 'neobrutalism',
    label: 'Neobrutalism',
    icon: 'i-lucide-paint-bucket',
    order: 100
  }
]

/**
 * Get category by ID
 */
export function getCategoryById(id: string): BlockCategory | undefined {
  return blockCategories.find(cat => cat.id === id)
}

/**
 * Get sorted categories
 */
export function getSortedCategories(): BlockCategory[] {
  return [...blockCategories].sort((a, b) => a.order - b.order)
}

/**
 * Category mapping for HyperUI types to our categories
 */
export const hyperUITypeToCategory: Record<string, string> = {
  // Marketing
  'announcements': 'header',
  'banners': 'header',
  'blog-cards': 'products',
  'buttons': 'interactive',
  'cards': 'cards',
  'carts': 'products',
  'contact-forms': 'contact',
  'ctas': 'cta',
  'empty-content': 'sections',
  'faqs': 'faq',
  'feature-grids': 'features',
  'footers': 'footer',
  'headers': 'header',
  'logo-clouds': 'sections',
  'newsletter-signup': 'contact',
  'polls': 'interactive',
  'pricing': 'pricing',
  'product-cards': 'products',
  'product-collections': 'products',
  'sections': 'sections',
  'stats': 'stats',
  'team-sections': 'team',

  // Application UI
  'accordions': 'interactive',
  'badges': 'cards',
  'breadcrumbs': 'navigation',
  'button-groups': 'interactive',
  'checkboxes': 'forms',
  'details-list': 'tables',
  'dividers': 'layout',
  'dropdown': 'navigation',
  'empty-states': 'sections',
  'file-uploaders': 'forms',
  'filters': 'forms',
  'grids': 'layout',
  'inputs': 'forms',
  'loaders': 'interactive',
  'media': 'media',
  'modals': 'modals',
  'pagination': 'navigation',
  'progress-bars': 'interactive',
  'quantity-inputs': 'forms',
  'radio-groups': 'forms',
  'range-inputs': 'forms',
  'selects': 'forms',
  'side-menu': 'navigation',
  'skip-links': 'navigation',
  'steps': 'navigation',
  'tables': 'tables',
  'tabs': 'navigation',
  'textareas': 'forms',
  'timelines': 'sections',
  'toasts': 'notifications',
  'toggles': 'forms',
  'vertical-menu': 'navigation',
  'alerts': 'notifications'
}

/**
 * Category mapping for Nuxt UI blocks
 */
export const nuxtUIToCategory: Record<string, string> = {
  hero: 'hero',
  section: 'sections',
  cta: 'cta',
  features: 'features',
  testimonials: 'testimonials',
  pricing: 'pricing',
  footer: 'footer'
}
