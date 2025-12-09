<script setup lang="ts">
/**
 * Reusable Confirmation Dialog Component
 * Use instead of window.confirm() for better UX
 */

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success' | 'neutral'
  icon?: string
  loading?: boolean
}>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'primary',
  icon: 'i-lucide-alert-circle',
  loading: false
})

const emit = defineEmits<{
  (e: 'confirm' | 'cancel'): void
}>()

const open = defineModel<boolean>('open', { default: false })

const iconColorClass = computed(() => {
  switch (props.confirmColor) {
    case 'error':
      return 'text-red-500 dark:text-red-400'
    case 'warning':
      return 'text-amber-500 dark:text-amber-400'
    case 'success':
      return 'text-green-500 dark:text-green-400'
    default:
      return 'text-primary-500 dark:text-primary-400'
  }
})

const iconBgClass = computed(() => {
  switch (props.confirmColor) {
    case 'error':
      return 'bg-red-100 dark:bg-red-900/30'
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-900/30'
    case 'success':
      return 'bg-green-100 dark:bg-green-900/30'
    default:
      return 'bg-primary-100 dark:bg-primary-900/30'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  open.value = false
  emit('cancel')
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="p-6">
        <!-- Header with icon -->
        <div class="flex items-start gap-4">
          <div
            :class="[iconBgClass, 'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0']"
          >
            <UIcon
              :name="icon"
              :class="[iconColorClass, 'text-2xl']"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ message }}
            </p>
            <!-- Custom content slot -->
            <slot />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6">
          <UButton
            :label="cancelLabel"
            color="neutral"
            variant="ghost"
            :disabled="loading"
            @click="handleCancel"
          />
          <UButton
            :label="confirmLabel"
            :color="confirmColor"
            :loading="loading"
            @click="handleConfirm"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
