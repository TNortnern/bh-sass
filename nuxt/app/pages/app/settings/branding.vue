<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-1.5 text-gray-900 dark:text-white">
          Branding & Theming
        </h2>
        <p class="text-base text-gray-600 dark:text-[#888]">
          Customize your brand identity and widget appearance
        </p>
      </div>
      <UButton
        v-if="hasChanges"
        color="primary"
        size="md"
        icon="i-lucide-save"
        :loading="saving"
        @click="saveBranding"
      >
        Save Changes
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]"
    >
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-600 dark:border-t-amber-400 rounded-full animate-spin" />
      <p>Loading branding settings...</p>
    </div>

    <div
      v-else
      class="flex flex-col gap-6"
    >
      <!-- Brand Identity -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-sparkles"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Brand Identity
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Logo and primary brand assets
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <UFormField
              label="Company Logo"
              help="Used in emails, invoices, and widgets"
            >
              <div class="flex flex-col gap-4">
                <div
                  v-if="brandSettings.logo"
                  class="relative w-[200px] h-[120px] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-gray-50 dark:bg-black/20"
                >
                  <img
                    :src="brandSettings.logo"
                    alt="Company Logo"
                    class="w-full h-full object-contain p-4"
                  >
                  <UButton
                    size="sm"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-x"
                    class="absolute top-2 right-2"
                    @click="removeLogo"
                  />
                </div>
                <div
                  v-else
                  class="w-[200px] h-[120px] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-black/20"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="w-8 h-8 text-gray-400 dark:text-[#666]"
                  />
                  <p class="m-0 text-sm text-gray-500 dark:text-[#666]">
                    No logo uploaded
                  </p>
                </div>
                <UButton
                  size="md"
                  color="primary"
                  variant="outline"
                  icon="i-lucide-upload"
                  @click="triggerLogoUpload"
                >
                  {{ brandSettings.logo ? 'Change Logo' : 'Upload Logo' }}
                </UButton>
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleLogoUpload"
                >
              </div>
            </UFormField>

            <UFormField
              label="Business Name"
              required
            >
              <UInput
                v-model="brandSettings.businessName"
                size="lg"
                placeholder="Your Business Name"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Tagline"
              help="Optional short description"
            >
              <UInput
                v-model="brandSettings.tagline"
                size="lg"
                placeholder="We bring the fun to your event!"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </UCard>

      <!-- Color Theme -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-palette"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Color Theme
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Customize widget and email colors
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
            <UFormField
              label="Primary Color"
              help="Main brand color"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="brandSettings.primaryColor"
                  type="color"
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-transparent"
                >
                <UInput
                  v-model="brandSettings.primaryColor"
                  size="lg"
                  placeholder="#000000"
                  class="flex-1"
                />
                <div
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg shrink-0"
                  :style="{ backgroundColor: brandSettings.primaryColor }"
                />
              </div>
            </UFormField>

            <UFormField
              label="Secondary Color"
              help="Accent and highlights"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="brandSettings.secondaryColor"
                  type="color"
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-transparent"
                >
                <UInput
                  v-model="brandSettings.secondaryColor"
                  size="lg"
                  placeholder="#000000"
                  class="flex-1"
                />
                <div
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg shrink-0"
                  :style="{ backgroundColor: brandSettings.secondaryColor }"
                />
              </div>
            </UFormField>

            <UFormField
              label="Accent Color"
              help="Buttons and calls-to-action"
            >
              <div class="flex items-center gap-3">
                <input
                  v-model="brandSettings.accentColor"
                  type="color"
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-transparent"
                >
                <UInput
                  v-model="brandSettings.accentColor"
                  size="lg"
                  placeholder="#000000"
                  class="flex-1"
                />
                <div
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg shrink-0"
                  :style="{ backgroundColor: brandSettings.accentColor }"
                />
              </div>
            </UFormField>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
            <p class="text-sm font-semibold text-gray-600 dark:text-[#888] mb-4 m-0">
              Quick Presets:
            </p>
            <div class="flex flex-col md:flex-row md:flex-wrap gap-3">
              <button
                v-for="preset in colorPresets"
                :key="preset.name"
                class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:border-gray-300 dark:hover:border-white/10 w-full md:w-auto"
                @click="applyColorPreset(preset)"
              >
                <div class="flex gap-1">
                  <div
                    class="w-5 h-5 rounded border border-gray-200 dark:border-white/10"
                    :style="{ backgroundColor: preset.primary }"
                  />
                  <div
                    class="w-5 h-5 rounded border border-gray-200 dark:border-white/10"
                    :style="{ backgroundColor: preset.secondary }"
                  />
                  <div
                    class="w-5 h-5 rounded border border-gray-200 dark:border-white/10"
                    :style="{ backgroundColor: preset.accent }"
                  />
                </div>
                <span class="text-sm text-gray-900 dark:text-white">{{ preset.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Website Template -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-layout-grid"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Website Template
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Choose a design style for your booking pages
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="template in availableTemplates"
              :key="template.id"
              class="group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer"
              :class="[
                brandSettings.templateId === template.id
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              ]"
              @click="selectTemplate(template.id)"
            >
              <!-- Template Preview -->
              <div
                class="aspect-[16/10] relative overflow-hidden"
                :style="{
                  background: `linear-gradient(135deg, ${template.colors.heroGradientFrom}, ${template.colors.heroGradientTo})`
                }"
              >
                <!-- Mini preview of template style -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                    <UIcon
                      name="i-lucide-castle"
                      class="w-5 h-5"
                    />
                  </div>
                  <div class="text-sm font-semibold">
                    {{ template.name }}
                  </div>
                </div>
                <!-- Selected indicator -->
                <div
                  v-if="brandSettings.templateId === template.id"
                  class="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-white"
                  />
                </div>
              </div>
              <!-- Template Info -->
              <div class="p-3 bg-white dark:bg-gray-900">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                  {{ template.name }}
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 m-0">
                  {{ template.description }}
                </p>
                <!-- Style indicators -->
                <div class="flex items-center gap-2 mt-2">
                  <span class="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                    {{ template.styles.cardStyle }}
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                    {{ template.styles.buttonStyle }}
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div class="flex items-start gap-3 p-4 mt-4 bg-amber-50 dark:bg-amber-900/5 border border-amber-200 dark:border-amber-500/15 rounded-lg">
            <UIcon
              name="i-lucide-lightbulb"
              class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            />
            <p class="m-0 text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              Templates define the overall look and feel of your booking pages. Your brand colors above will be applied to the selected template.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Widget Preview -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-layout-template"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Widget Preview
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                See how your branding looks
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div
            class="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
            :style="widgetStyles"
          >
            <div class="p-8 text-center bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)]">
              <img
                v-if="brandSettings.logo"
                :src="brandSettings.logo"
                alt="Logo"
                class="h-[60px] mx-auto mb-4 block"
              >
              <div
                v-else
                class="w-[60px] h-[60px] mx-auto mb-4 flex items-center justify-center bg-white/20 rounded-lg"
              >
                <UIcon
                  name="i-lucide-castle"
                  class="w-8 h-8 text-white"
                />
              </div>
              <h3 class="text-2xl font-bold text-white mb-2 m-0">
                {{ brandSettings.businessName || 'Your Business' }}
              </h3>
              <p
                v-if="brandSettings.tagline"
                class="text-sm text-white/90 m-0"
              >
                {{ brandSettings.tagline }}
              </p>
            </div>

            <div class="p-8">
              <div class="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div class="w-20 h-20 bg-gray-200 rounded-lg" />
                <div class="flex-1">
                  <h4 class="text-base font-semibold text-gray-900 mb-1 m-0">
                    Princess Castle Bounce House
                  </h4>
                  <p class="text-sm text-gray-600 m-0">
                    $199/day
                  </p>
                </div>
              </div>

              <button
                class="w-full px-3.5 py-3.5 border-0 rounded-lg text-base font-semibold text-white cursor-pointer transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                :style="buttonStyles"
              >
                Book Now
              </button>
            </div>
          </div>

          <div class="flex items-start gap-3 p-4 mt-4 bg-blue-50 dark:bg-blue-900/5 border border-blue-200 dark:border-blue-500/15 rounded-lg">
            <UIcon
              name="i-lucide-info"
              class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
            />
            <p class="m-0 text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              This preview shows how your branding will appear in the booking widget and customer-facing pages.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Email Branding -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-mail"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Email Templates
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Customize email appearance
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <UFormField label="Header Background">
              <div class="flex items-center gap-3">
                <input
                  v-model="brandSettings.emailHeaderBg"
                  type="color"
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-transparent"
                >
                <UInput
                  v-model="brandSettings.emailHeaderBg"
                  size="lg"
                  class="flex-1"
                />
              </div>
            </UFormField>

            <UFormField label="Button Color">
              <div class="flex items-center gap-3">
                <input
                  v-model="brandSettings.emailButtonColor"
                  type="color"
                  class="w-12 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg cursor-pointer bg-transparent"
                >
                <UInput
                  v-model="brandSettings.emailButtonColor"
                  size="lg"
                  class="flex-1"
                />
              </div>
            </UFormField>

            <UFormField
              label="Email Footer Text"
              help="Appears at the bottom of all emails"
            >
              <UTextarea
                v-model="brandSettings.emailFooter"
                :rows="3"
                placeholder="© 2025 Your Business Name. All rights reserved."
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
            <UButton
              size="md"
              variant="outline"
              icon="i-lucide-send"
              @click="sendTestEmail"
            >
              Send Test Email
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Invoice/Contract Branding -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-200 dark:hover:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[10px] text-amber-600 dark:text-amber-400 shrink-0">
              <UIcon
                name="i-lucide-file-text"
                class="w-5 h-5"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight mb-1 text-gray-900 dark:text-white">
                Documents
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666] m-0">
                Invoice and contract customization
              </p>
            </div>
          </div>
        </template>

        <div class="p-6">
          <div class="flex flex-col gap-6">
            <UFormField
              label="Invoice Header"
              help="Custom text for invoice headers"
            >
              <UInput
                v-model="brandSettings.invoiceHeader"
                size="lg"
                placeholder="INVOICE"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Terms & Conditions"
              help="Shown on contracts"
            >
              <UTextarea
                v-model="brandSettings.termsAndConditions"
                :rows="6"
                placeholder="1. Payment is due at time of booking...&#10;2. Cancellations must be made 48 hours in advance...&#10;3. Setup area must be clear and accessible..."
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Safety Guidelines"
              help="Shown on rental agreements"
            >
              <UTextarea
                v-model="brandSettings.safetyGuidelines"
                :rows="4"
                placeholder="Adult supervision required at all times...&#10;Remove shoes before entering...&#10;No food or drinks inside..."
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const { currentUser } = useAuth()
const { getAllTemplates } = useTemplates()

