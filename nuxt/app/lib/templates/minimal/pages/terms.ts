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
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 tracking-wide uppercase mb-6">
        <span class="w-8 h-px bg-white"></span>
        Legal
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">Terms & Conditions</h1>
      <p class="text-xl text-neutral-300 leading-relaxed">Please review our rental policies.</p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'terms-content',
      name: 'Terms Content',
      html: `
<section class="py-24 bg-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <div class="border border-neutral-200 p-8 lg:p-12">
        <div data-smart-block="document-sign" data-props='{"documentType": "terms"}'></div>
      </div>
      <div class="mt-8 text-center">
        <p class="text-neutral-500 text-sm">
          Questions about our terms?
          <a href="/contact" class="text-neutral-900 font-semibold hover:underline">Contact us</a>
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
