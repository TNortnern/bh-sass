/**
 * Luxe Template - Booking Page
 * Sophisticated booking experience
 */

import type { TemplatePage } from '../../types'

const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Booking',
  slug: '/booking',
  title: 'Reserve Your Date',
  sections: [
    {
      id: 'booking-header',
      name: 'Booking Header',
      html: `
<section class="py-20 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent"></div>

  <div class="container relative z-10 text-center">
    <div class="flex items-center justify-center gap-3 mb-6">
      <div class="w-12 h-px bg-gradient-to-l from-amber-400 to-transparent"></div>
      <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Reservations</span>
      <div class="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
    </div>
    <h1 class="text-5xl lg:text-6xl font-light text-white mb-6">
      Reserve Your <span class="font-serif italic text-amber-400">Date</span>
    </h1>
    <p class="text-xl text-stone-400 max-w-2xl mx-auto">
      Complete your reservation request below. Our concierge team will confirm availability and details.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-16 bg-stone-900">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <!-- Smart Block: Booking Widget -->
      <div class="bg-stone-950 border border-stone-800">
        <div data-smart-block="booking-widget" data-props='{"style": "luxe"}'></div>
      </div>

      <!-- Trust indicators -->
      <div class="mt-12 flex flex-wrap justify-center gap-10">
        <div class="flex items-center gap-3 text-stone-400">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span class="text-sm">Secure Reservation</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <span class="text-sm">Fully Insured</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
          <span class="text-sm">Flexible Payment</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="text-sm">Concierge Service</span>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'faq',
      name: 'FAQ',
      html: `
<section class="py-16 bg-stone-950">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-light text-white mb-10 text-center">
        Frequently Asked <span class="font-serif italic text-amber-400">Questions</span>
      </h2>

      <div class="space-y-4">
        <div class="border border-stone-800 p-6 hover:border-amber-400/30 transition-colors">
          <h3 class="text-white font-medium mb-2">How far in advance should I book?</h3>
          <p class="text-stone-400 text-sm">We recommend securing your date at least 2-4 weeks in advance, particularly for weekend events and peak season.</p>
        </div>

        <div class="border border-stone-800 p-6 hover:border-amber-400/30 transition-colors">
          <h3 class="text-white font-medium mb-2">What is your cancellation policy?</h3>
          <p class="text-stone-400 text-sm">Full refund for cancellations 7+ days before the event. Weather-related cancellations receive full credit toward a future booking.</p>
        </div>

        <div class="border border-stone-800 p-6 hover:border-amber-400/30 transition-colors">
          <h3 class="text-white font-medium mb-2">Is setup and teardown included?</h3>
          <p class="text-stone-400 text-sm">Yes, our professional team handles all setup, safety inspection, and teardown at no additional charge.</p>
        </div>

        <div class="border border-stone-800 p-6 hover:border-amber-400/30 transition-colors">
          <h3 class="text-white font-medium mb-2">What areas do you serve?</h3>
          <p class="text-stone-400 text-sm">We serve the greater metropolitan area within 50 miles. Complimentary delivery for premium bookings over $500.</p>
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
