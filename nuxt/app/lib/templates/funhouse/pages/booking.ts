export const bookingPage = {
  slug: '/booking',
  title: 'Book Now - FunHouse Party Rentals',
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
<section class="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-16 md:py-20 text-white relative overflow-hidden">
  <div class="absolute inset-0 funhouse-dots"></div>
  <div class="absolute top-10 right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-30 funhouse-blob"></div>
  <div class="absolute bottom-10 left-10 w-56 h-56 bg-red-400 rounded-full opacity-20 funhouse-blob-alt"></div>

  <div class="funhouse-container relative z-10 text-center">
    <h1 class="text-5xl md:text-6xl font-black mb-6" style="font-family: 'Grandstander', cursive;">
      Let's Book Your Party! 🎊
    </h1>
    <p class="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto">
      Choose your inflatable, pick your date, and get ready for an amazing celebration!
    </p>
  </div>
</section>

<!-- Booking Widget Section -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <!-- Smart Block: Booking Widget -->
    <div class="max-w-5xl mx-auto">
      <div class="funhouse-card p-8" data-smart-block="booking-widget">
        <!-- Fallback/Preview Content -->
        <div class="text-center py-16">
          <div class="text-8xl mb-6">🎪</div>
          <h2 class="text-3xl font-black mb-4 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
            Booking Widget Loads Here
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            The interactive booking widget will appear in this space, allowing customers to:
          </p>
          <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div>
              <div class="text-4xl mb-3">📅</div>
              <h3 class="font-bold text-lg mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Pick Dates</h3>
              <p class="text-gray-600">See availability calendar and choose your party date</p>
            </div>
            <div>
              <div class="text-4xl mb-3">🏰</div>
              <h3 class="font-bold text-lg mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Choose Item</h3>
              <p class="text-gray-600">Browse available inflatables with live pricing</p>
            </div>
            <div>
              <div class="text-4xl mb-3">✅</div>
              <h3 class="font-bold text-lg mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Confirm</h3>
              <p class="text-gray-600">Enter details and complete your booking instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Why Book With Us -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="funhouse-gradient-text mb-4">Why Book With FunHouse? 🌟</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Booking is easy, but the fun is what sets us apart!
      </p>
    </div>

    <div class="grid md:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl">
          ⚡
        </div>
        <h3 class="text-xl font-bold mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Instant Booking</h3>
        <p class="text-gray-600">Book online in minutes - no waiting for approval!</p>
      </div>

      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
          💯
        </div>
        <h3 class="text-xl font-bold mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Best Prices</h3>
        <p class="text-gray-600">Competitive rates with no hidden fees!</p>
      </div>

      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl">
          🚚
        </div>
        <h3 class="text-xl font-bold mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Free Setup</h3>
        <p class="text-gray-600">We deliver, set up, and pick up - all included!</p>
      </div>

      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-4xl">
          🛡️
        </div>
        <h3 class="text-xl font-bold mb-2 text-purple-900" style="font-family: 'Grandstander', cursive;">Safety First</h3>
        <p class="text-gray-600">Fully insured, inspected, and sanitized equipment!</p>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="funhouse-section bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
  <div class="funhouse-container">
    <div class="text-center mb-16">
      <h2 class="text-white mb-4" style="font-family: 'Grandstander', cursive; font-size: clamp(2rem, 5vw, 3.5rem);">
        Happy Party Hosts! 🎉
      </h2>
      <p class="text-xl text-white/90 max-w-2xl mx-auto">
        See what our customers are saying about their FunHouse experience!
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div class="bg-white/15 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30">
        <div class="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
        <p class="text-lg mb-6 leading-relaxed">
          "Easiest booking process ever! The kids had the time of their lives, and the bounce house was spotless. Will definitely book again!"
        </p>
        <div class="font-bold text-xl" style="font-family: 'Grandstander', cursive;">- Maria T.</div>
      </div>

      <div class="bg-white/15 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30">
        <div class="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
        <p class="text-lg mb-6 leading-relaxed">
          "Professional service from start to finish. They arrived early, set everything up perfectly, and the kids went WILD! Best party ever!"
        </p>
        <div class="font-bold text-xl" style="font-family: 'Grandstander', cursive;">- David K.</div>
      </div>
    </div>
  </div>
</section>

<!-- Need Help? -->
<section class="funhouse-section bg-gradient-to-b from-pink-50 to-purple-50">
  <div class="funhouse-container">
    <div class="funhouse-card text-center max-w-3xl mx-auto bg-gradient-to-br from-yellow-50 to-orange-50">
      <div class="text-6xl mb-6">💬</div>
      <h2 class="text-3xl font-black mb-4 funhouse-gradient-text" style="font-family: 'Grandstander', cursive;">
        Need Help Choosing?
      </h2>
      <p class="text-xl text-gray-700 mb-8">
        Not sure which inflatable is perfect for your party? Our friendly team is standing by to help!
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="tel:5551234567" class="funhouse-btn funhouse-btn-primary inline-block text-lg py-3 px-8">
          📞 Call (555) 123-4567
        </a>
        <a href="/contact" class="funhouse-btn inline-block text-lg py-3 px-8" style="background: white; color: #520088; border: 2px solid #520088;">
          💌 Send a Message
        </a>
      </div>
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
