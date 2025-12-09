# GrapesJS Website Builder Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Nuxt 4 Application                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Dashboard Layout (layout: 'dashboard')                │   │
│  │  - Sidebar Navigation                                  │   │
│  │  - Top Header with User Menu                          │   │
│  │  - Breadcrumbs                                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  /app/website/grapesjs-builder.vue                     │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │ Top Toolbar                                      │  │   │
│  │  │ - Undo/Redo   - Device Toggle   - Preview/Save │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────┬───────────────────────┬──────────────┐  │   │
│  │  │ Blocks   │   Main Canvas         │   Sidebar    │  │   │
│  │  │ Panel    │   (GrapesJS Editor)   │   - Layers   │  │   │
│  │  │          │                       │   - Styles   │  │   │
│  │  │ #blocks  │   #grapesjs-editor    │   #layers    │  │   │
│  │  │          │                       │   #styles    │  │   │
│  │  └──────────┴───────────────────────┴──────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Composable: useGrapesJS()                             │   │
│  │                                                         │   │
│  │  State Management:                                     │   │
│  │  - editor: Editor | null                               │   │
│  │  - isReady: boolean                                    │   │
│  │  - selectedDevice: string                              │   │
│  │  - isPreviewMode: boolean                              │   │
│  │                                                         │   │
│  │  Methods:                                              │   │
│  │  - initEditor(containerId, config)                     │   │
│  │  - setDevice(device)                                   │   │
│  │  - togglePreview()                                     │   │
│  │  - undo() / redo()                                     │   │
│  │  - saveContent() / loadContent()                       │   │
│  │  - getHtml() / getCss() / getJs()                      │   │
│  │  - destroyEditor()                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Plugin: grapesjs.client.ts                            │   │
│  │  - Ensures client-side only loading                    │   │
│  │  - No SSR conflicts                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────────┐
│  GrapesJS Libraries (Client-Side Only)                        │
│                                                                │
│  ┌──────────────────────┐    ┌───────────────────────────┐   │
│  │  grapesjs            │    │ grapesjs-preset-webpage   │   │
│  │  - Core Editor       │    │ - Additional Blocks       │   │
│  │  - Block Manager     │    │ - Webpage Templates       │   │
│  │  - Style Manager     │    │ - Import/Export Features  │   │
│  │  - Layer Manager     │    └───────────────────────────┘   │
│  │  - Device Manager    │                                     │
│  │  - Storage Manager   │                                     │
│  └──────────────────────┘                                     │
└───────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────┐
│  Storage Layer                                                 │
│                                                                │
│  ┌──────────────────────┐    ┌───────────────────────────┐   │
│  │  LocalStorage        │    │  Backend API (Future)     │   │
│  │  - Auto-save         │    │  - PostgreSQL Storage     │   │
│  │  - Auto-load         │    │  - Version Control        │   │
│  │  - gjs-* keys        │    │  - Multi-page Support     │   │
│  └──────────────────────┘    └───────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

### Initialization Flow

```
User navigates to /app/website/grapesjs-builder
            ▼
Page component mounts (onMounted)
            ▼
Calls useGrapesJS().initEditor('grapesjs-editor')
            ▼
Composable checks if client-side (import.meta.client)
            ▼
Dynamic import: import('grapesjs')
            ▼
Initialize editor with config:
  - Container: #grapesjs-editor
  - Plugins: grapesjs-preset-webpage
  - Panels: Blocks, Layers, Styles
  - Device Manager: Desktop/Tablet/Mobile
  - Storage: LocalStorage (auto-save/load)
            ▼
Editor fires 'load' event
            ▼
Set wrapper default styles (100% width, min-height: 100vh)
            ▼
Set state.isReady = true
            ▼
Show success toast notification
            ▼
User can start building
```

### Edit Flow

```
User drags block from left sidebar
            ▼
GrapesJS adds component to canvas
            ▼
User clicks component to select
            ▼
Right sidebar shows:
  - Layers panel (component tree)
  - Styles panel (CSS properties)
            ▼
User modifies styles or content
            ▼
GrapesJS updates internal model
            ▼
Auto-save triggers after N steps
            ▼
Content saved to localStorage
```

### Save Flow

```
User clicks "Save" button
            ▼
handleSave() called
            ▼
Calls useGrapesJS().saveContent()
            ▼
Composable calls:
  - editor.getHtml()
  - editor.getCss()
  - editor.getJs()
  - editor.store() (localStorage)
            ▼
Returns { html, css, js }
            ▼
(Future) Send to backend API:
  POST /api/tenants/{tenantId}/website
  Body: { html, css, js }
            ▼
Show success toast
```

