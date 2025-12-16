<script setup lang="ts">
/**
 * Waiver Signature Section
 * Embeddable waiver signing widget for rental websites
 * Can be pre-filled with booking number for seamless integration
 */

interface WaiverProps {
  title?: string
  subtitle?: string
  businessName?: string
  showBookingLookup?: boolean
  waiverText?: string
  backgroundColor?: string
}

const props = withDefaults(defineProps<{
  data: WaiverProps
  editable?: boolean
}>(), {
  editable: false
})

const emit = defineEmits<{
  update: [field: string, value: unknown]
}>()

// Form state
const bookingNumber = ref('')
const signerName = ref('')
const signerEmail = ref('')
const agreedToTerms = ref(false)
const signatureData = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

// Canvas ref for signature
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

// Initialize canvas
onMounted(() => {
  if (signatureCanvas.value) {
    ctx = signatureCanvas.value.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }

  // Check for booking number in URL
  if (import.meta.client) {
    const params = new URLSearchParams(window.location.search)
    const bn = params.get('booking')
    if (bn) {
      bookingNumber.value = bn
    }
  }
})

// Drawing functions
const startDrawing = (e: MouseEvent | TouchEvent) => {
  if (props.editable) return
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
  if (!isDrawing.value || !ctx || props.editable) return

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
    signatureData.value = signatureCanvas.value.toDataURL()
  }
  isDrawing.value = false
}

const clearSignature = () => {
  if (ctx && signatureCanvas.value) {
    ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height)
    signatureData.value = ''
  }
}

// Form validation
const isFormValid = computed(() => {
  return signerName.value.trim()
    && signerEmail.value.trim()
    && agreedToTerms.value
    && signatureData.value
})

