import type { TemplatePage } from '../../types'
import { navigationSection } from '../../shared/navigation'

const homePage: TemplatePage = {
  id: 'home',
  name: 'Home',
  slug: '/',
  title: 'Home',
  sections: [
    // Navigation Bar
    navigationSection,
    {
      id: 'hero',
      name: 'Hero Section',
      html: `
<section class="min-h-screen flex items-center bg-white relative overflow-hidden">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 right-0 w-1/2 h-full bg-neutral-50"></div>
  </div>
  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 tracking-wide uppercase">
          <span class="w-8 h-px bg-neutral-900"></span>
          Party Rentals
        </div>
        <h1 class="text-5xl lg:text-7xl font-bold text-neutral-900 leading-[1.1] tracking-tight">
          Premium<br>
          <span class="text-neutral-400">Entertainment</span><br>
          Rentals
        </h1>
        <p class="text-xl text-neutral-600 max-w-md leading-relaxed">
          Elevate your events with our curated selection of premium bounce houses and party equipment.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <a href="#inventory" class="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors">
            View Collection
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
          <a href="#contact" class="inline-flex items-center gap-3 px-8 py-4 border-2 border-neutral-900 text-neutral-900 font-semibold hover:bg-neutral-900 hover:text-white transition-colors">
            Contact Us
          </a>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-[4/5] bg-neutral-100 relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="w-32 h-32 mx-auto mb-6 border-4 border-neutral-200 rounded-full flex items-center justify-center">
                <svg class="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p class="text-neutral-400 font-medium">Featured Image</p>
            </div>
          </div>
        </div>
        <div class="absolute -bottom-8 -left-8 bg-neutral-900 text-white p-8">
          <p class="text-4xl font-bold">500+</p>
          <p class="text-neutral-400 text-sm uppercase tracking-wide mt-1">Happy Events</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'services',
      name: 'Services Grid',
      html: `
<section class="py-24 bg-white" id="services">
  <div class="container">
    <div class="max-w-2xl mb-16">
      <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">What We Offer</p>
      <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">Services</h2>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
      <div class="bg-white p-8 group hover:bg-neutral-50 transition-colors">
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Bounce Houses</h3>
        <p class="text-neutral-600 leading-relaxed">Premium inflatables in various themes and sizes for all ages.</p>
      </div>
      <div class="bg-white p-8 group hover:bg-neutral-50 transition-colors">
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Water Slides</h3>
        <p class="text-neutral-600 leading-relaxed">Beat the heat with our exciting water attractions.</p>
      </div>
      <div class="bg-white p-8 group hover:bg-neutral-50 transition-colors">
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Combos</h3>
        <p class="text-neutral-600 leading-relaxed">Multi-activity units with slides, obstacles, and more.</p>
      </div>
      <div class="bg-white p-8 group hover:bg-neutral-50 transition-colors">
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Party Extras</h3>
        <p class="text-neutral-600 leading-relaxed">Tables, chairs, tents, and everything you need.</p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'featured',
      name: 'Featured Section',
      html: `
<section class="py-24 bg-neutral-50" id="inventory">
  <div class="container">
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
      <div class="max-w-2xl">
        <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Our Collection</p>
        <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">Featured Rentals</h2>
      </div>
      <a href="#inventory" class="inline-flex items-center gap-2 text-neutral-900 font-semibold hover:gap-4 transition-all">
        View All
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </a>
    </div>
    <div data-smart-block="rental-item-grid" data-props='{"layout": "minimal", "columns": 3, "limit": 6}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'stats',
      name: 'Stats Section',
      html: `
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
      <div class="text-center lg:text-left">
        <p class="text-5xl lg:text-6xl font-bold mb-2">500+</p>
        <p class="text-neutral-400 uppercase tracking-wide text-sm">Events Completed</p>
      </div>
      <div class="text-center lg:text-left">
        <p class="text-5xl lg:text-6xl font-bold mb-2">50+</p>
        <p class="text-neutral-400 uppercase tracking-wide text-sm">Rental Units</p>
      </div>
      <div class="text-center lg:text-left">
        <p class="text-5xl lg:text-6xl font-bold mb-2">10+</p>
        <p class="text-neutral-400 uppercase tracking-wide text-sm">Years Experience</p>
      </div>
      <div class="text-center lg:text-left">
        <p class="text-5xl lg:text-6xl font-bold mb-2">100%</p>
        <p class="text-neutral-400 uppercase tracking-wide text-sm">Satisfaction Rate</p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'process',
      name: 'Process Section',
      html: `
<section class="py-24 bg-white" id="how-it-works">
  <div class="container">
    <div class="max-w-2xl mb-16">
      <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Simple Process</p>
      <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">How It Works</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-12">
      <div class="relative">
        <span class="text-8xl font-bold text-neutral-100 absolute -top-4 -left-2">01</span>
        <div class="relative pt-12">
          <h3 class="text-xl font-bold text-neutral-900 mb-4">Browse & Select</h3>
          <p class="text-neutral-600 leading-relaxed">Explore our curated collection and choose the perfect rental for your event.</p>
        </div>
      </div>
      <div class="relative">
        <span class="text-8xl font-bold text-neutral-100 absolute -top-4 -left-2">02</span>
        <div class="relative pt-12">
          <h3 class="text-xl font-bold text-neutral-900 mb-4">Book Online</h3>
          <p class="text-neutral-600 leading-relaxed">Reserve your date with our simple online booking system.</p>
        </div>
      </div>
      <div class="relative">
        <span class="text-8xl font-bold text-neutral-100 absolute -top-4 -left-2">03</span>
        <div class="relative pt-12">
          <h3 class="text-xl font-bold text-neutral-900 mb-4">We Deliver</h3>
          <p class="text-neutral-600 leading-relaxed">Professional setup and takedown included with every rental.</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'testimonial',
      name: 'Testimonial Section',
      html: `
<section class="py-24 bg-neutral-50">
  <div class="container">
    <div class="max-w-4xl mx-auto text-center">
      <svg class="w-16 h-16 text-neutral-200 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
      <blockquote class="text-2xl lg:text-3xl text-neutral-900 font-medium leading-relaxed mb-8">
        "Exceptional service from start to finish. The equipment was immaculate, delivery was punctual, and our guests had an amazing time. Will definitely book again."
      </blockquote>
      <div>
        <p class="font-bold text-neutral-900">Sarah Johnson</p>
        <p class="text-neutral-500 text-sm">Event Planner</p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'CTA Section',
      html: `
<section class="py-24 bg-white" id="contact">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Get Started</p>
        <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6">
          Ready to Make Your Event Unforgettable?
        </h2>
        <p class="text-xl text-neutral-600 mb-8 leading-relaxed">
          Contact us today to check availability and secure your reservation.
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="#booking" class="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors">
            Book Now
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
          <a href="tel:+15551234567" class="inline-flex items-center gap-3 px-8 py-4 border-2 border-neutral-900 text-neutral-900 font-semibold hover:bg-neutral-900 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            Call Us
          </a>
        </div>
      </div>
      <div class="bg-neutral-100 p-12">
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900">Location</p>
              <p class="text-neutral-600">Serving the Greater Metro Area</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900">Phone</p>
              <p class="text-neutral-600">(555) 123-4567</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p class="font-bold text-neutral-900">Email</p>
              <p class="text-neutral-600">info@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'footer',
      name: 'Footer',
      html: `
<footer class="bg-neutral-100 border-t border-neutral-200">
  <div class="container py-12">
    <div class="grid md:grid-cols-4 gap-8">
      <div class="md:col-span-1">
        <h3 class="text-lg font-bold text-neutral-900 mb-4">Party Rentals</h3>
        <p class="text-sm text-neutral-600 mb-4">Premium entertainment rentals with minimalist elegance.</p>
        <div class="flex items-center gap-3">
          <a href="#" class="w-8 h-8 bg-neutral-200 text-neutral-900 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-neutral-200 text-neutral-900 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
          <a href="#" class="w-8 h-8 bg-neutral-200 text-neutral-900 rounded-full flex items-center justify-center hover:bg-neutral-300 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg></a>
        </div>
      </div>
      <div><h4 class="text-sm font-semibold text-neutral-900 uppercase mb-4">Quick Links</h4><ul class="space-y-2"><li><a href="/" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Home</a></li><li><a href="/inventory" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Rentals</a></li><li><a href="/about" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">About</a></li><li><a href="/contact" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Contact</a></li></ul></div>
      <div><h4 class="text-sm font-semibold text-neutral-900 uppercase mb-4">Services</h4><ul class="space-y-2"><li><a href="/inventory?category=bounce_house" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Bounce Houses</a></li><li><a href="/inventory?category=water_slide" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Water Slides</a></li><li><a href="/inventory?category=combo" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Combos</a></li><li><a href="/inventory?category=party_extras" class="text-neutral-600 hover:text-neutral-900 text-sm transition-colors">Party Extras</a></li></ul></div>
      <div><h4 class="text-sm font-semibold text-neutral-900 uppercase mb-4">Contact</h4><ul class="space-y-3 text-sm text-neutral-600"><li class="flex items-start gap-2"><svg class="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>(555) 123-4567</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>info@example.com</span></li><li class="flex items-start gap-2"><svg class="w-5 h-5 text-neutral-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>123 Main St<br>City, ST 12345</span></li></ul></div>
    </div>
    <div class="border-t border-neutral-200 mt-8 pt-6 text-center"><p class="text-sm text-neutral-500">&copy; 2024 Party Rentals. All rights reserved.</p></div>
  </div>
</footer>
      `.trim()
    }
  ]
}

export default homePage
