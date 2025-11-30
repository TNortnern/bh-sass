<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden">
      <!-- Animated background gradient -->
      <div class="absolute inset-0 hero-gradient"></div>

      <!-- Floating decorative elements -->
      <div class="absolute top-20 left-10 opacity-20 animate-float">
        <UIcon name="i-lucide-party-popper" class="w-24 h-24 text-primary-500" />
      </div>
      <div class="absolute top-40 right-20 opacity-20 animate-float stagger-2">
        <UIcon name="i-lucide-sparkles" class="w-32 h-32 text-primary-400" />
      </div>
      <div class="absolute bottom-20 right-40 opacity-10 animate-bounce-subtle stagger-3">
        <UIcon name="i-lucide-tent" class="w-28 h-28 text-secondary-500" />
      </div>

      <div class="container mx-auto px-4 py-20 sm:py-32 relative z-10">
        <div class="max-w-5xl mx-auto text-center">
          <!-- Badge -->
          <div class="mb-8 animate-slide-up">
            <UBadge
              color="primary"
              variant="subtle"
              size="lg"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              <UIcon name="i-lucide-rocket" class="w-4 h-4" />
              The #1 Party Rental Platform
            </UBadge>
          </div>

          <!-- Main Headline -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up stagger-1">
            Launch Your
            <span class="gradient-text block mt-2">
              Bounce House Empire
            </span>
          </h1>

          <!-- Subheadline -->
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up stagger-2">
            Run your party rental business on autopilot. Online bookings, automated scheduling,
            and payments—all in one ridiculously easy platform.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up stagger-3">
            <UButton
              size="xl"
              color="primary"
              class="btn-ripple px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              @click="(e) => createRipple?.(e)"
            >
              <UIcon name="i-lucide-zap" class="w-5 h-5" />
              Start Free Trial
            </UButton>
            <UButton
              size="xl"
              color="gray"
              variant="outline"
              class="btn-ripple px-8 py-4 text-lg font-semibold"
              @click="(e) => createRipple?.(e)"
            >
              <UIcon name="i-lucide-play-circle" class="w-5 h-5" />
              Watch Demo
            </UButton>
          </div>

          <!-- Hero Visual -->
          <div class="reveal relative animate-slide-up stagger-4">
            <div class="glass rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto border-2 border-primary-200/30 dark:border-primary-800/30">
              <div class="aspect-video rounded-xl bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-primary-600/20 flex items-center justify-center">
                <div class="text-center space-y-4">
                  <UIcon name="i-lucide-calendar-check" class="w-20 h-20 text-primary-500 mx-auto animate-bounce-subtle" />
                  <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Beautiful Dashboard Preview
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Proof -->
          <div class="mt-16 animate-fade-in stagger-5">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by 1,000+ party rental businesses</p>
            <div class="flex justify-center gap-8 items-center opacity-60">
              <div class="flex gap-1">
                <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-5 h-5 fill-primary-500 text-primary-500" />
              </div>
              <span class="text-sm font-medium">4.9/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16 reveal">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need to
              <span class="gradient-text">Grow Your Business</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stop juggling spreadsheets and phone calls. Manage your entire operation from one powerful platform.
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard
              v-for="(feature, index) in features"
              :key="index"
              class="card-hover reveal bg-white dark:bg-gray-800"
              :ui="{ body: { padding: 'p-6 sm:p-8' } }"
            >
              <div class="space-y-4">
                <div class="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <UIcon :name="feature.icon" class="w-7 h-7 text-primary-500" />
                </div>
                <h3 class="text-xl font-bold">{{ feature.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
                <div class="pt-2">
                  <UBadge :color="feature.badgeColor" variant="subtle" size="sm">
                    {{ feature.badge }}
                  </UBadge>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 sm:py-32 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-20 reveal">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4">
              Get Started in
              <span class="gradient-text">3 Simple Steps</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              From signup to first booking in under 5 minutes
            </p>
          </div>

          <!-- Steps -->
          <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="reveal text-center"
            >
              <div class="relative mb-6">
                <!-- Step number -->
                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg animate-bounce-subtle">
                  {{ index + 1 }}
                </div>
                <!-- Connector line (hidden on last item) -->
                <div
                  v-if="index < steps.length - 1"
                  class="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-primary-300 to-primary-200 dark:from-primary-700 dark:to-primary-800"
                ></div>
              </div>

              <div class="glass rounded-2xl p-6 h-full">
                <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <UIcon :name="step.icon" class="w-8 h-8 text-primary-500" />
                </div>
                <h3 class="text-2xl font-bold mb-3">{{ step.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <!-- Time indicator -->
          <div class="mt-16 text-center reveal">
            <div class="inline-flex items-center gap-3 glass rounded-full px-6 py-3">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-primary-500" />
              <span class="font-semibold">Average setup time: 2 minutes 34 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900/50">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16 reveal">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4">
              Simple, Transparent
              <span class="gradient-text">Pricing</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              Start free, upgrade as you grow. No hidden fees, ever.
            </p>
          </div>

          <!-- Pricing Cards -->
          <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <UCard
              v-for="(plan, index) in pricingPlans"
              :key="index"
              class="card-hover reveal relative"
              :class="[
                plan.popular ? 'ring-2 ring-primary-500 shadow-xl scale-105' : '',
                'bg-white dark:bg-gray-800'
              ]"
              :ui="{ body: { padding: 'p-8' } }"
            >
              <!-- Popular Badge -->
              <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2">
                <UBadge color="primary" size="lg" class="px-4 py-1">
                  <UIcon name="i-lucide-star" class="w-3 h-3" />
                  Most Popular
                </UBadge>
              </div>

              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold">${{ plan.price }}</span>
                    <span class="text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 mt-2">{{ plan.description }}</p>
                </div>

                <UButton
                  :color="plan.popular ? 'primary' : 'gray'"
                  :variant="plan.popular ? 'solid' : 'outline'"
                  size="lg"
                  block
                  class="btn-ripple"
                  @click="(e) => createRipple?.(e)"
                >
                  {{ plan.cta }}
                </UButton>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  <div v-for="(feature, fIndex) in plan.features" :key="fIndex" class="flex items-start gap-3">
                    <UIcon
                      :name="feature.included ? 'i-lucide-check-circle' : 'i-lucide-minus-circle'"
                      :class="feature.included ? 'text-primary-500' : 'text-gray-400'"
                      class="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <span :class="feature.included ? '' : 'text-gray-400'">{{ feature.text }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Enterprise notice -->
          <div class="mt-12 text-center reveal">
            <p class="text-gray-600 dark:text-gray-300">
              Need custom solutions?
              <a href="#" class="text-primary-500 font-semibold hover:underline">Contact us for Enterprise</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 sm:py-32 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16 reveal">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4">
              Loved by
              <span class="gradient-text">Party Pros</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">
              See what rental business owners are saying
            </p>
          </div>

          <!-- Testimonials Grid -->
          <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <UCard
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="card-hover reveal bg-white dark:bg-gray-800"
              :ui="{ body: { padding: 'p-8' } }"
            >
              <div class="space-y-4">
                <!-- Stars -->
                <div class="flex gap-1">
                  <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-4 h-4 fill-primary-500 text-primary-500" />
                </div>

                <!-- Quote -->
                <p class="text-gray-700 dark:text-gray-300 italic">
                  "{{ testimonial.quote }}"
                </p>

                <!-- Author -->
                <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                    {{ testimonial.initial }}
                  </div>
                  <div>
                    <div class="font-semibold">{{ testimonial.author }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.company }}</div>
                  </div>
                </div>

                <!-- Metric -->
                <div class="glass rounded-lg px-4 py-3">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ testimonial.metric }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">{{ testimonial.metricLabel }}</div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-20 sm:py-32 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950"></div>

      <!-- Decorative elements -->
      <div class="absolute top-10 right-10 opacity-10 animate-float">
        <UIcon name="i-lucide-party-popper" class="w-40 h-40 text-white" />
      </div>
      <div class="absolute bottom-10 left-10 opacity-10 animate-bounce-subtle stagger-2">
        <UIcon name="i-lucide-sparkles" class="w-32 h-32 text-white" />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center text-white">
          <div class="reveal">
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Transform Your
              <span class="block mt-2">Party Rental Business?</span>
            </h2>
            <p class="text-xl sm:text-2xl mb-12 text-primary-100">
              Join 1,000+ rental businesses already growing with BouncePro
            </p>

            <!-- Email Signup -->
            <div class="max-w-md mx-auto mb-8">
              <div class="flex flex-col sm:flex-row gap-3">
                <UInput
                  v-model="email"
                  placeholder="Enter your email"
                  size="xl"
                  icon="i-lucide-mail"
                  class="flex-1"
                  :ui="{
                    base: 'bg-white/10 backdrop-blur text-white placeholder-white/60 border-white/20',
                    icon: { trailing: { pointer: '' } }
                  }"
                />
                <UButton
                  size="xl"
                  color="white"
                  class="btn-ripple px-8 font-semibold"
                  @click="(e) => createRipple?.(e)"
                >
                  Get Started Free
                  <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
                </UButton>
              </div>
              <p class="text-sm text-primary-100 mt-3">
                No credit card required. 14-day free trial.
              </p>
            </div>

            <!-- Trust badges -->
            <div class="flex flex-wrap justify-center gap-6 items-center text-sm text-primary-100">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield-check" class="w-5 h-5" />
                <span>SSL Secured</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-lock" class="w-5 h-5" />
                <span>GDPR Compliant</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-zap" class="w-5 h-5" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 dark:bg-black text-gray-300 py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8 mb-12">
            <!-- Brand -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <UIcon name="i-lucide-tent" class="w-6 h-6 text-white" />
                </div>
                <span class="text-2xl font-bold text-white">BouncePro</span>
              </div>
              <p class="text-sm">
                The modern platform for party rental businesses. Automate bookings, payments, and operations.
              </p>
              <div class="flex gap-3">
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-twitter" class="w-4 h-4" />
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-facebook" class="w-4 h-4" />
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-instagram" class="w-4 h-4" />
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                  <UIcon name="i-lucide-linkedin" class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- Product -->
            <div>
              <h4 class="font-semibold text-white mb-4">Product</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-primary-400 transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Integrations</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Changelog</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <!-- Company -->
            <div>
              <h4 class="font-semibold text-white mb-4">Company</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Blog</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Careers</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Contact</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Partners</a></li>
              </ul>
            </div>

            <!-- Resources -->
            <div>
              <h4 class="font-semibold text-white mb-4">Resources</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-primary-400 transition-colors">Help Center</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Documentation</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">API Reference</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Community</a></li>
                <li><a href="#" class="hover:text-primary-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom bar -->
          <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© 2025 BouncePro. All rights reserved.</p>
            <div class="flex gap-6">
              <a href="#" class="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-primary-400 transition-colors">Terms of Service</a>
              <a href="#" class="hover:text-primary-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Email for CTA
