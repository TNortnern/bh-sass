/**
 * GrapesJS Block System - Main Entry Point
 *
 * Initializes the block manager with all available blocks from:
 * - HyperUI (300 HTML components)
 * - Nuxt UI (component-based blocks)
 */

import type { Editor } from 'grapesjs'
import { BlockManager } from './block-manager'
import type { GrapesBlock } from './block-manager'
import { blockCategories, getSortedCategories } from './categories'
import { hyperUIAdapter } from './hyperui-adapter'
import { nuxtUIAdapter } from './nuxt-ui-adapter'

/**
 * Initialize block system for GrapesJS editor
 */
export async function initializeBlockSystem(editor: Editor) {
  // Create block manager
  const blockManager = new BlockManager({
    editor,
    categories: blockCategories,
    enableVirtualScroll: true,
    virtualScrollItemHeight: 120,
    searchDebounceMs: 300,
    cacheSize: 500
  })

  // Load and convert blocks
  const hyperUIData = await import('~/data/hyperui-blocks')
  const nuxtUIData = await import('~/data/nuxt-ui-blocks')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hyperUIBlocks = (hyperUIData as any).default || hyperUIData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nuxtUIBlocks = (nuxtUIData as any).default || nuxtUIData

  // Convert HyperUI blocks
  const convertedHyperUIBlocks = hyperUIAdapter.convertBlocks(hyperUIBlocks)
  const hyperUIByCategory = hyperUIAdapter.groupByCategory(convertedHyperUIBlocks)

  // Convert Nuxt UI blocks
  const convertedNuxtUIBlocks = nuxtUIAdapter.convertBlocks(nuxtUIBlocks)
  const nuxtUIByCategory = nuxtUIAdapter.groupByCategory(convertedNuxtUIBlocks)

  // Merge blocks by category
  const allBlocksByCategory = new Map<string, GrapesBlock[]>()

  // Combine HyperUI blocks
  hyperUIByCategory.forEach((blocks, category) => {
    if (!allBlocksByCategory.has(category)) {
      allBlocksByCategory.set(category, [])
    }
    allBlocksByCategory.get(category)!.push(...blocks)
  })

  // Combine Nuxt UI blocks
  nuxtUIByCategory.forEach((blocks, category) => {
    if (!allBlocksByCategory.has(category)) {
      allBlocksByCategory.set(category, [])
    }
    allBlocksByCategory.get(category)!.push(...blocks)
  })

  // Register all blocks with the manager
  allBlocksByCategory.forEach((blocks, category) => {
    blockManager.registerCategoryBlocks(category, blocks)
  })

  // Load initial categories (only hero section by default)
  const heroBlocks = allBlocksByCategory.get('hero')
  if (heroBlocks) {
    blockManager.loadCategory('hero')
  }

  // Return manager and utilities
  return {
    blockManager,
    loadCategory: (categoryId: string) => blockManager.loadCategory(categoryId),
    unloadCategory: (categoryId: string) => blockManager.unloadCategory(categoryId),
    search: (query: string, callback: (results: GrapesBlock[]) => void) =>
      blockManager.search(query, callback),
    restoreAllBlocks: () => blockManager.restoreAllBlocks(),
    getCacheStats: () => blockManager.getCacheStats(),
    getTotalBlockCount: () => blockManager.getTotalBlockCount(),
    getLoadedBlockCount: () => blockManager.getLoadedBlockCount()
  }
}

/**
 * Get all available categories
 */
export function getCategories() {
  return getSortedCategories()
}

/**
 * Search blocks without initializing full editor
 */
export async function searchBlocks(query: string): Promise<GrapesBlock[]> {
  if (!query.trim()) {
    return []
  }

  const hyperUIData = await import('~/data/hyperui-blocks')

  const nuxtUIData = await import('~/data/nuxt-ui-blocks')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hyperUIBlocks = (hyperUIData as any).default || hyperUIData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nuxtUIBlocks = (nuxtUIData as any).default || nuxtUIData

  const convertedHyperUIBlocks = hyperUIAdapter.convertBlocks(hyperUIBlocks)
  const convertedNuxtUIBlocks = nuxtUIAdapter.convertBlocks(nuxtUIBlocks)

  const allBlocks = [...convertedHyperUIBlocks, ...convertedNuxtUIBlocks]

  const lowerQuery = query.toLowerCase()
  return allBlocks.filter((block) => {
    const searchText = `${block.label} ${block.category}`.toLowerCase()
    return searchText.includes(lowerQuery)
  })
}

