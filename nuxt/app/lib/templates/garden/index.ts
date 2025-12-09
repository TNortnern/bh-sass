/**
 * Garden Template
 *
 * Natural, earthy design with greens and organic feel.
 * Perfect for outdoor events, eco-friendly businesses, nature-themed parties.
 * Target: Outdoor events, backyard parties, eco-conscious customers
 */

import type { TemplateDefinition } from '../types'
import { starterTheme } from '../theme-presets'

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

const gardenTemplate: TemplateDefinition = {
  id: 'garden',
  name: 'Garden',
  codename: 'Garden',
  description: 'Natural, earthy design with greens. Perfect for outdoor events and eco-friendly businesses.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Outdoor events, backyard parties, eco-conscious customers',
  visualStyle: 'Natural greens, earthy tones, organic shapes, fresh feel',

  defaultTheme: {
    ...starterTheme,
    colors: {
      primary: '#10b981', // emerald-500
      secondary: '#1c1917', // stone-900
      accent: '#14b8a6', // teal-500
      background: '#ffffff',
      surface: '#f5f5f4', // stone-100
      surfaceAlt: '#e7e5e4', // stone-200
      text: '#1c1917',
      textMuted: '#78716c', // stone-500
      textOnPrimary: '#ffffff',
      border: '#d6d3d1', // stone-300
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  supportedThemes: ['starter', 'bounce'],

  pages: [],

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Garden Theme Styles */

.card-garden {
  transition: all 0.3s ease;
  border: 1px solid #d6d3d1;
}

.card-garden:hover {
  transform: translateY(-4px);
  border-color: #6ee7b7;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.08);
}

.btn-garden {
  transition: all 0.2s ease;
}

.btn-garden:hover {
  transform: translateY(-1px);
}

.bg-garden-gradient {
  background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
}

.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 0.5s ease;
}

.img-zoom:hover img {
  transform: scale(1.05);
}

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

.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
  `.trim(),

  fonts: {
    google: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap']
  },

  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gardenGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#14b8a6"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="#f5f5f4"/>
    <circle cx="350" cy="50" r="30" fill="#10b981" fill-opacity="0.1"/>
    <circle cx="30" cy="250" r="25" fill="#14b8a6" fill-opacity="0.1"/>
    <rect x="30" y="60" width="100" height="20" rx="10" fill="#d1fae5" stroke="#6ee7b7"/>
    <rect x="30" y="90" width="180" height="28" rx="4" fill="#1c1917"/>
    <rect x="30" y="125" width="120" height="20" rx="4" fill="url(#gardenGrad)"/>
    <rect x="30" y="155" width="200" height="8" rx="4" fill="#78716c" fill-opacity="0.5"/>
    <rect x="30" y="170" width="160" height="8" rx="4" fill="#78716c" fill-opacity="0.3"/>
    <rect x="30" y="195" width="100" height="36" rx="12" fill="url(#gardenGrad)"/>
    <rect x="140" y="195" width="80" height="36" rx="12" fill="white" stroke="#d6d3d1"/>
    <rect x="250" y="50" width="130" height="100" rx="16" fill="#d1fae5" stroke="#6ee7b7"/>
    <rect x="235" y="130" width="100" height="50" rx="12" fill="white" stroke="#d6d3d1"/>
    <rect x="330" y="40" width="60" height="24" rx="12" fill="#10b981"/>
    <rect x="30" y="250" width="80" height="30" rx="12" fill="#d1fae5"/>
    <rect x="120" y="250" width="80" height="30" rx="12" fill="#ecfccb"/>
    <rect x="210" y="250" width="80" height="30" rx="12" fill="#cffafe"/>
    <rect x="300" y="250" width="80" height="30" rx="12" fill="#fef3c7"/>
    <text x="200" y="295" text-anchor="middle" fill="#78716c" font-size="10" font-weight="600" font-family="system-ui">Garden</text>
  </svg>`
}

export default gardenTemplate
