<template>
  <div class="landing-page bg-white dark:bg-gray-950">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <UIcon name="i-lucide-tent" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">BouncePro</span>
          </div>
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">Features</a>
            <a href="#pricing" class="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">Pricing</a>
            <a href="#testimonials" class="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">Testimonials</a>
          </div>
          <div class="flex items-center gap-3">
            <UButton color="neutral" variant="ghost" to="/auth/login">Sign In</UButton>
            <UButton color="primary" to="/auth/register">Get Started</UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden pt-24">
      <!-- Animated background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>

      <!-- Floating decorative elements -->
      <div class="absolute top-32 left-10 opacity-20 animate-float hidden lg:block">
        <UIcon name="i-lucide-party-popper" class="w-24 h-24 text-orange-500" />
      </div>
      <div class="absolute top-48 right-20 opacity-20 animate-float-delayed hidden lg:block">
        <UIcon name="i-lucide-sparkles" class="w-32 h-32 text-orange-400" />
      </div>
      <div class="absolute bottom-32 right-40 opacity-10 animate-bounce-subtle hidden lg:block">
        <UIcon name="i-lucide-tent" class="w-28 h-28 text-sky-500" />
      </div>

      <div class="container mx-auto px-4 py-20 sm:py-32 relative z-10">
        <div class="max-w-5xl mx-auto text-center">
          <!-- Badge -->
          <div class="mb-8">
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
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
            Launch Your
            <span class="block mt-2 bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 bg-clip-text text-transparent">
              Bounce House Empire
            </span>
          </h1>

          <!-- Subheadline -->
          <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Run your party rental business on autopilot. Online bookings, automated scheduling,
            and payments—all in one ridiculously easy platform.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <UButton
              size="xl"
              color="primary"
              to="/auth/register"
              class="btn-ripple px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <UIcon name="i-lucide-zap" class="w-5 h-5" />
              Start Free Trial
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              class="btn-ripple px-8 py-4 text-lg font-semibold"
              @click="handleRipple"
            >
              <UIcon name="i-lucide-play" class="w-5 h-5" />
              Watch Demo
            </UButton>
          </div>

          <!-- Hero Visual -->
          <div class="relative">
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
              <div class="aspect-video rounded-xl bg-gradient-to-br from-orange-100 via-sky-50 to-orange-50 dark:from-orange-900/20 dark:via-sky-900/20 dark:to-orange-900/20 flex items-center justify-center">
                <div class="text-center space-y-4">
                  <UIcon name="i-lucide-calendar-check" class="w-20 h-20 text-orange-500 mx-auto animate-bounce-subtle" />
                  <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Beautiful Dashboard Preview
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Proof -->
          <div class="mt-16">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by 1,000+ party rental businesses</p>
            <div class="flex justify-center gap-8 items-center">
              <div class="flex gap-1">
                <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">4.9/5 from 500+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need to
              <span class="bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">Grow Your Business</span>
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
              class="card-hover bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              :ui="{ body: { padding: 'p-6 sm:p-8' } }"
            >
              <div class="space-y-4">
                <div class="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <UIcon :name="feature.icon" class="w-7 h-7 text-orange-500" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ feature.title }}</h3>
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
    <section class="py-20 sm:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
      <div class="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-sky-50/50 dark:from-orange-950/10 dark:to-sky-950/10"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Get Started in
              <span class="bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">3 Simple Steps</span>
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
              class="text-center"
            >
              <div class="relative mb-6">
                <!-- Step number -->
                <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  {{ index + 1 }}
                </div>
                <!-- Connector line (hidden on last item) -->
                <div
                  v-if="index < steps.length - 1"
                  class="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-200 dark:from-orange-700 dark:to-orange-800"
                ></div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <UIcon :name="step.icon" class="w-8 h-8 text-orange-500" />
                </div>
                <h3 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{{ step.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <!-- Time indicator -->
          <div class="mt-16 text-center">
            <div class="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
              <UIcon name="i-lucide-clock" class="w-5 h-5 text-orange-500" />
              <span class="font-semibold text-gray-900 dark:text-white">Average setup time: 2 minutes 34 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Simple, Transparent
              <span class="bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">Pricing</span>
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
              class="card-hover relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              :class="plan.popular ? 'ring-2 ring-orange-500 shadow-xl md:scale-105' : ''"
              :ui="{ body: { padding: 'p-8' } }"
            >
              <!-- Popular Badge -->
              <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2">
                <UBadge color="primary" size="lg" class="px-4 py-1">
                  <UIcon name="i-lucide-star" class="w-3 h-3 mr-1" />
                  Most Popular
                </UBadge>
              </div>

              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{{ plan.name }}</h3>
                  <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold text-gray-900 dark:text-white">${{ plan.price }}</span>
                    <span class="text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 mt-2">{{ plan.description }}</p>
                </div>

                <UButton
                  :color="plan.popular ? 'primary' : 'neutral'"
                  :variant="plan.popular ? 'solid' : 'outline'"
                  size="lg"
                  block
                  :to="plan.name === 'Enterprise' ? undefined : '/auth/register'"
                  class="btn-ripple"
                >
                  {{ plan.cta }}
                </UButton>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                  <div v-for="(feature, fIndex) in plan.features" :key="fIndex" class="flex items-start gap-3">
                    <UIcon
                      :name="feature.included ? 'i-lucide-check-circle' : 'i-lucide-x'"
                      :class="feature.included ? 'text-orange-500' : 'text-gray-400'"
                      class="w-5 h-5 mt-0.5 flex-shrink-0"
                    />
                    <span :class="feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'">{{ feature.text }}</span>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Enterprise notice -->
          <div class="mt-12 text-center">
            <p class="text-gray-600 dark:text-gray-300">
              Need custom solutions?
              <a href="#" class="text-orange-500 font-semibold hover:underline">Contact us for Enterprise</a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 sm:py-32 relative overflow-hidden bg-white dark:bg-gray-950">
      <div class="absolute inset-0 bg-gradient-to-tr from-orange-50/30 via-transparent to-sky-50/30 dark:from-orange-950/10 dark:to-sky-950/10"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <h2 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by
              <span class="bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">Party Pros</span>
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
              class="card-hover bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              :ui="{ body: { padding: 'p-8' } }"
            >
              <div class="space-y-4">
                <!-- Stars -->
                <div class="flex gap-1">
                  <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>

                <!-- Quote -->
                <p class="text-gray-700 dark:text-gray-300 italic">
                  "{{ testimonial.quote }}"
                </p>

                <!-- Author -->
                <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    {{ testimonial.initial }}
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white">{{ testimonial.author }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.company }}</div>
                  </div>
                </div>

                <!-- Metric -->
                <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-3">
                  <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ testimonial.metric }}</div>
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
      <div class="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-900"></div>

      <!-- Decorative elements -->
      <div class="absolute top-10 right-10 opacity-10 animate-float hidden lg:block">
        <UIcon name="i-lucide-party-popper" class="w-40 h-40 text-white" />
      </div>
      <div class="absolute bottom-10 left-10 opacity-10 animate-bounce-subtle hidden lg:block">
        <UIcon name="i-lucide-sparkles" class="w-32 h-32 text-white" />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your
            <span class="block mt-2">Party Rental Business?</span>
          </h2>
          <p class="text-xl sm:text-2xl mb-12 text-orange-100">
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
              />
              <UButton
                size="xl"
                color="white"
                to="/auth/register"
                class="btn-ripple px-8 font-semibold text-orange-600"
              >
                Get Started Free
                <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
              </UButton>
            </div>
            <p class="text-sm text-orange-100 mt-3">
              No credit card required. 14-day free trial.
            </p>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-wrap justify-center gap-6 items-center text-sm text-orange-100">
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
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 dark:bg-black text-gray-300 py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8 mb-12">
            <!-- Brand -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <UIcon name="i-lucide-tent" class="w-6 h-6 text-white" />
                </div>
                <span class="text-2xl font-bold text-white">BouncePro</span>
              </div>
              <p class="text-sm">
                The modern platform for party rental businesses. Automate bookings, payments, and operations.
              </p>
            </div>

            <!-- Product -->
            <div>
              <h4 class="font-semibold text-white mb-4">Product</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#features" class="hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#pricing" class="hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Integrations</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <!-- Company -->
            <div>
              <h4 class="font-semibold text-white mb-4">Company</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Blog</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Careers</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <!-- Resources -->
            <div>
              <h4 class="font-semibold text-white mb-4">Resources</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Documentation</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">API Reference</a></li>
                <li><a href="#" class="hover:text-orange-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <!-- Bottom bar -->
          <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2025 BouncePro. All rights reserved.</p>
            <div class="flex gap-6">
              <a href="#" class="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" class="hover:text-orange-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const email = ref('')

