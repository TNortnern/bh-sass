<template>
  <div
    v-if="customer"
    class="customer-detail-page"
  >
    <!-- Back Button -->
    <div class="mb-6">
      <UButton
        color="neutral"
        variant="ghost"
        size="md"
        :ui="{ rounded: 'rounded-lg' }"
        @click="navigateTo('/app/customers')"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="w-5 h-5 mr-2"
        />
        Back to Customers
      </UButton>
    </div>

    <!-- Customer Header -->
    <UCard
      :ui="{
        background: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800/90 dark:to-slate-900/90',
        ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
        rounded: 'rounded-xl',
        body: { padding: 'p-8' }
      }"
      class="mb-6"
    >
      <div class="flex flex-col md:flex-row items-start gap-8">
        <!-- Avatar Section -->
        <div class="relative">
          <UAvatar
            :src="customer.avatar"
            :alt="`${customer.firstName} ${customer.lastName}`"
            size="3xl"
            :ui="{
              background: 'bg-gradient-to-br from-amber-500 to-orange-600',
              text: 'text-white font-semibold text-4xl'
            }"
          >
            {{ initials }}
          </UAvatar>

          <!-- VIP Badge -->
          <div
            v-if="customer.tags.includes('VIP')"
            class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-lg"
          >
            <UIcon
              name="i-lucide-star"
              class="w-5 h-5 text-white"
            />
          </div>
        </div>

        <!-- Info Section -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="min-w-0 flex-1">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-50 mb-3 tracking-tight">
                {{ editMode ? '' : `${customer.firstName} ${customer.lastName}` }}
              </h1>

              <!-- Edit Mode -->
              <div
                v-if="editMode"
                class="grid grid-cols-2 gap-3 mb-4"
              >
                <UInput
                  v-model="editForm.firstName"
                  placeholder="First name"
                  size="lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500 dark:focus:border-amber-500/50 text-gray-900 dark:text-slate-200',
                    rounded: 'rounded-lg'
                  }"
                />
                <UInput
                  v-model="editForm.lastName"
                  placeholder="Last name"
                  size="lg"
                  :ui="{
                    base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500 dark:focus:border-amber-500/50 text-gray-900 dark:text-slate-200',
                    rounded: 'rounded-lg'
                  }"
                />
              </div>

              <!-- Contact Info -->
              <div class="space-y-2 mb-4">
                <div
                  v-if="editMode"
                  class="space-y-2"
                >
                  <UInput
                    v-model="editForm.email"
                    type="email"
                    placeholder="Email"
                    size="md"
                    :ui="{
                      base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500 dark:focus:border-amber-500/50 text-gray-900 dark:text-slate-200',
                      rounded: 'rounded-lg'
                    }"
                  >
                    <template #leading>
                      <UIcon
                        name="i-lucide-mail"
                        class="w-4 h-4 text-gray-400 dark:text-slate-500"
                      />
                    </template>
                  </UInput>
                  <UInput
                    v-model="editForm.phone"
                    type="tel"
                    placeholder="Phone"
                    size="md"
                    :ui="{
                      base: 'bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500 dark:focus:border-amber-500/50 text-gray-900 dark:text-slate-200',
                      rounded: 'rounded-lg'
                    }"
                  >
                    <template #leading>
                      <UIcon
                        name="i-lucide-phone"
                        class="w-4 h-4 text-gray-400 dark:text-slate-500"
                      />
                    </template>
                  </UInput>
                </div>

                <template v-else>
                  <a
                    :href="`mailto:${customer.email}`"
                    class="flex items-center gap-3 text-gray-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors group"
                  >
                    <UIcon
                      name="i-lucide-mail"
                      class="w-5 h-5"
                    />
                    <span class="text-lg group-hover:underline">{{ customer.email }}</span>
                  </a>
                  <a
                    :href="`tel:${customer.phone}`"
                    class="flex items-center gap-3 text-gray-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors group"
                  >
                    <UIcon
                      name="i-lucide-phone"
                      class="w-5 h-5"
                    />
                    <span class="text-lg group-hover:underline">{{ customer.phone }}</span>
                  </a>
                  <div
                    v-if="customer.address && customer.address.street"
                    class="flex items-start gap-3 text-gray-600 dark:text-slate-300"
                  >
                    <UIcon
                      name="i-lucide-map-pin"
                      class="w-5 h-5 mt-1"
                    />
                    <div>
                      <div>{{ customer.address.street }}</div>
                      <div>{{ customer.address.city }}, {{ customer.address.state }} {{ customer.address.zip }}</div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Member Since -->
              <div class="text-sm text-gray-500 dark:text-slate-500">
                Member since {{ formatDate(customer.createdAt) }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <template v-if="editMode">
                <UButton
                  color="primary"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="saveEdit"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="w-5 h-5 mr-2"
                  />
                  Save
                </UButton>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="cancelEdit"
                >
                  Cancel
                </UButton>
              </template>
              <template v-else>
                <UButton
                  color="neutral"
                  variant="outline"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  :to="`/app/customers/${customer.id}/edit`"
                >
                  <UIcon
                    name="i-lucide-pencil"
                    class="w-5 h-5 mr-2"
                  />
                  Edit
                </UButton>
                <UButton
                  color="primary"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="quickBook"
                >
                  <UIcon
                    name="i-lucide-calendar-plus"
                    class="w-5 h-5 mr-2"
                  />
                  Quick Book
                </UButton>
              </template>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in customer.tags"
              :key="tag"
              :color="getTagColor(tag)"
              variant="subtle"
              :ui="{
                rounded: 'rounded-full',
                font: 'font-medium tracking-wide'
              }"
            >
              {{ tag }}
              <button
                v-if="editMode"
                class="ml-1 hover:text-red-400"
                @click="removeTag(tag)"
              >
                <UIcon
                  name="i-lucide-x"
                  class="w-3 h-3"
                />
              </button>
            </UBadge>

            <!-- Add Tag in Edit Mode -->
            <UButton
              v-if="editMode"
              color="neutral"
              variant="outline"
              size="xs"
              :ui="{ rounded: 'rounded-full' }"
              @click="showAddTag = true"
            >
              <UIcon
                name="i-lucide-plus"
                class="w-3 h-3 mr-1"
              />
              Add Tag
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <UCard
        :ui="{
          background: 'bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40',
          ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
              Total Bookings
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-slate-200 mb-1">
              {{ customer.bookings.total }}
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
              <UBadge
                color="green"
                variant="subtle"
                size="xs"
              >
                {{ customer.bookings.completed }} completed
              </UBadge>
              <UBadge
                v-if="customer.bookings.upcoming > 0"
                color="blue"
                variant="subtle"
                size="xs"
              >
                {{ customer.bookings.upcoming }} upcoming
              </UBadge>
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-calendar"
              class="w-7 h-7 text-blue-500"
            />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40',
          ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
              Total Spent
            </div>
            <div class="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent mb-1">
              {{ formatCurrency(customer.totalSpent) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400">
              Lifetime value
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-dollar-sign"
              class="w-7 h-7 text-amber-500"
            />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40',
          ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
              Average Order
            </div>
            <div class="text-4xl font-bold text-gray-900 dark:text-slate-200 mb-1">
              {{ formatCurrency(customer.averageOrder) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400">
              Per booking
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-bar-chart-3"
              class="w-7 h-7 text-green-500"
            />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-800/40',
          ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-2">
              Last Booking
            </div>
            <div class="text-2xl font-semibold text-gray-900 dark:text-slate-200 mb-1">
              {{ formatRelativeDate(customer.lastBooking) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-slate-400">
              {{ customer.lastBooking ? formatDate(customer.lastBooking) : 'No bookings yet' }}
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-clock"
              class="w-7 h-7 text-purple-500"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Tabs Section -->
    <UTabs
      v-model="activeTab"
      :items="tabs"
      :ui="{
        wrapper: 'space-y-6',
        list: {
          background: 'bg-gray-100 dark:bg-slate-800/40',
          rounded: 'rounded-xl',
          padding: 'p-2',
          marker: {
            background: 'bg-amber-500'
          },
          tab: {
            base: 'relative inline-flex items-center justify-center flex-shrink-0 font-medium rounded-lg transition-all',
            active: 'text-white dark:text-slate-50',
            inactive: 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-300'
          }
        }
      }"
    >
      <!-- Booking History Tab -->
      <template #bookings>
        <UCard
          :ui="{
            background: 'bg-white dark:bg-slate-800/40',
            ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-0' }
          }"
        >
          <!-- Loading State -->
          <div
            v-if="bookingsLoading"
            class="flex items-center justify-center py-16"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 text-amber-500 animate-spin"
            />
          </div>

          <!-- Empty State -->
          <div
            v-else-if="customerBookings.length === 0"
            class="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <UIcon
              name="i-lucide-calendar-x"
              class="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4"
            />
            <h3 class="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
              No Bookings Yet
            </h3>
            <p class="text-sm text-gray-500 dark:text-slate-500 mb-6 max-w-sm">
              This customer hasn't made any bookings yet. Create a new booking to get started.
            </p>
            <UButton
              color="primary"
              icon="i-lucide-calendar-plus"
              @click="quickBook"
            >
              Create First Booking
            </UButton>
          </div>

          <!-- Bookings List -->
          <div
            v-else
            class="divide-y divide-gray-200 dark:divide-slate-700/30"
          >
            <div
              v-for="booking in customerBookings"
              :key="booking.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors"
            >
              <div class="flex items-start justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-200">
                      {{ booking.item.name }}
                    </h3>
                    <UBadge
                      :color="getBookingStatusColor(booking.status)"
                      variant="subtle"
                    >
                      {{ formatBookingStatus(booking.status) }}
                    </UBadge>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <div class="flex items-center gap-2">
                      <UIcon
                        name="i-lucide-calendar"
                        class="w-4 h-4"
                      />
                      <span>{{ formatDate(booking.dates.start) }} - {{ formatDate(booking.dates.end) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon
                        name="i-lucide-map-pin"
                        class="w-4 h-4"
                      />
                      <span>{{ booking.deliveryAddress.city }}, {{ booking.deliveryAddress.state }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon
                        name="i-lucide-receipt"
                        class="w-4 h-4"
                      />
                      <span>{{ booking.bookingNumber }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <UIcon
                        :name="booking.paymentStatus === 'paid' ? 'i-lucide-check-circle' : 'i-lucide-circle-dashed'"
                        class="w-4 h-4"
                      />
                      <span>{{ formatPaymentStatus(booking.paymentStatus) }}</span>
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-2xl font-bold text-amber-400 mb-2">
                    {{ formatCurrency(booking.payment.total) }}
                  </div>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :ui="{ rounded: 'rounded-lg' }"
                    @click="navigateTo(`/app/bookings/${booking.id}`)"
                  >
                    View Details
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </template>

      <!-- Notes Tab -->
      <template #notes>
        <div class="space-y-6">
          <!-- Add Note Form -->
          <UCard
            :ui="{
              background: 'bg-white dark:bg-slate-800/40',
              ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
              rounded: 'rounded-xl',
              body: { padding: 'p-6' }
            }"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-200 mb-4">
              Add New Note
            </h3>
            <div class="flex gap-3">
              <UTextarea
                v-model="newNote"
                placeholder="Write a note about this customer..."
                :rows="3"
                :ui="{
                  base: 'bg-gray-50 dark:bg-slate-800/60 border-gray-300 dark:border-slate-700/50 focus:border-amber-500 dark:focus:border-amber-500/50 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
                class="flex-1"
              />
              <UButton
                color="primary"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
                :disabled="!newNote.trim()"
                @click="handleAddNote"
              >
                <UIcon
                  name="i-lucide-plus"
                  class="w-5 h-5 mr-2"
                />
                Add Note
              </UButton>
            </div>
          </UCard>

          <!-- Empty State -->
          <div
            v-if="!customer.notes || customer.notes.length === 0"
            class="flex flex-col items-center justify-center py-12 px-6 text-center"
          >
            <UIcon
              name="i-lucide-sticky-note"
              class="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4"
            />
            <h3 class="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
              No Notes Yet
            </h3>
            <p class="text-sm text-gray-500 dark:text-slate-500 max-w-sm">
              Add notes to keep track of important information about this customer.
            </p>
          </div>

          <!-- Notes List -->
          <div
            v-else
            class="space-y-3"
          >
            <UCard
              v-for="note in customer.notes"
              :key="note.id"
              :ui="{
                background: 'bg-white dark:bg-slate-800/40',
                ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
                rounded: 'rounded-xl',
                body: { padding: 'p-5' }
              }"
            >
              <p class="text-gray-700 dark:text-slate-300 mb-3 leading-relaxed">
                {{ note.content }}
              </p>
              <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-500">
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-user"
                    class="w-4 h-4"
                  />
                  <span>{{ note.createdBy }}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-lucide-clock"
                    class="w-4 h-4"
                  />
                  <span>{{ formatRelativeDate(note.createdAt) }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </template>

      <!-- Activity Timeline Tab -->
      <template #activity>
        <!-- Empty State -->
        <div
          v-if="activityTimeline.length === 0"
          class="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
          <UIcon
            name="i-lucide-activity"
            class="w-16 h-16 text-gray-400 dark:text-slate-600 mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">
            No Activity Yet
          </h3>
          <p class="text-sm text-gray-500 dark:text-slate-500 max-w-sm">
            Customer activity will appear here once they make bookings or you add notes.
          </p>
        </div>

        <!-- Activity List -->
        <div
          v-else
          class="space-y-4"
        >
          <div
            v-for="(activity, index) in activityTimeline"
            :key="activity.id"
            class="flex gap-4"
          >
            <!-- Timeline Line -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900',
                  activity.type === 'booking' ? 'bg-blue-500' : '',
                  activity.type === 'payment' ? 'bg-green-500' : '',
                  activity.type === 'note' ? 'bg-purple-500' : '',
                  activity.type === 'tag' ? 'bg-amber-500' : ''
                ]"
              >
                <UIcon
                  :name="
                    activity.type === 'booking' ? 'i-lucide-calendar'
                    : activity.type === 'payment' ? 'i-lucide-dollar-sign'
                      : activity.type === 'note' ? 'i-lucide-file-text'
                        : 'i-lucide-tag'
                  "
                  class="w-5 h-5 text-white"
                />
              </div>
              <div
                v-if="index < activityTimeline.length - 1"
                class="w-0.5 h-full bg-gray-200 dark:bg-slate-700/50 mt-2"
              />
            </div>

            <!-- Activity Content -->
            <UCard
              :ui="{
                background: 'bg-white dark:bg-slate-800/40',
                ring: 'ring-1 ring-gray-200 dark:ring-slate-700/50',
                rounded: 'rounded-xl',
                body: { padding: 'p-5' }
              }"
              class="flex-1 mb-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-slate-200 mb-1">
                    {{ activity.description }}
                  </h4>
                  <div class="text-xs text-gray-500 dark:text-slate-500">
                    {{ formatRelativeDate(activity.timestamp) }}
                  </div>
                </div>
                <UBadge
                  :color="
                    activity.type === 'booking' ? 'primary'
                    : activity.type === 'payment' ? 'success'
                      : activity.type === 'note' ? 'secondary'
                        : 'warning'
                  "
                  variant="subtle"
                  size="xs"
                >
                  {{ activity.type }}
                </UBadge>
              </div>
            </UCard>
          </div>
        </div>
      </template>
    </UTabs>

    <!-- Add Tag Modal -->
    <UModal
      v-model:open="showAddTag"
      title="Add Tag"
    >
      <template #content>
        <div class="p-6">
          <div class="flex flex-wrap gap-2 mb-6">
            <UButton
              v-for="tag in availableTags.filter((t: string) => !customer?.tags.includes(t))"
              :key="tag"
              color="neutral"
              variant="outline"
              size="sm"
              :ui="{ rounded: 'rounded-full' }"
              @click="handleAddTag(tag)"
            >
              {{ tag }}
            </UButton>
            <p
              v-if="availableTags.filter((t: string) => !customer?.tags.includes(t)).length === 0"
              class="text-slate-400 text-sm"
            >
              All available tags have been added.
            </p>
          </div>

          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="showAddTag = false"
            >
              Close
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>

  <!-- Loading State -->
  <div
    v-else
    class="flex items-center justify-center py-16"
  >
    <UIcon
      name="i-lucide-loader-2"
      class="w-8 h-8 text-amber-500 animate-spin"
    />
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'
import type { Booking } from '~/composables/useBookings'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const toast = useToast()
const { fetchCustomer, updateCustomer, addTag, removeTag: removeTagFromCustomer, addNote, getAllTags } = useCustomers()
const { fetchCustomerBookings } = useBookings()

const customer = ref<Customer | null>(null)
const customerBookings = ref<Booking[]>([])
const bookingsLoading = ref(false)
const editMode = ref(false)
const activeTab = ref(0)
const newNote = ref('')
const showAddTag = ref(false)

const editForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const tabs = [
  {
    label: 'Booking History',
    icon: 'i-lucide-calendar',
    slot: 'bookings'
  },
  {
    label: 'Notes',
    icon: 'i-lucide-file-text',
    slot: 'notes'
  },
  {
    label: 'Activity Timeline',
    icon: 'i-lucide-clock',
    slot: 'activity'
  }
]

const availableTags = computed(() => getAllTags())

const initials = computed(() => {
  if (!customer.value) return ''
  return `${customer.value.firstName.charAt(0)}${customer.value.lastName.charAt(0)}`.toUpperCase()
})

// Generate activity timeline from bookings and notes
const activityTimeline = computed(() => {
  if (!customer.value) return []

  const activities: Array<{
    id: string
    type: 'booking' | 'payment' | 'note' | 'tag'
    description: string
    timestamp: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any
  }> = []

  // Add booking activities
  customerBookings.value.forEach((booking) => {
    activities.push({
      id: `booking-${booking.id}`,
      type: 'booking',
      description: `Booked ${booking.item.name} for ${formatDate(booking.dates.start)}`,
      timestamp: booking.createdAt,
      metadata: { bookingId: booking.id, status: booking.status }
    })

    // Add payment activity if paid
    if (booking.paymentStatus === 'paid') {
      activities.push({
        id: `payment-${booking.id}`,
        type: 'payment',
        description: `Payment received for ${booking.bookingNumber} - ${formatCurrency(booking.payment.total)}`,
        timestamp: booking.updatedAt,
        metadata: { bookingId: booking.id, amount: booking.payment.total }
      })
    }
  })

  // Add note activities
  customer.value.notes.forEach((note) => {
    activities.push({
      id: `note-${note.id}`,
      type: 'note',
      description: `Note added: ${note.content.substring(0, 60)}${note.content.length > 60 ? '...' : ''}`,
      timestamp: note.createdAt,
      metadata: { noteId: note.id }
    })
  })

  // Sort by timestamp descending (newest first)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Load customer and bookings on mount
onMounted(async () => {
  const customerId = route.params.id as string
  customer.value = await fetchCustomer(customerId)

  // Fetch customer's booking history
  bookingsLoading.value = true
  const result = await fetchCustomerBookings(customerId)
  if (result.success && result.data) {
    customerBookings.value = result.data

    // Update customer booking stats from real data
    if (customer.value) {
      customer.value.bookings.total = customerBookings.value.length
      customer.value.bookings.upcoming = customerBookings.value.filter(b =>
        b.status === 'confirmed' || b.status === 'pending'
      ).length
      customer.value.bookings.completed = customerBookings.value.filter(b =>
        b.status === 'completed'
      ).length
      customer.value.bookings.cancelled = customerBookings.value.filter(b =>
        b.status === 'cancelled'
      ).length

      // Calculate total spent from completed bookings
      customer.value.totalSpent = customerBookings.value
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.payment.total, 0)

      // Calculate average order value
      customer.value.averageOrder = customer.value.bookings.completed > 0
        ? customer.value.totalSpent / customer.value.bookings.completed
        : 0

      // Get last booking date
      if (customerBookings.value.length > 0) {
        const sortedBookings = [...customerBookings.value].sort((a, b) =>
          new Date(b.dates.start).getTime() - new Date(a.dates.start).getTime()
        )
        if (sortedBookings[0]?.dates?.start) {
          customer.value.lastBooking = sortedBookings[0].dates.start
        }
      }
    }
  }
  bookingsLoading.value = false
})

function _startEdit() {
  if (customer.value) {
    editForm.firstName = customer.value.firstName
    editForm.lastName = customer.value.lastName
    editForm.email = customer.value.email
    editForm.phone = customer.value.phone
    editMode.value = true
  }
}

async function saveEdit() {
  if (customer.value) {
    try {
      const updated = await updateCustomer(customer.value.id, editForm)
      customer.value = { ...customer.value, ...updated }
      editMode.value = false
      toast.add({
        title: 'Customer Updated',
        description: 'Customer information has been saved',
        color: 'success'
      })
    } catch (err) {
      const error = err as { data?: { message?: string } }
      console.error('Failed to update customer:', error)
      toast.add({
        title: 'Update Failed',
        description: error.data?.message || 'Failed to update customer',
        color: 'error'
      })
    }
  }
}

function cancelEdit() {
  editMode.value = false
}

async function handleAddNote() {
  if (customer.value && newNote.value.trim()) {
    try {
      await addNote(customer.value.id, newNote.value)
      // Refresh customer data
      customer.value = await fetchCustomer(customer.value.id)
      newNote.value = ''
      toast.add({
        title: 'Note Added',
        description: 'Note has been added to the customer',
        color: 'success'
      })
    } catch (err) {
      const error = err as { data?: { message?: string } }
      console.error('Failed to add note:', error)
      toast.add({
        title: 'Failed to Add Note',
        description: error.data?.message || 'Could not add note',
        color: 'error'
      })
    }
  }
}

async function handleAddTag(tag: string) {
  if (customer.value) {
    try {
      await addTag(customer.value.id, tag)
      // Refresh customer data
      customer.value = await fetchCustomer(customer.value.id)
      showAddTag.value = false
      toast.add({
        title: 'Tag Added',
        description: `"${tag}" tag has been added`,
        color: 'success'
      })
    } catch (err) {
      const error = err as { data?: { message?: string } }
      console.error('Failed to add tag:', error)
      toast.add({
        title: 'Failed to Add Tag',
        description: error.data?.message || 'Could not add tag',
        color: 'error'
      })
    }
  }
}

async function removeTag(tag: string) {
  if (customer.value) {
    try {
      await removeTagFromCustomer(customer.value.id, tag)
      // Refresh customer data
      customer.value = await fetchCustomer(customer.value.id)
      toast.add({
        title: 'Tag Removed',
        description: `"${tag}" tag has been removed`,
        color: 'success'
      })
    } catch (err) {
      const error = err as { data?: { message?: string } }
      console.error('Failed to remove tag:', error)
      toast.add({
        title: 'Failed to Remove Tag',
        description: error.data?.message || 'Could not remove tag',
        color: 'error'
      })
    }
  }
}

function quickBook() {
  if (customer.value) {
    navigateTo({
      path: '/app/bookings/new',
      query: {
        customerId: customer.value.id,
        customerName: `${customer.value.firstName} ${customer.value.lastName}`,
        customerEmail: customer.value.email,
        customerPhone: customer.value.phone
      }
    })
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
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

function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    delivered: 'primary',
    completed: 'neutral',
    cancelled: 'error'
  }
  return colors[status] || 'neutral'
}

function formatBookingStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statusMap[status] || status
}

function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    unpaid: 'Unpaid',
    deposit: 'Deposit Paid',
    paid: 'Paid in Full',
    refunded: 'Refunded'
  }
  return statusMap[status] || status
}
</script>
