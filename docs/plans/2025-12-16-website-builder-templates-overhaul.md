# Website Builder Templates Overhaul

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix broken navbars, condense to 7 quality templates, add cart functionality with rb-payload booking widget integration, and ensure product cards work with real inventory data.

**Architecture:** Templates use HTML/CSS sections rendered in CustomHTML components. Navigation and footer will use a global layout wrapper that injects CSS properly. Product cards will link to the rb-payload booking widget with calendar/time selection. Cart icon in navbar shows items count and links to checkout.

**Tech Stack:** Vue 3, Nuxt 4, Tailwind CSS, rb-payload booking API, localStorage for cart state

---

## Templates to Keep (7 total)

1. **Minimal** - Swiss-style clean design (fix navbar)
2. **Garden** - Natural earthy greens
3. **Neon** - Vibrant dark with neon accents (fix navbar)
4. **Energy** - Bold dark with emerald (fix navbar)
5. **Luxe** (Elegant) - Sophisticated dark with gold (fix navbar)
6. **Trust** (Clean Professional) - Corporate blue (fix navbar)
7. **Funhouse** - Playful reds/purples

## Templates to Remove (8 total)

- starter, bounce, sugarrush, springboard, coastal, fiesta, carnival, industrial

---

### Task 1: Create Global Template Layout Wrapper

**Files:**
- Create: `nuxt/app/components/website-templates/TemplateLayout.vue`
- Create: `nuxt/app/components/website-templates/TemplateNavbar.vue`
- Create: `nuxt/app/components/website-templates/TemplateFooter.vue`

**Step 1: Create TemplateNavbar component with proper styling**

```vue
<!-- nuxt/app/components/website-templates/TemplateNavbar.vue -->
<script setup lang="ts">
interface Props {
  businessName: string
  logoUrl?: string
  links?: Array<{ label: string; href: string }>
  theme?: 'light' | 'dark' | 'transparent'
  cartCount?: number
  bookingUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [
    { label: 'Rentals', href: '#inventory' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ],
  theme: 'light',
  cartCount: 0,
  bookingUrl: '/book'
})

const mobileMenuOpen = ref(false)
</script>

<template>
  <nav class="template-navbar" :class="[`theme-${theme}`]">
    <div class="navbar-container">
      <!-- Logo / Brand -->
      <a href="/" class="navbar-brand">
        <img v-if="logoUrl" :src="logoUrl" :alt="businessName" class="navbar-logo" />
        <span class="navbar-brand-text">{{ businessName }}</span>
      </a>

      <!-- Desktop Links -->
      <div class="navbar-links">
        <a v-for="link in links" :key="link.href" :href="link.href" class="navbar-link">
          {{ link.label }}
        </a>
      </div>

      <!-- Actions -->
      <div class="navbar-actions">
        <!-- Cart Icon -->
        <a :href="`${bookingUrl}/checkout`" class="navbar-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </a>

        <!-- Book Now CTA -->
        <a :href="bookingUrl" class="navbar-cta">Book Now</a>

        <!-- Mobile Menu Toggle -->
        <button class="navbar-mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="navbar-mobile-menu">
        <a v-for="link in links" :key="link.href" :href="link.href" class="navbar-mobile-link" @click="mobileMenuOpen = false">
          {{ link.label }}
        </a>
        <a :href="bookingUrl" class="navbar-mobile-cta">Book Now</a>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.template-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--navbar-bg, #ffffff);
  border-bottom: 1px solid var(--navbar-border, #e5e7eb);
  backdrop-filter: blur(12px);
}

.template-navbar.theme-dark {
  --navbar-bg: rgba(17, 17, 17, 0.95);
  --navbar-border: rgba(255, 255, 255, 0.1);
  --navbar-text: #ffffff;
  --navbar-text-muted: #a1a1aa;
}

.template-navbar.theme-light {
  --navbar-bg: rgba(255, 255, 255, 0.95);
  --navbar-border: #e5e7eb;
  --navbar-text: #111111;
  --navbar-text-muted: #6b7280;
}

.template-navbar.theme-transparent {
  position: absolute;
  left: 0;
  right: 0;
  background: transparent;
  border-bottom: none;
  --navbar-text: #ffffff;
  --navbar-text-muted: rgba(255, 255, 255, 0.7);
}

.navbar-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.navbar-brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--navbar-text, #111);
  letter-spacing: -0.02em;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--navbar-text-muted, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}

.navbar-link:hover {
  color: var(--navbar-text, #111);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--navbar-text-muted, #6b7280);
  transition: color 0.15s;
}

.navbar-cart:hover {
  color: var(--navbar-text, #111);
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--color-primary, #f59e0b);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background: var(--color-primary, #f59e0b);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s;
}

.navbar-cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.navbar-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--navbar-text, #111);
  cursor: pointer;
}

.navbar-mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem;
  background: var(--navbar-bg, white);
  border-top: 1px solid var(--navbar-border, #e5e7eb);
}

.navbar-mobile-link {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--navbar-text-muted, #6b7280);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.navbar-mobile-link:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--navbar-text, #111);
}

.navbar-mobile-cta {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-primary, #f59e0b);
  color: white;
  font-weight: 600;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
}

/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .navbar-links { display: none; }
  .navbar-cta { display: none; }
  .navbar-mobile-toggle { display: flex; }
  .navbar-mobile-menu { display: flex; }
}
</style>
```

