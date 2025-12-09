<script setup lang="ts">
import type { SearchResult } from '~/composables/useGlobalSearch'

// Note: onClickOutside is auto-imported from @vueuse/nuxt
const isOpen = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(0)

const { searchQuery, isSearching, results, groupedResults, hasResults, performSearch, clearSearch } = useGlobalSearch()

// Handle search input
const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  performSearch(target.value)
  selectedIndex.value = 0
}

// Handle keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter': {
      e.preventDefault()
      const selected = results.value[selectedIndex.value]
      if (selected) {
        navigateToResult(selected)
      }
      break
    }
    case 'Escape':
      e.preventDefault()
      closeSearch()
      break
  }
}

// Navigate to search result
const router = useRouter()
const navigateToResult = (result: SearchResult) => {
  router.push(result.url)
  closeSearch()
}

// Open search
const openSearch = () => {
  isOpen.value = true
  // Initialize with quick actions if no query
  if (!searchQuery.value) {
    performSearch('')
  }
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Close search
const closeSearch = () => {
  isOpen.value = false
  clearSearch()
  selectedIndex.value = 0
}

// Close on click outside
const searchContainerRef = ref<HTMLElement | null>(null)
onClickOutside(searchContainerRef, closeSearch)

// Keyboard shortcut (Cmd+K / Ctrl+K)
onMounted(() => {
  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (isOpen.value) {
        closeSearch()
      } else {
        openSearch()
      }
    }
  }

  window.addEventListener('keydown', handleGlobalKeyDown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeyDown)
  })
})

// Get badge color based on result type
const getBadgeColor = (type: string) => {
  switch (type) {
    case 'navigation':
      return 'neutral'
    case 'booking':
      return 'primary'
    case 'customer':
      return 'success'
    case 'inventory':
      return 'warning'
    default:
      return 'neutral'
  }
}

// Get icon background color based on result type
const getIconBgColor = (type: string) => {
  switch (type) {
    case 'navigation':
      return 'bg-neutral-50 dark:bg-neutral-900/20'
    case 'booking':
      return 'bg-primary-50 dark:bg-primary-900/20'
    case 'customer':
      return 'bg-success-50 dark:bg-success-900/20'
    case 'inventory':
      return 'bg-warning-50 dark:bg-warning-900/20'
    default:
      return 'bg-neutral-50 dark:bg-neutral-900/20'
  }
}

// Get icon color based on result type
const getIconColor = (type: string) => {
  switch (type) {
    case 'navigation':
      return 'text-neutral-600 dark:text-neutral-400'
    case 'booking':
      return 'text-primary-600 dark:text-primary-400'
    case 'customer':
      return 'text-success-600 dark:text-success-400'
    case 'inventory':
      return 'text-warning-600 dark:text-warning-400'
    default:
      return 'text-neutral-600 dark:text-neutral-400'
  }
}

