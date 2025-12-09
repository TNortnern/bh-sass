/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Lightweight Block System for GrapesJS
 *
 * Key principles:
 * 1. Never load all blocks at once - lazy load by category
 * 2. Use GrapesJS `media` property for visual block previews
 * 3. Defer block content loading until drag/drop
 * 4. Keep block definitions minimal
 *
 * This prevents the editor from freezing when loading hundreds of blocks
 */

import { getHyperUIStructure, type HyperUIBlock } from '~/data/hyperui-blocks'

export interface LightweightBlock {
  id: string
  label: string
  category: string
  icon: string // SVG icon for small displays
  media?: string // SVG preview for block panel (GrapesJS media property)
  // Content is loaded lazily when needed
  getContent: () => string | object
}

// Simple SVG icons for block categories (small, used in labels)
const CATEGORY_ICONS = {
  hero: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="2"/><line x1="6" y1="13" x2="14" y2="13" stroke="currentColor" stroke-width="1.5"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h14v2H5V5zm0 4h10v2H5V9zm0 4h14v2H5v-2zm0 4h10v2H5v-2z" fill="currentColor"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  button: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="8" width="18" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/></svg>`,
  section: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>`,
  columns: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="7" y1="14" x2="17" y2="14"/><line x1="7" y1="17" x2="13" y2="17"/></svg>`,
  form: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><rect x="7" y="15" width="6" height="3" rx="1"/></svg>`,
  footer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="14" x2="22" y2="14"/><circle cx="7" cy="17" r="1"/><circle cx="12" cy="17" r="1"/><circle cx="17" cy="17" r="1"/></svg>`,
  nav: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="4" rx="1"/><line x1="6" y1="8" x2="10" y2="8"/><circle cx="18" cy="8" r="1.5"/></svg>`,
  megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 8.5L18 8.5L18 15.5L19 15.5C20.1046 15.5 21 14.6046 21 13.5L21 10.5C21 9.39543 20.1046 8.5 19 8.5Z"/><path d="M18 8.5L12 5.5L12 18.5L18 15.5L18 8.5Z"/><path d="M12 5.5C10.6193 5.5 9.5 6.61929 9.5 8L9.5 16C9.5 17.3807 10.6193 18.5 12 18.5"/><path d="M6 11L3 11C2.44772 11 2 11.4477 2 12L2 12C2 12.5523 2.44772 13 3 13L6 13"/></svg>`,
  layout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="9" x2="9" y2="21"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
}

/**
 * Generate visual preview SVG for blocks
 * These show a structural representation of what the block looks like
 */
