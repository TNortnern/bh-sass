import type { TemplatePage } from '../../types'

export const inventoryPage: TemplatePage = {
  slug: '/inventory',
  title: 'Browse Our Rentals',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Browse Rentals - PartyTime Rentals</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white shadow-md">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-2xl font-bold text-red-600">🎪 PartyTime</a>
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="font-medium hover:text-red-600 transition-colors">Home</a>
          <a href="/inventory" class="font-medium text-red-600">Rentals</a>
          <a href="/about" class="font-medium hover:text-red-600 transition-colors">About</a>
          <a href="/contact" class="font-medium hover:text-red-600 transition-colors">Contact</a>
          <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">Book Now</a>
        </div>
        <button class="md:hidden p-2" aria-label="Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <!-- Page Header -->
  <section class="carnival-sky-bg py-16">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
        🎈 Browse Our Rentals
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        Explore our huge selection of bounce houses, water slides, and party equipment!
      </p>
    </div>
  </section>

  <!-- Info Banner -->
  <section class="bg-yellow-100 border-y-4 border-yellow-400 py-4">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
        <span class="text-3xl">🎉</span>
        <p class="text-lg font-semibold text-gray-800">
          <strong>Special Offer:</strong> Book 2+ items and save 15%! Use code PARTY15
        </p>
      </div>
    </div>
  </section>

  <!-- Filter Section -->
  <section class="bg-white py-8 border-b-2 border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap items-center gap-4 justify-center">
        <button class="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all shadow-md">
          All Items
        </button>
        <button class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all">
          🏰 Bounce Houses
        </button>
        <button class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all">
          💦 Water Slides
        </button>
        <button class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all">
          🎪 Combos
        </button>
        <button class="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all">
          🎁 Party Extras
        </button>
      </div>
    </div>
  </section>

  <!-- Rental Items Grid -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <!-- Smart Block: Rental Item Grid -->
      <div data-smart-block="rental-item-grid" data-filterable="true">
        <!-- Dynamic rental items will be injected here -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Placeholder cards for preview -->
          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-pink-300 to-purple-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🏰
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                Bounce House
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Princess Castle</h3>
            <p class="text-gray-600 mb-4 text-sm">
              15ft x 15ft • Ages 3-12 • Indoor/Outdoor
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$199</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-blue-300 to-cyan-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              💦
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Water Slide
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Tropical Splash</h3>
            <p class="text-gray-600 mb-4 text-sm">
              20ft x 12ft • Ages 5+ • Outdoor Only
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$249</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-green-300 to-emerald-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🦖
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Bounce House
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Dino Adventure</h3>
            <p class="text-gray-600 mb-4 text-sm">
              18ft x 18ft • Ages 4-14 • Indoor/Outdoor
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$229</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-orange-300 to-red-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🔥
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                Combo Unit
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Fire Rescue Combo</h3>
            <p class="text-gray-600 mb-4 text-sm">
              22ft x 15ft • Ages 3-12 • Outdoor Only
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$299</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-yellow-300 to-amber-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🎪
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                Bounce House
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Circus Fun House</h3>
            <p class="text-gray-600 mb-4 text-sm">
              15ft x 15ft • Ages 3-10 • Indoor/Outdoor
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$189</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-indigo-300 to-purple-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🌊
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                Water Slide
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Wave Runner</h3>
            <p class="text-gray-600 mb-4 text-sm">
              24ft x 14ft • Ages 6+ • Outdoor Only
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$279</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-rose-300 to-pink-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🦄
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                Bounce House
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Unicorn Dreams</h3>
            <p class="text-gray-600 mb-4 text-sm">
              15ft x 15ft • Ages 3-12 • Indoor/Outdoor
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$209</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>

          <div class="carnival-card">
            <div class="aspect-video bg-gradient-to-br from-teal-300 to-cyan-400 rounded-lg mb-4 flex items-center justify-center text-6xl">
              🏴‍☠️
            </div>
            <div class="mb-2">
              <span class="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                Combo Unit
              </span>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Pirate Ship Adventure</h3>
            <p class="text-gray-600 mb-4 text-sm">
              25ft x 18ft • Ages 4-14 • Outdoor Only
            </p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold text-red-600">$319</span>
              <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all">
                Book
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="carnival-section bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
        Don't See What You're Looking For?
      </h2>
      <p class="text-lg mb-6 max-w-2xl mx-auto drop-shadow">
        Give us a call! We have more rentals available and can help you find the perfect fit for your party.
      </p>
      <a href="/contact" class="px-8 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl inline-block">
        Contact Us
      </a>
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
