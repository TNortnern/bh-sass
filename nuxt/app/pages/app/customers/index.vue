<template>
  <div class="customers-list-page">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-2 tracking-tight">
            Customers
          </h1>
          <p class="text-gray-600 dark:text-slate-400 text-lg">
            Manage your customer relationships and booking history
          </p>
        </div>

        <UButton
          color="amber"
          size="lg"
          :ui="{ rounded: 'rounded-xl' }"
          @click="navigateTo('/app/customers/new')"
        >
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Add Customer
        </UButton>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <UCard
          :ui="{
            background: 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40',
            ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-5' }
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                Total Customers
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                {{ total }}
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </UCard>

        <UCard
          :ui="{
            background: 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40',
            ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-5' }
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                VIP Customers
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                {{ vipCount }}
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Icon name="heroicons:star" class="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </UCard>

        <UCard
          :ui="{
            background: 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40',
            ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-5' }
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                New This Month
              </div>
              <div class="text-3xl font-bold text-gray-900 dark:text-slate-200">
                {{ newThisMonth }}
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Icon name="heroicons:user-plus" class="w-6 h-6 text-green-500" />
            </div>
          </div>
        </UCard>

        <UCard
          :ui="{
            background: 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40',
            ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-5' }
          }"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                Avg Lifetime Value
              </div>
              <div class="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {{ formatCurrency(avgLifetimeValue) }}
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Search by name, email, or phone..."
            size="lg"
            :ui="{
              base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500',
              rounded: 'rounded-xl'
            }"
            @input="handleSearch"
          >
            <template #leading>
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-500 dark:text-slate-500" />
            </template>
            <template v-if="searchQuery" #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="heroicons:x-mark"
                :padded="false"
                @click="clearSearch"
              />
            </template>
          </UInput>
        </div>

        <UButton
          color="gray"
          variant="outline"
          size="lg"
          :ui="{ rounded: 'rounded-xl' }"
          @click="showFilters = !showFilters"
        >
          <Icon name="heroicons:funnel" class="w-5 h-5 mr-2" />
          Filters
          <UBadge
            v-if="activeFiltersCount > 0"
            color="amber"
            size="xs"
            class="ml-2"
          >
            {{ activeFiltersCount }}
          </UBadge>
        </UButton>

        <UButton
          color="gray"
          variant="outline"
          size="lg"
          :ui="{ rounded: 'rounded-xl' }"
          @click="handleExport"
        >
          <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 mr-2" />
          Export
        </UButton>
      </div>

      <!-- Filter Panel -->
      <div
        v-if="showFilters"
        class="mt-4 p-6 bg-gray-100 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700/50 animate-slide-down"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Tags Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Filter by Tags
            </label>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="tag in availableTags"
                :key="tag"
                :color="selectedTags.includes(tag) ? 'amber' : 'gray'"
                :variant="selectedTags.includes(tag) ? 'solid' : 'outline'"
                size="sm"
                :ui="{ rounded: 'rounded-full' }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
                <Icon
                  v-if="selectedTags.includes(tag)"
                  name="heroicons:check"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
            </div>
          </div>

          <!-- Spent Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Total Spent
            </label>
            <div class="space-y-3">
              <UInput
                v-model.number="filters.minSpent"
                type="number"
                placeholder="Min"
                size="md"
                :ui="{
                  base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500',
                  rounded: 'rounded-lg'
                }"
              >
                <template #leading>
                  <span class="text-gray-600 dark:text-slate-500">$</span>
                </template>
              </UInput>
              <UInput
                v-model.number="filters.maxSpent"
                type="number"
                placeholder="Max"
                size="md"
                :ui="{
                  base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500',
                  rounded: 'rounded-lg'
                }"
              >
                <template #leading>
                  <span class="text-gray-600 dark:text-slate-500">$</span>
                </template>
              </UInput>
            </div>
          </div>

          <!-- Bookings Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Booking Count
            </label>
            <div class="space-y-3">
              <UInput
                v-model.number="filters.minBookings"
                type="number"
                placeholder="Min bookings"
                size="md"
                :ui="{
                  base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500',
                  rounded: 'rounded-lg'
                }"
              />
              <UInput
                v-model.number="filters.maxBookings"
                type="number"
                placeholder="Max bookings"
                size="md"
                :ui="{
                  base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500',
                  rounded: 'rounded-lg'
                }"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <UButton
            color="amber"
            size="md"
            :ui="{ rounded: 'rounded-lg' }"
            @click="applyFilters"
          >
            Apply Filters
          </UButton>
          <UButton
            color="gray"
            variant="ghost"
            size="md"
            :ui="{ rounded: 'rounded-lg' }"
            @click="clearFilters"
          >
            Clear All
          </UButton>
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <UCard
      v-if="viewMode === 'table'"
      :ui="{
        background: 'bg-white dark:bg-slate-800/40',
        ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
        rounded: 'rounded-xl',
        body: { padding: 'p-0' }
      }"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/50">
            <tr>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Name</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Email</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Phone</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Bookings</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Total Spent</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Last Booking</th>
              <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">Tags</th>
              <th class="text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4 w-12">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700/30">
            <tr
              v-for="customer in customers"
              :key="customer.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors cursor-pointer"
              @click="handleRowClick(customer)"
            >
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <div class="flex items-center gap-3">
                  <UAvatar
                    :src="customer.avatar"
                    :alt="`${customer.firstName} ${customer.lastName}`"
                    size="md"
                  >
                    {{ `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}` }}
                  </UAvatar>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-slate-200">
                      {{ customer.firstName }} {{ customer.lastName }}
                    </div>
                    <div v-if="customer.tags.includes('VIP')" class="flex items-center gap-1 text-xs text-amber-400 mt-1">
                      <Icon name="heroicons:star-solid" class="w-3 h-3" />
                      <span>VIP</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <a
                  :href="`mailto:${customer.email}`"
                  class="text-gray-700 dark:text-slate-300 hover:text-amber-400 transition-colors"
                  @click.stop
                >
                  {{ customer.email }}
                </a>
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <a
                  :href="`tel:${customer.phone}`"
                  class="text-gray-700 dark:text-slate-300 hover:text-amber-400 transition-colors"
                  @click.stop
                >
                  {{ customer.phone }}
                </a>
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-gray-900 dark:text-slate-200">{{ customer.bookings.total }}</span>
                  <UBadge
                    v-if="customer.bookings.upcoming > 0"
                    color="info"
                    variant="subtle"
                    size="xs"
                  >
                    {{ customer.bookings.upcoming }} upcoming
                  </UBadge>
                </div>
              </td>
              <td class="text-sm px-6 py-5">
                <span class="font-semibold text-amber-400">
                  {{ formatCurrency(customer.totalSpent) }}
                </span>
              </td>
              <td class="text-sm text-gray-600 dark:text-slate-400 px-6 py-5">
                {{ formatRelativeDate(customer.lastBooking) }}
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-for="tag in customer.tags.slice(0, 2)"
                    :key="tag"
                    :color="getTagColor(tag)"
                    variant="subtle"
                    size="xs"
                  >
                    {{ tag }}
                  </UBadge>
                  <UBadge
                    v-if="customer.tags.length > 2"
                    color="neutral"
                    variant="subtle"
                    size="xs"
                  >
                    +{{ customer.tags.length - 2 }}
                  </UBadge>
                </div>
              </td>
              <td class="text-sm text-gray-700 dark:text-slate-300 px-6 py-5">
                <div class="flex justify-end" @click.stop>
                  <UDropdownMenu :items="getCustomerActions(customer)">
                    <UButton
                      icon="i-lucide-more-vertical"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                    />
                  </UDropdownMenu>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="flex justify-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-slate-500" />
        </div>
      </div>
    </UCard>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CustomersCustomerCard
        v-for="customer in customers"
        :key="customer.id"
        :customer="customer"
        @click="handleCustomerClick"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && customers.length === 0"
      class="text-center py-16"
    >
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800/60 flex items-center justify-center">
        <Icon name="heroicons:users" class="w-10 h-10 text-gray-400 dark:text-slate-600" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
        No customers found
      </h3>
      <p class="text-gray-600 dark:text-slate-500 mb-6">
        {{ searchQuery || activeFiltersCount > 0 ? 'Try adjusting your search or filters' : 'Get started by adding your first customer' }}
      </p>
      <UButton
        v-if="!searchQuery && activeFiltersCount === 0"
        color="amber"
        size="lg"
        :ui="{ rounded: 'rounded-xl' }"
        @click="navigateTo('/app/customers/new')"
      >
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Add Customer
      </UButton>
    </div>

    <!-- Pagination -->
    <div
      v-if="customers.length > 0"
      class="flex items-center justify-between mt-6"
    >
      <div class="text-sm text-gray-600 dark:text-slate-400">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, total) }} of {{ total }} customers
      </div>

      <UPagination
        v-model="currentPage"
        :page-count="pageSize"
        :total="total"
        :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: 'rounded-lg',
          base: 'min-w-[40px] h-[40px]',
          default: {
            activeButton: {
              color: 'amber'
            }
          }
        }"
        @update:model-value="handlePageChange"
      />
    </div>

    <!-- Quick View Modal -->
    <CustomersCustomerQuickView
      v-model="showQuickView"
      :customer="selectedCustomer"
      @edit="handleEdit"
    />

    <!-- Delete Confirmation Dialog -->
    <UModal v-model:open="showDeleteDialog">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Icon name="i-lucide-trash-2" class="text-red-600 dark:text-red-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-200">Delete Customer</h3>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-gray-700 dark:text-slate-300">
            Are you sure you want to delete
            <strong>{{ customerToDelete?.firstName }} {{ customerToDelete?.lastName }}</strong>?
          </p>
          <p class="text-sm text-gray-500 dark:text-slate-400">
            This action cannot be undone. All customer data, including booking history, will be permanently removed.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="showDeleteDialog = false"
            />
            <UButton
              label="Delete"
              color="error"
              icon="i-lucide-trash-2"
              @click="confirmDelete"
            />
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

