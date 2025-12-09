<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success' | 'neutral'
  icon?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const localOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

function handleConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <UModal
    v-model:open="localOpen"
    :title="title"
  >
    <template #body>
      <div class="p-6">
        <div
          v-if="icon"
          class="flex items-center gap-3 mb-4"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="{
              'bg-red-100 dark:bg-red-900/30': confirmColor === 'error',
              'bg-yellow-100 dark:bg-yellow-900/30': confirmColor === 'warning',
              'bg-blue-100 dark:bg-blue-900/30': confirmColor === 'primary',
              'bg-green-100 dark:bg-green-900/30': confirmColor === 'success',
              'bg-gray-100 dark:bg-gray-800': !confirmColor || confirmColor === 'neutral'
            }"
          >
            <UIcon
              :name="icon"
              class="text-xl"
              :class="{
                'text-red-600 dark:text-red-400': confirmColor === 'error',
                'text-yellow-600 dark:text-yellow-400': confirmColor === 'warning',
                'text-blue-600 dark:text-blue-400': confirmColor === 'primary',
                'text-green-600 dark:text-green-400': confirmColor === 'success',
                'text-gray-600 dark:text-gray-400': !confirmColor || confirmColor === 'neutral'
              }"
            />
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300">
          {{ message }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :label="cancelLabel || 'Cancel'"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        />
        <UButton
          :label="confirmLabel || 'Confirm'"
          :color="confirmColor || 'primary'"
          @click="handleConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
