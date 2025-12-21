<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars, vue/no-v-html */
import { defaultSections, sectionTypes, sectionDefaults, allBlocks, type WebsiteSection } from '~/data/website-builder-sample'
import { loadTemplate, getTemplateList, isWebsiteTemplate, isContentBasedPage, type UnifiedTemplate } from '~/lib/templates'
import type { TemplateDefinition, WebsiteTemplate, TemplatePage } from '~/lib/templates/types'
import { generateItemCard, generateFeaturedItemsGrid, generateInventoryGrid } from '~/lib/templates/smart-block-renderer'
import { generateThemeCssVars } from '~/lib/templates/theme-presets'
import type { InventoryItem } from '~/composables/useInventory'

// Import all section components explicitly for dynamic rendering
import WebsiteSectionsHeroFullWidth from '~/components/website-sections/HeroFullWidth.vue'
import WebsiteSectionsHeroSplit from '~/components/website-sections/HeroSplit.vue'
import WebsiteSectionsFeaturedRentals from '~/components/website-sections/FeaturedRentals.vue'
import WebsiteSectionsAboutSection from '~/components/website-sections/AboutSection.vue'
import WebsiteSectionsTestimonialsGrid from '~/components/website-sections/TestimonialsGrid.vue'
import WebsiteSectionsTrustBadges from '~/components/website-sections/TrustBadges.vue'
import WebsiteSectionsCTABanner from '~/components/website-sections/CTABanner.vue'
import WebsiteSectionsGalleryGrid from '~/components/website-sections/GalleryGrid.vue'
import WebsiteSectionsFAQAccordion from '~/components/website-sections/FAQAccordion.vue'
import WebsiteSectionsHowItWorks from '~/components/website-sections/HowItWorks.vue'
import WebsiteSectionsContactSection from '~/components/website-sections/ContactSection.vue'
import WebsiteSectionsFooterSection from '~/components/website-sections/FooterSection.vue'
import WebsiteSectionsNavigationBar from '~/components/website-sections/NavigationBar.vue'
import WebsiteSectionsPricingTable from '~/components/website-sections/PricingTable.vue'
import WebsiteSectionsStatsSection from '~/components/website-sections/StatsSection.vue'
import WebsiteSectionsFeaturesGrid from '~/components/website-sections/FeaturesGrid.vue'
import WebsiteSectionsLogoCloud from '~/components/website-sections/LogoCloud.vue'
import WebsiteSectionsCustomHTML from '~/components/website-sections/CustomHTML.vue'
import WebsiteSectionsBentoGrid from '~/components/website-sections/BentoGrid.vue'
import WebsiteSectionsTeamSection from '~/components/website-sections/TeamSection.vue'
import WebsiteSectionsNewsletterSection from '~/components/website-sections/NewsletterSection.vue'
import WebsiteSectionsBlogCards from '~/components/website-sections/BlogCards.vue'
import WebsiteSectionsWaiverSignature from '~/components/website-sections/WaiverSignature.vue'
import SectionPropertiesPanel from '~/components/website-builder/SectionPropertiesPanel.vue'
import HyperUIBlockBrowser from '~/components/website-builder/HyperUIBlockBrowser.vue'
import ElementStylePanel from '~/components/website-builder/ElementStylePanel.vue'
import LayersPanel from '~/components/website-builder/LayersPanel.vue'
import ThemePanel from '~/components/website-builder/ThemePanel.vue'
import PageManagerPanel from '~/components/website-builder/PageManagerPanel.vue'
import type { HyperUIBlock } from '~/data/hyperui-blocks'

// Saved blocks composable
const { savedBlocks, saveBlock, deleteBlock } = useSavedBlocks()

// Website builder data persistence
const {
  isSaving,
  save: saveWebsiteData,
  load: loadWebsiteData,
  scheduleAutoSave
} = useWebsiteBuilder()

// Website variables composable (for template variable replacement)
const { replaceVariables, getVariablesList, variables } = useWebsiteVariables()

// Inventory composable (for real data in templates)
const { items: inventoryItems, fetchItems: fetchInventoryItems } = useInventory()
const { currentUser } = useAuth()

// Get tenant slug for booking URLs
const tenantSlug = computed(() => {
  const tenant = currentUser.value?.tenantId
  if (tenant && typeof tenant === 'object') {
    return (tenant).slug || 'booking'
  }
  return 'booking'
})

// GrapesJS templates state
const gjsTemplates = ref<UnifiedTemplate[]>([])
const loadingTemplates = ref(false)

// Sidebar tabs
type SidebarTab = 'sections' | 'blocks' | 'templates' | 'layers' | 'pages' | 'theme'
const activeTab = ref<SidebarTab>('sections')

// Theme settings
interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  customCss: string
}

const themeSettings = ref<ThemeSettings>({
  primaryColor: '#f59e0b',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  backgroundColor: '#ffffff',
  textColor: '#111111',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  customCss: ''
})

const updateTheme = (field: keyof ThemeSettings, value: string) => {
  themeSettings.value[field] = value
}

// Load GrapesJS templates on mount
const loadGjsTemplates = async () => {
  loadingTemplates.value = true
  try {
    const templateList = getTemplateList()
    const loadedTemplates: UnifiedTemplate[] = []
    for (const item of templateList) {
      const template = await loadTemplate(item.id)
      if (template) {
        loadedTemplates.push(template)
      }
    }
    gjsTemplates.value = loadedTemplates
  } catch (e) {
    console.error('Failed to load templates:', e)
  } finally {
    loadingTemplates.value = false
  }
}

// Apply a GrapesJS template - creates all pages from template
// Supports both TemplateDefinition (sections-based) and WebsiteTemplate (content-based) formats
const applyGjsTemplate = async (template: UnifiedTemplate) => {
  // Ensure inventory is loaded for real data in templates
  if (!inventoryItems.value || inventoryItems.value.length === 0) {
    try {
      await fetchInventoryItems()
    } catch (e) {
      console.warn('Could not fetch inventory, using placeholder content:', e)
    }
  }

  // Handle lazy-loaded pages (some templates use loadPages function)
  let templatePages = template.pages
  if ((!templatePages || templatePages.length === 0) && 'loadPages' in template && template.loadPages) {
    try {
      templatePages = await template.loadPages()
    } catch (e) {
      console.error('Failed to load template pages:', e)
      return
    }
  }

  if (!templatePages || templatePages.length === 0) {
    console.error('Template has no pages:', template.name)
    return
  }

  // Get booking URL for item links
  const bookingUrl = `/book/${tenantSlug.value}`
  const templateStyle = template.id as 'starter' | 'bounce' | 'luxe' | 'energy' | 'trust' | 'neon' | 'garden' | 'minimal' | 'funhouse'

  // Generate theme CSS variables from template's defaultTheme
  // This ensures all CSS variable references like var(--color-primary) work correctly
  let themeCss = ''
  if ('defaultTheme' in template && template.defaultTheme) {
    themeCss = generateThemeCssVars(template.defaultTheme)
  }

  // Combine theme CSS with template's globalCss
  const fullGlobalCss = [themeCss, template.globalCss || ''].filter(Boolean).join('\n\n')

  // Helper to replace smart block placeholders with real inventory data
  const replaceSmartBlocks = (html: string): string => {
    const items = inventoryItems.value || []

    // Helper to find matching closing tag for nested divs
    const replaceSmartBlock = (source: string, blockType: string, replacement: string): string => {
      const marker = `data-smart-block="${blockType}"`
      const startIdx = source.indexOf(marker)
      if (startIdx === -1) return source

      // Find the opening < of this div tag
      const tagStart = source.lastIndexOf('<div', startIdx)
      if (tagStart === -1) return source

      // Find the end of the opening tag
      const tagEnd = source.indexOf('>', startIdx)
      if (tagEnd === -1) return source

      // Now count divs to find the matching closing tag
      let depth = 1
      let pos = tagEnd + 1
      while (depth > 0 && pos < source.length) {
        const nextOpen = source.indexOf('<div', pos)
        const nextClose = source.indexOf('</div>', pos)

        if (nextClose === -1) break // No more closing tags, malformed HTML

        if (nextOpen !== -1 && nextOpen < nextClose) {
          // Found an opening div before closing
          depth++
          pos = nextOpen + 4
        } else {
          // Found closing div first
          depth--
          if (depth === 0) {
            // This is our matching closing tag
            const closeEnd = nextClose + 6 // length of '</div>'
            const before = source.substring(0, tagStart)
            const after = source.substring(closeEnd)
            return before + `<div ${marker}>\n${replacement}\n</div>` + after
          }
          pos = nextClose + 6
        }
      }
      return source
    }

    // Replace featured items placeholder
    if (html.includes('data-smart-block="featured-items"')) {
      const featuredGrid = generateFeaturedItemsGrid([...items] as InventoryItem[], templateStyle, bookingUrl, 6)
      html = replaceSmartBlock(html, 'featured-items', featuredGrid)
    }

    // Replace inventory grid placeholder
    if (html.includes('data-smart-block="inventory-grid"')) {
      const inventoryGrid = generateInventoryGrid([...items] as InventoryItem[], templateStyle, bookingUrl)
      html = replaceSmartBlock(html, 'inventory-grid', inventoryGrid)
    }

    return html
  }

  // Convert all template pages to WebsitePages
  // Handle both content-based (WebsiteTemplate) and sections-based (TemplateDefinition) formats
  const newPages: WebsitePage[] = templatePages.map((templatePage, pageIdx) => {
    const isHome = templatePage.slug === '/' || templatePage.slug === '' || templatePage.id === 'home'
    const pageId = templatePage.id || `page-${pageIdx}`
    const pageName = templatePage.name || templatePage.title || `Page ${pageIdx + 1}`

    let sections: WebsiteSection[] = []

    // Check if this is a content-based page (full HTML string)
    if (isContentBasedPage(templatePage)) {
      // Content-based page - treat whole content as one CustomHTML section
      let processedHtml = replaceVariables(templatePage.content!)
      processedHtml = replaceSmartBlocks(processedHtml)

      sections = [{
        id: `customhtml-${Date.now()}-${pageId}`,
        type: 'CustomHTML' as const,
        data: {
          html: processedHtml,
          css: fullGlobalCss,
          label: `${pageName} (${template.name})`
        }
      }]
    } else if (templatePage.sections && templatePage.sections.length > 0) {
      // Section-based page - convert each section to CustomHTML
      sections = templatePage.sections.map((section, idx) => {
        let processedHtml = replaceVariables(section.html)
        processedHtml = replaceSmartBlocks(processedHtml)

        // Combine theme CSS + global CSS with section-specific CSS
        const combinedCss = [
          fullGlobalCss,
          section.css || ''
        ].filter(Boolean).join('\n\n')

        return {
          id: `customhtml-${Date.now()}-${pageId}-${idx}`,
          type: 'CustomHTML' as const,
          data: {
            html: processedHtml,
            css: combinedCss,
            label: `${section.name} (${template.name})`
          }
        }
      })
    }

    return {
      id: pageId,
      name: pageName,
      slug: templatePage.slug || `/${pageId}`,
      sections,
      isHome
    }
  })

  // Replace all pages with template pages
  pages.value = newPages

  // Set home page as current
  const homePage = newPages.find(p => p.isHome) || newPages[0]
  if (homePage) {
    currentPageId.value = homePage.id
  }

  // Reset history with new sections
  history.value = [JSON.stringify(homePage?.sections || [])]
  historyIndex.value = 0
  showTemplateSelector.value = false
  selectedSectionId.value = null
}