**Step 2: Create TemplateFooter component**

```vue
<!-- nuxt/app/components/website-templates/TemplateFooter.vue -->
<script setup lang="ts">
interface Props {
  businessName: string
  description?: string
  phone?: string
  email?: string
  address?: string
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  description: 'Premium party rentals for unforgettable events.'
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="template-footer" :class="[`theme-${theme}`]">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand Column -->
        <div class="footer-brand-col">
          <h3 class="footer-brand">{{ businessName }}</h3>
          <p class="footer-description">{{ description }}</p>
          <!-- Custom Domain Notice -->
          <p class="footer-domain-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            Custom domain support coming soon
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-links-col">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="#inventory">Rentals</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-links-col">
          <h4 class="footer-heading">Legal</h4>
          <ul class="footer-links">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/waiver">Liability Waiver</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-contact-col">
          <h4 class="footer-heading">Contact</h4>
          <ul class="footer-contact">
            <li v-if="phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>{{ phone }}</span>
            </li>
            <li v-if="email">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>{{ email }}</span>
            </li>
            <li v-if="address">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ address }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ businessName }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.template-footer {
  background: var(--footer-bg, #f9fafb);
  border-top: 1px solid var(--footer-border, #e5e7eb);
  padding: 3rem 0 1.5rem;
}

.template-footer.theme-dark {
  --footer-bg: #111111;
  --footer-border: rgba(255, 255, 255, 0.1);
  --footer-text: #ffffff;
  --footer-text-muted: #a1a1aa;
}

.template-footer.theme-light {
  --footer-bg: #f9fafb;
  --footer-border: #e5e7eb;
  --footer-text: #111111;
  --footer-text-muted: #6b7280;
}

.footer-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 2rem;
}

.footer-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--footer-text, #111);
  margin-bottom: 0.75rem;
}

.footer-description {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-domain-notice {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-primary, #f59e0b);
  background: linear-gradient(135deg, var(--color-primary, #f59e0b) 0%, #ea580c 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--footer-text, #111);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-links a:hover {
  color: var(--footer-text, #111);
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
}

.footer-contact svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--footer-border, #e5e7eb);
  text-align: center;
}

.footer-bottom p {
  font-size: 0.875rem;
  color: var(--footer-text-muted, #6b7280);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand-col {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-brand-col {
    grid-column: span 1;
  }
}
</style>
```

**Step 3: Verify components created**

Run: `ls -la nuxt/app/components/website-templates/`
Expected: Both component files exist

**Step 4: Commit**

