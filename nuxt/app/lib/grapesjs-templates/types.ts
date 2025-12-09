/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GrapesJS Template Type Definitions
 * Ensures type safety across template system
 */

export type TemplateCategoryType = 'Starter' | 'Professional' | 'Specialized'

export type TemplateTag
  = | 'professional'
    | 'clean'
    | 'traditional'
    | 'responsive'
    | 'fun'
    | 'colorful'
    | 'kids'
    | 'playful'
    | 'vibrant'
    | 'premium'
    | 'luxury'
    | 'elegant'
    | 'high-end'
    | 'dark'
    | 'corporate'
    | 'enterprise'
    | 'multi-location'
    | 'local'
    | 'seo'
    | 'community'
    | 'trust'
    | 'neighborhood'
    | 'events'
    | 'conversion'
    | 'birthday'
    | 'categories'
    | 'cta'
    | 'booking'
    | 'high-converting'
    | 'sales'
    | 'gallery'
    | 'images'
    | 'visual'
    | 'photography'
    | 'portfolio'
    | 'testimonials'
    | 'reviews'
    | 'safety'
    | 'credibility'

export interface TemplateConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fonts: {
    heading: string
    body: string
  }
  features: string[]
}

export interface GrapesJSTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategoryType
  tags: TemplateTag[]
  preview: string // SVG markup
  thumbnail: string // Base64 data URL
  html: string // Full HTML document
  css?: string // Optional additional CSS
  components?: any // GrapesJS components structure
  styles?: any // GrapesJS styles structure
  config: TemplateConfig
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  templates: string[] // Template IDs
}

export interface TemplateFilter {
  category?: TemplateCategoryType
  tags?: TemplateTag[]
  search?: string
}

/**
 * Template selection result
 */
export interface TemplateSelection {
  template: GrapesJSTemplate
  customizations?: {
    colors?: {
      primary?: string
      secondary?: string
      accent?: string
    }
    fonts?: {
      heading?: string
      body?: string
    }
  }
}

/**
 * Template metadata for storage
 */
export interface TemplateMetadata {
  templateId: string
  selectedAt: Date
  customizations?: TemplateSelection['customizations']
  version: string
}

// Export types for external use
export type { GrapesJSTemplate as default }
