/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Example Usage of GrapesJS Block System
 *
 * This file demonstrates how to integrate the block system into a GrapesJS editor
 */

import type { Editor } from 'grapesjs'
import grapesjs from 'grapesjs'
import { initializeBlockSystem, setupBlockPanel, getCategories, searchBlocks } from './index'

/**
 * Example 1: Basic Setup
 */
export async function basicSetup() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh',
    width: 'auto',
    storageManager: false,
    blockManager: {
      appendTo: '#blocks'
    }
  })

  // Initialize block system
  const blockSystem = await initializeBlockSystem(editor)

  console.log('Total blocks available:', blockSystem.getTotalBlockCount())
  console.log('Currently loaded:', blockSystem.getLoadedBlockCount())

  return { editor, blockSystem }
}

/**
 * Example 2: Setup with Custom Block Panel
 */
export async function setupWithCustomPanel() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh',
    panels: {
      defaults: [
        {
          id: 'panel-blocks',
          el: '.panel__blocks',
          resizable: {
            maxDim: 350,
            minDim: 200,
            tc: false as any,
            cr: true as any
          }
        },
        {
          id: 'panel-switcher',
          el: '.panel__switcher',
          buttons: [
            {
              id: 'show-blocks',
              active: true,
              label: 'Blocks',
              command: 'show-blocks'
            },
            {
              id: 'show-style',
              label: 'Styles',
              command: 'show-styles'
            }
          ]
        }
      ]
    }
  })

  // Initialize block system
  const blockSystem = await initializeBlockSystem(editor)

  // Setup custom panel with lazy loading
  setupBlockPanel(editor, blockSystem.blockManager)

  return { editor, blockSystem }
}

/**
 * Example 3: Category-based Navigation
 */
export async function categoryNavigation() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh'
  })

  const blockSystem = await initializeBlockSystem(editor)
  const categories = getCategories()

  // Create category buttons
  const categoryContainer = document.getElementById('category-nav')

  categories.forEach((category) => {
    const button = document.createElement('button')
    button.textContent = category.label
    button.className = 'category-btn'
    button.onclick = () => {
      // Load category on click
      blockSystem.loadCategory(category.id)
      console.log(`Loaded ${category.label}`)
    }
    categoryContainer?.appendChild(button)
  })

  return { editor, blockSystem }
}

/**
 * Example 4: Search Implementation
 */
export async function searchImplementation() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh'
  })

  const blockSystem = await initializeBlockSystem(editor)

  // Setup search input
  const searchInput = document.getElementById('block-search') as HTMLInputElement

  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value

    if (query.trim()) {
      // Search with debouncing
      blockSystem.search(query, (results) => {
        console.log(`Found ${results.length} blocks matching "${query}"`)
        // Results are automatically displayed in the block panel
      })
    } else {
      // Clear search - restore all blocks
      blockSystem.restoreAllBlocks()
    }
  })

  return { editor, blockSystem }
}

/**
 * Example 5: Performance Monitoring
 */
export async function performanceMonitoring() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh'
  })

  const blockSystem = await initializeBlockSystem(editor)

  // Monitor performance
  setInterval(() => {
    const stats = blockSystem.getCacheStats()
    console.log('Performance Stats:', {
      cacheUsage: `${stats.cacheSize}/${stats.maxCacheSize}`,
      categoriesLoaded: `${stats.loadedCategories}/${stats.totalCategories}`,
      blocksLoaded: `${stats.loadedBlocks}/${stats.totalBlocks}`,
      memoryEfficiency: `${Math.round((1 - stats.loadedBlocks / stats.totalBlocks) * 100)}%`
    })
  }, 5000)

  return { editor, blockSystem }
}

/**
 * Example 6: Lazy Loading Strategy
 */
export async function lazyLoadingStrategy() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh'
  })

  const blockSystem = await initializeBlockSystem(editor)

  // Load most common categories
  const commonCategories = ['hero', 'features', 'cta']

  commonCategories.forEach((categoryId) => {
    blockSystem.loadCategory(categoryId)
  })

  // Load others on demand
  const loadOnDemand = ['pricing', 'testimonials', 'footer']

  document.getElementById('load-more')?.addEventListener('click', () => {
    loadOnDemand.forEach((categoryId) => {
      blockSystem.loadCategory(categoryId)
    })
    console.log('Loaded additional categories')
  })

  return { editor, blockSystem }
}

