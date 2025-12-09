import type { TemplatePage } from '../../types'

const aboutPage: TemplatePage = {
  id: 'about',
  name: 'About',
  slug: '/about',
  title: 'About Us',
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
        About
      </div>
      <h1 class="text-4xl lg:text-6xl font-bold leading-tight mb-6">Our Story</h1>
      <p class="text-xl text-neutral-300 leading-relaxed">A commitment to quality and service excellence.</p>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'story',
      name: 'Story Section',
      html: `
<section class="py-24 bg-white">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">Est. 2015</p>
        <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight mb-6">
          Building Memories, One Event at a Time
        </h2>
        <div class="space-y-4 text-neutral-600 leading-relaxed">
          <p>
            What started as a single bounce house has grown into the area's most trusted party rental service. Our mission remains simple: deliver premium entertainment with exceptional service.
          </p>
          <p>
            We believe every event deserves to be special. That's why we maintain the highest standards for our equipment and employ a team dedicated to making your experience seamless.
          </p>
          <p>
            From birthday parties to corporate events, we've had the privilege of being part of thousands of celebrations. Each one reminds us why we do what we do.
          </p>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-square bg-neutral-100 relative">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="w-24 h-24 mx-auto mb-4 border-4 border-neutral-200 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p class="text-neutral-400 font-medium">Team Photo</p>
            </div>
          </div>
        </div>
        <div class="absolute -bottom-6 -right-6 bg-neutral-900 text-white p-6">
          <p class="text-3xl font-bold">10+</p>
          <p class="text-neutral-400 text-sm uppercase tracking-wide">Years Experience</p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    },
    {
      id: 'values',
      name: 'Values Section',
      html: `
<section class="py-24 bg-neutral-50">
  <div class="container">
    <div class="max-w-2xl mb-16">
      <p class="text-sm font-medium text-neutral-500 tracking-wide uppercase mb-4">What Drives Us</p>
      <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">Our Values</h2>
    </div>
    <div class="grid md:grid-cols-3 gap-12">
      <div>
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Quality</h3>
        <p class="text-neutral-600 leading-relaxed">We invest in premium equipment and maintain it to the highest standards. Your safety and satisfaction are non-negotiable.</p>
      </div>
      <div>
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Reliability</h3>
        <p class="text-neutral-600 leading-relaxed">When we say we'll be there, we mean it. On-time delivery and professional service, every single time.</p>
      </div>
      <div>
        <div class="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center mb-6">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">Care</h3>
        <p class="text-neutral-600 leading-relaxed">We treat every event like it's our own. Your celebration matters to us, and we're here to make it perfect.</p>
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
<section class="py-24 bg-neutral-900 text-white">
  <div class="container">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl lg:text-4xl font-bold leading-tight mb-6">Ready to Work With Us?</h2>
      <p class="text-xl text-neutral-300 mb-8">Let's make your next event unforgettable.</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="#booking" class="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 font-semibold hover:bg-neutral-100 transition-colors">
          Book Now
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>
        <a href="#contact" class="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white hover:text-neutral-900 transition-colors">
          Get In Touch
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
