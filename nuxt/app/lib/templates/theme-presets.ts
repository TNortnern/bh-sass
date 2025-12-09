/**
 * Theme Presets for Website Builder Templates
 *
 * Each preset defines the complete visual language for a template,
 * including colors, fonts, spacing, and border radius.
 *
 * Design Principle: These are NOT generic Tailwind defaults.
 * Each theme has personality and purpose.
 */

import type { ThemePreset } from './types'

// ============================================================================
// STARTER THEME - Modern Minimal
// Clean, Swiss design with confident neutrals and a pop of color
// ============================================================================

export const starterTheme: ThemePreset = {
  id: 'starter',
  name: 'Modern Minimal',
  description: 'Clean Swiss design with confident neutrals',
  colors: {
    primary: '#0f172a', // Slate 900 - confident, modern
    secondary: '#3b82f6', // Blue 500 - trustworthy accent
    accent: '#f97316', // Orange 500 - energetic CTA
    background: '#ffffff',
    surface: '#f8fafc', // Slate 50
    surfaceAlt: '#f1f5f9', // Slate 100
    text: '#0f172a', // Slate 900
    textMuted: '#64748b', // Slate 500
    textOnPrimary: '#ffffff',
    border: '#e2e8f0', // Slate 200
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  fonts: {
    heading: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace'
  },
  spacing: {
    section: 'py-24 lg:py-32',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    gap: 'gap-8'
  },
  borderRadius: 'lg',
  shadows: true
}

// ============================================================================
// BOUNCE THEME - Playful Party
// Vibrant, fun, kid-friendly with bouncy energy
// ============================================================================

export const bounceTheme: ThemePreset = {
  id: 'bounce',
  name: 'Playful Party',
  description: 'Vibrant and fun for kids parties',
  colors: {
    primary: '#8b5cf6', // Violet 500 - playful purple
    secondary: '#06b6d4', // Cyan 500 - pool party blue
    accent: '#f43f5e', // Rose 500 - party pink
    background: '#fefce8', // Yellow 50 - sunny warm
    surface: '#ffffff',
    surfaceAlt: '#fef9c3', // Yellow 100
    text: '#1e1b4b', // Indigo 950
    textMuted: '#6366f1', // Indigo 500
    textOnPrimary: '#ffffff',
    border: '#c4b5fd', // Violet 300
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f43f5e'
  },
  fonts: {
    heading: '"Nunito", "Comic Sans MS", cursive, sans-serif',
    body: '"Nunito", system-ui, sans-serif',
    mono: '"Fira Code", monospace'
  },
  spacing: {
    section: 'py-20 lg:py-28',
    container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    gap: 'gap-6'
  },
  borderRadius: 'full',
  shadows: true
}

// ============================================================================
// LUXE THEME - Elegant Premium
// Sophisticated, high-end feel for weddings and corporate events
// ============================================================================

export const luxeTheme: ThemePreset = {
  id: 'luxe',
  name: 'Elegant Premium',
  description: 'Sophisticated design for high-end events',
  colors: {
    primary: '#1c1917', // Stone 900 - deep charcoal
    secondary: '#a16207', // Yellow 700 - antique gold
    accent: '#b45309', // Amber 700 - rich copper
    background: '#fafaf9', // Stone 50 - warm white
    surface: '#ffffff',
    surfaceAlt: '#f5f5f4', // Stone 100
    text: '#1c1917', // Stone 900
    textMuted: '#78716c', // Stone 500
    textOnPrimary: '#fef3c7', // Amber 100 - cream
    border: '#d6d3d1', // Stone 300
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c'
  },
  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Lato", system-ui, sans-serif',
    mono: '"Courier New", monospace'
  },
  spacing: {
    section: 'py-28 lg:py-36',
    container: 'max-w-6xl mx-auto px-6 sm:px-8 lg:px-12',
    gap: 'gap-10'
  },
  borderRadius: 'sm',
  shadows: false
}

// ============================================================================
// ENERGY THEME - Bold Vibrant
// High-energy, dynamic feel for sports and active events
// ============================================================================

export const energyTheme: ThemePreset = {
  id: 'energy',
  name: 'Bold Vibrant',
  description: 'High-energy design for active events',
  colors: {
    primary: '#0c0a09', // Stone 950 - pure black
    secondary: '#2563eb', // Blue 600 - electric blue
    accent: '#ea580c', // Orange 600 - blaze orange
    background: '#0c0a09', // Stone 950 - dark mode
    surface: '#1c1917', // Stone 900
    surfaceAlt: '#292524', // Stone 800
    text: '#fafaf9', // Stone 50
    textMuted: '#a8a29e', // Stone 400
    textOnPrimary: '#ffffff',
    border: '#44403c', // Stone 700
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#dc2626'
  },
  fonts: {
    heading: '"Montserrat", "Impact", sans-serif',
    body: '"Montserrat", system-ui, sans-serif',
    mono: '"Source Code Pro", monospace'
  },
  spacing: {
    section: 'py-20 lg:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    gap: 'gap-6'
  },
  borderRadius: 'none',
  shadows: true
}

