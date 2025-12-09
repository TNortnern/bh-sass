# GrapesJS Templates - Quick Start Guide

## Installation

Templates are already included in the project at:
```
/nuxt/app/lib/grapesjs-templates/
```

## Basic Usage

### 1. Import Templates

```typescript
// Get all templates
import templates from '~/lib/grapesjs-templates'

// Or specific imports
import { getTemplateById, getTemplatesByCategory } from '~/lib/grapesjs-templates'
```

### 2. Display Template Selector

```vue
<template>
  <div class="template-grid">
    <div
      v-for="template in templates"
      :key="template.id"
      @click="selectTemplate(template)"
      class="template-card"
    >
      <!-- Thumbnail -->
      <img :src="template.thumbnail" :alt="template.name" />

      <!-- Info -->
      <h3>{{ template.name }}</h3>
      <p>{{ template.description }}</p>

      <!-- Category badge -->
      <span :class="`badge-${template.category.toLowerCase()}`">
        {{ template.category }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import templates from '~/lib/grapesjs-templates'

function selectTemplate(template: GrapesJSTemplate) {
  // Initialize GrapesJS with template
  loadTemplate(template)
}
</script>
```

### 3. Load Template in GrapesJS

```typescript
import grapesjs from 'grapesjs'
import { getTemplateById } from '~/lib/grapesjs-templates'

function loadTemplate(templateId: string) {
  const template = getTemplateById(templateId)

  if (!template) {
    console.error('Template not found:', templateId)
    return
  }

  // Initialize GrapesJS
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: false,
    height: '100vh',
    width: 'auto',

    // Load template
    components: template.html,

    // Optional: Set colors from template config
    styleManager: {
      sectors: [{
        name: 'Colors',
        properties: [
          {
            name: 'Primary Color',
            property: 'primary-color',
            type: 'color',
            defaults: template.config.primaryColor
          },
          {
            name: 'Accent Color',
            property: 'accent-color',
            type: 'color',
            defaults: template.config.accentColor
          }
        ]
      }]
    }
  })

  return editor
}
```

## Available Templates

### Starter Templates (Fully Complete)

#### Classic Starter ✅
```typescript
const classic = getTemplateById('starter-classic')
// Professional blue theme, perfect for any business
```

#### Playful Starter ✅
```typescript
const playful = getTemplateById('starter-playful')
// Fun pink/yellow theme, great for kids' parties
```

#### Premium Starter ✅
```typescript
const premium = getTemplateById('starter-premium')
// Dark luxury theme, ideal for high-end events
```

### Professional Templates (Placeholders)

```typescript
const enterprise = getTemplateById('pro-enterprise')      // Corporate
const localBiz = getTemplateById('pro-local-business')   // Community
const eventFocus = getTemplateById('pro-event-focused')  // Event types
```

### Specialized Templates (Placeholders)

```typescript
const booking = getTemplateById('booking-focused')     // High conversion
const gallery = getTemplateById('gallery-showcase')    // Photo-heavy
const trust = getTemplateById('trust-builder')         // Reviews/social proof
```

## Filter Templates

### By Category

```typescript
import { getTemplatesByCategory } from '~/lib/grapesjs-templates'

const starterTemplates = getTemplatesByCategory('Starter')
const proTemplates = getTemplatesByCategory('Professional')
const specializedTemplates = getTemplatesByCategory('Specialized')
```

### By Tags

```typescript
import { getTemplatesByTag } from '~/lib/grapesjs-templates'

const funTemplates = getTemplatesByTag('playful')
const luxuryTemplates = getTemplatesByTag('luxury')
const conversionTemplates = getTemplatesByTag('conversion')
```

## Customize Template Colors

### Simple String Replacement (Quick & Dirty)

```typescript
const template = getTemplateById('starter-classic')

// Replace colors
let customHtml = template.html
  .replace(/#3b82f6/g, '#your-brand-blue')   // Replace primary
  .replace(/#10b981/g, '#your-brand-green')  // Replace accent

// Use customized HTML
editor.setComponents(customHtml)
```

### Advanced: CSS Variables (Better Approach)

Add this to your template HTML:

