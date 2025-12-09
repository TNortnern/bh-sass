/**
 * Energy Template - Terms & Conditions Page
 * Clear, straightforward legal content
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
<section class="py-16 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-blue-600/5"></div>

  <div class="container relative z-10 text-center">
    <h1 class="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
      Terms & <span class="text-orange-500">Conditions</span>
    </h1>
    <p class="text-stone-400">
      The rules of the game
    </p>
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
      <div class="bg-stone-950 border border-stone-800 p-8 lg:p-12">
        <!-- Smart Block: Document Sign (Terms) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "terms", "style": "energy"}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-stone-500 text-sm">
          Questions? Hit us up at <a href="/contact" class="text-orange-500 hover:text-orange-400 font-bold">Contact</a>
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
