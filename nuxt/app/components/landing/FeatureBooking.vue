<template>
  <section ref="sectionRef" class="py-20 lg:py-32 bg-white overflow-hidden">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- LEFT: Dashboard Mockup -->
        <div
          class="order-2 lg:order-1 transition-all duration-1000"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'"
        >
          <div class="relative">
            <!-- Dashboard Container -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl border border-gray-200 p-6 lg:p-8">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <UIcon name="i-lucide-activity" class="text-white text-xl" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Dashboard</h3>
                    <p class="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <div class="w-2 h-2 rounded-full bg-red-400"></div>
                  <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div class="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Revenue</span>
                    <UIcon name="i-lucide-trending-up" class="text-green-500" />
                  </div>
                  <p class="text-2xl font-bold text-gray-900">$12,450</p>
                  <p class="text-xs text-green-600 mt-1">+23% from last month</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">Bookings</span>
                    <UIcon name="i-lucide-calendar" class="text-blue-500" />
                  </div>
                  <p class="text-2xl font-bold text-gray-900">87</p>
                  <p class="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
              </div>

              <!-- Chart Area -->
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-semibold text-gray-900">Booking Trends</h4>
                  <span class="text-xs text-gray-500">Weekly</span>
                </div>
                <div class="flex items-end justify-between h-32 gap-2">
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 45%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 65%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 80%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 90%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 70%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 85%"></div>
                  <div class="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style="height: 95%"></div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Recent Bookings</h4>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <UIcon name="i-lucide-castle" class="text-purple-600 text-sm" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">Princess Castle</p>
                      <p class="text-xs text-gray-500">Sarah Johnson</p>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">$450</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UIcon name="i-lucide-waves" class="text-blue-600 text-sm" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">Water Slide XL</p>
                      <p class="text-xs text-gray-500">Mike Davis</p>
                    </div>
                    <span class="text-sm font-semibold text-gray-900">$650</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Badge -->
            <div class="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
              <span class="text-sm font-semibold">Live Updates</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Text Content -->
        <div
          class="order-1 lg:order-2 transition-all duration-1000 delay-200"
          :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'"
        >
          <div class="max-w-xl">
            <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Know your customers, <span class="text-orange-500">grow your business</span>
            </h2>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Get real-time insights into your bookings, revenue, and customer behavior
            </p>

            <!-- Feature List -->
            <ul class="space-y-4 mb-10">
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon name="i-lucide-check" class="text-orange-600 text-sm" />
                </div>
                <span class="text-lg text-gray-700">Dashboard with booking analytics at a glance</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon name="i-lucide-check" class="text-orange-600 text-sm" />
                </div>
                <span class="text-lg text-gray-700">Track revenue trends and popular rental items</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon name="i-lucide-check" class="text-orange-600 text-sm" />
                </div>
                <span class="text-lg text-gray-700">Customer profiles with booking history</span>
              </li>
              <li class="flex items-start gap-4">
                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1">
                  <UIcon name="i-lucide-check" class="text-orange-600 text-sm" />
                </div>
                <span class="text-lg text-gray-700">Automated email notifications and reminders</span>
              </li>
            </ul>

            <!-- CTA Button -->
            <UButton
              label="Explore Dashboard"
              icon="i-lucide-bar-chart-3"
              size="xl"
              color="orange"
              class="shadow-lg hover:shadow-xl transition-shadow"
            />
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
