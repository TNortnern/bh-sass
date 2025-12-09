/**
 * Luxe Template - Contact Page
 * Refined contact experience
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
<section class="py-24 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent"></div>

  <div class="container relative z-10 text-center">
    <div class="flex items-center justify-center gap-3 mb-6">
      <div class="w-12 h-px bg-gradient-to-l from-amber-400 to-transparent"></div>
      <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Get in Touch</span>
      <div class="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
    </div>
    <h1 class="text-5xl lg:text-6xl font-light text-white mb-6">
      Let's <span class="font-serif italic text-amber-400">Connect</span>
    </h1>
    <p class="text-xl text-stone-400 max-w-2xl mx-auto">
      We're here to answer your questions and help create your perfect event.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-content',
      name: 'Contact Info & Form',
      html: `
<section class="py-24 bg-stone-900">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-16">
      <!-- Contact Info -->
      <div>
        <h2 class="text-3xl font-light text-white mb-10">
          Contact <span class="font-serif italic text-amber-400">Information</span>
        </h2>

        <div class="space-y-8">
          <div class="flex items-start gap-5">
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-amber-400/30">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">Telephone</h3>
              <p class="text-amber-400">(555) 123-4567</p>
              <p class="text-stone-500 text-sm mt-1">Mon-Sat, 9am-6pm</p>
            </div>
          </div>

          <div class="flex items-start gap-5">
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-amber-400/30">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">Email</h3>
              <p class="text-amber-400">concierge@luxerentals.com</p>
              <p class="text-stone-500 text-sm mt-1">24-hour response time</p>
            </div>
          </div>

          <div class="flex items-start gap-5">
            <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-amber-400/30">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">Showroom</h3>
              <p class="text-stone-300">123 Prestige Boulevard</p>
              <p class="text-stone-400">Suite 100, Luxury City, LC 12345</p>
              <p class="text-stone-500 text-sm mt-1">By appointment only</p>
            </div>
          </div>
        </div>

        <div class="mt-12 p-6 border border-amber-400/30 bg-stone-950/50">
          <h3 class="text-white font-medium mb-3">Service Area</h3>
          <p class="text-stone-400 text-sm leading-relaxed">
            We proudly serve the greater metropolitan area within a 50-mile radius. Complimentary delivery available for premium bookings.
          </p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-stone-950 border border-stone-800 p-10">
        <h2 class="text-2xl font-light text-white mb-8">
          Send a <span class="font-serif italic text-amber-400">Message</span>
        </h2>

        <!-- Smart Block: Contact Form -->
        <div data-smart-block="contact-form" data-props='{"style": "luxe"}'></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default contactPage