// Save Component Modal State
const showSaveBlockModal = ref(false)
const saveBlockName = ref('')
const saveBlockCategory = ref('My Blocks')
const sectionToSave = ref<WebsiteSection | null>(null)

// Open save block modal for selected section
const openSaveBlockModal = () => {
  const section = sections.value.find(s => s.id === selectedSectionId.value)
  if (!section) return

  sectionToSave.value = section
  saveBlockName.value = ''
  saveBlockCategory.value = 'My Blocks'
  showSaveBlockModal.value = true
}

// Save the selected section as a reusable block
const saveSelectedBlock = () => {
  if (!saveBlockName.value.trim() || !sectionToSave.value) return

  // Store the section type and data as HTML representation for consistency with GrapeJS
  const blockData = {
    componentType: sectionToSave.value.type,
    componentData: sectionToSave.value.data
  }

  saveBlock({
    name: saveBlockName.value.trim(),
    category: saveBlockCategory.value || 'My Blocks',
    html: JSON.stringify(blockData) // Store as JSON string for custom builder blocks
  })

  showSaveBlockModal.value = false
  saveBlockName.value = ''
  sectionToSave.value = null
}

// Add a saved block as a section
const addSavedBlock = (block: { id: string, html: string }, index: number) => {
  try {
    const blockData = JSON.parse(block.html)
    if (blockData.componentType && blockData.componentData) {
      const newSection: WebsiteSection = {
        id: `${blockData.componentType.toLowerCase()}-${Date.now()}`,
        type: blockData.componentType,
        data: JSON.parse(JSON.stringify(blockData.componentData))
      }
      sections.value.splice(index, 0, newSection)
      saveToHistory()
      selectedSectionId.value = newSection.id
    }
  } catch (e) {
    console.error('Failed to load saved block:', e)
  }
}

// Component map for dynamic rendering
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, any> = {
  HeroFullWidth: WebsiteSectionsHeroFullWidth,
  HeroSplit: WebsiteSectionsHeroSplit,
  FeaturedRentals: WebsiteSectionsFeaturedRentals,
  AboutSection: WebsiteSectionsAboutSection,
  TestimonialsGrid: WebsiteSectionsTestimonialsGrid,
  TrustBadges: WebsiteSectionsTrustBadges,
  CTABanner: WebsiteSectionsCTABanner,
  GalleryGrid: WebsiteSectionsGalleryGrid,
  FAQAccordion: WebsiteSectionsFAQAccordion,
  HowItWorks: WebsiteSectionsHowItWorks,
  ContactSection: WebsiteSectionsContactSection,
  FooterSection: WebsiteSectionsFooterSection,
  NavigationBar: WebsiteSectionsNavigationBar,
  PricingTable: WebsiteSectionsPricingTable,
  StatsSection: WebsiteSectionsStatsSection,
  FeaturesGrid: WebsiteSectionsFeaturesGrid,
  LogoCloud: WebsiteSectionsLogoCloud,
  CustomHTML: WebsiteSectionsCustomHTML,
  BentoGrid: WebsiteSectionsBentoGrid,
  TeamSection: WebsiteSectionsTeamSection,
  NewsletterSection: WebsiteSectionsNewsletterSection,
  BlogCards: WebsiteSectionsBlogCards,
  WaiverSignature: WebsiteSectionsWaiverSignature
}

definePageMeta({
  layout: 'editor',
  middleware: 'website-builder'
})

// Preset templates
const presetTemplates = [
  {
    id: 'full',
    name: 'Complete Website',
    description: 'All sections - hero, features, testimonials, FAQ, contact',
    icon: 'i-lucide-layout-template',
    sections: defaultSections
  },
  {
    id: 'minimal',
    name: 'Minimal Landing',
    description: 'Just the essentials - hero, features, CTA',
    icon: 'i-lucide-minimize-2',
    sections: [
      defaultSections.find(s => s.type === 'HeroFullWidth'),
      defaultSections.find(s => s.type === 'TrustBadges'),
      defaultSections.find(s => s.type === 'FeaturedRentals'),
      defaultSections.find(s => s.type === 'CTABanner'),
      defaultSections.find(s => s.type === 'FooterSection')
    ].filter(Boolean) as WebsiteSection[]
  },
  {
    id: 'service',
    name: 'Service Focused',
    description: 'Highlight your services and process',
    icon: 'i-lucide-briefcase',
    sections: [
      defaultSections.find(s => s.type === 'HeroFullWidth'),
      defaultSections.find(s => s.type === 'FeaturedRentals'),
      defaultSections.find(s => s.type === 'HowItWorks'),
      defaultSections.find(s => s.type === 'FAQAccordion'),
      defaultSections.find(s => s.type === 'CTABanner'),
      defaultSections.find(s => s.type === 'FooterSection')
    ].filter(Boolean) as WebsiteSection[]
  },
  {
    id: 'trust',
    name: 'Trust Builder',
    description: 'Focus on social proof and credibility',
    icon: 'i-lucide-shield-check',
    sections: [
      defaultSections.find(s => s.type === 'HeroFullWidth'),
      defaultSections.find(s => s.type === 'TrustBadges'),
      defaultSections.find(s => s.type === 'TestimonialsGrid'),
      defaultSections.find(s => s.type === 'GalleryGrid'),
      defaultSections.find(s => s.type === 'AboutSection'),
      defaultSections.find(s => s.type === 'CTABanner'),
      defaultSections.find(s => s.type === 'FooterSection')
    ].filter(Boolean) as WebsiteSection[]
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Empty canvas - build your own',
    icon: 'i-lucide-file-plus',
    sections: []
  }
]

// Page interface
interface WebsitePage {
  id: string
  name: string
  slug: string
  sections: WebsiteSection[]
  isHome?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
}

// Editor state
const pages = ref<WebsitePage[]>([
  { id: 'home', name: 'Home', slug: '/', sections: [], isHome: true }
])
const currentPageId = ref('home')
const currentPage = computed(() => pages.value.find(p => p.id === currentPageId.value))
const sections = computed({
  get: () => currentPage.value?.sections || [],
  set: (val) => {
    const page = pages.value.find(p => p.id === currentPageId.value)
    if (page) page.sections = val
  }
})
const selectedSectionId = ref<string | null>(null)
const selectedSection = computed(() => sections.value.find(s => s.id === selectedSectionId.value) || null)
const isPreviewMode = ref(false)
const isFullPreview = ref(false)
const showTemplateSelector = ref(false)
const showPagesPanel = ref(false)
const searchQuery = ref('')
const newPageName = ref('')

