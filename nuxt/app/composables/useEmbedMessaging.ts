/**
 * PostMessage API for Embedded Widgets
 *
 * This composable provides bi-directional communication between
 * embedded widgets (iframes) and parent windows.
 *
 * ## Message Types (Widget → Parent)
 *
 * ### bh:ready
 * Sent when widget is loaded and ready.
 * ```js
 * { type: 'bh:ready', tenantSlug: 'bouncepro-demo', widgetType: 'products' }
 * ```
 *
 * ### bh:cart:updated
 * Sent when cart contents change.
 * ```js
 * {
 *   type: 'bh:cart:updated',
 *   cart: [{ id: '1', name: 'Bounce House', price: 250, quantity: 1 }],
 *   total: 250,
 *   itemCount: 1
 * }
 * ```
 *
 * ### bh:item:clicked
 * Sent when a product is clicked (for parent to handle navigation).
 * ```js
 * { type: 'bh:item:clicked', item: { id: '1', name: 'Bounce House', slug: 'bounce-house' } }
 * ```
 *
 * ### bh:checkout:requested
 * Sent when user clicks checkout button.
 * ```js
 * {
 *   type: 'bh:checkout:requested',
 *   tenantSlug: 'bouncepro-demo',
 *   cart: [...],
 *   total: 500,
 *   checkoutUrl: '/book/bouncepro-demo/checkout?cart=...'
 * }
 * ```
 *
 * ### bh:height:changed
 * Sent when widget content height changes (for auto-resize iframes).
 * ```js
 * { type: 'bh:height:changed', height: 800 }
 * ```
 *
 * ## Commands (Parent → Widget)
 *
 * ### bh:cart:add
 * Add an item to the cart.
 * ```js
 * { type: 'bh:cart:add', itemId: '1', quantity: 1 }
 * ```
 *
 * ### bh:cart:remove
 * Remove an item from the cart.
 * ```js
 * { type: 'bh:cart:remove', itemId: '1' }
 * ```
 *
 * ### bh:cart:clear
 * Clear the entire cart.
 * ```js
 * { type: 'bh:cart:clear' }
 * ```
 *
 * ### bh:navigate
 * Navigate within the widget.
 * ```js
 * { type: 'bh:navigate', to: 'checkout' }  // or 'products', 'item/bounce-house'
 * ```
 *
 * ### bh:theme:set
 * Change the widget theme.
 * ```js
 * { type: 'bh:theme:set', theme: 'dark' }  // 'light', 'dark', 'auto'
 * ```
 */

interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

export interface EmbedMessageEvent {
  type: string
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageHandler = (data: any) => void

export function useEmbedMessaging(tenantSlug: string, widgetType: string = 'products') {
  const isEmbedded = ref(false)
  const parentOrigin = ref<string | null>(null)
  const messageHandlers = new Map<string, MessageHandler[]>()

  // Check if we're in an iframe
  onMounted(() => {
    isEmbedded.value = window.parent !== window

    if (isEmbedded.value) {
      // Set up message listener
      window.addEventListener('message', handleMessage)

      // Send ready event
      sendToParent('bh:ready', {
        tenantSlug,
        widgetType,
        version: '1.0'
      })

      // Set up height observer for auto-resize
      setupHeightObserver()
    }
  })

  onUnmounted(() => {
    if (isEmbedded.value) {
      window.removeEventListener('message', handleMessage)
    }
  })

  // Handle incoming messages from parent
  function handleMessage(event: MessageEvent) {
    // Store parent origin on first message (for security)
    if (!parentOrigin.value && event.source === window.parent) {
      parentOrigin.value = event.origin
    }

    // Validate origin (allow localhost for development)
    const isValidOrigin = event.origin === parentOrigin.value
      || event.origin.includes('localhost')
      || event.origin.includes('127.0.0.1')

    if (!isValidOrigin) {
      console.warn('[Embed] Message from untrusted origin:', event.origin)
      return
    }

    const data = event.data as EmbedMessageEvent
    if (!data || typeof data.type !== 'string' || !data.type.startsWith('bh:')) {
      return // Ignore non-widget messages
    }

    // Dispatch to registered handlers
    const handlers = messageHandlers.get(data.type) || []
    handlers.forEach(handler => handler(data))

    // Also dispatch to wildcard handlers
    const wildcardHandlers = messageHandlers.get('*') || []
    wildcardHandlers.forEach(handler => handler(data))
  }

  // Send message to parent window
  function sendToParent(type: string, payload: Record<string, unknown> = {}) {
    if (!isEmbedded.value) return

    // Deep clone the payload to remove Vue reactivity proxies
    // This prevents "could not be cloned" errors with postMessage
    const clonedPayload = JSON.parse(JSON.stringify(payload))

    const message = {
      type,
      ...clonedPayload,
      timestamp: Date.now(),
      source: 'bh-widget'
    }

    // Use '*' for target origin to allow any parent
    // In production, you might want to restrict this
    window.parent.postMessage(message, '*')
  }

  // Register a handler for a specific message type
  function onMessage(type: string, handler: MessageHandler) {
    if (!messageHandlers.has(type)) {
      messageHandlers.set(type, [])
    }
    messageHandlers.get(type)!.push(handler)

    // Return unsubscribe function
    return () => {
      const handlers = messageHandlers.get(type)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  // Cart events
  function notifyCartUpdated(cart: CartItem[], total: number) {
    sendToParent('bh:cart:updated', {
      cart,
      total,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    })
  }

  function notifyItemClicked(item: { id: string, name: string, slug?: string }) {
    sendToParent('bh:item:clicked', { item })
  }

  function notifyCheckoutRequested(cart: CartItem[], total: number, checkoutUrl: string) {
    sendToParent('bh:checkout:requested', {
      tenantSlug,
      cart,
      total,
      checkoutUrl
    })
  }

  // Height observer for auto-resizing iframes
  function setupHeightObserver() {
    let lastHeight = 0

    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (height !== lastHeight) {
        lastHeight = height
        sendToParent('bh:height:changed', { height })
      }
    })

    observer.observe(document.body)

    // Send initial height
    nextTick(() => {
      sendToParent('bh:height:changed', { height: document.body.scrollHeight })
    })
  }

  return {
    isEmbedded: readonly(isEmbedded),
    parentOrigin: readonly(parentOrigin),

    // Outgoing messages
    sendToParent,
    notifyCartUpdated,
    notifyItemClicked,
    notifyCheckoutRequested,

    // Incoming messages
    onMessage
  }
}
