/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Comprehensive Traits Plugin
 *
 * Adds comprehensive traits/properties for all elements.
 * Features:
 * - Spacing: margin, padding (all sides with individual controls)
 * - Typography: font-family, font-size, font-weight, line-height, letter-spacing, text-align, text-transform, color
 * - Background: color, gradient, image
 * - Borders: width, style, color, radius (all sides)
 * - Effects: box-shadow, opacity, transform
 * - Layout: display, flex properties, grid properties
 * - Sizing: width, height, min/max
 */

export interface ComprehensiveTraitsOptions {
  includeAdvanced?: boolean
  groupTraits?: boolean
}

export default function comprehensiveTraits(editor: any, opts: ComprehensiveTraitsOptions = {}) {
  const options = {
    includeAdvanced: true,
    groupTraits: true,
    ...opts
  }

  // Helper to create spacing traits (margin/padding)
  const createSpacingTraits = (type: 'margin' | 'padding') => {
    const label = type === 'margin' ? 'Margin' : 'Padding'

    return [
      {
        type: 'number',
        label: `${label} Top`,
        name: `${type}-top`,
        min: 0,
        max: 200,
        changeProp: 1
      },
      {
        type: 'number',
        label: `${label} Right`,
        name: `${type}-right`,
        min: 0,
        max: 200,
        changeProp: 1
      },
      {
        type: 'number',
        label: `${label} Bottom`,
        name: `${type}-bottom`,
        min: 0,
        max: 200,
        changeProp: 1
      },
      {
        type: 'number',
        label: `${label} Left`,
        name: `${type}-left`,
        min: 0,
        max: 200,
        changeProp: 1
      }
    ]
  }

  // Typography traits
  const typographyTraits = [
    {
      type: 'select',
      label: 'Font Family',
      name: 'font-family',
      options: [
        { value: 'inherit', name: 'Inherit' },
        { value: 'Arial, sans-serif', name: 'Arial' },
        { value: 'Helvetica, sans-serif', name: 'Helvetica' },
        { value: '"Times New Roman", serif', name: 'Times New Roman' },
        { value: 'Georgia, serif', name: 'Georgia' },
        { value: '"Courier New", monospace', name: 'Courier New' },
        { value: 'Verdana, sans-serif', name: 'Verdana' },
        { value: 'system-ui, sans-serif', name: 'System UI' }
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
      type: 'select',
      label: 'Font Weight',
      name: 'font-weight',
      options: [
        { value: 'inherit', name: 'Inherit' },
        { value: '100', name: 'Thin' },
        { value: '200', name: 'Extra Light' },
        { value: '300', name: 'Light' },
        { value: '400', name: 'Normal' },
        { value: '500', name: 'Medium' },
        { value: '600', name: 'Semibold' },
        { value: '700', name: 'Bold' },
        { value: '800', name: 'Extra Bold' },
        { value: '900', name: 'Black' }
      ],
      changeProp: 1
    },
    {
      type: 'number',
      label: 'Line Height',
      name: 'line-height',
      min: 0.5,
      max: 3,
      step: 0.1,
      changeProp: 1
    },
    {
      type: 'number',
      label: 'Letter Spacing (px)',
      name: 'letter-spacing',
      min: -5,
      max: 20,
      step: 0.5,
      changeProp: 1
    },
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
      label: 'Text Transform',
      name: 'text-transform',
      options: [
        { value: 'none', name: 'None' },
        { value: 'uppercase', name: 'Uppercase' },
        { value: 'lowercase', name: 'Lowercase' },
        { value: 'capitalize', name: 'Capitalize' }
      ],
      changeProp: 1
    },
    {
      type: 'color',
      label: 'Text Color',
      name: 'color',
      changeProp: 1
    }
  ]

  // Background traits
  const backgroundTraits = [
    {
      type: 'color',
      label: 'Background Color',
      name: 'background-color',
      changeProp: 1
    },
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

  // Border traits
  const borderTraits = [
    {
      type: 'number',
      label: 'Border Width',
      name: 'border-width',
      min: 0,
      max: 50,
      changeProp: 1
    },
    {
      type: 'select',
      label: 'Border Style',
      name: 'border-style',
      options: [
        { value: 'none', name: 'None' },
        { value: 'solid', name: 'Solid' },
        { value: 'dashed', name: 'Dashed' },
        { value: 'dotted', name: 'Dotted' },
        { value: 'double', name: 'Double' }
      ],
      changeProp: 1
    },
    {
      type: 'color',
      label: 'Border Color',
      name: 'border-color',
      changeProp: 1
    },
    {
      type: 'number',
      label: 'Border Radius',
      name: 'border-radius',
      min: 0,
      max: 100,
      changeProp: 1
    }
  ]

  // Layout traits
  const layoutTraits = [
    {
      type: 'select',
      label: 'Display',
      name: 'display',
      options: [
        { value: 'block', name: 'Block' },
        { value: 'inline-block', name: 'Inline Block' },
        { value: 'inline', name: 'Inline' },
        { value: 'flex', name: 'Flex' },
        { value: 'grid', name: 'Grid' },
        { value: 'none', name: 'None' }
      ],
      changeProp: 1
    },
    {
      type: 'select',
      label: 'Flex Direction',
      name: 'flex-direction',
      options: [
        { value: 'row', name: 'Row' },
        { value: 'row-reverse', name: 'Row Reverse' },
        { value: 'column', name: 'Column' },
        { value: 'column-reverse', name: 'Column Reverse' }
      ],
      changeProp: 1
    },
    {
      type: 'select',
      label: 'Justify Content',
      name: 'justify-content',
      options: [
        { value: 'flex-start', name: 'Start' },
        { value: 'center', name: 'Center' },
        { value: 'flex-end', name: 'End' },
        { value: 'space-between', name: 'Space Between' },
        { value: 'space-around', name: 'Space Around' },
        { value: 'space-evenly', name: 'Space Evenly' }
      ],
      changeProp: 1
    },
    {
      type: 'select',
      label: 'Align Items',
      name: 'align-items',
      options: [
        { value: 'flex-start', name: 'Start' },
        { value: 'center', name: 'Center' },
        { value: 'flex-end', name: 'End' },
        { value: 'stretch', name: 'Stretch' },
        { value: 'baseline', name: 'Baseline' }
      ],
      changeProp: 1
    },
    {
      type: 'select',
      label: 'Flex Wrap',
      name: 'flex-wrap',
      options: [
        { value: 'nowrap', name: 'No Wrap' },
        { value: 'wrap', name: 'Wrap' },
        { value: 'wrap-reverse', name: 'Wrap Reverse' }
      ],
      changeProp: 1
    },
    {
      type: 'number',
      label: 'Gap (px)',
      name: 'gap',
      min: 0,
      max: 100,
      changeProp: 1
    }
  ]

  // Sizing traits
  const sizingTraits = [
    {
      type: 'text',
      label: 'Width',
      name: 'width',
      placeholder: 'auto, 100%, 500px',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Height',
      name: 'height',
      placeholder: 'auto, 100%, 500px',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Min Width',
      name: 'min-width',
      placeholder: '0, 100px',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Max Width',
      name: 'max-width',
      placeholder: 'none, 100%, 1200px',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Min Height',
      name: 'min-height',
      placeholder: '0, 100px',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Max Height',
      name: 'max-height',
      placeholder: 'none, 100vh',
      changeProp: 1
    }
  ]

  // Effects traits
  const effectsTraits = [
    {
      type: 'range',
      label: 'Opacity',
      name: 'opacity',
      min: 0,
      max: 1,
      step: 0.1,
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Box Shadow',
      name: 'box-shadow',
      placeholder: '0 4px 6px rgba(0,0,0,0.1)',
      changeProp: 1
    },
    {
      type: 'text',
      label: 'Transform',
      name: 'transform',
      placeholder: 'rotate(45deg), scale(1.2)',
      changeProp: 1
    }
  ]

  // Combine all traits
  const allTraits = [
    ...createSpacingTraits('margin'),
    ...createSpacingTraits('padding'),
    ...typographyTraits,
    ...backgroundTraits,
    ...borderTraits,
    ...layoutTraits,
    ...sizingTraits,
    ...effectsTraits
  ]

  // Add style updater to handle all trait changes
  const setupStyleUpdaters = (model: any) => {
    allTraits.forEach((trait) => {
      model.on(`change:${trait.name}`, function (this: any) {
        const value = this.get(trait.name)

        if (value !== undefined && value !== null && value !== '') {
          const styles: Record<string, any> = {}

          // Handle numeric values that need units
          if (trait.type === 'number' && !['opacity', 'line-height'].includes(trait.name)) {
            styles[trait.name] = `${value}px`
          } else {
            styles[trait.name] = value
          }

          this.setStyle(styles)
        } else {
          // Remove style if value is empty
          this.removeStyle(trait.name)
        }
      })
    })
  }

  // Apply traits to all existing component types
  const applyTraitsToType = (typeName: string) => {
    const existingType = editor.DomComponents.getType(typeName)

    if (existingType) {
      // CRITICAL: Capture the original init function BEFORE modifying the type
      // Otherwise calling existingType.model.prototype.init after addType causes infinite recursion
      const originalInit = existingType.model?.prototype?.init

      editor.DomComponents.addType(typeName, {
        extend: existingType.id,

        model: {
          defaults: {
            ...(existingType.model?.prototype?.defaults || {}),
            traits: [
              ...(existingType.model?.prototype?.defaults?.traits || []),
              ...allTraits
            ]
          },

          init() {
            // Call the captured original init, not the current prototype's init
            if (originalInit) {
              originalInit.call(this)
            }

            setupStyleUpdaters(this)
          }
        }
      })
    }
  }

  // Apply to common element types
  const commonTypes = [
    'default',
    'text',
    'image',
    'video',
    'link',
    'section',
    'div',
    'article',
    'header',
    'footer',
    'main',
    'aside',
    'nav',
    'form',
    'button',
    'input'
  ]

  commonTypes.forEach(applyTraitsToType)

  // Apply to any newly created components
  editor.on('component:create', (component: any) => {
    setupStyleUpdaters(component)
  })

  // Add style manager sectors (grouped view)
  if (options.groupTraits) {
    editor.StyleManager.addSector('spacing', {
      name: 'Spacing',
      open: true,
      buildProps: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']
    })

    editor.StyleManager.addSector('typography', {
      name: 'Typography',
      open: false,
      buildProps: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align', 'text-transform', 'color']
    })

    editor.StyleManager.addSector('background', {
      name: 'Background',
      open: false,
      buildProps: ['background-color', 'background-size', 'background-position', 'background-repeat']
    })

    editor.StyleManager.addSector('borders', {
      name: 'Borders',
      open: false,
      buildProps: ['border-width', 'border-style', 'border-color', 'border-radius']
    })

    editor.StyleManager.addSector('layout', {
      name: 'Layout',
      open: false,
      buildProps: ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap']
    })

    editor.StyleManager.addSector('sizing', {
      name: 'Sizing',
      open: false,
      buildProps: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height']
    })

    editor.StyleManager.addSector('effects', {
      name: 'Effects',
      open: false,
      buildProps: ['opacity', 'box-shadow', 'transform']
    })
  }

  console.log('✅ Comprehensive Traits plugin loaded')
  console.log(`   Total traits added: ${allTraits.length}`)
}