// Submit waiver
const submitWaiver = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true
  error.value = null

  try {
    // TODO: Implement actual API call to save waiver
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    submitted.value = true
  } catch (err) {
    error.value = 'Failed to submit waiver. Please try again.'
    console.error('Waiver submission error:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Default waiver text
const defaultWaiverText = `I, the undersigned, acknowledge that the use of rental equipment involves inherent risks. I voluntarily assume all risks associated with the use of the rented equipment.

I hereby release and hold harmless the rental company, its owners, employees, and agents from any and all liability, claims, demands, or causes of action arising from the use of the equipment.

I agree to follow all safety rules and guidelines, including providing adult supervision, not exceeding capacity limits, and discontinuing use during adverse weather conditions.

I understand that I am financially responsible for any damage to the rented equipment during the rental period.

By signing below, I acknowledge that I have read this waiver, fully understand its terms, and am signing freely and voluntarily.`
</script>

<template>
  <section
    class="waiver-section"
    :style="{ backgroundColor: data.backgroundColor || '#f9fafb' }"
  >
    <div class="waiver-container">
      <!-- Success State -->
      <div
        v-if="submitted"
        class="success-state"
      >
        <div class="success-icon">
          <UIcon name="i-lucide-check-circle" />
        </div>
        <h2>Waiver Signed Successfully!</h2>
        <p>Thank you for signing the waiver. A copy has been sent to {{ signerEmail }}.</p>
        <UButton
          icon="i-lucide-arrow-left"
          label="Return to Booking"
          @click="submitted = false"
        />
      </div>

      <!-- Waiver Form -->
      <div
        v-else
        class="waiver-form"
      >
        <div class="waiver-header">
          <h1>{{ data.title || 'Liability Waiver & Release' }}</h1>
          <p>{{ data.subtitle || 'Please read and sign the waiver below' }}</p>
        </div>

        <!-- Booking Lookup -->
        <div
          v-if="data.showBookingLookup !== false"
          class="booking-lookup"
        >
          <label>Booking Number (Optional)</label>
          <UInput
            v-model="bookingNumber"
            placeholder="Enter your booking number"
            icon="i-lucide-hash"
          />
          <span class="field-hint">Pre-fill your information from an existing booking</span>
        </div>

        <!-- Waiver Content -->
        <div class="waiver-content">
          <h3>
            {{ data.businessName || 'Company' }} Equipment Rental Agreement
          </h3>
          <div
            class="waiver-text"
            :contenteditable="editable"
            @input="editable && emit('update', 'waiverText', ($event.target as HTMLElement).innerText)"
          >
            {{ data.waiverText || defaultWaiverText }}
          </div>
        </div>

        <!-- Signer Information -->
        <div class="signer-info">
          <h3>Signer Information</h3>

          <div class="form-row">
            <div class="form-group">
              <label>Full Name <span class="required">*</span></label>
              <UInput
                v-model="signerName"
                placeholder="Your full legal name"
                :disabled="editable"
              />
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <UInput
                v-model="signerEmail"
                type="email"
                placeholder="your@email.com"
                :disabled="editable"
              />
            </div>
          </div>
        </div>

        <!-- Signature Pad -->
        <div class="signature-section">
          <h3>Electronic Signature</h3>

          <div class="signature-pad">
            <canvas
              ref="signatureCanvas"
              width="500"
              height="150"
              :class="{ disabled: editable }"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart.passive="startDrawing"
              @touchmove="draw"
              @touchend="stopDrawing"
            />
            <button
              v-if="signatureData && !editable"
              class="clear-btn"
              @click="clearSignature"
            >
              <UIcon name="i-lucide-eraser" />
              Clear
            </button>
          </div>
          <span class="signature-hint">Sign using your mouse or finger (on touch devices)</span>
        </div>

        <!-- Agreement Checkbox -->
        <div class="agreement-section">
          <label class="checkbox-label">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              :disabled="editable"
            >
            <span>
              I have read and agree to the terms of this liability waiver and release.
              <span class="required">*</span>
            </span>
          </label>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="error-message"
        >
          <UIcon name="i-lucide-alert-circle" />
          {{ error }}
        </div>

        <!-- Submit Button -->
        <UButton
          block
          size="lg"
          :disabled="!isFormValid || editable"
          :loading="isSubmitting"
          @click="submitWaiver"
        >
          <UIcon name="i-lucide-pen-tool" />
          Sign Waiver
        </UButton>

        <p class="legal-note">
          By clicking "Sign Waiver", you agree that your electronic signature is the legal equivalent of your manual signature.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.waiver-section {
  padding: 60px 20px;
  min-height: 100vh;
}

.waiver-container {
  max-width: 700px;
  margin: 0 auto;
}

/* Success State */
.success-state {
  text-align: center;
  padding: 60px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #16a34a;
}

.success-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.success-state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

/* Waiver Form */
.waiver-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.waiver-header {
  text-align: center;
  margin-bottom: 32px;
}

.waiver-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
}

.waiver-header p {
  font-size: 16px;
  color: #666;
}

/* Booking Lookup */
.booking-lookup {
  margin-bottom: 24px;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 12px;
}

.booking-lookup label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #166534;
  margin-bottom: 8px;
}

.field-hint {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

/* Waiver Content */
.waiver-content {
  margin-bottom: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.waiver-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

.waiver-text {
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-wrap;
}

/* Signer Info */
.signer-info {
  margin-bottom: 32px;
}

.signer-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.required {
  color: #dc2626;
}

/* Signature Section */
.signature-section {
  margin-bottom: 24px;
}

.signature-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 16px;
}

.signature-pad {
  position: relative;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.signature-pad canvas {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
  touch-action: none;
}

.signature-pad canvas.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.clear-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-btn:hover {
  background: #f3f4f6;
  color: #111;
}

.signature-hint {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
  text-align: center;
}

/* Agreement */
.agreement-section {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  accent-color: #f59e0b;
}

.checkbox-label span {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 14px;
  color: #dc2626;
}

/* Legal Note */
.legal-note {
  margin-top: 16px;
  font-size: 12px;
  color: #888;
  text-align: center;
}
</style>