// ============================================================================
// TRUST THEME - Clean Professional
// Corporate, trustworthy, structured for schools and businesses
// ============================================================================

export const trustTheme: ThemePreset = {
  id: 'trust',
  name: 'Clean Professional',
  description: 'Professional design for corporate clients',
  colors: {
    primary: '#1e3a5f', // Custom navy
    secondary: '#0284c7', // Sky 600
    accent: '#0891b2', // Cyan 600
    background: '#ffffff',
    surface: '#f0f9ff', // Sky 50
    surfaceAlt: '#e0f2fe', // Sky 100
    text: '#0c4a6e', // Sky 900
    textMuted: '#64748b', // Slate 500
    textOnPrimary: '#ffffff',
    border: '#bae6fd', // Sky 200
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626'
  },
  fonts: {
    heading: '"Source Sans Pro", "Helvetica Neue", sans-serif',
    body: '"Source Sans Pro", system-ui, sans-serif',
    mono: '"IBM Plex Mono", monospace'
  },
  spacing: {
    section: 'py-16 lg:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    gap: 'gap-8'
  },
  borderRadius: 'md',
  shadows: true
}

// ============================================================================
// THEME REGISTRY
// ============================================================================

export const themePresets: Record<string, ThemePreset> = {
  starter: starterTheme,
  bounce: bounceTheme,
  luxe: luxeTheme,
  energy: energyTheme,
  trust: trustTheme
}

export const getTheme = (id: string): ThemePreset => {
  return themePresets[id] || starterTheme
}

export const getAllThemes = (): ThemePreset[] => {
  return Object.values(themePresets)
}

// ============================================================================
// CSS VARIABLE GENERATOR
// Converts a theme to CSS custom properties for use in templates
// ============================================================================

export const generateThemeCssVars = (theme: ThemePreset): string => {
  const borderRadiusMap: Record<string, string> = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  }

  return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-surface-alt: ${theme.colors.surfaceAlt};
  --color-text: ${theme.colors.text};
  --color-text-muted: ${theme.colors.textMuted};
  --color-text-on-primary: ${theme.colors.textOnPrimary};
  --color-border: ${theme.colors.border};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};

  /* Fonts */
  --font-heading: ${theme.fonts.heading};
  --font-body: ${theme.fonts.body};
  --font-mono: ${theme.fonts.mono};

  /* Border Radius */
  --radius: ${borderRadiusMap[theme.borderRadius]};
  --radius-sm: calc(var(--radius) * 0.5);
  --radius-lg: calc(var(--radius) * 1.5);
  --radius-xl: calc(var(--radius) * 2);

  /* Shadows */
  --shadow-sm: ${theme.shadows ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none'};
  --shadow: ${theme.shadows ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : 'none'};
  --shadow-md: ${theme.shadows ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'};
  --shadow-lg: ${theme.shadows ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 'none'};
  --shadow-xl: ${theme.shadows ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none'};
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

code, pre {
  font-family: var(--font-mono);
}
`.trim()
}

// ============================================================================
// GOOGLE FONTS LOADER
// Generates the Google Fonts URL for a theme
// ============================================================================

export const getGoogleFontsUrl = (theme: ThemePreset): string => {
  const fontMap: Record<string, string> = {
    '"Inter"': 'Inter:wght@300;400;500;600;700;800',
    '"Nunito"': 'Nunito:wght@300;400;600;700;800',
    '"Playfair Display"': 'Playfair+Display:wght@400;500;600;700',
    '"Lato"': 'Lato:wght@300;400;700',
    '"Montserrat"': 'Montserrat:wght@400;500;600;700;800;900',
    '"Source Sans Pro"': 'Source+Sans+Pro:wght@300;400;600;700',
    '"JetBrains Mono"': 'JetBrains+Mono:wght@400;500',
    '"Fira Code"': 'Fira+Code:wght@400;500',
    '"Source Code Pro"': 'Source+Code+Pro:wght@400;500',
    '"IBM Plex Mono"': 'IBM+Plex+Mono:wght@400;500'
  }

  const fonts: string[] = []

  // Extract font family names and map to Google Fonts format
  const headingFont = theme.fonts.heading.split(',')[0]?.trim() || ''
  const bodyFont = theme.fonts.body.split(',')[0]?.trim() || ''
  const monoFont = theme.fonts.mono.split(',')[0]?.trim() || ''

  if (headingFont && fontMap[headingFont]) fonts.push(fontMap[headingFont])
  if (bodyFont && fontMap[bodyFont] && bodyFont !== headingFont) fonts.push(fontMap[bodyFont])
  if (monoFont && fontMap[monoFont]) fonts.push(fontMap[monoFont])

  if (fonts.length === 0) return ''

  return `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f}`).join('&')}&display=swap`
}
