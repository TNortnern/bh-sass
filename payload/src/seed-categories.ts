import type { Payload } from 'payload'

/**
 * Default categories for a new tenant
 */
const defaultCategories = [
  {
    name: 'Bounce Houses',
    description: 'Classic inflatable bounce houses for all ages',
    icon: 'i-lucide-castle',
    sortOrder: 0,
    isActive: true,
  },
  {
    name: 'Water Slides',
    description: 'Inflatable water slides for summer fun',
    icon: 'i-lucide-waves',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Combo Units',
    description: 'Bounce houses with slides and other features',
    icon: 'i-lucide-combine',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Obstacle Courses',
    description: 'Interactive inflatable obstacle courses',
    icon: 'i-lucide-route',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Interactive Games',
    description: 'Inflatable sports and interactive games',
    icon: 'i-lucide-gamepad-2',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Party Extras',
    description: 'Tables, chairs, tents, and other party rentals',
    icon: 'i-lucide-party-popper',
    sortOrder: 5,
    isActive: true,
  },
]

/**
 * Seed default categories for a tenant
 * @param payload - Payload instance
 * @param tenantId - Tenant ID to create categories for
 */
export async function seedCategories(payload: Payload, tenantId: string | number) {
  console.log(`Seeding categories for tenant ${tenantId}...`)

  try {
    // Check if categories already exist
    const existing = await payload.find({
      collection: 'categories',
      where: {
        tenantId: {
          equals: tenantId,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Categories already exist for tenant ${tenantId}, skipping seed`)
      return
    }

    // Create categories
    for (const category of defaultCategories) {
      await payload.create({
        collection: 'categories',
        data: {
          ...category,
          tenantId,
        },
      })
      console.log(`Created category: ${category.name}`)
    }

    console.log(`Successfully seeded ${defaultCategories.length} categories for tenant ${tenantId}`)
  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  }
}

/**
 * Seed categories for all tenants that don't have them
 */
export async function seedCategoriesForAllTenants(payload: Payload) {
  console.log('Seeding categories for all tenants...')

  try {
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 1000,
    })

    for (const tenant of tenants.docs) {
      await seedCategories(payload, tenant.id)
    }

    console.log('Successfully seeded categories for all tenants')
  } catch (error) {
    console.error('Error seeding categories for all tenants:', error)
    throw error
  }
}
