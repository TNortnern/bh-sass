<script setup lang="ts">
import { getHyperUIStructure, type HyperUIBlock } from '~/data/hyperui-blocks'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'select': [block: HyperUIBlock]
}>()

// State
const selectedCategory = ref<string>('marketing')
const selectedType = ref<string>('')
const searchQuery = ref('')
const previewBlock = ref<HyperUIBlock | null>(null)
const showPreviewModal = ref(false)

// Get organized structure
const categories = computed(() => getHyperUIStructure())

// Get current category
const currentCategory = computed(() =>
  categories.value.find(c => c.key === selectedCategory.value)
)

// Get blocks for current type
const currentBlocks = computed(() => {
  if (!currentCategory.value || !selectedType.value) return []
  const type = currentCategory.value.types.find(t => t.key === selectedType.value)
  return type?.blocks || []
})

// Filtered blocks based on search
const filteredBlocks = computed(() => {
  if (!searchQuery.value.trim()) return currentBlocks.value

  const query = searchQuery.value.toLowerCase()
  return currentBlocks.value.filter((block) => {
    const blockWithType = block as HyperUIBlock & { type?: string }
    return block.name.toLowerCase().includes(query)
      || blockWithType.type?.toLowerCase().includes(query)
  })
})

// All blocks for global search
const allBlocks = computed(() => {
  const blocks: HyperUIBlock[] = []
  for (const cat of categories.value) {
    for (const type of cat.types) {
      blocks.push(...type.blocks)
    }
  }
  return blocks
})

// Global search results
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return allBlocks.value.filter((block) => {
    const blockWithMeta = block as HyperUIBlock & { type?: string, category?: string }
    return block.name.toLowerCase().includes(query)
      || blockWithMeta.type?.toLowerCase().includes(query)
      || blockWithMeta.category?.toLowerCase().includes(query)
  }).slice(0, 20) // Limit results
})

// Select category
const selectCategory = (categoryKey: string) => {
  selectedCategory.value = categoryKey
  const cat = categories.value.find(c => c.key === categoryKey)
  if (cat && cat.types && cat.types.length > 0) {
    selectedType.value = cat.types[0]?.key || ''
  }
}

// Preview a block
const openPreview = (block: HyperUIBlock) => {
  previewBlock.value = block
  showPreviewModal.value = true
}

// Select and close
const selectBlock = (block: HyperUIBlock) => {
  emit('select', block)
  emit('update:open', false)
}

// Close modal
const close = () => {
  emit('update:open', false)
}

// Get props ref
const _props = props

// Initialize first type when category loads
watch(currentCategory, (cat) => {
  if (cat && cat.types && cat.types.length > 0 && !selectedType.value) {
    selectedType.value = cat.types[0]?.key || ''
  }
}, { immediate: true })

// Clear search on close
watch(() => _props.open, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = ''
  }
})
</script>

