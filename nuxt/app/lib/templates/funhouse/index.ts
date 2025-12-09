import { homePage } from './pages/home'
import { inventoryPage } from './pages/inventory'
import { aboutPage } from './pages/about'
import { contactPage } from './pages/contact'
import { bookingPage } from './pages/booking'
import { termsPage } from './pages/terms'
import { waiverPage } from './pages/waiver'

export default {
  id: 'funhouse',
  name: 'Funhouse',
  description: 'Playful and energetic template with bold red, purple, and orange colors. Chunky typography and amusement park vibe - perfect for family-friendly bounce house rentals.',
  preview: '/templates/funhouse-preview.jpg',
  category: 'playful',
  colors: {
    primary: '#FF0024', // Bold red
    secondary: '#520088', // Deep purple
    accent: '#FF5B07', // Vibrant orange
    background: '#FFFFFF',
    text: '#262C5D' // Dark blue-gray
  },
  fonts: {
    heading: 'Grandstander',
    body: 'DM Sans'
  },
  fontLinks: [
    'https://fonts.googleapis.com/css2?family=Grandstander:wght@700;800;900&display=swap',
    'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap'
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
    /* Funhouse Global Styles - Playful & Energetic */

    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Grandstander:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      color: #262C5D;
      line-height: 1.7;
      overflow-x: hidden;
    }

    /* Chunky Playful Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Grandstander', cursive;
      font-weight: 900;
      line-height: 1.2;
      color: #262C5D;
    }

    h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      letter-spacing: -0.02em;
    }

    h2 {
      font-size: clamp(2rem, 4vw, 3.5rem);
    }

    h3 {
      font-size: clamp(1.5rem, 3vw, 2.5rem);
    }

    /* Playful Utilities */
    .funhouse-gradient-text {
      background: linear-gradient(135deg, #FF0024, #520088, #FF5B07);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .funhouse-gradient-bg {
      background: linear-gradient(135deg, #520088, #FF0024, #FF5B07);
    }

    .funhouse-gradient-red {
      background: linear-gradient(135deg, #FF0024, #FF5B07);
    }

    .funhouse-gradient-purple {
      background: linear-gradient(135deg, #520088, #FF0024);
    }

    /* Bouncy Button */
    .funhouse-btn {
      display: inline-block;
      padding: 1rem 2.5rem;
      font-family: 'Grandstander', cursive;
      font-weight: 800;
      font-size: 1.25rem;
      text-decoration: none;
      border-radius: 9999px;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      box-shadow: 0 10px 30px rgba(255, 0, 36, 0.3);
      position: relative;
      overflow: hidden;
    }

    .funhouse-btn:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 15px 40px rgba(255, 0, 36, 0.4);
    }

    .funhouse-btn:active {
      transform: translateY(-2px) scale(1.02);
    }

    .funhouse-btn-primary {
      background: linear-gradient(135deg, #FF0024, #FF5B07);
      color: white;
    }

    .funhouse-btn-secondary {
      background: linear-gradient(135deg, #520088, #FF0024);
      color: white;
    }

    /* Playful Cards */
    .funhouse-card {
      background: white;
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(82, 0, 136, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .funhouse-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #FF0024, #520088, #FF5B07);
    }

    .funhouse-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(82, 0, 136, 0.2);
    }

    /* Rounded Shapes */
    .funhouse-blob {
      border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    }

    .funhouse-blob-alt {
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    }

    /* Container */
    .funhouse-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Section Spacing */
    .funhouse-section {
      padding: 5rem 0;
    }

    /* Playful Decorations */
    .funhouse-dots {
      background-image: radial-gradient(circle, #FF5B07 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.1;
    }

    .funhouse-confetti {
      position: relative;
    }

    .funhouse-confetti::before,
    .funhouse-confetti::after {
      content: '🎉';
      position: absolute;
      font-size: 3rem;
      opacity: 0.2;
      animation: float 3s ease-in-out infinite;
    }

    .funhouse-confetti::before {
      top: 10%;
      left: 5%;
      animation-delay: 0s;
    }

    .funhouse-confetti::after {
      bottom: 10%;
      right: 5%;
      animation-delay: 1.5s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(10deg);
      }
    }

    /* Responsive Typography */
    @media (max-width: 768px) {
      .funhouse-section {
        padding: 3rem 0;
      }

      .funhouse-btn {
        padding: 0.875rem 2rem;
        font-size: 1.125rem;
      }
    }

    /* Smooth Scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Selection */
    ::selection {
      background: #FF5B07;
      color: white;
    }
  `
}
