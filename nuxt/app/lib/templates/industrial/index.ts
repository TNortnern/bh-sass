import type { WebsiteTemplate } from '../types'
import { homePage } from './pages/home'
import { inventoryPage } from './pages/inventory'
import { aboutPage } from './pages/about'
import { contactPage } from './pages/contact'
import { bookingPage } from './pages/booking'
import { termsPage } from './pages/terms'
import { waiverPage } from './pages/waiver'

export const industrialTemplate: WebsiteTemplate = {
  id: 'industrial',
  name: 'Industrial',
  description: 'Professional equipment rental theme with industrial aesthetic. Perfect for established rental businesses.',
  category: 'professional',
  thumbnail: '/templates/industrial-thumb.jpg',

  colors: {
    primary: '#F59E0B', // Orange
    secondary: '#1E293B', // Dark Slate
    accent: '#64748B', // Gray
    background: '#FFFFFF',
    text: '#1F2937'
  },

  fonts: {
    heading: 'Montserrat',
    body: 'Open Sans'
  },

  fontLinks: [
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;600&display=swap'
  ],

  globalCss: `
    /* Industrial Theme Global Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Open Sans', sans-serif;
      line-height: 1.6;
      color: #1F2937;
      background: #FFFFFF;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      line-height: 1.2;
      color: #1E293B;
    }

    h1 { font-size: 3rem; }
    h2 { font-size: 2.25rem; }
    h3 { font-size: 1.875rem; }
    h4 { font-size: 1.5rem; }
    h5 { font-size: 1.25rem; }
    h6 { font-size: 1rem; }

    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.5rem; }
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .section {
      padding: 5rem 0;
    }

    @media (max-width: 768px) {
      .section {
        padding: 3rem 0;
      }
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.875rem 2rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-align: center;
    }

    .btn-primary {
      background: #F59E0B;
      color: white;
    }

    .btn-primary:hover {
      background: #D97706;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .btn-secondary {
      background: #1E293B;
      color: white;
    }

    .btn-secondary:hover {
      background: #334155;
    }

    .btn-outline {
      background: transparent;
      color: #F59E0B;
      border: 2px solid #F59E0B;
    }

    .btn-outline:hover {
      background: #F59E0B;
      color: white;
    }

    /* Cards */
    .card {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .card:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }

    /* Grid Layouts */
    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }

    @media (max-width: 1024px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
      }
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.25rem;
      background: #F59E0B;
      color: white;
    }

    .badge-outline {
      background: transparent;
      border: 2px solid #F59E0B;
      color: #F59E0B;
    }

    /* Forms */
    input, textarea, select {
      width: 100%;
      padding: 0.875rem 1rem;
      font-family: 'Open Sans', sans-serif;
      font-size: 1rem;
      border: 2px solid #E5E7EB;
      border-radius: 0.25rem;
      transition: border-color 0.3s ease;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #F59E0B;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1E293B;
    }

    /* Utility Classes */
    .text-center { text-align: center; }
    .text-primary { color: #F59E0B; }
    .text-secondary { color: #1E293B; }
    .text-muted { color: #6B7280; }

    .bg-primary { background: #F59E0B; }
    .bg-secondary { background: #1E293B; }
    .bg-light { background: #F9FAFB; }
    .bg-white { background: white; }

    .mb-1 { margin-bottom: 0.5rem; }
    .mb-2 { margin-bottom: 1rem; }
    .mb-3 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 2rem; }
    .mb-5 { margin-bottom: 3rem; }

    .mt-1 { margin-top: 0.5rem; }
    .mt-2 { margin-top: 1rem; }
    .mt-3 { margin-top: 1.5rem; }
    .mt-4 { margin-top: 2rem; }
    .mt-5 { margin-top: 3rem; }
  `,

  navigation: {
    logo: 'INDUSTRIAL',
    links: [
      { text: 'Home', href: '/' },
      { text: 'Equipment', href: '/inventory' },
      { text: 'About', href: '/about' },
      { text: 'Contact', href: '/contact' }
    ],
    ctaButton: {
      text: 'Get Quote',
      href: '/booking'
    }
  },

  pages: [
    homePage,
    inventoryPage,
    aboutPage,
    contactPage,
    bookingPage,
    termsPage,
    waiverPage
  ],

  footer: {
    columns: [
      {
        title: 'Navigation',
        links: [
          { text: 'Home', href: '/' },
          { text: 'Equipment', href: '/inventory' },
          { text: 'About', href: '/about' },
          { text: 'Contact', href: '/contact' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { text: 'Terms & Conditions', href: '/terms' },
          { text: 'Liability Waiver', href: '/waiver' }
        ]
      }
    ]
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

// Unused features
// const _unused_features = {
//     multiPage: true,
//     responsive: true,
//     darkMode: false,
//     animations: true,
//     seo: true
// }
