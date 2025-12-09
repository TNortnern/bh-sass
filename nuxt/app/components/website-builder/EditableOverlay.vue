<script setup lang="ts">
/**
 * EditableOverlay
 *
 * Hover detection layer that shows which elements are editable in a section.
 * Displays type badges and quick-edit buttons on hover.
 */
import type { EditableElement, GridItemMap, ContentMap } from '~/composables/useContentDetection'

interface Props {
  contentMap: ContentMap
  isActive: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  editElement: [element: EditableElement]
  editGridItem: [gridItem: GridItemMap]
}>()

const { getTypeIcon, getTypeColor } = useContentDetection()

// Hover state
const hoveredElement = ref<EditableElement | null>(null)
const hoveredGridItem = ref<GridItemMap | null>(null)
const overlayPosition = ref({ top: 0, left: 0, width: 0, height: 0 })

// Container ref for position calculations
const containerRef = ref<HTMLElement | null>(null)

/**
 * Calculate overlay position from DOM element
 */
const updateOverlayPosition = (selector: string) => {
  if (!containerRef.value) return

  const container = containerRef.value.closest('[data-section-id]') as HTMLElement
  if (!container) return

  const element = container.querySelector(selector) as HTMLElement
  if (!element) return

  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  overlayPosition.value = {
    top: elementRect.top - containerRect.top,
    left: elementRect.left - containerRect.left,
    width: elementRect.width,
    height: elementRect.height
  }
}

/**
 * Handle element hover
 */
const handleElementHover = (element: EditableElement) => {
  hoveredElement.value = element
  hoveredGridItem.value = null
  updateOverlayPosition(element.selector)
}

/**
 * Handle grid item hover
 */
const handleGridItemHover = (gridItem: GridItemMap) => {
  hoveredGridItem.value = gridItem
  hoveredElement.value = null
  updateOverlayPosition(gridItem.selector)
}

/**
 * Handle mouse leave
 */
const handleMouseLeave = () => {
  hoveredElement.value = null
  hoveredGridItem.value = null
}

/**
 * Handle element edit click
 */
const handleEditClick = (e: MouseEvent) => {
  e.stopPropagation()
  if (hoveredElement.value) {
    emit('editElement', hoveredElement.value)
  } else if (hoveredGridItem.value) {
    emit('editGridItem', hoveredGridItem.value)
  }
}

/**
 * Get display label for current hover target
 */
const currentLabel = computed(() => {
  if (hoveredElement.value) {
    return hoveredElement.value.label
  }
  if (hoveredGridItem.value) {
    return hoveredGridItem.value.label
  }
  return ''
})

/**
 * Get icon for current hover target
 */
const currentIcon = computed(() => {
  if (hoveredElement.value) {
    return getTypeIcon(hoveredElement.value.type)
  }
  if (hoveredGridItem.value) {
    return 'i-lucide-layout-grid'
  }
  return 'i-lucide-edit'
})

/**
 * Get color for current hover target
 */
const currentColor = computed(() => {
  if (hoveredElement.value) {
    return getTypeColor(hoveredElement.value.type)
  }
  return 'amber'
})

const isHovering = computed(() => hoveredElement.value !== null || hoveredGridItem.value !== null)
</script>

