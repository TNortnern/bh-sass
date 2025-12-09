// Sample data for website builder prototypes
// Uses Unsplash for high-quality placeholder images

export interface WebsiteSection {
  id: string
  type: string
  data: Record<string, unknown>
}

// High-quality Unsplash images for bounce house / party rentals
const images = {
  // Hero backgrounds
  heroParty: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80', // Colorful balloons
  heroKids: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1920&q=80', // Kids party
  heroBounce: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1920&q=80', // Colorful confetti
  heroBackyard: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=1920&q=80', // Backyard party

  // Rental items
  bounceHouse1: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Colorful bouncy castle
  bounceHouse2: 'https://images.unsplash.com/photo-1567448400858-f9cdf0fde66c?w=800&q=80', // Party setup
  waterSlide: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80', // Water fun
  combo: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', // Party decorations
  obstacle: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80', // Confetti fun
  interactive: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80', // Kids playing

  // Gallery
  gallery1: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  gallery2: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80',
  gallery3: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80',
  gallery4: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80',
  gallery5: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600&q=80',
  gallery6: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&q=80',
  gallery7: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80',
  gallery8: 'https://images.unsplash.com/photo-1567448400858-f9cdf0fde66c?w=600&q=80',
  gallery9: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',

  // About section
  about: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', // Team/family

  // Testimonials (faces)
  person1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  person2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  person3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80'
}

