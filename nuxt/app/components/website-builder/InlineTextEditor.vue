<script setup lang="ts">
/**
 * InlineTextEditor
 *
 * Modal for editing text and heading content in the website builder.
 * Supports plain text and basic formatting options.
 */
import type { EditableElement } from '~/composables/useContentDetection'

interface Props {
  element: EditableElement | null
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'save': [element: EditableElement, newValue: string]
  'cancel': []
}>()

const { formatLabel } = useContentDetection()

// Editing state
const editedValue = ref('')
const isSaving = ref(false)

// Initialize when element changes
watch(() => props.element, (newElement) => {
  if (newElement) {
    editedValue.value = newElement.currentValue
  }
}, { immediate: true })

// Reset when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen && props.element) {
    editedValue.value = props.element.currentValue
  }
})

/**
 * Handle save
 */
const handleSave = () => {
  if (!props.element) return
  if (editedValue.value.trim() === '') return

  isSaving.value = true

  try {
    emit('save', props.element, editedValue.value)
    emit('update:open', false)
  } finally {
    isSaving.value = false
  }
}

/**
 * Handle cancel
 */
const handleCancel = () => {
  editedValue.value = props.element?.currentValue || ''
  emit('cancel')
  emit('update:open', false)
}

/**
 * Get icon based on element type
 */
const elementIcon = computed(() => {
  if (!props.element) return 'i-lucide-type'

  const icons: Record<string, string> = {
    heading: 'i-lucide-heading',
    text: 'i-lucide-type',
    button: 'i-lucide-mouse-pointer-click'
  }
  return icons[props.element.type] || 'i-lucide-type'
})

/**
 * Get color based on element type
 */
const elementColor = computed(() => {
  if (!props.element) return 'primary'

  const colors: Record<string, string> = {
    heading: 'blue',
    text: 'neutral',
    button: 'amber'
  }
  return colors[props.element.type] || 'primary'
})

/**
 * Check if element is a heading
 */
const isHeading = computed(() => props.element?.type === 'heading')

/**
 * Character count info
 */
const charInfo = computed(() => {
  const current = editedValue.value.length
  const max = props.element?.constraints?.maxLength

  if (!max) return null

  return {
    current,
    max,
    remaining: max - current,
    isNearLimit: (max - current) < 20,
    isOverLimit: current > max
  }
})

/**
 * Validation state
 */
const isValid = computed(() => {
  if (!props.element) return false
  if (editedValue.value.trim() === '') return false
  if (charInfo.value?.isOverLimit) return false
  return true
})
</script>

<template>
  <UModal
    :open="open"
    :title="`Edit ${element ? formatLabel(element.fieldKey) : 'Text'}`"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div class="p-6 space-y-4">
        <!-- Element info badge -->
        <div class="flex items-center gap-2">
          <UBadge
            :color="elementColor"
            variant="subtle"
          >
            <UIcon
              :name="elementIcon"
              class="mr-1.5"
            />
            {{ element?.type ? formatLabel(element.type) : 'Text' }}
          </UBadge>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ element?.label }}
          </span>
        </div>

        <!-- Text input -->
        <UFormField
          :label="isHeading ? 'Heading Text' : 'Content'"
          :required="element?.constraints?.required"
          :error="charInfo?.isOverLimit ? `Exceeds ${charInfo.max} character limit` : undefined"
        >
          <!-- Use textarea for longer text, input for headings -->
          <UTextarea
            v-if="!isHeading"
            v-model="editedValue"
            :rows="4"
            :placeholder="`Enter ${element?.label?.toLowerCase() || 'text'}...`"
            class="w-full font-mono"
            autofocus
          />
          <UInput
            v-else
            v-model="editedValue"
            :placeholder="`Enter ${element?.label?.toLowerCase() || 'heading'}...`"
            class="w-full text-lg"
            autofocus
          />
        </UFormField>

        <!-- Character count -->
        <div
          v-if="charInfo"
          class="flex justify-end text-xs"
          :class="[
            charInfo.isOverLimit
              ? 'text-red-500'
              : charInfo.isNearLimit
                ? 'text-amber-500'
                : 'text-gray-400'
          ]"
        >
          {{ charInfo.current }} / {{ charInfo.max }} characters
        </div>

        <!-- Preview -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Preview
          </p>
          <component
            :is="isHeading ? 'h2' : 'p'"
            :class="[
              isHeading
                ? 'text-xl font-bold text-gray-900 dark:text-white'
                : 'text-base text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ editedValue || '(empty)' }}
          </component>
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
            label="Save Changes"
            :color="elementColor"
            :loading="isSaving"
            :disabled="!isValid"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
