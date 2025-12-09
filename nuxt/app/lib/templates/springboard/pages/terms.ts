import type { TemplatePage } from '../../types'

export const termsPage: TemplatePage = {
  id: 'terms',
  name: 'Terms & Conditions',
  path: '/terms',
  sections: [
    {
      id: 'terms-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg-subtle">
          <div class="container">
            <div class="text-center max-w-3xl mx-auto">
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Terms & Conditions
              </h1>
              <p class="text-xl text-gray-600">
                Please review our rental terms and conditions before booking
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'terms-content',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="max-w-4xl mx-auto">
              <!-- Smart Block: Digital Signature Document -->
              <div data-smart-block="document-sign" data-document-type="terms"></div>

              <!-- Manual Terms Fallback (if smart block not available) -->
              <div class="prose prose-lg max-w-none">
                <div class="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-8 border-2 border-orange-100 mb-8">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Important Information</h3>
                      <p class="text-gray-600">
                        By booking a rental with Springboard, you agree to these terms and conditions. Please read them carefully.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">1. Booking & Payment</h2>
                <p class="text-gray-600 mb-4">
                  A 50% deposit is required at the time of booking to secure your rental. The remaining balance is due 24 hours before your event date. We accept all major credit cards and digital payment methods.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Cancellation Policy</h2>
                <p class="text-gray-600 mb-4">
                  Cancellations made 7+ days before the event receive a full refund. Cancellations made 3-6 days before receive a 50% refund. Cancellations within 48 hours of the event are non-refundable.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Weather Policy</h2>
                <p class="text-gray-600 mb-4">
                  In case of severe weather (high winds, thunderstorms, or extreme temperatures), we reserve the right to cancel or reschedule your event for safety reasons. Full refunds or rescheduling options will be provided.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Setup Requirements</h2>
                <p class="text-gray-600 mb-4">
                  A flat, level surface free of debris, rocks, and sticks is required. Access to a standard electrical outlet within 50 feet is necessary for inflatables. The renter must provide clear access to the setup location.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Supervision & Safety</h2>
                <p class="text-gray-600 mb-4">
                  Adult supervision is required at all times during use. The renter is responsible for ensuring all safety rules are followed, including age/weight restrictions and occupancy limits.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Damage & Liability</h2>
                <p class="text-gray-600 mb-4">
                  The renter is responsible for any damage to the equipment beyond normal wear and tear. A damage waiver is available for purchase. We carry comprehensive liability insurance, but the renter agrees to use equipment at their own risk.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Delivery & Pickup</h2>
                <p class="text-gray-600 mb-4">
                  Delivery and setup are included within 20 miles. Additional fees apply for locations beyond this radius. We will confirm delivery time windows 24-48 hours before your event.
                </p>

                <div class="bg-gray-50 rounded-2xl p-8 mt-12 border border-gray-200">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h3>
                  <p class="text-gray-600 mb-6">
                    If you have any questions about our terms and conditions, please don't hesitate to reach out.
                  </p>
                  <a href="/contact" class="btn btn-primary">
                    Contact Us
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default termsPage