const loading = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const logoInput = ref<HTMLInputElement | null>(null)

// Get all available templates
const availableTemplates = getAllTemplates()

const brandSettings = ref({
  logo: null as string | null,
  logoId: null as string | null,
  businessName: '',
  tagline: '',
  templateId: 'classic',
  primaryColor: '#fbbf24',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  emailHeaderBg: '#fbbf24',
  emailButtonColor: '#10b981',
  emailFooter: '',
  invoiceHeader: 'INVOICE',
  termsAndConditions: '',
  safetyGuidelines: ''
})

const selectTemplate = (templateId: string) => {
  brandSettings.value.templateId = templateId
}

const originalSettings = ref({
  logo: null as string | null,
  logoId: null as string | null,
  businessName: '',
  tagline: '',
  templateId: 'classic',
  primaryColor: '#fbbf24',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  emailHeaderBg: '#fbbf24',
  emailButtonColor: '#10b981',
  emailFooter: '',
  invoiceHeader: 'INVOICE',
  termsAndConditions: '',
  safetyGuidelines: ''
})

const colorPresets = [
  {
    name: 'Fun & Bright',
    primary: '#fbbf24',
    secondary: '#3b82f6',
    accent: '#10b981'
  },
  {
    name: 'Party Purple',
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#f59e0b'
  },
  {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#8b5cf6'
  },
  {
    name: 'Summer Vibes',
    primary: '#f97316',
    secondary: '#eab308',
    accent: '#84cc16'
  },
  {
    name: 'Classic Red',
    primary: '#dc2626',
    secondary: '#1e40af',
    accent: '#059669'
  }
]

