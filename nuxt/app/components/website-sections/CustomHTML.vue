<script setup lang="ts">
import { sanitizeHTML, sanitizeStylesheet, analyzeHTMLSecurity } from '~/utils/htmlSanitizer'

interface Props {
  data: {
    html: string
    css?: string
    label?: string
  }
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

// Get props reference
const _props = props

const showCodeEditor = ref(false)
const editingHtml = ref('')
const editingCss = ref('')
const editingLabel = ref('')
const securityWarnings = ref<string[]>([])
const showSecurityWarning = ref(false)

const openCodeEditor = () => {
  editingHtml.value = _props.data.html
  editingCss.value = _props.data.css || ''
  editingLabel.value = _props.data.label || 'Custom Block'
  securityWarnings.value = []
  showSecurityWarning.value = false
  showCodeEditor.value = true
}

// Analyze security when HTML changes
const analyzeCurrentCode = () => {
  const analysis = analyzeHTMLSecurity(editingHtml.value)
  securityWarnings.value = analysis.issues
  showSecurityWarning.value = analysis.issues.length > 0
}

// Watch for HTML changes in editor
watch(editingHtml, () => {
  if (editingHtml.value) {
    analyzeCurrentCode()
  }
})

const saveCode = () => {
  // Sanitize HTML before saving
  const sanitizedHtml = sanitizeHTML(editingHtml.value, {
    allowIframes: false,
    allowForms: true
  })

  // Sanitize CSS
  const sanitizedCss = editingCss.value ? sanitizeStylesheet(editingCss.value) : ''

  emit('update', 'html', sanitizedHtml)
  emit('update', 'css', sanitizedCss || '')
  emit('update', 'label', editingLabel.value)
  showCodeEditor.value = false
}

const cancelEdit = () => {
  showCodeEditor.value = false
}

// Sanitized HTML for display (double protection)
const sanitizedDisplayHtml = computed(() => {
  if (!_props.data.html) return ''
  return sanitizeHTML(_props.data.html, {
    allowIframes: false,
    allowForms: true
  })
})

// Inject scoped CSS (sanitized)
const scopedStyles = computed(() => {
  if (!_props.data.css) return ''
  return sanitizeStylesheet(_props.data.css) || ''
})

// Generate unique ID for scoping
const scopeId = `custom-${Math.random().toString(36).substr(2, 9)}`

// Toast for preview link feedback
const toast = useToast()

// Intercept link clicks in preview mode to prevent 404s
// Also handle interactive elements like mobile menu toggle
const handleContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  // Handle mobile menu toggle button
  const mobileToggle = target.closest('[data-mobile-toggle]')
  if (mobileToggle) {
    event.preventDefault()
    event.stopPropagation()
    const nav = mobileToggle.closest('.navigation-bar')
    if (nav) {
      nav.classList.toggle('menu-open')
    }
    return
  }

  // Handle links
  const link = target.closest('a')
  if (link) {
    const href = link.getAttribute('href')

    // Only intercept internal links (not external URLs)
    if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      event.preventDefault()
      event.stopPropagation()

      // Show toast feedback that this is a preview
      toast.add({
        title: 'Preview Mode',
        description: `Link "${href}" will work on your published website`,
        icon: 'i-lucide-info',
        color: 'info'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    }
  }
}
</script>

<template>
  <section
    class="custom-html-section"
    :data-scope="scopeId"
  >
    <!-- Edit Mode Overlay -->
    <div
      v-if="editable && !data.html"
      class="empty-state"
      @click="openCodeEditor"
    >
      <div class="empty-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <h3>Custom HTML Block</h3>
        <p>Paste HTML from Tailwind UI, Shuffle.dev, or write your own</p>
        <button class="paste-btn">
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
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect
              width="8"
              height="4"
              x="8"
              y="2"
              rx="1"
              ry="1"
            />
          </svg>
          Click to Add HTML
        </button>
      </div>
    </div>

    <!-- Rendered HTML Content -->
    <div
      v-else
      class="html-content"
      :class="{ 'edit-mode': editable }"
    >
      <!-- Edit Button Overlay -->
      <button
        v-if="editable"
        class="edit-code-btn"
        @click.stop="openCodeEditor"
      >
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
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        Edit Code
      </button>

      <!-- Render the SANITIZED HTML (with click interception for preview mode) -->
      <div
        @click="handleContentClick"
        v-html="sanitizedDisplayHtml"
      />

      <!-- Inject custom CSS -->
      <component
        :is="'style'"
        v-if="data.css"
      >
        {{ scopedStyles }}
      </component>
    </div>

    <!-- Code Editor Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCodeEditor"
          class="code-editor-overlay"
          @click.self="cancelEdit"
        >
          <div class="code-editor-modal">
            <div class="modal-header">
              <div class="header-left">
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
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <input
                  v-model="editingLabel"
                  type="text"
                  class="label-input"
                  placeholder="Block name..."
                >
              </div>
              <button
                class="close-btn"
                @click="cancelEdit"
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

