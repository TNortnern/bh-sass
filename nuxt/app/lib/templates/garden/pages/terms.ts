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
<section class="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
    <p class="text-xl text-emerald-100 max-w-2xl mx-auto">Please review our rental policies</p>
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
      <div class="bg-stone-50 rounded-2xl p-8 lg:p-12 border border-emerald-100">
        <div data-smart-block="document-sign" data-props='{"documentType": "terms"}'></div>
      </div>
      <div class="mt-8 text-center">
        <p class="text-stone-500 text-sm">Questions? <a href="/contact" class="text-emerald-600 font-semibold hover:underline">Contact us</a></p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default termsPage