// Device preview modes
type DeviceMode = 'desktop' | 'tablet' | 'mobile'
const deviceMode = ref<DeviceMode>('desktop')

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px'
}

// Add section menu state
const showAddSectionMenu = ref(false)
const addSectionMenuIndex = ref(0)

// HyperUI Block Browser
const showHyperUIBrowser = ref(false)

// ============================================================================
// ELEMENT SELECTION SYSTEM
// Allows selecting and editing individual elements within sections
// ============================================================================

interface SelectedElement {
  element: HTMLElement
  sectionId: string
  tagName: string
  path: string // CSS selector path for re-finding the element
  computedStyles: {
    marginTop: string
    marginRight: string
    marginBottom: string
    marginLeft: string
    paddingTop: string
    paddingRight: string
    paddingBottom: string
    paddingLeft: string
    fontSize: string
    fontWeight: string
    color: string
    backgroundColor: string
    textAlign: string
    borderRadius: string
  }
}

const selectedElement = ref<SelectedElement | null>(null)
const showElementPanel = ref(false)
const elementEditMode = ref(false) // When true, clicking selects elements instead of sections

// Toggle element edit mode
const toggleElementEditMode = () => {
  elementEditMode.value = !elementEditMode.value
  if (!elementEditMode.value) {
    selectedElement.value = null
    showElementPanel.value = false
    // Remove any element highlights
    document.querySelectorAll('.element-highlight').forEach((el) => {
      el.classList.remove('element-highlight')
    })
  }
}

// Get computed styles for an element
const getElementStyles = (el: HTMLElement) => {
  const computed = window.getComputedStyle(el)
  return {
    marginTop: computed.marginTop,
    marginRight: computed.marginRight,
    marginBottom: computed.marginBottom,
    marginLeft: computed.marginLeft,
    paddingTop: computed.paddingTop,
    paddingRight: computed.paddingRight,
    paddingBottom: computed.paddingBottom,
    paddingLeft: computed.paddingLeft,
    fontSize: computed.fontSize,
    fontWeight: computed.fontWeight,
    color: computed.color,
    backgroundColor: computed.backgroundColor,
    textAlign: computed.textAlign,
    borderRadius: computed.borderRadius
  }
}

// Generate a unique path to re-find an element
const getElementPath = (el: HTMLElement, container: HTMLElement): string => {
  const path: string[] = []
  let current: HTMLElement | null = el

  while (current && current !== container) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      selector += `#${current.id}`
    } else if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c && !c.startsWith('element-')).slice(0, 2)
      if (classes.length) {
        selector += `.${classes.join('.')}`
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement
  }

  return path.join(' > ')
}

// Handle element click within a section
const handleElementClick = (event: MouseEvent, sectionId: string) => {
  if (!elementEditMode.value || isPreviewMode.value) return

  event.stopPropagation()
  event.preventDefault()

  const target = event.target as HTMLElement
  if (!target || target.classList.contains('section-wrapper')) return

  // Find the section container
  const sectionWrapper = document.querySelector(`[data-section-id="${sectionId}"]`)
  if (!sectionWrapper) return

  // Remove previous highlight
  document.querySelectorAll('.element-highlight').forEach((el) => {
    el.classList.remove('element-highlight')
  })

  // Add highlight to selected element
  target.classList.add('element-highlight')

  // Store selected element info
  selectedElement.value = {
    element: target,
    sectionId,
    tagName: target.tagName.toLowerCase(),
    path: getElementPath(target, sectionWrapper as HTMLElement),
    computedStyles: getElementStyles(target)
  }

  showElementPanel.value = true
}

// Update element style
const updateElementStyle = (property: string, value: string) => {
  if (!selectedElement.value?.element) return

  const el = selectedElement.value.element

  // Apply the style
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(el.style as any)[property] = value

  // Update our stored computed styles
  selectedElement.value.computedStyles = getElementStyles(el)

  // For CustomHTML sections, we need to update the section data
  const section = sections.value.find(s => s.id === selectedElement.value?.sectionId)
  if (section && section.type === 'CustomHTML') {
    // Get the section container and extract updated HTML
    const sectionWrapper = document.querySelector(`[data-section-id="${section.id}"]`)
    if (sectionWrapper) {
      const contentEl = sectionWrapper.querySelector('.custom-html-content')
      if (contentEl) {
        section.data.html = contentEl.innerHTML
        saveToHistory()
      }
    }
  }
}

// Update element content (text, images, links)
const updateElementContent = (type: 'text' | 'imageSrc' | 'imageAlt' | 'linkHref' | 'linkTarget', value: string) => {
  if (!selectedElement.value?.element) return

  const el = selectedElement.value.element

  switch (type) {
    case 'text':
      // Update text content - handles both simple text and elements with children
      el.textContent = value
      break
    case 'imageSrc':
      if (el.tagName.toLowerCase() === 'img') {
        el.setAttribute('src', value)
      }
      break
    case 'imageAlt':
      if (el.tagName.toLowerCase() === 'img') {
        el.setAttribute('alt', value)
      }
      break
    case 'linkHref':
      if (el.tagName.toLowerCase() === 'a') {
        el.setAttribute('href', value)
      }
      break
    case 'linkTarget':
      if (el.tagName.toLowerCase() === 'a') {
        el.setAttribute('target', value)
      }
      break
  }

  // Sync changes back to section data for CustomHTML sections
  const section = sections.value.find(s => s.id === selectedElement.value?.sectionId)
  if (section && section.type === 'CustomHTML') {
    const sectionWrapper = document.querySelector(`[data-section-id="${section.id}"]`)
    if (sectionWrapper) {
      const contentEl = sectionWrapper.querySelector('.custom-html-content')
      if (contentEl) {
        section.data.html = contentEl.innerHTML
        saveToHistory()
      }
    }
  }
}

// Clear element selection
const clearElementSelection = () => {
  if (selectedElement.value?.element) {
    selectedElement.value.element.classList.remove('element-highlight')
  }
  selectedElement.value = null
  showElementPanel.value = false
}

// Handle HyperUI block selection
const addHyperUIBlock = (block: HyperUIBlock) => {
  const newSection: WebsiteSection = {
    id: `customhtml-${Date.now()}`,
    type: 'CustomHTML',
    data: {
      html: block.html,
      css: '',
      label: `${block.name} (HyperUI)`
    }
  }
  sections.value.splice(addSectionMenuIndex.value, 0, newSection)
  saveToHistory()
  selectedSectionId.value = newSection.id
  showAddSectionMenu.value = false
}

// Page management
const addPage = () => {
  if (!newPageName.value.trim()) return

  const slug = newPageName.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const newPage: WebsitePage = {
    id: `page-${Date.now()}`,
    name: newPageName.value.trim(),
    slug: `/${slug}`,
    sections: []
  }
  pages.value.push(newPage)
  currentPageId.value = newPage.id
  newPageName.value = ''
  showPagesPanel.value = false
  showTemplateSelector.value = true // Show template selector for new page
}

const switchPage = (pageId: string) => {
  currentPageId.value = pageId
  selectedSectionId.value = null
  showPagesPanel.value = false
}

const deletePage = (pageId: string) => {
  if (pages.value.length <= 1) return // Keep at least one page
  const page = pages.value.find(p => p.id === pageId)
  if (page?.isHome) return // Can't delete home page

  const index = pages.value.findIndex(p => p.id === pageId)
  if (index !== -1) {
    pages.value.splice(index, 1)
  }

  if (currentPageId.value === pageId) {
    currentPageId.value = pages.value[0]?.id || 'home'
  }
}

const renamePage = (pageId: string, newName: string) => {
  const page = pages.value.find(p => p.id === pageId)
  if (page && newName.trim()) {
    page.name = newName.trim()
    if (!page.isHome) {
      const slug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      page.slug = `/${slug}`
    }
  }
}

// Filtered blocks based on search
const filteredSectionTypes = computed(() => {
  if (!searchQuery.value.trim()) {
    return sectionTypes
  }

  const query = searchQuery.value.toLowerCase()
  return sectionTypes
    .map(cat => ({
      ...cat,
      items: cat.items.filter(
        item =>
          item.label.toLowerCase().includes(query)
          || item.description?.toLowerCase().includes(query)
          || cat.category.toLowerCase().includes(query)
      )
    }))
    .filter(cat => cat.items.length > 0)
})

// Drag state
const dragState = reactive({
  isDragging: false,
  dragType: null as 'new' | 'reorder' | null,
  draggedItem: null as string | null,
  dropIndex: null as number | null
})

// Undo/Redo history
const history = ref<string[]>(['[]'])
const historyIndex = ref(0)

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

const saveToHistory = () => {
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(JSON.stringify(sections.value))
  historyIndex.value = history.value.length - 1
}

