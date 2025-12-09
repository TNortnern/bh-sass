<script setup lang="ts">
import type { WebsiteSection } from '~/data/website-builder-sample'
import type { EditableElement, GridItemMap } from '~/composables/useContentDetection'

// Explicit imports for components that may not auto-import
import SmartImagePicker from '~/components/website-builder/SmartImagePicker.vue'
import GridItemEditor from '~/components/website-builder/GridItemEditor.vue'

interface Props {
  section: WebsiteSection | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [sectionId: string, field: string, value: unknown]
  close: []
}>()

// Business data integration
const {
  loading: _loadingBusinessData,
  canAutoPopulate,
  populateSection,
  loadBusinessData,
  getRentalItemImages: _getRentalItemImages
} = useWebsiteBuilderData()

// Image picker state
const showImagePicker = ref(false)
const currentImageElement = ref<EditableElement | null>(null)
const currentImageField = ref<{ key: string, arrayKey?: string, index?: number } | null>(null)

// Grid item editor state
const showGridItemEditor = ref(false)
const currentGridItem = ref<GridItemMap | null>(null)
const currentGridArrayKey = ref<string | null>(null)

// Auto-populate handling
const isAutoPopulating = ref(false)

/**
 * Check if current section can be auto-populated
 */
const canAutoPopulateSection = computed(() => {
  if (!props.section) return false
  return canAutoPopulate(props.section.type)
})

/**
 * Handle auto-populate button click
 */
const handleAutoPopulate = async () => {
  if (!props.section || !canAutoPopulateSection.value) return

  isAutoPopulating.value = true

  try {
    // Load business data if not already loaded
    await loadBusinessData()

    // Get populated data for this section type
    const populatedData = populateSection(props.section.type)

    if (populatedData) {
      // Update each field
      Object.entries(populatedData).forEach(([key, value]) => {
        emit('update', props.section!.id, key, value)
      })
    }
  } catch (error) {
    console.error('Auto-populate failed:', error)
  } finally {
    isAutoPopulating.value = false
  }
}

/**
 * Open image picker for a field
 */
const openImagePicker = (key: string, currentValue: string, arrayKey?: string, index?: number) => {
  currentImageElement.value = {
    id: `${arrayKey || ''}-${index ?? ''}-${key}`,
    type: 'image',
    fieldKey: key,
    selector: '',
    currentValue: currentValue || '',
    label: getFieldLabel(key),
    parentPath: arrayKey && index !== undefined ? [arrayKey, index, key] : [key],
    metadata: { isArray: !!arrayKey, arrayIndex: index, arrayKey }
  }
  currentImageField.value = { key, arrayKey, index }
  showImagePicker.value = true
}

/**
 * Handle image selection from picker
 */
const handleImageSelect = (element: EditableElement, newValue: string) => {
  if (!currentImageField.value || !props.section) return

  const { key, arrayKey, index } = currentImageField.value

  if (arrayKey !== undefined && index !== undefined) {
    updateArrayItem(arrayKey, index, key, newValue)
  } else {
    updateField(key, newValue)
  }

  showImagePicker.value = false
  currentImageElement.value = null
  currentImageField.value = null
}

/**
 * Open grid item editor for an array item
 */
