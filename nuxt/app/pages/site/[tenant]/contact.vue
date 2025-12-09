<script setup lang="ts">
definePageMeta({
  layout: 'booking'
})

interface Tenant {
  id: string
  name: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
}

const route = useRoute()
const tenantSlug = route.params.tenant as string
const toast = useToast()

// Fetch tenant
const { data: tenant, error: tenantError } = await useFetch<Tenant>(`/api/tenants-public/${tenantSlug}`)

if (tenantError.value || !tenant.value) {
  await navigateTo('/404')
}

// Set SEO meta tags
useSeoMeta({
  title: `Contact Us - ${tenant.value?.name || 'Party Rentals'}`,
  description: `Get in touch with ${tenant.value?.name}. Contact us for questions about bounce house rentals and party equipment.`
})

// Contact form state
const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)

// Subject options
const subjectItems = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Booking Question', value: 'booking' },
  { label: 'Pricing Information', value: 'pricing' },
  { label: 'Availability Check', value: 'availability' },
  { label: 'Cancellation Request', value: 'cancellation' },
  { label: 'Other', value: 'other' }
]

// Format phone number
const formatPhone = (phone: string) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

const onPhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  formData.value.phone = formatPhone(input.value)
}

// Submit contact form - sends to tenant via notification system
const submitForm = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    toast.add({
      title: 'Missing Information',
      description: 'Please fill in all required fields.',
      color: 'error'
    })
    return
  }

  isSubmitting.value = true

  try {
    // Send contact message via notification/email system
    await $fetch('/public/contact', {
      method: 'POST',
      body: {
        tenantId: tenant.value?.id,
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        subject: formData.value.subject || 'general',
        message: formData.value.message
      }
    })

    isSubmitted.value = true
    toast.add({
      title: 'Message Sent',
      description: 'Thank you for your message. We will get back to you soon!',
      color: 'success'
    })

    // Reset form
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    v-if="tenant"
    class="max-w-4xl mx-auto"
  >
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
      <NuxtLink
        :to="`/book/${tenantSlug}`"
        class="hover:text-orange-600"
      >Rentals</NuxtLink>
      <UIcon
        name="i-lucide-chevron-right"
        class="w-4 h-4"
      />
      <span class="text-gray-900 dark:text-white">Contact</span>
    </nav>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Contact Us
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-12">
      Have a question or want to learn more? Send us a message and we'll get back to you as soon as possible.
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <div
          v-if="isSubmitted"
          class="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 text-center"
        >
          <UIcon
            name="i-lucide-check-circle"
            class="w-16 h-16 text-green-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Message Sent!
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for reaching out. We'll respond to your message as soon as possible.
          </p>
          <UButton
            label="Send Another Message"
            @click="isSubmitted = false"
          />
        </div>

        <form
          v-else
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
          @submit.prevent="submitForm"
        >
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField
                label="Your Name"
                required
              >
                <UInput
                  v-model="formData.name"
                  placeholder="John Doe"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Email Address"
                required
              >
                <UInput
                  v-model="formData.email"
                  type="email"
                  placeholder="john@example.com"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField
                label="Phone Number"
                hint="Optional"
              >
                <UInput
                  v-model="formData.phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  size="lg"
                  class="w-full"
                  @input="onPhoneInput"
                />
              </UFormField>

              <UFormField label="Subject">
                <USelect
                  v-model="formData.subject"
                  :items="subjectItems"
                  placeholder="Select a subject"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              label="Your Message"
              required
            >
              <UTextarea
                v-model="formData.message"
                placeholder="How can we help you?"
                :rows="6"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              size="lg"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              block
            >
              Send Message
            </UButton>
          </div>
        </form>
      </div>

      <!-- Contact Info Sidebar -->
      <div class="space-y-6">
        <div
          v-if="tenant.phone"
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-phone"
                class="text-orange-600"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Phone
            </h3>
          </div>
          <a
            :href="`tel:${tenant.phone}`"
            class="text-gray-600 dark:text-gray-400 hover:text-orange-600"
          >
            {{ formatPhone(tenant.phone) }}
          </a>
        </div>

        <div
          v-if="tenant.email"
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-mail"
                class="text-orange-600"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Email
            </h3>
          </div>
          <a
            :href="`mailto:${tenant.email}`"
            class="text-gray-600 dark:text-gray-400 hover:text-orange-600 break-all"
          >
            {{ tenant.email }}
          </a>
        </div>

        <div
          v-if="tenant.address"
          class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-map-pin"
                class="text-orange-600"
              />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              Location
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            <span v-if="tenant.address.street">{{ tenant.address.street }}<br></span>
            {{ tenant.address.city }}<span v-if="tenant.address.city && tenant.address.state">, </span>{{ tenant.address.state }} {{ tenant.address.zip }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
