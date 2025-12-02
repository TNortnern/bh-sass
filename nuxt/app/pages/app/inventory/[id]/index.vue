<script setup lang="ts">
import type { InventoryItem, InventoryUnit } from '~/composables/useInventory'
import { getCategoryLabel, getStatusLabel } from '~/utils/formatters'
import { format } from 'date-fns'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const { fetchItem, isLoading } = useInventory()
const { fetchBookings, filteredBookings, filters, isLoading: bookingsLoading } = useBookings()

const item = ref<InventoryItem | null>(null)
const selectedImageIndex = ref(0)
const activeTab = ref('overview')

// Fetch item on mount
onMounted(async () => {
  const result = await fetchItem(route.params.id as string)
  if (result) {
    item.value = result

    // Fetch bookings for this item using rbPayloadServiceId
    if ((result as any).rbPayloadServiceId) {
      filters.value.itemId = (result as any).rbPayloadServiceId.toString()
      await fetchBookings()
    }
  }
})

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'bounce-house':
      return 'blue'
    case 'water-slide':
      return 'cyan'
    case 'obstacle-course':
      return 'orange'
    case 'game':
      return 'purple'
    case 'combo':
      return 'green'
    default:
      return 'gray'
  }
}

const getCategoryLabel = (category: string) => {
  return category.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'inactive':
      return 'gray'
    case 'discontinued':
      return 'red'
    default:
      return 'gray'
  }
}

const utilizationColor = computed(() => {
  if (!item.value) return 'text-gray-600'
  if (item.value.utilization >= 80) return 'text-green-600 dark:text-green-400'
  if (item.value.utilization >= 50) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
})

const tabs = [
  { key: 'overview', label: 'Overview', icon: 'i-lucide-info' },
  { key: 'units', label: 'Units', icon: 'i-lucide-box' },
  { key: 'bookings', label: 'Booking History', icon: 'i-lucide-calendar' },
  { key: 'stats', label: 'Statistics', icon: 'i-lucide-bar-chart-3' }
]

// Computed bookings for this item
const itemBookings = computed(() => {
  return filteredBookings.value.map(booking => {
    const startDate = new Date(booking.dates.start)
    const endDate = new Date(booking.dates.end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return {
      id: booking.bookingNumber,
      customer: booking.customer.name,
      date: format(startDate, 'MMM dd, yyyy'),
      duration: days === 1 ? '1 day' : `${days} days`,
      revenue: `$${booking.payment.total.toFixed(2)}`,
      status: booking.status
    }
  })
})

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'confirmed':
      return 'green'
    case 'delivered':
      return 'blue'
    case 'completed':
      return 'blue'
    case 'cancelled':
      return 'red'
    default:
      return 'gray'
  }
}

// Add Unit Modal State
const isAddUnitModalOpen = ref(false)
const newUnit = ref({
  serialNumber: '',
  barcode: '',
  status: 'available' as 'available' | 'rented' | 'maintenance' | 'retired',
  condition: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor',
  purchaseDate: '',
  purchasePrice: 0
})

const statusOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Rented', value: 'rented' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Retired', value: 'retired' }
]

const conditionOptions = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' }
]

const openAddUnitModal = () => {
  // Reset form
  newUnit.value = {
    serialNumber: '',
    barcode: '',
    status: 'available',
    condition: 'excellent',
    purchaseDate: '',
    purchasePrice: 0
  }
  isAddUnitModalOpen.value = true
}

const isSaving = ref(false)
const { syncToRbPayload } = useInventorySync()