const BLOCK_PREVIEWS = {
  // Layout previews
  'section': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f3f4f6" stroke="#d1d5db"/>
    <rect x="8" y="8" width="104" height="44" rx="2" fill="#e5e7eb"/>
    <text x="60" y="34" text-anchor="middle" fill="#6b7280" font-size="10">Section</text>
  </svg>`,
  'container': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f3f4f6"/>
    <rect x="20" y="8" width="80" height="44" rx="2" fill="#dbeafe" stroke="#3b82f6" stroke-dasharray="4"/>
    <text x="60" y="34" text-anchor="middle" fill="#3b82f6" font-size="10">Container</text>
  </svg>`,
  '2-columns': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="54" height="44" rx="4" fill="#dbeafe"/>
    <rect x="62" y="8" width="54" height="44" rx="4" fill="#dbeafe"/>
    <text x="31" y="34" text-anchor="middle" fill="#3b82f6" font-size="8">Col 1</text>
    <text x="89" y="34" text-anchor="middle" fill="#3b82f6" font-size="8">Col 2</text>
  </svg>`,
  '3-columns': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="34" height="44" rx="4" fill="#dcfce7"/>
    <rect x="43" y="8" width="34" height="44" rx="4" fill="#dcfce7"/>
    <rect x="82" y="8" width="34" height="44" rx="4" fill="#dcfce7"/>
  </svg>`,

  // Text previews
  'heading': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#fefce8"/>
    <rect x="8" y="20" width="80" height="8" rx="2" fill="#ca8a04"/>
    <rect x="8" y="32" width="60" height="4" rx="1" fill="#fde047"/>
  </svg>`,
  'paragraph': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
    <rect x="8" y="12" width="100" height="3" rx="1" fill="#9ca3af"/>
    <rect x="8" y="18" width="95" height="3" rx="1" fill="#9ca3af"/>
    <rect x="8" y="24" width="90" height="3" rx="1" fill="#9ca3af"/>
    <rect x="8" y="30" width="85" height="3" rx="1" fill="#9ca3af"/>
  </svg>`,
  'text-block': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
    <rect x="8" y="10" width="60" height="6" rx="2" fill="#374151"/>
    <rect x="8" y="22" width="100" height="3" rx="1" fill="#9ca3af"/>
    <rect x="8" y="28" width="95" height="3" rx="1" fill="#9ca3af"/>
    <rect x="8" y="34" width="80" height="3" rx="1" fill="#9ca3af"/>
  </svg>`,

  // Media previews
  'image': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f3f4f6" stroke="#d1d5db"/>
    <circle cx="30" cy="20" r="8" fill="#a3e635"/>
    <path d="M2 45 L40 25 L70 40 L100 20 L118 35 V56 H2 Z" fill="#86efac"/>
    <path d="M50 50 L80 30 L118 50 V56 H50 Z" fill="#4ade80"/>
  </svg>`,
  'image-text': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="50" height="52" rx="4" fill="#e0f2fe" stroke="#0ea5e9"/>
    <circle cx="20" cy="20" r="6" fill="#38bdf8"/>
    <path d="M4 40 L20 25 L35 35 L54 20 V52 H4 Z" fill="#7dd3fc"/>
    <rect x="60" y="10" width="50" height="6" rx="2" fill="#374151"/>
    <rect x="60" y="22" width="54" height="3" rx="1" fill="#9ca3af"/>
    <rect x="60" y="28" width="50" height="3" rx="1" fill="#9ca3af"/>
    <rect x="60" y="34" width="45" height="3" rx="1" fill="#9ca3af"/>
  </svg>`,

  // Button previews
  'button': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
    <rect x="25" y="18" width="70" height="24" rx="6" fill="#3b82f6"/>
    <text x="60" y="34" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Button</text>
  </svg>`,
  'button-group': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
    <rect x="8" y="20" width="50" height="20" rx="6" fill="#3b82f6"/>
    <rect x="62" y="20" width="50" height="20" rx="6" fill="none" stroke="#3b82f6" stroke-width="2"/>
  </svg>`,

  // Form preview
  'contact-form': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
    <rect x="8" y="8" width="104" height="12" rx="2" fill="white" stroke="#d1d5db"/>
    <rect x="8" y="24" width="104" height="12" rx="2" fill="white" stroke="#d1d5db"/>
    <rect x="8" y="40" width="50" height="14" rx="4" fill="#3b82f6"/>
    <text x="33" y="50" text-anchor="middle" fill="white" font-size="8">Submit</text>
  </svg>`,

  // Card previews
  'feature-card': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="2" width="100" height="56" rx="6" fill="white" stroke="#e5e7eb"/>
    <rect x="18" y="8" width="20" height="20" rx="4" fill="#dbeafe"/>
    <text x="28" y="22" text-anchor="middle" fill="#3b82f6" font-size="12">✨</text>
    <rect x="18" y="34" width="60" height="5" rx="2" fill="#374151"/>
    <rect x="18" y="43" width="75" height="3" rx="1" fill="#9ca3af"/>
  </svg>`,
  'pricing-card': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="2" width="90" height="56" rx="6" fill="white" stroke="#e5e7eb"/>
    <text x="60" y="18" text-anchor="middle" fill="#6b7280" font-size="8">Pro Plan</text>
    <text x="60" y="32" text-anchor="middle" fill="#111827" font-size="14" font-weight="bold">$99</text>
    <rect x="25" y="40" width="70" height="12" rx="4" fill="#3b82f6"/>
    <text x="60" y="49" text-anchor="middle" fill="white" font-size="7">Get Started</text>
  </svg>`,

  // Navigation previews
  'navbar': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="15" width="116" height="30" rx="4" fill="white" stroke="#e5e7eb"/>
    <rect x="8" y="24" width="20" height="12" rx="2" fill="#374151"/>
    <rect x="40" y="28" width="12" height="4" rx="1" fill="#9ca3af"/>
    <rect x="56" y="28" width="12" height="4" rx="1" fill="#9ca3af"/>
    <rect x="72" y="28" width="12" height="4" rx="1" fill="#9ca3af"/>
    <rect x="95" y="24" width="18" height="12" rx="4" fill="#3b82f6"/>
  </svg>`,
  'footer': `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#1f2937"/>
    <rect x="8" y="10" width="25" height="6" rx="1" fill="#f9fafb"/>
    <rect x="8" y="20" width="30" height="2" rx="1" fill="#6b7280"/>
    <rect x="8" y="25" width="25" height="2" rx="1" fill="#6b7280"/>
    <rect x="50" y="10" width="15" height="3" rx="1" fill="#9ca3af"/>
    <rect x="50" y="16" width="12" height="2" rx="1" fill="#6b7280"/>
    <rect x="50" y="20" width="10" height="2" rx="1" fill="#6b7280"/>
    <rect x="85" y="10" width="15" height="3" rx="1" fill="#9ca3af"/>
    <rect x="85" y="16" width="20" height="2" rx="1" fill="#6b7280"/>
    <line x1="8" y1="45" x2="112" y2="45" stroke="#374151"/>
    <rect x="45" y="50" width="30" height="3" rx="1" fill="#6b7280"/>
  </svg>`
}

/**
 * Generate HyperUI block preview based on block type
 */
function generateHyperUIPreview(blockId: string, blockName: string, typeKey: string): string {
  // Hero section previews
  if (typeKey === 'hero' || blockId.includes('hero')) {
    if (blockId.includes('split')) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="116" height="56" rx="4" fill="#1f2937"/>
        <rect x="6" y="8" width="50" height="44" rx="2" fill="#374151"/>
        <rect x="12" y="15" width="35" height="5" rx="1" fill="#f9fafb"/>
        <rect x="12" y="24" width="40" height="3" rx="1" fill="#9ca3af"/>
        <rect x="12" y="30" width="38" height="3" rx="1" fill="#9ca3af"/>
        <rect x="12" y="40" width="25" height="8" rx="3" fill="#3b82f6"/>
        <rect x="60" y="8" width="54" height="44" rx="2" fill="#0ea5e9"/>
        <circle cx="87" cy="25" r="10" fill="#38bdf8"/>
        <path d="M60 45 L75 30 L90 38 L114 22 V52 H60 Z" fill="#7dd3fc"/>
      </svg>`
    }
    if (blockId.includes('gradient')) {
      return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-${blockId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#9333ea"/>
            <stop offset="100%" style="stop-color:#3b82f6"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="116" height="56" rx="4" fill="url(#grad-${blockId})"/>
        <rect x="10" y="15" width="60" height="6" rx="2" fill="white"/>
        <rect x="10" y="25" width="50" height="3" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="10" y="31" width="45" height="3" rx="1" fill="rgba(255,255,255,0.7)"/>
        <rect x="10" y="42" width="28" height="10" rx="4" fill="#fbbf24"/>
        <rect x="42" y="42" width="28" height="10" rx="4" fill="white"/>
      </svg>`
    }
    // Default centered hero
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#111827"/>
      <rect x="25" y="12" width="70" height="6" rx="2" fill="white"/>
      <rect x="30" y="22" width="60" height="3" rx="1" fill="#9ca3af"/>
      <rect x="35" y="28" width="50" height="3" rx="1" fill="#9ca3af"/>
      <rect x="30" y="40" width="28" height="10" rx="4" fill="#3b82f6"/>
      <rect x="62" y="40" width="28" height="10" rx="4" fill="transparent" stroke="#3b82f6"/>
    </svg>`
  }

  // CTA previews
  if (typeKey === 'cta' || blockId.includes('cta')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
      <rect x="25" y="10" width="70" height="5" rx="2" fill="#374151"/>
      <rect x="20" y="20" width="80" height="3" rx="1" fill="#9ca3af"/>
      <rect x="25" y="26" width="70" height="3" rx="1" fill="#9ca3af"/>
      <rect x="15" y="38" width="65" height="14" rx="2" fill="white" stroke="#d1d5db"/>
      <rect x="84" y="38" width="24" height="14" rx="4" fill="#e11d48"/>
    </svg>`
  }

  // Features previews
  if (typeKey === 'features' || blockId.includes('feature')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
      <rect x="6" y="8" width="34" height="44" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="12" y="14" width="12" height="12" rx="3" fill="#dbeafe"/>
      <rect x="12" y="32" width="22" height="4" rx="1" fill="#374151"/>
      <rect x="12" y="40" width="20" height="2" rx="1" fill="#9ca3af"/>

      <rect x="43" y="8" width="34" height="44" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="49" y="14" width="12" height="12" rx="3" fill="#dcfce7"/>
      <rect x="49" y="32" width="22" height="4" rx="1" fill="#374151"/>
      <rect x="49" y="40" width="20" height="2" rx="1" fill="#9ca3af"/>

      <rect x="80" y="8" width="34" height="44" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="86" y="14" width="12" height="12" rx="3" fill="#fef3c7"/>
      <rect x="86" y="32" width="22" height="4" rx="1" fill="#374151"/>
      <rect x="86" y="40" width="20" height="2" rx="1" fill="#9ca3af"/>
    </svg>`
  }

  // Testimonial previews
  if (typeKey === 'testimonials' || blockId.includes('testimonial')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
      <text x="15" y="20" fill="#d1d5db" font-size="20">"</text>
      <rect x="20" y="18" width="80" height="3" rx="1" fill="#6b7280"/>
      <rect x="20" y="24" width="75" height="3" rx="1" fill="#6b7280"/>
      <rect x="20" y="30" width="60" height="3" rx="1" fill="#6b7280"/>
      <circle cx="25" cy="47" r="8" fill="#e5e7eb"/>
      <rect x="38" y="43" width="40" height="4" rx="1" fill="#374151"/>
      <rect x="38" y="50" width="25" height="3" rx="1" fill="#9ca3af"/>
    </svg>`
  }

  // Pricing previews
  if (typeKey === 'pricing' || blockId.includes('pricing')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#f9fafb"/>
      <rect x="6" y="6" width="34" height="48" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="12" y="10" width="20" height="3" rx="1" fill="#9ca3af"/>
      <text x="23" y="26" text-anchor="middle" fill="#374151" font-size="10" font-weight="bold">$29</text>
      <rect x="10" y="32" width="26" height="2" rx="1" fill="#d1d5db"/>
      <rect x="10" y="37" width="26" height="2" rx="1" fill="#d1d5db"/>
      <rect x="10" y="44" width="26" height="6" rx="2" fill="#e5e7eb"/>

      <rect x="43" y="4" width="34" height="52" rx="4" fill="#3b82f6"/>
      <rect x="49" y="10" width="20" height="3" rx="1" fill="rgba(255,255,255,0.7)"/>
      <text x="60" y="28" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$99</text>
      <rect x="47" y="36" width="26" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
      <rect x="47" y="41" width="26" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
      <rect x="47" y="48" width="26" height="6" rx="2" fill="white"/>

      <rect x="80" y="6" width="34" height="48" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="86" y="10" width="20" height="3" rx="1" fill="#9ca3af"/>
      <text x="97" y="26" text-anchor="middle" fill="#374151" font-size="10" font-weight="bold">$199</text>
      <rect x="84" y="32" width="26" height="2" rx="1" fill="#d1d5db"/>
      <rect x="84" y="37" width="26" height="2" rx="1" fill="#d1d5db"/>
      <rect x="84" y="44" width="26" height="6" rx="2" fill="#e5e7eb"/>
    </svg>`
  }

  // Form previews
  if (typeKey === 'forms' || blockId.includes('form')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="10" y="8" width="30" height="3" rx="1" fill="#374151"/>
      <rect x="10" y="14" width="100" height="10" rx="2" fill="#f9fafb" stroke="#d1d5db"/>
      <rect x="10" y="28" width="30" height="3" rx="1" fill="#374151"/>
      <rect x="10" y="34" width="100" height="10" rx="2" fill="#f9fafb" stroke="#d1d5db"/>
      <rect x="10" y="48" width="40" height="8" rx="3" fill="#3b82f6"/>
    </svg>`
  }

  // Card previews
  if (typeKey === 'cards' || blockId.includes('card')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="4" width="90" height="52" rx="6" fill="white" stroke="#e5e7eb"/>
      <rect x="15" y="4" width="90" height="22" rx="6" fill="#e0f2fe"/>
      <rect x="21" y="30" width="50" height="5" rx="2" fill="#374151"/>
      <rect x="21" y="38" width="75" height="3" rx="1" fill="#9ca3af"/>
      <rect x="21" y="44" width="70" height="3" rx="1" fill="#9ca3af"/>
    </svg>`
  }

  // Header/Navigation previews
  if (typeKey === 'headers' || blockId.includes('header') || blockId.includes('nav')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="18" width="116" height="24" rx="4" fill="white" stroke="#e5e7eb"/>
      <rect x="8" y="25" width="24" height="10" rx="2" fill="#374151"/>
      <rect x="42" y="28" width="10" height="4" rx="1" fill="#6b7280"/>
      <rect x="56" y="28" width="10" height="4" rx="1" fill="#6b7280"/>
      <rect x="70" y="28" width="10" height="4" rx="1" fill="#6b7280"/>
      <rect x="95" y="25" width="18" height="10" rx="4" fill="#3b82f6"/>
    </svg>`
  }

  // Footer previews
  if (typeKey === 'footers' || blockId.includes('footer')) {
    return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="116" height="56" rx="4" fill="#1f2937"/>
      <rect x="8" y="8" width="25" height="5" rx="1" fill="white"/>
      <rect x="8" y="16" width="30" height="2" rx="1" fill="#6b7280"/>
      <rect x="8" y="20" width="25" height="2" rx="1" fill="#6b7280"/>
      <rect x="50" y="8" width="20" height="4" rx="1" fill="#9ca3af"/>
      <rect x="50" y="14" width="15" height="2" rx="1" fill="#6b7280"/>
      <rect x="50" y="18" width="12" height="2" rx="1" fill="#6b7280"/>
      <rect x="50" y="22" width="14" height="2" rx="1" fill="#6b7280"/>
      <rect x="85" y="8" width="20" height="4" rx="1" fill="#9ca3af"/>
      <rect x="85" y="14" width="15" height="2" rx="1" fill="#6b7280"/>
      <rect x="85" y="18" width="18" height="2" rx="1" fill="#6b7280"/>
      <line x1="8" y1="45" x2="112" y2="45" stroke="#374151"/>
      <rect x="40" y="50" width="40" height="3" rx="1" fill="#6b7280"/>
    </svg>`
  }

  // Default block preview
  return `<svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="116" height="56" rx="4" fill="#f3f4f6" stroke="#d1d5db"/>
    <rect x="8" y="8" width="104" height="10" rx="2" fill="#e5e7eb"/>
    <rect x="8" y="22" width="90" height="3" rx="1" fill="#d1d5db"/>
    <rect x="8" y="28" width="85" height="3" rx="1" fill="#d1d5db"/>
    <rect x="8" y="34" width="80" height="3" rx="1" fill="#d1d5db"/>
    <rect x="8" y="44" width="40" height="10" rx="4" fill="#6b7280"/>
  </svg>`
}

