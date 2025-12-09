# GrapesJS Intelligent Editing Plugins

Comprehensive suite of GrapesJS plugins for intelligent, user-friendly visual editing.

## Plugins Overview

### 1. Intelligent Text Editor
Automatically detects and enables inline editing for all text elements.

**Features:**
- Auto-detection of text-editable elements (h1-h6, p, span, a, button, li, label, etc.)
- Dashed border visual indicators on hover (builder.io style)
- Inline text editing with double-click
- Text alignment, font size, font weight traits
- ESC to cancel, Enter to save (for single-line elements)

**Supported Elements:**
`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, `a`, `button`, `li`, `label`, `blockquote`, `cite`, `code`, `pre`, `strong`, `em`, `small`

### 2. Intelligent Image Editor
Auto-detects and enables editing for images and background images.

**Features:**
- Auto-detection of `<img>` tags and elements with `background-image` CSS
- Image edit overlay on hover with 📷 icon
- Image picker modal on click
- Support for both `img src` and `background-image` replacement
- Image sizing controls (contain, cover, fill, etc.)
- File validation (format and size)

**Supported Formats:**
JPEG, PNG, GIF, WebP, SVG

**Max File Size:**
5MB (configurable)

### 3. Default Width Plugin
Sets 100% width as default for all block-level elements.

**Features:**
- Applies to: section, div, article, header, footer, main, aside, nav, form
- Overrides default GrapesJS sizing behavior
- Ensures blocks span full width when dropped
- Toggle full-width with toolbar button or Ctrl/Cmd + W
- Visual indicator showing "100%" badge

### 4. Comprehensive Traits
Adds comprehensive traits/properties for all elements.

**Categories:**

**Spacing:**
- Margin (top, right, bottom, left)
- Padding (top, right, bottom, left)

**Typography:**
- Font family, size, weight
- Line height, letter spacing
- Text align, transform, color

**Background:**
- Color, size, position, repeat

**Borders:**
- Width, style, color, radius

**Layout:**
- Display, flex direction
- Justify content, align items
- Flex wrap, gap

**Sizing:**
- Width, height
- Min/max width, min/max height

**Effects:**
- Opacity, box shadow, transform

## Installation & Usage

### Method 1: Register All Plugins (Recommended)

```typescript
import grapesjs from 'grapesjs'
import { registerAllPlugins } from '~/lib/grapesjs-plugins'

const editor = grapesjs.init({
  container: '#gjs',
  fromElement: true,
  height: '100vh',
  storageManager: false
})

// Register all plugins with default options
registerAllPlugins(editor)

// Or with custom options
registerAllPlugins(editor, {
  textEditor: {
    hoverBorderColor: '#3b82f6',
    hoverBorderStyle: '2px dashed'
  },
  imageEditor: {
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },
  defaultWidth: {
    defaultWidth: '100%'
  },
  traits: {
    groupTraits: true,
    includeAdvanced: true
  }
})
```

### Method 2: Using Plugin Config

```typescript
import grapesjs from 'grapesjs'
import { getPluginConfig } from '~/lib/grapesjs-plugins'

const { plugins, pluginsOpts } = getPluginConfig({
  textEditor: { hoverBorderColor: '#ff6b6b' },
  imageEditor: { maxFileSize: 10 * 1024 * 1024 }
})

const editor = grapesjs.init({
  container: '#gjs',
  plugins,
  pluginsOpts
})
```

### Method 3: Individual Plugins

```typescript
import grapesjs from 'grapesjs'
import {
  intelligentTextEditor,
  intelligentImageEditor,
  defaultWidthPlugin,
  comprehensiveTraits
} from '~/lib/grapesjs-plugins'

