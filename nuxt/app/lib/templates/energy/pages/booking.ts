/**
 * Energy Template - Booking Page
 * Fast, action-oriented booking experience
 */

import type { TemplatePage } from '../../types'

const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Booking',
  slug: '/booking',
  title: 'Book Now',
  sections: [
    {
      id: 'booking-header',
      name: 'Booking Header',
      html: `
<section class="py-16 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-blue-600/10"></div>

  <div class="container relative z-10 text-center">
    <h1 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">
      Book <span class="text-orange-500">Now</span>
    </h1>
    <p class="text-xl text-stone-400">
      Lock in your date. Bring the energy.
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
        <div data-smart-block="booking-widget" data-props='{"style": "energy"}'></div>
      </div>

      <!-- Trust indicators -->
      <div class="mt-10 flex flex-wrap justify-center gap-8">
        <div class="flex items-center gap-3 text-stone-400">
          <div class="w-10 h-10 bg-orange-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <span class="text-sm font-bold uppercase">Secure</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <div class="w-10 h-10 bg-blue-600/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <span class="text-sm font-bold uppercase">Insured</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <div class="w-10 h-10 bg-cyan-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="text-sm font-bold uppercase">Fast Setup</span>
        </div>
        <div class="flex items-center gap-3 text-stone-400">
          <div class="w-10 h-10 bg-green-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span class="text-sm font-bold uppercase">Guaranteed</span>
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
      <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-8 text-center">
        Quick <span class="text-orange-500">FAQ</span>
      </h2>

      <div class="space-y-4">
        <div class="bg-stone-900 border-l-4 border-orange-600 p-6">
          <h3 class="text-white font-bold mb-2">How far ahead should I book?</h3>
          <p class="text-stone-400 text-sm">Weekends fill up fast! Book 1-2 weeks ahead for best selection.</p>
        </div>

        <div class="bg-stone-900 border-l-4 border-blue-600 p-6">
          <h3 class="text-white font-bold mb-2">What's your cancellation policy?</h3>
          <p class="text-stone-400 text-sm">Full refund up to 48 hours before. Weather cancellations always get full credit.</p>
        </div>

        <div class="bg-stone-900 border-l-4 border-cyan-500 p-6">
          <h3 class="text-white font-bold mb-2">Do you handle setup?</h3>
          <p class="text-stone-400 text-sm">100%. We deliver, set up, and pick up. You just enjoy the party.</p>
        </div>

        <div class="bg-stone-900 border-l-4 border-green-500 p-6">
          <h3 class="text-white font-bold mb-2">What space do I need?</h3>
          <p class="text-stone-400 text-sm">Each listing shows exact dimensions. Generally need flat ground + power outlet nearby.</p>
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
