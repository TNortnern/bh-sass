<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'date-fns'
import type { MaintenanceChecklistItem } from '~/composables/useMaintenance'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const toast = useToast()
const { createRecord } = useMaintenance()
const { items: rentalItems, fetchItems } = useInventory()
const { currentUser } = useAuth()

// Get tenant ID from current user
const getTenantId = (): string | number | null => {
  if (!currentUser.value?.tenantId) return null
  if (typeof currentUser.value.tenantId === 'object') {
    return (currentUser.value.tenantId).id
  }
  return currentUser.value.tenantId
}

// Fetch rental items on mount
onMounted(() => {
  fetchItems()
})

// Form state
const form = reactive({
  rentalItem: '',
  type: 'inspection' as 'inspection' | 'cleaning' | 'repair' | 'replacement' | 'certification',
  description: '',
  scheduledDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
  performedBy: '',
  cost: undefined as number | undefined,
  notes: '',
  nextMaintenanceDate: ''
})

// Type options
const typeItems = [
  { label: 'Inspection', value: 'inspection' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Repair', value: 'repair' },
  { label: 'Replacement', value: 'replacement' },
  { label: 'Certification', value: 'certification' }
]

// Rental items for select
const rentalItemsSelect = computed(() => {
  return (rentalItems.value || []).map(item => ({
    label: item.name,
    value: item.id
  }))
})

// Submit handler
const handleSubmit = async () => {
  if (!form.rentalItem || !form.description || !form.performedBy) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fill in all required fields.',
      color: 'error'
    })
    return
  }

  const tenantId = getTenantId()
  if (!tenantId) {
    toast.add({
      title: 'Error',
      description: 'Unable to determine tenant. Please try logging in again.',
      color: 'error'
    })
    return
  }

  const result = await createRecord({
    tenantId: String(tenantId),
    rentalItem: String(form.rentalItem),
    type: form.type,
    description: form.description,
    scheduledDate: form.scheduledDate,
    status: 'completed',
    completedDate: form.scheduledDate,
    performedBy: form.performedBy,
    cost: form.cost || undefined,
    notes: form.notes || undefined,
    nextMaintenanceDate: form.nextMaintenanceDate || undefined
  })

  if (result.success) {
    toast.add({
      title: 'Success',
      description: 'Maintenance record created successfully.',
      color: 'success'
    })
    router.push('/app/maintenance')
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to create maintenance record.',
      color: 'error'
    })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Log Maintenance">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            @click="router.push('/app/maintenance')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 max-w-4xl mx-auto">
        <UCard>
          <form
            class="space-y-6"
            @submit.prevent="handleSubmit"
          >
            <UFormField
              label="Rental Item"
              required
            >
              <USelect
                v-model="form.rentalItem"
                :items="rentalItemsSelect"
                placeholder="Select rental item"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Maintenance Type"
              required
            >
              <USelect
                v-model="form.type"
                :items="typeItems"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Description"
              required
            >
              <UTextarea
                v-model="form.description"
                placeholder="Describe the maintenance work performed..."
                rows="3"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="Date Completed"
                required
              >
                <UInput
                  v-model="form.scheduledDate"
                  type="datetime-local"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Performed By"
                required
              >
                <UInput
                  v-model="form.performedBy"
                  placeholder="Staff name or vendor"
                  class="w-full"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Cost (optional)">
                <UInput
                  v-model.number="form.cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Next Maintenance Date">
                <UInput
                  v-model="form.nextMaintenanceDate"
                  type="date"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="Additional Notes">
              <UTextarea
                v-model="form.notes"
                placeholder="Any additional notes..."
                rows="4"
                class="w-full"
              />
            </UFormField>

            <div class="flex justify-end gap-2 pt-4">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="router.push('/app/maintenance')"
              />
              <UButton
                label="Save Maintenance Record"
                type="submit"
                :loading="isLoading"
              />
            </div>
          </form>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
