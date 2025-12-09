<template>
  <section
    id="faq"
    class="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-help-circle"
            class="w-3 h-3"
          />
          <span>FAQ</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Everything you need to know about getting started with BouncePro.
        </p>
      </div>

      <!-- FAQ Grid -->
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-start gap-3">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              />
              {{ faq.question }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed pl-8">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Still have questions?
        </p>
        <UButton
          variant="outline"
          class="border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
        >
          <UIcon
            name="i-lucide-mail"
            class="w-4 h-4 mr-2"
          />
          Contact Support
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqs = [
  {
    question: 'How do I get started?',
    answer: 'Simply sign up for a free account, add your inventory items with photos and pricing, and you\'re ready to accept bookings. Our setup wizard guides you through every step.'
  },
  {
    question: 'Can I customize the booking widget?',
    answer: 'Yes! You can customize colors, fonts, and layout to match your brand. The widget works on any website and can be embedded with a simple code snippet.'
  },
  {
    question: 'Do I get free updates?',
    answer: 'All plans include free updates and new features. We\'re constantly improving based on customer feedback and adding new capabilities every month.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We integrate with Stripe to support all major credit cards. Customers can pay deposits or full amounts online, and you can also record cash payments manually.'
  },
  {
    question: 'Can I import my existing data?',
    answer: 'Yes! We can help you migrate from spreadsheets or other systems. Our team will assist with the data import to ensure a smooth transition.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level SSL encryption, are PCI compliant for payment processing, and perform regular security audits. Your data is backed up daily.'
  },
  {
    question: 'Can multiple team members use it?',
    answer: 'Yes! The Growth and Pro plans include unlimited team members with customizable permission levels. Assign staff to delivery routes and manage schedules easily.'
  },
  {
    question: 'What if I need to cancel?',
    answer: 'You can cancel anytime with no penalties. We\'ll help you export your data, and you\'ll have access until the end of your billing period.'
  }
]
</script>
