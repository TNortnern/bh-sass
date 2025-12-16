<script setup lang="ts">
/**
 * Website Builder Page Manager Panel
 * Enhanced page management with predefined templates and SEO settings
 */

interface WebsitePage {
  id: string
  name: string
  slug: string
  sections: unknown[]
  isHome?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
}

const props = defineProps<{
  pages: WebsitePage[]
  currentPageId: string
}>()

const emit = defineEmits<{
  switchPage: [pageId: string]
  addPage: [page: Partial<WebsitePage>]
  deletePage: [pageId: string]
  updatePage: [pageId: string, updates: Partial<WebsitePage>]
}>()

// Predefined page templates
const pageTemplates = [
  { id: 'home', name: 'Home', slug: '/', icon: 'i-lucide-home', description: 'Main landing page' },
  { id: 'about', name: 'About Us', slug: '/about', icon: 'i-lucide-users', description: 'Tell your story' },
  { id: 'contact', name: 'Contact', slug: '/contact', icon: 'i-lucide-mail', description: 'Contact information' },
  { id: 'products', name: 'Products', slug: '/products', icon: 'i-lucide-package', description: 'Browse rentals', special: true },
  { id: 'terms', name: 'Terms & Conditions', slug: '/terms-and-conditions', icon: 'i-lucide-file-text', description: 'Legal terms' },
  { id: 'waiver', name: 'Waiver', slug: '/waiver', icon: 'i-lucide-shield-check', description: 'Liability waiver', special: true },
  { id: 'checkout', name: 'Checkout', slug: '/checkout', icon: 'i-lucide-credit-card', description: 'Booking checkout', special: true },
  { id: 'success', name: 'Checkout Success', slug: '/checkout-success', icon: 'i-lucide-check-circle', description: 'Order confirmation', special: true }
]

// Check which predefined pages already exist
const existingPageSlugs = computed(() => props.pages.map(p => p.slug))

const availableTemplates = computed(() =>
  pageTemplates.filter(t => !existingPageSlugs.value.includes(t.slug))
)

// UI State
const showAddPageModal = ref(false)
const showEditPageModal = ref(false)
const editingPage = ref<WebsitePage | null>(null)
const newPageName = ref('')
const newPageSlug = ref('')
const _selectedTemplate = ref<typeof pageTemplates[0] | null>(null)

// SEO fields for editing
const seoTitle = ref('')
const seoDescription = ref('')
const seoKeywords = ref('')

// Open edit modal for a page
const openEditModal = (page: WebsitePage) => {
  editingPage.value = page
  seoTitle.value = page.seo?.title || page.name
  seoDescription.value = page.seo?.description || ''
  seoKeywords.value = page.seo?.keywords || ''
  showEditPageModal.value = true
}

// Save page edits
const savePageEdits = () => {
  if (!editingPage.value) return

  emit('updatePage', editingPage.value.id, {
    seo: {
      title: seoTitle.value,
      description: seoDescription.value,
      keywords: seoKeywords.value
    }
  })

  showEditPageModal.value = false
  editingPage.value = null
}

// Add page from template
const addFromTemplate = (template: typeof pageTemplates[0]) => {
  emit('addPage', {
    id: `${template.id}-${Date.now()}`,
    name: template.name,
    slug: template.slug,
    sections: [],
    isHome: template.slug === '/',
    seo: {
      title: template.name,
      description: template.description
    }
  })
  showAddPageModal.value = false
}

// Add custom page
const addCustomPage = () => {
  if (!newPageName.value.trim()) return

  const slug = newPageSlug.value.trim()
    || '/' + newPageName.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  emit('addPage', {
    id: `custom-${Date.now()}`,
    name: newPageName.value.trim(),
    slug,
    sections: [],
    seo: {
      title: newPageName.value.trim()
    }
  })

  newPageName.value = ''
  newPageSlug.value = ''
  showAddPageModal.value = false
}

// Generate slug from name
watch(newPageName, (name) => {
  if (name && !newPageSlug.value) {
    newPageSlug.value = '/' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }
})
</script>

