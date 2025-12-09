<script setup lang="ts">
/**
 * Layers Panel - Tree View for Website Builder
 *
 * Shows hierarchical view of all sections and allows:
 * - Viewing structure at a glance
 * - Selecting sections
 * - Reordering via drag
 * - Deleting sections
 * - Toggling visibility
 */

interface Section {
  id: string
  type: string
  data: Record<string, unknown>
}

defineProps<{
  sections: Section[]
  selectedSectionId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
  delete: [id: string]
  move: [id: string, direction: 'up' | 'down']
  duplicate: [id: string]
}>()

// Collapsed state for sections with nested elements
const collapsedSections = ref<Set<string>>(new Set())

const toggleCollapse = (id: string) => {
  if (collapsedSections.value.has(id)) {
    collapsedSections.value.delete(id)
  } else {
    collapsedSections.value.add(id)
  }
}

// Get icon for section type
const getSectionIcon = (type: string): string => {
  const icons: Record<string, string> = {
    HeroFullWidth: 'i-lucide-layout-template',
    HeroSplit: 'i-lucide-layout-panel-left',
    FeaturedRentals: 'i-lucide-grid-3x3',
    AboutSection: 'i-lucide-user',
    HowItWorks: 'i-lucide-list-ordered',
    GalleryGrid: 'i-lucide-image',
    TestimonialsGrid: 'i-lucide-message-square-quote',
    TrustBadges: 'i-lucide-badge-check',
    CTABanner: 'i-lucide-megaphone',
    FAQAccordion: 'i-lucide-help-circle',
    ContactSection: 'i-lucide-mail',
    FooterSection: 'i-lucide-panel-bottom',
    NavigationBar: 'i-lucide-navigation',
    PricingTable: 'i-lucide-dollar-sign',
    StatsSection: 'i-lucide-bar-chart-3',
    FeaturesGrid: 'i-lucide-sparkles',
    LogoCloud: 'i-lucide-building-2',
    CustomHTML: 'i-lucide-code',
    BentoGrid: 'i-lucide-layout-grid',
    TeamSection: 'i-lucide-users',
    NewsletterSection: 'i-lucide-send',
    BlogCards: 'i-lucide-newspaper'
  }
  return icons[type] || 'i-lucide-square'
}

// Get display label for section
const getSectionLabel = (section: Section): string => {
  // For CustomHTML sections, try to get a friendly label
  if (section.type === 'CustomHTML' && section.data.label) {
    return section.data.label as string
  }
  // Convert type to readable format
  return section.type.replace(/([A-Z])/g, ' $1').trim()
}

// Handle keyboard shortcuts
const handleKeydown = (e: KeyboardEvent, section: Section, _index: number) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()
    emit('delete', section.id)
  } else if (e.key === 'ArrowUp' && e.altKey) {
    e.preventDefault()
    emit('move', section.id, 'up')
  } else if (e.key === 'ArrowDown' && e.altKey) {
    e.preventDefault()
    emit('move', section.id, 'down')
  }
}
</script>

<template>
  <div class="layers-panel">
    <div class="layers-header">
      <h3>
        <UIcon name="i-lucide-layers" />
        <span>Layers</span>
      </h3>
      <span class="layer-count">{{ sections.length }} sections</span>
    </div>

    <div
      v-if="sections.length === 0"
      class="empty-state"
    >
      <UIcon
        name="i-lucide-layers"
        class="empty-icon"
      />
      <p>No sections yet</p>
      <span>Add sections from the left panel</span>
    </div>

    <div
      v-else
      class="layers-tree"
    >
      <div
        v-for="(section, index) in sections"
        :key="section.id"
        class="layer-item"
        :class="{
          'selected': selectedSectionId === section.id,
          'is-first': index === 0,
          'is-last': index === sections.length - 1
        }"
        tabindex="0"
        @click="emit('select', section.id)"
        @keydown="handleKeydown($event, section, index)"
      >
        <div class="layer-row">
          <!-- Expand/Collapse (for future nested elements) -->
          <button
            class="expand-btn"
            @click.stop="toggleCollapse(section.id)"
          >
            <UIcon
              :name="collapsedSections.has(section.id) ? 'i-lucide-chevron-right' : 'i-lucide-chevron-down'"
              class="expand-icon"
            />
          </button>

          <!-- Section Icon -->
          <UIcon
            :name="getSectionIcon(section.type)"
            class="layer-icon"
          />

          <!-- Section Name -->
          <span class="layer-name">{{ getSectionLabel(section) }}</span>

          <!-- Actions -->
          <div class="layer-actions">
            <!-- Move Up -->
            <button
              v-if="index > 0"
              class="action-btn"
              title="Move up (Alt+↑)"
              @click.stop="emit('move', section.id, 'up')"
            >
              <UIcon name="i-lucide-chevron-up" />
            </button>

            <!-- Move Down -->
            <button
              v-if="index < sections.length - 1"
              class="action-btn"
              title="Move down (Alt+↓)"
              @click.stop="emit('move', section.id, 'down')"
            >
              <UIcon name="i-lucide-chevron-down" />
            </button>

            <!-- Duplicate -->
            <button
              class="action-btn"
              title="Duplicate"
              @click.stop="emit('duplicate', section.id)"
            >
              <UIcon name="i-lucide-copy" />
            </button>

            <!-- Delete -->
            <button
              class="action-btn delete"
              title="Delete (Del)"
              @click.stop="emit('delete', section.id)"
            >
              <UIcon name="i-lucide-trash-2" />
            </button>
          </div>
        </div>

        <!-- Section type badge -->
        <div class="layer-meta">
          <span class="type-badge">{{ section.type }}</span>
        </div>
      </div>
    </div>

    <!-- Keyboard hints -->
    <div class="keyboard-hints">
      <span><kbd>Del</kbd> Delete</span>
      <span><kbd>Alt</kbd>+<kbd>↑↓</kbd> Move</span>
    </div>
  </div>
</template>

<style scoped>
.layers-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 15, 20, 0.95);
  border-radius: 12px;
  overflow: hidden;
}

.layers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.layers-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.layer-count {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.15);
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 4px;
}

.empty-state span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.layers-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.layer-item {
  position: relative;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
}

.layer-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}

.layer-item.selected {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.layer-item:focus {
  outline: none;
  border-color: rgba(251, 191, 36, 0.5);
}

.layer-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.15s ease;
}

.expand-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.expand-icon {
  font-size: 12px;
}

.layer-icon {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.layer-item.selected .layer-icon {
  color: #fbbf24;
}

.layer-name {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.layer-item:hover .layer-actions,
.layer-item.selected .layer-actions {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.layer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding-left: 26px;
}

.type-badge {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
}

.keyboard-hints {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}

.keyboard-hints span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.3);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 16px;
  padding: 0 4px;
  font-size: 9px;
  font-family: ui-monospace, monospace;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.5);
}

/* Scrollbar styling */
.layers-tree::-webkit-scrollbar {
  width: 6px;
}

.layers-tree::-webkit-scrollbar-track {
  background: transparent;
}

.layers-tree::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.layers-tree::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
