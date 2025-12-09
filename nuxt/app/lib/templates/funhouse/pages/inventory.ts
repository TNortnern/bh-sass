export const inventoryPage = {
  slug: '/inventory',
  title: 'Our Rentals - FunHouse Party Rentals',
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
        <a href="/inventory" class="text-lg font-bold text-red-500 transition-colors" style="font-family: 'Grandstander', cursive;">Rentals</a>
        <a href="/about" class="text-lg font-bold text-gray-700 hover:text-orange-500 transition-colors" style="font-family: 'Grandstander', cursive;">About</a>
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
      Our Amazing Rentals! 🎪
    </h1>
    <p class="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto">
      From bouncy castles to splashy slides - find the perfect inflatable for your party!
    </p>
  </div>
</section>

<!-- Category Pills -->
<section class="bg-white py-8 sticky top-20 z-40 border-b-4 border-purple-100">
  <div class="funhouse-container">
    <div class="flex flex-wrap gap-3 justify-center">
      <button class="px-6 py-3 rounded-full font-bold transition-all bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg" style="font-family: 'Grandstander', cursive;">
        🎪 All Rentals
      </button>
      <button class="px-6 py-3 rounded-full font-bold transition-all bg-purple-100 text-purple-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white" style="font-family: 'Grandstander', cursive;">
        🏰 Bounce Houses
      </button>
      <button class="px-6 py-3 rounded-full font-bold transition-all bg-blue-100 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white" style="font-family: 'Grandstander', cursive;">
        🌊 Water Slides
      </button>
      <button class="px-6 py-3 rounded-full font-bold transition-all bg-pink-100 text-pink-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white" style="font-family: 'Grandstander', cursive;">
        🎯 Combo Units
      </button>
      <button class="px-6 py-3 rounded-full font-bold transition-all bg-orange-100 text-orange-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white" style="font-family: 'Grandstander', cursive;">
        🎊 Party Extras
      </button>
    </div>
  </div>
</section>

<!-- Rental Items Grid - Smart Block -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <!-- Smart Block: Will be replaced with actual rental items -->
    <div data-smart-block="rental-item-grid" data-columns="3">
      <!-- Fallback/Preview Content -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Item 1 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-purple-400 to-pink-400 h-72 flex items-center justify-center text-white text-7xl">
              🏰
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold" style="font-family: 'Grandstander', cursive;">
                POPULAR!
              </span>
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Princess Castle</h3>
          <p class="text-gray-600 mb-4">Perfect for royal celebrations! Ages 3-12.</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $199/day
            </div>
            <div class="text-sm text-gray-500">
              15ft x 15ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>

        <!-- Item 2 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-blue-400 to-cyan-400 h-72 flex items-center justify-center text-white text-7xl">
              🌊
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold" style="font-family: 'Grandstander', cursive;">
                NEW!
              </span>
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Tropical Splash</h3>
          <p class="text-gray-600 mb-4">Beat the heat! Water slide fun for all ages.</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $249/day
            </div>
            <div class="text-sm text-gray-500">
              20ft x 12ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>

        <!-- Item 3 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-orange-400 to-red-400 h-72 flex items-center justify-center text-white text-7xl">
              🎪
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Mega Combo</h3>
          <p class="text-gray-600 mb-4">Bounce, climb, and slide all in one!</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $299/day
            </div>
            <div class="text-sm text-gray-500">
              25ft x 15ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>

        <!-- Item 4 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-green-400 to-emerald-400 h-72 flex items-center justify-center text-white text-7xl">
              🦖
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Dino Adventure</h3>
          <p class="text-gray-600 mb-4">Prehistoric bouncing fun! Roar!</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $189/day
            </div>
            <div class="text-sm text-gray-500">
              15ft x 15ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>

        <!-- Item 5 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-yellow-400 to-orange-400 h-72 flex items-center justify-center text-white text-7xl">
              🚀
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Space Rocket</h3>
          <p class="text-gray-600 mb-4">Blast off into bouncing fun!</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $199/day
            </div>
            <div class="text-sm text-gray-500">
              18ft x 15ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>

        <!-- Item 6 -->
        <div class="funhouse-card group">
          <div class="relative mb-4 overflow-hidden rounded-2xl">
            <div class="bg-gradient-to-br from-pink-400 to-purple-400 h-72 flex items-center justify-center text-white text-7xl">
              🦄
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold" style="font-family: 'Grandstander', cursive;">
                POPULAR!
              </span>
            </div>
          </div>
          <h3 class="text-2xl mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Unicorn Dreams</h3>
          <p class="text-gray-600 mb-4">Magical bouncing experience!</p>
          <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-black funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
              $209/day
            </div>
            <div class="text-sm text-gray-500">
              15ft x 15ft
            </div>
          </div>
          <a href="/booking" class="funhouse-btn funhouse-btn-primary text-base py-2 px-6 w-full text-center">
            Book It! 🎉
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="funhouse-section bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white text-center">
  <div class="funhouse-container">
    <h2 class="text-white mb-6" style="font-family: 'Grandstander', cursive; font-size: clamp(2rem, 5vw, 3.5rem);">
      Can't Decide? We Can Help! 💬
    </h2>
    <p class="text-xl mb-8 text-white/95 max-w-2xl mx-auto">
      Not sure which inflatable is perfect for your party? Give us a call and we'll help you choose!
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="/contact" class="funhouse-btn inline-block text-lg py-3 px-8" style="background: white; color: #FF0024;">
        Contact Us! 📞
      </a>
      <a href="/booking" class="funhouse-btn funhouse-btn-primary inline-block text-lg py-3 px-8">
        Book Online! 🎉
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
