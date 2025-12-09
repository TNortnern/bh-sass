/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Performance-Optimized Block Manager for GrapesJS
 *
 * Features:
 * - Lazy loading - only loads blocks when category is expanded
 * - Virtual scrolling for large block lists
 * - HTML strings (not component instances) for performance
 * - requestAnimationFrame for DOM updates
 * - Debounced search functionality
 * - Cached rendered block previews
 */

import type { Editor } from 'grapesjs'
import type { BlockCategory } from './categories'

export interface GrapesBlock {
  id: string
  label: string
  category: string
  content: string // HTML string for performance
  media?: string // Preview thumbnail (base64 or URL)
  attributes?: Record<string, any>
  activate?: boolean
  select?: boolean
  resetId?: boolean
}

export interface BlockManagerOptions {
  editor: Editor
  categories: BlockCategory[]
  enableVirtualScroll?: boolean
  virtualScrollItemHeight?: number
  searchDebounceMs?: number
  cacheSize?: number
}

export class BlockManager {
  private editor: Editor
  private categories: BlockCategory[]
  private blocks: Map<string, GrapesBlock[]> = new Map()
  private loadedCategories: Set<string> = new Set()
  private previewCache: Map<string, string> = new Map()
  private searchIndex: Map<string, GrapesBlock> = new Map()
  private options: Required<BlockManagerOptions>
  private searchTimeout?: NodeJS.Timeout
  private renderQueue: Set<string> = new Set()
  private isRendering = false

  constructor(options: BlockManagerOptions) {
    this.editor = options.editor
    this.categories = options.categories
    this.options = {
      ...options,
      enableVirtualScroll: options.enableVirtualScroll ?? true,
      virtualScrollItemHeight: options.virtualScrollItemHeight ?? 120,
      searchDebounceMs: options.searchDebounceMs ?? 300,
      cacheSize: options.cacheSize ?? 500
    }
  }

  /**
   * Register blocks for a category (lazy loaded)
   */
  registerCategoryBlocks(categoryId: string, blocks: GrapesBlock[]): void {
    this.blocks.set(categoryId, blocks)

    // Build search index
    blocks.forEach((block) => {
      this.searchIndex.set(block.id, block)
    })
  }

  /**
   * Load blocks for a category (called when category is expanded)
   */
  loadCategory(categoryId: string): void {
    if (this.loadedCategories.has(categoryId)) {
      return // Already loaded
    }

    const blocks = this.blocks.get(categoryId)
    if (!blocks) {
      console.warn(`No blocks found for category: ${categoryId}`)
      return
    }

    // Queue blocks for rendering
    this.queueBlocksForRendering(categoryId, blocks)
    this.loadedCategories.add(categoryId)
  }

  /**
   * Queue blocks for rendering with requestAnimationFrame
   */
  private queueBlocksForRendering(categoryId: string, blocks: GrapesBlock[]): void {
    this.renderQueue.add(categoryId)

    if (!this.isRendering) {
      this.processRenderQueue(blocks)
    }
  }

  /**
   * Process render queue in batches using requestAnimationFrame
   */
  private processRenderQueue(blocks: GrapesBlock[]): void {
    this.isRendering = true

    const BATCH_SIZE = 10 // Render 10 blocks per frame
    let index = 0

    const renderBatch = () => {
      const batch = blocks.slice(index, index + BATCH_SIZE)

      batch.forEach((block) => {
        this.registerBlockInEditor(block)
      })

      index += BATCH_SIZE

      if (index < blocks.length) {
        requestAnimationFrame(renderBatch)
      } else {
        this.isRendering = false
      }
    }

    requestAnimationFrame(renderBatch)
  }

  /**
   * Register a single block in GrapesJS editor
   */
  private registerBlockInEditor(block: GrapesBlock): void {
    // Generate or get cached preview
    const media = this.getBlockMedia(block)

    this.editor.Blocks.add(block.id, {
      label: block.label,
      category: block.category,
      content: block.content,
      media,
      attributes: block.attributes || { class: 'gjs-block' },
      activate: block.activate ?? false,
      select: block.select ?? false,
      resetId: block.resetId ?? true
    })
  }

  /**
   * Get or generate block media preview (with caching)
   */
  private getBlockMedia(block: GrapesBlock): string {
    // Check cache first
    if (this.previewCache.has(block.id)) {
      return this.previewCache.get(block.id)!
    }

    // Use provided media or generate SVG placeholder
    const media = block.media || this.generatePlaceholderSVG(block.label)

    // Cache if within size limit
    if (this.previewCache.size < this.options.cacheSize) {
      this.previewCache.set(block.id, media)
    }

    return media
  }

