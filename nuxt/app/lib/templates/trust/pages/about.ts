/**
 * Trust Template - About Page
 * Professional, trustworthy brand story
 */

import type { TemplatePage } from '../../types'

const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About',
  slug: '/about',
  title: 'About Us',
  sections: [
    {
      id: 'hero',
      name: 'About Hero',
      html: `
<section class="py-20 bg-gradient-to-b from-sky-50 to-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
          <span>About Our Company</span>
        </div>

        <h1 class="text-4xl font-bold text-slate-900 mb-6">
          Serving Our Community Since 2012
        </h1>

        <p class="text-lg text-slate-600 mb-6 leading-relaxed">
          We started with a simple mission: provide safe, reliable party equipment that organizations can trust. Over the years, we've become the go-to choice for schools, churches, corporate events, and community organizations.
        </p>

        <p class="text-slate-600 leading-relaxed">
          Our commitment to safety, professionalism, and customer service has earned us the trust of hundreds of organizations. We take pride in helping create memorable events while maintaining the highest standards of quality and reliability.
        </p>
      </div>

      <div class="relative">
        <div class="aspect-video rounded-xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80" alt="Professional team" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-slate-100">
          <p class="text-sm text-slate-500">Established</p>
          <p class="text-2xl font-bold text-[#1e3a5f]">2012</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'values',
      name: 'Our Values',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        These principles guide everything we do
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center p-8 bg-slate-50 rounded-xl">
        <div class="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Safety First</h3>
        <p class="text-slate-600">
          Every piece of equipment is thoroughly inspected and sanitized. We maintain comprehensive insurance coverage.
        </p>
      </div>

      <div class="text-center p-8 bg-slate-50 rounded-xl">
        <div class="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Professional Service</h3>
        <p class="text-slate-600">
          Punctual delivery, professional setup, and courteous staff. We treat every event with the attention it deserves.
        </p>
      </div>

      <div class="text-center p-8 bg-slate-50 rounded-xl">
        <div class="w-14 h-14 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Community Focus</h3>
        <p class="text-slate-600">
          We're proud to serve local schools, churches, and organizations. Building lasting relationships is our priority.
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-20 bg-slate-50">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">
        Partner With Us
      </h2>
      <p class="text-lg text-slate-600 mb-8">
        Join the hundreds of organizations that trust us for their events. Let's discuss how we can help make your next event a success.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#152d4a] transition-colors">
          Request a Quote
        </a>
        <a href="/contact" class="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-white transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default aboutPage
