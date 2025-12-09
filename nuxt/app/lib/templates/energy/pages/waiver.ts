/**
 * Energy Template - Liability Waiver Page
 * Direct e-signature experience
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
<section class="py-16 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-blue-600/5"></div>

  <div class="container relative z-10 text-center">
    <h1 class="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
      Liability <span class="text-blue-500">Waiver</span>
    </h1>
    <p class="text-stone-400">
      Sign before the action begins
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
      <!-- Safety notice -->
      <div class="mb-8 p-6 bg-stone-950 border-l-4 border-green-500">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-white font-bold uppercase mb-2">Safety is Priority #1</h3>
            <p class="text-stone-400 text-sm">
              All equipment is inspected and sanitized before every rental. We maintain full insurance coverage and follow strict safety protocols.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-stone-950 border border-stone-800 p-8 lg:p-12">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true, "style": "energy"}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-stone-500 text-sm">
          Multiple people? Each participant needs their own waiver.
        </p>
        <p class="text-stone-500 text-sm mt-2">
          Questions? <a href="/contact" class="text-orange-500 hover:text-orange-400 font-bold">Contact us</a>
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
