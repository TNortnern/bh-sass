<template>
  <div v-if="customer" class="customer-detail-page">
    <!-- Back Button -->
    <div class="mb-6">
      <UButton
        color="gray"
        variant="ghost"
        size="md"
        :ui="{ rounded: 'rounded-lg' }"
        @click="navigateTo('/app/customers')"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
        Back to Customers
      </UButton>
    </div>

    <!-- Customer Header -->
    <UCard
      :ui="{
        background: 'bg-gradient-to-br from-slate-800/90 to-slate-900/90',
        ring: 'ring-1 ring-slate-700/50',
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
            class="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center ring-4 ring-slate-900 shadow-lg"
          >
            <Icon name="heroicons:star-solid" class="w-5 h-5 text-white" />
          </div>
        </div>

        <!-- Info Section -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="min-w-0 flex-1">
              <h1 class="text-4xl font-bold text-slate-50 mb-3 tracking-tight">
                {{ editMode ? '' : `${customer.firstName} ${customer.lastName}` }}
              </h1>

              <!-- Edit Mode -->
              <div v-if="editMode" class="grid grid-cols-2 gap-3 mb-4">
                <UInput
                  v-model="editForm.firstName"
                  placeholder="First name"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200',
                    rounded: 'rounded-lg'
                  }"
                />
                <UInput
                  v-model="editForm.lastName"
                  placeholder="Last name"
                  size="lg"
                  :ui="{
                    base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200',
                    rounded: 'rounded-lg'
                  }"
                />
              </div>

              <!-- Contact Info -->
              <div class="space-y-2 mb-4">
                <div v-if="editMode" class="space-y-2">
                  <UInput
                    v-model="editForm.email"
                    type="email"
                    placeholder="Email"
                    size="md"
                    :ui="{
                      base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200',
                      rounded: 'rounded-lg'
                    }"
                  >
                    <template #leading>
                      <Icon name="heroicons:envelope" class="w-4 h-4 text-slate-500" />
                    </template>
                  </UInput>
                  <UInput
                    v-model="editForm.phone"
                    type="tel"
                    placeholder="Phone"
                    size="md"
                    :ui="{
                      base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200',
                      rounded: 'rounded-lg'
                    }"
                  >
                    <template #leading>
                      <Icon name="heroicons:phone" class="w-4 h-4 text-slate-500" />
                    </template>
                  </UInput>
                </div>

                <template v-else>
                  <a
                    :href="`mailto:${customer.email}`"
                    class="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group"
                  >
                    <Icon name="heroicons:envelope" class="w-5 h-5" />
                    <span class="text-lg group-hover:underline">{{ customer.email }}</span>
                  </a>
                  <a
                    :href="`tel:${customer.phone}`"
                    class="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group"
                  >
                    <Icon name="heroicons:phone" class="w-5 h-5" />
                    <span class="text-lg group-hover:underline">{{ customer.phone }}</span>
                  </a>
                  <div
                    v-if="customer.address && customer.address.street"
                    class="flex items-start gap-3 text-slate-300"
                  >
                    <Icon name="heroicons:map-pin" class="w-5 h-5 mt-1" />
                    <div>
                      <div>{{ customer.address.street }}</div>
                      <div>{{ customer.address.city }}, {{ customer.address.state }} {{ customer.address.zip }}</div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Member Since -->
              <div class="text-sm text-slate-500">
                Member since {{ formatDate(customer.createdAt) }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <template v-if="editMode">
                <UButton
                  color="amber"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="saveEdit"
                >
                  <Icon name="heroicons:check" class="w-5 h-5 mr-2" />
                  Save
                </UButton>
                <UButton
                  color="gray"
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
                  color="gray"
                  variant="outline"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="startEdit"
                >
                  <Icon name="heroicons:pencil" class="w-5 h-5 mr-2" />
                  Edit
                </UButton>
                <UButton
                  color="amber"
                  size="md"
                  :ui="{ rounded: 'rounded-lg' }"
                  @click="quickBook"
                >
                  <Icon name="heroicons:calendar-plus" class="w-5 h-5 mr-2" />
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
                <Icon name="heroicons:x-mark" class="w-3 h-3" />
              </button>
            </UBadge>

            <!-- Add Tag in Edit Mode -->
            <UButton
              v-if="editMode"
              color="gray"
              variant="outline"
              size="xs"
              :ui="{ rounded: 'rounded-full' }"
              @click="showAddTag = true"
            >
              <Icon name="heroicons:plus" class="w-3 h-3 mr-1" />
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
          background: 'bg-gradient-to-br from-slate-800/60 to-slate-800/40',
          ring: 'ring-1 ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Total Bookings
            </div>
            <div class="text-4xl font-bold text-slate-200 mb-1">
              {{ customer.bookings.total }}
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <UBadge color="green" variant="subtle" size="xs">
                {{ customer.bookings.completed }} completed
              </UBadge>
              <UBadge v-if="customer.bookings.upcoming > 0" color="blue" variant="subtle" size="xs">
                {{ customer.bookings.upcoming }} upcoming
              </UBadge>
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Icon name="heroicons:calendar" class="w-7 h-7 text-blue-500" />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-slate-800/60 to-slate-800/40',
          ring: 'ring-1 ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Total Spent
            </div>
            <div class="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-1">
              {{ formatCurrency(customer.totalSpent) }}
            </div>
            <div class="text-xs text-slate-400">
              Lifetime value
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Icon name="heroicons:currency-dollar" class="w-7 h-7 text-amber-500" />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-slate-800/60 to-slate-800/40',
          ring: 'ring-1 ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Average Order
            </div>
            <div class="text-4xl font-bold text-slate-200 mb-1">
              {{ formatCurrency(customer.averageOrder) }}
            </div>
            <div class="text-xs text-slate-400">
              Per booking
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Icon name="heroicons:chart-bar" class="w-7 h-7 text-green-500" />
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-slate-800/60 to-slate-800/40',
          ring: 'ring-1 ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Last Booking
            </div>
            <div class="text-2xl font-semibold text-slate-200 mb-1">
              {{ formatRelativeDate(customer.lastBooking) }}
            </div>
            <div class="text-xs text-slate-400">
              {{ customer.lastBooking ? formatDate(customer.lastBooking) : 'No bookings yet' }}
            </div>
          </div>
          <div class="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Icon name="heroicons:clock" class="w-7 h-7 text-purple-500" />
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
          background: 'bg-slate-800/40',
          rounded: 'rounded-xl',
          padding: 'p-2',
          marker: {
            background: 'bg-amber-500'
          },
          tab: {
            base: 'relative inline-flex items-center justify-center flex-shrink-0 font-medium rounded-lg transition-all',
            active: 'text-slate-50',
            inactive: 'text-slate-400 hover:text-slate-300'
          }
        }
      }"
    >
      <!-- Booking History Tab -->
      <template #bookings>
        <UCard
          :ui="{
            background: 'bg-slate-800/40',
            ring: 'ring-1 ring-slate-700/50',
            rounded: 'rounded-xl',
            body: { padding: 'p-0' }
          }"
        >
          <div class="divide-y divide-slate-700/30">
            <div
              v-for="i in 8"
              :key="i"
              class="p-6 hover:bg-slate-700/20 transition-colors"
            >
              <div class="flex items-start justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-lg font-semibold text-slate-200">
                      {{ ['Birthday Party Package', 'Corporate Event', 'Weekend Special', 'Premium Bounce House'][Math.floor(Math.random() * 4)] }}
                    </h3>
                    <UBadge
                      :color="['green', 'blue', 'yellow', 'red'][Math.floor(Math.random() * 4)]"
                      variant="subtle"
                    >
                      {{ ['Completed', 'Upcoming', 'Pending', 'Cancelled'][Math.floor(Math.random() * 4)] }}
                    </UBadge>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div class="flex items-center gap-2">
                      <Icon name="heroicons:calendar" class="w-4 h-4" />
                      <span>{{ formatDate(new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="heroicons:map-pin" class="w-4 h-4" />
                      <span>{{ customer.address?.city || 'Austin' }}, TX</span>
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-2xl font-bold text-amber-400 mb-2">
                    ${{ (Math.random() * 400 + 100).toFixed(0) }}
                  </div>
                  <UButton
                    color="gray"
                    variant="ghost"
                    size="sm"
                    :ui="{ rounded: 'rounded-lg' }"
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
              background: 'bg-slate-800/40',
              ring: 'ring-1 ring-slate-700/50',
              rounded: 'rounded-xl',
              body: { padding: 'p-6' }
            }"
          >
            <h3 class="text-lg font-semibold text-slate-200 mb-4">Add New Note</h3>
            <div class="flex gap-3">
              <UTextarea
                v-model="newNote"
                placeholder="Write a note about this customer..."
                :rows="3"
                :ui="{
                  base: 'bg-slate-800/60 border-slate-700/50 focus:border-amber-500/50 text-slate-200 placeholder-slate-500',
                  rounded: 'rounded-xl'
                }"
                class="flex-1"
              />
              <UButton
                color="amber"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
                :disabled="!newNote.trim()"
                @click="handleAddNote"
              >
                <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
                Add Note
              </UButton>
            </div>
          </UCard>

          <!-- Notes List -->
          <div class="space-y-3">
            <UCard
              v-for="note in customer.notes"
              :key="note.id"
              :ui="{
                background: 'bg-slate-800/40',
                ring: 'ring-1 ring-slate-700/50',
                rounded: 'rounded-xl',
                body: { padding: 'p-5' }
              }"
            >
              <p class="text-slate-300 mb-3 leading-relaxed">{{ note.content }}</p>
              <div class="flex items-center gap-3 text-sm text-slate-500">
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:user" class="w-4 h-4" />
                  <span>{{ note.createdBy }}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:clock" class="w-4 h-4" />
                  <span>{{ formatRelativeDate(note.createdAt) }}</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </template>

      <!-- Activity Timeline Tab -->
      <template #activity>
        <div class="space-y-4">
          <div
            v-for="(activity, index) in customer.activities"
            :key="activity.id"
            class="flex gap-4"
          >
            <!-- Timeline Line -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-slate-900',
                  activity.type === 'booking' ? 'bg-blue-500' : '',
                  activity.type === 'payment' ? 'bg-green-500' : '',
                  activity.type === 'note' ? 'bg-purple-500' : '',
                  activity.type === 'tag' ? 'bg-amber-500' : ''
                ]"
              >
                <Icon
                  :name="
                    activity.type === 'booking' ? 'heroicons:calendar' :
                    activity.type === 'payment' ? 'heroicons:currency-dollar' :
                    activity.type === 'note' ? 'heroicons:document-text' :
                    'heroicons:tag'
                  "
                  class="w-5 h-5 text-white"
                />
              </div>
              <div
                v-if="index < customer.activities.length - 1"
                class="w-0.5 h-full bg-slate-700/50 mt-2"
              />
            </div>

            <!-- Activity Content -->
            <UCard
              :ui="{
                background: 'bg-slate-800/40',
                ring: 'ring-1 ring-slate-700/50',
                rounded: 'rounded-xl',
                body: { padding: 'p-5' }
              }"
              class="flex-1 mb-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h4 class="text-sm font-semibold text-slate-200 mb-1">
                    {{ activity.description }}
                  </h4>
                  <div class="text-xs text-slate-500">
                    {{ formatRelativeDate(activity.timestamp) }}
                  </div>
                </div>
                <UBadge
                  :color="
                    activity.type === 'booking' ? 'blue' :
                    activity.type === 'payment' ? 'green' :
                    activity.type === 'note' ? 'purple' :
                    'amber'
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
    <UModal v-model:open="showAddTag">
      <UCard
        :ui="{
          background: 'bg-slate-900',
          ring: 'ring-1 ring-slate-700/50',
          rounded: 'rounded-xl',
          body: { padding: 'p-6' }
        }"
      >
        <template #header>
          <h3 class="text-xl font-semibold text-slate-200">Add Tag</h3>
        </template>

        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="tag in availableTags.filter(t => !customer.tags.includes(t))"
              :key="tag"
              color="gray"
              variant="outline"
              size="sm"
              :ui="{ rounded: 'rounded-full' }"
              @click="handleAddTag(tag)"
            >
              {{ tag }}
            </UButton>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="ghost"
              @click="showAddTag = false"
            >
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>

  <!-- Loading State -->
  <div v-else class="flex items-center justify-center py-16">
    <Icon name="heroicons:arrow-path" class="w-8 h-8 text-amber-500 animate-spin" />
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/composables/useCustomers'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const { fetchCustomer, updateCustomer, addTag, removeTag: removeTagFromCustomer, addNote, getAllTags } = useCustomers()