const email = ref('')

// Create ripple effect
const createRipple = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('ripple-effect')

  button.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)
}

// Make ripple available globally
if (process.client) {
  (window as any).createRipple = createRipple
}

// Features data
const features = [
  {
    icon: 'i-lucide-globe',
    title: 'Online Booking Widget',
    description: 'Embed a beautiful booking form on your website. Customers can browse, select, and book 24/7.',
    badge: 'No-Code',
    badgeColor: 'primary'
  },
  {
    icon: 'i-lucide-package',
    title: 'Inventory Management',
    description: 'Track all your inflatables, availability, maintenance schedules, and utilization rates.',
    badge: 'Real-time',
    badgeColor: 'secondary'
  },
  {
    icon: 'i-lucide-calendar-clock',
    title: 'Smart Scheduling',
    description: 'Automated booking calendar prevents double-bookings and optimizes delivery routes.',
    badge: 'AI-Powered',
    badgeColor: 'primary'
  },
  {
    icon: 'i-lucide-user-circle',
    title: 'Customer Portal',
    description: 'Self-service portal where customers can manage bookings, make payments, and leave reviews.',
    badge: 'Self-Service',
    badgeColor: 'secondary'
  },
  {
    icon: 'i-lucide-credit-card',
    title: 'Payment Processing',
    description: 'Accept deposits, full payments, and refunds. Automatic invoicing and payment reminders.',
    badge: 'Secure',
    badgeColor: 'primary'
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Analytics Dashboard',
    description: 'Track revenue, popular items, seasonal trends, and customer insights in real-time.',
    badge: 'Insights',
    badgeColor: 'secondary'
  }
]

