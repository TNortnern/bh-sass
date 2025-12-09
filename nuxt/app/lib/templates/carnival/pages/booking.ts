import type { TemplatePage } from '../../types'

export const bookingPage: TemplatePage = {
  slug: '/booking',
  title: 'Book Your Rental',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Now - PartyTime Rentals</title>
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
          <a href="/inventory" class="font-medium hover:text-red-600 transition-colors">Rentals</a>
          <a href="/about" class="font-medium hover:text-red-600 transition-colors">About</a>
          <a href="/contact" class="font-medium hover:text-red-600 transition-colors">Contact</a>
          <a href="/booking" class="px-4 py-2 bg-red-600 text-white rounded-full font-semibold">Book Now</a>
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
        🎉 Book Your Party Rental
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        Select your rental, pick a date, and you're all set!
      </p>
    </div>
  </section>

  <!-- Info Banner -->
  <section class="bg-yellow-100 border-y-4 border-yellow-400 py-4">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <span class="text-3xl">🎈</span>
        <p class="text-lg font-semibold text-gray-800">
          <strong>Easy Booking:</strong> Choose your rental, pick your date, and we'll handle the rest!
        </p>
      </div>
    </div>
  </section>

  <!-- Booking Widget Section -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <!-- Smart Block: Booking Widget -->
        <div data-smart-block="booking-widget" class="carnival-card bg-white">
          <!-- The booking widget will be dynamically injected here -->
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🎪</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">Interactive Booking Widget</h2>
            <p class="text-gray-600 mb-6 max-w-xl mx-auto">
              This is where your custom booking widget will appear. Customers can browse available rentals,
              select dates, and complete their reservation all in one place!
            </p>
            <div class="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg">
              <code>data-smart-block="booking-widget"</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          How Our Booking Works
        </h2>
        <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
          It's quick and easy - you'll be all set in minutes!
        </p>
      </div>

      <div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            1
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Choose Your Rental</h3>
          <p class="text-gray-600">
            Browse our selection and pick the perfect bounce house or party rental.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            2
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Select Your Date</h3>
          <p class="text-gray-600">
            Check availability and choose your party date from our calendar.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            3
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Enter Details</h3>
          <p class="text-gray-600">
            Provide your contact info and delivery address.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
            4
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Confirm & Pay</h3>
          <p class="text-gray-600">
            Review your booking and pay your deposit securely online.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="carnival-section bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
          Why Book Online?
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="carnival-card border-l-8 border-green-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">⚡</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Instant Confirmation</h3>
              <p class="text-gray-600">
                Get immediate confirmation of your booking - no waiting!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-blue-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">📅</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Real-Time Availability</h3>
              <p class="text-gray-600">
                See what's available right now - no guessing games!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-purple-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">🔒</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p class="text-gray-600">
                Safe, encrypted payment processing you can trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Need Help -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-3xl mx-auto carnival-card bg-white border-4 border-yellow-400">
        <div class="text-5xl mb-4">💬</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">
          Need Help Booking?
        </h2>
        <p class="text-lg text-gray-600 mb-6">
          Prefer to book over the phone or have questions? We're here to help!
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:5551234567" class="px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-lg">
            📞 Call (555) 123-4567
          </a>
          <a href="/contact" class="px-8 py-4 bg-gray-200 text-gray-800 rounded-full font-bold text-lg hover:bg-gray-300 transition-all">
            Send a Message
          </a>
        </div>
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
