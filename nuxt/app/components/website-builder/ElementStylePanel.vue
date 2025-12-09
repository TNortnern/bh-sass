<script setup lang="ts">
/**
 * Element Style Panel
 *
 * Allows editing individual element styles within sections.
 * Supports spacing, typography, colors, and sizing.
 */

interface SelectedElement {
  element: HTMLElement
  sectionId: string
  tagName: string
  path: string
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

const props = defineProps<{
  element: SelectedElement | null
}>()

const emit = defineEmits<{
  update: [property: string, value: string]
  updateContent: [type: 'text' | 'imageSrc' | 'imageAlt' | 'linkHref' | 'linkTarget', value: string]
  close: []
}>()

// Local editable values
const margin = reactive({
  top: '',
  right: '',
  bottom: '',
  left: ''
})

const padding = reactive({
  top: '',
  right: '',
  bottom: '',
  left: ''
})

const typography = reactive({
  fontSize: '',
  fontWeight: '400',
  color: '#000000',
  textAlign: 'left'
})

const appearance = reactive({
  backgroundColor: '',
  borderRadius: ''
})

// Content editing
const content = reactive({
  text: '',
  imageSrc: '',
  imageAlt: '',
  linkHref: '',
  linkTarget: '_self'
})

// Track which content types are editable for this element
const isTextElement = computed(() => {
  if (!props.element) return false
  const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'li', 'label']
  return textTags.includes(props.element.tagName)
})

const isImageElement = computed(() => {
  return props.element?.tagName === 'img'
})

const isLinkElement = computed(() => {
  return props.element?.tagName === 'a'
})

// Parse pixel values
const parsePixelValue = (value: string): string => {
  if (!value || value === 'auto') return ''
  return value.replace('px', '')
}

// Watch for element changes and update local values
watch(() => props.element, (el) => {
  if (el) {
    const styles = el.computedStyles
    const domEl = el.element

    // Spacing
    margin.top = parsePixelValue(styles.marginTop)
    margin.right = parsePixelValue(styles.marginRight)
    margin.bottom = parsePixelValue(styles.marginBottom)
    margin.left = parsePixelValue(styles.marginLeft)

    padding.top = parsePixelValue(styles.paddingTop)
    padding.right = parsePixelValue(styles.paddingRight)
    padding.bottom = parsePixelValue(styles.paddingBottom)
    padding.left = parsePixelValue(styles.paddingLeft)

    // Typography
    typography.fontSize = parsePixelValue(styles.fontSize)
    typography.fontWeight = styles.fontWeight
    typography.color = rgbToHex(styles.color)
    typography.textAlign = styles.textAlign

    // Appearance
    appearance.backgroundColor = rgbToHex(styles.backgroundColor)
    appearance.borderRadius = parsePixelValue(styles.borderRadius)

    // Content - get actual DOM values
    if (domEl) {
      // Text content (only direct text, not nested elements' text)
      if (isTextElement.value) {
        // Get text content, excluding nested elements for complex cases
        content.text = domEl.textContent?.trim() || ''
      }

      // Image attributes
      if (domEl.tagName.toLowerCase() === 'img') {
        content.imageSrc = domEl.getAttribute('src') || ''
        content.imageAlt = domEl.getAttribute('alt') || ''
      }

      // Link attributes
      if (domEl.tagName.toLowerCase() === 'a') {
        content.linkHref = domEl.getAttribute('href') || ''
        content.linkTarget = domEl.getAttribute('target') || '_self'
      }
    }
  }
}, { immediate: true })

// Convert RGB to Hex
const rgbToHex = (rgb: string): string => {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return ''

  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return rgb

  const r = parseInt(match[1] || '0').toString(16).padStart(2, '0')
  const g = parseInt(match[2] || '0').toString(16).padStart(2, '0')
  const b = parseInt(match[3] || '0').toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}

// Update handlers
const updateMargin = (side: 'top' | 'right' | 'bottom' | 'left') => {
  const value = margin[side]
  const cssValue = value ? `${value}px` : ''
  emit('update', `margin${side.charAt(0).toUpperCase() + side.slice(1)}`, cssValue)
}

const updatePadding = (side: 'top' | 'right' | 'bottom' | 'left') => {
  const value = padding[side]
  const cssValue = value ? `${value}px` : ''
  emit('update', `padding${side.charAt(0).toUpperCase() + side.slice(1)}`, cssValue)
}

const updateFontSize = () => {
  const value = typography.fontSize
  emit('update', 'fontSize', value ? `${value}px` : '')
}

const updateFontWeight = () => {
  emit('update', 'fontWeight', typography.fontWeight)
}

const updateColor = () => {
  emit('update', 'color', typography.color)
}

const updateTextAlign = () => {
  emit('update', 'textAlign', typography.textAlign)
}

const updateBackgroundColor = () => {
  emit('update', 'backgroundColor', appearance.backgroundColor)
}

