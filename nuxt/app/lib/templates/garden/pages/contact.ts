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
<section class="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
  <div class="container text-center">
    <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">Get In Touch</h1>
    <p class="text-xl text-emerald-100 max-w-2xl mx-auto">We'd love to hear from you!</p>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      html: `
<section class="py-16 bg-gradient-to-b from-stone-50 to-white">
  <div class="container">
    <div class="max-w-4xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12">
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <div data-smart-block="contact-form"></div>
        </div>
        <div class="space-y-8">
          <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
            <h3 class="font-bold text-xl mb-6">Contact Information</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4"><div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div><div><p class="font-medium">Phone</p><p class="text-emerald-100">(555) 123-4567</p></div></div>
              <div class="flex items-center gap-4"><div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><div><p class="font-medium">Email</p><p class="text-emerald-100">info@example.com</p></div></div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-6 border border-emerald-100">
            <h3 class="font-bold text-stone-900 mb-3">Business Hours</h3>
            <div class="space-y-2 text-stone-600">
              <div class="flex justify-between"><span>Monday - Friday</span><span class="font-medium">9am - 6pm</span></div>
              <div class="flex justify-between"><span>Saturday</span><span class="font-medium">8am - 8pm</span></div>
              <div class="flex justify-between"><span>Sunday</span><span class="font-medium">10am - 4pm</span></div>
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
