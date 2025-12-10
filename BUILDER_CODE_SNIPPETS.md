# Code Snippets for GrapesJS Template Integration

## File: `/nuxt/app/pages/app/website/builder.vue`

### Snippet 1: Add to imports (top of `<script setup>`)

```typescript
import { loadTemplate, getTemplateList } from '~/lib/templates'
import type { TemplateDefinition } from '~/lib/templates/types'
```

### Snippet 2: Add after `useSavedBlocks()` composable

```typescript
// GrapesJS templates state
const gjsTemplates = ref<TemplateDefinition[]>([])
const loadingTemplates = ref(false)
```

### Snippet 3: Add after `selectTemplate` function

```typescript
// Load GrapesJS templates
const loadGjsTemplates = async () => {
  loadingTemplates.value = true
  try {
    const templateList = getTemplateList()

    // Load each template's full definition
    const loaded = await Promise.all(
      templateList.map(async (t) => {
        const fullTemplate = await loadTemplate(t.id)
        return fullTemplate
      })
    )

    // Filter out any null results
    gjsTemplates.value = loaded.filter(Boolean) as TemplateDefinition[]

    console.log(`✅ Loaded ${gjsTemplates.value.length} GrapesJS templates`)
  } catch (error) {
    console.error('❌ Failed to load GrapesJS templates:', error)
  } finally {
    loadingTemplates.value = false
  }
}

// Apply GrapesJS template (convert to CustomHTML sections)
const applyGjsTemplate = async (templateId: string) => {
  const template = gjsTemplates.value.find(t => t.id === templateId)
  if (!template || !template.pages || template.pages.length === 0) return

  // Get the home page (first page)
  const homePage = template.pages[0]

  // Convert each section to CustomHTML
  const newSections: WebsiteSection[] = homePage.sections.map((section, idx) => ({
    id: `customhtml-${Date.now()}-${idx}`,
    type: 'CustomHTML',
    data: {
      html: section.html || '',
      css: section.css || template.globalCss || '',
      label: section.name || `${template.name} - Section ${idx + 1}`,
    }
  }))

  // Update current page sections
  const page = pages.value.find(p => p.id === currentPageId.value)
  if (page) {
    page.sections = newSections
  }
  history.value = [JSON.stringify(newSections)]
  historyIndex.value = 0
  showTemplateSelector.value = false
}
```

### Snippet 4: Add to `onMounted` hook (at the beginning)

```typescript
onMounted(() => {
  // Load GrapesJS templates
  loadGjsTemplates()

  // ... existing code ...
```

### Snippet 5: Replace template modal content (around line 615)

Find this:
```vue
<div class="template-modal">
  <div class="modal-header">
    <h2>Choose a Starting Template</h2>
    <p>Select a template to jumpstart your website or start from scratch</p>
  </div>

  <div class="template-grid">
    <button
      v-for="template in presetTemplates"
      :key="template.id"
      class="template-card"
      @click="selectTemplate(template)"
    >
      <!-- ... -->
    </button>
  </div>
</div>
```

Replace with:
```vue
<div class="template-modal">
  <div class="modal-header">
    <h2>Choose a Starting Template</h2>
    <p>Select a template to jumpstart your website or start from scratch</p>
  </div>

  <!-- Quick Start Templates -->
  <div v-if="presetTemplates.length > 0" class="template-section">
    <h3 class="section-title">Quick Start Templates</h3>
    <div class="template-grid">
      <button
        v-for="template in presetTemplates"
        :key="template.id"
        class="template-card"
        @click="selectTemplate(template)"
      >
        <div class="template-icon">
          <UIcon :name="template.icon" />
        </div>
        <h3>{{ template.name }}</h3>
        <p>{{ template.description }}</p>
        <span v-if="template.sections.length > 0" class="section-count">
          {{ template.sections.length }} sections
        </span>
      </button>
    </div>
  </div>

  <!-- Professional GrapesJS Templates -->
  <div v-if="gjsTemplates.length > 0" class="template-section gjs-section">
    <h3 class="section-title">
      <UIcon name="i-lucide-sparkles" class="section-icon-inline" />
      Professional Templates
    </h3>
    <div class="template-grid">
      <button
        v-for="template in gjsTemplates"
        :key="template.id"
        class="template-card gjs-template"
        @click="applyGjsTemplate(template.id)"
      >
        <!-- Template thumbnail -->
        <div class="template-preview" v-html="template.thumbnail"></div>
        <h3>{{ template.name }}</h3>
        <p>{{ template.description }}</p>
        <div class="template-footer">
          <span class="template-meta">
            {{ template.pages.length }} page{{ template.pages.length !== 1 ? 's' : '' }}
          </span>
          <span class="template-badge">Premium</span>
        </div>
      </button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="loadingTemplates" class="loading-state">
    <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-primary" />
    <p>Loading professional templates...</p>
  </div>
</div>
```

