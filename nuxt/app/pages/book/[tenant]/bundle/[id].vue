<script setup lang="ts">
import { format as _format, addDays as _addDays } from 'date-fns'
import { useBundles, type Bundle, type BundleWithCalculations } from '~/composables/useBundles'

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string
const bundleId = route.params.id as string

const { loadTenant, loadItems } = usePublicBooking()
const { calculateBundlePrice } = useBundles()
const { addItem } = useCart()
const toast = useToast()

// State
const loading = ref(true)
const error = ref<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tenantData = ref<any>(null)
const bundle = ref<Bundle | null>(null)
const bundleWithPricing = ref<BundleWithCalculations | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = ref<any[]>([])

// Booking form state
const dateTimeSelection = ref<{
  deliveryDate: string
  deliveryTime: string
  pickupDate: string
  pickupTime: string
} | null>(null)
const dateTimeValid = ref(false)
const quantity = ref(1)
const isAddingToCart = ref(false)

// Timezone
const tenantTimezone = computed(() => tenantData.value?.settings?.timezone || 'America/New_York')

onMounted(async () => {
  try {
    // Load tenant first
    const loadedTenant = await loadTenant(tenantSlug)
    if (!loadedTenant) {
      router.push('/404')
      return
    }
    tenantData.value = loadedTenant

    // Load items and bundle in parallel
    const config = useRuntimeConfig()
    const [loadedItems, loadedBundle] = await Promise.all([
      loadItems(loadedTenant.id),
      $fetch<Bundle>(`${config.public.payloadUrl}/api/bundles/${bundleId}`, {
        params: { depth: 2 }
      })
    ])

    if (!loadedBundle) {
      error.value = 'Bundle not found'
      return
    }

    bundle.value = loadedBundle

    // Map items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.value = loadedItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.pricing?.fullDayRate || 0,
      image: item.images?.[0]?.url,
      pricing: { daily: item.pricing?.fullDayRate || 0 }
    }))

    // Calculate bundle pricing
    bundleWithPricing.value = calculateBundlePrice(loadedBundle, items.value)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load bundle'
    console.error('Failed to load bundle:', err)
    error.value = errorMessage
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Calculate number of rental days
const rentalDays = computed(() => {
  if (!dateTimeSelection.value?.deliveryDate || !dateTimeSelection.value?.pickupDate) return 1
  const start = new Date(dateTimeSelection.value.deliveryDate)
  const end = new Date(dateTimeSelection.value.pickupDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
})

// Calculate total price
const totalPrice = computed(() => {
  if (!bundleWithPricing.value) return 0
  return bundleWithPricing.value.finalPrice * rentalDays.value * quantity.value
})

// Add bundle to cart
const addToCart = () => {
  if (!bundleWithPricing.value || !dateTimeSelection.value || !dateTimeValid.value) return

  isAddingToCart.value = true

  try {
    // Add each item in the bundle to the cart
    for (const bundleItem of bundle.value!.items) {
      const itemDetails = items.value.find(i =>
        typeof bundleItem.rentalItem === 'object'
          ? i.id === bundleItem.rentalItem.id
          : i.id === bundleItem.rentalItem
      )

      if (itemDetails) {
        addItem({
          itemId: itemDetails.id,
          itemName: itemDetails.name,
          itemSlug: itemDetails.slug,
          itemImage: itemDetails.image,
          startDate: dateTimeSelection.value.deliveryDate,
          endDate: dateTimeSelection.value.pickupDate,
          deliveryTime: dateTimeSelection.value.deliveryTime,
          pickupTime: dateTimeSelection.value.pickupTime,
          basePrice: itemDetails.price,
          addOns: [],
          quantity: bundleItem.quantity * quantity.value
        })
      }
    }

    toast.add({
      title: 'Bundle Added',
      description: `${bundleWithPricing.value.name} has been added to your cart`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    // Navigate to checkout
    router.push(`/book/${tenantSlug}/checkout`)
  } catch (err: unknown) {
    console.error('Failed to add bundle to cart:', err)
    toast.add({
      title: 'Error',
      description: 'Failed to add bundle to cart',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    isAddingToCart.value = false
  }
}

// Get item details from bundle item
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItemDetails = (bundleItem: any) => {
  if (typeof bundleItem.rentalItem === 'object') {
    return bundleItem.rentalItem
  }
  return items.value.find(i => i.id === bundleItem.rentalItem)
}
</script>

<template>
  <div class="bundle-detail">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="loading-screen"
    >
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring" />
          <div class="spinner-ring" />
          <div class="spinner-ring" />
        </div>
        <p class="loading-text">
          Loading bundle details...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="error-screen"
    >
      <div class="error-content">
        <UIcon
          name="i-lucide-alert-circle"
          class="w-16 h-16 text-red-500 mb-4"
        />
        <h2>Something went wrong</h2>
        <p>{{ error }}</p>
        <UButton
          size="lg"
          @click="() => void router.push(`/book/${tenantSlug}`)"
        >
          Back to Rentals
        </UButton>
      </div>
    </div>

    <!-- Main Content -->
    <div
      v-else-if="bundleWithPricing"
      class="content"
    >
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <NuxtLink
          :to="`/book/${tenantSlug}`"
          class="breadcrumb-link"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="w-4 h-4"
          />
          Back to Rentals
        </NuxtLink>
      </nav>

      <div class="bundle-grid">
        <!-- Left Column - Bundle Details -->
        <div class="bundle-info">
          <!-- Bundle Header -->
          <div class="bundle-header">
            <div
              v-if="bundleWithPricing.featured"
              class="badge-featured"
            >
              <UIcon
                name="i-lucide-star"
                class="w-4 h-4"
              />
              Popular Package
            </div>
            <h1 class="bundle-title">
              {{ bundleWithPricing.name }}
            </h1>
            <div
              v-if="bundleWithPricing.savings > 0"
              class="savings-callout"
            >
              <UIcon
                name="i-lucide-tag"
                class="w-5 h-5"
              />
              <span>Save {{ formatPrice(bundleWithPricing.savings) }} vs. booking individually!</span>
            </div>
          </div>

          <!-- Bundle Image -->
          <div class="bundle-image-container">
            <img
              v-if="bundleWithPricing.image?.url"
              :src="bundleWithPricing.image.url"
              :alt="bundleWithPricing.name"
              class="bundle-image"
            >
            <div
              v-else
              class="bundle-placeholder"
            >
              <UIcon
                name="i-lucide-package"
                class="w-20 h-20"
              />
            </div>
          </div>

          <!-- What's Included -->
          <div class="included-section">
            <h2 class="section-title">
              <UIcon
                name="i-lucide-check-circle"
                class="w-6 h-6 text-green-500"
              />
              What's Included
            </h2>
            <p class="section-subtitle">
              {{ bundleWithPricing.itemCount }} items in this package
            </p>

            <div class="included-grid">
              <div
                v-for="bundleItem in bundleWithPricing.items"
                :key="typeof bundleItem.rentalItem === 'object' ? bundleItem.rentalItem.id : bundleItem.rentalItem"
                class="included-card"
              >
                <div class="included-image">
                  <img
                    v-if="getItemDetails(bundleItem)?.image"
                    :src="getItemDetails(bundleItem).image"
                    :alt="getItemDetails(bundleItem)?.name"
                  >
                  <div
                    v-else
                    class="placeholder"
                  >
                    <UIcon
                      name="i-lucide-box"
                      class="w-8 h-8"
                    />
                  </div>
                </div>
                <div class="included-info">
                  <span class="item-quantity">{{ bundleItem.quantity }}x</span>
                  <span class="item-name">{{ getItemDetails(bundleItem)?.name || 'Item' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing Breakdown -->
          <div class="pricing-breakdown">
            <h2 class="section-title">
              <UIcon
                name="i-lucide-calculator"
                class="w-6 h-6 text-orange-500"
              />
              Pricing Breakdown
            </h2>
            <div class="breakdown-list">
              <div class="breakdown-item">
                <span>Items Total (if booked separately)</span>
                <span class="original-price">{{ formatPrice(bundleWithPricing.itemsTotal) }}</span>
              </div>
              <div
                v-if="bundleWithPricing.savings > 0"
                class="breakdown-item savings"
              >
                <span>Bundle Savings</span>
                <span>-{{ formatPrice(bundleWithPricing.savings) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Package Price</span>
                <span>{{ formatPrice(bundleWithPricing.finalPrice) }}/day</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Booking Form -->
        <div class="booking-form-container">
          <div class="booking-form">
            <h2 class="form-title">
              Book This Package
            </h2>

            <!-- Date/Time Selector -->
            <div class="form-section">
              <BookingDateTimeSelector
                v-model="dateTimeSelection"
                :timezone="tenantTimezone"
                :min-lead-time-hours="24"
                @valid="dateTimeValid = $event"
              />
            </div>

            <!-- Quantity -->
            <div class="form-section">
              <label class="form-label">Quantity</label>
              <div class="quantity-selector">
                <button
                  class="qty-btn"
                  :disabled="quantity <= 1"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  <UIcon
                    name="i-lucide-minus"
                    class="w-5 h-5"
                  />
                </button>
                <span class="qty-value">{{ quantity }}</span>
                <button
                  class="qty-btn"
                  @click="quantity++"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="price-summary">
              <div class="summary-row">
                <span>Package ({{ formatPrice(bundleWithPricing.finalPrice) }}/day)</span>
                <span>{{ formatPrice(bundleWithPricing.finalPrice) }}</span>
              </div>
              <div
                v-if="rentalDays > 1"
                class="summary-row"
              >
                <span>x {{ rentalDays }} days</span>
                <span>{{ formatPrice(bundleWithPricing.finalPrice * rentalDays) }}</span>
              </div>
              <div
                v-if="quantity > 1"
                class="summary-row"
              >
                <span>x {{ quantity }} packages</span>
                <span>{{ formatPrice(bundleWithPricing.finalPrice * rentalDays * quantity) }}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              class="add-to-cart-btn"
              :disabled="!dateTimeValid || isAddingToCart"
              @click="addToCart"
            >
              <template v-if="isAddingToCart">
                <UIcon
                  name="i-lucide-loader-circle"
                  class="w-5 h-5 animate-spin"
                />
                Adding...
              </template>
              <template v-else>
                <UIcon
                  name="i-lucide-shopping-cart"
                  class="w-5 h-5"
                />
                Add Package to Cart
              </template>
            </button>

            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="trust-badge">
                <UIcon
                  name="i-lucide-shield-check"
                  class="w-4 h-4"
                />
                <span>Fully Insured</span>
              </div>
              <div class="trust-badge">
                <UIcon
                  name="i-lucide-truck"
                  class="w-4 h-4"
                />
                <span>Free Delivery</span>
              </div>
              <div class="trust-badge">
                <UIcon
                  name="i-lucide-sparkles"
                  class="w-4 h-4"
                />
                <span>Sanitized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bundle-detail {
  --color-coral: #FF6B6B;
  --color-amber: #FFB347;
  --color-sunset: linear-gradient(135deg, var(--color-coral) 0%, var(--color-amber) 100%);
  --color-success: #10b981;
}

/* Loading State */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: var(--color-coral);
}

.spinner-ring:nth-child(2) {
  inset: 8px;
  border-right-color: var(--color-amber);
  animation-delay: -0.5s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  inset: 16px;
  border-bottom-color: var(--color-coral);
  animation-delay: -1s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
}

/* Error State */
.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.error-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dark .error-content h2 {
  color: white;
}

.error-content p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Breadcrumb */
.breadcrumb {
  margin-bottom: 2rem;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-coral);
}

/* Bundle Grid */
.bundle-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .bundle-grid {
    grid-template-columns: 1fr 400px;
    gap: 3rem;
  }
}

/* Bundle Info */
.bundle-header {
  margin-bottom: 2rem;
}

.badge-featured {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-sunset);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.bundle-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.dark .bundle-title {
  color: white;
}

.savings-callout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.75rem;
  color: #059669;
  font-weight: 600;
}

.dark .savings-callout {
  color: #34d399;
}

/* Bundle Image */
.bundle-image-container {
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
  background: #f1f5f9;
  margin-bottom: 2rem;
}

.dark .bundle-image-container {
  background: #1e293b;
}

.bundle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bundle-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

/* Included Section */
.included-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.dark .section-title {
  color: white;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.included-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.included-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}

.dark .included-card {
  background: #1e293b;
  border-color: #334155;
}

.included-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
}

.dark .included-image {
  background: #334155;
}

.included-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.included-image .placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.included-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-quantity {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-coral);
}

.item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.dark .item-name {
  color: white;
}

/* Pricing Breakdown */
.pricing-breakdown {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem;
}

.dark .pricing-breakdown {
  background: #1e293b;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
  color: #64748b;
}

.original-price {
  text-decoration: line-through;
}

.breakdown-item.savings {
  color: var(--color-success);
  font-weight: 600;
}

.breakdown-item.total {
  padding-top: 0.75rem;
  border-top: 2px solid #e2e8f0;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1e293b;
}

.dark .breakdown-item.total {
  border-color: #334155;
  color: white;
}

/* Booking Form */
.booking-form-container {
  position: sticky;
  top: 2rem;
}

.booking-form {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
}

.dark .booking-form {
  background: #1e293b;
  border-color: #334155;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.dark .form-title {
  color: white;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-label {
  color: #d1d5db;
}

/* Quantity Selector */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .qty-btn {
  background: #334155;
  border-color: #475569;
  color: #94a3b8;
}

.qty-btn:hover:not(:disabled) {
  background: var(--color-coral);
  border-color: var(--color-coral);
  color: white;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  min-width: 2rem;
  text-align: center;
}

.dark .qty-value {
  color: white;
}

/* Price Summary */
.price-summary {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.dark .price-summary {
  background: #0f172a;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-coral);
}

.dark .summary-total {
  border-color: #334155;
}

/* Add to Cart Button */
.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: var(--color-sunset);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 14px rgba(255, 107, 107, 0.4);
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Trust Badges */
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.dark .trust-badges {
  border-color: #334155;
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
}
</style>
