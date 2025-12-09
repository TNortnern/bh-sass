/**
 * HyperUI to GrapesJS Block Adapter
 *
 * Converts HyperUI blocks (300 HTML components) to GrapesJS block format
 */

import type { HyperUIBlock } from '~/data/hyperui-blocks'
import type { GrapesBlock } from './block-manager'
import { hyperUITypeToCategory } from './categories'

// Extended HyperUI block with additional metadata
interface HyperUIBlockExtended extends HyperUIBlock {
  type?: string
  category?: string
  variant?: number
}

export class HyperUIAdapter {
  /**
   * Convert a single HyperUI block to GrapesJS format
   */
  convertBlock(hyperuiBlock: HyperUIBlockExtended): GrapesBlock {
    const category = this.mapCategory(hyperuiBlock.type || 'sections')

    return {
      id: hyperuiBlock.id,
      label: hyperuiBlock.name,
      category,
      content: this.processHTML(hyperuiBlock.html),
      media: this.generatePreview(hyperuiBlock),
      attributes: {
        'class': 'gjs-block gjs-hyperui-block',
        'data-source': 'hyperui',
        'data-category': hyperuiBlock.category || '',
        'data-type': hyperuiBlock.type || '',
        'data-variant': hyperuiBlock.variant || 0
      }
    }
  }

  /**
   * Convert all HyperUI blocks to GrapesJS format
   */
  convertBlocks(hyperuiBlocks: HyperUIBlockExtended[]): GrapesBlock[] {
    return hyperuiBlocks.map(block => this.convertBlock(block))
  }

  /**
   * Map HyperUI type to our category system
   */
  private mapCategory(type: string): string {
    return hyperUITypeToCategory[type] || 'sections'
  }

  /**
   * Process HTML to ensure it's compatible with GrapesJS
   */
  private processHTML(html: string): string {
    // Remove excessive whitespace
    let processed = html.replace(/\n\s+/g, '\n').trim()

    // Ensure all class names are preserved
    // HyperUI uses Tailwind classes which should be kept as-is

    // Wrap in a container if not already wrapped
    if (!processed.startsWith('<div') && !processed.startsWith('<section')) {
      processed = `<div class="hyperui-block">${processed}</div>`
    }

    return processed
  }

  /**
   * Generate preview thumbnail for block
   */
  private generatePreview(block: HyperUIBlockExtended): string {
    // For HyperUI blocks, we'll use an SVG placeholder with category info
    // In a real implementation, you might generate actual screenshots

    const categoryName = this.getCategoryName(block.type || 'default')
    const initials = this.getInitials(block.name)

    return this.generateSVGPreview(initials, categoryName, block.variant || 0)
  }

  /**
   * Get category display name
   */
  private getCategoryName(type: string): string {
    const names: Record<string, string> = {
      'announcements': 'Announce',
      'banners': 'Banner',
      'blog-cards': 'Blog',
      'buttons': 'Button',
      'cards': 'Card',
      'carts': 'Cart',
      'contact-forms': 'Form',
      'ctas': 'CTA',
      'faqs': 'FAQ',
      'feature-grids': 'Features',
      'footers': 'Footer',
      'headers': 'Header',
      'pricing': 'Price',
      'product-cards': 'Product',
      'stats': 'Stats',
      'team-sections': 'Team',
      'accordions': 'Accordion',
      'tables': 'Table',
      'forms': 'Form',
      'modals': 'Modal',
      'alerts': 'Alert'
    }

    return names[type] || type
  }

  /**
   * Get initials from block name
   */
  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  /**
   * Generate SVG preview
   */
  private generateSVGPreview(
    initials: string,
    categoryName: string,
    variant: number
  ): string {
    // Color based on variant number
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // green
      '#06b6d4' // cyan
    ]
    const color = colors[variant % colors.length]

    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" viewBox="0 0 100 80">
      <rect width="100" height="80" fill="${color}20" rx="6"/>
      <rect x="5" y="5" width="90" height="50" fill="${color}" opacity="0.1" rx="4"/>
      <text x="50" y="35" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="700" fill="${color}">${initials}</text>
      <text x="50" y="70" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="500" fill="${color}99">${categoryName} ${variant}</text>
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
   * Filter blocks by type
   */
  filterByType(blocks: HyperUIBlockExtended[], type: string): HyperUIBlockExtended[] {
    return blocks.filter(block => block.type === type)
  }

  /**
   * Filter blocks by category
   */
  filterByCategory(blocks: HyperUIBlockExtended[], category: string): HyperUIBlockExtended[] {
    return blocks.filter(block => block.category === category)
  }

  /**
   * Get all unique types
   */
  getUniqueTypes(blocks: HyperUIBlockExtended[]): string[] {
    return [...new Set(blocks.map(block => block.type).filter(Boolean))] as string[]
  }

  /**
   * Get all unique categories
   */
  getUniqueCategories(blocks: HyperUIBlockExtended[]): string[] {
    return [...new Set(blocks.map(block => block.category).filter(Boolean))] as string[]
  }

  /**
   * Get block statistics
   */
  getStatistics(blocks: HyperUIBlockExtended[]) {
    const typeCount = new Map<string, number>()
    const categoryCount = new Map<string, number>()

    blocks.forEach((block) => {
      if (block.type) {
        typeCount.set(block.type, (typeCount.get(block.type) || 0) + 1)
      }
      if (block.category) {
        categoryCount.set(block.category, (categoryCount.get(block.category) || 0) + 1)
      }
    })

    return {
      total: blocks.length,
      typeCount: Object.fromEntries(typeCount),
      categoryCount: Object.fromEntries(categoryCount),
      types: this.getUniqueTypes(blocks),
      categories: this.getUniqueCategories(blocks)
    }
  }
}

/**
 * Create singleton adapter instance
 */
export const hyperUIAdapter = new HyperUIAdapter()
