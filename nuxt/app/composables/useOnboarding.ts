export interface OnboardingState {
  currentStep: number
  totalSteps: number
  completed: boolean
  business: {
    name: string
    types: string[]
    timezone: string
    serviceArea: string
  }
  availability: {
    [key: string]: { open: string, close: string, enabled: boolean }
  }
}

export function useOnboarding() {
  const state = useState<OnboardingState>('onboarding', () => ({
    currentStep: 1,
    totalSteps: 4,
    completed: false,
    business: {
      name: '',
      types: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      serviceArea: ''
    },
    availability: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '10:00', close: '16:00', enabled: true },
      sunday: { open: '10:00', close: '16:00', enabled: false }
    }
  }))

  function nextStep() {
    if (state.value.currentStep < state.value.totalSteps) {
      state.value.currentStep++
    }
  }

  function prevStep() {
    if (state.value.currentStep > 1) {
      state.value.currentStep--
    }
  }

  function skipStep() {
    nextStep()
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= state.value.totalSteps) {
      state.value.currentStep = step
    }
  }

  async function completeOnboarding() {
    state.value.completed = true
    // Navigate to dashboard
    await navigateTo('/app')
  }

  async function saveBusinessInfo(data: Partial<OnboardingState['business']>) {
    const { currentUser } = useAuth()

    if (!currentUser.value?.tenantId) {
      throw new Error('No tenant ID found')
    }

    try {
      await $fetch(`/api/tenants/${currentUser.value.tenantId}`, {
        method: 'PATCH',
        body: {
          name: data.name,
          address: data.serviceArea ? { city: data.serviceArea } : undefined,
          settings: {
            timezone: data.timezone
          }
        }
      })
    } catch (error) {
      console.error('Failed to save business info:', error)
      throw error
    }
  }

  async function saveBusinessHours(availability: OnboardingState['availability']) {
    const { currentUser } = useAuth()

    if (!currentUser.value?.tenantId) {
      throw new Error('No tenant ID found')
    }

    try {
      // Transform availability object to match Tenant schema
      const businessHours = Object.entries(availability).reduce((acc, [day, hours]) => {
        acc[day] = {
          enabled: hours.enabled,
          open: hours.open,
          close: hours.close
        }
        return acc
      }, {} as Record<string, { enabled: boolean, open: string, close: string }>)

      await $fetch(`/api/tenants/${currentUser.value.tenantId}`, {
        method: 'PATCH',
        body: {
          businessHours
        }
      })
    } catch (error) {
      console.error('Failed to save business hours:', error)
      throw error
    }
  }

  function resetOnboarding() {
    state.value = {
      currentStep: 1,
      totalSteps: 4,
      completed: false,
      business: {
        name: '',
        types: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        serviceArea: ''
      },
      availability: {
        monday: { open: '09:00', close: '17:00', enabled: true },
        tuesday: { open: '09:00', close: '17:00', enabled: true },
        wednesday: { open: '09:00', close: '17:00', enabled: true },
        thursday: { open: '09:00', close: '17:00', enabled: true },
        friday: { open: '09:00', close: '17:00', enabled: true },
        saturday: { open: '10:00', close: '16:00', enabled: true },
        sunday: { open: '10:00', close: '16:00', enabled: false }
      }
    }
  }

  const progress = computed(() => {
    return Math.round((state.value.currentStep / state.value.totalSteps) * 100)
  })

  const isFirstStep = computed(() => state.value.currentStep === 1)
  const isLastStep = computed(() => state.value.currentStep === state.value.totalSteps)

  function updateState(updates: Partial<OnboardingState>) {
    Object.assign(state.value, updates)
  }

  return {
    state,
    progress,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    skipStep,
    goToStep,
    completeOnboarding,
    saveBusinessInfo,
    saveBusinessHours,
    resetOnboarding,
    updateState
  }
}
