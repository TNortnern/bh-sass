# GrapesJS Template Integration for Custom Builder

## Overview

This document describes how to integrate the 5 GrapesJS templates (starter, bounce, luxe, energy, trust) into the custom website builder at `/nuxt/app/pages/app/website/builder.vue`.

## Implementation Steps

### 1. Add Template System Imports

At the top of `builder.vue`, add these imports:

```typescript
import { loadTemplate, getTemplateList } from '~/lib/templates'
import type { TemplateDefinition } from '~/lib/templates/types'
```

### 2. Add Template State Variables

After the saved blocks composable, add:

```typescript
// GrapesJS templates state
const gjsTemplates = ref<TemplateDefinition[]>([])
const loadingTemplates = ref(false)
```

### 3. Add Template Loading Logic

Add this function to load all GrapesJS templates on component mount:

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

    console.log(`Loaded ${gjsTemplates.value.length} GrapesJS templates`)
  } catch (error) {
    console.error('Failed to load GrapesJS templates:', error)
  } finally {
    loadingTemplates.value = false
  }
}
```

### 4. Add Template Application Function

This function converts a GrapesJS template's HTML sections into CustomHTML components:

```typescript
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

### 5. Update onMounted Hook

In the existing `onMounted` hook, add the template loading call:

```typescript
onMounted(() => {
  // Load GrapesJS templates
  loadGjsTemplates()

  // ... existing keyboard shortcut code ...
  const handleKeydown = (e: KeyboardEvent) => {
    // existing code
  }
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closePagesPanelOnClickOutside)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('click', closePagesPanelOnClickOutside)
  })
})
```

### 6. Update Template Selector Modal UI

Find the template selector modal section (around line 614) and add a new section for GrapesJS templates after the existing presetTemplates:

```vue
<template>
  <div class="builder-layout">
    <!-- Template Selector Modal -->
    <div v-if="showTemplateSelector" class="template-overlay">
      <div class="template-modal">
        <div class="modal-header">
          <h2>Choose a Starting Template</h2>
          <p>Select a template to jumpstart your website or start from scratch</p>
        </div>

        <!-- Existing Preset Templates Section -->
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

        <!-- NEW: GrapesJS Professional Templates Section -->
        <div v-if="gjsTemplates.length > 0" class="template-section gjs-section">
          <h3 class="section-title">
            <UIcon name="i-lucide-sparkles" class="mr-2" />
            Professional Templates
          </h3>
          <div class="template-grid">
            <button
              v-for="template in gjsTemplates"
              :key="template.id"
              class="template-card gjs-template"
              @click="applyGjsTemplate(template.id)"
            >
              <!-- Template thumbnail SVG -->
              <div class="template-preview" v-html="template.thumbnail"></div>
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
              <span class="template-meta">
                {{ template.pages.length }} page{{ template.pages.length !== 1 ? 's' : '' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingTemplates" class="loading-state">
          <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl" />
          <p>Loading professional templates...</p>
        </div>
      </div>
    </div>

    <!-- ... rest of template ... -->
  </div>
</template>
```

### 7. Add CSS Styles for GrapesJS Templates

Add these styles to the `<style scoped>` section:

```css
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
}

.gjs-section .section-title {
  color: #8b5cf6;
}

/* GrapesJS template cards */
.template-card.gjs-template {
  background: linear-gradient(135deg, #faf5ff 0%, #f3f4f6 100%);
  border-color: #e9d5ff;
}

.template-card.gjs-template:hover {
  background: linear-gradient(135deg, #f3e8ff 0%, #e5e7eb 100%);
  border-color: #d8b4fe;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15);
}

.template-preview {
  width: 100%;
  margin-bottom: 12px;
}

.template-preview svg {
  width: 100%;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
}

.template-meta {
  font-size: 11px;
  font-weight: 500;
  color: #8b5cf6;
  background: #f3e8ff;
  padding: 2px 8px;
  border-radius: 99px;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
}

.loading-state p {
  font-size: 14px;
  color: #888;
}
```

## How It Works

1. **Template Loading**: When the component mounts, `loadGjsTemplates()` fetches all 5 professional templates (starter, bounce, luxe, energy, trust) from the template system.

2. **Template Structure**: Each GrapesJS template has:
   - Multiple pages (home, inventory, about, contact, etc.)
   - Each page has sections with HTML and optional CSS
   - Global CSS that applies to all pages
   - Theme configuration

3. **Template Conversion**: When a user selects a GrapesJS template:
   - The function takes the home page (first page) from the template
   - Converts each HTML section into a `CustomHTML` component
   - Each section's HTML and CSS are preserved
   - The sections are applied to the current page

4. **Template Display**: In the template selector modal:
   - Quick Start templates (existing presets) appear first
   - Professional Templates (GrapesJS) appear in a separate section
   - Each template shows a visual thumbnail, name, description, and page count

## Template Details

### Available GrapesJS Templates

1. **Modern Minimal (Starter)**
   - Clean Swiss design with confident neutrals
   - Perfect for first-time users
   - 7 pages total

2. **Playful Party (Bounce)**
   - Vibrant and fun design for kids parties
   - High-energy colors and playful elements
   - 7 pages total

3. **Elegant Premium (Luxe)**
   - Sophisticated design for high-end events
   - Refined typography and elegant spacing
   - 7 pages total

4. **Bold Vibrant (Energy)**
   - High-energy dark theme for sports events
   - Bold colors and dynamic layouts
   - 7 pages total

5. **Clean Professional (Trust)**
   - Professional design for corporate clients
   - Trust-building elements and clean layouts
   - 7 pages total

## User Experience

When a user clicks on a GrapesJS template:

1. All sections from the template's home page are loaded
2. Each section becomes an editable CustomHTML component
3. The user can:
   - Edit the HTML/CSS of each section
   - Rearrange sections via drag-and-drop
   - Add new sections from the sidebar
   - Delete or duplicate sections
   - Save sections as reusable blocks

## Future Enhancements

1. **Multi-Page Support**: Allow users to import all pages from a template, not just the home page
2. **Template Previews**: Show live previews of templates before applying
3. **Partial Template Import**: Let users select specific sections to import
4. **Template Customization**: Apply theme colors before importing
5. **Smart Block Integration**: Recognize and preserve smart blocks when importing

## Testing

To test the integration:

1. Navigate to `/app/website/builder`
2. You should see a template selector modal on load
3. Scroll down to see "Professional Templates" section
4. Click on any template (e.g., "Modern Minimal")
5. Verify that the template sections are loaded as CustomHTML components
6. Edit a section to ensure CustomHTML editing works
7. Check that undo/redo works correctly

## Troubleshooting

**Templates not loading?**
- Check browser console for errors
- Verify template files exist in `/nuxt/app/lib/templates/`
- Ensure `loadTemplate` and `getTemplateList` are exported correctly

**Sections look broken?**
- Verify global CSS is being applied
- Check that Tailwind CSS classes are available
- Ensure font imports are working

**Can't edit sections?**
- Verify CustomHTML component is properly registered
- Check that section data structure matches expected format
- Review SectionPropertiesPanel for CustomHTML support
