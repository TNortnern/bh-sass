<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth' as 'admin']
})

const toast = useToast()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

// Tab state
const selectedTab = ref('contracts')

type Document = {
  id: string
  type: 'contract' | 'invoice'
  number: string
  bookingId?: string | number
  customerId?: string | number
  status: string
  createdAt: string
  signedAt?: string
  paidAt?: string
}

// Fetch contracts
const { data: contracts, pending: contractsPending, refresh: refreshContracts } = useLazyFetch<{ docs: Record<string, unknown>[] }>(
  '/api/contracts',
  {
    query: {
      limit: 100,
      sort: '-createdAt'
    }
  }
)

// Fetch invoices
const { data: invoices, pending: invoicesPending, refresh: refreshInvoices } = useLazyFetch<{ docs: Record<string, unknown>[] }>(
  '/api/invoices',
  {
    query: {
      limit: 100,
      sort: '-createdAt'
    }
  }
)

// Transform data for unified display
const allDocuments = computed<Document[]>(() => {
  const docs: Document[] = []

  // Add contracts
  if (contracts.value?.docs) {
    contracts.value.docs.forEach((c) => {
      docs.push({
        id: c.id as string,
        type: 'contract',
        number: c.contractNumber as string,
        bookingId: c.bookingId as string | number | undefined,
        customerId: c.customerId as string | number | undefined,
        status: c.status as string,
        createdAt: c.createdAt as string,
        signedAt: c.signedAt as string | undefined
      })
    })
  }

  // Add invoices
  if (invoices.value?.docs) {
    invoices.value.docs.forEach((i) => {
      docs.push({
        id: i.id as string,
        type: 'invoice',
        number: i.invoiceNumber as string,
        bookingId: i.bookingId as string | number | undefined,
        customerId: i.customerId as string | number | undefined,
        status: i.status as string,
        createdAt: i.createdAt as string,
        paidAt: i.paidAt as string | undefined
      })
    })
  }

  return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Filtered documents based on tab
const filteredDocuments = computed(() => {
  if (selectedTab.value === 'all') return allDocuments.value
  return allDocuments.value.filter(d => d.type === selectedTab.value)
})

// Stats
const stats = computed(() => {
  const contractCount = allDocuments.value.filter(d => d.type === 'contract').length
  const invoiceCount = allDocuments.value.filter(d => d.type === 'invoice').length
  const signedCount = allDocuments.value.filter(d => d.signedAt).length
  const paidCount = allDocuments.value.filter(d => d.paidAt).length

  return {
    total: allDocuments.value.length,
    contracts: contractCount,
    invoices: invoiceCount,
    signed: signedCount,
    paid: paidCount
  }
})

// Tabs
const tabs = [
  { key: 'all', label: 'All Documents', count: computed(() => stats.value.total) },
  { key: 'contracts', label: 'Contracts', count: computed(() => stats.value.contracts) },
  { key: 'invoices', label: 'Invoices', count: computed(() => stats.value.invoices) }
]

// Table columns
const columns: TableColumn<Document>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type')
      return h(
        UBadge,
        {
          color: type === 'contract' ? 'blue' : 'green',
          variant: 'subtle'
        },
        () => (type === 'contract' ? 'Contract' : 'Invoice')
      )
    }
  },
  {
    accessorKey: 'number',
    header: 'Document #'
  },
  {
    accessorKey: 'customerId',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.original.customerId
      if (typeof customer === 'object' && customer && 'firstName' in customer && 'lastName' in customer) {
        const firstName = (customer as Record<string, unknown>).firstName
        const lastName = (customer as Record<string, unknown>).lastName
        return `${firstName || ''} ${lastName || ''}`.trim()
      }
      return 'N/A'
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors: Record<string, string> = {
        draft: 'neutral',
        sent: 'primary',
        signed: 'success',
        void: 'error',
        pending: 'warning',
        paid: 'success',
        overdue: 'error'
      }
      const status = row.getValue('status') as string
      return h(
        UBadge,
        {
          color: statusColors[status] || 'neutral',
          variant: 'subtle'
        },
        () => status.charAt(0).toUpperCase() + status.slice(1)
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(UButton, {
          icon: 'i-lucide-eye',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm',
          onClick: () => viewDocument(row.original)
        }),
        h(UButton, {
          icon: 'i-lucide-download',
          color: 'neutral',
          variant: 'ghost',
          size: 'sm',
          onClick: () => downloadDocument(row.original)
        })
      ])
  }
]

