/**
 * Sugar Rush Template
 *
 * Clean, bright, modern design inspired by top party rental brands.
 * White backgrounds, coral/rose accents, playful but professional.
 * Target: Family parties, birthday celebrations, community events
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

const sugarrushTemplate: TemplateDefinition = {
  id: 'sugarrush',
  name: 'Sugar Rush',
  codename: 'SugarRush',
  description: 'Clean, bright, modern design with coral accents. Perfect for family-friendly party rental businesses looking for a professional yet playful aesthetic.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Birthday parties, family events, community celebrations',
  visualStyle: 'Clean white, coral/rose accents, rounded corners, friendly',

  defaultTheme: {
    ...bounceTheme,
    colors: {
      primary: '#f43f5e', // rose-500
      secondary: '#0f172a', // slate-900
      accent: '#fda4af', // rose-300
      background: '#ffffff',
      surface: '#f8fafc', // slate-50
      surfaceAlt: '#f1f5f9',
      text: '#0f172a',
      textMuted: '#64748b', // slate-500
      textOnPrimary: '#ffffff',
      border: '#e2e8f0', // slate-200
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  supportedThemes: ['bounce', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Sugar Rush Theme Styles */

/* Card hover effect */
.card-sugar {
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.card-sugar:hover {
  transform: translateY(-4px);
  border-color: #fda4af;
  box-shadow: 0 20px 40px rgba(244, 63, 94, 0.08);
}

/* Button styles */
.btn-sugar {
  transition: all 0.2s ease;
}

.btn-sugar:hover {
  transform: translateY(-1px);
}

/* Gradient backgrounds */
.bg-sugar-gradient {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
}

/* Badge pulse animation */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
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
      <linearGradient id="sugarGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="#ffffff"/>
    <!-- Pattern -->
    <circle cx="20" cy="20" r="2" fill="#f43f5e" fill-opacity="0.1"/>
    <circle cx="60" cy="20" r="2" fill="#f43f5e" fill-opacity="0.1"/>
    <circle cx="100" cy="20" r="2" fill="#f43f5e" fill-opacity="0.1"/>
    <circle cx="20" cy="60" r="2" fill="#f43f5e" fill-opacity="0.1"/>
    <circle cx="60" cy="60" r="2" fill="#f43f5e" fill-opacity="0.1"/>
    <!-- Hero content -->
    <rect x="30" y="70" width="100" height="20" rx="10" fill="#fef2f2" stroke="#fecaca"/>
    <rect x="30" y="100" width="180" height="28" rx="4" fill="#0f172a"/>
    <rect x="30" y="135" width="120" height="20" rx="4" fill="url(#sugarGrad)"/>
    <rect x="30" y="165" width="200" height="8" rx="4" fill="#64748b" fill-opacity="0.5"/>
    <rect x="30" y="180" width="160" height="8" rx="4" fill="#64748b" fill-opacity="0.3"/>
    <!-- CTA buttons -->
    <rect x="30" y="205" width="100" height="36" rx="18" fill="url(#sugarGrad)"/>
    <rect x="140" y="205" width="80" height="36" rx="18" fill="white" stroke="#e2e8f0"/>
    <!-- Image placeholder -->
    <rect x="250" y="50" width="130" height="100" rx="16" fill="#f8fafc" stroke="#e2e8f0"/>
    <!-- Floating card -->
    <rect x="235" y="130" width="100" height="50" rx="12" fill="white" stroke="#e2e8f0"/>
    <!-- Badge -->
    <rect x="330" y="40" width="60" height="24" rx="12" fill="#f43f5e"/>
    <!-- Categories -->
    <rect x="30" y="260" width="80" height="30" rx="12" fill="#fef2f2"/>
    <rect x="120" y="260" width="80" height="30" rx="12" fill="#f0f9ff"/>
    <rect x="210" y="260" width="80" height="30" rx="12" fill="#fef9c3"/>
    <rect x="300" y="260" width="80" height="30" rx="12" fill="#f0fdf4"/>
    <!-- Template name -->
    <text x="200" y="295" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="system-ui">Sugar Rush</text>
  </svg>`
}

export default sugarrushTemplate