```bash
git add nuxt/app/components/website-templates/
git commit -m "feat: add persistent TemplateNavbar and TemplateFooter components"
```

---

### Task 2: Create Product Card Component with View Details & Add to Cart

**Files:**
- Create: `nuxt/app/components/website-templates/ProductCard.vue`
- Create: `nuxt/app/composables/useTemplateCart.ts`

**Step 1: Create cart composable for localStorage persistence**

```typescript
// nuxt/app/composables/useTemplateCart.ts
export interface CartItem {
  id: string | number
  name: string
  price: number
  image?: string
  quantity: number
}

const CART_STORAGE_KEY = 'website-cart-items'

export function useTemplateCart() {
  const items = useState<CartItem[]>('cart-items', () => [])

  // Load from localStorage on mount
  const loadCart = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        try {
          items.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load cart:', e)
        }
      }
    }
  }

  // Save to localStorage
  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
    saveCart()
  }

  const removeItem = (id: string | number) => {
    items.value = items.value.filter(i => i.id !== id)
    saveCart()
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const total = computed(() => items.value.reduce((sum, i) => sum + (i.price * i.quantity), 0))

  // Load cart on init
  if (import.meta.client) {
    loadCart()
  }

  return {
    items,
    itemCount,
    total,
    addItem,
    removeItem,
    clearCart,
    loadCart
  }
}
```

**Step 2: Create ProductCard component**

```vue
<!-- nuxt/app/components/website-templates/ProductCard.vue -->
<script setup lang="ts">
interface Props {
  id: string | number
  name: string
  price: number
  image?: string
  category?: string
  description?: string
  bookingUrl?: string
  style?: 'minimal' | 'vibrant' | 'dark' | 'playful'
}

const props = withDefaults(defineProps<Props>(), {
  style: 'minimal',
  bookingUrl: '/book'
})

const { addItem } = useTemplateCart()
const toast = useToast()

const handleAddToCart = () => {
  addItem({
    id: props.id,
    name: props.name,
    price: props.price,
    image: props.image
  })
  toast.add({
    title: 'Added to Cart',
    description: `${props.name} has been added to your cart.`,
    color: 'success'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="product-card" :class="[`style-${style}`]">
    <!-- Image -->
    <div class="product-image-wrapper">
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="product-image"
        loading="lazy"
      />
      <div v-else class="product-image-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
      </div>
      <!-- Category Badge -->
      <span v-if="category" class="product-category">{{ category }}</span>
    </div>

    <!-- Content -->
    <div class="product-content">
      <h3 class="product-name">{{ name }}</h3>
      <p v-if="description" class="product-description">{{ description }}</p>
      <p class="product-price">
        <span class="price-value">{{ formatPrice(price) }}</span>
        <span class="price-suffix">/day</span>
      </p>
    </div>

    <!-- Actions -->
    <div class="product-actions">
      <a :href="`${bookingUrl}?item=${id}`" class="btn-view-details">
        View Details
      </a>
      <button class="btn-add-to-cart" @click="handleAddToCart">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        Add to Cart
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--card-border, #e5e7eb);
  border-radius: var(--card-radius, 12px);
  overflow: hidden;
  transition: all 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Style variants */
.product-card.style-dark {
  --card-bg: #1f1f1f;
  --card-border: rgba(255, 255, 255, 0.1);
  --card-text: #ffffff;
  --card-text-muted: #a1a1aa;
}

.product-card.style-minimal {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-text: #111111;
  --card-text-muted: #6b7280;
}

.product-card.style-vibrant {
  --card-bg: #ffffff;
  --card-border: transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.product-card.style-playful {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-radius: 20px;
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: var(--card-bg, #f5f5f5);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #9ca3af;
}

.product-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  background: var(--color-primary, #f59e0b);
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
}

.product-content {
  padding: 1.25rem;
  flex: 1;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--card-text, #111);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-description {
  font-size: 0.875rem;
  color: var(--card-text-muted, #6b7280);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary, #f59e0b);
}

.price-suffix {
  font-size: 0.875rem;
  color: var(--card-text-muted, #6b7280);
}

.product-actions {
  display: flex;
  gap: 8px;
  padding: 0 1.25rem 1.25rem;
}

.btn-view-details {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid var(--card-border, #e5e7eb);
  color: var(--card-text, #111);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s;
}

.btn-view-details:hover {
  border-color: var(--color-primary, #f59e0b);
  color: var(--color-primary, #f59e0b);
}

.btn-add-to-cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.75rem 1rem;
  background: var(--color-primary, #f59e0b);
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-add-to-cart:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
```

