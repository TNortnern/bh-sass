import type { TemplatePage } from '../../types'

export const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Book Now',
  path: '/booking',
  sections: [
    {
      id: 'booking-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg text-white relative overflow-hidden">
          <!-- Decorative Elements -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>

          <div class="container relative z-10">
            <div class="text-center max-w-3xl mx-auto">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Real-Time Availability
              </span>
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Book Your Party Rental
              </h1>
              <p class="text-xl text-white/90">
                Select your rental, pick your date, and get instant confirmation
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'booking-widget',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="max-w-5xl mx-auto">
              <!-- Trust Indicators -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-700">Safety Certified</p>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-700">Secure Payment</p>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-700">Instant Confirmation</p>
                </div>
                <div class="text-center">
                  <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-gray-700">Free Delivery*</p>
                </div>
              </div>

              <!-- Smart Block: Interactive Booking Widget -->
              <div data-smart-block="booking-widget"></div>

              <!-- Additional Info -->
              <div class="mt-12 p-6 bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl border-2 border-orange-100">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-900 mb-2">Booking Information</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        Free delivery within 20 miles
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        Professional setup and pickup included
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        All equipment cleaned and safety inspected
                      </li>
                      <li class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        Same-day delivery available
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'booking-support',
      type: 'cta',
      html: `
        <section class="section gradient-bg-subtle">
          <div class="container">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Need Help Booking?
              </h2>
              <p class="text-lg text-gray-600 mb-8">
                Our friendly team is here to assist you with any questions
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:555-123-4567" class="btn btn-primary">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Call (555) 123-4567
                </a>
                <a href="/contact" class="btn btn-outline">
                  Send a Message
                </a>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default bookingPage
