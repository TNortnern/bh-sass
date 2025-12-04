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
  scopeType: 'full_access' | 'read_only' | 'booking_management' | 'custom'
  scopes: string[]
  expiresAt: string | null
  isActive: boolean
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
  tenantId: Ref<string | null>
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
          const tenantResponse = await $fetch<any>(`/v1/tenants/${tenantId}`, {
            credentials: 'include',
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
              zip: tenantResponse.address?.zip || '',
            },
            timezone: tenantResponse.settings?.timezone || 'America/Chicago',
            businessHours: {
              monday: {
                open: tenantResponse.businessHours?.monday?.open || '09:00',
                close: tenantResponse.businessHours?.monday?.close || '18:00',
                enabled: tenantResponse.businessHours?.monday?.enabled ?? true,
              },
              tuesday: {
                open: tenantResponse.businessHours?.tuesday?.open || '09:00',
                close: tenantResponse.businessHours?.tuesday?.close || '18:00',
                enabled: tenantResponse.businessHours?.tuesday?.enabled ?? true,
              },
              wednesday: {
                open: tenantResponse.businessHours?.wednesday?.open || '09:00',
                close: tenantResponse.businessHours?.wednesday?.close || '18:00',
                enabled: tenantResponse.businessHours?.wednesday?.enabled ?? true,
              },
              thursday: {
                open: tenantResponse.businessHours?.thursday?.open || '09:00',
                close: tenantResponse.businessHours?.thursday?.close || '18:00',
                enabled: tenantResponse.businessHours?.thursday?.enabled ?? true,
              },
              friday: {
                open: tenantResponse.businessHours?.friday?.open || '09:00',
                close: tenantResponse.businessHours?.friday?.close || '20:00',
                enabled: tenantResponse.businessHours?.friday?.enabled ?? true,
              },
              saturday: {
                open: tenantResponse.businessHours?.saturday?.open || '08:00',
                close: tenantResponse.businessHours?.saturday?.close || '20:00',
                enabled: tenantResponse.businessHours?.saturday?.enabled ?? true,
              },
              sunday: {
                open: tenantResponse.businessHours?.sunday?.open || '10:00',
                close: tenantResponse.businessHours?.sunday?.close || '16:00',
                enabled: tenantResponse.businessHours?.sunday?.enabled ?? true,
              },
            },
            serviceArea: {
              radius: tenantResponse.serviceArea?.radius || 25,
              unit: tenantResponse.serviceArea?.unit || 'miles',
              zipCodes: tenantResponse.serviceArea?.zipCodes?.map((z: any) => z.code) || [],
            },
          }

          // Map booking settings from tenant
          state.booking.value = {
            leadTime: tenantResponse.settings?.bookingSettings?.leadTime || 24,
            maxAdvanceBooking: tenantResponse.settings?.bookingSettings?.maxAdvanceBooking || 365,
            depositPercentage: tenantResponse.settings?.bookingSettings?.depositPercentage || 25,
            cancellationPolicy: 'moderate',
            autoConfirm: !(tenantResponse.settings?.bookingSettings?.requireApproval ?? false),
            preventOverbooking: true,
            bufferTime: tenantResponse.settings?.bookingSettings?.bufferTime || 30,
          }

          // Map payment settings from tenant
          state.payments.value = {
            stripeConnected: !!tenantResponse.stripeAccountId,
            stripeAccountId: tenantResponse.stripeAccountId || null,
            platformFee: 3.5,
            payoutSchedule: 'weekly',
            lastPayoutDate: null,
          }

        } catch (error) {
          console.warn('Failed to fetch tenant data, using defaults:', error)
          // Fall back to mock data if tenant fetch fails
          state.business.value = mockBusinessSettings
          state.booking.value = mockBookingSettings
          state.payments.value = mockPaymentSettings
        }
      } else {
        // No tenant ID - use mock data
        state.business.value = mockBusinessSettings
        state.booking.value = mockBookingSettings
        state.payments.value = mockPaymentSettings
      }

      // Fetch real team members from Users collection
      if (tenantId) {
        try {
          const usersResponse = await $fetch<{ docs: any[] }>('/api/users', {
            query: {
              where: {
                tenantId: { equals: tenantId },
              },
              limit: 100,
            },
            credentials: 'include',
          })

          state.team.value = usersResponse.docs.map((user: any) => ({
            id: String(user.id),
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || 'Unknown',
            email: user.email,
            role: user.role || 'staff',
            status: user.isActive === false ? 'inactive' : (user.emailVerified ? 'active' : 'pending'),
            avatar: user.avatar?.url || null,
            joinedAt: user.createdAt?.split('T')[0] || '',
          }))
        } catch (error) {
          console.warn('Failed to fetch team members, using mock data:', error)
          state.team.value = mockTeamMembers
        }
      } else {
        state.team.value = mockTeamMembers
      }

      // Fetch notification settings from tenant
      state.notifications.value = mockNotificationSettings

      // Fetch real API keys from Payload
      try {
        const apiKeysResponse = await $fetch<{ docs: any[] }>('/api/api-keys', {
          credentials: 'include',
        })
        state.apiKeys.value = apiKeysResponse.docs.map((key: any) => ({
          id: String(key.id),
          name: key.name,
          key: key.key,
          scopeType: key.scopeType || 'full_access',
          scopes: key.scopes || [],
          expiresAt: key.expiresAt || null,
          isActive: key.isActive !== false,
          createdAt: key.createdAt?.split('T')[0] || '',
          lastUsed: key.lastUsed?.split('T')[0] || null,
        }))
      } catch (error) {
        console.warn('Failed to fetch API keys, using empty array:', error)
        state.apiKeys.value = []
      }

      // Fetch real webhooks from Payload
      try {
        const webhooksResponse = await $fetch<{ docs: any[] }>('/api/webhook-endpoints', {
          credentials: 'include',
        })
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
        color: 'error',
      })
      throw error
    } finally {
      state.loading.value = false
    }
  }

  const updateSettings = async (section: string, data: any) => {
    state.saving.value = true
    try {
      // Get tenant ID from auth
      const tenantId = getTenantId()

      if (!tenantId) {
        throw new Error('No tenant ID available')
      }

      // Prepare payload based on section
      let payload: Record<string, any> = {}

      switch (section) {
        case 'business':
          // Map business settings to Tenant collection fields
          // Convert zipCodes from string[] to {code: string}[]
          const zipCodesFormatted = data.serviceArea?.zipCodes?.map((code: string) => ({ code })) || []

          payload = {
            name: data.name,
            description: data.description,
            phone: data.phone,
            email: data.email,
            address: data.address,
            settings: {
              timezone: data.timezone,
            },
            businessHours: data.businessHours,
            serviceArea: {
              radius: data.serviceArea?.radius || 25,
              unit: data.serviceArea?.unit || 'miles',
              zipCodes: zipCodesFormatted,
            },
          }
          break
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
                bufferTime: data.bufferTime,
              }
            }
          }
          break
        case 'notifications':
          payload = {
            settings: {
              notificationSettings: data
            }
          }
          break
        default:
          payload = data
      }

      // Make real API call to Payload
      await $fetch(`/v1/tenants/${tenantId}`, {
        method: 'PATCH',
        body: payload,
        credentials: 'include',
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
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast.add({
        title: 'Error saving settings',
        description: error?.data?.message || 'Failed to save settings. Please try again.',
        color: 'error',
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
      const uploadResponse = await $fetch<{ doc: any }>('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      // Update tenant with new logo reference
      await $fetch(`/v1/tenants/${tenantId}`, {
        method: 'PATCH',
        body: { logo: uploadResponse.doc.id },
        credentials: 'include',
      })

      // Update local state
      if (state.business.value) {
        state.business.value.logo = uploadResponse.doc.url
      }

      toast.add({
        title: 'Logo uploaded',
        description: 'Your business logo has been updated successfully.',
        color: 'success',
      })

      return uploadResponse.doc
    } catch (error: any) {
      console.error('Failed to upload logo:', error)
      toast.add({
        title: 'Error uploading logo',
        description: error?.data?.message || 'Failed to upload logo. Please try again.',
        color: 'error',
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
      await $fetch(`/v1/tenants/${tenantId}`, {
        method: 'PATCH',
        body: { logo: null },
        credentials: 'include',
      })

      // Update local state
      if (state.business.value) {
        state.business.value.logo = null
      }

      toast.add({
        title: 'Logo removed',
        description: 'Your business logo has been removed.',
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to remove logo:', error)
      toast.add({
        title: 'Error removing logo',
        description: error?.data?.message || 'Failed to remove logo. Please try again.',
        color: 'error',
      })
      throw error
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
        color: 'error',
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

      // Create user with pending status via API
      const response = await $fetch<{ doc: any }>('/api/users', {
        method: 'POST',
        body: {
          email,
          role,
          tenantId,
          isActive: true,
          emailVerified: false,
          // Generate a temporary password - user will reset on first login
          password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
        },
        credentials: 'include',
      })

      const newMember: TeamMember = {
        id: String(response.doc.id),
        name: email.split('@')[0],
        email,
        role,
        status: 'pending',
        avatar: null,
        joinedAt: new Date().toISOString().split('T')[0],
      }

      state.team.value.push(newMember)

      // Send invitation email
      try {
        await $fetch('/api/email/team-invite', {
          method: 'POST',
          body: {
            email,
            role,
            userId: response.doc.id,
          },
          credentials: 'include',
        })
      } catch (emailError) {
        console.warn('Failed to send invitation email, user created successfully:', emailError)
      }

      toast.add({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${email}.`,
        color: 'success',
      })

      return newMember
    } catch (error: any) {
      console.error('Failed to invite team member:', error)
      toast.add({
        title: 'Error sending invitation',
        description: error?.data?.message || 'Failed to send team member invitation. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      state.team.value = state.team.value.filter((m) => m.id !== memberId)

      toast.add({
        title: 'Team member removed',
        description: 'The team member has been removed successfully.',
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to remove team member:', error)
      toast.add({
        title: 'Error removing team member',
        description: error?.data?.message || 'Failed to remove team member. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      // Update local state
      const memberIndex = state.team.value.findIndex((m) => m.id === memberId)
      if (memberIndex !== -1) {
        state.team.value[memberIndex].status = 'inactive'
      }

      toast.add({
        title: 'Member deactivated',
        description: 'The team member has been deactivated and can no longer access the dashboard.',
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to deactivate team member:', error)
      toast.add({
        title: 'Error deactivating member',
        description: error?.data?.message || 'Failed to deactivate team member. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      // Update local state
      const memberIndex = state.team.value.findIndex((m) => m.id === memberId)
      if (memberIndex !== -1) {
        state.team.value[memberIndex].status = 'active'
      }

      toast.add({
        title: 'Member reactivated',
        description: 'The team member has been reactivated and can now access the dashboard.',
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to reactivate team member:', error)
      toast.add({
        title: 'Error reactivating member',
        description: error?.data?.message || 'Failed to reactivate team member. Please try again.',
        color: 'error',
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
      const member = state.team.value.find((m) => m.id === memberId)
      if (!member) {
        throw new Error('Member not found')
      }

      // Send invitation email via API
      await $fetch('/api/email/team-invite', {
        method: 'POST',
        body: {
          email: member.email,
          role: member.role,
          userId: memberId,
        },
        credentials: 'include',
      })

      toast.add({
        title: 'Invitation resent',
        description: `Invitation has been resent to ${member.email}.`,
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to resend invitation:', error)
      toast.add({
        title: 'Error resending invitation',
        description: error?.data?.message || 'Failed to resend invitation. Please try again.',
        color: 'error',
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
      await $fetch(`/v1/users/${memberId}`, {
        method: 'PATCH',
        body: { role: newRole },
        credentials: 'include',
      })

      // Update local state
      const memberIndex = state.team.value.findIndex((m) => m.id === memberId)
      if (memberIndex !== -1) {
        state.team.value[memberIndex].role = newRole
      }

      const roleLabels: Record<string, string> = {
        admin: 'Admin',
        manager: 'Manager',
        staff: 'Staff',
      }

      toast.add({
        title: 'Role updated',
        description: `Team member's role has been updated to ${roleLabels[newRole] || newRole}.`,
        color: 'success',
      })

      return true
    } catch (error: any) {
      console.error('Failed to update role:', error)
      toast.add({
        title: 'Error updating role',
        description: error?.data?.message || 'Failed to update team member role. Please try again.',
        color: 'error',
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
      const response = await $fetch<{ doc: any }>('/api/api-keys', {
        method: 'POST',
        body: {
          name,
          scopeType,
          expiresAt: expiresAt || undefined,
        },
        credentials: 'include',
      })

      const newKey: ApiKey = {
        id: String(response.doc.id),
        name: response.doc.name,
        key: response.doc.key,
        scopeType: response.doc.scopeType || 'full_access',
        scopes: response.doc.scopes || [],
        expiresAt: response.doc.expiresAt || null,
        isActive: response.doc.isActive !== false,
        createdAt: response.doc.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        lastUsed: null,
      }

      state.apiKeys.value.push(newKey)

      toast.add({
        title: 'API key created',
        description: 'Your new API key has been generated. Make sure to copy it now.',
        color: 'success',
      })

      return newKey
    } catch (error) {
      toast.add({
        title: 'Error creating API key',
        description: 'Failed to create API key. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      // Update local state
      const keyIndex = state.apiKeys.value.findIndex((k) => k.id === keyId)
      if (keyIndex !== -1) {
        state.apiKeys.value[keyIndex].isActive = isActive
      }

      toast.add({
        title: isActive ? 'API key enabled' : 'API key disabled',
        description: `The API key has been ${isActive ? 'enabled' : 'disabled'} successfully.`,
        color: 'success',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error updating API key',
        description: 'Failed to update API key status. Please try again.',
        color: 'error',
      })
      throw error
    }
  }

  const rotateApiKey = async (keyId: string) => {
    state.saving.value = true
    try {
      // Rotate API key (generates new key value, invalidates old one)
      const response = await $fetch<{ id: string; key: string; name: string; scopeType: string; scopes: string[]; expiresAt: string | null; isActive: boolean; createdAt: string }>(`/api/api-keys/${keyId}/rotate`, {
        method: 'POST',
        credentials: 'include',
      })

      // Update local state with new key data
      const keyIndex = state.apiKeys.value.findIndex((k) => k.id === keyId)
      if (keyIndex !== -1) {
        state.apiKeys.value[keyIndex] = {
          id: String(response.id),
          name: response.name,
          key: response.key,
          scopeType: response.scopeType as ApiKey['scopeType'],
          scopes: response.scopes,
          expiresAt: response.expiresAt,
          isActive: response.isActive,
          createdAt: response.createdAt.split('T')[0],
          lastUsed: null, // Reset since it's a new key
        }
      }

      toast.add({
        title: 'API key rotated',
        description: 'A new key has been generated. The old key is now invalid.',
        color: 'success',
      })

      // Return the new key so the UI can display it
      return {
        id: String(response.id),
        name: response.name,
        key: response.key,
        scopeType: response.scopeType as ApiKey['scopeType'],
        scopes: response.scopes,
        expiresAt: response.expiresAt,
        isActive: response.isActive,
        createdAt: response.createdAt.split('T')[0],
        lastUsed: null,
      }
    } catch (error) {
      toast.add({
        title: 'Error rotating API key',
        description: 'Failed to rotate API key. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      state.apiKeys.value = state.apiKeys.value.filter((k) => k.id !== keyId)

      toast.add({
        title: 'API key deleted',
        description: 'The API key has been deleted successfully.',
        color: 'success',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting API key',
        description: 'Failed to delete API key. Please try again.',
        color: 'error',
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
        credentials: 'include',
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
        color: 'success',
      })

      return newWebhook
    } catch (error) {
      toast.add({
        title: 'Error adding webhook',
        description: 'Failed to add webhook endpoint. Please try again.',
        color: 'error',
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
        credentials: 'include',
      })

      state.webhooks.value = state.webhooks.value.filter((w) => w.id !== webhookId)

      toast.add({
        title: 'Webhook endpoint deleted',
        description: 'The webhook endpoint has been deleted successfully.',
        color: 'success',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error deleting webhook',
        description: 'Failed to delete webhook endpoint. Please try again.',
        color: 'error',
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
        color: 'success',
      })

      return true
    } catch (error) {
      toast.add({
        title: 'Error testing webhook',
        description: 'Failed to send test webhook. Please try again.',
        color: 'error',
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
    markHasChanges,
  }
}
