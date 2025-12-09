<template>
  <section class="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-star"
            class="w-3 h-3"
          />
          <span>TESTIMONIALS</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Loved by Rental Business Owners
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          See why hundreds of party rental companies trust BouncePro to run their operations.
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
        >
          <!-- Stars -->
          <div class="flex gap-1 mb-4">
            <UIcon
              v-for="i in 5"
              :key="i"
              name="i-lucide-star"
              class="w-5 h-5 text-amber-400 fill-current"
            />
          </div>

          <!-- Quote -->
          <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            "{{ testimonial.quote }}"
          </p>

          <!-- Author -->
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
              :class="testimonial.avatarBg"
            >
              {{ testimonial.initials }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ testimonial.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ testimonial.company }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="mt-16 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Rated 4.9/5 based on 127+ reviews
        </p>
        <div class="flex justify-center items-center gap-8 flex-wrap">
          <div class="flex items-center gap-2 text-gray-400">
            <UIcon
              name="i-lucide-shield-check"
              class="w-5 h-5"
            />
            <span class="text-sm">SSL Secured</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <UIcon
              name="i-lucide-credit-card"
              class="w-5 h-5"
            />
            <span class="text-sm">PCI Compliant</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400">
            <UIcon
              name="i-lucide-clock"
              class="w-5 h-5"
            />
            <span class="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    name: 'Sarah Johnson',
    company: 'Fun Times Rentals, Florida',
    quote: 'BouncePro transformed our business. We went from juggling phone calls and spreadsheets to having everything automated. Our customers love the online booking!',
    initials: 'SJ',
    avatarBg: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  {
    name: 'Mike Chen',
    company: 'Bounce Kingdom, California',
    quote: 'The inventory tracking alone is worth the price. I always know what\'s available, what\'s out, and what needs maintenance. No more double-bookings!',
    initials: 'MC',
    avatarBg: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    name: 'Jessica Martinez',
    company: 'Party Perfect Rentals, Texas',
    quote: 'I was hesitant to switch from our old system, but the migration was seamless. The team helped us every step of the way. Best decision we made!',
    initials: 'JM',
    avatarBg: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    name: 'David Williams',
    company: 'Jump Around LLC, Arizona',
    quote: 'The embeddable widget is a game-changer. We added it to our website and bookings increased by 40% in the first month. It just works.',
    initials: 'DW',
    avatarBg: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    name: 'Amanda Taylor',
    company: 'Happy Bouncers, Georgia',
    quote: 'Customer support is incredible. Any time I have a question, they respond within minutes. They actually care about helping us succeed.',
    initials: 'AT',
    avatarBg: 'bg-gradient-to-br from-pink-400 to-pink-600'
  },
  {
    name: 'Robert Kim',
    company: 'Inflatable Adventures, Nevada',
    quote: 'We manage 50+ inflatables and the scheduling used to be a nightmare. Now it\'s all automated and I can see everything from my phone.',
    initials: 'RK',
    avatarBg: 'bg-gradient-to-br from-amber-400 to-amber-600'
  }
]
</script>
