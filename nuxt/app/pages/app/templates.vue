<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const toast = useToast()

type ContractTemplate = {
  id: string
  name: string
  templateType: string
  description?: string
  content?: any // Lexical richText format
  isDefault: boolean
  requiresSignature: boolean
  isActive: boolean
  createdAt: string
}

// Fetch templates
const { data: templates, pending, refresh } = await useLazyFetch<{ docs: ContractTemplate[] }>(
  '/api/contract-templates',
  {
    query: {
      limit: 100,
      sort: '-createdAt',
    },
  },
)

// Modal states
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedTemplate = ref<ContractTemplate | null>(null)
const deleteDialogOpen = ref(false)
const templateToDelete = ref<ContractTemplate | null>(null)

// Edit form state
const editForm = ref({
  name: '',
  templateType: 'rental-agreement',
  description: '',
  content: '',
  requiresSignature: true,
  isActive: true,
})

// Form state
const templateForm = ref({
  name: '',
  templateType: 'rental-agreement',
  description: '',
  content: '',
  requiresSignature: true,
  isActive: true,
})

// Template type options
const templateTypeOptions = [
  { label: 'Rental Agreement', value: 'rental-agreement' },
  { label: 'Liability Waiver', value: 'liability-waiver' },
  { label: 'Damage Policy', value: 'damage-policy' },
  { label: 'Safety Rules', value: 'safety-rules' },
  { label: 'Weather Policy', value: 'weather-policy' },
  { label: 'Custom', value: 'custom' },
]

// Table columns
const columns: TableColumn<ContractTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Template Name',
  },
  {
    accessorKey: 'templateType',
    header: 'Type',
    cell: ({ row }) => {
      const typeMap: Record<string, string> = {
        'rental-agreement': 'Rental Agreement',
        'liability-waiver': 'Liability Waiver',
        'damage-policy': 'Damage Policy',
        'safety-rules': 'Safety Rules',
        'weather-policy': 'Weather Policy',
        custom: 'Custom',
      }
      return typeMap[row.getValue('templateType')] || row.getValue('templateType')
    },
  },
  {
    accessorKey: 'isDefault',
    header: 'Source',
    cell: ({ row }) => {
      return row.getValue('isDefault')
        ? h(UBadge, { color: 'primary', variant: 'subtle' }, () => 'Platform Default')
        : h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Custom')
    },
  },
  {
    accessorKey: 'requiresSignature',
    header: 'Signature',
    cell: ({ row }) => {
      return row.getValue('requiresSignature') ? 'Required' : 'Not Required'
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      return row.getValue('isActive')
        ? h(UBadge, { color: 'success', variant: 'subtle' }, () => 'Active')
        : h(UBadge, { color: 'neutral', variant: 'subtle' }, () => 'Inactive')
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex gap-2' },
        [
          h(UButton, {
            icon: 'i-lucide-eye',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            onClick: () => viewTemplate(row.original),
          }),
          !row.original.isDefault &&
            h(UButton, {
              icon: 'i-lucide-pencil',
              color: 'neutral',
              variant: 'ghost',
              size: 'sm',
              onClick: () => editTemplate(row.original),
            }),
          !row.original.isDefault &&
            h(UButton, {
              icon: 'i-lucide-trash-2',
              color: 'error',
              variant: 'ghost',
              size: 'sm',
              onClick: () => confirmDeleteTemplate(row.original),
            }),
        ].filter(Boolean),
      ),
  },
]

// Actions
function resetForm() {
  templateForm.value = {
    name: '',
    templateType: 'rental-agreement',
    description: '',
    content: '',
    requiresSignature: true,
    isActive: true,
  }
}

// Convert Lexical richText to plain text for display/editing
function lexicalToText(lexicalContent: any): string {
  if (!lexicalContent?.root?.children) return ''

  return lexicalContent.root.children
    .map((node: any) => {
      if (node.type === 'paragraph' && node.children) {
        return node.children
          .map((child: any) => child.text || '')
          .join('')
      }
      return ''
    })
    .join('\n')
}