const addUnit = async () => {
  if (!item.value) return
  if (!newUnit.value.serialNumber || !newUnit.value.purchaseDate) {
    alert('Please fill in required fields: Serial Number and Purchase Date')
    return
  }

  isSaving.value = true

  try {
    // 1. Create unit in Payload CMS
    const response = await $fetch('/api/inventory-units', {
      method: 'POST',
      credentials: 'include',
      body: {
        rentalItemId: item.value.id,
        serialNumber: newUnit.value.serialNumber,
        barcode: newUnit.value.barcode || undefined,
        status: newUnit.value.status,
        condition: newUnit.value.condition,
        purchaseDate: newUnit.value.purchaseDate,
        purchasePrice: newUnit.value.purchasePrice
      }
    })

    if (response.success && response.unit) {
      // Add unit to local state
      if (!item.value.units) {
        item.value.units = []
      }

      const newLocalUnit: InventoryUnit = {
        id: response.unit.id,
        serialNumber: response.unit.serialNumber,
        barcode: response.unit.barcode || undefined,
        status: response.unit.status,
        condition: response.unit.condition,
        purchaseDate: response.unit.purchaseDate,
        purchasePrice: response.unit.purchasePrice
      }

      item.value.units.push(newLocalUnit)

      // Update totals
      item.value.totalUnits = item.value.units.length
      item.value.availableUnits = item.value.units.filter(u => u.status === 'available').length

      // 2. Update rental item quantity in Payload
      const newQuantity = item.value.units.length
      await $fetch(`/api/rental-items/${item.value.id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: {
          quantity: newQuantity
        }
      })

      // 3. Sync quantity to rb-payload services
      const rentalItemForSync = {
        id: Number(item.value.id),
        name: item.value.name,
        description: item.value.description,
        category: item.value.category,
        pricing: {
          hourlyRate: item.value.pricing.hourly,
          dailyRate: item.value.pricing.daily,
          weekendRate: item.value.pricing.weekend,
          weeklyRate: item.value.pricing.weekly
        },
        dimensions: item.value.specifications?.dimensions,
        capacity: item.value.specifications?.capacity?.maxOccupants,
        quantity: newQuantity,
        isActive: item.value.status === 'active',
        rbPayloadServiceId: (item.value as any).rbPayloadServiceId
      }

      await syncToRbPayload(rentalItemForSync)

      // Close modal
      isAddUnitModalOpen.value = false
    }
  } catch (error: any) {
    console.error('Failed to add unit:', error)
    alert(`Failed to add unit: ${error.message || 'Unknown error'}`)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <USkeleton class="h-12 w-96" />
      <USkeleton class="h-96" />
    </div>

    <!-- Content -->
    <div v-else-if="item" class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          to="/app/inventory"
        />
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ item.name }}</h1>
            <UBadge
              :color="getCategoryColor(item.category)"
              variant="subtle"
              size="lg"
            >
              {{ getCategoryLabel(item.category) }}
            </UBadge>
            <UBadge
              :color="getStatusColor(item.status)"
              variant="subtle"
              size="lg"
            >
              {{ getStatusLabel(item.status) }}
            </UBadge>
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
        </div>
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-edit"
          :to="`/app/inventory/${item.id}/edit`"
        >
          Edit Item
        </UButton>
      </div>

      <!-- Hero Section -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Image Gallery -->
        <div class="lg:col-span-2">
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <!-- Main Image -->
            <div class="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4">
              <img
                v-if="item.images?.length > 0"
                :src="item.images[selectedImageIndex]"
                :alt="item.name"
                class="w-full h-full object-cover"
              >
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <UIcon name="i-lucide-image-off" class="w-16 h-16 text-gray-400 dark:text-gray-600" />
              </div>
            </div>

            <!-- Thumbnail Gallery -->
            <div v-if="item.images.length > 1" class="flex gap-2">
              <button
                v-for="(image, index) in item.images"
                :key="index"
                class="w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                :class="selectedImageIndex === index
                  ? 'border-orange-500 dark:border-orange-400'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
                @click="selectedImageIndex = index"
              >
                <img :src="image" :alt="`${item.name} - ${index + 1}`" class="w-full h-full object-cover">
              </button>
            </div>
          </UCard>
        </div>

        <!-- Quick Stats -->
        <div class="space-y-4">
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Pricing</p>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Hourly</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${{ item.pricing?.hourly || 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Daily</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${{ item.pricing?.daily || 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Weekend</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${{ item.pricing?.weekend || 0 }}</span>
                  </div>
                  <div v-if="item.pricing?.weekly" class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Weekly</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${{ item.pricing?.weekly || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Availability</p>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Total Units</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">{{ item.totalUnits }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Available</span>
                    <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ item.availableUnits }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Utilization</span>
                    <span class="text-lg font-bold" :class="utilizationColor">{{ item.utilization }}%</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Revenue</p>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">This Month</span>
                    <span class="text-lg font-bold text-green-600 dark:text-green-400">
                      ${{ (item.revenue?.thisMonth || 0).toLocaleString() }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Total</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">
                      ${{ (item.revenue?.total || 0).toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <UButton
            color="primary"
            size="lg"
            block
            :to="`/app/bookings/new?itemId=${item.id}`"
          >
            <UIcon name="i-lucide-calendar-plus" class="w-5 h-5 mr-2" />
            Create Booking
          </UButton>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <div class="flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === tab.key
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
            @click="activeTab = tab.key"
          >
            <UIcon :name="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
            <div
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 dark:bg-orange-400"
            />
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid lg:grid-cols-2 gap-6">
          <!-- Specifications -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <UIcon name="i-lucide-ruler" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Specifications</h3>
              </div>
            </template>

            <div v-if="item.specifications" class="space-y-4">
              <div v-if="item.specifications.dimensions">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Dimensions</p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ item.specifications.dimensions.length || 0 }}' L x
                  {{ item.specifications.dimensions.width || 0 }}' W x
                  {{ item.specifications.dimensions.height || 0 }}' H
                </p>
              </div>
              <div v-if="item.specifications.weight">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Weight</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ item.specifications.weight }} lbs</p>
              </div>
              <div v-if="item.specifications.capacity">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Capacity</p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ item.specifications.capacity.maxOccupants || 0 }} people / {{ item.specifications.capacity.maxWeight || 0 }} lbs max
                </p>
              </div>
              <div v-if="item.specifications.ageRange">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Age Range</p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ item.specifications.ageRange.min || 0 }} - {{ item.specifications.ageRange.max || 0 }} years
                </p>
              </div>
              <div v-if="item.specifications.setupTime">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Setup Time</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ item.specifications.setupTime }} minutes</p>
              </div>
              <div v-if="item.specifications.requiredSpace">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Required Space</p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ item.specifications.requiredSpace.length || 0 }}' x {{ item.specifications.requiredSpace.width || 0 }}'
                </p>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 dark:text-gray-400">No specifications available</p>
          </UCard>

          <!-- Setup Requirements -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <UIcon name="i-lucide-wrench" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Setup Requirements</h3>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Power Outlet</span>
                <UBadge :color="item.setupRequirements.powerOutlet ? 'green' : 'gray'" variant="subtle">
                  {{ item.setupRequirements.powerOutlet ? 'Required' : 'Not Required' }}
                </UBadge>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Water Source</span>
                <UBadge :color="item.setupRequirements.waterSource ? 'blue' : 'gray'" variant="subtle">
                  {{ item.setupRequirements.waterSource ? 'Required' : 'Not Required' }}
                </UBadge>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Anchoring Method</span>
                <UBadge color="orange" variant="subtle">
                  {{ item.setupRequirements.anchoringMethod }}
                </UBadge>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Setup Crew</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.setupRequirements.setupCrew }} people
                </span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Units Tab -->
        <div v-if="activeTab === 'units'">
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <UIcon name="i-lucide-box" class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Individual Units</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.units?.length || 0 }} units total</p>
                  </div>
                </div>
                <UButton color="primary" size="sm" @click="openAddUnitModal">
                  <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
                  Add Unit
                </UButton>
              </div>
            </template>

            <InventoryUnitsList v-if="item.units?.length" :units="item.units" />
            <div v-else class="text-center py-8">
              <UIcon name="i-lucide-box" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p class="text-gray-500 dark:text-gray-400">No units configured yet</p>
              <UButton color="primary" variant="soft" size="sm" class="mt-4" @click="openAddUnitModal">
                <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
                Add First Unit
              </UButton>
            </div>
          </UCard>
        </div>

        <!-- Bookings Tab -->
        <div v-if="activeTab === 'bookings'">
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <UIcon name="i-lucide-calendar" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Booking History</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ itemBookings.length }} {{ itemBookings.length === 1 ? 'booking' : 'bookings' }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Loading State -->
            <div v-if="bookingsLoading" class="flex items-center justify-center py-12">
              <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
            </div>

            <!-- Bookings List -->
            <div v-else-if="itemBookings.length > 0" class="space-y-3">
              <div
                v-for="booking in itemBookings"
                :key="booking.id"
                class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm font-mono text-gray-500 dark:text-gray-400">{{ booking.id }}</span>
                      <UBadge
                        :color="getBookingStatusColor(booking.status)"
                        variant="subtle"
                        size="sm"
                      >
                        {{ getStatusLabel(booking.status) }}
                      </UBadge>
                    </div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.customer }}</p>
                    <div class="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center gap-1.5">
                        <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                        <span>{{ booking.date }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
                        <span>{{ booking.duration }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="text-lg font-bold text-gray-900 dark:text-white">{{ booking.revenue }}</p>
                    </div>
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      icon="i-lucide-external-link"
                      :to="`/app/bookings/${booking.id.replace('BK-', '')}`"
                    >
                      View
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
              <UIcon name="i-lucide-calendar-x" class="text-6xl mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-lg font-medium">No Bookings Yet</p>
              <p class="text-sm text-center max-w-sm mb-6">
                This item hasn't been booked yet. Bookings will appear here once customers start reserving this item.
              </p>
              <UButton icon="i-lucide-plus" label="Create Booking" :to="`/app/bookings/new?itemId=${item?.id}`" />
            </div>
          </UCard>
        </div>

        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats'">
          <div class="grid lg:grid-cols-2 gap-6">
            <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
              </template>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Utilization Rate</span>
                    <span class="text-sm font-semibold" :class="utilizationColor">{{ item.utilization }}%</span>
                  </div>
                  <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                      :style="{ width: `${item.utilization}%` }"
                    />
                  </div>
                </div>
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Revenue</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">
                    ${{ (item.revenue?.total || 0).toLocaleString() }}
                  </p>
                </div>
                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">This Month</p>
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${{ (item.revenue?.thisMonth || 0).toLocaleString() }}
                  </p>
                </div>
              </div>
            </UCard>

            <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <template #header>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Unit Status</h3>
              </template>
              <div v-if="item.units?.length" class="space-y-3">
                <div
                  v-for="status in ['available', 'rented', 'maintenance', 'retired']"
                  :key="status"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">{{ status }}</span>
                  <UBadge
                    :color="status === 'available' ? 'green' : status === 'rented' ? 'blue' : status === 'maintenance' ? 'orange' : 'red'"
                    variant="subtle"
                  >
                    {{ item.units.filter(u => u.status === status).length }}
                  </UBadge>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No units tracked yet</p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-16">
      <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-circle" class="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Item not found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The inventory item you're looking for doesn't exist.</p>
      <UButton color="primary" to="/app/inventory">
        Back to Inventory
      </UButton>
    </div>

    <!-- Add Unit Modal -->
    <UModal v-model:open="isAddUnitModalOpen" title="Add New Unit">
      <template #body>
        <div class="space-y-4 p-6">
          <UFormField label="Serial Number" required>
            <UInput v-model="newUnit.serialNumber" placeholder="e.g., CBH-XL-004" class="w-full" />
          </UFormField>

          <UFormField label="Barcode">
            <UInput v-model="newUnit.barcode" placeholder="e.g., 123456789004" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Status" required>
              <USelect v-model="newUnit.status" :items="statusOptions" class="w-full" />
            </UFormField>

            <UFormField label="Condition" required>
              <USelect v-model="newUnit.condition" :items="conditionOptions" class="w-full" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Purchase Date" required>
              <UInput v-model="newUnit.purchaseDate" type="date" class="w-full" />
            </UFormField>

            <UFormField label="Purchase Price" required>
              <UInput v-model.number="newUnit.purchasePrice" type="number" placeholder="0" class="w-full">
                <template #leading>
                  <span class="text-gray-500">$</span>
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2 px-6 pb-6">
          <UButton label="Cancel" color="neutral" variant="ghost" @click="close" :disabled="isSaving" />
          <UButton label="Add Unit" color="primary" @click="addUnit" :loading="isSaving" :disabled="isSaving" />
        </div>
      </template>
    </UModal>
  </div>
</template>