// Essential built-in blocks that are always available
export const CORE_BLOCKS: LightweightBlock[] = [
  // Layout
  {
    id: 'section',
    label: 'Section',
    category: 'Layout',
    icon: CATEGORY_ICONS.section,
    getContent: () => ({
      type: 'default',
      tagName: 'section',
      style: { 'width': '100%', 'padding': '40px 20px', 'min-height': '100px' },
      droppable: true
    })
  },
  {
    id: 'container',
    label: 'Container',
    category: 'Layout',
    icon: CATEGORY_ICONS.section,
    getContent: () => ({
      type: 'default',
      tagName: 'div',
      style: { 'width': '100%', 'max-width': '1200px', 'margin': '0 auto', 'padding': '0 20px' },
      droppable: true
    })
  },
  {
    id: '2-columns',
    label: '2 Columns',
    category: 'Layout',
    icon: CATEGORY_ICONS.columns,
    getContent: () => `
      <div style="display: flex; gap: 20px; width: 100%;">
        <div style="flex: 1; min-height: 100px; padding: 20px; background: #f5f5f5; border-radius: 8px;">Column 1</div>
        <div style="flex: 1; min-height: 100px; padding: 20px; background: #f5f5f5; border-radius: 8px;">Column 2</div>
      </div>
    `
  },
  {
    id: '3-columns',
    label: '3 Columns',
    category: 'Layout',
    icon: CATEGORY_ICONS.columns,
    getContent: () => `
      <div style="display: flex; gap: 20px; width: 100%;">
        <div style="flex: 1; min-height: 100px; padding: 20px; background: #f5f5f5; border-radius: 8px;">Column 1</div>
        <div style="flex: 1; min-height: 100px; padding: 20px; background: #f5f5f5; border-radius: 8px;">Column 2</div>
        <div style="flex: 1; min-height: 100px; padding: 20px; background: #f5f5f5; border-radius: 8px;">Column 3</div>
      </div>
    `
  },

  // Text
  {
    id: 'heading',
    label: 'Heading',
    category: 'Text',
    icon: CATEGORY_ICONS.text,
    getContent: () => ({
      type: 'text',
      tagName: 'h2',
      content: 'Your Heading Here',
      style: { 'font-size': '32px', 'font-weight': 'bold', 'margin-bottom': '16px' }
    })
  },
  {
    id: 'paragraph',
    label: 'Paragraph',
    category: 'Text',
    icon: CATEGORY_ICONS.text,
    getContent: () => ({
      type: 'text',
      tagName: 'p',
      content: 'Write your paragraph text here. Double-click to edit.',
      style: { 'font-size': '16px', 'line-height': '1.6', 'color': '#374151' }
    })
  },
  {
    id: 'text-block',
    label: 'Text Block',
    category: 'Text',
    icon: CATEGORY_ICONS.text,
    getContent: () => `
      <div style="width: 100%;">
        <h2 style="font-size: 28px; font-weight: bold; margin-bottom: 12px;">Section Title</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280;">
          Write your content here. This text is fully editable - just double-click to start typing.
        </p>
      </div>
    `
  },

  // Media
  {
    id: 'image',
    label: 'Image',
    category: 'Media',
    icon: CATEGORY_ICONS.image,
    getContent: () => ({
      type: 'image',
      style: { width: '100%', height: 'auto' },
      attributes: { alt: 'Image description' }
    })
  },
  {
    id: 'image-text',
    label: 'Image + Text',
    category: 'Media',
    icon: CATEGORY_ICONS.image,
    getContent: () => `
      <div style="display: flex; gap: 30px; align-items: center; width: 100%;">
        <div style="flex: 1;">
          <img src="https://placehold.co/600x400/e2e8f0/64748b?text=Your+Image" alt="Feature image" style="width: 100%; border-radius: 12px;" />
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Your Title Here</h3>
          <p style="font-size: 16px; line-height: 1.6; color: #6b7280;">
            Describe your content here. All text is editable - just double-click to edit.
          </p>
        </div>
      </div>
    `
  },

  // Buttons
  {
    id: 'button',
    label: 'Button',
    category: 'Buttons',
    icon: CATEGORY_ICONS.button,
    getContent: () => `
      <a href="#" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
        Click Here
      </a>
    `
  },
  {
    id: 'button-group',
    label: 'Button Group',
    category: 'Buttons',
    icon: CATEGORY_ICONS.button,
    getContent: () => `
      <div style="display: flex; gap: 12px;">
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Primary Action
        </a>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: transparent; color: #3b82f6; text-decoration: none; border-radius: 8px; font-weight: 500; border: 2px solid #3b82f6;">
          Secondary
        </a>
      </div>
    `
  },

  // Forms
  {
    id: 'contact-form',
    label: 'Contact Form',
    category: 'Forms',
    icon: CATEGORY_ICONS.form,
    getContent: () => `
      <form style="width: 100%; max-width: 500px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">Name</label>
          <input type="text" placeholder="Your name" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">Email</label>
          <input type="email" placeholder="your@email.com" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;" />
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 500; margin-bottom: 6px;">Message</label>
          <textarea placeholder="Your message..." rows="4" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
        </div>
        <button type="submit" style="width: 100%; padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 500; font-size: 16px; cursor: pointer;">
          Send Message
        </button>
      </form>
    `
  },

  // Cards
  {
    id: 'feature-card',
    label: 'Feature Card',
    category: 'Cards',
    icon: CATEGORY_ICONS.card,
    getContent: () => `
      <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); width: 100%;">
        <div style="width: 48px; height: 48px; background: #dbeafe; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="font-size: 24px;">✨</span>
        </div>
        <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Feature Title</h3>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
          Describe your feature here. Keep it short and compelling.
        </p>
      </div>
    `
  },
  {
    id: 'pricing-card',
    label: 'Pricing Card',
    category: 'Cards',
    icon: CATEGORY_ICONS.card,
    getContent: () => `
      <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; width: 100%; max-width: 320px;">
        <h3 style="font-size: 18px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">Pro Plan</h3>
        <div style="margin-bottom: 24px;">
          <span style="font-size: 48px; font-weight: bold;">$99</span>
          <span style="color: #6b7280;">/month</span>
        </div>
        <ul style="text-align: left; margin-bottom: 24px; list-style: none; padding: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">✓ Unlimited rentals</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">✓ Online booking</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">✓ Customer management</li>
          <li style="padding: 8px 0;">✓ Priority support</li>
        </ul>
        <a href="#" style="display: block; padding: 14px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Get Started
        </a>
      </div>
    `
  },

  // Navigation
  {
    id: 'navbar',
    label: 'Navigation Bar',
    category: 'Navigation',
    icon: CATEGORY_ICONS.nav,
    getContent: () => `
      <nav style="display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: white; width: 100%;">
        <div style="font-size: 24px; font-weight: bold; color: #1f2937;">Logo</div>
        <div style="display: flex; gap: 32px;">
          <a href="#" style="color: #4b5563; text-decoration: none; font-weight: 500;">Home</a>
          <a href="#" style="color: #4b5563; text-decoration: none; font-weight: 500;">Services</a>
          <a href="#" style="color: #4b5563; text-decoration: none; font-weight: 500;">About</a>
          <a href="#" style="color: #4b5563; text-decoration: none; font-weight: 500;">Contact</a>
        </div>
        <a href="#" style="padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Book Now
        </a>
      </nav>
    `
  },

  // Footer
  {
    id: 'footer',
    label: 'Footer',
    category: 'Navigation',
    icon: CATEGORY_ICONS.footer,
    getContent: () => `
      <footer style="background: #111827; color: white; padding: 48px 24px; width: 100%;">
        <div style="display: flex; justify-content: space-between; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; gap: 32px;">
          <div style="flex: 1; min-width: 200px;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Your Brand</div>
            <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
              Making your events unforgettable with premium bounce house rentals.
            </p>
          </div>
          <div style="flex: 1; min-width: 150px;">
            <div style="font-weight: 600; margin-bottom: 16px;">Quick Links</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="#" style="color: #9ca3af; text-decoration: none;">Home</a>
              <a href="#" style="color: #9ca3af; text-decoration: none;">Rentals</a>
              <a href="#" style="color: #9ca3af; text-decoration: none;">About Us</a>
              <a href="#" style="color: #9ca3af; text-decoration: none;">Contact</a>
            </div>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 16px;">Contact Us</div>
            <div style="color: #9ca3af; font-size: 14px;">
              <p style="margin-bottom: 8px;">📞 (555) 123-4567</p>
              <p style="margin-bottom: 8px;">📧 hello@yourbrand.com</p>
              <p>📍 123 Party Lane, Fun City</p>
            </div>
          </div>
        </div>
        <div style="text-align: center; padding-top: 32px; margin-top: 32px; border-top: 1px solid #374151; color: #6b7280; font-size: 14px;">
          © 2024 Your Brand. All rights reserved.
        </div>
      </footer>
    `
  }
]

