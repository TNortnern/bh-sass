import type { TemplatePage } from '../../types'

export const waiverPage: TemplatePage = {
  id: 'waiver',
  name: 'Safety Waiver',
  path: '/waiver',
  sections: [
    {
      id: 'header',
      type: 'header',
      html: `
<header class="bg-slate-900 text-white">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <span class="text-xl font-bold tracking-tight">INDUSTRIAL</span>
      </a>
      <nav class="hidden md:flex items-center gap-8">
        <a href="/" class="text-gray-300 hover:text-white font-medium transition-colors">Home</a>
        <a href="/inventory" class="text-gray-300 hover:text-white font-medium transition-colors">Equipment</a>
        <a href="/about" class="text-gray-300 hover:text-white font-medium transition-colors">About</a>
        <a href="/contact" class="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
      </nav>
      <div class="hidden md:flex items-center gap-4">
        <a href="tel:5551234567" class="text-gray-300 hover:text-white flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          (555) 123-4567
        </a>
        <a href="/booking" class="px-5 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition-colors">
          Get Quote
        </a>
      </div>
      <button class="md:hidden p-2 text-gray-300" aria-label="Menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
</header>
      `
    },
    {
      id: 'page-header',
      type: 'content',
      html: `
<section class="bg-slate-900 text-white py-16">
  <div class="container">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">Safety Waiver</h1>
    <p class="text-xl text-gray-300">Liability release and assumption of risk</p>
  </div>
</section>
      `
    },
    {
      id: 'waiver-content',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container max-w-4xl">
    <div class="prose prose-lg max-w-none">
      <div class="mb-8">
        <p class="text-gray-600">Please read carefully before using our equipment</p>
      </div>

      <h2>Assumption of Risk</h2>
      <p>I understand that the use of inflatable equipment involves inherent risks including, but not limited to:</p>
      <ul>
        <li>Cuts, scrapes, bruises, and other minor injuries</li>
        <li>Sprains, strains, and muscle injuries</li>
        <li>Collisions with other participants</li>
        <li>Falls from or within the equipment</li>
        <li>Equipment deflation or malfunction</li>
      </ul>

      <h2>Participant Acknowledgment</h2>
      <p>As the customer or guardian of participants, I acknowledge:</p>
      <ul>
        <li>I have read and understand all safety rules and guidelines</li>
        <li>I will supervise all participants at all times</li>
        <li>I will ensure participants follow all safety rules</li>
        <li>I will immediately stop use if equipment appears damaged or unsafe</li>
        <li>I understand that Industrial Rentals is not responsible for supervising participants</li>
      </ul>

      <h2>Safety Rules Agreement</h2>
      <p>I agree to enforce the following safety rules:</p>
      <ul>
        <li>Remove shoes, glasses, jewelry, and sharp objects before entering</li>
        <li>No food, drinks, or gum inside inflatables</li>
        <li>No roughhousing, flips, or dangerous behavior</li>
        <li>Separate children by age and size groups</li>
        <li>Do not exceed capacity limits posted on equipment</li>
        <li>Turn off blowers and evacuate during high winds or severe weather</li>
        <li>No climbing on outside walls or netting</li>
        <li>Enter and exit properly using designated areas</li>
      </ul>

      <h2>Release of Liability</h2>
      <p>In consideration of being permitted to rent and use equipment from Industrial Rentals, I hereby:</p>
      <ul>
        <li>Release, waive, and discharge Industrial Rentals from any and all liability for injury, loss, or damage</li>
        <li>Agree to indemnify and hold harmless Industrial Rentals from any claims arising from use of equipment</li>
        <li>Assume full responsibility for any injury or damage caused by misuse or negligence</li>
        <li>Acknowledge that this release applies to all participants using the equipment</li>
      </ul>

      <h2>Medical Treatment Authorization</h2>
      <p>In the event of injury requiring medical attention, I authorize Industrial Rentals or its representatives to:</p>
      <ul>
        <li>Obtain emergency medical treatment for myself or participants under my supervision</li>
        <li>Contact emergency services if necessary</li>
        <li>I understand that I am responsible for all medical costs incurred</li>
      </ul>

      <h2>Damage Responsibility</h2>
      <p>I agree to:</p>
      <ul>
        <li>Keep equipment clean and in good condition during rental period</li>
        <li>Pay for any damage caused by misuse, negligence, or violation of safety rules</li>
        <li>Report any damage or issues immediately to Industrial Rentals</li>
        <li>Not attempt to repair equipment myself</li>
      </ul>

      <h2>Weather Conditions</h2>
      <p>I understand and agree that:</p>
      <ul>
        <li>Equipment must not be used in winds exceeding 15 mph sustained</li>
        <li>Equipment must be evacuated immediately during lightning storms</li>
        <li>I am responsible for monitoring weather conditions and making safe decisions</li>
        <li>Industrial Rentals is not liable for weather-related incidents if safety guidelines are not followed</li>
      </ul>

      <h2>Agreement</h2>
      <p><strong>By signing the rental agreement or using our equipment, I acknowledge that I have read, understood, and agree to this waiver in its entirety.</strong></p>

      <div class="card p-6 bg-orange-50 border-l-4 border-orange-500 mt-8">
        <p class="font-semibold mb-2">Questions about this waiver?</p>
        <p class="text-gray-700">Contact us at (555) 123-4567 or info@industrial.com</p>
      </div>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'footer',
      type: 'footer',
      html: `
<footer class="bg-slate-900 text-white">
  <div class="container mx-auto px-4 py-16">
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="text-xl font-bold">INDUSTRIAL</span>
        </div>
        <p class="text-gray-400 mb-6">Professional party equipment rentals for events of all sizes. Quality guaranteed.</p>
        <div class="flex items-center gap-4">
          <span class="px-3 py-1 bg-slate-800 text-xs font-medium rounded">Licensed</span>
          <span class="px-3 py-1 bg-slate-800 text-xs font-medium rounded">Insured</span>
        </div>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Navigation</h4>
        <ul class="space-y-3">
          <li><a href="/" class="text-gray-400 hover:text-orange-400 transition-colors">Home</a></li>
          <li><a href="/inventory" class="text-gray-400 hover:text-orange-400 transition-colors">Equipment</a></li>
          <li><a href="/about" class="text-gray-400 hover:text-orange-400 transition-colors">About Us</a></li>
          <li><a href="/contact" class="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Equipment</h4>
        <ul class="space-y-3">
          <li><a href="/inventory?cat=bounce" class="text-gray-400 hover:text-orange-400 transition-colors">Bounce Houses</a></li>
          <li><a href="/inventory?cat=water" class="text-gray-400 hover:text-orange-400 transition-colors">Water Slides</a></li>
          <li><a href="/inventory?cat=combo" class="text-gray-400 hover:text-orange-400 transition-colors">Combo Units</a></li>
          <li><a href="/inventory?cat=extras" class="text-gray-400 hover:text-orange-400 transition-colors">Party Extras</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-lg mb-6">Contact</h4>
        <ul class="space-y-3 text-gray-400">
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            (555) 123-4567
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            info@industrial.com
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
            Metro Service Area
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-gray-500 text-sm">© 2024 Industrial Rentals. All rights reserved.</p>
      <div class="flex gap-6 text-sm">
        <a href="/terms" class="text-gray-500 hover:text-orange-400 transition-colors">Terms</a>
        <a href="/waiver" class="text-gray-500 hover:text-orange-400 transition-colors">Waiver</a>
        <a href="/privacy" class="text-gray-500 hover:text-orange-400 transition-colors">Privacy Policy</a>
      </div>
    </div>
  </div>
</footer>
      `
    }
  ]
}
