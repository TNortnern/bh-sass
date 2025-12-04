<script setup lang="ts">
interface Props {
  status: 'up_to_date' | 'due_soon' | 'overdue'
}

const props = defineProps<Props>()

const statusConfig = {
  up_to_date: {
    label: 'Up to Date',
    color: 'success' as const,
    icon: 'i-lucide-check-circle'
  },
  due_soon: {
    label: 'Due Soon',
    color: 'warning' as const,
    icon: 'i-lucide-clock'
  },
  overdue: {
    label: 'Overdue',
    color: 'error' as const,
    icon: 'i-lucide-alert-triangle'
  }
}

const config = computed(() => statusConfig[props.status])
</script>

<template>
  <UBadge
    :label="config.label"
    :color="config.color"
    :icon="config.icon"
    variant="subtle"
  />
</template>
