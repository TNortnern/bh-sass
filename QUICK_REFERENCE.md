# GrapesJS Template Integration - Quick Reference

## 🎯 Goal

Import 5 professional GrapesJS templates into the custom website builder.

## 📦 What Templates Are Available

1. **Modern Minimal (starter)** - Clean Swiss design
2. **Playful Party (bounce)** - Vibrant kids party theme
3. **Elegant Premium (luxe)** - Sophisticated high-end design
4. **Bold Vibrant (energy)** - High-energy sports theme
5. **Clean Professional (trust)** - Corporate professional design

## 🚀 Quick Implementation

### 1. Add Imports (3 lines)

```typescript
import { loadTemplate, getTemplateList } from '~/lib/templates'
import type { TemplateDefinition } from '~/lib/templates/types'
```

### 2. Add State (2 lines)

```typescript
const gjsTemplates = ref<TemplateDefinition[]>([])
const loadingTemplates = ref(false)
```

### 3. Add Functions (40 lines)

```typescript
const loadGjsTemplates = async () => { /* ... */ }
const applyGjsTemplate = async (templateId: string) => { /* ... */ }
```

### 4. Load on Mount (1 line)

```typescript
onMounted(() => {
  loadGjsTemplates() // Add this
  // ... existing code
})
```

### 5. Update Modal UI (50 lines)

Add professional templates section to template selector modal.

### 6. Add Styles (150 lines)

Add CSS for template cards, previews, and loading states.

## 📁 Files to Modify

Only 1 file needs changes:
- `/nuxt/app/pages/app/website/builder.vue`

## ⏱️ Implementation Time

**15-20 minutes** total

## 🧪 How to Test

1. Open `/app/website/builder`
2. Template selector appears
3. Scroll to "Professional Templates"
4. See 5 templates with thumbnails
5. Click "Modern Minimal"
6. Sections appear as CustomHTML components
7. Edit any section
8. Verify changes appear

## 📊 Success Metrics

✅ Templates load on mount
✅ 5 templates display in modal
✅ Thumbnails show correctly
✅ Clicking applies template
✅ Sections become CustomHTML
✅ Sections are editable
✅ No console errors
✅ Console shows: "✅ Loaded 5 GrapesJS templates"

## 🔑 Key Functions

### `loadGjsTemplates()`

**Purpose**: Load all 5 templates on component mount
**When**: Called in `onMounted()`
**Returns**: Nothing (updates `gjsTemplates` ref)
**Time**: ~250ms

### `applyGjsTemplate(templateId)`

**Purpose**: Apply selected template to canvas
**When**: User clicks template card
**Does**:
1. Get template by ID
2. Extract home page sections
3. Convert to CustomHTML
4. Apply to current page
5. Close modal

**Time**: Instant

## 🎨 UI Components

### Template Card Structure

```
┌──────────────────────────┐
│  [SVG Preview Image]     │  ← template.thumbnail
│                          │
│  Modern Minimal          │  ← template.name
│  Clean Swiss design...   │  ← template.description
│                          │
│  7 pages     [Premium]   │  ← template.pages.length + badge
└──────────────────────────┘
```

### Modal Layout

```
Choose a Starting Template
━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Start Templates
[Card] [Card] [Card] [Card]

✨ Professional Templates
[GJS] [GJS] [GJS] [GJS] [GJS]
```

## 🔧 Data Flow

```
Component Mount
    ↓
loadGjsTemplates()
    ↓
getTemplateList() → [starter, bounce, luxe, energy, trust]
    ↓
loadTemplate() × 5 (parallel)
    ↓
gjsTemplates.value = loaded templates
    ↓
UI updates → Professional Templates section appears
```

## 📝 Code Locations

| Code | Line # (approx) |
|------|----------------|
| Imports | 3-4 |
| State variables | 10-11 |
| Load function | 370-395 |
| Apply function | 397-425 |
| onMounted call | 410 |
| Modal UI | 615-680 |
| Styles | End of file |

## 💡 Key Concepts

### Template Definition

GrapesJS templates contain:
- **Pages**: Multiple pages (home, about, contact, etc.)
- **Sections**: HTML blocks per page
- **Global CSS**: Styles that apply to all pages
- **Theme**: Colors, fonts, spacing config

### CustomHTML Component

Builder's component for raw HTML/CSS:
- **html**: The HTML markup
- **css**: The CSS styles
- **label**: Display name

### Conversion Process

```
GrapesJS Section → CustomHTML Component
{                   {
  html: '...',        html: '...',
  css: '...',   →     css: '...',
  name: '...'         label: '...'
}                   }
```

## 🐛 Common Issues

### Issue: Templates not loading

**Fix**: Check browser console, verify template files exist

### Issue: Sections look broken

**Fix**: Verify Tailwind CSS is loaded, check global CSS

### Issue: Can't edit sections

**Fix**: Ensure CustomHTML component is registered, check properties panel

## 📚 Documentation Files

- `GRAPESJS_TEMPLATE_INTEGRATION.md` - Full implementation guide
- `BUILDER_CODE_SNIPPETS.md` - Copy-paste code snippets
- `IMPLEMENTATION_SUMMARY.md` - Step-by-step instructions
- `TEMPLATE_FLOW_DIAGRAM.md` - Visual diagrams
- `QUICK_REFERENCE.md` - This file (quick overview)

## 🎓 Learn More

**Template System**:
- `/nuxt/app/lib/templates/index.ts` - Template registry
- `/nuxt/app/lib/templates/types.ts` - Type definitions
- `/nuxt/app/lib/templates/starter/` - Example template

**Builder Integration**:
- `/nuxt/app/pages/app/website/builder.vue` - Main builder
- `/nuxt/app/components/website-sections/CustomHTML.vue` - HTML component
- `/nuxt/app/components/website-builder/SectionPropertiesPanel.vue` - Properties

## 🎯 Next Steps

1. Read `IMPLEMENTATION_SUMMARY.md` for detailed steps
2. Use `BUILDER_CODE_SNIPPETS.md` for exact code
3. Reference `TEMPLATE_FLOW_DIAGRAM.md` to understand flow
4. Test with each template to ensure all work
5. Customize as needed for your use case

## 🚢 Deployment

No special deployment steps needed:
- Templates are bundled with the app
- No database changes required
- No environment variables needed
- Works in development and production

## ✨ Features Added

- ✅ 5 professional templates
- ✅ Visual template previews
- ✅ One-click template application
- ✅ Fully editable sections
- ✅ Undo/redo support
- ✅ Loading states
- ✅ Error handling
- ✅ Dark mode support

## 🎉 User Experience

**Before**: Only basic preset templates

**After**: 5 professional, fully-designed templates that users can apply instantly and customize to their needs.

---

**Implementation Status**: ✅ Ready to implement
**Complexity**: Low
**Time Required**: 15-20 minutes
**Files Changed**: 1
**New Dependencies**: 0
**Breaking Changes**: None