const openGridItemEditor = (arrayKey: string, item: Record<string, unknown>, index: number) => {
  currentGridArrayKey.value = arrayKey

  // Build grid item map from the item data
  const fields: Record<string, unknown> = {}

  Object.entries(item).forEach(([itemKey, itemValue]) => {
    if (itemKey === 'id') return
    if (typeof itemValue !== 'string' && typeof itemValue !== 'number') return

    const fieldType = getFieldType(itemKey, itemValue)
    const element: EditableElement = {
      id: `${arrayKey}-${index}-${itemKey}`,
      type: fieldType === 'image' ? 'image' : fieldType === 'textarea' ? 'text' : 'heading',
      fieldKey: itemKey,
      selector: '',
      currentValue: String(itemValue),
      label: getFieldLabel(itemKey),
      parentPath: [arrayKey, index, itemKey],
      metadata: { isArray: true, arrayIndex: index, arrayKey }
    }

    if (fieldType === 'image') fields.image = element
    else if (itemKey.includes('name') || itemKey.includes('title')) fields.title = element
    else if (itemKey.includes('description') || itemKey.includes('quote') || itemKey.includes('excerpt') || itemKey.includes('bio')) fields.description = element
    else if (itemKey.includes('category') || itemKey.includes('role')) fields.category = element
    else if (itemKey.includes('price')) fields.price = element
    else if (itemKey.includes('link') || itemKey.includes('href')) fields.link = element
  })

  currentGridItem.value = {
    index,
    selector: '',
    parentPath: [arrayKey, index],
    label: `${getArrayItemLabel(arrayKey)} ${index + 1}`,
    fields
  }

  showGridItemEditor.value = true
}

/**
 * Handle grid item save
 */
const handleGridItemSave = (gridItem: GridItemMap, updates: Record<string, string>) => {
  if (!currentGridArrayKey.value || !props.section) return

  const arrayKey = currentGridArrayKey.value
  const index = gridItem.index

  const _props = props

  // Update each field
  Object.entries(updates).forEach(([key, value]) => {
    // Map field name back to actual item key
    let actualKey = key
    if (key === 'title') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = (_props.section!.data[arrayKey] as any[])[index]
      actualKey = Object.keys(item).find(k => k.includes('name') || k.includes('title')) || 'name'
    } else if (key === 'description') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = (_props.section!.data[arrayKey] as any[])[index]
      actualKey = Object.keys(item).find(k =>
        k.includes('description') || k.includes('quote') || k.includes('excerpt') || k.includes('bio')

      ) || 'description'
    } else if (key === 'category') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = (_props.section!.data[arrayKey] as any[])[index]
      actualKey = Object.keys(item).find(k => k.includes('category') || k.includes('role')) || 'category'
    }

    updateArrayItem(arrayKey, index, actualKey, value)
  })

  showGridItemEditor.value = false
  currentGridItem.value = null
  currentGridArrayKey.value = null
}

// Field type detection
const getFieldType = (key: string, value: unknown): string => {
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (key.includes('image') || key.includes('Image') || key.includes('src') || key.includes('logo') || key.includes('avatar')) return 'image'
  if (key.includes('color') || key.includes('Color') || key.includes('background') || key.includes('Background')) return 'color'
  if (key.includes('link') || key.includes('Link') || key.includes('href') || key.includes('url') || key.includes('Url')) return 'url'
  if (key.includes('content') || key.includes('description') || key.includes('bio') || key.includes('answer') || key.includes('excerpt')) return 'textarea'
  if (key === 'style' || key === 'layout' || key === 'columns' || key === 'imagePosition') return 'select'
  return 'text'
}

// Select options for different fields
const getSelectOptions = (key: string, _sectionType: string): { label: string, value: string | number }[] => {
  const options: Record<string, { label: string, value: string | number }[]> = {
    style: [
      { label: 'Cards', value: 'cards' },
      { label: 'Minimal', value: 'minimal' },
      { label: 'Grid', value: 'grid' },
      { label: 'Simple', value: 'simple' },
      { label: 'Card', value: 'card' },
      { label: 'Split', value: 'split' },
      { label: 'Featured', value: 'featured' },
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'Row', value: 'row' }
    ],
    layout: [
      { label: 'Row', value: 'row' },
      { label: 'Grid', value: 'grid' }
    ],
    columns: [
      { label: '2 Columns', value: 2 },
      { label: '3 Columns', value: 3 },
      { label: '4 Columns', value: 4 }
    ],
    imagePosition: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' }
    ],
    size: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' }
    ],
    color: [
      { label: 'Amber', value: 'amber' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Purple', value: 'purple' },
      { label: 'Pink', value: 'pink' },
      { label: 'Red', value: 'red' },
      { label: 'Cyan', value: 'cyan' },
      { label: 'Dark', value: 'dark' }
    ],
    icon: [
      { label: 'Sparkles', value: 'sparkles' },
      { label: 'Shield', value: 'shield' },
      { label: 'Zap', value: 'zap' },
      { label: 'Heart', value: 'heart' },
      { label: 'Clock', value: 'clock' },
      { label: 'Rocket', value: 'rocket' },
      { label: 'Globe', value: 'globe' },
      { label: 'Lock', value: 'lock' },
      { label: 'Star', value: 'star' },
      { label: 'Truck', value: 'truck' },
      { label: 'Search', value: 'search' },
      { label: 'Calendar', value: 'calendar' },
      { label: 'Party', value: 'partyPopper' }
    ]
  }
  return options[key] || []
}