const updateBorderRadius = () => {
  const value = appearance.borderRadius
  emit('update', 'borderRadius', value ? `${value}px` : '')
}

// Content update handlers
const updateText = () => {
  emit('updateContent', 'text', content.text)
}

const updateImageSrc = () => {
  emit('updateContent', 'imageSrc', content.imageSrc)
}

const updateImageAlt = () => {
  emit('updateContent', 'imageAlt', content.imageAlt)
}

const updateLinkHref = () => {
  emit('updateContent', 'linkHref', content.linkHref)
}

const updateLinkTarget = () => {
  emit('updateContent', 'linkTarget', content.linkTarget)
}

// Link target options
const linkTargets = [
  { label: 'Same Tab', value: '_self' },
  { label: 'New Tab', value: '_blank' }
]

// Font weight options
const fontWeights = [
  { label: 'Thin', value: '100' },
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
  { label: 'Black', value: '900' }
]

// Text align options
const textAligns = [
  { label: 'Left', value: 'left', icon: 'i-lucide-align-left' },
  { label: 'Center', value: 'center', icon: 'i-lucide-align-center' },
  { label: 'Right', value: 'right', icon: 'i-lucide-align-right' },
  { label: 'Justify', value: 'justify', icon: 'i-lucide-align-justify' }
]

// Get element display name
const elementName = computed(() => {
  if (!props.element) return ''
  const tag = props.element.tagName
  const displayNames: Record<string, string> = {
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    p: 'Paragraph',
    span: 'Text Span',
    a: 'Link',
    button: 'Button',
    img: 'Image',
    div: 'Container',
    section: 'Section',
    article: 'Article',
    nav: 'Navigation',
    header: 'Header',
    footer: 'Footer',
    ul: 'Unordered List',
    ol: 'Ordered List',
    li: 'List Item'
  }
  return displayNames[tag] || tag.toUpperCase()
})
</script>

