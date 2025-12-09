/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Intelligent Image Editor Plugin
 *
 * Auto-detects and enables editing for images and background images.
 * Features:
 * - Auto-detection of <img> tags and elements with background-image CSS
 * - Image edit overlay on hover
 * - Image picker modal on click
 * - Support for both img src and background-image replacement
 * - Image sizing controls (contain, cover, fill, etc.)
 */

export interface IntelligentImageEditorOptions {
  uploadEndpoint?: string
  allowedFormats?: string[]
  maxFileSize?: number
}

export default function intelligentImageEditor(editor: any, opts: IntelligentImageEditorOptions = {}) {
  const options = {
    uploadEndpoint: '/api/upload',
    allowedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    ...opts
  }

  // Add custom CSS for image hover overlay
  const style = document.createElement('style')
  style.innerHTML = `
    .gjs-image-hover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(59, 130, 246, 0.1);
      border: 2px dashed #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
    }

    .gjs-image-hover-overlay:hover {
      background: rgba(59, 130, 246, 0.2);
    }

    .gjs-image-edit-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #3b82f6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .gjs-bg-image-element {
      position: relative;
    }
  `
  document.head.appendChild(style)

  // Register intelligent image component
  editor.DomComponents.addType('intelligent-image', {
    isComponent: (el: HTMLElement) => {
      return el.tagName === 'IMG'
    },

    model: {
      defaults: {
        tagName: 'img',
        draggable: true,
        droppable: false,
        resizable: true,
        editable: false,

        traits: [
          {
            type: 'text',
            label: 'Alt Text',
            name: 'alt'
          },
          {
            type: 'text',
            label: 'Title',
            name: 'title'
          },
          {
            type: 'select',
            label: 'Object Fit',
            name: 'object-fit',
            options: [
              { value: 'fill', name: 'Fill' },
              { value: 'contain', name: 'Contain' },
              { value: 'cover', name: 'Cover' },
              { value: 'none', name: 'None' },
              { value: 'scale-down', name: 'Scale Down' }
            ],
            changeProp: 1
          },
          {
            type: 'select',
            label: 'Object Position',
            name: 'object-position',
            options: [
              { value: 'center', name: 'Center' },
              { value: 'top', name: 'Top' },
              { value: 'bottom', name: 'Bottom' },
              { value: 'left', name: 'Left' },
              { value: 'right', name: 'Right' }
            ],
            changeProp: 1
          },
          {
            type: 'number',
            label: 'Width (%)',
            name: 'width-percent',
            min: 0,
            max: 100,
            changeProp: 1
          },
          {
            type: 'number',
            label: 'Border Radius (px)',
            name: 'border-radius',
            min: 0,
            max: 100,
            changeProp: 1
          }
        ]
      },

      init(this: any) {
        this.on('change:object-fit', this.updateStyle)
        this.on('change:object-position', this.updateStyle)
        this.on('change:width-percent', this.updateStyle)
        this.on('change:border-radius', this.updateStyle)
      },

      updateStyle(this: any) {
        const objectFit = this.get('object-fit')
        const objectPosition = this.get('object-position')
        const widthPercent = this.get('width-percent')
        const borderRadius = this.get('border-radius')

        const styles: Record<string, any> = {}

        if (objectFit) styles['object-fit'] = objectFit
        if (objectPosition) styles['object-position'] = objectPosition
        if (widthPercent) styles.width = `${widthPercent}%`
        if (borderRadius) styles['border-radius'] = `${borderRadius}px`

        this.setStyle(styles)
      }
    },

    view: {
      events: {
        click: 'onImageClick',
        mouseenter: 'onMouseEnter',
        mouseleave: 'onMouseLeave'
      },

      onMouseEnter(this: any) {
        const el = this.el as HTMLElement
        const wrapper = el.parentElement

        if (!wrapper?.querySelector('.gjs-image-hover-overlay')) {
          const overlay = document.createElement('div')
          overlay.className = 'gjs-image-hover-overlay'
          overlay.innerHTML = '<div class="gjs-image-edit-icon">📷</div>'

          // Position overlay
          el.style.position = 'relative'
          el.parentElement?.appendChild(overlay)

          // Add click handler to overlay
          overlay.addEventListener('click', (e) => {
            e.stopPropagation()
            this.openImagePicker()
          })
        }
      },

      onMouseLeave(this: any) {
        const overlay = this.el.parentElement?.querySelector('.gjs-image-hover-overlay')
        if (overlay) {
          overlay.remove()
        }
      },

      onImageClick(this: any, ev: MouseEvent) {
        ev.stopPropagation()
        this.openImagePicker()
      },

      openImagePicker(this: any) {
        const model = this.model
        const currentSrc = (this.el as HTMLImageElement).src

        // Create file input
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = options.allowedFormats.join(',')

        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0]
          if (!file) return

          // Validate file size
          if (file.size > options.maxFileSize) {
            alert(`File too large. Maximum size is ${options.maxFileSize / 1024 / 1024}MB`)
            return
          }

          // Validate format
          if (!options.allowedFormats.includes(file.type)) {
            alert(`Invalid format. Allowed: ${options.allowedFormats.join(', ')}`)
            return
          }

          // Convert to base64 or upload to server
          const reader = new FileReader()
          reader.onload = (event) => {
            const imageSrc = event.target?.result as string

            // Update image src
            model.addAttributes({ src: imageSrc })
            ;(this.el as HTMLImageElement).src = imageSrc

            // Trigger change event
            editor.trigger('change:asset', { src: imageSrc })
          }
          reader.readAsDataURL(file)
        }

        input.click()
      }
    }
  })

  // Register background image component
  editor.DomComponents.addType('background-image-element', {
    model: {
      defaults: {
        draggable: true,
        droppable: true,

        traits: [
          {
            type: 'select',
            label: 'Background Size',
            name: 'background-size',
            options: [
              { value: 'auto', name: 'Auto' },
              { value: 'cover', name: 'Cover' },
              { value: 'contain', name: 'Contain' }
            ],
            changeProp: 1
          },
          {
            type: 'select',
            label: 'Background Position',
            name: 'background-position',
            options: [
              { value: 'center', name: 'Center' },
              { value: 'top', name: 'Top' },
              { value: 'bottom', name: 'Bottom' },
              { value: 'left', name: 'Left' },
              { value: 'right', name: 'Right' }
            ],
            changeProp: 1
          },
          {
            type: 'select',
            label: 'Background Repeat',
            name: 'background-repeat',
            options: [
              { value: 'no-repeat', name: 'No Repeat' },
              { value: 'repeat', name: 'Repeat' },
              { value: 'repeat-x', name: 'Repeat X' },
              { value: 'repeat-y', name: 'Repeat Y' }
            ],
            changeProp: 1
          }
        ]
      },

      init(this: any) {
        this.on('change:background-size', this.updateStyle)
        this.on('change:background-position', this.updateStyle)
        this.on('change:background-repeat', this.updateStyle)
      },

      updateStyle(this: any) {
        const bgSize = this.get('background-size')
        const bgPosition = this.get('background-position')
        const bgRepeat = this.get('background-repeat')

        const styles: Record<string, any> = {}

        if (bgSize) styles['background-size'] = bgSize
        if (bgPosition) styles['background-position'] = bgPosition
        if (bgRepeat) styles['background-repeat'] = bgRepeat

        this.setStyle(styles)
      }
    },

    view: {
      events: {
        dblclick: 'onDoubleClick',
        mouseenter: 'onMouseEnter',
        mouseleave: 'onMouseLeave'
      },

      onMouseEnter(this: any) {
        const el = this.el as HTMLElement
        const bgImage = window.getComputedStyle(el).backgroundImage

        if (bgImage && bgImage !== 'none' && !el.querySelector('.gjs-image-hover-overlay')) {
          const overlay = document.createElement('div')
          overlay.className = 'gjs-image-hover-overlay'
          overlay.innerHTML = '<div class="gjs-image-edit-icon">🖼️</div>'

          el.classList.add('gjs-bg-image-element')
          el.appendChild(overlay)

          overlay.addEventListener('click', (e) => {
            e.stopPropagation()
            this.openBackgroundImagePicker()
          })
        }
      },

      onMouseLeave(this: any) {
        const overlay = this.el.querySelector('.gjs-image-hover-overlay')
        if (overlay) {
          overlay.remove()
        }
      },

      onDoubleClick(this: any, ev: MouseEvent) {
        ev.stopPropagation()
        this.openBackgroundImagePicker()
      },

      openBackgroundImagePicker(this: any) {
        const model = this.model
        const el = this.el as HTMLElement

        const input = document.createElement('input')
        input.type = 'file'
        input.accept = options.allowedFormats.join(',')

        input.onchange = async (e: any) => {
          const file = e.target?.files?.[0]
          if (!file) return

          if (file.size > options.maxFileSize) {
            alert(`File too large. Maximum size is ${options.maxFileSize / 1024 / 1024}MB`)
            return
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            const imageSrc = event.target?.result as string

            // Update background image
            model.setStyle({ 'background-image': `url(${imageSrc})` })
            el.style.backgroundImage = `url(${imageSrc})`

            editor.trigger('change:asset', { src: imageSrc })
          }
          reader.readAsDataURL(file)
        }

        input.click()
      }
    }
  })

  // Auto-detect background images on load
  editor.on('load', () => {
    const wrapper = editor.DomComponents.getWrapper()

    wrapper?.onAll((component: any) => {
      const el = component.view?.el
      if (el) {
        const bgImage = window.getComputedStyle(el).backgroundImage
        if (bgImage && bgImage !== 'none') {
          component.set('type', 'background-image-element')
        }
      }
    })
  })

  console.log('✅ Intelligent Image Editor plugin loaded')
}
