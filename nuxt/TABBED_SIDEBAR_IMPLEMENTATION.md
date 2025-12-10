# Tabbed Sidebar Implementation for Website Builder

## Overview
Convert the sidebar in `/nuxt/app/pages/app/website/builder.vue` to a tabbed interface with three tabs:
1. **Sections** - Current section library
2. **HyperUI Blocks** - Inline HyperUI block browser
3. **Templates** - Preset template selector

## Implementation Steps

### 1. Add Tab State and HyperUI Logic (in `<script setup>`)

Add after line 217 (after `const showHyperUIBrowser = ref(false)`):

```typescript
// Sidebar tabs
type SidebarTab = 'sections' | 'blocks' | 'templates'
const activeTab = ref<SidebarTab>('sections')

// HyperUI inline state
import { getHyperUIStructure } from '~/data/hyperui-blocks'
const hyperuiCategories = computed(() => getHyperUIStructure())
const selectedHyperUICategory = ref<string>('marketing')
const selectedHyperUIType = ref<string>('')

// Get current HyperUI category
const currentHyperUICategory = computed(() =>
  hyperuiCategories.value.find(c => c.key === selectedHyperUICategory.value)
)

// Get blocks for current HyperUI type
const currentHyperUIBlocks = computed(() => {
  if (!currentHyperUICategory.value || !selectedHyperUIType.value) return []
  const type = currentHyperUICategory.value.types.find(t => t.key === selectedHyperUIType.value)
  return type?.blocks || []
})

// Initialize first HyperUI type when category changes
watch(currentHyperUICategory, (cat) => {
  if (cat && cat.types.length > 0) {
    selectedHyperUIType.value = cat.types[0].key
  }
}, { immediate: true })

// Select HyperUI category
const selectHyperUICategory = (categoryKey: string) => {
  selectedHyperUICategory.value = categoryKey
  const cat = hyperuiCategories.value.find(c => c.key === categoryKey)
  if (cat && cat.types.length > 0) {
    selectedHyperUIType.value = cat.types[0].key
  }
}

// Add HyperUI block inline (from sidebar tab)
const addHyperUIBlockInline = (block: HyperUIBlock, index: number) => {
  const newSection: WebsiteSection = {
    id: `customhtml-${Date.now()}`,
    type: 'CustomHTML',
    data: {
      html: block.html,
      css: '',
      label: `${block.name} (HyperUI)`,
    },
  }
  sections.value.splice(index, 0, newSection)
  saveToHistory()
  selectedSectionId.value = newSection.id
}

// Helper to get HyperUI icon class
const getHyperUIIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    'megaphone': 'i-lucide-megaphone',
    'layout': 'i-lucide-layout',
    'menu': 'i-lucide-menu',
  }
  return icons[iconName] || 'i-lucide-square'
}
```

### 2. Replace Sidebar Header and Add Tabs (Template Section)

Replace the sidebar-header section (lines 692-696) with:

```vue
<div class="sidebar-header">
  <h2>Builder Components</h2>
  <p class="sidebar-hint">Drag elements to canvas</p>
</div>

<!-- Tabs -->
<div class="sidebar-tabs">
  <button
    class="tab-btn"
    :class="{ active: activeTab === 'sections' }"
    @click="activeTab = 'sections'"
  >
    <UIcon name="i-lucide-layout-grid" />
    <span>Sections</span>
  </button>
  <button
    class="tab-btn"
    :class="{ active: activeTab === 'blocks' }"
    @click="activeTab = 'blocks'"
  >
    <UIcon name="i-lucide-blocks" />
    <span>HyperUI</span>
  </button>
  <button
    class="tab-btn"
    :class="{ active: activeTab === 'templates' }"
    @click="activeTab = 'templates'"
  >
    <UIcon name="i-lucide-file-code" />
    <span>Templates</span>
  </button>
</div>
```

### 3. Replace Sidebar Content with Tabbed Content

Replace the content between the tabs and sidebar-footer (lines 698-763) with:

```vue
<!-- Sections Tab (existing content) -->
<div v-show="activeTab === 'sections'" class="tab-content">
  <!-- Search Bar -->
  <div class="search-bar">
    <UIcon name="i-lucide-search" class="search-icon" />
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search sections..."
      class="search-input"
    />
    <button
      v-if="searchQuery"
      class="clear-search"
      @click="searchQuery = ''"
    >
      <UIcon name="i-lucide-x" />
    </button>
  </div>

  <div class="section-categories">
    <!-- Saved Blocks Section -->
    <div v-if="savedBlocks.length > 0" class="category-group saved-blocks">
      <h3 class="category-title">
        <UIcon name="i-lucide-bookmark" class="mr-1" />
        My Saved Blocks
      </h3>
      <div class="section-items">
        <div
          v-for="block in savedBlocks"
          :key="block.id"
          class="section-item saved-block-item"
          draggable="true"
          @dragstart="onSidebarDragStart($event, `saved:${block.id}`)"
          @dragend="onSidebarDragEnd"
        >
          <UIcon name="i-lucide-bookmark" class="section-icon saved" />
          <span>{{ block.name }}</span>
          <button
            class="delete-saved-btn"
            title="Delete saved block"
            @click.stop="deleteBlock(block.id)"
          >
            <UIcon name="i-lucide-x" />
          </button>
        </div>
      </div>
    </div>

    <div v-for="category in filteredSectionTypes" :key="category.category" class="category-group">
      <h3 class="category-title">{{ category.category }}</h3>
      <div class="section-items">
        <div
          v-for="item in category.items"
          :key="item.type"
          class="section-item"
          draggable="true"
          @dragstart="onSidebarDragStart($event, item.type)"
          @dragend="onSidebarDragEnd"
        >
          <UIcon :name="getIcon(item.icon)" class="section-icon" />
          <span>{{ item.label }}</span>
          <UIcon name="i-lucide-grip-vertical" class="drag-handle" />
        </div>
      </div>
    </div>
  </div>
</div>

<!-- HyperUI Blocks Tab -->
<div v-show="activeTab === 'blocks'" class="tab-content hyperui-tab">
  <div class="hyperui-categories">
    <button
      v-for="cat in hyperuiCategories"
      :key="cat.key"
      :class="['hyperui-category-btn', { active: selectedHyperUICategory === cat.key }]"
      @click="selectHyperUICategory(cat.key)"
    >
      <UIcon :name="getHyperUIIcon(cat.icon)" />
      <span>{{ cat.label }}</span>
      <span class="count">{{ cat.types.reduce((sum, t) => sum + t.blocks.length, 0) }}</span>
    </button>
  </div>

  <div class="hyperui-types">
    <div
      v-for="type in currentHyperUICategory?.types"
      :key="type.key"
      :class="['hyperui-type-item', { active: selectedHyperUIType === type.key }]"
      @click="selectedHyperUIType = type.key"
    >
      <UIcon :name="getHyperUIIcon(type.icon)" class="type-icon" />
      <span class="type-label">{{ type.label }}</span>
      <span class="type-count">{{ type.blocks.length }}</span>
    </div>
  </div>

  <div class="hyperui-blocks">
    <h4 class="blocks-title">
      {{ currentHyperUICategory?.types.find(t => t.key === selectedHyperUIType)?.label || 'Blocks' }}
    </h4>
    <div class="hyperui-blocks-grid">
      <div
        v-for="block in currentHyperUIBlocks"
        :key="block.id"
        class="hyperui-block-card"
        @click="openAddSectionMenu(0); addHyperUIBlock(block)"
      >
        <div class="hyperui-block-preview" v-html="block.html.slice(0, 300)" />
        <div class="hyperui-block-info">
          <span class="hyperui-block-name">{{ block.name }}</span>
          <UIcon name="i-lucide-plus" class="add-icon" />
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Templates Tab -->
<div v-show="activeTab === 'templates'" class="tab-content templates-tab">
  <div class="templates-grid">
    <button
      v-for="template in presetTemplates"
      :key="template.id"
      class="template-card-small"
      @click="selectTemplate(template)"
    >
      <div class="template-icon-small">
        <UIcon :name="template.icon" />
      </div>
      <div class="template-info">
        <h4>{{ template.name }}</h4>
        <p>{{ template.description }}</p>
        <span v-if="template.sections.length > 0" class="section-count">
          {{ template.sections.length }} sections
        </span>
      </div>
    </button>
  </div>
</div>
```

### 4. Update Sidebar Footer

Keep the footer as is, but you can optionally simplify it since HyperUI is now in a tab:

```vue
<div class="sidebar-footer">
  <button class="change-template-btn" @click="showTemplateSelector = true">
    <UIcon name="i-lucide-layout-template" />
    Change Template
  </button>
</div>
```

### 5. Add CSS for Tabs and New Content

Add to the `<style scoped>` section:

```css
/* Sidebar Tabs */
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  background: #fafafa;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.tab-btn:hover {
  color: #333;
  background: #f0f0f0;
}

.tab-btn.active {
  color: #f59e0b;
  border-bottom-color: #f59e0b;
  background: white;
}

.tab-btn span {
  display: block;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* HyperUI Tab Styles */
.hyperui-tab {
  padding: 0;
}

.hyperui-categories {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.hyperui-category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.hyperui-category-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.hyperui-category-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: #6366f1;
  color: white;
}

.hyperui-category-btn .count {
  margin-left: auto;
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.hyperui-category-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.hyperui-types {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  max-height: 200px;
  overflow-y: auto;
}

.hyperui-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.hyperui-type-item:hover {
  background: #f5f5f5;
}

.hyperui-type-item.active {
  background: #fef3c7;
}

.type-icon {
  color: #888;
}

.hyperui-type-item.active .type-icon {
  color: #f59e0b;
}

.type-label {
  flex: 1;
  font-size: 13px;
  color: #333;
}

.type-count {
  font-size: 11px;
  color: #888;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

.hyperui-blocks {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.blocks-title {
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.hyperui-blocks-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hyperui-block-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.hyperui-block-card:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
}

.hyperui-block-preview {
  height: 80px;
  overflow: hidden;
  background: #fafafa;
  transform: scale(0.25);
  transform-origin: top left;
  width: 400%;
  height: 320px;
  pointer-events: none;
}

.hyperui-block-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-top: 1px solid #e0e0e0;
}

.hyperui-block-name {
  font-size: 11px;
  font-weight: 500;
  color: #333;
}

.add-icon {
  font-size: 14px;
  color: #6366f1;
}

/* Templates Tab Styles */
.templates-tab {
  padding: 12px;
}

.templates-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.template-card-small {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.template-card-small:hover {
  background: #f8f8f8;
  border-color: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-icon-small {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  border-radius: 8px;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-info h4 {
  font-size: 13px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.template-info p {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.template-info .section-count {
  font-size: 10px;
  font-weight: 500;
  color: #888;
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 99px;
  align-self: flex-start;
  margin-top: 4px;
}
```

## Result

The sidebar will now have three tabs:
1. **Sections** - The existing section library (unchanged functionality)
2. **HyperUI** - Browse and add HyperUI blocks directly from the sidebar
3. **Templates** - Quick access to preset templates without the modal

Users can switch between tabs to access different types of content, making the interface more organized and efficient.
