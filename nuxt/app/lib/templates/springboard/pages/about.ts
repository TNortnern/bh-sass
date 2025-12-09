import type { TemplatePage } from '../../types'

export const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About Us',
  path: '/about',
  sections: [
    {
      id: 'about-header',
      type: 'header',
      html: `
        <section class="pt-32 pb-16 gradient-bg text-white relative overflow-hidden">
          <!-- Decorative Elements -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>

          <div class="container relative z-10">
            <div class="text-center max-w-3xl mx-auto">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                Est. 2020
              </span>
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Making Memories,<br>One Bounce at a Time
              </h1>
              <p class="text-xl text-white/90">
                We're passionate about bringing joy to every celebration with premium party rentals and exceptional service
              </p>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'about-story',
      type: 'content',
      html: `
        <section class="section bg-white">
          <div class="container">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span class="badge mb-4">Our Story</span>
                <h2 class="text-3xl md:text-4xl font-bold mb-6">
                  Built on a Foundation of Fun & Safety
                </h2>
                <div class="space-y-4 text-gray-600 text-lg">
                  <p>
                    Founded in 2020, Springboard started with a simple mission: to make party planning easier and more enjoyable for families across the region.
                  </p>
                  <p>
                    What began as a small collection of bounce houses has grown into a comprehensive party rental service, featuring everything from water slides to obstacle courses and interactive games.
                  </p>
                  <p>
                    Every piece of equipment in our inventory is thoroughly cleaned, inspected, and certified to meet the highest safety standards. We're fully insured and committed to delivering not just rentals, but peace of mind.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of families, schools, and organizations, helping create unforgettable memories one bounce at a time.
                  </p>
                </div>
              </div>
              <div class="relative">
                <div class="aspect-[4/3] bg-gradient-to-br from-orange-100 to-teal-100 rounded-2xl overflow-hidden">
                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <!-- Floating badge -->
                <div class="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl">
                  <p class="text-4xl font-bold gradient-text">5,000+</p>
                  <p class="text-gray-600 font-semibold">Happy Events</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'about-values',
      type: 'features',
      html: `
        <section class="section gradient-bg-subtle">
          <div class="container">
            <div class="text-center mb-16">
              <span class="badge mb-4">Our Values</span>
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                What Makes Us Different
              </h2>
              <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to excellence in everything we do
              </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Safety First -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">Safety First</h3>
                <p class="text-gray-600">
                  All equipment is certified, inspected, and maintained to the highest safety standards. Your peace of mind is our priority.
                </p>
              </div>

              <!-- Quality Equipment -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">Premium Quality</h3>
                <p class="text-gray-600">
                  We invest in top-tier, commercial-grade equipment that's clean, vibrant, and built to last for countless celebrations.
                </p>
              </div>

              <!-- Reliable Service -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">On-Time Delivery</h3>
                <p class="text-gray-600">
                  We respect your schedule. Our team arrives on time, sets up efficiently, and picks up promptly so you can focus on fun.
                </p>
              </div>

              <!-- Customer Service -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">Exceptional Support</h3>
                <p class="text-gray-600">
                  Our friendly team is here to help every step of the way, from booking to setup to pickup. Questions? We're just a call away.
                </p>
              </div>

              <!-- Easy Booking -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">Easy Booking</h3>
                <p class="text-gray-600">
                  Our real-time booking system shows live availability and instant confirmation. No waiting, no hassle - just click and book.
                </p>
              </div>

              <!-- Fully Insured -->
              <div class="card">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 flex items-center justify-center mb-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 class="font-bold text-xl mb-3">Fully Insured</h3>
                <p class="text-gray-600">
                  We carry comprehensive liability insurance for your protection and peace of mind at every event.
                </p>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      id: 'about-cta',
      type: 'cta',
      html: `
        <section class="section gradient-bg text-white">
          <div class="container">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Join Our Growing Family
              </h2>
              <p class="text-lg mb-8 text-white/90">
                Thousands of families trust us with their celebrations. Let us make your next event unforgettable.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/booking" class="btn btn-white">
                  Book Your Event
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
                <a href="/contact" class="btn btn-outline btn-white">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ]
}

export default aboutPage
