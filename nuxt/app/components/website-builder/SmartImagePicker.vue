<script setup lang="ts">
/**
 * SmartImagePicker
 *
 * Modal for selecting/uploading images in the website builder.
 * Three tabs: URL, Library (inventory images), Upload
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
const { rentalItems: _rentalItems, loading: loadingItems, getRentalItemImages } = useWebsiteBuilderData()

// Tab state
const activeTab = ref('library')

// URL tab state
const imageUrl = ref('')
const urlError = ref<string | null>(null)

// Upload tab state
const uploadedFile = ref<File | null>(null)
const uploadPreview = ref<string | null>(null)
const isUploading = ref(false)

// Search/filter for library
const librarySearch = ref('')

// Get props reference for watchers
const _props = props

// Selected image
const selectedImage = ref<string | null>(null)

// Initialize when element changes
watch(() => _props.element, (newElement) => {
  if (newElement) {
    imageUrl.value = newElement.currentValue
    selectedImage.value = newElement.currentValue
  }
}, { immediate: true })

// Reset when modal opens
watch(() => _props.open, (isOpen) => {
  if (isOpen && _props.element) {
    imageUrl.value = _props.element.currentValue
    selectedImage.value = _props.element.currentValue
    urlError.value = null
    uploadedFile.value = null
    uploadPreview.value = null
    librarySearch.value = ''
  }
})

/**
 * Tabs configuration
 */
const tabs = [
  {
    key: 'library',
    label: 'Library',
    icon: 'i-lucide-image',
    description: 'Choose from your rental items'
  },
  {
    key: 'url',
    label: 'URL',
    icon: 'i-lucide-link',
    description: 'Paste an image URL'
  },
  {
    key: 'upload',
    label: 'Upload',
    icon: 'i-lucide-upload',
    description: 'Upload from your device'
  }
]

/**
 * Filtered library images
 */
const libraryImages = computed(() => {
  const images = getRentalItemImages()
  if (!librarySearch.value) return images

  const search = librarySearch.value.toLowerCase()
  return images.filter(img =>
    img.name.toLowerCase().includes(search)
    || img.category?.toLowerCase().includes(search)
  )
})

/**
 * Validate URL
 */
const validateUrl = (url: string): boolean => {
  if (!url) {
    urlError.value = 'URL is required'
    return false
  }

  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      urlError.value = 'URL must start with http:// or https://'
      return false
    }

    // Check for common image extensions or patterns
    const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(url)
    const isImageService = /(unsplash|pexels|cloudinary|imgix|bunny|cdn)/i.test(url)

    if (!hasImageExtension && !isImageService) {
      urlError.value = 'Warning: URL may not be a valid image'
      // Still allow it, just warn
    } else {
      urlError.value = null
    }

    return true
  } catch {
    urlError.value = 'Invalid URL format'
    return false
  }
}

/**
 * Handle URL input
 */
const handleUrlInput = () => {
  if (imageUrl.value) {
    validateUrl(imageUrl.value)
    if (!urlError.value || urlError.value.startsWith('Warning')) {
      selectedImage.value = imageUrl.value
    }
  } else {
    urlError.value = null
    selectedImage.value = null
  }
}

/**
 * Handle library image selection
 */
const handleLibrarySelect = (imageUrlValue: string) => {
  selectedImage.value = imageUrlValue
  imageUrl.value = imageUrlValue
}

/**
 * Handle file upload
 */
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    urlError.value = 'File must be an image'
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    urlError.value = 'File size must be under 5MB'
    return
  }

  uploadedFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadPreview.value = e.target?.result as string
    selectedImage.value = uploadPreview.value
  }
  reader.readAsDataURL(file)
}

/**
 * Handle drag and drop
 */
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    uploadedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadPreview.value = e.target?.result as string
      selectedImage.value = uploadPreview.value
    }
    reader.readAsDataURL(file)
  }
}

/**
 * Handle save
 */
const handleSave = async () => {
  if (!_props.element || !selectedImage.value) return

  isUploading.value = true

  try {
    // If it's a data URL from upload, we'd need to upload to server
    // For now, we'll emit the URL/data URL and let parent handle it
    let finalUrl = selectedImage.value

    // If uploaded file, upload to server
    if (uploadedFile.value && uploadPreview.value === selectedImage.value) {
      // Upload to Payload media
      const formData = new FormData()
      formData.append('file', uploadedFile.value)
      formData.append('alt', _props.element.label || 'Website image')

      try {
        const response = await $fetch<{ doc: { url: string } }>('/api/media', {
          method: 'POST',
          body: formData
        })
        finalUrl = response.doc.url
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError)
        // Fall back to data URL for now
        finalUrl = uploadPreview.value
      }
    }

    emit('save', _props.element, finalUrl)
    emit('update:open', false)
  } finally {
    isUploading.value = false
  }
}

/**
 * Handle cancel
 */
