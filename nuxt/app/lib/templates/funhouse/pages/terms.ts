export const termsPage = {
  slug: '/terms',
  title: 'Terms & Conditions - FunHouse Party Rentals',
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
<section class="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-16 text-white relative overflow-hidden">
  <div class="absolute inset-0 funhouse-dots"></div>
  <div class="funhouse-container relative z-10 text-center">
    <h1 class="text-4xl md:text-5xl font-black mb-4" style="font-family: 'Grandstander', cursive;">
      Terms & Conditions 📜
    </h1>
    <p class="text-lg text-white/90">Last updated: December 2024</p>
  </div>
</section>

<!-- Terms Content -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="max-w-4xl mx-auto prose prose-lg">
      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">1. Rental Agreement</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          By booking with FunHouse Party Rentals, you agree to the following terms and conditions. This agreement
          is between you (the customer) and FunHouse Party Rentals.
        </p>
        <p class="text-gray-700 leading-relaxed">
          All rentals are subject to availability and confirmation. We reserve the right to refuse service to
          anyone for any reason.
        </p>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">2. Booking & Payment</h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">💳</span>
            <span>A 50% deposit is required at the time of booking to secure your reservation.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">💰</span>
            <span>The remaining balance is due on or before the day of delivery.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">📅</span>
            <span>Bookings made within 48 hours of the event require full payment upfront.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">✅</span>
            <span>We accept credit cards, debit cards, and cash payments.</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">3. Cancellation Policy</h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">📞</span>
            <span>Cancellations made 7+ days before the event: Full refund of deposit.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">📅</span>
            <span>Cancellations made 3-6 days before: 50% refund of deposit.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">⏰</span>
            <span>Cancellations made less than 3 days before: No refund.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🌧️</span>
            <span>Weather-related cancellations can be rescheduled at no charge with 24 hours notice.</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">4. Delivery & Setup</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          We will deliver and set up the equipment at the agreed-upon time. You must provide:
        </p>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">📏</span>
            <span>A flat, level surface free of rocks, sticks, and debris.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">⚡</span>
            <span>Access to a standard electrical outlet within 100 feet of the setup area.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🚪</span>
            <span>Clear access to the setup location (minimum 4ft gate width).</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🔒</span>
            <span>Adequate supervision during the entire rental period.</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">5. Safety & Usage</h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">👥</span>
            <span>Adult supervision is required at all times when the equipment is in use.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">👟</span>
            <span>Shoes, glasses, jewelry, and sharp objects must be removed before use.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🚫</span>
            <span>No food, drinks, or gum allowed on inflatables.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🌬️</span>
            <span>Inflatables must not be used in winds exceeding 20 mph or during rain/storms.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">⚠️</span>
            <span>Follow all posted weight limits and capacity restrictions.</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">6. Liability & Damage</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          The customer assumes all responsibility for injury or damage that occurs during the rental period.
        </p>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🛡️</span>
            <span>FunHouse Party Rentals is fully insured, but liability for injuries falls to the customer.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">💔</span>
            <span>Customer is responsible for any damage to equipment beyond normal wear and tear.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-2xl flex-shrink-0">🔌</span>
            <span>DO NOT unplug or turn off the blower - this can damage the equipment.</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">Questions?</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          If you have any questions about these terms and conditions, please don't hesitate to contact us!
        </p>
        <div class="flex flex-wrap gap-4">
          <a href="/contact" class="funhouse-btn funhouse-btn-primary inline-block text-base py-2 px-6">
            Contact Us 💬
          </a>
          <a href="/booking" class="funhouse-btn inline-block text-base py-2 px-6" style="background: #520088; color: white;">
            Book Now 🎉
          </a>
        </div>
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
