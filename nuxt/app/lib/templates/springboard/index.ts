/**
 * Springboard Template
 *
 * Modern gradient design with real-time booking focus.
 * Orange to teal palette, clean and trustworthy, BounceTime-inspired.
 * Target: Modern rental businesses, tech-forward companies, professional services
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

const springboardTemplate: TemplateDefinition = {
  id: 'springboard',
  name: 'Springboard',
  codename: 'Springboard',
  description: 'Modern gradient design with real-time booking focus - orange to teal palette, clean and trustworthy',
  thumbnail: generateThumbnail(),
  targetAudience: 'Modern rental businesses, tech-forward companies, professional services',
  visualStyle: 'Orange-teal gradient, modern, clean, trustworthy, safety-focused',

  defaultTheme: {
    ...bounceTheme,
    colors: {
      primary: '#F97316', // orange-500
      secondary: '#14B8A6', // teal-500
      accent: '#F59E0B', // amber-500
      background: '#FFFFFF',
      surface: '#F8FAFC', // slate-50
      surfaceAlt: '#F1F5F9', // slate-100
      text: '#1E293B', // slate-800
      textMuted: '#64748B', // slate-500
      textOnPrimary: '#FFFFFF', // white
      border: '#E2E8F0', // slate-200
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    }
  },
  supportedThemes: ['bounce', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'rental-item-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Springboard Template Global Styles */
:root {
  --gradient-primary: linear-gradient(135deg, #F97316 0%, #14B8A6 100%);
  --gradient-primary-hover: linear-gradient(135deg, #EA580C 0%, #0D9488 100%);
  --gradient-subtle: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%);
  --shadow-glow: 0 10px 40px -10px rgba(249, 115, 22, 0.25);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Source Sans 3', sans-serif;
  color: #1E293B;
  background: #FFFFFF;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  line-height: 1.2;
  color: #1E293B;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  background: var(--gradient-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 15px 50px -10px rgba(249, 115, 22, 0.35);
}

.btn-outline {
  background: transparent;
  color: #F97316;
  border: 2px solid #F97316;
}

.btn-outline:hover {
  background: #F97316;
  color: white;
  transform: translateY(-2px);
}

.btn-white {
  background: white;
  color: #1E293B;
  box-shadow: var(--shadow-card);
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-bg {
  background: var(--gradient-primary);
}

.gradient-bg-subtle {
  background: var(--gradient-subtle);
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-4px);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.section {
  padding: 5rem 0;
}

@media (max-width: 768px) {
  .section {
    padding: 3rem 0;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Utility Classes */
.text-balance {
  text-wrap: balance;
}

.backdrop-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
  `.trim(),

  fonts: {
    google: [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap'
    ]
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="springGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F97316"/>
        <stop offset="100%" stop-color="#14B8A6"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="300" fill="#ffffff"/>
    <!-- Gradient Header -->
    <rect width="400" height="120" fill="url(#springGrad)"/>
    <!-- Decorative circles -->
    <circle cx="60" cy="40" r="30" fill="white" fill-opacity="0.1"/>
    <circle cx="340" cy="80" r="40" fill="white" fill-opacity="0.1"/>
    <!-- Hero content on gradient -->
    <rect x="30" y="30" width="80" height="16" rx="8" fill="white" fill-opacity="0.3"/>
    <rect x="30" y="55" width="200" height="24" rx="4" fill="white"/>
    <rect x="30" y="85" width="140" height="20" rx="10" fill="white"/>
    <!-- Trust icons -->
    <circle cx="50" cy="150" r="20" fill="url(#springGrad)"/>
    <circle cx="120" cy="150" r="20" fill="url(#springGrad)"/>
    <circle cx="190" cy="150" r="20" fill="url(#springGrad)"/>
    <circle cx="260" cy="150" r="20" fill="url(#springGrad)"/>
    <!-- Feature cards -->
    <rect x="30" y="190" width="80" height="60" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <rect x="120" y="190" width="80" height="60" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <rect x="210" y="190" width="80" height="60" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <rect x="300" y="190" width="80" height="60" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <!-- CTA Button -->
    <rect x="30" y="265" width="120" height="28" rx="14" fill="url(#springGrad)"/>
    <!-- Template name -->
    <text x="200" y="295" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="system-ui">Springboard</text>
  </svg>`
}

export default springboardTemplate