async function viewTemplate(template: ContractTemplate) {
  // Fetch full template with content
  try {
    const fullTemplate = await $fetch<ContractTemplate>(`/api/contract-templates/${template.id}`)
    selectedTemplate.value = fullTemplate
    isViewModalOpen.value = true
  } catch (error) {
    console.error('Error fetching template:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load template details.',
      color: 'error',
    })
  }
}

async function editTemplate(template: ContractTemplate) {
  // Fetch full template with content
  try {
    const fullTemplate = await $fetch<ContractTemplate>(`/api/contract-templates/${template.id}`)
    selectedTemplate.value = fullTemplate

    // Populate edit form
    editForm.value = {
      name: fullTemplate.name,
      templateType: fullTemplate.templateType,
      description: fullTemplate.description || '',
      content: lexicalToText(fullTemplate.content),
      requiresSignature: fullTemplate.requiresSignature,
      isActive: fullTemplate.isActive,
    }

    isEditModalOpen.value = true
  } catch (error) {
    console.error('Error fetching template:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load template for editing.',
      color: 'error',
    })
  }
}

async function updateTemplate() {
  if (!selectedTemplate.value) return

  try {
    const lexicalContent = textToLexical(editForm.value.content)

    await $fetch(`/api/contract-templates/${selectedTemplate.value.id}`, {
      method: 'PATCH',
      body: {
        name: editForm.value.name,
        templateType: editForm.value.templateType,
        description: editForm.value.description,
        content: lexicalContent,
        requiresSignature: editForm.value.requiresSignature,
        isActive: editForm.value.isActive,
      },
    })

    toast.add({
      title: 'Template Updated',
      description: `"${editForm.value.name}" has been saved.`,
      color: 'success',
    })

    isEditModalOpen.value = false
    selectedTemplate.value = null
    await refresh()
  } catch (error: any) {
    console.error('Error updating template:', error)
    toast.add({
      title: 'Failed to update template',
      description: error?.data?.message || 'Please try again.',
      color: 'error',
    })
  }
}

function confirmDeleteTemplate(template: ContractTemplate) {
  templateToDelete.value = template
  deleteDialogOpen.value = true
}

async function deleteTemplate() {
  if (!templateToDelete.value) return

  try {
    await $fetch(`/api/contract-templates/${templateToDelete.value.id}`, {
      method: 'DELETE',
    })
    toast.add({
      title: 'Template Deleted',
      description: `"${templateToDelete.value.name}" has been removed.`,
      color: 'success',
    })
    await refresh()
  } catch (error) {
    console.error('Error deleting template:', error)
    toast.add({
      title: 'Failed to delete template',
      description: 'Please try again or contact support.',
      color: 'error',
    })
  } finally {
    deleteDialogOpen.value = false
    templateToDelete.value = null
  }
}

// Convert plain text to Lexical richText format
function textToLexical(text: string) {
  // Split text by newlines and create paragraph nodes
  const paragraphs = text.split('\n').filter(line => line.trim() !== '')

  const children = paragraphs.map(paragraph => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: paragraph,
        version: 1,
        format: 0,
        mode: 'normal',
        style: '',
        detail: 0,
      }
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    textFormat: 0,
  }))

  // If no content, add an empty paragraph
  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      textFormat: 0,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    }
  }
}

async function createTemplate() {
  try {
    // Convert plain text content to Lexical format
    const lexicalContent = textToLexical(templateForm.value.content)

    await $fetch('/api/contract-templates', {
      method: 'POST',
      body: {
        name: templateForm.value.name,
        templateType: templateForm.value.templateType,
        description: templateForm.value.description,
        content: lexicalContent,
        requiresSignature: templateForm.value.requiresSignature,
        isActive: templateForm.value.isActive,
      },
    })

    toast.add({
      title: 'Template Created',
      description: `"${templateForm.value.name}" is now available.`,
      color: 'success',
    })

    isCreateModalOpen.value = false
    resetForm()
    await refresh()
  } catch (error: any) {
    console.error('Error creating template:', error)
    toast.add({
      title: 'Failed to create template',
      description: error?.data?.message || 'Please check your input and try again.',
      color: 'error',
    })
  }
}

