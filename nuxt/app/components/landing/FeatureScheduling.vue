<template>
  <section
    ref="sectionRef"
    class="py-20 lg:py-32 bg-gray-50 overflow-hidden"
  >
    <div class="container mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- LEFT: Text Content -->
        <div
          class="transition-all duration-1000"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
        >
          <div class="max-w-xl">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Schedule deliveries <span class="text-orange-500">with confidence</span>
            </h2>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Never double-book again. Our smart calendar keeps everything organized.
            </p>

            <!-- Feature List -->
            <ul class="space-y-4 mb-10">
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon
                    name="i-lucide-check"
                    class="text-orange-600 text-sm"
                  />
                </div>
                <span class="text-lg text-gray-700">Visual calendar with drag-and-drop scheduling</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon
                    name="i-lucide-check"
                    class="text-orange-600 text-sm"
                  />
                </div>
                <span class="text-lg text-gray-700">Route optimization for delivery crews</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon
                    name="i-lucide-check"
                    class="text-orange-600 text-sm"
                  />
                </div>
                <span class="text-lg text-gray-700">Conflict detection and availability blocking</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon
                    name="i-lucide-check"
                    class="text-orange-600 text-sm"
                  />
                </div>
                <span class="text-lg text-gray-700">SMS and email reminders for customers</span>
              </li>
            </ul>

            <!-- CTA Button -->
            <UButton
              label="See Calendar Demo"
              icon="i-lucide-calendar-days"
              size="xl"
              color="warning"
              class="shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        </div>

        <!-- RIGHT: Calendar Mockup -->
        <div
          class="transition-all duration-1000 delay-200"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'"
        >
          <div class="relative">
            <!-- Calendar Container -->
            <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 lg:p-8">
              <!-- Calendar Header -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900">
                    June 2025
                  </h3>
                  <p class="text-sm text-gray-500">
                    23 bookings this month
                  </p>
                </div>
                <div class="flex gap-2">
                  <button class="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <UIcon
                      name="i-lucide-chevron-left"
                      class="text-gray-600"
                    />
                  </button>
                  <button class="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <UIcon
                      name="i-lucide-chevron-right"
                      class="text-gray-600"
                    />
                  </button>
                </div>
              </div>

              <!-- Calendar Grid -->
              <div class="grid grid-cols-7 gap-2 mb-2">
                <!-- Day Headers -->
                <div
                  v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
                  :key="day"
                  class="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {{ day }}
                </div>

                <!-- Empty cells for calendar start -->
                <div class="aspect-square" />
                <div class="aspect-square" />

                <!-- Calendar Days -->
                <div
                  v-for="date in 28"
                  :key="date"
                  class="aspect-square rounded-lg border border-gray-200 p-1 hover:border-orange-300 transition-colors cursor-pointer relative"
                >
                  <span class="text-sm font-medium text-gray-700">{{ date }}</span>

                  <!-- Booking indicators -->
                  <div
                    v-if="[5, 8, 12, 15, 19, 22, 26].includes(date)"
                    class="absolute bottom-1 left-1 right-1 flex gap-0.5"
                  >
                    <div class="flex-1 h-1 rounded-full bg-blue-400" />
                  </div>
                  <div
                    v-if="[8, 15, 22].includes(date)"
                    class="absolute bottom-1 left-1 right-1 flex gap-0.5"
                  >
                    <div class="flex-1 h-1 rounded-full bg-blue-400" />
                    <div class="flex-1 h-1 rounded-full bg-purple-400" />
                  </div>
                  <div
                    v-if="date === 12"
                    class="absolute inset-0 bg-orange-500/10 rounded-lg border-2 border-orange-500"
                  >
                    <span class="text-sm font-bold text-orange-600">{{ date }}</span>
                  </div>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex items-center gap-6 pt-4 border-t border-gray-200">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-blue-400" />
                  <span class="text-sm text-gray-600">Confirmed</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-purple-400" />
                  <span class="text-sm text-gray-600">Pending</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full bg-orange-500" />
                  <span class="text-sm text-gray-600">Selected</span>
                </div>
              </div>

              <!-- Upcoming Deliveries Panel -->
              <div class="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UIcon
                    name="i-lucide-truck"
                    class="text-orange-500"
                  />
                  Today's Deliveries
                </h4>
                <div class="space-y-3">
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-semibold text-gray-900">9:00 AM - 11:00 AM</span>
                      <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">On Route</span>
                    </div>
                    <p class="text-sm text-gray-600">
                      Princess Castle → 123 Party Lane
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Sarah Johnson • (555) 123-4567
                    </p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-gray-200">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-sm font-semibold text-gray-900">1:00 PM - 3:00 PM</span>
                      <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Scheduled</span>
                    </div>
                    <p class="text-sm text-gray-600">
                      Water Slide XL → 456 Fun Street
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Mike Davis • (555) 987-6543
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Badge -->
            <div class="absolute -top-4 -left-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full shadow-lg transform -rotate-12">
              <span class="text-sm font-semibold">Smart Scheduling</span>
            </div>

            <!-- Notification Badge -->
            <div class="absolute top-4 -right-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div class="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span class="text-xs font-semibold">3 New Bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sectionRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px'
    }
  )

  observer.observe(sectionRef.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
