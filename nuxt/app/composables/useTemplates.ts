/**
 * Template System - Shopify-style theme management for tenant booking pages
 *
 * Each template defines a complete visual style including:
 * - Layout type (structural component variation)
 * - Color palette (with CSS variable names)
 * - Typography styles
 * - Layout preferences
 * - Component styling variants
 *
 * Layout Types:
 * - professional: Dark theme, centered headlines, trust badges, video backgrounds
 * - festive: Warm tones, split two-column hero, photo collages, playful decorations
 * - minimal: Clean whites, product-focused, modern SaaS aesthetic, dual CTAs
 */

export type LayoutType = 'professional' | 'festive' | 'minimal'

export interface TemplateColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
  heroGradientFrom: string
  heroGradientTo: string
}

export interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  /** Structural layout type - determines which hero/section components to use */
  layoutType: LayoutType
  colors: TemplateColors
  styles: {
    heroHeight: 'small' | 'medium' | 'large'
    cardStyle: 'minimal' | 'elevated' | 'bordered' | 'glass'
    buttonStyle: 'rounded' | 'pill' | 'square'
    fontFamily: 'sans' | 'serif' | 'display'
  }
}

// Template definitions
export const templates: Record<string, Template> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and professional design with warm amber tones',
    previewImage: '/templates/classic-preview.png',
    layoutType: 'minimal',
    colors: {
      primary: '#f59e0b',
      secondary: '#3b82f6',
      accent: '#10b981',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      heroGradientFrom: '#f59e0b',
      heroGradientTo: '#ea580c'
    },
    styles: {
      heroHeight: 'medium',
      cardStyle: 'elevated',
      buttonStyle: 'rounded',
      fontFamily: 'sans'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek and minimalist with cool blue tones',
    previewImage: '/templates/modern-preview.png',
    layoutType: 'professional',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      heroGradientFrom: '#6366f1',
      heroGradientTo: '#8b5cf6'
    },
    styles: {
      heroHeight: 'large',
      cardStyle: 'minimal',
      buttonStyle: 'pill',
      fontFamily: 'sans'
    }
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Eye-catching and vibrant with coral and pink tones',
    previewImage: '/templates/bold-preview.png',
    layoutType: 'festive',
    colors: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#ec4899',
      background: '#fef2f2',
      surface: '#ffffff',
      text: '#1f2937',
      textMuted: '#6b7280',
      border: '#fecaca',
      heroGradientFrom: '#ef4444',
      heroGradientTo: '#f97316'
    },
    styles: {
      heroHeight: 'large',
      cardStyle: 'bordered',
      buttonStyle: 'rounded',
      fontFamily: 'display'
    }
  },
  playful: {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and colorful, perfect for kids parties',
    previewImage: '/templates/playful-preview.png',
    layoutType: 'festive',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#f59e0b',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#1e1b4b',
      textMuted: '#7c3aed',
      border: '#ddd6fe',
      heroGradientFrom: '#8b5cf6',
      heroGradientTo: '#06b6d4'
    },
    styles: {
      heroHeight: 'large',
      cardStyle: 'glass',
      buttonStyle: 'pill',
      fontFamily: 'display'
    }
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined with neutral tones',
    previewImage: '/templates/elegant-preview.png',
    layoutType: 'professional',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#c9a227',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#cbd5e1',
      heroGradientFrom: '#1e293b',
      heroGradientTo: '#334155'
    },
    styles: {
      heroHeight: 'medium',
      cardStyle: 'bordered',
      buttonStyle: 'square',
      fontFamily: 'serif'
    }
  }
}

