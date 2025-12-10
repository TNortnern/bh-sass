# GrapesJS Template Integration - Data Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOM BUILDER COMPONENT                     │
│                 /nuxt/app/pages/app/website/builder.vue          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ onMounted()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    loadGjsTemplates()                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. getTemplateList() → Returns metadata for 5 templates │  │
│  │  2. Promise.all() → Load all templates in parallel       │  │
│  │  3. gjsTemplates.value = loaded templates                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TEMPLATE SYSTEM                                │
│              /nuxt/app/lib/templates/index.ts                    │
│                                                                   │
│  getTemplateList()                                               │
│  ├─ Returns: [                                                   │
│  │    { id: 'starter', name: 'Modern Minimal', ... },          │
│  │    { id: 'bounce', name: 'Playful Party', ... },            │
│  │    { id: 'luxe', name: 'Elegant Premium', ... },            │
│  │    { id: 'energy', name: 'Bold Vibrant', ... },             │
│  │    { id: 'trust', name: 'Clean Professional', ... }         │
│  │  ]                                                            │
│  │                                                               │
│  loadTemplate(id)                                                │
│  └─ Lazy loads full template definition from:                   │
│     ├─ /nuxt/app/lib/templates/starter/index.ts                 │
│     ├─ /nuxt/app/lib/templates/bounce/index.ts                  │
│     ├─ /nuxt/app/lib/templates/luxe/index.ts                    │
│     ├─ /nuxt/app/lib/templates/energy/index.ts                  │
│     └─ /nuxt/app/lib/templates/trust/index.ts                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Returns
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEMPLATE DEFINITION                           │
│  {                                                               │
│    id: 'starter',                                                │
│    name: 'Modern Minimal',                                       │
│    description: 'Clean Swiss design...',                         │
│    thumbnail: '<svg>...</svg>',                                  │
│    defaultTheme: { colors: {...}, fonts: {...} },               │
│    pages: [                                                      │
│      {                                                           │
│        id: 'home',                                               │
│        name: 'Home',                                             │
│        sections: [                                               │
│          { id: 'hero', name: 'Hero', html: '...', css: '...' }, │
│          { id: 'featured', name: 'Featured', html: '...' },     │
│          ...                                                     │
│        ]                                                         │
│      },                                                          │
│      { id: 'inventory', name: 'Inventory', sections: [...] },   │
│      ...                                                         │
│    ],                                                            │
│    globalCss: '...',                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Template Application Flow

```
USER CLICKS TEMPLATE IN MODAL
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│               applyGjsTemplate(templateId)                       │
│                                                                   │
│  Step 1: Find template by ID                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ const template = gjsTemplates.value.find(t => ...)     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Step 2: Extract home page                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ const homePage = template.pages[0]                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Step 3: Convert sections to CustomHTML                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ const newSections = homePage.sections.map(section => { │    │
│  │   id: 'customhtml-123456-0',                            │    │
│  │   type: 'CustomHTML',                                   │    │
│  │   data: {                                                │    │
│  │     html: section.html,                                 │    │
│  │     css: section.css || template.globalCss,            │    │
│  │     label: section.name                                 │    │
│  │   }                                                      │    │
│  │ })                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                   │
│  Step 4: Apply to current page                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ page.sections = newSections                             │    │
│  │ history.value = [JSON.stringify(newSections)]          │    │
│  │ showTemplateSelector.value = false                      │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CANVAS UPDATES                              │
│                                                                   │
│  Sections array changes → Vue reactivity                         │
│  ├─ Canvas re-renders                                            │
│  ├─ CustomHTML components display                               │
│  └─ Each section is selectable and editable                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Transformation

### GrapesJS Template Section (Input)

```javascript
{
  id: 'hero',
  name: 'Hero',
  html: `
    <section class="relative min-h-[90vh] flex items-center">
      <div class="container">
        <h1>Make Every Party Unforgettable</h1>
        <p>Premium bounce house rentals...</p>
      </div>
    </section>
  `,
  css: `
    .container { max-width: 80rem; margin: 0 auto; }
  `
}
```

### Custom Builder Section (Output)

```javascript
{
  id: 'customhtml-1733712345-0',
  type: 'CustomHTML',
  data: {
    html: '<section class="relative min-h-[90vh]...">...</section>',
    css: '.container { max-width: 80rem; margin: 0 auto; }',
    label: 'Hero'
  }
}
```

## UI Component Hierarchy

```
Template Selector Modal
└─ .template-modal
   ├─ .modal-header
   │  ├─ <h2>Choose a Starting Template</h2>
   │  └─ <p>Select a template...</p>
   │
   ├─ .template-section (Quick Start)
   │  ├─ .section-title: "Quick Start Templates"
   │  └─ .template-grid
   │     ├─ .template-card (Complete Website)
   │     ├─ .template-card (Minimal Landing)
   │     ├─ .template-card (Service Focused)
   │     ├─ .template-card (Trust Builder)
   │     └─ .template-card (Start from Scratch)
   │
   ├─ .template-section.gjs-section (Professional)
   │  ├─ .section-title
   │  │  ├─ <UIcon sparkles>
   │  │  └─ "Professional Templates"
   │  └─ .template-grid
   │     ├─ .template-card.gjs-template (Modern Minimal)
   │     │  ├─ .template-preview (SVG thumbnail)
   │     │  ├─ <h3>Modern Minimal</h3>
   │     │  ├─ <p>Clean Swiss design...</p>
   │     │  └─ .template-footer
   │     │     ├─ .template-meta (7 pages)
   │     │     └─ .template-badge (Premium)
   │     │
   │     ├─ .template-card.gjs-template (Playful Party)
   │     ├─ .template-card.gjs-template (Elegant Premium)
   │     ├─ .template-card.gjs-template (Bold Vibrant)
   │     └─ .template-card.gjs-template (Clean Professional)
   │
   └─ .loading-state (if loadingTemplates)
      ├─ <UIcon loader spinning>
      └─ <p>Loading professional templates...</p>
```

## State Management

### Reactive State

```javascript
// Template data
const gjsTemplates = ref<TemplateDefinition[]>([])
// Initially: []
// After load: [starter, bounce, luxe, energy, trust]

// Loading state
const loadingTemplates = ref(false)
// During load: true
// After load: false

// Current page sections
const sections = computed({
  get: () => currentPage.value?.sections || []
  // After template applied: [
  //   { id: 'customhtml-123-0', type: 'CustomHTML', data: {...} },
  //   { id: 'customhtml-123-1', type: 'CustomHTML', data: {...} },
  //   ...
  // ]
})
```

## Example: Applying "Modern Minimal" Template

### Before

```javascript
pages.value = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    sections: [], // Empty
    isHome: true
  }
]
```

### User Action

1. Opens builder → Template selector appears
2. Sees "Modern Minimal" in Professional Templates
3. Clicks the card

### After

```javascript
pages.value = [
  {
    id: 'home',
    name: 'Home',
    slug: '/',
    sections: [
      {
        id: 'customhtml-1733712345-0',
        type: 'CustomHTML',
        data: {
          html: '<section class="hero">...</section>',
          css: '.hero { ... }',
          label: 'Hero'
        }
      },
      {
        id: 'customhtml-1733712345-1',
        type: 'CustomHTML',
        data: {
          html: '<section class="featured">...</section>',
          css: '.featured { ... }',
          label: 'Featured Items'
        }
      },
      {
        id: 'customhtml-1733712345-2',
        type: 'CustomHTML',
        data: {
          html: '<section class="how-it-works">...</section>',
          css: '.how-it-works { ... }',
          label: 'How It Works'
        }
      },
      // ... 2 more sections (testimonials, CTA)
    ],
    isHome: true
  }
]
```

## Template Loading Timeline

```
Time (ms)    Event
─────────────────────────────────────────────────────────────
0            Component mounts
             └─ showTemplateSelector = true (modal appears)