const widgetStyles = computed(() => ({
  '--primary-color': brandSettings.value.primaryColor,
  '--secondary-color': brandSettings.value.secondaryColor,
  '--accent-color': brandSettings.value.accentColor
}))

const buttonStyles = computed(() => ({
  backgroundColor: brandSettings.value.accentColor,
  borderColor: brandSettings.value.accentColor
}))

watch(
  brandSettings,
  () => {
    hasChanges.value = JSON.stringify(brandSettings.value) !== JSON.stringify(originalSettings.value)
  },
  { deep: true }
)

onMounted(async () => {
  await loadBrandSettings()
})

const loadBrandSettings = async () => {
  loading.value = true
  try {
    // Fetch tenant branding settings from API
    const response = await $fetch<typeof brandSettings.value>('/api/settings/branding')
    if (response) {
      brandSettings.value = { ...brandSettings.value, ...response }
      originalSettings.value = { ...brandSettings.value }
    }
  } catch (err) {
    console.error('Failed to load branding settings:', err)
    toast.add({
      title: 'Failed to load branding settings',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const triggerLogoUpload = () => {
  logoInput.value?.click()
}

const handleLogoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      title: 'File too large',
      description: 'Logo must be less than 5MB',
      color: 'error'
    })
    return
  }

  // Upload to server
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $fetch<{ url: string, id: string }>('/api/media/upload', {
      method: 'POST',
      body: formData
    })
    // Store both URL (for display) and ID (for saving to tenant)
    brandSettings.value.logo = response.url
    brandSettings.value.logoId = response.id
    toast.add({
      title: 'Logo uploaded successfully',
      color: 'success'
    })
  } catch (err) {
    console.error('Logo upload failed:', err)
    toast.add({
      title: 'Failed to upload logo',
      color: 'error'
    })
  }
}

