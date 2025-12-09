/**
 * Neon Template
 *
 * Vibrant dark theme with neon purple/pink/cyan accents.
 * Perfect for teen parties, evening events, entertainment venues.
 * Target: Teen parties, nighttime events, entertainment centers
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

const neonTemplate: TemplateDefinition = {
  id: 'neon',
  name: 'Neon',
  codename: 'Neon',
  description: 'Vibrant dark theme with neon accents. Perfect for teen parties and evening events.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Teen parties, evening events, entertainment venues',
  visualStyle: 'Dark backgrounds, neon purple/pink/cyan accents, glow effects',

  defaultTheme: {
    ...luxeTheme,
    colors: {
      primary: '#a855f7', // purple-500
      secondary: '#0f172a', // slate-900
      accent: '#ec4899', // pink-500
      background: '#020617', // slate-950
      surface: '#0f172a', // slate-900
      surfaceAlt: '#1e293b',
      text: '#ffffff',
      textMuted: '#94a3b8', // slate-400
      textOnPrimary: '#ffffff',
      border: '#1e293b', // slate-800
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  supportedThemes: ['luxe', 'energy'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Neon Theme Styles */

/* Card hover effect */
.card-neon {
  transition: all 0.3s ease;
  border: 1px solid #1e293b;
  background: rgba(15, 23, 42, 0.5);
}

.card-neon:hover {
  transform: translateY(-4px);
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.15);
}

/* Button styles */
.btn-neon {
  transition: all 0.2s ease;
}

.btn-neon:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

/* Gradient backgrounds */
.bg-neon-gradient {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}

/* Glow effect */
.glow-purple {
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
}

.glow-pink {
  box-shadow: 0 0 40px rgba(236, 72, 153, 0.3);
}

.glow-cyan {
  box-shadow: 0 0 40px rgba(6, 182, 212, 0.3);
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
    google: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap']
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="neonGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#a855f7"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="#020617"/>
    <!-- Glow effects -->
    <circle cx="100" cy="100" r="80" fill="#a855f7" fill-opacity="0.1"/>
    <circle cx="300" cy="200" r="80" fill="#ec4899" fill-opacity="0.1"/>
    <!-- Hero content -->
    <rect x="30" y="60" width="100" height="20" rx="10" fill="#1e293b" stroke="#a855f7" stroke-opacity="0.3"/>
    <rect x="30" y="90" width="180" height="28" rx="4" fill="#ffffff"/>
    <rect x="30" y="125" width="120" height="20" rx="4" fill="url(#neonGrad)"/>
    <rect x="30" y="155" width="200" height="8" rx="4" fill="#94a3b8" fill-opacity="0.5"/>
    <rect x="30" y="170" width="160" height="8" rx="4" fill="#94a3b8" fill-opacity="0.3"/>
    <!-- CTA buttons -->
    <rect x="30" y="195" width="100" height="36" rx="12" fill="url(#neonGrad)"/>
    <rect x="140" y="195" width="80" height="36" rx="12" fill="#0f172a" stroke="#1e293b"/>
    <!-- Image placeholder -->
    <rect x="250" y="50" width="130" height="100" rx="16" fill="#0f172a" stroke="#1e293b"/>
    <!-- Floating card -->
    <rect x="235" y="130" width="100" height="50" rx="12" fill="#0f172a" stroke="#a855f7" stroke-opacity="0.3"/>
    <!-- Categories -->
    <rect x="30" y="250" width="80" height="30" rx="12" fill="#1e293b"/>
    <rect x="120" y="250" width="80" height="30" rx="12" fill="#1e293b"/>
    <rect x="210" y="250" width="80" height="30" rx="12" fill="#1e293b"/>
    <rect x="300" y="250" width="80" height="30" rx="12" fill="#1e293b"/>
    <!-- Template name -->
    <text x="200" y="295" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="600" font-family="system-ui">Neon</text>
  </svg>`
}

export default neonTemplate
