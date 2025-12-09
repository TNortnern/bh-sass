<script setup lang="ts">
/**
 * GrapesJS Website Builder Page
 *
 * This page provides an embedded editor experience within the dashboard.
 * For a focused editing experience, users can open the fullscreen editor.
 */
definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const router = useRouter()

const {
  state,
  initEditor,
  setDevice,
  togglePreview,
  undo,
  redo,
  saveContent,
  destroyEditor
} = useGrapesJS()

const isSaving = ref(false)
const activeBlocksTab = ref<'core' | 'hyperui'>('core')
const hyperuiLoaded = ref(false)

// Device options
const devices = [
  { id: 'desktop', icon: 'i-lucide-monitor', label: 'Desktop' },
  { id: 'tablet', icon: 'i-lucide-tablet', label: 'Tablet' },
  { id: 'mobile', icon: 'i-lucide-smartphone', label: 'Mobile' }
]

onMounted(async () => {
  try {
    await initEditor('gjs-editor')
  } catch (error: unknown) {
    console.error('Failed to initialize editor:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load website builder',
      color: 'error'
    })
  }
})

onUnmounted(() => {
  destroyEditor()
})

// Load HyperUI blocks on demand
const loadHyperUIBlocks = async () => {
  if (hyperuiLoaded.value || !state.value.editor) return

  try {
    const { loadHyperUIBlocks: loadBlocks } = await import('~/lib/grapesjs-plugins')
    loadBlocks(state.value.editor)
    hyperuiLoaded.value = true
  } catch (error: unknown) {
    console.error('Failed to load HyperUI blocks:', error)
  }
}

watch(activeBlocksTab, (tab) => {
  if (tab === 'hyperui') loadHyperUIBlocks()
})