<template>
  <aside
    v-if="element"
    class="element-panel"
  >
    <div class="panel-header">
      <div class="header-info">
        <UIcon
          name="i-lucide-mouse-pointer-click"
          class="header-icon"
        />
        <div>
          <h3>Element Styles</h3>
          <p class="element-tag">
            {{ elementName }}
          </p>
        </div>
      </div>
      <button
        class="close-btn"
        @click="emit('close')"
      >
        <UIcon name="i-lucide-x" />
      </button>
    </div>

    <div class="panel-content">
      <!-- Content Section (for text, images, links) -->
      <div
        v-if="isTextElement || isImageElement"
        class="section content-section"
      >
        <h4 class="section-title">
          <UIcon name="i-lucide-edit-3" />
          Content
        </h4>

        <!-- Text Content -->
        <div
          v-if="isTextElement"
          class="field"
        >
          <label>Text Content</label>
          <textarea
            v-model="content.text"
            class="text-area-input"
            rows="3"
            placeholder="Enter text..."
            @change="updateText"
          />
        </div>

        <!-- Image Source -->
        <div
          v-if="isImageElement"
          class="field"
        >
          <label>Image URL</label>
          <input
            v-model="content.imageSrc"
            type="text"
            class="text-input"
            placeholder="https://..."
            @change="updateImageSrc"
          >
          <p class="field-hint">
            Paste an image URL or upload to your media library
          </p>
        </div>

        <!-- Image Alt Text -->
        <div
          v-if="isImageElement"
          class="field"
        >
          <label>Alt Text</label>
          <input
            v-model="content.imageAlt"
            type="text"
            class="text-input"
            placeholder="Describe the image..."
            @change="updateImageAlt"
          >
          <p class="field-hint">
            Describes the image for accessibility
          </p>
        </div>

        <!-- Link URL (for anchor elements) -->
        <div
          v-if="isLinkElement"
          class="field"
        >
          <label>Link URL</label>
          <input
            v-model="content.linkHref"
            type="text"
            class="text-input"
            placeholder="/page or https://..."
            @change="updateLinkHref"
          >
        </div>

        <!-- Link Target -->
        <div
          v-if="isLinkElement"
          class="field"
        >
          <label>Open In</label>
          <select
            v-model="content.linkTarget"
            class="select-input"
            @change="updateLinkTarget"
          >
            <option
              v-for="t in linkTargets"
              :key="t.value"
              :value="t.value"
            >
              {{ t.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Spacing Section -->
      <div class="section">
        <h4 class="section-title">
          <UIcon name="i-lucide-move" />
          Spacing
        </h4>

        <div class="spacing-group">
          <label class="group-label">Margin (px)</label>
          <div class="spacing-grid">
            <div class="spacing-input">
              <span class="input-label">T</span>
              <input
                v-model="margin.top"
                type="number"
                placeholder="0"
                @change="updateMargin('top')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">R</span>
              <input
                v-model="margin.right"
                type="number"
                placeholder="0"
                @change="updateMargin('right')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">B</span>
              <input
                v-model="margin.bottom"
                type="number"
                placeholder="0"
                @change="updateMargin('bottom')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">L</span>
              <input
                v-model="margin.left"
                type="number"
                placeholder="0"
                @change="updateMargin('left')"
              >
            </div>
          </div>
        </div>

        <div class="spacing-group">
          <label class="group-label">Padding (px)</label>
          <div class="spacing-grid">
            <div class="spacing-input">
              <span class="input-label">T</span>
              <input
                v-model="padding.top"
                type="number"
                placeholder="0"
                @change="updatePadding('top')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">R</span>
              <input
                v-model="padding.right"
                type="number"
                placeholder="0"
                @change="updatePadding('right')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">B</span>
              <input
                v-model="padding.bottom"
                type="number"
                placeholder="0"
                @change="updatePadding('bottom')"
              >
            </div>
            <div class="spacing-input">
              <span class="input-label">L</span>
              <input
                v-model="padding.left"
                type="number"
                placeholder="0"
                @change="updatePadding('left')"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Section -->
      <div class="section">
        <h4 class="section-title">
          <UIcon name="i-lucide-type" />
          Typography
        </h4>

        <div class="field">
          <label>Font Size (px)</label>
          <input
            v-model="typography.fontSize"
            type="number"
            placeholder="16"
            class="text-input"
            @change="updateFontSize"
          >
        </div>

        <div class="field">
          <label>Font Weight</label>
          <select
            v-model="typography.fontWeight"
            class="select-input"
            @change="updateFontWeight"
          >
            <option
              v-for="w in fontWeights"
              :key="w.value"
              :value="w.value"
            >
              {{ w.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Text Color</label>
          <div class="color-input-wrapper">
            <input
              v-model="typography.color"
              type="color"
              class="color-input"
              @change="updateColor"
            >
            <input
              v-model="typography.color"
              type="text"
              placeholder="#000000"
              class="color-text"
              @change="updateColor"
            >
          </div>
        </div>

        <div class="field">
          <label>Text Align</label>
          <div class="align-buttons">
            <button
              v-for="align in textAligns"
              :key="align.value"
              :class="{ active: typography.textAlign === align.value }"
              :title="align.label"
              @click="typography.textAlign = align.value; updateTextAlign()"
            >
              <UIcon :name="align.icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Appearance Section -->
      <div class="section">
        <h4 class="section-title">
          <UIcon name="i-lucide-palette" />
          Appearance
        </h4>

        <div class="field">
          <label>Background Color</label>
          <div class="color-input-wrapper">
            <input
              v-model="appearance.backgroundColor"
              type="color"
              class="color-input"
              @change="updateBackgroundColor"
            >
            <input
              v-model="appearance.backgroundColor"
              type="text"
              placeholder="transparent"
              class="color-text"
              @change="updateBackgroundColor"
            >
          </div>
        </div>

        <div class="field">
          <label>Border Radius (px)</label>
          <input
            v-model="appearance.borderRadius"
            type="number"
            placeholder="0"
            class="text-input"
            @change="updateBorderRadius"
          >
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.element-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(to bottom, #fef3c7, #fef9c3);
}

.header-info {
  display: flex;
  gap: 12px;
}

.header-icon {
  font-size: 20px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 2px;
}

.panel-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin-bottom: 2px;
}

.element-tag {
  font-size: 12px;
  color: #666;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #111;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.section {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.section-title .iconify {
  font-size: 14px;
  color: #888;
}

.spacing-group {
  margin-bottom: 12px;
}

.spacing-group:last-child {
  margin-bottom: 0;
}

.group-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.spacing-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.spacing-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.input-label {
  font-size: 10px;
  font-weight: 600;
  color: #999;
}

.spacing-input input {
  width: 100%;
  padding: 6px 4px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  background: #f8f8f8;
  outline: none;
  transition: all 0.15s;
}

.spacing-input input:focus {
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
}

.field {
  margin-bottom: 12px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.text-input,
.select-input,
.text-area-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  background: #f8f8f8;
  outline: none;
  transition: all 0.15s;
}

.text-area-input {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.4;
}

.text-input:focus,
.select-input:focus,
.text-area-input:focus {
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
}

.field-hint {
  font-size: 10px;
  color: #888;
  margin-top: 4px;
  line-height: 1.3;
}

.content-section {
  background: linear-gradient(to bottom, #ecfdf5, #f0fdf4);
  border-bottom: 2px solid #86efac !important;
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
}

.color-input {
  width: 40px;
  height: 36px;
  padding: 2px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.color-text {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  background: #f8f8f8;
  outline: none;
  transition: all 0.15s;
}

.color-text:focus {
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
}

.align-buttons {
  display: flex;
  gap: 4px;
}

.align-buttons button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.align-buttons button:hover {
  background: #f0f0f0;
  color: #333;
}

.align-buttons button.active {
  background: #f59e0b;
  border-color: #f59e0b;
  color: white;
}

.align-buttons button .iconify {
  font-size: 16px;
}
</style>
