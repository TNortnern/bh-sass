/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Template System Registry
 *
 * Central entry point for all website builder templates.
 * Templates are lazy-loaded for performance.
 */

import type {
  TemplateDefinition,
  TemplateRegistry,
  SmartBlockDefinition,
  ThemePreset,
  GrapesJSBlockConfig,
  WebsiteTemplate,
  TemplatePage
} from './types'
import { themePresets, getTheme, generateThemeCssVars, getGoogleFontsUrl } from './theme-presets'

// ============================================================================
// UNIFIED TEMPLATE TYPE
// Supports both legacy TemplateDefinition and newer WebsiteTemplate formats
// ============================================================================

export type UnifiedTemplate = TemplateDefinition | WebsiteTemplate

// Type guard to check if template is WebsiteTemplate (has navigation/footer)
export const isWebsiteTemplate = (template: UnifiedTemplate): template is WebsiteTemplate => {
  return 'navigation' in template && 'footer' in template
}

// Type guard to check if a page has content (full HTML) vs sections array
export const isContentBasedPage = (page: TemplatePage): boolean => {
  return typeof page.content === 'string' && page.content.length > 0
}

// ============================================================================
// LAZY TEMPLATE LOADERS
// Templates are loaded on-demand to reduce initial bundle size
// ============================================================================

const templateLoaders: Record<string, () => Promise<{ default: UnifiedTemplate }>> = {
  starter: () => import('./starter') as any,
  bounce: () => import('./bounce') as any,
  luxe: () => import('./luxe') as any,
  energy: () => import('./energy') as any,
  trust: () => import('./trust') as any,
  sugarrush: () => import('./sugarrush') as any,
  springboard: () => import('./springboard') as any,
  coastal: () => import('./coastal') as any,
  fiesta: () => import('./fiesta') as any,
  neon: () => import('./neon') as any,
  garden: () => import('./garden') as any,
  minimal: () => import('./minimal') as any,
  carnival: () => import('./carnival') as any,
  funhouse: () => import('./funhouse') as any,
  industrial: () => import('./industrial') as any
}

// ============================================================================
// SMART BLOCKS REGISTRY
// ============================================================================

let smartBlocksRegistry: Map<string, SmartBlockDefinition> | null = null

const loadSmartBlocks = async (): Promise<Map<string, SmartBlockDefinition>> => {
  if (smartBlocksRegistry) return smartBlocksRegistry

  const blocks = await import('./smart-blocks')
  smartBlocksRegistry = new Map(Object.entries(blocks.smartBlocks))
  return smartBlocksRegistry
}

// ============================================================================
// TEMPLATE API
// ============================================================================

/**
 * Get list of all available templates (metadata only, no content)
 */
export const getTemplateList = (): {
  id: string
  name: string
  codename: string
  description: string
}[] => {
  return [
    {
      id: 'funhouse',
      name: 'Funhouse',
      codename: 'Funhouse',
      description: 'Playful and energetic design with bold red, purple, and orange colors. Chunky typography and amusement park vibe - perfect for family-friendly bounce house rentals.'
    },
    {
      id: 'sugarrush',
      name: 'Sugar Rush',
      codename: 'SugarRush',
      description: 'Clean, bright, modern design with coral accents. Perfect for family party rentals.'
    },
    {
      id: 'springboard',
      name: 'Springboard',
      codename: 'Springboard',
      description: 'Modern gradient design with real-time booking focus - orange to teal palette, clean and trustworthy'
    },
    {
      id: 'carnival',
      name: 'Carnival',
      codename: 'Carnival',
      description: 'Colorful, family-friendly design with sky blue backgrounds and bright red accents. Traditional bounce house company aesthetic.'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      codename: 'Industrial',
      description: 'Professional equipment rental theme with dark slate, orange accents, and clean lines. Inspired by construction rental sites - trustworthy and equipment-focused.'
    },
    {
      id: 'coastal',
      name: 'Coastal',
      codename: 'Coastal',
      description: 'Beach-inspired design with ocean blues. Perfect for water slides and summer parties.'
    },
    {
      id: 'fiesta',
      name: 'Fiesta',
      codename: 'Fiesta',
      description: 'Warm, festive design with vibrant accents. Perfect for cultural celebrations and community events.'
    },
    {
      id: 'bounce',
      name: 'Family Party',
      codename: 'Bounce',
      description: 'Modern, clean design with warm gradients. Great for birthday parties and family events.'
    },
    {
      id: 'trust',
      name: 'Clean Professional',
      codename: 'Trust',
      description: 'Professional design for corporate clients, schools, and churches.'
    },
    {
      id: 'luxe',
      name: 'Elegant Premium',
      codename: 'Luxe',
      description: 'Sophisticated dark theme for high-end events and upscale celebrations.'
    },
    {
      id: 'energy',
      name: 'Energy',
      codename: 'Energy',
      description: 'Bold dark theme with emerald accents. Perfect for sports events and active entertainment.'
    },
    {
      id: 'neon',
      name: 'Neon',
      codename: 'Neon',
      description: 'Vibrant dark theme with neon accents. Perfect for teen parties and evening events.'
    },
    {
      id: 'garden',
      name: 'Garden',
      codename: 'Garden',
      description: 'Natural, earthy design with lush greens. Perfect for eco-friendly and outdoor events.'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      codename: 'Minimal',
      description: 'Ultra-clean Swiss design with confident neutrals. Perfect for modern, professional businesses.'
    },
    {
      id: 'starter',
      name: 'Starter',
      codename: 'Starter',
      description: 'Simple starter template for first-time users to customize.'
    }
  ]
}