const customer = ref<Customer | null>(null)
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
    icon: 'heroicons:calendar',
    slot: 'bookings'
  },
  {
    label: 'Notes',
    icon: 'heroicons:document-text',
    slot: 'notes'
  },
  {
    label: 'Activity Timeline',
    icon: 'heroicons:clock',
    slot: 'activity'
  }
]

const availableTags = computed(() => getAllTags())

const initials = computed(() => {
  if (!customer.value) return ''
  return `${customer.value.firstName.charAt(0)}${customer.value.lastName.charAt(0)}`.toUpperCase()
})

// Load customer on mount
onMounted(async () => {
  const customerId = route.params.id as string
  customer.value = await fetchCustomer(customerId)
})

function startEdit() {
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
    } catch (error) {
      console.error('Failed to update customer:', error)
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
    } catch (error) {
      console.error('Failed to add note:', error)
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
    } catch (error) {
      console.error('Failed to add tag:', error)
    }
  }
}

async function removeTag(tag: string) {
  if (customer.value) {
    try {
      await removeTagFromCustomer(customer.value.id, tag)
      // Refresh customer data
      customer.value = await fetchCustomer(customer.value.id)
    } catch (error) {
      console.error('Failed to remove tag:', error)
    }
  }
}

function quickBook() {
  // TODO: Navigate to booking page with customer pre-filled
  console.log('Quick book for customer:', customer.value?.id)
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
</script>
