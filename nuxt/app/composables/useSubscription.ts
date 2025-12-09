export const useSubscription = () => {
  const config = useRuntimeConfig()
  const toast = useToast()

  /**
   * Get current subscription
   */
  const getSubscription = async () => {
    try {
      const response = await $fetch('/api/stripe/subscription', {
        baseURL: config.public.payloadUrl,
        credentials: 'include'
      })
      return response
    } catch (error: unknown) {
      console.error('Error fetching subscription:', error)
      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Failed to fetch subscription'
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Create checkout session for a subscription
   */
  const createCheckoutSession = async (priceId: string, successUrl?: string, cancelUrl?: string) => {
    try {
      const response = await $fetch('/api/stripe/subscription/create', {
        method: 'POST',
        baseURL: config.public.payloadUrl,
        credentials: 'include',
        body: {
          priceId,
          successUrl,
          cancelUrl
        }
      })

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url
      }

      return response
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error)
      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Failed to create checkout session'
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  const cancelSubscription = async (cancelAtPeriodEnd = true) => {
    try {
      const response = await $fetch('/api/stripe/subscription/cancel', {
        method: 'POST',
        baseURL: config.public.payloadUrl,
        credentials: 'include',
        body: {
          cancelAtPeriodEnd
        }
      })

      toast.add({
        title: 'Success',
        description: response.message || 'Subscription canceled successfully',
        color: 'success'
      })

      return response
    } catch (error: unknown) {
      console.error('Error canceling subscription:', error)
      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Failed to cancel subscription'
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Get Stripe Customer Portal link
   */
  const getCustomerPortal = async () => {
    try {
      const response = await $fetch('/api/stripe/portal', {
        baseURL: config.public.payloadUrl,
        credentials: 'include'
      })

      // Redirect to Stripe Customer Portal
      if (response.url) {
        window.location.href = response.url
      }

      return response
    } catch (error: unknown) {
      console.error('Error getting customer portal:', error)
      const errorMessage = error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Failed to open customer portal'
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  return {
    getSubscription,
    createCheckoutSession,
    cancelSubscription,
    getCustomerPortal
  }
}