definePageMeta({
  layout: 'dashboard'
})

const { customers, loading, total, fetchCustomers, getAllTags, deleteCustomer } = useCustomers()
const toast = useToast()

const searchQuery = ref('')
const showFilters = ref(false)
const viewMode = ref<'grid' | 'table'>('table')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedCustomer = ref<Customer | null>(null)
const showQuickView = ref(false)
const showDeleteDialog = ref(false)
const customerToDelete = ref<Customer | null>(null)

const sort = ref({
  column: 'name',
  direction: 'asc' as const
})

const filters = reactive({
  minSpent: undefined as number | undefined,
  maxSpent: undefined as number | undefined,
  minBookings: undefined as number | undefined,
  maxBookings: undefined as number | undefined
})

const selectedTags = ref<string[]>([])
const availableTags = computed(() => getAllTags())

const columns = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'phone', accessorKey: 'phone', header: 'Phone' },
  { id: 'bookings', accessorKey: 'bookings', header: 'Bookings' },
  { id: 'totalSpent', accessorKey: 'totalSpent', header: 'Total Spent' },
  { id: 'lastBooking', accessorKey: 'lastBooking', header: 'Last Booking' },
  { id: 'tags', accessorKey: 'tags', header: 'Tags' }
]

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedTags.value.length > 0) count++
  if (filters.minSpent !== undefined || filters.maxSpent !== undefined) count++
  if (filters.minBookings !== undefined || filters.maxBookings !== undefined) count++
  return count
})

