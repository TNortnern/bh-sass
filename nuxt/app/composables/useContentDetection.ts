/**
 * Smart Content Detection for Website Builder
 *
 * Parses section HTML to auto-detect editable elements:
 * - Text (h1-h6, p, span with text content)
 * - Images (img src and background-image styles)
 * - Links/buttons with href
 * - Grid structures (cards, items, testimonials)
 */

export interface EditableElement {
  id: string
  type: 'text' | 'heading' | 'image' | 'link' | 'button' | 'grid-item'
  fieldKey: string // The data field key this maps to
  selector: string // CSS selector for targeting
  currentValue: string
  label: string // Human-readable label
  parentPath: (string | number)[] // Path in data object ['items', 0, 'name']
  metadata: {
    isArray: boolean
    arrayIndex?: number
    arrayKey?: string
    tagName?: string
    placeholder?: string
  }
  constraints?: {
    maxLength?: number
    required?: boolean
    format?: 'url' | 'email' | 'phone' | 'number'
  }
}

export interface GridItemFields {
  image?: EditableElement
  title?: EditableElement
  description?: EditableElement
  category?: EditableElement
  price?: EditableElement
  link?: EditableElement
}

export interface GridItemMap {
  index: number
  selector: string
  parentPath: (string | number)[]
  label: string
  fields: GridItemFields
}

export interface ContentMap {
  sectionId: string
  sectionType: string
  elements: EditableElement[]
  gridItems: GridItemMap[]
}

// Common field patterns for detection
const FIELD_PATTERNS = {
  heading: ['headline', 'title', 'heading', 'name', 'h1', 'h2'],
  subheading: ['subheadline', 'subtitle', 'tagline', 'description'],
  text: ['content', 'text', 'body', 'excerpt', 'bio', 'paragraph'],
  image: ['image', 'backgroundImage', 'src', 'thumbnail', 'photo', 'picture', 'avatar'],
  link: ['link', 'href', 'url', 'buttonLink', 'ctaLink', 'primaryButtonLink', 'secondaryButtonLink'],
  button: ['buttonText', 'buttonLabel', 'ctaText', 'primaryButtonText', 'secondaryButtonText']
}

const GRID_SELECTORS = [
  '.rental-card',
  '.product-card',
  '.feature-card',
  '.testimonial-card',
  '.team-card',
  '[data-item]',
  '[data-card]'
]

