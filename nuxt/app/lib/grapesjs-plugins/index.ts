/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GrapesJS Plugins Index
 *
 * Central export file for all custom GrapesJS plugins.
 * Import from this file to use plugins in your GrapesJS editor.
 *
 * KEY PHILOSOPHY:
 * - Smart component detection makes ALL text/images editable automatically
 * - Users should NEVER need to touch HTML - everything is visually editable
 * - Dashed borders indicate editable elements on hover
 * - Double-click to edit text, single-click for images
 */

// Import all plugins
import intelligentTextEditor from './intelligent-text-editor'
import intelligentImageEditor from './intelligent-image-editor'
import defaultWidthPlugin from './default-width-plugin'
import comprehensiveTraits from './comprehensive-traits'

// Import smart component detection (makes ALL text/images editable)
import { initializeSmartComponents } from '../grapesjs-core/smart-components'
import { initializeLightweightBlocks, loadHyperUIBlocks, getHyperUICategories, CORE_BLOCKS } from '../grapesjs-core/lightweight-blocks'

// Export individual plugins
export {
  intelligentTextEditor,
  intelligentImageEditor,
  defaultWidthPlugin,
  comprehensiveTraits,
  // Smart component detection - THE KEY to intuitive editing
  initializeSmartComponents,
  initializeLightweightBlocks,
  loadHyperUIBlocks,
  getHyperUICategories,
  CORE_BLOCKS
}

// Export types
export type { IntelligentTextEditorOptions } from './intelligent-text-editor'
export type { IntelligentImageEditorOptions } from './intelligent-image-editor'
export type { DefaultWidthPluginOptions } from './default-width-plugin'
export type { ComprehensiveTraitsOptions } from './comprehensive-traits'

/**
 * Register all plugins with a GrapesJS editor instance
 *
 * CRITICAL: This initializes the SMART COMPONENT DETECTION system that makes
 * ALL text and images editable without users needing to know HTML.
 *
 * @param editor - GrapesJS editor instance
 * @param options - Plugin options
 *
 * @example
 * ```typescript
 * import grapesjs from 'grapesjs'
 * import { registerAllPlugins } from '~/lib/grapesjs-plugins'
 *
 * const editor = grapesjs.init({
 *   container: '#gjs',
 *   // ... other config
 * })
 *
 * registerAllPlugins(editor)
 * ```
 */
export function registerAllPlugins(
  editor: any,
  options: {
    textEditor?: any
    imageEditor?: any
    defaultWidth?: any
    traits?: any
    loadBlocks?: boolean
  } = {}
) {
  try {
    // FIRST: Initialize smart component detection
    // This makes ALL text elements (h1-h6, p, span, a, button, etc.) editable on double-click
    // This makes ALL images (img tags AND background-images) replaceable
    initializeSmartComponents(editor)

    // SECOND: Initialize lightweight blocks (performance-optimized)
    if (options.loadBlocks !== false) {
      initializeLightweightBlocks(editor)
    }

    // Call plugins directly as functions (the correct GrapesJS way)
    intelligentTextEditor(editor, options.textEditor || {})
    intelligentImageEditor(editor, options.imageEditor || {})
    defaultWidthPlugin(editor, options.defaultWidth || {})
    comprehensiveTraits(editor, options.traits || {})

    console.log('✅ All GrapesJS plugins registered with SMART COMPONENT DETECTION')
    console.log('   - Any text element is now editable (double-click to edit)')
    console.log('   - Any image is now replaceable (double-click to replace)')
    console.log('   - Dashed borders indicate editable elements on hover')
  } catch (error) {
    console.error('Failed to register plugins:', error)
  }

  return editor
}

/**
 * Get plugin configuration for GrapesJS init
 *
 * Use this to get the plugins array and pluginsOpts object
 * for passing to grapesjs.init()
 *
 * @example
 * ```typescript
 * import grapesjs from 'grapesjs'
 * import { getPluginConfig } from '~/lib/grapesjs-plugins'
 *
 * const { plugins, pluginsOpts } = getPluginConfig()
 *
 * const editor = grapesjs.init({
 *   container: '#gjs',
 *   plugins,
 *   pluginsOpts
 * })
 * ```
 */
export function getPluginConfig(options: {
  textEditor?: any
  imageEditor?: any
  defaultWidth?: any
  traits?: any
} = {}) {
  return {
    plugins: [
      intelligentTextEditor,
      intelligentImageEditor,
      defaultWidthPlugin,
      comprehensiveTraits
    ],
    pluginsOpts: {
      [intelligentTextEditor.name]: options.textEditor || {},
      [intelligentImageEditor.name]: options.imageEditor || {},
      [defaultWidthPlugin.name]: options.defaultWidth || {},
      [comprehensiveTraits.name]: options.traits || {}
    }
  }
}

/**
 * Default export - all plugins as an object
 */
export default {
  intelligentTextEditor,
  intelligentImageEditor,
  defaultWidthPlugin,
  comprehensiveTraits,
  // Smart component detection - THE KEY to intuitive editing
  initializeSmartComponents,
  initializeLightweightBlocks,
  loadHyperUIBlocks,
  getHyperUICategories,
  CORE_BLOCKS,
  registerAllPlugins,
  getPluginConfig
}
