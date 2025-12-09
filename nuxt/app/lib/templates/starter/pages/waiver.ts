/**
 * Modern Minimal - Waiver Page
 *
 * Liability waiver with e-signature capture
 */

import type { TemplatePage } from '../../types'

export const waiverPage: TemplatePage = {
  id: 'waiver',
  name: 'Liability Waiver',
  slug: '/waiver',
  title: 'Liability Waiver',
  description: 'Sign the liability waiver for your rental',
  sections: [
    {
      id: 'waiver-content',
      name: 'Waiver Content',
      html: `
<section class="section-lg bg-[var(--color-surface)]">
  <div class="container">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary)]/10 mb-4">
          <svg class="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <h1 class="text-headline font-bold text-[var(--color-text)] mb-4">
          Liability Waiver
        </h1>
        <p class="text-lg text-[var(--color-text-muted)]">
          Please read carefully and sign below to complete your booking
        </p>
      </div>

      <!-- Waiver Document with Signature -->
      <div class="bg-[var(--color-background)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden" data-smart-block="document-sign" data-type="waiver" data-require-signature="true" data-prefill-from-booking="true">

        <!-- Document Header -->
        <div class="px-8 py-6 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-[var(--color-text)]">Release and Waiver of Liability</h2>
              <p class="text-sm text-[var(--color-text-muted)]">Effective for booking #<span data-merge-field="booking.number">BH-2025-XXX</span></p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-[var(--color-text)]" data-smart-block="business-info" data-field="name">Your Business Name</p>
              <p class="text-sm text-[var(--color-text-muted)]" data-smart-block="business-info" data-field="phone">(555) 123-4567</p>
            </div>
          </div>
        </div>

        <!-- Document Content -->
        <div class="px-8 py-8 max-h-[400px] overflow-y-auto">
          <div class="prose prose-slate max-w-none text-sm">
            <p class="text-[var(--color-text)] mb-4">
              <strong>PARTICIPANT NAME:</strong> <span data-merge-field="customer.name" class="underline">_____________________</span>
            </p>
            <p class="text-[var(--color-text)] mb-4">
              <strong>EVENT DATE:</strong> <span data-merge-field="booking.date" class="underline">_____________________</span>
            </p>
            <p class="text-[var(--color-text)] mb-4">
              <strong>RENTAL ITEMS:</strong> <span data-merge-field="booking.items" class="underline">_____________________</span>
            </p>

            <hr class="my-6 border-[var(--color-border)]"/>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">ASSUMPTION OF RISK</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              I acknowledge that participation in inflatable amusement activities involves inherent risks, including but not limited to: falls, collisions with other participants, sprains, fractures, and other injuries. I voluntarily assume all risks associated with the use of rental equipment provided by <span data-smart-block="business-info" data-field="name">Your Business Name</span>.
            </p>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">RELEASE OF LIABILITY</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              In consideration of being permitted to use the rental equipment, I hereby RELEASE, WAIVE, DISCHARGE AND COVENANT NOT TO SUE <span data-smart-block="business-info" data-field="name">Your Business Name</span>, its owners, officers, employees, agents, and representatives from any and all liability, claims, demands, actions and causes of action arising out of or related to any loss, damage, or injury that may be sustained by me or any participant while using the rental equipment.
            </p>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">INDEMNIFICATION</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              I agree to INDEMNIFY AND HOLD HARMLESS <span data-smart-block="business-info" data-field="name">Your Business Name</span> from any loss, liability, damage, or costs, including court costs and attorney fees, that may incur due to my participation or the participation of any minor for whom I am responsible.
            </p>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">SAFETY RULES AGREEMENT</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              I agree to follow all safety rules and guidelines provided, including:
            </p>
            <ul class="list-disc pl-6 text-[var(--color-text-muted)] mb-4 space-y-1">
              <li>Maintaining adult supervision at all times</li>
              <li>Adhering to capacity and weight limits</li>
              <li>Removing shoes, jewelry, and sharp objects before use</li>
              <li>No flips, wrestling, or rough play</li>
              <li>Ceasing use in adverse weather conditions</li>
            </ul>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">MEDICAL AUTHORIZATION</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              In the event of an emergency, I authorize <span data-smart-block="business-info" data-field="name">Your Business Name</span> personnel to seek emergency medical treatment for myself or any minor in my care.
            </p>

            <h3 class="text-lg font-bold text-[var(--color-text)] mb-3">PHOTO/VIDEO RELEASE (OPTIONAL)</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              I grant permission for photos or videos taken at the event to be used for promotional purposes. (You may opt out by notifying us in writing.)
            </p>

            <p class="text-[var(--color-text)] font-medium mt-6">
              BY SIGNING BELOW, I ACKNOWLEDGE THAT I HAVE READ THIS AGREEMENT, UNDERSTAND IT, AND AGREE TO BE BOUND BY ITS TERMS.
            </p>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="px-8 py-8 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <!-- Signer Info -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Full Legal Name *</label>
              <input
                type="text"
                name="signerName"
                required
                class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Enter your full legal name"
                data-prefill="customer.name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Date</label>
              <input
                type="text"
                name="signDate"
                readonly
                class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)]"
                data-prefill="today.date"
                value="December 8, 2025"
              />
            </div>
          </div>

          <!-- Signature Pad -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Signature *</label>
            <div class="relative">
              <div class="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] bg-white h-40 flex items-center justify-center cursor-crosshair hover:border-[var(--color-primary)] transition-colors" id="signaturePad">
                <div class="text-center pointer-events-none">
                  <svg class="w-10 h-10 mx-auto mb-2 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                  <p class="text-[var(--color-text-muted)]">Sign here using your mouse or finger</p>
                </div>
              </div>
              <button type="button" class="absolute top-2 right-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                Clear
              </button>
            </div>
          </div>

          <!-- Agreement Checkbox -->
          <div class="flex items-start gap-3 mb-6 p-4 bg-[var(--color-surface-alt)] rounded-[var(--radius)]">
            <input
              type="checkbox"
              id="agreeWaiver"
              required
              class="mt-1 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <label for="agreeWaiver" class="text-sm text-[var(--color-text)]">
              I have read and understand this Release and Waiver of Liability. I am signing this document voluntarily and it is my intention to fully release <span data-smart-block="business-info" data-field="name">Your Business Name</span> from liability. I understand my electronic signature is legally binding.
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full py-4 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Sign & Submit Waiver
          </button>

          <!-- Legal note -->
          <p class="mt-4 text-xs text-center text-[var(--color-text-muted)]">
            By clicking "Sign & Submit Waiver", you agree that your electronic signature is the legal equivalent of your manual/handwritten signature.
          </p>
        </div>
      </div>

      <!-- Help text -->
      <div class="mt-8 text-center">
        <p class="text-sm text-[var(--color-text-muted)]">
          Questions about the waiver?
          <a href="/contact" class="text-[var(--color-primary)] hover:underline">Contact us</a>
          or call <span data-smart-block="business-info" data-field="phone">(555) 123-4567</span>
        </p>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
