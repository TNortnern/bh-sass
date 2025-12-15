<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
definePageMeta({
  layout: 'dashboard'
})

interface EmailTemplate {
  id: string
  name: string
  description: string
  trigger: string
}

interface CustomTemplate {
  id: string
  tenantId: string
  templateKey: string
  name: string
  subject: string
  htmlBody: string
  textBody?: string
  isActive: boolean
  variables: string[]
  createdAt: string
  updatedAt: string
}

type EmailVariant = 'modern' | 'classic' | 'bold'

const toast = useToast()
// Fetch templates directly from Payload API
const { data: templatesData, pending, refresh } = useFetch<{ templates: EmailTemplate[] }>('/v1/email/templates')

const templates = computed(() => templatesData.value?.templates || [])

const selectedTemplate = ref<string | null>(null)
const selectedVariant = ref<EmailVariant>('modern')
const previewHtml = ref('')
const previewSubject = ref('')
const isLoadingPreview = ref(false)

const emailVariants = [
  {
    id: 'modern' as EmailVariant,
    name: 'Modern Dark',
    description: 'Clean dark design with gradient accents',
    icon: 'i-lucide-palette'
  },
  {
    id: 'classic' as EmailVariant,
    name: 'Classic Light',
    description: 'Professional light theme with traditional layout',
    icon: 'i-lucide-file-text'
  },
  {
    id: 'bold' as EmailVariant,
    name: 'Bold Gradient',
    description: 'Eye-catching design with vibrant gradients',
    icon: 'i-lucide-sparkles'
  }
]

const testEmailAddress = ref('')
const isSendingTest = ref(false)
const showTestModal = ref(false)

// Manage Template State
const showManageModal = ref(false)
const manageMode = ref<'view' | 'edit' | 'create'>('view')
const editingTemplate = ref<CustomTemplate | null>(null)
const isSavingTemplate = ref(false)
const isDeletingTemplate = ref(false)
const showDeleteConfirm = ref(false)

// Form state for editing
const templateForm = ref({
  name: '',
  subject: '',
  htmlBody: '',
  textBody: '',
  isActive: true
})

// Fetch custom template for the selected template type - fetched on demand
const customTemplatesData = ref<{ docs: CustomTemplate[] } | null>(null)

const customTemplate = computed(() => customTemplatesData.value?.docs?.[0] || null)

const refreshCustomTemplates = async () => {
  if (!selectedTemplate.value) {
    customTemplatesData.value = null
    return
  }
  try {
    customTemplatesData.value = await $fetch<{ docs: CustomTemplate[] }>(
      `/v1/email-templates?where[templateKey][equals]=${selectedTemplate.value}`,
      { credentials: 'include' }
    )
  } catch (err) {
    console.error('Failed to load custom templates:', err)
    customTemplatesData.value = null
  }
}

// Load preview when template selected - calls Payload API directly
async function loadPreview(templateId: string, variant?: EmailVariant) {
  selectedTemplate.value = templateId
  isLoadingPreview.value = true

  const variantToUse = variant || selectedVariant.value

  try {
    const data = await $fetch<{
      name: string
      subject: string
      html: string
      text: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sampleData: Record<string, any>
    }>(`/v1/email/preview/${templateId}?variant=${variantToUse}`)
    previewHtml.value = data.html
    previewSubject.value = data.subject

    // Load custom template data for this template
    await refreshCustomTemplates()
  } catch {
    toast.add({ title: 'Error', description: 'Failed to load preview', color: 'error' })
  } finally {
    isLoadingPreview.value = false
  }
}

// Change variant and reload preview
async function changeVariant(variant: EmailVariant) {
  selectedVariant.value = variant
  if (selectedTemplate.value) {
    await loadPreview(selectedTemplate.value, variant)
  }

  // Save variant preference to tenant settings
  try {
    const { updateSettings } = useSettings()
    await updateSettings('email', { variant })
  } catch (err) {
    console.error('Failed to save variant preference:', err)
  }
}

