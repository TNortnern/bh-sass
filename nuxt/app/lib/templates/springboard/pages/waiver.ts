import type { TemplatePage } from '../../types'

export const waiverPage: TemplatePage = {
  id: 'waiver',
  name: 'Liability Waiver',
  path: '/waiver',
  sections: [
    {
      id: 'waiver-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg-subtle">
          <div class="container">
            <div class="text-center max-w-3xl mx-auto">
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Liability Waiver
              </h1>
              <p class="text-xl text-gray-600">
                Required safety waiver for all party rental bookings
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'waiver-content',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="max-w-4xl mx-auto">
              <!-- Smart Block: Digital Signature Document -->
              <div data-smart-block="document-sign" data-document-type="waiver"></div>

              <!-- Manual Waiver Fallback (if smart block not available) -->
              <div class="prose prose-lg max-w-none">
                <div class="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-8 border-2 border-orange-100 mb-8">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
                      <p class="text-gray-600">
                        This waiver is required to ensure the safety of all participants. Please read carefully before signing.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-4">Assumption of Risk</h2>
                <p class="text-gray-600 mb-4">
                  I understand that the use of inflatable equipment and party rentals involves inherent risks, including but not limited to falls, collisions, and other injuries. I acknowledge that these activities carry a risk of physical injury and voluntarily assume all risks associated with participation.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Release of Liability</h2>
                <p class="text-gray-600 mb-4">
                  I hereby release, waive, discharge, and covenant not to sue Springboard Rentals, its owners, employees, and agents from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury that may be sustained while using the rented equipment.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Safety Rules Agreement</h2>
                <p class="text-gray-600 mb-2">I agree to enforce the following safety rules:</p>
                <ul class="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
                  <li>Adult supervision required at all times</li>
                  <li>Remove shoes, glasses, jewelry, and sharp objects before use</li>
                  <li>No food, drinks, or silly string inside inflatables</li>
                  <li>Follow posted weight and occupancy limits</li>
                  <li>No roughhousing, flips, or climbing on walls</li>
                  <li>Children must be grouped by similar age and size</li>
                  <li>Equipment must not be used in high winds or rain</li>
                  <li>Keep the area around equipment clear of obstacles</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Equipment Care</h2>
                <p class="text-gray-600 mb-4">
                  I agree to use the equipment only as intended and in accordance with all safety instructions provided. I will ensure the equipment remains clean and undamaged. I accept financial responsibility for any damage beyond normal wear and tear.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Medical Authorization</h2>
                <p class="text-gray-600 mb-4">
                  In the event of an emergency, I authorize Springboard Rentals or its representatives to obtain medical care from a licensed physician or medical facility. I agree to be financially responsible for any medical costs incurred.
                </p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Photo/Video Release</h2>
                <p class="text-gray-600 mb-4">
                  I grant Springboard Rentals permission to use photographs or video footage taken during my event for promotional purposes, including social media, website, and marketing materials.
                </p>

                <div class="bg-gray-50 rounded-2xl p-8 mt-12 border border-gray-200">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Agreement</h3>
                  <p class="text-gray-600 mb-6">
                    By signing this waiver, I acknowledge that I have read, understood, and agree to all terms. I confirm that I am at least 18 years old and have the legal capacity to enter into this agreement.
                  </p>

                  <div class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                        <input
                          type="date"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Digital Signature *</label>
                      <div class="border-2 border-gray-200 rounded-xl p-4 bg-white">
                        <canvas class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg"></canvas>
                        <p class="text-sm text-gray-500 mt-2">Sign above using your mouse or touch screen</p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <input type="checkbox" required class="mt-1" />
                      <label class="text-sm text-gray-600">
                        I have read and agree to the liability waiver and terms and conditions *
                      </label>
                    </div>

                    <button type="submit" class="btn btn-primary w-full py-4 text-lg">
                      Submit Waiver
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-8 border-2 border-orange-100 mt-8">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">Questions?</h3>
                  <p class="text-gray-600 mb-6">
                    If you have any questions about this waiver, please contact us before signing.
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

export default waiverPage