const removeLogo = () => {
  brandSettings.value.logo = null
  brandSettings.value.logoId = null
}

const applyColorPreset = (preset: typeof colorPresets[0]) => {
  brandSettings.value.primaryColor = preset.primary
  brandSettings.value.secondaryColor = preset.secondary
  brandSettings.value.accentColor = preset.accent
  brandSettings.value.emailHeaderBg = preset.primary
  brandSettings.value.emailButtonColor = preset.accent
}

const saveBranding = async () => {
  saving.value = true
  try {
    await $fetch('/api/settings/branding', {
      method: 'POST',
      body: brandSettings.value
    })
    originalSettings.value = { ...brandSettings.value }
    hasChanges.value = false
    toast.add({
      title: 'Branding settings saved',
      color: 'success'
    })
  } catch (err) {
    console.error('Failed to save branding:', err)
    toast.add({
      title: 'Failed to save branding',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

const sendTestEmail = async () => {
  try {
    await $fetch('/api/settings/branding/test-email', {
      method: 'POST'
    })
    toast.add({
      title: 'Test email sent',
      description: `Check your inbox at ${currentUser.value?.email}`,
      color: 'success'
    })
  } catch (err) {
    console.error('Failed to send test email:', err)
    toast.add({
      title: 'Failed to send test email',
      color: 'error'
    })
  }
}
</script>