**Step 3: Verify files created**

Run: `ls -la nuxt/app/components/website-templates/ nuxt/app/composables/useTemplateCart.ts`

**Step 4: Commit**

```bash
git add nuxt/app/components/website-templates/ProductCard.vue nuxt/app/composables/useTemplateCart.ts
git commit -m "feat: add ProductCard with View Details and Add to Cart functionality"
```

---

### Task 3: Create Featured Products Grid with Toggle

**Files:**
- Create: `nuxt/app/components/website-templates/FeaturedProductsGrid.vue`

**Step 1: Create the grid component**

```vue
<!-- nuxt/app/components/website-templates/FeaturedProductsGrid.vue -->
<script setup lang="ts">
interface Product {
  id: string | number
  name: string
  price: number
  image?: string
  category?: string
  description?: string
}

interface Props {
  products: Product[]
  headline?: string
  subheadline?: string
  showToggle?: boolean
  initiallyVisible?: boolean
  columns?: 2 | 3 | 4
  limit?: number
  bookingUrl?: string
  style?: 'minimal' | 'vibrant' | 'dark' | 'playful'
}

const props = withDefaults(defineProps<Props>(), {
  headline: 'Featured Rentals',
  subheadline: 'Browse our most popular items',
  showToggle: true,
  initiallyVisible: true,
  columns: 3,
  limit: 6,
  bookingUrl: '/book',
  style: 'minimal'
})

const isVisible = ref(props.initiallyVisible)

const displayedProducts = computed(() => {
  return props.products.slice(0, props.limit)
})

const gridCols = computed(() => {
  switch (props.columns) {
    case 2: return 'grid-cols-1 sm:grid-cols-2'
    case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }
})
</script>

<template>
  <section class="featured-products-section" :class="[`style-${style}`]">
    <div class="section-container">
      <!-- Header with Toggle -->
      <div class="section-header">
        <div>
          <h2 class="section-headline">{{ headline }}</h2>
          <p class="section-subheadline">{{ subheadline }}</p>
        </div>
        <div v-if="showToggle" class="section-toggle">
          <label class="toggle-label">
            <span>Show Featured</span>
            <button
              class="toggle-switch"
              :class="{ active: isVisible }"
              @click="isVisible = !isVisible"
            >
              <span class="toggle-knob" />
            </button>
          </label>
        </div>
      </div>

      <!-- Products Grid -->
      <Transition name="fade">
        <div v-if="isVisible && displayedProducts.length > 0" class="products-grid" :class="gridCols">
          <ProductCard
            v-for="product in displayedProducts"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :image="product.image"
            :category="product.category"
            :description="product.description"
            :booking-url="bookingUrl"
            :style="style"
          />
        </div>
      </Transition>

      <!-- Empty State -->
      <div v-if="isVisible && displayedProducts.length === 0" class="empty-state">
        <p>No products available at this time.</p>
      </div>

      <!-- View All Link -->
      <div v-if="isVisible && products.length > limit" class="view-all-wrapper">
        <a :href="`${bookingUrl}/inventory`" class="view-all-link">
          View All {{ products.length }} Items
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured-products-section {
  padding: 4rem 0;
  background: var(--section-bg, #f9fafb);
}

.featured-products-section.style-dark {
  --section-bg: #111111;
  --section-text: #ffffff;
  --section-text-muted: #a1a1aa;
}

.featured-products-section.style-minimal {
  --section-bg: #ffffff;
  --section-text: #111111;
  --section-text-muted: #6b7280;
}

.section-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-headline {
  font-size: 2rem;
  font-weight: 700;
  color: var(--section-text, #111);
  margin-bottom: 0.5rem;
}

.section-subheadline {
  font-size: 1.125rem;
  color: var(--section-text-muted, #6b7280);
}

.section-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--section-text-muted, #6b7280);
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 26px;
  background: #e5e7eb;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-switch.active {
  background: var(--color-primary, #f59e0b);
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(22px);
}

.products-grid {
  display: grid;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--section-text-muted, #6b7280);
}

.view-all-wrapper {
  margin-top: 2.5rem;
  text-align: center;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary, #f59e0b);
  text-decoration: none;
  transition: gap 0.2s;
}

.view-all-link:hover {
  gap: 0.75rem;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
```