/**
 * Example 7: Memory Management
 */
export async function memoryManagement() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh'
  })

  const blockSystem = await initializeBlockSystem(editor)

  // Load category when user expands it
  editor.on('block:category:expand', (categoryId: string) => {
    blockSystem.loadCategory(categoryId)
  })

  // Unload category when user collapses it (optional - saves memory)
  editor.on('block:category:collapse', (categoryId: string) => {
    // Only unload if memory is tight
    const stats = blockSystem.getCacheStats()
    if (stats.loadedBlocks > 200) {
      blockSystem.unloadCategory(categoryId)
      console.log(`Unloaded ${categoryId} to free memory`)
    }
  })

  return { editor, blockSystem }
}

/**
 * Example 8: Standalone Search (without editor)
 */
export async function standaloneSearch() {
  // Search without initializing full editor
  const query = 'hero'
  const results = await searchBlocks(query)

  console.log(`Found ${results.length} blocks:`)
  results.forEach((block) => {
    console.log(`- ${block.label} (${block.category})`)
  })

  return results
}

/**
 * Example 9: Full Integration with Vue Component
 */
export function vueComponentIntegration() {
  return {
    setup() {
      const editorRef = ref<Editor | null>(null)
      const blockSystemRef = ref<any>(null)
      const searchQuery = ref('')
      const selectedCategory = ref('hero')

      const initEditor = async () => {
        const editor = grapesjs.init({
          container: '#gjs',
          fromElement: true,
          height: '100vh'
        })

        const blockSystem = await initializeBlockSystem(editor)

        editorRef.value = editor
        blockSystemRef.value = blockSystem

        // Load default category
        blockSystem.loadCategory('hero')
      }

      const handleSearch = () => {
        if (searchQuery.value.trim()) {
          blockSystemRef.value?.search(searchQuery.value, (results: any[]) => {
            console.log(`Found ${results.length} blocks`)
          })
        } else {
          blockSystemRef.value?.restoreAllBlocks()
        }
      }

      const loadCategory = (categoryId: string) => {
        selectedCategory.value = categoryId
        blockSystemRef.value?.loadCategory(categoryId)
      }

      onMounted(() => {
        initEditor()
      })

      onUnmounted(() => {
        blockSystemRef.value?.blockManager.destroy()
      })

      return {
        searchQuery,
        selectedCategory,
        handleSearch,
        loadCategory
      }
    }
  }
}

/**
 * Example 10: Performance Optimization Tips
 */
export async function performanceOptimizationTips() {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh',
    // Performance optimizations
    avoidInlineStyle: true,
    forceClass: false
  })

  const blockSystem = await initializeBlockSystem(editor)

  // Tip 1: Only load essential categories initially
  blockSystem.loadCategory('hero')

  // Tip 2: Use search instead of loading all categories
  console.log('Use search to discover blocks instead of loading all categories')

  // Tip 3: Unload categories when switching between major sections
  const switchToProducts = () => {
    blockSystem.unloadCategory('hero')
    blockSystem.unloadCategory('features')
    blockSystem.loadCategory('products')
  }

  // Tip 4: Clear cache if memory is limited
  const perfMemory = (performance as any).memory
  if (perfMemory && perfMemory.usedJSHeapSize > 100000000) {
    // If using more than 100MB
    blockSystem.blockManager.clearCache()
    console.log('Cleared cache to free memory')
  }

  // Tip 5: Monitor and log performance
  const logPerformance = () => {
    const stats = blockSystem.getCacheStats()
    console.log('Memory efficiency:', {
      loaded: `${stats.loadedBlocks}/${stats.totalBlocks}`,
      efficiency: `${Math.round((1 - stats.loadedBlocks / stats.totalBlocks) * 100)}%`
    })
  }

  return {
    editor,
    blockSystem,
    switchToProducts,
    logPerformance
  }
}
