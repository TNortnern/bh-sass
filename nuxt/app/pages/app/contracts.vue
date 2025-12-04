<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const toast = useToast()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

type Contract = {
  id: string
  contractNumber: string
  bookingId: {
    id: string
  }
  customerId: {
    id: string
    name: string
  }
  type: string
  status: 'draft' | 'sent' | 'signed' | 'void'
  sentAt?: string
  signedAt?: string
  createdAt: string
}

// Fetch contracts (depth: 1 to populate customerId relationship)
const { data: contracts, pending, refresh } = await useLazyFetch<{ docs: Contract[] }>('/api/contracts', {
  query: {
    limit: 100,
    sort: '-createdAt',
    depth: 1,
  },
})

// Modal states
const isGenerateModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedContract = ref<Contract | null>(null)

// Generate contract form
const generateForm = ref({
  bookingId: '',
  templateId: '',
})

// Fetch templates
const { data: templates } = await useLazyFetch<{ docs: any[] }>('/api/contract-templates', {
  query: {
    isActive: true,
  },
})

// Fetch bookings for dropdown (depth: 1 to populate customerId relationship)
const { data: bookings } = await useLazyFetch<{ docs: any[] }>('/api/bookings', {
  query: {
    limit: 100,
    sort: '-createdAt',
    depth: 1,
  },
})

// Table columns
const columns: TableColumn<Contract>[] = [
  {
    accessorKey: 'contractNumber',
    header: 'Contract #',
  },
  {
    accessorKey: 'customerId',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original.customerId
      // Customers collection uses 'name' field
      if (typeof customer === 'object' && customer?.name) {
        return customer.name
      }
      return 'N/A'
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const typeMap: Record<string, string> = {
        'rental-agreement': 'Rental Agreement',
        'liability-waiver': 'Liability Waiver',
        'damage-policy': 'Damage Policy',
        'safety-rules': 'Safety Rules',
        'weather-policy': 'Weather Policy',
        custom: 'Custom',
      }
      return typeMap[row.getValue('type')] || row.getValue('type')
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors = {
        draft: 'neutral',
        sent: 'primary',
        signed: 'success',
        void: 'error',
      }
      const status = row.getValue('status') as keyof typeof statusColors
      return h(
        UBadge,
        {
          color: statusColors[status],
          variant: 'subtle',
        },
        () => status.charAt(0).toUpperCase() + status.slice(1),
      )
    },
  },
  {
    accessorKey: 'signedAt',
    header: 'Signed Date',
    cell: ({ row }) => {
      const signedAt = row.getValue('signedAt')
      if (!signedAt) return 'Not signed'
      return new Date(signedAt as string).toLocaleDateString()
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'flex gap-2' },
        [
          h(UButton, {
            icon: 'i-lucide-eye',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            onClick: () => viewContract(row.original),
          }),
          h(UButton, {
            icon: 'i-lucide-download',
            color: 'neutral',
            variant: 'ghost',
            size: 'sm',
            onClick: () => downloadContract(row.original),
          }),
          row.original.status === 'draft' &&
            h(UButton, {
              icon: 'i-lucide-send',
              color: 'primary',
              variant: 'ghost',
              size: 'sm',
              onClick: () => sendContract(row.original),
            }),
        ].filter(Boolean),
      ),
  },
]

// Actions
async function generateContract() {
  if (!generateForm.value.bookingId || !generateForm.value.templateId) {
    toast.add({
      title: 'Missing Selection',
      description: 'Please select both booking and template',
      color: 'warning',
    })
    return
  }

  try {
    await $fetch('/api/contract-actions/generate', {
      method: 'POST',
      body: {
        bookingId: generateForm.value.bookingId,
        templateId: generateForm.value.templateId,
      },
    })

    toast.add({
      title: 'Contract Generated',
      description: 'Contract has been created successfully',
      color: 'success',
    })
    isGenerateModalOpen.value = false
    generateForm.value = { bookingId: '', templateId: '' }
    await refresh()
  } catch (error) {
    console.error('Error generating contract:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to generate contract',
      color: 'error',
    })
  }
}

