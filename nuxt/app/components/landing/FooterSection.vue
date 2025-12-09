<template>
  <footer class="footer-section">
    <!-- Main footer content -->
    <div class="footer-container">
      <!-- Top section with logo and links -->
      <div class="footer-grid">
        <!-- Brand column -->
        <div class="footer-brand">
          <NuxtLink
            to="/"
            class="brand-logo"
          >
            <UIcon
              name="i-lucide-castle"
              class="logo-icon"
            />
            <span class="brand-name">BouncePro</span>
          </NuxtLink>
          <p class="brand-tagline">
            The modern platform for party rentals. Streamline bookings, manage
            inventory, and grow your business.
          </p>

          <!-- Newsletter signup -->
          <div class="newsletter-section">
            <h4 class="newsletter-title">
              Stay updated
            </h4>
            <div class="newsletter-form">
              <UInput
                v-model="newsletterEmail"
                type="email"
                placeholder="Your email"
                size="md"
                class="newsletter-input"
                icon="i-lucide-mail"
              />
              <UButton
                size="md"
                class="newsletter-button"
                @click="handleNewsletterSignup"
              >
                <UIcon name="i-lucide-arrow-right" />
              </UButton>
            </div>
          </div>

          <!-- Social links -->
          <div class="social-links">
            <a
              href="https://twitter.com/bouncepro"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Twitter"
            >
              <UIcon name="i-simple-icons-x" />
            </a>
            <a
              href="https://linkedin.com/company/bouncepro"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="LinkedIn"
            >
              <UIcon name="i-simple-icons-linkedin" />
            </a>
            <a
              href="https://facebook.com/bouncepro"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Facebook"
            >
              <UIcon name="i-simple-icons-facebook" />
            </a>
            <a
              href="https://instagram.com/bouncepro"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Instagram"
            >
              <UIcon name="i-simple-icons-instagram" />
            </a>
          </div>
        </div>

        <!-- Product links -->
        <div class="footer-links-column">
          <h3 class="footer-column-title">
            Product
          </h3>
          <ul class="footer-links-list">
            <li>
              <NuxtLink
                to="/features"
                class="footer-link"
              >
                Features
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="footer-link"
              >
                Pricing
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/integrations"
                class="footer-link"
              >
                Integrations
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://api.bouncepro.com"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                API
                <UIcon
                  name="i-lucide-external-link"
                  class="external-icon"
                />
              </a>
            </li>
            <li>
              <NuxtLink
                to="/changelog"
                class="footer-link"
              >
                Changelog
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company links -->
        <div class="footer-links-column">
          <h3 class="footer-column-title">
            Company
          </h3>
          <ul class="footer-links-list">
            <li>
              <NuxtLink
                to="/about"
                class="footer-link"
              >
                About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="footer-link"
              >
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/careers"
                class="footer-link"
              >
                Careers
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="footer-link"
              >
                Contact
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/press"
                class="footer-link"
              >
                Press Kit
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Resources links -->
        <div class="footer-links-column">
          <h3 class="footer-column-title">
            Resources
          </h3>
          <ul class="footer-links-list">
            <li>
              <NuxtLink
                to="/help"
                class="footer-link"
              >
                Help Center
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://docs.bouncepro.com"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                Documentation
                <UIcon
                  name="i-lucide-external-link"
                  class="external-icon"
                />
              </a>
            </li>
            <li>
              <a
                href="https://status.bouncepro.com"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                Status
                <UIcon
                  name="i-lucide-external-link"
                  class="external-icon"
                />
              </a>
            </li>
            <li>
              <NuxtLink
                to="/community"
                class="footer-link"
              >
                Community
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/tutorials"
                class="footer-link"
              >
                Tutorials
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Legal links -->
        <div class="footer-links-column">
          <h3 class="footer-column-title">
            Legal
          </h3>
          <ul class="footer-links-list">
            <li>
              <NuxtLink
                to="/privacy"
                class="footer-link"
              >
                Privacy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="footer-link"
              >
                Terms
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/security"
                class="footer-link"
              >
                Security
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/gdpr"
                class="footer-link"
              >
                GDPR
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/cookies"
                class="footer-link"
              >
                Cookies
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Decorative divider -->
      <div class="footer-divider">
        <div class="divider-line" />
        <div class="divider-decoration" />
      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} BouncePro. All rights reserved.
        </p>

        <div class="footer-bottom-links">
          <NuxtLink
            to="/sitemap"
            class="bottom-link"
          >
            Sitemap
          </NuxtLink>
          <span class="link-separator">•</span>
          <NuxtLink
            to="/accessibility"
            class="bottom-link"
          >
            Accessibility
          </NuxtLink>
          <span class="link-separator">•</span>
          <button
            class="bottom-link"
            @click="handleLanguageChange"
          >
            English
            <UIcon
              name="i-lucide-chevron-down"
              class="language-icon"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Decorative background elements -->
    <div class="footer-background">
      <div class="bg-gradient-1" />
      <div class="bg-gradient-2" />
      <div class="bg-pattern" />
    </div>
  </footer>
