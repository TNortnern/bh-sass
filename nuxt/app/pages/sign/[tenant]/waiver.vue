<script setup lang="ts">
/**
 * Customer Waiver Signing Page
 * - Pre-fills from booking when ?booking= query param provided
 * - Supports freehand canvas signature OR typed cursive signature
 * - Saves to Contracts collection
 * - Generates PDF
 */

interface Booking {
  id: string
  bookingNumber: string
  customerId: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  startDate: string
  rentalItems: Array<{
    rentalItemId: { name: string }
  }>
}

interface Tenant {
  id: string
  name: string
  email?: string
  phone?: string
  branding?: {
    businessName?: string
    primaryColor?: string
  }
}

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const tenantSlug = route.params.tenant as string
const bookingId = (route.query.bookingId as string) || ''
const bookingNumber = (route.query.booking as string) || ''

// State
const tenant = ref<Tenant | null>(null)
const booking = ref<Booking | null>(null)
const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const signedPdfUrl = ref<string | null>(null)
const signedContractNumber = ref<string | null>(null)
const error = ref<string | null>(null)

// Form state
const form = ref({
  bookingLookup: bookingNumber,
  signerName: '',
  signerEmail: '',
  signerPhone: '',
  agreedToTerms: false
})

// Signature state
const signatureMode = ref<'draw' | 'type'>('draw')
const signatureData = ref('')
const typedSignature = ref('')
const selectedFont = ref('dancing-script')

// Canvas refs
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

// Cursive font options
const fontOptions = [
  { label: 'Elegant Script', value: 'dancing-script', class: 'font-dancing' },
  { label: 'Classic Cursive', value: 'great-vibes', class: 'font-great-vibes' },
  { label: 'Handwritten', value: 'caveat', class: 'font-caveat' },
  { label: 'Formal Script', value: 'pacifico', class: 'font-pacifico' }
]

// Fetch tenant
const fetchTenant = async () => {
  try {
    const data = await $fetch<Tenant>(`/api/tenants-public/${tenantSlug}`)
    tenant.value = data
  } catch (e) {
    console.error('Failed to fetch tenant:', e)
    router.push('/404')
  }
}

// Fetch booking by ID
const fetchBookingById = async (id: string) => {
  if (!id) return

  try {
    const response = await $fetch<Booking>(`/api/bookings/${id}`, {
      params: { depth: 2 }
    })

    if (response) {
      booking.value = response
      prefillFromBooking()
    }
  } catch (e) {
    console.error('Failed to fetch booking by ID:', e)
  }
}

// Fetch booking by number
const fetchBookingByNumber = async (bookingNum: string) => {
  if (!bookingNum) return

  try {
    const response = await $fetch<{ docs: Booking[] }>('/api/bookings', {
      params: {
        where: {
          bookingNumber: { equals: bookingNum }
        },
        depth: 2,
        limit: 1
      }
    })

    if (response.docs.length > 0 && response.docs[0]) {
      booking.value = response.docs[0] as Booking
      prefillFromBooking()
    }
  } catch (e) {
    console.error('Failed to fetch booking by number:', e)
  }
}

// Pre-fill form from booking
const prefillFromBooking = () => {
  if (booking.value?.customerId) {
    const customer = booking.value.customerId
    form.value.signerName = `${customer.firstName} ${customer.lastName}`
    form.value.signerEmail = customer.email
    form.value.signerPhone = customer.phone || ''
  }
}