// Variable reference for help
const availableVariables = [
  { key: '{{tenantName}}', description: 'Your business name' },
  { key: '{{tenantPhone}}', description: 'Your business phone' },
  { key: '{{tenantEmail}}', description: 'Your business email' },
  { key: '{{customerName}}', description: 'Customer full name' },
  { key: '{{itemName}}', description: 'Rental item name' },
  { key: '{{startDate}}', description: 'Rental start date' },
  { key: '{{endDate}}', description: 'Rental end date' },
  { key: '{{totalPrice}}', description: 'Total rental price' },
  { key: '{{currentDate}}', description: 'Current date' },
]

// Textarea ref for variable insertion
const contentTextarea = ref<HTMLTextAreaElement | null>(null)

function insertVariable(variable: string) {
  const textarea = contentTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = templateForm.value.content

  templateForm.value.content = text.substring(0, start) + variable + text.substring(end)

  // Restore cursor position after the inserted variable
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + variable.length, start + variable.length)
  })
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Contract Templates">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UButton
            icon="i-lucide-plus"
            label="Create Template"
            @click="isCreateModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Info Banner -->
        <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="text-blue-600 dark:text-blue-400 text-xl mt-0.5" />
            <div>
              <h3 class="font-medium text-blue-900 dark:text-blue-100">Template Variables</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Use variables like <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">{<!-- -->{tenantName}<!-- -->}</code>, <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">{<!-- -->{customerName}<!-- -->}</code>, <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">{<!-- -->{itemName}<!-- -->}</code>, etc. in your templates.
                They will be automatically replaced with actual data when generating contracts.
              </p>
            </div>
          </div>
        </div>

        <!-- Templates Table -->
        <div v-if="!pending && templates?.docs.length" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <UTable :data="templates.docs" :columns="columns" />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!pending && !templates?.docs.length"
          class="flex flex-col items-center justify-center py-16 text-gray-500"
        >
          <UIcon name="i-lucide-file-text" class="text-6xl mb-4 text-gray-300" />
          <p class="text-lg font-medium">No Templates Yet</p>
          <p class="text-sm mb-6 text-center max-w-sm">
            Create reusable contract templates for your business
          </p>
          <UButton
            icon="i-lucide-plus"
            label="Create First Template"
            @click="isCreateModalOpen = true"
          />
        </div>

        <!-- Loading State -->
        <div v-else class="flex items-center justify-center py-12">
          <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Create Template Modal -->
  <UModal v-model:open="isCreateModalOpen" title="Create Contract Template">
    <template #body>
      <div class="space-y-4 p-6">
        <UFormField label="Template Name" required>
          <UInput v-model="templateForm.name" placeholder="e.g., Standard Rental Agreement" class="w-full" />
        </UFormField>

        <UFormField label="Template Type" required>
          <USelect
            v-model="templateForm.templateType"
            :items="templateTypeOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="templateForm.description"
            placeholder="Brief description of this template"
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <UFormField label="Template Content" required>
          <UTextarea
            ref="contentTextarea"
            v-model="templateForm.content"
            placeholder="Enter your contract content here. Use variables like {customerName}, {itemName}, etc."
            class="w-full"
            :rows="10"
          />
        </UFormField>

        <div class="flex items-center gap-6">
          <UFormField label="Requires Signature">
            <USwitch v-model="templateForm.requiresSignature" />
          </UFormField>

          <UFormField label="Active">
            <USwitch v-model="templateForm.isActive" />
          </UFormField>
        </div>

        <!-- Variable Insertion Buttons -->
        <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <p class="text-sm font-medium mb-3">Insert Variables:</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="variable in availableVariables"
              :key="variable.key"
              size="xs"
              color="neutral"
              variant="soft"
              :label="variable.key"
              @click="insertVariable(variable.key)"
            >
              <template #trailing>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ variable.description }}</span>
              </template>
            </UButton>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Click a variable to insert it at the cursor position in the template content.
          </p>
        </div>

      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
        <UButton label="Create Template" @click="createTemplate" />
      </div>
    </template>
  </UModal>

  <!-- View Template Modal -->
  <UModal v-model:open="isViewModalOpen" title="Template Details">
    <template #body>
      <div v-if="selectedTemplate" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Template Name</label>
            <p class="text-lg font-semibold">{{ selectedTemplate.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
            <p>{{ templateTypeOptions.find(t => t.value === selectedTemplate.templateType)?.label || selectedTemplate.templateType }}</p>
          </div>
        </div>

        <div v-if="selectedTemplate.description">
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
          <p class="text-gray-700 dark:text-gray-300">{{ selectedTemplate.description }}</p>
        </div>

        <div class="flex gap-6">
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Requires Signature</label>
            <p>
              <UBadge :color="selectedTemplate.requiresSignature ? 'success' : 'neutral'" variant="subtle">
                {{ selectedTemplate.requiresSignature ? 'Yes' : 'No' }}
              </UBadge>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <p>
              <UBadge :color="selectedTemplate.isActive ? 'success' : 'neutral'" variant="subtle">
                {{ selectedTemplate.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Template Content</label>
          <div class="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
            <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">{{ lexicalToText(selectedTemplate.content) || 'No content' }}</pre>
          </div>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          Created: {{ new Date(selectedTemplate.createdAt).toLocaleString() }}
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Close" color="neutral" variant="ghost" @click="close" />
        <UButton
          v-if="selectedTemplate && !selectedTemplate.isDefault"
          label="Edit Template"
          icon="i-lucide-pencil"
          @click="close(); editTemplate(selectedTemplate)"
        />
      </div>
    </template>
  </UModal>

  <!-- Edit Template Modal -->
  <UModal v-model:open="isEditModalOpen" title="Edit Template">
    <template #body>
      <div class="space-y-4 p-6">
        <UFormField label="Template Name" required>
          <UInput v-model="editForm.name" placeholder="e.g., Standard Rental Agreement" class="w-full" />
        </UFormField>

        <UFormField label="Template Type" required>
          <USelect
            v-model="editForm.templateType"
            :items="templateTypeOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="editForm.description"
            placeholder="Brief description of this template"
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <UFormField label="Template Content" required>
          <UTextarea
            v-model="editForm.content"
            placeholder="Enter your contract content here."
            class="w-full"
            :rows="10"
          />
        </UFormField>

        <div class="flex items-center gap-6">
          <UFormField label="Requires Signature">
            <USwitch v-model="editForm.requiresSignature" />
          </UFormField>

          <UFormField label="Active">
            <USwitch v-model="editForm.isActive" />
          </UFormField>
        </div>

        <!-- Variable Insertion Buttons -->
        <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <p class="text-sm font-medium mb-3">Available Variables:</p>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="variable in availableVariables"
              :key="variable.key"
              class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
              @click="editForm.content += variable.key"
            >
              {{ variable.key }}
            </code>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
        <UButton label="Save Changes" @click="updateTemplate" />
      </div>
    </template>
  </UModal>

  <!-- Delete Confirmation Dialog -->
  <UiConfirmDialog
    v-model:open="deleteDialogOpen"
    title="Delete Template"
    :message="`Are you sure you want to delete '${templateToDelete?.name}'? This action cannot be undone.`"
    confirm-label="Delete"
    confirm-color="error"
    icon="i-lucide-trash-2"
    @confirm="deleteTemplate"
  />
</template>
