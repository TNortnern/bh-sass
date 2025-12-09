<script setup lang="ts">
interface Props {
  modelValue: string
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
  'close': []
}>()

const showPicker = computed({
  get: () => props.open,
  set: (val: boolean) => {
    emit('update:open', val)
    if (!val) emit('close')
  }
})
const searchQuery = ref('')
const customUrl = ref('')

// Curated stock images for party rental businesses
const stockImages = [
  // Party/Celebration
  { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80', category: 'party', label: 'Colorful Balloons' },
  { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80', category: 'party', label: 'Confetti Celebration' },
  { url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80', category: 'party', label: 'Party Decorations' },
  { url: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1200&q=80', category: 'party', label: 'Backyard Party' },
  { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80', category: 'party', label: 'Kids Party' },

  // Kids/Family
  { url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1200&q=80', category: 'kids', label: 'Kids Playing' },
  { url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200&q=80', category: 'kids', label: 'Water Fun' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', category: 'kids', label: 'Bouncy Castle' },
  { url: 'https://images.unsplash.com/photo-1567448400858-f9cdf0fde66c?w=1200&q=80', category: 'kids', label: 'Party Setup' },

  // Business/Team
  { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80', category: 'business', label: 'Team/Family' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80', category: 'business', label: 'Team Working' },

  // Outdoor/Events
  { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80', category: 'events', label: 'Festival Crowd' },
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80', category: 'events', label: 'Conference' },
  { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80', category: 'events', label: 'Presentation' },

  // Gradients/Patterns
  { url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23f59e0b"/%3E%3Cstop offset="100%25" stop-color="%23ea580c"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="400" height="300"/%3E%3C/svg%3E', category: 'gradient', label: 'Orange Gradient' },
  { url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%233b82f6"/%3E%3Cstop offset="100%25" stop-color="%231d4ed8"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="400" height="300"/%3E%3C/svg%3E', category: 'gradient', label: 'Blue Gradient' },
  { url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%2310b981"/%3E%3Cstop offset="100%25" stop-color="%23059669"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="400" height="300"/%3E%3C/svg%3E', category: 'gradient', label: 'Green Gradient' },
  { url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%238b5cf6"/%3E%3Cstop offset="100%25" stop-color="%236d28d9"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="400" height="300"/%3E%3C/svg%3E', category: 'gradient', label: 'Purple Gradient' }
]

const categories = ['all', 'party', 'kids', 'business', 'events', 'gradient']
const selectedCategory = ref('all')

const filteredImages = computed(() => {
  return stockImages.filter((img) => {
    const matchesCategory = selectedCategory.value === 'all' || img.category === selectedCategory.value
    const matchesSearch = !searchQuery.value || img.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const selectImage = (url: string) => {
  emit('update:modelValue', url)
  showPicker.value = false
}

const applyCustomUrl = () => {
  if (customUrl.value) {
    emit('update:modelValue', customUrl.value)
    showPicker.value = false
    customUrl.value = ''
  }
}
</script>

<template>
  <!-- Image Picker Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showPicker"
        class="picker-overlay"
        @click.self="showPicker = false"
      >
        <div class="picker-modal">
          <div class="picker-header">
            <h3>Choose Image</h3>
            <button
              class="close-btn"
              @click="showPicker = false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="picker-controls">
            <div class="search-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search images..."
              >
            </div>

            <div class="category-tabs">
              <button
                v-for="cat in categories"
                :key="cat"
                class="category-tab"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
              </button>
            </div>
          </div>

          <div class="picker-body">
            <div class="custom-url-section">
              <label>Or enter a custom URL:</label>
              <div class="custom-url-input">
                <input
                  v-model="customUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                >
                <button
                  class="apply-btn"
                  :disabled="!customUrl"
                  @click="applyCustomUrl"
                >
                  Apply
                </button>
              </div>
            </div>

            <div class="image-grid">
              <button
                v-for="img in filteredImages"
                :key="img.url"
                class="image-option"
                :class="{ selected: modelValue === img.url }"
                @click="selectImage(img.url)"
              >
                <img
                  :src="img.url"
                  :alt="img.label"
                >
                <span class="image-label">{{ img.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Styles */
.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
}

.picker-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.picker-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111;
}

.picker-controls {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 8px;
}

.search-box svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 6px 14px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.category-tab:hover {
  background: #e5e7eb;
  color: #374151;
}

.category-tab.active {
  background: #111;
  color: white;
}

.picker-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.custom-url-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.custom-url-section label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.custom-url-input {
  display: flex;
  gap: 8px;
}

.custom-url-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

.custom-url-input input:focus {
  border-color: #f59e0b;
}

.apply-btn {
  padding: 10px 20px;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  transition: background 0.15s;
}

.apply-btn:hover:not(:disabled) {
  background: #d97706;
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.image-option {
  position: relative;
  aspect-ratio: 4/3;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
  background: #f3f4f6;
  padding: 0;
}

.image-option:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.image-option.selected {
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
}

.image-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  font-size: 11px;
  font-weight: 500;
  text-align: left;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .picker-modal,
.modal-leave-active .picker-modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .picker-modal,
.modal-leave-to .picker-modal {
  transform: scale(0.95);
}

@media (max-width: 640px) {
  .picker-modal {
    max-height: 95vh;
    border-radius: 12px 12px 0 0;
    margin-top: auto;
  }

  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
