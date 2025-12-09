/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Intelligent Text Editor Plugin
 *
 * Automatically detects and enables inline editing for all text elements.
 * Features:
 * - Auto-detection of text-editable elements (h1-h6, p, span, a, button, li, label, etc.)
 * - Dashed border visual indicators on hover (builder.io style)
 * - Inline text editing with double-click
 * - Text alignment, font size, font weight traits
 */

export interface IntelligentTextEditorOptions {
  textTags?: string[]
  hoverBorderColor?: string
  hoverBorderStyle?: string
}

// Global flag to skip expensive isComponent checks during bulk operations
// This is set by useGrapesJS during page switching/template loading
declare global {
  interface Window {
    __gjsSkipComponentDetection?: boolean
  }
}

/**
 * Check if a DOM element is inside a Custom HTML component
 * Elements inside Custom HTML are handled by smart-components.ts instead
 * This prevents registering them as text-editable type (which would conflict)
 *
 * OPTIMIZED: Only checks the element's own attribute first (fast path)
 * Only traverses parents if the fast check passes
 */
function isInsideCustomHtmlElement(el: HTMLElement): boolean {
  // Fast path: check if element itself has the marker
  if (el.hasAttribute('data-custom-html') || el.getAttribute('data-gjs-type') === 'custom-html-component') {
    return true
  }

  // Only traverse up 3 levels max to avoid deep traversal
  let current: HTMLElement | null = el.parentElement
  let depth = 0
  const maxDepth = 3

  while (current && depth < maxDepth) {
    // Check for data-gjs-type attribute that GrapesJS sets
    const gjsType = current.getAttribute('data-gjs-type')
    if (gjsType === 'custom-html-component') {
      return true
    }
    // Also check for the data-custom-html attribute
    if (current.hasAttribute('data-custom-html')) {
      return true
    }
    current = current.parentElement
    depth++
  }
  return false
}