// Steps data
const steps = [
  {
    icon: 'i-lucide-user-plus',
    title: 'Sign Up Free',
    description: 'Create your account in 30 seconds. No credit card required to get started.'
  },
  {
    icon: 'i-lucide-upload',
    title: 'Add Inventory',
    description: 'Upload your bounce houses, tents, and party equipment with photos and pricing.'
  },
  {
    icon: 'i-lucide-rocket',
    title: 'Start Booking',
    description: 'Share your booking link and watch reservations roll in automatically.'
  }
]

// Pricing plans
const pricingPlans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for testing the waters',
    cta: 'Start Free',
    popular: false,
    features: [
      { text: '1 rental item', included: true },
      { text: 'Basic booking widget', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Manual payments', included: true },
      { text: 'Payment processing', included: false },
      { text: 'Analytics dashboard', included: false }
    ]
  },
  {
    name: 'Professional',
    price: 29,
    description: 'For growing rental businesses',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      { text: 'Up to 25 rental items', included: true },
      { text: 'Advanced booking widget', included: true },
      { text: 'Automated scheduling', included: true },
      { text: 'Payment processing', included: true },
      { text: 'Customer portal', included: true },
      { text: 'Analytics & reports', included: true }
    ]
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For established operations',
    cta: 'Contact Sales',
    popular: false,
    features: [
      { text: 'Unlimited rental items', included: true },
      { text: 'White-label solution', included: true },
      { text: 'Custom domain', included: true },
      { text: 'Priority support', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated account manager', included: true }
    ]
  }
]

