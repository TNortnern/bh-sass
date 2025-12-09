/**
 * Luxe Template - About Page
 * Sophisticated brand story
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
  <div class="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-stone-950 to-stone-950"></div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
          <span class="text-amber-400 text-sm tracking-[0.3em] uppercase">Our Story</span>
        </div>

        <h1 class="text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
          A Legacy of
          <span class="block font-serif italic text-amber-400">Excellence</span>
        </h1>

        <p class="text-xl text-stone-400 mb-6 leading-relaxed">
          For over a decade, we have dedicated ourselves to transforming events into extraordinary experiences. What began as a passion for creating memorable moments has evolved into the region's premier luxury event rental service.
        </p>

        <p class="text-stone-500 leading-relaxed">
          Our commitment to quality, attention to detail, and personalized service has earned us the trust of the most discerning clients. We believe that every celebration deserves an element of wonder.
        </p>
      </div>

      <div class="relative">
        <div class="aspect-[4/5] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" alt="Elegant event" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-amber-400/50"></div>
        <div class="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-amber-400/50"></div>
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
<section class="py-24 bg-stone-900">
  <div class="container">
    <div class="text-center mb-16">
      <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Our Philosophy</span>
      <h2 class="text-4xl font-light text-white mt-4">
        Principles of <span class="font-serif italic text-amber-400">Excellence</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center p-10 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-amber-400/30">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-4">Uncompromising Quality</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Every item in our collection meets the highest standards of safety, cleanliness, and aesthetic appeal.
        </p>
      </div>

      <div class="text-center p-10 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-amber-400/30">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-4">Personalized Service</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Your dedicated coordinator ensures every detail aligns with your vision and expectations.
        </p>
      </div>

      <div class="text-center p-10 border border-stone-800 hover:border-amber-400/30 transition-colors">
        <div class="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-amber-400/30">
          <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl text-white mb-4">Reliable Execution</h3>
        <p class="text-stone-400 text-sm leading-relaxed">
          Punctuality, professionalism, and precision in every interaction and delivery.
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
<section class="py-24 bg-stone-950">
  <div class="container">
    <div class="max-w-2xl mx-auto text-center">
      <span class="text-amber-400 text-xs tracking-[0.3em] uppercase">Let's Connect</span>
      <h2 class="text-4xl font-light text-white mt-6 mb-8">
        Begin Your <span class="font-serif italic text-amber-400">Experience</span>
      </h2>
      <p class="text-stone-400 mb-10 leading-relaxed">
        We would be honored to be part of your special occasion. Let's discuss how we can make it unforgettable.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-semibold tracking-wide hover:from-amber-300 hover:to-amber-400 transition-all">
          Schedule Consultation
        </a>
        <a href="/contact" class="px-8 py-4 border border-stone-700 text-stone-300 font-medium tracking-wide hover:bg-stone-900 transition-all">
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
