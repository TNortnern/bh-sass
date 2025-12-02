<template>
  <div class="new-customer-page">
    <!-- Back Button -->
    <div class="mb-6">
      <UButton
        color="gray"
        variant="ghost"
        size="md"
        :ui="{ rounded: 'rounded-lg' }"
        @click="handleBack"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Back to Customers
      </UButton>
    </div>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-slate-50 mb-2 tracking-tight">
        Add New Customer
      </h1>
      <p class="text-slate-400 text-lg">
        Create a new customer profile to start tracking bookings and interactions
      </p>
    </div>

    <!-- Form Card -->
    <UCard
      :ui="{
        background: 'bg-slate-800/40',
        ring: 'ring-1 ring-slate-700/50',
        rounded: 'rounded-xl',
        body: { padding: 'p-8' }
      }"
    >
      <CustomerForm
        v-model="formData"
        :loading="loading"
        submit-label="Create Customer"
        :show-create-another="true"
        @submit="handleSubmit"
        @create-another="handleCreateAnother"
        @cancel="handleCancel"
      />
    </UCard>

    <!-- Success Toast -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import type { CustomerInput } from '~/composables/useCustomers'

definePageMeta({
  layout: 'dashboard'
})

const { createCustomer } = useCustomers()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const formData = ref<Partial<CustomerInput>>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: 'TX',
    zip: ''
  },
  tags: [],
  notes: ''
})

async function handleSubmit(data: CustomerInput) {
  loading.value = true

  try {
    const newCustomer = await createCustomer(data)

    // Show success toast
    toast.add({
      title: 'Customer created',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added successfully.`,
      icon: 'heroicons:check-circle',
      color: 'green',
      timeout: 3000
    })

    // Navigate to the customer detail page
    router.push(`/app/customers/${newCustomer.id}`)
  } catch (error) {
    // Show error toast
    toast.add({
      title: 'Error creating customer',
      description: error instanceof Error ? error.message : 'An error occurred while creating the customer.',
      icon: 'heroicons:x-circle',
      color: 'red',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

async function handleCreateAnother(data: CustomerInput) {
  loading.value = true

  try {
    const newCustomer = await createCustomer(data)

    // Show success toast
    toast.add({
      title: 'Customer created',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added successfully.`,
      icon: 'heroicons:check-circle',
      color: 'green',
      timeout: 3000
    })

    // Reset form
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: 'TX',
        zip: ''
      },
      tags: [],
      notes: ''
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    // Show error toast
    toast.add({
      title: 'Error creating customer',
      description: error instanceof Error ? error.message : 'An error occurred while creating the customer.',
      icon: 'heroicons:x-circle',
      color: 'red',
      timeout: 5000
    })
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/app/customers')
}

function handleBack() {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/app/customers')
    }
  } else {
    router.push('/app/customers')
  }
}

const hasUnsavedChanges = computed(() => {
  return !!(
    formData.value.firstName ||
    formData.value.lastName ||
    formData.value.email ||
    formData.value.phone ||
    formData.value.address?.street ||
    formData.value.tags?.length ||
    formData.value.notes
  )
})

// Warn before leaving with unsaved changes
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes. Do you really want to leave?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>

<style scoped>
.new-customer-page {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
