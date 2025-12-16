<script setup lang="ts">
/**
 * Embed Layout with Color Customization
 *
 * Supports query parameters for theming:
 * - theme: 'light' | 'dark' | 'auto'
 * - primaryColor: Hex color (e.g., 'f97316' without #)
 * - borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
 */
const route = useRoute()

// Parse color from query params
const primaryColor = computed(() => {
  const color = route.query.primaryColor as string
  if (color && /^[0-9a-fA-F]{6}$/.test(color)) {
    return `#${color}`
  }
  return null
})

// Border radius setting
const borderRadius = computed(() => {
  const radius = route.query.borderRadius as string
  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
  return radiusMap[radius] || radiusMap.lg
})

// Generate HSL values from hex for better color manipulation
function hexToHSL(hex: string): { h: number, s: number, l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// CSS custom properties for theming
const cssVariables = computed(() => {
  if (!primaryColor.value) return {}

  const hsl = hexToHSL(primaryColor.value)

  return {
    '--embed-primary': primaryColor.value,
    '--embed-primary-h': hsl.h,
    '--embed-primary-s': `${hsl.s}%`,
    '--embed-primary-l': `${hsl.l}%`,
    '--embed-primary-light': `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(95, hsl.l + 35)}%)`,
    '--embed-primary-dark': `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(20, hsl.l - 15)}%)`,
    '--embed-radius': borderRadius.value
  }
})
</script>

<template>
  <div
    class="embed-layout min-h-screen bg-transparent"
    :style="cssVariables"
  >
    <slot />
  </div>
</template>

<style scoped>
.embed-layout {
  /* Clean layout for embedding - no headers, footers, or chrome */
  isolation: isolate;
}

/* Allow transparent background for iframe embedding */
:deep(body) {
  background: transparent;
}
</style>

<style>
/* Global embed theming - only applies when CSS variables are set */
.embed-layout {
  /* Default to orange if no custom color */
  --embed-primary: #f97316;
  --embed-primary-h: 25;
  --embed-primary-s: 95%;
  --embed-primary-l: 53%;
  --embed-primary-light: #fed7aa;
  --embed-primary-dark: #c2410c;
  --embed-radius: 12px;
}

/* Override Tailwind orange classes when custom color is set */
.embed-layout .text-orange-600 {
  color: var(--embed-primary) !important;
}

.embed-layout .text-orange-500 {
  color: var(--embed-primary) !important;
}

.embed-layout .text-orange-400 {
  color: var(--embed-primary) !important;
}

.embed-layout .bg-orange-600 {
  background-color: var(--embed-primary) !important;
}

.embed-layout .bg-orange-500 {
  background-color: var(--embed-primary) !important;
}

.embed-layout .bg-orange-100 {
  background-color: var(--embed-primary-light) !important;
}

.embed-layout .dark .bg-orange-900\/30 {
  background-color: hsl(var(--embed-primary-h), var(--embed-primary-s), 20%) !important;
}

.embed-layout .border-orange-500 {
  border-color: var(--embed-primary) !important;
}

.embed-layout .hover\:text-orange-600:hover {
  color: var(--embed-primary) !important;
}

.embed-layout .dark .hover\:text-orange-400:hover {
  color: var(--embed-primary) !important;
}

.embed-layout .group-hover\:text-orange-600 {
  --tw-text-opacity: 1;
}

.embed-layout .group:hover .group-hover\:text-orange-600 {
  color: var(--embed-primary) !important;
}

.embed-layout .group:hover .group-hover\:text-orange-400 {
  color: var(--embed-primary) !important;
}

/* Border radius overrides */
.embed-layout .rounded-lg {
  border-radius: var(--embed-radius) !important;
}

.embed-layout .rounded-xl {
  border-radius: calc(var(--embed-radius) + 4px) !important;
}
</style>
