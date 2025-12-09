# GrapesJS Quick Reference Guide

## Installation (One Command)

```bash
cd /Users/tnorthern/Documents/projects/bh-sass
./nuxt/install-grapesjs.sh
```

## Access the Builder

```
http://localhost:3005/app/website/grapesjs-builder
```

## Basic Usage in Code

### Import and Initialize

```vue
<script setup>
const { initEditor, saveContent } = useGrapesJS()

onMounted(async () => {
  await initEditor('my-editor-container')
})
</script>

<template>
  <div id="my-editor-container" />
</template>
```

## Composable API Reference

### Core Methods

```typescript
// Initialize editor
await initEditor(containerId: string, config?: Partial<EditorConfig>)

// Get editor instance
const editor = getEditor()

// Cleanup
destroyEditor()
```

### Device Management

```typescript
// Change device preview
setDevice('desktop' | 'tablet' | 'mobile')

// Get current device
state.value.selectedDevice // 'desktop' | 'tablet' | 'mobile'
```

### Preview & History

```typescript
// Toggle preview mode
togglePreview()

// Check preview state
state.value.isPreviewMode // boolean

// Undo/Redo
undo()
redo()
```

### Content Management

```typescript
// Get content
const html = getHtml()
const css = getCss()
const js = getJs()

// Save content (returns { html, css, js })
const content = await saveContent()

// Load content
loadContent({ html: '...', css: '...', js: '...' })

// Clear canvas
clearCanvas()
```

## Common Configurations

### Add Custom Blocks

```typescript
await initEditor('editor', {
  blockManager: {
    blocks: [
      {
        id: 'hero-section',
        label: 'Hero Section',
        content: `
          <section style="background: #f97316; padding: 60px 20px; text-align: center;">
            <h1 style="color: white; font-size: 48px;">Welcome</h1>
            <p style="color: white; font-size: 20px;">Your tagline here</p>
          </section>
        `,
        category: 'Sections'
      }
    ]
  }
})
```

### Configure Remote Storage

```typescript
await initEditor('editor', {
  storageManager: {
    type: 'remote',
    urlStore: '/api/website/save',
    urlLoad: '/api/website/load',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  }
})
```

### Add More Plugins

```bash
pnpm add grapesjs-blocks-basic
```

```typescript
import grapesjsBlocksBasic from 'grapesjs-blocks-basic'

await initEditor('editor', {
  plugins: [grapesjsBlocksBasic],
  pluginsOpts: {
    [grapesjsBlocksBasic]: {}
  }
})
```

## CSS Variables for Theming

```css
/* Override in your styles */
.website-builder-wrapper {
  --gjs-primary-color: #f97316;      /* Primary orange */
  --gjs-secondary-color: #ea580c;    /* Darker orange */
  --gjs-tertiary-color: #fb923c;     /* Lighter orange */
}
```

## Common Block Templates

### Call-to-Action Section

```typescript
{
  id: 'cta-section',
  label: 'CTA Section',
  content: `
    <section style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 80px 20px; text-align: center;">
      <h2 style="color: white; font-size: 36px; margin-bottom: 20px;">Ready to Get Started?</h2>
      <p style="color: white; font-size: 18px; margin-bottom: 30px;">Book your bounce house today!</p>
      <a href="#" style="background: white; color: #f97316; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Book Now</a>
    </section>
  `,
  category: 'Sections'
}
```

### Feature Grid

```typescript
{
  id: 'feature-grid',
  label: 'Feature Grid',
  content: `
    <section style="padding: 60px 20px;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
        <div style="text-align: center; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="font-size: 24px; margin-bottom: 10px;">Feature 1</h3>
          <p style="color: #6b7280;">Description here</p>
        </div>
        <div style="text-align: center; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="font-size: 24px; margin-bottom: 10px;">Feature 2</h3>
          <p style="color: #6b7280;">Description here</p>
        </div>
        <div style="text-align: center; padding: 30px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="font-size: 24px; margin-bottom: 10px;">Feature 3</h3>
          <p style="color: #6b7280;">Description here</p>
        </div>
      </div>
    </section>
  `,
  category: 'Sections'
}
```

### Booking Widget Embed

```typescript
{
  id: 'booking-widget',
  label: 'Booking Widget',
  content: `
    <div style="padding: 40px 20px; background: #f9fafb;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 30px;">Book Your Bounce House</h2>
        <iframe
          src="https://app.bouncepro.com/widget/TENANT_SLUG"
          width="100%"
          height="800"
          frameborder="0"
          style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        </iframe>
      </div>
    </div>
  `,
  category: 'BouncePro'
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Delete/Backspace` | Delete selected component |
| `Ctrl/Cmd + C` | Copy component |
| `Ctrl/Cmd + V` | Paste component |
| `Esc` | Deselect component |

## Device Breakpoints

| Device | Width |
|--------|-------|
| Desktop | 100% (no constraint) |
| Tablet | 768px |
| Mobile | 375px |

