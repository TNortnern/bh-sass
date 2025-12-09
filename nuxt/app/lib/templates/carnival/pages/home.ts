import type { TemplatePage } from '../../types'

export const homePage: TemplatePage = {
  slug: '/',
  title: 'Home - Your Party Starts Here!',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PartyTime Rentals - Your Party Starts Here!</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  <!-- CSS-only mobile menu styles -->
  <style>
    .carnival-nav-toggle { display: none; }
    .carnival-nav-toggle:checked ~ .carnival-mobile-menu { display: flex; }
    .carnival-nav-toggle:checked ~ .carnival-nav-container .carnival-hamburger-open { display: none; }
    .carnival-nav-toggle:checked ~ .carnival-nav-container .carnival-hamburger-close { display: block; }
    .carnival-hamburger-close { display: none; }
    @media (min-width: 768px) {
      .carnival-mobile-menu { display: none !important; }
      .carnival-hamburger-btn { display: none !important; }
    }
  </style>

  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white shadow-md">
    <input type="checkbox" id="carnival-nav-toggle" class="carnival-nav-toggle" />
    <nav class="carnival-nav-container container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-2xl font-bold text-red-600">🎪 PartyTime</a>
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="font-medium hover:text-red-600 transition-colors">Home</a>
          <a href="/inventory" class="font-medium hover:text-red-600 transition-colors">Rentals</a>
          <a href="/about" class="font-medium hover:text-red-600 transition-colors">About</a>
          <a href="/contact" class="font-medium hover:text-red-600 transition-colors">Contact</a>
          <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">Book Now</a>
        </div>
        <label for="carnival-nav-toggle" class="carnival-hamburger-btn md:hidden p-2 cursor-pointer" aria-label="Menu">
          <svg class="carnival-hamburger-open w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg class="carnival-hamburger-close w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </label>
      </div>
    </nav>
    <!-- Mobile Menu -->
    <div class="carnival-mobile-menu hidden flex-col bg-white border-t border-gray-100 md:hidden">
      <div class="px-4 py-4 space-y-1">
        <a href="/" class="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">Home</a>
        <a href="/inventory" class="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">Rentals</a>
        <a href="/about" class="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">About</a>
        <a href="/contact" class="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">Contact</a>
        <a href="/booking" class="block mt-3 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 text-center transition-colors">
          Book Now
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="carnival-sky-bg relative overflow-hidden py-20 md:py-32">
    <div class="festive-dots absolute inset-0"></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8 flex justify-center gap-4">
          <span class="text-6xl balloon-float" style="animation-delay: 0s;">🎈</span>
          <span class="text-6xl balloon-float" style="animation-delay: 0.5s;">🎉</span>
          <span class="text-6xl balloon-float" style="animation-delay: 1s;">🎪</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Your Party Starts Here!
        </h1>
        <p class="text-xl md:text-2xl text-white mb-8 font-medium drop-shadow">
          The biggest selection of bounce houses, water slides, and party rentals in town!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/inventory" class="btn-carnival">
            Browse Rentals
          </a>
          <a href="/booking" class="px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
            Book Online
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Grid -->
  <section class="carnival-section bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🎉 Our Party Rentals
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          From classic bounce houses to thrilling water slides, we have everything to make your event unforgettable!
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="carnival-card text-center group">
          <div class="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🏰
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Bounce Houses</h3>
          <p class="text-gray-600 mb-4">
            Classic fun for all ages! Castles, themes, and more.
          </p>
          <a href="/inventory?cat=bounce" class="text-red-600 font-bold hover:underline">
            View All →
          </a>
        </div>

        <div class="carnival-card text-center group">
          <div class="w-20 h-20 bg-sky-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            💦
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Water Slides</h3>
          <p class="text-gray-600 mb-4">
            Beat the heat with our exciting water slides!
          </p>
          <a href="/inventory?cat=water" class="text-red-600 font-bold hover:underline">
            View All →
          </a>
        </div>

        <div class="carnival-card text-center group">
          <div class="w-20 h-20 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🎪
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Combo Units</h3>
          <p class="text-gray-600 mb-4">
            Bounce, slide, and play all in one!
          </p>
          <a href="/inventory?cat=combo" class="text-red-600 font-bold hover:underline">
            View All →
          </a>
        </div>

        <div class="carnival-card text-center group">
          <div class="w-20 h-20 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
            🎁
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Party Extras</h3>
          <p class="text-gray-600 mb-4">
            Tables, chairs, concessions, and more!
          </p>
          <a href="/inventory?cat=extras" class="text-red-600 font-bold hover:underline">
            View All →
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Rentals -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          ⭐ Featured Rentals
        </h2>
        <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
          Check out our most popular bounce houses and party equipment!
        </p>
      </div>

      <!-- Smart Block: Rental Item Grid -->
      <div data-smart-block="rental-item-grid" data-limit="6" data-featured="true">
        <!-- Dynamic rental items will be injected here -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Placeholder cards for preview -->
          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-pink-300 to-purple-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🏰
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Princess Castle</h3>
            <p class="text-gray-600 mb-4">Perfect for royal celebrations!</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$199</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700">
                Book Now
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-blue-300 to-cyan-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              💦
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Tropical Splash</h3>
            <p class="text-gray-600 mb-4">Cool down with this water slide!</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$249</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700">
                Book Now
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-green-300 to-emerald-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🦖
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Dino Adventure</h3>
            <p class="text-gray-600 mb-4">Journey back to prehistoric fun!</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$229</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="carnival-section bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Why Choose PartyTime?
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          We're committed to making your celebration safe, fun, and stress-free!
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-24 h-24 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            ✓
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">100% Safe & Clean</h3>
          <p class="text-gray-600">
            All equipment is professionally cleaned and inspected before every rental.
          </p>
        </div>

        <div class="text-center">
          <div class="w-24 h-24 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            🚚
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">On-Time Delivery</h3>
          <p class="text-gray-600">
            We deliver and set up on time, every time. Guaranteed!
          </p>
        </div>

        <div class="text-center">
          <div class="w-24 h-24 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            💰
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Best Prices</h3>
          <p class="text-gray-600">
            Affordable rates with no hidden fees. Quality fun for every budget!
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          💬 Happy Customers
        </h2>
        <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
          See what our customers are saying about their party experiences!
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div class="carnival-card bg-yellow-50 border-4 border-yellow-400">
          <div class="flex gap-1 mb-3">
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
          </div>
          <p class="text-gray-700 mb-4 italic">
            "The kids had an absolute blast! The bounce house was clean, and delivery was right on time."
          </p>
          <p class="font-bold text-gray-800">- Sarah M.</p>
        </div>

        <div class="carnival-card bg-pink-50 border-4 border-pink-400">
          <div class="flex gap-1 mb-3">
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
          </div>
          <p class="text-gray-700 mb-4 italic">
            "Best party rental company in town! Great prices and amazing customer service."
          </p>
          <p class="font-bold text-gray-800">- Mike R.</p>
        </div>

        <div class="carnival-card bg-blue-50 border-4 border-blue-400">
          <div class="flex gap-1 mb-3">
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
            <span class="text-yellow-500 text-xl">⭐</span>
          </div>
          <p class="text-gray-700 mb-4 italic">
            "Made my daughter's birthday party unforgettable! Will definitely rent again."
          </p>
          <p class="font-bold text-gray-800">- Jessica L.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="carnival-section bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
        Ready to Book Your Party?
      </h2>
      <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow">
        Don't wait! Our rentals book up fast, especially on weekends!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/booking" class="px-10 py-5 bg-white text-red-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl">
          Book Online Now
        </a>
        <a href="tel:5551234567" class="px-10 py-5 bg-transparent border-4 border-white text-white rounded-full font-bold text-xl hover:bg-white hover:text-red-600 transition-all">
          📞 Call (555) 123-4567
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-sky-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">🎪 PartyTime</h3>
          <p class="text-sky-200">Making celebrations unforgettable since 2010.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sky-200">
            <li><a href="/" class="hover:text-white transition-colors">Home</a></li>
            <li><a href="/inventory" class="hover:text-white transition-colors">Rentals</a></li>
            <li><a href="/about" class="hover:text-white transition-colors">About</a></li>
            <li><a href="/contact" class="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Services</h4>
          <ul class="space-y-2 text-sky-200">
            <li><a href="/inventory?cat=bounce" class="hover:text-white transition-colors">Bounce Houses</a></li>
            <li><a href="/inventory?cat=water" class="hover:text-white transition-colors">Water Slides</a></li>
            <li><a href="/inventory?cat=combo" class="hover:text-white transition-colors">Combos</a></li>
            <li><a href="/inventory?cat=extras" class="hover:text-white transition-colors">Party Extras</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4">Contact</h4>
          <ul class="space-y-2 text-sky-200">
            <li>📞 (555) 123-4567</li>
            <li>✉️ info@partytime.com</li>
            <li>📍 123 Fun Street</li>
            <li>🕒 Mon-Sat: 9am-6pm</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-sky-700 mt-8 pt-8 text-center text-sky-300">
        <p>© 2024 PartyTime Rentals. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
  `
}
