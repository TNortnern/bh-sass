/**
 * Luxe Template - Terms & Conditions Page
 * Elegant legal content presentation
 */

import type { TemplatePage } from '../../types'

const termsPage: TemplatePage = {
  id: 'terms',
  name: 'Terms & Conditions',
  slug: '/terms',
  title: 'Terms & Conditions',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-20 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent"></div>

  <div class="container relative z-10 text-center">
    <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Legal</span>
    <h1 class="text-4xl lg:text-5xl font-light text-white mt-4">
      Terms & <span class="font-serif italic text-amber-400">Conditions</span>
    </h1>
  </div>
</section>
      `.trim()
    },
    {
      id: 'terms-content',
      name: 'Terms Content',
      html: `
<section class="py-16 bg-stone-900">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <div class="bg-stone-950 border border-stone-800 p-10 lg:p-14">
        <!-- Smart Block: Document Sign (Terms) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "terms", "style": "luxe"}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-stone-500 text-sm">
          Questions regarding our terms? Contact our concierge at
          <a href="/contact" class="text-amber-400 hover:text-amber-300 transition-colors">concierge@luxerentals.com</a>
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default termsPage
