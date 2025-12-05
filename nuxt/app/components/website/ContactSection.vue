<script setup lang="ts">
defineProps<{
  phone?: string
  email?: string
  address?: { street?: string, city?: string, state?: string, zip?: string }
  businessHours?: Record<string, { enabled: boolean, open: string, close: string }>
}>()

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

function formatTime(time: string): string {
  if (!time) return ''

  // Handle HH:MM format
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

function getFullAddress(address?: { street?: string, city?: string, state?: string, zip?: string }): string {
  if (!address) return ''

  const parts = []
  if (address.street) parts.push(address.street)

  const cityStateZip = []
  if (address.city) cityStateZip.push(address.city)
  if (address.state) cityStateZip.push(address.state)
  if (address.zip) cityStateZip.push(address.zip)

  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '))
  }

  return parts.join('\n')
}
</script>

<template>
  <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12">
        Get In Touch
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Contact Information -->
        <div class="space-y-6">
          <UCard>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>

            <div class="space-y-4">
              <!-- Phone -->
              <div
                v-if="phone"
                class="flex items-start gap-4"
              >
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-phone"
                    class="text-primary-600 dark:text-primary-400 text-xl"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Phone
                  </p>
                  <a
                    :href="`tel:${phone}`"
                    class="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {{ phone }}
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div
                v-if="email"
                class="flex items-start gap-4"
              >
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-mail"
                    class="text-primary-600 dark:text-primary-400 text-xl"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <a
                    :href="`mailto:${email}`"
                    class="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all"
                  >
                    {{ email }}
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div
                v-if="address && (address.street || address.city)"
                class="flex items-start gap-4"
              >
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-map-pin"
                    class="text-primary-600 dark:text-primary-400 text-xl"
                  />
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Address
                  </p>
                  <p class="text-gray-900 dark:text-white whitespace-pre-line">
                    {{ getFullAddress(address) }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Business Hours -->
        <div>
          <UCard>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Business Hours
            </h3>

            <div
              v-if="!businessHours || Object.keys(businessHours).length === 0"
              class="text-center py-8"
            >
              <UIcon
                name="i-lucide-clock"
                class="text-4xl text-gray-300 dark:text-gray-600 mb-2"
              />
              <p class="text-gray-500 dark:text-gray-400">
                No business hours set
              </p>
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span class="font-medium text-gray-900 dark:text-white capitalize">
                  {{ dayLabels[day] }}
                </span>

                <span
                  v-if="businessHours[day]?.enabled"
                  class="text-gray-600 dark:text-gray-300"
                >
                  {{ formatTime(businessHours[day].open) }} - {{ formatTime(businessHours[day].close) }}
                </span>

                <span
                  v-else
                  class="text-gray-400 dark:text-gray-500"
                >
                  Closed
                </span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </section>
</template>
