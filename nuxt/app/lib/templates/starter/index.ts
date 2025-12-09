/**
 * Modern Minimal Template (Starter)
 *
 * Clean Swiss design with confident neutrals and strategic pops of color.
 * Perfect for businesses just getting started or those who prefer simplicity.
 *
 * Design Philosophy:
 * - Generous white space creates breathing room
 * - Bold typography establishes hierarchy
 * - Subtle animations add life without distraction
 * - Strategic color accents guide the eye
 */

import type { TemplateDefinition } from '../types'
import { starterTheme } from '../theme-presets'
import { homePage } from './pages/home'
import { inventoryPage } from './pages/inventory'
import { aboutPage } from './pages/about'
import { contactPage } from './pages/contact'
import { bookingPage } from './pages/booking'
import { termsPage } from './pages/terms'
import { waiverPage } from './pages/waiver'

const starterTemplate: TemplateDefinition = {
  id: 'starter',
  name: 'Modern Minimal',
  codename: 'Starter',
  description: 'Clean Swiss design with confident neutrals. Perfect for first-time users who want a professional, modern look.',
  thumbnail: generateThumbnail(),
  targetAudience: 'First-time users, businesses wanting clean professionalism',
  visualStyle: 'Minimalist, Swiss design, bold typography, generous white space',

  defaultTheme: starterTheme,
  supportedThemes: ['starter', 'trust'],

  pages: [
    homePage,
    inventoryPage,
    aboutPage,
    contactPage,
    bookingPage,
    termsPage,
    waiverPage
  ],

  smartBlocks: [
    'business-info',
    'inventory-grid',
    'featured-items',
    'contact-form',
    'booking-widget',
    'testimonials',
    'document-sign'
  ],

  globalCss: `
/* ============================================================================
   MODERN MINIMAL TEMPLATE - GLOBAL STYLES
   ============================================================================ */

/* Base smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Anti-slop: Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Anti-slop: Colored shadows */
.shadow-colored {
  box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.15);
}

.shadow-primary {
  box-shadow: 0 10px 30px -5px color-mix(in srgb, var(--color-primary) 30%, transparent);
}

/* Anti-slop: Overlapping elements */
.overlap-up {
  margin-top: -4rem;
  position: relative;
  z-index: 10;
}

.overlap-down {
  margin-bottom: -4rem;
  position: relative;
}

/* Anti-slop: Asymmetric containers */
.asymmetric-left {
  margin-left: -5%;
  width: 105%;
}

.asymmetric-right {
  margin-right: -5%;
  width: 105%;
}

/* Smooth hover transitions */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* Scale on hover */
.hover-scale {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-scale:hover {
  transform: scale(1.03);
}

/* Image zoom on hover (for containers) */
.img-zoom {
  overflow: hidden;
}

.img-zoom img {
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.img-zoom:hover img {
  transform: scale(1.08);
}

/* Stagger animation delays */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }

/* Fade in up animation */
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

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Subtle float animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Button styles */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  padding: 0.875rem 2rem;
  border-radius: var(--radius);
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  padding: 0.875rem 2rem;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius);
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* Section padding */
.section {
  padding: 6rem 0;
}

.section-lg {
  padding: 8rem 0;
}

/* Container */
.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

@media (min-width: 640px) {
  .container {
    padding: 0 2rem;
  }
}

/* Card hover states */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

/* Link underline animation */
.link-underline {
  position: relative;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.link-underline:hover::after {
  width: 100%;
}

/* Responsive text sizes */
.text-display {
  font-size: clamp(2.5rem, 5vw + 1rem, 4.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-headline {
  font-size: clamp(2rem, 4vw + 0.5rem, 3rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-subheadline {
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);
  line-height: 1.4;
}
  `.trim(),

  fonts: {
    google: [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
    ]
  }
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="400" height="300" fill="#ffffff"/>

    <!-- Header -->
    <rect y="0" width="400" height="60" fill="#f8fafc"/>
    <circle cx="30" cy="30" r="12" fill="#0f172a"/>
    <rect x="50" y="24" width="60" height="12" rx="2" fill="#0f172a"/>
    <rect x="280" y="22" width="50" height="16" rx="4" fill="#0f172a"/>
    <rect x="340" y="22" width="40" height="16" rx="4" fill="#3b82f6"/>

    <!-- Hero Section -->
    <rect y="60" width="400" height="140" fill="#f1f5f9"/>
    <rect x="30" y="90" width="180" height="24" rx="4" fill="#0f172a"/>
    <rect x="30" y="120" width="220" height="12" rx="2" fill="#64748b"/>
    <rect x="30" y="140" width="180" height="12" rx="2" fill="#64748b"/>
    <rect x="30" y="165" width="80" height="28" rx="6" fill="#3b82f6"/>
    <rect x="120" y="165" width="70" height="28" rx="6" fill="none" stroke="#0f172a" stroke-width="2"/>

    <!-- Hero Image Placeholder -->
    <rect x="260" y="75" width="120" height="110" rx="8" fill="#e2e8f0"/>
    <circle cx="320" cy="130" r="20" fill="#cbd5e1"/>

    <!-- Cards Section -->
    <rect y="200" width="400" height="100" fill="#ffffff"/>
    <g transform="translate(30, 215)">
      <rect width="100" height="70" rx="6" fill="#f8fafc"/>
      <rect x="10" y="45" width="60" height="8" rx="2" fill="#0f172a"/>
      <rect x="10" y="57" width="40" height="6" rx="1" fill="#64748b"/>
    </g>
    <g transform="translate(145, 215)">
      <rect width="100" height="70" rx="6" fill="#f8fafc"/>
      <rect x="10" y="45" width="60" height="8" rx="2" fill="#0f172a"/>
      <rect x="10" y="57" width="40" height="6" rx="1" fill="#64748b"/>
    </g>
    <g transform="translate(260, 215)">
      <rect width="100" height="70" rx="6" fill="#f8fafc"/>
      <rect x="10" y="45" width="60" height="8" rx="2" fill="#0f172a"/>
      <rect x="10" y="57" width="40" height="6" rx="1" fill="#64748b"/>
    </g>

    <!-- Template Label -->
    <text x="200" y="292" text-anchor="middle" fill="#3b82f6" font-size="10" font-family="system-ui" font-weight="600">Modern Minimal</text>
  </svg>`
}

export default starterTemplate
