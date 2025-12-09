/**
 * Energy Template
 *
 * Bold, dynamic dark theme for sports events and active entertainment.
 * Target: Sports events, team parties, outdoor activities, school events
 */

import type { TemplateDefinition } from '../types'
import { energyTheme } from '../theme-presets'

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

const energyTemplate: TemplateDefinition = {
  id: 'energy',
  name: 'Energy',
  codename: 'Energy',
  description: 'Bold, dynamic dark theme perfect for sports events, team parties, and high-energy activities. Features emerald accents and modern styling.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Sports events, team parties, outdoor activities, school events',
  visualStyle: 'Dark theme, bold typography, emerald/cyan accents, modern minimal',

  defaultTheme: energyTheme,
  supportedThemes: ['energy', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Energy Theme Styles */

/* Smooth transitions */
.card-energy {
  transition: all 0.3s ease;
}

.card-energy:hover {
  transform: translateY(-4px);
  border-color: rgba(16, 185, 129, 0.3);
}

/* Button hover effect */
.btn-energy {
  transition: all 0.2s ease;
}

.btn-energy:hover {
  transform: translateY(-2px);
}

/* Border reveal animation */
.border-reveal {
  position: relative;
  overflow: hidden;
}

.border-reveal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #10b981, #06b6d4);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.3s ease;
}

.border-reveal:hover::before {
  transform: scaleY(1);
}

/* Gradient text */
.text-gradient-energy {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow effects */
.glow-emerald {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.15);
}

.glow-cyan {
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.15);
}

/* Image overlay */
.img-overlay {
  position: relative;
}

.img-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(24, 24, 27, 1), rgba(24, 24, 27, 0.2), transparent);
}

/* Container */
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

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}
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
      <linearGradient id="energyGrad" x1="0" y1="0" x2="400" y2="300">
        <stop offset="0%" stop-color="#18181b"/>
        <stop offset="100%" stop-color="#27272a"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="100%" stop-color="#06b6d4"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="url(#energyGrad)"/>
    <!-- Gradient overlays -->
    <rect x="250" y="0" width="150" height="150" fill="#10b981" fill-opacity="0.08"/>
    <rect x="0" y="150" width="100" height="150" fill="#06b6d4" fill-opacity="0.08"/>
    <!-- Content -->
    <rect x="30" y="70" width="4" height="30" fill="#10b981"/>
    <rect x="45" y="75" width="120" height="8" rx="2" fill="#10b981" fill-opacity="0.6"/>
    <rect x="30" y="110" width="180" height="24" rx="2" fill="white"/>
    <rect x="30" y="145" width="160" height="8" rx="2" fill="#71717a"/>
    <rect x="30" y="160" width="140" height="8" rx="2" fill="#52525b"/>
    <!-- CTA -->
    <rect x="30" y="185" width="90" height="36" fill="#10b981"/>
    <rect x="130" y="185" width="80" height="36" stroke="#3f3f46" fill="none"/>
    <!-- Stats -->
    <rect x="30" y="240" width="50" height="20" rx="2" fill="white"/>
    <rect x="30" y="265" width="40" height="6" rx="2" fill="#52525b"/>
    <rect x="100" y="240" width="50" height="20" rx="2" fill="#10b981"/>
    <rect x="100" y="265" width="40" height="6" rx="2" fill="#52525b"/>
    <rect x="170" y="240" width="50" height="20" rx="2" fill="#06b6d4"/>
    <rect x="170" y="265" width="40" height="6" rx="2" fill="#52525b"/>
    <!-- Image area -->
    <rect x="250" y="60" width="130" height="160" fill="#27272a" stroke="#3f3f46"/>
    <rect x="247" y="57" width="12" height="12" stroke="#10b981" stroke-width="2" fill="none"/>
    <rect x="371" y="211" width="12" height="12" stroke="#06b6d4" stroke-width="2" fill="none"/>
    <!-- Template name -->
    <text x="200" y="292" text-anchor="middle" fill="#71717a" font-size="10" font-weight="600" font-family="system-ui">Energy</text>
  </svg>`
}

export default energyTemplate
