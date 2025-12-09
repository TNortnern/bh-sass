export const waiverPage = {
  slug: '/waiver',
  title: 'Waiver & Release - FunHouse Party Rentals',
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
      Waiver & Release Form 📋
    </h1>
    <p class="text-lg text-white/90">Safety first, fun always!</p>
  </div>
</section>

<!-- Waiver Content -->
<section class="funhouse-section bg-white">
  <div class="funhouse-container">
    <div class="max-w-4xl mx-auto">
      <div class="funhouse-card mb-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div class="flex items-start gap-4">
          <div class="text-5xl flex-shrink-0">⚠️</div>
          <div>
            <h2 class="text-2xl font-bold mb-3 text-purple-900" style="font-family: 'Grandstander', cursive;">
              Important Safety Information
            </h2>
            <p class="text-gray-700 leading-relaxed">
              By signing this waiver and using our equipment, you acknowledge the inherent risks associated with
              inflatable play equipment and agree to the terms below. Please read carefully!
            </p>
          </div>
        </div>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">1. Assumption of Risk</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          I understand that the use of inflatable equipment involves inherent risks including, but not limited to:
        </p>
        <ul class="space-y-2 text-gray-700 pl-6">
          <li class="flex items-start gap-2">
            <span class="text-red-500 font-bold">•</span>
            <span>Falls, collisions with other participants, and impacts with equipment surfaces</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-500 font-bold">•</span>
            <span>Sprains, strains, bruises, or more serious injuries</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-500 font-bold">•</span>
            <span>Equipment malfunction or deflation due to weather or power loss</span>
          </li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          I voluntarily assume all risks associated with participation in this activity.
        </p>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">2. Safety Rules Agreement</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          I agree to ensure that all participants follow these safety rules:
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-purple-50 rounded-xl p-4">
            <h3 class="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span class="text-2xl">✅</span>
              DO:
            </h3>
            <ul class="space-y-2 text-gray-700 text-sm">
              <li>• Supervise children at all times</li>
              <li>• Remove shoes, glasses, and jewelry</li>
              <li>• Follow posted capacity limits</li>
              <li>• Exit immediately if weather worsens</li>
              <li>• Keep equipment clean and dry</li>
            </ul>
          </div>
          <div class="bg-red-50 rounded-xl p-4">
            <h3 class="font-bold text-red-900 mb-3 flex items-center gap-2">
              <span class="text-2xl">🚫</span>
              DON'T:
            </h3>
            <ul class="space-y-2 text-gray-700 text-sm">
              <li>• Use during high winds or storms</li>
              <li>• Bring food, drinks, or gum on unit</li>
              <li>• Perform flips or wrestling</li>
              <li>• Unplug or turn off blower</li>
              <li>• Allow mixed age groups</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">3. Release of Liability</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          In consideration for being permitted to use the equipment, I hereby release, waive, discharge, and covenant
          not to sue FunHouse Party Rentals, its owners, employees, and agents from any and all liability for:
        </p>
        <ul class="space-y-2 text-gray-700 pl-6">
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold">•</span>
            <span>Personal injury, property damage, or wrongful death</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold">•</span>
            <span>Claims arising from negligence or other acts</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-purple-500 font-bold">•</span>
            <span>All claims, demands, or causes of action</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">4. Indemnification</h2>
        <p class="text-gray-700 leading-relaxed">
          I agree to indemnify and hold harmless FunHouse Party Rentals from any loss, liability, damage, or costs
          that may arise due to my use of the equipment, whether caused by the negligence of FunHouse Party Rentals
          or otherwise.
        </p>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">5. Equipment Damage</h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          I understand that I am financially responsible for any damage to the equipment beyond normal wear and tear,
          including but not limited to:
        </p>
        <ul class="space-y-2 text-gray-700 pl-6">
          <li class="flex items-start gap-2">
            <span class="text-orange-500 font-bold">•</span>
            <span>Tears, holes, or burns in the fabric</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-orange-500 font-bold">•</span>
            <span>Damage from sharp objects, pets, or fire</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-orange-500 font-bold">•</span>
            <span>Stains from food, drinks, or other substances</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-orange-500 font-bold">•</span>
            <span>Blower damage from being unplugged or turned off improperly</span>
          </li>
        </ul>
      </div>

      <div class="funhouse-card mb-8">
        <h2 class="funhouse-gradient-text mb-4" style="font-family: 'Grandstander', cursive;">6. Medical Authorization</h2>
        <p class="text-gray-700 leading-relaxed">
          In the event of an injury, I authorize FunHouse Party Rentals staff to call for emergency medical assistance
          if necessary. I agree to be financially responsible for any medical costs incurred.
        </p>
      </div>

      <!-- Signature Section -->
      <div class="funhouse-card bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 class="funhouse-gradient-text mb-6" style="font-family: 'Grandstander', cursive;">Agreement & Signature</h2>

        <div class="bg-white rounded-xl p-6 mb-6 border-2 border-purple-200">
          <p class="text-gray-700 leading-relaxed mb-4 font-medium">
            I have read this waiver and release, fully understand its terms, and understand that I am giving up
            substantial rights, including my right to sue. I acknowledge that I am signing the agreement freely
            and voluntarily, and intend my signature to be a complete and unconditional release of all liability
            to the greatest extent allowed by law.
          </p>
        </div>

        <form class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">
                Full Name *
              </label>
              <input
                type="text"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
                placeholder="John Doe"
              >
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">
                Date *
              </label>
              <input
                type="date"
                required
                class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              >
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">
              Email Address *
            </label>
            <input
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              placeholder="john@example.com"
            >
          </div>

          <div>
            <label class="block text-gray-700 font-bold mb-2" style="font-family: 'Grandstander', cursive;">
              Digital Signature *
            </label>
            <input
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-700"
              placeholder="Type your full name to sign"
              style="font-family: 'Brush Script MT', cursive; font-size: 1.5rem;"
            >
            <p class="text-sm text-gray-500 mt-2">Type your full name above to create your digital signature</p>
          </div>

          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              required
              id="agree"
              class="mt-1 w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500"
            >
            <label for="agree" class="text-gray-700 leading-relaxed">
              I have read and agree to the terms of this waiver and release of liability. I understand that
              by checking this box and signing above, I am entering into a legally binding agreement.
            </label>
          </div>

          <button type="submit" class="funhouse-btn funhouse-btn-primary w-full text-center text-lg py-4">
            Submit Waiver 📝
          </button>
        </form>
      </div>

      <div class="funhouse-card bg-gradient-to-br from-blue-50 to-cyan-50 mt-8">
        <div class="flex items-start gap-4">
          <div class="text-4xl flex-shrink-0">💡</div>
          <div>
            <h3 class="text-xl font-bold mb-2 text-blue-900" style="font-family: 'Grandstander', cursive;">
              Questions About This Waiver?
            </h3>
            <p class="text-gray-700 mb-4">
              If you have any questions or concerns about this waiver, please contact us before your event.
              We're happy to explain any part of this agreement!
            </p>
            <a href="/contact" class="funhouse-btn inline-block text-base py-2 px-6" style="background: #0EA5E9; color: white;">
              Contact Us 💬
            </a>
          </div>
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
