import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const starterPremium: GrapesJSTemplate = {
  id: 'starter-premium',
  name: 'Premium Starter',
  description: 'Elegant, high-end design for luxury event rental businesses. Dark theme with gold accents.',
  category: 'Starter',
  tags: ['premium', 'luxury', 'elegant', 'high-end', 'dark'],
  preview: templatePreviews['starter-premium'],
  thumbnail: getTemplateThumbnail('starter-premium'),
  config: {
    primaryColor: '#0f172a',
    secondaryColor: '#1e293b',
    accentColor: '#fbbf24',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Luxury aesthetic',
      'Dark mode design',
      'Premium animations',
      'High-end branding',
      'Corporate ready'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elite Events - Luxury Party Rentals</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .premium-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); }
    .gold-shimmer {
      background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%);
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    @keyframes shimmer {
      to { background-position: 200% center; }
    }
    .fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }
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
  </style>
</head>
<body class="antialiased bg-slate-900 text-gray-100">

  <!-- Navigation -->
  <nav class="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded flex items-center justify-center mr-3">
                <svg class="w-7 h-7 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <h1 class="text-2xl font-bold">
                <span class="text-white">Elite</span>
                <span class="text-amber-400">Events</span>
              </h1>
            </div>
          </div>
          <div class="hidden md:block ml-10">
            <div class="flex items-baseline space-x-8">
              <a href="#collection" class="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition">Collection</a>
              <a href="#experience" class="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition">Experience</a>
              <a href="#testimonials" class="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition">Testimonials</a>
              <a href="#contact" class="text-gray-300 hover:text-amber-400 px-3 py-2 text-sm font-medium transition">Contact</a>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <a href="#reserve" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 px-8 py-3 rounded font-bold transition shadow-lg shadow-amber-500/20">
            Reserve Now
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="premium-gradient text-white py-24 md:py-40 relative overflow-hidden">
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-4xl">
        <div class="inline-block mb-6 fade-in-up">
          <span class="border border-amber-400/30 bg-amber-400/10 text-amber-400 px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
            Premium Event Rentals
          </span>
        </div>
        <h2 class="text-5xl md:text-7xl font-bold mb-6 leading-tight fade-in-up" style="animation-delay: 0.1s;">
          Elevate Your Events to
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500"> Extraordinary</span>
        </h2>
        <p class="text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl leading-relaxed fade-in-up" style="animation-delay: 0.2s;">
          Curated collection of luxury party equipment and inflatables for discerning clients who demand excellence in every detail.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 fade-in-up" style="animation-delay: 0.3s;">
          <a href="#collection" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 px-10 py-4 rounded text-lg font-bold shadow-2xl shadow-amber-500/30 transition inline-block text-center">
            Explore Collection
          </a>
          <a href="#contact" class="border-2 border-amber-400 hover:bg-amber-400/10 text-amber-400 px-10 py-4 rounded text-lg font-bold transition inline-block text-center">
            Speak with Specialist
          </a>
        </div>
        <div class="mt-16 grid grid-cols-3 gap-8 max-w-2xl fade-in-up" style="animation-delay: 0.4s;">
          <div class="text-center border-r border-slate-700 pr-8 last:border-0">
            <div class="text-3xl font-bold text-amber-400 mb-1">500+</div>
            <div class="text-sm text-slate-400 uppercase tracking-wide">Events</div>
          </div>
          <div class="text-center border-r border-slate-700 pr-8 last:border-0">
            <div class="text-3xl font-bold text-amber-400 mb-1">98%</div>
            <div class="text-sm text-slate-400 uppercase tracking-wide">Satisfaction</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-400 mb-1">24/7</div>
            <div class="text-sm text-slate-400 uppercase tracking-wide">Concierge</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Collection -->
  <section id="collection" class="py-24 bg-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h3 class="text-4xl md:text-5xl font-bold text-white mb-4">Signature Collection</h3>
        <p class="text-xl text-slate-400 max-w-2xl mx-auto">
          Meticulously maintained, exclusively designed experiences
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Item 1 -->
        <div class="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400/50 transition group">
          <div class="h-80 bg-gradient-to-br from-purple-900 to-pink-900 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white transform group-hover:scale-110 transition duration-500">
                <svg class="w-40 h-40 mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
                <div class="uppercase text-sm tracking-wider font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                  Royal Experience
                </div>
              </div>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase">Premium</span>
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-2xl font-bold text-white mb-3">Imperial Palace</h4>
            <p class="text-slate-400 mb-6 leading-relaxed">
              Majestic castle design with premium materials, LED lighting, and climate control. Perfect for sophisticated celebrations.
            </p>
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">From</p>
                <p class="text-4xl font-bold text-amber-400">$599</p>
              </div>
              <a href="#reserve" class="bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-amber-400 border border-amber-400 px-6 py-3 rounded font-bold transition">
                Reserve
              </a>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">20×20 ft</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">LED Lighting</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">15 Guests</span>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400/50 transition group">
          <div class="h-80 bg-gradient-to-br from-blue-900 to-cyan-900 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white transform group-hover:scale-110 transition duration-500">
                <svg class="w-40 h-40 mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"></path>
                </svg>
                <div class="uppercase text-sm tracking-wider font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                  Aquatic Luxury
                </div>
              </div>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-cyan-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase">Featured</span>
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-2xl font-bold text-white mb-3">Azure Water Slide</h4>
            <p class="text-slate-400 mb-6 leading-relaxed">
              Professional-grade water slide with dual lanes, soft landing pool, and integrated filtration system.
            </p>
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">From</p>
                <p class="text-4xl font-bold text-amber-400">$799</p>
              </div>
              <a href="#reserve" class="bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-amber-400 border border-amber-400 px-6 py-3 rounded font-bold transition">
                Reserve
              </a>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">25×15 ft</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">Dual Lane</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">All Ages</span>
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-amber-400/50 transition group">
          <div class="h-80 bg-gradient-to-br from-green-900 to-emerald-900 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white transform group-hover:scale-110 transition duration-500">
                <svg class="w-40 h-40 mx-auto mb-6 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
                <div class="uppercase text-sm tracking-wider font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                  Elite Challenge
                </div>
              </div>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-emerald-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase">New</span>
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-2xl font-bold text-white mb-3">Titan Obstacle Course</h4>
            <p class="text-slate-400 mb-6 leading-relaxed">
              Competition-grade obstacle course with advanced safety features and modular design for custom layouts.
            </p>
            <div class="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wide mb-1">From</p>
                <p class="text-4xl font-bold text-amber-400">$899</p>
              </div>
              <a href="#reserve" class="bg-slate-800 hover:bg-amber-400 hover:text-slate-900 text-amber-400 border border-amber-400 px-6 py-3 rounded font-bold transition">
                Reserve
              </a>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">40×15 ft</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">Modular</span>
              <span class="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded text-xs">Ages 8+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Experience Section -->
  <section id="experience" class="py-24 premium-gradient">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h3 class="text-4xl md:text-5xl font-bold text-white mb-4">The Elite Difference</h3>
        <p class="text-xl text-slate-400 max-w-2xl mx-auto">
          White-glove service from consultation to celebration
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center group">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
            <span class="text-4xl font-bold text-slate-900">1</span>
          </div>
          <h4 class="text-xl font-bold text-white mb-3">Personal Consultation</h4>
          <p class="text-slate-400 leading-relaxed">
            Dedicated event specialist to understand your vision and recommend perfect solutions
          </p>
        </div>

        <div class="text-center group">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
            <span class="text-4xl font-bold text-slate-900">2</span>
          </div>
          <h4 class="text-xl font-bold text-white mb-3">Premium Selection</h4>
          <p class="text-slate-400 leading-relaxed">
            Choose from our curated collection of luxury inflatables and party equipment
          </p>
        </div>

        <div class="text-center group">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
            <span class="text-4xl font-bold text-slate-900">3</span>
          </div>
          <h4 class="text-xl font-bold text-white mb-3">Flawless Setup</h4>
          <p class="text-slate-400 leading-relaxed">
            Professional team arrives precisely on time for meticulous installation and safety checks
          </p>
        </div>

        <div class="text-center group">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
            <span class="text-4xl font-bold text-slate-900">4</span>
          </div>
          <h4 class="text-xl font-bold text-white mb-3">24/7 Support</h4>
          <p class="text-slate-400 leading-relaxed">
            Dedicated concierge available throughout your event for any needs or adjustments
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section id="testimonials" class="py-24 bg-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h3 class="text-4xl md:text-5xl font-bold text-white mb-4">Trusted by Excellence</h3>
        <p class="text-xl text-slate-400">What our distinguished clients say</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="bg-slate-900 border border-slate-700 p-10 rounded-lg">
          <div class="flex mb-6">
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p class="text-slate-300 text-lg mb-8 leading-relaxed italic">
            "Elite Events transformed our corporate gala into an unforgettable experience. The attention to detail, professionalism, and quality of equipment exceeded all expectations. Their team's dedication to perfection is unmatched."
          </p>
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl mr-4">
              RC
            </div>
            <div>
              <p class="font-bold text-white text-lg">Rebecca Collins</p>
              <p class="text-slate-400">VP of Events, TechCorp Industries</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-700 p-10 rounded-lg">
          <div class="flex mb-6">
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p class="text-slate-300 text-lg mb-8 leading-relaxed italic">
            "For our daughter's sweet sixteen, we wanted something truly special. Elite Events delivered beyond our dreams. The Imperial Palace was pristine, the service impeccable. Worth every penny for the memories created."
          </p>
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl mr-4">
              DW
            </div>
            <div>
              <p class="font-bold text-white text-lg">David & Maria Williams</p>
              <p class="text-slate-400">Scottsdale, Arizona</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact/CTA -->
  <section id="contact" class="py-24 premium-gradient relative overflow-hidden">
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-10 left-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h3 class="text-4xl md:text-6xl font-bold text-white mb-6">Begin Your Elite Experience</h3>
      <p class="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        Connect with our event specialists to curate the perfect celebration
      </p>

      <div class="flex flex-col sm:flex-row gap-6 justify-center mb-20">
        <a href="#reserve" class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-900 px-12 py-5 rounded text-xl font-bold shadow-2xl shadow-amber-500/30 transition inline-block">
          Reserve Your Date
        </a>
        <a href="tel:555-234-5678" class="border-2 border-amber-400 hover:bg-amber-400/10 text-amber-400 px-12 py-5 rounded text-xl font-bold transition inline-block">
          Call (555) 234-5678
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          <h4 class="font-bold text-white mb-2 text-lg">Email</h4>
          <p class="text-slate-400">concierge@eliteevents.com</p>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          <h4 class="font-bold text-white mb-2 text-lg">24/7 Concierge</h4>
          <p class="text-slate-400">(555) 234-5678</p>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="font-bold text-white mb-2 text-lg">Showroom</h4>
          <p class="text-slate-400">456 Luxury Lane, Beverly Hills</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white">Elite Events</h3>
          </div>
          <p class="leading-relaxed">Elevating celebrations through exceptional service and premium rentals since 2015.</p>
        </div>

        <div>
          <h4 class="font-bold text-white mb-4">Services</h4>
          <ul class="space-y-3">
            <li><a href="#" class="hover:text-amber-400 transition">Luxury Inflatables</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Event Planning</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Corporate Events</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Private Parties</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white mb-4">Company</h4>
          <ul class="space-y-3">
            <li><a href="#" class="hover:text-amber-400 transition">About Us</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Our Collection</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Testimonials</a></li>
            <li><a href="#" class="hover:text-amber-400 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white mb-4">Connect</h4>
          <div class="flex space-x-4">
            <a href="#" class="bg-slate-800 hover:bg-amber-400 hover:text-slate-900 w-12 h-12 rounded flex items-center justify-center transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="bg-slate-800 hover:bg-amber-400 hover:text-slate-900 w-12 h-12 rounded flex items-center justify-center transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-800 pt-8 text-center text-sm">
        <p>&copy; 2025 Elite Events. All rights reserved. | <a href="#" class="hover:text-amber-400 transition">Privacy</a> | <a href="#" class="hover:text-amber-400 transition">Terms</a></p>
      </div>
    </div>
  </footer>

</body>
</html>`
}
