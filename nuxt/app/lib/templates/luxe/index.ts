/**
 * Elegant Premium Template (Luxe)
 *
 * Sophisticated, high-end feel for weddings and corporate events.
 * Target: High-end events, weddings, corporate functions
 */

import type { TemplateDefinition } from '../types'
import { luxeTheme } from '../theme-presets'

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

const luxeTemplate: TemplateDefinition = {
  id: 'luxe',
  name: 'Elegant Premium',
  codename: 'Luxe',
  description: 'Sophisticated design for high-end events, weddings, and corporate functions. Features serif typography, muted palette, and refined animations.',
  thumbnail: generateThumbnail(),
  targetAudience: 'High-end events, weddings, corporate functions',
  visualStyle: 'Elegant, sophisticated, serif fonts, muted tones, subtle animations',

  defaultTheme: luxeTheme,
  supportedThemes: ['luxe', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Elegant Premium Theme Styles */
.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.text-gold {
  color: #a16207;
}

.bg-gold {
  background-color: #a16207;
}

.border-gold {
  border-color: #a16207;
}

/* Subtle fade-in animation */
@keyframes fade-up {
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
  animation: fade-up 0.8s ease-out;
}

/* Elegant hover effect */
.hover-elegant {
  transition: all 0.4s ease;
}

.hover-elegant:hover {
  transform: translateY(-2px);
}

/* Luxe card style */
.card-luxe {
  background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
  border: 1px solid rgba(217, 119, 6, 0.2);
  transition: all 0.4s ease;
}

.card-luxe:hover {
  border-color: rgba(217, 119, 6, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Luxe button */
.btn-luxe {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #1c1917;
  transition: all 0.3s ease;
}

.btn-luxe:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

/* Decorative line */
.line-gold {
  height: 1px;
  background: linear-gradient(90deg, transparent, #d97706, transparent);
}
  `.trim(),

  fonts: {
    google: [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap'
    ]
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0c0a09"/>
    <rect x="0" y="0" width="400" height="80" fill="url(#luxeGrad)" fill-opacity="0.2"/>
    <!-- Decorative corners -->
    <path d="M30 30 L30 60 M30 30 L60 30" stroke="#d97706" stroke-width="1" stroke-opacity="0.5"/>
    <path d="M370 30 L370 60 M370 30 L340 30" stroke="#d97706" stroke-width="1" stroke-opacity="0.5"/>
    <!-- Content -->
    <rect x="30" y="80" width="180" height="12" fill="#fafaf9"/>
    <rect x="30" y="100" width="140" height="8" fill="#d97706"/>
    <rect x="30" y="130" width="200" height="6" fill="#57534e"/>
    <rect x="30" y="144" width="180" height="6" fill="#57534e"/>
    <rect x="30" y="170" width="80" height="30" fill="#d97706"/>
    <rect x="120" y="170" width="80" height="30" fill="none" stroke="#44403c" stroke-width="1"/>
    <!-- Image placeholder -->
    <rect x="260" y="60" width="120" height="150" fill="#292524"/>
    <text x="200" y="270" text-anchor="middle" fill="#d97706" font-size="12" font-family="Georgia" font-style="italic">Elegant Premium</text>
    <defs>
      <linearGradient id="luxeGrad" x1="0" y1="0" x2="400" y2="80">
        <stop offset="0%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="transparent"/>
      </linearGradient>
    </defs>
  </svg>`
}

export default luxeTemplate
