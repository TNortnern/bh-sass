# Website Builder Design

## Overview

Squarespace-style section builder for tenant websites. Tenants drag pre-built sections to compose pages, edit content inline, and publish.

## Goals

- Premium, clean design (not generic AI look)
- Intuitive drag-and-drop interface
- Inline text/image editing
- Real placeholder content (Unsplash images, realistic copy)
- Desktop-first (minimal mobile editing)

## Architecture

### Editor Modes

**Editor Mode** (`/app/website/builder` or `/app/website/grape`)
- Full-width canvas showing actual website
- Left sidebar with section library (collapsible)
- Inline "+" buttons between sections
- Floating toolbar on section select (move, duplicate, delete)
- Auto-save with undo/redo

**Live Site** (`/site/{tenant}`)
- Renders saved sections as real website
- Server-rendered for SEO
- No editor UI

### Data Structure

```typescript
interface WebsiteData {
  sections: Section[]
}

interface Section {
  id: string
  type: SectionType
  content: Record<string, any>
  order: number
}

type SectionType =
  | 'hero-fullwidth'
  | 'hero-split'
  | 'hero-video'
  | 'featured-rentals'
  | 'category-grid'
  | 'about'
  | 'trust-badges'
  | 'testimonials'
  | 'gallery'
  | 'faq'
  | 'how-it-works'
  | 'contact'
  | 'cta-banner'
```

## Section Types

### Hero Sections

| Section | Editable Fields |
|---------|----------------|
| Hero - Full Width | background image, headline, subheadline, button text, button link, overlay opacity |
| Hero - Split | image, headline, subheadline, button text, image position (left/right) |
| Hero - Video | video URL, headline, subheadline, button text, fallback image |

### Content Sections

| Section | Editable Fields |
|---------|----------------|
| Featured Rentals | headline, subheadline, item count, category filter, show prices |
| Category Grid | headline, categories to show, columns |
| About | image, headline, body text, stats array |
| Trust Badges | badges array (icon, title, description), layout |
| Testimonials | headline, testimonials array |
| Gallery | headline, images array, layout, columns |
| FAQ | headline, questions array |
| How It Works | headline, steps array |
| Contact | headline, show map, show form, business hours |
| CTA Banner | background, headline, button text, button link |

## Editor UI

### Layout

```
+--------------------------------------------------+
| Toolbar: [Undo] [Redo]    [Preview] [Publish]    |
+----------+---------------------------------------+
|          |                                       |
| Section  |                                       |
| Library  |         Live Page Canvas              |
|          |                                       |
| [Hero]   |   (actual website with edit overlay)  |
| [Rentals]|                                       |
| [About]  |         [+] <-- inline add button     |
| [...]    |                                       |
|          |                                       |
+----------+---------------------------------------+
```

### Interactions

1. **Adding sections**: Drag from sidebar OR click [+] between sections
2. **Selecting**: Click section to select, shows floating toolbar
3. **Editing**: Click text to edit inline, click image to upload
4. **Reordering**: Drag section handles or use Move Up/Down buttons
5. **Saving**: Auto-save on changes, undo/redo in memory

## Visual Design

### Style System

| Element | Style |
|---------|-------|
| Backgrounds | White (#ffffff), Light gray (#f9fafb) alternating |
| Cards | White, 1px border (#e5e7eb), 8px radius, subtle shadow |
| Typography | Inter font, tight tracking, bold headlines |
| Spacing | 80px section padding, 24px card padding |
| Images | 12px radius, shadow on hover |
| Buttons | Solid fill, 8px radius, bold text, hover lift |

### Placeholder Content

Real Unsplash photos:
- `unsplash.com/s/photos/bounce-house`
- `unsplash.com/s/photos/kids-party`
- `unsplash.com/s/photos/backyard-birthday`

Realistic copy (not lorem ipsum):
- "Unforgettable Parties Start Here"
- "Premium bounce house rentals delivered and set up at your location"

## Undo/Redo System

Command history stack in memory:

```typescript
const history = ref<WebsiteData[]>([])
const historyIndex = ref(0)

function pushState(state: WebsiteData) {
  // Truncate any redo states
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(structuredClone(state))
  historyIndex.value = history.value.length - 1
}

function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    return history.value[historyIndex.value]
  }
}

function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    return history.value[historyIndex.value]
  }
}
```

## Version History (Future)

After UI/UX validated, add Payload collection for versions:

```typescript
// WebsiteVersions collection
{
  tenantId: relationship,
  sections: json,
  savedAt: timestamp,
  savedBy: relationship,
  label: text (optional),
  isPublished: boolean
}
```

## Implementation Plan

### Phase 1: UI/UX Prototypes (No DB)

Build two versions for comparison:

**Version A: Custom Build**
- Route: `/app/website/builder`
- Stack: Vue Draggable + TipTap
- Hardcoded sample data

**Version B: GrapeJS**
- Route: `/app/website/grape`
- Stack: GrapeJS embedded in Vue
- Hardcoded sample data

### Phase 2: Evaluate and Pick Winner

Criteria:
1. How does it feel to use?
2. Code complexity / maintainability
3. Bundle size
4. Edge cases and bugs

### Phase 3: Integrate with Payload

- Define blocks schema in Payload
- Wire up save/load API
- Add version history
- Replace `/app/website` with winner

## File Structure

```
nuxt/app/
  components/
    website-builder/
      Editor.vue
      EditorCanvas.vue
      EditorSidebar.vue
      EditorToolbar.vue
      SectionWrapper.vue
      SectionPicker.vue
    website-sections/
      HeroFullWidth.vue
      HeroSplit.vue
      FeaturedRentals.vue
      AboutSection.vue
      TrustBadges.vue
      Testimonials.vue
      Gallery.vue
      FAQ.vue
      HowItWorks.vue
      ContactSection.vue
      CTABanner.vue
  pages/
    app/website/
      builder.vue    # Custom version
      grape.vue      # GrapeJS version
    site/[tenant]/
      index.vue      # Live site render
```

## Dependencies

**Custom Build:**
- `vuedraggable` - Drag and drop
- `@tiptap/vue-3` - Rich text editing

**GrapeJS Build:**
- `grapesjs` - Visual editor core
- `grapesjs-preset-webpage` - Default blocks (optional)
