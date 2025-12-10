# E-Commerce Website Builder Templates - Design Document

**Date:** 2025-12-08
**Status:** Approved, Ready for Implementation

## Overview

Build 5 distinct, high-quality e-commerce templates for the GrapesJS website builder. Templates must NOT look like generic AI-generated Tailwind sites. They should be production-grade, visually distinctive, and connect to the Payload CMS backend via smart blocks.

## Anti-Slop Design Principles

Patterns extracted from reference sites (demo.graygrids.com, spacema-dev.com/tailstore, saasly.prebuiltui.com):

### Visual Techniques
- **Full-bleed hero imagery** - Edge-to-edge images, not contained in boxes
- **Overlapping/layered elements** - Cards that break grid boundaries, text over images with proper contrast
- **Gradient text and colored shadows** - `text-transparent bg-clip-text bg-gradient-to-r`, colored `drop-shadow`
- **Asymmetric layouts** - Not everything centered, intentional white space imbalance
- **Micro-interactions** - Hover transforms, subtle scale changes, color shifts

### Typography
- Variable font weights within headings
- Large display text (4xl-8xl) for hero sections
- Tight letter-spacing on large text, relaxed on body
- Color contrast in text (highlight words with brand color)

### Spacing & Rhythm
- Generous vertical spacing between sections (py-24 to py-32)
- Tighter internal component spacing
- Breathing room around CTAs

### What to AVOID
- Uniform card grids with identical spacing
- Generic stock photo placeholders
- Basic Tailwind default colors without customization
- Centered-everything layouts
- Boring rectangular buttons without hover states

## Template System Architecture

### File Structure
```
nuxt/app/lib/templates/
├── index.ts                    # Template registry & loader
├── types.ts                    # TypeScript interfaces
├── theme-presets.ts            # Color themes
├── smart-blocks/               # Data-connected components
│   ├── index.ts
│   ├── InventoryGrid.ts
│   ├── FeaturedItems.ts
│   ├── BookingWidget.ts
│   ├── BusinessInfo.ts
│   ├── ContactForm.ts
│   ├── Testimonials.ts
│   └── DocumentSign.ts
├── starter/                    # Template 1: Modern Minimal
│   ├── index.ts
│   ├── pages/
│   │   ├── home.ts
│   │   ├── inventory.ts
│   │   ├── about.ts
│   │   ├── contact.ts
│   │   └── booking.ts
│   └── theme.ts
├── bounce/                     # Template 2: Playful Party
├── luxe/                       # Template 3: Elegant Premium
├── energy/                     # Template 4: Bold Vibrant
└── trust/                      # Template 5: Clean Professional
```

### The 5 Templates

| Template | Codename | Target Audience | Visual Style |
|----------|----------|-----------------|--------------|
| Modern Minimal | starter | First-time users | Clean, Swiss design, lots of white space |
| Playful Party | bounce | Kids birthday parties | Bright colors, bouncy animations, fun shapes |
| Elegant Premium | luxe | High-end events, weddings | Serif fonts, muted palette, sophisticated |
| Bold Vibrant | energy | Active/sports events | High contrast, dynamic angles, energetic |
| Clean Professional | trust | Corporate clients, schools | Professional, trustworthy, structured |

### Pages Per Template
1. **Home** - Hero, featured items, testimonials, CTA
2. **Inventory/Catalog** - Filterable grid with all rental items
3. **About** - Business story, team, values
4. **Contact** - Contact form, map, business info
5. **Booking** - Booking widget integration
6. **Terms & Conditions** - Legal document with merge fields
7. **Waiver/Contract** - Signature capture document

## Performance Optimization

Critical to prevent editor freezing:

### Lazy Loading
```typescript
// Templates loaded on-demand, not at startup
const templates = {
  starter: () => import('./starter'),
  bounce: () => import('./bounce'),
  // ...
}
```

### Virtual Scrolling for Inventory Grid
```typescript
{
  virtualScroll: true,
  itemHeight: 320,
  bufferSize: 2,
  overscan: 3
}
```

### Debounced Data Fetching
```typescript
const debouncedFetch = useDebounceFn(async () => {
  items.value = await $fetch('/api/rental-items')
}, 300)
```

### Batch GrapesJS Updates
```typescript
editor.getModel().set('_updating', true)
try {
  // Make all changes here
  components.forEach(c => c.set('content', newContent, { silent: true }))
} finally {
  editor.getModel().set('_updating', false)
  editor.trigger('change')
}
```

## Smart Block Components

Data-connected blocks that fetch from Payload CMS:

### InventoryGrid
```typescript
{
  id: 'inventory-grid',
  label: 'Inventory Grid',
  category: 'Smart Blocks',
  props: {
    layout: { type: 'select', options: ['grid', 'masonry', 'carousel'], default: 'grid' },
    columns: { type: 'select', options: [2, 3, 4], default: 3 },
    showFilters: { type: 'checkbox', default: true },
    showPricing: { type: 'checkbox', default: true },
    categoryFilter: { type: 'text', default: '' },
    maxItems: { type: 'number', default: 12 }
  },
  // Renders with virtual scrolling, fetches from /api/rental-items
}
```

### FeaturedItems
```typescript
{
  id: 'featured-items',
  label: 'Featured Items',
  props: {
    layout: { type: 'select', options: ['cards', 'hero', 'slider'], default: 'cards' },
    itemIds: { type: 'text', default: '' }, // Comma-separated IDs or empty for auto
    count: { type: 'number', default: 3 }
  }
}
```