const undo = () => {
  if (canUndo.value) {
    historyIndex.value--
    const historyItem = history.value[historyIndex.value]
    if (historyItem) {
      sections.value = JSON.parse(historyItem)
    }
  }
}

const redo = () => {
  if (canRedo.value) {
    historyIndex.value++
    const historyItem = history.value[historyIndex.value]
    if (historyItem) {
      sections.value = JSON.parse(historyItem)
    }
  }
}

// Select template
const selectTemplate = (template: typeof presetTemplates[0]) => {
  // Deep clone the sections with new IDs
  const newSections = template.sections.map(s => ({
    ...s,
    id: `${s.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    data: JSON.parse(JSON.stringify(s.data))
  }))
  // Update current page sections
  const page = pages.value.find(p => p.id === currentPageId.value)
  if (page) {
    page.sections = newSections
  }
  history.value = [JSON.stringify(newSections)]
  historyIndex.value = 0
  showTemplateSelector.value = false
}

// Get component for section type
const getComponent = (type: string) => {
  return componentMap[type] || null
}

// Click outside handler for pages panel
const pagesSwitcherRef = ref<HTMLElement | null>(null)

const closePagesPanelOnClickOutside = (e: MouseEvent) => {
  if (showPagesPanel.value && pagesSwitcherRef.value && !pagesSwitcherRef.value.contains(e.target as Node)) {
    showPagesPanel.value = false
  }
}

// Toggle fullscreen preview
const toggleFullPreview = () => {
  isFullPreview.value = !isFullPreview.value
  if (isFullPreview.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Open as website in new tab
const openAsWebsite = () => {
  // Save current data to localStorage
  localStorage.setItem('website-builder-data', JSON.stringify({
    pages: pages.value,
    currentPageId: currentPageId.value,
    sections: sections.value
  }))

  // Open preview in new tab
  window.open('/app/website/preview', '_blank')
}

// Keyboard shortcuts
onMounted(() => {
  // Load GrapesJS templates
  loadGjsTemplates()

  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        redo()
      } else {
        undo()
      }
    }
    // Exit full preview on Escape
    if (e.key === 'Escape' && isFullPreview.value) {
      isFullPreview.value = false
      document.body.style.overflow = ''
    }
    // Close pages panel on Escape
    if (e.key === 'Escape' && showPagesPanel.value) {
      showPagesPanel.value = false
    }
  }
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closePagesPanelOnClickOutside)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('click', closePagesPanelOnClickOutside)
  })
})

// === DRAG FROM SIDEBAR (New Section) ===
const onSidebarDragStart = (e: DragEvent, type: string) => {
  if (!e.dataTransfer) return

  dragState.isDragging = true
  dragState.dragType = 'new'
  dragState.draggedItem = type

  e.dataTransfer.effectAllowed = 'copy'
  e.dataTransfer.setData('application/x-section-type', type)

  const target = e.target as HTMLElement
  if (target) {
    e.dataTransfer.setDragImage(target, 20, 20)
  }
}

const onSidebarDragEnd = () => {
  dragState.isDragging = false
  dragState.dragType = null
  dragState.draggedItem = null
  dragState.dropIndex = null
}

// === DRAG WITHIN CANVAS (Reorder) ===
const onSectionDragStart = (e: DragEvent, sectionId: string) => {
  if (!e.dataTransfer || isPreviewMode.value) return

  dragState.isDragging = true
  dragState.dragType = 'reorder'
  dragState.draggedItem = sectionId

  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('application/x-section-id', sectionId)
}

const onSectionDragEnd = () => {
  dragState.isDragging = false
  dragState.dragType = null
  dragState.draggedItem = null
  dragState.dropIndex = null
}

// === DROP ZONE HANDLERS ===
const onDropZoneDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (!e.dataTransfer) return

  const hasNewSection = e.dataTransfer.types.includes('application/x-section-type')
  const hasExistingSection = e.dataTransfer.types.includes('application/x-section-id')

  if (hasNewSection || hasExistingSection) {
    e.dataTransfer.dropEffect = hasNewSection ? 'copy' : 'move'
    dragState.dropIndex = index
  }
}

const onDropZoneDragLeave = (e: DragEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  if (
    e.clientX < rect.left
    || e.clientX > rect.right
    || e.clientY < rect.top
    || e.clientY > rect.bottom
  ) {
    dragState.dropIndex = null
  }
}

const onDropZoneDrop = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (!e.dataTransfer) return

  const sectionType = e.dataTransfer.getData('application/x-section-type')
  const sectionId = e.dataTransfer.getData('application/x-section-id')

  // Handle saved blocks (prefixed with 'saved:')
  if (sectionType && sectionType.startsWith('saved:')) {
    const savedBlockId = sectionType.replace('saved:', '')
    const savedBlock = savedBlocks.value.find(b => b.id === savedBlockId)
    if (savedBlock) {
      addSavedBlock(savedBlock, index)
    }
  } else if (sectionType && sectionDefaults[sectionType]) {
    const newSection: WebsiteSection = {
      id: `${sectionType.toLowerCase()}-${Date.now()}`,
      type: sectionType,
      data: JSON.parse(JSON.stringify(sectionDefaults[sectionType]))
    }
    sections.value.splice(index, 0, newSection)
    saveToHistory()
    selectedSectionId.value = newSection.id
  } else if (sectionId) {
    const currentIndex = sections.value.findIndex(s => s.id === sectionId)
    if (currentIndex !== -1 && currentIndex !== index) {
      const [removed] = sections.value.splice(currentIndex, 1)
      if (removed) {
        const insertIndex = index > currentIndex ? index - 1 : index
        sections.value.splice(insertIndex, 0, removed)
        saveToHistory()
      }
    }
  }

  dragState.isDragging = false
  dragState.dragType = null
  dragState.draggedItem = null
  dragState.dropIndex = null
}

// === SECTION ACTIONS ===
const selectSection = (id: string) => {
  if (!isPreviewMode.value) {
    selectedSectionId.value = id
  }
}

const deleteSection = (id: string) => {
  const index = sections.value.findIndex(s => s.id === id)
  if (index !== -1) {
    sections.value.splice(index, 1)
    saveToHistory()
    if (selectedSectionId.value === id) {
      selectedSectionId.value = null
    }
  }
}

const moveSection = (id: string, direction: 'up' | 'down') => {
  const index = sections.value.findIndex(s => s.id === id)
  if (index === -1) return

  if (direction === 'up' && index > 0) {
    const temp = sections.value[index]
    const prev = sections.value[index - 1]
    if (temp && prev) {
      sections.value[index] = prev
      sections.value[index - 1] = temp
      saveToHistory()
    }
  } else if (direction === 'down' && index < sections.value.length - 1) {
    const temp = sections.value[index]
    const next = sections.value[index + 1]
    if (temp && next) {
      sections.value[index] = next
      sections.value[index + 1] = temp
      saveToHistory()
    }
  }
}

const duplicateSection = (id: string) => {
  const index = sections.value.findIndex(s => s.id === id)
  if (index !== -1) {
    const original = sections.value[index]
    if (original) {
      const duplicate: WebsiteSection = {
        id: `${original.type.toLowerCase()}-${Date.now()}`,
        type: original.type,
        data: JSON.parse(JSON.stringify(original.data))
      }
      sections.value.splice(index + 1, 0, duplicate)
      saveToHistory()
      selectedSectionId.value = duplicate.id
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSectionUpdate = (sectionId: string, field: string, value: any) => {
  const section = sections.value.find(s => s.id === sectionId)
  if (section) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (section.data as any)[field] = value
    saveToHistory()
  }
}

const addSection = (type: string, index: number) => {
  if (sectionDefaults[type]) {
    const newSection: WebsiteSection = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      data: JSON.parse(JSON.stringify(sectionDefaults[type]))
    }
    sections.value.splice(index, 0, newSection)
    saveToHistory()
    selectedSectionId.value = newSection.id
  }
}

// Open add section menu at specific index
const openAddSectionMenu = (index: number) => {
  addSectionMenuIndex.value = index
  showAddSectionMenu.value = true
}

// Add section from menu
const addSectionFromMenu = (type: string) => {
  addSection(type, addSectionMenuIndex.value)
  showAddSectionMenu.value = false
}

// Save website to server
const saveWebsite = async () => {
  await saveWebsiteData({
    pages: pages.value,
    theme: themeSettings.value
  })
}

// Auto-save when content changes
watch([pages, themeSettings], () => {
  scheduleAutoSave({
    pages: pages.value,
    theme: themeSettings.value
  })
}, { deep: true })

// Icon helper
const getIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    'layout-template': 'i-lucide-layout-template',
    'layout-sidebar': 'i-lucide-layout-panel-left',
    'grid-3x3': 'i-lucide-grid-3x3',
    'user': 'i-lucide-user',
    'list-ordered': 'i-lucide-list-ordered',
    'image': 'i-lucide-image',
    'message-square-quote': 'i-lucide-message-square-quote',
    'badge-check': 'i-lucide-badge-check',
    'megaphone': 'i-lucide-megaphone',
    'help-circle': 'i-lucide-help-circle',
    'mail': 'i-lucide-mail',
    'panel-bottom': 'i-lucide-panel-bottom',
    'navigation': 'i-lucide-navigation',
    'menu': 'i-lucide-menu',
    'dollar-sign': 'i-lucide-dollar-sign',
    'bar-chart-3': 'i-lucide-bar-chart-3',
    'sparkles': 'i-lucide-sparkles',
    'building-2': 'i-lucide-building-2',
    'zap': 'i-lucide-zap',
    'code': 'i-lucide-code',
    'layout-grid': 'i-lucide-layout-grid',
    'users': 'i-lucide-users',
    'send': 'i-lucide-send',
    'newspaper': 'i-lucide-newspaper',
    'shield-check': 'i-lucide-shield-check'
  }
  return icons[iconName] || 'i-lucide-square'
}
</script>

<template>
  <div class="builder-layout">
    <!-- Template Selector Modal -->
    <div
      v-if="showTemplateSelector"
      class="template-overlay"
    >
      <div class="template-modal">
        <div class="modal-header">
          <h2>Choose a Starting Template</h2>
          <p>Select a template to jumpstart your website or start from scratch</p>
        </div>

        <div class="template-grid">
          <button
            v-for="template in presetTemplates"
            :key="template.id"
            class="template-card"
            @click="selectTemplate(template)"
          >
            <div class="template-icon">
              <UIcon :name="template.icon" />
            </div>
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <span
              v-if="template.sections.length > 0"
              class="section-count"
            >
              {{ template.sections.length }} sections
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Save Block Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSaveBlockModal"
          class="save-block-overlay"
          @click.self="showSaveBlockModal = false"
        >
          <div class="save-block-modal">
            <div class="modal-header">
              <h2>Save as Reusable Block</h2>
              <p>Give your block a name so you can reuse it later</p>
            </div>

            <div class="save-form">
              <div class="form-group">
                <label>Block Name</label>
                <input
                  v-model="saveBlockName"
                  type="text"
                  placeholder="e.g., My Custom Hero"
                  class="form-input"
                  @keydown.enter="saveSelectedBlock"
                >
              </div>

              <div class="block-preview">
                <label>Saving</label>
                <div class="preview-badge">
                  <UIcon name="i-lucide-box" />
                  <span>{{ sectionToSave?.type }}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                class="cancel-btn"
                @click="showSaveBlockModal = false"
              >
                Cancel
              </button>
              <button
                class="save-btn"
                :disabled="!saveBlockName.trim()"
                @click="saveSelectedBlock"
              >
                <UIcon name="i-lucide-bookmark-check" />
                Save Block
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Sidebar -->
    <aside
      class="builder-sidebar"
      :class="{ hidden: isPreviewMode || showTemplateSelector }"
    >
      <!-- Tabs Header -->
      <div class="sidebar-tabs">
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'sections' }"
          @click="activeTab = 'sections'"
        >
          <UIcon name="i-lucide-layout-template" />
          <span>Sections</span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'blocks' }"
          @click="activeTab = 'blocks'"
        >
          <UIcon name="i-lucide-blocks" />
          <span>Blocks</span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'templates' }"
          @click="activeTab = 'templates'"
        >
          <UIcon name="i-lucide-palette" />
          <span>Templates</span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'layers' }"
          @click="activeTab = 'layers'"
        >
          <UIcon name="i-lucide-layers" />
          <span>Layers</span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'pages' }"
          @click="activeTab = 'pages'"
        >
          <UIcon name="i-lucide-files" />
          <span>Pages</span>
        </button>
        <button
          class="sidebar-tab"
          :class="{ active: activeTab === 'theme' }"
          @click="activeTab = 'theme'"
        >
          <UIcon name="i-lucide-paintbrush" />
          <span>Theme</span>
        </button>
      </div>

      <!-- Sections Tab Content -->
      <div
        v-if="activeTab === 'sections'"
        class="tab-content"
      >
        <div class="tab-header">
          <p class="sidebar-hint">
            Drag to canvas or click + buttons
          </p>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
          <UIcon
            name="i-lucide-search"
            class="search-icon"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search sections..."
            class="search-input"
          >
          <button
            v-if="searchQuery"
            class="clear-search"
            @click="searchQuery = ''"
          >
            <UIcon name="i-lucide-x" />
          </button>
        </div>

        <div class="section-categories">
          <!-- Saved Blocks Section -->
          <div
            v-if="savedBlocks.length > 0"
            class="category-group saved-blocks"
          >
            <h3 class="category-title">
              <UIcon
                name="i-lucide-bookmark"
                class="mr-1"
              />
              My Saved Blocks
            </h3>
            <div class="section-items">
              <div
                v-for="block in savedBlocks"
                :key="block.id"
                class="section-item saved-block-item"
                draggable="true"
                @dragstart="onSidebarDragStart($event, `saved:${block.id}`)"
                @dragend="onSidebarDragEnd"
              >
                <UIcon
                  name="i-lucide-bookmark"
                  class="section-icon saved"
                />
                <span>{{ block.name }}</span>
                <button
                  class="delete-saved-btn"
                  title="Delete saved block"
                  @click.stop="deleteBlock(block.id)"
                >
                  <UIcon name="i-lucide-x" />
                </button>
              </div>
            </div>
          </div>

          <div
            v-for="category in filteredSectionTypes"
            :key="category.category"
            class="category-group"
          >
            <h3 class="category-title">
              {{ category.category }}
            </h3>
            <div class="section-items">
              <div
                v-for="item in category.items"
                :key="item.type"
                class="section-item"
                draggable="true"
                @dragstart="onSidebarDragStart($event, item.type)"
                @dragend="onSidebarDragEnd"
              >
                <UIcon
                  :name="getIcon(item.icon)"
                  class="section-icon"
                />
                <span>{{ item.label }}</span>
                <UIcon
                  name="i-lucide-grip-vertical"
                  class="drag-handle"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blocks Tab Content (HyperUI) -->
      <div
        v-if="activeTab === 'blocks'"
        class="tab-content"
      >
        <div class="tab-header">
          <p class="sidebar-hint">
            300+ Tailwind blocks from HyperUI
          </p>
        </div>
        <div class="blocks-inline-browser">
          <button
            class="browse-blocks-btn"
            @click="showHyperUIBrowser = true"
          >
            <UIcon name="i-lucide-grid-3x3" />
            <span>Browse All Blocks</span>
            <UBadge
              label="300+"
              size="xs"
              color="primary"
            />
          </button>
          <p class="blocks-hint">
            Click to open the full block browser with preview
          </p>
        </div>
      </div>

      <!-- Templates Tab Content -->
      <div
        v-if="activeTab === 'templates'"
        class="tab-content"
      >
        <div class="tab-header">
          <p class="sidebar-hint">
            Professional templates to start with
          </p>
        </div>

        <div
          v-if="loadingTemplates"
          class="templates-loading"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="animate-spin"
          />
          <span>Loading templates...</span>
        </div>

        <div
          v-else
          class="templates-list"
        >
          <div
            v-for="template in gjsTemplates"
            :key="template.id"
            class="template-item"
            @click="applyGjsTemplate(template)"
          >
            <div
              class="template-preview"
              v-html="template.thumbnail"
            />
            <div class="template-info">
              <h4>{{ template.name }}</h4>
              <p>{{ 'codename' in template ? template.codename : template.description }}</p>
            </div>
            <div class="template-actions">
              <UButton
                size="xs"
                icon="i-lucide-check"
                label="Use"
                @click.stop="applyGjsTemplate(template)"
              />
            </div>
          </div>

          <div
            v-if="gjsTemplates.length === 0"
            class="no-templates"
          >
            <UIcon name="i-lucide-palette" />
            <p>No templates available</p>
          </div>
        </div>

        <button
          class="change-template-btn"
          @click="showTemplateSelector = true"
        >
          <UIcon name="i-lucide-layout-template" />
          View Preset Templates
        </button>
      </div>

      <!-- Layers Tab Content -->
      <div
        v-if="activeTab === 'layers'"
        class="tab-content layers-tab"
      >
        <LayersPanel
          :sections="sections"
          :selected-section-id="selectedSectionId"
          @select="(id: string) => selectedSectionId = id"
          @delete="deleteSection"
          @move="moveSection"
          @duplicate="duplicateSection"
        />
      </div>

      <!-- Pages Tab Content -->
      <div
        v-if="activeTab === 'pages'"
        class="tab-content pages-tab"
      >
        <PageManagerPanel
          :pages="pages"
          :current-page-id="currentPageId"
          @switch-page="switchPage"
          @add-page="(page) => { pages.push({ ...page, sections: [] } as WebsitePage); currentPageId = page.id as string; showTemplateSelector = true }"
          @delete-page="deletePage"
          @update-page="(pageId, updates) => { const page = pages.find(p => p.id === pageId); if (page) Object.assign(page, updates) }"
        />
      </div>

      <!-- Theme Tab Content -->
      <div
        v-if="activeTab === 'theme'"
        class="tab-content theme-tab"
      >
        <ThemePanel
          :theme="themeSettings"
          @update="updateTheme"
        />
      </div>
    </aside>

    <!-- Canvas -->
    <main
      class="builder-canvas"
      :class="{ 'full-width': showTemplateSelector }"
    >
      <!-- Toolbar -->
      <div
        v-if="!showTemplateSelector"
        class="canvas-toolbar"
      >
        <div class="toolbar-left">
          <NuxtLink
            to="/app/website"
            class="back-link"
          >
            <UIcon name="i-lucide-arrow-left" />
            Back
          </NuxtLink>
          <span class="toolbar-divider" />

          <!-- Page Switcher -->
          <div
            ref="pagesSwitcherRef"
            class="page-switcher-container"
          >
            <button
              class="page-switcher"
              @click.stop="showPagesPanel = !showPagesPanel"
            >
              <UIcon name="i-lucide-file-text" />
              <span>{{ currentPage?.name || 'Home' }}</span>
              <UIcon
                name="i-lucide-chevron-down"
                class="chevron"
                :class="{ rotated: showPagesPanel }"
              />
            </button>

            <!-- Pages Dropdown Panel -->
            <Transition name="dropdown">
              <div
                v-if="showPagesPanel"
                class="pages-panel"
              >
                <div class="pages-panel-header">
                  <span>Pages</span>
                  <span class="page-count">{{ pages.length }}</span>
                </div>

                <div class="pages-list">
                  <button
                    v-for="page in pages"
                    :key="page.id"
                    class="page-item"
                    :class="{ active: currentPageId === page.id }"
                    @click="switchPage(page.id)"
                  >
                    <UIcon
                      :name="page.isHome ? 'i-lucide-home' : 'i-lucide-file'"
                      class="page-icon"
                    />
                    <span class="page-name">{{ page.name }}</span>
                    <span
                      v-if="page.isHome"
                      class="home-badge"
                    >Home</span>
                    <button
                      v-if="!page.isHome"
                      class="delete-page-btn"
                      title="Delete page"
                      @click.stop="deletePage(page.id)"
                    >
                      <UIcon name="i-lucide-x" />
                    </button>
                  </button>
                </div>

                <div class="add-page-section">
                  <input
                    v-model="newPageName"
                    type="text"
                    placeholder="New page name..."
                    class="new-page-input"
                    @keydown.enter="addPage"
                  >
                  <button
                    class="add-page-btn"
                    :disabled="!newPageName.trim()"
                    @click="addPage"
                  >
                    <UIcon name="i-lucide-plus" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <span class="badge">Prototype</span>
        </div>

        <div class="toolbar-center">
          <button
            class="toolbar-btn"
            :disabled="!canUndo"
            title="Undo (Cmd+Z)"
            @click="undo"
          >
            <UIcon name="i-lucide-undo-2" />
          </button>
          <button
            class="toolbar-btn"
            :disabled="!canRedo"
            title="Redo (Cmd+Shift+Z)"
            @click="redo"
          >
            <UIcon name="i-lucide-redo-2" />
          </button>

          <span class="toolbar-divider" />

          <!-- Device Preview Buttons -->
          <div class="device-preview-btns">
            <button
              class="device-btn"
              :class="{ active: deviceMode === 'desktop' }"
              title="Desktop view (100%)"
              @click="deviceMode = 'desktop'"
            >
              <UIcon name="i-lucide-monitor" />
              <span class="device-label">Desktop</span>
            </button>
            <button
              class="device-btn"
              :class="{ active: deviceMode === 'tablet' }"
              title="Tablet view (768px)"
              @click="deviceMode = 'tablet'"
            >
              <UIcon name="i-lucide-tablet" />
              <span class="device-label">Tablet</span>
            </button>
            <button
              class="device-btn"
              :class="{ active: deviceMode === 'mobile' }"
              title="Mobile view (375px)"
              @click="deviceMode = 'mobile'"
            >
              <UIcon name="i-lucide-smartphone" />
              <span class="device-label">Mobile</span>
            </button>
          </div>

          <!-- Current viewport indicator -->
          <span class="viewport-indicator">{{ deviceMode === 'desktop' ? '100%' : deviceWidths[deviceMode] }}</span>
        </div>

        <div class="toolbar-right">
          <button
            class="toolbar-btn"
            :class="{ active: elementEditMode }"
            title="Click elements to style them individually"
            @click="toggleElementEditMode"
          >
            <UIcon name="i-lucide-mouse-pointer-click" />
            {{ elementEditMode ? 'Exit Element Mode' : 'Edit Elements' }}
          </button>
          <span class="toolbar-divider" />
          <button
            class="toolbar-btn"
            :class="{ active: isPreviewMode }"
            @click="isPreviewMode = !isPreviewMode"
          >
            <UIcon :name="isPreviewMode ? 'i-lucide-pencil' : 'i-lucide-eye'" />
            {{ isPreviewMode ? 'Edit' : 'Preview' }}
          </button>
          <button
            class="toolbar-btn"
            @click="toggleFullPreview"
          >
            <UIcon name="i-lucide-maximize" />
            Full Preview
          </button>
          <button
            class="toolbar-btn primary"
            :disabled="isSaving"
            @click="saveWebsite"
          >
            <UIcon
              :name="isSaving ? 'i-lucide-loader-circle' : 'i-lucide-save'"
              :class="{ 'animate-spin': isSaving }"
            />
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>

      <!-- Canvas Content -->
      <div
        v-if="!showTemplateSelector"
        class="canvas-content"
        :class="{ 'preview-mode': isPreviewMode }"
        :style="{
          maxWidth: deviceWidths[deviceMode],
          margin: deviceMode !== 'desktop' ? '0 auto' : undefined
        }"
      >
        <!-- First Drop Zone -->
        <div
          v-if="!isPreviewMode"
          class="drop-zone"
          :class="{ active: dragState.dropIndex === 0, visible: dragState.isDragging }"
          @dragover="onDropZoneDragOver($event, 0)"
          @dragleave="onDropZoneDragLeave"
          @drop="onDropZoneDrop($event, 0)"
        >
          <div class="drop-indicator">
            <UIcon name="i-lucide-plus" />
            <span>Drop section here</span>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="sections.length === 0 && !isPreviewMode && !dragState.isDragging"
          class="empty-canvas"
        >
          <UIcon
            name="i-lucide-layout-template"
            class="empty-icon"
          />
          <h3>Your Canvas is Empty</h3>
          <p>Drag sections from the sidebar to start building</p>
          <UButton
            icon="i-lucide-plus"
            size="lg"
            @click="openAddSectionMenu(0)"
          >
            Add First Section
          </UButton>
        </div>

        <!-- Sections -->
        <template
          v-for="(section, index) in sections"
          :key="section.id"
        >
          <div
            class="section-wrapper"
            :class="{
              'selected': selectedSectionId === section.id && !isPreviewMode,
              'dragging': dragState.draggedItem === section.id,
              'element-edit-mode': elementEditMode
            }"
            :data-section-id="section.id"
            :draggable="!isPreviewMode && !elementEditMode"
            @click="elementEditMode ? handleElementClick($event, section.id) : selectSection(section.id)"
            @dragstart="onSectionDragStart($event, section.id)"
            @dragend="onSectionDragEnd"
          >
            <!-- Section Toolbar -->
            <div
              v-if="selectedSectionId === section.id && !isPreviewMode"
              class="section-toolbar"
            >
              <span class="section-label">{{ section.type }}</span>
              <div class="section-actions">
                <button
                  title="Move up"
                  :disabled="index === 0"
                  @click.stop="moveSection(section.id, 'up')"
                >
                  <UIcon name="i-lucide-chevron-up" />
                </button>
                <button
                  title="Move down"
                  :disabled="index === sections.length - 1"
                  @click.stop="moveSection(section.id, 'down')"
                >
                  <UIcon name="i-lucide-chevron-down" />
                </button>
                <button
                  title="Duplicate"
                  @click.stop="duplicateSection(section.id)"
                >
                  <UIcon name="i-lucide-copy" />
                </button>
                <button
                  title="Save as Reusable Block"
                  class="save"
                  @click.stop="openSaveBlockModal"
                >
                  <UIcon name="i-lucide-bookmark-plus" />
                </button>
                <button
                  title="Delete"
                  class="delete"
                  @click.stop="deleteSection(section.id)"
                >
                  <UIcon name="i-lucide-trash-2" />
                </button>
              </div>
            </div>

            <!-- Section Content - Dynamic Component -->
            <component
              :is="getComponent(section.type)"
              v-if="getComponent(section.type)"
              :data="section.data"
              :editable="!isPreviewMode && selectedSectionId === section.id"
              @update="(field: string, value: any) => handleSectionUpdate(section.id, field, value)"
            />
            <div
              v-else
              class="section-error"
            >
              <UIcon name="i-lucide-alert-triangle" />
              <span>Unknown section type: {{ section.type }}</span>
            </div>
          </div>

          <!-- Drop Zone After Each Section -->
          <div
            v-if="!isPreviewMode"
            class="drop-zone"
            :class="{ active: dragState.dropIndex === index + 1, visible: dragState.isDragging }"
            @dragover="onDropZoneDragOver($event, index + 1)"
            @dragleave="onDropZoneDragLeave"
            @drop="onDropZoneDrop($event, index + 1)"
          >
            <div class="drop-indicator">
              <UIcon name="i-lucide-plus" />
              <span>Drop section here</span>
            </div>
          </div>

          <!-- Add Section Button -->
          <div
            v-if="!isPreviewMode && !dragState.isDragging"
            class="add-button-wrapper"
          >
            <button
              class="add-section-btn"
              @click="openAddSectionMenu(index + 1)"
            >
              <UIcon name="i-lucide-plus" />
            </button>
          </div>
        </template>
      </div>
    </main>

    <!-- Properties Panel (Right Side) - Show when NOT in element edit mode -->
    <SectionPropertiesPanel
      v-if="!elementEditMode"
      :section="selectedSection"
      @update="handleSectionUpdate"
      @close="selectedSectionId = null"
    />

    <!-- Element Style Panel (Right Side) - Show when in element edit mode -->
    <ElementStylePanel
      v-if="elementEditMode"
      :element="selectedElement"
      @update="updateElementStyle"
      @update-content="updateElementContent"
      @close="clearElementSelection"
    />

    <!-- Add Section Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddSectionMenu"
          class="add-section-overlay"
          @click.self="showAddSectionMenu = false"
        >
          <div class="add-section-modal">
            <div class="modal-header">
              <h2>Add Section</h2>
              <button
                class="close-modal-btn"
                @click="showAddSectionMenu = false"
              >
                <UIcon name="i-lucide-x" />
              </button>
            </div>

            <!-- HyperUI Banner -->
            <div class="hyperui-banner">
              <div class="banner-content">
                <UIcon
                  name="i-lucide-blocks"
                  class="banner-icon"
                />
                <div>
                  <h4>300+ Pre-built Tailwind Blocks</h4>
                  <p>Browse the HyperUI component library</p>
                </div>
              </div>
              <UButton
                icon="i-lucide-external-link"
                label="Browse HyperUI"
                @click="showHyperUIBrowser = true; showAddSectionMenu = false"
              />
            </div>

            <div class="section-categories-grid">
              <div
                v-for="category in sectionTypes"
                :key="category.category"
                class="section-category"
              >
                <h3 class="category-name">
                  {{ category.category }}
                </h3>
                <div class="section-options">
                  <button
                    v-for="item in category.items"
                    :key="item.type"
                    class="section-option"
                    @click="addSectionFromMenu(item.type)"
                  >
                    <UIcon
                      :name="getIcon(item.icon)"
                      class="option-icon"
                    />
                    <span class="option-label">{{ item.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- HyperUI Block Browser -->
    <HyperUIBlockBrowser
      :open="showHyperUIBrowser"
      @update:open="showHyperUIBrowser = $event"
      @select="addHyperUIBlock"
    />

    <!-- Full Preview Mode Overlay -->
    <Teleport to="body">
      <Transition name="preview-fade">
        <div
          v-if="isFullPreview"
          class="full-preview-overlay"
        >
          <div class="preview-toolbar">
            <div class="preview-info">
              <UIcon name="i-lucide-eye" />
              <span>Preview Mode</span>
              <span class="page-name">{{ currentPage?.name }}</span>
            </div>
            <div class="preview-actions">
              <button
                class="preview-btn"
                @click="openAsWebsite"
              >
                <UIcon name="i-lucide-external-link" />
                Open in New Tab
              </button>
              <button
                class="preview-btn close"
                @click="isFullPreview = false"
              >
                <UIcon name="i-lucide-x" />
                Exit Preview
              </button>
            </div>
          </div>

          <div class="preview-canvas">
            <template
              v-for="section in sections"
              :key="section.id"
            >
              <component
                :is="getComponent(section.type)"
                v-if="getComponent(section.type)"
                :data="section.data"
                :editable="false"
              />
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.builder-layout {
  display: flex;
  height: 100vh;
  background: #f0f0f0;
  overflow: hidden;
}

/* Template Selector */
.template-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.template-modal {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.modal-header p {
  font-size: 14px;
  color: #666;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.template-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.template-card:hover {
  background: #f0f0f0;
  border-color: #ddd;
  transform: translateY(-2px);
}

.template-card:active {
  transform: translateY(0);
}

.template-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
}

.template-card h3 {
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 6px;
}

.template-card p {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
}

.section-count {
  font-size: 11px;
  font-weight: 500;
  color: #888;
  background: #e8e8e8;
  padding: 2px 8px;
  border-radius: 99px;
}

/* Sidebar */
.builder-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.builder-sidebar.hidden {
  display: none;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}

.sidebar-hint {
  font-size: 12px;
  color: #888;
}

/* Sidebar Tabs */
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f8f8;
}

.sidebar-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
  color: #666;
  font-size: 11px;
  font-weight: 500;
}

.sidebar-tab:hover {
  background: #f0f0f0;
  color: #333;
}

.sidebar-tab.active {
  background: white;
  color: #f59e0b;
  border-bottom-color: #f59e0b;
}

.sidebar-tab .iconify {
  font-size: 18px;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-content.layers-tab {
  padding: 8px;
}

.tab-header {
  padding: 12px 16px 8px;
}

/* Blocks Tab */
.blocks-inline-browser {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.browse-blocks-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
}

.browse-blocks-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

.browse-blocks-btn .iconify {
  font-size: 18px;
}

.blocks-hint {
  text-align: center;
  font-size: 12px;
  color: #888;
}

/* Templates Tab */
.templates-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #888;
}

.templates-loading .iconify {
  font-size: 24px;
  color: #f59e0b;
}

.templates-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.template-item:hover {
  background: #f0f0f0;
  border-color: #f59e0b;
}

.template-preview {
  width: 60px;
  height: 45px;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  flex-shrink: 0;
}

.template-preview :deep(svg) {
  width: 100%;
  height: 100%;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-info h4 {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.template-info p {
  font-size: 11px;
  color: #888;
}

.template-actions {
  flex-shrink: 0;
}

.no-templates {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px;
  color: #aaa;
  text-align: center;
}

.no-templates .iconify {
  font-size: 32px;
}

/* Search Bar */
.search-bar {
  position: relative;
  padding: 0 12px;
  margin-bottom: 8px;
}

.search-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 32px 9px 36px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 13px;
  color: #333;
  outline: none;
  transition: all 0.15s;
}

.search-input:focus {
  background: #fff;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.search-input::placeholder {
  color: #aaa;
}

.clear-search {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  border: none;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-search:hover {
  background: #ccc;
  color: #333;
}

.section-categories {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.category-group {
  margin-bottom: 20px;
}

.category-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #999;
  padding: 0 8px;
  margin-bottom: 8px;
}

.section-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8f8f8;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: grab;
  font-size: 13px;
  color: #333;
  transition: all 0.15s;
  user-select: none;
}

.section-item:hover {
  background: #f0f0f0;
  border-color: #ddd;
}

.section-item:active {
  cursor: grabbing;
  background: #e8e8e8;
  transform: scale(0.98);
}

.section-icon {
  font-size: 16px;
  color: #666;
}

.section-item span {
  flex: 1;
}

.drag-handle {
  font-size: 14px;
  color: #ccc;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hyperui-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
}

.hyperui-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.change-template-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.change-template-btn:hover {
  background: #eee;
  border-color: #ccc;
}

/* Editor Switch Button */
.editor-switch-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  text-decoration: none;
  transition: all 0.15s;
}

.editor-switch-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* Canvas */
.builder-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.builder-canvas.full-width {
  flex: 1;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
}

.back-link:hover {
  color: #111;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e0e0e0;
  margin: 0 8px;
}

.page-title {
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  background: #f59e0b;
  color: #000;
  border-radius: 99px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover:not(:disabled) {
  background: #eee;
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-btn.active {
  background: #111;
  border-color: #111;
  color: white;
}

.toolbar-btn.primary {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #000;
  font-weight: 600;
}

.toolbar-btn.primary:hover {
  background: #e89209;
}

/* Device Preview Buttons */
.device-preview-btns {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  border-radius: 10px;
  border: 1px solid #ddd;
}

.device-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.device-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.device-btn.active {
  background: linear-gradient(135deg, #111 0%, #333 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.device-btn .iconify {
  font-size: 16px;
}

.device-label {
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Viewport indicator */
.viewport-indicator {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 6px;
  margin-left: 8px;
  font-family: 'SF Mono', 'Consolas', monospace;
}

/* Canvas Content */
.canvas-content {
  flex: 1;
  overflow-y: auto;
  background: #e5e5e5;
  position: relative;
  transition: max-width 0.3s ease;
}

/* When not desktop, add visual frame */
.canvas-content:not([style*="100%"]) {
  box-shadow: 0 0 0 1px #e0e0e0, 0 4px 20px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow-x: hidden;
  overflow-y: auto;
}

.canvas-content.preview-mode {
  background: white;
}

/* Drop Zones */
.drop-zone {
  height: 8px;
  margin: 0;
  position: relative;
  transition: all 0.2s;
}

.drop-zone.visible {
  height: 80px;
  margin: 8px 16px;
  background: rgba(245, 158, 11, 0.05);
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.drop-zone.active {
  height: 80px;
  margin: 8px 16px;
  background: rgba(245, 158, 11, 0.15);
  border: 2px dashed #f59e0b;
  border-radius: 8px;
}

.drop-indicator {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  color: #999;
  font-size: 13px;
}

.drop-zone.visible .drop-indicator,
.drop-zone.active .drop-indicator {
  display: flex;
}

.drop-zone.active .drop-indicator {
  color: #f59e0b;
}

/* Section Wrapper */
.section-wrapper {
  position: relative;
  transition: all 0.2s;
}

.section-wrapper:not(.preview-mode .section-wrapper) {
  cursor: pointer;
}

.section-wrapper:hover:not(.dragging) {
  outline: 2px dashed #ccc;
  outline-offset: -2px;
}

.section-wrapper.selected {
  outline: 3px solid #f59e0b;
  outline-offset: -3px;
}

.section-wrapper.dragging {
  opacity: 0.5;
}

.preview-mode .section-wrapper {
  cursor: default;
}

.preview-mode .section-wrapper:hover {
  outline: none;
}

/* Element Edit Mode */
.section-wrapper.element-edit-mode {
  cursor: crosshair;
}

.section-wrapper.element-edit-mode:hover {
  outline: 2px dashed #f59e0b;
  outline-offset: -2px;
}

.section-wrapper.element-edit-mode * {
  cursor: crosshair !important;
}

.section-wrapper.element-edit-mode *:hover {
  outline: 1px dashed rgba(245, 158, 11, 0.5);
  outline-offset: 1px;
}

/* Element Highlight - Selected element in edit mode */
:deep(.element-highlight) {
  outline: 2px solid #f59e0b !important;
  outline-offset: 2px !important;
  background-color: rgba(245, 158, 11, 0.05) !important;
  position: relative;
}

:deep(.element-highlight)::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px dashed rgba(245, 158, 11, 0.4);
  border-radius: 2px;
  pointer-events: none;
}

/* Section Error */
.section-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 14px;
}

/* Section Toolbar */
.section-toolbar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #111;
  border-radius: 8px 8px 0 0;
  z-index: 100;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
}

.section-actions {
  display: flex;
  gap: 2px;
}

.section-actions button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.15s;
}

.section-actions button:hover:not(:disabled) {
  background: rgba(255,255,255,0.15);
  color: white;
}

.section-actions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.section-actions button.delete:hover {
  background: #ef4444;
  color: white;
}

/* Add Button */
.add-button-wrapper {
  display: flex;
  justify-content: center;
  height: 0;
  position: relative;
  z-index: 50;
}

.add-section-btn {
  position: absolute;
  top: -16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.add-button-wrapper:hover .add-section-btn,
.section-wrapper:hover + .drop-zone + .add-button-wrapper .add-section-btn {
  opacity: 1;
}

.add-section-btn:hover {
  background: #f59e0b;
  border-color: #f59e0b;
  color: white;
  transform: scale(1.1);
}

/* Empty Canvas */
.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-canvas h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.empty-canvas p {
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
}

/* Page Switcher */
.page-switcher-container {
  position: relative;
}

.page-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;
}

.page-switcher:hover {
  background: #eee;
  border-color: #ccc;
}

.page-switcher .chevron {
  font-size: 14px;
  color: #888;
  transition: transform 0.2s;
}

.page-switcher .chevron.rotated {
  transform: rotate(180deg);
}

/* Pages Panel Dropdown */
.pages-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 280px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.pages-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.page-count {
  background: #e0e0e0;
  color: #666;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
}

.pages-list {
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
}

.page-item:hover {
  background: #f5f5f5;
}

.page-item.active {
  background: #fef3c7;
}

.page-icon {
  font-size: 16px;
  color: #888;
  flex-shrink: 0;
}

.page-item.active .page-icon {
  color: #f59e0b;
}

.page-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.home-badge {
  font-size: 10px;
  font-weight: 600;
  color: #666;
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.delete-page-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #999;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
}

.page-item:hover .delete-page-btn {
  opacity: 1;
}

.delete-page-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.add-page-section {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.new-page-input {
  flex: 1;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  outline: none;
  transition: border-color 0.15s;
}

.new-page-input:focus {
  border-color: #f59e0b;
}

.new-page-input::placeholder {
  color: #aaa;
}

.add-page-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f59e0b;
  border: none;
  border-radius: 6px;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.add-page-btn:hover:not(:disabled) {
  background: #e89209;
}

.add-page-btn:disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}

/* Dropdown Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Saved Blocks Section */
.saved-blocks {
  background: #fffbeb;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px;
}

.dark .saved-blocks {
  background: #27201a;
}

.saved-blocks .category-title {
  display: flex;
  align-items: center;
  color: #f59e0b;
}

.saved-block-item {
  position: relative;
}

.section-icon.saved {
  color: #f59e0b;
}

.delete-saved-btn {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.15s;
}

.saved-block-item:hover .delete-saved-btn {
  opacity: 1;
}

.delete-saved-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.dark .delete-saved-btn:hover {
  background: #450a0a;
}

/* Save button in section toolbar */
.section-actions button.save:hover {
  background: #fef3c7;
  color: #f59e0b;
}

.dark .section-actions button.save:hover {
  background: #422006;
  color: #fbbf24;
}

/* Save Block Modal */
.save-block-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
}

.save-block-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dark .save-block-modal {
  background: #1a1a1a;
  border: 1px solid #333;
}

.save-block-modal .modal-header {
  padding: 24px 24px 0;
  text-align: left;
}

.save-block-modal .modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
}

.dark .save-block-modal .modal-header h2 {
  color: #fff;
}

.save-block-modal .modal-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.dark .save-block-modal .modal-header p {
  color: #888;
}

.save-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.dark .form-group label {
  color: #888;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111;
  outline: none;
  transition: all 0.15s;
}

.dark .form-input {
  background: #262626;
  border-color: #404040;
  color: #fff;
}

.form-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.block-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-preview label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.dark .block-preview label {
  color: #888;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 13px;
  color: #374151;
}

.dark .preview-badge {
  background: #333;
  color: #ccc;
}

.save-block-modal .modal-footer {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 10px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.dark .cancel-btn {
  background: #333;
  color: #ccc;
}

.dark .cancel-btn:hover {
  background: #444;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.save-btn:hover:not(:disabled) {
  background: #fbbf24;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .save-block-modal,
.modal-leave-active .save-block-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .save-block-modal,
.modal-leave-to .save-block-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Add Section Modal */
.add-section-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
}

.add-section-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.dark .add-section-modal {
  background: #1a1a1a;
  border: 1px solid #333;
}

.add-section-modal .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.dark .add-section-modal .modal-header {
  border-color: #333;
}

.add-section-modal .modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.dark .add-section-modal .modal-header h2 {
  color: #fff;
}

.close-modal-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.close-modal-btn:hover {
  background: #e5e5e5;
  color: #111;
}

.dark .close-modal-btn {
  background: #333;
  color: #aaa;
}

.dark .close-modal-btn:hover {
  background: #444;
  color: #fff;
}

/* HyperUI Banner */
.hyperui-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  margin: 0 0 0 0;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-icon {
  font-size: 28px;
  color: white;
  opacity: 0.9;
}

.hyperui-banner h4 {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0 0 2px 0;
}

.hyperui-banner p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.section-categories-grid {
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-category {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-name {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin: 0;
}

.section-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.section-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f8f8f8;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.section-option:hover {
  background: #f0f0f0;
  border-color: #ddd;
  transform: translateY(-1px);
}

.dark .section-option {
  background: #262626;
}

.dark .section-option:hover {
  background: #333;
  border-color: #444;
}

.option-icon {
  font-size: 18px;
  color: #666;
  flex-shrink: 0;
}

.section-option:hover .option-icon {
  color: #f59e0b;
}

.option-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.dark .option-label {
  color: #ccc;
}

.modal-enter-from .add-section-modal,
.modal-leave-to .add-section-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Full Preview Overlay */
.full-preview-overlay {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #111;
  color: white;
  flex-shrink: 0;
}

.preview-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.preview-info .page-name {
  opacity: 0.7;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.preview-btn:hover {
  background: rgba(255,255,255,0.2);
}

.preview-btn.close {
  background: #ef4444;
}

.preview-btn.close:hover {
  background: #dc2626;
}

.preview-canvas {
  flex: 1;
  overflow-y: auto;
  background: white;
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.2s;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
}
</style>
