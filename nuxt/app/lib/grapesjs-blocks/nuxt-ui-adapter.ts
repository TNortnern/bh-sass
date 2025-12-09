/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Nuxt UI to GrapesJS Block Adapter
 *
 * Converts Nuxt UI component-based blocks to HTML strings for GrapesJS
 */

import type { NuxtUIBlock } from '~/data/nuxt-ui-blocks'
import type { GrapesBlock } from './block-manager'
import { nuxtUIToCategory } from './categories'

export class NuxtUIAdapter {
  /**
   * Convert a single Nuxt UI block to GrapesJS format
   */
  convertBlock(nuxtBlock: NuxtUIBlock): GrapesBlock {
    const category = this.mapCategory(nuxtBlock.category)

    return {
      id: nuxtBlock.id,
      label: nuxtBlock.name,
      category,
      content: this.convertTemplateToHTML(nuxtBlock),
      media: this.generatePreview(nuxtBlock),
      attributes: {
        'class': 'gjs-block gjs-nuxt-ui-block',
        'data-source': 'nuxt-ui',
        'data-category': nuxtBlock.category,
        'data-supports-auto-populate': nuxtBlock.supportsAutoPopulate,
        'data-auto-populate-type': nuxtBlock.autoPopulateType || ''
      }
    }
  }

  /**
   * Convert all Nuxt UI blocks to GrapesJS format
   */
  convertBlocks(nuxtBlocks: NuxtUIBlock[]): GrapesBlock[] {
    return nuxtBlocks.map(block => this.convertBlock(block))
  }

  /**
   * Map Nuxt UI category to our category system
   */
  private mapCategory(category: NuxtUIBlock['category']): string {
    return nuxtUIToCategory[category] || 'sections'
  }

  /**
   * Convert Vue template to static HTML with Tailwind classes
   */
  private convertTemplateToHTML(block: NuxtUIBlock): string {
    // This is a complex transformation from Vue components to static HTML
    // We'll use the defaultData to populate the template

    const { template, defaultData } = block

    // Simple template variable replacement
    let html = this.replaceTemplateVars(template, defaultData)

    // Convert Vue components to HTML equivalents
    html = this.convertVueToHTML(html)

    return html
  }

  /**
   * Replace template variables with actual data
   */
  private replaceTemplateVars(template: string, data: Record<string, any>): string {
    let result = template

    // Handle simple data bindings like :title="data.title"
    result = result.replace(/:(\w+)="data\.(\w+)"/g, (match, attr, key) => {
      const value = data[key]
      if (value !== undefined) {
        return `${attr}="${this.escapeHTML(String(value))}"`
      }
      return match
    })

    // Handle v-if conditions (remove if false, keep if true)
    result = result.replace(/v-if="data\.(\w+)"/g, (match, key) => {
      return data[key] ? '' : 'hidden'
    })

    return result
  }

