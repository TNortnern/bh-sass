<script setup lang="ts">
interface FooterLink {
  id: string
  label: string
  href: string
}

interface Props {
  data: {
    businessName: string
    description: string
    phone: string
    email: string
    address: string
    links: FooterLink[]
    copyright: string
  }
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3 class="brand-name">
            {{ data.businessName }}
          </h3>
          <p class="brand-description">
            {{ data.description }}
          </p>
          <div class="social-links">
            <a
              href="#"
              class="social-link"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              ><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a
              href="#"
              class="social-link"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              ><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a
              href="#"
              class="social-link"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              ><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <h4 class="footer-heading">
            Quick Links
          </h4>
          <ul>
            <li
              v-for="link in data.links"
              :key="link.id"
            >
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4 class="footer-heading">
            Contact
          </h4>
          <ul>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <a :href="`tel:${data.phone}`">{{ data.phone }}</a>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><rect
                width="20"
                height="16"
                x="2"
                y="4"
                rx="2"
              /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <a :href="`mailto:${data.email}`">{{ data.email }}</a>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
                cx="12"
                cy="10"
                r="3"
              /></svg>
              <span>{{ data.address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ data.copyright.replace('{year}', currentYear.toString()) }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 4rem 0 0;
  background: #0a0a0a;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Brand */
.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.75rem;
}

.brand-description {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 0.625rem;
}

.social-link {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #f59e0b;
}

/* Links */
.footer-heading {
  font-size: 0.9375rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.25rem;
}

.footer-links ul,
.footer-contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #f59e0b;
}

/* Contact */
.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
}

.footer-contact li svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: #f59e0b;
}

.footer-contact a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-contact a:hover {
  color: #f59e0b;
}

/* Bottom */
.footer-bottom {
  padding: 1.5rem 0;
  text-align: center;
}

.footer-bottom p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }

  .brand-description {
    max-width: none;
  }

  .social-links {
    justify-content: center;
  }

  .footer-contact li {
    justify-content: center;
  }
}
</style>
