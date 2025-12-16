/**
 * Template Cart Composable
 * Manages cart state for website templates with localStorage persistence
 */

export interface CartItem {
  id: string | number
  name: string
  price: number
  image?: string
  quantity: number
}

const CART_STORAGE_KEY = 'website-cart-items'

export function useTemplateCart() {
  const items = useState<CartItem[]>('template-cart-items', () => [])
  const isLoaded = useState<boolean>('template-cart-loaded', () => false)

  // Load from localStorage on mount
  const loadCart = () => {
    if (import.meta.client && !isLoaded.value) {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        try {
          items.value = JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load cart:', e)
          items.value = []
        }
      }
      isLoaded.value = true
    }
  }

  // Save to localStorage
  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  // Add item to cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...item, quantity: 1 })
    }
    saveCart()
  }

  // Remove item from cart
  const removeItem = (id: string | number) => {
    items.value = items.value.filter(i => i.id !== id)
    saveCart()
  }

  // Update item quantity
  const updateQuantity = (id: string | number, quantity: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  // Clear all items
  const clearCart = () => {
    items.value = []
    saveCart()
  }

  // Computed properties
  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Load cart on client side
  if (import.meta.client) {
    loadCart()
  }

  return {
    items: readonly(items),
    itemCount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
    formatPrice
  }
}