export default function intelligentTextEditor(editor: any, opts: IntelligentTextEditorOptions = {}) {
  const options = {
    textTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label', 'blockquote', 'cite', 'code', 'pre', 'strong', 'em', 'small'],
    hoverBorderColor: '#3b82f6',
    hoverBorderStyle: '2px dashed',
    ...opts
  }

  const { textTags, hoverBorderColor, hoverBorderStyle } = options

  // Add custom CSS for hover indicators
  const style = document.createElement('style')
  style.innerHTML = `
    .gjs-selected-text-hoverable {
      outline: ${hoverBorderStyle} ${hoverBorderColor} !important;
      outline-offset: 2px;
      cursor: text;
    }

    [contenteditable="true"] {
      outline: 2px solid ${hoverBorderColor} !important;
      outline-offset: 2px;
      cursor: text;
    }
  `
  document.head.appendChild(style)

  // Register text component types
  editor.DomComponents.addType('text-editable', {
    isComponent: (el: HTMLElement) => {
      // CRITICAL: Skip during bulk operations (page switching, template loading)
      // This prevents freezing when loading pages with hundreds of elements
      if (window.__gjsSkipComponentDetection) {
        return false
      }

      // Fast check first - is this even a text tag?
      const tagName = el.tagName?.toLowerCase()
      if (!tagName || !textTags.includes(tagName)) {
        return false
      }

      // Skip elements inside Custom HTML components
      // They are handled by smart-components.ts with special parent-aware editing
      if (isInsideCustomHtmlElement(el)) {
        return false
      }

      return true
    },

    model: {
      defaults: {
        editable: true,
        draggable: true,
        droppable: false,
        selectable: true,
        hoverable: true,

        traits: [
          {
            type: 'select',
            label: 'Text Align',
            name: 'text-align',
            options: [
              { value: 'left', name: 'Left' },
              { value: 'center', name: 'Center' },
              { value: 'right', name: 'Right' },
              { value: 'justify', name: 'Justify' }
            ],
            changeProp: 1
          },
          {
            type: 'select',
            label: 'Font Weight',
            name: 'font-weight',
            options: [
              { value: '300', name: 'Light' },
              { value: '400', name: 'Normal' },
              { value: '500', name: 'Medium' },
              { value: '600', name: 'Semibold' },
              { value: '700', name: 'Bold' },
              { value: '800', name: 'Extra Bold' }
            ],
            changeProp: 1
          },
          {
            type: 'number',
            label: 'Font Size (px)',
            name: 'font-size',
            min: 8,
            max: 200,
            changeProp: 1
          },
          {
            type: 'number',
            label: 'Line Height',
            name: 'line-height',
            min: 1,
            max: 3,
            step: 0.1,
            changeProp: 1
          },
          {
            type: 'color',
            label: 'Text Color',
            name: 'color',
            changeProp: 1
          }
        ]
      },

      init(this: any) {
        this.on('change:text-align', this.updateStyle)
        this.on('change:font-weight', this.updateStyle)
        this.on('change:font-size', this.updateStyle)
        this.on('change:line-height', this.updateStyle)
        this.on('change:color', this.updateStyle)
      },

      updateStyle(this: any) {
        const textAlign = this.get('text-align')
        const fontWeight = this.get('font-weight')
        const fontSize = this.get('font-size')
        const lineHeight = this.get('line-height')
        const color = this.get('color')

        const styles: Record<string, any> = {}

        if (textAlign) styles['text-align'] = textAlign
        if (fontWeight) styles['font-weight'] = fontWeight
        if (fontSize) styles['font-size'] = `${fontSize}px`
        if (lineHeight) styles['line-height'] = lineHeight
        if (color) styles['color'] = color

        this.setStyle(styles)
      }
    },

    view: {
      events: {
        dblclick: 'onDoubleClick',
        mouseenter: 'onMouseEnter',
        mouseleave: 'onMouseLeave'
      },

      onDoubleClick(this: any, ev: MouseEvent) {
        ev.stopPropagation()
        this.enableEditing()
      },

      onMouseEnter(this: any) {
        const el = this.el as HTMLElement
        if (!el.isContentEditable) {
          el.classList.add('gjs-selected-text-hoverable')
        }
      },

      onMouseLeave(this: any) {
        const el = this.el as HTMLElement
        el.classList.remove('gjs-selected-text-hoverable')
      },

      enableEditing(this: any) {
        const el = this.el as HTMLElement
        const model = this.model
        const editor = this.em?.get('Editor') || (window as any).__gjsEditor

        // Store original content for cancel/escape
        const originalContent = el.innerHTML

        // Make element editable
        el.contentEditable = 'true'
        el.focus()

        // Select all text
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)

        // Save on blur
        const onBlur = () => {
          // Get the edited content BEFORE changing contentEditable
          const newContent = el.innerHTML
          const textContent = el.textContent || ''

          // Disable editing
          el.contentEditable = 'false'
          el.classList.remove('gjs-selected-text-hoverable')

          // Only update if content actually changed
          if (newContent !== originalContent) {
            // Use requestAnimationFrame to ensure DOM is stable
            requestAnimationFrame(() => {
              try {
                // Check if this is a simple text node (no child elements except text)
                const hasOnlyText = !el.querySelector('*')
                  || (el.childNodes.length === 1 && el.childNodes[0]?.nodeType === Node.TEXT_NODE)

                if (hasOnlyText && textContent) {
                  // Simple text - update content property directly
                  // Use silent option to prevent immediate re-render
                  model.set('content', textContent, { silent: true })

                  // Manually ensure the DOM shows the text (in case model sync overwrites)
                  if (el.textContent !== textContent) {
                    el.textContent = textContent
                  }
                } else {
                  // Has HTML content - reset components with new content
                  // First clear children silently, then add new content
                  const components = model.components()
                  components.reset()
                  components.add(newContent)

                  // Ensure DOM reflects the change
                  if (el.innerHTML !== newContent) {
                    el.innerHTML = newContent
                  }
                }

                // Trigger change event so GrapesJS knows to save (after DOM is stable)
                model.trigger('change:content')
                console.log('✅ Text content updated successfully')
              } catch (e) {
                console.warn('Failed to update component content:', e)
                // Fallback - at least keep the visual by restoring what user typed
                el.innerHTML = newContent
              }
            })
          }

          el.removeEventListener('blur', onBlur)
          el.removeEventListener('keydown', onKeyDown)
        }

        // Save on Enter key (for single-line text)
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' && !e.shiftKey && ['SPAN', 'A', 'BUTTON', 'LABEL'].includes(el.tagName)) {
            e.preventDefault()
            el.blur()
          }

          // Escape to cancel - restore original content
          if (e.key === 'Escape') {
            el.innerHTML = originalContent
            el.contentEditable = 'false'
            el.classList.remove('gjs-selected-text-hoverable')
            el.removeEventListener('blur', onBlur)
            el.removeEventListener('keydown', onKeyDown)
          }
        }

        el.addEventListener('blur', onBlur)
        el.addEventListener('keydown', onKeyDown)
      }
    }
  })

  // Add command to enable text editing mode
  editor.Commands.add('enable-text-editing', {
    run(editor: any, sender: any, options: any = {}) {
      const selected = editor.getSelected()

      if (selected && textTags.includes(selected.get('tagName')?.toLowerCase())) {
        const view = selected.view
        if (view && view.enableEditing) {
          view.enableEditing()
        }
      }
    }
  })

  // Listen for component selection to auto-enable traits
  editor.on('component:selected', (component: any) => {
    const tagName = component.get('tagName')?.toLowerCase()

    // Skip if inside a Custom HTML component
    let parent = component.parent?.()
    while (parent) {
      if (parent.get?.('type') === 'custom-html-component') {
        return // Don't add text-editable traits to elements inside Custom HTML
      }
      parent = parent.parent?.()
    }

    if (textTags.includes(tagName)) {
      // Auto-add text editing traits if not present
      const existingTraits = component.get('traits')
      const hasTextTraits = existingTraits.some((t: any) => t.name === 'text-align')

      if (!hasTextTraits) {
        component.set('type', 'text-editable')
      }
    }
  })

  // Add keyboard shortcut for editing (E key)
  editor.Keymaps.add('text-edit', 'e', 'enable-text-editing')

  console.log('✅ Intelligent Text Editor plugin loaded')
}
