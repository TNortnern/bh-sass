<script setup lang="ts">
/**
 * GridItemEditor
 *
 * Modal for editing all fields of a grid item (card) at once.
 * Shows image, title, description, price, etc. in one cohesive form.
 */
import type { GridItemMap, EditableElement } from '~/composables/useContentDetection'

interface Props {
  gridItem: GridItemMap | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [gridItem: GridItemMap, updates: Record<string, string>]
  'cancel': []
}>()

const { formatLabel, getTypeIcon: _getTypeIcon, getTypeColor: _getTypeColor } = useContentDetection()
const { getRentalItemImages: _getRentalItemImages } = useWebsiteBuilderData()

// Form state - holds all editable field values
const formState = ref<Record<string, string>>({})

// Image picker state
const showImagePicker = ref(false)
const currentImageField = ref<EditableElement | null>(null)

// Initialize form when gridItem changes
watch(() => props.gridItem, (item) => {
  if (item) {
    const state: Record<string, string> = {}
    if (item.fields.image) state.image = item.fields.image.currentValue
    if (item.fields.title) state.title = item.fields.title.currentValue
    if (item.fields.description) state.description = item.fields.description.currentValue
    if (item.fields.category) state.category = item.fields.category.currentValue
    if (item.fields.price) state.price = item.fields.price.currentValue
    if (item.fields.link) state.link = item.fields.link.currentValue
    formState.value = state
  }
}, { immediate: true })

// Reset when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen && props.gridItem) {
    const state: Record<string, string> = {}
    if (props.gridItem.fields.image) state.image = props.gridItem.fields.image.currentValue
    if (props.gridItem.fields.title) state.title = props.gridItem.fields.title.currentValue
    if (props.gridItem.fields.description) state.description = props.gridItem.fields.description.currentValue
    if (props.gridItem.fields.category) state.category = props.gridItem.fields.category.currentValue
    if (props.gridItem.fields.price) state.price = props.gridItem.fields.price.currentValue
    if (props.gridItem.fields.link) state.link = props.gridItem.fields.link.currentValue
    formState.value = state
  }
})

/**
 * Open image picker for image field
 */
const openImagePicker = () => {
  if (props.gridItem?.fields.image) {
    currentImageField.value = props.gridItem.fields.image
    showImagePicker.value = true
  }
}

/**
 * Handle image selection from picker
 */
const handleImageSelect = (element: EditableElement, newValue: string) => {
  formState.value.image = newValue
  showImagePicker.value = false
}

/**
 * Handle save
 */
const handleSave = () => {
  if (!props.gridItem) return
  emit('save', props.gridItem, { ...formState.value })
  emit('update:open', false)
}

/**
 * Handle cancel
 */
const handleCancel = () => {
  emit('cancel')
  emit('update:open', false)
}

/**
 * Get field count
 */
const fieldCount = computed(() => {
  if (!props.gridItem) return 0
  return Object.keys(props.gridItem.fields).length
})
</script>

<template>
  <UModal
    :open="open"
    :title="gridItem?.label || 'Edit Grid Item'"
    class="grid-item-editor-modal"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div class="p-6 space-y-5">
        <!-- Header with item indicator -->
        <div class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <UIcon
              name="i-lucide-layout-grid"
              class="text-orange-600 dark:text-orange-400 text-xl"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ gridItem?.label || 'Grid Item' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Edit all {{ fieldCount }} fields for this item
            </p>
          </div>
        </div>

        <!-- Image field (if exists) -->
        <div
          v-if="gridItem?.fields.image"
          class="space-y-2"
        >
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <div class="flex gap-3 items-start">
            <div
              class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600"
            >
              <img
                v-if="formState.image"
                :src="formState.image"
                alt="Item image"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <UIcon
                  name="i-lucide-image"
                  class="text-2xl"
                />
              </div>
            </div>
            <div class="flex-1 space-y-2">
              <UButton
                label="Choose Image"
                icon="i-lucide-image"
                color="neutral"
                variant="outline"
                size="sm"
                @click="openImagePicker"
              />
              <p class="text-xs text-gray-500">
                Select from library or upload
              </p>
            </div>
          </div>
        </div>

        <!-- Title field -->
        <UFormField
          v-if="gridItem?.fields.title"
          :label="formatLabel(gridItem.fields.title.fieldKey)"
          :required="gridItem.fields.title.constraints?.required"
        >
          <UInput
            v-model="formState.title"
            :placeholder="`Enter ${formatLabel(gridItem.fields.title.fieldKey).toLowerCase()}...`"
            class="w-full"
          />
        </UFormField>

        <!-- Description field -->
        <UFormField
          v-if="gridItem?.fields.description"
          :label="formatLabel(gridItem.fields.description.fieldKey)"
        >
          <UTextarea
            v-model="formState.description"
            :rows="2"
            :placeholder="`Enter ${formatLabel(gridItem.fields.description.fieldKey).toLowerCase()}...`"
            class="w-full"
          />
        </UFormField>

        <!-- Category field -->
        <UFormField
          v-if="gridItem?.fields.category"
          :label="formatLabel(gridItem.fields.category.fieldKey)"
        >
          <UInput
            v-model="formState.category"
            :placeholder="'e.g., Bounce House, Water Slide'"
            class="w-full"
          />
        </UFormField>

        <!-- Price field -->
        <UFormField
          v-if="gridItem?.fields.price"
          :label="formatLabel(gridItem.fields.price.fieldKey)"
        >
          <UInput
            v-model="formState.price"
            :placeholder="'e.g., $199/day'"
            icon="i-lucide-dollar-sign"
            class="w-full"
          />
        </UFormField>

        <!-- Link field -->
        <UFormField
          v-if="gridItem?.fields.link"
          :label="formatLabel(gridItem.fields.link.fieldKey)"
        >
          <UInput
            v-model="formState.link"
            :placeholder="'/rentals/item-slug'"
            icon="i-lucide-link"
            class="w-full"
          />
        </UFormField>

        <!-- Live Preview Card -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Live Preview
          </p>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden max-w-xs">
            <!-- Preview image -->
            <div
              v-if="gridItem?.fields.image"
              class="aspect-video bg-gray-100 dark:bg-gray-700"
            >
              <img
                v-if="formState.image"
                :src="formState.image"
                alt="Preview"
                class="w-full h-full object-cover"
              >
            </div>
            <!-- Preview content -->
            <div class="p-3 space-y-1">
              <p
                v-if="formState.category"
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                {{ formState.category }}
              </p>
              <h4 class="font-semibold text-gray-900 dark:text-white text-sm">
                {{ formState.title || '(No title)' }}
              </h4>
              <p
                v-if="formState.description"
                class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2"
              >
                {{ formState.description }}
              </p>
              <p
                v-if="formState.price"
                class="text-sm font-bold text-primary-600 dark:text-primary-400"
              >
                {{ formState.price }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="handleCancel"
          />
          <UButton
            label="Save All Changes"
            color="warning"
            icon="i-lucide-check"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- Nested Image Picker -->
  <SmartImagePicker
    :element="currentImageField"
    :open="showImagePicker"
    @update:open="showImagePicker = $event"
    @save="handleImageSelect"
  />
</template>

<style scoped>
.grid-item-editor-modal :deep(.modal-content) {
  max-width: 500px;
}
</style>