function viewContract(contract: Contract) {
  selectedContract.value = contract
  isViewModalOpen.value = true
}

async function downloadContract(contract: Contract) {
  try {
    const response = await fetch(`/api/documents/contracts/${contract.id}/download`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${contract.contractNumber}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading contract:', error)
    toast.add({
      title: 'Download Failed',
      description: 'Failed to download contract',
      color: 'error',
    })
  }
}

async function sendContract(contract: Contract) {
  try {
    await $fetch(`/api/contract-actions/${contract.id}/send`, {
      method: 'POST',
    })
    toast.add({
      title: 'Contract Sent',
      description: 'Contract sent to customer',
      color: 'success',
    })
    await refresh()
  } catch (error) {
    console.error('Error sending contract:', error)
    toast.add({
      title: 'Send Failed',
      description: 'Failed to send contract',
      color: 'error',
    })
  }
}

// Template options for dropdown
const templateOptions = computed(() => {
  return (
    templates.value?.docs.map((t) => ({
      label: t.name,
      value: t.id,
    })) || []
  )
})

// Booking options for dropdown
const bookingOptions = computed(() => {
  return (
    bookings.value?.docs.map((b) => {
      // Customers collection uses 'name' field, not firstName/lastName
      const customer =
        typeof b.customerId === 'object' && b.customerId?.name
          ? b.customerId.name
          : 'Unknown Customer'
      return {
        label: `Booking for ${customer} - ${new Date(b.startDate).toLocaleDateString()}`,
        value: b.id,
      }
    }) || []
  )
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Contracts & Documents">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UButton
            icon="i-lucide-plus"
            label="Generate Contract"
            @click="isGenerateModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Contracts Table -->
        <div v-if="!pending && contracts?.docs.length" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <UTable :data="contracts.docs" :columns="columns" />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!pending && !contracts?.docs.length"
          class="flex flex-col items-center justify-center py-16 text-gray-500"
        >
          <UIcon name="i-lucide-file-text" class="text-6xl mb-4 text-gray-300" />
          <p class="text-lg font-medium">No Contracts Yet</p>
          <p class="text-sm mb-6 text-center max-w-sm">
            Generate contracts from templates for your bookings
          </p>
          <UButton
            icon="i-lucide-plus"
            label="Generate First Contract"
            @click="isGenerateModalOpen = true"
          />
        </div>

        <!-- Loading State -->
        <div v-else class="flex items-center justify-center py-12">
          <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Generate Contract Modal -->
  <UModal v-model:open="isGenerateModalOpen" title="Generate Contract">
    <template #body>
      <div class="space-y-4 p-6">
        <UFormField label="Select Booking" required>
          <USelect
            v-model="generateForm.bookingId"
            :items="bookingOptions"
            placeholder="Choose a booking"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Select Template" required>
          <USelect
            v-model="generateForm.templateId"
            :items="templateOptions"
            placeholder="Choose a contract template"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
        <UButton label="Generate" @click="generateContract" />
      </div>
    </template>
  </UModal>

  <!-- View Contract Modal -->
  <UModal v-model:open="isViewModalOpen" title="Contract Details">
    <template #body>
      <div v-if="selectedContract" class="p-6 space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Contract Number</label>
          <p class="text-lg font-semibold">{{ selectedContract.contractNumber }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <p>{{ selectedContract.type }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <div class="mt-1">
            <UBadge
              :label="selectedContract.status"
              :color="
                selectedContract.status === 'signed'
                  ? 'success'
                  : selectedContract.status === 'sent'
                    ? 'primary'
                    : 'neutral'
              "
            />
          </div>
        </div>

        <div v-if="selectedContract.signedAt">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Signed Date</label>
          <p>{{ new Date(selectedContract.signedAt).toLocaleString() }}</p>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Close" color="neutral" variant="ghost" @click="close" />
        <UButton
          v-if="selectedContract"
          label="Download PDF"
          icon="i-lucide-download"
          @click="downloadContract(selectedContract)"
        />
      </div>
    </template>
  </UModal>
</template>
