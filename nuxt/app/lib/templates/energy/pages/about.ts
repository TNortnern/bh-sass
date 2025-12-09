/**
 * Energy Template - About Page
 * Bold, action-oriented brand story
 */

import type { TemplatePage } from '../../types'

const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About',
  slug: '/about',
  title: 'About Us',
  sections: [
    {
      id: 'hero',
      name: 'About Hero',
      html: `
<section class="py-24 bg-stone-950 relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-blue-600/10"></div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div class="flex items-center gap-4 mb-8">
          <div class="w-2 h-16 bg-orange-600"></div>
          <span class="text-orange-500 font-bold uppercase tracking-wider">Our Story</span>
        </div>

        <h1 class="text-4xl lg:text-6xl font-black text-white uppercase tracking-tight mb-8 leading-none">
          Built for
          <span class="text-blue-500">Action</span>
        </h1>

        <p class="text-xl text-stone-400 mb-6 leading-relaxed">
          We started with one mission: bring high-energy entertainment to every party. What began with a single bounce house has grown into the region's go-to source for epic party equipment.
        </p>

        <p class="text-stone-500 leading-relaxed">
          Our team is made up of party enthusiasts who understand that great events need great equipment. We invest in the best, maintain it obsessively, and deliver with precision.
        </p>
      </div>

      <div class="relative">
        <div class="aspect-square overflow-hidden">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" alt="Action party" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -bottom-4 -left-4 bg-orange-600 text-white px-6 py-4">
          <p class="text-3xl font-black">10+</p>
          <p class="text-sm uppercase tracking-wider">Years Strong</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'values',
      name: 'Our Values',
      html: `
<section class="py-20 bg-stone-900">
  <div class="container">
    <div class="text-center mb-16">
      <h2 class="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4">
        What We <span class="text-orange-500">Stand For</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center p-8 bg-stone-950 border-t-4 border-orange-600">
        <div class="w-16 h-16 mx-auto bg-orange-600/20 flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white uppercase mb-3">Safety First</h3>
        <p class="text-stone-400">
          No shortcuts. Every unit is inspected, tested, and maintained to the highest standards.
        </p>
      </div>

      <div class="text-center p-8 bg-stone-950 border-t-4 border-blue-600">
        <div class="w-16 h-16 mx-auto bg-blue-600/20 flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white uppercase mb-3">Pure Energy</h3>
        <p class="text-stone-400">
          We bring the hype. Our equipment is designed to maximize fun and excitement.
        </p>
      </div>

      <div class="text-center p-8 bg-stone-950 border-t-4 border-cyan-500">
        <div class="w-16 h-16 mx-auto bg-cyan-500/20 flex items-center justify-center mb-6">
          <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white uppercase mb-3">Customer Focused</h3>
        <p class="text-stone-400">
          Your event matters. We go above and beyond to make sure it's legendary.
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'cta',
      name: 'Call to Action',
      html: `
<section class="py-20 bg-stone-950">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-6">
        Let's Make It <span class="text-orange-500">Happen</span>
      </h2>
      <p class="text-xl text-stone-400 mb-10">
        Ready to bring the energy to your next event?
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-orange-600 text-white font-bold uppercase tracking-wider hover:bg-orange-500 transition-colors">
          Book Now
        </a>
        <a href="/contact" class="px-8 py-4 border-2 border-stone-600 text-stone-300 font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors">
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

export default aboutPage
