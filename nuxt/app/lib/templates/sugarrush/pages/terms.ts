/**
 * Bounce Template - Terms & Conditions Page
 * Clear, readable legal content with playful styling
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
<section class="py-16 bg-gradient-to-r from-purple-600 to-pink-500">
  <div class="container text-center">
    <span class="text-4xl mb-4 block">📋</span>
    <h1 class="text-4xl lg:text-5xl font-black text-white mb-4">
      Terms & Conditions
    </h1>
    <p class="text-xl text-white/80 max-w-2xl mx-auto">
      The important stuff (we promise to keep it readable!)
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'terms-content',
      name: 'Terms Content',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12">
        <!-- Smart Block: Document Sign (Terms) -->
        <div data-smart-block="document-sign" data-props='{"documentType": "terms"}'></div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Questions about our terms? <a href="/contact" class="text-purple-600 font-semibold hover:underline">Contact us</a> anytime!
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
