/**
 * Modern Minimal - Booking Page
 */

import type { TemplatePage } from '../../types'

export const bookingPage: TemplatePage = {
  id: 'booking',
  name: 'Book Now',
  slug: '/booking',
  title: 'Book Your Rental',
  description: 'Reserve your party rental online',
  sections: [
    {
      id: 'booking-main',
      name: 'Booking Section',
      html: `
<section class="min-h-screen bg-[var(--color-surface)]">
  <div class="container py-12 lg:py-20">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Online Booking</span>
        <h1 class="text-headline font-bold text-[var(--color-text)] mb-4">
          Book Your Party Rental
        </h1>
        <p class="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Select your rental, choose your date, and we'll handle the rest. Free delivery and setup included!
        </p>
      </div>

      <!-- Trust badges -->
      <div class="flex flex-wrap justify-center gap-6 mb-12">
        <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">Free Delivery</span>
        </div>
        <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">Professional Setup</span>
        </div>
        <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">Fully Insured</span>
        </div>
        <div class="flex items-center gap-2 text-[var(--color-text-muted)]">
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm">Instant Confirmation</span>
        </div>
      </div>

      <!-- Booking Widget -->
      <div class="bg-[var(--color-background)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] overflow-hidden" data-smart-block="booking-widget" data-style="embedded">
        <!-- Widget placeholder for editor -->
        <div class="p-8 lg:p-12">
          <div class="text-center py-16 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
            <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
            </svg>
            <h3 class="text-xl font-semibold text-[var(--color-text)] mb-2">Booking Calendar</h3>
            <p class="text-[var(--color-text-muted)] mb-4">
              The interactive booking widget will load here on your live site
            </p>
            <p class="text-sm text-[var(--color-text-muted)]">
              Customers can select items, view availability, and complete their booking
            </p>
          </div>
        </div>
      </div>

      <!-- Additional info -->
      <div class="mt-12 grid md:grid-cols-3 gap-6">
        <div class="bg-[var(--color-background)] rounded-[var(--radius-lg)] p-6">
          <div class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-secondary)]/10 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-[var(--color-text)] mb-2">Secure Payment</h3>
          <p class="text-sm text-[var(--color-text-muted)]">
            Pay securely online with credit card. 50% deposit required to confirm your booking.
          </p>
        </div>

        <div class="bg-[var(--color-background)] rounded-[var(--radius-lg)] p-6">
          <div class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-[var(--color-text)] mb-2">Flexible Dates</h3>
          <p class="text-sm text-[var(--color-text-muted)]">
            Need to reschedule? Contact us at least 48 hours in advance for free date changes.
          </p>
        </div>

        <div class="bg-[var(--color-background)] rounded-[var(--radius-lg)] p-6">
          <div class="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <h3 class="font-semibold text-[var(--color-text)] mb-2">Support</h3>
          <p class="text-sm text-[var(--color-text-muted)]">
            Questions? Call us at <span data-smart-block="business-info" data-field="phone">(555) 123-4567</span> or email anytime.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
