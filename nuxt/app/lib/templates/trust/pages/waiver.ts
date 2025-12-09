/**
 * Trust Template - Waiver Page
 * Professional liability waiver with e-signature
 */

import type { TemplatePage } from '../../types'

const waiverPage: TemplatePage = {
  id: 'waiver',
  name: 'Waiver',
  slug: '/waiver',
  title: 'Liability Waiver',
  sections: [
    {
      id: 'header',
      name: 'Waiver Header',
      html: `
<section class="py-16 bg-gradient-to-b from-sky-50 to-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span>Required Document</span>
      </div>

      <h1 class="text-4xl font-bold text-slate-900 mb-4">
        Liability Waiver & Release
      </h1>
      <p class="text-lg text-slate-600">
        For your protection and ours, all renters must sign this waiver before equipment delivery.
      </p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'waiver-content',
      name: 'Waiver Document',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Waiver Document -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <!-- Document Header -->
        <div class="bg-[#1e3a5f] px-8 py-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold">Release of Liability Agreement</h2>
              <p class="text-sky-200 text-sm mt-1">Equipment Rental Waiver</p>
            </div>
            <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Document Body -->
        <div class="p-8">
          <div class="prose prose-slate prose-sm max-w-none">
            <p class="text-slate-700 mb-6">
              In consideration of being permitted to rent and use inflatable equipment and/or party rental items from the Company, I hereby agree to the following:
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">1. Assumption of Risk</h3>
            <p class="text-slate-600 mb-4">
              I understand and acknowledge that participation in inflatable activities involves inherent risks, including but not limited to falls, collisions, sprains, and other physical injuries. I voluntarily assume all risks associated with the use of the rented equipment.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">2. Release of Liability</h3>
            <p class="text-slate-600 mb-4">
              I, for myself, my heirs, executors, and administrators, hereby release, waive, and forever discharge the Company, its owners, employees, agents, and representatives from any and all liability, claims, demands, and causes of action arising out of or related to any loss, damage, or injury that may be sustained during the rental period.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">3. Supervision Responsibility</h3>
            <p class="text-slate-600 mb-4">
              I agree to provide competent adult supervision (18 years or older) at all times during equipment use. I understand that failure to supervise properly may result in injuries for which I accept full responsibility.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">4. Safety Rules Compliance</h3>
            <p class="text-slate-600 mb-4">
              I agree to follow all safety rules and guidelines provided by the Company, including but not limited to:
            </p>
            <ul class="list-disc pl-6 text-slate-600 mb-4 space-y-1">
              <li>Observing maximum capacity limits</li>
              <li>Removing shoes, eyeglasses, and sharp objects before use</li>
              <li>Prohibiting food, drinks, and gum on equipment</li>
              <li>Supervising all children at all times</li>
              <li>Ceasing use during inclement weather</li>
              <li>Not moving or altering equipment after setup</li>
            </ul>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">5. Equipment Damage</h3>
            <p class="text-slate-600 mb-4">
              I agree to be financially responsible for any damage to the equipment beyond normal wear and tear that occurs during the rental period, including damage caused by negligence, misuse, or failure to follow safety guidelines.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">6. Medical Authorization</h3>
            <p class="text-slate-600 mb-4">
              In the event of an emergency, I authorize the Company's representatives to seek medical treatment for any participant if I am not available to provide consent.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">7. Indemnification</h3>
            <p class="text-slate-600 mb-4">
              I agree to indemnify and hold harmless the Company from any claims, lawsuits, or demands made by any third party arising from my use of the rental equipment or failure to follow safety guidelines.
            </p>

            <h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">8. Acknowledgment</h3>
            <p class="text-slate-600 mb-4">
              I have read this Release of Liability Agreement and fully understand its contents. I am aware that by signing this agreement, I am waiving certain legal rights, and I sign it voluntarily and of my own free will.
            </p>
          </div>

          <!-- Agreement Box -->
          <div class="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div class="flex items-start gap-3 mb-4">
              <svg class="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-slate-700 text-sm">
                <strong>Important:</strong> By signing below, you acknowledge that you have read, understand, and agree to the terms of this Release of Liability Agreement.
              </p>
            </div>
          </div>

          <!-- Smart Block: E-Signature -->
          <div class="mt-8">
            <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "style": "trust"}'></div>
          </div>
        </div>
      </div>

      <!-- Insurance Info -->
      <div class="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-green-900 mb-2">For Your Peace of Mind</h3>
            <p class="text-green-800 text-sm">
              We maintain comprehensive general liability insurance with $2 million in coverage. This waiver is standard practice in the party rental industry and helps ensure a safe experience for everyone. Certificates of insurance are available upon request.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="mt-6 text-center">
        <p class="text-slate-500 text-sm">
          Questions about this waiver? Contact us at
          <a href="tel:5551234567" class="text-sky-600 hover:underline">(555) 123-4567</a> or
          <a href="mailto:info@trustrentals.com" class="text-sky-600 hover:underline">info@trustrentals.com</a>
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default waiverPage
