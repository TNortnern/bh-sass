<template>
  <div class="customers-list-page">
    <NoTenantAlert v-if="!hasTenant" />
    <div
      v-else
      class="space-y-4"
    >
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 md:mb-6">
          <div>
            <h1 class="text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-50 mb-1 md:mb-2 tracking-tight">
              Customers
            </h1>
            <p class="text-sm md:text-lg text-gray-600 dark:text-slate-400">
              Manage your customer relationships and booking history
            </p>
          </div>

          <UButton
            color="primary"
            size="md"
            icon="i-lucide-plus"
            class="rounded-xl w-full sm:w-auto"
            @click="navigateTo('/app/customers/new')"
          >
            Add Customer
          </UButton>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{ body: 'p-3 md:p-5' }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="text-[10px] md:text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2 truncate">
                  Total Customers
                </div>
                <div class="text-xl md:text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ total }}
                </div>
              </div>
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-users"
                  class="w-4 h-4 md:w-6 md:h-6 text-blue-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{ body: 'p-3 md:p-5' }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="text-[10px] md:text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2 truncate">
                  VIP Customers
                </div>
                <div class="text-xl md:text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ vipCount }}
                </div>
              </div>
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-star"
                  class="w-4 h-4 md:w-6 md:h-6 text-amber-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{ body: 'p-3 md:p-5' }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="text-[10px] md:text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2 truncate">
                  New This Month
                </div>
                <div class="text-xl md:text-3xl font-bold text-gray-900 dark:text-slate-200">
                  {{ newThisMonth }}
                </div>
              </div>
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-user-plus"
                  class="w-4 h-4 md:w-6 md:h-6 text-green-500"
                />
              </div>
            </div>
          </UCard>

          <UCard
            class="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800/60 dark:to-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
            :ui="{ body: 'p-3 md:p-5' }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="text-[10px] md:text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-1 md:mb-2 truncate">
                  Avg Lifetime Value
                </div>
                <div class="text-xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {{ formatCurrency(avgLifetimeValue) }}
                </div>
              </div>
              <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-dollar-sign"
                  class="w-4 h-4 md:w-6 md:h-6 text-purple-500"
                />
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
              class="w-full rounded-xl"
              :ui="{
                base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500'
              }"
              @input="handleSearch"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-search"
                  class="w-5 h-5 text-gray-500 dark:text-slate-500"
                />
              </template>
              <template
                v-if="searchQuery"
                #trailing
              >
                <UButton
                  color="neutral"
                  variant="link"
                  icon="i-lucide-x"
                  :padded="false"
                  @click="clearSearch"
                />
              </template>
            </UInput>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-filter"
            class="rounded-xl"
            @click="showFilters = !showFilters"
          >
            Filters
            <UBadge
              v-if="activeFiltersCount > 0"
              color="primary"
              size="xs"
              class="ml-2"
            >
              {{ activeFiltersCount }}
            </UBadge>
          </UButton>

          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-lucide-download"
            class="rounded-xl"
            @click="handleExport"
          >
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
                  :color="selectedTags.includes(tag) ? 'primary' : 'neutral'"
                  :variant="selectedTags.includes(tag) ? 'solid' : 'outline'"
                  size="sm"
                  class="rounded-full"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                  <UIcon
                    v-if="selectedTags.includes(tag)"
                    name="i-lucide-check"
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
                  class="w-full rounded-lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500'
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
                  class="w-full rounded-lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500'
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
                  class="w-full rounded-lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500'
                  }"
                />
                <UInput
                  v-model.number="filters.maxBookings"
                  type="number"
                  placeholder="Max bookings"
                  size="md"
                  class="w-full rounded-lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500'
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <UButton
              color="primary"
              size="md"
              class="rounded-lg"
              @click="applyFilters"
            >
              Apply Filters
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              size="md"
              class="rounded-lg"
              @click="clearFilters"
            >
              Clear All
            </UButton>
          </div>
        </div>
      </div>

      <!-- Mobile Customer Cards (visible on mobile only) -->
      <div
        v-if="viewMode === 'table' && customers.length > 0"
        class="lg:hidden space-y-3"
      >
        <div
          v-for="customer in customers"
          :key="'mobile-' + customer.id"
          class="bg-white dark:bg-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl p-4 cursor-pointer transition-all hover:ring-amber-500/50"
          @click="handleRowClick(customer)"
        >
          <!-- Customer Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <UAvatar
                :src="customer.avatar"
                :alt="`${customer.firstName} ${customer.lastName}`"
                size="md"
              >
                {{ `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}` }}
              </UAvatar>
              <div class="min-w-0">
                <div class="font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                  <span class="truncate">{{ customer.firstName }} {{ customer.lastName }}</span>
                  <UIcon
                    v-if="customer.tags.includes('VIP')"
                    name="i-lucide-star"
                    class="w-4 h-4 text-amber-400 flex-shrink-0"
                  />
                </div>
                <div class="text-sm text-gray-500 dark:text-slate-400 truncate">
                  {{ customer.email }}
                </div>
              </div>
            </div>
            <div
              class="flex-shrink-0"
              @click.stop
            >
              <UDropdownMenu :items="getCustomerActions(customer)">
                <UButton
                  icon="i-lucide-more-vertical"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                />
              </UDropdownMenu>
            </div>
          </div>

          <!-- Customer Details -->
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-500 dark:text-slate-400">Phone:</span>
              <a
                :href="`tel:${customer.phone}`"
                class="ml-1 text-gray-900 dark:text-slate-200 hover:text-amber-400"
                @click.stop
              >
                {{ customer.phone }}
              </a>
            </div>
            <div>
              <span class="text-gray-500 dark:text-slate-400">Bookings:</span>
              <span class="ml-1 font-semibold text-gray-900 dark:text-slate-200">{{ customer.bookings.total }}</span>
              <span
                v-if="customer.bookings.upcoming > 0"
                class="ml-1 text-xs text-amber-500"
              >({{ customer.bookings.upcoming }} upcoming)</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-slate-400">Spent:</span>
              <span class="ml-1 font-semibold text-amber-400">{{ formatCurrency(customer.totalSpent) }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-slate-400">Last:</span>
              <span class="ml-1 text-gray-600 dark:text-slate-400">{{ formatRelativeDate(customer.lastBooking) }}</span>
            </div>
          </div>

          <!-- Tags -->
          <div
            v-if="customer.tags.length > 0"
            class="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700/50"
          >
            <UBadge
              v-for="tag in customer.tags.slice(0, 3)"
              :key="tag"
              :color="getTagColor(tag)"
              variant="subtle"
              size="xs"
            >
              {{ tag }}
            </UBadge>
            <UBadge
              v-if="customer.tags.length > 3"
              color="neutral"
              variant="subtle"
              size="xs"
            >
              +{{ customer.tags.length - 3 }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Customers Table (hidden on mobile) -->
      <UCard
        v-if="viewMode === 'table'"
        class="hidden lg:block bg-white dark:bg-slate-800/40 ring-1 ring-gray-200 dark:ring-slate-700/50 rounded-xl"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700/50">
              <tr>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Name
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Email
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Phone
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Bookings
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Total Spent
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Last Booking
                </th>
                <th class="text-left text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                  Tags
                </th>
                <th class="text-right text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider px-6 py-4 w-12">
                  Actions
                </th>
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
                      <div
                        v-if="customer.tags.includes('VIP')"
                        class="flex items-center gap-1 text-xs text-amber-400 mt-1"
                      >
                        <UIcon
                          name="i-lucide-star"
                          class="w-3 h-3"
                        />
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
                      color="primary"
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
                  <div
                    class="flex justify-end"
                    @click.stop
                  >
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
          <div
            v-if="loading"
            class="flex justify-center py-12"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 animate-spin text-gray-500 dark:text-slate-500"
            />
          </div>
        </div>
      </UCard>

      <!-- Grid View -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
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
          <UIcon
            name="i-lucide-users"
            class="w-10 h-10 text-gray-400 dark:text-slate-600"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-300 mb-2">
          No customers found
        </h3>
        <p class="text-gray-600 dark:text-slate-500 mb-6">
          {{ searchQuery || activeFiltersCount > 0 ? 'Try adjusting your search or filters' : 'Get started by adding your first customer' }}
        </p>
        <UButton
          v-if="!searchQuery && activeFiltersCount === 0"
          color="primary"
          size="lg"
          class="rounded-xl"
          @click="navigateTo('/app/customers/new')"
        >
          <UIcon
            name="i-lucide-plus"
            class="w-5 h-5 mr-2"
          />
          Add Customer
        </UButton>
      </div>

      <!-- Pagination -->
      <div
        v-if="customers.length > 0"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 md:mt-6"
      >
        <div class="text-xs sm:text-sm text-gray-600 dark:text-slate-400 text-center sm:text-left">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, total) }} of {{ total }} customers
        </div>

        <UPagination
          v-model="currentPage"
          :page-count="pageSize"
          :total="total"
          class="flex items-center gap-1"
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
        <template #content>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-trash-2"
                  class="text-red-600 dark:text-red-400 text-xl"
                />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Customer
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete
              <strong>{{ customerToDelete?.firstName }} {{ customerToDelete?.lastName }}</strong>?
              All customer data, including booking history, will be permanently removed.
            </p>
            <div class="flex justify-end gap-3">
              <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="showDeleteDialog = false"
              />
              <UButton
                label="Delete"
                color="error"
                icon="i-lucide-trash-2"
                @click="confirmDelete"
              />
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Customer } from '~/composables/useCustomers'
import NoTenantAlert from '~/components/NoTenantAlert.vue'

