/**
 * Template Preview SVGs
 * Simple, clean preview images for template selection
 */

export const templatePreviews = {
  'starter-classic': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Header -->
      <rect x="0" y="0" width="400" height="60" fill="#1e40af"/>
      <rect x="20" y="20" width="100" height="20" rx="4" fill="#fff" opacity="0.3"/>
      <rect x="280" y="25" width="100" height="10" rx="2" fill="#fff" opacity="0.5"/>

      <!-- Hero -->
      <rect x="0" y="60" width="400" height="120" fill="#3b82f6"/>
      <rect x="40" y="90" width="200" height="15" rx="4" fill="#fff" opacity="0.8"/>
      <rect x="40" y="110" width="150" height="10" rx="2" fill="#fff" opacity="0.6"/>
      <rect x="40" y="135" width="80" height="25" rx="6" fill="#10b981"/>

      <!-- Content Grid -->
      <rect x="20" y="200" width="110" height="80" rx="8" fill="#e5e7eb"/>
      <rect x="145" y="200" width="110" height="80" rx="8" fill="#e5e7eb"/>
      <rect x="270" y="200" width="110" height="80" rx="8" fill="#e5e7eb"/>

      <text x="200" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Classic</text>
    </svg>
  `,

  'starter-playful': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Header -->
      <rect x="0" y="0" width="400" height="60" fill="#ec4899"/>
      <circle cx="40" cy="30" r="15" fill="#fbbf24"/>
      <rect x="280" y="25" width="100" height="10" rx="2" fill="#fff" opacity="0.7"/>

      <!-- Hero with curves -->
      <path d="M0,60 Q100,80 200,60 T400,60 L400,180 L0,180 Z" fill="#f472b6"/>
      <rect x="40" y="90" width="200" height="20" rx="10" fill="#fff" opacity="0.9"/>
      <rect x="40" y="120" width="150" height="12" rx="6" fill="#fff" opacity="0.7"/>
      <rect x="40" y="145" width="90" height="30" rx="15" fill="#fbbf24"/>

      <!-- Fun cards -->
      <rect x="20" y="200" width="110" height="80" rx="12" fill="#fde047" opacity="0.8"/>
      <rect x="145" y="200" width="110" height="80" rx="12" fill="#a78bfa" opacity="0.8"/>
      <rect x="270" y="200" width="110" height="80" rx="12" fill="#34d399" opacity="0.8"/>

      <text x="200" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Playful</text>
    </svg>
  `,

  'starter-premium': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Elegant header -->
      <rect x="0" y="0" width="400" height="60" fill="#0f172a"/>
      <rect x="20" y="20" width="120" height="20" rx="2" fill="#fbbf24" opacity="0.9"/>
      <rect x="280" y="25" width="100" height="10" rx="2" fill="#fff" opacity="0.4"/>

      <!-- Premium hero -->
      <defs>
        <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#334155;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="0" y="60" width="400" height="120" fill="url(#premiumGrad)"/>
      <rect x="40" y="90" width="220" height="18" rx="4" fill="#fbbf24" opacity="0.9"/>
      <rect x="40" y="115" width="160" height="10" rx="2" fill="#fff" opacity="0.7"/>
      <rect x="40" y="140" width="100" height="28" rx="4" fill="#fbbf24"/>

      <!-- Luxury cards -->
      <rect x="20" y="200" width="110" height="80" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
      <rect x="145" y="200" width="110" height="80" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
      <rect x="270" y="200" width="110" height="80" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>

      <text x="200" y="20" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="bold">Premium</text>
    </svg>
  `,

  'pro-enterprise': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Corporate header -->
      <rect x="0" y="0" width="400" height="70" fill="#111827"/>
      <rect x="20" y="25" width="140" height="20" rx="2" fill="#3b82f6"/>
      <rect x="300" y="30" width="80" height="10" rx="2" fill="#9ca3af"/>

      <!-- Professional layout -->
      <rect x="0" y="70" width="250" height="110" fill="#1f2937"/>
      <rect x="250" y="70" width="150" height="110" fill="#374151"/>
      <rect x="20" y="90" width="200" height="15" rx="2" fill="#fff" opacity="0.9"/>
      <rect x="20" y="110" width="150" height="10" rx="2" fill="#9ca3af"/>

      <!-- Stats section -->
      <rect x="20" y="200" width="80" height="60" rx="4" fill="#1f2937"/>
      <rect x="115" y="200" width="80" height="60" rx="4" fill="#1f2937"/>
      <rect x="210" y="200" width="80" height="60" rx="4" fill="#1f2937"/>
      <rect x="305" y="200" width="80" height="60" rx="4" fill="#1f2937"/>

      <text x="200" y="20" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="bold">Enterprise</text>
    </svg>
  `,

  'pro-local-business': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Local business header -->
      <rect x="0" y="0" width="400" height="65" fill="#059669"/>
      <circle cx="40" cy="32" r="18" fill="#fff" opacity="0.9"/>
      <rect x="300" y="27" width="80" height="10" rx="2" fill="#fff" opacity="0.7"/>

      <!-- Trust-focused hero -->
      <rect x="0" y="65" width="400" height="105" fill="#10b981"/>
      <rect x="40" y="85" width="180" height="16" rx="4" fill="#fff" opacity="0.95"/>
      <rect x="40" y="106" width="220" height="11" rx="2" fill="#fff" opacity="0.8"/>
      <rect x="40" y="130" width="85" height="26" rx="6" fill="#fbbf24"/>

      <!-- Local features -->
      <rect x="30" y="190" width="160" height="90" rx="8" fill="#d1fae5"/>
      <rect x="210" y="190" width="160" height="90" rx="8" fill="#fed7aa"/>

      <text x="200" y="18" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Local Business</text>
    </svg>
  `,

  'pro-event-focused': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Event header -->
      <rect x="0" y="0" width="400" height="60" fill="#7c3aed"/>
      <rect x="20" y="20" width="110" height="20" rx="4" fill="#fff" opacity="0.3"/>
      <rect x="280" y="25" width="100" height="10" rx="2" fill="#fff" opacity="0.6"/>

      <!-- Event showcase -->
      <rect x="0" y="60" width="200" height="120" fill="#8b5cf6"/>
      <rect x="200" y="60" width="200" height="120" fill="#a78bfa"/>

      <!-- Event type cards -->
      <rect x="20" y="200" width="85" height="70" rx="8" fill="#fbbf24"/>
      <rect x="120" y="200" width="85" height="70" rx="8" fill="#f472b6"/>
      <rect x="220" y="200" width="85" height="70" rx="8" fill="#34d399"/>
      <rect x="320" y="200" width="60" height="70" rx="8" fill="#60a5fa"/>

      <text x="200" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Event Focused</text>
    </svg>
  `,

  'booking-focused': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Bold CTA header -->
      <rect x="0" y="0" width="400" height="60" fill="#dc2626"/>
      <rect x="20" y="20" width="100" height="20" rx="4" fill="#fff" opacity="0.3"/>
      <rect x="250" y="20" width="130" height="20" rx="10" fill="#fbbf24"/>

      <!-- Booking-centric hero -->
      <rect x="0" y="60" width="240" height="120" fill="#ef4444"/>
      <rect x="240" y="60" width="160" height="120" fill="#fff"/>
      <rect x="260" y="80" width="120" height="15" rx="4" fill="#dc2626"/>
      <rect x="260" y="100" width="120" height="15" rx="4" fill="#e5e7eb"/>
      <rect x="260" y="120" width="120" height="15" rx="4" fill="#e5e7eb"/>
      <rect x="260" y="145" width="120" height="28" rx="6" fill="#fbbf24"/>

      <!-- Quick booking cards -->
      <rect x="20" y="200" width="110" height="80" rx="8" fill="#fee2e2"/>
      <rect x="145" y="200" width="110" height="80" rx="8" fill="#fef3c7"/>
      <rect x="270" y="200" width="110" height="80" rx="8" fill="#d1fae5"/>

      <text x="200" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Booking Focused</text>
    </svg>
  `,

  'gallery-showcase': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Minimal header -->
      <rect x="0" y="0" width="400" height="50" fill="#f9fafb"/>
      <rect x="20" y="18" width="90" height="14" rx="2" fill="#374151"/>
      <rect x="320" y="20" width="60" height="10" rx="2" fill="#9ca3af"/>

      <!-- Large image hero -->
      <rect x="0" y="50" width="400" height="130" fill="#6366f1"/>
      <rect x="140" y="140" width="120" height="25" rx="12" fill="#fff" opacity="0.95"/>

      <!-- Gallery grid -->
      <rect x="10" y="195" width="90" height="90" rx="6" fill="#e0e7ff"/>
      <rect x="110" y="195" width="90" height="90" rx="6" fill="#ddd6fe"/>
      <rect x="210" y="195" width="90" height="90" rx="6" fill="#fae8ff"/>
      <rect x="310" y="195" width="80" height="90" rx="6" fill="#fce7f3"/>

      <text x="200" y="17" text-anchor="middle" fill="#374151" font-size="12" font-weight="bold">Gallery Showcase</text>
    </svg>
  `,

  'trust-builder': `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Trust header -->
      <rect x="0" y="0" width="400" height="60" fill="#0891b2"/>
      <circle cx="35" cy="30" r="16" fill="#fbbf24"/>
      <rect x="280" y="25" width="100" height="10" rx="2" fill="#fff" opacity="0.7"/>

      <!-- Social proof hero -->
      <rect x="0" y="60" width="400" height="100" fill="#06b6d4"/>
      <rect x="80" y="85" width="240" height="16" rx="4" fill="#fff" opacity="0.95"/>
      <circle cx="100" cy="120" r="8" fill="#fbbf24"/>
      <circle cx="120" cy="120" r="8" fill="#fbbf24"/>
      <circle cx="140" cy="120" r="8" fill="#fbbf24"/>
      <circle cx="160" cy="120" r="8" fill="#fbbf24"/>
      <circle cx="180" cy="120" r="8" fill="#fbbf24"/>

      <!-- Trust badges -->
      <rect x="30" y="180" width="70" height="100" rx="8" fill="#cffafe"/>
      <rect x="115" y="180" width="70" height="100" rx="8" fill="#fef3c7"/>
      <rect x="200" y="180" width="70" height="100" rx="8" fill="#d1fae5"/>
      <rect x="285" y="180" width="85" height="100" rx="8" fill="#fee2e2"/>

      <text x="200" y="20" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">Trust Builder</text>
    </svg>
  `
}

// Generate base64 thumbnails for template selection
export function getTemplateThumbnail(templateId: string): string {
  const svg = templatePreviews[templateId as keyof typeof templatePreviews]
  if (!svg) return ''

  // Convert SVG to base64 data URL
  const base64 = btoa(svg.trim())
  return `data:image/svg+xml;base64,${base64}`
}

export default templatePreviews