</template>

<script setup lang="ts">
const newsletterEmail = ref('')
const currentYear = new Date().getFullYear()

const handleNewsletterSignup = () => {
  if (newsletterEmail.value) {
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', newsletterEmail.value)
    const toast = useToast()
    toast.add({
      title: 'Success!',
      description: 'Thanks for subscribing to our newsletter.',
      color: 'success'
    })
    newsletterEmail.value = ''
  }
}

const handleLanguageChange = () => {
  // TODO: Implement language selector
  console.log('Language selector clicked')
}
</script>

<style scoped>
.footer-section {
  position: relative;
  background: #0f172a;
  color: #e2e8f0;
  overflow: hidden;
  padding: 6rem 2rem 2rem;
  isolation: isolate;
}

/* Background decorations */
.footer-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.bg-gradient-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(234, 88, 12, 0.08) 0%,
    transparent 70%
  );
  animation: pulse 10s ease-in-out infinite;
}

.bg-gradient-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(251, 146, 60, 0.06) 0%,
    transparent 70%
  );
  animation: pulse 12s ease-in-out infinite 2s;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 60px,
    rgba(255, 255, 255, 0.01) 60px,
    rgba(255, 255, 255, 0.01) 120px
  );
}

/* Container */
.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Grid layout */
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: 4rem;
  margin-bottom: 4rem;
}

/* Brand column */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  width: fit-content;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-logo:hover {
  transform: translateX(4px);
}

.logo-icon {
  font-size: 2rem;
  color: #f97316;
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.3));
}

.brand-name {
  font-family: 'Instrument Serif', 'Georgia', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.brand-tagline {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 320px;
}

/* Newsletter */
.newsletter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.newsletter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
}

.newsletter-input :deep(input) {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.newsletter-input :deep(input:focus) {
  background: #1e293b;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.newsletter-input :deep(input::placeholder) {
  color: #64748b;
}

.newsletter-button {
  background: #f97316 !important;
  color: white !important;
  padding: 0 1.25rem !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.newsletter-button:hover {
  background: #ea580c !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
}

/* Social links */
.social-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-size: 1.125rem;
}

.social-link:hover {
  background: #f97316;
  border-color: #f97316;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
}

/* Link columns */
.footer-links-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.footer-column-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: fit-content;
  position: relative;
}

.footer-link::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #f97316;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-link:hover {
  color: white;
  transform: translateX(4px);
}

.footer-link:hover::before {
  width: 100%;
}

.external-icon {
  font-size: 0.875rem;
  opacity: 0.6;
}

/* Decorative divider */
.footer-divider {
  position: relative;
  height: 1px;
  margin: 3rem 0;
}

.divider-line {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent,
    #334155 20%,
    #334155 80%,
    transparent
  );
}

.divider-decoration {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(249, 115, 22, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Bottom bar */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.copyright {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bottom-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.bottom-link:hover {
  color: #f97316;
}

.link-separator {
  color: #334155;
}

.language-icon {
  font-size: 0.875rem;
  margin-left: 0.25rem;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .footer-grid {
    grid-template-columns: 1.5fr repeat(2, 1fr);
    gap: 3rem;
  }

  .footer-links-column:nth-child(n + 4) {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .footer-section {
    padding: 4rem 1.5rem 2rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-brand {
    max-width: 100%;
  }

  .brand-tagline {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .footer-bottom-links {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-button {
    width: 100%;
  }

  .social-links {
    flex-wrap: wrap;
  }
}
</style>