// Actions
function viewDocument(doc: Document) {
  const collection = doc.type === 'contract' ? 'contracts' : 'invoices'
  window.open(`/admin/collections/${collection}/${doc.id}`, '_blank')
}

async function downloadDocument(doc: Document) {
  try {
    const collection = doc.type === 'contract' ? 'contracts' : 'invoices'
    const response = await fetch(`/api/documents/${collection}/${doc.id}/download`)

    if (!response.ok) {
      throw new Error('Failed to download')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.number}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.add({
      title: 'Download Complete',
      description: `${doc.number}.pdf downloaded successfully`,
      color: 'success'
    })
  } catch (error) {
    console.error('Error downloading document:', error)
    toast.add({
      title: 'Download Failed',
      description: 'Unable to download the document. Please try again.',
      color: 'error'
    })
  }
}

async function refreshAll() {
  await Promise.all([refreshContracts(), refreshInvoices()])
}

// Invoice generation modal state
const isGenerateInvoiceModalOpen = ref(false)
const invoiceForm = ref({
  bookingId: '',
  customerId: '',
  amount: '',
  dueDate: '',
  notes: ''
})
const isCreatingInvoice = ref(false)

// Fetch bookings for invoice generation (depth: 1 to populate customerId relationship)
const { data: bookings } = useLazyFetch<{ docs: Record<string, unknown>[] }>('/api/bookings', {
  query: {
    limit: 100,
    sort: '-createdAt',
    depth: 1
  }
})

// Transform bookings for select dropdown
const bookingItems = computed(() => {
  if (!bookings.value?.docs) return []
  return bookings.value.docs.map((b) => {
    const customerName = typeof b.customerId === 'object' && b.customerId && 'name' in b.customerId
      ? (b.customerId.name as string)
      : 'Unknown'
    return {
      label: `${b.bookingNumber || b.id} - ${customerName}`,
      value: b.id as string,
      booking: b
    }
  })
})

// Watch selected booking to auto-fill form
watch(() => invoiceForm.value.bookingId, (bookingId) => {
  if (!bookingId) return
  const selectedBooking = bookingItems.value.find(b => b.value === bookingId)
  if (selectedBooking?.booking) {
    const booking = selectedBooking.booking
    const customerId = typeof booking.customerId === 'object' && booking.customerId && 'id' in booking.customerId
      ? (booking.customerId.id as string)
      : (booking.customerId as string | undefined) || ''
    invoiceForm.value.customerId = customerId
    const totalPrice = 'totalPrice' in booking ? booking.totalPrice : undefined
    const basePrice = 'basePrice' in booking ? booking.basePrice : undefined
    invoiceForm.value.amount = String(totalPrice || basePrice || '')
    // Set due date to 7 days from now
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)
    invoiceForm.value.dueDate = dueDate.toISOString().split('T')[0] || ''
  }
})

async function generateInvoice() {
  // Validate form
  if (!invoiceForm.value.bookingId) {
    toast.add({
      title: 'Validation Error',
      description: 'Please select a booking',
      color: 'error'
    })
    return
  }

  if (!invoiceForm.value.amount || Number(invoiceForm.value.amount) <= 0) {
    toast.add({
      title: 'Validation Error',
      description: 'Please enter a valid amount',
      color: 'error'
    })
    return
  }

  if (!invoiceForm.value.dueDate) {
    toast.add({
      title: 'Validation Error',
      description: 'Please select a due date',
      color: 'error'
    })
    return
  }

  try {
    isCreatingInvoice.value = true

    await $fetch('/api/invoices', {
      method: 'POST',
      body: {
        bookingId: invoiceForm.value.bookingId,
        customerId: invoiceForm.value.customerId,
        amount: Number(invoiceForm.value.amount),
        dueDate: invoiceForm.value.dueDate,
        notes: invoiceForm.value.notes,
        status: 'pending'
      }
    })

    toast.add({
      title: 'Invoice Created',
      description: 'Invoice generated successfully',
      color: 'success'
    })

    // Reset form and close modal
    invoiceForm.value = {
      bookingId: '',
      customerId: '',
      amount: '',
      dueDate: '',
      notes: ''
    }
    isGenerateInvoiceModalOpen.value = false

    // Refresh invoices list
    await refreshInvoices()
  } catch (err) {
    const error = err as { data?: { message?: string } }
    console.error('Error creating invoice:', error)
    toast.add({
      title: 'Failed to Create Invoice',
      description: error.data?.message || 'An error occurred while creating the invoice',
      color: 'error'
    })
  } finally {
    isCreatingInvoice.value = false
  }
}