/**
 * Load a full template definition by ID
 * Supports both TemplateDefinition and WebsiteTemplate formats
 */
export const loadTemplate = async (id: string): Promise<UnifiedTemplate | null> => {
  const loader = templateLoaders[id]
  if (!loader) {
    console.warn(`Template not found: ${id}`)
    return null
  }

  try {
    const module = await loader()
    return module.default
  } catch (error) {
    console.error(`Failed to load template: ${id}`, error)
    return null
  }
}

/**
 * Get a smart block definition by ID
 */
export const getSmartBlock = async (id: string): Promise<SmartBlockDefinition | null> => {
  const blocks = await loadSmartBlocks()
  return blocks.get(id) || null
}

/**
 * Get all smart block definitions
 */
export const getAllSmartBlocks = async (): Promise<SmartBlockDefinition[]> => {
  const blocks = await loadSmartBlocks()
  return Array.from(blocks.values())
}

/**
 * Get theme preset by ID
 */
export { getTheme, themePresets, generateThemeCssVars, getGoogleFontsUrl }

// ============================================================================
// GRAPESJS INTEGRATION
// ============================================================================

/**
 * Register a template with GrapesJS editor
 */
export const registerTemplateWithEditor = async (
  editor: any,
  templateId: string,
  themeOverrides?: Partial<ThemePreset['colors']>
): Promise<boolean> => {
  const template = await loadTemplate(templateId)
  if (!template) return false

  const bm = editor.BlockManager

  // Get theme and apply overrides
  const defaultTheme = (template as any).defaultTheme || {}
  const theme = {
    ...defaultTheme,
    colors: {
      ...(defaultTheme.colors || {}),
      ...themeOverrides
    }
  }

  // Generate and inject theme CSS
  const themeCss = generateThemeCssVars(theme)
  const fontsUrl = getGoogleFontsUrl(theme)

  // Add to editor's CSS
  const existingCss = editor.getCss() || ''
  editor.setComponents('')
  editor.setStyle(`
${fontsUrl ? `@import url('${fontsUrl}');` : ''}
${themeCss}
${template.globalCss}
${existingCss}
  `.trim())

  // Register template pages as blocks
  template.pages.forEach((page: any) => {
    // Register the full page as a block
    bm.add(`template-page-${page.id}`, {
      label: page.name,
      category: `${template.name} Pages`,
      media: generatePagePreviewSvg(page.name || 'Page'),
      content: (page.sections || []).map((s: any) => s.html).join('\n'),
      activate: true
    })

    // Register individual sections
    if (page.sections) {
      page.sections.forEach((section: any) => {
        bm.add(`template-section-${section.id}`, {
          label: section.name,
          category: `${template.name} Sections`,
          media: generateSectionPreviewSvg(section.name || 'Section'),
          content: section.html,
          activate: true
        })
      })
    }
  })

  console.log(`✅ Registered template: ${template.name} with ${template.pages.length} pages`)
  return true
}

/**
 * Register all smart blocks with GrapesJS editor
 */
export const registerSmartBlocksWithEditor = async (
  editor: any,
  tenantId: string,
  theme: ThemePreset
): Promise<void> => {
  const blocks = await getAllSmartBlocks()
  const bm = editor.BlockManager

  blocks.forEach((block) => {
    const context = {
      theme,
      tenantId,
      editorMode: true
    }

    bm.add(`smart-${block.id}`, {
      label: block.label,
      category: 'Smart Blocks',
      media: block.icon,
      content: block.render(
        // Use default props for preview
        Object.fromEntries(
          Object.entries(block.props).map(([key, def]) => [key, def.default])
        ),
        context
      ),
      activate: true
    })
  })

  console.log(`✅ Registered ${blocks.length} smart blocks`)
}

// ============================================================================
// PREVIEW SVG GENERATORS
// ============================================================================

const generatePagePreviewSvg = (name: string): string => {
  const colors = {
    bg: '#f8fafc',
    header: '#e2e8f0',
    content: '#cbd5e1',
    accent: '#3b82f6'
  }

  return `<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="76" rx="4" fill="${colors.bg}" stroke="${colors.content}"/>
    <rect x="2" y="2" width="116" height="16" rx="4" fill="${colors.header}"/>
    <rect x="10" y="24" width="40" height="20" rx="2" fill="${colors.accent}" fill-opacity="0.2"/>
    <rect x="10" y="50" width="100" height="6" rx="1" fill="${colors.content}"/>
    <rect x="10" y="60" width="80" height="4" rx="1" fill="${colors.content}" fill-opacity="0.5"/>
    <text x="60" y="72" text-anchor="middle" fill="${colors.accent}" font-size="6" font-family="system-ui">${name}</text>
  </svg>`
}

const generateSectionPreviewSvg = (name: string): string => {
  const colors = {
    bg: '#f1f5f9',
    line: '#94a3b8',
    accent: '#3b82f6'
  }

  return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="${colors.bg}" stroke="${colors.line}" stroke-opacity="0.3"/>
    <rect x="10" y="10" width="60" height="8" rx="2" fill="${colors.line}"/>
    <rect x="10" y="24" width="100" height="4" rx="1" fill="${colors.line}" fill-opacity="0.5"/>
    <rect x="10" y="32" width="90" height="4" rx="1" fill="${colors.line}" fill-opacity="0.5"/>
    <rect x="10" y="44" width="30" height="10" rx="2" fill="${colors.accent}"/>
    <text x="60" y="54" text-anchor="middle" fill="${colors.accent}" font-size="5" font-family="system-ui">${name}</text>
  </svg>`
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './types'
export * from './theme-presets'
