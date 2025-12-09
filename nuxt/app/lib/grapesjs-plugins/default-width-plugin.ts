/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Default Width Plugin
 *
 * Sets 100% width as default for all block-level elements.
 * Features:
 * - Applies to: section, div, article, header, footer, main, aside, nav
 * - Overrides default GrapesJS sizing behavior
 * - Ensures blocks span full width when dropped
 */

export interface DefaultWidthPluginOptions {
  blockElements?: string[]
  defaultWidth?: string
  applyToExisting?: boolean
}

export default function defaultWidthPlugin(editor: any, opts: DefaultWidthPluginOptions = {}) {
  const options = {
    blockElements: ['section', 'div', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'form'],
    defaultWidth: '100%',
    applyToExisting: true,
    ...opts
  }

  const { blockElements, defaultWidth, applyToExisting } = options

  // Override default component model to include width
  blockElements.forEach((tagName) => {
    const existingType = editor.DomComponents.getType(tagName)

    editor.DomComponents.addType(tagName, {
      extend: existingType?.id || 'default',

      model: {
        defaults: {
          ...(existingType?.model?.prototype?.defaults || {}),
          style: {
            ...(existingType?.model?.prototype?.defaults?.style || {}),
            width: defaultWidth
          },
          traits: [
            ...(existingType?.model?.prototype?.defaults?.traits || []),
            {
              type: 'checkbox',
              label: 'Full Width',
              name: 'full-width',
              changeProp: 1,
              value: true
            }
          ]
        },

        init(this: any) {
          // Call parent init if exists
          if (existingType?.model?.prototype?.init) {
            existingType.model.prototype.init.call(this)
          }

          // Listen for full-width trait changes
          this.on('change:full-width', this.handleFullWidthChange)

          // Set initial width
          if (!this.getStyle('width')) {
            this.setStyle({ width: defaultWidth })
          }
        },

        handleFullWidthChange(this: any) {
          const isFullWidth = this.get('full-width')

          if (isFullWidth) {
            this.setStyle({ width: defaultWidth })
          } else {
            this.setStyle({ width: 'auto' })
          }
        }
      }
    })
  })

  // Apply to existing components on load
  if (applyToExisting) {
    editor.on('load', () => {
      const wrapper = editor.DomComponents.getWrapper()

      wrapper?.onAll((component: any) => {
        const tagName = component.get('tagName')?.toLowerCase()

        if (blockElements.includes(tagName)) {
          const currentWidth = component.getStyle('width')

          // Only set width if not already set
          if (!currentWidth || currentWidth === 'auto') {
            component.setStyle({ width: defaultWidth })
            component.set('full-width', true)
          }
        }
      })
    })
  }

  // Apply to newly added components
  editor.on('component:add', (component: any) => {
    const tagName = component.get('tagName')?.toLowerCase()

    if (blockElements.includes(tagName)) {
      // Set default width on newly added components
      setTimeout(() => {
        const currentWidth = component.getStyle('width')

        if (!currentWidth || currentWidth === 'auto') {
          component.setStyle({ width: defaultWidth })
          component.set('full-width', true)
        }
      }, 10)
    }
  })

  // Add command to toggle full width
  editor.Commands.add('toggle-full-width', {
    run(editor: any) {
      const selected = editor.getSelected()

      if (selected) {
        const tagName = selected.get('tagName')?.toLowerCase()

        if (blockElements.includes(tagName)) {
          const isFullWidth = selected.get('full-width')
          selected.set('full-width', !isFullWidth)
        }
      }
    }
  })

  // Add toolbar button for full width toggle
  editor.on('component:selected', (component: any) => {
    const tagName = component.get('tagName')?.toLowerCase()

    if (blockElements.includes(tagName)) {
      const toolbar = component.get('toolbar')

      // Add full-width toggle button if not present
      const hasToggle = toolbar?.some((btn: any) => btn.command === 'toggle-full-width')

      if (!hasToggle) {
        component.set('toolbar', [
          ...(toolbar || []),
          {
            label: '↔️',
            command: 'toggle-full-width',
            attributes: { title: 'Toggle Full Width' }
          }
        ])
      }
    }
  })

  // Add keyboard shortcut (Ctrl/Cmd + W)
  editor.Keymaps.add('toggle-full-width', '⌘+w, ctrl+w', 'toggle-full-width', {
    prevent: true
  })

  // Add custom CSS for visual indicator
  const style = document.createElement('style')
  style.innerHTML = `
    .gjs-full-width-indicator {
      position: relative;
    }

    .gjs-full-width-indicator::before {
      content: '100%';
      position: absolute;
      top: 0;
      right: 0;
      background: rgba(59, 130, 246, 0.8);
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 0 0 0 4px;
      pointer-events: none;
      z-index: 1000;
    }
  `
  document.head.appendChild(style)

  // Add visual indicator for full-width elements in edit mode
  editor.on('component:update', (component: any) => {
    const tagName = component.get('tagName')?.toLowerCase()

    if (blockElements.includes(tagName)) {
      const isFullWidth = component.get('full-width')
      const el = component.view?.el

      if (el) {
        if (isFullWidth) {
          el.classList.add('gjs-full-width-indicator')
        } else {
          el.classList.remove('gjs-full-width-indicator')
        }
      }
    }
  })

  console.log('✅ Default Width plugin loaded')
  console.log(`   Applied to: ${blockElements.join(', ')}`)
  console.log(`   Default width: ${defaultWidth}`)
}