// Generate documents dropdown actions
const generateActions = [
  {
    label: 'Generate Contract',
    icon: 'i-lucide-file-text',
    to: '/app/contracts'
  },
  {
    label: 'Create Invoice',
    icon: 'i-lucide-file-invoice',
    onSelect: (e: Event) => {
      e.preventDefault()
      isGenerateInvoiceModalOpen.value = true
    }
  },
  {
    label: 'Manage Templates',
    icon: 'i-lucide-file-cog',
    to: '/app/templates'
  }
]
</script>

<template>
  <div>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Documents">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #trailing>
            <div class="flex gap-2">
              <UButton
                icon="i-lucide-refresh-cw"
                variant="ghost"
                @click="refreshAll"
              />
              <UDropdownMenu :items="[generateActions]">
                <UButton
                  icon="i-lucide-plus"
                  label="Generate"
                  trailing-icon="i-lucide-chevron-down"
                />
              </UDropdownMenu>
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <div class="p-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Total Documents
                  </p>
                  <p class="text-2xl font-bold">
                    {{ stats.total }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-files"
                  class="text-3xl text-gray-400"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Contracts
                  </p>
                  <p class="text-2xl font-bold">
                    {{ stats.contracts }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-file-text"
                  class="text-3xl text-blue-400"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Invoices
                  </p>
                  <p class="text-2xl font-bold">
                    {{ stats.invoices }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-receipt"
                  class="text-3xl text-green-400"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Signed
                  </p>
                  <p class="text-2xl font-bold">
                    {{ stats.signed }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-pen-tool"
                  class="text-3xl text-purple-400"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Paid
                  </p>
                  <p class="text-2xl font-bold">
                    {{ stats.paid }}
                  </p>
                </div>
                <UIcon
                  name="i-lucide-check-circle"
                  class="text-3xl text-green-400"
                />
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-4 flex gap-2">
            <UButton
              v-for="tab in tabs"
              :key="tab.key"
              :variant="selectedTab === tab.key ? 'solid' : 'ghost'"
              :color="selectedTab === tab.key ? 'primary' : 'neutral'"
              @click="selectedTab = tab.key"
            >
              {{ tab.label }}
              <template
                v-if="tab.count.value > 0"
                #trailing
              >
                <UBadge
                  :label="tab.count.value.toString()"
                  size="xs"
                />
              </template>
            </UButton>
          </div>

          <!-- Documents Table -->
          <div
            v-if="!contractsPending && !invoicesPending && filteredDocuments.length"
            class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
          >
            <UTable
              :data="filteredDocuments"
              :columns="columns"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else-if="!contractsPending && !invoicesPending && !filteredDocuments.length"
            class="flex flex-col items-center justify-center py-16 text-gray-500"
          >
            <UIcon
              name="i-lucide-file-x"
              class="text-6xl mb-4 text-gray-300"
            />
            <p class="text-lg font-medium">
              No Documents Found
            </p>
            <p class="text-sm mb-6 text-center max-w-sm">
              Generate contracts and invoices for your bookings
            </p>
            <UDropdownMenu :items="[generateActions]">
              <UButton
                icon="i-lucide-plus"
                label="Generate Document"
                trailing-icon="i-lucide-chevron-down"
              />
            </UDropdownMenu>
          </div>

          <!-- Loading State -->
          <div
            v-else
            class="flex items-center justify-center py-12"
          >
            <UIcon
              name="i-lucide-loader-circle"
              class="animate-spin text-4xl text-gray-400"
            />
          </div>
        </div>
      </template>
    </UDashboardPanel>

    <!-- Generate Invoice Modal -->
    <UModal
      v-model:open="isGenerateInvoiceModalOpen"
      title="Generate Invoice"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Select Booking"
            required
          >
            <USelect
              v-model="invoiceForm.bookingId"
              :items="bookingItems"
              placeholder="Choose a booking"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Amount"
            required
          >
            <UInput
              v-model="invoiceForm.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-dollar-sign"
                  class="w-4 h-4"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField
            label="Due Date"
            required
          >
            <UInput
              v-model="invoiceForm.dueDate"
              type="date"
              class="w-full"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-calendar"
                  class="w-4 h-4"
                />
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Notes (Optional)">
            <UTextarea
              v-model="invoiceForm.notes"
              placeholder="Add any additional notes or payment instructions"
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            :disabled="isCreatingInvoice"
            @click="close"
          />
          <UButton
            label="Generate Invoice"
            icon="i-lucide-file-invoice"
            :loading="isCreatingInvoice"
            @click="generateInvoice"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
