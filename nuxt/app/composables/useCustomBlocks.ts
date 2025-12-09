/**
 * Custom Blocks Composable
 *
 * Allows users to save their own HTML/CSS blocks for reuse.
 * Blocks are stored in localStorage and loaded into GrapesJS.
 */

export interface CustomBlock {
  id: string
  name: string
  category: string
  html: string
  css?: string
  preview?: string // SVG or image preview
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'grapesjs-custom-blocks'

export function useCustomBlocks() {
  const blocks = ref<CustomBlock[]>([])
  const isLoaded = ref(false)

  /**
   * Load custom blocks from localStorage
   */
  const loadBlocks = () => {
    if (!import.meta.client) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        blocks.value = JSON.parse(stored)
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load custom blocks:', error)
      blocks.value = []
    }
  }

  /**
   * Save blocks to localStorage
   */
  const saveBlocks = () => {
    if (!import.meta.client) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks.value))
    } catch (error) {
      console.error('Failed to save custom blocks:', error)
    }
  }

  /**
   * Generate a simple preview SVG from HTML
   */
  const generatePreview = (html: string): string => {
    // Simple heuristic-based preview generation
    const hasImage = html.includes('<img') || html.includes('background-image')
    const hasForm = html.includes('<form') || html.includes('<input')
    const hasButton = html.includes('<button') || html.includes('btn')
    const hasGrid = html.includes('grid') || html.includes('flex')
    const hasList = html.includes('<ul') || html.includes('<li')

    // Generate preview based on content type
    if (hasForm) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#fef3c7" stroke="#fbbf24"/>
        <rect x="10" y="10" width="100" height="12" rx="2" fill="white" stroke="#d1d5db"/>
        <rect x="10" y="28" width="100" height="12" rx="2" fill="white" stroke="#d1d5db"/>
        <rect x="10" y="46" width="40" height="10" rx="3" fill="#f59e0b"/>
        <text x="60" y="32" text-anchor="middle" fill="#92400e" font-size="8">Custom Form</text>
      </svg>`
    }

    if (hasImage && hasGrid) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#ecfdf5" stroke="#10b981"/>
        <rect x="6" y="6" width="52" height="48" rx="2" fill="#d1fae5"/>
        <rect x="62" y="6" width="52" height="22" rx="2" fill="#a7f3d0"/>
        <rect x="62" y="32" width="52" height="22" rx="2" fill="#6ee7b7"/>
        <text x="60" y="58" text-anchor="middle" fill="#047857" font-size="6">Image + Grid</text>
      </svg>`
    }

    if (hasButton) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#ede9fe" stroke="#8b5cf6"/>
        <rect x="25" y="20" width="70" height="20" rx="6" fill="#8b5cf6"/>
        <text x="60" y="34" text-anchor="middle" fill="white" font-size="10">Button</text>
        <text x="60" y="52" text-anchor="middle" fill="#7c3aed" font-size="6">Custom Block</text>
      </svg>`
    }

    if (hasList) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#f0fdf4" stroke="#22c55e"/>
        <circle cx="14" cy="15" r="3" fill="#22c55e"/>
        <rect x="22" y="12" width="70" height="6" rx="1" fill="#86efac"/>
        <circle cx="14" cy="30" r="3" fill="#22c55e"/>
        <rect x="22" y="27" width="60" height="6" rx="1" fill="#86efac"/>
        <circle cx="14" cy="45" r="3" fill="#22c55e"/>
        <rect x="22" y="42" width="65" height="6" rx="1" fill="#86efac"/>
      </svg>`
    }

    // Default custom block preview
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#fef3c7" stroke="#f59e0b"/>
      <path d="M60 15 L75 35 L45 35 Z" fill="#f59e0b"/>
      <rect x="20" y="40" width="80" height="4" rx="1" fill="#fcd34d"/>
      <rect x="30" y="48" width="60" height="3" rx="1" fill="#fde68a"/>
      <text x="60" y="32" text-anchor="middle" fill="#92400e" font-size="8">Custom</text>
    </svg>`
  }

  /**
   * Add a new custom block
   */
  const addBlock = (block: Omit<CustomBlock, 'id' | 'createdAt' | 'updatedAt' | 'preview'>) => {
    const now = Date.now()
    const id = `custom-${now}-${Math.random().toString(36).substr(2, 9)}`

    const newBlock: CustomBlock = {
      ...block,
      id,
      preview: generatePreview(block.html),
      createdAt: now,
      updatedAt: now
    }

    blocks.value.push(newBlock)
    saveBlocks()

    return newBlock
  }

  /**
   * Update an existing block
   */
  const updateBlock = (id: string, updates: Partial<Omit<CustomBlock, 'id' | 'createdAt'>>) => {
    const index = blocks.value.findIndex(b => b.id === id)
    if (index === -1) return null

    const block = blocks.value[index]
    if (!block) return null

    const updated: CustomBlock = {
      ...block,
      ...updates,
      id: block.id,
      name: updates.name ?? block.name,
      category: updates.category ?? block.category,
      html: updates.html ?? block.html,
      createdAt: block.createdAt,
      updatedAt: Date.now()
    }

    if (updates.html) {
      updated.preview = generatePreview(updates.html)
    }

    blocks.value[index] = updated
    saveBlocks()

    return updated
  }

  /**
   * Delete a block
   */
  const deleteBlock = (id: string) => {
    const index = blocks.value.findIndex(b => b.id === id)
    if (index === -1) return false

    blocks.value.splice(index, 1)
    saveBlocks()

    return true
  }

  /**
   * Get a block by ID
   */
  const getBlock = (id: string) => {
    return blocks.value.find(b => b.id === id) || null
  }

  /**
   * Get blocks by category
   */
  const getBlocksByCategory = (category: string) => {
    return blocks.value.filter(b => b.category === category)
  }

  /**
   * Get all unique categories
   */
  const getCategories = computed(() => {
    return [...new Set(blocks.value.map(b => b.category))]
  })

  /**
   * Register custom blocks with GrapesJS editor
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerWithEditor = (editor: Record<string, any>) => {
    if (!editor) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bm = editor.BlockManager as any

    if (!bm) return

    blocks.value.forEach((block) => {
      // block.id already starts with 'custom-', don't double-prefix
      const blockId = block.id

      // Skip if already registered
      if (bm.get && bm.get(blockId)) return

      if (bm.add) {
        bm.add(blockId, {
          media: block.preview || generatePreview(block.html),
          label: block.name,
          category: `My Blocks: ${block.category}`,
          content: block.css
            ? `${block.html}<style>${block.css}</style>`
            : block.html,
          activate: true
        })
      }
    })

    console.log(`✅ Registered ${blocks.value.length} custom blocks with editor`)
  }

  /**
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   * Save selected component from editor as custom block
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveFromEditor = (editor: Record<string, any>, name: string, category: string = 'Saved') => {
    if (!editor) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selected = editor.getSelected?.() as any
    if (!selected) {
      console.warn('No component selected to save as block')
      return null
    }

    let html: string
    let css: string | undefined

    // Special handling for Custom HTML components
    const isCustomHtml = selected.get?.('type') === 'custom-html-component'
      || selected.getAttributes?.()?.['data-custom-html'] === 'true'

    if (isCustomHtml) {
      // Get the stored customHtml content, or fall back to innerHTML
      const customHtml = selected.get?.('customHtml')
      const customCss = selected.get?.('customCss')

      if (customHtml) {
        html = customHtml
        css = customCss || undefined
      } else {
        // Fall back to DOM content

        const el = selected.getEl?.()

        html = el?.innerHTML || selected.toHTML?.() || ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editorCss = (editor.getCss as any)?.({ component: selected })

        css = editorCss || undefined
      }
    } else {
      // Regular component - use toHTML

      html = selected.toHTML?.() || ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const editorCss = (editor.getCss as any)?.({ component: selected })
      css = editorCss || undefined
    }

    // Validate we have actual content
    if (!html || html.trim() === '' || html.includes('Double-click to edit HTML/CSS')) {
      console.warn('No valid content to save as block')
      return null
    }

    return addBlock({
      name,
      category,
      html,
      css
    })
  }

  /**
   * Import blocks from JSON
   */
  const importBlocks = (jsonBlocks: CustomBlock[]) => {
    const imported = jsonBlocks.map(block => ({
      ...block,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      preview: block.preview || generatePreview(block.html),
      createdAt: block.createdAt || Date.now(),
      updatedAt: Date.now()
    }))

    blocks.value.push(...imported)
    saveBlocks()

    return imported.length
  }

  /**
   * Export blocks to JSON
   */
  const exportBlocks = () => {
    return JSON.stringify(blocks.value, null, 2)
  }

  /**
   * Clear all custom blocks
   */
  const clearBlocks = () => {
    blocks.value = []
    saveBlocks()
  }

  // Load blocks on init
  if (import.meta.client) {
    loadBlocks()
  }

  return {
    blocks: readonly(blocks),
    isLoaded: readonly(isLoaded),
    getCategories,
    loadBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlock,
    getBlocksByCategory,
    registerWithEditor,
    saveFromEditor,
    importBlocks,
    exportBlocks,
    clearBlocks
  }
}