definePageMeta({
  layout: 'dashboard'
})

const { currentUser } = useAuth()
const { customers, loading, total, fetchCustomers, getAllTags, deleteCustomer } = useCustomers()
const toast = useToast()

const hasTenant = computed(() => {
  return currentUser.value?.tenantId !== null && currentUser.value?.tenantId !== undefined
})

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
  if (customers.value.length === 0) {
    toast.add({
      title: 'No customers to export',
      description: 'Add some customers first before exporting.',
      color: 'warning'
    })
    return
  }

  // Create CSV content
  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Tags', 'Last Booking']
  const rows = customers.value.map(c => [
    c.firstName,
    c.lastName,
    c.email,
    c.phone,
    c.bookings.total,
    c.totalSpent,
    c.tags.join('; '),
    c.lastBooking || 'Never'
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)

  toast.add({
    title: 'Export successful',
    description: `Exported ${customers.value.length} customers to CSV.`,
    color: 'success'
  })
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

type BadgeColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

function getTagColor(tag: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    'VIP': 'warning',
    'Birthday Party': 'error',
    'Corporate': 'info',
    'Repeat Customer': 'success',
    'New': 'primary',
    'High Value': 'secondary',
    'Referral': 'info',
    'Email List': 'success',
    'SMS List': 'warning'
  }
  return colors[tag] || 'neutral'
}

function getCustomerActions(customer: Customer) {
  return [[
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/app/customers/${customer.id}`)
    },
    {
      label: 'Edit Customer',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/app/customers/${customer.id}/edit`)
    },
    {
      label: 'Delete Customer',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => openDeleteDialog(customer)
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
  } catch (err) {
    console.error('Failed to delete customer:', err)
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
