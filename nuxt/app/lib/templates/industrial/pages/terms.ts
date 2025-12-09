import type { TemplatePage } from '../../types'

export const termsPage: TemplatePage = {
  id: 'terms',
  name: 'Terms & Conditions',
  path: '/terms',
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
    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white">Terms & Conditions</h1>
    <p class="text-xl text-gray-300">Rental agreement and policies</p>
  </div>
</section>
      `
    },
    {
      id: 'terms-content',
      type: 'content',
      html: `
<section class="section bg-white">
  <div class="container max-w-4xl">
    <div class="prose prose-lg max-w-none">
      <div class="mb-8">
        <p class="text-gray-600">Last updated: December 2024</p>
      </div>

      <h2>1. Rental Agreement</h2>
      <p>By renting equipment from Industrial Rentals, you agree to the following terms and conditions. Please read carefully before booking.</p>

      <h2>2. Booking & Payment</h2>
      <ul>
        <li>A 50% deposit is required to confirm your reservation</li>
        <li>Balance must be paid in full before or at the time of delivery</li>
        <li>We accept cash, credit cards, and electronic payments</li>
        <li>Prices are subject to change without notice</li>
      </ul>

      <h2>3. Cancellation Policy</h2>
      <ul>
        <li>Cancellations made 7+ days before event: Full refund</li>
        <li>Cancellations made 3-6 days before event: 50% refund</li>
        <li>Cancellations made less than 3 days before event: No refund</li>
        <li>Weather-related cancellations may be rescheduled with no penalty</li>
      </ul>

      <h2>4. Delivery & Setup</h2>
      <ul>
        <li>Delivery and setup are included in rental price within service area</li>
        <li>Additional fees apply for deliveries outside standard service area</li>
        <li>Customer must provide safe access to setup location</li>
        <li>Setup area must be clear of debris and obstacles</li>
        <li>Electrical outlet must be within 50 feet of setup area (if required)</li>
      </ul>

      <h2>5. Customer Responsibilities</h2>
      <ul>
        <li>Supervise all users of rented equipment at all times</li>
        <li>Follow all safety guidelines provided</li>
        <li>Do not exceed weight or capacity limits</li>
        <li>Do not allow food, drinks, or shoes inside bounce houses</li>
        <li>Immediately stop use if equipment becomes damaged</li>
        <li>Keep equipment clean and in good condition</li>
      </ul>

      <h2>6. Safety Rules</h2>
      <ul>
        <li>Remove shoes, glasses, and sharp objects before entering</li>
        <li>Do not allow roughhousing or dangerous behavior</li>
        <li>Children must be separated by size and age</li>
        <li>No flips, wrestling, or piling on top of others</li>
        <li>Turn off blowers during high winds or severe weather</li>
      </ul>

      <h2>7. Liability & Insurance</h2>
      <p>Industrial Rentals carries liability insurance for equipment failure. Customer is responsible for injury or damage caused by misuse, negligence, or failure to follow safety guidelines. Customer agrees to indemnify and hold harmless Industrial Rentals from any claims arising from use of rented equipment.</p>

      <h2>8. Damage & Loss</h2>
      <ul>
        <li>Customer is responsible for any damage to equipment during rental period</li>
        <li>Repair or replacement costs will be charged to customer</li>
        <li>Normal wear and tear is expected and not charged</li>
        <li>Intentional damage or vandalism will be prosecuted</li>
      </ul>

      <h2>9. Weather Policy</h2>
      <ul>
        <li>Equipment must not be used in high winds (15+ mph sustained)</li>
        <li>Water slides must not be used during lightning storms</li>
        <li>Customer may reschedule due to severe weather with 24-hour notice</li>
        <li>Rain alone does not qualify for cancellation (unless lightning present)</li>
      </ul>

      <h2>10. Contact Information</h2>
      <p>For questions about these terms, please contact us:</p>
      <ul>
        <li>Phone: (555) 123-4567</li>
        <li>Email: info@industrial.com</li>
      </ul>
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
