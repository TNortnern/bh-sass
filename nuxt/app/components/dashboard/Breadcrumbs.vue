<script setup lang="ts">
const route = useRoute()

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

const props = defineProps<{
  items?: BreadcrumbItem[]
  showHome?: boolean
}>()

// Generate breadcrumbs from route path if not provided
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  // Use provided items if available
  if (props.items && props.items.length > 0) {
    return props.items
  }

  // Otherwise, generate from route
  const crumbs: BreadcrumbItem[] = []

  // Add home/dashboard
  if (props.showHome !== false) {
    crumbs.push({
      label: 'Dashboard',
      to: '/app',
      icon: 'i-lucide-home'
    })
  }

  // Parse route path
  const segments = route.path.split('/').filter(Boolean)
  let currentPath = ''

  // Skip 'app' segment as we already have Dashboard
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    const crumb: BreadcrumbItem = {
      label: formatSegment(segment),
      to: `/app${currentPath}`
    }

    // Don't add link to the last segment (current page)
    if (i === segments.length - 1) {
      delete crumb.to
    }

    crumbs.push(crumb)
  }

  return crumbs
})

// Format segment to human-readable label
function formatSegment(segment: string | undefined): string {
  if (!segment) return ''

  // Handle UUIDs or numeric IDs (show as "Details")
  if (segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) {
    return 'Details'
  }

  // Handle special cases
  const specialCases: Record<string, string> = {
    new: 'New',
    edit: 'Edit',
    settings: 'Settings',
    profile: 'Profile',
    api: 'API',
    onboarding: 'Setup'
  }

  if (specialCases[segment]) {
    return specialCases[segment]
  }

  // Default: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<template>
  <nav
    v-if="breadcrumbs.length > 1"
    class="flex items-center gap-2 text-sm"
    aria-label="Breadcrumb"
  >
    <ol class="flex items-center gap-2">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.to || crumb.label"
        class="flex items-center gap-2"
      >
        <!-- Separator -->
        <UIcon
          v-if="index > 0"
          name="i-lucide-chevron-right"
          class="w-4 h-4 text-gray-400 dark:text-gray-600"
        />

        <!-- Breadcrumb Link -->
        <NuxtLink
          v-if="crumb.to"
          :to="crumb.to"
          class="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <UIcon
            v-if="crumb.icon"
            :name="crumb.icon"
            class="w-4 h-4"
          />
          <span>{{ crumb.label }}</span>
        </NuxtLink>

        <!-- Current Page (no link) -->
        <span
          v-else
          class="flex items-center gap-1.5 text-gray-900 dark:text-gray-100 font-medium"
        >
          <UIcon
            v-if="crumb.icon"
            :name="crumb.icon"
            class="w-4 h-4"
          />
          <span>{{ crumb.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
