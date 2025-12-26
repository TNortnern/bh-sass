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
    monday: { open: string, close: string, enabled: boolean }
    tuesday: { open: string, close: string, enabled: boolean }
    wednesday: { open: string, close: string, enabled: boolean }
    thursday: { open: string, close: string, enabled: boolean }
    friday: { open: string, close: string, enabled: boolean }
    saturday: { open: string, close: string, enabled: boolean }
    sunday: { open: string, close: string, enabled: boolean }
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

export interface PlanLimits {
  maxUsers: number // -1 means unlimited
  maxItems: number
  maxBookings: number
}

export interface PlanInfo {
  name: string
  slug: string
  limits: PlanLimits
}

export interface ApiKey {
  id: string
  name: string
  key: string
  scopeType: 'full_access' | 'read_only' | 'booking_management' | 'custom'
  scopes: string[]
  expiresAt: string | null
  isActive: boolean
  createdAt: string
  lastUsed: string | null
  lastRotatedAt?: string | null
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
  tenantId: Ref<string | null>
  planInfo: Ref<PlanInfo | null>
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
  tenantId: ref(null),
  planInfo: ref(null)
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
    zip: '78701'
  },
  timezone: 'America/Chicago',
  businessHours: {
    monday: { open: '09:00', close: '18:00', enabled: true },
    tuesday: { open: '09:00', close: '18:00', enabled: true },
    wednesday: { open: '09:00', close: '18:00', enabled: true },
    thursday: { open: '09:00', close: '18:00', enabled: true },
    friday: { open: '09:00', close: '20:00', enabled: true },
    saturday: { open: '08:00', close: '20:00', enabled: true },
    sunday: { open: '10:00', close: '16:00', enabled: true }
  },
  serviceArea: {
    radius: 25,
    unit: 'miles',
    zipCodes: ['78701', '78702', '78703', '78704']
  }
}

const mockBookingSettings: BookingSettings = {
  leadTime: 24,
  maxAdvanceBooking: 365,
  depositPercentage: 25,
  cancellationPolicy: 'moderate',
  autoConfirm: false,
  preventOverbooking: true,
  bufferTime: 30
}

const mockPaymentSettings: PaymentSettings = {
  stripeConnected: true,
  stripeAccountId: 'acct_1234567890',
  platformFee: 3.5,
  payoutSchedule: 'weekly',
  lastPayoutDate: '2024-11-28'
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@bouncepro.com',
    role: 'admin',
    status: 'active',
    avatar: null,
    joinedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@bouncepro.com',
    role: 'manager',
    status: 'active',
    avatar: null,
    joinedAt: '2024-03-20'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike@bouncepro.com',
    role: 'staff',
    status: 'pending',
    avatar: null,
    joinedAt: '2024-11-28'
  }
]

// Mock API keys removed - now using real Payload API

// Mock webhooks removed - now using real Payload API

// Mock notification settings removed - now using real tenant defaults from Payload schema