// Testimonials
const testimonials = [
  {
    quote: 'BouncePro transformed our business. We went from answering calls all day to automated bookings while we sleep. Revenue is up 3x in 6 months.',
    author: 'Sarah Martinez',
    company: 'Party Paradise Rentals',
    initial: 'S',
    metric: '3x',
    metricLabel: 'Revenue Growth'
  },
  {
    quote: 'The scheduling system alone saved us 15 hours per week. No more double-bookings, no more spreadsheets. This is the future of rental management.',
    author: 'Mike Chen',
    company: 'Jump Zone Events',
    initial: 'M',
    metric: '15h',
    metricLabel: 'Time Saved/Week'
  },
  {
    quote: 'Our customers love the self-service portal. They can book, pay, and manage everything themselves. We look way more professional now.',
    author: 'Jessica Williams',
    company: 'Bounce Kingdom',
    initial: 'J',
    metric: '98%',
    metricLabel: 'Customer Satisfaction'
  }
]

// Intersection Observer for reveal animations
onMounted(() => {
  if (process.client) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const reveals = document.querySelectorAll('.reveal')
    reveals.forEach((reveal) => observer.observe(reveal))

    onUnmounted(() => {
      reveals.forEach((reveal) => observer.unobserve(reveal))
    })
  }
})

// SEO Meta
useHead({
  title: 'BouncePro - Party Rental Software | Bounce House Management Platform',
  meta: [
    {
      name: 'description',
      content: 'Run your party rental business on autopilot with BouncePro. Online bookings, automated scheduling, inventory management, and payment processing in one platform.'
    }
  ]
})
</script>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Ensure animations start hidden */
.reveal {
  opacity: 0;
  transform: translateY(20px);
}

/* Override for elements that should start visible */
.animate-slide-up,
.animate-fade-in,
.animate-scale-in {
  opacity: 0;
}
</style>