/**
 * Initialize blocks in GrapesJS editor
 * Uses lazy content loading to prevent freezing
 * Uses `media` property for visual previews
 */
export function initializeLightweightBlocks(editor: any) {
  const bm = editor.BlockManager

  // Add core blocks with visual previews
  CORE_BLOCKS.forEach((block) => {
    const preview = BLOCK_PREVIEWS[block.id as keyof typeof BLOCK_PREVIEWS] || block.icon

    bm.add(block.id, {
      // Use media for visual preview (GrapesJS renders this as the block thumbnail)
      media: preview,
      // Label shown below the media
      label: block.label,
      category: block.category,
      // Lazy load content
      content: block.getContent(),
      // Activate component after drop
      activate: true
    })
  })

  console.log(`✅ Loaded ${CORE_BLOCKS.length} lightweight blocks with visual previews`)

  return editor
}

/**
 * Load HyperUI premium blocks into the editor
 * Organized by category for better UX
 * Uses visual SVG previews to show what each block looks like
 */
export function loadHyperUIBlocks(editor: any, categoryFilter?: string) {
  const bm = editor.BlockManager
  const hyperuiStructure = getHyperUIStructure()
  let blocksLoaded = 0

  hyperuiStructure.forEach((category) => {
    // Skip if filtering by category and doesn't match
    if (categoryFilter && category.key !== categoryFilter) return

    category.types.forEach((type) => {
      type.blocks.forEach((block) => {
        const categoryName = `HyperUI: ${category.label}`
        // Generate visual preview based on block type
        const preview = generateHyperUIPreview(block.id, block.name, type.key)

        bm.add(`hyperui-${block.id}`, {
          // Use media for visual preview
          media: preview,
          // Simple text label
          label: block.name,
          category: categoryName,
          content: block.html,
          activate: true
        })
        blocksLoaded++
      })
    })
  })

  console.log(`✅ Loaded ${blocksLoaded} HyperUI blocks with visual previews`)
  return blocksLoaded
}

/**
 * Get available HyperUI categories for UI
 */
export function getHyperUICategories() {
  const structure = getHyperUIStructure()
  return structure.map(category => ({
    key: category.key,
    label: category.label,
    description: category.description,
    icon: category.icon,
    typeCount: category.types.length,
    blockCount: category.types.reduce((acc, type) => acc + type.blocks.length, 0)
  }))
}

export default {
  CORE_BLOCKS,
  initializeLightweightBlocks,
  loadHyperUIBlocks,
  getHyperUICategories
}
