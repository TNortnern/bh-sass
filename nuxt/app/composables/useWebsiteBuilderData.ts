/**
 * Website Builder Data Integration
 *
 * Provides access to tenant business data for auto-populating website sections:
 * - Rental items for "Featured Products" sections
 * - Business info for contact/footer sections
 * - Reviews/testimonials
 */

// import type { Ref } from 'vue'

export interface RentalItemForBuilder {
  id: string
  name: string
  slug: string
  category: string
  image: string
  price: number
  description?: string
}

export interface TenantInfoForBuilder {
  name: string
  description: string
  phone: string
  email: string
  address: string
  logo?: string
  website?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
}

export interface TestimonialForBuilder {
  id: string
  name: string
  text: string
  rating: number
  image?: string
  date?: string
}

export function useWebsiteBuilderData() {
  // Get composables - these use useState internally so they're safe
  const auth = useAuth()
  const settings = useSettings()

  // Get the current user (uses 'currentUser' not 'user')
  const currentUser = auth.currentUser

  const rentalItems = ref<RentalItemForBuilder[]>([])
  const tenantInfo = ref<TenantInfoForBuilder | null>(null)
  const testimonials = ref<TestimonialForBuilder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load all business data for website builder
   */
  const loadBusinessData = async () => {
    if (!currentUser.value?.tenantId) {
      error.value = 'No tenant ID available'
      return
    }

    loading.value = true
    error.value = null

    try {
      // Load rental items
      const itemsResponse = await $fetch<{ docs: Record<string, unknown>[] }>('/api/rental-items', {
        query: {
          where: { status: { equals: 'active' } },
          limit: 50,
          sort: '-createdAt'
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rentalItems.value = (itemsResponse.docs || []).map((item: any) => ({
        id: String(item.id || ''),
        name: String(item.name || ''),
        slug: String(item.slug || item.id || ''),
        category: String(item.category || 'Uncategorized'),
        image: String(item.images?.[0]?.url || item.featuredImage?.url || '/images/placeholder-rental.jpg'),
        price: Number(item.pricing?.fullDayRate || item.pricing?.hourlyRate || 0),
        description: String(item.shortDescription || (typeof item.description === 'string' ? item.description.slice(0, 150) : '') || '')
      }))

      // Load tenant/settings info from useSettings composable
      await settings.fetchSettings()
      const businessSettings = settings.business.value
      if (businessSettings) {
        tenantInfo.value = {
          name: businessSettings.name || 'Your Business Name',
          description: businessSettings.description || 'Your trusted local party rental company',
          phone: businessSettings.phone || '(555) 123-4567',
          email: businessSettings.email || 'info@example.com',
          address: formatAddress(businessSettings.address),
          logo: businessSettings.logo || undefined,
          website: undefined,
          socialLinks: undefined
        }
      }

      // Load testimonials/reviews if available
      try {
        const reviewsResponse = await $fetch<{ docs: Record<string, unknown>[] }>('/api/reviews', {
          query: { limit: 10, sort: '-rating' }

        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testimonials.value = (reviewsResponse.docs || []).map((review: any) => ({
          id: String(review.id || ''),
          name: String(review.customerName || review.name || 'Happy Customer'),
          text: String(review.text || review.content || ''),
          rating: Number(review.rating || 5),
          image: String(review.customerImage?.url || ''),
          date: String(review.createdAt || '')
        }))
      } catch {
        // Reviews endpoint may not exist, use placeholder data
        testimonials.value = getPlaceholderTestimonials()
      }
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error.value = (e as any)?.message || 'Failed to load business data'
      console.error('[WebsiteBuilderData] Error loading data:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get featured rental items for a "Featured Products" section
   */
  const getFeaturedRentalsData = (count: number = 6) => {
    const items = rentalItems.value.slice(0, count)

    return {
      headline: 'Our Most Popular Rentals',
      subheadline: 'Browse our selection of premium bounce houses and party equipment',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: `$${item.price}`,
        category: item.category,
        link: `/rentals/${item.slug}`
      })),
      showPrices: true,
      columns: Math.min(count, 4)
    }
  }

  /**
   * Get data for a "Hero" section
   */
  const getHeroData = () => {
    return {
      headline: tenantInfo.value?.name || 'Premium Party Rentals',
      subheadline: tenantInfo.value?.description || 'Bounce houses, water slides, and more - delivered to your door',
      primaryButtonText: 'View Rentals',
      primaryButtonLink: '/rentals',
      secondaryButtonText: 'Get a Quote',
      secondaryButtonLink: '/contact',
      backgroundImage: '/images/hero-bounce-house.jpg'
    }
  }

  /**
   * Get data for a "Contact" section
   */
  const getContactData = () => {
    return {
      headline: 'Get In Touch',
      subheadline: 'Have questions or ready to book? We\'re here to help make your event amazing.',
      phone: tenantInfo.value?.phone || '(555) 123-4567',
      email: tenantInfo.value?.email || 'info@example.com',
      address: tenantInfo.value?.address || '123 Party Lane, Fun City, ST 12345',
      showForm: true,
      formFields: ['name', 'email', 'phone', 'message']
    }
  }

  /**
   * Get data for a "Footer" section
   */
  const getFooterData = () => {
    return {
      businessName: tenantInfo.value?.name || 'Your Business',
      description: tenantInfo.value?.description || 'Your trusted local party rental company',
      phone: tenantInfo.value?.phone || '',
      email: tenantInfo.value?.email || '',
      address: tenantInfo.value?.address || '',
      logo: tenantInfo.value?.logo || '',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Rentals', href: '/rentals' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ],
      socialLinks: tenantInfo.value?.socialLinks || {},
      copyright: `© ${new Date().getFullYear()} ${tenantInfo.value?.name || 'Your Business'}. All rights reserved.`
    }
  }

  /**
   * Get data for a "Testimonials" section
   */
  const getTestimonialsData = () => {
    const items = testimonials.value.length > 0
      ? testimonials.value.slice(0, 3)
      : getPlaceholderTestimonials()

    return {
      headline: 'What Our Customers Say',
      subheadline: 'Don\'t just take our word for it - hear from our happy customers',
      testimonials: items.map(t => ({
        id: t.id,
        quote: t.text,
        name: t.name,
        rating: t.rating,
        image: t.image || '/images/avatar-placeholder.jpg'
      }))
    }
  }

  /**
   * Get data for "Trust Badges" / "Why Choose Us" section
   */
  const getTrustBadgesData = () => {
    return {
      headline: 'Why Families Choose Us',
      items: [
        {
          icon: '✓',
          title: 'Fully Insured',
          description: '$2M liability coverage for your peace of mind'
        },
        {
          icon: '🚚',
          title: 'Free Delivery',
          description: 'Within 25 miles of our location'
        },
        {
          icon: '⭐',
          title: '5-Star Rated',
          description: 'Hundreds of happy customers'
        },
        {
          icon: '🧹',
          title: 'Sanitized',
          description: 'Cleaned and sanitized after every rental'
        }
      ]
    }
  }

  /**
   * Get data for "Services" / "Categories" section
   */
  const getServicesData = () => {
    // Group rental items by category
    const categories = rentalItems.value.reduce((acc, item) => {
      const cat = item.category
      if (!acc[cat]) {
        acc[cat] = { name: cat, count: 0, image: item.image }
      }
      // TypeScript now knows acc[cat] exists after the above check
      acc[cat]!.count++
      return acc
    }, {} as Record<string, { name: string, count: number, image: string }>)

    return {
      headline: 'What We Offer',
      subheadline: 'Browse our categories of party rental equipment',
      categories: Object.values(categories).slice(0, 6).map(cat => ({
        name: cat.name,
        description: `${cat.count} items available`,
        image: cat.image,
        link: `/rentals?category=${encodeURIComponent(cat.name)}`
      }))
    }
  }

  /**
   * Auto-populate a section based on its type
   */
  const populateSection = (sectionType: string): Record<string, unknown> | null => {
    const populators: Record<string, () => Record<string, unknown> | null> = {
      // Hero sections
      HeroFullWidth: getHeroData,
      HeroSplit: getHeroData,
      HeroMinimal: getHeroData,

      // Product/rental sections
      FeaturedRentals: () => getFeaturedRentalsData(6),
      ProductGrid: () => getFeaturedRentalsData(8),
      RentalShowcase: () => getFeaturedRentalsData(4),

      // Trust/features
      TrustBadges: getTrustBadgesData,
      WhyChooseUs: getTrustBadgesData,
      Features: getTrustBadgesData,

      // Services/categories
      ServicesGrid: getServicesData,
      Categories: getServicesData,

      // Testimonials
      TestimonialsGrid: getTestimonialsData,
      TestimonialsCarousel: getTestimonialsData,
      Reviews: getTestimonialsData,

      // Contact
      ContactSection: getContactData,
      ContactForm: getContactData,

      // Footer
      FooterSection: getFooterData,
      Footer: getFooterData
    }

    const populator = populators[sectionType]
    return populator ? populator() : null
  }

  /**
   * Get list of section types that support auto-population
   */
  const getSupportedSectionTypes = (): string[] => {
    return [
      'HeroFullWidth',
      'HeroSplit',
      'FeaturedRentals',
      'ProductGrid',
      'TrustBadges',
      'WhyChooseUs',
      'ServicesGrid',
      'TestimonialsGrid',
      'ContactSection',
      'FooterSection'
    ]
  }

  /**
   * Check if a section type supports auto-population
   */
  const canAutoPopulate = (sectionType: string): boolean => {
    return getSupportedSectionTypes().includes(sectionType)
  }

  /**
   * Get rental items for image picker
   */
  const getRentalItemImages = () => {
    return rentalItems.value.map(item => ({
      id: item.id,
      url: item.image,
      name: item.name,
      category: item.category
    }))
  }

  // Auto-load on mount if user is authenticated
  onMounted(() => {
    if (currentUser.value?.tenantId) {
      loadBusinessData()
    }
  })

  // Watch for user changes
  watch(() => currentUser.value?.tenantId, (newId) => {
    if (newId) {
      loadBusinessData()
    }
  })

  return {
    // Data
    rentalItems,
    tenantInfo,
    testimonials,
    loading,
    error,

    // Actions
    loadBusinessData,
    populateSection,
    canAutoPopulate,
    getSupportedSectionTypes,
    getRentalItemImages,

    // Section data generators
    getFeaturedRentalsData,
    getHeroData,
    getContactData,
    getFooterData,
    getTestimonialsData,
    getTrustBadgesData,
    getServicesData
  }
}

// Helper functions
function formatAddress(address?: { street?: string, city?: string, state?: string, zipCode?: string }): string {
  if (!address) return ''
  return [address.street, address.city, address.state, address.zipCode]
    .filter(Boolean)
    .join(', ')
}

function getPlaceholderTestimonials(): TestimonialForBuilder[] {
  return [
    {
      id: 'placeholder-1',
      name: 'Sarah M.',
      text: 'Amazing service! The bounce house was clean, on time, and the kids had a blast. Will definitely book again!',
      rating: 5
    },
    {
      id: 'placeholder-2',
      name: 'Mike T.',
      text: 'Professional setup and pickup. Great communication throughout. Highly recommend!',
      rating: 5
    },
    {
      id: 'placeholder-3',
      name: 'Jennifer L.',
      text: 'Best party rental company in the area. Fair prices and excellent customer service.',
      rating: 5
    }
  ]
}
