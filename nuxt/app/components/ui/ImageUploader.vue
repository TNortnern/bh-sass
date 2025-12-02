<script setup lang="ts">
/**
 * Reusable Image Uploader Component
 * Supports file picker and URL input with Bunny CDN upload
 */

const props = defineProps<{
  modelValue: string[]
  maxImages?: number
  folder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const showUrlModal = ref(false)
const urlInput = ref('')

const images = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

const maxImagesAllowed = computed(() => props.maxImages || 10)
const canAddMore = computed(() => images.value.length < maxImagesAllowed.value)

// Open file picker
const openFilePicker = () => {
  if (!canAddMore.value) {
    toast.add({
      title: 'Limit Reached',
      description: `Maximum ${maxImagesAllowed.value} images allowed`,
      color: 'warning'
    })
    return
  }
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files || files.length === 0) return

  const remainingSlots = maxImagesAllowed.value - images.value.length
  const filesToUpload = Array.from(files).slice(0, remainingSlots)

  for (const file of filesToUpload) {
    await uploadFile(file)
  }

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Upload file to Bunny CDN
const uploadFile = async (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.add({
      title: 'Invalid File',
      description: 'Please select an image file',
      color: 'error'
    })
    return
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.add({
      title: 'File Too Large',
      description: 'Maximum file size is 10MB',
      color: 'error'
    })
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success && response.url) {
      images.value = [...images.value, response.url]
      toast.add({
        title: 'Upload Complete',
        description: 'Image uploaded successfully',
        color: 'success'
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    toast.add({
      title: 'Upload Failed',
      description: error.data?.message || 'Failed to upload image',
      color: 'error'
    })
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

const isUploadingUrl = ref(false)

// Add image from URL - downloads and re-uploads to Bunny CDN
const addImageFromUrl = async () => {
  const url = urlInput.value.trim()

  if (!url) {
    toast.add({
      title: 'Invalid URL',
      description: 'Please enter a valid URL',
      color: 'error'
    })
    return
  }

  // Basic URL validation
  try {
    new URL(url)
  } catch {
    toast.add({
      title: 'Invalid URL',
      description: 'Please enter a valid URL',
      color: 'error'
    })
    return
  }

  if (!canAddMore.value) {
    toast.add({
      title: 'Limit Reached',
      description: `Maximum ${maxImagesAllowed.value} images allowed`,
      color: 'warning'
    })
    return
  }

  isUploadingUrl.value = true

  try {
    // Download and re-upload to Bunny CDN
    const response = await $fetch<{ success: boolean; url: string; message?: string }>('/api/upload-from-url', {
      method: 'POST',
      body: { url }
    })

    if (response.success && response.url) {
      images.value = [...images.value, response.url]
      urlInput.value = ''
      showUrlModal.value = false

      toast.add({
        title: 'Image Added',
        description: response.message || 'Image uploaded to CDN successfully',
        color: 'success'
      })
    }
  } catch (error: any) {
    console.error('URL upload error:', error)
    toast.add({
      title: 'Upload Failed',
      description: error.data?.message || 'Failed to upload image from URL',
      color: 'error'
    })
  } finally {
    isUploadingUrl.value = false
  }
}

// Remove image
const removeImage = (index: number) => {
  const newImages = [...images.value]
  newImages.splice(index, 1)
  images.value = newImages
}

// Reorder images (drag and drop could be added later)
const moveImage = (from: number, to: number) => {
  const newImages = [...images.value]
  const [removed] = newImages.splice(from, 1)
  newImages.splice(to, 0, removed)
  images.value = newImages
}
</script>

<template>
  <div class="space-y-4">
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Image Grid -->
    <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative aspect-video rounded-lg overflow-hidden group bg-gray-100 dark:bg-gray-800"
      >
        <img
          :src="image"
          :alt="`Image ${index + 1}`"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Error'"
        />

        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <!-- Move left -->
          <UButton
            v-if="index > 0"
            color="neutral"
            variant="solid"
            size="xs"
            icon="i-lucide-chevron-left"
            square
            @click="moveImage(index, index - 1)"
          />

          <!-- Remove -->
          <UButton
            color="error"
            variant="solid"
            size="xs"
            icon="i-lucide-trash-2"
            square
            @click="removeImage(index)"
          />

          <!-- Move right -->
          <UButton
            v-if="index < images.length - 1"
            color="neutral"
            variant="solid"
            size="xs"
            icon="i-lucide-chevron-right"
            square
            @click="moveImage(index, index + 1)"
          />
        </div>

        <!-- Primary badge for first image -->
        <div
          v-if="index === 0"
          class="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded"
        >
          Primary
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="flex gap-3">
      <!-- File Upload Button -->
      <button
        type="button"
        :disabled="!canAddMore || isUploading"
        class="flex-1 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="openFilePicker"
      >
        <div class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon
              v-if="isUploading"
              name="i-lucide-loader-2"
              class="w-6 h-6 text-orange-500 animate-spin"
            />
            <UIcon
              v-else
              name="i-lucide-upload"
              class="w-6 h-6 text-gray-500 dark:text-gray-400"
            />
          </div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ isUploading ? 'Uploading...' : 'Upload Images' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Click to select files
          </p>
        </div>
      </button>

      <!-- URL Input Button -->
      <button
        type="button"
        :disabled="!canAddMore"
        class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-orange-400 dark:hover:border-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="showUrlModal = true"
      >
        <div class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <UIcon name="i-lucide-link" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Add URL</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Paste image link</p>
        </div>
      </button>
    </div>

    <!-- Image count -->
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      {{ images.length }} / {{ maxImagesAllowed }} images
    </p>

    <!-- URL Modal -->
    <UModal v-model:open="showUrlModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add Image from URL
          </h3>

          <UFormField label="Image URL" class="mb-6">
            <UInput
              v-model="urlInput"
              placeholder="https://example.com/image.jpg"
              icon="i-lucide-link"
              size="lg"
              class="w-full"
              @keyup.enter="addImageFromUrl"
            />
          </UFormField>

          <!-- Preview -->
          <div v-if="urlInput" class="mb-6">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
            <div class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                :src="urlInput"
                alt="Preview"
                class="w-full h-full object-cover"
                @error="($event.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Invalid+URL'"
              />
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              :disabled="isUploadingUrl"
              @click="showUrlModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="isUploadingUrl"
              @click="addImageFromUrl"
            >
              {{ isUploadingUrl ? 'Uploading to CDN...' : 'Add Image' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
