/**
 * Composable for managing user-saved custom blocks/components
 * Used by both the custom builder and GrapeJS editor
 */

export interface SavedBlock {
  id: string
  name: string
  category: string
  description?: string
  html: string
  css?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'website-builder-saved-blocks'

export function useSavedBlocks() {
  const savedBlocks = useState<SavedBlock[]>('saved-blocks', () => [])

  // Load saved blocks from localStorage
  const loadBlocks = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          savedBlocks.value = JSON.parse(stored)
        }
      } catch (e) {
        console.error('[SavedBlocks] Failed to load from localStorage:', e)
      }
    }
  }

  // Save blocks to localStorage
  const persistBlocks = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBlocks.value))
      } catch (e) {
        console.error('[SavedBlocks] Failed to save to localStorage:', e)
      }
    }
  }

  // Generate a unique ID
  const generateId = () => {
    return `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Add a new saved block
  const saveBlock = (block: Omit<SavedBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBlock: SavedBlock = {
      ...block,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    savedBlocks.value = [...savedBlocks.value, newBlock]
    persistBlocks()
    return newBlock
  }

  // Update an existing saved block
  const updateBlock = (id: string, updates: Partial<Omit<SavedBlock, 'id' | 'createdAt'>>) => {
    const index = savedBlocks.value.findIndex(b => b.id === id)
    if (index !== -1) {
      savedBlocks.value[index] = {
        ...savedBlocks.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      } as SavedBlock
      savedBlocks.value = [...savedBlocks.value]
      persistBlocks()
      return savedBlocks.value[index]
    }
    return null
  }

  // Delete a saved block
  const deleteBlock = (id: string) => {
    savedBlocks.value = savedBlocks.value.filter(b => b.id !== id)
    persistBlocks()
  }

  // Get a saved block by ID
  const getBlock = (id: string) => {
    return savedBlocks.value.find(b => b.id === id)
  }

  // Get blocks by category
  const getBlocksByCategory = (category: string) => {
    return savedBlocks.value.filter(b => b.category === category)
  }

  // Get all unique categories
  const categories = computed(() => {
    const cats = new Set(savedBlocks.value.map(b => b.category))
    return Array.from(cats)
  })

  // Check if a block name already exists
  const nameExists = (name: string, excludeId?: string) => {
    return savedBlocks.value.some(b =>
      b.name.toLowerCase() === name.toLowerCase() && b.id !== excludeId
    )
  }

  // Import blocks from JSON
  const importBlocks = (json: string) => {
    try {
      const blocks = JSON.parse(json) as SavedBlock[]
      if (Array.isArray(blocks)) {
        // Regenerate IDs to avoid conflicts
        const importedBlocks = blocks.map(block => ({
          ...block,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }))
        savedBlocks.value = [...savedBlocks.value, ...importedBlocks]
        persistBlocks()
        return importedBlocks.length
      }
    } catch (e) {
      console.error('[SavedBlocks] Failed to import blocks:', e)
    }
    return 0
  }

  // Export blocks to JSON
  const exportBlocks = () => {
    return JSON.stringify(savedBlocks.value, null, 2)
  }

  // Initialize on client
  if (import.meta.client) {
    loadBlocks()
  }

  return {
    savedBlocks: computed(() => savedBlocks.value),
    categories,
    saveBlock,
    updateBlock,
    deleteBlock,
    getBlock,
    getBlocksByCategory,
    nameExists,
    importBlocks,
    exportBlocks,
    loadBlocks
  }
}
