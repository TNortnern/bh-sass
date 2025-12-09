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
<section class="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">Book Your Rental</h1>
    <p class="text-xl text-emerald-100 max-w-2xl mx-auto">Reserve your equipment in minutes</p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-16 bg-gradient-to-b from-stone-50 to-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
        <div data-smart-block="booking-widget"></div>
      </div>
      <div class="mt-10 flex flex-wrap justify-center gap-8">
        <div class="flex items-center gap-3 text-stone-600"><svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg><span class="font-medium">Secure Booking</span></div>
        <div class="flex items-center gap-3 text-stone-600"><svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg><span class="font-medium">Easy Payments</span></div>
        <div class="flex items-center gap-3 text-stone-600"><svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span class="font-medium">Instant Confirmation</span></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default bookingPage
