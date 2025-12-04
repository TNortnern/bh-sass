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
        credentials: 'include',
      })
      return response
    } catch (error: any) {
      console.error('Error fetching subscription:', error)
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to fetch subscription',
        color: 'red',
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
          cancelUrl,
        },
      })

      // Redirect to Stripe Checkout
      if (response.url) {
        window.location.href = response.url
      }

      return response
    } catch (error: any) {
      console.error('Error creating checkout session:', error)
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to create checkout session',
        color: 'red',
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
          cancelAtPeriodEnd,
        },
      })

      toast.add({
        title: 'Success',
        description: response.message || 'Subscription canceled successfully',
        color: 'green',
      })

      return response
    } catch (error: any) {
      console.error('Error canceling subscription:', error)
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to cancel subscription',
        color: 'red',
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
        credentials: 'include',
      })

      // Redirect to Stripe Customer Portal
      if (response.url) {
        window.location.href = response.url
      }

      return response
    } catch (error: any) {
      console.error('Error getting customer portal:', error)
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to open customer portal',
        color: 'red',
      })
      throw error
    }
  }

  return {
    getSubscription,
    createCheckoutSession,
    cancelSubscription,
    getCustomerPortal,
  }
}