// Initialize
onMounted(async () => {
  await fetchTenant()

  // Try to fetch booking by ID first, then by number
  if (bookingId) {
    await fetchBookingById(bookingId)
  } else if (bookingNumber) {
    await fetchBookingByNumber(bookingNumber)
  }

  loading.value = false

  // Initialize canvas
  nextTick(() => {
    if (signatureCanvas.value) {
      ctx = signatureCanvas.value.getContext('2d')
      if (ctx) {
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }
  })
})

// Canvas drawing
const startDrawing = (e: MouseEvent | TouchEvent) => {
  isDrawing.value = true
  const rect = signatureCanvas.value?.getBoundingClientRect()
  if (!rect) return

  if (e instanceof MouseEvent) {
    lastX = e.clientX - rect.left
    lastY = e.clientY - rect.top
  } else {
    const touch = e.touches[0]
    if (touch) {
      lastX = touch.clientX - rect.left
      lastY = touch.clientY - rect.top
    }
  }
}

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx) return

  const rect = signatureCanvas.value?.getBoundingClientRect()
  if (!rect) return

  let x: number, y: number
  if (e instanceof MouseEvent) {
    x = e.clientX - rect.left
    y = e.clientY - rect.top
  } else {
    e.preventDefault()
    const touch = e.touches[0]
    if (!touch) return
    x = touch.clientX - rect.left
    y = touch.clientY - rect.top
  }

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()

  lastX = x
  lastY = y
}

const stopDrawing = () => {
  if (isDrawing.value && signatureCanvas.value) {
    signatureData.value = signatureCanvas.value.toDataURL('image/png')
  }
  isDrawing.value = false
}

const clearSignature = () => {
  if (ctx && signatureCanvas.value) {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    signatureData.value = ''
  }
}

// Generate typed signature as image
const generateTypedSignatureImage = (): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 500
  canvas.height = 150
  const context = canvas.getContext('2d')
  if (!context) return ''

  // Clear canvas
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Draw signature text
  const fontMap: Record<string, string> = {
    'dancing-script': '"Dancing Script", cursive',
    'great-vibes': '"Great Vibes", cursive',
    'caveat': '"Caveat", cursive',
    'pacifico': '"Pacifico", cursive'
  }

  context.fillStyle = '#1a1a1a'
  context.font = `48px ${fontMap[selectedFont.value] || 'cursive'}`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(typedSignature.value, canvas.width / 2, canvas.height / 2)

  return canvas.toDataURL('image/png')
}

// Form validation
const isFormValid = computed(() => {
  const hasSignature = signatureMode.value === 'draw'
    ? !!signatureData.value
    : !!typedSignature.value.trim()

  return form.value.signerName.trim()
    && form.value.signerEmail.trim()
    && form.value.signerPhone.trim()
    && form.value.agreedToTerms
    && hasSignature
})

