/**
 * Fiesta Template - Liability Waiver Page
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
<section class="py-16 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Liability Waiver
    </h1>
    <p class="text-xl text-orange-100 max-w-2xl mx-auto">
      Safety first! Please review and sign before your event.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'waiver-content',
      name: 'Waiver Content',
      html: `
<section class="py-16 bg-gradient-to-b from-amber-50 to-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Safety info card -->
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h3 class="font-bold text-emerald-800 text-lg mb-2">Your Safety Matters</h3>
            <p class="text-emerald-700">
              All our equipment is thoroughly inspected before every rental. We're fully licensed and insured. This waiver helps ensure everyone has a safe, worry-free experience.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-orange-100">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-slate-500 text-sm">
          Need to sign for multiple participants? You can submit multiple waivers.
        </p>
        <p class="text-slate-500 text-sm mt-2">
          Questions? <a href="/contact" class="text-orange-600 font-semibold hover:underline">Contact us</a>
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