const editor = grapesjs.init({
  container: '#gjs',
  plugins: [
    intelligentTextEditor,
    intelligentImageEditor,
    defaultWidthPlugin,
    comprehensiveTraits
  ],
  pluginsOpts: {
    [intelligentTextEditor.name]: {
      textTags: ['h1', 'h2', 'p', 'span'],
      hoverBorderColor: '#3b82f6'
    },
    [intelligentImageEditor.name]: {
      maxFileSize: 5 * 1024 * 1024
    }
  }
})
```

## Configuration Options

### Intelligent Text Editor Options

```typescript
interface IntelligentTextEditorOptions {
  textTags?: string[] // Default: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label', ...]
  hoverBorderColor?: string // Default: '#3b82f6'
  hoverBorderStyle?: string // Default: '2px dashed'
}
```

### Intelligent Image Editor Options

```typescript
interface IntelligentImageEditorOptions {
  uploadEndpoint?: string // Default: '/api/upload'
  allowedFormats?: string[] // Default: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  maxFileSize?: number // Default: 5 * 1024 * 1024 (5MB)
}
```

### Default Width Plugin Options

```typescript
interface DefaultWidthPluginOptions {
  blockElements?: string[] // Default: ['section', 'div', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'form']
  defaultWidth?: string // Default: '100%'
  applyToExisting?: boolean // Default: true
}
```

### Comprehensive Traits Options

```typescript
interface ComprehensiveTraitsOptions {
  includeAdvanced?: boolean // Default: true
  groupTraits?: boolean // Default: true
}
```

## Keyboard Shortcuts

| Shortcut | Action | Plugin |
|----------|--------|--------|
| `E` | Enable text editing | Text Editor |
| `Ctrl/Cmd + W` | Toggle full width | Default Width |

## User Interactions

### Text Editing
1. **Hover** over text element → Dashed border appears
2. **Double-click** text → Enter edit mode
3. **Type** to edit content
4. **ESC** to cancel or **Enter** to save (single-line) or **Click outside** to save

### Image Editing
1. **Hover** over image → Edit overlay with 📷 icon appears
2. **Click** image → File picker opens
3. **Select** image file → Image replaced instantly
4. Validation errors shown for invalid files

### Full Width Toggle
1. **Select** block element
2. **Click** ↔️ button in toolbar OR press **Ctrl/Cmd + W**
3. Element toggles between 100% width and auto

## Complete Example

```vue
<template>
  <div>
    <div id="gjs" class="grapesjs-editor"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import grapesjs from 'grapesjs'
import { registerAllPlugins } from '~/lib/grapesjs-plugins'

onMounted(() => {
  const editor = grapesjs.init({
    container: '#gjs',
    fromElement: true,
    height: '100vh',
    width: 'auto',

    // Canvas settings
    canvas: {
      styles: [],
      scripts: []
    },

    // Storage
    storageManager: {
      type: 'local',
      autosave: true,
      autoload: true
    },

    // Asset manager
    assetManager: {
      upload: '/api/upload',
      uploadName: 'files'
    },

    // Panels
    panels: {
      defaults: [
        {
          id: 'basic-actions',
          el: '.panel__basic-actions',
          buttons: [
            {
              id: 'visibility',
              active: true,
              className: 'btn-toggle-borders',
              label: '<i class="fa fa-clone"></i>',
              command: 'sw-visibility'
            }
          ]
        }
      ]
    }
  })

  // Register all intelligent editing plugins
  registerAllPlugins(editor, {
    textEditor: {
      hoverBorderColor: '#3b82f6'
    },
    imageEditor: {
      maxFileSize: 10 * 1024 * 1024 // 10MB
    },
    defaultWidth: {
      defaultWidth: '100%'
    },
    traits: {
      groupTraits: true
    }
  })

  // Add initial content
  editor.setComponents(`
    <section style="padding: 40px; background: #f8fafc;">
      <h1>Welcome to Intelligent Editor</h1>
      <p>Double-click this text to edit it inline!</p>
      <img src="https://via.placeholder.com/600x400" alt="Placeholder" />
    </section>
  `)
})
</script>

<style>
.grapesjs-editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
</style>
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ⚠️ Limited (touch events may need adjustments)

## Troubleshooting

### Text editing not working
- Ensure element is in the `textTags` array
- Check if element has `contentEditable` disabled elsewhere
- Verify plugin is loaded: check console for "✅ Intelligent Text Editor plugin loaded"

### Image upload not working
- Check `uploadEndpoint` is correct
- Verify file size is under `maxFileSize`
- Ensure file format is in `allowedFormats`
- Check browser console for validation errors

### Full width not applying
- Verify element is in `blockElements` array
- Check if element has explicit width set elsewhere
- Toggle full-width trait manually in settings panel

### Traits not showing
- Ensure `comprehensive-traits` plugin is loaded
- Check component is selected
- Verify traits panel is visible in UI

## Advanced Customization

### Custom Text Tags
```typescript
registerAllPlugins(editor, {
  textEditor: {
    textTags: ['h1', 'h2', 'p', 'div', 'custom-element']
  }
})
```

### Custom Block Elements
```typescript
registerAllPlugins(editor, {
  defaultWidth: {
    blockElements: ['section', 'div', 'custom-container']
  }
})
```

### Custom Trait Groups
```typescript
registerAllPlugins(editor, {
  traits: {
    groupTraits: true,
    includeAdvanced: true
  }
})
```

## Performance Considerations

- **Image Files:** Keep under 5MB for best performance
- **Trait Updates:** Debounced by GrapesJS, no manual optimization needed
- **DOM Observers:** Plugins use event delegation, minimal overhead

## License

MIT

## Contributing

To add new plugins:

1. Create plugin file in `/app/lib/grapesjs-plugins/`
2. Export from `index.ts`
3. Add to `registerAllPlugins()` function
4. Update this README

## Support

For issues or questions, contact the development team.
