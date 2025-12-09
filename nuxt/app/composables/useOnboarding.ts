export interface OnboardingState {
  currentStep: number
  totalSteps: number
  completed: boolean
  business: {
    name: string
    type: string
    timezone: string
    serviceArea: string
  }
  firstItem: {
    name: string
    description: string
    price: number
    photo: string | null
  } | null
  availability: {
    [key: string]: { open: string, close: string, enabled: boolean }
  }
  paymentsConnected: boolean
}

const STORAGE_KEY = 'bouncepro_onboarding'

export function useOnboarding() {
  const state = useState<OnboardingState>('onboarding', () => ({
    currentStep: 1,
    totalSteps: 6,
    completed: false,
    business: {
      name: '',
      type: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      serviceArea: ''
    },
    firstItem: null,
    availability: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '10:00', close: '16:00', enabled: true },
      sunday: { open: '10:00', close: '16:00', enabled: false }
    },
    paymentsConnected: false
  }))

  // Auto-save to localStorage on state changes
  watch(state, (newState) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      } catch (error) {
        console.error('Failed to save onboarding progress:', error)
      }
    }
  }, { deep: true })

  function nextStep() {
    if (state.value.currentStep < state.value.totalSteps) {
      state.value.currentStep++
      saveProgress()
    }
  }

  function prevStep() {
    if (state.value.currentStep > 1) {
      state.value.currentStep--
      saveProgress()
    }
  }

  function skipStep() {
    nextStep()
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= state.value.totalSteps) {
      state.value.currentStep = step
      saveProgress()
    }
  }

  async function completeOnboarding() {
    state.value.completed = true
    saveProgress()

    // Clear localStorage after completion
    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear onboarding progress:', error)
      }
    }

    // Navigate to dashboard
    await navigateTo('/app')
  }

  function saveProgress() {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
      } catch (error) {
        console.error('Failed to save onboarding progress:', error)
      }
    }
  }

  function loadProgress() {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          // Merge saved state with current state
          Object.assign(state.value, parsed)
          return true
        }
      } catch (error) {
        console.error('Failed to load onboarding progress:', error)
      }
    }
    return false
  }

  function resetOnboarding() {
    state.value = {
      currentStep: 1,
      totalSteps: 6,
      completed: false,
      business: {
        name: '',
        type: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        serviceArea: ''
      },
      firstItem: null,
      availability: {
        monday: { open: '09:00', close: '17:00', enabled: true },
        tuesday: { open: '09:00', close: '17:00', enabled: true },
        wednesday: { open: '09:00', close: '17:00', enabled: true },
        thursday: { open: '09:00', close: '17:00', enabled: true },
        friday: { open: '09:00', close: '17:00', enabled: true },
        saturday: { open: '10:00', close: '16:00', enabled: true },
        sunday: { open: '10:00', close: '16:00', enabled: false }
      },
      paymentsConnected: false
    }

    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear onboarding progress:', error)
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
    saveProgress()
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
    saveProgress,
    loadProgress,
    resetOnboarding,
    updateState
  }
}