### Snippet 6: Add to `<style scoped>` section (at the end)

```css
/* ============================================================================
   GRAPESJS TEMPLATE INTEGRATION STYLES
   ============================================================================ */

/* Template sections */
.template-section {
  margin-bottom: 32px;
}

.template-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon-inline {
  font-size: 16px;
  color: #8b5cf6;
}

.gjs-section .section-title {
  color: #8b5cf6;
}

/* GrapesJS template cards */
.template-card.gjs-template {
  background: linear-gradient(135deg, #faf5ff 0%, #f8f9fa 100%);
  border-color: #e9d5ff;
  position: relative;
  overflow: hidden;
}

.template-card.gjs-template::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  opacity: 0.1;
  border-radius: 0 12px 0 100%;
  transition: all 0.3s ease;
}

.template-card.gjs-template:hover::before {
  opacity: 0.2;
  width: 80px;
  height: 80px;
}

.template-card.gjs-template:hover {
  background: linear-gradient(135deg, #f3e8ff 0%, #f0f1f3 100%);
  border-color: #d8b4fe;
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(139, 92, 246, 0.2);
}

.template-preview {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.template-preview svg {
  width: 100%;
  height: auto;
  display: block;
}

.template-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.template-meta {
  font-size: 11px;
  font-weight: 500;
  color: #8b5cf6;
  background: #f3e8ff;
  padding: 3px 10px;
  border-radius: 99px;
}

.template-badge {
  font-size: 10px;
  font-weight: 600;
  color: #6366f1;
  background: linear-gradient(135deg, #ddd6fe 0%, #e0e7ff 100%);
  padding: 3px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  gap: 16px;
}

.loading-state p {
  font-size: 14px;
  color: #888;
  font-weight: 500;
}

/* Dark mode support */
.dark .template-card.gjs-template {
  background: linear-gradient(135deg, #1a1625 0%, #1a1a1a 100%);
  border-color: #3730a3;
}

.dark .template-card.gjs-template:hover {
  background: linear-gradient(135deg, #231d2e 0%, #262626 100%);
  border-color: #4c1d95;
  box-shadow: 0 12px 28px rgba(139, 92, 246, 0.3);
}

.dark .section-title {
  color: #d1d5db;
}

.dark .gjs-section .section-title {
  color: #c4b5fd;
}

.dark .template-preview {
  background: #262626;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark .template-meta {
  color: #c4b5fd;
  background: #3730a3;
}

.dark .template-badge {
  color: #e0e7ff;
  background: linear-gradient(135deg, #3730a3 0%, #4338ca 100%);
}

.dark .loading-state p {
  color: #d1d5db;
}
```

## Complete Example of Template Card Rendering

Here's how the templates will appear:

```
┌─────────────────────────────────────────┐
│  Choose a Starting Template            │
│  Select a template to jumpstart your   │
│  website or start from scratch          │
└─────────────────────────────────────────┘

Quick Start Templates
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  📄  │ │  ▭   │ │  💼  │ │  ✓   │
│Full  │ │Minimal││Service│ │Trust │
└──────┘ └──────┘ └──────┘ └──────┘

✨ Professional Templates
┌────────────┐ ┌────────────┐ ┌────────────┐
│ [Preview]  │ │ [Preview]  │ │ [Preview]  │
│  Modern    │ │  Playful   │ │  Elegant   │
│  Minimal   │ │  Party     │ │  Premium   │
│ 7 pages    │ │ 7 pages    │ │ 7 pages    │
│  Premium   │ │  Premium   │ │  Premium   │
└────────────┘ └────────────┘ └────────────┘
```

## Verification Checklist

After implementing, verify:

- [ ] Templates load on component mount
- [ ] 5 GrapesJS templates appear in modal
- [ ] Template cards show thumbnails, names, descriptions
- [ ] Clicking a template applies it to the canvas
- [ ] Sections appear as CustomHTML components
- [ ] Each section is editable via properties panel
- [ ] Undo/redo works after applying template
- [ ] Loading state shows while templates load
- [ ] Console shows success message: "✅ Loaded 5 GrapesJS templates"
- [ ] No errors in browser console
