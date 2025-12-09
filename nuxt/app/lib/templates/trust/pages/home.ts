/**
 * Trust Template - Home Page
 * Clean, professional design for corporate clients, schools, and churches
 */

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
      name: 'Hero',
      html: `
<section class="relative bg-gradient-to-b from-sky-50 to-white py-20 lg:py-28">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold mb-6">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Licensed & Insured</span>
        </div>

        <h1 class="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Professional Party Rentals
          <span class="text-sky-600">You Can Trust</span>
        </h1>

        <p class="text-lg text-slate-600 mb-8 leading-relaxed">
          Reliable, safe, and professional party rental services for schools, churches, corporate events, and community organizations. Fully licensed and insured for your peace of mind.
        </p>

        <div class="flex flex-wrap gap-4 mb-10">
          <a href="/booking" class="px-6 py-3 bg-[#1e3a5f] text-white font-semibold rounded-lg hover:bg-[#152d4a] transition-colors inline-flex items-center gap-2">
            Request Quote
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/inventory" class="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
            View Inventory
          </a>
        </div>

        <!-- Trust indicators -->
        <div class="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div class="text-sm">
              <p class="font-semibold text-slate-900">Fully Insured</p>
              <p class="text-slate-500">$2M coverage</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="text-sm">
              <p class="font-semibold text-slate-900">Licensed</p>
              <p class="text-slate-500">State certified</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div class="text-sm">
              <p class="font-semibold text-slate-900">5-Star Rated</p>
              <p class="text-slate-500">100+ reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="aspect-square rounded-2xl overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80" alt="Professional event setup" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4">
          <p class="text-sm text-slate-500 mb-1">Trusted by</p>
          <p class="text-2xl font-bold text-[#1e3a5f]">200+ Organizations</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'featured',
      name: 'Featured Items',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">
        Our Most Popular Rentals
      </h2>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        Trusted by schools, churches, and businesses throughout the community.
      </p>
    </div>

    <!-- Smart Block: Featured Items - replaced with real inventory data -->
    <div data-smart-block="featured-items">
      <!-- Placeholder grid shown in editor -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
          <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span class="text-5xl opacity-50">🏠</span>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Item Name</h3>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-[#1e3a5f]">$XXX</span>
              <span class="px-4 py-2 bg-[#1e3a5f] text-white font-medium rounded-lg">View Details</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-12">
      <a href="/inventory" class="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">
        View Full Inventory
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'why-choose',
      name: 'Why Choose Us',
      html: `
<section class="py-20 bg-slate-50">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">
        Why Organizations Trust Us
      </h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Safety Certified</h3>
        <p class="text-slate-600">
          All equipment inspected before each rental. We maintain comprehensive insurance and follow strict safety protocols.
        </p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Reliable Service</h3>
        <p class="text-slate-600">
          On-time delivery and setup guaranteed. Professional team handles everything so you can focus on your event.
        </p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-3">Dedicated Support</h3>
        <p class="text-slate-600">
          Direct communication with our team. We're here to help make your event a success from start to finish.
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      html: `
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-slate-900 mb-4">
        What Our Clients Say
      </h2>
      <p class="text-lg text-slate-600">
        Trusted by organizations across the community
      </p>
    </div>

    <!-- Smart Block: Testimonials -->
    <div data-smart-block="testimonials" data-props='{"limit": 3, "style": "trust"}'></div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-20 bg-[#1e3a5f]">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-white mb-4">
        Ready to Plan Your Event?
      </h2>
      <p class="text-xl text-sky-200 mb-8">
        Get a free quote today. We'll help you find the perfect equipment for your organization's needs.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-white text-[#1e3a5f] font-semibold rounded-lg hover:bg-sky-50 transition-colors">
          Request a Quote
        </a>
        <a href="/contact" class="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}

export default homePage
