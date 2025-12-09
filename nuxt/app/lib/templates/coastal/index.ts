/**
 * Coastal Template
 *
 * Beach/ocean themed design with light blues and sandy neutrals.
 * Perfect for water slides, summer parties, beach events.
 * Target: Summer rentals, pool parties, beach communities
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

const coastalTemplate: TemplateDefinition = {
  id: 'coastal',
  name: 'Coastal',
  codename: 'Coastal',
  description: 'Beach-inspired design with ocean blues and sandy warmth. Perfect for water slides, summer parties, and pool events.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Water slide rentals, summer parties, pool events, beach communities',
  visualStyle: 'Light blues, ocean gradients, sandy neutrals, wave patterns',

  defaultTheme: {
    ...starterTheme,
    colors: {
      primary: '#0ea5e9', // sky-500
      secondary: '#0f172a', // slate-900
      accent: '#06b6d4', // cyan-500
      background: '#ffffff',
      surface: '#f0f9ff', // sky-50
      surfaceAlt: '#e0f2fe', // sky-100
      text: '#0f172a',
      textMuted: '#64748b', // slate-500
      textOnPrimary: '#ffffff',
      border: '#e0f2fe', // sky-100
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  supportedThemes: ['starter', 'bounce'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Coastal Theme Styles */

/* Card hover effect */
.card-coastal {
  transition: all 0.3s ease;
  border: 1px solid #e0f2fe;
}

.card-coastal:hover {
  transform: translateY(-4px);
  border-color: #7dd3fc;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08);
}

/* Button styles */
.btn-coastal {
  transition: all 0.2s ease;
}

.btn-coastal:hover {
  transform: translateY(-1px);
}

/* Gradient backgrounds */
.bg-coastal-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

/* Wave animation */
@keyframes wave {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-5px) translateY(2px); }
  50% { transform: translateX(0) translateY(4px); }
  75% { transform: translateX(5px) translateY(2px); }
}

.animate-wave {
  animation: wave 3s ease-in-out infinite;
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
    google: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap']
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coastalGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0ea5e9"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="#f0f9ff"/>
    <!-- Wave pattern -->
    <path d="M0 250 Q100 230, 200 250 T400 250 V300 H0 Z" fill="#0ea5e9" fill-opacity="0.1"/>
    <path d="M0 260 Q100 240, 200 260 T400 260 V300 H0 Z" fill="#0ea5e9" fill-opacity="0.15"/>
    <!-- Hero content -->
    <rect x="30" y="60" width="100" height="20" rx="10" fill="#e0f2fe" stroke="#bae6fd"/>
    <rect x="30" y="90" width="180" height="28" rx="4" fill="#0f172a"/>
    <rect x="30" y="125" width="120" height="20" rx="4" fill="url(#coastalGrad)"/>
    <rect x="30" y="155" width="200" height="8" rx="4" fill="#64748b" fill-opacity="0.5"/>
    <rect x="30" y="170" width="160" height="8" rx="4" fill="#64748b" fill-opacity="0.3"/>
    <!-- CTA buttons -->
    <rect x="30" y="195" width="100" height="36" rx="12" fill="url(#coastalGrad)"/>
    <rect x="140" y="195" width="80" height="36" rx="12" fill="white" stroke="#e0f2fe"/>
    <!-- Image placeholder -->
    <rect x="250" y="50" width="130" height="100" rx="16" fill="#e0f2fe" stroke="#bae6fd"/>
    <!-- Floating card -->
    <rect x="235" y="130" width="100" height="50" rx="12" fill="white" stroke="#e0f2fe"/>
    <!-- Badge -->
    <rect x="330" y="40" width="60" height="24" rx="12" fill="#0ea5e9"/>
    <!-- Categories -->
    <rect x="30" y="250" width="80" height="30" rx="12" fill="#e0f2fe"/>
    <rect x="120" y="250" width="80" height="30" rx="12" fill="#fef3c7"/>
    <rect x="210" y="250" width="80" height="30" rx="12" fill="#d1fae5"/>
    <rect x="300" y="250" width="80" height="30" rx="12" fill="#ede9fe"/>
    <!-- Template name -->
    <text x="200" y="295" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="system-ui">Coastal</text>
  </svg>`
}

export default coastalTemplate
