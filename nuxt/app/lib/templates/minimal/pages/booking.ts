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
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 tracking-wide uppercase mb-6">
        <span class="w-8 h-px bg-white"></span>
        Reservations
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">Book Your Rental</h1>
      <p class="text-xl text-neutral-300 leading-relaxed">Reserve your equipment in just a few steps.</p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-widget',
      name: 'Booking Widget',
      html: `
<section class="py-24 bg-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="border border-neutral-200">
        <div data-smart-block="booking-widget"></div>
      </div>
      <div class="mt-12 grid md:grid-cols-3 gap-8">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-neutral-900 text-sm">Secure Booking</p>
            <p class="text-neutral-500 text-xs">256-bit encryption</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-neutral-900 text-sm">Easy Payments</p>
            <p class="text-neutral-500 text-xs">All major cards accepted</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div>
            <p class="font-bold text-neutral-900 text-sm">Instant Confirmation</p>
            <p class="text-neutral-500 text-xs">Email sent immediately</p>
          </div>
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
