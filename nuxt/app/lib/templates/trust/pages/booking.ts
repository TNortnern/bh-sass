/**
 * Trust Template - Booking Page
 * Professional, clear booking experience
 */

import type { TemplatePage } from '../../types'

const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Booking',
  slug: '/booking',
  title: 'Book Your Rental',
  sections: [
    {
      id: 'header',
      name: 'Booking Header',
      html: `
<section class="py-16 bg-gradient-to-b from-sky-50 to-white">
  <div class="container">
    <div class="max-w-2xl">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>Request a Quote</span>
      </div>

      <h1 class="text-4xl font-bold text-slate-900 mb-4">
        Book Your Rental Equipment
      </h1>
      <p class="text-lg text-slate-600">
        Complete the form below to request a quote. We'll review your request and confirm availability within 2 business hours.
      </p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'booking-content',
      name: 'Booking Form & Info',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-3 gap-12">
      <!-- Booking Form - Takes 2 columns -->
      <div class="lg:col-span-2">
        <div class="bg-slate-50 rounded-xl p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">
            Rental Request Form
          </h2>

          <!-- Smart Block: Booking Widget -->
          <div data-smart-block="booking-widget" data-props='{"style": "trust", "showSteps": true}'></div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- Process Steps -->
        <div class="bg-slate-50 rounded-xl p-6">
          <h3 class="font-semibold text-slate-900 mb-4">How It Works</h3>
          <ol class="space-y-4">
            <li class="flex gap-3">
              <div class="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                1
              </div>
              <div>
                <p class="font-medium text-slate-900">Submit Request</p>
                <p class="text-sm text-slate-600">Complete the form with your event details</p>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                2
              </div>
              <div>
                <p class="font-medium text-slate-900">Receive Quote</p>
                <p class="text-sm text-slate-600">We'll confirm availability and pricing</p>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                3
              </div>
              <div>
                <p class="font-medium text-slate-900">Confirm Booking</p>
                <p class="text-sm text-slate-600">Approve quote and submit deposit</p>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                4
              </div>
              <div>
                <p class="font-medium text-slate-900">Enjoy Your Event</p>
                <p class="text-sm text-slate-600">We handle delivery, setup, and pickup</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Guarantees -->
        <div class="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 class="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Our Guarantees
          </h3>
          <ul class="space-y-2 text-sm text-green-800">
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Clean, sanitized equipment</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>On-time delivery and setup</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>$2M liability coverage</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Professional, trained staff</span>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="bg-[#1e3a5f] rounded-xl p-6 text-white">
          <h3 class="font-semibold mb-3">Questions?</h3>
          <p class="text-sky-200 text-sm mb-4">
            Our team is here to help you plan your event.
          </p>
          <div class="space-y-2 text-sm">
            <a href="tel:5551234567" class="flex items-center gap-2 text-white hover:text-sky-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              (555) 123-4567
            </a>
            <a href="mailto:info@trustrentals.com" class="flex items-center gap-2 text-white hover:text-sky-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              info@trustrentals.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'faq',
      name: 'FAQ Section',
      html: `
<section class="py-20 bg-slate-50">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <details class="bg-white rounded-lg border border-slate-200 group">
          <summary class="flex items-center justify-between p-5 cursor-pointer">
            <span class="font-medium text-slate-900">What is the booking process?</span>
            <svg class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-5 pb-5 text-slate-600">
            Submit your request through our form, and we'll confirm availability within 2 business hours. Once approved, you'll receive a quote. A 50% deposit secures your date, with the balance due on delivery day.
          </div>
        </details>

        <details class="bg-white rounded-lg border border-slate-200 group">
          <summary class="flex items-center justify-between p-5 cursor-pointer">
            <span class="font-medium text-slate-900">What's included in the rental?</span>
            <svg class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-5 pb-5 text-slate-600">
            All rentals include delivery, professional setup, and pickup. Equipment is thoroughly cleaned and inspected before each event. Blowers and any necessary accessories are provided.
          </div>
        </details>

        <details class="bg-white rounded-lg border border-slate-200 group">
          <summary class="flex items-center justify-between p-5 cursor-pointer">
            <span class="font-medium text-slate-900">What is your cancellation policy?</span>
            <svg class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-5 pb-5 text-slate-600">
            Cancellations made 7+ days before your event receive a full deposit refund. Cancellations within 7 days forfeit the deposit but can be rescheduled. Weather-related cancellations are always fully refundable.
          </div>
        </details>

        <details class="bg-white rounded-lg border border-slate-200 group">
          <summary class="flex items-center justify-between p-5 cursor-pointer">
            <span class="font-medium text-slate-900">Are you licensed and insured?</span>
            <svg class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-5 pb-5 text-slate-600">
            Yes! We are fully licensed and carry $2 million in liability insurance. We can provide certificates of insurance for venues, schools, and organizations that require them.
          </div>
        </details>

        <details class="bg-white rounded-lg border border-slate-200 group">
          <summary class="flex items-center justify-between p-5 cursor-pointer">
            <span class="font-medium text-slate-900">What are your setup requirements?</span>
            <svg class="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </summary>
          <div class="px-5 pb-5 text-slate-600">
            We need a flat, clear area for setup with access to a standard electrical outlet within 100 feet. Grass is preferred, but we can set up on concrete or asphalt with sandbag anchors (additional fee may apply).
          </div>
        </details>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default bookingPage
