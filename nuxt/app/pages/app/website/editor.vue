<script setup lang="ts">
/**
 * Fullscreen Website Editor
 * Clean, focused editing experience without dashboard distractions
 * Features: Multi-page support, Custom blocks, HyperUI blocks, Template loading
 */
definePageMeta({
  layout: 'editor',
  middleware: 'website-builder'
})

const toast = useToast()
const router = useRouter()
const route = useRoute()

const {
  state,
  initEditor,
  setDevice,
  togglePreview,
  undo,
  redo,
  saveContent,
  destroyEditor,
  loadCustomBlocks,
  saveAsCustomBlock,
  getPages,
  getCurrentPage,
  addPage,
  selectPage,
  removePage,
  // Block filtering
  filterBlocks,
  getBlockCounts,
  addCustomHtmlBlock
} = useGrapesJS()

const isSaving = ref(false)
const activeBlocksTab = ref<'core' | 'hyperui' | 'custom'>('core')
const hyperuiLoaded = ref(false)
const customBlocksLoaded = ref(false)
const selectedTemplate = ref<string | null>(null)
const isLoadingTemplate = ref(false)

// Custom block modal state
const showSaveBlockModal = ref(false)
const customBlockName = ref('')
const customBlockCategory = ref('Saved')
const isSavingBlock = ref(false)
const pendingBlockData = ref<{ html: string, css: string } | null>(null)

// Multi-page state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pages = ref<any[]>([])
const currentPageId = ref<string>('')
const showAddPageModal = ref(false)
const newPageName = ref('')
const isAddingPage = ref(false)

// Block explorer state
const showBlockExplorer = ref(false)
const blockSearchQuery = ref('')
const selectedBlockCategory = ref<string | null>(null)

// Custom HTML editing state
const isCustomHtmlSelected = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectedCustomHtmlComponent = ref<any>(null)

// Sidebar search query
const sidebarSearchQuery = ref('')
const blockCounts = ref({ core: 0, hyperui: 0, custom: 0 })

// Device options
const devices = [
  { id: 'desktop', name: 'Desktop', icon: 'i-lucide-monitor', width: '' },
  { id: 'tablet', name: 'Tablet', icon: 'i-lucide-tablet', width: '768' },
  { id: 'mobile', name: 'Mobile', icon: 'i-lucide-smartphone', width: '375' }
]

// Handle toolbar "Save as Block" event
const handleToolbarSaveAsBlock = (event: CustomEvent) => {
  const { html, css } = event.detail
  pendingBlockData.value = { html, css }
  customBlockName.value = ''
  customBlockCategory.value = 'Saved'
  showSaveBlockModal.value = true
}

// Load a template into the editor
const loadTemplateIntoEditor = async (templateId: string) => {
  if (!state.value.editor) return

  isLoadingTemplate.value = true
  selectedTemplate.value = templateId

  // CRITICAL: Set global flag to skip expensive isComponent checks during template loading
  // This prevents browser freeze when loading templates with hundreds of elements
  if (typeof window !== 'undefined') {
    (window).__gjsSkipComponentDetection = true
  }

  try {
    // Import template functions
    const { loadTemplate, registerTemplateWithEditor } = await import('~/lib/templates')

    // Load the template definition
    const template = await loadTemplate(templateId)
    if (!template) {
      toast.add({
        title: 'Template Not Found',
        description: `Could not load template: ${templateId}`,
        color: 'error'
      })
      return
    }

    // Load pages if using lazy loading
    if ('loadPages' in template && template.loadPages && (!template.pages || template.pages.length === 0)) {
      template.pages = await template.loadPages()
    }

    // Register template blocks with editor
    await registerTemplateWithEditor(state.value.editor, templateId)

    // Load the home page content into the editor
    const homePage = template.pages.find(p => p.id === 'home') || template.pages[0]
    if (homePage && homePage.sections) {
      const pageHtml = homePage.sections.map(s => s.html).join('\n')
      state.value.editor.setComponents(pageHtml)

      // Apply template's global CSS
      if (template.globalCss) {
        const existingCss = state.value.editor.getCss() || ''
        state.value.editor.setStyle(template.globalCss + '\n' + existingCss)
      }
    }

    // Add all template pages to the editor's page manager
    const pm = state.value.editor.Pages
    if (pm && template.pages.length > 1) {
      // First page is already loaded as main, add the rest
      for (let i = 1; i < template.pages.length; i++) {
        const page = template.pages[i]
        if (page && page.sections) {
          const pageHtml = page.sections.map(s => s.html).join('\n')
          pm.add({
            id: page.id,
            name: page.name,
            component: pageHtml
          })
        }
      }
    }

    // Update pages list
    updatePagesList()

    toast.add({
      title: 'Template Loaded',
      description: `${template.name} template with ${template.pages.length} pages`,
      color: 'success'
    })
  } catch (error) {
    console.error('Failed to load template:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load template',
      color: 'error'
    })
  } finally {
    // Re-enable component detection after template is loaded
    if (typeof window !== 'undefined') {
      (window).__gjsSkipComponentDetection = false
    }
    isLoadingTemplate.value = false
  }
}

