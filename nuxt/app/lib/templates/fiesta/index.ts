/**
 * Fiesta Template
 *
 * Warm, festive design with terracotta, coral, and vibrant accents.
 * Perfect for Mexican-themed parties, fiestas, community celebrations.
 * Target: Family celebrations, cultural events, community gatherings
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

const fiestaTemplate: TemplateDefinition = {
  id: 'fiesta',
  name: 'Fiesta',
  codename: 'Fiesta',
  description: 'Warm, festive design with terracotta and vibrant accents. Perfect for cultural celebrations and community events.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Cultural celebrations, community events, family fiestas',
  visualStyle: 'Warm orange and rose gradients, festive accents, inviting atmosphere',

  defaultTheme: {
    ...bounceTheme,
    colors: {
      primary: '#f97316', // orange-500
      secondary: '#0f172a', // slate-900
      accent: '#f43f5e', // rose-500
      background: '#ffffff',
      surface: '#fffbeb', // amber-50
      surfaceAlt: '#fef3c7', // amber-100
      text: '#0f172a',
      textMuted: '#64748b', // slate-500
      textOnPrimary: '#ffffff',
      border: '#fed7aa', // orange-200
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  supportedThemes: ['bounce', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Fiesta Theme Styles */

/* Card hover effect */
.card-fiesta {
  transition: all 0.3s ease;
  border: 1px solid #fed7aa;
}

.card-fiesta:hover {
  transform: translateY(-4px);
  border-color: #fdba74;
  box-shadow: 0 20px 40px rgba(249, 115, 22, 0.08);
}

/* Button styles */
.btn-fiesta {
  transition: all 0.2s ease;
}

.btn-fiesta:hover {
  transform: translateY(-1px);
}

/* Gradient backgrounds */
.bg-fiesta-gradient {
  background: linear-gradient(135deg, #f97316 0%, #f43f5e 100%);
}

/* Festive border pattern */
.border-festive {
  border-image: linear-gradient(90deg, #f97316, #f43f5e, #ec4899, #f97316) 1;
}

/* Image hover zoom */
.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 0.5s ease;
}

.img-zoom:hover img {
  transform: scale(1.05);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1280px;
  }
}

/* Fade in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease forwards;
}

/* Stagger animations */
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
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
      <linearGradient id="fiestaGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#f43f5e"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="#fffbeb"/>
    <!-- Decorative circles -->
    <circle cx="350" cy="50" r="30" fill="#f97316" fill-opacity="0.1"/>
    <circle cx="30" cy="250" r="25" fill="#f43f5e" fill-opacity="0.1"/>
    <!-- Hero content -->
    <rect x="30" y="60" width="100" height="20" rx="10" fill="#fff7ed" stroke="#fed7aa"/>
    <rect x="30" y="90" width="180" height="28" rx="4" fill="#0f172a"/>
    <rect x="30" y="125" width="120" height="20" rx="4" fill="url(#fiestaGrad)"/>
    <rect x="30" y="155" width="200" height="8" rx="4" fill="#64748b" fill-opacity="0.5"/>
    <rect x="30" y="170" width="160" height="8" rx="4" fill="#64748b" fill-opacity="0.3"/>
    <!-- CTA buttons -->
    <rect x="30" y="195" width="100" height="36" rx="12" fill="url(#fiestaGrad)"/>
    <rect x="140" y="195" width="80" height="36" rx="12" fill="white" stroke="#fed7aa"/>
    <!-- Image placeholder -->
    <rect x="250" y="50" width="130" height="100" rx="16" fill="#fff7ed" stroke="#fed7aa"/>
    <!-- Floating card -->
    <rect x="235" y="130" width="100" height="50" rx="12" fill="white" stroke="#fed7aa"/>
    <!-- Badge -->
    <rect x="330" y="40" width="60" height="24" rx="12" fill="#f97316"/>
    <!-- Categories -->
    <rect x="30" y="250" width="80" height="30" rx="12" fill="#fff7ed"/>
    <rect x="120" y="250" width="80" height="30" rx="12" fill="#ffe4e6"/>
    <rect x="210" y="250" width="80" height="30" rx="12" fill="#ccfbf1"/>
    <rect x="300" y="250" width="80" height="30" rx="12" fill="#ede9fe"/>
    <!-- Template name -->
    <text x="200" y="295" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="system-ui">Fiesta</text>
  </svg>`
}

export default fiestaTemplate
