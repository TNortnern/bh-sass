# GrapesJS Website Builder Setup

## Installation Required

Before using the GrapesJS website builder, you need to install the required packages:

```bash
cd /Users/tnorthern/Documents/projects/bh-sass/nuxt
pnpm add grapesjs grapesjs-preset-webpage
```

Or using Docker:

```bash
docker compose exec nuxt pnpm add grapesjs grapesjs-preset-webpage
docker compose up nuxt --build -d
```

## Files Created

### 1. Composable: `app/composables/useGrapesJS.ts`

Provides the main GrapesJS functionality:

- **`initEditor(containerId, config?)`** - Initialize the editor with custom config
- **`getEditor()`** - Get the editor instance
- **`setDevice(device)`** - Change device preview (desktop/tablet/mobile)
- **`togglePreview()`** - Toggle preview mode
- **`undo()`** - Undo last action
- **`redo()`** - Redo last undone action
- **`getHtml()`** - Get current HTML
- **`getCss()`** - Get current CSS
- **`getJs()`** - Get current JavaScript
- **`saveContent()`** - Save content to localStorage and return { html, css, js }
- **`loadContent(data)`** - Load content from saved data
- **`clearCanvas()`** - Clear all content
- **`destroyEditor()`** - Cleanup editor instance

### 2. Plugin: `plugins/grapesjs.client.ts`

Ensures GrapesJS is only loaded on the client side. The plugin is minimal as the actual import is done dynamically in the composable.

### 3. Page: `app/pages/app/website/grapesjs-builder.vue`

Full-featured website builder page with:

- **Top Toolbar**: Undo/Redo, Device toggles, Preview, Export, Save
- **Left Sidebar**: Block manager with drag-and-drop blocks
- **Main Canvas**: Visual editor area
- **Right Sidebar**: Layers panel and Style manager

## Features

### Device Preview Modes

- Desktop (full width)
- Tablet (768px)
- Mobile (375px)

### Block Categories

- **Layout**: Sections, containers
- **Basic**: Text, images
- **Media**: Video, maps

### Style Manager Sections

- General (display, position, float)
- Dimension (width, height, margin, padding)
- Typography (fonts, colors, alignment)
- Decorations (borders, shadows, backgrounds)
- Flex (flexbox properties)
- Extra (transforms, transitions)

### Storage

Content is automatically saved to localStorage using GrapesJS's built-in storage manager:

- Auto-save enabled
- Auto-load on page refresh
- Manual save via "Save" button

### Export

Click the "Export" button to download a complete HTML file with embedded CSS and JavaScript.

## Dark Mode Support

The builder includes comprehensive dark mode styling that matches the BouncePro dashboard theme:

- Dark panels and sidebars
- Orange primary color (#f97316)
- Smooth transitions
- Custom scrollbars

## Usage Example

```vue
<script setup>
const { initEditor, saveContent, getHtml, getCss } = useGrapesJS()

onMounted(async () => {
  await initEditor('grapesjs-editor')
})

const handleSave = async () => {
  const content = await saveContent()
  console.log('HTML:', content.html)
  console.log('CSS:', content.css)
  console.log('JS:', content.js)
}
</script>
```

## Default Configuration

The editor comes pre-configured with:

- 100% width for block elements
- Auto-save and auto-load
- Local storage persistence
- Responsive device manager
- Complete style manager
- Block manager with common blocks
- Layer manager for component hierarchy

## Extending the Editor

You can extend the editor by passing custom configuration to `initEditor()`:

```typescript
await initEditor('grapesjs-editor', {
  // Add custom blocks
  blockManager: {
    blocks: [
      {
        id: 'custom-block',
        label: 'Custom Block',
        content: '<div>Custom content</div>',
        category: 'Custom'
      }
    ]
  },

  // Add custom commands
  commands: {
    defaults: [
      {
        id: 'custom-command',
        run(editor) {
          // Custom logic
        }
      }
    ]
  },

  // Custom storage
  storageManager: {
    type: 'remote',
    urlStore: '/api/save-website',
    urlLoad: '/api/load-website'
  }
})
```

## Additional Plugins

GrapesJS has many community plugins you can add:

- `grapesjs-blocks-basic` - More basic blocks
- `grapesjs-navbar` - Navbar component
- `grapesjs-component-countdown` - Countdown timer
- `grapesjs-tabs` - Tab components
- `grapesjs-custom-code` - Custom code component
- `grapesjs-tooltip` - Tooltip component
- `grapesjs-typed` - Typed text animation
- `grapesjs-style-gradient` - Gradient backgrounds
- `grapesjs-style-filter` - CSS filters

Install additional plugins:

```bash
pnpm add grapesjs-blocks-basic
```

Then add to your editor config:

```typescript
import grapesjsBlocksBasic from 'grapesjs-blocks-basic'

await initEditor('grapesjs-editor', {
  plugins: [grapesjsBlocksBasic],
  pluginsOpts: {
    [grapesjsBlocksBasic]: {
      // Plugin options
    }
  }
})
```

## Troubleshooting

### Editor not initializing

- Ensure packages are installed: `pnpm add grapesjs grapesjs-preset-webpage`
- Check browser console for errors
- Verify container element exists before calling `initEditor()`

### Styles not applying

- Make sure you're importing the CSS in the page component
- Check that dark mode classes are being applied
- Verify Tailwind classes aren't conflicting

### Content not persisting

- Check browser localStorage (DevTools > Application > Local Storage)
- Verify `storageManager` is configured correctly
- Call `saveContent()` or rely on auto-save

## Resources

- [GrapesJS Documentation](https://grapesjs.com/docs/)
- [GrapesJS GitHub](https://github.com/GrapesJS/grapesjs)
- [GrapesJS Preset Webpage](https://github.com/GrapesJS/preset-webpage)
- [GrapesJS Community Plugins](https://grapesjs.com/docs/plugins.html)
