/**
 * Clean Professional Template (Trust)
 *
 * Corporate, trustworthy, structured for schools and businesses.
 * Target: Corporate clients, schools, churches
 */

import type { TemplateDefinition } from '../types'
import { trustTheme } from '../theme-presets'

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

const trustTemplate: TemplateDefinition = {
  id: 'trust',
  name: 'Clean Professional',
  codename: 'Trust',
  description: 'Professional design for corporate clients, schools, and churches. Features clean structure, trustworthy colors, and organized layouts.',
  thumbnail: generateThumbnail(),
  targetAudience: 'Corporate clients, schools, churches, community organizations',
  visualStyle: 'Professional, structured, clean lines, trustworthy blue palette',

  defaultTheme: trustTheme,
  supportedThemes: ['trust', 'starter'],

  pages: [], // Loaded dynamically via loadPages

  smartBlocks: ['business-info', 'inventory-grid', 'featured-items', 'contact-form', 'booking-widget', 'testimonials', 'document-sign'],

  globalCss: `
/* Clean Professional Theme Styles */
.text-navy {
  color: #1e3a5f;
}

.bg-navy {
  background-color: #1e3a5f;
}

.border-navy {
  border-color: #1e3a5f;
}

/* Subtle professional hover */
.hover-professional {
  transition: all 0.2s ease;
}

.hover-professional:hover {
  background-color: rgba(14, 165, 233, 0.05);
}

/* Card with subtle border */
.card-professional {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.card-professional:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

/* Trust badge */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0369a1;
}

/* Professional button */
.btn-trust {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #1e3a5f;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-trust:hover {
  background-color: #152d4a;
}

/* Stats display */
.stat-trust {
  text-align: center;
  padding: 1.5rem;
}

.stat-trust .number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e3a5f;
  line-height: 1;
}

.stat-trust .label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
}

/* FAQ accordion */
.faq-item summary {
  cursor: pointer;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item[open] summary svg {
  transform: rotate(180deg);
}
  `.trim(),

  fonts: {
    google: ['https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap']
  },

  // Dynamic page loader
  loadPages
}

function generateThumbnail(): string {
  return `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#f0f9ff"/>
    <rect x="30" y="60" width="160" height="180" rx="8" fill="white" stroke="#bae6fd"/>
    <rect x="210" y="80" width="160" height="16" rx="4" fill="#1e3a5f"/>
    <rect x="210" y="104" width="120" height="10" rx="2" fill="#0ea5e9"/>
    <rect x="210" y="130" width="150" height="8" rx="2" fill="#64748b"/>
    <rect x="210" y="146" width="140" height="8" rx="2" fill="#64748b"/>
    <rect x="210" y="172" width="80" height="32" rx="6" fill="#1e3a5f"/>
    <rect x="300" y="172" width="70" height="32" rx="6" fill="none" stroke="#cbd5e1" stroke-width="1"/>
    <circle cx="230" cy="240" r="12" fill="#dcfce7"/>
    <circle cx="270" cy="240" r="12" fill="#dbeafe"/>
    <circle cx="310" cy="240" r="12" fill="#fef3c7"/>
    <text x="200" y="280" text-anchor="middle" fill="#1e3a5f" font-size="11" font-weight="600" font-family="system-ui">Clean Professional</text>
  </svg>`
}

export default trustTemplate
