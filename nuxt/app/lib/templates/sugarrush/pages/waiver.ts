/**
 * Bounce Template - Liability Waiver Page
 * E-signature capture with playful styling
 */

import type { TemplatePage } from '../../types'

const waiverPage: TemplatePage = {
  id: 'waiver',
  name: 'Liability Waiver',
  slug: '/waiver',
  title: 'Liability Waiver',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-16 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
  <div class="container text-center">
    <span class="text-4xl mb-4 block">✍️</span>
    <h1 class="text-4xl lg:text-5xl font-black text-white mb-4">
      Liability Waiver
    </h1>
    <p class="text-xl text-white/80 max-w-2xl mx-auto">
      Safety first! Please review and sign before the party.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'waiver-content',
      name: 'Waiver Content',
      html: `
<section class="py-16 bg-gradient-to-b from-white to-purple-50">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Safety info card -->
      <div class="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 mb-8">
        <div class="flex items-start gap-4">
          <span class="text-4xl">🛡️</span>
          <div>
            <h3 class="font-bold text-green-800 text-lg mb-2">Your Safety Matters!</h3>
            <p class="text-green-700">
              We take safety seriously! All our inflatables are inspected before every rental, and we're fully licensed and insured. This waiver helps everyone have a safe, worry-free party.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Need to sign for multiple participants? You can submit multiple waivers.
        </p>
        <p class="text-gray-500 text-sm mt-2">
          Questions? <a href="/contact" class="text-purple-600 font-semibold hover:underline">Contact us</a> 📞
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