  /**
   * Convert Vue components to HTML equivalents with Tailwind classes
   */
  private convertVueToHTML(template: string): string {
    let html = template

    // UPageHero
    html = html.replace(
      /<UPageHero([^>]*)>([\s\S]*?)<\/UPageHero>/g,
      '<section class="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"$1><div class="max-w-7xl mx-auto">$2</div></section>'
    )

    // UPageSection
    html = html.replace(
      /<UPageSection([^>]*)>([\s\S]*?)<\/UPageSection>/g,
      '<section class="py-16 px-4"$1><div class="max-w-7xl mx-auto">$2</div></section>'
    )

    // UPageCTA
    html = html.replace(
      /<UPageCTA([^>]*)>([\s\S]*?)<\/UPageCTA>/g,
      '<section class="py-16 px-4 bg-primary-600 dark:bg-primary-500 text-white"$1><div class="max-w-7xl mx-auto text-center">$2</div></section>'
    )

    // UPageCard
    html = html.replace(
      /<UPageCard([^>]*)>([\s\S]*?)<\/UPageCard>/g,
      '<div class="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900"$1>$2</div>'
    )

    // UPageGrid
    html = html.replace(
      /<UPageGrid>/g,
      '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
    )
    html = html.replace(/<\/UPageGrid>/g, '</div>')

    // UButton
    html = html.replace(
      /<UButton\s+label="([^"]+)"([^>]*?)\/>/g,
      '<button class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"$2>$1</button>'
    )

    // UBadge
    html = html.replace(
      /<UBadge\s+label="([^"]+)"([^>]*?)\/>/g,
      '<span class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"$2>$1</span>'
    )

    // UIcon
    html = html.replace(
      /<UIcon\s+name="([^"]+)"([^>]*?)\/>/g,
      '<i class="$1 text-2xl"$2></i>'
    )

    // UUser (for testimonials)
    html = html.replace(
      /<UUser\s+name="([^"]+)"([^>]*?)\/>/g,
      '<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div><div class="font-medium">$1</div></div>'
    )

    // Remove Vue directives that we can't process
    html = html.replace(/v-for="[^"]+"/g, '')
    html = html.replace(/:key="[^"]+"/g, '')
    html = html.replace(/v-bind:/g, '')
    html = html.replace(/@\w+="[^"]+"/g, '')

    // Clean up template slots
    html = html.replace(/<template[^>]*>#([^<]*)<\/template>/g, '')
    html = html.replace(/<template[^>]*>/g, '')
    html = html.replace(/<\/template>/g, '')

    return html
  }

  /**
   * Escape HTML special characters
   */
  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Generate preview thumbnail for block
   */
  private generatePreview(block: NuxtUIBlock): string {
    const initials = this.getInitials(block.name)
    const color = this.getCategoryColor(block.category)

    return this.generateSVGPreview(initials, block.category, color, block.icon)
  }

  /**
   * Get initials from block name
   */
  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(word => word !== '-')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  /**
   * Get color based on category
   */
  private getCategoryColor(category: NuxtUIBlock['category']): string {
    const colors: Record<string, string> = {
      hero: '#3b82f6', // blue
      section: '#8b5cf6', // purple
      cta: '#f59e0b', // amber
      features: '#10b981', // green
      testimonials: '#ec4899', // pink
      pricing: '#06b6d4', // cyan
      footer: '#6366f1' // indigo
    }

    return colors[category] || '#6b7280'
  }

  /**
   * Generate SVG preview with icon
   */
  private generateSVGPreview(
    initials: string,
    category: string,
    color: string,
    icon?: string
  ): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80">
      <defs>
        <linearGradient id="grad-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />
        </linearGradient>
      </defs>
      <rect width="100" height="80" fill="url(#grad-${category})" rx="8"/>
      <rect x="8" y="8" width="84" height="48" fill="${color}" opacity="0.1" rx="6"/>
      <circle cx="50" cy="32" r="16" fill="${color}" opacity="0.2"/>
      <text x="50" y="38" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="700" fill="${color}">${initials}</text>
      <text x="50" y="70" text-anchor="middle" font-family="system-ui" font-size="9" font-weight="600" fill="${color}" opacity="0.8">${category.toUpperCase()}</text>
    </svg>`
  }

  /**
   * Group blocks by category for lazy loading
   */
  groupByCategory(blocks: GrapesBlock[]): Map<string, GrapesBlock[]> {
    const grouped = new Map<string, GrapesBlock[]>()

    blocks.forEach((block) => {
      const category = block.category
      if (!grouped.has(category)) {
        grouped.set(category, [])
      }
      grouped.get(category)!.push(block)
    })

    return grouped
  }

  /**
   * Filter blocks by category
   */
  filterByCategory(blocks: NuxtUIBlock[], category: NuxtUIBlock['category']): NuxtUIBlock[] {
    return blocks.filter(block => block.category === category)
  }

  /**
   * Filter blocks that support auto-populate
   */
  filterAutoPopulateBlocks(blocks: NuxtUIBlock[]): NuxtUIBlock[] {
    return blocks.filter(block => block.supportsAutoPopulate)
  }

  /**
   * Get block statistics
   */
  getStatistics(blocks: NuxtUIBlock[]) {
    const categoryCount = new Map<string, number>()
    const autoPopulateCount = blocks.filter(b => b.supportsAutoPopulate).length

    blocks.forEach((block) => {
      categoryCount.set(block.category, (categoryCount.get(block.category) || 0) + 1)
    })

    return {
      total: blocks.length,
      categoryCount: Object.fromEntries(categoryCount),
      autoPopulateBlocks: autoPopulateCount,
      categories: [...new Set(blocks.map(b => b.category))]
    }
  }
}

/**
 * Create singleton adapter instance
 */
export const nuxtUIAdapter = new NuxtUIAdapter()
