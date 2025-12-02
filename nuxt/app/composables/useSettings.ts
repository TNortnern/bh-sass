import { ref } from 'vue'
import type { Ref } from 'vue'

export interface BusinessSettings {
  name: string
  logo: string | null
  description: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  timezone: string
  businessHours: {
    monday: { open: string; close: string; enabled: boolean }
    tuesday: { open: string; close: string; enabled: boolean }
    wednesday: { open: string; close: string; enabled: boolean }
    thursday: { open: string; close: string; enabled: boolean }
    friday: { open: string; close: string; enabled: boolean }
    saturday: { open: string; close: string; enabled: boolean }
    sunday: { open: string; close: string; enabled: boolean }
  }
  serviceArea: {
    radius: number
    unit: 'miles' | 'km'
    zipCodes: string[]
  }
}

export interface BookingSettings {
  leadTime: number // hours
  maxAdvanceBooking: number // days
  depositPercentage: number
  cancellationPolicy: 'flexible' | 'moderate' | 'strict'
  autoConfirm: boolean
  preventOverbooking: boolean
  bufferTime: number // minutes between rentals
}

export interface PaymentSettings {
  stripeConnected: boolean
  stripeAccountId: string | null
  platformFee: number
  payoutSchedule: 'daily' | 'weekly' | 'monthly'
  lastPayoutDate: string | null
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  status: 'active' | 'pending' | 'inactive'
  avatar: string | null
  joinedAt: string
}

export interface NotificationSettings {
  email: {
    newBooking: boolean
    cancellation: boolean
    payment: boolean
    reminder: boolean
    dailySummary: boolean
  }
  inApp: {
    newBooking: boolean
    cancellation: boolean
    payment: boolean
    reminder: boolean
  }
  reminderTiming: number // hours before rental
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
}

export interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  secret: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface SettingsState {
  business: Ref<BusinessSettings | null>
  booking: Ref<BookingSettings | null>
  payments: Ref<PaymentSettings | null>
  team: Ref<TeamMember[]>
  notifications: Ref<NotificationSettings | null>
  apiKeys: Ref<ApiKey[]>
  webhooks: Ref<WebhookEndpoint[]>
  loading: Ref<boolean>
  saving: Ref<boolean>
  hasUnsavedChanges: Ref<boolean>
}

const state: SettingsState = {
  business: ref(null),
  booking: ref(null),
  payments: ref(null),
  team: ref([]),
  notifications: ref(null),
  apiKeys: ref([]),
  webhooks: ref([]),
  loading: ref(false),
  saving: ref(false),
  hasUnsavedChanges: ref(false),
}

// Mock data for development
const mockBusinessSettings: BusinessSettings = {
  name: 'BouncePro Rentals',
  logo: null,
  description: 'Premium bounce house and party equipment rentals serving the greater metro area',
  phone: '(555) 123-4567',
  email: 'hello@bouncepro.com',
  address: {
    street: '123 Business Park Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
  },
  timezone: 'America/Chicago',
  businessHours: {
    monday: { open: '09:00', close: '18:00', enabled: true },
    tuesday: { open: '09:00', close: '18:00', enabled: true },
    wednesday: { open: '09:00', close: '18:00', enabled: true },
    thursday: { open: '09:00', close: '18:00', enabled: true },
    friday: { open: '09:00', close: '20:00', enabled: true },
    saturday: { open: '08:00', close: '20:00', enabled: true },
    sunday: { open: '10:00', close: '16:00', enabled: true },
  },
  serviceArea: {
    radius: 25,
    unit: 'miles',
    zipCodes: ['78701', '78702', '78703', '78704'],
  },
}

const mockBookingSettings: BookingSettings = {
  leadTime: 24,
  maxAdvanceBooking: 365,
  depositPercentage: 25,
  cancellationPolicy: 'moderate',
  autoConfirm: false,
  preventOverbooking: true,
  bufferTime: 30,
}