**Step 2: Commit**

```bash
git add nuxt/app/components/website-templates/FeaturedProductsGrid.vue
git commit -m "feat: add FeaturedProductsGrid with visibility toggle"
```

---

### Task 4: Remove Unused Templates and Update Registry

**Files:**
- Modify: `nuxt/app/lib/templates/index.ts`
- Delete: templates/starter, bounce, sugarrush, springboard, coastal, fiesta, carnival, industrial folders

**Step 1: Update template registry to only include 7 templates**

Edit `nuxt/app/lib/templates/index.ts`:

Replace the `templateLoaders` object (lines 42-58) with:
```typescript
const templateLoaders: Record<string, () => Promise<{ default: UnifiedTemplate }>> = {
  minimal: () => import('./minimal') as any,
  garden: () => import('./garden') as any,
  neon: () => import('./neon') as any,
  energy: () => import('./energy') as any,
  luxe: () => import('./luxe') as any,
  trust: () => import('./trust') as any,
  funhouse: () => import('./funhouse') as any
}
```

Replace `getTemplateList()` function (lines 81-178) with:
```typescript
export const getTemplateList = (): {
  id: string
  name: string
  codename: string
  description: string
}[] => {
  return [
    {
      id: 'minimal',
      name: 'Minimal',
      codename: 'Minimal',
      description: 'Ultra-clean Swiss design with confident neutrals. Perfect for modern, professional businesses.'
    },
    {
      id: 'garden',
      name: 'Garden',
      codename: 'Garden',
      description: 'Natural, earthy design with lush greens. Perfect for eco-friendly and outdoor events.'
    },
    {
      id: 'neon',
      name: 'Neon',
      codename: 'Neon',
      description: 'Vibrant dark theme with neon accents. Perfect for teen parties and evening events.'
    },
    {
      id: 'energy',
      name: 'Energy',
      codename: 'Energy',
      description: 'Bold dark theme with emerald accents. Perfect for sports events and active entertainment.'
    },
    {
      id: 'luxe',
      name: 'Elegant Premium',
      codename: 'Luxe',
      description: 'Sophisticated dark theme with gold accents for high-end events and upscale celebrations.'
    },
    {
      id: 'trust',
      name: 'Clean Professional',
      codename: 'Trust',
      description: 'Professional design with blue tones for corporate clients, schools, and churches.'
    },
    {
      id: 'funhouse',
      name: 'Funhouse',
      codename: 'Funhouse',
      description: 'Playful and energetic design with bold colors - perfect for family-friendly bounce house rentals.'
    }
  ]
}
```

**Step 2: Delete unused template folders**

```bash
rm -rf nuxt/app/lib/templates/starter
rm -rf nuxt/app/lib/templates/bounce
rm -rf nuxt/app/lib/templates/sugarrush
rm -rf nuxt/app/lib/templates/springboard
rm -rf nuxt/app/lib/templates/coastal
rm -rf nuxt/app/lib/templates/fiesta
rm -rf nuxt/app/lib/templates/carnival
rm -rf nuxt/app/lib/templates/industrial
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: condense templates to 7 - remove starter, bounce, sugarrush, springboard, coastal, fiesta, carnival, industrial"
```

