/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Smart Component Detection for GrapesJS
 *
 * This module makes ALL text and image elements automatically editable
 * without requiring users to know HTML. It attaches event handlers directly
 * to DOM elements in the canvas iframe.
 *
 * Key principle: Attach handlers to actual DOM elements, handle re-renders
 */

// Text-containing elements that should be editable
const TEXT_ELEMENTS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'P', 'SPAN', 'A', 'BUTTON', 'LABEL',
  'LI', 'TD', 'TH', 'BLOCKQUOTE', 'CITE',
  'FIGCAPTION', 'CAPTION', 'LEGEND',
  'STRONG', 'EM', 'B', 'I', 'U', 'S',
  'SMALL', 'MARK', 'DEL', 'INS', 'SUB', 'SUP'
])

// Use a global symbol to mark processed elements (survives across WeakSet issues)
const PROCESSED_MARKER = '__smartComponentProcessed'

/**
 * Find the parent Custom HTML component if this component is inside one
 * Returns the Custom HTML component or null if not inside one
 */
function findParentCustomHtml(component: any): any {
  let current = component.parent?.()
  while (current) {
    const type = current.get?.('type')
    if (type === 'custom-html-component') {
      return current
    }
    current = current.parent?.()
  }
  return null
}

/**
 * Initialize smart component detection
 * This enables double-click editing for ALL text and images
 */
export function initializeSmartComponents(editor: any) {
  console.log('🔧 Initializing smart components...')

  // Process components immediately and on multiple retries
  // The 'load' event may have already fired by the time this is called
  console.log('📦 Scheduling component processing...')

  // Immediate processing with multiple retries
  setTimeout(() => processAllComponentsRobust(editor), 100)
  setTimeout(() => processAllComponentsRobust(editor), 500)
  setTimeout(() => processAllComponentsRobust(editor), 1500)
  setTimeout(() => processAllComponentsRobust(editor), 3000)

  // Also listen for load event in case editor hasn't loaded yet
  editor.on('load', () => {
    console.log('📦 Editor load event fired, processing components...')
    setTimeout(() => processAllComponentsRobust(editor), 100)
  })

  // Process when new components are added
  editor.on('component:add', (component: any) => {
    setTimeout(() => {
      try {
        processComponentRobust(component, editor)
      } catch (e) {
        console.warn('Error processing added component:', e)
      }
    }, 50)
  })

  // Reprocess on canvas drop
  editor.on('canvas:drop', () => {
    setTimeout(() => processAllComponentsRobust(editor), 100)
  })

  // Reprocess when frame changes (page switch)
  editor.on('canvas:frame:load', () => {
    setTimeout(() => processAllComponentsRobust(editor), 200)
  })

  console.log('✅ Smart component detection initialized')
  console.log('   - Text: double-click to edit (dashed blue border on hover)')
  console.log('   - Images: double-click to replace (solid blue border on hover)')

  return editor
}

/**
 * Process a single component (robust version)
 */
function processComponentRobust(component: any, editor: any) {
  try {
    const el = component.getEl()
    if (!el) return

    // Check if already processed using marker property
    if ((el as any)[PROCESSED_MARKER]) return

    // Skip elements inside Custom HTML components entirely
    // Users should double-click on the Custom HTML container to open the code editor
    const parentCustomHtml = findParentCustomHtml(component)
    if (parentCustomHtml) {
      // Mark as processed so we don't keep checking
      ;(el as any)[PROCESSED_MARKER] = true
      return
    }

    const tagName = el.tagName?.toUpperCase()

    // Make text elements editable
    if (TEXT_ELEMENTS.has(tagName)) {
      makeTextEditableRobust(component, el, editor)
    }

    // Make images editable
    if (tagName === 'IMG') {
      makeImageEditableRobust(component, el, editor)
      console.log('📸 Registered image element for editing')
    }
  } catch (e) {
    console.warn('Error processing component:', e)
  }
}

/**
 * Process all components in the editor (robust version)
 */
function processAllComponentsRobust(editor: any) {
  try {
    const wrapper = editor.getWrapper?.() || editor.DomComponents?.getWrapper()
    if (!wrapper) {
      console.warn('⚠️ No wrapper found for smart components')
      return
    }

    // Process wrapper's direct components and all descendants
    const allComponents = wrapper.find('*')
    let processed = 0

    allComponents.forEach((component: any) => {
      const el = component.getEl()
      if (el && !(el as any)[PROCESSED_MARKER]) {
        processComponentRobust(component, editor)
        processed++
      }
    })

    if (processed > 0) {
      console.log(`✅ Processed ${processed} new components for smart editing`)
    }
  } catch (e) {
    console.error('Error in processAllComponentsRobust:', e)
  }
}

/**
 * Make a text element editable with visual feedback (robust version)
 */
