/**
 * Modern Minimal - Contact Page
 */

import type { TemplatePage } from '../../types'

export const contactPage: TemplatePage = {
  id: 'contact',
  name: 'Contact',
  slug: '/contact',
  title: 'Contact Us',
  description: 'Get in touch with our team',
  sections: [
    {
      id: 'contact-main',
      name: 'Contact Section',
      html: `
<section class="section-lg bg-[var(--color-background)]">
  <div class="container">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20">
      <!-- Contact Info -->
      <div>
        <span class="text-sm font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2 block">Get In Touch</span>
        <h1 class="text-display font-bold text-[var(--color-text)] mb-6">
          Let's Talk
        </h1>
        <p class="text-xl text-[var(--color-text-muted)] mb-10">
          Have questions about our rentals? Need help planning your event? We're here to help make your party perfect.
        </p>

        <!-- Contact details -->
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[var(--radius)] bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-[var(--color-text)] mb-1">Phone</h3>
              <a href="tel:+15551234567" class="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors" data-smart-block="business-info" data-field="phone">
                (555) 123-4567
              </a>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[var(--radius)] bg-[var(--color-secondary)]/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-[var(--color-text)] mb-1">Email</h3>
              <a href="mailto:hello@yourbusiness.com" class="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors" data-smart-block="business-info" data-field="email">
                hello@yourbusiness.com
              </a>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[var(--radius)] bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-[var(--color-text)] mb-1">Service Area</h3>
              <p class="text-[var(--color-text-muted)]" data-smart-block="business-info" data-field="address">
                Serving the entire metro area and surrounding communities within 30 miles
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-[var(--radius)] bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-[var(--color-text)] mb-1">Business Hours</h3>
              <p class="text-[var(--color-text-muted)]" data-smart-block="business-info" data-field="hours">
                Mon-Fri: 9am-6pm<br>
                Sat: 8am-5pm<br>
                Sun: By appointment
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-8 lg:p-10 shadow-[var(--shadow-lg)]">
        <h2 class="text-2xl font-bold text-[var(--color-text)] mb-6">Send Us a Message</h2>

        <!-- Smart Block: Contact Form -->
        <div data-smart-block="contact-form">
          <form class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Name *</label>
                <input type="text" name="name" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="Your name"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Email *</label>
                <input type="email" name="email" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="you@example.com"/>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Phone</label>
              <input type="tel" name="phone" class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="(555) 123-4567"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Event Date</label>
              <input type="date" name="eventDate" class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"/>
            </div>

            <div>
              <label class="block text-sm font-medium text-[var(--color-text)] mb-2">Message *</label>
              <textarea name="message" rows="5" required class="w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none" placeholder="Tell us about your event..."></textarea>
            </div>

            <button type="submit" class="w-full py-4 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
      `.trim()
    }
  ]
}