// Human-readable field labels
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    headline: 'Headline',
    subheadline: 'Subheadline',
    primaryButtonText: 'Primary Button Text',
    primaryButtonLink: 'Primary Button Link',
    secondaryButtonText: 'Secondary Button Text',
    secondaryButtonLink: 'Secondary Button Link',
    backgroundImage: 'Background Image',
    backgroundColor: 'Background Color',
    buttonText: 'Button Text',
    buttonLink: 'Button Link',
    ctaText: 'CTA Button Text',
    ctaLink: 'CTA Button Link',
    showPrices: 'Show Prices',
    showForm: 'Show Contact Form',
    showAuthor: 'Show Author',
    showDate: 'Show Date',
    showCategory: 'Show Category',
    columns: 'Columns',
    style: 'Style',
    layout: 'Layout',
    imagePosition: 'Image Position',
    grayscale: 'Grayscale Logos',
    transparent: 'Transparent Background',
    placeholder: 'Placeholder Text',
    note: 'Note Text'
  }
  return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Get array item label
const getArrayItemLabel = (key: string): string => {
  const labels: Record<string, string> = {
    images: 'Image',
    items: 'Item',
    testimonials: 'Testimonial',
    badges: 'Badge',
    steps: 'Step',
    features: 'Feature',
    members: 'Team Member',
    posts: 'Blog Post',
    tiers: 'Pricing Tier',
    stats: 'Stat',
    links: 'Link',
    logos: 'Logo',
    trustBadges: 'Trust Badge'
  }
  return labels[key] || 'Item'
}

// Fields to skip in the panel
const skipFields = ['id', 'type']

// Handle field update
const updateField = (key: string, value: unknown) => {
  if (props.section) {
    emit('update', props.section.id, key, value)
  }
}

// Handle array item update

const updateArrayItem = (arrayKey: string, index: number, itemKey: string, value: unknown) => {
  if (props.section) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArray = [...(props.section.data[arrayKey] as any[] || [])]
    newArray[index] = { ...newArray[index], [itemKey]: value }
    emit('update', props.section.id, arrayKey, newArray)
  }
}

// Add new array item

const addArrayItem = (arrayKey: string) => {
  if (!props.section) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newArray = [...(props.section.data[arrayKey] as any[] || [])]
  const newItem = createDefaultItem(arrayKey, newArray.length)
  newArray.push(newItem)
  emit('update', props.section.id, arrayKey, newArray)
}

// Remove array item

const removeArrayItem = (arrayKey: string, index: number) => {
  if (!props.section) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newArray = [...(props.section.data[arrayKey] as any[] || [])]
  newArray.splice(index, 1)
  emit('update', props.section.id, arrayKey, newArray)
}

// Move array item

const moveArrayItem = (arrayKey: string, index: number, direction: 'up' | 'down') => {
  if (!props.section) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newArray = [...(props.section.data[arrayKey] as any[] || [])]
  const newIndex = direction === 'up' ? index - 1 : index + 1

  if (newIndex < 0 || newIndex >= newArray.length) return

  const temp = newArray[index]
  newArray[index] = newArray[newIndex]
  newArray[newIndex] = temp

  emit('update', props.section.id, arrayKey, newArray)
}

