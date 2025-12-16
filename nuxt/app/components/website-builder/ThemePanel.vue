<script setup lang="ts">
/**
 * Website Builder Theme Panel
 * Allows customizing colors, fonts, and adding custom CSS
 */

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  customCss: string
}

const _props = defineProps<{
  theme: ThemeSettings
}>()

const emit = defineEmits<{
  update: [field: keyof ThemeSettings, value: string]
}>()

// Color presets for quick selection
const colorPresets = [
  { name: 'Vibrant Orange', primary: '#f59e0b', secondary: '#3b82f6', accent: '#10b981' },
  { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#6366f1', accent: '#14b8a6' },
  { name: 'Forest Green', primary: '#22c55e', secondary: '#84cc16', accent: '#f59e0b' },
  { name: 'Royal Purple', primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4' },
  { name: 'Elegant Dark', primary: '#fbbf24', secondary: '#a78bfa', accent: '#34d399' },
  { name: 'Coral Reef', primary: '#f43f5e', secondary: '#fb923c', accent: '#a855f7' }
]

// Font options
const fontOptions = [
  { label: 'System Default', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Inter', value: '\'Inter\', sans-serif' },
  { label: 'Poppins', value: '\'Poppins\', sans-serif' },
  { label: 'Roboto', value: '\'Roboto\', sans-serif' },
  { label: 'Open Sans', value: '\'Open Sans\', sans-serif' },
  { label: 'Lato', value: '\'Lato\', sans-serif' },
  { label: 'Montserrat', value: '\'Montserrat\', sans-serif' },
  { label: 'Playfair Display', value: '\'Playfair Display\', serif' },
  { label: 'Georgia', value: 'Georgia, serif' }
]

const applyPreset = (preset: typeof colorPresets[0]) => {
  emit('update', 'primaryColor', preset.primary)
  emit('update', 'secondaryColor', preset.secondary)
  emit('update', 'accentColor', preset.accent)
}

// Expand/collapse sections
const expandedSections = ref({
  colors: true,
  fonts: true,
  customCss: false
})

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}
</script>

<template>
  <div class="theme-panel">
    <div class="panel-header">
      <h3>
        <UIcon name="i-lucide-palette" />
        Theme & Styling
      </h3>
    </div>

    <!-- Color Presets -->
    <div class="section">
      <button
        class="section-header"
        @click="toggleSection('colors')"
      >
        <span>Color Scheme</span>
        <UIcon :name="expandedSections.colors ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      </button>

      <div
        v-if="expandedSections.colors"
        class="section-content"
      >
        <!-- Quick Presets -->
        <div class="presets-grid">
          <button
            v-for="preset in colorPresets"
            :key="preset.name"
            class="preset-btn"
            :title="preset.name"
            @click="applyPreset(preset)"
          >
            <div class="preset-colors">
              <span
                class="color-dot"
                :style="{ backgroundColor: preset.primary }"
              />
              <span
                class="color-dot"
                :style="{ backgroundColor: preset.secondary }"
              />
              <span
                class="color-dot"
                :style="{ backgroundColor: preset.accent }"
              />
            </div>
            <span class="preset-name">{{ preset.name }}</span>
          </button>
        </div>

        <!-- Individual Colors -->
        <div class="color-inputs">
          <div class="color-input-group">
            <label>Primary Color</label>
            <div class="color-input-wrapper">
              <input
                type="color"
                :value="theme.primaryColor"
                @input="emit('update', 'primaryColor', ($event.target as HTMLInputElement).value)"
              >
              <input
                type="text"
                :value="theme.primaryColor"
                placeholder="#f59e0b"
                @input="emit('update', 'primaryColor', ($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>

          <div class="color-input-group">
            <label>Secondary Color</label>
            <div class="color-input-wrapper">
              <input
                type="color"
                :value="theme.secondaryColor"
                @input="emit('update', 'secondaryColor', ($event.target as HTMLInputElement).value)"
              >
              <input
                type="text"
                :value="theme.secondaryColor"
                placeholder="#3b82f6"
                @input="emit('update', 'secondaryColor', ($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>

          <div class="color-input-group">
            <label>Accent Color</label>
            <div class="color-input-wrapper">
              <input
                type="color"
                :value="theme.accentColor"
                @input="emit('update', 'accentColor', ($event.target as HTMLInputElement).value)"
              >
              <input
                type="text"
                :value="theme.accentColor"
                placeholder="#10b981"
                @input="emit('update', 'accentColor', ($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>

          <div class="color-input-group">
            <label>Background Color</label>
            <div class="color-input-wrapper">
              <input
                type="color"
                :value="theme.backgroundColor"
                @input="emit('update', 'backgroundColor', ($event.target as HTMLInputElement).value)"
              >
              <input
                type="text"
                :value="theme.backgroundColor"
                placeholder="#ffffff"
                @input="emit('update', 'backgroundColor', ($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>

          <div class="color-input-group">
            <label>Text Color</label>
            <div class="color-input-wrapper">
              <input
                type="color"
                :value="theme.textColor"
                @input="emit('update', 'textColor', ($event.target as HTMLInputElement).value)"
              >
              <input
                type="text"
                :value="theme.textColor"
                placeholder="#111111"
                @input="emit('update', 'textColor', ($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="section">
      <button
        class="section-header"
        @click="toggleSection('fonts')"
      >
        <span>Typography</span>
        <UIcon :name="expandedSections.fonts ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      </button>

      <div
        v-if="expandedSections.fonts"
        class="section-content"
      >
        <div class="form-group">
          <label>Font Family</label>
          <USelect
            :model-value="theme.fontFamily"
            :items="fontOptions"
            placeholder="Select font..."
            @update:model-value="emit('update', 'fontFamily', $event as string)"
          />
        </div>

        <div class="font-preview">
          <p :style="{ fontFamily: theme.fontFamily }">
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </div>

    <!-- Custom CSS -->
    <div class="section">
      <button
        class="section-header"
        @click="toggleSection('customCss')"
      >
        <span>
          <UIcon
            name="i-lucide-code"
            class="inline mr-1"
          />
          Custom CSS
        </span>
        <UIcon :name="expandedSections.customCss ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
      </button>

      <div
        v-if="expandedSections.customCss"
        class="section-content"
      >
        <p class="css-hint">
          Add custom CSS to fine-tune your design. Use <code>.site-content</code> as the root selector.
        </p>
        <textarea
          :value="theme.customCss"
          placeholder=".site-content h1 {
  font-size: 3rem;
}

