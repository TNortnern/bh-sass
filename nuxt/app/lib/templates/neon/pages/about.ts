/**
 * Neon Template - About Page
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
<section class="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      About Us
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto">
      Creating legendary events since day one
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'story',
      name: 'Our Story',
      html: `
<section class="py-16 bg-slate-950">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl font-bold text-white mb-6">Our Story</h2>
        <p class="text-slate-400 mb-4">
          We started with a simple mission: make every event epic. What began as a passion project has grown into the go-to party rental company for those who want their celebrations to stand out.
        </p>
        <p class="text-slate-400 mb-6">
          Our premium equipment and dedicated team ensure your event is nothing short of legendary. From setup to takedown, we handle everything.
        </p>
        <div class="flex flex-wrap gap-8">
          <div>
            <div class="text-3xl font-bold text-purple-400">500+</div>
            <div class="text-slate-500">Events</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-400">10+</div>
            <div class="text-slate-500">Years</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-400">5.0</div>
            <div class="text-slate-500">Rating</div>
          </div>
        </div>
      </div>
      <div class="bg-slate-900 rounded-2xl aspect-video flex items-center justify-center border border-slate-800">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p class="text-purple-400 font-medium">Team Photo</p>
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
<section class="py-16 bg-slate-900">
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