// Create default item for array
const createDefaultItem = (arrayKey: string, index: number): Record<string, unknown> => {
  const defaults: Record<string, Record<string, unknown>> = {
    images: { id: `img-${Date.now()}`, src: '', alt: 'Image description', caption: '' },
    items: { id: `item-${Date.now()}`, name: 'New Item', image: '', price: 0, category: '', slug: `item-${index + 1}` },
    testimonials: { id: `test-${Date.now()}`, quote: 'Customer testimonial goes here...', name: 'Customer Name', role: 'Role', image: '', rating: 5 },
    badges: { id: `badge-${Date.now()}`, icon: 'star', title: 'Badge Title', description: 'Badge description' },
    steps: { id: `step-${Date.now()}`, number: String(index + 1), title: 'Step Title', description: 'Step description', icon: 'sparkles' },
    features: { id: `feat-${Date.now()}`, icon: 'sparkles', title: 'Feature Title', description: 'Feature description' },
    members: { id: `member-${Date.now()}`, name: 'Team Member', role: 'Role', image: '', bio: '' },
    posts: { id: `post-${Date.now()}`, title: 'Blog Post Title', excerpt: 'Post excerpt...', image: '', date: new Date().toISOString().split('T')[0], category: '', readTime: '5 min read', link: '#' },
    tiers: { id: `tier-${Date.now()}`, name: 'Plan Name', description: 'Plan description', price: '$99', priceNote: '/month', features: [], popular: false, ctaText: 'Get Started', ctaLink: '#' },
    stats: { id: `stat-${Date.now()}`, value: '100+', label: 'Stat Label', description: 'Stat description' },
    links: { id: `link-${Date.now()}`, label: 'Link Text', href: '#' },
    logos: { id: `logo-${Date.now()}`, src: '', alt: 'Logo', name: 'Company Name' },
    trustBadges: { id: `trust-${Date.now()}`, icon: 'shield', text: 'Trust Badge' }
  }
  return defaults[arrayKey] || { id: `item-${Date.now()}` }
}

// Expanded items state
const expandedItems = ref<Record<string, boolean>>({})

const toggleExpand = (key: string) => {
  expandedItems.value[key] = !expandedItems.value[key]
}

// Section display name
const sectionDisplayName = computed(() => {
  if (!props.section) return ''
  return props.section.type.replace(/([A-Z])/g, ' $1').trim()
})
</script>

