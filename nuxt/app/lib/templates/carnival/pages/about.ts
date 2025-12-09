import type { TemplatePage } from '../../types'

export const aboutPage: TemplatePage = {
  slug: '/about',
  title: 'About Us - Our Story',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us - PartyTime Rentals</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white shadow-md">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="text-2xl font-bold text-red-600">🎪 PartyTime</a>
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="font-medium hover:text-red-600 transition-colors">Home</a>
          <a href="/inventory" class="font-medium hover:text-red-600 transition-colors">Rentals</a>
          <a href="/about" class="font-medium text-red-600">About</a>
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
        🎉 About PartyTime
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        Your trusted partner in creating unforgettable celebrations since 2010
      </p>
    </div>
  </section>

  <!-- Our Story -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="carnival-card bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400">
          <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
          </div>
          <div class="prose prose-lg max-w-none text-gray-700">
            <p class="text-lg leading-relaxed mb-4">
              <strong class="text-red-600">PartyTime Rentals</strong> started with a simple dream: to bring joy and laughter to every celebration in our community. What began as a small family business with just three bounce houses has grown into the area's premier party rental company.
            </p>
            <p class="text-lg leading-relaxed mb-4">
              For over <strong>14 years</strong>, we've been dedicated to providing safe, clean, and exciting entertainment for birthday parties, school events, church gatherings, corporate functions, and community festivals. Our commitment to quality and customer service has made us the go-to choice for families throughout the region.
            </p>
            <p class="text-lg leading-relaxed">
              Today, we're proud to offer the largest selection of bounce houses, water slides, and party equipment in town. But what hasn't changed is our dedication to making your event special, our attention to detail, and our passion for bringing smiles to children's faces.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Values -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          What We Stand For
        </h2>
        <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
          Our core values guide everything we do
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            ✨
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Safety First</h3>
          <p class="text-gray-600">
            Every piece of equipment is inspected, cleaned, and maintained to the highest safety standards. Your children's safety is our top priority.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            💚
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Family Values</h3>
          <p class="text-gray-600">
            As a family-owned business, we treat every customer like family. We care about your event as much as you do.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl text-white">
            🌟
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-3">Excellence</h3>
          <p class="text-gray-600">
            From our equipment to our customer service, we strive for excellence in everything we do. Your satisfaction is guaranteed.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="carnival-section bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Why Families Choose Us
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div class="carnival-card border-l-8 border-red-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">🧼</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Spotlessly Clean</h3>
              <p class="text-gray-600">
                Every rental is deep-cleaned and sanitized before and after each use. We take cleanliness seriously!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-sky-500">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">⏰</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Always On Time</h3>
              <p class="text-gray-600">
                We deliver and set up on schedule, every time. Your party starts when it should!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-yellow-500">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">🛡️</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Fully Insured</h3>
              <p class="text-gray-600">
                We carry comprehensive liability insurance for your peace of mind.
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-purple-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">💰</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Best Prices</h3>
              <p class="text-gray-600">
                Quality equipment at affordable prices. No hidden fees, ever!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-green-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">📞</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Responsive Support</h3>
              <p class="text-gray-600">
                Questions? We're just a phone call away. Local owners, local service!
              </p>
            </div>
          </div>
        </div>

        <div class="carnival-card border-l-8 border-orange-600">
          <div class="flex gap-4 items-start">
            <div class="text-4xl flex-shrink-0">🎪</div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Huge Selection</h3>
              <p class="text-gray-600">
                From small backyard parties to large events, we have the perfect rental for you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Team -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Meet Our Team
        </h2>
        <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
          The friendly faces behind your celebrations
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="carnival-card text-center bg-white">
          <div class="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
            👨‍💼
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-1">Mike Johnson</h3>
          <p class="text-red-600 font-semibold mb-2">Owner & Founder</p>
          <p class="text-gray-600 text-sm">
            Mike started PartyTime with a passion for bringing joy to families in our community.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
            👩‍💼
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-1">Sarah Johnson</h3>
          <p class="text-red-600 font-semibold mb-2">Co-Owner & Event Specialist</p>
          <p class="text-gray-600 text-sm">
            Sarah ensures every detail is perfect and every customer is happy.
          </p>
        </div>

        <div class="carnival-card text-center bg-white">
          <div class="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
            👨‍🔧
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-1">Our Crew</h3>
          <p class="text-red-600 font-semibold mb-2">Delivery & Setup Team</p>
          <p class="text-gray-600 text-sm">
            Our friendly, professional team handles delivery, setup, and pickup with care.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="carnival-section bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Ready to Plan Your Party?
      </h2>
      <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow">
        Let's make your next celebration unforgettable!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/booking" class="px-10 py-5 bg-white text-red-600 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl">
          Book Now
        </a>
        <a href="/contact" class="px-10 py-5 bg-transparent border-4 border-white text-white rounded-full font-bold text-xl hover:bg-white hover:text-red-600 transition-all">
          Contact Us
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