// Default sections for a new website
export const defaultSections: WebsiteSection[] = [
  {
    id: 'hero-1',
    type: 'HeroFullWidth',
    data: {
      backgroundImage: images.heroParty,
      headline: 'Make Your Party Unforgettable',
      subheadline: 'Premium bounce houses and party rentals delivered to your door. Safe, clean, and ready for fun.',
      primaryButtonText: 'Browse Rentals',
      primaryButtonLink: '#rentals',
      secondaryButtonText: 'Get a Quote',
      secondaryButtonLink: '#contact',
      trustBadges: [
        { icon: 'shield', text: 'Fully Insured' },
        { icon: 'star', text: '500+ 5-Star Reviews' },
        { icon: 'truck', text: 'Free Delivery' }
      ]
    }
  },
  {
    id: 'trust-1',
    type: 'TrustBadges',
    data: {
      badges: [
        { id: '1', icon: 'shield', title: 'Fully Insured', description: 'Complete liability coverage for your peace of mind' },
        { id: '2', icon: 'truck', title: 'Free Delivery', description: 'Within 25 miles for all rentals over $200' },
        { id: '3', icon: 'star', title: '5-Star Service', description: 'Rated excellent by 500+ happy customers' },
        { id: '4', icon: 'clock', title: 'Same-Day Setup', description: 'Quick professional installation included' }
      ],
      layout: 'row'
    }
  },
  {
    id: 'rentals-1',
    type: 'FeaturedRentals',
    data: {
      headline: 'Our Most Popular Rentals',
      subheadline: 'Browse our selection of premium bounce houses and party equipment',
      items: [
        { id: '1', name: 'Rainbow Castle Bounce House', image: images.bounceHouse1, price: 199, category: 'Bounce House', slug: 'rainbow-castle' },
        { id: '2', name: 'Tropical Water Slide', image: images.waterSlide, price: 349, category: 'Water Slide', slug: 'tropical-slide' },
        { id: '3', name: 'Ultimate Combo Unit', image: images.combo, price: 299, category: 'Combo', slug: 'ultimate-combo' },
        { id: '4', name: 'Mega Obstacle Course', image: images.obstacle, price: 399, category: 'Obstacle Course', slug: 'mega-obstacle' },
        { id: '5', name: 'Princess Palace', image: images.bounceHouse2, price: 229, category: 'Bounce House', slug: 'princess-palace' },
        { id: '6', name: 'Sports Arena Interactive', image: images.interactive, price: 279, category: 'Interactive', slug: 'sports-arena' }
      ],
      showPrices: true,
      columns: 3
    }
  },
  {
    id: 'howitworks-1',
    type: 'HowItWorks',
    data: {
      headline: 'Booking Made Easy',
      subheadline: 'Get your party started in just 4 simple steps',
      steps: [
        { id: '1', number: '1', title: 'Browse & Select', description: 'Explore our collection and pick the perfect rental for your event', icon: 'search' },
        { id: '2', number: '2', title: 'Choose Your Date', description: 'Select your event date and time. Check real-time availability instantly', icon: 'calendar' },
        { id: '3', number: '3', title: 'We Deliver & Setup', description: 'Our team handles delivery, setup, and safety checks at your location', icon: 'truck' },
        { id: '4', number: '4', title: 'Party Time!', description: 'Enjoy your event worry-free. We handle pickup when you\'re done', icon: 'partyPopper' }
      ]
    }
  },
  {
    id: 'about-1',
    type: 'AboutSection',
    data: {
      image: images.about,
      headline: 'Your Local Family-Owned Party Rental Company',
      content: '<p>Since 2015, we\'ve been bringing joy to families across the greater metro area. What started as a single bounce house has grown into a full-service party rental company trusted by thousands of families, schools, and businesses.</p><p>Every rental is thoroughly cleaned and inspected before delivery. Your family\'s safety is our top priority.</p>',
      stats: [
        { value: '8+', label: 'Years Experience' },
        { value: '5,000+', label: 'Events Served' },
        { value: '50+', label: 'Rental Items' }
      ]
    }
  },
  {
    id: 'testimonials-1',
    type: 'TestimonialsGrid',
    data: {
      headline: 'What Our Customers Say',
      subheadline: 'Don\'t just take our word for it',
      testimonials: [
        {
          id: '1',
          quote: 'The kids had an absolute blast! Setup was quick and the bounce house was spotlessly clean. Will definitely book again for next year.',
          name: 'Sarah M.',
          role: 'Birthday Party Mom',
          image: images.person1,
          rating: 5
        },
        {
          id: '2',
          quote: 'We\'ve used them for 3 corporate events now. Professional, on-time, and the equipment is always in great condition. Highly recommend!',
          name: 'Michael R.',
          role: 'Event Coordinator',
          image: images.person2,
          rating: 5
        },
        {
          id: '3',
          quote: 'Best price in town and amazing service. They even came early to set up so everything was ready before guests arrived.',
          name: 'Jennifer L.',
          role: 'School PTA President',
          image: images.person3,
          rating: 5
        }
      ]
    }
  },
  {
    id: 'gallery-1',
    type: 'GalleryGrid',
    data: {
      headline: 'See the Fun in Action',
      subheadline: 'Browse photos from recent events',
      images: [
        { id: '1', src: images.gallery1, alt: 'Birthday party celebration', caption: 'Backyard birthday bash' },
        { id: '2', src: images.gallery2, alt: 'Kids enjoying bounce house', caption: 'Summer fun' },
        { id: '3', src: images.gallery3, alt: 'Party decorations', caption: 'Themed party setup' },
        { id: '4', src: images.gallery4, alt: 'Children playing', caption: 'School carnival' },
        { id: '5', src: images.gallery5, alt: 'Backyard event', caption: 'Family reunion' },
        { id: '6', src: images.gallery6, alt: 'Kids having fun', caption: 'Community event' }
      ],
      columns: 3
    }
  },
  {
    id: 'faq-1',
    type: 'FAQAccordion',
    data: {
      headline: 'Frequently Asked Questions',
      subheadline: 'Everything you need to know about renting with us',
      items: [
        {
          id: '1',
          question: 'What\'s included with my rental?',
          answer: 'Every rental includes free delivery, professional setup, safety instruction, and pickup within our service area. We also provide stakes or sandbags for securing the unit, and a ground tarp.'
        },
        {
          id: '2',
          question: 'How far in advance should I book?',
          answer: 'We recommend booking at least 2 weeks in advance, especially for weekend events. Popular items during peak season (May-September) can book up 4-6 weeks ahead.'
        },
        {
          id: '3',
          question: 'What if it rains on my event day?',
          answer: 'We monitor weather closely. If conditions are unsafe, we\'ll work with you to reschedule at no additional cost. Light rain is usually fine, but we don\'t operate during thunderstorms or high winds.'
        },
        {
          id: '4',
          question: 'Do you require a deposit?',
          answer: 'Yes, we require a 50% deposit to secure your booking. The remaining balance is due the day before your event. We accept all major credit cards.'
        },
        {
          id: '5',
          question: 'What power source do I need?',
          answer: 'Most units require a standard 110V household outlet within 100 feet. We provide extension cords. If you don\'t have power access, we offer generator rentals for an additional fee.'
        },
        {
          id: '6',
          question: 'Are your units clean and safe?',
          answer: 'Absolutely. Every unit is thoroughly cleaned and sanitized between rentals using commercial-grade disinfectant. We also perform safety inspections before each delivery.'
        }
      ]
    }
  },
  {
    id: 'cta-1',
    type: 'CTABanner',
    data: {
      headline: 'Ready to Book Your Party?',
      subheadline: 'Get a free quote in minutes. No obligation.',
      buttonText: 'Get Started',
      buttonLink: '#contact',
      backgroundColor: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
    }
  },
  {
    id: 'contact-1',
    type: 'ContactSection',
    data: {
      headline: 'Get In Touch',
      subheadline: 'Have questions or ready to book? We\'re here to help make your event amazing.',
      phone: '(555) 123-4567',
      email: 'hello@bouncekingdom.com',
      address: '123 Party Lane, Fun City, CA 90210',
      hours: 'Mon-Sat: 8am-8pm, Sun: 10am-6pm',
      showForm: true
    }
  },
  {
    id: 'footer-1',
    type: 'FooterSection',
    data: {
      businessName: 'Bounce Kingdom',
      description: 'Making memories one bounce at a time. Your trusted local party rental company since 2015.',
      phone: '(555) 123-4567',
      email: 'hello@bouncekingdom.com',
      address: '123 Party Lane, Fun City, CA 90210',
      links: [
        { id: '1', label: 'Bounce Houses', href: '#' },
        { id: '2', label: 'Water Slides', href: '#' },
        { id: '3', label: 'Combo Units', href: '#' },
        { id: '4', label: 'Party Packages', href: '#' },
        { id: '5', label: 'About Us', href: '#about' },
        { id: '6', label: 'Contact', href: '#contact' }
      ],
      copyright: ' {year} Bounce Kingdom. All rights reserved.'
    }
  }
]