<template>
  <div
    class="properties-panel"
    :class="{ open: section }"
  >
    <div
      v-if="section"
      class="panel-content"
    >
      <!-- Header -->
      <div class="panel-header">
        <div class="header-title">
          <UIcon name="i-lucide-settings-2" />
          <span>{{ sectionDisplayName }}</span>
        </div>
        <button
          class="close-btn"
          @click="$emit('close')"
        >
          <UIcon name="i-lucide-x" />
        </button>
      </div>

      <!-- Auto-populate bar -->
      <div
        v-if="canAutoPopulateSection"
        class="auto-populate-bar"
      >
        <div class="auto-populate-info">
          <UIcon
            name="i-lucide-sparkles"
            class="text-amber-500"
          />
          <span>Auto-fill with your business data</span>
        </div>
        <button
          class="auto-populate-btn"
          :disabled="isAutoPopulating"
          @click="handleAutoPopulate"
        >
          <UIcon
            v-if="isAutoPopulating"
            name="i-lucide-loader-circle"
            class="animate-spin"
          />
          <UIcon
            v-else
            name="i-lucide-wand-2"
          />
          <span>{{ isAutoPopulating ? 'Loading...' : 'Auto-fill' }}</span>
        </button>
      </div>

      <!-- Fields -->
      <div class="panel-body">
        <template
          v-for="(value, key) in section.data"
          :key="key"
        >
          <template v-if="!skipFields.includes(String(key))">
            <!-- Array Fields (images, testimonials, etc.) -->
            <div
              v-if="getFieldType(String(key), value) === 'array'"
              class="field-group array-field"
            >
              <div
                class="array-header"
                @click="toggleExpand(String(key))"
              >
                <div class="array-title">
                  <UIcon :name="expandedItems[String(key)] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'" />
                  <span>{{ getFieldLabel(String(key)) }}</span>
                  <span class="item-count">{{ (value as Record<string, unknown>[]).length }}</span>
                </div>
                <button
                  class="add-item-btn"
                  title="Add item"
                  @click.stop="addArrayItem(String(key))"
                >
                  <UIcon name="i-lucide-plus" />
                </button>
              </div>

              <div
                v-if="expandedItems[String(key)]"
                class="array-items"
              >
                <div
                  v-for="(item, index) in (value as Record<string, unknown>[])"
                  :key="item.id || index"
                  class="array-item"
                >
                  <div class="item-header">
                    <span class="item-number">{{ getArrayItemLabel(String(key)) }} {{ index + 1 }}</span>
                    <div class="item-actions">
                      <button
                        class="edit-item-btn"
                        title="Quick Edit All Fields"
                        @click="openGridItemEditor(String(key), item, index)"
                      >
                        <UIcon name="i-lucide-pencil" />
                      </button>
                      <button
                        :disabled="index === 0"
                        title="Move up"
                        @click="moveArrayItem(String(key), index, 'up')"
                      >
                        <UIcon name="i-lucide-chevron-up" />
                      </button>
                      <button
                        :disabled="index === (value as Record<string, unknown>[]).length - 1"
                        title="Move down"
                        @click="moveArrayItem(String(key), index, 'down')"
                      >
                        <UIcon name="i-lucide-chevron-down" />
                      </button>
                      <button
                        class="delete-btn"
                        title="Delete"
                        @click="removeArrayItem(String(key), index)"
                      >
                        <UIcon name="i-lucide-trash-2" />
                      </button>
                    </div>
                  </div>

                  <div class="item-fields">
                    <template
                      v-for="(itemValue, itemKey) in item"
                      :key="itemKey"
                    >
                      <template v-if="itemKey !== 'id'">
                        <!-- Image field -->
                        <div
                          v-if="getFieldType(String(itemKey), itemValue) === 'image'"
                          class="field"
                        >
                          <label>{{ getFieldLabel(String(itemKey)) }}</label>
                          <div class="image-field-smart">
                            <div
                              v-if="itemValue"
                              class="image-preview-thumb"
                            >
                              <img
                                :src="itemValue"
                                :alt="item.alt || item.name || 'Preview'"
                              >
                            </div>
                            <div
                              v-else
                              class="image-placeholder-thumb"
                            >
                              <UIcon name="i-lucide-image" />
                            </div>
                            <button
                              class="choose-image-btn"
                              @click="openImagePicker(String(itemKey), itemValue, String(key), index)"
                            >
                              <UIcon name="i-lucide-image-plus" />
                              <span>{{ itemValue ? 'Change' : 'Choose Image' }}</span>
                            </button>
                          </div>
                        </div>

                        <!-- Textarea field -->
                        <div
                          v-else-if="getFieldType(String(itemKey), itemValue) === 'textarea'"
                          class="field"
                        >
                          <label>{{ getFieldLabel(String(itemKey)) }}</label>
                          <textarea
                            :value="itemValue"
                            rows="2"
                            @input="updateArrayItem(String(key), index, String(itemKey), ($event.target as HTMLTextAreaElement).value)"
                          />
                        </div>

                        <!-- Select field -->
                        <div
                          v-else-if="getSelectOptions(String(itemKey), section.type).length > 0"
                          class="field"
                        >
                          <label>{{ getFieldLabel(String(itemKey)) }}</label>
                          <select
                            :value="itemValue"
                            @change="updateArrayItem(String(key), index, String(itemKey), ($event.target as HTMLSelectElement).value)"
                          >
                            <option
                              v-for="opt in getSelectOptions(String(itemKey), section.type)"
                              :key="opt.value"
                              :value="opt.value"
                            >
                              {{ opt.label }}
                            </option>
                          </select>
                        </div>

                        <!-- Number field -->
                        <div
                          v-else-if="typeof itemValue === 'number'"
                          class="field"
                        >
                          <label>{{ getFieldLabel(String(itemKey)) }}</label>
                          <input
                            type="number"
                            :value="itemValue"
                            @input="updateArrayItem(String(key), index, String(itemKey), Number(($event.target as HTMLInputElement).value))"
                          >
                        </div>

                        <!-- Boolean field -->
                        <div
                          v-else-if="typeof itemValue === 'boolean'"
                          class="field checkbox-field"
                        >
                          <label>
                            <input
                              type="checkbox"
                              :checked="itemValue"
                              @change="updateArrayItem(String(key), index, String(itemKey), ($event.target as HTMLInputElement).checked)"
                            >
                            {{ getFieldLabel(String(itemKey)) }}
                          </label>
                        </div>

                        <!-- Text field (default) -->
                        <div
                          v-else-if="typeof itemValue === 'string'"
                          class="field"
                        >
                          <label>{{ getFieldLabel(String(itemKey)) }}</label>
                          <input
                            type="text"
                            :value="itemValue"
                            @input="updateArrayItem(String(key), index, String(itemKey), ($event.target as HTMLInputElement).value)"
                          >
                        </div>
                      </template>
                    </template>
                  </div>
                </div>

                <button
                  v-if="(value as Record<string, unknown>[]).length === 0"
                  class="empty-add-btn"
                  @click="addArrayItem(String(key))"
                >
                  <UIcon name="i-lucide-plus" />
                  Add {{ getArrayItemLabel(String(key)) }}
                </button>
              </div>
            </div>

            <!-- Image Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'image'"
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <div class="image-field-smart large">
                <div
                  v-if="value"
                  class="image-preview-large"
                >
                  <img
                    :src="value as string"
                    alt="Preview"
                  >
                </div>
                <div
                  v-else
                  class="image-placeholder-large"
                >
                  <UIcon name="i-lucide-image" />
                  <span>No image selected</span>
                </div>
                <button
                  class="choose-image-btn"
                  @click="openImagePicker(String(key), value as string)"
                >
                  <UIcon name="i-lucide-image-plus" />
                  <span>{{ value ? 'Change Image' : 'Choose Image' }}</span>
                </button>
              </div>
            </div>

            <!-- Boolean Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'boolean'"
              class="field-group checkbox-field"
            >
              <label>
                <input
                  type="checkbox"
                  :checked="value as boolean"
                  @change="updateField(String(key), ($event.target as HTMLInputElement).checked)"
                >
                {{ getFieldLabel(String(key)) }}
              </label>
            </div>

            <!-- Select Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'select'"
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <select
                :value="value"
                @change="updateField(String(key), ($event.target as HTMLSelectElement).value)"
              >
                <option
                  v-for="opt in getSelectOptions(String(key), section.type)"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Number Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'number'"
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <input
                type="number"
                :value="value"
                @input="updateField(String(key), Number(($event.target as HTMLInputElement).value))"
              >
            </div>

            <!-- Textarea Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'textarea'"
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <textarea
                :value="value"
                rows="3"
                @input="updateField(String(key), ($event.target as HTMLTextAreaElement).value)"
              />
            </div>

            <!-- Color/Gradient Field -->
            <div
              v-else-if="getFieldType(String(key), value) === 'color'"
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <input
                type="text"
                :value="value"
                placeholder="Color or gradient..."
                @input="updateField(String(key), ($event.target as HTMLInputElement).value)"
              >
              <div
                v-if="value"
                class="color-preview"
                :style="{ background: value as string }"
              />
            </div>

            <!-- Text Field (default) -->
            <div
              v-else
              class="field-group"
            >
              <label>{{ getFieldLabel(String(key)) }}</label>
              <input
                type="text"
                :value="value"
                @input="updateField(String(key), ($event.target as HTMLInputElement).value)"
              >
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="empty-state"
    >
      <UIcon name="i-lucide-mouse-pointer-click" />
      <p>Select a section to edit its properties</p>
    </div>

    <!-- Smart Image Picker Modal -->
    <SmartImagePicker
      :element="currentImageElement"
      :open="showImagePicker"
      @update:open="showImagePicker = $event"
      @save="handleImageSelect"
      @cancel="showImagePicker = false"
    />

    <!-- Grid Item Editor Modal -->
    <GridItemEditor
      :grid-item="currentGridItem"
      :open="showGridItemEditor"
      @update:open="showGridItemEditor = $event"
      @save="handleGridItemSave"
      @cancel="showGridItemEditor = false"
    />
  </div>
