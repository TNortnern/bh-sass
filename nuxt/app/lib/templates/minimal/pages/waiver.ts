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
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 tracking-wide uppercase mb-6">
        <span class="w-8 h-px bg-white"></span>
        Safety
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">Liability Waiver</h1>
      <p class="text-xl text-neutral-300 leading-relaxed">Please sign before your event.</p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'waiver-content',
      name: 'Waiver Content',
      html: `
<section class="py-24 bg-white">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <div class="bg-neutral-50 p-6 mb-8 flex items-start gap-4">
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 class="font-bold text-neutral-900 mb-2">Safety First</h3>
          <p class="text-neutral-600">All equipment is inspected and sanitized before every rental. We're fully licensed and insured for your peace of mind.</p>
        </div>
      </div>
      <div class="border border-neutral-200 p-8 lg:p-12">
        <div data-smart-block="document-sign" data-props='{"documentType": "waiver", "requireSignature": true}'></div>
      </div>
      <div class="mt-8 text-center">
        <p class="text-neutral-500 text-sm">
          Questions?
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

export default waiverPage
