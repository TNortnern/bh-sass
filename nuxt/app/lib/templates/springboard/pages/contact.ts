import type { TemplatePage } from '../../types'

export const contactPage: TemplatePage = {
  id: 'contact',
  name: 'Contact',
  path: '/contact',
  sections: [
    {
      id: 'contact-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg-subtle">
          <div class="container">
            <div class="text-center max-w-3xl mx-auto">
              <span class="badge mb-4">Get in Touch</span>
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Let's Make Your Event Amazing
              </h1>
              <p class="text-xl text-gray-600">
                Have questions? Need a custom quote? We're here to help!
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'contact-content',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="grid lg:grid-cols-5 gap-12">
              <!-- Contact Info -->
              <div class="lg:col-span-2">
                <h2 class="text-2xl font-bold mb-6">Contact Information</h2>

                <div class="space-y-6 mb-10">
                  <!-- Phone -->
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 mb-1">Phone</p>
                      <a href="tel:555-123-4567" class="text-gray-600 hover:text-orange-500 transition-colors">
                        (555) 123-4567
                      </a>
                      <p class="text-sm text-gray-500 mt-1">Mon-Sat: 8am-8pm</p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 mb-1">Email</p>
                      <a href="mailto:hello@springboard.com" class="text-gray-600 hover:text-orange-500 transition-colors">
                        hello@springboard.com
                      </a>
                      <p class="text-sm text-gray-500 mt-1">We reply within 1 hour</p>
                    </div>
                  </div>

                  <!-- Location -->
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 mb-1">Service Area</p>
                      <p class="text-gray-600">Metro Area & Surrounding Cities</p>
                      <p class="text-sm text-gray-500 mt-1">Free delivery within 20 miles</p>
                    </div>
                  </div>
                </div>

                <!-- Social Links -->
                <div>
                  <p class="font-semibold text-gray-900 mb-4">Follow Us</p>
                  <div class="flex gap-3">
                    <a href="#" class="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-orange-500 hover:to-teal-500 flex items-center justify-center text-gray-600 hover:text-white transition-all group">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-orange-500 hover:to-teal-500 flex items-center justify-center text-gray-600 hover:text-white transition-all group">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-orange-500 hover:to-teal-500 flex items-center justify-center text-gray-600 hover:text-white transition-all group">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Contact Form -->
              <div class="lg:col-span-3">
                <div class="card">
                  <h2 class="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form class="space-y-5">
                    <div class="grid md:grid-cols-2 gap-5">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-5">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          required
                          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                      <select class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors">
                        <option value="">Select event type</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="school">School Event</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="church">Church Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                      <textarea
                        required
                        rows="5"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                        placeholder="Tell us about your event and any questions you have..."
                      ></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary w-full py-4 text-lg">
                      Send Message
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'contact-cta',
      type: 'cta',
      html: `
        <section class="section gradient-bg text-white">
          <div class="container">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Prefer to Book Online?
              </h2>
              <p class="text-lg mb-8 text-white/90">
                Check availability and book your party rental in just a few clicks
              </p>
              <a href="/booking" class="btn btn-white inline-flex">
                Book Now
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default contactPage