export const useSettings = () => {
  const toast = useToast()
  // Get auth at composable level (not inside async functions)
  const { currentUser } = useAuth()

  // Helper to get tenant ID - first from stored state, then from current user
  const getTenantId = () => {
    // First check stored state (set during fetchSettings)
    if (state.tenantId.value) {
      return state.tenantId.value
    }
    // Fall back to current user
    return typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId
  }

  const fetchSettings = async () => {
    state.loading.value = true
    try {
      // Get tenant ID from auth
      const tenantId = getTenantId()

      // Fetch real tenant data from Payload
      if (tenantId) {
        try {
          interface TenantResponse {
            name?: string
            plan?: string
            logo?: { url?: string }
            description?: string
            phone?: string
            email?: string
            address?: {
              street?: string
              city?: string
              state?: string
              zip?: string
            }
            settings?: {
              timezone?: string
              bookingSettings?: {
                leadTime?: number
                maxAdvanceBooking?: number
                depositPercentage?: number
                requireApproval?: boolean
                bufferTime?: number
              }
              notificationSettings?: {
                emailNewBooking?: boolean
                emailCancellation?: boolean
                emailPayment?: boolean
                emailReminder?: boolean
                emailDailySummary?: boolean
                inAppNewBooking?: boolean
                inAppCancellation?: boolean
                inAppPayment?: boolean
                inAppReminder?: boolean
                reminderTiming?: number
              }
            }
            businessHours?: Record<string, { open?: string, close?: string, enabled?: boolean }>
            serviceArea?: {
              radius?: number
              unit?: 'miles' | 'km'
              zipCodes?: Array<{ code: string }>
            }
            stripeAccountId?: string
          }

          const tenantResponse = await $fetch<TenantResponse>(`/api/tenants/${tenantId}`, {
            credentials: 'include'
          })

          // Store tenant ID for later use in other operations
          state.tenantId.value = tenantId

          // Map Payload tenant data to BusinessSettings interface
          state.business.value = {
            name: tenantResponse.name || '',
            logo: tenantResponse.logo?.url || null,
            description: tenantResponse.description || '',
            phone: tenantResponse.phone || '',
            email: tenantResponse.email || '',
            address: {
              street: tenantResponse.address?.street || '',
              city: tenantResponse.address?.city || '',
              state: tenantResponse.address?.state || '',
              zip: tenantResponse.address?.zip || ''
            },
            timezone: tenantResponse.settings?.timezone || 'America/Chicago',
            businessHours: {
              monday: {
                open: tenantResponse.businessHours?.monday?.open || '09:00',
                close: tenantResponse.businessHours?.monday?.close || '18:00',
                enabled: tenantResponse.businessHours?.monday?.enabled ?? true
              },
              tuesday: {
                open: tenantResponse.businessHours?.tuesday?.open || '09:00',
                close: tenantResponse.businessHours?.tuesday?.close || '18:00',
                enabled: tenantResponse.businessHours?.tuesday?.enabled ?? true
              },
              wednesday: {
                open: tenantResponse.businessHours?.wednesday?.open || '09:00',
                close: tenantResponse.businessHours?.wednesday?.close || '18:00',
                enabled: tenantResponse.businessHours?.wednesday?.enabled ?? true
              },
              thursday: {
                open: tenantResponse.businessHours?.thursday?.open || '09:00',
                close: tenantResponse.businessHours?.thursday?.close || '18:00',
                enabled: tenantResponse.businessHours?.thursday?.enabled ?? true
              },
              friday: {
                open: tenantResponse.businessHours?.friday?.open || '09:00',
                close: tenantResponse.businessHours?.friday?.close || '20:00',
                enabled: tenantResponse.businessHours?.friday?.enabled ?? true
              },
              saturday: {
                open: tenantResponse.businessHours?.saturday?.open || '08:00',
                close: tenantResponse.businessHours?.saturday?.close || '20:00',
                enabled: tenantResponse.businessHours?.saturday?.enabled ?? true
              },
              sunday: {
                open: tenantResponse.businessHours?.sunday?.open || '10:00',
                close: tenantResponse.businessHours?.sunday?.close || '16:00',
                enabled: tenantResponse.businessHours?.sunday?.enabled ?? true
              }
            },
            serviceArea: {
              radius: tenantResponse.serviceArea?.radius || 25,
              unit: tenantResponse.serviceArea?.unit || 'miles',
              zipCodes: tenantResponse.serviceArea?.zipCodes?.map(z => z.code) || []
            }
          }

          // Map booking settings from tenant
          state.booking.value = {
            leadTime: tenantResponse.settings?.bookingSettings?.leadTime || 24,
            maxAdvanceBooking: tenantResponse.settings?.bookingSettings?.maxAdvanceBooking || 365,
            depositPercentage: tenantResponse.settings?.bookingSettings?.depositPercentage || 25,
            cancellationPolicy: 'moderate',
            autoConfirm: !(tenantResponse.settings?.bookingSettings?.requireApproval ?? false),
            preventOverbooking: true,
            bufferTime: tenantResponse.settings?.bookingSettings?.bufferTime || 30
          }

          // Map payment settings from tenant
          state.payments.value = {
            stripeConnected: !!tenantResponse.stripeAccountId,
            stripeAccountId: tenantResponse.stripeAccountId || null,
            platformFee: 3.5,
            payoutSchedule: 'weekly',
            lastPayoutDate: null
          }

          // Map notification settings from tenant
          const ns = tenantResponse.settings?.notificationSettings
          state.notifications.value = {
            email: {
              newBooking: ns?.emailNewBooking ?? true,
              cancellation: ns?.emailCancellation ?? true,
              payment: ns?.emailPayment ?? true,
              reminder: ns?.emailReminder ?? true,
              dailySummary: ns?.emailDailySummary ?? false
            },
            inApp: {
              newBooking: ns?.inAppNewBooking ?? true,
              cancellation: ns?.inAppCancellation ?? true,
              payment: ns?.inAppPayment ?? true,
              reminder: ns?.inAppReminder ?? false
            },
            reminderTiming: ns?.reminderTiming ?? 24
          }

          // Fetch plan info for limits and transaction fee
          if (tenantResponse.plan) {
            try {
              interface PlanResponse {
                docs: Array<{
                  name: string
                  slug: string
                  transactionFee: number
                  limits: {
                    maxUsers: number
                    maxItems: number
                    maxBookings: number
                  }
                }>
              }
              const planResponse = await $fetch<PlanResponse>('/api/plans', {
                query: {
                  where: { slug: { equals: tenantResponse.plan } },
                  limit: 1
                },
                credentials: 'include'
              })

              if (planResponse.docs.length > 0 && planResponse.docs[0]) {
                const plan = planResponse.docs[0]
                state.planInfo.value = {
                  name: plan.name,
                  slug: plan.slug,
                  limits: plan.limits
                }
                // Update platform fee from plan's transaction fee
                if (state.payments.value && typeof plan.transactionFee === 'number') {
                  state.payments.value.platformFee = plan.transactionFee
                }
              }
            } catch (planError) {
              console.warn('Failed to fetch plan info:', planError)
            }
          }
        } catch (error) {
          console.warn('Failed to fetch tenant data, using defaults:', error)
          // Fall back to mock data if tenant fetch fails (but NOT for notifications - use schema defaults)
          state.business.value = mockBusinessSettings
          state.booking.value = mockBookingSettings
          state.payments.value = mockPaymentSettings
          // Use the same defaults as defined in the Tenant schema
          state.notifications.value = {
            email: {
              newBooking: true,
              cancellation: true,
              payment: true,
              reminder: true,
              dailySummary: false
            },
            inApp: {
              newBooking: true,
              cancellation: true,
              payment: true,
              reminder: false
            },
            reminderTiming: 24
          }
        }
      } else {
        // No tenant ID - use mock data (but NOT for notifications - use schema defaults)
        state.business.value = mockBusinessSettings
        state.booking.value = mockBookingSettings
        state.payments.value = mockPaymentSettings
        // Use the same defaults as defined in the Tenant schema
        state.notifications.value = {
          email: {
            newBooking: true,
            cancellation: true,
            payment: true,
            reminder: true,
            dailySummary: false
          },
          inApp: {
            newBooking: true,
            cancellation: true,
            payment: true,
            reminder: false
          },
          reminderTiming: 24
        }
      }

      // Fetch real team members from Users collection
      if (tenantId) {
        try {
          interface UserResponse {
            id: string | number
            name?: string
            firstName?: string
            lastName?: string
            email?: string
            role?: 'admin' | 'manager' | 'staff'
            isActive?: boolean
            emailVerified?: boolean
            avatar?: { url?: string }
            createdAt?: string
          }

          const usersResponse = await $fetch<{ docs: UserResponse[] }>('/api/users', {
            query: {
              where: {
                tenantId: { equals: tenantId }
              },
              limit: 100
            },
            credentials: 'include'
          })

          state.team.value = usersResponse.docs.map(user => ({
            id: String(user.id),
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
            email: user.email || '',
            role: user.role || 'staff',
            status: user.isActive === false ? 'inactive' : (user.emailVerified ? 'active' : 'pending'),
            avatar: user.avatar?.url || null,
            joinedAt: user.createdAt?.split('T')[0] || ''
          }))
        } catch (error) {
          console.warn('Failed to fetch team members, using mock data:', error)
          state.team.value = mockTeamMembers
        }
      } else {
        state.team.value = mockTeamMembers
      }

      // Note: Notification settings are now fetched from tenant data above

      // Fetch real API keys from Payload
      try {
        interface ApiKeyResponse {
          id: string | number
          name?: string
          key?: string
          scopeType?: 'full_access' | 'read_only' | 'booking_management' | 'custom'
          scopes?: string[]
          expiresAt?: string | null
          isActive?: boolean
          createdAt?: string
          lastUsed?: string | null
          lastRotatedAt?: string | null
        }

        const apiKeysResponse = await $fetch<{ docs: ApiKeyResponse[] }>('/api/api-keys', {
          credentials: 'include'
        })
        state.apiKeys.value = apiKeysResponse.docs.map(key => ({
          id: String(key.id),
          name: key.name || '',
          key: key.key || '',
          scopeType: key.scopeType || 'full_access',
          scopes: key.scopes || [],
          expiresAt: key.expiresAt || null,
          isActive: key.isActive !== false,
          createdAt: key.createdAt?.split('T')[0] || '',
          lastUsed: key.lastUsed?.split('T')[0] || null,
          lastRotatedAt: key.lastRotatedAt?.split('T')[0] || null
        }))
      } catch (error) {
        console.warn('Failed to fetch API keys, using empty array:', error)
        state.apiKeys.value = []
      }

      // Fetch real webhooks from Payload
      try {
        interface WebhookResponse {
          id: string | number
          url?: string
          events?: Array<{ event: string }>
          secret?: string
          active?: boolean
          createdAt?: string
        }

        const webhooksResponse = await $fetch<{ docs: WebhookResponse[] }>('/api/webhook-endpoints', {
          credentials: 'include'
        })
        state.webhooks.value = webhooksResponse.docs.map(webhook => ({
          id: String(webhook.id),
          url: webhook.url || '',
          events: webhook.events?.map(e => e.event) || [],
          secret: webhook.secret || '',
          status: webhook.active ? 'active' : 'inactive',
          createdAt: webhook.createdAt?.split('T')[0] || ''
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
        color: 'error'
      })
      throw error
    } finally {
      state.loading.value = false
    }
  }

  const updateSettings = async (section: string, data: Record<string, unknown>) => {
    state.saving.value = true
    try {
      // Get tenant ID from auth
      const tenantId = getTenantId()

      if (!tenantId) {
        throw new Error('No tenant ID available')
      }

      // Prepare payload based on section
      let payload: Record<string, unknown> = {}

      switch (section) {
        case 'business': {
          // Map business settings to Tenant collection fields
          interface ServiceArea {
            radius?: number
            unit?: 'miles' | 'km'
            zipCodes?: string[]
          }
          const serviceArea = data.serviceArea as ServiceArea
          // Convert zipCodes from string[] to {code: string}[]
          const zipCodesFormatted = serviceArea?.zipCodes?.map((code: string) => ({ code })) || []

          payload = {
            name: data.name,
            description: data.description,
            phone: data.phone,
            email: data.email,
            address: data.address,
            settings: {
              timezone: data.timezone
            },
            businessHours: data.businessHours,
            serviceArea: {
              radius: serviceArea?.radius || 25,
              unit: serviceArea?.unit || 'miles',
              zipCodes: zipCodesFormatted
            }
          }
          break
        }
        case 'booking':
          // Booking settings go under settings.bookingSettings
          payload = {
            settings: {
              bookingSettings: {
                leadTime: data.leadTime,
                maxAdvanceBooking: data.maxAdvanceBooking,
                depositPercentage: data.depositPercentage,
                cancellationPolicy: data.cancellationPolicy,
                requireApproval: !data.autoConfirm,
                bufferTime: data.bufferTime
              }
            }
          }
          break
        case 'notifications': {
          // Convert nested NotificationSettings to flat Payload format
          const notifData = data as {
            email?: { newBooking?: boolean, cancellation?: boolean, payment?: boolean, reminder?: boolean, dailySummary?: boolean }
            inApp?: { newBooking?: boolean, cancellation?: boolean, payment?: boolean, reminder?: boolean }
            reminderTiming?: number
          }
          payload = {
            settings: {
              notificationSettings: {
                emailNewBooking: notifData.email?.newBooking ?? true,
                emailCancellation: notifData.email?.cancellation ?? true,
                emailPayment: notifData.email?.payment ?? true,
                emailReminder: notifData.email?.reminder ?? true,
                emailDailySummary: notifData.email?.dailySummary ?? false,
                inAppNewBooking: notifData.inApp?.newBooking ?? true,
                inAppCancellation: notifData.inApp?.cancellation ?? true,
                inAppPayment: notifData.inApp?.payment ?? true,
                inAppReminder: notifData.inApp?.reminder ?? false,
                reminderTiming: notifData.reminderTiming ?? 24
              }
            }
          }
          break
        }
        case 'website':
          // Website settings go in website field
          payload = {
            website: data
          }
          break
        default:
          payload = data
      }

      // Make real API call to Payload
      await $fetch(`/api/tenants/${tenantId}`, {
        method: 'PATCH',
        body: payload,
        credentials: 'include'
      })

      // Update local state on success
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
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to save settings. Please try again.'

      console.error('Failed to save settings:', error)
      toast.add({
        title: 'Error saving settings',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const uploadLogo = async (file: File) => {
    try {
      // Get tenant ID from auth
      const tenantId = getTenantId()

      if (!tenantId) {
        throw new Error('No tenant ID available')
      }

      // Create FormData for file upload
      // Payload expects metadata in a _payload JSON field
      const formData = new FormData()
      formData.append('file', file)
      formData.append('_payload', JSON.stringify({
        alt: `${state.business.value?.name || 'Business'} Logo`,
        tenantId: tenantId
      }))

      // Upload to Payload media collection
      const uploadResponse = await $fetch<{ doc: Record<string, unknown> }>('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      // Update tenant with new logo reference
      await $fetch(`/api/tenants/${tenantId}`, {
        method: 'PATCH',
        body: { logo: uploadResponse.doc.id },
        credentials: 'include'
      })

      // Update local state
      if (state.business.value && typeof uploadResponse.doc.url === 'string') {
        state.business.value.logo = uploadResponse.doc.url
      }

      toast.add({
        title: 'Logo uploaded',
        description: 'Your business logo has been updated successfully.',
        color: 'success'
      })

      return uploadResponse.doc
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to upload logo. Please try again.'

      console.error('Failed to upload logo:', error)
      toast.add({
        title: 'Error uploading logo',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  const removeLogo = async () => {
    try {
      // Get tenant ID from auth
      const tenantId = getTenantId()

      if (!tenantId) {
        throw new Error('No tenant ID available')
      }

      // Remove logo reference from tenant
      await $fetch(`/api/tenants/${tenantId}`, {
        method: 'PATCH',
        body: { logo: null },
        credentials: 'include'
      })

      // Update local state
      if (state.business.value) {
        state.business.value.logo = null
      }

      toast.add({
        title: 'Logo removed',
        description: 'Your business logo has been removed.',
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to remove logo. Please try again.'

      console.error('Failed to remove logo:', error)
      toast.add({
        title: 'Error removing logo',
        description: errorMessage,
        color: 'error'
      })
      throw error
    }
  }

  const connectStripe = async () => {
    try {
      // Simulate Stripe Connect flow
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Call Payload's Stripe Connect onboarding endpoint
      const response = await $fetch<{ url: string }>('/api/stripe/connect/onboard', {
        method: 'POST',
        credentials: 'include'
      })

      // Redirect to Stripe Connect onboarding URL
      if (response?.url) {
        window.location.href = response.url
        return response
      }

      // For now, just update state
      toast.add({
        title: 'Redirecting to Stripe',
        description: 'You will be redirected to complete the connection.',
        color: 'primary'
      })

      return response
    } catch (error) {
      toast.add({
        title: 'Error connecting Stripe',
        description: 'Failed to initiate Stripe connection. Please try again.',
        color: 'error'
      })
      throw error
    }
  }

  const inviteTeamMember = async (email: string, role: TeamMember['role']) => {
    state.saving.value = true
    try {
      // Get tenant ID using helper
      const tenantId = getTenantId()

      if (!tenantId) {
        throw new Error('No tenant ID available')
      }

      // Check plan limits before attempting to invite
      if (state.planInfo.value) {
        const maxUsers = state.planInfo.value.limits.maxUsers
        if (maxUsers !== -1) { // -1 means unlimited
          // Count active team members (staff, manager, admin - not customers)
          const activeTeamMembers = state.team.value.filter(
            m => m.status === 'active' && ['admin', 'manager', 'staff'].includes(m.role)
          ).length

          if (activeTeamMembers >= maxUsers) {
            const planName = state.planInfo.value.name
            toast.add({
              title: 'Team member limit reached',
              description: `Your ${planName} plan allows ${maxUsers} team ${maxUsers === 1 ? 'member' : 'members'}. Please upgrade your plan to add more team members.`,
              color: 'warning'
            })
            throw new Error('Team member limit reached')
          }
        }
      }

      // Create user with pending status via API
      const response = await $fetch<{ doc: Record<string, unknown> }>('/api/users', {
        method: 'POST',
        body: {
          email,
          role,
          tenantId,
          isActive: true,
          emailVerified: false,
          // Generate a temporary password - user will reset on first login
          password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
        },
        credentials: 'include'
      })

      const newMember: TeamMember = {
        id: String(response.doc.id),
        name: email.split('@')[0] || 'New Member',
        email: email,
        role: role,
        status: 'pending',
        avatar: null,
        joinedAt: new Date().toISOString().split('T')[0] || ''
      }

      state.team.value.push(newMember)

      // Send invitation email
      try {
        await $fetch('/api/email/team-invite', {
          method: 'POST',
          body: {
            email,
            role,
            userId: response.doc.id
          },
          credentials: 'include'
        })
      } catch (emailError) {
        console.warn('Failed to send invitation email, user created successfully:', emailError)
      }

      toast.add({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}.`,
        color: 'success'
      })

      return newMember
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to send team member invitation. Please try again.'

      console.error('Failed to invite team member:', error)
      toast.add({
        title: 'Error sending invitation',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const removeTeamMember = async (memberId: string) => {
    state.saving.value = true
    try {
      // Delete user from Payload
      await $fetch(`/api/users/${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      state.team.value = state.team.value.filter(m => m.id !== memberId)

      toast.add({
        title: 'Team member removed',
        description: 'The team member has been removed successfully.',
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to remove team member. Please try again.'

      console.error('Failed to remove team member:', error)
      toast.add({
        title: 'Error removing team member',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const deactivateTeamMember = async (memberId: string) => {
    state.saving.value = true
    try {
      // Deactivate user in Payload (set isActive to false)
      await $fetch(`/api/users/${memberId}`, {
        method: 'PATCH',
        body: { isActive: false },
        credentials: 'include'
      })

      // Update local state
      const memberIndex = state.team.value.findIndex(m => m.id === memberId)
      if (memberIndex !== -1 && state.team.value[memberIndex]) {
        state.team.value[memberIndex].status = 'inactive'
      }

      toast.add({
        title: 'Member deactivated',
        description: 'The team member has been deactivated and can no longer access the dashboard.',
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to deactivate team member. Please try again.'

      console.error('Failed to deactivate team member:', error)
      toast.add({
        title: 'Error deactivating member',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const reactivateTeamMember = async (memberId: string) => {
    state.saving.value = true
    try {
      // Reactivate user in Payload (set isActive to true)
      await $fetch(`/api/users/${memberId}`, {
        method: 'PATCH',
        body: { isActive: true },
        credentials: 'include'
      })

      // Update local state
      const memberIndex = state.team.value.findIndex(m => m.id === memberId)
      if (memberIndex !== -1 && state.team.value[memberIndex]) {
        state.team.value[memberIndex]!.status = 'active'
      }

      toast.add({
        title: 'Member reactivated',
        description: 'The team member has been reactivated and can now access the dashboard.',
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to reactivate team member. Please try again.'

      console.error('Failed to reactivate team member:', error)
      toast.add({
        title: 'Error reactivating member',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const resendInvitation = async (memberId: string) => {
    state.saving.value = true
    try {
      // Get member details
      const member = state.team.value.find(m => m.id === memberId)
      if (!member) {
        throw new Error('Member not found')
      }

      // Send invitation email via API
      await $fetch('/api/email/team-invite', {
        method: 'POST',
        body: {
          email: member.email,
          role: member.role,
          userId: memberId
        },
        credentials: 'include'
      })

      toast.add({
        title: 'Invitation resent',
        description: `Invitation has been resent to ${member.email}.`,
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to resend invitation. Please try again.'

      console.error('Failed to resend invitation:', error)
      toast.add({
        title: 'Error resending invitation',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const updateTeamMemberRole = async (memberId: string, newRole: TeamMember['role']) => {
    state.saving.value = true
    try {
      // Update user role in Payload
      await $fetch(`/api/users/${memberId}`, {
        method: 'PATCH',
        body: { role: newRole },
        credentials: 'include'
      })

      // Update local state
      const memberIndex = state.team.value.findIndex(m => m.id === memberId)
      if (memberIndex !== -1 && state.team.value[memberIndex]) {
        state.team.value[memberIndex]!.role = newRole
      }

      const roleLabels: Record<string, string> = {
        admin: 'Admin',
        manager: 'Manager',
        staff: 'Staff'
      }

      toast.add({
        title: 'Role updated',
        description: `Team member's role has been updated to ${roleLabels[newRole] || newRole}.`,
        color: 'success'
      })

      return true
    } catch (error: unknown) {
      interface FetchError {
        data?: {
          message?: string
        }
      }
      const fetchError = error as FetchError
      const errorMessage = fetchError.data?.message || 'Failed to update team member role. Please try again.'

      console.error('Failed to update role:', error)
      toast.add({
        title: 'Error updating role',
        description: errorMessage,
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const createApiKey = async (
    name: string,
    scopeType: ApiKey['scopeType'] = 'full_access',
    expiresAt?: string | null
  ) => {
    state.saving.value = true
    try {
      // Create API key in Payload
      const response = await $fetch<{ doc: Record<string, unknown> }>('/api/api-keys', {
        method: 'POST',
        body: {
          name,
          scopeType,
          expiresAt: expiresAt || undefined
        },
        credentials: 'include'
      })

      const newKey: ApiKey = {
        id: String(response.doc.id),
        name: String(response.doc.name || ''),
        key: String(response.doc.key || ''),
        scopeType: (response.doc.scopeType as ApiKey['scopeType']) || 'full_access',
        scopes: Array.isArray(response.doc.scopes) ? response.doc.scopes.map(String) : [],
        expiresAt: response.doc.expiresAt ? String(response.doc.expiresAt) : null,
        isActive: response.doc.isActive !== false,
        createdAt: typeof response.doc.createdAt === 'string'
          ? (response.doc.createdAt.split('T')[0] || '')
          : (new Date().toISOString().split('T')[0] || ''),
        lastUsed: null,
        lastRotatedAt: null
      }

      state.apiKeys.value.push(newKey)

      toast.add({
        title: 'API key created',
        description: 'Your new API key has been generated. Make sure to copy it now.',
        color: 'success'
      })

      return newKey
    } catch (error) {
      toast.add({
        title: 'Error creating API key',
        description: 'Failed to create API key. Please try again.',
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const toggleApiKeyStatus = async (keyId: string, isActive: boolean) => {
    try {
      // Update API key status in Payload
      await $fetch(`/api/api-keys/${keyId}`, {
        method: 'PATCH',
        body: { isActive },
        credentials: 'include'
      })

      // Update local state
      const keyIndex = state.apiKeys.value.findIndex(k => k.id === keyId)
      if (keyIndex !== -1 && state.apiKeys.value[keyIndex]) {
        state.apiKeys.value[keyIndex]!.isActive = isActive
      }

      toast.add({
        title: isActive ? 'API key enabled' : 'API key disabled',
        description: `The API key has been ${isActive ? 'enabled' : 'disabled'} successfully.`,
        color: 'success'
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error updating API key',
        description: 'Failed to update API key status. Please try again.',
        color: 'error'
      })
      throw error
    }
  }

  const rotateApiKey = async (keyId: string) => {
    state.saving.value = true
    try {
      // Rotate API key (generates new key value, invalidates old one)
      const response = await $fetch<{ id: string, key: string, name: string, scopeType: string, scopes: string[], expiresAt: string | null, isActive: boolean, createdAt: string }>(`/api/api-keys/${keyId}/rotate`, {
        method: 'POST',
        credentials: 'include'
      })

      // Update local state with new key data
      const keyIndex = state.apiKeys.value.findIndex(k => k.id === keyId)
      if (keyIndex !== -1) {
        state.apiKeys.value[keyIndex] = {
          id: String(response.id),
          name: String(response.name),
          key: String(response.key),
          scopeType: response.scopeType as ApiKey['scopeType'],
          scopes: Array.isArray(response.scopes) ? response.scopes.map(String) : [],
          expiresAt: response.expiresAt ? String(response.expiresAt) : null,
          isActive: response.isActive,
          createdAt: typeof response.createdAt === 'string'
            ? (response.createdAt.split('T')[0] || '')
            : (new Date().toISOString().split('T')[0] || ''),
          lastUsed: null // Reset since it's a new key
        }
      }

      toast.add({
        title: 'API key rotated',
        description: 'A new key has been generated. The old key is now invalid.',
        color: 'success'
      })

      // Return the new key so the UI can display it
      return {
        id: String(response.id),
        name: String(response.name),
        key: String(response.key),
        scopeType: response.scopeType as ApiKey['scopeType'],
        scopes: Array.isArray(response.scopes) ? response.scopes.map(String) : [],
        expiresAt: response.expiresAt ? String(response.expiresAt) : null,
        isActive: response.isActive,
        createdAt: typeof response.createdAt === 'string'
          ? (response.createdAt.split('T')[0] || '')
          : (new Date().toISOString().split('T')[0] || ''),
        lastUsed: null
      }
    } catch (error) {
      toast.add({
        title: 'Error rotating API key',
        description: 'Failed to rotate API key. Please try again.',
        color: 'error'
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
        credentials: 'include'
      })

      state.apiKeys.value = state.apiKeys.value.filter(k => k.id !== keyId)

      toast.add({
        title: 'API key deleted',
        description: 'The API key has been deleted successfully.',
        color: 'success'
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting API key',
        description: 'Failed to delete API key. Please try again.',
        color: 'error'
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
      const response = await $fetch<{ doc: Record<string, unknown> }>('/api/webhook-endpoints', {
        method: 'POST',
        body: {
          url,
          events: events.map(event => ({ event })),
          active: true
        },
        credentials: 'include'
      })

      const newWebhook: WebhookEndpoint = {
        id: String(response.doc.id),
        url: String(response.doc.url || ''),
        events: Array.isArray(response.doc.events)
          ? response.doc.events.map((e: unknown) => String((e as Record<string, unknown>).event || ''))
          : events,
        secret: String(response.doc.secret || ''),
        status: 'active',
        createdAt: typeof response.doc.createdAt === 'string'
          ? (response.doc.createdAt.split('T')[0] || '')
          : (new Date().toISOString().split('T')[0] || '')
      }

      state.webhooks.value.push(newWebhook)

      toast.add({
        title: 'Webhook endpoint added',
        description: 'Your webhook endpoint has been configured successfully.',
        color: 'success'
      })

      return newWebhook
    } catch (error) {
      toast.add({
        title: 'Error adding webhook',
        description: 'Failed to add webhook endpoint. Please try again.',
        color: 'error'
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
        credentials: 'include'
      })

      state.webhooks.value = state.webhooks.value.filter(w => w.id !== webhookId)

      toast.add({
        title: 'Webhook endpoint deleted',
        description: 'The webhook endpoint has been deleted successfully.',
        color: 'success'
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting webhook',
        description: 'Failed to delete webhook endpoint. Please try again.',
        color: 'error'
      })
      throw error
    } finally {
      state.saving.value = false
    }
  }

  const testWebhook = async (webhookId: string) => {
    try {
      // Send test webhook via the real API endpoint
      const response = await $fetch<{ success: boolean, delivery: { status: string, error?: string } }>('/api/webhooks/test', {
        method: 'POST',
        body: {
          endpointId: webhookId,
          event: 'ping' // Use a simple ping event for testing
        },
        credentials: 'include'
      })

      if (response.success) {
        toast.add({
          title: 'Test webhook sent',
          description: 'A test event has been successfully delivered to your webhook endpoint.',
          color: 'success'
        })
      } else {
        toast.add({
          title: 'Test webhook failed',
          description: response.delivery?.error || 'The webhook endpoint returned an error.',
          color: 'warning'
        })
      }

      return response.success
    } catch (error) {
      toast.add({
        title: 'Error testing webhook',
        description: 'Failed to send test webhook. Please try again.',
        color: 'error'
      })
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    state.saving.value = true
    try {
      // Get current user from auth
      const { currentUser } = useAuth()

      if (!currentUser.value?.id) {
        throw new Error('User not authenticated')
      }

      // Call Payload's update user endpoint with password
      await $fetch(`/api/users/${currentUser.value.id}`, {
        method: 'PATCH',
        body: {
          password: newPassword,
          // Payload requires current password for password changes
          currentPassword
        },
        credentials: 'include'
      })

      toast.add({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
        color: 'success'
      })

      return { success: true }
    } catch (error: unknown) {
      console.error('Failed to change password:', error)

      // Handle specific error cases
      let errorMessage = 'Failed to change password. Please try again.'

      const fetchError = error as FetchError
      if (fetchError.data?.errors && fetchError.data.errors.length > 0) {
        const errorDetails = fetchError.data.errors[0]
        if (errorDetails && errorDetails.message?.includes('password')) {
          errorMessage = errorDetails.message
        } else if (errorDetails && errorDetails.message?.includes('current')) {
          errorMessage = 'Current password is incorrect.'
        }
      } else if (fetchError.message) {
        errorMessage = fetchError.message
      }

      toast.add({
        title: 'Error changing password',
        description: errorMessage,
        color: 'error'
      })

      return { success: false, error: errorMessage }
    } finally {
      state.saving.value = false
    }
  }

  const markHasChanges = () => {
    state.hasUnsavedChanges.value = true
  }

  // Define FetchError interface at composable level to avoid redefinition
  interface FetchError {
    data?: {
      message?: string
      errors?: Array<{ message?: string }>
    }
    message?: string
  }

  // Computed properties for plan limits
  const activeTeamMembersCount = computed(() => {
    return state.team.value.filter(
      m => m.status === 'active' && ['admin', 'manager', 'staff'].includes(m.role)
    ).length
  })

  const teamMemberLimit = computed(() => {
    return state.planInfo.value?.limits.maxUsers ?? null
  })

  const isAtTeamMemberLimit = computed(() => {
    if (!state.planInfo.value) return false
    const limit = state.planInfo.value.limits.maxUsers
    if (limit === -1) return false // Unlimited
    return activeTeamMembersCount.value >= limit
  })

  const canInviteTeamMember = computed(() => {
    return !isAtTeamMemberLimit.value
  })

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
    planInfo: state.planInfo,

    // Computed
    activeTeamMembersCount,
    teamMemberLimit,
    isAtTeamMemberLimit,
    canInviteTeamMember,

    // Methods
    fetchSettings,
    updateSettings,
    uploadLogo,
    removeLogo,
    connectStripe,
    inviteTeamMember,
    removeTeamMember,
    deactivateTeamMember,
    reactivateTeamMember,
    resendInvitation,
    updateTeamMemberRole,
    createApiKey,
    toggleApiKeyStatus,
    rotateApiKey,
    deleteApiKey,
    addWebhookEndpoint,
    deleteWebhookEndpoint,
    testWebhook,
    changePassword,
    markHasChanges
  }
}
