import type { GrapesJSTemplate } from './index'
import { templatePreviews, getTemplateThumbnail } from './template-previews'

export const starterClassic: GrapesJSTemplate = {
  id: 'starter-classic',
  name: 'Classic Starter',
  description: 'Clean, professional design perfect for any rental business. Traditional layout with modern touches.',
  category: 'Starter',
  tags: ['professional', 'clean', 'traditional', 'responsive'],
  preview: templatePreviews['starter-classic'],
  thumbnail: getTemplateThumbnail('starter-classic'),
  config: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#10b981',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    features: [
      'Mobile responsive',
      'SEO optimized structure',
      'Fast loading',
      'Accessible design',
      'Easy to customize'
    ]
  },
  html: `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Party Rentals - Bounce Houses & More</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .hero-gradient { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); }
  </style>
</head>
<body class="antialiased">

  <!-- Navigation -->
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-blue-600">JumpJoy Rentals</h1>
          </div>
          <div class="hidden md:block ml-10">
            <div class="flex items-baseline space-x-8">
              <a href="#rentals" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">Our Rentals</a>
              <a href="#how-it-works" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">How It Works</a>
              <a href="#testimonials" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">Reviews</a>
              <a href="#contact" class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">Contact</a>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <a href="#book-now" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition">
            Book Now
          </a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-gradient text-white py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Make Every Party Unforgettable
        </h2>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Premium bounce houses and party rentals delivered to your door. Safe, clean, and guaranteed fun for all ages.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#rentals" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition inline-block">
            Browse Rentals
          </a>
          <a href="#contact" class="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition inline-block">
            Get a Quote
          </a>
        </div>
        <div class="mt-12 flex flex-wrap justify-center gap-8 text-sm">
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Insured & Licensed</span>
          </div>
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>Cleaned & Sanitized</span>
          </div>
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>On-Time Delivery</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Rentals -->
  <section id="rentals" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Rentals</h3>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from our wide selection of bounce houses, water slides, and party equipment
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Rental Card 1 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <div class="text-white text-center">
              <svg class="w-32 h-32 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
              <p class="text-sm font-semibold uppercase tracking-wide">Princess Castle</p>
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Princess Castle Bounce House</h4>
            <p class="text-gray-600 mb-4">Perfect for princess-themed parties. Features turrets, flags, and vibrant pink colors.</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Starting at</p>
                <p class="text-3xl font-bold text-blue-600">$199</p>
              </div>
              <a href="#book-now" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Book Now
              </a>
            </div>
          </div>
        </div>

        <!-- Rental Card 2 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <div class="text-white text-center">
              <svg class="w-32 h-32 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm font-semibold uppercase tracking-wide">Tropical Water Slide</p>
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Tropical Water Slide</h4>
            <p class="text-gray-600 mb-4">Beat the heat with our 18ft water slide. Includes splash pool at the bottom.</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Starting at</p>
                <p class="text-3xl font-bold text-blue-600">$299</p>
              </div>
              <a href="#book-now" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Book Now
              </a>
            </div>
          </div>
        </div>

        <!-- Rental Card 3 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
          <div class="h-64 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <div class="text-white text-center">
              <svg class="w-32 h-32 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
              </svg>
              <p class="text-sm font-semibold uppercase tracking-wide">Obstacle Course</p>
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-2xl font-bold text-gray-900 mb-2">Adventure Obstacle Course</h4>
            <p class="text-gray-600 mb-4">Challenge your guests with tunnels, climbs, and slides in this 30ft course.</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Starting at</p>
                <p class="text-3xl font-bold text-blue-600">$349</p>
              </div>
              <a href="#book-now" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section id="how-it-works" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Booking your party rental is simple and stress-free
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-blue-600">1</span>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Choose Your Rental</h4>
          <p class="text-gray-600">Browse our selection and pick the perfect bounce house for your event</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-blue-600">2</span>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Select Your Date</h4>
          <p class="text-gray-600">Check availability and choose your delivery and pickup times</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-blue-600">3</span>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">Confirm Booking</h4>
          <p class="text-gray-600">Pay your deposit securely online and receive instant confirmation</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-green-600">4</span>
          </div>
          <h4 class="text-xl font-bold text-gray-900 mb-2">We Deliver & Setup</h4>
          <p class="text-gray-600">Sit back while we deliver, setup, and make sure everything is perfect</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section id="testimonials" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h3>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Don't just take our word for it - hear from happy party hosts
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-xl shadow-md">
          <div class="flex mb-4">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mb-4 italic">"Best party rental experience ever! The bounce house was clean, delivered on time, and the kids had a blast. Will definitely book again!"</p>
          <p class="font-semibold text-gray-900">Sarah M.</p>
          <p class="text-sm text-gray-500">Birthday Party, Los Angeles</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md">
          <div class="flex mb-4">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mb-4 italic">"Professional service from start to finish. The water slide was a huge hit at our company picnic. Highly recommend!"</p>
          <p class="font-semibold text-gray-900">Michael Chen</p>
          <p class="text-sm text-gray-500">Corporate Event, San Diego</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md">
          <div class="flex mb-4">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <p class="text-gray-600 mb-4 italic">"Amazing selection and great prices. The obstacle course made my son's 8th birthday unforgettable. Thank you!"</p>
          <p class="font-semibold text-gray-900">Jessica Rodriguez</p>
          <p class="text-sm text-gray-500">Kids Birthday, Phoenix</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="py-20 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <p class="text-xl text-gray-600">Everything you need to know about renting from us</p>
      </div>

      <div class="space-y-6">
        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-bold text-gray-900 mb-2">How far in advance should I book?</h4>
          <p class="text-gray-600">We recommend booking at least 2 weeks in advance, especially for weekends and peak season. However, we often have last-minute availability!</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-bold text-gray-900 mb-2">What's included in the rental price?</h4>
          <p class="text-gray-600">All rentals include delivery, setup, takedown, and safety equipment. We also provide extension cords and stakes/sandbags for securing the unit.</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-bold text-gray-900 mb-2">Do you clean the bounce houses?</h4>
          <p class="text-gray-600">Absolutely! Every unit is thoroughly cleaned and sanitized before and after each rental. Safety and hygiene are our top priorities.</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-6">
          <h4 class="text-lg font-bold text-gray-900 mb-2">What if it rains on my event day?</h4>
          <p class="text-gray-600">We monitor weather closely. If severe weather is forecasted, we'll work with you to reschedule at no charge. Light rain is usually okay for most inflatables.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact/CTA Section -->
  <section id="contact" class="py-20 hero-gradient text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h3 class="text-3xl md:text-4xl font-bold mb-4">Ready to Make Your Event Amazing?</h3>
      <p class="text-xl mb-8 text-blue-100">Book online in minutes or call us for a custom quote</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <a href="#book-now" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition inline-block">
          Book Online Now
        </a>
        <a href="tel:555-123-4567" class="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition inline-block">
          Call (555) 123-4567
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <svg class="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          <h4 class="font-semibold mb-1">Email Us</h4>
          <p class="text-blue-100">info@jumpjoyrentals.com</p>
        </div>

        <div>
          <svg class="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          <h4 class="font-semibold mb-1">Call Us</h4>
          <p class="text-blue-100">(555) 123-4567</p>
        </div>

        <div>
          <svg class="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
          <h4 class="font-semibold mb-1">Visit Us</h4>
          <p class="text-blue-100">123 Party Lane, Fun City, CA</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-gray-300 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-white text-xl font-bold mb-4">JumpJoy Rentals</h3>
          <p class="text-sm">Making parties unforgettable since 2015. Your trusted bounce house rental partner.</p>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#rentals" class="hover:text-white transition">Our Rentals</a></li>
            <li><a href="#how-it-works" class="hover:text-white transition">How It Works</a></li>
            <li><a href="#testimonials" class="hover:text-white transition">Reviews</a></li>
            <li><a href="#contact" class="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Services</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition">Bounce Houses</a></li>
            <li><a href="#" class="hover:text-white transition">Water Slides</a></li>
            <li><a href="#" class="hover:text-white transition">Obstacle Courses</a></li>
            <li><a href="#" class="hover:text-white transition">Party Packages</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-4">Connect</h4>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-white transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="hover:text-white transition">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 text-sm text-center">
        <p>&copy; 2025 JumpJoy Rentals. All rights reserved. | <a href="#" class="hover:text-white">Privacy Policy</a> | <a href="#" class="hover:text-white">Terms of Service</a></p>
      </div>
    </div>
  </footer>

</body>
</html>`
}