const handleCancel = () => {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <UModal
    :open="open"
    :title="`Choose ${element ? formatLabel(element.fieldKey) : 'Image'}`"
    class="image-picker-modal"
    @update:open="emit('update:open', $event)"
  >
    <template #content>
      <div class="p-6 space-y-4">
        <!-- Element info -->
        <div class="flex items-center gap-2">
          <UBadge
            color="secondary"
            variant="subtle"
          >
            <UIcon
              name="i-lucide-image"
              class="mr-1.5"
            />
            Image
          </UBadge>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ element?.label }}
          </span>
        </div>

        <!-- Tabs -->
        <UTabs
          v-model="activeTab"
          :items="tabs"
          class="w-full"
        >
          <template #content="{ item }">
            <div class="pt-4">
              <!-- Library Tab -->
              <div
                v-if="item.key === 'library'"
                class="space-y-4"
              >
                <UInput
                  v-model="librarySearch"
                  placeholder="Search your rental items..."
                  icon="i-lucide-search"
                  class="w-full"
                />

                <div
                  v-if="loadingItems"
                  class="flex items-center justify-center py-8"
                >
                  <UIcon
                    name="i-lucide-loader-circle"
                    class="animate-spin text-2xl text-gray-400"
                  />
                </div>

                <div
                  v-else-if="libraryImages.length === 0"
                  class="text-center py-8 text-gray-500"
                >
                  <UIcon
                    name="i-lucide-image-off"
                    class="text-4xl mb-2"
                  />
                  <p>No images found in your inventory</p>
                </div>

                <div
                  v-else
                  class="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto"
                >
                  <button
                    v-for="img in libraryImages"
                    :key="img.id"
                    class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
                    :class="[
                      selectedImage === img.url
                        ? 'border-purple-500 ring-2 ring-purple-500/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    ]"
                    :title="img.name"
                    @click="handleLibrarySelect(img.url)"
                  >
                    <img
                      :src="img.url"
                      :alt="img.name"
                      class="w-full h-full object-cover"
                    >
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p class="text-xs text-white truncate">
                        {{ img.name }}
                      </p>
                    </div>
                    <div
                      v-if="selectedImage === img.url"
                      class="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <UIcon
                        name="i-lucide-check"
                        class="text-white text-sm"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <!-- URL Tab -->
              <div
                v-else-if="item.key === 'url'"
                class="space-y-4"
              >
                <UFormField
                  label="Image URL"
                  :error="urlError && !urlError.startsWith('Warning') ? urlError : undefined"
                  :hint="urlError?.startsWith('Warning') ? urlError : undefined"
                >
                  <UInput
                    v-model="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    icon="i-lucide-link"
                    class="w-full"
                    @input="handleUrlInput"
                  />
                </UFormField>

                <!-- URL Preview -->
                <div
                  v-if="imageUrl && (!urlError || urlError.startsWith('Warning'))"
                  class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50"
                >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Preview
                  </p>
                  <div class="aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      :src="imageUrl"
                      alt="Preview"
                      class="w-full h-full object-contain"
                      @error="urlError = 'Failed to load image'"
                    >
                  </div>
                </div>
              </div>

              <!-- Upload Tab -->
              <div
                v-else-if="item.key === 'upload'"
                class="space-y-4"
              >
                <div
                  class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
                  :class="[
                    uploadedFile
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  ]"
                  @dragover.prevent
                  @drop="handleDrop"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileChange"
                  >

                  <div
                    v-if="!uploadedFile"
                    class="space-y-3"
                  >
                    <UIcon
                      name="i-lucide-cloud-upload"
                      class="text-4xl text-gray-400"
                    />
                    <p class="text-gray-600 dark:text-gray-400">
                      Drag and drop an image, or
                      <label
                        for="image-upload"
                        class="text-purple-500 hover:text-purple-600 cursor-pointer font-medium"
                      >
                        browse
                      </label>
                    </p>
                    <p class="text-xs text-gray-400">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>

                  <div
                    v-else
                    class="space-y-3"
                  >
                    <div class="aspect-video max-w-xs mx-auto rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        :src="uploadPreview!"
                        alt="Upload preview"
                        class="w-full h-full object-contain"
                      >
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ uploadedFile.name }}
                    </p>
                    <button
                      class="text-sm text-purple-500 hover:text-purple-600"
                      @click="uploadedFile = null; uploadPreview = null; selectedImage = null"
                    >
                      Remove and choose another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>

        <!-- Current selection preview -->
        <div
          v-if="selectedImage"
          class="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
        >
          <div class="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <img
              :src="selectedImage"
              alt="Selected"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-purple-900 dark:text-purple-100">
              Image selected
            </p>
            <p class="text-xs text-purple-600 dark:text-purple-400 truncate">
              {{ selectedImage.length > 50 ? selectedImage.slice(0, 50) + '...' : selectedImage }}
            </p>
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
            label="Apply Image"
            color="secondary"
            :loading="isUploading"
            :disabled="!selectedImage"
            @click="handleSave"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.image-picker-modal :deep(.modal-content) {
  max-width: 600px;
}
</style>
