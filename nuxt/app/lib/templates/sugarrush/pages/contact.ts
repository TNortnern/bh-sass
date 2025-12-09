/**
 * Bounce Template - Contact Page
 * Fun, approachable contact section
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
<section class="relative py-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 overflow-hidden">
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-10 right-20 text-8xl">📞</div>
    <div class="absolute bottom-10 left-20 text-6xl">💬</div>
  </div>

  <div class="container relative z-10 text-center">
    <span class="text-5xl mb-4 block">👋</span>
    <h1 class="text-4xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
      Let's Chat!
    </h1>
    <p class="text-xl text-white/90 max-w-2xl mx-auto">
      Got questions? Need help picking the perfect bounce house? We're here for you!
    </p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-content',
      name: 'Contact Info & Form',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Contact Info -->
      <div>
        <h2 class="text-3xl font-black text-gray-900 mb-8">
          Ways to Reach Us 🎯
        </h2>

        <div class="space-y-6">
          <div class="flex items-start gap-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
            <span class="text-4xl">📱</span>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Call or Text</h3>
              <p class="text-purple-600 font-semibold text-xl">(555) 123-JUMP</p>
              <p class="text-gray-500 text-sm mt-1">Mon-Sat, 8am-8pm</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
            <span class="text-4xl">✉️</span>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Email Us</h3>
              <p class="text-orange-600 font-semibold">hello@bounceparty.com</p>
              <p class="text-gray-500 text-sm mt-1">We reply within 24 hours!</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl">
            <span class="text-4xl">📍</span>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Find Us</h3>
              <p class="text-blue-600 font-semibold">123 Party Lane</p>
              <p class="text-gray-600">Fun City, FC 12345</p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl text-white">
          <h3 class="font-bold text-xl mb-2">🚗 Delivery Area</h3>
          <p class="text-white/90">
            We deliver within 30 miles of Fun City! Free delivery within 15 miles for rentals over $200.
          </p>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-10">
        <h2 class="text-3xl font-black text-gray-900 mb-2">
          Send a Message 💌
        </h2>
        <p class="text-gray-600 mb-8">
          We'll get back to you faster than kids can climb into a bounce house!
        </p>

        <!-- Smart Block: Contact Form -->
        <div data-smart-block="contact-form"></div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default contactPage