/**
 * Get blocks by category without initializing full editor
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 */

export async function getBlocksByCategory(categoryId: string): Promise<GrapesBlock[]> {
  const hyperUIData = await import('~/data/hyperui-blocks')

  const nuxtUIData = await import('~/data/nuxt-ui-blocks')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hyperUIBlocks = (hyperUIData as any).default || hyperUIData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nuxtUIBlocks = (nuxtUIData as any).default || nuxtUIData

  const convertedHyperUIBlocks = hyperUIAdapter.convertBlocks(hyperUIBlocks)
  const convertedNuxtUIBlocks = nuxtUIAdapter.convertBlocks(nuxtUIBlocks)

  const hyperUIByCategory = hyperUIAdapter.groupByCategory(convertedHyperUIBlocks)
  const nuxtUIByCategory = nuxtUIAdapter.groupByCategory(convertedNuxtUIBlocks)

  const categoryBlocks = [
    ...(hyperUIByCategory.get(categoryId) || []),
    ...(nuxtUIByCategory.get(categoryId) || [])
  ]

  return categoryBlocks
}

/**
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 * Get statistics about all blocks
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 */

export async function getBlockStatistics() {
  const hyperUIData = await import('~/data/hyperui-blocks')

  const nuxtUIData = await import('~/data/nuxt-ui-blocks')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hyperUIBlocks = (hyperUIData as any).default || hyperUIData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nuxtUIBlocks = (nuxtUIData as any).default || nuxtUIData

  const hyperUIStats = hyperUIAdapter.getStatistics(hyperUIBlocks)
  const nuxtUIStats = nuxtUIAdapter.getStatistics(nuxtUIBlocks)

  return {
    hyperUI: hyperUIStats,
    nuxtUI: nuxtUIStats,
    total: hyperUIStats.total + nuxtUIStats.total,
    categories: blockCategories.length
  }
}

/**
 * Setup GrapesJS block panel with lazy loading
 */
export function setupBlockPanel(editor: Editor, blockManager: BlockManager) {
  const categories = getSortedCategories()

  // Configure block manager
  const renderFn = () => {
    // Custom render implementation for lazy loading

    const container = document.querySelector('.gjs-blocks-c')

    if (!container) return undefined

    // Clear container

    container.innerHTML = ''

    // Create category sections
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.forEach((category: any) => {
      const section = document.createElement('div')
      section.className = 'gjs-block-category'
      section.innerHTML = `
        <div class="gjs-block-category__title" data-category="${category.id}">
          <i class="${category.icon}"></i>
          <span>${category.label}</span>
          <i class="i-lucide-chevron-down gjs-block-category__arrow"></i>
        </div>
        <div class="gjs-block-category__blocks" data-category-blocks="${category.id}" style="display: ${category.open ? 'block' : 'none'}">
        </div>
      `

      // Add click handler for lazy loading
      const title = section.querySelector('.gjs-block-category__title')
      const blocksContainer = section.querySelector('.gjs-block-category__blocks')

      title?.addEventListener('click', () => {
        const isOpen = (blocksContainer as HTMLElement)?.style.display === 'block'

        if (!isOpen) {
          // Load category blocks on expand
          blockManager.loadCategory(category.id)
          ;(blocksContainer as HTMLElement)!.style.display = 'block'
        } else {
          ;(blocksContainer as HTMLElement)!.style.display = 'none'
          // Optionally unload category to free memory
          // blockManager.unloadCategory(category.id)
        }
      })

      container.appendChild(section)
    })

    return undefined
  }

  // Assign render function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (editor.BlockManager as any).render = renderFn

  // Add search functionality
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Search blocks...'
  searchInput.className = 'gjs-block-search'

  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value

    if (query.trim()) {
      blockManager.search(query, (results) => {
        blockManager.showSearchResults(results)
      })
    } else {
      blockManager.restoreAllBlocks()
    }
  })

  // Insert search at top of blocks panel
  const blocksContainer = document.querySelector('.gjs-blocks-c')?.parentElement
  if (blocksContainer) {
    blocksContainer.insertBefore(searchInput, blocksContainer.firstChild)
  }
}

// Re-export types and utilities
export { BlockManager, type GrapesBlock } from './block-manager'
export { hyperUIAdapter } from './hyperui-adapter'
export { nuxtUIAdapter } from './nuxt-ui-adapter'
export { blockCategories } from './categories'