### Export Flow

```
User clicks "Export" button
            ▼
exportHtml() called
            ▼
Calls saveContent() to get { html, css, js }
            ▼
Creates complete HTML document:
  <!DOCTYPE html>
  <html>
    <head>
      <style>{css}</style>
    </head>
    <body>
      {html}
      <script>{js}</script>
    </body>
  </html>
            ▼
Create Blob and download link
            ▼
Trigger download: website.html
            ▼
Show success toast
```

### Device Preview Flow

```
User clicks device button (Desktop/Tablet/Mobile)
            ▼
handleDeviceChange(deviceId) called
            ▼
Calls setDevice(deviceId)
            ▼
Composable calls editor.setDevice(deviceId)
            ▼
GrapesJS adjusts canvas width:
  - Desktop: 100% (no constraint)
  - Tablet: 768px
  - Mobile: 375px
            ▼
Update state.selectedDevice
            ▼
Button shows active state
```

## Component Breakdown

### Page Component Structure

```vue
<template>
  <div class="website-builder-wrapper">
    <!-- Top Toolbar -->
    <div class="toolbar">
      <div class="left-actions">
        <UButton @click="undo" icon="i-lucide-undo" />
        <UButton @click="redo" icon="i-lucide-redo" />
        <DeviceToggle @change="setDevice" />
      </div>
      <div class="right-actions">
        <UButton @click="togglePreview" label="Preview" />
        <UButton @click="exportHtml" label="Export" />
        <UButton @click="handleSave" label="Save" />
      </div>
    </div>

    <!-- Main Layout -->
    <div class="editor-layout">
      <!-- Left Sidebar -->
      <div class="blocks-sidebar">
        <div id="blocks-container" />
      </div>

      <!-- Canvas -->
      <div class="canvas-area">
        <div id="grapesjs-editor" />
      </div>

      <!-- Right Sidebar -->
      <div class="layers-styles-sidebar">
        <div id="layers-container" />
        <div id="styles-container" />
      </div>
    </div>
  </div>
</template>
```

### Composable State Management

```typescript
// Reactive state
const state = ref<GrapesJSState>({
  editor: null,          // GrapesJS editor instance
  isReady: false,        // Editor initialization status
  selectedDevice: 'desktop',  // Current device preview
  isPreviewMode: false   // Preview mode toggle
})

// Initialization
const initEditor = async (containerId: string, config?: Partial<EditorConfig>) => {
  if (import.meta.client) {
    const grapesjs = (await import('grapesjs')).default
    const preset = (await import('grapesjs-preset-webpage')).default

    state.value.editor = grapesjs.init({
      container: `#${containerId}`,
      plugins: [preset],
      // ... configuration
    })

    state.value.editor.on('load', () => {
      state.value.isReady = true
    })
  }
}
```

## File Organization

```
nuxt/
├── app/
│   ├── composables/
│   │   └── useGrapesJS.ts         # Core logic & state management
│   └── pages/
│       └── app/
│           └── website/
│               ├── grapesjs-builder.vue   # Main builder page
│               ├── GRAPES_SETUP.md        # Setup documentation
│               └── ARCHITECTURE.md        # This file
├── plugins/
│   └── grapesjs.client.ts         # Client-side initialization
└── install-grapesjs.sh            # Installation script
```

## Configuration Architecture

### Editor Configuration Layers

```
1. Default Configuration (in composable)
   - Basic setup for all instances
   - Standard panels and managers
   - Default blocks and plugins
            ▼
2. Page-Specific Configuration (in initEditor call)
   - Custom blocks
   - Additional plugins
   - Storage settings
            ▼
3. Runtime Configuration (via methods)
   - Dynamic device changes
   - Preview toggles
   - Content loading
```

### Storage Architecture

```
┌─────────────────────────────────────────────┐
│  Storage Manager                            │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Local Storage (Current)           │    │
│  │  - Key: gjs-components-{id}        │    │
│  │  - Key: gjs-styles-{id}            │    │
│  │  - Key: gjs-assets-{id}            │    │
│  │  - Auto-save every N steps         │    │
│  │  - Auto-load on init               │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  Remote Storage (Future)           │    │
│  │  - POST /api/save-website          │    │
│  │  - GET /api/load-website           │    │
│  │  - Custom headers (auth token)     │    │
│  │  - Version control                 │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Styling Architecture

### Dark Mode Implementation

