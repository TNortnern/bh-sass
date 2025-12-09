/**
 * Neon Template - Liability Waiver Page
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
<section class="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Liability Waiver
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto">
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
<section class="py-16 bg-slate-950">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Safety info card -->
      <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h3 class="font-bold text-emerald-400 text-lg mb-2">Your Safety Matters</h3>
            <p class="text-emerald-300/80">
              All equipment is inspected before every rental. We're fully licensed and insured for your peace of mind.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 rounded-2xl shadow-lg p-8 lg:p-12 border border-slate-800">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-slate-500 text-sm">
          Need multiple waivers? You can submit one for each participant.
        </p>
        <p class="text-slate-500 text-sm mt-2">
          Questions? <a href="/contact" class="text-purple-400 font-semibold hover:underline">Contact us</a>
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
