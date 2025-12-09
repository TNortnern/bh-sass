/**
 * Trust Template - Contact Page
 * Professional, organized contact section
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
<section class="py-16 bg-gradient-to-b from-sky-50 to-white">
  <div class="container text-center">
    <h1 class="text-4xl font-bold text-slate-900 mb-4">
      Contact Us
    </h1>
    <p class="text-lg text-slate-600 max-w-2xl mx-auto">
      Have questions? We're here to help. Reach out to our team and we'll respond within 24 hours.
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-content',
      name: 'Contact Info & Form',
      html: `
<section class="py-16 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Contact Info -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 mb-8">
          Get in Touch
        </h2>

        <div class="space-y-6">
          <div class="flex items-start gap-4 p-5 bg-slate-50 rounded-lg">
            <div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Phone</h3>
              <p class="text-sky-600 font-medium">(555) 123-4567</p>
              <p class="text-sm text-slate-500 mt-1">Mon-Fri 8am-6pm, Sat 9am-4pm</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-5 bg-slate-50 rounded-lg">
            <div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Email</h3>
              <p class="text-sky-600 font-medium">info@trustrentals.com</p>
              <p class="text-sm text-slate-500 mt-1">We respond within 24 hours</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-5 bg-slate-50 rounded-lg">
            <div class="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Office</h3>
              <p class="text-slate-700">123 Professional Way</p>
              <p class="text-slate-600">Suite 100, Business City, BC 12345</p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-5 bg-[#1e3a5f] rounded-lg text-white">
          <h3 class="font-semibold mb-2">Service Area</h3>
          <p class="text-sky-200 text-sm">
            We proudly serve the greater metropolitan area within 35 miles. Delivery fees vary by location. Contact us for a quote.
          </p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-slate-50 rounded-xl p-8">
        <h2 class="text-2xl font-bold text-slate-900 mb-6">
          Send a Message
        </h2>

        <!-- Smart Block: Contact Form -->
        <div data-smart-block="contact-form" data-props='{"style": "trust"}'></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default contactPage