// Send test email - calls Payload API directly
async function sendTestEmail() {
  if (!testEmailAddress.value || !selectedTemplate.value) return

  isSendingTest.value = true

  try {
    await $fetch('/v1/email/send-test', {
      method: 'POST',
      body: {
        templateName: selectedTemplate.value,
        toEmail: testEmailAddress.value
      }
    })

    toast.add({
      title: 'Test Email Sent',
      description: `Email sent to ${testEmailAddress.value}`,
      color: 'success'
    })
    showTestModal.value = false
    testEmailAddress.value = ''
  } catch (err) {
    const error = err as { data?: { message?: string, error?: string } }
    toast.add({
      title: 'Error',
      description: error.data?.error || error.data?.message || 'Failed to send test email',
      color: 'error'
    })
  } finally {
    isSendingTest.value = false
  }
}

function openTestModal() {
  if (!selectedTemplate.value) {
    toast.add({ title: 'Select Template', description: 'Please select a template first', color: 'warning' })
    return
  }
  showTestModal.value = true
}

function getTemplateIcon(id: string): string {
  const icons: Record<string, string> = {
    BOOKING_CONFIRMATION: 'i-lucide-calendar-check',
    BOOKING_REMINDER: 'i-lucide-bell',
    BOOKING_CANCELLED: 'i-lucide-calendar-x',
    PAYMENT_RECEIVED: 'i-lucide-credit-card',
    PASSWORD_RESET: 'i-lucide-key',
    WELCOME: 'i-lucide-sparkles'
  }
  return icons[id] || 'i-lucide-mail'
}

// Get available variables for the selected template type
function getAvailableVariables(templateKey: string): string[] {
  const variablesByType: Record<string, string[]> = {
    BOOKING_CONFIRMATION: ['customerName', 'bookingId', 'itemName', 'eventDate', 'eventTime', 'location', 'totalAmount', 'bookingUrl'],
    BOOKING_REMINDER: ['customerName', 'itemName', 'eventDate', 'eventTime', 'location', 'bookingUrl'],
    BOOKING_CANCELLED: ['customerName', 'bookingId', 'itemName', 'eventDate', 'refundAmount'],
    PAYMENT_RECEIVED: ['customerName', 'paymentId', 'paymentDate', 'paymentMethod', 'bookingId', 'amount', 'remainingBalance', 'receiptUrl'],
    PASSWORD_RESET: ['userName', 'resetLink'],
    WELCOME: ['userName', 'userEmail', 'tenantName', 'planName', 'dashboardUrl']
  }
  return variablesByType[templateKey] || []
}

// Open manage modal
function openManageModal() {
  if (!selectedTemplate.value) {
    toast.add({ title: 'Select Template', description: 'Please select a template first', color: 'warning' })
    return
  }

  // Load existing custom template or prepare for new one
  if (customTemplate.value) {
    manageMode.value = 'view'
    editingTemplate.value = customTemplate.value
    templateForm.value = {
      name: customTemplate.value.name,
      subject: customTemplate.value.subject,
      htmlBody: customTemplate.value.htmlBody,
      textBody: customTemplate.value.textBody || '',
      isActive: customTemplate.value.isActive
    }
  } else {
    // No custom template exists, prepare to create one
    manageMode.value = 'create'
    editingTemplate.value = null
    const defaultTemplate = templates.value.find(t => t.id === selectedTemplate.value)
    templateForm.value = {
      name: defaultTemplate?.name || '',
      subject: previewSubject.value || '',
      htmlBody: previewHtml.value || getDefaultHtmlTemplate(selectedTemplate.value),
      textBody: '',
      isActive: true
    }
  }
  showManageModal.value = true
}

function getDefaultHtmlTemplate(templateKey: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateKey.replace(/_/g, ' ')}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1>Hello {{customerName}},</h1>
  <p>Your email content here...</p>
  <p>Best regards,<br>Your Business</p>