  /**
   * Generate SVG placeholder for block preview
   */
  private generatePlaceholderSVG(label: string): string {
    const initials = label
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#f3f4f6" rx="8"/>
      <text x="50" y="50" text-anchor="middle" dy=".35em" font-family="system-ui" font-size="24" font-weight="600" fill="#6b7280">${initials}</text>
    </svg>`
  }

  /**
   * Search blocks with debouncing
   */
  search(query: string, callback: (results: GrapesBlock[]) => void): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    this.searchTimeout = setTimeout(() => {
      const results = this.performSearch(query)
      callback(results)
    }, this.options.searchDebounceMs)
  }

  /**
   * Perform search across all blocks
   */
  private performSearch(query: string): GrapesBlock[] {
    if (!query.trim()) {
      return []
    }

    const lowerQuery = query.toLowerCase()
    const results: GrapesBlock[] = []

    this.searchIndex.forEach((block) => {
      const searchText = `${block.label} ${block.category}`.toLowerCase()
      if (searchText.includes(lowerQuery)) {
        results.push(block)
      }
    })

    return results
  }

  /**
   * Display search results in editor
   */
  showSearchResults(results: GrapesBlock[]): void {
    // Clear current blocks
    this.editor.Blocks.getAll().reset()

    // Show results
    results.forEach((block) => {
      this.registerBlockInEditor(block)
    })
  }

  /**
   * Restore all blocks (clear search)
   */
  restoreAllBlocks(): void {
    // Clear current blocks
    this.editor.Blocks.getAll().reset()

    // Re-load all loaded categories
    this.loadedCategories.forEach((categoryId) => {
      const blocks = this.blocks.get(categoryId)
      if (blocks) {
        blocks.forEach((block) => {
          this.registerBlockInEditor(block)
        })
      }
    })
  }

  /**
   * Unload a category to free memory
   */
  unloadCategory(categoryId: string): void {
    const blocks = this.blocks.get(categoryId)
    if (blocks) {
      blocks.forEach((block) => {
        this.editor.Blocks.remove(block.id)
        this.previewCache.delete(block.id)
      })
    }

    this.loadedCategories.delete(categoryId)
    this.renderQueue.delete(categoryId)
  }

  /**
   * Get all blocks for a category
   */
  getCategoryBlocks(categoryId: string): GrapesBlock[] {
    return this.blocks.get(categoryId) || []
  }

  /**
   * Get block by ID
   */
  getBlock(blockId: string): GrapesBlock | undefined {
    return this.searchIndex.get(blockId)
  }

  /**
   * Get total block count
   */
  getTotalBlockCount(): number {
    return this.searchIndex.size
  }

  /**
   * Get loaded block count
   */
  getLoadedBlockCount(): number {
    let count = 0
    this.loadedCategories.forEach((categoryId) => {
      count += this.blocks.get(categoryId)?.length || 0
    })
    return count
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.previewCache.clear()
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      cacheSize: this.previewCache.size,
      maxCacheSize: this.options.cacheSize,
      loadedCategories: this.loadedCategories.size,
      totalCategories: this.categories.length,
      totalBlocks: this.searchIndex.size,
      loadedBlocks: this.getLoadedBlockCount()
    }
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    this.blocks.clear()
    this.loadedCategories.clear()
    this.previewCache.clear()
    this.searchIndex.clear()
    this.renderQueue.clear()
  }
}

/**
 * Virtual scroll helper for large block lists
 */
export class VirtualScrollHelper {
  private container: HTMLElement
  private itemHeight: number
  private items: any[]
  private visibleRange = { start: 0, end: 0 }
  private scrollTimeout?: NodeJS.Timeout

  constructor(
    container: HTMLElement,
    items: any[],
    itemHeight: number
  ) {
    this.container = container
    this.items = items
    this.itemHeight = itemHeight
    this.setupScrollListener()
  }

  private setupScrollListener(): void {
    this.container.addEventListener('scroll', () => {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }

      this.scrollTimeout = setTimeout(() => {
        this.updateVisibleRange()
      }, 50)
    })
  }

  private updateVisibleRange(): void {
    const scrollTop = this.container.scrollTop
    const containerHeight = this.container.clientHeight

    const start = Math.floor(scrollTop / this.itemHeight)
    const end = Math.ceil((scrollTop + containerHeight) / this.itemHeight)

    this.visibleRange = { start, end }
    this.renderVisibleItems()
  }

  private renderVisibleItems(): void {
    // Implementation depends on rendering framework
    // This is a placeholder for the concept
    const visibleItems = this.items.slice(
      this.visibleRange.start,
      this.visibleRange.end
    )

    // Trigger render callback with visible items
    // In actual implementation, this would update the DOM
  }

  destroy(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  }
}