.site-content .hero {
  background: linear-gradient(...);
}"
          rows="10"
          class="css-editor"
          @input="emit('update', 'customCss', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-panel {
  height: 100%;
  overflow-y: auto;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.section {
  border-bottom: 1px solid #e0e0e0;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: transparent;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
}

.section-header:hover {
  background: #f5f5f5;
}

.section-content {
  padding: 0 20px 16px;
}

/* Color Presets */
.presets-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.preset-btn:hover {
  border-color: #f59e0b;
  background: #fff8eb;
}

.preset-colors {
  display: flex;
  gap: 3px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.preset-name {
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

/* Color Inputs */
.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-input-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input-wrapper input[type="color"] {
  width: 36px;
  height: 36px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
}

.color-input-wrapper input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-family: monospace;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f8f8;
}

.color-input-wrapper input[type="text"]:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
}

/* Typography */
.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  margin-bottom: 6px;
}

.font-preview {
  margin-top: 12px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  text-align: center;
}

.font-preview p {
  margin: 0;
  font-size: 14px;
  color: #333;
}

/* Custom CSS */
.css-hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.css-hint code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.css-editor {
  width: 100%;
  padding: 12px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 12px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  border-radius: 8px;
  resize: vertical;
  min-height: 200px;
}

.css-editor::placeholder {
  color: #666;
}

.css-editor:focus {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}
</style>
