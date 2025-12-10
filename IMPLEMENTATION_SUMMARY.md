# GrapesJS Template Integration - Implementation Summary

## Overview

This document provides a complete implementation guide for integrating the 5 GrapesJS professional templates (starter, bounce, luxe, energy, trust) into the custom website builder.

## What We're Adding

**Feature**: Import and apply professional GrapesJS templates in the custom builder

**How it works**:
1. Templates are loaded on component mount from `/nuxt/app/lib/templates/`
2. User selects a template from the template selector modal
3. Template's HTML sections are converted to CustomHTML components
4. Sections are added to the current page and become editable

## Files Modified

### 1. `/nuxt/app/pages/app/website/builder.vue`

**Total changes**:
- 3 new imports
- 2 new reactive variables
- 2 new functions (~40 lines)
- Updated template modal UI (~50 lines)
- New CSS styles (~150 lines)

**Estimated time**: 15-20 minutes to implement and test

## Step-by-Step Implementation

### Step 1: Add Imports (Line 2-4)

**Location**: Top of `<script setup>`, after existing imports

**Add**:
```typescript
import { loadTemplate, getTemplateList } from '~/lib/templates'
import type { TemplateDefinition } from '~/lib/templates/types'
```

**Result**: Template system utilities are available

---

### Step 2: Add State Variables (Line ~10-11)

**Location**: After `const { savedBlocks, saveBlock, deleteBlock } = useSavedBlocks()`

**Add**:
```typescript
// GrapesJS templates state
const gjsTemplates = ref<TemplateDefinition[]>([])
const loadingTemplates = ref(false)
```

**Result**: Template data and loading state are tracked

---

### Step 3: Add Template Functions (Line ~370)

**Location**: After the `selectTemplate` function, before `getComponent`

**Add**:
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

**Result**: Templates can be loaded and applied

---

### Step 4: Call Template Loader (Line ~410)

**Location**: Inside `onMounted` hook, at the very beginning

**Add** (as first line in onMounted):
```typescript
// Load GrapesJS templates
loadGjsTemplates()
```

**Result**: Templates load when component mounts

---

### Step 5: Update Template Modal UI (Line ~615-640)

**Location**: Find the template modal section

**Find this structure**:
```vue
<div class="template-modal">
  <div class="modal-header">
    <h2>Choose a Starting Template</h2>
    <p>Select a template to jumpstart your website or start from scratch</p>
  </div>

  <div class="template-grid">
    <button v-for="template in presetTemplates" ...>
      <!-- cards -->
    </button>
  </div>
</div>
```

**Replace with**:
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

**Result**: Template selector shows both quick start and professional templates

---

### Step 6: Add Styles (End of `<style scoped>`)

**Location**: At the very end of the `<style scoped>` section

**Add**: (See BUILDER_CODE_SNIPPETS.md Snippet 6 for full CSS)

Key styles added:
- `.template-section` - Section containers
- `.section-title` - Section headers with icons
- `.gjs-template` - Professional template cards with gradient backgrounds
- `.template-preview` - SVG thumbnail display
- `.template-footer` - Card footer with metadata
- `.loading-state` - Loading spinner display
- Dark mode variants

**Result**: Templates display beautifully with proper styling

---

## Expected Behavior

### On Component Mount
1. Template selector modal appears
2. "Loading professional templates..." message shows briefly
3. 5 professional templates load and display
4. Console logs: "✅ Loaded 5 GrapesJS templates"

### Template Selector Modal

**Section 1: Quick Start Templates (4 cards)**
- Complete Website
- Minimal Landing
- Service Focused
- Trust Builder

**Section 2: Professional Templates (5 cards)**
- Modern Minimal (Starter) - 7 pages
- Playful Party (Bounce) - 7 pages
- Elegant Premium (Luxe) - 7 pages
- Bold Vibrant (Energy) - 7 pages
- Clean Professional (Trust) - 7 pages