</template>

<style scoped>
.properties-panel {
  width: 320px;
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.2s;
}

.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #e5e5e5;
  color: #111;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Field Groups */
.field-group {
  margin-bottom: 16px;
}

.field-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.field-group input[type="text"],
.field-group input[type="number"],
.field-group input[type="url"],
.field-group textarea,
.field-group select {
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
  color: #333;
  outline: none;
  transition: all 0.15s;
}

.field-group input:focus,
.field-group textarea:focus,
.field-group select:focus {
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.field-group textarea {
  resize: vertical;
  min-height: 60px;
}

/* Checkbox Field */
.checkbox-field label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-field input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #f59e0b;
}

/* Image Field */
.image-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-preview {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #f0f0f0;
}

.image-preview.large {
  height: 120px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Color Preview */
.color-preview {
  height: 32px;
  border-radius: 6px;
  margin-top: 6px;
  border: 1px solid #ddd;
}

/* Array Fields */
.array-field {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
}

.array-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.array-header:hover {
  background: #f0f0f0;
}

.array-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.item-count {
  font-size: 11px;
  font-weight: 500;
  color: #888;
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 99px;
}

.add-item-btn {
  width: 26px;
  height: 26px;
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

.add-item-btn:hover {
  background: #e89209;
}

.array-items {
  border-top: 1px solid #e0e0e0;
  padding: 12px;
}

.array-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.array-item:last-child {
  margin-bottom: 0;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.item-number {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 4px;
}

.item-actions button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}

.item-actions button:hover:not(:disabled) {
  background: #e5e5e5;
  color: #333;
}

.item-actions button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-actions button.delete-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.item-fields {
  padding: 12px;
}

.item-fields .field {
  margin-bottom: 12px;
}

.item-fields .field:last-child {
  margin-bottom: 0;
}

.item-fields .field label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.item-fields .field input,
.item-fields .field textarea,
.item-fields .field select {
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
}

.item-fields .field input:focus,
.item-fields .field textarea:focus,
.item-fields .field select:focus {
  border-color: #f59e0b;
  background: white;
}

.item-fields .image-preview {
  height: 60px;
}

.empty-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px dashed #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}

.empty-add-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
  color: #999;
}

.empty-state .i-lucide-mouse-pointer-click {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 13px;
}

/* Auto-populate bar */
.auto-populate-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.auto-populate-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #92400e;
  font-weight: 500;
}

.auto-populate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f59e0b;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  transition: all 0.15s;
}

.auto-populate-btn:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-1px);
}

.auto-populate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Edit item button */
.edit-item-btn {
  background: #f59e0b !important;
  color: #000 !important;
}

.edit-item-btn:hover {
  background: #d97706 !important;
}

/* Smart image field */
.image-field-smart {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-field-smart.large {
  flex-direction: column;
  align-items: stretch;
}

.image-preview-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}

.image-preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  flex-shrink: 0;
}

.image-preview-large {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  margin-bottom: 8px;
}

.image-preview-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder-large {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  border: 2px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #aaa;
  margin-bottom: 8px;
}

.image-placeholder-large span {
  font-size: 11px;
}

.choose-image-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #8b5cf6;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.choose-image-btn:hover {
  background: #7c3aed;
}

.image-field-smart.large .choose-image-btn {
  width: 100%;
  justify-content: center;
}
</style>
