/**
 * Neon Template - Contact Page
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
      name: 'Page Header',
      html: `
<section class="py-16 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
      Get In Touch
    </h1>
    <p class="text-xl text-slate-300 max-w-2xl mx-auto">
      Ready to make your event epic? Let's talk!
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      html: `
<section class="py-16 bg-slate-950">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-800">
          <!-- Smart Block: Contact Form -->
          <div data-smart-block="contact-form"></div>
        </div>

        <div class="space-y-8">
          <div class="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 text-white border border-purple-500/20">
            <h3 class="font-bold text-xl mb-6">Contact Information</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p class="font-medium">Phone</p>
                  <p class="text-slate-300">(555) 123-4567</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p class="font-medium">Email</p>
                  <p class="text-slate-300">info@example.com</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <p class="font-medium">Service Area</p>
                  <p class="text-slate-300">Within 30 miles</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 class="font-bold text-white mb-3">Business Hours</h3>
            <div class="space-y-2 text-slate-400">
              <div class="flex justify-between">
                <span>Monday - Friday</span>
                <span class="font-medium text-white">9am - 6pm</span>
              </div>
              <div class="flex justify-between">
                <span>Saturday</span>
                <span class="font-medium text-white">8am - 8pm</span>
              </div>
              <div class="flex justify-between">
                <span>Sunday</span>
                <span class="font-medium text-white">10am - 4pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default contactPage