// Format result type label
const formatType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// Detect if Mac
const isMac = computed(() => {
  if (import.meta.client) {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
  return false
})
</script>

<template>
  <div
    ref="searchContainerRef"
    class="relative"
  >
    <!-- Search Trigger Button -->
    <UButton
      color="neutral"
      variant="outline"
      size="lg"
      class="items-center gap-2 min-w-[240px] justify-start text-gray-500 dark:text-gray-400"
      @click="openSearch"
    >
      <UIcon
        name="i-lucide-search"
        class="w-4 h-4"
      />
      <span class="text-sm">Search...</span>
      <UKbd class="ml-auto">
        {{ isMac ? 'Cmd' : 'Ctrl' }}+K
      </UKbd>
    </UButton>

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm z-[100]"
          @click="closeSearch"
        />
      </Transition>

      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="fixed top-[10vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101]"
        >
          <UCard class="shadow-2xl">
            <!-- Search Input -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <UIcon
                name="i-lucide-search"
                class="w-5 h-5 text-gray-400 flex-shrink-0"
              />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Search bookings, customers, inventory, or navigate pages..."
                class="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                @input="handleInput"
                @keydown="handleKeyDown"
              >
              <UButton
                v-if="searchQuery"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-x"
                @click="clearSearch"
              />
            </div>

            <!-- Search Results -->
            <div class="max-h-[60vh] overflow-y-auto">
              <!-- Loading State -->
              <div
                v-if="isSearching"
                class="flex items-center justify-center py-12"
              >
                <UIcon
                  name="i-lucide-loader-circle"
                  class="w-8 h-8 text-gray-400 animate-spin"
                />
              </div>

              <!-- No Results -->
              <div
                v-else-if="searchQuery && !hasResults"
                class="flex flex-col items-center justify-center py-12 px-4 text-center"
              >
                <UIcon
                  name="i-lucide-search-x"
                  class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3"
                />
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  No results found
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Try searching with different keywords
                </p>
              </div>

              <!-- Results List -->
              <div
                v-else-if="hasResults"
                class="py-2"
              >
                <!-- Navigation / Quick Actions -->
                <div
                  v-if="groupedResults.navigation.length > 0"
                  class="mb-4"
                >
                  <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ searchQuery ? 'Pages' : 'Quick Actions' }}
                  </div>
                  <button
                    v-for="result in groupedResults.navigation"
                    :key="result.id"
                    class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    :class="{ 'bg-gray-50 dark:bg-gray-800/50': selectedIndex === results.findIndex((r: SearchResult) => r.id === result.id) }"
                    @click="navigateToResult(result)"
                  >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="getIconBgColor(result.type)"
                    >
                      <UIcon
                        :name="result.icon"
                        class="w-5 h-5"
                        :class="getIconColor(result.type)"
                      />
                    </div>
                    <div class="flex-1 min-w-0 text-left">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ result.title }}</span>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ result.subtitle }}
                      </p>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 text-gray-400 flex-shrink-0 mt-2"
                    />
                  </button>
                </div>

                <!-- Bookings -->
                <div
                  v-if="groupedResults.bookings.length > 0"
                  class="mb-4"
                >
                  <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Bookings
                  </div>
                  <button
                    v-for="result in groupedResults.bookings"
                    :key="result.id"
                    class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    :class="{ 'bg-gray-50 dark:bg-gray-800/50': selectedIndex === results.findIndex((r: SearchResult) => r.id === result.id) }"
                    @click="navigateToResult(result)"
                  >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="getIconBgColor(result.type)"
                    >
                      <UIcon
                        :name="result.icon"
                        class="w-5 h-5"
                        :class="getIconColor(result.type)"
                      />
                    </div>
                    <div class="flex-1 min-w-0 text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ result.title }}</span>
                        <UBadge
                          :color="getBadgeColor(result.type)"
                          variant="subtle"
                          size="xs"
                        >
                          {{ formatType(result.type) }}
                        </UBadge>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        {{ result.subtitle }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ result.metadata }}
                      </p>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 text-gray-400 flex-shrink-0 mt-2"
                    />
                  </button>
                </div>

                <!-- Customers -->
                <div
                  v-if="groupedResults.customers.length > 0"
                  class="mb-4"
                >
                  <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customers
                  </div>
                  <button
                    v-for="result in groupedResults.customers"
                    :key="result.id"
                    class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    :class="{ 'bg-gray-50 dark:bg-gray-800/50': selectedIndex === results.findIndex((r: SearchResult) => r.id === result.id) }"
                    @click="navigateToResult(result)"
                  >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="getIconBgColor(result.type)"
                    >
                      <UIcon
                        :name="result.icon"
                        class="w-5 h-5"
                        :class="getIconColor(result.type)"
                      />
                    </div>
                    <div class="flex-1 min-w-0 text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ result.title }}</span>
                        <UBadge
                          :color="getBadgeColor(result.type)"
                          variant="subtle"
                          size="xs"
                        >
                          {{ formatType(result.type) }}
                        </UBadge>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        {{ result.subtitle }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ result.metadata }}
                      </p>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 text-gray-400 flex-shrink-0 mt-2"
                    />
                  </button>
                </div>

                <!-- Inventory -->
                <div
                  v-if="groupedResults.inventory.length > 0"
                  class="mb-2"
                >
                  <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inventory
                  </div>
                  <button
                    v-for="result in groupedResults.inventory"
                    :key="result.id"
                    class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    :class="{ 'bg-gray-50 dark:bg-gray-800/50': selectedIndex === results.findIndex((r: SearchResult) => r.id === result.id) }"
                    @click="navigateToResult(result)"
                  >
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="getIconBgColor(result.type)"
                    >
                      <UIcon
                        :name="result.icon"
                        class="w-5 h-5"
                        :class="getIconColor(result.type)"
                      />
                    </div>
                    <div class="flex-1 min-w-0 text-left">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ result.title }}</span>
                        <UBadge
                          :color="getBadgeColor(result.type)"
                          variant="subtle"
                          size="xs"
                        >
                          {{ formatType(result.type) }}
                        </UBadge>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        {{ result.subtitle }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ result.metadata }}
                      </p>
                    </div>
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 text-gray-400 flex-shrink-0 mt-2"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1">
                  <UKbd>↑</UKbd>
                  <UKbd>↓</UKbd>
                  <span>to navigate</span>
                </div>
                <div class="flex items-center gap-1">
                  <UKbd>↵</UKbd>
                  <span>to select</span>
                </div>
                <div class="flex items-center gap-1">
                  <UKbd>esc</UKbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
