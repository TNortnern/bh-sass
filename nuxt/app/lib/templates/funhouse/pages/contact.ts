export const contactPage = {
  slug: '/contact',
  title: 'Contact Us - FunHouse Party Rentals',
  content: `
<!-- Playful Responsive Navbar -->
<header class="sticky top-0 z-50 bg-white shadow-lg">
  <nav class="funhouse-container">
    <div class="flex items-center justify-between h-20">
      <a href="/" class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-600 to-orange-500" style="font-family: 'Grandstander', cursive;">
        FunHouse
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="/" class="text-lg font-bold text-gray-700 hover:text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Home</a>
        <a href="/inventory" class="text-lg font-bold text-gray-700 hover:text-purple-600 transition-colors" style="font-family: 'Grandstander', cursive;">Rentals</a>
        <a href="/about" class="text-lg font-bold text-gray-700 hover:text-orange-500 transition-colors" style="font-family: 'Grandstander', cursive;">About</a>
        <a href="/contact" class="text-lg font-bold text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Contact</a>
        <a href="/booking" class="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all" style="font-family: 'Grandstander', cursive;">
          Book Now! 🎉
        </a>
      </div>
      <button class="md:hidden p-2 text-purple-600" aria-label="Menu">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </nav>
</header>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-16 md:py-24 text-white relative overflow-hidden">
  <div class="absolute inset-0 funhouse-dots"></div>
  <div class="absolute top-10 right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-30 funhouse-blob"></div>
  <div class="absolute bottom-10 left-10 w-56 h-56 bg-red-400 rounded-full opacity-20 funhouse-blob-alt"></div>

  <div class="funhouse-container relative z-10 text-center">
    <h1 class="text-5xl md:text-6xl font-black mb-6" style="font-family: 'Grandstander', cursive;">
      Let's Chat! 💬
    </h1>
    <p class="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto">
      Got questions? Need help choosing the perfect inflatable? We're here to help!
    </p>
  </div>
</section>

<!-- Contact Section -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="grid md:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="funhouse-card">
        <h2 class="funhouse-gradient-text mb-6" style="font-size: 2rem;">Send Us a Message 📧</h2>

        <form class="space-y-6">
          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">Your Name *</label>
            <input
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              placeholder="John Doe"
            >
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">Email Address *</label>
            <input
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              placeholder="john@example.com"
            >
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">Phone Number</label>
            <input
              type="tel"
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              placeholder="(555) 123-4567"
            >
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">Your Message *</label>
            <textarea
              required
              rows="5"
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700 resize-none"
              placeholder="Tell us about your party or ask any questions..."
            ></textarea>
          </div>

          <button type="submit" class="funhouse-btn funhouse-btn-primary w-full text-center">
            Send Message! 🚀
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="space-y-8">
        <div>
          <h2 class="funhouse-gradient-text mb-6" style="font-size: 2rem;">Get In Touch 📞</h2>
          <p class="text-lg text-gray-700 mb-8 leading-relaxed">
            We love hearing from you! Whether you have questions, need recommendations, or just want to say hi,
            reach out and we'll get back to you super fast!
          </p>
        </div>

        <!-- Contact Cards -->
        <div class="space-y-4">
          <div class="funhouse-card flex items-start gap-4 hover:scale-105 transition-transform">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
              📞
            </div>
            <div>
              <h3 class="text-xl font-bold mb-1 text-purple-900" style="font-family: 'Grandstander', cursive;">Call Us</h3>
              <p class="text-gray-600 mb-2">Mon-Sat: 9am-7pm</p>
              <a href="tel:5551234567" class="text-xl font-bold text-red-500 hover:text-orange-500 transition-colors">
                (555) 123-4567
              </a>
            </div>
          </div>

          <div class="funhouse-card flex items-start gap-4 hover:scale-105 transition-transform">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
              ✉️
            </div>
            <div>
              <h3 class="text-xl font-bold mb-1 text-purple-900" style="font-family: 'Grandstander', cursive;">Email Us</h3>
              <p class="text-gray-600 mb-2">We'll respond within 24 hours!</p>
              <a href="mailto:fun@funhouse.com" class="text-xl font-bold text-purple-500 hover:text-pink-500 transition-colors">
                fun@funhouse.com
              </a>
            </div>
          </div>

          <div class="funhouse-card flex items-start gap-4 hover:scale-105 transition-transform">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl flex-shrink-0">
              📍
            </div>
            <div>
              <h3 class="text-xl font-bold mb-1 text-purple-900" style="font-family: 'Grandstander', cursive;">Visit Us</h3>
              <p class="text-gray-600 mb-2">Stop by our showroom!</p>
              <p class="text-lg font-bold text-blue-500">
                123 Party Street<br>
                Party Town, USA 12345
              </p>
            </div>
          </div>
        </div>

        <!-- Business Hours -->
        <div class="funhouse-card bg-gradient-to-br from-yellow-50 to-orange-50">
          <h3 class="text-xl font-bold mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Business Hours 🕐</h3>
          <div class="space-y-2 text-gray-700">
            <div class="flex justify-between">
              <span class="font-semibold">Monday - Friday</span>
              <span>9:00 AM - 7:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Saturday</span>
              <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold">Sunday</span>
              <span>By Appointment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">Quick Answers 💡</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Common questions we get asked all the time!
      </p>
    </div>

    <div class="max-w-3xl mx-auto space-y-4">
      <div class="funhouse-card">
        <h3 class="text-xl font-bold mb-3 text-purple-900" style="font-family: 'Grandstander', cursive;">
          How far in advance should I book?
        </h3>
        <p class="text-gray-600 leading-relaxed">
          We recommend booking at least 2-3 weeks in advance, especially for weekends and summer months. But give us a call -
          we often have last-minute availability!
        </p>
      </div>

      <div class="funhouse-card">
        <h3 class="text-xl font-bold mb-3 text-purple-900" style="font-family: 'Grandstander', cursive;">
          Do you deliver and set up?
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Absolutely! We deliver, set up, and pick up everything. You just enjoy the party! Delivery fees vary by location.
        </p>
      </div>

      <div class="funhouse-card">
        <h3 class="text-xl font-bold mb-3 text-purple-900" style="font-family: 'Grandstander', cursive;">
          What if it rains on my party day?
        </h3>
        <p class="text-gray-600 leading-relaxed">
          We totally get it! You can reschedule up to 24 hours before your event with no penalty. We want your party to be perfect!
        </p>
      </div>

      <div class="funhouse-card">
        <h3 class="text-xl font-bold mb-3 text-purple-900" style="font-family: 'Grandstander', cursive;">
          Are your inflatables safe and clean?
        </h3>
        <p class="text-gray-600 leading-relaxed">
          Safety is our #1 priority! Every unit is thoroughly cleaned, sanitized, and inspected before each rental. All equipment
          meets or exceeds safety standards.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="funhouse-section bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white text-center">
  <div class="funhouse-container">
    <h2 class="text-white mb-6" style="font-family: 'Grandstander', cursive; font-size: clamp(2rem, 5vw, 3.5rem);">
      Ready to Book? 🎊
    </h2>
    <p class="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
      Skip the form and book online in just a few clicks!
    </p>
    <a href="/booking" class="funhouse-btn inline-block text-xl py-4 px-10" style="background: white; color: #FF0024;">
      Book Your Party Now! 🚀
    </a>
  </div>
</section>

<!-- Playful Footer -->
<footer class="bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 text-white py-16 relative overflow-hidden">
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
    <div class="absolute bottom-20 right-20 w-48 h-48 bg-orange-400 rounded-full"></div>
    <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-red-400 rounded-full"></div>
  </div>
  <div class="funhouse-container relative z-10">
    <div class="grid md:grid-cols-4 gap-10">
      <div>
        <h3 class="text-3xl font-black mb-4" style="font-family: 'Grandstander', cursive;">FunHouse 🎪</h3>
        <p class="text-purple-200">Bringing joy and laughter to every celebration!</p>
      </div>
      <div>
        <h4 class="text-xl font-bold mb-4" style="font-family: 'Grandstander', cursive;">Explore</h4>
        <ul class="space-y-2">
          <li><a href="/" class="text-purple-200 hover:text-yellow-400 transition-colors">Home</a></li>
          <li><a href="/inventory" class="text-purple-200 hover:text-yellow-400 transition-colors">Rentals</a></li>
          <li><a href="/about" class="text-purple-200 hover:text-yellow-400 transition-colors">About Us</a></li>
          <li><a href="/contact" class="text-purple-200 hover:text-yellow-400 transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xl font-bold mb-4" style="font-family: 'Grandstander', cursive;">Our Stuff</h4>
        <ul class="space-y-2">
          <li><a href="/inventory?cat=bounce" class="text-purple-200 hover:text-orange-400 transition-colors">Bounce Houses</a></li>
          <li><a href="/inventory?cat=water" class="text-purple-200 hover:text-orange-400 transition-colors">Water Slides</a></li>
          <li><a href="/inventory?cat=combo" class="text-purple-200 hover:text-orange-400 transition-colors">Combo Units</a></li>
          <li><a href="/inventory?cat=extras" class="text-purple-200 hover:text-orange-400 transition-colors">Party Extras</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xl font-bold mb-4" style="font-family: 'Grandstander', cursive;">Say Hello!</h4>
        <ul class="space-y-2 text-purple-200">
          <li>📞 (555) 123-4567</li>
          <li>✉️ fun@funhouse.com</li>
          <li>📍 Party Town, USA</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-purple-700 mt-10 pt-8 text-center text-purple-300">
      <p>© 2024 FunHouse Party Rentals. Let's Party! 🎈</p>
    </div>
  </div>
</footer>
  `
}
