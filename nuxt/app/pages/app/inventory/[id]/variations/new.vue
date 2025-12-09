<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const itemId = computed(() => route.params.id as string)

// Fetch rental item details
const { data: item, pending: itemPending } = await useLazyFetch(
  `/api/rental-items/${itemId.value}`
)

// Form state
const form = reactive({
  name: '',
  sku: '',
  attributes: [] as Array<{ name: string, value: string }>,
  pricingType: 'same_as_parent' as 'same_as_parent' | 'adjustment' | 'override',
  priceAdjustment: 0,
  overridePrice: {
    hourlyRate: undefined as number | undefined,
    dailyRate: undefined as number | undefined,
    weekendRate: undefined as number | undefined,
    weeklyRate: undefined as number | undefined
  },
  quantity: 1,
  trackInventory: true,
  images: [] as Array<{ url: string, alt?: string }>,
  status: 'active' as 'active' | 'inactive'
})

// Pricing type options
const pricingTypeItems = [
  { label: 'Same as Parent', value: 'same_as_parent' },
  { label: 'Price Adjustment', value: 'adjustment' },
  { label: 'Override Price', value: 'override' }
]

const statusItems = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

// Auto-generate name from attributes
watchEffect(() => {
  if (form.attributes.length > 0) {
    form.name = form.attributes.map(a => a.value).join(' ')
  }
})

// Submit
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true

  try {
    await $fetch(`/api/rental-items/${itemId.value}/variations`, {
      method: 'POST',
      body: {
        ...form,
        rentalItemId: itemId.value
      }
    })

    router.push(`/app/inventory/${itemId.value}/variations`)
  } catch (err) {
    console.error('Failed to create variation:', err)
  } finally {
    submitting.value = false
  }
}

// Add attribute row
function addAttribute() {
  form.attributes.push({ name: '', value: '' })
}

function removeAttribute(index: number) {
  form.attributes.splice(index, 1)
}

// Add image row
function addImage() {
  form.images.push({ url: '', alt: '' })
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="`${item?.name || 'Item'} - New Variation`">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="router.push(`/app/inventory/${itemId}/variations`)"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6 max-w-3xl">
        <!-- Loading state -->
        <div
          v-if="itemPending"
          class="flex items-center justify-center py-12"
        >
          <UIcon
            name="i-lucide-loader-circle"
            class="animate-spin text-4xl text-gray-400"
          />
        </div>

        <!-- Form -->
        <form
          v-else
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">
              Basic Information
            </h3>

            <UFormField
              label="SKU"
              required
            >
              <UInput
                v-model="form.sku"
                placeholder="e.g., BH-001-LG-BL"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Name"
              required
              help="Auto-generated from attributes"
            >
              <UInput
                v-model="form.name"
                placeholder="e.g., Large Blue"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Attributes -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                Variation Attributes
              </h3>
              <UButton
                icon="i-lucide-plus"
                label="Add Attribute"
                size="xs"
                variant="outline"
                @click="addAttribute"
              />
            </div>

            <div
              v-if="form.attributes.length === 0"
              class="text-sm text-gray-500 italic"
            >
              No attributes defined. Click "Add Attribute" to create one.
            </div>

            <div
              v-for="(attr, index) in form.attributes"
              :key="index"
              class="grid grid-cols-[1fr_1fr_auto] gap-4"
            >
              <UFormField
                label="Attribute Name"
                required
              >
                <UInput
                  v-model="attr.name"
                  placeholder="e.g., Size, Color, Theme"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Value"
                required
              >
                <UInput
                  v-model="attr.value"
                  placeholder="e.g., Large, Blue"
                  class="w-full"
                />
              </UFormField>
              <div class="flex items-end">
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  @click="removeAttribute(index)"
                />
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">
              Pricing
            </h3>

            <UFormField
              label="Pricing Type"
              required
            >
              <USelect
                v-model="form.pricingType"
                :items="pricingTypeItems"
              />
            </UFormField>

            <!-- Price Adjustment -->
            <UFormField
              v-if="form.pricingType === 'adjustment'"
              label="Price Adjustment"
              help="Positive for increase, negative for discount"
            >
              <UInput
                v-model.number="form.priceAdjustment"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full"
              />
            </UFormField>

            <!-- Override Prices -->
            <div
              v-if="form.pricingType === 'override'"
              class="space-y-4"
            >
              <UFormField label="Hourly Rate">
                <UInput
                  v-model.number="form.overridePrice.hourlyRate"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Daily Rate">
                <UInput
                  v-model.number="form.overridePrice.dailyRate"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Weekend Rate">
                <UInput
                  v-model.number="form.overridePrice.weekendRate"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Weekly Rate">
                <UInput
                  v-model.number="form.overridePrice.weeklyRate"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>

          <!-- Inventory -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">
              Inventory
            </h3>

            <UFormField
              label="Quantity"
              required
            >
              <UInput
                v-model.number="form.quantity"
                type="number"
                min="1"
                placeholder="1"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Track Inventory">
              <div class="flex items-center gap-2">
                <input
                  v-model="form.trackInventory"
                  type="checkbox"
                >
                <span class="text-sm text-gray-500">Track availability for this variation separately</span>
              </div>
            </UFormField>
          </div>

          <!-- Images (Optional) -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                Images (Optional)
              </h3>
              <UButton
                icon="i-lucide-plus"
                label="Add Image"
                size="xs"
                variant="outline"
                @click="addImage"
              />
            </div>

            <p class="text-sm text-gray-500">
              If not specified, parent item images will be used.
            </p>

            <div
              v-for="(img, index) in form.images"
              :key="index"
              class="grid grid-cols-[1fr_1fr_auto] gap-4"
            >
              <UFormField
                label="Image URL"
                required
              >
                <UInput
                  v-model="img.url"
                  placeholder="https://..."
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Alt Text">
                <UInput
                  v-model="img.alt"
                  placeholder="Description"
                  class="w-full"
                />
              </UFormField>
              <div class="flex items-end">
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  @click="removeImage(index)"
                />
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">
              Status
            </h3>

            <UFormField label="Status">
              <USelect
                v-model="form.status"
                :items="statusItems"
              />
            </UFormField>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-4 border-t">
            <UButton
              label="Cancel"
              variant="ghost"
              @click="router.push(`/app/inventory/${itemId}/variations`)"
            />
            <UButton
              type="submit"
              label="Create Variation"
              :loading="submitting"
              :disabled="!form.sku || !form.name || form.attributes.length === 0"
            />
          </div>
        </form>
      </div>
    </template>
  </UDashboardPanel>
</template>
