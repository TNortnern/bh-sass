# rb-payload Integration Examples

This document provides code examples showing how to use the rb-payload integration in your components and pages.

## Basic Usage Examples

### 1. Fetching Services

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()
const services = ref<RbPayloadService[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  services.value = await rbPayload.getServices()
  isLoading.value = false
})
</script>

<template>
  <div>
    <h2>Available Services</h2>
    <div v-if="isLoading">Loading services...</div>
    <ul v-else>
      <li v-for="service in services" :key="service.id">
        {{ service.name }} - ${{ service.price }}
      </li>
    </ul>
  </div>
</template>
```

### 2. Fetching Staff Members

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()
const staff = ref<RbPayloadStaff[]>([])

onMounted(async () => {
  staff.value = await rbPayload.getStaff()
})
</script>

<template>
  <div>
    <h2>Staff Members</h2>
    <select>
      <option v-for="member in staff" :key="member.id" :value="member.id">
        {{ member.firstName }} {{ member.lastName }}
      </option>
    </select>
  </div>
</template>
```

### 3. Creating a Booking (Simple)

```vue
<script setup lang="ts">
import type { CreateRbPayloadBookingData } from '~/types/rb-payload'

const rbPayload = useRbPayload()

async function createBooking() {
  // First, get or create the customer
  const customer = await rbPayload.getOrCreateCustomer({
    tenantId: rbPayload.TENANT_ID,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    }
  })

  // Get first available staff member
  const staffMembers = await rbPayload.getStaff()
  if (staffMembers.length === 0) {
    console.error('No staff members available')
    return
  }

  // Create the booking
  const bookingData: CreateRbPayloadBookingData = {
    tenantId: rbPayload.TENANT_ID,
    items: [
      {
        label: 'Castle Bounce House XL',
        price: 250,
        duration: 240, // 4 hours in minutes
        staffId: staffMembers[0].id
      }
    ],
    totalPrice: 250,
    staffId: staffMembers[0].id,
    customerId: customer.id,
    startTime: new Date('2025-12-01T10:00:00').toISOString(),
    endTime: new Date('2025-12-01T14:00:00').toISOString(),
    status: 'pending',
    notes: 'Birthday party for 8-year-old',
    paymentStatus: 'unpaid'
  }

  const booking = await rbPayload.createBooking(bookingData)
  console.log('Booking created:', booking)
}
</script>

<template>
  <button @click="createBooking">
    Create Test Booking
  </button>
</template>
```

### 4. Checking Availability

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()
const isAvailable = ref(false)
const conflicts = ref<RbPayloadBooking[]>([])

async function checkAvailability() {
  const result = await rbPayload.getAvailability({
    startTime: new Date('2025-12-01T10:00:00').toISOString(),
    endTime: new Date('2025-12-01T14:00:00').toISOString(),
    staffId: 1 // Optional: check specific staff member
  })

  isAvailable.value = result.available
  conflicts.value = result.conflicts || []
}
</script>

<template>
  <div>
    <button @click="checkAvailability">Check Availability</button>
    <div v-if="isAvailable" class="text-green-600">
      Time slot is available!
    </div>
    <div v-else class="text-red-600">
      Time slot has conflicts ({{ conflicts.length }})
    </div>
  </div>
</template>
```

### 5. Fetching Bookings with Filters

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()
const bookings = ref<RbPayloadBooking[]>([])

async function fetchTodaysBookings() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  bookings.value = await rbPayload.getBookings({
    startDate: startOfDay.toISOString(),
    endDate: endOfDay.toISOString(),
    status: 'confirmed'
  })
}

async function fetchCustomerBookings(customerId: number) {
  bookings.value = await rbPayload.getBookings({
    customerId
  })
}
</script>

<template>
  <div>
    <button @click="fetchTodaysBookings">Load Today's Bookings</button>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        Booking #{{ booking.id }} - ${{ booking.totalPrice }}
      </li>
    </ul>
  </div>
</template>
```

### 6. Updating Booking Status

```vue
<script setup lang="ts">
import type { RbPayloadBookingStatus } from '~/types/rb-payload'

const rbPayload = useRbPayload()

async function confirmBooking(bookingId: number) {
  const updatedBooking = await rbPayload.updateBookingStatus(
    bookingId,
    'confirmed'
  )
  console.log('Booking confirmed:', updatedBooking)
}

async function cancelBooking(bookingId: number) {
  const updatedBooking = await rbPayload.updateBookingStatus(
    bookingId,
    'cancelled'
  )
  console.log('Booking cancelled:', updatedBooking)
}
</script>
```

### 7. Using with the useBookings Composable

