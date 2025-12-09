export const aboutPage = {
  slug: '/about',
  title: 'About Us - FunHouse Party Rentals',
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
        <a href="/about" class="text-lg font-bold text-orange-500 transition-colors" style="font-family: 'Grandstander', cursive;">About</a>
        <a href="/contact" class="text-lg font-bold text-gray-700 hover:text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Contact</a>
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
      Our Story 📖
    </h1>
    <p class="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto">
      Making memories one bounce at a time since 2015!
    </p>
  </div>
</section>

<!-- Our Story Section -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="funhouse-gradient-text mb-6">Who We Are 🎪</h2>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">
          FunHouse Party Rentals started with a simple idea: every kid deserves an unforgettable celebration!
          What began as a single bounce house has grown into the area's premier party rental company.
        </p>
        <p class="text-lg text-gray-700 mb-6 leading-relaxed">
          We're a family-owned business that treats every event like it's our own. From backyard birthdays
          to school carnivals, we bring the fun, laughter, and memories that last a lifetime.
        </p>
        <p class="text-lg text-gray-700 leading-relaxed">
          With over 500 successful events and countless happy smiles, we're proud to be your trusted partner
          for epic celebrations!
        </p>
      </div>
      <div class="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl h-96 flex items-center justify-center text-white text-9xl">
        🎉
      </div>
    </div>
  </div>
</section>

<!-- Our Values -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">What Makes Us Special ✨</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        These values guide everything we do, from cleaning our equipment to delivering smiles!
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="funhouse-card text-center">
        <div class="text-6xl mb-6">🛡️</div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Safety First</h3>
        <p class="text-gray-600 leading-relaxed">
          Every inflatable is inspected, cleaned, and sanitized before each event. Your family's safety is our #1 priority!
        </p>
      </div>

      <div class="funhouse-card text-center">
        <div class="text-6xl mb-6">⏰</div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">On-Time, Every Time</h3>
        <p class="text-gray-600 leading-relaxed">
          We know your party starts on time. We'll be there early to set up, so you can focus on having fun!
        </p>
      </div>

      <div class="funhouse-card text-center">
        <div class="text-6xl mb-6">💖</div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Customer Love</h3>
        <p class="text-gray-600 leading-relaxed">
          From booking to pickup, we're here to make your experience amazing. Questions? We're just a call away!
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Team Section (Optional) -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">Meet The Fun Crew! 🎊</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        The friendly faces behind your favorite party rentals!
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-6xl">
          👨
        </div>
        <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Mike Johnson</h3>
        <p class="text-purple-600 font-bold mb-2">Founder & CEO</p>
        <p class="text-gray-600">Making kids smile since 2015!</p>
      </div>

      <div class="text-center">
        <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-6xl">
          👩
        </div>
        <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Sarah Martinez</h3>
        <p class="text-purple-600 font-bold mb-2">Operations Manager</p>
        <p class="text-gray-600">Keeping the fun running smoothly!</p>
      </div>

      <div class="text-center">
        <div class="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-6xl">
          👨
        </div>
        <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Chris Lee</h3>
        <p class="text-purple-600 font-bold mb-2">Delivery Specialist</p>
        <p class="text-gray-600">On time, every time, with a smile!</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="funhouse-section bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white text-center">
  <div class="funhouse-container">
    <h2 class="text-white mb-6" style="font-family: 'Grandstander', cursive; font-size: clamp(2rem, 5vw, 3.5rem);">
      Ready to Join the Fun? 🚀
    </h2>
    <p class="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
      Let us help make your next event absolutely unforgettable!
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="/booking" class="funhouse-btn inline-block text-lg py-3 px-8" style="background: white; color: #FF0024;">
        Book Your Party! 🎉
      </a>
      <a href="/contact" class="funhouse-btn inline-block text-lg py-3 px-8" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; border: 2px solid white;">
        Get In Touch
      </a>
    </div>
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