</body>
</html>`
}

// Switch to edit mode
function startEditing() {
  manageMode.value = 'edit'
}

// Cancel editing
function cancelEditing() {
  if (customTemplate.value) {
    manageMode.value = 'view'
    // Reset form to saved values
    templateForm.value = {
      name: customTemplate.value.name,
      subject: customTemplate.value.subject,
      htmlBody: customTemplate.value.htmlBody,
      textBody: customTemplate.value.textBody || '',
      isActive: customTemplate.value.isActive
    }
  } else {
    showManageModal.value = false
  }
}

// Save template
async function saveTemplate() {
  if (!selectedTemplate.value) return

  isSavingTemplate.value = true

  try {
    if (customTemplate.value) {
      // Update existing template
      await $fetch(`/v1/email-templates/${customTemplate.value.id}`, {
        method: 'PATCH',
        body: {
          name: templateForm.value.name,
          subject: templateForm.value.subject,
          htmlBody: templateForm.value.htmlBody,
          textBody: templateForm.value.textBody || null,
          isActive: templateForm.value.isActive
        },
        credentials: 'include'
      })
      toast.add({
        title: 'Template Updated',
        description: 'Your custom template has been saved',
        color: 'success'
      })
    } else {
      // Create new custom template
      await $fetch('/v1/email-templates', {
        method: 'POST',
        body: {
          templateKey: selectedTemplate.value,
          name: templateForm.value.name,
          subject: templateForm.value.subject,
          htmlBody: templateForm.value.htmlBody,
          textBody: templateForm.value.textBody || null,
          isActive: templateForm.value.isActive
        },
        credentials: 'include'
      })
      toast.add({
        title: 'Template Created',
        description: 'Your custom template has been created',
        color: 'success'
      })
    }

    await refreshCustomTemplates()
    manageMode.value = 'view'
  } catch (err) {
    const error = err as { data?: { message?: string, errors?: Array<{ message: string }> } }
    toast.add({
      title: 'Error',
      description: error.data?.errors?.[0]?.message || error.data?.message || 'Failed to save template',
      color: 'error'
    })
  } finally {
    isSavingTemplate.value = false
  }
}

// Delete template
async function deleteTemplate() {
  if (!customTemplate.value) return

  isDeletingTemplate.value = true

  try {
    await $fetch(`/v1/email-templates/${customTemplate.value.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    toast.add({
      title: 'Template Deleted',
      description: 'Custom template has been removed. Default template will be used.',
      color: 'success'
    })

    showDeleteConfirm.value = false
    showManageModal.value = false
    await refreshCustomTemplates()
  } catch (err) {
    const error = err as { data?: { message?: string, errors?: Array<{ message: string }> } }
    toast.add({
      title: 'Error',
      description: error.data?.errors?.[0]?.message || error.data?.message || 'Failed to delete template',
      color: 'error'
    })
  } finally {
    isDeletingTemplate.value = false
  }
}