function makeTextEditableRobust(component: any, el: HTMLElement, editor: any) {
  // Mark as processed
  ;(el as any)[PROCESSED_MARKER] = true

  // Enable GrapesJS editing properties
  try {
    component.set({
      editable: true,
      textable: true,
      highlightable: true
    })
  } catch (e) {
    // Component might not support these properties
  }

  // Style for hover effect
  el.style.transition = 'outline 0.15s ease'

  // Store original content for potential restore
  const originalContent = el.innerHTML

  // Hover handlers - show dashed border
  const handleMouseEnter = () => {
    if (el.getAttribute('contenteditable') !== 'true') {
      el.style.outline = '2px dashed #3b82f6'
      el.style.outlineOffset = '2px'
      el.style.cursor = 'text'
    }
  }

  const handleMouseLeave = () => {
    if (el.getAttribute('contenteditable') !== 'true') {
      el.style.outline = 'none'
      el.style.cursor = ''
    }
  }

  // Double-click to enable editing
  const handleDblClick = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    // Enable contenteditable for inline editing
    el.setAttribute('contenteditable', 'true')
    el.focus()

    // Select all text for easy replacement
    try {
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = el.ownerDocument?.defaultView?.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    } catch (e) {
      // Selection might fail in some cases
    }

    // Update visual state - solid border when editing
    el.style.outline = '2px solid #3b82f6'
    el.style.outlineOffset = '2px'

    console.log('📝 Text editing enabled for:', el.tagName)
  }

  // Handle blur - save content and disable editing
  const handleBlur = () => {
    const newContent = el.innerHTML
    const newTextContent = el.textContent || ''

    // Remove editing state FIRST
    el.removeAttribute('contenteditable')
    el.style.outline = 'none'
    el.style.cursor = ''

    // Only update if content changed
    if (newContent !== originalContent) {
      console.log('💾 Saving text content:', newTextContent.substring(0, 50))

      try {
        // Check if this element contains only text (no nested HTML elements)
        const hasOnlyText = el.childNodes.length <= 1
          && (!el.firstChild || el.firstChild.nodeType === Node.TEXT_NODE)

        if (hasOnlyText) {
          // For simple text, update the content property silently (no re-render)
          component.set('content', newTextContent, { silent: true })
          // Ensure DOM still shows the text
          if (el.textContent !== newTextContent) {
            el.textContent = newTextContent
          }
        } else {
          // For HTML content, we need to be more careful
          // First set content silently
          component.set('content', '', { silent: true })
          // Then replace children carefully
          const children = component.components()
          if (children && typeof children.reset === 'function') {
            children.reset(newContent, { silent: true })
          }
          // Ensure DOM reflects the content
          if (el.innerHTML !== newContent) {
            el.innerHTML = newContent
          }
        }

        // Trigger change event for GrapesJS to know content changed (for saving)
        component.trigger('change')
        console.log('💾 Text content saved successfully')
      } catch (e) {
        console.warn('Could not update component model:', e)
        // At minimum, preserve the visual change
        el.innerHTML = newContent
      }
    }
  }

  // Handle Escape key to cancel editing
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      el.innerHTML = originalContent
      el.blur()
    }
    // Enter saves for single-line elements
    if (e.key === 'Enter' && !e.shiftKey) {
      const singleLineElements = ['SPAN', 'A', 'BUTTON', 'LABEL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
      if (singleLineElements.includes(el.tagName)) {
        e.preventDefault()
        el.blur()
      }
    }
  }

  // Attach event listeners
  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('dblclick', handleDblClick)
  el.addEventListener('blur', handleBlur)
  el.addEventListener('keydown', handleKeyDown)
}

/**
 * Make an image element editable with visual feedback (robust version)
 */
function makeImageEditableRobust(component: any, el: HTMLElement, editor: any) {
  // Mark as processed
  ;(el as any)[PROCESSED_MARKER] = true

  // Enable editing properties
  try {
    component.set({
      editable: true,
      highlightable: true
    })
  } catch (e) {
    // Component might not support these properties
  }

  // Style for hover effect
  el.style.transition = 'outline 0.15s ease'
  el.style.cursor = 'pointer'

  // Hover handlers - show solid border
  const handleMouseEnter = () => {
    el.style.outline = '3px solid #3b82f6'
    el.style.outlineOffset = '2px'
  }

  const handleMouseLeave = () => {
    el.style.outline = 'none'
  }

  // Double-click to open asset manager or file picker
  const handleDblClick = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()

    console.log('🖼️ Image double-click detected, opening asset manager...')

    const am = editor.AssetManager
    if (am) {
      am.open({
        types: ['image'],
        select: (asset: any) => {
          const src = typeof asset === 'string' ? asset : asset.get('src')
          component.set('src', src)
          ;(el as HTMLImageElement).src = src
          am.close()
          console.log('✅ Image source updated:', src)
        }
      })
    } else {
      // Fallback: prompt for URL
      const newSrc = prompt('Enter image URL:', (el as HTMLImageElement).src)
      if (newSrc) {
        component.set('src', newSrc)
        ;(el as HTMLImageElement).src = newSrc
        console.log('✅ Image source updated via prompt:', newSrc)
      }
    }
  }

  // Attach event listeners
  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('dblclick', handleDblClick)

  console.log('🖼️ Image editing enabled for:', (el as HTMLImageElement).src?.substring(0, 50) + '...')
}

export default initializeSmartComponents
