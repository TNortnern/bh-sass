/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Template System Type Definitions
 *
 * These types define the structure for website builder templates,
 * smart blocks, and theme customization.
 */

// ============================================================================
// THEME TYPES
// ============================================================================

export interface ThemeColors {
  primary: string // Main brand color (buttons, links, accents)
  secondary: string // Secondary accent color
  accent: string // Highlight/call-to-action color
  background: string // Page background
  surface: string // Card/section backgrounds
  surfaceAlt: string // Alternate surface (striped sections)
  text: string // Primary text color
  textMuted: string // Secondary/muted text
  textOnPrimary: string // Text color on primary backgrounds
  border: string // Border color
  success: string // Success states
  warning: string // Warning states
  error: string // Error states
}

export interface ThemeFonts {
  heading: string // Font family for headings
  body: string // Font family for body text
  mono: string // Monospace font for code
}

export interface ThemeSpacing {
  section: string // Vertical spacing between sections (e.g., 'py-24')
  container: string // Max container width (e.g., 'max-w-7xl')
  gap: string // Default gap between elements
}

export type BorderRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ThemePreset {
  id: string
  name: string
  description: string
  colors: ThemeColors
  fonts: ThemeFonts
  spacing: ThemeSpacing
  borderRadius: BorderRadiusPreset
  shadows: boolean // Whether to use shadows
}

// ============================================================================
// SMART BLOCK TYPES
// ============================================================================

export type SmartBlockPropType
  = | 'text'
    | 'number'
    | 'checkbox'
    | 'select'
    | 'multiselect'
    | 'color'
    | 'relationship'

export interface SmartBlockPropDefinition {
  type: SmartBlockPropType
  label: string
  default: any
  options?: { value: string, label: string }[]
  min?: number
  max?: number
  relationTo?: string
  help?: string
}

export interface SmartBlockDefinition {
  id: string
  label: string
  category: string
  description: string
  icon: string
  props: Record<string, SmartBlockPropDefinition>

  // Function to generate the HTML content
  render: (props: Record<string, any>, context: SmartBlockContext) => string

  // Function to generate associated CSS
  styles?: (props: Record<string, any>, theme: ThemePreset) => string

  // Data fetching configuration
  dataSource?: {
    endpoint: string
    params?: (props: Record<string, any>) => Record<string, any>
    transform?: (data: any) => any
  }
}

export interface SmartBlockContext {
  theme: ThemePreset
  tenantId: string
  editorMode: boolean // True when in GrapesJS editor, false on live site
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface TemplatePageSection {
  id: string
  name?: string
  type?: string
  html: string
  css?: string
}

/**
 * Template page - supports both section-based and content-based formats
 * - Section-based: uses `sections[]` array for modular page building
 * - Content-based: uses `content` string for full HTML pages
 */
export interface TemplatePage {
  id?: string
  name?: string
  slug?: string
  path?: string
  title?: string
  description?: string
  // Section-based format (modular)
  sections?: TemplatePageSection[]
  // Content-based format (full HTML)
  content?: string
}

/**
 * Legacy TemplateDefinition for GrapesJS-style templates
 */
export interface TemplateDefinition {
  id: string
  name: string
  codename: string
  description: string
  thumbnail: string // SVG or image URL for preview
  targetAudience: string
  visualStyle: string

  // Theme configuration
  defaultTheme: ThemePreset
  supportedThemes: string[] // IDs of compatible theme presets

  // Pages included
  pages: TemplatePage[]

  // Lazy page loader (for templates with dynamic imports)
  loadPages?: () => Promise<TemplatePage[]>

  // Smart blocks used by this template
  smartBlocks: string[] // IDs of smart blocks used

  // Global CSS that applies to all pages
  globalCss: string

  // Custom fonts to load
  fonts?: {
    google?: string[] // Google Fonts URLs
    custom?: { name: string, url: string }[]
  }
}

// ============================================================================
// WEBSITE TEMPLATE TYPES (Full-page content-based templates)
// ============================================================================

export interface WebsiteTemplateColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface WebsiteTemplateFonts {
  heading: string
  body: string
}

export interface NavigationLink {
  text: string
  href: string
}

export interface WebsiteNavigation {
  logo: string
  links: NavigationLink[]
  ctaButton?: {
    text: string
    href: string
  }
}

export interface FooterColumn {
  title: string
  content?: string
  links?: NavigationLink[]
}

export interface WebsiteFooter {
  columns: FooterColumn[]
  copyright: string
}

/**
 * WebsiteTemplate - Full-page HTML templates with navigation/footer configs
 * Used by templates like carnival, industrial, funhouse, etc.
 */
export interface WebsiteTemplate {
  id: string
  name: string
  description: string
  preview?: string // Preview image URL
  thumbnail?: string // Thumbnail image URL
  category: string // e.g., 'traditional', 'professional', 'playful'
  colors: WebsiteTemplateColors
  fonts: WebsiteTemplateFonts
  fontLinks: string[] // Google Fonts URLs
  pages: TemplatePage[]
  globalCss: string
  navigation: WebsiteNavigation
  footer: WebsiteFooter
}

// ============================================================================
// DOCUMENT SYSTEM TYPES
// ============================================================================

export type DocumentType = 'terms' | 'waiver' | 'contract' | 'policy'

export interface MergeField {
  key: string
  label: string
  category: 'business' | 'customer' | 'booking' | 'date'
  example: string
}

export interface SignatureData {
  type: 'drawn' | 'typed'
  value: string // Base64 image data for drawn, text for typed
  fontFamily?: string // For typed signatures
}

export interface DocumentSigningContext {
  documentId: string
  bookingId?: string
  customerId?: string
  mergeData: Record<string, string>
}

// ============================================================================
// REGISTRY TYPES
// ============================================================================

export interface TemplateRegistry {
  templates: Map<string, () => Promise<TemplateDefinition>>
  smartBlocks: Map<string, SmartBlockDefinition>
  themes: Map<string, ThemePreset>
}

// ============================================================================
// EDITOR INTEGRATION TYPES
// ============================================================================

export interface GrapesJSBlockConfig {
  id: string
  label: string
  category: string
  content: string
  media?: string // SVG icon
  attributes?: Record<string, any>
  activate?: boolean
}

export interface TemplateEditorState {
  activeTemplate: string | null
  activeTheme: string
  customColors: Partial<ThemeColors>
  unsavedChanges: boolean
}
