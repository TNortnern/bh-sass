<script setup lang="ts">
// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: typeof google
  }
}

export interface ParsedAddress {
  street: string
  city: string
  state: string
  zip: string
  country?: string
  lat?: number
  lng?: number
  formatted?: string
}

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'address-selected': [address: ParsedAddress]
}>()

const config = useRuntimeConfig()
const inputRef = ref<HTMLInputElement | null>(null)
const autocomplete = ref<google.maps.places.Autocomplete | null>(null)
const isLoaded = ref(false)
const isLoading = ref(false)
const inputValue = ref(props.modelValue || '')

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal !== inputValue.value) {
    inputValue.value = newVal || ''
  }
})

// Load Google Maps script
const loadGoogleMaps = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if already loaded
    if (window.google?.maps?.places) {
      resolve()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      return
    }

    const apiKey = config.public.googleMapsApiKey
    if (!apiKey) {
      console.warn('Google Maps API key not configured')
      reject(new Error('Google Maps API key not configured'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

// Initialize autocomplete
const initAutocomplete = async () => {
  if (!inputRef.value || autocomplete.value) return

  isLoading.value = true

  try {
    await loadGoogleMaps()
    isLoaded.value = true

    autocomplete.value = new google.maps.places.Autocomplete(inputRef.value, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'geometry', 'formatted_address']
    })

    autocomplete.value.addListener('place_changed', handlePlaceSelected)
  } catch (error) {
    console.error('Failed to initialize Google Maps:', error)
  } finally {
    isLoading.value = false
  }
}

// Parse address components from Google Place result
const parseAddressComponents = (place: google.maps.places.PlaceResult): ParsedAddress => {
  const components = place.address_components || []

  const getComponent = (types: string[]): string => {
    const component = components.find((c: google.maps.GeocoderAddressComponent) =>
      types.some(type => c.types.includes(type))
    )
    return component?.long_name || ''
  }

  const getShortComponent = (types: string[]): string => {
    const component = components.find((c: google.maps.GeocoderAddressComponent) =>
      types.some(type => c.types.includes(type))
    )
    return component?.short_name || ''
  }

  // Build street address from street number + route
  const streetNumber = getComponent(['street_number'])
  const route = getComponent(['route'])
  const street = streetNumber && route
    ? `${streetNumber} ${route}`
    : route || streetNumber || ''

  return {
    street,
    city: getComponent(['locality', 'sublocality', 'administrative_area_level_3']),
    state: getShortComponent(['administrative_area_level_1']),
    zip: getComponent(['postal_code']),
    country: getShortComponent(['country']),
    lat: place.geometry?.location?.lat(),
    lng: place.geometry?.location?.lng(),
    formatted: place.formatted_address
  }
}

// Handle place selection
const handlePlaceSelected = () => {
  if (!autocomplete.value) return

  const place = autocomplete.value.getPlace()
  if (!place.address_components) return

  const parsed = parseAddressComponents(place)

  // Update input value with formatted address
  inputValue.value = parsed.formatted || ''
  emit('update:modelValue', inputValue.value)
  emit('address-selected', parsed)
}

// Handle manual input
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('update:modelValue', target.value)
}

// Initialize on mount
onMounted(() => {
  initAutocomplete()
})

// Cleanup on unmount
onUnmounted(() => {
  if (autocomplete.value) {
    google.maps.event.clearInstanceListeners(autocomplete.value)
    autocomplete.value = null
  }
})
</script>

<template>
  <div class="relative w-full">
    <UInput
      ref="inputRef"
      :model-value="inputValue"
      :placeholder="placeholder || 'Start typing an address...'"
      :disabled="disabled"
      :required="required"
      icon="i-lucide-map-pin"
      class="w-full"
      autocomplete="off"
      @input="handleInput"
    />
    <div
      v-if="isLoading"
      class="absolute right-3 top-1/2 -translate-y-1/2"
    >
      <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin text-gray-400" />
    </div>
  </div>
</template>

<style>
/* Style the Google Places autocomplete dropdown to match our theme */
.pac-container {
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--color-gray-200));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: inherit;
  z-index: 9999;
  background-color: white;
}

.dark .pac-container {
  background-color: rgb(var(--color-gray-900));
  border-color: rgb(var(--color-gray-700));
}

.pac-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-top: 1px solid rgb(var(--color-gray-100));
}

.dark .pac-item {
  border-top-color: rgb(var(--color-gray-800));
  color: rgb(var(--color-gray-200));
}

.pac-item:first-child {
  border-top: none;
}

.pac-item:hover {
  background-color: rgb(var(--color-gray-100));
}

.dark .pac-item:hover {
  background-color: rgb(var(--color-gray-800));
}

.pac-item-selected {
  background-color: rgb(var(--color-primary-50));
}

.dark .pac-item-selected {
  background-color: rgba(var(--color-primary-500), 0.2);
}

.pac-icon {
  display: none;
}

.pac-item-query {
  font-size: 0.875rem;
  color: rgb(var(--color-gray-900));
}

.dark .pac-item-query {
  color: rgb(var(--color-gray-100));
}

.pac-matched {
  font-weight: 600;
}
</style>
