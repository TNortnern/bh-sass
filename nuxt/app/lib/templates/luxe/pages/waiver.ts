/**
 * Luxe Template - Liability Waiver Page
 * Refined e-signature experience
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
<section class="py-20 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent"></div>

  <div class="container relative z-10 text-center">
    <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Required Document</span>
    <h1 class="text-4xl lg:text-5xl font-light text-white mt-4">
      Liability <span class="font-serif italic text-amber-400">Waiver</span>
    </h1>
    <p class="text-stone-400 mt-4 max-w-xl mx-auto">
      Please review and sign this document prior to your event.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'waiver-content',
      name: 'Waiver Content',
      html: `
<section class="py-16 bg-stone-900">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Safety assurance -->
      <div class="mb-8 p-6 border border-amber-400/30 bg-stone-950/50">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <div>
            <h3 class="text-white font-medium mb-2">Safety is Our Priority</h3>
            <p class="text-stone-400 text-sm leading-relaxed">
              All equipment is inspected, sanitized, and certified before each rental. We maintain comprehensive insurance coverage and adhere to the highest safety standards in the industry.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-stone-950 border border-stone-800 p-10 lg:p-14">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true, "style": "luxe"}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-stone-500 text-sm">
          Multiple participants? Additional waivers can be submitted.
        </p>
        <p class="text-stone-500 text-sm mt-2">
          Questions? <a href="/contact" class="text-amber-400 hover:text-amber-300 transition-colors">Contact our concierge</a>
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