// Submit waiver
const submitWaiver = async () => {
  if (!isFormValid.value || submitting.value || !tenant.value) return

  submitting.value = true
  error.value = null

  try {
    // Get signature image
    const finalSignatureData = signatureMode.value === 'draw'
      ? signatureData.value
      : generateTypedSignatureImage()

    // Create contract/waiver via API
    const waiverData = {
      tenantId: tenant.value.id,
      bookingId: booking.value?.id,
      customerId: booking.value?.customerId?.id,
      type: 'liability-waiver',
      signerName: form.value.signerName,
      signerEmail: form.value.signerEmail,
      signerPhone: form.value.signerPhone,
      signatureData: finalSignatureData,
      signatureMode: signatureMode.value,
      signedAt: new Date().toISOString()
    }

    const response = await $fetch<{
      success: boolean
      contract: { id: string, contractNumber: string }
      pdfUrl?: string
      pdfGenerated?: boolean
    }>('/api/waivers/sign', {
      method: 'POST',
      body: waiverData
    })

    submitted.value = true
    signedContractNumber.value = response.contract.contractNumber
    signedPdfUrl.value = response.pdfUrl || null

    toast.add({
      title: 'Waiver Signed!',
      description: 'Your waiver has been submitted successfully.',
      color: 'success'
    })
  } catch (e) {
    console.error('Waiver submission error:', e)
    error.value = 'Failed to submit waiver. Please try again.'
    toast.add({
      title: 'Error',
      description: 'Failed to submit waiver. Please try again.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

// Lookup booking by number from the input field
const lookupBooking = async () => {
  if (form.value.bookingLookup) {
    await fetchBookingByNumber(form.value.bookingLookup)
  }
}

const businessName = computed(() => tenant.value?.branding?.businessName || tenant.value?.name || 'Our Company')
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-8 h-8 animate-spin text-orange-600"
        />
      </div>

      <!-- Success State -->
      <div
        v-else-if="submitted"
        class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center"
      >
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon
            name="i-lucide-check-circle"
            class="w-10 h-10 text-green-600"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Waiver Signed Successfully!
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          Thank you, {{ form.signerName }}. A confirmation has been sent to {{ form.signerEmail }}.
        </p>
        <p
          v-if="signedContractNumber"
          class="text-sm text-gray-500 dark:text-gray-500 mb-6"
        >
          Contract Number: <span class="font-mono font-medium">{{ signedContractNumber }}</span>
        </p>

        <!-- PDF Download -->
        <div
          v-if="signedPdfUrl"
          class="mb-6"
        >
          <a
            :href="signedPdfUrl"
            :download="`waiver-${signedContractNumber}.pdf`"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UIcon
              name="i-lucide-download"
              class="w-5 h-5"
            />
            Download Signed Waiver (PDF)
          </a>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <UButton
            v-if="booking"
            :to="`/book/${tenantSlug}/confirmation?booking=${booking.id}`"
            color="primary"
            size="lg"
          >
            View Booking Details
          </UButton>
          <UButton
            :to="`/book/${tenantSlug}`"
            color="neutral"
            variant="outline"
            size="lg"
          >
            Browse Rentals
          </UButton>
        </div>
      </div>

      <!-- Waiver Form -->
      <div
        v-else
        class="space-y-6"
      >
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Liability Waiver
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Please read and sign the waiver below for {{ businessName }}
          </p>
        </div>

        <!-- Booking Lookup -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <label class="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Have a booking number?
          </label>
          <div class="flex gap-2">
            <UInput
              v-model="form.bookingLookup"
              placeholder="Enter booking number (e.g., BK-123)"
              class="flex-1"
            />
            <UButton
              color="primary"
              variant="soft"
              @click="lookupBooking"
            >
              Look Up
            </UButton>
          </div>
          <p
            v-if="booking"
            class="text-sm text-green-600 dark:text-green-400 mt-2"
          >
            Found booking for {{ booking.customerId?.firstName }} {{ booking.customerId?.lastName }}
          </p>
        </div>

        <!-- Waiver Content -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ businessName }} Equipment Rental Agreement & Liability Waiver
            </h2>
          </div>

          <div class="p-6 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 space-y-4">
            <p>
              <strong>ASSUMPTION OF RISK:</strong> I acknowledge that the use of inflatable equipment and party rentals involves inherent risks including falls, collisions, sprains, and other injuries. I voluntarily assume all risks associated with the use of the rented equipment.
            </p>
            <p>
              <strong>RELEASE OF LIABILITY:</strong> I hereby release {{ businessName }}, its owners, employees, and agents from any and all liability arising from the use of rented equipment.
            </p>
            <p>
              <strong>SAFETY AGREEMENT:</strong> I agree to provide adult supervision, not exceed capacity limits, prohibit food/drinks/sharp objects inside inflatables, and discontinue use during adverse weather.
            </p>
            <p>
              <strong>DAMAGE RESPONSIBILITY:</strong> I am financially responsible for any damage to equipment during the rental period, excluding normal wear and tear.
            </p>
            <p>
              <strong>ACKNOWLEDGMENT:</strong> By signing below, I confirm I have read this waiver, understand its terms, am at least 18 years old, and have authority to bind all participants.
            </p>
          </div>
        </div>

        <!-- Signer Information -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Information
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField
              label="Full Name"
              required
            >
              <UInput
                v-model="form.signerName"
                placeholder="Your full legal name"
              />
            </UFormField>
            <UFormField
              label="Email"
              required
            >
              <UInput
                v-model="form.signerEmail"
                type="email"
                placeholder="your@email.com"
              />
            </UFormField>
            <UFormField
              label="Phone"
              required
            >
              <UInput
                v-model="form.signerPhone"
                type="tel"
                placeholder="(555) 123-4567"
              />
            </UFormField>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Signature
          </h3>

          <!-- Signature Mode Toggle -->
          <div class="flex gap-2 mb-4">
            <UButton
              :color="signatureMode === 'draw' ? 'primary' : 'neutral'"
              :variant="signatureMode === 'draw' ? 'solid' : 'outline'"
              size="sm"
              @click="signatureMode = 'draw'"
            >
              <UIcon
                name="i-lucide-pen-tool"
                class="w-4 h-4 mr-1"
              />
              Draw Signature
            </UButton>
            <UButton
              :color="signatureMode === 'type' ? 'primary' : 'neutral'"
              :variant="signatureMode === 'type' ? 'solid' : 'outline'"
              size="sm"
              @click="signatureMode = 'type'"
            >
              <UIcon
                name="i-lucide-type"
                class="w-4 h-4 mr-1"
              />
              Type Signature
            </UButton>
          </div>

          <!-- Draw Signature -->
          <div
            v-if="signatureMode === 'draw'"
            class="space-y-3"
          >
            <div class="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 overflow-hidden">
              <canvas
                ref="signatureCanvas"
                width="500"
                height="150"
                class="w-full h-auto cursor-crosshair touch-none"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart.passive="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
              />
              <div
                v-if="!signatureData"
                class="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400"
              >
                Sign here with mouse or finger
              </div>
            </div>
            <div class="flex justify-end">
              <UButton
                v-if="signatureData"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="clearSignature"
              >
                <UIcon
                  name="i-lucide-eraser"
                  class="w-4 h-4 mr-1"
                />
                Clear
              </UButton>
            </div>
          </div>

          <!-- Type Signature -->
          <div
            v-else
            class="space-y-4"
          >
            <UInput
              v-model="typedSignature"
              placeholder="Type your full name"
              size="lg"
              class="text-center"
            />

            <!-- Font Selection -->
            <div class="space-y-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">Choose signature style:</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="font in fontOptions"
                  :key="font.value"
                  :class="[
                    'p-4 rounded-lg border-2 transition-all text-center',
                    selectedFont === font.value
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  ]"
                  @click="selectedFont = font.value"
                >
                  <span
                    :style="{ fontFamily: font.value === 'dancing-script' ? 'Dancing Script, cursive' : font.value === 'great-vibes' ? 'Great Vibes, cursive' : font.value === 'caveat' ? 'Caveat, cursive' : 'Pacifico, cursive' }"
                    class="text-2xl text-gray-900 dark:text-white"
                  >
                    {{ typedSignature || 'Your Name' }}
                  </span>
                  <span class="block text-xs text-gray-500 mt-1">{{ font.label }}</span>
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div
              v-if="typedSignature"
              class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
            >
              <p class="text-sm text-gray-500 mb-2">
                Signature Preview:
              </p>
              <p
                :style="{ fontFamily: selectedFont === 'dancing-script' ? 'Dancing Script, cursive' : selectedFont === 'great-vibes' ? 'Great Vibes, cursive' : selectedFont === 'caveat' ? 'Caveat, cursive' : 'Pacifico, cursive' }"
                class="text-4xl text-gray-900 dark:text-white"
              >
                {{ typedSignature }}
              </p>
            </div>
          </div>
        </div>

        <!-- Agreement Checkbox -->
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <label class="flex items-start gap-3 cursor-pointer">
            <UCheckbox v-model="form.agreedToTerms" />
            <span class="text-sm text-gray-700 dark:text-gray-300">
              I have read and agree to the terms of this liability waiver and release. I understand that this is a legally binding agreement and that by signing electronically, my signature has the same legal effect as a handwritten signature.
            </span>
          </label>
        </div>

        <!-- Error -->
        <div
          v-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
        >
          <UIcon
            name="i-lucide-alert-circle"
            class="w-5 h-5 text-red-600"
          />
          <span class="text-red-600 dark:text-red-400">{{ error }}</span>
        </div>

        <!-- Submit Button -->
        <UButton
          block
          size="xl"
          :disabled="!isFormValid"
          :loading="submitting"
          @click="submitWaiver"
        >
          <UIcon
            name="i-lucide-pen-tool"
            class="w-5 h-5 mr-2"
          />
          Sign Waiver
        </UButton>

        <p class="text-xs text-center text-gray-500 dark:text-gray-400">
          By clicking "Sign Waiver", you agree that your electronic signature is the legal equivalent of your manual signature.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Import Google Fonts for cursive signatures */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&display=swap');
</style>
