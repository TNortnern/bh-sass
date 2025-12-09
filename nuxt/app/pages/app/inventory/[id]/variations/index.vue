<script setup lang="ts">
/* eslint-disable vue/no-multiple-template-root */
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const itemId = computed(() => route.params.id as string)

// Fetch rental item details
const { data: item, pending: itemPending } = await useLazyFetch(
  `/api/rental-items/${itemId.value}`
)

// Fetch variations
const {
  data: variations,
  pending: variationsPending,
  refresh: refreshVariations
} = await useLazyFetch(() => `/api/rental-items/${itemId.value}/variations`)

const pending = computed(() => itemPending.value || variationsPending.value)

// Table columns
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')

type VariationRow = {
  id: string
  sku: string
  name: string
  attributes: Array<{ name: string, value: string }>
  pricingType: 'same_as_parent' | 'adjustment' | 'override'
  priceAdjustment?: number
  quantity: number
  status: 'active' | 'inactive'
}

const columns: TableColumn<VariationRow>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'attributes',
    header: 'Attributes',
    cell: ({ row }) => {
      const attrs = row.original.attributes as Array<{ name: string, value: string }>
      return attrs.map(a => `${a.name}: ${a.value}`).join(', ')
    }
  },
  {
    accessorKey: 'pricingType',
    header: 'Pricing',
    cell: ({ row }) => {
      const type = row.original.pricingType
      const adjustment = row.original.priceAdjustment

      if (type === 'same_as_parent') return 'Same as parent'
      if (type === 'adjustment') {
        const sign = adjustment && adjustment >= 0 ? '+' : ''
        return `${sign}$${adjustment?.toFixed(2) || '0.00'}`
      }
      return 'Custom'
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => row.original.quantity.toString()
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors = {
        active: 'success',
        inactive: 'neutral'
      }
      const status = row.original.status
      return h(
        UBadge,
        {
          color: statusColors[status],
          variant: 'subtle'
        },
        () => status.charAt(0).toUpperCase() + status.slice(1)
      )
    }
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(UButton, {
          icon: 'i-lucide-pencil',
          color: 'neutral',
          variant: 'ghost',
          size: 'xs',
          onClick: () => router.push(`/app/inventory/${itemId.value}/variations/${row.original.id}`)
        }),
        h(UButton, {
          icon: 'i-lucide-trash-2',
          color: 'error',
          variant: 'ghost',
          size: 'xs',
          onClick: () => handleDelete(row.original.id)
        })
      ])
  }
]

// Delete variation
const deleteModalOpen = ref(false)
const variationToDelete = ref<string | null>(null)

function handleDelete(id: string) {
  variationToDelete.value = id
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!variationToDelete.value) return

  try {
    await $fetch(`/api/variations/${variationToDelete.value}`, {
      method: 'DELETE'
    })

    refreshVariations()
    deleteModalOpen.value = false
    variationToDelete.value = null
  } catch (error) {
    console.error('Failed to delete variation:', error)
  }
}

// Bulk status update
const selectedVariations = ref<string[]>([])
const bulkStatusModalOpen = ref(false)
const newBulkStatus = ref<'active' | 'inactive'>('active')

async function updateBulkStatus() {
  if (selectedVariations.value.length === 0) return

  try {
    await Promise.all(
      selectedVariations.value.map(id =>
        $fetch(`/api/variations/${id}`, {
          method: 'PATCH',
          body: { status: newBulkStatus.value }
        })
      )
    )

    refreshVariations()
    bulkStatusModalOpen.value = false
    selectedVariations.value = []
  } catch (error) {
    console.error('Failed to update variation statuses:', error)
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="`${item?.name || 'Item'} - Variations`">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="router.push(`/app/inventory/${itemId}`)"
          />
        </template>
        <template #trailing>
          <UButton
            icon="i-lucide-plus"
            label="Add Variation"
            @click="router.push(`/app/inventory/${itemId}/variations/new`)"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Loading state -->
        <div
          v-if="pending"
          class="flex items-center justify-center py-12"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="animate-spin text-4xl text-gray-400"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!variations?.docs?.length"
          class="flex flex-col items-center justify-center py-16 text-gray-500"
        >
          <UIcon
            name="i-lucide-boxes"
            class="text-6xl mb-4 text-gray-300"
          />
          <p class="text-lg font-medium">
            No Variations Yet
          </p>
          <p class="text-sm mb-6 text-center max-w-sm">
            Create variations for this item to offer different sizes, colors, or themes.
          </p>
          <UButton
            icon="i-lucide-plus"
            label="Create First Variation"
            @click="router.push(`/app/inventory/${itemId}/variations/new`)"
          />
        </div>

        <!-- Variations table -->
        <div v-else>
          <!-- Bulk actions -->
          <div
            v-if="selectedVariations.length > 0"
            class="mb-4 flex items-center gap-4"
          >
            <p class="text-sm text-gray-500">
              {{ selectedVariations.length }} variation(s) selected
            </p>
            <UButton
              icon="i-lucide-check-circle"
              label="Update Status"
              size="xs"
              variant="outline"
              @click="bulkStatusModalOpen = true"
            />
          </div>

          <UTable
            :data="variations.docs"
            :columns="columns"
            :loading="pending"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Delete confirmation modal -->
  <UModal
    v-model:open="deleteModalOpen"
    title="Delete Variation"
  >
    <template #content>
      <div class="p-6">
        <div class="flex items-start gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-lucide-trash-2"
              class="text-red-600 dark:text-red-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-1">
              Delete Variation?
            </h3>
            <p class="text-sm text-gray-500">
              This action cannot be undone. Any bookings using this variation will need to be
              updated.
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            variant="ghost"
            @click="deleteModalOpen = false"
          />
          <UButton
            label="Delete"
            color="error"
            @click="confirmDelete"
          />
        </div>
      </div>
    </template>
  </UModal>

  <!-- Bulk status update modal -->
  <UModal
    v-model:open="bulkStatusModalOpen"
    title="Update Status"
  >
    <template #body>
      <UFormField
        label="New Status"
        required
      >
        <USelect
          v-model="newBulkStatus"
          :items="[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]"
        />
      </UFormField>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          variant="ghost"
          @click="close"
        />
        <UButton
          label="Update"
          @click="updateBulkStatus"
        />
      </div>
    </template>
  </UModal>
</template>