```css
/* CSS Variables */
--gjs-primary-color: #f97316      /* Orange - BouncePro brand */
--gjs-secondary-color: #ea580c
--gjs-tertiary-color: #fb923c

/* Background Layers (Dark Mode) */
.dark .gjs-one-bg    → #111827   /* Darkest - Main panels */
.dark .gjs-two-bg    → #1f2937   /* Dark - Inputs, fields */
.dark .gjs-three-bg  → #374151   /* Medium - Hover states */
.dark .gjs-four-bg   → #4b5563   /* Light - Borders */

/* Text Colors (Dark Mode) */
.dark .gjs-one-color   → #f9fafb   /* Brightest - Headers */
.dark .gjs-two-color   → #e5e7eb   /* Bright - Body text */
.dark .gjs-three-color → #d1d5db   /* Medium - Labels */
.dark .gjs-four-color  → #9ca3af   /* Dim - Placeholders */
```

### Component Styling Hierarchy

```
Page Wrapper (.website-builder-wrapper)
  ├── Top Toolbar (.bg-white .dark:bg-gray-900)
  ├── Main Layout (.flex)
  │   ├── Left Sidebar (.bg-white .dark:bg-gray-900)
  │   │   └── Blocks Container (#blocks-container)
  │   │       └── GrapesJS Blocks (.gjs-block)
  │   ├── Canvas Area (.bg-gray-100 .dark:bg-gray-950)
  │   │   └── Editor Container (#grapesjs-editor)
  │   │       └── GrapesJS Canvas (.gjs-cv-canvas)
  │   └── Right Sidebar (.bg-white .dark:bg-gray-900)
  │       ├── Layers Container (#layers-container)
  │       │   └── GrapesJS Layers (.gjs-layer)
  │       └── Styles Container (#styles-container)
  │           └── GrapesJS Style Manager (.gjs-sm-sector)
```

## Extension Points

### 1. Custom Blocks

```typescript
// Add via editor config
blockManager: {
  blocks: [
    {
      id: 'custom-block-id',
      label: 'Custom Block',
      content: '<div>HTML content</div>',
      category: 'Custom Category',
      attributes: { class: 'custom-class' }
    }
  ]
}
```

### 2. Custom Commands

```typescript
// Add via editor config
commands: {
  defaults: [
    {
      id: 'custom-command',
      run(editor, sender, options) {
        // Command logic
      },
      stop(editor, sender, options) {
        // Stop logic
      }
    }
  ]
}
```

### 3. Custom Plugins

```typescript
// Create plugin function
const myPlugin = (editor, options = {}) => {
  editor.on('load', () => {
    // Plugin initialization
  })
}

// Add to editor config
plugins: [myPlugin],
pluginsOpts: {
  [myPlugin]: { /* options */ }
}
```

### 4. Custom Storage

```typescript
// Implement custom storage type
storageManager: {
  type: 'custom-storage',
  id: 'custom-',

  // Define custom methods
  store(data, callback) {
    // Save to your backend
    fetch('/api/save', { body: data })
      .then(() => callback())
  },

  load(keys, callback) {
    // Load from your backend
    fetch('/api/load')
      .then(res => res.json())
      .then(data => callback(data))
  }
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: GrapesJS loaded only when page mounts
2. **Client-Side Only**: No SSR overhead
3. **Auto-Save Throttling**: Save after N steps, not every change
4. **Component Cleanup**: Destroy editor on unmount
5. **Dynamic Imports**: Libraries loaded on-demand

### Memory Management

```typescript
onUnmounted(() => {
  // Critical: Cleanup editor instance
  destroyEditor()
  // Prevents memory leaks
})
```

## Security Considerations

### XSS Protection

- Sanitize user input before rendering
- Use CSP headers for iframe content
- Validate HTML/CSS/JS before saving

### Storage Security

- Encrypt sensitive data before storage
- Validate data on load
- Implement CSRF protection for remote storage

### Access Control

- Authenticate API requests
- Validate tenant ownership
- Implement rate limiting

## Future Architecture Enhancements

### Multi-Page Support

```
Tenant Website
├── Page 1 (Home)
│   ├── html
│   ├── css
│   └── js
├── Page 2 (About)
│   ├── html
│   ├── css
│   └── js
└── Page 3 (Contact)
    ├── html
    ├── css
    └── js
```

### Template System

```
Template Library
├── Templates (read-only)
│   ├── Modern Landing
│   ├── Classic Business
│   └── E-commerce
└── User Templates (tenant-specific)
    ├── My Custom Template 1
    └── My Custom Template 2
```

### Version Control

```
Website Versions
├── v1 (2025-12-01 10:00)
├── v2 (2025-12-02 14:30) ← Published
└── v3 (2025-12-03 16:45) ← Draft
```

This architecture provides a solid foundation for building and extending the GrapesJS website builder within the BouncePro platform.