// Section type definitions for the sidebar
export const sectionTypes = [
  {
    category: 'Navigation',
    items: [
      { type: 'NavigationBar', label: 'Navigation Bar', icon: 'menu', description: 'Top navigation with logo, links, and CTA' }
    ]
  },
  {
    category: 'Hero',
    items: [
      { type: 'HeroFullWidth', label: 'Full Width Hero', icon: 'layout-template', description: 'Stunning full-screen hero with background image and CTA' },
      { type: 'HeroSplit', label: 'Split Hero', icon: 'layout-sidebar', description: 'Two-column hero with image and content side by side' }
    ]
  },
  {
    category: 'Content',
    items: [
      { type: 'FeaturedRentals', label: 'Featured Rentals', icon: 'grid-3x3', description: 'Showcase your best rental items in a grid' },
      { type: 'FeaturesGrid', label: 'Features Grid', icon: 'sparkles', description: 'Icon features in a stylish grid layout' },
      { type: 'AboutSection', label: 'About Section', icon: 'user', description: 'Tell your story with image and stats' },
      { type: 'HowItWorks', label: 'How It Works', icon: 'list-ordered', description: 'Step-by-step process with icons' },
      { type: 'GalleryGrid', label: 'Gallery Grid', icon: 'image', description: 'Photo gallery with lightbox' },
      { type: 'StatsSection', label: 'Stats Section', icon: 'bar-chart-3', description: 'Big numbers that impress visitors' }
    ]
  },
  {
    category: 'Social Proof',
    items: [
      { type: 'TestimonialsGrid', label: 'Testimonials', icon: 'message-square-quote', description: 'Customer reviews with photos and ratings' },
      { type: 'TrustBadges', label: 'Trust Badges', icon: 'badge-check', description: 'Build trust with icon badges' },
      { type: 'LogoCloud', label: 'Logo Cloud', icon: 'building-2', description: 'Partner and client logos display' }
    ]
  },
  {
    category: 'Conversion',
    items: [
      { type: 'PricingTable', label: 'Pricing Table', icon: 'dollar-sign', description: 'Pricing tiers with features comparison' },
      { type: 'CTABanner', label: 'CTA Banner', icon: 'megaphone', description: 'Bold call-to-action section' },
      { type: 'FAQAccordion', label: 'FAQ Accordion', icon: 'help-circle', description: 'Expandable Q&A section' },
      { type: 'ContactSection', label: 'Contact Section', icon: 'mail', description: 'Contact info with form' }
    ]
  },
  {
    category: 'Layout',
    items: [
      { type: 'FooterSection', label: 'Footer', icon: 'panel-bottom', description: 'Site footer with links and info' }
    ]
  },
  {
    category: 'Advanced',
    items: [
      { type: 'BentoGrid', label: 'Bento Grid', icon: 'layout-grid', description: 'Tailwind UI style feature grid with varied sizes' },
      { type: 'TeamSection', label: 'Team Section', icon: 'users', description: 'Showcase team members with photos and social links' },
      { type: 'NewsletterSection', label: 'Newsletter', icon: 'send', description: 'Email signup form with multiple styles' },
      { type: 'BlogCards', label: 'Blog Cards', icon: 'newspaper', description: 'Display blog posts in a grid or featured layout' }
    ]
  },
  {
    category: 'Custom',
    items: [
      { type: 'CustomHTML', label: 'Custom HTML', icon: 'code', description: 'Paste code from Tailwind UI, Shuffle.dev, or write your own' }
    ]
  }
]

