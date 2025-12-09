/**
 * Nuxt UI Page Component Blocks for Website Builder
 *
 * Pre-built blocks using Nuxt UI's Page components:
 * - PageHero
 * - PageSection
 * - PageCTA
 * - PageCard
 * - PageGrid
 */

export interface NuxtUIBlock {
  id: string
  name: string
  category: 'hero' | 'section' | 'cta' | 'features' | 'testimonials' | 'pricing' | 'footer'
  description: string
  icon: string
  // Template is Vue component code
  template: string
  // Default data for the block
  defaultData: Record<string, unknown>
  // Whether this block supports auto-populate from business data
  supportsAutoPopulate: boolean
  // Section type for auto-populate matching
  autoPopulateType?: string
}

export const nuxtUIBlocks: NuxtUIBlock[] = [
  // HERO BLOCKS
  {
    id: 'nuxt-hero-centered',
    name: 'Hero - Centered',
    category: 'hero',
    description: 'Full-width hero with centered text and CTA buttons',
    icon: 'i-lucide-layout-template',
    template: `<UPageHero
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  :links="data.links"
  orientation="vertical"
>
  <template v-if="data.image" #default>
    <img :src="data.image" :alt="data.title" class="rounded-xl shadow-2xl ring ring-default" />
  </template>
</UPageHero>`,
    defaultData: {
      headline: 'Party Rentals',
      title: 'Make Your Event Unforgettable',
      description: 'Premium bounce houses, water slides, and party equipment delivered right to your door. Trusted by thousands of families.',
      links: [
        { label: 'View Rentals', color: 'primary', size: 'xl' },
        { label: 'Get a Quote', color: 'neutral', variant: 'outline', size: 'xl' }
      ],
      image: ''
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'HeroFullWidth'
  },
  {
    id: 'nuxt-hero-split',
    name: 'Hero - Split Layout',
    category: 'hero',
    description: 'Hero with image on the side',
    icon: 'i-lucide-columns',
    template: `<UPageHero
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  :links="data.links"
  orientation="horizontal"
>
  <UPageCard variant="subtle" class="rounded-lg overflow-hidden">
    <img :src="data.image" :alt="data.title" class="w-full h-auto" />
  </UPageCard>
</UPageHero>`,
    defaultData: {
      headline: 'Trusted Since 2010',
      title: 'Premium Bounce House Rentals',
      description: 'We provide top-quality, sanitized bounce houses and party equipment for birthdays, school events, and corporate gatherings.',
      links: [
        { label: 'Browse Inventory', color: 'primary', size: 'xl' },
        { label: 'Contact Us', color: 'neutral', variant: 'ghost', size: 'xl', trailingIcon: 'i-lucide-arrow-right' }
      ],
      image: '/images/hero-bounce-house.jpg'
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'HeroSplit'
  },

  // FEATURE SECTIONS
  {
    id: 'nuxt-features-grid',
    name: 'Features Grid',
    category: 'features',
    description: '3-column feature cards with icons',
    icon: 'i-lucide-grid-3x3',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  :features="data.features"
  orientation="vertical"
/>`,
    defaultData: {
      headline: 'Why Choose Us',
      title: 'The Best Party Rental Experience',
      description: 'We go above and beyond to make your event stress-free and memorable.',
      features: [
        {
          icon: 'i-lucide-shield-check',
          title: 'Fully Insured',
          description: '$2M liability coverage for your complete peace of mind.'
        },
        {
          icon: 'i-lucide-truck',
          title: 'Free Delivery',
          description: 'Complimentary delivery and setup within 25 miles.'
        },
        {
          icon: 'i-lucide-sparkles',
          title: 'Sanitized Equipment',
          description: 'Thoroughly cleaned and sanitized after every rental.'
        }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'TrustBadges'
  },
  {
    id: 'nuxt-features-horizontal',
    name: 'Features - With Image',
    category: 'features',
    description: 'Feature section with side image',
    icon: 'i-lucide-layout-list',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  :features="data.features"
  orientation="horizontal"
>
  <img :src="data.image" :alt="data.title" class="w-full rounded-lg shadow-lg" />
</UPageSection>`,
    defaultData: {
      headline: 'Our Promise',
      title: 'Quality You Can Trust',
      description: 'Every piece of equipment is inspected, cleaned, and tested before delivery.',
      features: [
        {
          icon: 'i-lucide-check-circle',
          title: 'Safety First',
          description: 'Commercial-grade equipment meeting all safety standards.'
        },
        {
          icon: 'i-lucide-clock',
          title: 'On-Time Delivery',
          description: 'We arrive when we say we will, every time.'
        }
      ],
      image: '/images/quality-equipment.jpg'
    },
    supportsAutoPopulate: false
  },

  // PRODUCT/RENTAL SECTIONS
  {
    id: 'nuxt-products-grid',
    name: 'Products Grid',
    category: 'section',
    description: 'Grid of rental items with images and prices',
    icon: 'i-lucide-shopping-bag',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <UPageGrid>
    <UPageCard
      v-for="item in data.items"
      :key="item.id"
      :title="item.name"
      :description="item.category"
      :to="item.link"
      variant="outline"
    >
      <img :src="item.image" :alt="item.name" class="w-full aspect-video object-cover rounded-lg mb-4" />
      <template #footer>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-primary">{{ item.price }}</span>
          <UButton label="View Details" size="sm" variant="soft" />
        </div>
      </template>
    </UPageCard>
  </UPageGrid>
</UPageSection>`,
    defaultData: {
      headline: 'Our Inventory',
      title: 'Popular Rentals',
      description: 'Browse our most requested bounce houses and party equipment.',
      items: [
        { id: '1', name: 'Princess Castle', category: 'Bounce House', image: '/images/princess-castle.jpg', price: '$199/day', link: '/rentals/princess-castle' },
        { id: '2', name: 'Tropical Water Slide', category: 'Water Slide', image: '/images/water-slide.jpg', price: '$299/day', link: '/rentals/water-slide' },
        { id: '3', name: 'Obstacle Course', category: 'Combo', image: '/images/obstacle-course.jpg', price: '$349/day', link: '/rentals/obstacle-course' }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'FeaturedRentals'
  },

  // CTA SECTIONS
  {
    id: 'nuxt-cta-centered',
    name: 'CTA - Centered',
    category: 'cta',
    description: 'Call-to-action with centered text',
    icon: 'i-lucide-megaphone',
    template: `<UPageCTA
  :title="data.title"
  :description="data.description"
  :links="data.links"
  :variant="data.variant"
  orientation="vertical"
/>`,
    defaultData: {
      title: 'Ready to Book Your Event?',
      description: 'Get started today and make your next party unforgettable. Free quotes, no obligation.',
      links: [
        { label: 'Get a Free Quote', color: 'primary', size: 'xl' },
        { label: 'Call Us Now', color: 'neutral', variant: 'outline', size: 'xl', icon: 'i-lucide-phone' }
      ],
      variant: 'solid'
    },
    supportsAutoPopulate: false
  },
  {
    id: 'nuxt-cta-split',
    name: 'CTA - With Image',
    category: 'cta',
    description: 'Call-to-action with side image',
    icon: 'i-lucide-image',
    template: `<UPageCTA
  :title="data.title"
  :description="data.description"
  :links="data.links"
  :variant="data.variant"
  orientation="horizontal"
>
  <img :src="data.image" :alt="data.title" class="w-full rounded-lg" />
</UPageCTA>`,
    defaultData: {
      title: 'Book Your Party Today',
      description: 'Join thousands of happy families who trust us for their celebrations.',
      links: [
        { label: 'Start Booking', color: 'neutral', size: 'lg' },
        { label: 'Learn More', color: 'neutral', variant: 'subtle', size: 'lg', trailingIcon: 'i-lucide-arrow-right' }
      ],
      variant: 'solid',
      image: '/images/happy-party.jpg'
    },
    supportsAutoPopulate: false
  },

  // TESTIMONIALS
  {
    id: 'nuxt-testimonials-grid',
    name: 'Testimonials Grid',
    category: 'testimonials',
    description: 'Customer testimonials in a grid',
    icon: 'i-lucide-message-square-quote',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <UPageGrid>
    <UPageCard
      v-for="testimonial in data.testimonials"
      :key="testimonial.id"
      :description="testimonial.quote"
      variant="soft"
    >
      <template #footer>
        <UUser
          :name="testimonial.name"
          :description="testimonial.role || ''"
          :avatar="{ src: testimonial.image }"
        />
      </template>
    </UPageCard>
  </UPageGrid>
</UPageSection>`,
    defaultData: {
      headline: 'Testimonials',
      title: 'What Our Customers Say',
      description: 'Hear from families who made their events special with us.',
      testimonials: [
        {
          id: '1',
          quote: '"Amazing service! The bounce house was spotless and the kids had a blast. Will definitely book again!"',
          name: 'Sarah M.',
          role: 'Birthday Party',
          image: ''
        },
        {
          id: '2',
          quote: '"Professional setup and pickup. Great communication throughout. Highly recommend!"',
          name: 'Mike T.',
          role: 'School Event',
          image: ''
        },
        {
          id: '3',
          quote: '"Best party rental company in the area. Fair prices and excellent customer service."',
          name: 'Jennifer L.',
          role: 'Church Festival',
          image: ''
        }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'TestimonialsGrid'
  },

  // CONTACT SECTION
  {
    id: 'nuxt-contact-split',
    name: 'Contact Section',
    category: 'section',
    description: 'Contact info with optional form',
    icon: 'i-lucide-mail',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="horizontal"
>
  <UPageCard variant="subtle" class="p-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-phone" class="text-primary text-xl" />
        <span>{{ data.phone }}</span>
      </div>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-mail" class="text-primary text-xl" />
        <span>{{ data.email }}</span>
      </div>
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-map-pin" class="text-primary text-xl" />
        <span>{{ data.address }}</span>
      </div>
    </div>
  </UPageCard>
</UPageSection>`,
    defaultData: {
      headline: 'Get In Touch',
      title: 'Contact Us',
      description: 'Have questions or ready to book? We\'re here to help make your event amazing.',
      phone: '(555) 123-4567',
      email: 'info@example.com',
      address: '123 Party Lane, Fun City, ST 12345'
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'ContactSection'
  },

  // INVENTORY/PRODUCT SECTIONS
  {
    id: 'nuxt-featured-rentals',
    name: 'Featured Rentals',
    category: 'section',
    description: 'Showcase your most popular rental items with large cards',
    icon: 'i-lucide-star',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UPageCard
      v-for="item in data.items"
      :key="item.id"
      :to="item.link"
      variant="outline"
      class="group overflow-hidden"
    >
      <div class="relative aspect-[4/3] overflow-hidden rounded-t-lg -m-4 mb-4">
        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div v-if="item.badge" class="absolute top-2 right-2">
          <UBadge :label="item.badge" color="primary" />
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p class="text-sm text-muted line-clamp-2">{{ item.description }}</p>
        <div class="flex items-center justify-between pt-2">
          <div>
            <span class="text-2xl font-bold text-primary">{{ item.price }}</span>
            <span class="text-sm text-muted">/day</span>
          </div>
          <UButton label="Book Now" size="sm" />
        </div>
      </div>
    </UPageCard>
  </div>
</UPageSection>`,
    defaultData: {
      headline: 'Most Popular',
      title: 'Featured Rentals',
      description: 'Our customers\' favorite bounce houses and party equipment',
      items: [
        { id: '1', name: 'Princess Castle Bounce House', description: 'Perfect for princess-themed parties. Fits up to 8 kids.', image: '/images/princess-castle.jpg', price: '$199', link: '/rentals/princess-castle', badge: 'Popular' },
        { id: '2', name: 'Tropical Paradise Water Slide', description: 'Beat the heat with our most popular water slide!', image: '/images/water-slide.jpg', price: '$299', link: '/rentals/water-slide', badge: 'Best Seller' },
        { id: '3', name: 'Mega Obstacle Course', description: '50ft of exciting challenges for all ages.', image: '/images/obstacle-course.jpg', price: '$349', link: '/rentals/obstacle-course', badge: '' }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'FeaturedRentals'
  },
  {
    id: 'nuxt-categories-grid',
    name: 'Categories Grid',
    category: 'section',
    description: 'Display rental categories with images and item counts',
    icon: 'i-lucide-layout-grid',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <NuxtLink
      v-for="category in data.categories"
      :key="category.id"
      :to="category.link"
      class="group relative aspect-square rounded-xl overflow-hidden"
    >
      <img :src="category.image" :alt="category.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 class="text-lg font-semibold">{{ category.name }}</h3>
        <p class="text-sm opacity-80">{{ category.count }} items</p>
      </div>
    </NuxtLink>
  </div>
</UPageSection>`,
    defaultData: {
      headline: 'Browse By Category',
      title: 'Rental Categories',
      description: 'Find the perfect equipment for your event',
      categories: [
        { id: '1', name: 'Bounce Houses', count: 12, image: '/images/category-bounce.jpg', link: '/rentals?category=bounce_house' },
        { id: '2', name: 'Water Slides', count: 8, image: '/images/category-water.jpg', link: '/rentals?category=water_slide' },
        { id: '3', name: 'Obstacle Courses', count: 5, image: '/images/category-obstacle.jpg', link: '/rentals?category=obstacle_course' },
        { id: '4', name: 'Combo Units', count: 6, image: '/images/category-combo.jpg', link: '/rentals?category=combo_unit' },
        { id: '5', name: 'Interactive Games', count: 10, image: '/images/category-games.jpg', link: '/rentals?category=interactive' },
        { id: '6', name: 'Party Extras', count: 15, image: '/images/category-extras.jpg', link: '/rentals?category=party_extras' }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'ServicesGrid'
  },
  {
    id: 'nuxt-product-showcase',
    name: 'Product Showcase',
    category: 'section',
    description: 'Large featured product with details',
    icon: 'i-lucide-package',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  orientation="horizontal"
>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div class="relative aspect-video rounded-xl overflow-hidden">
      <img :src="data.product.image" :alt="data.product.name" class="w-full h-full object-cover" />
      <div v-if="data.product.badge" class="absolute top-4 left-4">
        <UBadge :label="data.product.badge" color="primary" size="lg" />
      </div>
    </div>
    <div class="space-y-6">
      <div>
        <p class="text-sm text-primary font-medium mb-2">{{ data.product.category }}</p>
        <h2 class="text-3xl font-bold mb-4">{{ data.product.name }}</h2>
        <p class="text-muted text-lg">{{ data.product.description }}</p>
      </div>
      <ul class="space-y-3">
        <li v-for="feature in data.product.features" :key="feature" class="flex items-center gap-3">
          <UIcon name="i-lucide-check-circle" class="text-primary text-xl" />
          <span>{{ feature }}</span>
        </li>
      </ul>
      <div class="flex items-center gap-6">
        <div>
          <span class="text-4xl font-bold text-primary">{{ data.product.price }}</span>
          <span class="text-muted">/day</span>
        </div>
        <UButton :label="data.product.ctaText" size="xl" />
      </div>
    </div>
  </div>
</UPageSection>`,
    defaultData: {
      title: '',
      description: '',
      product: {
        name: 'Mega Combo Water Slide',
        category: 'Combo Units',
        description: 'The ultimate party attraction! Features a bounce area, climbing wall, and thrilling water slide all in one.',
        image: '/images/mega-combo.jpg',
        price: '$449',
        badge: 'New Arrival',
        ctaText: 'Book This Item',
        features: [
          'Fits up to 10 children at once',
          '25ft tall water slide',
          'Built-in climbing wall',
          'Splash pool landing',
          'Includes setup and takedown'
        ]
      }
    },
    supportsAutoPopulate: false
  },
  {
    id: 'nuxt-inventory-list',
    name: 'Inventory List',
    category: 'section',
    description: 'Compact list view of rental items',
    icon: 'i-lucide-list',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <div class="space-y-4">
    <UPageCard
      v-for="item in data.items"
      :key="item.id"
      variant="outline"
      class="flex flex-col md:flex-row gap-4 items-start"
    >
      <img :src="item.image" :alt="item.name" class="w-full md:w-48 h-32 object-cover rounded-lg" />
      <div class="flex-1">
        <div class="flex items-start justify-between">
          <div>
            <UBadge :label="item.category" color="neutral" variant="subtle" size="sm" class="mb-2" />
            <h3 class="text-lg font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-muted mt-1">{{ item.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary">{{ item.price }}</p>
            <p class="text-sm text-muted">/day</p>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <UButton label="View Details" size="sm" variant="soft" :to="item.link" />
          <UButton label="Book Now" size="sm" />
        </div>
      </div>
    </UPageCard>
  </div>
</UPageSection>`,
    defaultData: {
      headline: 'All Rentals',
      title: 'Browse Our Inventory',
      description: 'All available bounce houses and party equipment',
      items: [
        { id: '1', name: 'Princess Castle Bounce House', category: 'Bounce House', description: 'A magical castle for princess-themed parties. Fits up to 8 children.', image: '/images/princess-castle.jpg', price: '$199', link: '/rentals/princess-castle' },
        { id: '2', name: 'Sports Arena Bounce House', category: 'Bounce House', description: 'Perfect for sports-themed events with basketball hoop inside.', image: '/images/sports-arena.jpg', price: '$189', link: '/rentals/sports-arena' },
        { id: '3', name: 'Tropical Water Slide', category: 'Water Slide', description: '20ft tall water slide with palm tree decorations.', image: '/images/water-slide.jpg', price: '$299', link: '/rentals/water-slide' }
      ]
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'ProductGrid'
  },
  {
    id: 'nuxt-rental-comparison',
    name: 'Rental Comparison',
    category: 'section',
    description: 'Compare multiple rental items side by side',
    icon: 'i-lucide-columns',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <UPageGrid>
    <UPageCard
      v-for="item in data.items"
      :key="item.id"
      :title="item.name"
      variant="outline"
    >
      <img :src="item.image" :alt="item.name" class="w-full aspect-video object-cover rounded-lg mb-4" />
      <table class="w-full text-sm">
        <tbody>
          <tr v-for="spec in item.specs" :key="spec.label" class="border-b border-default">
            <td class="py-2 text-muted">{{ spec.label }}</td>
            <td class="py-2 text-right font-medium">{{ spec.value }}</td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-primary">{{ item.price }}<span class="text-sm text-muted font-normal">/day</span></span>
          <UButton label="Book" size="sm" />
        </div>
      </template>
    </UPageCard>
  </UPageGrid>
</UPageSection>`,
    defaultData: {
      headline: 'Compare',
      title: 'Find Your Perfect Fit',
      description: 'Compare our most popular bounce houses side by side',
      items: [
        {
          id: '1',
          name: 'Small Castle',
          image: '/images/small-castle.jpg',
          price: '$149',
          specs: [
            { label: 'Size', value: '13x13 ft' },
            { label: 'Capacity', value: '6 kids' },
            { label: 'Age Range', value: '3-10 years' },
            { label: 'Power', value: '1 blower' }
          ]
        },
        {
          id: '2',
          name: 'Medium Castle',
          image: '/images/medium-castle.jpg',
          price: '$199',
          specs: [
            { label: 'Size', value: '15x15 ft' },
            { label: 'Capacity', value: '8 kids' },
            { label: 'Age Range', value: '3-12 years' },
            { label: 'Power', value: '1 blower' }
          ]
        },
        {
          id: '3',
          name: 'Large Castle',
          image: '/images/large-castle.jpg',
          price: '$249',
          specs: [
            { label: 'Size', value: '20x20 ft' },
            { label: 'Capacity', value: '12 kids' },
            { label: 'Age Range', value: '3-14 years' },
            { label: 'Power', value: '2 blowers' }
          ]
        }
      ]
    },
    supportsAutoPopulate: false
  },
  {
    id: 'nuxt-new-arrivals',
    name: 'New Arrivals',
    category: 'section',
    description: 'Highlight newly added rental items',
    icon: 'i-lucide-sparkles',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <UPageCard
      v-for="(item, index) in data.items"
      :key="item.id"
      :class="index === 0 ? 'md:col-span-2' : ''"
      variant="subtle"
    >
      <div :class="index === 0 ? 'flex flex-col md:flex-row gap-6' : ''">
        <div :class="index === 0 ? 'md:w-1/2' : ''">
          <img :src="item.image" :alt="item.name" class="w-full aspect-video object-cover rounded-lg" />
        </div>
        <div :class="index === 0 ? 'md:w-1/2 flex flex-col justify-center' : 'mt-4'">
          <UBadge label="New" color="success" class="w-fit mb-2" />
          <h3 :class="index === 0 ? 'text-2xl' : 'text-lg'" class="font-bold mb-2">{{ item.name }}</h3>
          <p class="text-muted mb-4">{{ item.description }}</p>
          <div class="flex items-center gap-4">
            <span class="text-2xl font-bold text-primary">{{ item.price }}<span class="text-sm text-muted font-normal">/day</span></span>
            <UButton label="Learn More" :size="index === 0 ? 'lg' : 'sm'" :to="item.link" />
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</UPageSection>`,
    defaultData: {
      headline: 'Just Added',
      title: 'New Arrivals',
      description: 'Check out the latest additions to our rental inventory',
      items: [
        { id: '1', name: 'Unicorn Dream Bounce Castle', description: 'Our newest magical bounce house featuring a beautiful unicorn theme with rainbow colors and sparkly details.', image: '/images/unicorn-castle.jpg', price: '$229', link: '/rentals/unicorn-castle' },
        { id: '2', name: 'Ninja Warrior Course', description: 'Test your skills on our new obstacle course!', image: '/images/ninja-course.jpg', price: '$399', link: '/rentals/ninja-course' },
        { id: '3', name: 'Foam Party Machine', description: 'Add foam fun to any party!', image: '/images/foam-machine.jpg', price: '$149', link: '/rentals/foam-machine' }
      ]
    },
    supportsAutoPopulate: false
  },

  // FOOTER SECTIONS
  {
    id: 'nuxt-footer-simple',
    name: 'Footer - Simple',
    category: 'footer',
    description: 'Clean footer with links and contact info',
    icon: 'i-lucide-panel-bottom',
    template: `<footer class="bg-default border-t border-default">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <h3 class="text-xl font-bold mb-4">{{ data.businessName }}</h3>
        <p class="text-muted mb-4">{{ data.description }}</p>
        <div class="flex gap-4">
          <UButton v-if="data.socialLinks.facebook" icon="i-simple-icons-facebook" color="neutral" variant="ghost" :to="data.socialLinks.facebook" external />
          <UButton v-if="data.socialLinks.instagram" icon="i-simple-icons-instagram" color="neutral" variant="ghost" :to="data.socialLinks.instagram" external />
          <UButton v-if="data.socialLinks.twitter" icon="i-simple-icons-x" color="neutral" variant="ghost" :to="data.socialLinks.twitter" external />
        </div>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2">
          <li v-for="link in data.links" :key="link.label">
            <NuxtLink :to="link.href" class="text-muted hover:text-default transition-colors">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4">Contact</h4>
        <div class="space-y-2 text-muted">
          <p v-if="data.phone">{{ data.phone }}</p>
          <p v-if="data.email">{{ data.email }}</p>
          <p v-if="data.address">{{ data.address }}</p>
        </div>
      </div>
    </div>
    <div class="border-t border-default mt-8 pt-8 text-center text-sm text-muted">
      {{ data.copyright }}
    </div>
  </div>
</footer>`,
    defaultData: {
      businessName: 'Party Rentals Co.',
      description: 'Your trusted local party rental company providing bounce houses and party equipment since 2010.',
      phone: '(555) 123-4567',
      email: 'info@partyrentals.com',
      address: '123 Party Lane, Fun City, ST 12345',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Rentals', href: '/rentals' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' }
      ],
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: ''
      },
      copyright: '© 2024 Party Rentals Co. All rights reserved.'
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'FooterSection'
  },
  {
    id: 'nuxt-footer-detailed',
    name: 'Footer - Detailed',
    category: 'footer',
    description: 'Full footer with multiple link sections',
    icon: 'i-lucide-panel-bottom',
    template: `<footer class="bg-default border-t border-default">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <div class="lg:col-span-2">
        <img v-if="data.logo" :src="data.logo" :alt="data.businessName" class="h-10 mb-4" />
        <h3 v-else class="text-xl font-bold mb-4">{{ data.businessName }}</h3>
        <p class="text-muted mb-4">{{ data.description }}</p>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-phone" />
            <span>{{ data.phone }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-mail" />
            <span>{{ data.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-map-pin" />
            <span>{{ data.address }}</span>
          </div>
        </div>
      </div>
      <div v-for="section in data.linkSections" :key="section.title">
        <h4 class="font-semibold mb-4">{{ section.title }}</h4>
        <ul class="space-y-2">
          <li v-for="link in section.links" :key="link.label">
            <NuxtLink :to="link.href" class="text-muted hover:text-default transition-colors">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-default mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-sm text-muted">{{ data.copyright }}</p>
      <div class="flex gap-4">
        <UButton v-if="data.socialLinks.facebook" icon="i-simple-icons-facebook" color="neutral" variant="ghost" size="sm" :to="data.socialLinks.facebook" external />
        <UButton v-if="data.socialLinks.instagram" icon="i-simple-icons-instagram" color="neutral" variant="ghost" size="sm" :to="data.socialLinks.instagram" external />
        <UButton v-if="data.socialLinks.youtube" icon="i-simple-icons-youtube" color="neutral" variant="ghost" size="sm" :to="data.socialLinks.youtube" external />
        <UButton v-if="data.socialLinks.tiktok" icon="i-simple-icons-tiktok" color="neutral" variant="ghost" size="sm" :to="data.socialLinks.tiktok" external />
      </div>
    </div>
  </div>
</footer>`,
    defaultData: {
      businessName: 'Party Rentals Co.',
      logo: '',
      description: 'Making memories one party at a time!',
      phone: '(555) 123-4567',
      email: 'info@partyrentals.com',
      address: '123 Party Lane, Fun City, ST 12345',
      linkSections: [
        {
          title: 'Rentals',
          links: [
            { label: 'Bounce Houses', href: '/rentals?category=bounce_house' },
            { label: 'Water Slides', href: '/rentals?category=water_slide' },
            { label: 'Combo Units', href: '/rentals?category=combo' },
            { label: 'Party Extras', href: '/rentals?category=extras' }
          ]
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Blog', href: '/blog' }
          ]
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cancellation Policy', href: '/cancellation' }
          ]
        }
      ],
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: '',
        tiktok: ''
      },
      copyright: '© 2024 Party Rentals Co. All rights reserved.'
    },
    supportsAutoPopulate: true,
    autoPopulateType: 'FooterSection'
  },

  // PRICING SECTION
  {
    id: 'nuxt-pricing-cards',
    name: 'Pricing Cards',
    category: 'pricing',
    description: 'Pricing tiers with features',
    icon: 'i-lucide-credit-card',
    template: `<UPageSection
  :title="data.title"
  :description="data.description"
  :headline="data.headline"
  orientation="vertical"
>
  <UPageGrid>
    <UPageCard
      v-for="tier in data.tiers"
      :key="tier.id"
      :title="tier.name"
      :description="tier.description"
      :variant="tier.popular ? 'subtle' : 'outline'"
      :highlight="tier.popular"
      highlight-color="primary"
    >
      <template #header>
        <UBadge v-if="tier.popular" label="Most Popular" color="primary" class="mb-2" />
      </template>
      <div class="my-4">
        <span class="text-4xl font-bold">{{ tier.price }}</span>
        <span class="text-muted">{{ tier.priceNote }}</span>
      </div>
      <ul class="space-y-2">
        <li v-for="feature in tier.features" :key="feature" class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="text-primary" />
          <span>{{ feature }}</span>
        </li>
      </ul>
      <template #footer>
        <UButton :label="tier.ctaText" :color="tier.popular ? 'primary' : 'neutral'" block size="lg" />
      </template>
    </UPageCard>
  </UPageGrid>
</UPageSection>`,
    defaultData: {
      headline: 'Pricing',
      title: 'Simple, Transparent Pricing',
      description: 'Choose the rental package that fits your event.',
      tiers: [
        {
          id: '1',
          name: 'Half Day',
          description: 'Perfect for smaller events',
          price: '$149',
          priceNote: '/4 hours',
          features: ['Up to 4 hours', 'Free delivery (10mi)', 'Setup included'],
          ctaText: 'Book Half Day',
          popular: false
        },
        {
          id: '2',
          name: 'Full Day',
          description: 'Our most popular option',
          price: '$199',
          priceNote: '/8 hours',
          features: ['Up to 8 hours', 'Free delivery (25mi)', 'Setup & takedown', 'Safety briefing'],
          ctaText: 'Book Full Day',
          popular: true
        },
        {
          id: '3',
          name: 'Weekend',
          description: 'Best value for longer events',
          price: '$349',
          priceNote: '/weekend',
          features: ['Friday to Sunday', 'Free delivery (25mi)', 'Setup & takedown', 'Priority support'],
          ctaText: 'Book Weekend',
          popular: false
        }
      ]
    },
    supportsAutoPopulate: false
  }
]

/**
 * Get blocks by category
 */
export function getBlocksByCategory(category: NuxtUIBlock['category']): NuxtUIBlock[] {
  return nuxtUIBlocks.filter(block => block.category === category)
}

/**
 * Get block by ID
 */
export function getBlockById(id: string): NuxtUIBlock | undefined {
  return nuxtUIBlocks.find(block => block.id === id)
}

/**
 * Get all categories
 */
export function getBlockCategories(): { key: NuxtUIBlock['category'], label: string, icon: string }[] {
  return [
    { key: 'hero', label: 'Hero Sections', icon: 'i-lucide-layout-template' },
    { key: 'section', label: 'Content Sections', icon: 'i-lucide-square' },
    { key: 'features', label: 'Features', icon: 'i-lucide-list-checks' },
    { key: 'testimonials', label: 'Testimonials', icon: 'i-lucide-message-square-quote' },
    { key: 'cta', label: 'Call to Action', icon: 'i-lucide-megaphone' },
    { key: 'pricing', label: 'Pricing', icon: 'i-lucide-credit-card' },
    { key: 'footer', label: 'Footer', icon: 'i-lucide-panel-bottom' }
  ]
}

/**
 * Get blocks that support auto-populate
 */
export function getAutoPopulateBlocks(): NuxtUIBlock[] {
  return nuxtUIBlocks.filter(block => block.supportsAutoPopulate)
}