### BusinessInfo
```typescript
{
  id: 'business-info',
  label: 'Business Info',
  props: {
    field: {
      type: 'select',
      options: ['name', 'phone', 'email', 'address', 'hours', 'tagline', 'logo'],
      default: 'name'
    },
    style: { type: 'select', options: ['inline', 'block', 'icon'], default: 'inline' }
  }
  // Fetches from tenant settings, auto-updates when settings change
}
```

### BookingWidget
```typescript
{
  id: 'booking-widget',
  label: 'Booking Widget',
  props: {
    style: { type: 'select', options: ['embedded', 'modal', 'sidebar'], default: 'embedded' },
    showCalendar: { type: 'checkbox', default: true },
    preselectedItem: { type: 'text', default: '' }
  }
}
```

### ContactForm
```typescript
{
  id: 'contact-form',
  label: 'Contact Form',
  props: {
    fields: { type: 'multiselect', options: ['name', 'email', 'phone', 'message', 'event-date', 'item-interest'] },
    submitAction: { type: 'select', options: ['email', 'database', 'both'], default: 'both' }
  }
}
```

### Testimonials
```typescript
{
  id: 'testimonials',
  label: 'Testimonials',
  props: {
    layout: { type: 'select', options: ['carousel', 'grid', 'masonry'], default: 'carousel' },
    count: { type: 'number', default: 3 },
    autoplay: { type: 'checkbox', default: true }
  }
  // Fetches from testimonials collection (to be created)
}
```

### DocumentSign
```typescript
{
  id: 'document-sign',
  label: 'Document Signature',
  props: {
    documentType: { type: 'select', options: ['terms', 'waiver', 'contract', 'policy'], default: 'waiver' },
    templateId: { type: 'relationship', relationTo: 'documents' },
    requireSignature: { type: 'checkbox', default: true },
    prefillFromBooking: { type: 'checkbox', default: true }
  }
  // Renders document with merge fields replaced, captures signature
}
```

## Unified Document System

### Payload Collections

#### Documents Collection
```typescript
{
  slug: 'documents',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['terms', 'waiver', 'contract', 'policy'] },
    { name: 'content', type: 'richText' }, // Supports merge fields
    { name: 'requiresSignature', type: 'checkbox', defaultValue: false },
    { name: 'isDefault', type: 'checkbox', defaultValue: false },
    { name: 'version', type: 'number', defaultValue: 1 },
    { name: 'tenantId', type: 'relationship', relationTo: 'tenants' }
  ]
}
```

#### SignedDocuments Collection
```typescript
{
  slug: 'signed-documents',
  fields: [
    { name: 'document', type: 'relationship', relationTo: 'documents' },
    { name: 'booking', type: 'relationship', relationTo: 'bookings' },
    { name: 'customer', type: 'relationship', relationTo: 'customers' },
    { name: 'signedContent', type: 'richText' }, // Snapshot with merge fields replaced
    { name: 'signatureData', type: 'json' }, // Canvas data or typed signature
    { name: 'signedAt', type: 'date' },
    { name: 'ipAddress', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'tenantId', type: 'relationship', relationTo: 'tenants' }
  ]
}
```

### Merge Fields
```
{{business.name}}        → Tenant business name
{{business.phone}}       → Business phone
{{business.email}}       → Business email
{{business.address}}     → Full address

{{customer.name}}        → Customer full name (prefilled from booking)
{{customer.email}}       → Customer email
{{customer.phone}}       → Customer phone

{{booking.number}}       → Booking reference number
{{booking.date}}         → Event date
{{booking.items}}        → List of booked items
{{booking.total}}        → Total price

{{today.date}}           → Current date
{{today.time}}           → Current time
```

### Document Flow
1. Admin creates document template with merge fields in Payload
2. Customer reaches document page (from booking confirmation or direct link)
3. System replaces merge fields with actual data (prefilled from booking if available)
4. Customer reviews and signs (canvas signature or typed)
5. Signed document stored with snapshot of content + signature + metadata

## Theme Preset System

### Theme Structure
```typescript
interface ThemePreset {
  id: string
  name: string
  colors: {
    primary: string      // Main brand color
    secondary: string    // Accent color
    accent: string       // Highlight color
    background: string   // Page background
    surface: string      // Card/section background
    text: string         // Primary text
    textMuted: string    // Secondary text
  }
  fonts: {
    heading: string
    body: string
  }
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
}
```

### Default Presets per Template
- **starter**: Neutral grays, Inter font, medium radius
- **bounce**: Vibrant rainbow palette, Nunito font, full radius
- **luxe**: Gold/cream/black, Playfair Display + Lato, small radius
- **energy**: Electric blue/orange/black, Montserrat, none radius
- **trust**: Navy/white/light blue, Source Sans Pro, medium radius

### Customization UI
- Color picker for each color slot
- Font selector dropdown
- Border radius slider
- Live preview in editor

## Implementation Order

1. **Phase 1: Foundation**
   - Create file structure
   - Build types.ts with all interfaces
   - Build theme-presets.ts
   - Create template registry in index.ts

2. **Phase 2: Smart Blocks**
   - BusinessInfo (simplest, good test)
   - InventoryGrid (most complex, core feature)
   - FeaturedItems
   - ContactForm
   - BookingWidget
   - Testimonials
   - DocumentSign

3. **Phase 3: First Template (Starter)**
   - Home page
   - Inventory page
   - About page
   - Contact page
   - Booking page
   - Terms page
   - Waiver page

4. **Phase 4: Payload Collections**
   - Documents collection
   - SignedDocuments collection
   - Testimonials collection (optional)

5. **Phase 5: Remaining Templates**
   - Bounce (Playful Party)
   - Luxe (Elegant Premium)
   - Energy (Bold Vibrant)
   - Trust (Clean Professional)

6. **Phase 6: Polish**
   - Template selector UI in editor
   - Theme customization panel
   - Documentation