const mockPaymentSettings: PaymentSettings = {
  stripeConnected: true,
  stripeAccountId: 'acct_1234567890',
  platformFee: 3.5,
  payoutSchedule: 'weekly',
  lastPayoutDate: '2024-11-28',
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@bouncepro.com',
    role: 'admin',
    status: 'active',
    avatar: null,
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@bouncepro.com',
    role: 'manager',
    status: 'active',
    avatar: null,
    joinedAt: '2024-03-20',
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@bouncepro.com',
    role: 'staff',
    status: 'pending',
    avatar: null,
    joinedAt: '2024-11-28',
  },
]

const mockNotificationSettings: NotificationSettings = {
  email: {
    newBooking: true,
    cancellation: true,
    payment: true,
    reminder: true,
    dailySummary: true,
  },
  inApp: {
    newBooking: true,
    cancellation: true,
    payment: true,
    reminder: false,
  },
  reminderTiming: 24,
}

// Mock API keys removed - now using real Payload API

// Mock webhooks removed - now using real Payload API

export const useSettings = () => {
  const toast = useToast()

  const fetchSettings = async () => {
    state.loading.value = true
    try {
      // Load mock settings data (these can be moved to Payload later)
      state.business.value = mockBusinessSettings
      state.booking.value = mockBookingSettings
      state.payments.value = mockPaymentSettings
      state.team.value = mockTeamMembers
      state.notifications.value = mockNotificationSettings

      // Fetch real API keys from Payload
      try {
        const apiKeysResponse = await $fetch<{ docs: any[] }>('/api/api-keys')
        state.apiKeys.value = apiKeysResponse.docs.map((key: any) => ({
          id: String(key.id),
          name: key.name,
          key: key.key,
          createdAt: key.createdAt?.split('T')[0] || '',
          lastUsed: key.lastUsed?.split('T')[0] || null,
        }))
      } catch (error) {
        console.warn('Failed to fetch API keys, using empty array:', error)
        state.apiKeys.value = []
      }

      // Fetch real webhooks from Payload
      try {
        const webhooksResponse = await $fetch<{ docs: any[] }>('/api/webhook-endpoints')
        state.webhooks.value = webhooksResponse.docs.map((webhook: any) => ({
          id: String(webhook.id),
          url: webhook.url,
          events: webhook.events?.map((e: any) => e.event) || [],
          secret: webhook.secret,
          status: webhook.active ? 'active' : 'inactive',
          createdAt: webhook.createdAt?.split('T')[0] || '',
        }))
      } catch (error) {
        console.warn('Failed to fetch webhooks, using empty array:', error)
        state.webhooks.value = []
      }

      state.hasUnsavedChanges.value = false
    } catch (error) {
      toast.add({
        title: 'Error loading settings',
        description: 'Failed to load settings. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.loading.value = false
    }
  }

  const updateSettings = async (section: string, data: any) => {
    state.saving.value = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update local state
      switch (section) {
        case 'business':
          state.business.value = { ...state.business.value!, ...data }
          break
        case 'booking':
          state.booking.value = { ...state.booking.value!, ...data }
          break
        case 'payments':
          state.payments.value = { ...state.payments.value!, ...data }
          break
        case 'notifications':
          state.notifications.value = { ...state.notifications.value!, ...data }
          break
      }

      state.hasUnsavedChanges.value = false

      toast.add({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully.',
        color: 'green',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error saving settings',
        description: 'Failed to save settings. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const connectStripe = async () => {
    try {
      // Simulate Stripe Connect flow
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In production, this would redirect to Stripe
      const response = await $fetch('/api/stripe/connect', {
        method: 'POST',
      })

      // For now, just update state
      toast.add({
        title: 'Redirecting to Stripe',
        description: 'You will be redirected to complete the connection.',
        color: 'blue',
      })

      return response
    } catch (error) {
      toast.add({
        title: 'Error connecting Stripe',
        description: 'Failed to initiate Stripe connection. Please try again.',
        color: 'red',
      })
      throw error
    }
  }

  const inviteTeamMember = async (email: string, role: TeamMember['role']) => {
    state.saving.value = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newMember: TeamMember = {
        id: String(state.team.value.length + 1),
        name: email.split('@')[0],
        email,
        role,
        status: 'pending',
        avatar: null,
        joinedAt: new Date().toISOString().split('T')[0],
      }

      state.team.value.push(newMember)

      toast.add({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}.`,
        color: 'green',
      })

      return newMember
    } catch (error) {
      toast.add({
        title: 'Error sending invitation',
        description: 'Failed to send team member invitation. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const removeTeamMember = async (memberId: string) => {
    state.saving.value = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      state.team.value = state.team.value.filter((m) => m.id !== memberId)

      toast.add({
        title: 'Team member removed',
        description: 'The team member has been removed successfully.',
        color: 'green',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error removing team member',
        description: 'Failed to remove team member. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const createApiKey = async (name: string) => {
    state.saving.value = true
    try {
      // Create API key in Payload
      const response = await $fetch<{ doc: any }>('/api/api-keys', {
        method: 'POST',
        body: { name },
      })

      const newKey: ApiKey = {
        id: String(response.doc.id),
        name: response.doc.name,
        key: response.doc.key,
        createdAt: response.doc.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        lastUsed: null,
      }

      state.apiKeys.value.push(newKey)

      toast.add({
        title: 'API key created',
        description: 'Your new API key has been generated. Make sure to copy it now.',
        color: 'green',
      })

      return newKey
    } catch (error) {
      toast.add({
        title: 'Error creating API key',
        description: 'Failed to create API key. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const deleteApiKey = async (keyId: string) => {
    state.saving.value = true
    try {
      // Delete API key from Payload
      await $fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      state.apiKeys.value = state.apiKeys.value.filter((k) => k.id !== keyId)

      toast.add({
        title: 'API key deleted',
        description: 'The API key has been deleted successfully.',
        color: 'green',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting API key',
        description: 'Failed to delete API key. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const addWebhookEndpoint = async (url: string, events: string[]) => {
    state.saving.value = true
    try {
      // Create webhook in Payload
      const response = await $fetch<{ doc: any }>('/api/webhook-endpoints', {
        method: 'POST',
        body: {
          url,
          events: events.map((event) => ({ event })),
          active: true,
        },
      })

      const newWebhook: WebhookEndpoint = {
        id: String(response.doc.id),
        url: response.doc.url,
        events: response.doc.events?.map((e: any) => e.event) || events,
        secret: response.doc.secret,
        status: 'active',
        createdAt: response.doc.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      }

      state.webhooks.value.push(newWebhook)

      toast.add({
        title: 'Webhook endpoint added',
        description: 'Your webhook endpoint has been configured successfully.',
        color: 'green',
      })

      return newWebhook
    } catch (error) {
      toast.add({
        title: 'Error adding webhook',
        description: 'Failed to add webhook endpoint. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const deleteWebhookEndpoint = async (webhookId: string) => {
    state.saving.value = true
    try {
      // Delete webhook from Payload
      await $fetch(`/api/webhook-endpoints/${webhookId}`, {
        method: 'DELETE',
      })

      state.webhooks.value = state.webhooks.value.filter((w) => w.id !== webhookId)

      toast.add({
        title: 'Webhook endpoint deleted',
        description: 'The webhook endpoint has been deleted successfully.',
        color: 'green',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting webhook',
        description: 'Failed to delete webhook endpoint. Please try again.',
        color: 'red',
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const testWebhook = async (webhookId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.add({
        title: 'Test webhook sent',
        description: 'A test event has been sent to your webhook endpoint.',
        color: 'green',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error testing webhook',
        description: 'Failed to send test webhook. Please try again.',
        color: 'red',
      })
      throw error
    }
  }

  const markHasChanges = () => {
    state.hasUnsavedChanges.value = true
  }

  return {
    // State
    business: state.business,
    booking: state.booking,
    payments: state.payments,
    team: state.team,
    notifications: state.notifications,
    apiKeys: state.apiKeys,
    webhooks: state.webhooks,
    loading: state.loading,
    saving: state.saving,
    hasUnsavedChanges: state.hasUnsavedChanges,

    // Methods
    fetchSettings,
    updateSettings,
    connectStripe,
    inviteTeamMember,
    removeTeamMember,
    createApiKey,
    deleteApiKey,
    addWebhookEndpoint,
    deleteWebhookEndpoint,
    testWebhook,
    markHasChanges,
  }
}