<template>
  <UModal
    v-model:open="_props.open"
    class="max-w-6xl"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div class="hyperui-browser">
        <!-- Header -->
        <div class="browser-header">
          <div class="header-left">
            <UIcon
              name="i-lucide-blocks"
              class="text-primary text-xl"
            />
            <div>
              <h2 class="text-lg font-bold">
                HyperUI Block Library
              </h2>
              <p class="text-sm text-muted">
                300+ pre-built Tailwind CSS components
              </p>
            </div>
          </div>
          <div class="header-right">
            <UInput
              v-model="searchQuery"
              icon="i-lucide-search"
              placeholder="Search all blocks..."
              class="w-64"
            />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              @click="close"
            />
          </div>
        </div>

        <!-- Search Results -->
        <div
          v-if="searchQuery.trim() && searchResults.length > 0"
          class="search-results"
        >
          <div class="results-header">
            <span class="text-sm text-muted">{{ searchResults.length }} results for "{{ searchQuery }}"</span>
            <UButton
              label="Clear"
              size="xs"
              variant="ghost"
              @click="searchQuery = ''"
            />
          </div>
          <div class="results-grid">
            <div
              v-for="block in searchResults"
              :key="block.id"
              class="block-card"
              @click="selectBlock(block)"
            >
              <div
                class="block-preview"
                v-html="block.html.slice(0, 500)"
              />
              <div class="block-info">
                <span class="block-name">{{ block.name }}</span>
                <UBadge
                  v-if="(block as any).type"
                  :label="(block as any).type"
                  size="xs"
                  color="neutral"
                  variant="subtle"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Main Browser -->
        <div
          v-else
          class="browser-content"
        >
          <!-- Category Tabs -->
          <div class="category-tabs">
            <button
              v-for="cat in categories"
              :key="cat.key"
              :class="['category-tab', { active: selectedCategory === cat.key }]"
              @click="selectCategory(cat.key)"
            >
              <UIcon :name="cat.icon" />
              <span>{{ cat.label }}</span>
              <span class="count">{{ cat.types.reduce((sum: number, t) => sum + t.blocks.length, 0) }}</span>
            </button>
          </div>

          <div class="browser-body">
            <!-- Type Sidebar -->
            <div class="type-sidebar">
              <div
                v-for="type in currentCategory?.types"
                :key="type.key"
                :class="['type-item', { active: selectedType === type.key }]"
                @click="selectedType = type.key"
              >
                <UIcon
                  v-if="(type as any).icon"
                  :name="(type as any).icon"
                  class="type-icon"
                />
                <span class="type-label">{{ type.label }}</span>
                <span class="type-count">{{ type.blocks.length }}</span>
              </div>
            </div>

            <!-- Blocks Grid -->
            <div class="blocks-area">
              <div class="blocks-header">
                <h3 class="text-lg font-semibold">
                  {{ currentCategory?.types.find((t) => t.key === selectedType)?.label || 'Blocks' }}
                </h3>
                <span class="text-sm text-muted">{{ filteredBlocks.length }} variants</span>
              </div>

              <div class="blocks-grid">
                <div
                  v-for="block in filteredBlocks"
                  :key="block.id"
                  class="block-card"
                >
                  <div class="block-preview-container">
                    <div
                      class="block-preview"
                      v-html="block.html"
                    />
                    <div class="block-overlay">
                      <UButton
                        icon="i-lucide-eye"
                        label="Preview"
                        size="sm"
                        variant="soft"
                        @click="openPreview(block)"
                      />
                      <UButton
                        icon="i-lucide-plus"
                        label="Add to Page"
                        size="sm"
                        @click="selectBlock(block)"
                      />
                    </div>
                  </div>
                  <div class="block-info">
                    <span class="block-name">{{ block.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Modal -->
        <UModal
          v-model:open="showPreviewModal"
          class="max-w-5xl"
        >
          <template #content>
            <div class="preview-modal">
              <div class="preview-header">
                <h3 class="font-semibold">
                  {{ previewBlock?.name }}
                </h3>
                <div class="flex gap-2">
                  <UButton
                    icon="i-lucide-plus"
                    label="Add to Page"
                    @click="previewBlock && selectBlock(previewBlock); showPreviewModal = false"
                  />
                  <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    @click="showPreviewModal = false"
                  />
                </div>
              </div>
              <div class="preview-content">
                <div
                  v-if="previewBlock"
                  v-html="previewBlock.html"
                />
              </div>
            </div>
          </template>
        </UModal>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.hyperui-browser {
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-height: 800px;
}

.browser-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ui-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-tabs {
  display: flex;
  gap: 4px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-elevated);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ui-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.category-tab:hover {
  background: var(--ui-bg-accented);
  color: var(--ui-text);
}

.category-tab.active {
  background: var(--ui-primary);
  color: white;
}

.category-tab .count {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
}

.category-tab:not(.active) .count {
  background: var(--ui-bg-accented);
}

.browser-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.browser-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.type-sidebar {
  width: 200px;
  border-right: 1px solid var(--ui-border);
  overflow-y: auto;
  padding: 12px 8px;
  background: var(--ui-bg);
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.type-item:hover {
  background: var(--ui-bg-elevated);
}

.type-item.active {
  background: var(--ui-bg-accented);
}

.type-icon {
  color: var(--ui-text-muted);
}

.type-item.active .type-icon {
  color: var(--ui-primary);
}

.type-label {
  flex: 1;
  font-size: 13px;
  color: var(--ui-text);
}

.type-count {
  font-size: 11px;
  color: var(--ui-text-muted);
  background: var(--ui-bg-elevated);
  padding: 2px 6px;
  border-radius: 10px;
}

.blocks-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.blocks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.block-card {
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--ui-bg);
  transition: all 0.2s;
}

.block-card:hover {
  border-color: var(--ui-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.block-preview-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: white;
}

.block-preview {
  transform: scale(0.4);
  transform-origin: top left;
  width: 250%;
  height: 250%;
  pointer-events: none;
}

.block-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.2s;
}

.block-card:hover .block-overlay {
  opacity: 1;
}

.block-info {
  padding: 12px;
  border-top: 1px solid var(--ui-border);
}

.block-name {
  font-size: 13px;
  font-weight: 500;
}

/* Search Results */
.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.search-results .block-card {
  cursor: pointer;
}

.search-results .block-preview {
  height: 120px;
  transform: scale(0.3);
}

/* Preview Modal */
.preview-modal {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ui-border);
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
}
</style>