const handleDeviceChange = (deviceId: string) => {
  setDevice(deviceId)
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await saveContent()
    toast.add({ title: 'Saved', color: 'success' })
  } catch (error: unknown) {
    console.error('Save failed:', error)
    toast.add({ title: 'Save failed', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

const exportHtml = async () => {
  const content = await saveContent()
  if (!content) return

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
    <script src="https://cdn.tailwindcss.com"><` + `/script>
  <style>${content.css}</style>
</head>
<body>${content.html}</body>
</html>`

  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'website.html'
  a.click()
  URL.revokeObjectURL(url)

  toast.add({ title: 'Exported', color: 'success' })
}

const openFullscreenEditor = () => {
  // Save current state before navigating
  saveContent()
  router.push('/app/website/editor')
}
</script>

<template>
  <div class="gjs-builder -m-4 sm:-m-6 lg:-m-8">
    <!-- Compact Toolbar -->
    <div class="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/app/website"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-5"
          />
        </NuxtLink>

        <div class="w-px h-5 bg-gray-700" />

        <!-- Undo/Redo -->
        <div class="flex items-center gap-1">
          <button
            class="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
            title="Undo"
            @click="undo"
          >
            <UIcon
              name="i-lucide-undo"
              class="size-4"
            />
          </button>
          <button
            class="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
            title="Redo"
            @click="redo"
          >
            <UIcon
              name="i-lucide-redo"
              class="size-4"
            />
          </button>
        </div>

        <div class="w-px h-5 bg-gray-700" />

        <!-- Device Switcher -->
        <div class="flex items-center gap-0.5 bg-gray-800 rounded-lg p-0.5">
          <button
            v-for="device in devices"
            :key="device.id"
            :class="[
              'p-1.5 rounded-md transition-colors',
              state.selectedDevice === device.id
                ? 'bg-amber-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
            ]"
            :title="device.label"
            @click="handleDeviceChange(device.id)"
          >
            <UIcon
              :name="device.icon"
              class="size-4"
            />
          </button>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <button
          class="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
          title="Preview"
          @click="togglePreview"
        >
          <UIcon
            name="i-lucide-eye"
            class="size-4"
          />
        </button>
        <button
          class="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
          title="Export"
          @click="exportHtml"
        >
          <UIcon
            name="i-lucide-download"
            class="size-4"
          />
        </button>

        <div class="w-px h-5 bg-gray-700" />

        <button
          :disabled="isSaving"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
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
          <span>Save</span>
        </button>

        <button
          class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-gray-900 font-medium text-sm rounded-lg transition-colors"
          @click="openFullscreenEditor"
        >
          <UIcon
            name="i-lucide-maximize-2"
            class="size-4"
          />
          <span>Fullscreen</span>
        </button>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="flex h-[calc(100vh-7rem)]">
      <!-- Left: Blocks Panel -->
      <div class="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <!-- Block Type Toggle -->
        <div class="flex border-b border-gray-800">
          <button
            :class="[
              'flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
              activeBlocksTab === 'core'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-500 hover:text-gray-300'
            ]"
            @click="activeBlocksTab = 'core'"
          >
            Blocks
          </button>
          <button
            :class="[
              'flex-1 py-2 text-xs font-semibold uppercase tracking-wide transition-colors relative',
              activeBlocksTab === 'hyperui'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-500 hover:text-gray-300'
            ]"
            @click="activeBlocksTab = 'hyperui'"
          >
            HyperUI
          </button>
        </div>

        <div
          id="blocks-container"
          class="flex-1 overflow-y-auto p-1.5"
        />
      </div>

      <!-- Center: Canvas -->
      <div class="flex-1 bg-gray-950 relative">
        <div
          v-if="!state.isReady"
          class="absolute inset-0 flex items-center justify-center bg-gray-950 z-10"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="size-8 text-amber-500 animate-spin"
          />
        </div>
        <div
          id="gjs-editor"
          class="h-full"
        />
      </div>

      <!-- Right: Properties -->
      <div class="w-64 bg-gray-900 border-l border-gray-800 flex flex-col">
        <!-- Traits -->
        <div class="border-b border-gray-800">
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-800/50">
            Settings
          </div>
          <div
            id="traits-container"
            class="max-h-32 overflow-y-auto"
          />
        </div>

        <!-- Layers -->
        <div class="border-b border-gray-800">
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-800/50">
            Layers
          </div>
          <div
            id="layers-container"
            class="max-h-40 overflow-y-auto"
          />
        </div>

        <!-- Styles -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-800/50 border-b border-gray-800">
            Styles
          </div>
          <div
            id="styles-container"
            class="flex-1 overflow-y-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gjs-builder {
  --gjs-primary-color: #f59e0b;
}

/* Dark theme overrides */
.gjs-builder .gjs-one-bg { background-color: #111827; }
.gjs-builder .gjs-two-bg { background-color: #1f2937; }
.gjs-builder .gjs-three-bg { background-color: #374151; }
.gjs-builder .gjs-one-color { color: #f9fafb; }
.gjs-builder .gjs-two-color { color: #e5e7eb; }
.gjs-builder .gjs-three-color { color: #d1d5db; }

/* Blocks */
.gjs-builder #blocks-container .gjs-block {
  width: calc(50% - 3px);
  min-height: 60px;
  margin: 1.5px;
  padding: 6px 4px;
  border-radius: 6px;
  background: #1f2937;
  border: 1px solid #374151;
  cursor: grab;
  transition: all 0.15s;
}

.gjs-builder #blocks-container .gjs-block:hover {
  background: #374151;
  border-color: #f59e0b;
}

.gjs-builder #blocks-container .gjs-blocks-c {
  display: flex;
  flex-wrap: wrap;
}

.gjs-builder .gjs-block-category .gjs-title {
  background: #111827;
  color: #9ca3af;
  padding: 8px 10px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #374151;
}

/* Canvas */
.gjs-builder .gjs-cv-canvas { background: #030712; }
.gjs-builder .gjs-frame-wrapper { background: white; }

/* Layers & Traits */
.gjs-builder #layers-container .gjs-layer,
.gjs-builder #traits-container .gjs-trt-trait {
  padding: 6px 10px;
  font-size: 11px;
  color: #e5e7eb;
  border-bottom: 1px solid #374151;
}

.gjs-builder #layers-container .gjs-layer:hover {
  background: #374151;
}

.gjs-builder #layers-container .gjs-layer.gjs-selected {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* Style Manager */
.gjs-builder #styles-container .gjs-sm-sector {
  border-bottom: 1px solid #374151;
}

.gjs-builder #styles-container .gjs-sm-sector .gjs-sm-title {
  background: #1f2937;
  color: #9ca3af;
  padding: 8px 10px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #374151;
}

.gjs-builder #styles-container .gjs-sm-property {
  background: #111827;
  padding: 6px 10px;
  border-bottom: 1px solid #374151;
}

.gjs-builder #styles-container .gjs-sm-label {
  color: #d1d5db;
  font-size: 10px;
}

.gjs-builder #styles-container .gjs-field {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
}

/* Selected element */
.gjs-builder .gjs-selected {
  outline: 2px solid #f59e0b !important;
  outline-offset: 2px;
}

/* Toolbars */
.gjs-builder .gjs-toolbar,
.gjs-builder .gjs-rte-toolbar {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 6px;
}

.gjs-builder .gjs-toolbar-item,
.gjs-builder .gjs-rte-action {
  color: #e5e7eb;
}

.gjs-builder .gjs-toolbar-item:hover,
.gjs-builder .gjs-rte-action:hover,
.gjs-builder .gjs-rte-action.gjs-rte-active {
  background: #374151;
  color: #f59e0b;
}

/* Modal */
.gjs-builder .gjs-mdl-dialog {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
}

.gjs-builder .gjs-mdl-header {
  background: #111827;
  color: #f9fafb;
  border-radius: 10px 10px 0 0;
}

.gjs-builder .gjs-mdl-content {
  background: #1f2937;
  color: #e5e7eb;
}

/* Scrollbars */
.gjs-builder aside::-webkit-scrollbar,
.gjs-builder #blocks-container::-webkit-scrollbar,
.gjs-builder #layers-container::-webkit-scrollbar,
.gjs-builder #traits-container::-webkit-scrollbar,
.gjs-builder #styles-container::-webkit-scrollbar {
  width: 5px;
}

.gjs-builder aside::-webkit-scrollbar-track,
.gjs-builder #blocks-container::-webkit-scrollbar-track,
.gjs-builder #layers-container::-webkit-scrollbar-track,
.gjs-builder #traits-container::-webkit-scrollbar-track,
.gjs-builder #styles-container::-webkit-scrollbar-track {
  background: #111827;
}

.gjs-builder aside::-webkit-scrollbar-thumb,
.gjs-builder #blocks-container::-webkit-scrollbar-thumb,
.gjs-builder #layers-container::-webkit-scrollbar-thumb,
.gjs-builder #traits-container::-webkit-scrollbar-thumb,
.gjs-builder #styles-container::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 3px;
}
</style>
