import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface CartItem {
  id: string
  itemId: string
  itemName: string
  itemSlug: string
  itemImage?: string
  startDate: string
  endDate: string
  basePrice: number
  addOns: CartAddOn[]
  quantity: number
}

export interface CartAddOn {
  id: string
  name: string
  price: number
}

const items: Ref<CartItem[]> = ref([])
const CART_STORAGE_KEY = 'bh_cart'

// Load cart from localStorage on initialization
if (import.meta.client) {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY)
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart)
    } catch (e) {
      console.error('Failed to parse saved cart:', e)
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }
}

export const useCart = () => {
  // Save cart to localStorage whenever it changes
  const saveCart = () => {
    if (import.meta.client) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.itemId}-${Date.now()}`
    }
    items.value.push(newItem)
    saveCart()
  }

  const removeItem = (id: string) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity = Math.max(1, quantity)
      saveCart()
    }
  }

  const clear = () => {
    items.value = []
    saveCart()
  }

  // Calculate number of days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  // Calculate subtotal for a single item
  const getItemTotal = (item: CartItem): number => {
    const days = calculateDays(item.startDate, item.endDate)
    const baseTotal = item.basePrice * days * item.quantity
    const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0) * days * item.quantity
    return baseTotal + addOnsTotal
  }

  // Computed values
  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + getItemTotal(item), 0)
  })

  const deliveryFee = computed(() => {
    // $50 delivery fee if cart is not empty
    return items.value.length > 0 ? 50 : 0
  })

  const tax = computed(() => {
    // 8.25% tax rate
    return (subtotal.value + deliveryFee.value) * 0.0825
  })

  const total = computed(() => {
    return subtotal.value + deliveryFee.value + tax.value
  })

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  return {
    items: computed(() => items.value),
    addItem,
    removeItem,
    updateQuantity,
    clear,
    getItemTotal,
    calculateDays,
    subtotal,
    deliveryFee,
    tax,
    total,
    itemCount
  }
}
