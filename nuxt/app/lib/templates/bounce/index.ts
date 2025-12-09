/**
 * Family Party Template (Bounce)
 *
 * Modern, clean design for family-friendly party rentals.
 * Target: Birthday parties, family events, backyard celebrations
 */

import type { TemplateDefinition } from '../types'
import { bounceTheme } from '../theme-presets'

// Lazy load pages
const loadPages = () => Promise.all([
  import('./pages/home').then(m => m.default),
  import('./pages/inventory').then(m => m.default),
  import('./pages/about').then(m => m.default),
  import('./pages/contact').then(m => m.default),
  import('./pages/booking').then(m => m.default),
  import('./pages/terms').then(m => m.default),
  import('./pages/waiver').then(m => m.default)
])

const bounceTemplate: TemplateDefinition = {
  id: 'bounce',
  name: 'Family Party',
  codename: 'Bounce',
  description: 'Modern, clean design perfect for birthday parties and family events. Features warm colors, professional layout, and trust-building elements.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Birthday parties, family events, backyard celebrations',
  visualStyle: 'Clean, modern, warm gradients, professional with friendly appeal',

  defaultTheme: bounceTheme,
  supportedThemes: ['bounce', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Family Party Theme Styles */

/* Smooth hover transitions */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Button hover effects */
.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

/* Image hover zoom */
.img-hover {
  overflow: hidden;
}

.img-hover img {
  transition: transform 0.5s ease;
}

.img-hover:hover img {
  transform: scale(1.05);
}

/* Fade up animation */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeUp 0.6s ease forwards;
}

/* Stagger delays */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

/* Gradient text helper */
.text-gradient {
  background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shadow utilities */
.shadow-pink {
  box-shadow: 0 10px 40px rgba(236, 72, 153, 0.2);
}

/* Container max widths */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}
  `.trim(),

  fonts: {
    google: ['https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap']
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bounceGrad" x1="0" y1="0" x2="400" y2="300">
        <stop offset="0%" stop-color="#fdf2f8"/>
        <stop offset="100%" stop-color="#f0f9ff"/>
      </linearGradient>
      <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#f97316"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="url(#bounceGrad)"/>
    <!-- Decorative blurs -->
    <circle cx="350" cy="50" r="80" fill="#fce7f3" fill-opacity="0.5"/>
    <circle cx="50" cy="250" r="60" fill="#e0f2fe" fill-opacity="0.5"/>
    <!-- Hero content -->
    <rect x="30" y="80" width="140" height="12" rx="6" fill="#0f172a"/>
    <rect x="30" y="100" width="200" height="24" rx="4" fill="url(#pinkGrad)"/>
    <rect x="30" y="135" width="180" height="8" rx="4" fill="#64748b" fill-opacity="0.6"/>
    <rect x="30" y="150" width="160" height="8" rx="4" fill="#64748b" fill-opacity="0.4"/>
    <!-- CTA Button -->
    <rect x="30" y="175" width="100" height="36" rx="10" fill="url(#pinkGrad)"/>
    <rect x="140" y="175" width="80" height="36" rx="10" fill="white" stroke="#e2e8f0"/>
    <!-- Image placeholder -->
    <rect x="250" y="60" width="130" height="100" rx="16" fill="white" stroke="#e2e8f0"/>
    <circle cx="315" cy="110" r="25" fill="#fce7f3"/>
    <!-- Cards -->
    <rect x="30" y="220" width="100" height="60" rx="12" fill="white" stroke="#e2e8f0"/>
    <rect x="145" y="220" width="100" height="60" rx="12" fill="white" stroke="#e2e8f0"/>
    <rect x="260" y="220" width="100" height="60" rx="12" fill="white" stroke="#e2e8f0"/>
    <!-- Template name -->
    <text x="200" y="292" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="system-ui">Family Party</text>
  </svg>`
}

export default bounceTemplate