## Storage Keys (LocalStorage)

| Key | Purpose |
|-----|---------|
| `gjs-components` | HTML components |
| `gjs-styles` | CSS styles |
| `gjs-assets` | Uploaded assets |

## Common Issues & Solutions

### Issue: Editor not loading

**Solution**: Check packages are installed
```bash
docker compose exec nuxt pnpm list | grep grapesjs
```

### Issue: Dark mode not applying

**Solution**: Ensure parent has dark class
```vue
<div class="dark">
  <div id="grapesjs-editor" />
</div>
```

### Issue: Content not saving

**Solution**: Check localStorage quota
```javascript
// In browser console
Object.keys(localStorage).filter(k => k.startsWith('gjs-'))
```

### Issue: SSR error

**Solution**: Ensure client-side only
```typescript
if (import.meta.client) {
  await initEditor('editor')
}
```

## Export Examples

### Export HTML with CSS

```typescript
const exportFullHtml = async () => {
  const { html, css, js } = await saveContent()

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  ${js ? `<script>${js}</script>` : ''}
</body>
</html>`

  // Download
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'website.html'
  a.click()
  URL.revokeObjectURL(url)
}
```

### Save to Backend

```typescript
const saveToBackend = async () => {
  const content = await saveContent()
  const tenantId = useTenantId()

  await $fetch(`/api/tenants/${tenantId.value}/website`, {
    method: 'POST',
    body: content
  })
}
```

## Style Manager Sections

### Typography Properties

- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `color`
- `text-align`
- `text-decoration`
- `text-shadow`

### Layout Properties

- `display`
- `position`
- `float`
- `top/right/bottom/left`
- `width/height`
- `min-width/min-height`
- `max-width/max-height`
- `margin/padding`

### Flexbox Properties

- `display: flex`
- `flex-direction`
- `justify-content`
- `align-items`
- `flex-grow/shrink/basis`
- `order`

### Visual Properties

- `background` (color, gradient, image)
- `border` (width, style, color, radius)
- `box-shadow`
- `opacity`
- `transform`
- `transition`

## Command IDs (Built-in)

```typescript
const editor = getEditor()

// Preview
editor.Commands.run('preview')
editor.Commands.stop('preview')

// Fullscreen
editor.Commands.run('fullscreen')
editor.Commands.stop('fullscreen')

// Export
editor.Commands.run('export-template')

// Clear canvas
editor.Commands.run('canvas-clear')

// Open code
editor.Commands.run('open-code')
```

## Event Listeners

```typescript
const editor = getEditor()

// Component events
editor.on('component:selected', (component) => {
  console.log('Selected:', component)
})

editor.on('component:deselected', (component) => {
  console.log('Deselected:', component)
})

// Storage events
editor.on('storage:start:store', () => {
  console.log('Saving...')
})

editor.on('storage:end:store', () => {
  console.log('Saved!')
})

// Load events
editor.on('load', () => {
  console.log('Editor loaded')
})
```

## Component Manipulation

```typescript
const editor = getEditor()

// Get selected component
const selected = editor.getSelected()

// Add component
const wrapper = editor.getWrapper()
wrapper.append('<div>New content</div>')

// Remove component
selected.remove()

// Clone component
const clone = selected.clone()

// Get/Set attributes
selected.addAttributes({ class: 'my-class' })
selected.setId('my-id')

// Get/Set style
selected.setStyle({ color: 'red' })
const styles = selected.getStyle()
```

## Useful Resources

- **Main Docs**: https://grapesjs.com/docs/
- **API Docs**: https://grapesjs.com/docs/api/
- **Demos**: https://grapesjs.com/demo.html
- **Plugins**: https://grapesjs.com/docs/plugins.html
- **GitHub**: https://github.com/GrapesJS/grapesjs

## Pro Tips

1. **Use Component IDs**: Easier to manipulate via API
2. **Test on All Devices**: Always check mobile responsiveness
3. **Save Frequently**: Don't rely only on auto-save
4. **Use Templates**: Create reusable section templates
5. **Optimize Images**: Compress before uploading
6. **Clean CSS**: Remove unused styles periodically
7. **Version Control**: Export HTML backups regularly
8. **Browser Testing**: Test in Chrome, Firefox, Safari

## Quick Checklist

- [ ] Install packages: `./nuxt/install-grapesjs.sh`
- [ ] Access page: `http://localhost:3005/app/website/grapesjs-builder`
- [ ] Dark mode working
- [ ] Can drag blocks
- [ ] Can edit content
- [ ] Can save content
- [ ] Can export HTML
- [ ] Device toggle works
- [ ] Preview mode works
- [ ] Undo/redo functional
- [ ] Content persists on refresh

## Need Help?

1. Check browser console for errors
2. Review `GRAPES_SETUP.md` for detailed setup
3. See `ARCHITECTURE.md` for system design
4. Check GrapesJS official docs
5. Look at example implementations in the demo

---

**Last Updated**: 2025-12-06
**Version**: 1.0.0
