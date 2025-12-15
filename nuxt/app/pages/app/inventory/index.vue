<script setup lang="ts">
import type { InventoryItem } from '~/composables/useInventory'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const toast = useToast()

const {
  filteredItems,
  stats,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedStatus,
  viewMode,
  sortBy,
  fetchItems,
  deleteItem,
  updateItem
} = useInventory()

// Modal state
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<InventoryItem | null>(null)

// Fetch items on mount
onMounted(() => {
  fetchItems()
})

// Event handlers
const handleEdit = (item: InventoryItem) => {
  // Navigate to detail page for editing
  router.push(`/app/inventory/${item.id}`)
}

const handleDelete = (item: InventoryItem) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await deleteItem(itemToDelete.value.id)
    toast.add({
      title: 'Item Deleted',
      description: `${itemToDelete.value.name} has been removed from inventory.`,
      color: 'success'
    })
  } catch (err) {
    console.error('Delete error:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to delete item. Please try again.',
      color: 'error'
    })
  } finally {
    isDeleteModalOpen.value = false
    itemToDelete.value = null
  }
}

const handleToggleActive = async (item: InventoryItem) => {
  const newStatus = item.status === 'active' ? 'inactive' : 'active'
  try {
    await updateItem(item.id, { status: newStatus })
    toast.add({
      title: 'Status Updated',
      description: `${item.name} is now ${newStatus}.`,
      color: 'success'
    })
    await fetchItems()
  } catch (err) {
    console.error('Update error:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to update item status.',
      color: 'error'
    })
  }
}

// Category options
const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'bounce_house', label: 'Bounce Houses' },
  { value: 'water_slide', label: 'Water Slides' },
  { value: 'obstacle_course', label: 'Obstacle Courses' },
  { value: 'game', label: 'Games' },
  { value: 'combo', label: 'Combos' },
  { value: 'other', label: 'Other' }
]

// Status options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' }
]

// Sort options
const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'utilization', label: 'Utilization' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'newest', label: 'Newest First' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Inventory
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your rental items and units
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        to="/app/inventory/new"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-5 h-5 mr-2"
        />
        Add Item
      </UButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Items
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.total }}
            </p>
            <p class="text-sm text-green-600 dark:text-green-400 mt-2">
              {{ stats.active }} active
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-box"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Units Rented
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.rented }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Currently in use
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-calendar-check"
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Maintenance
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.maintenance }}
            </p>
            <p class="text-sm text-orange-600 dark:text-orange-400 mt-2">
              Needs attention
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-wrench"
              class="w-6 h-6 text-orange-600 dark:text-orange-400"
            />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Utilization
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ stats.avgUtilization }}%
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Fleet efficiency
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-activity"
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Filters and Search -->
    <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            size="lg"
            placeholder="Search items..."
            class="w-full"
          />
        </div>

        <!-- Category Filter -->
        <USelectMenu
          v-model="selectedCategory"
          :options="categories"
          size="lg"
          class="w-full lg:w-48"
        >
          <template #leading>
            <UIcon
              name="i-lucide-tag"
              class="w-4 h-4"
            />
          </template>
        </USelectMenu>

        <!-- Status Filter -->
        <USelectMenu
          v-model="selectedStatus"
          :options="statusOptions"
          size="lg"
          class="w-full lg:w-40"
        >
          <template #leading>
            <UIcon
              name="i-lucide-filter"
              class="w-4 h-4"
            />
          </template>
        </USelectMenu>

        <!-- Sort -->
        <USelectMenu
          v-model="sortBy"
          :options="sortOptions"
          size="lg"
          class="w-full lg:w-48"
        >
          <template #leading>
            <UIcon
              name="i-lucide-arrow-up-down"
              class="w-4 h-4"
            />
          </template>
        </USelectMenu>

        <!-- View Toggle -->
        <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <UButton
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            size="lg"
            icon="i-lucide-layout-grid"
            square
            @click="viewMode = 'grid'"
          />
          <UButton
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            size="lg"
            icon="i-lucide-list"
            square
            @click="viewMode = 'list'"
          />
        </div>
      </div>
    </UCard>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-80"
      />
    </div>

    <!-- Items Grid/List -->
    <div v-else>
      <!-- Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <InventoryItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          view-mode="grid"
          @edit="handleEdit"
          @delete="handleDelete"
          @toggle-active="handleToggleActive"
        />
      </div>

      <!-- List View -->
      <div
        v-else
        class="space-y-4"
      >
        <InventoryItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          view-mode="list"
          @edit="handleEdit"
          @delete="handleDelete"
          @toggle-active="handleToggleActive"
        />
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredItems.length === 0"
        class="text-center py-16"
      >
        <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <UIcon
            name="i-lucide-package-search"
            class="w-10 h-10 text-gray-400 dark:text-gray-600"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first inventory item' }}
        </p>
        <UButton
          v-if="!searchQuery"
          color="primary"
          size="lg"
          to="/app/inventory/new"
        >
          <UIcon
            name="i-lucide-plus"
            class="w-5 h-5 mr-2"
          />
          Add First Item
        </UButton>
        <UButton
          v-else
          color="neutral"
          variant="outline"
          size="lg"
          @click="searchQuery = ''"
        >
          Clear Search
        </UButton>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-trash-2"
                class="w-6 h-6 text-red-600 dark:text-red-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Item
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong>{{ itemToDelete?.name }}</strong>?
            This will permanently remove the item and all associated data.
          </p>

          <div class="flex gap-3 justify-end">
            <UButton
              color="neutral"
              variant="outline"
              @click="isDeleteModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              @click="confirmDelete"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="w-4 h-4 mr-2"
              />
              Delete Item
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