10           onMounted() executes
             └─ loadGjsTemplates() called
                └─ loadingTemplates = true
                └─ Loading state appears in modal

50           getTemplateList() returns metadata
             └─ [starter, bounce, luxe, energy, trust]

100          Promise.all() starts loading templates
             ├─ loadTemplate('starter')
             ├─ loadTemplate('bounce')
             ├─ loadTemplate('luxe')
             ├─ loadTemplate('energy')
             └─ loadTemplate('trust')

250          All templates loaded
             └─ gjsTemplates.value = [5 templates]
             └─ loadingTemplates = false
             └─ Professional Templates section appears
             └─ Console: "✅ Loaded 5 GrapesJS templates"

∞            User browses templates...

User clicks  applyGjsTemplate('starter') executes
             ├─ Extract home page sections
             ├─ Convert to CustomHTML
             ├─ Apply to current page
             └─ Modal closes

+10ms        Canvas updates
             └─ CustomHTML sections render
             └─ User can now edit sections
```

## Error Handling

```
┌─────────────────────────────────────────┐
│      loadGjsTemplates()                 │
└─────────────────────────────────────────┘
                │
                │ try {
                ▼
┌─────────────────────────────────────────┐
│   Load templates via Promise.all        │
└─────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
    Success         Error
        │               │
        ▼               ▼
┌─────────────┐   ┌──────────────────────┐
│ Templates   │   │ catch (error) {      │
│ loaded ✅   │   │   console.error()    │
│             │   │   gjsTemplates = []  │
└─────────────┘   │ }                    │
                  └──────────────────────┘
        │               │
        └───────┬───────┘
                │ finally {
                ▼
┌─────────────────────────────────────────┐
│   loadingTemplates = false              │
└─────────────────────────────────────────┘
```

## Component Rendering

```
CustomHTML Component Rendering Flow
────────────────────────────────────

User selects section → selectedSectionId changes
                      → selectedSection computed updates
                      → Properties Panel re-renders
                                │
                                ▼
                    ┌───────────────────────────┐
                    │  SectionPropertiesPanel   │
                    │                           │
                    │  if (type === 'CustomHTML')│
                    │  ├─ Show HTML editor      │
                    │  ├─ Show CSS editor       │
                    │  └─ Show label input      │
                    └───────────────────────────┘
                                │
                                │ User edits HTML
                                ▼
                    ┌───────────────────────────┐
                    │  @update event emitted    │
                    └───────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ handleSectionUpdate()     │
                    │ └─ section.data.html = val│
                    │ └─ saveToHistory()        │
                    └───────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────────┐
                    │ Section re-renders        │
                    │ └─ Shows updated HTML     │
                    └───────────────────────────┘
```

## Summary

This diagram shows:

1. **Template Loading**: How templates are loaded from the file system into memory
2. **Data Transformation**: How GrapesJS HTML sections become CustomHTML components
3. **User Interaction**: The complete flow from template selection to editable sections
4. **State Changes**: How reactive state updates trigger UI changes
5. **Error Handling**: Graceful handling of loading failures
6. **Component Rendering**: How sections render and update in the builder

The entire system is designed to be:
- **Asynchronous**: Templates load in parallel without blocking
- **Reactive**: Vue's reactivity system handles all UI updates
- **Modular**: Templates are separate from builder logic
- **Extensible**: Easy to add more templates in the future
- **User-friendly**: Clear loading states and instant feedback