// All blocks flattened for search
export const allBlocks = sectionTypes.flatMap(cat =>
  cat.items.map(item => ({
    ...item,
    category: cat.category
  }))
)

// Default data for each section type (used when adding new sections)
export const sectionDefaults: Record<string, Record<string, unknown>> = {
  HeroFullWidth: {
    backgroundImage: images.heroParty,
    headline: 'Your Headline Here',
    subheadline: 'Add your compelling subheadline',
    primaryButtonText: 'Get Started',
    primaryButtonLink: '#',
    secondaryButtonText: 'Learn More',
    secondaryButtonLink: '#',
    trustBadges: []
  },
  HeroSplit: {
    image: images.bounceHouse1,
    imagePosition: 'right',
    eyebrow: 'Welcome',
    headline: 'Your Headline Here',
    subheadline: 'Add a compelling description that explains your value proposition.',
    primaryButtonText: 'Get Started',
    primaryButtonLink: '#',
    secondaryButtonText: 'Learn More',
    secondaryButtonLink: '#',
    stats: []
  },
  FeaturedRentals: {
    headline: 'Featured Rentals',
    subheadline: 'Browse our selection',
    items: [],
    showPrices: true,
    columns: 3
  },
  AboutSection: {
    image: images.about,
    headline: 'About Us',
    content: '<p>Tell your story here.</p>',
    stats: []
  },
  HowItWorks: {
    headline: 'How It Works',
    subheadline: 'Simple steps to get started',
    steps: []
  },
  GalleryGrid: {
    headline: 'Gallery',
    subheadline: 'See our work',
    images: [],
    columns: 3
  },
  TestimonialsGrid: {
    headline: 'What People Say',
    subheadline: 'Customer testimonials',
    testimonials: []
  },
  TrustBadges: {
    badges: [],
    layout: 'row'
  },
  CTABanner: {
    headline: 'Ready to Get Started?',
    subheadline: 'Take action today',
    buttonText: 'Get Started',
    buttonLink: '#',
    backgroundColor: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
  },
  FAQAccordion: {
    headline: 'FAQ',
    subheadline: 'Common questions',
    items: []
  },
  ContactSection: {
    headline: 'Contact Us',
    subheadline: 'Get in touch',
    phone: '',
    email: '',
    address: '',
    hours: '',
    showForm: true
  },
  FooterSection: {
    businessName: 'Your Business',
    description: 'Your business description',
    phone: '',
    email: '',
    address: '',
    links: [],
    copyright: ' {year} Your Business. All rights reserved.'
  },
  NavigationBar: {
    logo: '',
    businessName: 'Your Business',
    links: [
      { id: '1', label: 'Home', href: '#' },
      { id: '2', label: 'Rentals', href: '#rentals' },
      { id: '3', label: 'About', href: '#about' },
      { id: '4', label: 'Contact', href: '#contact' }
    ],
    ctaText: 'Book Now',
    ctaLink: '#book',
    transparent: false
  },
  PricingTable: {
    headline: 'Simple, Transparent Pricing',
    subheadline: 'Choose the package that fits your event',
    tiers: [
      {
        id: '1',
        name: 'Half Day',
        description: 'Perfect for shorter events',
        price: '$149',
        priceNote: '4 hours',
        features: ['Free delivery & setup', 'One bounce house', 'Safety supervision tips', 'Same-day pickup'],
        popular: false,
        ctaText: 'Book Now',
        ctaLink: '#book'
      },
      {
        id: '2',
        name: 'Full Day',
        description: 'Our most popular option',
        price: '$249',
        priceNote: '8 hours',
        features: ['Free delivery & setup', 'One bounce house', 'Safety supervision tips', 'Next-day pickup option', 'Free party supplies kit'],
        popular: true,
        ctaText: 'Book Now',
        ctaLink: '#book'
      },
      {
        id: '3',
        name: 'Weekend',
        description: 'Extended fun for big events',
        price: '$399',
        priceNote: 'Fri-Sun',
        features: ['Free delivery & setup', 'One bounce house', 'Safety supervision tips', 'Weekend-long rental', 'Free party supplies kit', 'Priority support'],
        popular: false,
        ctaText: 'Book Now',
        ctaLink: '#book'
      }
    ]
  },
  StatsSection: {
    headline: 'Trusted by Families Everywhere',
    subheadline: 'Numbers that speak for themselves',
    stats: [
      { id: '1', value: '5,000+', label: 'Happy Customers', description: 'Families served since 2015' },
      { id: '2', value: '50+', label: 'Rental Items', description: 'Bounce houses, slides & more' },
      { id: '3', value: '99%', label: 'Satisfaction Rate', description: 'Based on customer reviews' },
      { id: '4', value: '24/7', label: 'Support', description: 'Always here when you need us' }
    ],
    style: 'light'
  },
  FeaturesGrid: {
    headline: 'Why Choose Us?',
    subheadline: 'We make party planning easy and stress-free',
    features: [
      { id: '1', icon: 'shield', title: 'Safety First', description: 'All equipment inspected and sanitized before every rental' },
      { id: '2', icon: 'truck', title: 'Free Delivery', description: 'We deliver, set up, and pick up at no extra charge' },
      { id: '3', icon: 'clock', title: 'On-Time Service', description: 'We arrive on schedule so your party starts on time' },
      { id: '4', icon: 'heart', title: 'Family Owned', description: 'Serving our community with care for over 8 years' },
      { id: '5', icon: 'zap', title: 'Quick Booking', description: 'Reserve your rental in minutes with our easy system' },
      { id: '6', icon: 'sparkles', title: 'Premium Quality', description: 'Commercial-grade equipment that looks great' }
    ],
    columns: 3,
    style: 'cards'
  },
  LogoCloud: {
    headline: 'Trusted by local businesses and organizations',
    subheadline: '',
    logos: [],
    style: 'row',
    grayscale: true
  },
  CustomHTML: {
    html: '',
    css: '',
    label: 'Custom Block'
  },
  BentoGrid: {
    headline: 'Everything You Need',
    subheadline: 'Features that make your events unforgettable',
    items: [
      { id: '1', title: 'Premium Quality', description: 'Commercial-grade equipment maintained to the highest standards', icon: 'sparkles', size: 'large', color: 'amber' },
      { id: '2', title: 'Safe & Secure', description: 'Fully insured with safety certifications', icon: 'shield', size: 'small', color: 'green' },
      { id: '3', title: 'Fast Setup', description: 'Professional installation in under 30 minutes', icon: 'zap', size: 'small', color: 'blue' },
      { id: '4', title: 'Always On Time', description: 'We arrive early so your party starts on schedule', icon: 'clock', size: 'medium', color: 'purple' },
      { id: '5', title: 'Customer Love', description: 'Join thousands of happy families', icon: 'heart', size: 'medium', color: 'pink' }
    ]
  },
  TeamSection: {
    headline: 'Meet Our Team',
    subheadline: 'The friendly faces behind every successful event',
    members: [
      { id: '1', name: 'John Smith', role: 'Founder & CEO', image: '', bio: 'Started the company with a vision to make parties unforgettable.' },
      { id: '2', name: 'Sarah Johnson', role: 'Operations Manager', image: '', bio: 'Ensures every delivery runs smoothly.' },
      { id: '3', name: 'Mike Davis', role: 'Lead Technician', image: '', bio: 'Expert in setup and safety inspections.' }
    ],
    style: 'grid'
  },
  NewsletterSection: {
    headline: 'Stay in the Loop',
    subheadline: 'Get exclusive deals, party tips, and early access to new rentals.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
    note: 'No spam, ever. Unsubscribe anytime.',
    style: 'simple',
    backgroundColor: ''
  },
  BlogCards: {
    headline: 'Party Planning Tips',
    subheadline: 'Expert advice to make your events amazing',
    posts: [
      { id: '1', title: '10 Tips for the Perfect Backyard Party', excerpt: 'Learn how to set up the ultimate outdoor celebration that kids will love.', image: '', date: '2025-01-15', category: 'Planning', readTime: '5 min read', link: '#' },
      { id: '2', title: 'Choosing the Right Bounce House Size', excerpt: 'A complete guide to selecting the perfect bounce house for your space and guest count.', image: '', date: '2025-01-10', category: 'Guides', readTime: '4 min read', link: '#' },
      { id: '3', title: 'Safety First: Bounce House Best Practices', excerpt: 'Essential safety tips every parent should know before renting an inflatable.', image: '', date: '2025-01-05', category: 'Safety', readTime: '6 min read', link: '#' }
    ],
    columns: 3,
    style: 'cards',
    showAuthor: false,
    showDate: true,
    showCategory: true
  }
}
