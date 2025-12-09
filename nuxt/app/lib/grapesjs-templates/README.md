# GrapesJS Website Builder Templates

Elite pre-built templates for bounce house rental businesses to use with GrapesJS website builder.

## Template Library

### Starter Templates (Quick Launch)

#### 1. **Classic Starter** (`starter-classic`)
- **Design**: Clean, professional, traditional layout
- **Best For**: Any rental business getting started
- **Color Scheme**: Blue primary (#3b82f6), Green accent (#10b981)
- **Features**:
  - Traditional navigation
  - Hero with value proposition
  - Featured rentals grid (3 columns)
  - How it works (4-step process)
  - Testimonials with 5-star ratings
  - FAQ section
  - Contact/CTA section
  - Full footer with links
- **Status**: ✅ Complete and production-ready

#### 2. **Playful Starter** (`starter-playful`)
- **Design**: Fun, colorful, kid-friendly
- **Best For**: Party rental businesses targeting families with young children
- **Color Scheme**: Pink/Purple gradient (#ec4899), Yellow accent (#fbbf24)
- **Features**:
  - Bold, playful typography
  - Emoji-enhanced navigation
  - Animated gradient hero
  - Vibrant rental cards with badges
  - Party package pricing tiers
  - Energetic testimonials
  - Fun footer with social icons
  - Bounce animations on scroll
- **Status**: ✅ Complete and production-ready

#### 3. **Premium Starter** (`starter-premium`)
- **Design**: Elegant, luxury, dark theme with gold accents
- **Best For**: High-end event rental businesses, corporate clients
- **Color Scheme**: Dark slate (#0f172a), Gold accent (#fbbf24)
- **Features**:
  - Sophisticated dark mode design
  - Premium gradient backgrounds
  - Luxury rental cards with borders
  - 4-step elite experience flow
  - High-end testimonials
  - 24/7 concierge emphasis
  - Elegant footer
  - Fade-in-up animations
- **Status**: ✅ Complete and production-ready

---

### Professional Templates (Advanced)

#### 4. **Enterprise Professional** (`pro-enterprise`)
- **Design**: Corporate-style for large rental companies
- **Best For**: Multi-location rental businesses, franchises
- **Features** (planned):
  - Multi-location selector
  - Team directory
  - Corporate branding sections
  - Advanced stats/analytics showcase
  - Client logo wall
- **Status**: 🚧 Placeholder (expandable)

#### 5. **Local Business Pro** (`pro-local-business`)
- **Design**: Community-focused with local SEO optimization
- **Best For**: Neighborhood rental businesses, local markets
- **Features** (planned):
  - Prominent location/service area map
  - Community trust signals
  - Local review integration
  - Neighborhood testimonials
  - "Locally owned" badges
- **Status**: 🚧 Placeholder (expandable)

#### 6. **Event-Focused Pro** (`pro-event-focused`)
- **Design**: Organized by event types (birthday, corporate, school)
- **Best For**: Businesses specializing in specific event categories
- **Features** (planned):
  - Event type navigation/filtering
  - Package deals per event type
  - Event planning tips/guides
  - Category-specific testimonials
- **Status**: 🚧 Placeholder (expandable)

---

### Specialized Templates (Purpose-Built)

#### 7. **Booking-Focused** (`booking-focused`)
- **Design**: Conversion-optimized with CTAs everywhere
- **Best For**: Businesses focused on maximizing online bookings
- **Features** (planned):
  - Sticky booking sidebar
  - Multiple CTA placements
  - Urgency elements (limited availability)
  - Simplified booking form
  - Quick quote calculator
- **Status**: 🚧 Placeholder (expandable)

#### 8. **Gallery Showcase** (`gallery-showcase`)
- **Design**: Image-heavy portfolio style
- **Best For**: Businesses with stunning visual inventory
- **Features** (planned):
  - Masonry photo gallery
  - Lightbox image viewer
  - Visual category filtering
  - Before/after event photos
  - Instagram feed integration
- **Status**: 🚧 Placeholder (expandable)

#### 9. **Trust Builder** (`trust-builder`)
- **Design**: Social proof and credibility focused
- **Best For**: New businesses building trust or safety-conscious markets
- **Features** (planned):
  - Prominent testimonials section
  - Safety certifications badges
  - Insurance/licensing showcase
  - Customer review widgets
  - Video testimonials
  - Trust seals (BBB, etc.)
- **Status**: 🚧 Placeholder (expandable)

---

## Usage

### Import Templates

```typescript
import { templates, getTemplateById } from '~/lib/grapesjs-templates'

// Get all templates
const allTemplates = Object.values(templates)

// Get specific template
const classicTemplate = getTemplateById('starter-classic')

// Get by category
import { getTemplatesByCategory } from '~/lib/grapesjs-templates'
const starterTemplates = getTemplatesByCategory('Starter')
```

### Use with GrapesJS

```typescript
import grapesjs from 'grapesjs'
import { getTemplateById } from '~/lib/grapesjs-templates'

const template = getTemplateById('starter-classic')

const editor = grapesjs.init({
  container: '#gjs',
  fromElement: false,
  // Load template HTML
  components: template.html,
  // Or use GrapesJS components format if available
  // components: template.components,
  // styles: template.styles,
})
```

### Template Preview Thumbnails

```vue
<template>
  <div v-for="template in templates" :key="template.id">
    <img :src="template.thumbnail" :alt="template.name" />
    <h3>{{ template.name }}</h3>
    <p>{{ template.description }}</p>
  </div>
</template>

<script setup>
import { templates } from '~/lib/grapesjs-templates'
</script>
```

---

## Template Structure

Each template object contains:

```typescript
interface GrapesJSTemplate {
  id: string                    // Unique identifier
  name: string                  // Display name
  description: string           // Template description
  category: 'Starter' | 'Professional' | 'Specialized'
  tags: string[]                // Searchable tags
  preview: string               // SVG preview markup
  thumbnail: string             // Base64 thumbnail data URL
  html: string                  // Full HTML template
  css?: string                  // Additional CSS (optional)
  components?: any              // GrapesJS component structure (optional)
  styles?: any                  // GrapesJS styles structure (optional)
  config: {
    primaryColor: string        // Main brand color
    secondaryColor: string      // Secondary color
    accentColor: string         // Accent/CTA color
    fonts: {
      heading: string           // Heading font family
      body: string              // Body font family
    }
    features: string[]          // Key features list
  }
}
```

---

## Customization

All templates use Tailwind CSS classes and can be easily customized:

### Colors
Templates support color customization through the config object:

```typescript
const template = getTemplateById('starter-classic')

// Override colors
const customColors = {
  primaryColor: '#your-brand-color',
  secondaryColor: '#your-secondary-color',
  accentColor: '#your-accent-color'
}

// Replace colors in HTML (simple string replacement for prototyping)
let customHtml = template.html
  .replace(/#3b82f6/g, customColors.primaryColor)
  .replace(/#10b981/g, customColors.accentColor)
```

### Fonts
Change font families by updating the Google Fonts link and CSS:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Poppins', sans-serif; }
</style>
```

### Content
All text content is placeholder and should be replaced with actual business content.

---

## Template Categories

### By Category:
- **Starter** (3 templates): Quick launch options for new businesses
- **Professional** (3 templates): Advanced features for established businesses
- **Specialized** (3 templates): Purpose-built for specific goals

### By Use Case:
- **Family/Kids**: Playful Starter
- **Luxury/Corporate**: Premium Starter, Enterprise Professional
- **General Purpose**: Classic Starter
- **Local Business**: Local Business Pro
- **High Conversion**: Booking-Focused
- **Visual/Portfolio**: Gallery Showcase
- **Trust Building**: Trust Builder
- **Event Planning**: Event-Focused Pro

---

## Development Roadmap

### Phase 1 (Complete) ✅
- [x] Template registry system
- [x] SVG preview generation
- [x] Three complete starter templates
- [x] Template metadata structure
- [x] Category organization

### Phase 2 (Next)
- [ ] Complete Professional templates
- [ ] Complete Specialized templates
- [ ] Add GrapesJS component structure
- [ ] Add GrapesJS styles structure
- [ ] Interactive template customizer

### Phase 3 (Future)
- [ ] Template variations (color schemes)
- [ ] Section library (mix & match)
- [ ] Block library (reusable components)
- [ ] Mobile-specific templates
- [ ] Industry-specific templates (water slides, tents, etc.)

---

## Best Practices

### When to Use Each Template:

1. **Just Starting Out?** → Classic Starter or Playful Starter
2. **High-End Market?** → Premium Starter
3. **Multiple Locations?** → Enterprise Professional
4. **Local Neighborhood Business?** → Local Business Pro
5. **Need More Bookings?** → Booking-Focused
6. **Great Photos?** → Gallery Showcase
7. **New Business Building Trust?** → Trust Builder
8. **Event Packages?** → Event-Focused Pro

### Customization Tips:

- Replace all placeholder images with actual rental photos
- Update contact information (phone, email, address)
- Customize colors to match brand
- Add real customer testimonials
- Update pricing to actual rates
- Add real business name and logo
- Test on mobile devices
- Optimize images for web
- Add real FAQ content
- Update meta tags for SEO

---

## Technical Notes

- All templates use **Tailwind CSS CDN** for styling
- Templates are **mobile-responsive** by default
- No jQuery dependencies (vanilla JS or none)
- **Inter font** used for consistency
- Templates are **standalone HTML files** (can be used outside GrapesJS)
- SVG previews are **inline** for fast loading
- Thumbnails are **base64 encoded** for portability

---

## Contributing

To add a new template:

1. Create new `.ts` file in `/grapesjs-templates/`
2. Follow the `GrapesJSTemplate` interface structure
3. Add SVG preview to `template-previews.ts`
4. Export from `index.ts`
5. Add to appropriate category in `templateCategories`
6. Update this README

---

## License

These templates are part of the BouncePro SaaS platform and are provided to tenant users for their website creation.

---

**Last Updated**: 2025-12-06
**Version**: 1.0.0
**Complete Templates**: 3 of 9 (33%)
