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
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 tracking-wide uppercase mb-6">
        <span class="w-8 h-px bg-white"></span>
        Contact
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">Get In Touch</h1>
      <p class="text-xl text-neutral-300 leading-relaxed">Questions? We're here to help.</p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'contact-form',
      name: 'Contact Form',
      html: `
<section class="py-24 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-16">
      <div>
        <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Send a Message</p>
        <h2 class="text-3xl font-bold text-neutral-900 mb-8">Contact Form</h2>
        <div data-smart-block="contact-form"></div>
      </div>
      <div class="lg:pl-8">
        <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Contact Info</p>
        <h2 class="text-3xl font-bold text-neutral-900 mb-8">Other Ways to Reach Us</h2>
        <div class="space-y-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900 mb-1">Phone</p>
              <p class="text-neutral-600">(555) 123-4567</p>
              <p class="text-neutral-500 text-sm mt-1">Mon-Fri 9am-6pm, Sat 8am-8pm</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900 mb-1">Email</p>
              <p class="text-neutral-600">info@example.com</p>
              <p class="text-neutral-500 text-sm mt-1">We respond within 24 hours</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900 mb-1">Service Area</p>
              <p class="text-neutral-600">Greater Metro Area</p>
              <p class="text-neutral-500 text-sm mt-1">Up to 30 miles from city center</p>
            </div>
          </div>
        </div>
        <div class="mt-12 p-8 bg-neutral-50">
          <h3 class="font-bold text-neutral-900 mb-4">Business Hours</h3>
          <div class="space-y-2 text-neutral-600">
            <div class="flex justify-between">
              <span>Monday - Friday</span>
              <span class="font-medium text-neutral-900">9:00 AM - 6:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span>Saturday</span>
              <span class="font-medium text-neutral-900">8:00 AM - 8:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span>Sunday</span>
              <span class="font-medium text-neutral-900">10:00 AM - 4:00 PM</span>
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