<template>
  <div
    v-if="isActive"
    ref="containerRef"
    class="editable-overlay"
    @mouseleave="handleMouseLeave"
  >
    <!-- Invisible hit areas for each editable element -->
    <template
      v-for="element in contentMap.elements"
      :key="element.id"
    >
      <div
        class="hit-area"
        :class="`hit-area--${element.type}`"
        :data-element-id="element.id"
        @mouseenter="handleElementHover(element)"
      />
    </template>

    <!-- Invisible hit areas for grid items -->
    <template
      v-for="gridItem in contentMap.gridItems"
      :key="`grid-${gridItem.index}`"
    >
      <div
        class="hit-area hit-area--grid"
        :data-grid-index="gridItem.index"
        @mouseenter="handleGridItemHover(gridItem)"
      />
    </template>

    <!-- Hover highlight overlay -->
    <Transition name="fade">
      <div
        v-if="isHovering"
        class="hover-highlight"
        :class="`hover-highlight--${currentColor}`"
        :style="{
          top: `${overlayPosition.top}px`,
          left: `${overlayPosition.left}px`,
          width: `${overlayPosition.width}px`,
          height: `${overlayPosition.height}px`
        }"
      >
        <!-- Type badge -->
        <div
          class="hover-badge"
          :class="`hover-badge--${currentColor}`"
        >
          <UIcon
            :name="currentIcon"
            class="badge-icon"
          />
          <span class="badge-label">{{ currentLabel }}</span>
        </div>

        <!-- Edit button -->
        <button
          class="edit-btn"
          :class="`edit-btn--${currentColor}`"
          title="Click to edit"
          @click="handleEditClick"
        >
          <UIcon name="i-lucide-pencil" />
        </button>

        <!-- Grid item indicator -->
        <div
          v-if="hoveredGridItem"
          class="grid-fields-hint"
        >
          <span
            v-if="hoveredGridItem.fields.image"
            class="field-hint"
          >
            <UIcon name="i-lucide-image" /> Image
          </span>
          <span
            v-if="hoveredGridItem.fields.title"
            class="field-hint"
          >
            <UIcon name="i-lucide-type" /> Title
          </span>
          <span
            v-if="hoveredGridItem.fields.price"
            class="field-hint"
          >
            <UIcon name="i-lucide-dollar-sign" /> Price
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.editable-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.hit-area {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.hit-area:hover {
  background-color: rgba(245, 158, 11, 0.05);
}

.hover-highlight {
  position: absolute;
  border: 2px solid;
  border-radius: 6px;
  pointer-events: auto;
  transition: all 0.15s ease;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 6px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.hover-highlight--amber {
  border-color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.hover-highlight--blue {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.hover-highlight--purple {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
}

.hover-highlight--green {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.hover-highlight--slate {
  border-color: #64748b;
  background-color: rgba(100, 116, 139, 0.1);
}

.hover-highlight--orange {
  border-color: #f97316;
  background-color: rgba(249, 115, 22, 0.1);
}

.hover-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  pointer-events: none;
  white-space: nowrap;
}

.hover-badge--amber {
  background: #f59e0b;
  color: #000;
}

.hover-badge--blue {
  background: #3b82f6;
  color: #fff;
}

.hover-badge--purple {
  background: #8b5cf6;
  color: #fff;
}

.hover-badge--green {
  background: #10b981;
  color: #fff;
}

.hover-badge--slate {
  background: #64748b;
  color: #fff;
}

.hover-badge--orange {
  background: #f97316;
  color: #fff;
}

.badge-icon {
  width: 12px;
  height: 12px;
}

.badge-label {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn--amber {
  border-color: #f59e0b;
  color: #f59e0b;
}

.edit-btn--amber:hover {
  background: #f59e0b;
  color: white;
  transform: scale(1.05);
}

.edit-btn--blue {
  border-color: #3b82f6;
  color: #3b82f6;
}

.edit-btn--blue:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.edit-btn--purple {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.edit-btn--purple:hover {
  background: #8b5cf6;
  color: white;
  transform: scale(1.05);
}

.edit-btn--green {
  border-color: #10b981;
  color: #10b981;
}

.edit-btn--green:hover {
  background: #10b981;
  color: white;
  transform: scale(1.05);
}

.edit-btn--slate {
  border-color: #64748b;
  color: #64748b;
}

.edit-btn--slate:hover {
  background: #64748b;
  color: white;
  transform: scale(1.05);
}

.edit-btn--orange {
  border-color: #f97316;
  color: #f97316;
}

.edit-btn--orange:hover {
  background: #f97316;
  color: white;
  transform: scale(1.05);
}

.grid-fields-hint {
  position: absolute;
  bottom: 6px;
  left: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.field-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  border-radius: 3px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
