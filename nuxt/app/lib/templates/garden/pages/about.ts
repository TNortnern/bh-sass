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
<section class="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">About Us</h1>
    <p class="text-xl text-emerald-100 max-w-2xl mx-auto">Bringing outdoor fun to your celebrations</p>
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
        <h2 class="text-3xl font-bold text-stone-900 mb-6">Our Story</h2>
        <p class="text-stone-600 mb-4">We believe outdoor celebrations create the best memories. Our mission is to provide safe, clean, and eco-friendly party equipment for families in our community.</p>
        <p class="text-stone-600 mb-6">Every rental comes with professional setup and our commitment to making your event special.</p>
        <div class="flex flex-wrap gap-8">
          <div><div class="text-3xl font-bold text-emerald-600">500+</div><div class="text-stone-500">Events</div></div>
          <div><div class="text-3xl font-bold text-emerald-600">10+</div><div class="text-stone-500">Years</div></div>
          <div><div class="text-3xl font-bold text-emerald-600">4.9</div><div class="text-stone-500">Rating</div></div>
        </div>
      </div>
      <div class="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl aspect-video flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p class="text-emerald-600 font-medium">Team Photo</p>
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
      html: `<section class="py-16 bg-stone-50"><div class="container"><div data-smart-block="business-info"></div></div></section>`
    }
  ]
}

export default aboutPage