export function useTemplates() {
  const currentTemplate = ref<Template>(templates.classic as Template)
  const tenantBranding = ref<{
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }>({})

  /**
   * Get a template by ID
   */
  function getTemplate(id: string): Template {
    return templates[id] ?? (templates.classic as Template)
  }

  /**
   * Get all available templates
   */
  function getAllTemplates(): Template[] {
    return Object.values(templates)
  }

  /**
   * Apply a template to the page with optional tenant branding overrides
   */
  function applyTemplate(
    templateId: string,
    branding?: {
      primaryColor?: string
      secondaryColor?: string
      accentColor?: string
    }
  ) {
    const template = getTemplate(templateId)
    currentTemplate.value = template
    tenantBranding.value = branding || {}

    // Merge template colors with tenant branding overrides
    const colors = {
      ...template.colors,
      ...(branding?.primaryColor && {
        primary: branding.primaryColor,
        heroGradientFrom: branding.primaryColor
      }),
      ...(branding?.secondaryColor && {
        secondary: branding.secondaryColor,
        heroGradientTo: branding.secondaryColor
      }),
      ...(branding?.accentColor && { accent: branding.accentColor })
    }

    // Apply CSS variables to document root
    if (import.meta.client) {
      const root = document.documentElement
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--template-${kebabCase(key)}`, value)
      })

      // Apply font family
      root.style.setProperty('--template-font', getFontFamily(template.styles.fontFamily))
    }

    return { colors, styles: template.styles }
  }

  /**
   * Get computed CSS styles for the current template
   */
  const templateStyles = computed(() => {
    const template = currentTemplate.value
    const branding = tenantBranding.value

    // Merge colors
    const colors = {
      ...template.colors,
      ...(branding?.primaryColor && {
        primary: branding.primaryColor,
        heroGradientFrom: branding.primaryColor
      }),
      ...(branding?.secondaryColor && {
        secondary: branding.secondaryColor,
        heroGradientTo: branding.secondaryColor
      }),
      ...(branding?.accentColor && { accent: branding.accentColor })
    }

    return {
      '--template-primary': colors.primary,
      '--template-secondary': colors.secondary,
      '--template-accent': colors.accent,
      '--template-background': colors.background,
      '--template-surface': colors.surface,
      '--template-text': colors.text,
      '--template-text-muted': colors.textMuted,
      '--template-border': colors.border,
      '--template-hero-from': colors.heroGradientFrom,
      '--template-hero-to': colors.heroGradientTo,
      '--template-font': getFontFamily(template.styles.fontFamily)
    }
  })

  /**
   * Get CSS classes for template-specific styling
   */
  const templateClasses = computed(() => {
    const template = currentTemplate.value
    return {
      card: getCardClasses(template.styles.cardStyle),
      button: getButtonClasses(template.styles.buttonStyle),
      hero: getHeroClasses(template.styles.heroHeight)
    }
  })

  /**
   * Get the hero component name for the current template's layout type
   */
  const heroComponent = computed(() => {
    const layoutType = currentTemplate.value.layoutType
    return getHeroComponentName(layoutType)
  })

  /**
   * Get the testimonials variant for the current template's layout type
   */
  const testimonialsVariant = computed(() => {
    return currentTemplate.value.layoutType
  })

  /**
   * Get layout type for a specific template
   */
  function getLayoutType(templateId: string): LayoutType {
    return getTemplate(templateId).layoutType
  }

  return {
    currentTemplate: readonly(currentTemplate),
    templates,
    getTemplate,
    getAllTemplates,
    applyTemplate,
    templateStyles,
    templateClasses,
    heroComponent,
    testimonialsVariant,
    getLayoutType,
    getHeroComponentName
  }
}

// Helper functions

/**
 * Get the hero component name based on layout type
 * Returns the component name to use with <component :is="...">
 */
export function getHeroComponentName(layoutType: LayoutType): string {
  const componentMap: Record<LayoutType, string> = {
    professional: 'HeroProfessional',
    festive: 'HeroFestive',
    minimal: 'HeroMinimal'
  }
  return componentMap[layoutType] || 'HeroMinimal'
}

function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function getFontFamily(font: 'sans' | 'serif' | 'display'): string {
  switch (font) {
    case 'serif':
      return 'Georgia, Cambria, "Times New Roman", Times, serif'
    case 'display':
      return '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif'
    default:
      return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
}

function getCardClasses(style: 'minimal' | 'elevated' | 'bordered' | 'glass'): string {
  switch (style) {
    case 'minimal':
      return 'bg-white dark:bg-gray-900'
    case 'elevated':
      return 'bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow'
    case 'bordered':
      return 'bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700'
    case 'glass':
      return 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg'
    default:
      return 'bg-white dark:bg-gray-900 shadow-lg'
  }
}

function getButtonClasses(style: 'rounded' | 'pill' | 'square'): string {
  switch (style) {
    case 'pill':
      return 'rounded-full'
    case 'square':
      return 'rounded-none'
    default:
      return 'rounded-lg'
  }
}

function getHeroClasses(height: 'small' | 'medium' | 'large'): string {
  switch (height) {
    case 'small':
      return 'min-h-[40vh]'
    case 'large':
      return 'min-h-[80vh]'
    default:
      return 'min-h-[60vh]'
  }
}
