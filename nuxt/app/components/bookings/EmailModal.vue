<script setup lang="ts">
const props = defineProps<{
  booking: {
    id: string
    bookingNumber: string
    customer: {
      name: string
      email: string
    }
    item: {
      name: string
    }
    status: string
  }
}>()

const emit = defineEmits<{
  close: []
  sent: []
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const toast = useToast()

// Form state
const emailType = ref<'confirmation' | 'reminder' | 'custom'>('confirmation')
const recipientEmail = ref(props.booking.customer.email)
const recipientName = ref(props.booking.customer.name)
const subject = ref('')
const customMessage = ref('')
const isSending = ref(false)

// Email type options
const emailTypeOptions = [
  {
    value: 'confirmation',
    label: 'Booking Confirmation',
    description: 'Send booking confirmation with event details',
    icon: 'i-lucide-check-circle'
  },
  {
    value: 'reminder',
    label: 'Event Reminder',
    description: 'Remind customer about upcoming event',
    icon: 'i-lucide-bell'
  },
  {
    value: 'custom',
    label: 'Custom Message',
    description: 'Send a custom message to the customer',
    icon: 'i-lucide-mail'
  }
]

// Update subject when email type changes
watch(emailType, (newType) => {
  switch (newType) {
    case 'confirmation':
      subject.value = `Booking Confirmation - ${props.booking.bookingNumber}`
      break
    case 'reminder':
      subject.value = `Event Reminder - ${props.booking.item.name}`
      break
    case 'custom':
      subject.value = `Update for booking ${props.booking.bookingNumber}`
      break
  }
})

// Initialize subject
onMounted(() => {
  subject.value = `Booking Confirmation - ${props.booking.bookingNumber}`
})

// Check if Brevo is configured (will be determined by API response)
const isBrevoConfigured = ref(true) // Optimistically assume it's configured

// Send email
const sendEmail = async () => {
  if (!recipientEmail.value) {
    toast.add({
      title: 'Error',
      description: 'Recipient email is required',
      color: 'error'
    })
    return
  }

  // Fallback to mailto if Brevo not configured
  if (!isBrevoConfigured.value) {
    const mailtoLink = `mailto:${recipientEmail.value}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(customMessage.value || `Hi ${recipientName.value},\n\nThis is regarding your booking ${props.booking.bookingNumber}.\n\nBest regards`)}`
    window.location.href = mailtoLink

    toast.add({
      title: 'Email Client Opened',
      description: 'Your default email client should open with a pre-filled message',
      color: 'info'
    })

    isOpen.value = false
    emit('close')
    return
  }

  isSending.value = true

  try {
    await $fetch('/api/email/send-booking-email', {
      method: 'POST',
      body: {
        bookingId: props.booking.id,
        emailType: emailType.value,
        subject: subject.value,
        customMessage: customMessage.value,
        recipientEmail: recipientEmail.value,
        recipientName: recipientName.value
      }
    })

    toast.add({
      title: 'Email Sent',
      description: `${emailTypeOptions.find(opt => opt.value === emailType.value)?.label} sent to ${recipientEmail.value}`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    emit('sent')
    isOpen.value = false
  } catch (error: unknown) {
    console.error('Failed to send email:', error)

    // Check if this is a Brevo configuration error
    const errorData = error && typeof error === 'object' && 'data' in error ? (error as Record<string, unknown>).data as Record<string, unknown> : undefined
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error as Record<string, unknown>).statusCode : undefined

    if (errorData?.fallback === 'mailto' || statusCode === 503) {
      isBrevoConfigured.value = false
      toast.add({
        title: 'Email Service Not Configured',
        description: 'Opening your email client instead...',
        color: 'warning',
        icon: 'i-lucide-alert-triangle'
      })

      // Automatically open email client as fallback
      setTimeout(() => {
        openEmailClient()
      }, 500)
    } else {
      toast.add({
        title: 'Failed to Send Email',
        description: (errorData?.message as string) || 'Please try again or use the email link below to contact the customer',
        color: 'error',
        icon: 'i-lucide-alert-circle'
      })
    }
  } finally {
    isSending.value = false
  }
}

// Quick mailto fallback
const openEmailClient = () => {
  const mailtoLink = `mailto:${recipientEmail.value}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(customMessage.value || `Hi ${recipientName.value},\n\nThis is regarding your booking ${props.booking.bookingNumber}.\n\nBest regards`)}`
  window.location.href = mailtoLink
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Send Email"
    :description="`Booking ${booking.bookingNumber}`"
    class="sm:max-w-2xl"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <UIcon
            name="i-lucide-mail"
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Send Email
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Booking {{ booking.bookingNumber }}
          </p>
        </div>
      </div>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Email Type Selection -->
        <UFormField
          label="Email Type"
          required
        >
          <div class="space-y-2">
            <label
              v-for="option in emailTypeOptions"
              :key="option.value"
              class="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:border-gray-400 dark:hover:border-gray-500"
              :class="emailType === option.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                : 'border-gray-200 dark:border-gray-700'"
            >
              <input
                v-model="emailType"
                type="radio"
                :value="option.value"
                class="mt-1"
              >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <UIcon
                    :name="option.icon"
                    class="w-4 h-4"
                  />
                  <span class="font-medium text-gray-900 dark:text-white">{{ option.label }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ option.description }}</p>
              </div>
            </label>
          </div>
        </UFormField>

        <!-- Recipient -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField
            label="Recipient Name"
            required
          >
            <UInput
              v-model="recipientName"
              icon="i-lucide-user"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Recipient Email"
            required
          >
            <UInput
              v-model="recipientEmail"
              type="email"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Subject -->
        <UFormField
          label="Subject"
          required
        >
          <UInput
            v-model="subject"
            icon="i-lucide-text"
            class="w-full"
          />
        </UFormField>

        <!-- Custom Message (optional) -->
        <UFormField
          label="Additional Message"
          help="Optional custom message to include in the email"
        >
          <UTextarea
            v-model="customMessage"
            :rows="4"
            placeholder="Add any special instructions or notes..."
            class="w-full"
          />
        </UFormField>

        <!-- Warning if Brevo not configured -->
        <div
          v-if="!isBrevoConfigured"
          class="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800"
        >
          <div class="flex gap-3">
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
            />
            <div class="flex-1">
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Email Service Not Configured
              </p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                The Brevo email service is not configured. Clicking "Send Email" will open your default email client instead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-4">
        <!-- Mailto fallback link -->
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-external-link"
          @click="openEmailClient"
        >
          Open Email Client
        </UButton>

        <div class="flex items-center gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="isOpen = false"
          >
            Cancel
          </UButton>
          <UButton
            :loading="isSending"
            :disabled="!recipientEmail || !subject"
            icon="i-lucide-send"
            @click="sendEmail"
          >
            Send Email
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