The `useBookings` composable already integrates with rb-payload. Here's how to use it:

```vue
<script setup lang="ts">
import type { CreateBookingData } from '~/composables/useBookings'

const { createBooking, isLoading, error } = useBookings()

async function submitBooking() {
  const bookingData: CreateBookingData = {
    customerId: '1',
    itemId: '1',
    startDate: '2025-12-01',
    endDate: '2025-12-01',
    deliveryAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      instructions: 'Use side gate'
    },
    paymentType: 'deposit',
    customerNotes: 'Birthday party',
    internalNotes: 'VIP customer'
  }

  const result = await createBooking(bookingData)
  if (result.success) {
    console.log('Booking created in rb-payload:', result.data)
  } else {
    console.error('Error:', result.error)
  }
}
</script>

<template>
  <div>
    <button @click="submitBooking" :disabled="isLoading">
      {{ isLoading ? 'Creating...' : 'Create Booking' }}
    </button>
    <div v-if="error" class="text-red-600">{{ error }}</div>
  </div>
</template>
```

## Advanced Examples

### 8. Complete Booking Form with Customer Lookup

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()
const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  service: null as number | null,
  startTime: '',
  endTime: '',
  notes: ''
})

const services = ref<RbPayloadService[]>([])
const staff = ref<RbPayloadStaff[]>([])
const existingCustomer = ref<RbPayloadCustomer | null>(null)

onMounted(async () => {
  // Load services and staff
  services.value = await rbPayload.getServices()
  staff.value = await rbPayload.getStaff()
})

// Check for existing customer when email changes
watch(() => form.value.email, async (email) => {
  if (email.includes('@')) {
    existingCustomer.value = await rbPayload.findCustomerByEmail(email)
    if (existingCustomer.value) {
      form.value.firstName = existingCustomer.value.firstName
      form.value.lastName = existingCustomer.value.lastName
      form.value.phone = existingCustomer.value.phone || ''
    }
  }
})

async function submitBooking() {
  // Get or create customer
  const customer = await rbPayload.getOrCreateCustomer({
    tenantId: rbPayload.TENANT_ID,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone
  })

  // Find selected service
  const selectedService = services.value.find(s => s.id === form.value.service)
  if (!selectedService) {
    console.error('Please select a service')
    return
  }

  // Create booking
  const booking = await rbPayload.createBooking({
    tenantId: rbPayload.TENANT_ID,
    items: [
      {
        serviceId: selectedService.id,
        label: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
        staffId: staff.value[0]?.id
      }
    ],
    totalPrice: selectedService.price,
    staffId: staff.value[0]?.id || 0,
    customerId: customer.id,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    status: 'pending',
    notes: form.value.notes,
    paymentStatus: 'unpaid'
  })

  console.log('Booking created:', booking)
}
</script>

<template>
  <form @submit.prevent="submitBooking">
    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" required />
      <span v-if="existingCustomer" class="text-green-600">
        Existing customer found!
      </span>
    </div>

    <div>
      <label>First Name:</label>
      <input v-model="form.firstName" required />
    </div>

    <div>
      <label>Last Name:</label>
      <input v-model="form.lastName" required />
    </div>

    <div>
      <label>Phone:</label>
      <input v-model="form.phone" type="tel" />
    </div>

    <div>
      <label>Service:</label>
      <select v-model="form.service" required>
        <option :value="null">Select a service</option>
        <option v-for="service in services" :key="service.id" :value="service.id">
          {{ service.name }} - ${{ service.price }}
        </option>
      </select>
    </div>

    <div>
      <label>Start Time:</label>
      <input v-model="form.startTime" type="datetime-local" required />
    </div>

    <div>
      <label>End Time:</label>
      <input v-model="form.endTime" type="datetime-local" required />
    </div>

    <div>
      <label>Notes:</label>
      <textarea v-model="form.notes"></textarea>
    </div>

    <button type="submit">Create Booking</button>
  </form>
</template>
```

## TypeScript Type Imports

Always import types from the types file:

```typescript
import type {
  RbPayloadService,
  RbPayloadStaff,
  RbPayloadCustomer,
  RbPayloadBooking,
  RbPayloadBookingStatus,
  RbPayloadPaymentStatus,
  CreateRbPayloadBookingData,
  CreateRbPayloadCustomerData
} from '~/types/rb-payload'
```

## Error Handling

All rb-payload methods include built-in error handling with toast notifications. For additional custom handling:

```typescript
try {
  const booking = await rbPayload.createBooking(data)
  // Success handling
} catch (error) {
  // Custom error handling
  console.error('Booking creation failed:', error)
}
```
