/**
 * Energy Template - Contact Page
 * Bold, direct contact experience
 */

import type { TemplatePage } from '../../types'

const contactPage: TemplatePage = {
  id: 'contact',
  name: 'Contact',
  slug: '/contact',
  title: 'Contact Us',
  sections: [
    {
      id: 'header',
      name: 'Contact Header',
      html: `
<section class="py-20 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-blue-600/10"></div>

  <div class="container relative z-10 text-center">
    <h1 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">
      Get In <span class="text-orange-500">Touch</span>
    </h1>
    <p class="text-xl text-stone-400">
      Questions? Let's talk.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-content',
      name: 'Contact Info & Form',
      html: `
<section class="py-20 bg-stone-900">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-16">
      <!-- Contact Info -->
      <div>
        <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-10">
          Contact Info
        </h2>

        <div class="space-y-6">
          <div class="flex items-start gap-4 p-6 bg-stone-950 border-l-4 border-orange-600">
            <div class="w-12 h-12 bg-orange-600/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold uppercase mb-1">Phone</h3>
              <p class="text-orange-500 text-xl font-bold">(555) 123-GAME</p>
              <p class="text-stone-500 text-sm mt-1">7 days a week</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-6 bg-stone-950 border-l-4 border-blue-600">
            <div class="w-12 h-12 bg-blue-600/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold uppercase mb-1">Email</h3>
              <p class="text-blue-500 font-bold">info@energyrentals.com</p>
              <p class="text-stone-500 text-sm mt-1">Quick response guaranteed</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-6 bg-stone-950 border-l-4 border-cyan-500">
            <div class="w-12 h-12 bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold uppercase mb-1">Location</h3>
              <p class="text-stone-300">123 Action Street</p>
              <p class="text-stone-400">Energy City, EC 12345</p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gradient-to-r from-orange-600/20 to-blue-600/20 border border-stone-700">
          <h3 class="text-white font-bold uppercase mb-2">⚡ Service Area</h3>
          <p class="text-stone-400 text-sm">
            We deliver within 40 miles. Free delivery on orders over $300!
          </p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-stone-950 border border-stone-800 p-8 lg:p-10">
        <h2 class="text-2xl font-black text-white uppercase tracking-tight mb-8">
          Send Message
        </h2>

        <!-- Smart Block: Contact Form -->
        <div data-smart-block="contact-form" data-props='{"style": "energy"}'></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default contactPage
