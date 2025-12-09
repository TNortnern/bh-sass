import { ref } from 'vue'
import type { Editor, EditorConfig } from 'grapesjs'

export interface GrapesJSState {
  editor: Editor | null
  isReady: boolean
  selectedDevice: string
  isPreviewMode: boolean
  pluginsLoaded: boolean
  isPageLoading: boolean // Track page switching/creation
}

export interface GrapesJSPluginOptions {
  textEditor?: {
    hoverBorderColor?: string
    hoverBorderStyle?: string
  }
  imageEditor?: {
    maxFileSize?: number
    acceptedFormats?: string[]
  }
  defaultWidth?: {
    defaultWidth?: string
    applyToExisting?: boolean
  }
  traits?: {
    groupTraits?: boolean
  }
}

export function useGrapesJS() {
  const state = ref<GrapesJSState>({
    editor: null,
    isReady: false,
    selectedDevice: 'desktop',
    isPreviewMode: false,
    pluginsLoaded: false,
    isPageLoading: false
  })

  const initEditor = async (containerId: string, config?: Partial<EditorConfig>) => {
    if (import.meta.client) {
      try {
        // Load GrapesJS CSS dynamically
        const loadCSS = (href: string) => {
          if (!document.querySelector(`link[href*="${href.split('/').pop()}"]`)) {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            document.head.appendChild(link)
          }
        }

        // Load CSS from CDN (more reliable than bundled assets)
        loadCSS('https://unpkg.com/grapesjs@0.21.13/dist/css/grapes.min.css')

        // Dynamic import to ensure client-side only
        const grapesjs = (await import('grapesjs')).default
        const grapesjsPresetWebpage = (await import('grapesjs-preset-webpage')).default

        const defaultConfig: EditorConfig = {
          container: `#${containerId}`,
          height: '100%',
          width: 'auto',
          fromElement: false,

          // Storage configuration
          storageManager: {
            type: 'local',
            autosave: true,
            autoload: true,
            stepsBeforeSave: 1
          },

          // Canvas configuration - inject Tailwind CSS into the canvas iframe
          canvas: {
            styles: [
              // Additional reset styles for canvas
            ],
            scripts: [
              // Tailwind Play CDN - compiles Tailwind classes on the fly
              // This is the ONLY official way to use Tailwind v3+ without a build step
              'https://cdn.tailwindcss.com'
            ]
          },

          // Selector Manager - handle Tailwind's special characters (/, :, [], etc.)
          selectorManager: {
            escapeName: (name: string) => {
              // Preserve Tailwind class names with special characters
              // e.g., w-1/2, md:flex, hover:bg-blue-500, text-[14px]
              return `${name}`.trim().replace(/([^a-z0-9\w-:/[\]]+)/gi, '-')
            }
          },

          // Panels configuration
          panels: {
            defaults: []
          },

          // Device Manager
          deviceManager: {
            devices: [
              {
                id: 'desktop',
                name: 'Desktop',
                width: ''
              },
              {
                id: 'tablet',
                name: 'Tablet',
                width: '768px'
              },
              {
                id: 'mobile',
                name: 'Mobile',
                width: '375px'
              }
            ]
          },

          // Plugins
          plugins: [grapesjsPresetWebpage],
          pluginsOpts: {
            // @ts-expect-error GrapesJS plugin options use dynamic keys
            [grapesjsPresetWebpage]: {
              blocks: ['link-block', 'quote', 'text-basic'],
              modalImportTitle: 'Import Template',
              modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
              modalImportContent: (editor: Editor) => {
                return editor.getHtml() + '<style>' + editor.getCss() + '</style>'
              }
            }
          },

          // Block Manager
          blockManager: {
            appendTo: '#blocks-container',
            blocks: [
              {
                id: 'section',
                label: '<div class="gjs-block-label">Section</div>',
                content: '<section class="section"><div class="container"></div></section>',
                category: 'Layout',
                attributes: { class: 'gjs-block-section' }
              },
              {
                id: 'text',
                label: '<div class="gjs-block-label">Text</div>',
                content: '<div data-gjs-type="text">Insert your text here</div>',
                category: 'Basic',
                attributes: { class: 'gjs-block-text' }
              },
              {
                id: 'image',
                label: '<div class="gjs-block-label">Image</div>',
                content: { type: 'image' },
                category: 'Basic',
                attributes: { class: 'gjs-block-image' }
              },
              {
                id: 'video',
                label: '<div class="gjs-block-label">Video</div>',
                content: {
                  type: 'video',
                  src: 'https://via.placeholder.com/640x360',
                  style: { width: '100%' }
                },
                category: 'Media',
                attributes: { class: 'gjs-block-video' }
              },
              {
                id: 'map',
                label: '<div class="gjs-block-label">Map</div>',
                content: {
                  type: 'map',
                  style: { height: '350px', width: '100%' }
                },
                category: 'Media',
                attributes: { class: 'gjs-block-map' }
              }
            ]
          },

          // Layer Manager
          layerManager: {
            appendTo: '#layers-container'
          },

          // Trait Manager (Component Settings)
          traitManager: {
            appendTo: '#traits-container'
          },

          // Style Manager
          styleManager: {
            appendTo: '#styles-container',
            sectors: [
              {
                name: 'General',
                properties: [
                  {
                    extend: 'float',
                    type: 'radio',
                    default: 'none',
                    options: [
                      { id: 'none', value: 'none', className: 'fa fa-times' },
                      { id: 'left', value: 'left', className: 'fa fa-align-left' },
                      { id: 'right', value: 'right', className: 'fa fa-align-right' }
                    ]
                  },
                  'display',
                  { extend: 'position', type: 'select' },
                  'top',
                  'right',
                  'left',
                  'bottom'
                ]
              },
              {
                name: 'Dimension',
                open: false,
                properties: [
                  'width',
                  {
                    id: 'flex-width',
                    type: 'integer',
                    name: 'Width',
                    units: ['px', '%'],
                    property: 'flex-basis',
                    // @ts-expect-error GrapesJS property config uses non-standard types
                    toRequire: 1
                  },
                  'height',
                  'max-width',
                  'min-height',
                  'margin',
                  'padding'
                ]
              },
              {
                name: 'Typography',
                open: false,
                properties: [
                  'font-family',
                  'font-size',
                  'font-weight',
                  'letter-spacing',
                  'color',
                  'line-height',
                  {
                    extend: 'text-align',
                    options: [
                      { id: 'left', label: 'Left', className: 'fa fa-align-left' },
                      { id: 'center', label: 'Center', className: 'fa fa-align-center' },
                      { id: 'right', label: 'Right', className: 'fa fa-align-right' },
                      { id: 'justify', label: 'Justify', className: 'fa fa-align-justify' }
                    ]
                  },
                  {
                    property: 'text-decoration',
                    type: 'radio',
                    default: 'none',
                    options: [
                      { id: 'none', label: 'None' },
                      { id: 'underline', label: 'underline' },
                      { id: 'line-through', label: 'Line-through' }
                    ]
                  },
                  'text-shadow'
                ]
              },
              {
                name: 'Decorations',
                open: false,
                properties: [
                  'opacity',
                  'border-radius',
                  'border',
                  'box-shadow',
                  'background'
                ]
              },
              {
                name: 'Extra',
                open: false,
                buildProps: [
                  'transition',
                  'perspective',
                  'transform'
                ]
              },
              {
                name: 'Flex',
                open: false,
                properties: [
                  {
                    name: 'Flex Container',
                    property: 'display',
                    type: 'select',
                    defaults: 'block',
                    list: [
                      { id: 'block', value: 'block', name: 'Disable' },
                      { id: 'flex', value: 'flex', name: 'Enable' }
                    ]
                  },
                  {
                    name: 'Flex Parent',
                    property: 'label-parent-flex',
                    type: 'integer'
                  },
                  {
                    name: 'Direction',
                    property: 'flex-direction',
                    type: 'radio',
                    defaults: 'row',
                    list: [
                      {
                        id: 'row',
                        value: 'row',
                        name: 'Row',
                        className: 'icons-flex icon-dir-row',
                        title: 'Row'
                      },
                      {
                        id: 'row-reverse',
                        value: 'row-reverse',
                        name: 'Row reverse',
                        className: 'icons-flex icon-dir-row-rev',
                        title: 'Row reverse'
                      },
                      {
                        id: 'column',
                        value: 'column',
                        name: 'Column',
                        title: 'Column',
                        className: 'icons-flex icon-dir-col'
                      },
                      {
                        id: 'column-reverse',
                        value: 'column-reverse',
                        name: 'Column reverse',
                        title: 'Column reverse',
                        className: 'icons-flex icon-dir-col-rev'
                      }
                    ]
                  },
                  {
                    name: 'Justify',
                    property: 'justify-content',
                    type: 'radio',
                    defaults: 'flex-start',
                    list: [
                      {
                        id: 'flex-start',
                        value: 'flex-start',
                        className: 'icons-flex icon-just-start',
                        title: 'Start'
                      },
                      {
                        id: 'flex-end',
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-just-end'
                      },
                      {
                        id: 'space-between',
                        value: 'space-between',
                        title: 'Space between',
                        className: 'icons-flex icon-just-sp-bet'
                      },
                      {
                        id: 'space-around',
                        value: 'space-around',
                        title: 'Space around',
                        className: 'icons-flex icon-just-sp-ar'
                      },
                      {
                        id: 'center',
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-just-sp-cent'
                      }
                    ]
                  },
                  {
                    name: 'Align',
                    property: 'align-items',
                    type: 'radio',
                    defaults: 'center',
                    list: [
                      {
                        id: 'flex-start',
                        value: 'flex-start',
                        title: 'Start',
                        className: 'icons-flex icon-al-start'
                      },
                      {
                        id: 'flex-end',
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-al-end'
                      },
                      {
                        id: 'stretch',
                        value: 'stretch',
                        title: 'Stretch',
                        className: 'icons-flex icon-al-str'
                      },
                      {
                        id: 'center',
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-al-center'
                      }
                    ]
                  },
                  {
                    name: 'Flex Children',
                    property: 'label-parent-flex',
                    type: 'integer'
                  },
                  {
                    name: 'Order',
                    property: 'order',
                    type: 'integer',
                    // @ts-expect-error GrapesJS defaults can be numbers for integer types
                    defaults: 0,
                    min: 0
                  },
                  {
                    name: 'Flex',
                    property: 'flex',
                    type: 'composite',
                    properties: [
                      {
                        name: 'Grow',
                        property: 'flex-grow',
                        type: 'integer',
                        // @ts-expect-error GrapesJS defaults can be numbers for integer types
                        defaults: 0,
                        min: 0
                      },
                      {
                        name: 'Shrink',
                        property: 'flex-shrink',
                        type: 'integer',
                        // @ts-expect-error GrapesJS defaults can be numbers for integer types
                        defaults: 0,
                        min: 0
                      },
                      {
                        name: 'Basis',
                        property: 'flex-basis',
                        type: 'integer',
                        units: ['px', '%', ''],
                        unit: '',
                        defaults: 'auto'
                      }
                    ]
                  },
                  {
                    name: 'Align',
                    property: 'align-self',
                    type: 'radio',
                    defaults: 'auto',
                    list: [
                      {
                        id: 'auto',
                        value: 'auto',
                        name: 'Auto'
                      },
                      {
                        id: 'flex-start',
                        value: 'flex-start',
                        title: 'Start',
                        className: 'icons-flex icon-al-start'
                      },
                      {
                        id: 'flex-end',
                        value: 'flex-end',
                        title: 'End',
                        className: 'icons-flex icon-al-end'
                      },
                      {
                        id: 'stretch',
                        value: 'stretch',
                        title: 'Stretch',
                        className: 'icons-flex icon-al-str'
                      },
                      {
                        id: 'center',
                        value: 'center',
                        title: 'Center',
                        className: 'icons-flex icon-al-center'
                      }
                    ]
                  }
                ]
              }
            ]
          },

          ...config
        }

        state.value.editor = grapesjs.init(defaultConfig)

        // Expose editor globally for debugging/testing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).__gjsEditor = state.value.editor

        // CRITICAL: Wait for the load event and plugins to be registered before returning
        // This prevents race conditions where template loading happens before plugins are ready
        await new Promise<void>((resolve) => {
          state.value.editor!.on('load', async () => {
            // Set default styles for wrapper to ensure 100% width
            const wrapper = state.value.editor?.getWrapper()
            if (wrapper) {
              wrapper.setStyle({
                'min-height': '100vh',
                'width': '100%',
                'margin': '0',
                'padding': '0'
              })
            }

            // Function to refresh Tailwind CSS in the canvas iframe
            const refreshTailwind = () => {
            // Skip if we're in the middle of a bulk operation (page add/switch)
              if (state.value.isPageLoading) {
                console.log('⏭️ Skipping Tailwind refresh during page operation')
                return
              }
              try {
                const canvasFrame = state.value.editor?.Canvas.getFrameEl()
                if (canvasFrame?.contentWindow) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const tw = (canvasFrame.contentWindow as any).tailwind
                  if (tw?.refresh) {
                    tw.refresh()
                    console.log('✅ Tailwind CSS refreshed in canvas')
                  }
                }
              } catch {
              // Silently fail - Tailwind might not be loaded yet
              }
            }

            // DEBOUNCED Tailwind refresh - prevents cascade when adding multiple components
            let tailwindRefreshTimer: ReturnType<typeof setTimeout> | null = null
            const debouncedRefreshTailwind = () => {
            // Skip entirely during page operations
              if (state.value.isPageLoading) return

              // Clear any pending refresh
              if (tailwindRefreshTimer) {
                clearTimeout(tailwindRefreshTimer)
              }
              // Wait 500ms after the LAST component change before refreshing
              tailwindRefreshTimer = setTimeout(() => {
                refreshTailwind()
                tailwindRefreshTimer = null
              }, 500)
            }

            // Refresh Tailwind after initial load
            setTimeout(refreshTailwind, 1000)

            // Use DEBOUNCED refresh for component changes - critical for performance!
            state.value.editor?.on('component:add', debouncedRefreshTailwind)
            state.value.editor?.on('component:update', debouncedRefreshTailwind)

            // ========================================
            // ENHANCED IMAGE COMPONENT WITH FILE UPLOAD
            // ========================================
            // Register custom file upload trait type
            const tm = state.value.editor?.TraitManager
            if (tm) {
              tm.addType('image-upload', {
              // Create the file upload UI
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                createInput({ trait }: any) {
                  const el = document.createElement('div')
                  el.className = 'gjs-trait-image-upload'
                  el.innerHTML = `
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px dashed #4b5563; border-radius: 8px; cursor: pointer; background: #1f2937; transition: all 0.2s;">
                      <input type="file" accept="image/*" style="display: none;" />
                      <span style="color: #9ca3af; font-size: 12px;">📷 Click to upload or drag image</span>
                    </label>
                    <div style="text-align: center; color: #6b7280; font-size: 11px;">— or —</div>
                    <input type="text" placeholder="Paste image URL here..." style="width: 100%; padding: 8px; border: 1px solid #374151; border-radius: 6px; background: #1f2937; color: #e5e7eb; font-size: 12px;" />
                  </div>
                `

                  const fileInput = el.querySelector('input[type="file"]') as HTMLInputElement
                  const urlInput = el.querySelector('input[type="text"]') as HTMLInputElement
                  const dropZone = el.querySelector('label') as HTMLLabelElement

                  // File input change handler
                  fileInput?.addEventListener('change', (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string
                        trait.set('value', dataUrl)
                        // Update visual feedback
                        dropZone.innerHTML = `<span style="color: #22c55e; font-size: 12px;">✓ Image uploaded</span>`
                        setTimeout(() => {
                          dropZone.innerHTML = `<input type="file" accept="image/*" style="display: none;" /><span style="color: #9ca3af; font-size: 12px;">📷 Click to upload or drag image</span>`
                          const newFileInput = dropZone.querySelector('input[type="file"]') as HTMLInputElement
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          newFileInput?.addEventListener('change', fileInput.onchange as any)
                        }, 2000)
                      }
                      reader.readAsDataURL(file)
                    }
                  })

                  // URL input handler
                  urlInput?.addEventListener('change', (e) => {
                    const url = (e.target as HTMLInputElement).value
                    if (url) {
                      trait.set('value', url)
                    }
                  })

                  // Drag and drop
                  dropZone?.addEventListener('dragover', (e) => {
                    e.preventDefault()
                    dropZone.style.borderColor = '#f59e0b'
                    dropZone.style.background = '#292524'
                  })
                  dropZone?.addEventListener('dragleave', () => {
                    dropZone.style.borderColor = '#4b5563'
                    dropZone.style.background = '#1f2937'
                  })
                  dropZone?.addEventListener('drop', (e) => {
                    e.preventDefault()
                    dropZone.style.borderColor = '#4b5563'
                    dropZone.style.background = '#1f2937'
                    const file = e.dataTransfer?.files?.[0]
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string
                        trait.set('value', dataUrl)
                        dropZone.innerHTML = `<span style="color: #22c55e; font-size: 12px;">✓ Image uploaded</span>`
                      }
                      reader.readAsDataURL(file)
                    }
                  })

                  return el
                },

                // When trait value changes, update component
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onEvent({ component, trait }: any) {
                  const value = trait.get('value')
                  if (value) {
                    component.set('src', value)
                    component.addAttributes({ src: value })
                  }
                },

                // Get value from the trait
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onUpdate({ elInput, component }: any) {
                  const urlInput = elInput.querySelector('input[type="text"]') as HTMLInputElement
                  if (urlInput) {
                    urlInput.value = component.get('src') || ''
                  }
                }
              })
            }

            // Define image traits with the new upload trait
            const imageTraits = [
              {
                type: 'image-upload',
                label: 'Image Source',
                name: 'src',
                changeProp: true
              },
              {
                type: 'text',
                label: 'Alt Text',
                name: 'alt',
                placeholder: 'Describe the image for accessibility'
              },
              {
                type: 'text',
                label: 'Title (tooltip)',
                name: 'title',
                placeholder: 'Shows on hover'
              },
              {
                type: 'select',
                label: 'Loading',
                name: 'loading',
                options: [
                  { id: '', name: 'Default' },
                  { id: 'lazy', name: 'Lazy (Recommended)' },
                  { id: 'eager', name: 'Eager' }
                ]
              }
            ]

            // Add traits to image components when selected
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.value.editor?.on('component:selected', (component: any) => {
              const tagName = component.get('tagName')?.toLowerCase()
              const compType = component.get('type')

              // Check if it's an image (by type or tag)
              if (compType === 'image' || tagName === 'img') {
              // Always set the full traits array for images
              // This ensures src, alt, title, loading are all visible
                component.set('traits', imageTraits)

                // Also ensure the component knows src is editable
                if (!component.get('editable-src')) {
                  component.set('editable-src', true)
                }

                console.log('✅ Image traits applied:', imageTraits.map(t => t.name).join(', '))
              }
            })

            // Also extend the default image type for new images
            const domComponents = state.value.editor?.DomComponents
            if (domComponents) {
              const originalImageType = domComponents.getType('image')
              if (originalImageType) {
                domComponents.addType('image', {
                  model: {
                    defaults: {
                      ...originalImageType.model.prototype.defaults,
                      'traits': imageTraits,
                      // Make src editable as a trait
                      'trait-src': ''
                    }
                  }
                })
              }
              console.log('✅ Enhanced image component with src trait loaded')
            }

            // ========================================
            // SAVE AS BLOCK - TOOLBAR BUTTON
            // ========================================
            // Adds "Save as Block" button to every selected component's toolbar
            state.value.editor?.Commands.add('save-component-as-block', {
              run(ed: Editor) {
                const selected = ed.getSelected()
                if (!selected) {
                  console.warn('No component selected')
                  return
                }

                // Get component HTML
                const html = selected.toHTML()
                const css = ed.getCss({ component: selected })

                // Dispatch custom event for the UI to handle
                const event = new CustomEvent('grapesjs:save-as-block', {
                  detail: { html, css, component: selected }
                })
                window.dispatchEvent(event)
              }
            })

            // Add toolbar button to all selected components
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.value.editor?.on('component:selected', (component: any) => {
              const toolbar = component.get('toolbar') || []

              // Check if save-as-block already exists
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const hasBlockButton = toolbar.some((item: any) =>
                item.command === 'save-component-as-block'
              )

              if (!hasBlockButton) {
              // Add save as block button with emoji icon (no Font Awesome needed)
                toolbar.push({
                  attributes: {
                    class: 'gjs-toolbar-save-block',
                    title: 'Save as Reusable Block'
                  },
                  command: 'save-component-as-block'
                })

                component.set({ toolbar })
              }
            })
            console.log('✅ Save as Block toolbar button loaded')

            // Load SMART COMPONENT DETECTION and all custom plugins
            // This is THE KEY to making ALL text and images editable without HTML knowledge
            try {
              const { registerAllPlugins } = await import('~/lib/grapesjs-plugins')

              if (state.value.editor) {
              // Register all plugins including SMART COMPONENT DETECTION
              // This makes:
              // - ALL text elements (h1-h6, p, span, a, button, li, etc.) editable on double-click
              // - ALL images (img tags AND background-images) replaceable on double-click
              // - Dashed borders appear on hover to indicate editable elements
                registerAllPlugins(state.value.editor, {
                  textEditor: {
                    hoverBorderColor: '#3b82f6',
                    hoverBorderStyle: 'dashed'
                  },
                  imageEditor: {
                    maxFileSize: 10 * 1024 * 1024 // 10MB
                  },
                  defaultWidth: {
                    defaultWidth: '100%',
                    applyToExisting: true
                  },
                  traits: {
                    groupTraits: true
                  },
                  loadBlocks: true // Load lightweight blocks
                })

                state.value.pluginsLoaded = true
                console.log('✅ GrapesJS SMART COMPONENT DETECTION loaded')
                console.log('   Users can now edit ANY text by double-clicking')
                console.log('   Users can now replace ANY image by double-clicking')
              }
            } catch (pluginError) {
              console.warn('Failed to load smart component plugins:', pluginError)
            // Continue without plugins but log the issue
            }

            state.value.isReady = true

            // Resolve the Promise now that plugins are registered
            resolve()
          })
        }) // End of await new Promise

        return state.value.editor
      } catch (error) {
        console.error('Failed to initialize GrapesJS:', error)
        throw error
      }
    }
  }

  const getEditor = () => state.value.editor

  const setDevice = (device: string) => {
    if (state.value.editor) {
      state.value.editor.setDevice(device)
      state.value.selectedDevice = device
    }
  }

  const togglePreview = () => {
    if (state.value.editor) {
      const commands = state.value.editor.Commands
      if (state.value.isPreviewMode) {
        commands.stop('preview')
        state.value.isPreviewMode = false
      } else {
        commands.run('preview')
        state.value.isPreviewMode = true
      }
    }
  }

  const undo = () => {
    if (state.value.editor) {
      state.value.editor.UndoManager.undo()
    }
  }

  const redo = () => {
    if (state.value.editor) {
      state.value.editor.UndoManager.redo()
    }
  }

  const getHtml = () => {
    if (state.value.editor) {
      return state.value.editor.getHtml()
    }
    return ''
  }

  const getCss = () => {
    if (state.value.editor) {
      return state.value.editor.getCss()
    }
    return ''
  }

  const getJs = () => {
    if (state.value.editor) {
      return state.value.editor.getJs()
    }
    return ''
  }

  const saveContent = async () => {
    if (state.value.editor) {
      const html = getHtml()
      const css = getCss()
      const js = getJs()

      // Store in local storage automatically (handled by GrapesJS storage manager)
      state.value.editor.store()

      return { html, css, js }
    }
    return null
  }

  const loadContent = (data: { html?: string, css?: string, js?: string }) => {
    if (state.value.editor) {
      if (data.html) {
        state.value.editor.setComponents(data.html)
      }
      if (data.css) {
        state.value.editor.setStyle(data.css)
      }
    }
  }

  const clearCanvas = () => {
    if (state.value.editor) {
      state.value.editor.DomComponents.clear()
      state.value.editor.CssComposer.clear()
    }
  }

  const destroyEditor = () => {
    if (state.value.editor) {
      state.value.editor.destroy()
      state.value.editor = null
      state.value.isReady = false
      state.value.pluginsLoaded = false
    }
  }

  // Load HyperUI and Nuxt UI blocks into the editor
  const loadBlockSystem = async () => {
    if (!state.value.editor) return

    try {
      const { initializeBlockSystem } = await import('~/lib/grapesjs-blocks')
      const blockSystem = await initializeBlockSystem(state.value.editor)

      // Load default category
      blockSystem.loadCategory('hero')

      console.log('✅ GrapesJS block system loaded')
      return blockSystem
    } catch (error) {
      console.warn('Failed to load block system:', error)
      return null
    }
  }

  // Load a template into the editor
  const loadTemplate = async (templateId: string) => {
    if (!state.value.editor) return false

    try {
      const { getTemplateById } = await import('~/lib/grapesjs-templates')
      const template = getTemplateById(templateId)

      if (template) {
        state.value.editor.setComponents(template.html)
        if (template.styles) {
          state.value.editor.setStyle(template.styles)
        }
        console.log(`✅ Loaded template: ${template.name}`)
        return true
      }
      return false
    } catch (error) {
      console.warn('Failed to load template:', error)
      return false
    }
  }

  // Get available templates list
  const getTemplates = async () => {
    try {
      const { templates, getAllTemplates } = await import('~/lib/grapesjs-templates')
      return getAllTemplates ? getAllTemplates() : Object.values(templates)
    } catch {
      return []
    }
  }

  /**
   * Load custom blocks from storage and register with editor
   */
  const loadCustomBlocks = async () => {
    if (!state.value.editor) return

    try {
      const { useCustomBlocks } = await import('~/composables/useCustomBlocks')
      const customBlocks = useCustomBlocks()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customBlocks.registerWithEditor(state.value.editor as any)
      console.log('✅ Custom blocks loaded')
    } catch (error) {
      console.warn('Failed to load custom blocks:', error)
    }
  }

  /**
   * Save the currently selected component as a custom block
   */
  const saveAsCustomBlock = async (name: string, category: string = 'Saved') => {
    if (!state.value.editor) return null

    try {
      const { useCustomBlocks } = await import('~/composables/useCustomBlocks')
      const customBlocks = useCustomBlocks()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const block = customBlocks.saveFromEditor(state.value.editor as any, name, category)

      if (block) {
        // Register the new block immediately
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customBlocks.registerWithEditor(state.value.editor as any)
        console.log(`✅ Saved custom block: ${name}`)
      }

      return block
    } catch (error) {
      console.error('Failed to save custom block:', error)
      return null
    }
  }

  /**
   * Get all pages in the editor
   */
  const getPages = () => {
    if (!state.value.editor) return []
    const pages = state.value.editor.Pages
    return pages?.getAll() || []
  }

  /**
   * Get current page
   */
  const getCurrentPage = () => {
    if (!state.value.editor) return null
    const pages = state.value.editor.Pages
    return pages?.getSelected() || null
  }

  /**
   * Add a new page (with freeze prevention)
   * Returns a promise that resolves when the page is ready
   * Throws an error if page creation fails
   */
  const addPage = async (id: string, name?: string): Promise<unknown> => {
    if (!state.value.editor) {
      throw new Error('Editor not initialized')
    }

    const editor = state.value.editor
    const pages = editor.Pages

    if (!pages) {
      throw new Error('Pages module not available')
    }

    const um = editor.UndoManager

    // Check if page with this ID already exists
    const existingPage = pages.get(id)
    if (existingPage) {
      throw new Error(`Page with ID "${id}" already exists`)
    }

    // Set loading state FIRST
    state.value.isPageLoading = true

    // CRITICAL: Set global flag to skip expensive isComponent checks during page add
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__gjsSkipComponentDetection = true
    }

    // CRITICAL: Use setTimeout to ensure loading UI renders before heavy work
    // requestAnimationFrame alone is NOT enough - we need to yield to the browser
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Pause undo manager to prevent cascade updates
          um?.stop()

          // Deselect any selected component
          const selected = editor.getSelected()
          if (selected) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor.select(null as any)
          }

          // Clear any pending component updates
          editor.trigger('component:deselected')

          console.log('📄 Creating new page:', id, name)

          // Create page with minimal content (no wrapper initially)
          const page = pages.add({
            id,
            name: name || id,
            component: '<div data-empty-page="true"></div>'
          })

          if (!page) {
            throw new Error('Pages.add() returned null')
          }

          console.log('📄 Page created, selecting it...')

          // Select the new page
          pages.select(page)

          // Resume undo manager
          um?.start()

          // Defer adding real content with another timeout
          setTimeout(() => {
            try {
              um?.stop()
              editor.setComponents(`
                <div class="page-wrapper min-h-screen p-4 md:p-8">
                  <div class="max-w-7xl mx-auto">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">New Page</h1>
                    <p class="text-gray-600">Start building your page by dragging blocks from the sidebar.</p>
                  </div>
                </div>
              `)
              um?.start()
              um?.clear() // Clear history for clean slate
            } catch (e) {
              console.warn('Failed to add page content:', e)
              um?.start()
            }

            // Re-enable component detection after page is loaded
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).__gjsSkipComponentDetection = false
            }

            // Mark loading complete
            state.value.isPageLoading = false

            // Trigger ONE Tailwind refresh after page is ready
            setTimeout(() => {
              try {
                const canvasFrame = editor.Canvas.getFrameEl()
                if (canvasFrame?.contentWindow) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const tw = (canvasFrame.contentWindow as any).tailwind
                  if (tw?.refresh) {
                    tw.refresh()
                    console.log('✅ Tailwind refreshed after page creation')
                  }
                }
              } catch {
                // Silently fail
              }
            }, 100)

            console.log('✅ Page created successfully:', id)
            resolve(page)
          }, 100) // Increased delay for iframe recreation
        } catch (error) {
          console.error('Failed to add page:', error)
          um?.start()
          // Re-enable component detection on error
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__gjsSkipComponentDetection = false
          }
          state.value.isPageLoading = false
          reject(error)
        }
      }, 16) // ~1 frame to ensure loading overlay renders
    })
  }

  /**
   * Switch to a page (with freeze prevention)
   */
  const selectPage = async (pageId: string): Promise<boolean> => {
    if (!state.value.editor) return false

    const editor = state.value.editor
    const pages = editor.Pages
    const um = editor.UndoManager
    const page = pages.get(pageId)

    if (!page) return false

    // Set loading state FIRST
    state.value.isPageLoading = true

    // CRITICAL: Set global flag to skip expensive isComponent checks during page switch
    // This prevents browser freeze when loading pages with hundreds of elements
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__gjsSkipComponentDetection = true
    }

    return new Promise((resolve) => {
      // Use setTimeout to ensure loading UI renders
      setTimeout(() => {
        try {
          // Pause undo manager during switch
          um.stop()

          // Deselect current component to prevent cascade updates
          const selected = editor.getSelected()
          if (selected) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor.select(null as any)
          }

          // Trigger deselect event
          editor.trigger('component:deselected')

          // Switch page
          pages.select(page)

          // Resume undo manager
          um.start()

          // Wait for page to fully load before resolving
          setTimeout(() => {
            // Re-enable component detection after page is loaded
            if (typeof window !== 'undefined') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).__gjsSkipComponentDetection = false
            }

            state.value.isPageLoading = false

            // Trigger ONE Tailwind refresh after page switch is complete
            setTimeout(() => {
              try {
                const canvasFrame = editor.Canvas.getFrameEl()
                if (canvasFrame?.contentWindow) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const tw = (canvasFrame.contentWindow as any).tailwind
                  if (tw?.refresh) {
                    tw.refresh()
                    console.log('✅ Tailwind refreshed after page switch')
                  }
                }
              } catch {
                // Silently fail
              }
            }, 100)

            resolve(true)
          }, 100) // Increased delay for page load
        } catch (error) {
          console.error('Failed to switch page:', error)
          um.start()
          // Re-enable component detection on error
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__gjsSkipComponentDetection = false
          }
          state.value.isPageLoading = false
          resolve(false)
        }
      }, 16)
    })
  }

  /**
   * Remove a page
   */
  const removePage = (pageId: string) => {
    if (!state.value.editor) return false
    const pages = state.value.editor.Pages
    const page = pages.get(pageId)

    if (page && pages.getAll().length > 1) {
      pages.remove(page)
      return true
    }
    return false
  }

  /**
   * Rename a page
   */
  const renamePage = (pageId: string, newName: string) => {
    if (!state.value.editor) return false
    const pages = state.value.editor.Pages
    const page = pages.get(pageId)

    if (page) {
      page.set('name', newName)
      return true
    }
    return false
  }

  // ========================================
  // BLOCK FILTERING AND SEARCH
  // ========================================

  /**
   * Get all blocks from the editor
   */
  const getAllBlocks = () => {
    if (!state.value.editor) return []
    const bm = state.value.editor.BlockManager
    return bm.getAll().toArray()
  }

  /**
   * Filter blocks by tab type and render custom block grid
   * Creates draggable block elements that work with GrapesJS
   * @param tabType - 'core' | 'hyperui' | 'custom'
   * @param searchQuery - Optional search term
   * @param containerId - The container element ID
   */
  const filterBlocks = (
    tabType: 'core' | 'hyperui' | 'custom',
    searchQuery?: string,
    containerId: string = 'blocks-container'
  ) => {
    if (!state.value.editor) return

    const editor = state.value.editor
    const bm = editor.BlockManager
    const allBlocks = bm.getAll().toArray()

    // Helper to extract category string (can be string or object with id/label)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getCategoryString = (block: any): string => {
      const cat = block.get('category')
      if (!cat) return ''
      if (typeof cat === 'string') return cat
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof cat === 'object') return (cat as any).id || (cat as any).label || ''
      return String(cat)
    }

    // Define which categories belong to which tab
    const coreCategories = ['Layout', 'Text', 'Media', 'Buttons', 'Forms', 'Cards', 'Basic', 'Navigation']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isHyperUIBlock = (block: any) => {
      const category = getCategoryString(block)
      return category.startsWith('HyperUI:')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isCustomBlock = (block: any) => {
      const category = getCategoryString(block)
      const blockId = block.get('id') || ''
      return category.startsWith('My Blocks:') || blockId.startsWith('custom-')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isCoreBlock = (block: any) => {
      const category = getCategoryString(block)
      return coreCategories.includes(category) || (!isHyperUIBlock(block) && !isCustomBlock(block))
    }

    // Filter blocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredBlocks = allBlocks.filter((block: any) => {
      const blockId = block.get('id') || ''
      const label = (block.get('label') || '').toString().toLowerCase()
      const category = getCategoryString(block).toLowerCase()

      // Check tab filter
      let matchesTab = false
      switch (tabType) {
        case 'core':
          matchesTab = isCoreBlock(block)
          break
        case 'hyperui':
          matchesTab = isHyperUIBlock(block)
          break
        case 'custom':
          matchesTab = isCustomBlock(block)
          break
      }

      if (!matchesTab) return false

      // Check search filter
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        if (!label.includes(query) && !category.includes(query) && !blockId.toLowerCase().includes(query)) {
          return false
        }
      }

      return true
    })

    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = ''

    // Show empty state if no matching blocks
    if (filteredBlocks.length === 0) {
      const emptyMessage = searchQuery
        ? 'Try a different search term'
        : tabType === 'hyperui'
          ? 'Premium blocks are loading... If this persists, try refreshing the page.'
          : tabType === 'custom'
            ? 'Save a block to see it here. Select any element and click the puzzle icon.'
            : 'No blocks available'

      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg class="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-sm font-medium">No blocks found</p>
          <p class="text-xs mt-1 text-center px-4">${emptyMessage}</p>
        </div>
      `
      return
    }

    // Group blocks by category (using the helper to convert objects to strings)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blocksByCategory = new Map<string, any[]>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filteredBlocks.forEach((block: any) => {
      const category = getCategoryString(block) || 'Other'
      if (!blocksByCategory.has(category)) {
        blocksByCategory.set(category, [])
      }
      blocksByCategory.get(category)!.push(block)
    })

    // Create category sections with draggable blocks
    blocksByCategory.forEach((blocks, categoryName) => {
      // Category header
      const categorySection = document.createElement('div')
      categorySection.className = 'gjs-block-category'

      const categoryHeader = document.createElement('div')
      categoryHeader.className = 'gjs-title px-3 py-2 bg-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wide cursor-pointer flex items-center justify-between'
      categoryHeader.innerHTML = `
        <span>${categoryName}</span>
        <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      `

      const blocksGrid = document.createElement('div')
      blocksGrid.className = 'gjs-blocks-c flex flex-wrap p-1 gap-1'

      // Toggle category collapse
      categoryHeader.onclick = () => {
        const isHidden = blocksGrid.style.display === 'none'
        blocksGrid.style.display = isHidden ? 'flex' : 'none'
        const chevron = categoryHeader.querySelector('svg')
        if (chevron) {
          chevron.style.transform = isHidden ? '' : 'rotate(-90deg)'
        }
      }

      // Create block elements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blocks.forEach((block: any) => {
        const blockEl = document.createElement('div')
        blockEl.className = 'gjs-block cursor-move rounded-lg p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center text-center'
        blockEl.style.width = 'calc(50% - 2px)'
        blockEl.style.minHeight = '80px'
        blockEl.draggable = true

        const blockId = block.get('id')
        const label = block.get('label') || blockId
        const media = block.get('media') || ''

        // Block content
        if (media && media.includes('<svg')) {
          blockEl.innerHTML = `
            <div class="w-full h-12 flex items-center justify-center mb-1 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-10">${media}</div>
            <span class="text-xs text-gray-300 truncate w-full">${label}</span>
          `
        } else {
          blockEl.innerHTML = `
            <div class="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mb-1 text-lg">📦</div>
            <span class="text-xs text-gray-300 truncate w-full">${label}</span>
          `
        }

        // Handle drag start - GrapesJS integration
        blockEl.ondragstart = (e) => {
          // Set data for GrapesJS to pick up
          e.dataTransfer?.setData('text/plain', blockId)

          // Use GrapesJS's internal drag mechanism
          const content = block.get('content')
          if (editor.Commands) {
            editor.Commands.run('core:component-drag', {
              target: typeof content === 'string' ? content : content
            })
          }
        }

        // Double-click to add block to canvas
        blockEl.ondblclick = () => {
          const content = block.get('content')
          const wrapper = editor.DomComponents.getWrapper()
          if (wrapper && content) {
            wrapper.append(content)
            // Flash the block to indicate it was added
            blockEl.style.background = '#059669'
            setTimeout(() => {
              blockEl.style.background = ''
            }, 300)
          }
        }

        blocksGrid.appendChild(blockEl)
      })

      categorySection.appendChild(categoryHeader)
      categorySection.appendChild(blocksGrid)
      container.appendChild(categorySection)
    })
  }

  /**
   * Get block counts by tab type
   */
  const getBlockCounts = () => {
    if (!state.value.editor) return { core: 0, hyperui: 0, custom: 0 }

    const bm = state.value.editor.BlockManager
    const allBlocks = bm.getAll().toArray()

    // Helper to extract category string (can be string or object with id/label)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getCategoryStr = (block: any): string => {
      const cat = block.get('category')
      if (!cat) return ''
      if (typeof cat === 'string') return cat
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof cat === 'object') return (cat as any).id || (cat as any).label || ''
      return String(cat)
    }

    let core = 0
    let hyperui = 0
    let custom = 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allBlocks.forEach((block: any) => {
      const category = getCategoryStr(block)
      const blockId = block.get('id') || ''

      if (category.startsWith('HyperUI:')) {
        hyperui++
      } else if (category.startsWith('My Blocks:') || blockId.startsWith('custom-')) {
        custom++
      } else {
        core++
      }
    })

    return { core, hyperui, custom }
  }

  /**
   * Add a custom HTML block with code editor dialog
   */
  const addCustomHtmlBlock = () => {
    if (!state.value.editor) return

    const editor = state.value.editor
    const bm = editor.BlockManager
    const dc = editor.DomComponents

    // Check if already exists
    if (bm.get('custom-html')) return

    // Register custom component type for custom-html
    dc.addType('custom-html-component', {
      model: {
        defaults: {
          tagName: 'div',
          droppable: false,
          attributes: { 'data-custom-html': 'true' },
          customHtml: '',
          customCss: '',
          traits: [
            {
              type: 'button',
              label: 'Edit Code',
              text: '✏️ Open Code Editor',
              command: 'custom-html:edit'
            }
          ]
        }
      }
    })

    // Add command to open the code editor modal
    editor.Commands.add('custom-html:edit', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      run(editor: any, sender: any, options: any = {}) {
        const component = options.component || editor.getSelected()
        if (!component) return

        // Create modal overlay
        const modal = document.createElement('div')
        modal.id = 'custom-html-modal'
        modal.style.cssText = `
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        `

        // Get existing content
        const existingHtml = component.get('customHtml') || component.getInnerHTML() || ''
        const existingCss = component.get('customCss') || ''

        modal.innerHTML = `
          <div style="background: #1f2937; border-radius: 12px; width: 100%; max-width: 900px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #374151;">
            <div style="padding: 16px 20px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center;">
              <h2 style="color: white; font-size: 18px; font-weight: 600; margin: 0;">Custom HTML/CSS Editor</h2>
              <button id="modal-close" style="background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 24px; padding: 4px;">&times;</button>
            </div>
            <div style="flex: 1; overflow: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;">
              <div style="flex: 1; min-height: 200px;">
                <label style="display: block; color: #9ca3af; font-size: 12px; font-weight: 500; margin-bottom: 8px; text-transform: uppercase;">HTML</label>
                <textarea id="html-editor" style="width: 100%; height: 200px; background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 12px; color: #e5e7eb; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; resize: vertical;" placeholder="<div class='my-component'>\\n  <h2>Hello World</h2>\\n</div>">${existingHtml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
              </div>
              <div style="flex: 1; min-height: 150px;">
                <label style="display: block; color: #9ca3af; font-size: 12px; font-weight: 500; margin-bottom: 8px; text-transform: uppercase;">CSS (Optional)</label>
                <textarea id="css-editor" style="width: 100%; height: 150px; background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 12px; color: #e5e7eb; font-family: 'Monaco', 'Menlo', monospace; font-size: 13px; resize: vertical;" placeholder=".my-component {\\n  padding: 20px;\\n  background: #f3f4f6;\\n}">${existingCss}</textarea>
              </div>
            </div>
            <div style="padding: 16px 20px; border-top: 1px solid #374151; display: flex; justify-content: flex-end; gap: 12px;">
              <button id="modal-cancel" style="padding: 10px 20px; background: #374151; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">Cancel</button>
              <button id="modal-apply" style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">Apply Changes</button>
            </div>
          </div>
        `

        document.body.appendChild(modal)

        const htmlEditor = modal.querySelector('#html-editor') as HTMLTextAreaElement
        const cssEditor = modal.querySelector('#css-editor') as HTMLTextAreaElement
        const closeBtn = modal.querySelector('#modal-close')
        const cancelBtn = modal.querySelector('#modal-cancel')
        const applyBtn = modal.querySelector('#modal-apply')

        const closeModal = () => {
          console.log('🔒 Closing Custom HTML modal')
          modal.remove()
        }

        const applyChanges = () => {
          console.log('📝 Apply Changes clicked')

          const html = htmlEditor?.value || ''
          const css = cssEditor?.value || ''

          console.log('📝 HTML to apply:', html.substring(0, 100) + '...')
          console.log('📝 CSS to apply:', css.substring(0, 100) + '...')

          if (!component) {
            console.error('❌ No component reference!')
            closeModal()
            return
          }

          try {
            // Store raw values
            component.set('customHtml', html)
            component.set('customCss', css)

            // Clear existing components first
            const existingComponents = component.components()
            if (existingComponents && existingComponents.length > 0) {
              existingComponents.reset()
            }

            // Build the component content
            let content = html
            if (css && css.trim()) {
              // Use a unique style tag ID to prevent conflicts
              const styleId = `custom-css-${component.getId()}`
              content += `<style id="${styleId}">${css}</style>`
            }

            // Use components().add() instead of components() setter
            if (content.trim()) {
              component.components().add(content)
            }

            // Remove placeholder styling
            component.setStyle({
              'padding': '',
              'background': '',
              'border': '',
              'border-radius': '',
              'min-height': ''
            })

            // Trigger component update event
            component.trigger('change')

            console.log('✅ Custom HTML applied successfully')
          } catch (e) {
            console.error('❌ Failed to apply custom HTML:', e)
          }

          closeModal()
        }

        // Add event listeners with null checks
        if (closeBtn) {
          closeBtn.addEventListener('click', closeModal)
          console.log('✅ Close button listener added')
        }
        if (cancelBtn) {
          cancelBtn.addEventListener('click', closeModal)
          console.log('✅ Cancel button listener added')
        }
        if (applyBtn) {
          applyBtn.addEventListener('click', applyChanges)
          console.log('✅ Apply button listener added')
        } else {
          console.error('❌ Apply button not found in modal!')
        }
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal()
        })

        // Focus HTML editor
        htmlEditor?.focus()
      }
    })

    // Helper function to check if component is a custom-html component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isCustomHtmlComponent = (component: any): boolean => {
      // Check component type
      if (component.get('type') === 'custom-html-component') return true

      // Check attributes using GrapesJS API (getAttributes returns object)
      const attrs = component.getAttributes ? component.getAttributes() : component.get('attributes')
      if (attrs?.['data-custom-html'] === 'true') return true

      // Check if the element has the data attribute in DOM
      const el = component.getEl ? component.getEl() : component.view?.el
      if (el?.dataset?.customHtml === 'true' || el?.getAttribute?.('data-custom-html') === 'true') return true

      return false
    }

    // Add double-click handler for custom-html components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.on('component:dblclick', (component: any) => {
      if (isCustomHtmlComponent(component)) {
        editor.Commands.run('custom-html:edit', { component })
      }
    })

    // Add TOOLBAR BUTTON for custom-html components
    // This shows the "Edit Code" button in the floating toolbar when the component is selected
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.on('component:selected', (component: any) => {
      const isCustomHtml = isCustomHtmlComponent(component)

      if (isCustomHtml) {
        const toolbar = component.get('toolbar') || []

        // Check if edit-code button already exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasEditButton = toolbar.some((item: any) =>
          item.command === 'custom-html:edit'
        )

        if (!hasEditButton) {
          // Add the edit code button to the toolbar
          // Using emoji for better visibility across all systems
          toolbar.push({
            attributes: {
              class: 'gjs-toolbar-edit-code',
              title: 'Edit HTML/CSS Code',
              style: 'font-size: 14px;'
            },
            command: 'custom-html:edit',
            label: '&lt;/&gt;' // Shows </> code symbol
          })

          component.set({ toolbar })
          console.log('✅ Added Edit Code toolbar button to Custom HTML component')
        }
      }
    })

    // Add the block
    bm.add('custom-html', {
      media: `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#1e1e1e" stroke="#3b82f6"/>
        <text x="15" y="22" fill="#f472b6" font-family="monospace" font-size="10">&lt;div&gt;</text>
        <text x="20" y="35" fill="#a3e635" font-family="monospace" font-size="9">Your HTML</text>
        <text x="15" y="48" fill="#f472b6" font-family="monospace" font-size="10">&lt;/div&gt;</text>
      </svg>`,
      label: 'Custom HTML',
      category: 'Basic',
      content: {
        type: 'custom-html-component',
        style: {
          'padding': '20px',
          'background': '#f9fafb',
          'border': '2px dashed #d1d5db',
          'border-radius': '8px',
          'min-height': '100px'
        },
        components: `<p style="color: #6b7280; text-align: center; margin: 0;">Double-click to edit HTML/CSS</p>`
      },
      activate: true
    })

    console.log('✅ Custom HTML block with code editor added')
  }

  return {
    state,
    initEditor,
    getEditor,
    setDevice,
    togglePreview,
    undo,
    redo,
    getHtml,
    getCss,
    getJs,
    saveContent,
    loadContent,
    clearCanvas,
    destroyEditor,
    loadBlockSystem,
    loadTemplate,
    getTemplates,
    // Custom blocks
    loadCustomBlocks,
    saveAsCustomBlock,
    // Multi-page support
    getPages,
    getCurrentPage,
    addPage,
    selectPage,
    removePage,
    renamePage,
    // Block filtering and search
    getAllBlocks,
    filterBlocks,
    getBlockCounts,
    addCustomHtmlBlock
  }
}