---

### Task 5: Fix Minimal Template Navbar

**Files:**
- Modify: `nuxt/app/lib/templates/minimal/pages/home.ts`
- Modify: All other minimal pages to use the new navbar

**Step 1: Replace navigation section in minimal/pages/home.ts**

Replace the `navigationSection` import and first section with proper inline navbar HTML that includes cart:

```typescript
// At top of file, remove: import { navigationSection } from '../../shared/navigation'

// Replace first section in sections array with:
{
  id: 'navigation',
  name: 'Navigation',
  html: `
<nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
  <div class="container">
    <div class="flex items-center justify-between h-16">
      <a href="/" class="text-xl font-bold text-neutral-900 tracking-tight">{{business.name}}</a>
      <div class="hidden md:flex items-center gap-8">
        <a href="#inventory" class="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Rentals</a>
        <a href="#how-it-works" class="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">How It Works</a>
        <a href="#about" class="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">About</a>
        <a href="#contact" class="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Contact</a>
      </div>
      <div class="flex items-center gap-4">
        <a href="/book/checkout" class="relative text-neutral-600 hover:text-neutral-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </a>
        <a href="/book" class="hidden sm:inline-flex items-center px-5 py-2 bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors">Book Now</a>
        <button class="md:hidden p-2 text-neutral-600" onclick="this.closest('nav').classList.toggle('mobile-open')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </div>
  <div class="hidden mobile-menu md:hidden border-t border-neutral-200 bg-white">
    <div class="container py-4 space-y-3">
      <a href="#inventory" class="block text-neutral-600 hover:text-neutral-900">Rentals</a>
      <a href="#how-it-works" class="block text-neutral-600 hover:text-neutral-900">How It Works</a>
      <a href="#about" class="block text-neutral-600 hover:text-neutral-900">About</a>
      <a href="#contact" class="block text-neutral-600 hover:text-neutral-900">Contact</a>
      <a href="/book" class="block w-full text-center py-2 bg-neutral-900 text-white font-semibold">Book Now</a>
    </div>
  </div>
</nav>
<style>
nav.mobile-open .mobile-menu { display: block; }
</style>
  `.trim()
}
```

**Step 2: Repeat for all minimal pages** (about.ts, contact.ts, inventory.ts, booking.ts, terms.ts, waiver.ts)

Each page file needs the same navbar section at the beginning of its sections array.

**Step 3: Test in browser**

Navigate to: `http://localhost:3005/app/website/builder?template=minimal`
Expected: Navbar displays correctly with proper styling and cart icon

**Step 4: Commit**

```bash
git add nuxt/app/lib/templates/minimal/
git commit -m "fix: update Minimal template navbar with proper styling and cart"
```

---

### Task 6: Fix Remaining Template Navbars (Neon, Energy, Luxe, Trust)

Repeat Task 5 pattern for each template with theme-appropriate colors:

**Neon** (`nuxt/app/lib/templates/neon/`):
- Dark background (#0a0a0a)
- Neon cyan accent (#00f5ff)
- White text

**Energy** (`nuxt/app/lib/templates/energy/`):
- Dark background (#111111)
- Emerald accent (#10b981)
- White text

**Luxe** (`nuxt/app/lib/templates/luxe/`):
- Dark background (#0c0c0c)
- Gold accent (#d4af37)
- White/cream text

**Trust** (`nuxt/app/lib/templates/trust/`):
- White background
- Blue accent (#3b82f6)
- Dark text

Each template's pages need updated navbar HTML with correct colors and cart icon.

---

### Task 7: Update Website Template Selection Page

**Files:**
- Modify: `nuxt/app/pages/app/website/index.vue`

**Step 1: Update templates array to match 7 templates**

Replace the `templates` array with:

```typescript
const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    codename: 'Minimal',
    description: 'Ultra-clean Swiss design with confident neutrals. Perfect for modern, professional businesses.',
    color: 'from-neutral-400 to-neutral-600',
    badge: 'Professional',
    badgeColor: 'bg-neutral-500'
  },
  {
    id: 'garden',
    name: 'Garden',
    codename: 'Garden',
    description: 'Natural, earthy design with lush greens. Perfect for eco-friendly and outdoor events.',
    color: 'from-green-500 to-emerald-600',
    badge: 'Nature',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'neon',
    name: 'Neon',
    codename: 'Neon',
    description: 'Vibrant dark theme with neon accents. Perfect for teen parties and evening events.',
    color: 'from-cyan-400 to-purple-500',
    badge: 'Vibrant',
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'energy',
    name: 'Energy',
    codename: 'Energy',
    description: 'Bold dark theme with emerald accents. Perfect for sports events and active entertainment.',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Bold',
    badgeColor: 'bg-emerald-500'
  },
  {
    id: 'luxe',
    name: 'Elegant Premium',
    codename: 'Luxe',
    description: 'Sophisticated dark theme with gold accents for high-end events and upscale celebrations.',
    color: 'from-amber-500 to-yellow-600',
    badge: 'Premium',
    badgeColor: 'bg-amber-500'
  },
  {
    id: 'trust',
    name: 'Clean Professional',
    codename: 'Trust',
    description: 'Professional design with blue tones for corporate clients, schools, and churches.',
    color: 'from-blue-500 to-sky-600',
    badge: 'Corporate',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'funhouse',
    name: 'Funhouse',
    codename: 'Funhouse',
    description: 'Playful and energetic design with bold colors - perfect for family-friendly bounce house rentals.',
    color: 'from-red-500 to-purple-500',
    badge: 'Fun',
    badgeColor: 'bg-red-500'
  }
]
```

**Step 2: Commit**

```bash
git add nuxt/app/pages/app/website/index.vue
git commit -m "feat: update template selection page with 7 curated templates"
```

---

### Task 8: Update Smart Block Renderer for Real Product Data

**Files:**
- Modify: `nuxt/app/lib/templates/smart-block-renderer.ts`

**Step 1: Update the item card generator to include View Details and Add to Cart**

Find the `generateItemCard` function and update it to output product cards with both buttons.

**Step 2: Ensure the product grid uses real inventory data**

The `generateInventoryGrid` and `generateFeaturedItemsGrid` functions should accept inventory items from the API and render them with the new card format.

---

### Task 9: Browser Testing - Each Template

**For each of the 7 templates:**

1. Navigate to: `http://localhost:3005/app/website/builder?template=[template-id]`
2. Take screenshot
3. Verify:
   - Navbar is properly styled (not broken/overlapping text)
   - Cart icon is visible in navbar
   - CTA button works
   - Mobile menu works (resize to mobile)
4. Check product cards:
   - View Details button works
   - Add to Cart button works
   - Toast notification appears
5. Test cart:
   - Add items
   - Verify cart count updates
   - Navigate to checkout

---

### Task 10: Final Integration Test

**Step 1: Full flow test**

1. Select "Minimal" template
2. Navigate through pages
3. Add items to cart
4. Go to checkout
5. Verify booking widget loads with calendar/time selection

**Step 2: Commit final changes**

```bash
git add -A
git commit -m "feat: complete website builder template overhaul - 7 templates with working navbars, cart, and product cards"
```

---

## Summary of Changes

- **7 Templates**: Minimal, Garden, Neon, Energy, Luxe, Trust, Funhouse
- **Fixed Navbars**: Proper styling, cart icon, mobile responsive
- **Product Cards**: View Details + Add to Cart buttons
- **Cart System**: localStorage persistence, count badge in navbar
- **Featured Toggle**: Users can show/hide featured products
- **Custom Domain Notice**: "Coming soon" in footer
- **rb-payload Integration**: Cart links to booking widget with calendar/time selection
