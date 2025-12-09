import type { TemplatePage } from '../../types'

export const termsPage: TemplatePage = {
  slug: '/terms',
  title: 'Terms & Conditions',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms & Conditions - PartyTime Rentals</title>
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
        📋 Terms & Conditions
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        Please review our rental terms before booking
      </p>
    </div>
  </section>

  <!-- Terms Content -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Smart Block: Document Sign -->
        <div data-smart-block="document-sign" data-document-type="terms">
          <!-- Dynamic terms document will be injected here -->
          <div class="carnival-card">
            <div class="prose prose-lg max-w-none">
              <div class="bg-yellow-50 border-l-8 border-yellow-400 p-6 mb-8">
                <p class="text-lg font-semibold text-gray-800 mb-2">
                  📝 Document Signature Required
                </p>
                <p class="text-gray-700">
                  This section will display your customizable terms and conditions document with digital signature capability via the <code>data-smart-block="document-sign"</code> feature.
                </p>
              </div>

              <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-red-600 pb-2">
                Rental Agreement Terms
              </h2>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Booking & Payment</h3>
              <ul class="space-y-2 text-gray-700">
                <li>A 50% deposit is required to secure your reservation</li>
                <li>The remaining balance is due on the day of delivery</li>
                <li>We accept cash, credit cards, and online payments</li>
                <li>All prices are subject to applicable taxes</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Cancellation Policy</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Cancellations made 48+ hours before event: Full refund</li>
                <li>Cancellations made 24-48 hours before event: 50% refund</li>
                <li>Cancellations made less than 24 hours: No refund</li>
                <li>Weather-related cancellations will be handled on a case-by-case basis</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Delivery & Setup</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Delivery, setup, and pickup are included in rental price</li>
                <li>Setup area must be clear and accessible</li>
                <li>Customer must provide access to electrical outlet (if required)</li>
                <li>Setup requires flat, level surface free of debris</li>
                <li>Adequate clearance needed for overhead power lines and tree branches</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Safety Requirements</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Adult supervision is required at all times during use</li>
                <li>Maximum occupancy limits must be observed</li>
                <li>No shoes, glasses, sharp objects, or food/drinks allowed inside</li>
                <li>Inflatables must not be used in high winds or severe weather</li>
                <li>Users must follow age and weight restrictions</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Customer Responsibilities</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Customer is responsible for any damage beyond normal wear and tear</li>
                <li>Equipment must not be moved after setup</li>
                <li>Do not allow pets near or on equipment</li>
                <li>Keep equipment away from sprinklers and water sources (except water slides)</li>
                <li>Notify us immediately of any equipment issues</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Liability</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Customer assumes all risk of injury to persons or property</li>
                <li>PartyTime Rentals is not liable for injuries resulting from improper use</li>
                <li>Customer agrees to indemnify PartyTime Rentals against any claims</li>
                <li>We carry comprehensive liability insurance for equipment failure only</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">7. Damage & Loss</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Customer is responsible for equipment until pickup</li>
                <li>Damage fees will be charged for tears, stains, or missing parts</li>
                <li>Smoking near equipment will result in cleaning fee</li>
                <li>Report any damage immediately - do not attempt repairs</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">8. Weather Policy</h3>
              <ul class="space-y-2 text-gray-700">
                <li>Equipment must be turned off in winds exceeding 20 mph</li>
                <li>Lightning within 10 miles requires immediate evacuation</li>
                <li>We reserve the right to cancel delivery for severe weather</li>
                <li>Rescheduling options available for weather-related issues</li>
              </ul>

              <div class="bg-red-50 border-4 border-red-400 rounded-lg p-6 mt-12">
                <h3 class="text-2xl font-bold text-red-800 mb-4">
                  ⚠️ Agreement Acknowledgment
                </h3>
                <p class="text-gray-700 mb-4">
                  By booking a rental with PartyTime Rentals, you acknowledge that you have read, understood, and agree to these terms and conditions. You also acknowledge that you will supervise the equipment and ensure all safety guidelines are followed.
                </p>
                <p class="text-sm text-gray-600 italic">
                  Last updated: December 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="carnival-section bg-gradient-to-r from-red-600 to-red-700 text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold mb-4 drop-shadow-lg">
        Questions About Our Terms?
      </h2>
      <p class="text-xl mb-6 max-w-2xl mx-auto drop-shadow">
        We're happy to answer any questions you have!
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
