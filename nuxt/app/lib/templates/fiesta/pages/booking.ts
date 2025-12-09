/**
 * Fiesta Template - Booking Page
 */

import type { TemplatePage } from '../../types'

const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Booking',
  slug: '/booking',
  title: 'Book Your Rental',
  sections: [
    {
      id: 'booking-header',
      name: 'Booking Header',
      html: `
<section class="py-16 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Book Your Rental
    </h1>
    <p class="text-xl text-orange-100 max-w-2xl mx-auto">
      Reserve your party equipment in just a few clicks
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-16 bg-gradient-to-b from-amber-50 to-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        <!-- Smart Block: Booking Widget -->
        <div data-smart-block="booking-widget"></div>
      </div>

      <!-- Trust badges -->
      <div class="mt-10 flex flex-wrap justify-center gap-8">
        <div class="flex items-center gap-3 text-slate-600">
          <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span class="font-medium">Secure Booking</span>
        </div>
        <div class="flex items-center gap-3 text-slate-600">
          <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          <span class="font-medium">Easy Payments</span>
        </div>
        <div class="flex items-center gap-3 text-slate-600">
          <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span class="font-medium">Instant Confirmation</span>
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
      <h2 class="text-3xl font-bold text-slate-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <div class="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <h3 class="font-bold text-slate-900 text-lg mb-2">How far in advance should I book?</h3>
          <p class="text-slate-600">We recommend booking 1-2 weeks ahead, especially for weekends. Popular items go fast!</p>
        </div>

        <div class="bg-rose-50 rounded-xl p-6 border border-rose-100">
          <h3 class="font-bold text-slate-900 text-lg mb-2">What if it rains?</h3>
          <p class="text-slate-600">We offer free rescheduling or full refunds for weather-related cancellations.</p>
        </div>

        <div class="bg-teal-50 rounded-xl p-6 border border-teal-100">
          <h3 class="font-bold text-slate-900 text-lg mb-2">Do you handle setup?</h3>
          <p class="text-slate-600">Yes! We handle delivery, professional setup, and pickup. You just need a flat area and power outlet.</p>
        </div>

        <div class="bg-violet-50 rounded-xl p-6 border border-violet-100">
          <h3 class="font-bold text-slate-900 text-lg mb-2">What about deposits?</h3>
          <p class="text-slate-600">A small deposit secures your date, with the balance due on delivery. We accept all major cards.</p>
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
