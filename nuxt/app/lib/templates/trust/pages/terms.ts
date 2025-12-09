/**
 * Trust Template - Terms & Conditions Page
 * Professional, clear legal documentation
 */

import type { TemplatePage } from '../../types'

const termsPage: TemplatePage = {
  id: 'terms',
  name: 'Terms',
  slug: '/terms',
  title: 'Terms & Conditions',
  sections: [
    {
      id: 'header',
      name: 'Terms Header',
      html: `
<section class="py-16 bg-gradient-to-b from-sky-50 to-white">
  <div class="container">
    <div class="max-w-3xl">
      <h1 class="text-4xl font-bold text-slate-900 mb-4">
        Terms & Conditions
      </h1>
      <p class="text-lg text-slate-600">
        Please review our rental agreement terms carefully before booking.
      </p>
      <p class="text-sm text-slate-500 mt-4">
        Last updated: January 2025
      </p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'terms-content',
      name: 'Terms Content',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="prose prose-slate max-w-none">

        <div class="bg-sky-50 border-l-4 border-sky-500 p-4 mb-8 rounded-r-lg">
          <p class="text-sky-800 text-sm">
            <strong>Summary:</strong> By renting from us, you agree to supervise the equipment during use, maintain a safe environment, and accept responsibility for any damage beyond normal wear. We handle delivery, setup, and all safety inspections.
          </p>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Rental Agreement</h2>
        <p class="text-slate-600 mb-4">
          This agreement is entered into between the rental company ("Company") and the customer ("Renter") for the rental of inflatable equipment and party supplies. By completing a booking, the Renter agrees to all terms and conditions outlined in this document.
        </p>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Booking & Payment</h2>
        <div class="bg-slate-50 rounded-lg p-5 mb-4">
          <ul class="space-y-2 text-slate-600">
            <li class="flex items-start gap-2">
              <span class="text-sky-600 font-bold">•</span>
              <span>A 50% deposit is required to secure your booking date</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-600 font-bold">•</span>
              <span>Final balance is due upon delivery and setup</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-600 font-bold">•</span>
              <span>We accept credit cards, debit cards, and electronic payments</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-sky-600 font-bold">•</span>
              <span>Prices are subject to applicable sales tax</span>
            </li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Cancellation Policy</h2>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-green-700 mb-1">7+ Days</p>
            <p class="text-sm text-green-600">Full deposit refund</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-amber-700 mb-1">3-6 Days</p>
            <p class="text-sm text-amber-600">50% deposit refund</p>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-red-700 mb-1">&lt; 3 Days</p>
            <p class="text-sm text-red-600">No refund</p>
          </div>
        </div>
        <p class="text-slate-600 mb-4">
          Weather-related cancellations due to rain, high winds (over 20mph), or severe weather are fully refundable or can be rescheduled at no additional cost.
        </p>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Safety Requirements</h2>
        <p class="text-slate-600 mb-4">The Renter agrees to the following safety requirements:</p>
        <ul class="space-y-2 text-slate-600 mb-4">
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Adult supervision (18+) must be present at all times during equipment use</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Follow posted capacity limits and age recommendations</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>No shoes, sharp objects, food, or drinks on inflatable equipment</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Equipment must not be moved after professional setup</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Immediately cease use if weather conditions become unsafe</span>
          </li>
        </ul>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Liability & Damage</h2>
        <p class="text-slate-600 mb-4">
          The Renter assumes full responsibility for the rented equipment during the rental period. The Renter agrees to:
        </p>
        <ul class="space-y-2 text-slate-600 mb-4">
          <li class="flex items-start gap-2">
            <span class="text-slate-400">—</span>
            <span>Pay for any damage beyond normal wear and tear</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-slate-400">—</span>
            <span>Report any issues or incidents immediately</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-slate-400">—</span>
            <span>Accept responsibility for injuries resulting from misuse or failure to supervise</span>
          </li>
        </ul>
        <p class="text-slate-600 mb-4">
          The Company maintains comprehensive liability insurance. Certificates of insurance are available upon request for venues and organizations.
        </p>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Setup Requirements</h2>
        <p class="text-slate-600 mb-4">The Renter must provide:</p>
        <ul class="space-y-2 text-slate-600 mb-4">
          <li class="flex items-start gap-2">
            <span class="text-sky-600 font-bold">•</span>
            <span>Clear, flat setup area as specified for each item</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-600 font-bold">•</span>
            <span>Access to a standard 110V electrical outlet within 100 feet</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-600 font-bold">•</span>
            <span>Clear path for equipment delivery (minimum 4 feet wide)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-600 font-bold">•</span>
            <span>Someone 18+ present at delivery and pickup times</span>
          </li>
        </ul>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Delivery & Pickup</h2>
        <p class="text-slate-600 mb-4">
          Our team will deliver and professionally set up all equipment. Delivery and pickup times are scheduled within a 2-hour window. The Renter must ensure access to the setup location at the scheduled time.
        </p>
        <p class="text-slate-600 mb-4">
          If our team cannot access the location at the scheduled time, a redelivery fee may apply. Equipment left outside the agreed pickup time may incur additional rental charges.
        </p>

        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Contact Information</h2>
        <div class="bg-slate-50 rounded-lg p-5">
          <p class="text-slate-600 mb-2">
            For questions about these terms or your rental:
          </p>
          <p class="text-slate-900 font-medium">
            Phone: (555) 123-4567<br>
            Email: info@trustrentals.com<br>
            Hours: Mon-Fri 8am-6pm, Sat 9am-4pm
          </p>
        </div>

      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default termsPage