<template>
  <div class="page-manager">
    <!-- Pages List -->
    <div class="pages-list">
      <div class="list-header">
        <h4>Website Pages</h4>
        <span class="page-count">{{ pages.length }}</span>
      </div>

      <div class="pages-scroll">
        <button
          v-for="page in pages"
          :key="page.id"
          class="page-item"
          :class="{ active: currentPageId === page.id }"
          @click="emit('switchPage', page.id)"
        >
          <UIcon
            :name="page.isHome ? 'i-lucide-home' : 'i-lucide-file'"
            class="page-icon"
          />
          <div class="page-info">
            <span class="page-name">{{ page.name }}</span>
            <span class="page-slug">{{ page.slug }}</span>
          </div>
          <div class="page-actions">
            <button
              class="action-btn"
              title="Edit page settings"
              @click.stop="openEditModal(page)"
            >
              <UIcon name="i-lucide-settings" />
            </button>
            <button
              v-if="!page.isHome"
              class="action-btn delete"
              title="Delete page"
              @click.stop="emit('deletePage', page.id)"
            >
              <UIcon name="i-lucide-trash-2" />
            </button>
          </div>
        </button>
      </div>

      <button
        class="add-page-btn"
        @click="showAddPageModal = true"
      >
        <UIcon name="i-lucide-plus" />
        Add Page
      </button>
    </div>

    <!-- Add Page Modal -->
    <UModal
      v-model:open="showAddPageModal"
      :title="'Add New Page'"
    >
      <template #body>
        <div class="add-page-content">
          <!-- Predefined Templates -->
          <div
            v-if="availableTemplates.length > 0"
            class="templates-section"
          >
            <h5>Quick Add</h5>
            <p class="section-hint">
              Add common pages with pre-configured settings
            </p>

            <div class="template-grid">
              <button
                v-for="template in availableTemplates"
                :key="template.id"
                class="template-btn"
                :class="{ special: template.special }"
                @click="addFromTemplate(template)"
              >
                <UIcon
                  :name="template.icon"
                  class="template-icon"
                />
                <span class="template-name">{{ template.name }}</span>
                <span
                  v-if="template.special"
                  class="special-badge"
                >
                  <UIcon name="i-lucide-zap" />
                </span>
              </button>
            </div>
          </div>

          <div class="divider">
            <span>or create custom</span>
          </div>

          <!-- Custom Page Form -->
          <div class="custom-page-form">
            <div class="form-group">
              <label>Page Name</label>
              <UInput
                v-model="newPageName"
                placeholder="e.g., Gallery, FAQ, Services"
              />
            </div>
            <div class="form-group">
              <label>URL Slug</label>
              <UInput
                v-model="newPageSlug"
                placeholder="/gallery"
              />
            </div>
            <UButton
              block
              :disabled="!newPageName.trim()"
              @click="addCustomPage"
            >
              Create Page
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Page Modal -->
    <UModal
      v-model:open="showEditPageModal"
      :title="'Page Settings: ' + (editingPage?.name || '')"
    >
      <template #body>
        <div class="edit-page-content">
          <div class="form-group">
            <label>SEO Title</label>
            <UInput
              v-model="seoTitle"
              placeholder="Page title for search engines"
            />
            <span class="char-count">{{ seoTitle.length }}/60</span>
          </div>

          <div class="form-group">
            <label>SEO Description</label>
            <UTextarea
              v-model="seoDescription"
              placeholder="Brief description for search engines..."
              :rows="3"
            />
            <span class="char-count">{{ seoDescription.length }}/160</span>
          </div>

          <div class="form-group">
            <label>Keywords</label>
            <UInput
              v-model="seoKeywords"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </template>
      <template #footer="{ close }">
        <div class="modal-footer-btns">
          <UButton
            color="neutral"
            variant="ghost"
            @click="close"
          >
            Cancel
          </UButton>
          <UButton @click="savePageEdits">
            Save Changes
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.page-manager {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pages-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.list-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.page-count {
  font-size: 12px;
  font-weight: 500;
  color: #888;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 99px;
}

.pages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.page-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.page-item:hover {
  background: #f5f5f5;
}

.page-item.active {
  background: #fff8eb;
  border-color: #f59e0b;
}

.page-icon {
  font-size: 16px;
  color: #888;
  flex-shrink: 0;
}

.page-item.active .page-icon {
  color: #f59e0b;
}

.page-info {
  flex: 1;
  min-width: 0;
}

.page-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-slug {
  display: block;
  font-size: 11px;
  color: #888;
  font-family: monospace;
}

.page-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.page-item:hover .page-actions {
  opacity: 1;
}

.action-btn {
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
}

.add-page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 8px;
  padding: 12px;
  background: #f8f8f8;
  border: 1px dashed #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.add-page-btn:hover {
  background: #f0f0f0;
  border-color: #f59e0b;
  color: #f59e0b;
}

/* Add Page Modal */
.add-page-content {
  padding: 8px 0;
}

.templates-section h5 {
  font-size: 14px;
  font-weight: 600;
  color: #111;
  margin: 0 0 4px 0;
}

.section-hint {
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.template-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.template-btn:hover {
  background: #fff8eb;
  border-color: #f59e0b;
}

.template-btn.special {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-color: #fcd34d;
}

.template-btn.special:hover {
  border-color: #f59e0b;
}

.template-icon {
  font-size: 20px;
  color: #666;
}

.template-btn:hover .template-icon {
  color: #f59e0b;
}

.template-name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.special-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 10px;
  color: #f59e0b;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: #888;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.custom-page-form .form-group {
  margin-bottom: 16px;
}

.custom-page-form label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

/* Edit Page Modal */
.edit-page-content .form-group {
  margin-bottom: 20px;
  position: relative;
}

.edit-page-content label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.char-count {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 10px;
  color: #999;
}

.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
