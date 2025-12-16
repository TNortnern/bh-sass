<script setup lang="ts">
/**
 * TemplateFooter - Persistent footer for website templates
 * Features: Brand, links, contact info, custom domain notice
 */
interface Props {
  businessName: string
  description?: string
  phone?: string
  email?: string
  address?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  description: 'Premium party rentals for unforgettable events.',
  primaryColor: '#f59e0b'
})

const currentYear = new Date().getFullYear()

const footerStyles = computed(() => ({
  '--footer-primary': props.primaryColor
}))
</script>

<template>
  <footer
    class="template-footer"
    :class="[`theme-${theme}`]"
    :style="footerStyles"
  >
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand-col">
          <h3 class="footer-brand">
            {{ businessName }}
          </h3>
          <p class="footer-description">
            {{ description }}
          </p>
          <!-- Custom Domain Notice -->
          <div class="footer-domain-notice">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>Custom domain support coming soon</span>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-links-col">
          <h4 class="footer-heading">
            Quick Links
          </h4>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="#inventory">Rentals</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-links-col">
          <h4 class="footer-heading">
            Legal
          </h4>
          <ul class="footer-links">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/waiver">Liability Waiver</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-contact-col">
          <h4 class="footer-heading">
            Contact
          </h4>
          <ul class="footer-contact">
            <li v-if="phone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{{ phone }}</span>
            </li>
            <li v-if="email">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  width="20"
                  height="16"
                  x="2"
                  y="4"
                  rx="2"
                />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>{{ email }}</span>
            </li>
            <li v-if="address">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                />
              </svg>
              <span>{{ address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ businessName }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.template-footer {
  background: var(--footer-bg, #f9fafb);
  border-top: 1px solid var(--footer-border, #e5e7eb);
  padding: 3rem 0 1.5rem;
}

.template-footer.theme-dark {
  --footer-bg: #111111;
  --footer-border: rgba(255, 255, 255, 0.1);
  --footer-text: #ffffff;
  --footer-text-muted: #a1a1aa;
}

.template-footer.theme-light {
  --footer-bg: #f9fafb;
  --footer-border: #e5e7eb;
  --footer-text: #111111;
  --footer-text-muted: #6b7280;
}

.footer-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 2rem;
}

.footer-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--footer-text, #111);
  margin-bottom: 0.75rem;
}

.footer-description {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-domain-notice {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--footer-primary, #f59e0b);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--footer-text, #111);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: var(--footer-text, #111);
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
}

.footer-contact svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--footer-border, #e5e7eb);
  text-align: center;
}

.footer-bottom p {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand-col {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-brand-col {
    grid-column: span 1;
  }
}
</style>
