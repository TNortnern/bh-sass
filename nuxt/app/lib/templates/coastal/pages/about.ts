/**
 * Coastal Template - About Page
 */

import type { TemplatePage } from '../../types'

const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About Us',
  slug: '/about',
  title: 'About Us',
  sections: [
    {
      id: 'header',
      name: 'Page Header',
      html: `
<section class="py-16 bg-gradient-to-br from-sky-500 to-cyan-600">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      About Our Company
    </h1>
    <p class="text-xl text-sky-100 max-w-2xl mx-auto">
      Delivering smiles and creating memories for over a decade
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'story',
      name: 'Our Story',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
        <p class="text-slate-600 mb-4">
          What started as a single bounce house has grown into the region's most trusted party rental company. We're passionate about creating unforgettable moments for families in our community.
        </p>
        <p class="text-slate-600 mb-6">
          Every rental comes with our commitment to safety, cleanliness, and exceptional service. Our team handles everything from delivery to setup, so you can focus on enjoying your event.
        </p>
        <div class="flex flex-wrap gap-8">
          <div>
            <div class="text-3xl font-bold text-sky-600">500+</div>
            <div class="text-slate-500">Events Served</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-sky-600">10+</div>
            <div class="text-slate-500">Years Experience</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-sky-600">4.9</div>
            <div class="text-slate-500">Star Rating</div>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl aspect-video flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p class="text-sky-600 font-medium">Team Photo</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'business-info',
      name: 'Business Info',
      html: `
<section class="py-16 bg-sky-50">
  <div class="container">
    <!-- Smart Block: Business Info -->
    <div data-smart-block="business-info"></div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default aboutPage
