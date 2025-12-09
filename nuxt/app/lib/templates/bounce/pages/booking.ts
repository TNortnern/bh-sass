/**
 * Bounce Template - Booking Page
 * Fun, engaging booking experience
 */

import type { TemplatePage } from '../../types'

const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Booking',
  slug: '/booking',
  title: 'Book Your Party',
  sections: [
    {
      id: 'booking-header',
      name: 'Booking Header',
      html: `
<section class="relative py-16 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-10 left-10 text-7xl">🎈</div>
    <div class="absolute bottom-10 right-10 text-7xl">🎉</div>
  </div>

  <div class="container relative z-10 text-center">
    <span class="text-5xl mb-4 block">📅</span>
    <h1 class="text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-lg">
      Let's Get This Party Started!
    </h1>
    <p class="text-xl text-white/90 max-w-2xl mx-auto">
      Pick your date, choose your bounce, and get ready for some serious fun!
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-16 bg-gradient-to-b from-white to-purple-50">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <!-- Smart Block: Booking Widget -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div data-smart-block="booking-widget"></div>
      </div>

      <!-- Trust badges -->
      <div class="mt-10 flex flex-wrap justify-center gap-8">
        <div class="flex items-center gap-3 text-gray-600">
          <span class="text-3xl">🔒</span>
          <span class="font-semibold">Secure Booking</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600">
          <span class="text-3xl">💳</span>
          <span class="font-semibold">Easy Payments</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600">
          <span class="text-3xl">📧</span>
          <span class="font-semibold">Instant Confirmation</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600">
          <span class="text-3xl">🎉</span>
          <span class="font-semibold">Party Guarantee</span>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-faq',
      name: 'Booking FAQ',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-black text-gray-900 mb-8 text-center">
        Common Questions 🤔
      </h2>

      <div class="space-y-4">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 class="font-bold text-gray-900 text-lg mb-2">How far in advance should I book?</h3>
          <p class="text-gray-600">We recommend booking at least 1-2 weeks ahead, especially for weekends! Popular items go fast during peak season.</p>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
          <h3 class="font-bold text-gray-900 text-lg mb-2">What if it rains?</h3>
          <p class="text-gray-600">Don't worry! If weather doesn't cooperate, we offer free rescheduling or a full refund. No rain, no stress! ☔</p>
        </div>

        <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6">
          <h3 class="font-bold text-gray-900 text-lg mb-2">Do you set everything up?</h3>
          <p class="text-gray-600">Absolutely! We handle delivery, setup, and pickup. All you need is a flat area and a power outlet. Easy peasy! 🎉</p>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
          <h3 class="font-bold text-gray-900 text-lg mb-2">What about deposits?</h3>
          <p class="text-gray-600">We take a small deposit to secure your date, with the balance due on delivery day. We accept all major cards!</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default bookingPage