export function useContentDetection() {
  /**
   * Detect all editable content in a section
   */
  const detectContent = (
    sectionId: string,
    sectionType: string,
    sectionData: Record<string, unknown>,
    domElement?: HTMLElement
  ): ContentMap => {
    const elements: EditableElement[] = []
    const gridItems: GridItemMap[] = []

    // Phase 1: Detect simple fields from data structure
    detectSimpleFields(sectionData, elements)

    // Phase 2: Detect array/grid fields
    detectGridFields(sectionData, gridItems)

    // Phase 3: If DOM is available, enhance with position info
    if (domElement) {
      enhanceWithDOMInfo(elements, gridItems, domElement)
    }

    return {
      sectionId,
      sectionType,
      elements,
      gridItems
    }
  }

  /**
   * Detect simple (non-array) editable fields
   */
  const detectSimpleFields = (
    data: Record<string, unknown>,
    elements: EditableElement[],
    pathPrefix: (string | number)[] = []
  ) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) continue

      // Skip arrays (handled separately)
      if (Array.isArray(value)) continue

      // Skip objects (except for nested field detection)
      if (typeof value === 'object') {
        // Recursively check nested objects for editable fields
        detectSimpleFields(value as Record<string, unknown>, elements, [...pathPrefix, key])
        continue
      }

      // Detect field type based on key name and value
      const fieldType = detectFieldType(key, value as Record<string, unknown>)
      if (!fieldType) continue

      const element: EditableElement = {
        id: `${pathPrefix.join('-')}-${key}`.replace(/^-/, ''),
        type: fieldType,
        fieldKey: key,
        selector: generateSelector(key, fieldType),
        currentValue: String(value),
        label: formatLabel(key),
        parentPath: [...pathPrefix, key],
        metadata: {
          isArray: false,
          tagName: getExpectedTagName(fieldType, key)
        },
        constraints: getConstraints(fieldType, key)
      }

      elements.push(element)
    }
  }

  /**
   * Detect array/grid fields (items, testimonials, features, etc.)
   */
  const detectGridFields = (
    data: Record<string, unknown>,
    gridItems: GridItemMap[]
  ) => {
    for (const [key, value] of Object.entries(data)) {
      if (!Array.isArray(value)) continue
      if (value.length === 0) continue

      // Check if array items are objects with editable fields
      const firstItem = value[0]
      if (typeof firstItem !== 'object' || firstItem === null) continue

      // Detect fields in each array item
      value.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) return

        const fields: GridItemFields = {}

        // Detect common fields within the item
        for (const [itemKey, itemValue] of Object.entries(item as Record<string, unknown>)) {
          if (typeof itemValue !== 'string' && typeof itemValue !== 'number') continue

          const fieldType = detectFieldType(itemKey, itemValue as unknown)
          if (!fieldType) continue

          const element: EditableElement = {
            id: `${key}-${index}-${itemKey}`,
            type: fieldType,
            fieldKey: itemKey,
            selector: `.${key}-item:nth-child(${index + 1}) .${itemKey}`,
            currentValue: String(itemValue),
            label: formatLabel(itemKey),
            parentPath: [key, index, itemKey],
            metadata: {
              isArray: true,
              arrayIndex: index,
              arrayKey: key
            },
            constraints: getConstraints(fieldType, itemKey)
          }

          // Map to grid item field slots
          if (fieldType === 'image') fields.image = element
          else if (fieldType === 'heading' || itemKey.includes('name') || itemKey.includes('title')) fields.title = element
          else if (itemKey.includes('description') || itemKey.includes('text')) fields.description = element
          else if (itemKey.includes('category')) fields.category = element
          else if (itemKey.includes('price')) fields.price = element
          else if (fieldType === 'link') fields.link = element
        }

        if (Object.keys(fields).length > 0) {
          gridItems.push({
            index,
            selector: `.${key}-item:nth-child(${index + 1})`,
            parentPath: [key, index],
            label: `${formatLabel(key)} ${index + 1}`,
            fields
          })
        }
      })
    }
  }

  /**
   * Detect field type based on key name and value
   */
  const detectFieldType = (key: string, value: unknown): EditableElement['type'] | null => {
    const lowerKey = key.toLowerCase()
    const strValue = String(value)

    // Check for image (URL patterns or key patterns)
    if (FIELD_PATTERNS.image.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'image'
    }
    if (strValue.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i)) {
      return 'image'
    }

    // Check for link
    if (FIELD_PATTERNS.link.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'link'
    }
    if (strValue.startsWith('http') || strValue.startsWith('/') || strValue.startsWith('#')) {
      if (!strValue.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) {
        return 'link'
      }
    }

    // Check for button text
    if (FIELD_PATTERNS.button.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'button'
    }

    // Check for heading
    if (FIELD_PATTERNS.heading.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'heading'
    }

    // Check for text content
    if (FIELD_PATTERNS.subheading.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'text'
    }
    if (FIELD_PATTERNS.text.some(p => lowerKey.includes(p.toLowerCase()))) {
      return 'text'
    }

    // If it's a string that's not a special type, treat as text
    if (typeof value === 'string' && value.length > 0 && value.length < 1000) {
      // Skip boolean-like values
      if (['true', 'false'].includes(value.toLowerCase())) return null
      // Skip color values
      if (value.match(/^#[0-9a-fA-F]{3,8}$/) || value.match(/^(rgb|hsl)/)) return null
      return 'text'
    }

    return null
  }

  /**
   * Enhance elements with DOM position info
   */
  const enhanceWithDOMInfo = (
    elements: EditableElement[],
    gridItems: GridItemMap[],
    domElement: HTMLElement
  ) => {
    // Try to find actual DOM elements and get their positions
    elements.forEach((element) => {
      const domEl = findDOMElement(domElement, element)
      if (domEl) {
        element.selector = generateCSSPath(domEl, domElement)
        element.metadata.tagName = domEl.tagName.toLowerCase()
      }
    })

    // Find grid items in DOM
    for (const selector of GRID_SELECTORS) {
      const cards = domElement.querySelectorAll(selector)
      if (cards.length > 0) {
        gridItems.forEach((item, idx) => {
          if (idx < cards.length) {
            item.selector = `${selector}:nth-child(${idx + 1})`
          }
        })
        break
      }
    }
  }

  /**
   * Find DOM element matching an editable element
   */
  const findDOMElement = (container: HTMLElement, element: EditableElement): HTMLElement | null => {
    // Try to find by text content match
    if (element.type === 'heading' || element.type === 'text' || element.type === 'button') {
      const textNodes = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button')
      for (const node of textNodes) {
        if (node.textContent?.trim() === element.currentValue) {
          return node as HTMLElement
        }
      }
    }

    // Try to find images by src
    if (element.type === 'image') {
      const images = container.querySelectorAll('img')
      for (const img of images) {
        if (img.src === element.currentValue || img.getAttribute('src') === element.currentValue) {
          return img as HTMLElement
        }
      }

      // Check background images
      const bgElements = container.querySelectorAll('[style*="background"]')
      for (const el of bgElements) {
        const style = (el as HTMLElement).style.backgroundImage
        if (style && style.includes(element.currentValue)) {
          return el as HTMLElement
        }
      }
    }

    // Try to find links by href
    if (element.type === 'link') {
      const links = container.querySelectorAll('a')
      for (const link of links) {
        if (link.href === element.currentValue || link.getAttribute('href') === element.currentValue) {
          return link as HTMLElement
        }
      }
    }

    return null
  }

  /**
   * Generate CSS selector path for element
   */
  const generateCSSPath = (element: HTMLElement, container: HTMLElement): string => {
    const path: string[] = []
    let current: HTMLElement | null = element

    while (current && current !== container && current !== document.body) {
      let selector = current.tagName.toLowerCase()

      if (current.id) {
        selector = `#${current.id}`
        path.unshift(selector)
        break
      }

      // Add nth-child if needed
      const parent = current.parentElement
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1
          selector += `:nth-child(${index})`
        }
      }

      path.unshift(selector)
      current = current.parentElement
    }

    return path.join(' > ')
  }

  /**
   * Generate expected selector for a field
   */
  const generateSelector = (key: string, type: EditableElement['type']): string => {
    if (type === 'heading') {
      if (key.includes('headline') || key.includes('title')) return 'h1, h2'
      if (key.includes('sub')) return 'h2, h3, p.subtitle'
      return 'h1, h2, h3'
    }
    if (type === 'text') return 'p, span'
    if (type === 'image') return 'img, [style*="background-image"]'
    if (type === 'link') return 'a'
    if (type === 'button') return 'button, a.btn'
    return '*'
  }

  /**
   * Get expected tag name for field type
   */
  const getExpectedTagName = (type: EditableElement['type'], key: string): string => {
    if (type === 'heading') {
      if (key.includes('headline') || key === 'title') return 'h1'
      if (key.includes('sub')) return 'h2'
      return 'h2'
    }
    if (type === 'text') return 'p'
    if (type === 'image') return 'img'
    if (type === 'link' || type === 'button') return 'a'
    return 'span'
  }

  /**
   * Get constraints for field type
   */
  const getConstraints = (type: EditableElement['type'], key: string): EditableElement['constraints'] => {
    if (type === 'heading') {
      return { maxLength: key.includes('headline') ? 100 : 150, required: true }
    }
    if (type === 'text') {
      return { maxLength: key.includes('description') ? 500 : 1000 }
    }
    if (type === 'image') {
      return { format: 'url', required: key.includes('background') }
    }
    if (type === 'link') {
      return { format: 'url' }
    }
    return {}
  }

  /**
   * Format field key into human-readable label
   */
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // camelCase to spaces
      .replace(/[_-]/g, ' ') // underscores/dashes to spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letters
      .trim()
  }

  /**
   * Get value from nested object using path
   */
  const getValueByPath = (obj: Record<string, unknown>, path: (string | number)[]): unknown => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return path.reduce((current: any, segment) => current?.[segment], obj)
  }

  /**
   * Set value in nested object using path (immutable)
   */
  const setValueByPath = (obj: Record<string, unknown>, path: (string | number)[], value: unknown): Record<string, unknown> | unknown[] => {
    if (path.length === 0) return value as Record<string, unknown> | unknown[]

    const head = path[0] as string | number
    const tail = path.slice(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = Array.isArray(obj) ? [...obj] : { ...obj }

    if (tail.length === 0) {
      newObj[head] = value
    } else {
      newObj[head] = setValueByPath((newObj[head] as Record<string, unknown>) ?? {}, tail, value)
    }

    return newObj as Record<string, unknown> | unknown[]
  }

  /**
   * Get icon for element type
   */
  const getTypeIcon = (type: EditableElement['type']): string => {
    const icons: Record<string, string> = {
      'heading': 'i-lucide-heading',
      'text': 'i-lucide-type',
      'image': 'i-lucide-image',
      'link': 'i-lucide-link',
      'button': 'i-lucide-mouse-pointer-click',
      'grid-item': 'i-lucide-layout-grid'
    }
    return icons[type] || 'i-lucide-square'
  }

  /**
   * Get color for element type
   */
  const getTypeColor = (type: EditableElement['type']): string => {
    const colors: Record<string, string> = {
      'heading': 'blue',
      'text': 'slate',
      'image': 'purple',
      'link': 'green',
      'button': 'amber',
      'grid-item': 'orange'
    }
    return colors[type] || 'gray'
  }

  return {
    detectContent,
    getValueByPath,
    setValueByPath,
    formatLabel,
    getTypeIcon,
    getTypeColor
  }
}
