import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const starterPlayful: GrapesJSTemplate = {
  id: 'starter-playful',
  name: 'Playful Starter',
  description: 'Fun, colorful design perfect for party rental businesses. Vibrant colors and playful elements.',
  category: 'Starter',
  tags: ['fun', 'colorful', 'kids', 'playful', 'vibrant'],
  preview: templatePreviews['starter-playful'],
  thumbnail: getTemplateThumbnail('starter-playful'),
  config: {
    primaryColor: '#ec4899',
    secondaryColor: '#f472b6',
    accentColor: '#fbbf24',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Eye-catching design',
      'Kid-friendly colors',
      'Fun animations',
      'Mobile optimized',
      'High conversion'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FunTime Bounce - Party Rentals for Kids</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .playful-gradient { background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fbbf24 100%); }
    .bounce {
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
  </style>
</head>
<body class="antialiased bg-pink-50">

  <!-- Navigation -->
  <nav class="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-pink-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mr-3">
                <span class="text-2xl">🎉</span>
              </div>
              <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                FunTime Bounce
              </h1>
            </div>
          </div>
          <div class="hidden md:block ml-10">
            <div class="flex items-baseline space-x-6">
              <a href="#bounce-houses" class="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-bold transition">Bounce Houses</a>
              <a href="#packages" class="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-bold transition">Party Packages</a>
              <a href="#gallery" class="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-bold transition">Gallery</a>
              <a href="#contact" class="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-bold transition">Contact</a>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <a href="#book" class="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white px-8 py-3 rounded-full font-black text-lg shadow-xl transform hover:scale-105 transition inline-block">
            BOOK NOW! 🎈
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="playful-gradient text-white py-16 md:py-24 relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-10 text-6xl">🎈</div>
      <div class="absolute top-32 right-20 text-5xl">🎉</div>
      <div class="absolute bottom-10 left-1/4 text-7xl">🎊</div>
      <div class="absolute bottom-32 right-10 text-6xl">🎁</div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center">
        <div class="inline-block mb-6">
          <span class="bg-yellow-400 text-pink-600 px-6 py-2 rounded-full text-sm font-black uppercase tracking-wide">
            ⭐ #1 Rated in Town ⭐
          </span>
        </div>
        <h2 class="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Jump Into<br/>
          <span class="text-yellow-300">MEGA FUN!</span>
        </h2>
        <p class="text-2xl md:text-3xl mb-8 font-bold text-pink-100 max-w-3xl mx-auto">
          The BIGGEST bounce houses, the BEST parties, the most FUN your kids will ever have! 🚀
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="#bounce-houses" class="bg-yellow-400 hover:bg-yellow-300 text-pink-600 px-10 py-5 rounded-full text-xl font-black shadow-2xl transform hover:scale-105 transition inline-block">
            SEE OUR BOUNCE HOUSES! 🏰
          </a>
          <a href="tel:555-987-6543" class="bg-white hover:bg-gray-100 text-pink-500 px-10 py-5 rounded-full text-xl font-black shadow-2xl transform hover:scale-105 transition inline-block">
            CALL NOW! 📞
          </a>
        </div>
        <div class="flex flex-wrap justify-center gap-6 text-lg font-bold">
          <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            ✅ Super Clean & Safe
          </div>
          <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            ✅ Always On Time
          </div>
          <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
            ✅ Best Prices Guaranteed
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bounce Houses Section -->
  <section id="bounce-houses" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Our <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">AWESOME</span> Bounce Houses!
        </h3>
        <p class="text-2xl text-gray-600 font-bold max-w-2xl mx-auto">
          Pick your favorite and let the bouncing begin! 🎪
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <!-- Bounce House 1 -->
        <div class="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition">
          <div class="h-72 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center relative">
            <div class="text-white text-center bounce">
              <div class="text-9xl mb-4">👑</div>
              <p class="text-xl font-black uppercase tracking-wide bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">Princess Palace</p>
            </div>
            <div class="absolute top-4 right-4 bg-yellow-400 text-pink-600 px-4 py-2 rounded-full font-black text-sm">
              🔥 POPULAR!
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-black text-gray-900 mb-3">Princess Palace Castle 👑</h4>
            <p class="text-gray-700 mb-6 font-semibold text-lg">
              Every little princess's dream! Pink castle with towers, flags, and room for 10+ kids to bounce!
            </p>
            <div class="flex items-end justify-between mb-6">
              <div>
                <p class="text-sm text-gray-500 font-bold">Starting at</p>
                <p class="text-5xl font-black text-pink-500">$179</p>
                <p class="text-sm text-gray-500">per day</p>
              </div>
              <a href="#book" class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-black shadow-xl transform hover:scale-105 transition">
                BOOK IT!
              </a>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span class="bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">Ages 3-10</span>
              <span class="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">15×15 ft</span>
              <span class="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">10 kids max</span>
            </div>
          </div>
        </div>

        <!-- Bounce House 2 -->
        <div class="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition">
          <div class="h-72 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center relative">
            <div class="text-white text-center bounce" style="animation-delay: 0.2s;">
              <div class="text-9xl mb-4">🌊</div>
              <p class="text-xl font-black uppercase tracking-wide bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">Splash Zone</p>
            </div>
            <div class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-black text-sm animate-pulse">
              ❄️ SUMMER HIT!
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-black text-gray-900 mb-3">Splash Zone Water Slide 🌊</h4>
            <p class="text-gray-700 mb-6 font-semibold text-lg">
              Cool off with our giant water slide! 20 feet of slippery fun with a splash pool landing!
            </p>
            <div class="flex items-end justify-between mb-6">
              <div>
                <p class="text-sm text-gray-500 font-bold">Starting at</p>
                <p class="text-5xl font-black text-blue-500">$249</p>
                <p class="text-sm text-gray-500">per day</p>
              </div>
              <a href="#book" class="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-black shadow-xl transform hover:scale-105 transition">
                BOOK IT!
              </a>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span class="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Ages 5-12</span>
              <span class="bg-cyan-200 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">20×10 ft</span>
              <span class="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Water included</span>
            </div>
          </div>
        </div>

        <!-- Bounce House 3 -->
        <div class="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition">
          <div class="h-72 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center relative">
            <div class="text-white text-center bounce" style="animation-delay: 0.4s;">
              <div class="text-9xl mb-4">🦖</div>
              <p class="text-xl font-black uppercase tracking-wide bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">Dino Adventure</p>
            </div>
            <div class="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-black text-sm">
              🦖 NEW!
            </div>
          </div>
          <div class="p-8">
            <h4 class="text-3xl font-black text-gray-900 mb-3">Dino Adventure Course 🦖</h4>
            <p class="text-gray-700 mb-6 font-semibold text-lg">
              Journey through dinosaur land! Climb, crawl, and conquer this prehistoric obstacle course!
            </p>
            <div class="flex items-end justify-between mb-6">
              <div>
                <p class="text-sm text-gray-500 font-bold">Starting at</p>
                <p class="text-5xl font-black text-green-500">$299</p>
                <p class="text-sm text-gray-500">per day</p>
              </div>
              <a href="#book" class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-black shadow-xl transform hover:scale-105 transition">
                BOOK IT!
              </a>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span class="bg-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Ages 4-12</span>
              <span class="bg-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">30×12 ft</span>
              <span class="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Obstacle course</span>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-16">
        <a href="#all-rentals" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-5 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition inline-block">
          SEE ALL BOUNCE HOUSES! 🎪
        </a>
      </div>
    </div>
  </section>

  <!-- Party Packages Section -->
  <section id="packages" class="py-20 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Party Packages = <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-500">MEGA SAVINGS!</span>
        </h3>
        <p class="text-2xl text-gray-600 font-bold">
          Get more fun for less money! 🎉
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-400">
          <div class="text-center mb-6">
            <div class="text-6xl mb-4">🎈</div>
            <h4 class="text-3xl font-black text-gray-900 mb-2">Basic Bash</h4>
            <p class="text-5xl font-black text-yellow-500 mb-2">$199</p>
            <p class="text-gray-600 font-semibold">Perfect for small parties!</p>
          </div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-green-500 mr-3 text-xl">✓</span>
              1 Bounce House (your choice)
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-green-500 mr-3 text-xl">✓</span>
              Up to 4 hours rental
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-green-500 mr-3 text-xl">✓</span>
              Free delivery & setup
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-green-500 mr-3 text-xl">✓</span>
              Safety equipment included
            </li>
          </ul>
          <a href="#book" class="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-center px-6 py-4 rounded-full font-black text-xl shadow-xl transform hover:scale-105 transition">
            BOOK NOW!
          </a>
        </div>

        <div class="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 transform scale-105 relative">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-pink-600 px-6 py-2 rounded-full font-black uppercase tracking-wide">
            🔥 Most Popular!
          </div>
          <div class="text-center mb-6 text-white">
            <div class="text-6xl mb-4">🎊</div>
            <h4 class="text-3xl font-black mb-2">Ultimate Party</h4>
            <p class="text-5xl font-black mb-2">$449</p>
            <p class="font-semibold">Our BEST value package!</p>
          </div>
          <ul class="space-y-3 mb-8 text-white">
            <li class="flex items-center font-bold">
              <span class="text-yellow-300 mr-3 text-xl">✓</span>
              2 Bounce Houses (your choice)
            </li>
            <li class="flex items-center font-bold">
              <span class="text-yellow-300 mr-3 text-xl">✓</span>
              Up to 6 hours rental
            </li>
            <li class="flex items-center font-bold">
              <span class="text-yellow-300 mr-3 text-xl">✓</span>
              Free delivery & setup
            </li>
            <li class="flex items-center font-bold">
              <span class="text-yellow-300 mr-3 text-xl">✓</span>
              Tables & chairs (10 sets)
            </li>
            <li class="flex items-center font-bold">
              <span class="text-yellow-300 mr-3 text-xl">✓</span>
              Cotton candy machine
            </li>
          </ul>
          <a href="#book" class="block w-full bg-yellow-400 hover:bg-yellow-300 text-pink-600 text-center px-6 py-4 rounded-full font-black text-xl shadow-xl transform hover:scale-105 transition">
            YES! I WANT THIS! 🎉
          </a>
        </div>

        <div class="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-400">
          <div class="text-center mb-6">
            <div class="text-6xl mb-4">👑</div>
            <h4 class="text-3xl font-black text-gray-900 mb-2">VIP Experience</h4>
            <p class="text-5xl font-black text-purple-500 mb-2">$699</p>
            <p class="text-gray-600 font-semibold">The ultimate party!</p>
          </div>
          <ul class="space-y-3 mb-8">
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              3 Bounce Houses (your choice)
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              ALL DAY rental (8 hours)
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              Free delivery & setup
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              Tables & chairs (20 sets)
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              Popcorn & cotton candy
            </li>
            <li class="flex items-center font-bold text-gray-700">
              <span class="text-purple-500 mr-3 text-xl">✓</span>
              Party attendant included!
            </li>
          </ul>
          <a href="#book" class="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-center px-6 py-4 rounded-full font-black text-xl shadow-xl transform hover:scale-105 transition">
            GO VIP!
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-5xl md:text-6xl font-black text-gray-900 mb-4">
          Parents <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">LOVE</span> Us!
        </h3>
        <p class="text-2xl text-gray-600 font-bold">Check out these 5-star reviews! ⭐⭐⭐⭐⭐</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-3xl shadow-xl border-4 border-pink-200">
          <div class="flex mb-4">
            <span class="text-3xl">⭐⭐⭐⭐⭐</span>
          </div>
          <p class="text-xl text-gray-700 mb-6 font-semibold italic">
            "OMG! Best birthday party EVER! My daughter and her friends bounced for HOURS! The princess castle was absolutely perfect. Clean, safe, and SO much fun! Booking again next year for sure!"
          </p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-white font-black text-xl mr-4">
              J
            </div>
            <div>
              <p class="font-black text-gray-900 text-lg">Jessica Martinez</p>
              <p class="text-gray-600 font-semibold">Mom of 3, Phoenix AZ</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-xl border-4 border-yellow-200">
          <div class="flex mb-4">
            <span class="text-3xl">⭐⭐⭐⭐⭐</span>
          </div>
          <p class="text-xl text-gray-700 mb-6 font-semibold italic">
            "These guys are AMAZING! On time, professional, and the water slide was incredible! All the kids had a blast and I'm already planning our next party with them. Highly recommend! 🎉"
          </p>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-black text-xl mr-4">
              M
            </div>
            <div>
              <p class="font-black text-gray-900 text-lg">Mike Johnson</p>
              <p class="text-gray-600 font-semibold">Dad, Scottsdale AZ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="contact" class="py-20 playful-gradient text-white relative overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-5 left-5 text-6xl">🎈</div>
      <div class="absolute top-20 right-10 text-5xl">🎉</div>
      <div class="absolute bottom-5 left-1/3 text-7xl">🎊</div>
      <div class="absolute bottom-20 right-5 text-6xl">🎁</div>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h3 class="text-5xl md:text-7xl font-black mb-6">
        Ready to PARTY?! 🎉
      </h3>
      <p class="text-3xl mb-12 font-bold">
        Let's make your next party UNFORGETTABLE!
      </p>

      <div class="flex flex-col sm:flex-row gap-6 justify-center mb-16">
        <a href="#book" class="bg-yellow-400 hover:bg-yellow-300 text-pink-600 px-12 py-6 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition inline-block">
          BOOK ONLINE NOW! 🚀
        </a>
        <a href="tel:555-987-6543" class="bg-white hover:bg-gray-100 text-pink-500 px-12 py-6 rounded-full text-2xl font-black shadow-2xl transform hover:scale-105 transition inline-block">
          CALL (555) 987-6543! 📞
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <div class="text-5xl mb-3">📧</div>
          <h4 class="font-black text-xl mb-2">Email Us</h4>
          <p class="font-semibold">party@funtimebounce.com</p>
        </div>

        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <div class="text-5xl mb-3">📞</div>
          <h4 class="font-black text-xl mb-2">Call or Text</h4>
          <p class="font-semibold">(555) 987-6543</p>
        </div>

        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
          <div class="text-5xl mb-3">📍</div>
          <h4 class="font-black text-xl mb-2">Visit Us</h4>
          <p class="font-semibold">789 Fun Street, Phoenix AZ</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center mr-3">
              <span class="text-xl">🎉</span>
            </div>
            <h3 class="text-2xl font-black">FunTime Bounce</h3>
          </div>
          <p class="text-gray-400 font-semibold">Making parties MEGA fun since 2018! 🎈</p>
        </div>

        <div>
          <h4 class="font-black text-lg mb-4">Quick Links</h4>
          <ul class="space-y-2 font-semibold text-gray-300">
            <li><a href="#bounce-houses" class="hover:text-pink-400 transition">Bounce Houses</a></li>
            <li><a href="#packages" class="hover:text-pink-400 transition">Party Packages</a></li>
            <li><a href="#gallery" class="hover:text-pink-400 transition">Gallery</a></li>
            <li><a href="#contact" class="hover:text-pink-400 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-lg mb-4">Rentals</h4>
          <ul class="space-y-2 font-semibold text-gray-300">
            <li><a href="#" class="hover:text-pink-400 transition">Bounce Houses</a></li>
            <li><a href="#" class="hover:text-pink-400 transition">Water Slides</a></li>
            <li><a href="#" class="hover:text-pink-400 transition">Obstacle Courses</a></li>
            <li><a href="#" class="hover:text-pink-400 transition">Party Add-ons</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-black text-lg mb-4">Follow the Fun!</h4>
          <div class="flex space-x-4">
            <a href="#" class="bg-pink-500 hover:bg-pink-400 w-12 h-12 rounded-full flex items-center justify-center transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="bg-gradient-to-br from-pink-500 to-yellow-500 hover:from-pink-400 hover:to-yellow-400 w-12 h-12 rounded-full flex items-center justify-center transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 text-center">
        <p class="text-gray-400 font-semibold">&copy; 2025 FunTime Bounce. All rights reserved. Let's PARTY! 🎉</p>
      </div>
    </div>
  </footer>

</body>
</html>`
}
