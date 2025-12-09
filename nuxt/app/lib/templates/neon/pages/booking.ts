/**
 * Neon Template - Booking Page
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
<section class="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Book Your Rental
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto">
      Reserve your equipment in just a few clicks
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-16 bg-slate-950">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
        <!-- Smart Block: Booking Widget -->
        <div data-smart-block="booking-widget"></div>
      </div>

      <!-- Trust badges -->
      <div class="mt-10 flex flex-wrap justify-center gap-8">
        <div class="flex items-center gap-3 text-slate-400">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <span class="font-medium">Secure Booking</span>
        </div>
        <div class="flex items-center gap-3 text-slate-400">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          <span class="font-medium">Easy Payments</span>
        </div>
        <div class="flex items-center gap-3 text-slate-400">
          <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
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
<section class="py-16 bg-slate-900">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <div class="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <h3 class="font-bold text-white text-lg mb-2">How far in advance should I book?</h3>
          <p class="text-slate-400">Book 1-2 weeks ahead for best selection. Popular items go fast on weekends!</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-6 border border-pink-500/20">
          <h3 class="font-bold text-white text-lg mb-2">What if it rains?</h3>
          <p class="text-slate-400">We offer free rescheduling or full refunds for weather cancellations. No stress!</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/20">
          <h3 class="font-bold text-white text-lg mb-2">Do you handle setup?</h3>
          <p class="text-slate-400">Absolutely! We handle delivery, setup, and pickup. Just need a flat area and power.</p>
        </div>

        <div class="bg-slate-800/50 rounded-xl p-6 border border-yellow-500/20">
          <h3 class="font-bold text-white text-lg mb-2">What about deposits?</h3>
          <p class="text-slate-400">Small deposit secures your date, balance due on delivery. All major cards accepted.</p>
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