// Add editor mode class on mount
onMounted(async () => {
  document.documentElement.classList.add('editor-mode')

  // Listen for toolbar save-as-block events
  window.addEventListener('grapesjs:save-as-block', handleToolbarSaveAsBlock as EventListener)

  try {
    await initEditor('grapesjs-canvas')

    // Initialize pages
    updatePagesList()

    // Add custom HTML block
    addCustomHtmlBlock()

    // Initial filter to show core blocks
    nextTick(() => {
      filterBlocks('core', '', 'blocks-container')
      blockCounts.value = getBlockCounts()
    })

    // Listen for component selection to show Custom HTML edit button
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.value.editor?.on('component:selected', (component: any) => {
      const type = component?.get?.('type')
      const isCustomHtml = type === 'custom-html-component'
        || component?.getAttributes?.()?.['data-custom-html'] === 'true'
      isCustomHtmlSelected.value = isCustomHtml
      selectedCustomHtmlComponent.value = isCustomHtml ? component : null
    })

    state.value.editor?.on('component:deselected', () => {
      isCustomHtmlSelected.value = false
      selectedCustomHtmlComponent.value = null
    })

    // Check for template query parameter and load it
    const templateParam = route.query.template as string
    if (templateParam) {
      await loadTemplateIntoEditor(templateParam)
    } else {
      toast.add({
        title: 'Editor Ready',
        description: 'Click any element to select it. Settings appear on the right.',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('Failed to initialize editor:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to initialize editor',
      color: 'error'
    })
  }
})

onUnmounted(() => {
  document.documentElement.classList.remove('editor-mode')
  window.removeEventListener('grapesjs:save-as-block', handleToolbarSaveAsBlock as EventListener)
  destroyEditor()
})

// Update pages list from editor
const updatePagesList = () => {
  const editorPages = getPages()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pages.value = editorPages.map((p: any) => ({
    id: p.id || p.get('id'),
    name: p.get?.('name') || p.name || p.id || 'Page'
  }))

  const current = getCurrentPage()
  currentPageId.value = current?.id || current?.get?.('id') || (pages.value[0]?.id ?? '')
}

// Load HyperUI blocks on demand
const loadHyperUIBlocks = async () => {
  if (hyperuiLoaded.value || !state.value.editor) return

  try {
    // Import and load HyperUI blocks
    const { loadHyperUIBlocks: loadBlocks } = await import('~/lib/grapesjs-plugins')
    const blocksLoaded = loadBlocks(state.value.editor)
    hyperuiLoaded.value = true

    // Update counts and re-filter
    nextTick(() => {
      blockCounts.value = getBlockCounts()
      filterBlocks('hyperui', sidebarSearchQuery.value, 'blocks-container')
    })

    if (blocksLoaded > 0) {
      toast.add({
        title: 'HyperUI Blocks Loaded',
        description: `${blocksLoaded} premium Tailwind components now available`,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'No Blocks Found',
        description: 'HyperUI blocks could not be loaded',
        color: 'warning'
      })
    }
  } catch (error) {
    console.error('Failed to load HyperUI blocks:', error)
    toast.add({
      title: 'Error Loading Blocks',
      description: 'Failed to load premium blocks. Please try again.',
      color: 'error'
    })
  }
}

// Load custom blocks on demand
const loadCustomBlocksHandler = async () => {
  if (customBlocksLoaded.value || !state.value.editor) return

  try {
    await loadCustomBlocks()
    customBlocksLoaded.value = true

    // Update counts and re-filter
    nextTick(() => {
      blockCounts.value = getBlockCounts()
      filterBlocks('custom', sidebarSearchQuery.value, 'blocks-container')
    })

    toast.add({
      title: 'Custom Blocks Loaded',
      description: 'Your saved blocks are now available',
      color: 'success'
    })
  } catch (error) {
    console.error('Failed to load custom blocks:', error)
  }
}

// Watch for tab changes - load blocks then filter
watch(activeBlocksTab, async (tab) => {
  // Load blocks if needed
  if (tab === 'hyperui' && !hyperuiLoaded.value) {
    await loadHyperUIBlocks()
  }
  if (tab === 'custom' && !customBlocksLoaded.value) {
    await loadCustomBlocksHandler()
  }

  // Apply filter
  nextTick(() => {
    filterBlocks(tab, sidebarSearchQuery.value, 'blocks-container')
    blockCounts.value = getBlockCounts()
  })
})

// Watch for search changes
watch(sidebarSearchQuery, (query) => {
  filterBlocks(activeBlocksTab.value, query, 'blocks-container')
})

// Handle device change
const handleDeviceChange = (deviceId: string) => {
  setDevice(deviceId)
}

// Handle save
const handleSave = async () => {
  isSaving.value = true
  try {
    const content = await saveContent()
    if (content) {
      toast.add({
        title: 'Saved',
        description: 'Your changes have been saved',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('Failed to save:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to save',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

// Export HTML
const exportHtml = async () => {
  const content = await saveContent()
  if (!content) return

  const scriptOpen = '<' + 'script>'
  const scriptClose = '</' + 'script>'
  const jsSection = content.js ? `${scriptOpen}${content.js}${scriptClose}` : ''

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
    <script src="https://cdn.tailwindcss.com"><` + `/script>
  <style>${content.css}</style>
</head>
<body>
  ${content.html}
  ${jsSection}
</body>
</html>`

  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'website.html'
  a.click()
  URL.revokeObjectURL(url)

  toast.add({
    title: 'Exported',
    description: 'Website downloaded as HTML',
    color: 'success'
  })
}

// Save selection as custom block
const openSaveBlockModal = () => {
  if (!state.value.editor?.getSelected()) {
    toast.add({
      title: 'No Selection',
      description: 'Select a component first to save as a block',
      color: 'warning'
    })
    return
  }
  customBlockName.value = ''
  customBlockCategory.value = 'Saved'
  showSaveBlockModal.value = true
}

const handleSaveBlock = async () => {
  if (!customBlockName.value.trim()) {
    toast.add({
      title: 'Name Required',
      description: 'Please enter a name for your block',
      color: 'warning'
    })
    return
  }

  isSavingBlock.value = true
  try {
    let block = null

    // If we have pending data from toolbar, use that directly
    if (pendingBlockData.value) {
      const { useCustomBlocks } = await import('~/composables/useCustomBlocks')
      const customBlocks = useCustomBlocks()
      block = customBlocks.addBlock({
        name: customBlockName.value,
        category: customBlockCategory.value,
        html: pendingBlockData.value.html,
        css: pendingBlockData.value.css || undefined
      })
      // Register with editor
      if (state.value.editor) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customBlocks.registerWithEditor(state.value.editor as any)
      }
      pendingBlockData.value = null
    } else {
      // Otherwise use the currently selected component
      block = await saveAsCustomBlock(customBlockName.value, customBlockCategory.value)
    }

    if (block) {
      toast.add({
        title: 'Block Saved!',
        description: `"${customBlockName.value}" added to My Blocks`,
        color: 'success'
      })
      showSaveBlockModal.value = false
      // Switch to custom tab to show the new block
      activeBlocksTab.value = 'custom'
      customBlocksLoaded.value = false
      loadCustomBlocksHandler()
    }
  } catch (error) {
    console.error('Failed to save block:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to save block',
      color: 'error'
    })
  } finally {
    isSavingBlock.value = false
  }
}

// Page management
const handlePageChange = async (pageId: string) => {
  if (state.value.isPageLoading) return
  await selectPage(pageId)
  currentPageId.value = pageId
}

const handleAddPage = async () => {
  if (!newPageName.value.trim()) {
    toast.add({
      title: 'Name Required',
      description: 'Please enter a page name',
      color: 'warning'
    })
    return
  }

  isAddingPage.value = true
  showAddPageModal.value = false

  try {
    const pageId = newPageName.value.toLowerCase().replace(/\s+/g, '-')
    await addPage(pageId, newPageName.value)

    updatePagesList()
    currentPageId.value = pageId
    toast.add({
      title: 'Page Added',
      description: `"${newPageName.value}" has been created`,
      color: 'success'
    })
  } catch (err) {
    const error = err as { data?: { message?: string } }
    console.error('Failed to add page:', error)
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to add page',
      color: 'error'
    })
  } finally {
    isAddingPage.value = false
    newPageName.value = ''
  }
}

const handleDeletePage = (pageId: string) => {
  if (pages.value.length <= 1) {
    toast.add({
      title: 'Cannot Delete',
      description: 'You must have at least one page',
      color: 'warning'
    })
    return
  }

  if (removePage(pageId)) {
    updatePagesList()
    toast.add({
      title: 'Page Deleted',
      color: 'neutral'
    })
  }
}

// Exit editor
const exitEditor = () => {
  router.push('/app/website')
}

// Open Custom HTML code editor
const openCustomHtmlEditor = () => {
  if (!state.value.editor || !selectedCustomHtmlComponent.value) {
    toast.add({
      title: 'No Custom HTML Selected',
      description: 'Select a Custom HTML component first',
      color: 'warning'
    })
    return
  }

  // Run the custom-html:edit command with the selected component
  state.value.editor.runCommand('custom-html:edit', {
    component: selectedCustomHtmlComponent.value
  })
}
</script>

<template>
  <div class="fullscreen-editor h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
    <!-- Minimal Top Bar -->
    <header class="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-3 shrink-0">
      <!-- Left: Logo & Exit -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          @click="exitEditor"
        >
          <UIcon
            name="i-lucide-x"
            class="size-5"
          />
          <span class="text-sm font-medium hidden sm:inline">Exit</span>
        </button>

        <div class="w-px h-5 bg-gray-700" />

        <span class="text-sm font-semibold text-white">Website Editor</span>

        <!-- Page Tabs -->
        <div class="w-px h-5 bg-gray-700 hidden md:block" />
        <div class="hidden md:flex items-center gap-1">
          <button
            v-for="page in pages"
            :key="page.id"
            :class="[
              'group flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
              currentPageId === page.id
                ? 'bg-gray-800 text-amber-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            ]"
            @click="handlePageChange(page.id)"
          >
            <UIcon
              name="i-lucide-file"
              class="size-3"
            />
            {{ page.name }}
            <button
              v-if="pages.length > 1"
              class="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all"
              @click.stop="handleDeletePage(page.id)"
            >
              <UIcon
                name="i-lucide-x"
                class="size-3"
              />
            </button>
          </button>
          <button
            class="p-1 text-gray-500 hover:text-amber-400 transition-colors"
            title="Add Page"
            @click="showAddPageModal = true"
          >
            <UIcon
              name="i-lucide-plus"
              class="size-4"
            />
          </button>
        </div>
      </div>

      <!-- Center: Device Switcher -->
      <div class="flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
        <button
          v-for="device in devices"
          :key="device.id"
          :class="[
            'p-1.5 rounded-md transition-colors',
            state.selectedDevice === device.id
              ? 'bg-amber-500 text-gray-900'
              : 'text-gray-400 hover:text-white'
          ]"
          :title="device.name"
          @click="handleDeviceChange(device.id)"
        >
          <UIcon
            :name="device.icon"
            class="size-4"
          />
        </button>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-2">
        <button
          class="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Undo (Ctrl+Z)"
          @click="undo"
        >
          <UIcon
            name="i-lucide-undo"
            class="size-4"
          />
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Redo (Ctrl+Y)"
          @click="redo"
        >
          <UIcon
            name="i-lucide-redo"
            class="size-4"
          />
        </button>

        <div class="w-px h-5 bg-gray-700" />

        <!-- Save as Custom Block -->
        <button
          class="p-1.5 text-gray-400 hover:text-amber-400 transition-colors"
          title="Save Selection as Block"
          @click="openSaveBlockModal"
        >
          <UIcon
            name="i-lucide-puzzle"
            class="size-4"
          />
        </button>

        <button
          class="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Preview"
          @click="togglePreview"
        >
          <UIcon
            name="i-lucide-eye"
            class="size-4"
          />
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-white transition-colors"
          title="Export HTML"
          @click="exportHtml"
        >
          <UIcon
            name="i-lucide-download"
            class="size-4"
          />
        </button>

        <button
          :disabled="isSaving"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-900 font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
          @click="handleSave"
        >
          <UIcon
            v-if="isSaving"
            name="i-lucide-loader-2"
            class="size-4 animate-spin"
          />
          <UIcon
            v-else
            name="i-lucide-save"
            class="size-4"
          />
          <span class="hidden sm:inline">Save</span>
        </button>
      </div>
    </header>

    <!-- Editor Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar: Blocks -->
      <aside class="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <!-- Explore Blocks CTA -->
        <div class="p-3 border-b border-gray-800">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/20"
            @click="showBlockExplorer = true"
          >
            <UIcon
              name="i-lucide-layout-grid"
              class="size-4"
            />
            Explore All Blocks
          </button>
        </div>

        <!-- Search Input -->
        <div class="p-2 border-b border-gray-800">
          <div class="relative">
            <UIcon
              name="i-lucide-search"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-500"
            />
            <input
              v-model="sidebarSearchQuery"
              type="text"
              placeholder="Search blocks..."
              class="w-full pl-8 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            >
            <button
              v-if="sidebarSearchQuery"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-300"
              @click="sidebarSearchQuery = ''"
            >
              <UIcon
                name="i-lucide-x"
                class="size-4"
              />
            </button>
          </div>
        </div>

        <!-- Block Type Tabs -->
        <div class="flex border-b border-gray-800">
          <button
            :class="[
              'flex-1 px-2 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
              activeBlocksTab === 'core'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            ]"
            @click="activeBlocksTab = 'core'"
          >
            Basic
            <span
              v-if="blockCounts.core"
              class="ml-1 text-[10px] opacity-60"
            >({{ blockCounts.core }})</span>
          </button>
          <button
            :class="[
              'flex-1 px-2 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors relative',
              activeBlocksTab === 'hyperui'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            ]"
            @click="activeBlocksTab = 'hyperui'"
          >
            Premium
            <span
              v-if="blockCounts.hyperui"
              class="ml-1 text-[10px] opacity-60"
            >({{ blockCounts.hyperui }})</span>
            <span
              v-if="!hyperuiLoaded && !blockCounts.hyperui"
              class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"
            />
          </button>
          <button
            :class="[
              'flex-1 px-2 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors',
              activeBlocksTab === 'custom'
                ? 'text-green-400 border-b-2 border-green-400 bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-300'
            ]"
            @click="activeBlocksTab = 'custom'"
          >
            Saved
            <span
              v-if="blockCounts.custom"
              class="ml-1 text-[10px] opacity-60"
            >({{ blockCounts.custom }})</span>
          </button>
        </div>

        <!-- Quick Tip -->
        <div
          v-if="activeBlocksTab === 'core'"
          class="px-3 py-2 bg-blue-500/10 border-b border-gray-800"
        >
          <p class="text-xs text-blue-300">
            <span class="font-semibold">Tip:</span> Drag blocks to the canvas
          </p>
        </div>
        <div
          v-else-if="activeBlocksTab === 'hyperui' && !hyperuiLoaded"
          class="px-3 py-2 bg-purple-500/10 border-b border-gray-800"
        >
          <p class="text-xs text-purple-300 flex items-center gap-1">
            <UIcon
              name="i-lucide-sparkles"
              class="size-3"
            />
            Click to load premium blocks
          </p>
        </div>
        <div
          v-else-if="activeBlocksTab === 'custom'"
          class="px-3 py-2 bg-green-500/10 border-b border-gray-800"
        >
          <p class="text-xs text-green-300">
            <span class="font-semibold">Save blocks:</span> Select any element → click cube icon in toolbar
          </p>
        </div>

        <!-- Blocks Container -->
        <div
          id="blocks-container"
          class="flex-1 overflow-y-auto p-2"
        />
      </aside>

      <!-- Main Canvas -->
      <main class="flex-1 bg-gray-950 relative">
        <!-- Initial Loading State -->
        <div
          v-if="!state.isReady"
          class="absolute inset-0 flex items-center justify-center bg-gray-950 z-10"
        >
          <div class="text-center">
            <UIcon
              name="i-lucide-loader-2"
              class="size-10 text-amber-500 animate-spin mb-3"
            />
            <p class="text-gray-400 text-sm">
              Loading editor...
            </p>
          </div>
        </div>

        <!-- Page/Template Loading Overlay -->
        <Transition
          enter-active-class="transition-opacity duration-150"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="state.isPageLoading || isAddingPage || isLoadingTemplate"
            class="absolute inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-20"
          >
            <div class="text-center bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700">
              <UIcon
                name="i-lucide-loader-2"
                class="size-8 text-amber-500 animate-spin mb-3 mx-auto"
              />
              <p class="text-white font-medium">
                {{ isLoadingTemplate ? 'Loading template...' : isAddingPage ? 'Creating page...' : 'Switching page...' }}
              </p>
              <p class="text-gray-400 text-sm mt-1">
                {{ isLoadingTemplate ? 'Setting up your website' : 'Please wait' }}
              </p>
            </div>
          </div>
        </Transition>

        <!-- GrapesJS Canvas -->
        <div
          id="grapesjs-canvas"
          class="h-full"
        />
      </main>

      <!-- Right Sidebar: Properties -->
      <aside class="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
        <!-- Traits (Settings) -->
        <div class="border-b border-gray-800">
          <div class="px-3 py-2 bg-gray-800/50">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <UIcon
                name="i-lucide-settings-2"
                class="size-3.5"
              />
              Settings
            </h3>
          </div>

          <!-- Custom HTML Edit Button - Shows when Custom HTML is selected -->
          <div
            v-if="isCustomHtmlSelected"
            class="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20"
          >
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/20"
              @click="openCustomHtmlEditor"
            >
              <UIcon
                name="i-lucide-code-2"
                class="size-5"
              />
              Edit HTML/CSS
            </button>
            <p class="text-xs text-amber-300/70 text-center mt-2">
              Click to open the code editor
            </p>
          </div>

          <div
            id="traits-container"
            class="max-h-80 overflow-y-auto"
          />
        </div>

        <!-- Layers -->
        <div class="border-b border-gray-800">
          <div class="px-3 py-2 bg-gray-800/50">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <UIcon
                name="i-lucide-layers"
                class="size-3.5"
              />
              Layers
            </h3>
          </div>
          <div
            id="layers-container"
            class="max-h-48 overflow-y-auto"
          />
        </div>

        <!-- Styles -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <div class="px-3 py-2 bg-gray-800/50 border-b border-gray-800">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <UIcon
                name="i-lucide-paintbrush"
                class="size-3.5"
              />
              Styles
            </h3>
          </div>
          <div
            id="styles-container"
            class="flex-1 overflow-y-auto"
          />
        </div>
      </aside>
    </div>

    <!-- Save Block Modal -->
    <UModal v-model:open="showSaveBlockModal">
      <template #content>
        <div class="p-6 bg-gray-900 text-white rounded-xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-puzzle"
                class="size-5 text-amber-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold">
                Save as Custom Block
              </h3>
              <p class="text-sm text-gray-400">
                Reuse this component across your pages
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Block Name</label>
              <input
                v-model="customBlockName"
                type="text"
                placeholder="e.g., Hero Section, Contact Form"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <input
                v-model="customBlockCategory"
                type="text"
                placeholder="e.g., Saved, Headers, Footers"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              @click="showSaveBlockModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="isSavingBlock || !customBlockName.trim()"
              class="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
              @click="handleSaveBlock"
            >
              <UIcon
                v-if="isSavingBlock"
                name="i-lucide-loader-2"
                class="size-4 animate-spin"
              />
              <UIcon
                v-else
                name="i-lucide-save"
                class="size-4"
              />
              Save Block
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Add Page Modal -->
    <UModal v-model:open="showAddPageModal">
      <template #content>
        <div class="p-6 bg-gray-900 text-white rounded-xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-file-plus"
                class="size-5 text-blue-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold">
                Add New Page
              </h3>
              <p class="text-sm text-gray-400">
                Create a new page for your website
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Page Name</label>
            <input
              v-model="newPageName"
              type="text"
              placeholder="e.g., About, Contact, Services"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleAddPage"
            >
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              @click="showAddPageModal = false"
            >
              Cancel
            </button>
            <button
              :disabled="!newPageName.trim()"
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              @click="handleAddPage"
            >
              <UIcon
                name="i-lucide-plus"
                class="size-4"
              />
              Add Page
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Block Explorer Modal -->
    <UModal
      v-model:open="showBlockExplorer"
      :ui="{ wrapper: 'max-w-4xl' }"
    >
      <template #content>
        <div class="bg-gray-900 text-white rounded-xl overflow-hidden max-h-[85vh] flex flex-col">
          <!-- Header -->
          <div class="p-4 border-b border-gray-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <UIcon
                  name="i-lucide-layout-grid"
                  class="size-5 text-white"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold">
                  Block Library
                </h3>
                <p class="text-sm text-gray-400">
                  Drag any block to your canvas
                </p>
              </div>
            </div>
            <button
              class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              @click="showBlockExplorer = false"
            >
              <UIcon
                name="i-lucide-x"
                class="size-5 text-gray-400"
              />
            </button>
          </div>

          <!-- Search & Categories -->
          <div class="p-4 border-b border-gray-800 space-y-3">
            <!-- Search -->
            <div class="relative">
              <UIcon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500"
              />
              <input
                v-model="blockSearchQuery"
                type="text"
                placeholder="Search blocks... (e.g., hero, pricing, contact)"
                class="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
            </div>

            <!-- Category Pills -->
            <div class="flex flex-wrap gap-2">
              <button
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  selectedBlockCategory === null
                    ? 'bg-amber-500 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                ]"
                @click="selectedBlockCategory = null"
              >
                All
              </button>
              <button
                v-for="cat in ['Hero', 'Features', 'CTA', 'Pricing', 'Testimonials', 'Forms', 'Footer', 'Navigation']"
                :key="cat"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  selectedBlockCategory === cat
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                ]"
                @click="selectedBlockCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Block Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <!-- Quick Actions -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <button
                class="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors text-left"
                @click="activeBlocksTab = 'core'; showBlockExplorer = false"
              >
                <div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
                  <UIcon
                    name="i-lucide-box"
                    class="size-5 text-amber-400"
                  />
                </div>
                <h4 class="font-semibold text-white">
                  Basic Blocks
                </h4>
                <p class="text-xs text-gray-400 mt-1">
                  Text, images, buttons, layouts
                </p>
              </button>

              <button
                class="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors text-left relative overflow-hidden"
                @click="activeBlocksTab = 'hyperui'; loadHyperUIBlocks(); showBlockExplorer = false"
              >
                <div class="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-500 text-[10px] font-bold rounded">
                  PRO
                </div>
                <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="size-5 text-purple-400"
                  />
                </div>
                <h4 class="font-semibold text-white">
                  HyperUI Premium
                </h4>
                <p class="text-xs text-gray-400 mt-1">
                  100+ Tailwind components
                </p>
              </button>

              <button
                class="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors text-left"
                @click="activeBlocksTab = 'custom'; loadCustomBlocksHandler(); showBlockExplorer = false"
              >
                <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                  <UIcon
                    name="i-lucide-bookmark"
                    class="size-5 text-green-400"
                  />
                </div>
                <h4 class="font-semibold text-white">
                  My Saved Blocks
                </h4>
                <p class="text-xs text-gray-400 mt-1">
                  Your custom components
                </p>
              </button>
            </div>

            <!-- How to Use Section -->
            <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
                <UIcon
                  name="i-lucide-lightbulb"
                  class="size-4 text-amber-400"
                />
                How to Build Your Page
              </h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div class="space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto">
                    <span class="text-xl font-bold text-blue-400">1</span>
                  </div>
                  <p class="text-sm text-gray-300">
                    Drag blocks to canvas
                  </p>
                </div>
                <div class="space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto">
                    <span class="text-xl font-bold text-green-400">2</span>
                  </div>
                  <p class="text-sm text-gray-300">
                    Click to select & edit
                  </p>
                </div>
                <div class="space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto">
                    <span class="text-xl font-bold text-purple-400">3</span>
                  </div>
                  <p class="text-sm text-gray-300">
                    Use Settings on right
                  </p>
                </div>
                <div class="space-y-2">
                  <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto">
                    <span class="text-xl font-bold text-amber-400">4</span>
                  </div>
                  <p class="text-sm text-gray-300">
                    Save as reusable block
                  </p>
                </div>
              </div>
            </div>

            <!-- Image Editing Tip -->
            <div class="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <UIcon
                    name="i-lucide-image"
                    class="size-5 text-blue-400"
                  />
                </div>
                <div>
                  <h4 class="font-semibold text-white">
                    Editing Images
                  </h4>
                  <p class="text-sm text-gray-400 mt-1">
                    Click any image to select it. Then use the <span class="text-blue-300 font-medium">Settings panel</span> on the right
                    to change the image URL, or click <span class="text-blue-300 font-medium">"Browse Images"</span> to upload.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
/* Fullscreen Editor Styles */
.fullscreen-editor {
  --gjs-primary-color: #f59e0b;
  --gjs-secondary-color: #d97706;
}

/* Override GrapesJS for dark theme */
.fullscreen-editor .gjs-one-bg { background-color: #111827; }
.fullscreen-editor .gjs-two-bg { background-color: #1f2937; }
.fullscreen-editor .gjs-three-bg { background-color: #374151; }
.fullscreen-editor .gjs-four-bg { background-color: #4b5563; }
.fullscreen-editor .gjs-one-color { color: #f9fafb; }
.fullscreen-editor .gjs-two-color { color: #e5e7eb; }
.fullscreen-editor .gjs-three-color { color: #d1d5db; }
.fullscreen-editor .gjs-four-color { color: #9ca3af; }

/* Block styling */
.fullscreen-editor #blocks-container .gjs-block {
  width: calc(50% - 4px);
  min-height: 70px;
  margin: 2px;
  padding: 8px 4px;
  border-radius: 8px;
  background: #1f2937;
  border: 1px solid #374151;
  cursor: grab;
  transition: all 0.15s ease;
}

.fullscreen-editor #blocks-container .gjs-block:hover {
  background: #374151;
  border-color: #f59e0b;
  transform: translateY(-1px);
}

.fullscreen-editor #blocks-container .gjs-block:active {
  cursor: grabbing;
}

.fullscreen-editor #blocks-container .gjs-blocks-c {
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
}

/* Category headers */
.fullscreen-editor .gjs-block-category .gjs-title {
  background: #111827;
  color: #9ca3af;
  padding: 10px 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #374151;
}

/* Canvas */
.fullscreen-editor .gjs-cv-canvas {
  background: #030712;
}

.fullscreen-editor .gjs-frame-wrapper {
  background: white;
}

/* Panels */
.fullscreen-editor .gjs-pn-panel {
  background: #1f2937;
  border-color: #374151;
}

.fullscreen-editor .gjs-pn-btn {
  color: #e5e7eb;
}

.fullscreen-editor .gjs-pn-btn:hover,
.fullscreen-editor .gjs-pn-btn.gjs-pn-active {
  background: #374151;
  color: #f59e0b;
}

/* Layers */
.fullscreen-editor #layers-container .gjs-layer {
  padding: 8px 12px;
  font-size: 12px;
  color: #e5e7eb;
  border-bottom: 1px solid #374151;
}

.fullscreen-editor #layers-container .gjs-layer:hover {
  background: #374151;
}

.fullscreen-editor #layers-container .gjs-layer.gjs-selected {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* Traits */
.fullscreen-editor #traits-container .gjs-trt-trait {
  padding: 8px 12px;
  border-bottom: 1px solid #374151;
}

.fullscreen-editor #traits-container .gjs-label {
  color: #d1d5db;
  font-size: 11px;
}

/* Styles */
.fullscreen-editor #styles-container .gjs-sm-sector {
  border-bottom: 1px solid #374151;
}

.fullscreen-editor #styles-container .gjs-sm-sector .gjs-sm-title {
  background: #1f2937;
  color: #9ca3af;
  padding: 10px 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #374151;
}

.fullscreen-editor #styles-container .gjs-sm-property {
  background: #111827;
  padding: 8px 12px;
  border-bottom: 1px solid #374151;
}

.fullscreen-editor #styles-container .gjs-sm-label {
  color: #d1d5db;
  font-size: 11px;
}

.fullscreen-editor #styles-container .gjs-field {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
  border-radius: 6px;
}

.fullscreen-editor #styles-container .gjs-field:focus {
  border-color: #f59e0b;
}

/* Selected element */
.fullscreen-editor .gjs-selected {
  outline: 2px solid #f59e0b !important;
  outline-offset: 2px;
}

/* RTE Toolbar */
.fullscreen-editor .gjs-rte-toolbar {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
}

.fullscreen-editor .gjs-rte-action {
  color: #e5e7eb;
}

.fullscreen-editor .gjs-rte-action:hover,
.fullscreen-editor .gjs-rte-action.gjs-rte-active {
  background: #374151;
  color: #f59e0b;
}

/* Component Toolbar */
.fullscreen-editor .gjs-toolbar {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 8px;
}

.fullscreen-editor .gjs-toolbar-item {
  color: #e5e7eb;
}

.fullscreen-editor .gjs-toolbar-item:hover {
  background: #374151;
  color: #f59e0b;
}

/* Save as Block button icon */
.fullscreen-editor .gjs-toolbar-save-block::before {
  content: '📦';
  font-size: 14px;
  line-height: 1;
}

.fullscreen-editor .gjs-toolbar-save-block {
  padding: 4px 6px !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-editor .gjs-toolbar-save-block:hover {
  background: #374151;
  border-radius: 4px;
}

/* Modal */
.fullscreen-editor .gjs-mdl-dialog {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 12px;
}

.fullscreen-editor .gjs-mdl-header {
  background: #111827;
  color: #f9fafb;
  border-bottom: 1px solid #374151;
  border-radius: 12px 12px 0 0;
}

.fullscreen-editor .gjs-mdl-content {
  background: #1f2937;
  color: #e5e7eb;
}

/* Scrollbars */
.fullscreen-editor aside::-webkit-scrollbar,
.fullscreen-editor aside > div::-webkit-scrollbar {
  width: 6px;
}

.fullscreen-editor aside::-webkit-scrollbar-track,
.fullscreen-editor aside > div::-webkit-scrollbar-track {
  background: #111827;
}

.fullscreen-editor aside::-webkit-scrollbar-thumb,
.fullscreen-editor aside > div::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}

.fullscreen-editor aside::-webkit-scrollbar-thumb:hover,
.fullscreen-editor aside > div::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
