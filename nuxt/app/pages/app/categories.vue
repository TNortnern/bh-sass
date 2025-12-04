<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
    <!-- Header -->
    <div class="px-6 lg:px-12 pt-8 lg:pt-10 pb-6 lg:pb-8 border-b border-gray-200 dark:border-[#1a1a1a] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-[#0f0f0f] dark:to-[#0a0a0a]">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div class="flex-1">
          <h1 class="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            Categories
          </h1>
          <p class="text-sm lg:text-base text-gray-600 dark:text-[#888] tracking-wide">
            Organize your rental inventory into categories
          </p>
        </div>
        <UButton
          icon="i-lucide-plus"
          label="Add Category"
          color="primary"
          @click="openCreateModal"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 lg:px-12 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!categories?.length"
        class="flex flex-col items-center justify-center py-16 text-gray-500"
      >
        <UIcon name="i-lucide-folder-tree" class="text-6xl mb-4 text-gray-300" />
        <p class="text-lg font-medium">No Categories Yet</p>
        <p class="text-sm mb-6 text-center max-w-sm">
          Create categories to organize your rental items and make it easier for customers to browse.
        </p>
        <UButton icon="i-lucide-plus" label="Add First Category" @click="openCreateModal" />
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in sortedCategories"
          :key="category.id"
          class="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <!-- Category Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05]"
              >
                <UIcon
                  :name="category.icon || 'i-lucide-folder'"
                  class="w-6 h-6 text-gray-600 dark:text-gray-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ category.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ category.itemCount || 0 }} items
                </p>
              </div>
            </div>
            <UBadge
              :label="category.isActive ? 'Active' : 'Inactive'"
              :color="category.isActive ? 'success' : 'neutral'"
              variant="subtle"
            />
          </div>

          <!-- Description -->
          <p
            v-if="category.description"
            class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
          >
            {{ category.description }}
          </p>

          <!-- Sort Order -->
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <UIcon name="i-lucide-arrow-up-down" class="w-4 h-4" />
            <span>Sort Order: {{ category.sortOrder }}</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-[#1a1a1a]">
            <UButton
              icon="i-lucide-pencil"
              label="Edit"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="openEditModal(category)"
            />
            <UButton
              icon="i-lucide-trash-2"
              label="Delete"
              color="error"
              variant="ghost"
              size="sm"
              @click="openDeleteModal(category)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model:open="isModalOpen" :title="isEditing ? 'Edit Category' : 'Create Category'">
      <template #body>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <UFormField label="Name" required>
            <UInput v-model="formData.name" placeholder="e.g., Bounce Houses" class="w-full" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="formData.description"
              placeholder="Brief description of this category"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Icon">
            <IconPicker v-model="formData.icon" variant="categories" />
          </UFormField>

          <UFormField label="Sort Order" help="Lower numbers appear first">
            <UInput
              v-model.number="formData.sortOrder"
              type="number"
              placeholder="0"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Status">
            <UCheckbox v-model="formData.isActive" label="Active" />
          </UFormField>
        </form>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
          <UButton
            :label="isEditing ? 'Update' : 'Create'"
            color="primary"
            :loading="isSaving"
            @click="saveCategory"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen" title="Delete Category">
      <template #body>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
            >
              <UIcon name="i-lucide-trash-2" class="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold">Confirm Deletion</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete
            <strong>{{ categoryToDelete?.name }}</strong>?
          </p>
          <p v-if="categoryToDelete?.itemCount > 0" class="text-sm text-amber-600 dark:text-amber-400">
            Warning: This category has {{ categoryToDelete.itemCount }} item(s). They will need to be
            recategorized.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="isDeleteModalOpen = false"
          />
          <UButton
            label="Delete"
            color="error"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: any
  sortOrder: number
  isActive: boolean
  itemCount?: number
  createdAt: string
  updatedAt: string
}

const { fetchCollection, createDocument, updateDocument, deleteDocument } = usePayloadApi()
const toast = useToast()

// State
const pending = ref(false)
const categories = ref<Category[]>([])
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Form data
const formData = ref({
  name: '',
  description: '',
  icon: '',
  sortOrder: 0,
  isActive: true,
})

const editingId = ref<string | null>(null)

// Computed
const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => a.sortOrder - b.sortOrder)
})

// Methods
async function fetchCategories() {
  try {
    pending.value = true
    const response = await fetchCollection<Category>('categories', {
      limit: 100,
      sort: 'sortOrder',
    })
    categories.value = response.docs
  } catch (error) {
    console.error('Error fetching categories:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load categories',
      color: 'error',
    })
  } finally {
    pending.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    name: '',
    description: '',
    icon: '',
    sortOrder: categories.value.length,
    isActive: true,
  }
  isModalOpen.value = true
}

function openEditModal(category: Category) {
  isEditing.value = true
  editingId.value = category.id
  formData.value = {
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  }
  isModalOpen.value = true
}

function openDeleteModal(category: Category) {
  categoryToDelete.value = category
  isDeleteModalOpen.value = true
}

async function saveCategory() {
  try {
    isSaving.value = true

    if (isEditing.value && editingId.value) {
      // Update existing category
      await updateDocument('categories', editingId.value, formData.value)
      toast.add({
        title: 'Success',
        description: 'Category updated successfully',
        color: 'success',
      })
    } else {
      // Create new category
      await createDocument('categories', formData.value)
      toast.add({
        title: 'Success',
        description: 'Category created successfully',
        color: 'success',
      })
    }

    isModalOpen.value = false
    await fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to save category',
      color: 'error',
    })
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete() {
  if (!categoryToDelete.value) return

  try {
    isDeleting.value = true
    await deleteDocument('categories', categoryToDelete.value.id)
    toast.add({
      title: 'Success',
      description: 'Category deleted successfully',
      color: 'success',
    })
    isDeleteModalOpen.value = false
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to delete category',
      color: 'error',
    })
  } finally {
    isDeleting.value = false
  }
}

// Load categories on mount
onMounted(() => {
  fetchCategories()
})
</script>
