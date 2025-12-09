/**
 * Bounce Template - About Page
 * Fun, family-oriented about section
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
<section class="relative py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-20 left-10 text-8xl">🎈</div>
    <div class="absolute bottom-20 right-10 text-8xl">🎊</div>
  </div>

  <div class="container relative z-10">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="text-center lg:text-left">
        <span class="text-5xl mb-4 block">👋</span>
        <h1 class="text-4xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
          Meet the Fun Makers!
        </h1>
        <p class="text-xl text-white/90 leading-relaxed">
          We're a family-owned business with one mission: to bring JOY to every party! Since 2015, we've been helping families create magical memories with the bounciest, safest, and most awesome inflatables around.
        </p>
      </div>

      <div class="relative">
        <div class="aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white/30 transform rotate-2">
          <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" alt="Our team" class="w-full h-full object-cover"/>
        </div>
        <div class="absolute -bottom-4 -right-4 bg-yellow-400 text-purple-900 px-6 py-3 rounded-2xl font-black transform rotate-3 shadow-xl">
          Family Owned! 👨‍👩‍👧‍👦
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
<section class="py-20 bg-white">
  <div class="container">
    <div class="text-center mb-16">
      <span class="text-4xl mb-4 block">💖</span>
      <h2 class="text-4xl font-black text-gray-900 mb-4">What We're All About</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div class="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 hover:shadow-xl transition-shadow">
        <span class="text-6xl mb-4 block">🛡️</span>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Safety First!</h3>
        <p class="text-gray-600">
          Every inflatable is cleaned, sanitized, and inspected before each rental. We're fully licensed and insured!
        </p>
      </div>

      <div class="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 hover:shadow-xl transition-shadow">
        <span class="text-6xl mb-4 block">😊</span>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Happy Vibes Only</h3>
        <p class="text-gray-600">
          We genuinely love what we do! Nothing makes us happier than seeing kids (and adults) having the time of their lives.
        </p>
      </div>

      <div class="text-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 hover:shadow-xl transition-shadow">
        <span class="text-6xl mb-4 block">🤝</span>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">We've Got You</h3>
        <p class="text-gray-600">
          From delivery to pickup, we handle everything. You focus on the party, we handle the bouncy stuff!
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'stats',
      name: 'Fun Stats',
      html: `
<section class="py-16 bg-gradient-to-r from-purple-600 to-pink-500">
  <div class="container">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-5xl font-black text-yellow-300 mb-2">500+</div>
        <div class="text-white/80 font-semibold">Parties Rocked 🎉</div>
      </div>
      <div>
        <div class="text-5xl font-black text-yellow-300 mb-2">25+</div>
        <div class="text-white/80 font-semibold">Inflatables 🏰</div>
      </div>
      <div>
        <div class="text-5xl font-black text-yellow-300 mb-2">8</div>
        <div class="text-white/80 font-semibold">Years of Fun! 🎂</div>
      </div>
      <div>
        <div class="text-5xl font-black text-yellow-300 mb-2">5★</div>
        <div class="text-white/80 font-semibold">Happy Families ⭐</div>
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
<section class="py-20 bg-gradient-to-b from-white to-purple-50">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <span class="text-5xl mb-4 block">🎈</span>
      <h2 class="text-4xl font-black text-gray-900 mb-4">
        Ready to Party With Us?
      </h2>
      <p class="text-xl text-gray-600 mb-8">
        Let's create some amazing memories together!
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/booking" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
          Book Now 🎊
        </a>
        <a href="/contact" class="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-full hover:bg-gray-50 transition-all border-2 border-purple-200">
          Get in Touch 📞
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