            <div class="modal-body">
              <!-- Security Warning Banner -->
              <div
                v-if="showSecurityWarning"
                class="security-warning"
              >
                <div class="warning-icon">
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M12 8v4" /><path d="M12 16h.01" />
                  </svg>
                </div>
                <div class="warning-content">
                  <strong>Security Notice:</strong> The following will be automatically removed for safety:
                  <ul>
                    <li
                      v-for="warning in securityWarnings"
                      :key="warning"
                    >
                      {{ warning }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="editor-tabs">
                <div class="tab-group">
                  <span class="tab active">HTML</span>
                </div>
                <div class="tab-hint">
                  Paste code from <strong>Tailwind UI</strong>, <strong>Shuffle.dev</strong>, or any HTML
                </div>
              </div>

              <div class="editor-container">
                <textarea
                  v-model="editingHtml"
                  class="code-textarea html-editor"
                  placeholder="<!-- Paste your HTML here -->

<section class='py-24 bg-white'>
  <div class='max-w-7xl mx-auto px-4'>
    <h2 class='text-3xl font-bold'>Your content here</h2>
  </div>
</section>"
                  spellcheck="false"
                />
              </div>

              <div
                class="editor-tabs"
                style="margin-top: 16px;"
              >
                <div class="tab-group">
                  <span class="tab">Custom CSS (Optional)</span>
                </div>
              </div>

              <div class="editor-container small">
                <textarea
                  v-model="editingCss"
                  class="code-textarea css-editor"
                  placeholder="/* Add custom styles if needed */
.my-custom-class {
  color: #333;
}"
                  spellcheck="false"
                />
              </div>
            </div>

            <div class="modal-footer">
              <div class="footer-hint">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                  /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                Tailwind CSS classes are supported. Include any inline styles or custom CSS above.
              </div>
              <div class="footer-actions">
                <button
                  class="btn-cancel"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
                <button
                  class="btn-save"
                  @click="saveCode"
                >
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Block
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.custom-html-section {
  position: relative;
  min-height: 100px;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  margin: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-state:hover {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.empty-content {
  text-align: center;
  color: #64748b;
}

.empty-content svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state:hover .empty-content svg {
  color: #f59e0b;
  opacity: 1;
}

.empty-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 8px;
}

.empty-content p {
  font-size: 14px;
  margin-bottom: 20px;
  max-width: 280px;
}

.paste-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #111;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.paste-btn:hover {
  background: #333;
  transform: translateY(-1px);
}

/* HTML Content */
.html-content {
  position: relative;
}

.html-content.edit-mode {
  outline: 2px dashed transparent;
  outline-offset: -2px;
  transition: outline-color 0.15s;
}

.html-content.edit-mode:hover {
  outline-color: #f59e0b;
}

.edit-code-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  z-index: 100;
  opacity: 0;
  transition: all 0.15s;
  backdrop-filter: blur(8px);
}

.html-content.edit-mode:hover .edit-code-btn {
  opacity: 1;
}

.edit-code-btn:hover {
  background: rgba(0, 0, 0, 0.95);
}

/* Code Editor Modal */
.code-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
  backdrop-filter: blur(4px);
}

.code-editor-modal {
  background: #1e1e1e;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f59e0b;
}

.label-input {
  background: transparent;
  border: none;
  color: #e5e5e5;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  width: 300px;
}

.label-input::placeholder {
  color: #666;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #888;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: #3c3c3c;
  color: #fff;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.editor-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tab-group {
  display: flex;
  gap: 4px;
}

.tab {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  background: #2d2d2d;
  border-radius: 6px;
}

.tab.active {
  color: #f59e0b;
  background: #3c3c3c;
}

.tab-hint {
  font-size: 12px;
  color: #666;
}

.tab-hint strong {
  color: #888;
}

.editor-container {
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
}

.editor-container.small {
  max-height: 120px;
}

.code-textarea {
  width: 100%;
  min-height: 300px;
  padding: 16px;
  background: #1e1e1e;
  border: none;
  color: #d4d4d4;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.editor-container.small .code-textarea {
  min-height: 100px;
}

.code-textarea::placeholder {
  color: #555;
}

.code-textarea:focus {
  background: #252526;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #252526;
  border-top: 1px solid #3c3c3c;
}

.footer-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #3c3c3c;
  color: #888;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #3c3c3c;
  color: #fff;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f59e0b;
  border: none;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-save:hover {
  background: #fbbf24;
}

/* Security Warning */
.security-warning {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  margin-bottom: 16px;
}

.warning-icon {
  flex-shrink: 0;
  color: #ef4444;
}

.warning-content {
  font-size: 13px;
  color: #fca5a5;
  line-height: 1.5;
}

.warning-content strong {
  color: #f87171;
}

.warning-content ul {
  margin: 6px 0 0 0;
  padding-left: 18px;
}

.warning-content li {
  color: #fca5a5;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .code-editor-modal,
.modal-leave-to .code-editor-modal {
  transform: scale(0.95) translateY(20px);
}
</style>
