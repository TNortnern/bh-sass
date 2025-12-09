import type { TemplateDefinition } from '../types'
import homePage from './pages/home'
import inventoryPage from './pages/inventory'
import aboutPage from './pages/about'
import contactPage from './pages/contact'
import bookingPage from './pages/booking'
import termsPage from './pages/terms'
import waiverPage from './pages/waiver'

/**
 * Minimal Template
 *
 * Ultra-clean Swiss-style design with confident neutrals and bold typography.
 * Perfect for professional, modern rental businesses.
 *
 * Design characteristics:
 * - Clean black and white color scheme with neutral grays
 * - Bold, confident typography with strong hierarchy
 * - Generous whitespace and grid-based layouts
 * - Minimal decorative elements - content speaks for itself
 * - Square/rectangular shapes with sharp corners
 * - High contrast for readability
 */
const minimalTemplate: TemplateDefinition = {
  id: 'minimal',
  name: 'Minimal',
  codename: 'minimal',
  description: 'Ultra-clean Swiss design with confident neutrals. Perfect for modern, professional businesses.',
  thumbnail: '/templates/minimal-thumb.jpg',
  targetAudience: 'Modern professional businesses',
  visualStyle: 'Ultra-clean Swiss design with confident neutrals',
  smartBlocks: [],
  supportedThemes: [],

  // Theme configuration
  defaultTheme: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal aesthetic',
    colors: {
      primary: '#171717', // neutral-900
      secondary: '#525252', // neutral-600
      accent: '#171717', // neutral-900 (accent is same as primary)
      background: '#ffffff', // white
      surface: '#fafafa', // neutral-50
      surfaceAlt: '#f5f5f5',
      text: '#171717', // neutral-900
      textMuted: '#737373', // neutral-500
      textOnPrimary: '#ffffff',
      border: '#e5e5e5',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      mono: 'monospace'
    },
    spacing: {
      section: 'py-24',
      container: 'max-w-7xl',
      gap: 'gap-4'
    },
    borderRadius: 'none',
    shadows: false
  },

  // Global CSS for Minimal template
  globalCss: `
    /* Minimal Template Global Styles */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    @media (min-width: 1024px) {
      .container {
        padding: 0 2rem;
      }
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #171717;
      background-color: #ffffff;
    }

    /* Links */
    a {
      transition: all 0.2s ease;
    }

    /* Buttons and interactive elements */
    button, .btn {
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    /* Grid pattern background (optional) */
    .grid-pattern {
      background-image:
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* Clean image placeholders */
    .image-placeholder {
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Accent line */
    .accent-line {
      width: 2rem;
      height: 1px;
      background-color: #171717;
    }

    /* Sharp borders */
    .sharp-border {
      border-radius: 0;
    }
  `,

  // Template pages
  pages: [
    homePage,
    inventoryPage,
    aboutPage,
    contactPage,
    bookingPage,
    termsPage,
    waiverPage
  ]
}

export default minimalTemplate
