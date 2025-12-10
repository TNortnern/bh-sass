/**
 * Fetch HyperUI Blocks from GitHub
 *
 * This script fetches all HyperUI Tailwind CSS components from their GitHub repo
 * and organizes them for use in the website builder.
 *
 * Run with: npx tsx scripts/fetch-hyperui-blocks.ts
 */

import fs from 'fs/promises'
import path from 'path'

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/markmead/hyperui/main/public/components'
const OUTPUT_DIR = path.join(process.cwd(), 'nuxt/app/data/hyperui-blocks')

// HyperUI component structure
interface HyperUIComponent {
  id: string
  name: string
  category: string
  type: string
  variant: number
  html: string
  preview?: string
}

// Categories and their component types
const HYPERUI_STRUCTURE = {
  marketing: [
    'announcements',
    'banners',
    'blog-cards',
    'buttons',
    'cards',
    'carts',
    'contact-forms',
    'ctas',
    'empty-content',
    'faqs',
    'feature-grids',
    'footers',
    'headers',
    'logo-clouds',
    'newsletter-signup',
    'polls',
    'pricing',
    'product-cards',
    'product-collections',
    'sections',
    'stats',
    'team-sections'
  ],
  application: [
    'accordions',
    'badges',
    'breadcrumbs',
    'button-groups',
    'checkboxes',
    'details-list',
    'dividers',
    'dropdown',
    'empty-states',
    'file-uploaders',
    'filters',
    'grids',
    'inputs',
    'loaders',
    'media',
    'modals',
    'pagination',
    'progress-bars',
    'quantity-inputs',
    'radio-groups',
    'range-inputs',
    'selects',
    'side-menu',
    'skip-links',
    'stats',
    'steps',
    'tables',
    'tabs',
    'textareas',
    'timelines',
    'toasts',
    'toggles',
    'vertical-menu'
  ],
  neobrutalism: [
    'accordions',
    'alerts',
    'badges',
    'buttons',
    'cards',
    'checkboxes',
    'inputs',
    'progress-bars',
    'selects',
    'tabs',
    'textareas'
  ]
}

// Human-readable names for component types
const TYPE_NAMES: Record<string, string> = {
  'announcements': 'Announcements',
  'banners': 'Banners',
  'blog-cards': 'Blog Cards',
  'buttons': 'Buttons',
  'cards': 'Cards',
  'carts': 'Shopping Carts',
  'contact-forms': 'Contact Forms',
  'ctas': 'Call to Action',
  'empty-content': 'Empty Content',
  'faqs': 'FAQs',
  'feature-grids': 'Feature Grids',
  'footers': 'Footers',
  'headers': 'Headers',
  'logo-clouds': 'Logo Clouds',
  'newsletter-signup': 'Newsletter Signup',
  'polls': 'Polls',
  'pricing': 'Pricing',
  'product-cards': 'Product Cards',
  'product-collections': 'Product Collections',
  'sections': 'Sections',
  'stats': 'Statistics',
  'team-sections': 'Team Sections',
  'accordions': 'Accordions',
  'badges': 'Badges',
  'breadcrumbs': 'Breadcrumbs',
  'button-groups': 'Button Groups',
  'checkboxes': 'Checkboxes',
  'details-list': 'Details List',
  'dividers': 'Dividers',
  'dropdown': 'Dropdowns',
  'empty-states': 'Empty States',
  'file-uploaders': 'File Uploaders',
  'filters': 'Filters',
  'grids': 'Grids',
  'inputs': 'Inputs',
  'loaders': 'Loaders',
  'media': 'Media',
  'modals': 'Modals',
  'pagination': 'Pagination',
  'progress-bars': 'Progress Bars',
  'quantity-inputs': 'Quantity Inputs',
  'radio-groups': 'Radio Groups',
  'range-inputs': 'Range Inputs',
  'selects': 'Selects',
  'side-menu': 'Side Menu',
  'skip-links': 'Skip Links',
  'steps': 'Steps',
  'tables': 'Tables',
  'tabs': 'Tabs',
  'textareas': 'Textareas',
  'timelines': 'Timelines',
  'toasts': 'Toasts',
  'toggles': 'Toggles',
  'vertical-menu': 'Vertical Menu',
  'alerts': 'Alerts'
}

