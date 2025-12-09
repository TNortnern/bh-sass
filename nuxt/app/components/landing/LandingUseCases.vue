<template>
  <section
    id="use-cases"
    class="py-24 bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-briefcase"
            class="w-3 h-3"
          />
          <span>WHO IT'S FOR</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Built for Party Rental Professionals
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Whether you're just starting out or running a fleet of inflatables, BouncePro scales with your business.
        </p>
      </div>

      <!-- Use Cases Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div
          v-for="useCase in useCases"
          :key="useCase.title"
          class="relative p-8 rounded-2xl bg-gradient-to-br border transition-all duration-300"
          :class="useCase.gradient"
        >
          <!-- Icon -->
          <div class="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-6">
            <UIcon
              :name="useCase.icon"
              class="w-8 h-8"
              :class="useCase.iconColor"
            />
          </div>

          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ useCase.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {{ useCase.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-6">
            <div
              v-for="stat in useCase.stats"
              :key="stat.label"
            >
              <p
                class="text-2xl font-bold"
                :class="useCase.statColor"
              >
                {{ stat.value }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Equipment Types -->
      <div class="mt-20 max-w-4xl mx-auto">
        <h3 class="text-center text-lg font-semibold text-gray-900 dark:text-white mb-8">
          Manage All Types of Party Rental Equipment
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div
            v-for="equipment in equipmentTypes"
            :key="equipment.name"
            class="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
          >
            <UIcon
              :name="equipment.icon"
              class="w-8 h-8 text-orange-500 mb-2"
            />
            <span class="text-sm text-gray-600 dark:text-gray-300 text-center">{{ equipment.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const useCases = [
  {
    title: 'Solo Operators',
    description: 'Running your rental business by yourself? BouncePro automates scheduling, payments, and customer communication so you can focus on deliveries.',
    icon: 'i-lucide-user',
    iconColor: 'text-orange-600',
    gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-100 dark:border-orange-900',
    statColor: 'text-orange-600 dark:text-orange-400',
    stats: [
      { value: '10+', label: 'hrs saved/week' },
      { value: '0', label: 'double bookings' }
    ]
  },
  {
    title: 'Growing Teams',
    description: 'As your team grows, coordinate staff schedules, route deliveries efficiently, and give employees the tools they need.',
    icon: 'i-lucide-users',
    iconColor: 'text-blue-600',
    gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900',
    statColor: 'text-blue-600 dark:text-blue-400',
    stats: [
      { value: '50%', label: 'faster setup' },
      { value: '3x', label: 'more bookings' }
    ]
  },
  {
    title: 'Multi-Location Businesses',
    description: 'Manage inventory across multiple locations or warehouses. Track what\'s where and optimize your operations.',
    icon: 'i-lucide-map-pin',
    iconColor: 'text-green-600',
    gradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-100 dark:border-green-900',
    statColor: 'text-green-600 dark:text-green-400',
    stats: [
      { value: '100%', label: 'visibility' },
      { value: '24/7', label: 'access' }
    ]
  },
  {
    title: 'Event Companies',
    description: 'Full-service event companies can manage bounce houses alongside tables, chairs, and other party equipment all in one system.',
    icon: 'i-lucide-party-popper',
    iconColor: 'text-purple-600',
    gradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-100 dark:border-purple-900',
    statColor: 'text-purple-600 dark:text-purple-400',
    stats: [
      { value: '∞', label: 'item types' },
      { value: '1', label: 'platform' }
    ]
  }
]

const equipmentTypes = [
  { name: 'Bounce Houses', icon: 'i-lucide-castle' },
  { name: 'Water Slides', icon: 'i-lucide-droplets' },
  { name: 'Obstacle Courses', icon: 'i-lucide-trophy' },
  { name: 'Combo Units', icon: 'i-lucide-layers' },
  { name: 'Tables & Chairs', icon: 'i-lucide-armchair' },
  { name: 'Concessions', icon: 'i-lucide-candy' }
]
</script>