// Reset to default (delete custom template)
function confirmDelete() {
  showDeleteConfirm.value = true
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Email Templates
        </h1>
        <p class="text-gray-600 dark:text-slate-400 mt-1">
          Preview and customize your email templates
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-settings-2"
          label="Manage Template"
          color="neutral"
          variant="outline"
          @click="openManageModal"
        />
        <UButton
          icon="i-lucide-send"
          label="Send Test Email"
          color="primary"
          @click="openTestModal"
        />
      </div>
    </div>

    <!-- Email Variant Selector -->
    <UCard class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-palette"
              class="w-5 h-5 text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Email Design Variant
            </h3>
            <p class="text-sm text-gray-600 dark:text-slate-400">
              Choose your preferred email template style
            </p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="variant in emailVariants"
          :key="variant.id"
          class="group relative p-4 rounded-lg border-2 transition-all text-left"
          :class="selectedVariant === variant.id
            ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-500/10'
            : 'border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-700/20 hover:border-gray-300 dark:hover:border-slate-600/50 hover:bg-gray-100 dark:hover:bg-slate-700/30'"
          @click="changeVariant(variant.id)"
        >
          <!-- Selected indicator -->
          <div
            v-if="selectedVariant === variant.id"
            class="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 text-white"
            />
          </div>

          <div class="flex items-start gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="selectedVariant === variant.id
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-gray-200 dark:bg-slate-600/30 text-gray-500 dark:text-slate-400 group-hover:bg-gray-300 dark:group-hover:bg-slate-600/50'"
            >
              <UIcon
                :name="variant.icon"
                class="w-5 h-5"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-900 dark:text-slate-100 mb-1">
                {{ variant.name }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                {{ variant.description }}
              </p>
            </div>
          </div>

          <!-- Visual preview thumbnail -->
          <div
            class="w-full h-24 rounded border overflow-hidden"
            :class="selectedVariant === variant.id
              ? 'border-amber-500/30'
              : 'border-gray-200 dark:border-slate-700/50 group-hover:border-gray-300 dark:group-hover:border-slate-600/50'"
          >
            <div
              class="w-full h-full bg-gradient-to-br"
              :class="{
                'from-slate-900 via-slate-800 to-amber-900/20': variant.id === 'modern',
                'from-white via-slate-50 to-slate-100': variant.id === 'classic',
                'from-purple-600 via-amber-500 to-pink-600': variant.id === 'bold'
              }"
            >
              <div
                class="p-2 text-xs opacity-50"
                :class="variant.id === 'classic' ? 'text-slate-900' : 'text-white'"
              >
                Preview
              </div>
            </div>
          </div>
        </button>
      </div>
    </UCard>

    <!-- Tip -->
    <UCard class="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
      <div class="flex items-start gap-3">
        <UIcon
          name="i-lucide-lightbulb"
          class="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0"
        />
        <div class="text-sm">
          <p class="text-amber-800 dark:text-amber-200 font-medium">
            Customize Your Templates
          </p>
          <p class="text-amber-700 dark:text-amber-300/70 mt-1">
            Select a template to preview it, then click "Manage Template" to customize the content.
            Use variables like <code class="bg-amber-200 dark:bg-amber-500/20 px-1 rounded text-amber-800 dark:text-amber-300">&#123;&#123; customerName &#125;&#125;</code> to personalize emails.
          </p>
        </div>
      </div>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Template List -->
      <div class="lg:col-span-1">
        <UCard class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Templates
              </h3>
              <UBadge
                color="neutral"
                variant="subtle"
              >
                {{ templates.length }}
              </UBadge>
            </div>
          </template>

          <div
            v-if="pending"
            class="space-y-3"
          >
            <USkeleton
              v-for="i in 6"
              :key="i"
              class="h-16"
            />
          </div>

          <div
            v-else
            class="space-y-2"
          >
            <button
              v-for="template in templates"
              :key="template.id"
              class="w-full text-left p-4 rounded-lg transition-all"
              :class="selectedTemplate === template.id
                ? 'bg-amber-50 dark:bg-amber-500/20 ring-1 ring-amber-500/50'
                : 'bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/50'"
              @click="loadPreview(template.id)"
            >
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
                  <UIcon
                    :name="getTemplateIcon(template.id)"
                    class="w-4 h-4 text-amber-600 dark:text-amber-500"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-900 dark:text-slate-100">{{ template.name }}</span>
                    <UBadge
                      v-if="customTemplatesData?.docs?.find((c: CustomTemplate) => c.templateKey === template.id)"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    >
                      Custom
                    </UBadge>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                    {{ template.description }}
                  </div>
                  <div class="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-slate-500">
                    <UIcon
                      name="i-lucide-zap"
                      class="w-3 h-3"
                    />
                    {{ template.trigger }}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </UCard>
      </div>

      <!-- Preview Panel -->
      <div class="lg:col-span-2">
        <UCard class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Preview
              </h3>
              <UBadge
                v-if="previewSubject"
                color="neutral"
                variant="subtle"
                class="max-w-xs truncate"
              >
                {{ previewSubject }}
              </UBadge>
            </div>
          </template>

          <div
            v-if="!selectedTemplate"
            class="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500"
          >
            <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700/30 flex items-center justify-center mb-4">
              <UIcon
                name="i-lucide-mail"
                class="w-8 h-8"
              />
            </div>
            <p class="text-lg font-medium text-gray-600 dark:text-slate-400">
              Select a template to preview
            </p>
            <p class="text-sm text-gray-400 dark:text-slate-600 mt-1">
              Choose from the list on the left
            </p>
          </div>

          <div
            v-else-if="isLoadingPreview"
            class="flex items-center justify-center py-20"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 animate-spin text-amber-500"
            />
          </div>

          <div
            v-else
            class="relative"
          >
            <!-- Email Preview in iframe -->
            <div
              class="bg-white rounded-lg overflow-hidden shadow-inner"
              style="min-height: 500px;"
            >
              <iframe
                :srcdoc="previewHtml"
                class="w-full border-0"
                style="height: 600px;"
                sandbox="allow-same-origin"
                title="Email Preview"
              />
            </div>

            <!-- Preview Actions -->
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-slate-700/50">
              <div class="text-sm text-gray-500 dark:text-slate-500">
                Preview shows sample data. Actual emails will use real customer information.
              </div>
              <div class="flex items-center gap-2">
                <UButton
                  icon="i-lucide-settings-2"
                  label="Manage"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  @click="openManageModal"
                />
                <UButton
                  icon="i-lucide-send"
                  label="Send Test"
                  color="primary"
                  size="sm"
                  @click="openTestModal"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Test Email Modal -->
    <UModal v-model:open="showTestModal">
      <template #content>
        <div class="p-6 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-send"
                class="w-5 h-5 text-amber-600 dark:text-amber-500"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Send Test Email
              </h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                Send a preview with sample data
              </p>
            </div>
          </div>

          <UFormField
            label="Email Address"
            required
          >
            <UInput
              v-model="testEmailAddress"
              type="email"
              placeholder="test@example.com or use temp-mail.org"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>

          <p class="text-xs text-gray-500 dark:text-slate-500 mt-2">
            Tip: Visit <a
              href="https://temp-mail.org"
              target="_blank"
              class="text-amber-600 dark:text-amber-400 hover:underline"
            >temp-mail.org</a>
            and copy your temporary email address to test.
          </p>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancel"
              @click="showTestModal = false"
            />
            <UButton
              color="primary"
              label="Send Test Email"
              icon="i-lucide-send"
              :loading="isSendingTest"
              :disabled="!testEmailAddress"
              @click="sendTestEmail"
            />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Manage Template Modal -->
    <UModal
      v-model:open="showManageModal"
      class="max-w-4xl"
    >
      <template #content>
        <div class="p-6 bg-white dark:bg-gray-900">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-slate-700/50 flex items-center justify-center">
                <UIcon
                  :name="getTemplateIcon(selectedTemplate || '')"
                  class="w-5 h-5 text-amber-600 dark:text-amber-500"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {{ manageMode === 'create' ? 'Create Custom Template' : 'Manage Template' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-slate-400">
                  {{ templates.find((t: EmailTemplate) => t.id === selectedTemplate)?.name }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="customTemplate"
                color="primary"
                variant="subtle"
              >
                Custom
              </UBadge>
              <UBadge
                v-else
                color="neutral"
                variant="subtle"
              >
                Default
              </UBadge>
            </div>
          </div>

          <!-- View Mode -->
          <div v-if="manageMode === 'view' && customTemplate">
            <div class="space-y-4">
              <div class="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                  Template Name
                </div>
                <div class="text-gray-900 dark:text-slate-100">
                  {{ customTemplate.name }}
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                  Subject Line
                </div>
                <div class="text-gray-900 dark:text-slate-100">
                  {{ customTemplate.subject }}
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                  Status
                </div>
                <UBadge
                  :color="customTemplate.isActive ? 'success' : 'neutral'"
                  variant="subtle"
                >
                  {{ customTemplate.isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </div>
              <div class="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-1">
                  HTML Body Preview
                </div>
                <div class="bg-white rounded-lg mt-2 p-2 max-h-48 overflow-auto border border-gray-200 dark:border-transparent">
                  <iframe
                    :srcdoc="customTemplate.htmlBody"
                    class="w-full border-0"
                    style="height: 180px;"
                    sandbox="allow-same-origin"
                    title="Template Preview"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-slate-700/50">
              <UButton
                icon="i-lucide-trash-2"
                label="Reset to Default"
                color="error"
                variant="ghost"
                @click="confirmDelete"
              />
              <div class="flex items-center gap-2">
                <UButton
                  label="Close"
                  color="neutral"
                  variant="ghost"
                  @click="showManageModal = false"
                />
                <UButton
                  icon="i-lucide-pencil"
                  label="Edit Template"
                  color="primary"
                  @click="startEditing"
                />
              </div>
            </div>
          </div>

          <!-- Edit/Create Mode -->
          <div v-else>
            <div class="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <UFormField
                label="Template Name"
                required
              >
                <UInput
                  v-model="templateForm.name"
                  placeholder="e.g., Booking Confirmation"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Subject Line"
                required
                help="Supports variables like {{customerName}}"
              >
                <UInput
                  v-model="templateForm.subject"
                  placeholder="e.g., Your booking #{{bookingId}} is confirmed!"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="HTML Body"
                required
              >
                <UTextarea
                  v-model="templateForm.htmlBody"
                  :rows="12"
                  placeholder="Enter HTML email content..."
                  class="w-full font-mono text-sm"
                />
              </UFormField>

              <UFormField
                label="Plain Text Body (Optional)"
                help="Auto-generated from HTML if empty"
              >
                <UTextarea
                  v-model="templateForm.textBody"
                  :rows="4"
                  placeholder="Optional plain text version..."
                  class="w-full"
                />
              </UFormField>

              <UFormField>
                <UCheckbox
                  v-model="templateForm.isActive"
                  label="Use this custom template"
                />
              </UFormField>

              <!-- Available Variables -->
              <div class="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div class="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-2">
                  Available Variables
                </div>
                <div class="flex flex-wrap gap-2">
                  <code
                    v-for="(variable, idx) in getAvailableVariables(selectedTemplate || '')"
                    :key="`${variable}-${idx}`"
                    class="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-500/30"
                    @click="templateForm.htmlBody += `{{${variable}}}`"
                  >
                    {{ variable }}
                  </code>
                </div>
                <p class="text-xs text-gray-500 dark:text-slate-500 mt-2">
                  Click a variable to insert it at the end of your HTML
                </p>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-slate-700/50">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="cancelEditing"
              />
              <UButton
                icon="i-lucide-check"
                :label="customTemplate ? 'Save Changes' : 'Create Template'"
                color="primary"
                :loading="isSavingTemplate"
                @click="saveTemplate"
              />
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteConfirm">
      <template #content>
        <div class="p-6 bg-white dark:bg-gray-900">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-alert-triangle"
                class="w-5 h-5 text-red-600 dark:text-red-500"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Reset to Default?
              </h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                This will delete your custom template
              </p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-slate-300 mb-6">
            Your custom template will be deleted and the default template will be used instead.
            This action cannot be undone.
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="showDeleteConfirm = false"
            />
            <UButton
              icon="i-lucide-trash-2"
              label="Reset to Default"
              color="error"
              :loading="isDeletingTemplate"
              @click="deleteTemplate"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