// Category names
const CATEGORY_NAMES: Record<string, string> = {
  'marketing': 'Marketing',
  'application': 'Application UI',
  'neobrutalism': 'Neobrutalism'
}

// Fetch a single component from GitHub
async function fetchComponent(category: string, type: string, variant: number): Promise<string | null> {
  const url = `${GITHUB_RAW_BASE}/${category}/${type}/${variant}.html`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return null
    }
    const html = await response.text()
    return html
  } catch (error) {
    return null
  }
}

// Clean HTML - remove doctype, html, head, body wrappers if present
function cleanHTML(html: string): string {
  // Remove DOCTYPE
  html = html.replace(/<!DOCTYPE[^>]*>/i, '')

  // Remove html, head, body tags
  html = html.replace(/<html[^>]*>/gi, '')
  html = html.replace(/<\/html>/gi, '')
  html = html.replace(/<head>[\s\S]*?<\/head>/gi, '')
  html = html.replace(/<body[^>]*>/gi, '')
  html = html.replace(/<\/body>/gi, '')

  // Trim whitespace
  return html.trim()
}

// Format type name to title case
function formatTypeName(type: string): string {
  return TYPE_NAMES[type] || type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Main fetch function
async function fetchAllComponents(): Promise<HyperUIComponent[]> {
  const components: HyperUIComponent[] = []
  let totalFetched = 0
  let totalFailed = 0

  console.log('🚀 Starting HyperUI component fetch...\n')

  for (const [category, types] of Object.entries(HYPERUI_STRUCTURE)) {
    console.log(`📁 Category: ${CATEGORY_NAMES[category]}`)

    for (const type of types) {
      process.stdout.write(`   └─ ${formatTypeName(type)}: `)

      let variant = 1
      let consecutiveFailures = 0
      const typeComponents: HyperUIComponent[] = []

      // Keep fetching variants until we get 3 consecutive 404s
      while (consecutiveFailures < 3) {
        const html = await fetchComponent(category, type, variant)

        if (html) {
          const cleanedHtml = cleanHTML(html)

          components.push({
            id: `hyperui-${category}-${type}-${variant}`,
            name: `${formatTypeName(type)} ${variant}`,
            category,
            type,
            variant,
            html: cleanedHtml
          })

          typeComponents.push({
            id: `hyperui-${category}-${type}-${variant}`,
            name: `${formatTypeName(type)} ${variant}`,
            category,
            type,
            variant,
            html: cleanedHtml
          })

          totalFetched++
          consecutiveFailures = 0
        } else {
          consecutiveFailures++
          totalFailed++
        }

        variant++

        // Rate limiting - small delay between requests
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      console.log(`${typeComponents.length} variants`)
    }

    console.log('')
  }

  console.log(`\n✅ Fetched ${totalFetched} components`)
  console.log(`❌ ${totalFailed} 404 responses (expected - finding variant limits)\n`)

  return components
}

// Group components by category and type for organized export
function organizeComponents(components: HyperUIComponent[]): Record<string, Record<string, HyperUIComponent[]>> {
  const organized: Record<string, Record<string, HyperUIComponent[]>> = {}

  for (const component of components) {
    if (!organized[component.category]) {
      organized[component.category] = {}
    }
    if (!organized[component.category][component.type]) {
      organized[component.category][component.type] = []
    }
    organized[component.category][component.type].push(component)
  }

  return organized
}

// Generate TypeScript export file
function generateTypeScriptFile(components: HyperUIComponent[]): string {
  const organized = organizeComponents(components)

  let output = `/**
 * HyperUI Blocks for Website Builder
 *
 * Auto-generated from HyperUI GitHub repository
 * Total components: ${components.length}
 *
 * Generated: ${new Date().toISOString()}
 */

export interface HyperUIBlock {
  id: string
  name: string
  category: string
  type: string
  variant: number
  html: string
}

export interface HyperUICategory {
  key: string
  label: string
  icon: string
  types: HyperUIType[]
}

export interface HyperUIType {
  key: string
  label: string
  icon: string
  blocks: HyperUIBlock[]
}

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  'marketing': 'i-lucide-megaphone',
  'application': 'i-lucide-layout-dashboard',
  'neobrutalism': 'i-lucide-paint-bucket'
}

// Type icons
const TYPE_ICONS: Record<string, string> = {
  'announcements': 'i-lucide-bell',
  'banners': 'i-lucide-flag',
  'blog-cards': 'i-lucide-newspaper',
  'buttons': 'i-lucide-mouse-pointer-click',
  'cards': 'i-lucide-credit-card',
  'carts': 'i-lucide-shopping-cart',
  'contact-forms': 'i-lucide-mail',
  'ctas': 'i-lucide-megaphone',
  'empty-content': 'i-lucide-inbox',
  'faqs': 'i-lucide-help-circle',
  'feature-grids': 'i-lucide-grid-3x3',
  'footers': 'i-lucide-panel-bottom',
  'headers': 'i-lucide-panel-top',
  'logo-clouds': 'i-lucide-cloud',
  'newsletter-signup': 'i-lucide-mail-plus',
  'polls': 'i-lucide-bar-chart-3',
  'pricing': 'i-lucide-credit-card',
  'product-cards': 'i-lucide-package',
  'product-collections': 'i-lucide-shopping-bag',
  'sections': 'i-lucide-square',
  'stats': 'i-lucide-trending-up',
  'team-sections': 'i-lucide-users',
  'accordions': 'i-lucide-chevrons-up-down',
  'badges': 'i-lucide-badge',
  'breadcrumbs': 'i-lucide-navigation',
  'button-groups': 'i-lucide-rows-3',
  'checkboxes': 'i-lucide-check-square',
  'details-list': 'i-lucide-list',
  'dividers': 'i-lucide-minus',
  'dropdown': 'i-lucide-chevron-down',
  'empty-states': 'i-lucide-inbox',
  'file-uploaders': 'i-lucide-upload',
  'filters': 'i-lucide-filter',
  'grids': 'i-lucide-layout-grid',
  'inputs': 'i-lucide-text-cursor-input',
  'loaders': 'i-lucide-loader',
  'media': 'i-lucide-image',
  'modals': 'i-lucide-square',
  'pagination': 'i-lucide-chevrons-left-right',
  'progress-bars': 'i-lucide-bar-chart',
  'quantity-inputs': 'i-lucide-plus-minus',
  'radio-groups': 'i-lucide-circle-dot',
  'range-inputs': 'i-lucide-sliders-horizontal',
  'selects': 'i-lucide-list',
  'side-menu': 'i-lucide-panel-left',
  'skip-links': 'i-lucide-skip-forward',
  'steps': 'i-lucide-footprints',
  'tables': 'i-lucide-table',
  'tabs': 'i-lucide-folder',
  'textareas': 'i-lucide-align-left',
  'timelines': 'i-lucide-git-commit-horizontal',
  'toasts': 'i-lucide-bell-ring',
  'toggles': 'i-lucide-toggle-left',
  'vertical-menu': 'i-lucide-menu',
  'alerts': 'i-lucide-alert-triangle'
}

// Type labels
const TYPE_LABELS: Record<string, string> = ${JSON.stringify(TYPE_NAMES, null, 2)}

// All HyperUI blocks
export const hyperUIBlocks: HyperUIBlock[] = ${JSON.stringify(components, null, 2)}

// Get blocks by category
export function getHyperUIBlocksByCategory(category: string): HyperUIBlock[] {
  return hyperUIBlocks.filter(block => block.category === category)
}

// Get blocks by type
export function getHyperUIBlocksByType(category: string, type: string): HyperUIBlock[] {
  return hyperUIBlocks.filter(block => block.category === category && block.type === type)
}

// Get block by ID
export function getHyperUIBlockById(id: string): HyperUIBlock | undefined {
  return hyperUIBlocks.find(block => block.id === id)
}

// Get organized structure for UI
export function getHyperUIStructure(): HyperUICategory[] {
  const categories: HyperUICategory[] = []

  const categoryOrder = ['marketing', 'application', 'neobrutalism']
  const categoryLabels: Record<string, string> = {
    'marketing': 'Marketing',
    'application': 'Application UI',
    'neobrutalism': 'Neobrutalism'
  }

  for (const categoryKey of categoryOrder) {
    const categoryBlocks = hyperUIBlocks.filter(b => b.category === categoryKey)
    if (categoryBlocks.length === 0) continue

    // Get unique types
    const types = [...new Set(categoryBlocks.map(b => b.type))]

    const typeItems: HyperUIType[] = types.map(typeKey => ({
      key: typeKey,
      label: TYPE_LABELS[typeKey] || typeKey,
      icon: TYPE_ICONS[typeKey] || 'i-lucide-square',
      blocks: categoryBlocks.filter(b => b.type === typeKey)
    }))

    categories.push({
      key: categoryKey,
      label: categoryLabels[categoryKey] || categoryKey,
      icon: CATEGORY_ICONS[categoryKey] || 'i-lucide-folder',
      types: typeItems
    })
  }

  return categories
}

// Get blocks relevant to bounce house rental business
export function getRentalBusinessBlocks(): HyperUIBlock[] {
  const relevantTypes = [
    'headers',
    'footers',
    'ctas',
    'pricing',
    'product-cards',
    'product-collections',
    'feature-grids',
    'stats',
    'team-sections',
    'contact-forms',
    'faqs',
    'cards',
    'sections',
    'banners',
    'newsletter-signup'
  ]

  return hyperUIBlocks.filter(block =>
    block.category === 'marketing' &&
    relevantTypes.includes(block.type)
  )
}

// Get product/inventory blocks specifically
export function getProductBlocks(): HyperUIBlock[] {
  return hyperUIBlocks.filter(block =>
    ['product-cards', 'product-collections', 'cards', 'grids'].includes(block.type)
  )
}

// Get summary stats
export function getHyperUIStats(): { total: number; byCategory: Record<string, number>; byType: Record<string, number> } {
  const byCategory: Record<string, number> = {}
  const byType: Record<string, number> = {}

  for (const block of hyperUIBlocks) {
    byCategory[block.category] = (byCategory[block.category] || 0) + 1
    byType[block.type] = (byType[block.type] || 0) + 1
  }

  return {
    total: hyperUIBlocks.length,
    byCategory,
    byType
  }
}
`

  return output
}

// Save components to files
async function saveComponents(components: HyperUIComponent[]): Promise<void> {
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Generate and save TypeScript file
  const tsContent = generateTypeScriptFile(components)
  const tsPath = path.join(OUTPUT_DIR, 'index.ts')
  await fs.writeFile(tsPath, tsContent, 'utf-8')
  console.log(`📄 Saved TypeScript file: ${tsPath}`)

  // Save raw JSON for reference
  const jsonPath = path.join(OUTPUT_DIR, 'blocks.json')
  await fs.writeFile(jsonPath, JSON.stringify(components, null, 2), 'utf-8')
  console.log(`📄 Saved JSON file: ${jsonPath}`)

  // Generate summary
  const organized = organizeComponents(components)
  let summary = '# HyperUI Blocks Summary\n\n'
  summary += `Total components: ${components.length}\n\n`

  for (const [category, types] of Object.entries(organized)) {
    const categoryTotal = Object.values(types).flat().length
    summary += `## ${CATEGORY_NAMES[category]} (${categoryTotal})\n\n`

    for (const [type, blocks] of Object.entries(types)) {
      summary += `- ${formatTypeName(type)}: ${blocks.length} variants\n`
    }
    summary += '\n'
  }

  const summaryPath = path.join(OUTPUT_DIR, 'README.md')
  await fs.writeFile(summaryPath, summary, 'utf-8')
  console.log(`📄 Saved summary: ${summaryPath}`)
}

// Main execution
async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║           HyperUI Component Fetcher for BH-SaaS            ║')
  console.log('╚════════════════════════════════════════════════════════════╝\n')

  try {
    const components = await fetchAllComponents()
    await saveComponents(components)

    console.log('\n✨ Done! Components saved to nuxt/app/data/hyperui-blocks/')
    console.log('\nUsage in your code:')
    console.log("  import { hyperUIBlocks, getHyperUIStructure } from '~/data/hyperui-blocks'")
  } catch (error) {
    console.error('❌ Error fetching components:', error)
    process.exit(1)
  }
}

main()