```html
<style>
  :root {
    --primary-color: #3b82f6;
    --secondary-color: #1e40af;
    --accent-color: #10b981;
  }

  .bg-primary { background-color: var(--primary-color) !important; }
  .text-primary { color: var(--primary-color) !important; }
  .border-primary { border-color: var(--primary-color) !important; }
</style>
```

Then update variables programmatically:

```typescript
editor.on('load', () => {
  const css = editor.getCss()
  const updatedCss = css.replace(
    '--primary-color: #3b82f6',
    `--primary-color: ${yourBrandColor}`
  )
  editor.setStyle(updatedCss)
})
```

## Example: Complete Integration

```vue
<template>
  <div class="website-builder">
    <!-- Template Selector Modal -->
    <UModal v-model:open="showTemplateSelector" title="Choose a Template">
      <template #body>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="template in starterTemplates"
            :key="template.id"
            @click="selectAndLoadTemplate(template.id)"
            class="cursor-pointer hover:shadow-lg transition"
          >
            <div v-html="template.preview" class="w-full h-40 bg-gray-100 rounded"></div>
            <h4 class="font-bold mt-2">{{ template.name }}</h4>
            <p class="text-sm text-gray-600">{{ template.description }}</p>
          </div>
        </div>
      </template>
    </UModal>

    <!-- GrapesJS Editor -->
    <div id="gjs" ref="gjsContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import grapesjs from 'grapesjs'
import { getTemplateById, getTemplatesByCategory } from '~/lib/grapesjs-templates'

const showTemplateSelector = ref(true)
const gjsContainer = ref(null)
let editor: any = null

const starterTemplates = getTemplatesByCategory('Starter')

function selectAndLoadTemplate(templateId: string) {
  const template = getTemplateById(templateId)

  if (!template) return

  showTemplateSelector.value = false

  // Initialize GrapesJS
  editor = grapesjs.init({
    container: '#gjs',
    fromElement: false,
    height: '100vh',
    width: 'auto',
    components: template.html,
    storageManager: {
      type: 'local',
      autosave: true,
      autoload: true
    }
  })
}

onMounted(() => {
  // Show template selector on mount
  showTemplateSelector.value = true
})
</script>
```

## Template Preview SVGs

Each template includes an inline SVG preview for quick visual selection:

```typescript
const template = getTemplateById('starter-classic')

console.log(template.preview)  // SVG markup
console.log(template.thumbnail) // data:image/svg+xml;base64,...
```

Use in HTML:

```vue
<!-- Raw SVG -->
<div v-html="template.preview"></div>

<!-- As image -->
<img :src="template.thumbnail" alt="Template preview" />
```

## Tips & Best Practices

### 1. Always Show Preview First
Let users see the template before selecting it:

```vue
<img :src="template.thumbnail" class="w-full h-48 object-cover" />
```

### 2. Category Badges
Help users find the right template:

```vue
<span :class="categoryColor(template.category)">
  {{ template.category }}
</span>
```

### 3. Feature Lists
Show what's included:

```vue
<ul>
  <li v-for="feature in template.config.features" :key="feature">
    ✓ {{ feature }}
  </li>
</ul>
```

### 4. Color Swatches
Preview the color scheme:

```vue
<div class="flex gap-2">
  <div
    class="w-8 h-8 rounded"
    :style="{ backgroundColor: template.config.primaryColor }"
  ></div>
  <div
    class="w-8 h-8 rounded"
    :style="{ backgroundColor: template.config.accentColor }"
  ></div>
</div>
```

## Troubleshooting

### Template Not Loading?
```typescript
const template = getTemplateById('starter-classic')
if (!template) {
  console.error('Template not found!')
}
```

### GrapesJS Not Rendering?
Make sure container exists before initializing:

```typescript
onMounted(() => {
  const container = document.getElementById('gjs')
  if (container) {
    // Initialize GrapesJS
  }
})
```

### Styles Not Applied?
Tailwind CDN should be included in template HTML. Check:

```typescript
template.html.includes('tailwindcss.com') // Should be true
```

## Next Steps

1. ✅ Use starter templates immediately (3 fully complete)
2. 🚧 Professional templates coming soon
3. 🚧 Specialized templates coming soon
4. 📝 Create custom templates using the same interface

## Questions?

See the main README.md for detailed documentation on each template and the complete architecture.