Each professional template card shows:
- Visual thumbnail preview (SVG)
- Template name
- Description
- Page count
- "Premium" badge

### When User Clicks a Template

**Quick Start Template**:
- Applies predefined sections
- Uses existing component types

**Professional Template**:
1. Extracts home page sections
2. Converts each section to CustomHTML type
3. Preserves HTML and CSS
4. Adds to canvas
5. Modal closes
6. Sections are immediately editable

### In the Builder

After applying a GrapesJS template:
- Multiple CustomHTML sections appear on canvas
- Each section shows the template HTML
- User can select any section
- Properties panel shows HTML/CSS editors
- User can modify, rearrange, duplicate, or delete sections
- Undo/redo works as expected

## Testing Checklist

- [ ] Navigate to `/app/website/builder`
- [ ] Template selector modal appears
- [ ] "Quick Start Templates" section visible with 4 options
- [ ] "Professional Templates" section appears after loading
- [ ] 5 professional templates display with thumbnails
- [ ] Click "Modern Minimal" template
- [ ] Multiple CustomHTML sections appear on canvas
- [ ] Click on a section to select it
- [ ] Properties panel shows HTML/CSS editors
- [ ] Edit HTML and see changes
- [ ] Undo/redo works
- [ ] No console errors
- [ ] Try other templates (Bounce, Luxe, Energy, Trust)
- [ ] All templates load and apply correctly

## Troubleshooting

### Templates Not Loading

**Symptom**: Professional Templates section doesn't appear

**Fixes**:
1. Check browser console for errors
2. Verify template files exist:
   - `/nuxt/app/lib/templates/index.ts`
   - `/nuxt/app/lib/templates/starter/index.ts`
   - `/nuxt/app/lib/templates/bounce/index.ts`
   - etc.
3. Check Network tab for failed imports
4. Verify `loadTemplate` and `getTemplateList` exports

### Sections Look Broken

**Symptom**: Sections display but styling is wrong

**Fixes**:
1. Check that Tailwind CSS is loaded
2. Verify global CSS from template is applied
3. Check CustomHTML component CSS rendering
4. Inspect element to see if styles are present

### Can't Edit Sections

**Symptom**: Clicking section doesn't show properties

**Fixes**:
1. Verify CustomHTML is in `componentMap`
2. Check SectionPropertiesPanel supports CustomHTML
3. Ensure `selectedSectionId` is being set
4. Check section data structure matches expected format

## Performance Notes

**Template Loading**:
- 5 templates load asynchronously on mount
- Takes ~100-300ms depending on connection
- Uses `Promise.all` for parallel loading
- Templates are cached in memory after loading

**Memory Usage**:
- Each template: ~50-100KB
- Total: ~250-500KB for all 5 templates
- Minimal impact on performance

## Future Enhancements

1. **Template Search**: Add search/filter for templates
2. **Category Tags**: Group by use case (events, corporate, etc.)
3. **Live Previews**: Show interactive previews before applying
4. **Multi-Page Import**: Import all template pages, not just home
5. **Selective Import**: Choose specific sections to import
6. **Theme Customization**: Apply color themes before importing
7. **Template Favorites**: Let users save favorite templates
8. **Custom Templates**: Allow users to save their own as templates

## Support

If you encounter issues:
1. Check browser console for errors
2. Review this documentation
3. Check template file structure
4. Verify all imports are correct
5. Test with one template first, then add others

## Summary

This implementation adds professional template support to the custom builder by:

1. **Loading** 5 GrapesJS templates on component mount
2. **Displaying** them in a dedicated section of the template selector
3. **Converting** template HTML sections to CustomHTML components
4. **Applying** them to the canvas for editing

The user experience is seamless - they select a template and immediately start editing professional-quality sections in the custom builder interface.

**Total Code Added**: ~200 lines
**Total Code Modified**: ~50 lines
**New Files**: 0 (uses existing template system)
**Breaking Changes**: None
**Backward Compatible**: Yes