// Ripple effect handler
const handleRipple = (event: MouseEvent) => {
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

// Features data
const features = [
  {
    icon: 'i-lucide-globe',
    title: 'Online Booking Widget',
    description: 'Embed a beautiful booking form on your website. Customers can browse, select, and book 24/7.',
    badge: 'No-Code',
    badgeColor: 'primary' as const
  },
  {
    icon: 'i-lucide-box',
    title: 'Inventory Management',
    description: 'Track all your inflatables, availability, maintenance schedules, and utilization rates.',
    badge: 'Real-time',
    badgeColor: 'secondary' as const
  },
  {
    icon: 'i-lucide-calendar-clock',
    title: 'Smart Scheduling',
    description: 'Automated booking calendar prevents double-bookings and optimizes delivery routes.',
    badge: 'AI-Powered',
    badgeColor: 'primary' as const
  },
  {
    icon: 'i-lucide-users',
    title: 'Customer Portal',
    description: 'Self-service portal where customers can manage bookings, make payments, and leave reviews.',
    badge: 'Self-Service',
    badgeColor: 'secondary' as const
  },
  {
    icon: 'i-lucide-credit-card',
    title: 'Payment Processing',
    description: 'Accept deposits, full payments, and refunds. Automatic invoicing and payment reminders.',
    badge: 'Secure',
    badgeColor: 'primary' as const
  },
  {
    icon: 'i-lucide-bar-chart-3',
    title: 'Analytics Dashboard',
    description: 'Track revenue, popular items, seasonal trends, and customer insights in real-time.',
    badge: 'Insights',
    badgeColor: 'secondary' as const
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
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
}

/* Ripple effect */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

:deep(.ripple-effect) {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
