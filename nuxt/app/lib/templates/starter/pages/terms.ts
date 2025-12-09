/**
 * Modern Minimal - Terms & Conditions Page
 */

import type { TemplatePage } from '../../types'

export const termsPage: TemplatePage = {
  id: 'terms',
  name: 'Terms & Conditions',
  slug: '/terms',
  title: 'Terms & Conditions',
  description: 'Our rental terms and conditions',
  sections: [
    {
      id: 'terms-content',
      name: 'Terms Content',
      html: `
<section class="section-lg bg-[var(--color-background)]">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-headline font-bold text-[var(--color-text)] mb-4">
          Terms & Conditions
        </h1>
        <p class="text-lg text-[var(--color-text-muted)]">
          Please read these terms carefully before booking
        </p>
        <p class="text-sm text-[var(--color-text-muted)] mt-2">
          Last updated: December 2025
        </p>
      </div>

      <!-- Terms Document -->
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow)]" data-smart-block="document-sign" data-type="terms" data-require-signature="false">
        <!-- Document content area -->
        <div class="p-8 lg:p-12 prose prose-slate max-w-none">
          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">1. Rental Agreement</h2>
          <p class="text-[var(--color-text-muted)] mb-6">
            By booking equipment from <strong data-smart-block="business-info" data-field="name">Your Business Name</strong> ("Provider"), you ("Customer") agree to the following terms and conditions. This agreement is legally binding upon confirmation of your booking.
          </p>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">2. Booking & Payment</h2>
          <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-6 space-y-2">
            <li>A 50% deposit is required to secure your booking</li>
            <li>The remaining balance is due upon delivery</li>
            <li>We accept major credit cards, debit cards, and cash</li>
            <li>All prices are subject to applicable taxes</li>
          </ul>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">3. Cancellation Policy</h2>
          <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-6 space-y-2">
            <li>Cancellations made 7+ days before the event: Full refund of deposit</li>
            <li>Cancellations made 3-6 days before: 50% of deposit refunded</li>
            <li>Cancellations made less than 3 days: No refund</li>
            <li>Weather cancellations: Full refund or free reschedule</li>
          </ul>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">4. Delivery & Setup</h2>
          <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-6 space-y-2">
            <li>Delivery is included for locations within our service area</li>
            <li>Customer must provide access to the setup location</li>
            <li>Setup area must be clear of obstacles, debris, and overhead hazards</li>
            <li>Access to a standard 110V electrical outlet is required within 100 feet</li>
            <li>We require a flat, level surface for safe installation</li>
          </ul>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">5. Customer Responsibilities</h2>
          <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-6 space-y-2">
            <li>Adult supervision (18+) is required at all times during use</li>
            <li>Follow all safety rules and weight/capacity limits</li>
            <li>No food, drinks, silly string, or sharp objects on or near equipment</li>
            <li>Customer is responsible for any damage beyond normal wear</li>
            <li>Equipment must be used in accordance with manufacturer guidelines</li>
          </ul>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">6. Safety Guidelines</h2>
          <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-6 space-y-2">
            <li>Remove shoes, eyeglasses, jewelry, and sharp objects before entering</li>
            <li>No flips, wrestling, or rough play</li>
            <li>Do not exceed posted capacity limits</li>
            <li>Do not use in high winds (15+ mph) or rain</li>
            <li>Keep blower running at all times during use</li>
          </ul>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">7. Liability</h2>
          <p class="text-[var(--color-text-muted)] mb-6">
            The Provider carries general liability insurance. However, Customer assumes responsibility for ensuring safe use of equipment and agrees to indemnify Provider against claims arising from negligent use. A separate liability waiver must be signed before equipment delivery.
          </p>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">8. Weather Policy</h2>
          <p class="text-[var(--color-text-muted)] mb-6">
            If weather conditions (rain, high winds, lightning) make equipment use unsafe, we will work with you to reschedule at no additional charge. Customer may also request a full refund for weather-related cancellations made on the day of the event.
          </p>

          <h2 class="text-xl font-bold text-[var(--color-text)] mb-4">9. Contact Information</h2>
          <p class="text-[var(--color-text-muted)]">
            For questions or concerns, please contact us:
          </p>
          <ul class="list-none pl-0 text-[var(--color-text-muted)] mt-2 space-y-1">
            <li>Phone: <span data-smart-block="business-info" data-field="phone">(555) 123-4567</span></li>
            <li>Email: <span data-smart-block="business-info" data-field="email">hello@yourbusiness.com</span></li>
          </ul>
        </div>

        <!-- Acknowledgment section -->
        <div class="px-8 lg:px-12 py-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
          <div class="flex items-start gap-3">
            <input type="checkbox" id="acceptTerms" class="mt-1 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <label for="acceptTerms" class="text-sm text-[var(--color-text)]">
              I have read and agree to these Terms & Conditions. I understand that this is a legally binding agreement.
            </label>
          </div>
          <button type="button" class="mt-4 w-full py-3 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled>
            I Accept
          </button>
        </div>
      </div>

      <!-- Back link -->
      <div class="text-center mt-8">
        <a href="/booking" class="text-[var(--color-primary)] font-medium hover:underline inline-flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Booking
        </a>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