// Mock stats (in real app, these would come from API)
const vipCount = computed(() => customers.value.filter(c => c.tags.includes('VIP')).length)
const newThisMonth = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return customers.value.filter(c => new Date(c.createdAt) > oneMonthAgo).length
})
const avgLifetimeValue = computed(() => {
  if (customers.value.length === 0) return 0
  return customers.value.reduce((acc, c) => acc + c.totalSpent, 0) / customers.value.length
})

// Load customers on mount
onMounted(() => {
  loadCustomers()
})

async function loadCustomers() {
  await fetchCustomers({
    search: searchQuery.value,
    page: currentPage.value,
    limit: pageSize.value,
    tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    sortBy: sort.value.column,
    sortOrder: sort.value.direction,
    ...filters
  })
}

// Watch for changes
watch([searchQuery, sort, currentPage], () => {
  loadCustomers()
}, { deep: true })

function handleSearch() {
  currentPage.value = 1
  loadCustomers()
}

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
}

function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

function applyFilters() {
  currentPage.value = 1
  loadCustomers()
}

function clearFilters() {
  selectedTags.value = []
  filters.minSpent = undefined
  filters.maxSpent = undefined
  filters.minBookings = undefined
  filters.maxBookings = undefined
  currentPage.value = 1
  loadCustomers()
}

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleRowClick(row: Customer) {
  selectedCustomer.value = row
  showQuickView.value = true
}

function handleCustomerClick(customer: Customer) {
  selectedCustomer.value = customer
  showQuickView.value = true
}

function handleEdit(customer: Customer) {
  navigateTo(`/app/customers/${customer.id}`)
}

function handleExport() {
  // TODO: Implement CSV export
  console.log('Exporting customers...')
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatRelativeDate(date?: string): string {
  if (!date) return 'Never'

  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    'VIP': 'amber',
    'Birthday Party': 'pink',
    'Corporate': 'blue',
    'Repeat Customer': 'green',
    'New': 'cyan',
    'High Value': 'purple',
    'Referral': 'indigo',
    'Email List': 'teal',
    'SMS List': 'orange'
  }
  return colors[tag] || 'gray'
}

function getCustomerActions(customer: Customer) {
  return [[
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      click: () => navigateTo(`/app/customers/${customer.id}`)
    },
    {
      label: 'Edit Customer',
      icon: 'i-lucide-pencil',
      click: () => navigateTo(`/app/customers/${customer.id}/edit`)
    },
    {
      label: 'Delete Customer',
      icon: 'i-lucide-trash-2',
      click: () => openDeleteDialog(customer)
    }
  ]]
}

function openDeleteDialog(customer: Customer) {
  customerToDelete.value = customer
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!customerToDelete.value) return

  try {
    await deleteCustomer(customerToDelete.value.id)
    showDeleteDialog.value = false
    customerToDelete.value = null
    await loadCustomers()
  } catch (error) {
    console.error('Failed to delete customer:', error)
  }
}
</script>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>
