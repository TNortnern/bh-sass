export const homePage = {
  slug: '/',
  title: 'Home - FunHouse Party Rentals',
  content: `
<!-- CSS-only mobile menu styles -->
<style>
  .funhouse-nav-toggle { display: none; }
  .funhouse-nav-toggle:checked ~ .funhouse-mobile-menu { display: flex; }
  .funhouse-nav-toggle:checked ~ .funhouse-nav-inner .funhouse-hamburger-open { display: none; }
  .funhouse-nav-toggle:checked ~ .funhouse-nav-inner .funhouse-hamburger-close { display: block; }
  .funhouse-hamburger-close { display: none; }
  @media (min-width: 768px) {
    .funhouse-mobile-menu { display: none !important; }
    .funhouse-hamburger-btn { display: none !important; }
  }
</style>

<!-- Playful Responsive Navbar -->
<header class="sticky top-0 z-50 bg-white shadow-lg">
  <input type="checkbox" id="funhouse-nav-toggle" class="funhouse-nav-toggle" />
  <nav class="funhouse-nav-inner funhouse-container">
    <div class="flex items-center justify-between h-20">
      <a href="/" class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-600 to-orange-500" style="font-family: 'Grandstander', cursive;">
        FunHouse
      </a>
      <div class="hidden md:flex items-center gap-8">
        <a href="/" class="text-lg font-bold text-gray-700 hover:text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Home</a>
        <a href="/inventory" class="text-lg font-bold text-gray-700 hover:text-purple-600 transition-colors" style="font-family: 'Grandstander', cursive;">Rentals</a>
        <a href="/about" class="text-lg font-bold text-gray-700 hover:text-orange-500 transition-colors" style="font-family: 'Grandstander', cursive;">About</a>
        <a href="/contact" class="text-lg font-bold text-gray-700 hover:text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Contact</a>
        <a href="/booking" class="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all" style="font-family: 'Grandstander', cursive;">
          Book Now! 🎉
        </a>
      </div>
      <label for="funhouse-nav-toggle" class="funhouse-hamburger-btn md:hidden p-2 text-purple-600 cursor-pointer" aria-label="Menu">
        <svg class="funhouse-hamburger-open w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg class="funhouse-hamburger-close w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </label>
    </div>
  </nav>
  <!-- Mobile Menu -->
  <div class="funhouse-mobile-menu hidden flex-col bg-white border-t border-purple-100 md:hidden">
    <div class="px-4 py-4 space-y-1">
      <a href="/" class="block px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-pink-50 font-bold rounded-lg transition-colors" style="font-family: 'Grandstander', cursive;">Home</a>
      <a href="/inventory" class="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 font-bold rounded-lg transition-colors" style="font-family: 'Grandstander', cursive;">Rentals</a>
      <a href="/about" class="block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-bold rounded-lg transition-colors" style="font-family: 'Grandstander', cursive;">About</a>
      <a href="/contact" class="block px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-pink-50 font-bold rounded-lg transition-colors" style="font-family: 'Grandstander', cursive;">Contact</a>
      <a href="/booking" class="block mt-3 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg text-center transition-all" style="font-family: 'Grandstander', cursive;">
        Book Now! 🎉
      </a>
    </div>
  </div>
</header>

<!-- Hero Section - Dive Into The Fun! -->
<section class="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-20 md:py-32 funhouse-confetti">
  <div class="absolute inset-0 funhouse-dots"></div>

  <!-- Floating Decorative Shapes -->
  <div class="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30 animate-pulse funhouse-blob"></div>
  <div class="absolute bottom-20 right-10 w-48 h-48 bg-red-400 rounded-full opacity-20 funhouse-blob-alt"></div>
  <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-25"></div>

  <div class="funhouse-container relative z-10">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="text-white">
        <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight" style="font-family: 'Grandstander', cursive; text-shadow: 3px 3px 0 rgba(0,0,0,0.2);">
          Dive Into<br>The Fun! 🎈
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-white/95 font-medium">
          Amazing bounce houses, epic water slides, and unforgettable memories for your next celebration!
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="/booking" class="funhouse-btn funhouse-btn-primary inline-block">
            Book Your Party! 🎉
          </a>
          <a href="/inventory" class="funhouse-btn inline-block" style="background: white; color: #520088;">
            Browse Rentals
          </a>
        </div>
        <div class="mt-10 flex flex-wrap gap-8 text-white">
          <div>
            <div class="text-4xl font-black" style="font-family: 'Grandstander', cursive;">500+</div>
            <div class="text-lg opacity-90">Happy Parties</div>
          </div>
          <div>
            <div class="text-4xl font-black" style="font-family: 'Grandstander', cursive;">50+</div>
            <div class="text-lg opacity-90">Fun Inflatables</div>
          </div>
          <div>
            <div class="text-4xl font-black" style="font-family: 'Grandstander', cursive;">100%</div>
            <div class="text-lg opacity-90">Smiles Guaranteed</div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="relative z-10 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/40">
          <img src="https://placehold.co/600x600/8B5CF6/FFFFFF?text=Bounce+House+Fun" alt="Bounce House" class="rounded-2xl shadow-2xl w-full">
        </div>
        <!-- Floating emoji decorations -->
        <div class="absolute -top-6 -left-6 text-6xl animate-bounce" style="animation-duration: 2s;">🎪</div>
        <div class="absolute -bottom-6 -right-6 text-6xl animate-bounce" style="animation-duration: 2.5s; animation-delay: 0.5s;">🎊</div>
      </div>
    </div>
  </div>
</section>

<!-- Services Section -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">What We Bring To Your Party 🎉</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        From classic bounce houses to thrilling water slides, we've got everything to make your event legendary!
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Service Card 1 -->
      <div class="funhouse-card text-center group">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          🏰
        </div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Bounce Houses</h3>
        <p class="text-gray-600 leading-relaxed">
          Classic castles, themed adventures, and epic jumping experiences for all ages!
        </p>
      </div>

      <!-- Service Card 2 -->
      <div class="funhouse-card text-center group">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          🌊
        </div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Water Slides</h3>
        <p class="text-gray-600 leading-relaxed">
          Beat the heat with our awesome water slides and splash zones. Summer fun at its best!
        </p>
      </div>

      <!-- Service Card 3 -->
      <div class="funhouse-card text-center group">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          🎪
        </div>
        <h3 class="text-2xl mb-4 text-purple-900" style="font-family: 'Grandstander', cursive;">Combo Units</h3>
        <p class="text-gray-600 leading-relaxed">
          Double the fun! Bouncing AND sliding in one amazing inflatable adventure.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Featured Rentals - Smart Block -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">Our Most Popular Rentals 🌟</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Check out our crowd favorites! These party stars are booked again and again.
      </p>
    </div>

    <!-- Smart Block: Will be replaced with actual rental items -->
    <div data-smart-block="rental-item-grid" data-limit="6" data-featured="true">
      <!-- Fallback/Preview Content -->
      <div class="grid md:grid-cols-3 gap-8">
        <div class="funhouse-card">
          <div class="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl h-64 mb-4 flex items-center justify-center text-white text-6xl">
            🏰
          </div>
          <h3 class="text-xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Princess Castle</h3>
          <p class="text-gray-600 mb-4">The ultimate royal bouncing experience!</p>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6">Book It!</a>
        </div>

        <div class="funhouse-card">
          <div class="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl h-64 mb-4 flex items-center justify-center text-white text-6xl">
            🌊
          </div>
          <h3 class="text-xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Tropical Splash</h3>
          <p class="text-gray-600 mb-4">Cool off with this amazing water slide!</p>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6">Book It!</a>
        </div>

        <div class="funhouse-card">
          <div class="bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl h-64 mb-4 flex items-center justify-center text-white text-6xl">
            🎪
          </div>
          <h3 class="text-xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Mega Combo</h3>
          <p class="text-gray-600 mb-4">Bounce, climb, and slide - all in one!</p>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6">Book It!</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Why Families Love Us -->
<section class="funhouse-section bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white relative overflow-hidden">
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 right-20 w-64 h-64 bg-yellow-300 rounded-full funhouse-blob"></div>
    <div class="absolute bottom-10 left-10 w-80 h-80 bg-orange-300 rounded-full funhouse-blob-alt"></div>
  </div>

  <div class="funhouse-container relative z-10">
    <div class="text-center mb-16">
      <h2 class="text-white mb-4" style="font-family: 'Grandstander', cursive; font-size: clamp(2rem, 5vw, 3.5rem);">
        Why Families Love Us! ❤️
      </h2>
      <p class="text-xl text-white/90 max-w-2xl mx-auto">
        Don't just take our word for it - hear from our happy party hosts!
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Testimonial 1 -->
      <div class="bg-white/15 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 hover:bg-white/25 transition-all">
        <div class="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
        <p class="text-lg mb-6 leading-relaxed">
          "Best birthday party ever! The kids had an absolute blast, and setup was super easy. Highly recommend!"
        </p>
        <div class="font-bold text-xl" style="font-family: 'Grandstander', cursive;">- Sarah M.</div>
        <div class="text-white/80">Birthday Party Host</div>
      </div>

      <!-- Testimonial 2 -->
      <div class="bg-white/15 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 hover:bg-white/25 transition-all">
        <div class="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
        <p class="text-lg mb-6 leading-relaxed">
          "Professional, on-time, and the equipment was spotless. Our church event was a huge success!"
        </p>
        <div class="font-bold text-xl" style="font-family: 'Grandstander', cursive;">- Pastor Mike</div>
        <div class="text-white/80">Community Event Organizer</div>
      </div>

      <!-- Testimonial 3 -->
      <div class="bg-white/15 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 hover:bg-white/25 transition-all">
        <div class="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
        <p class="text-lg mb-6 leading-relaxed">
          "Booking was so easy, and the water slide was the hit of our summer party. Kids are still talking about it!"
        </p>
        <div class="font-bold text-xl" style="font-family: 'Grandstander', cursive;">- Jennifer L.</div>
        <div class="text-white/80">Graduation Party</div>
      </div>
    </div>
  </div>
</section>

<!-- Stats Section -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 rounded-3xl p-12 md:p-16">
      <div class="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div class="text-6xl mb-3">🎉</div>
          <div class="text-5xl font-black mb-2 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">500+</div>
          <div class="text-lg text-gray-700 font-medium">Happy Events</div>
        </div>

        <div>
          <div class="text-6xl mb-3">🏰</div>
          <div class="text-5xl font-black mb-2 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">50+</div>
          <div class="text-lg text-gray-700 font-medium">Bounce Houses</div>
        </div>

        <div>
          <div class="text-6xl mb-3">⭐</div>
          <div class="text-5xl font-black mb-2 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">5.0</div>
          <div class="text-lg text-gray-700 font-medium">Average Rating</div>
        </div>

        <div>
          <div class="text-6xl mb-3">😊</div>
          <div class="text-5xl font-black mb-2 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">100%</div>
          <div class="text-lg text-gray-700 font-medium">Satisfaction</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="funhouse-section bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white text-center relative overflow-hidden">
  <div class="absolute inset-0">
    <div class="absolute top-10 left-20 w-40 h-40 bg-yellow-400 rounded-full opacity-20 funhouse-blob animate-pulse"></div>
    <div class="absolute bottom-20 right-10 w-56 h-56 bg-orange-400 rounded-full opacity-15 funhouse-blob-alt"></div>
  </div>

  <div class="funhouse-container relative z-10">
    <h2 class="text-white mb-6" style="font-family: 'Grandstander', cursive; font-size: clamp(2.5rem, 6vw, 4rem);">
      Ready to Bounce Into Fun? 🚀
    </h2>
    <p class="text-2xl mb-10 text-white/95 max-w-3xl mx-auto">
      Book your party today and get ready for an unforgettable celebration! We'll bring the fun right to your door.
    </p>
    <div class="flex flex-wrap gap-6 justify-center">
      <a href="/booking" class="funhouse-btn inline-block text-xl py-4 px-10" style="background: white; color: #FF0024; box-shadow: 0 10px 40px rgba(255, 255, 255, 0.3);">
        Book Your Party Now! 🎊
      </a>
      <a href="/inventory" class="funhouse-btn inline-block text-xl py-4 px-10" style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); color: white; border: 2px solid white;">
        Browse All Rentals
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
