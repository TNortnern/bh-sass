import type { WebsiteTemplate } from '../types'
import { homePage } from './pages/home'
import { inventoryPage } from './pages/inventory'
import { aboutPage } from './pages/about'
import { contactPage } from './pages/contact'
import { bookingPage } from './pages/booking'
import { termsPage } from './pages/terms'
import { waiverPage } from './pages/waiver'

export const carnivalTemplate: WebsiteTemplate = {
  id: 'carnival',
  name: 'Carnival',
  description: 'Colorful, family-friendly template with sky blue backgrounds and bright red accents. Perfect for traditional bounce house rental companies.',
  preview: '/templates/carnival-preview.jpg',
  category: 'traditional',
  colors: {
    primary: '#87CEEB', // Sky blue
    secondary: '#E53935', // Bright red
    accent: '#FFD54F', // Yellow
    background: '#FFFFFF',
    text: '#1F2937'
  },
  fonts: {
    heading: 'Baloo 2',
    body: 'Nunito'
  },
  fontLinks: [
    'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap'
  ],
  pages: [
    homePage,
    inventoryPage,
    aboutPage,
    contactPage,
    bookingPage,
    termsPage,
    waiverPage
  ],
  globalCss: `
    /* Carnival Template Global Styles */
    :root {
      --carnival-sky-blue: #87CEEB;
      --carnival-red: #E53935;
      --carnival-yellow: #FFD54F;
      --carnival-sky-dark: #0C4A6E;
    }

    body {
      font-family: 'Nunito', sans-serif;
      color: #1F2937;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Baloo 2', cursive;
      font-weight: 700;
    }

    /* Carnival Button Styles */
    .btn-carnival {
      background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
      color: white;
      padding: 0.875rem 2rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 1.125rem;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(229, 57, 53, 0.3);
    }

    .btn-carnival:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(229, 57, 53, 0.4);
    }

    /* Carnival Sky Background */
    .carnival-sky-bg {
      background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 100%);
    }

    /* Carnival Card */
    .carnival-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .carnival-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    /* Carnival Section */
    .carnival-section {
      padding: 4rem 1rem;
    }

    /* Festive Decorations */
    .festive-dots {
      background-image: radial-gradient(circle, #FFD54F 10%, transparent 10%);
      background-size: 30px 30px;
      opacity: 0.1;
    }

    /* Balloon Animation */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .balloon-float {
      animation: float 3s ease-in-out infinite;
    }

    /* Responsive Typography */
    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.5rem; }
      .carnival-section { padding: 2rem 1rem; }
    }
  `,
  navigation: {
    logo: '🎪 PartyTime',
    links: [
      { text: 'Home', href: '/' },
      { text: 'Rentals', href: '/inventory' },
      { text: 'About', href: '/about' },
      { text: 'Contact', href: '/contact' }
    ],
    ctaButton: {
      text: 'Book Now',
      href: '/booking'
    }
  },
  footer: {
    columns: [
      {
        title: '🎪 PartyTime',
        content: 'Making celebrations unforgettable since 2010.'
      },
      {
        title: 'Quick Links',
        links: [
          { text: 'Home', href: '/' },
          { text: 'Rentals', href: '/inventory' },
          { text: 'About', href: '/about' },
          { text: 'Contact', href: '/contact' }
        ]
      },
      {
        title: 'Services',
        links: [
          { text: 'Bounce Houses', href: '/inventory?cat=bounce' },
          { text: 'Water Slides', href: '/inventory?cat=water' },
          { text: 'Combos', href: '/inventory?cat=combo' },
          { text: 'Party Extras', href: '/inventory?cat=extras' }
        ]
      },
      {
        title: 'Contact',
        content: '📞 (555) 123-4567\n✉️ info@partytime.com\n📍 123 Fun Street'
      }
    ],
    copyright: '© 2024 PartyTime Rentals. All rights reserved.'
  }
}

export default carnivalTemplate
