import type { TemplatePage } from '../../types'

export const waiverPage: TemplatePage = {
  slug: '/waiver',
  title: 'Liability Waiver',
  content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liability Waiver - PartyTime Rentals</title>
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
        ✍️ Liability Waiver
      </h1>
      <p class="text-xl text-white max-w-2xl mx-auto drop-shadow">
        Required signature for all rental bookings
      </p>
    </div>
  </section>

  <!-- Waiver Content -->
  <section class="carnival-section">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Smart Block: Document Sign (Waiver) -->
        <div data-smart-block="document-sign" data-document-type="waiver" data-signature-required="true">
          <!-- Dynamic waiver document with signature will be injected here -->
          <div class="carnival-card">
            <div class="prose prose-lg max-w-none">
              <div class="bg-red-50 border-l-8 border-red-600 p-6 mb-8">
                <p class="text-lg font-semibold text-gray-800 mb-2">
                  ⚠️ Digital Signature Required
                </p>
                <p class="text-gray-700">
                  This waiver must be signed digitally before your rental can be confirmed. The <code>data-smart-block="document-sign"</code> feature provides secure digital signature capture.
                </p>
              </div>

              <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-red-600 pb-2">
                Release of Liability and Assumption of Risk
              </h2>

              <div class="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-6 mb-8">
                <p class="text-lg font-semibold text-gray-800 mb-3">
                  Please Read Carefully Before Signing
                </p>
                <p class="text-gray-700">
                  This is a legal document that affects your rights. By signing this waiver, you are waiving certain legal rights, including the right to sue for injuries.
                </p>
              </div>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Acknowledgment of Risk</h3>
              <p class="text-gray-700 mb-4">
                I acknowledge that the use of inflatable bounce houses, water slides, and other party rental equipment involves inherent risks, including but not limited to:
              </p>
              <ul class="space-y-2 text-gray-700 mb-6">
                <li>Risk of falling, colliding with other participants, or impact with equipment</li>
                <li>Risk of sprains, strains, bruises, cuts, or more serious injuries</li>
                <li>Risk of equipment deflation or mechanical failure</li>
                <li>Risk associated with improper use or supervision</li>
                <li>Risk of injury from weather conditions or environmental factors</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Assumption of Risk</h3>
              <p class="text-gray-700 mb-6">
                I voluntarily assume all risks associated with the rental and use of equipment from PartyTime Rentals. I understand that these risks cannot be eliminated regardless of the care taken to avoid injuries. I acknowledge that I am in proper physical condition to use the equipment or supervise its use.
              </p>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Release and Waiver of Liability</h3>
              <p class="text-gray-700 mb-4">
                In consideration for being permitted to rent and use equipment from PartyTime Rentals, I hereby:
              </p>
              <ul class="space-y-2 text-gray-700 mb-6">
                <li><strong>RELEASE, WAIVE, DISCHARGE</strong> PartyTime Rentals, its owners, employees, and agents from any and all liability for injuries or damages</li>
                <li><strong>AGREE NOT TO SUE</strong> PartyTime Rentals for any claims, demands, or causes of action arising from injuries sustained during rental use</li>
                <li><strong>INDEMNIFY AND HOLD HARMLESS</strong> PartyTime Rentals from any claims made by other participants, spectators, or third parties</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Safety Rules Agreement</h3>
              <p class="text-gray-700 mb-4">
                I agree to follow all safety rules and guidelines provided by PartyTime Rentals, including:
              </p>
              <ul class="space-y-2 text-gray-700 mb-6">
                <li>Providing constant adult supervision during equipment use</li>
                <li>Enforcing maximum occupancy and weight limits</li>
                <li>Prohibiting shoes, glasses, sharp objects, food, and drinks on equipment</li>
                <li>Immediately stopping use during high winds, rain, or lightning</li>
                <li>Ensuring users follow age and size restrictions</li>
                <li>Not moving, altering, or attempting to repair equipment</li>
                <li>Keeping pets away from equipment</li>
              </ul>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Parental/Guardian Consent</h3>
              <p class="text-gray-700 mb-6">
                If signing on behalf of a minor child or children, I certify that I am the parent or legal guardian with authority to sign this waiver. I acknowledge that I am releasing the rights of the minor(s) as well as my own rights. I understand the legal consequences of this waiver and sign freely and voluntarily without inducement.
              </p>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Damage Responsibility</h3>
              <p class="text-gray-700 mb-6">
                I agree to be financially responsible for any damage to equipment beyond normal wear and tear, including but not limited to tears, stains, burns, theft, or loss of equipment components. I understand that damage fees will be assessed and must be paid immediately.
              </p>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Photographic Release</h3>
              <p class="text-gray-700 mb-6">
                I grant permission for PartyTime Rentals to use photographs or videos taken during equipment delivery or use for promotional purposes, including but not limited to website, social media, and marketing materials.
              </p>

              <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4">Severability</h3>
              <p class="text-gray-700 mb-6">
                I agree that if any portion of this waiver is found to be void or unenforceable, the remaining portions shall remain in full force and effect.
              </p>

              <div class="bg-red-50 border-4 border-red-600 rounded-lg p-6 mt-12">
                <h3 class="text-2xl font-bold text-red-800 mb-4">
                  ✍️ Signature Required
                </h3>
                <p class="text-gray-700 mb-4">
                  <strong>I HAVE READ THIS WAIVER OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT.</strong> I fully understand its terms and understand that I am giving up substantial rights, including my right to sue. I acknowledge that I am signing this agreement freely and voluntarily, and intend my signature to be a complete and unconditional release of all liability to the greatest extent allowed by law.
                </p>

                <div class="bg-white rounded-lg p-6 mt-6 border-2 border-gray-300">
                  <p class="text-sm text-gray-600 mb-4">
                    Your digital signature will appear here when using the live booking system.
                  </p>
                  <div class="border-2 border-dashed border-gray-400 rounded-lg h-32 flex items-center justify-center text-gray-400">
                    <span>Signature Pad Placeholder</span>
                  </div>
                </div>

                <p class="text-sm text-gray-600 italic mt-6">
                  Last updated: December 2024<br/>
                  Valid for one year from date of signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Important Notice -->
  <section class="carnival-section carnival-sky-bg">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto carnival-card bg-white border-4 border-yellow-400">
        <div class="text-center">
          <div class="text-5xl mb-4">📋</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-4">
            Questions About This Waiver?
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            We want you to fully understand this document. If you have any questions or concerns about the waiver, please don't hesitate to contact us before your rental date.
          </p>
          <a href="/contact" class="px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-lg inline-block">
            Contact Us
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
