import type { TemplatePage } from '../../types'

export const contactPage: TemplatePage = {
  slug: '/contact',
  title: 'Contact Us',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us - PartyTime Rentals</title>
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
          <a href="/contact" class="font-medium text-red-600">Contact</a>
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
        📞 Get in Touch
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        We'd love to hear from you! Let's make your party amazing.
      </p>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Form -->
        <div class="carnival-card">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Event Date</label>
              <input
                type="date"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Your Message *</label>
              <textarea
                required
                rows="5"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your event and what you're looking for..."
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        <!-- Contact Info Cards -->
        <div class="space-y-6">
          <div class="carnival-card bg-gradient-to-br from-red-50 to-pink-50 border-4 border-red-400">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl text-white flex-shrink-0">
                📞
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                <p class="text-gray-600 mb-2">
                  Give us a call for immediate assistance
                </p>
                <a href="tel:5551234567" class="text-2xl font-bold text-red-600 hover:underline">
                  (555) 123-4567
                </a>
                <p class="text-sm text-gray-500 mt-2">
                  Mon-Sat: 9am-6pm
                </p>
              </div>
            </div>
          </div>

          <div class="carnival-card bg-gradient-to-br from-blue-50 to-sky-50 border-4 border-blue-400">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-3xl text-white flex-shrink-0">
                ✉️
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                <p class="text-gray-600 mb-2">
                  Send us an email anytime
                </p>
                <a href="mailto:info@partytime.com" class="text-xl font-bold text-sky-600 hover:underline break-all">
                  info@partytime.com
                </a>
                <p class="text-sm text-gray-500 mt-2">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div class="carnival-card bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-400">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-3xl text-white flex-shrink-0">
                📍
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
                <p class="text-gray-600 mb-2">
                  Come see our rentals in person!
                </p>
                <p class="text-lg font-bold text-green-600">
                  123 Fun Street<br/>
                  Party City, PC 12345
                </p>
                <p class="text-sm text-gray-500 mt-2">
                  By appointment only
                </p>
              </div>
            </div>
          </div>

          <div class="carnival-card bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-400">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-3xl text-white flex-shrink-0">
                💬
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Text Us</h3>
                <p class="text-gray-600 mb-2">
                  Prefer to text? We've got you covered!
                </p>
                <a href="sms:5551234567" class="text-xl font-bold text-yellow-600 hover:underline">
                  (555) 123-4567
                </a>
                <p class="text-sm text-gray-500 mt-2">
                  Text for quick questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          ❓ Frequently Asked Questions
        </h2>
      </div>

      <div class="max-w-3xl mx-auto space-y-4">
        <div class="carnival-card bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-2">How far in advance should I book?</h3>
          <p class="text-gray-600">
            We recommend booking 2-3 weeks in advance, especially for weekends during peak season (spring and summer). However, we often have availability for last-minute bookings too!
          </p>
        </div>

        <div class="carnival-card bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Do you deliver and set up?</h3>
          <p class="text-gray-600">
            Yes! Delivery, setup, and pickup are all included in your rental price. Our professional team handles everything so you can focus on having fun.
          </p>
        </div>

        <div class="carnival-card bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-2">What's your cancellation policy?</h3>
          <p class="text-gray-600">
            You can cancel up to 48 hours before your event for a full refund. Weather-related cancellations are handled case-by-case with flexibility.
          </p>
        </div>

        <div class="carnival-card bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Do you require a deposit?</h3>
          <p class="text-gray-600">
            Yes, we require a 50% deposit to secure your reservation. The remaining balance is due on delivery day.
          </p>
        </div>

        <div class="carnival-card bg-white">
          <h3 class="text-xl font-bold text-gray-800 mb-2">What if it rains?</h3>
          <p class="text-gray-600">
            Many of our bounce houses can be used indoors if you have the space. For outdoor events, we'll work with you to reschedule or provide a refund if needed.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="carnival-section bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Ready to Book?
      </h2>
      <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow">
        Skip the form and book your rental online in just a few clicks!
      </p>
      <a href="/booking" class="px-10 py-5 bg-white text-red-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl inline-block">
        Book Online Now
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
