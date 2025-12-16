import type { Payload } from 'payload'
import { defaultTemplates } from './default-templates'

/**
 * Seed default contract templates
 * This should be called during initial database setup
 */
export async function seedContractTemplates(payload: Payload) {
  console.log('🌱 Seeding contract templates...')

  try {
    // Check if templates already exist
    const existingTemplates = await payload.find({
      collection: 'contract-templates',
      where: {
        isDefault: {
          equals: true,
        },
      },
    })

    if (existingTemplates.docs.length > 0) {
      console.log(
        `✓ Found ${existingTemplates.docs.length} existing default templates, skipping seed`,
      )
      return
    }

    // Create each default template
    for (const template of defaultTemplates) {
      try {
        await payload.create({
          collection: 'contract-templates',
          data: template as any,
        })
        console.log(`  ✓ Created template: ${template.name}`)
      } catch (error) {
        console.error(`  ✗ Failed to create template: ${template.name}`, error)
      }
    }

    console.log(`✓ Successfully seeded ${defaultTemplates.length} contract templates`)
  } catch (error) {
    console.error('Error seeding contract templates:', error)
    throw error
  }
}

/**
 * Seed templates for a specific tenant
 * Creates tenant-specific versions of default templates
 */
export async function seedTenantTemplates(payload: Payload, tenantId: string) {
  console.log(`🌱 Seeding templates for tenant ${tenantId}...`)

  try {
    // Get default templates
    const defaultTemplates = await payload.find({
      collection: 'contract-templates',
      where: {
        isDefault: {
          equals: true,
        },
      },
    })

    if (defaultTemplates.docs.length === 0) {
      console.log('  ! No default templates found, run seedContractTemplates first')
      return
    }

    // Check if tenant already has templates
    const existingTenantTemplates = await payload.find({
      collection: 'contract-templates',
      where: {
        tenantId: {
          equals: tenantId,
        },
      },
    })

    if (existingTenantTemplates.docs.length > 0) {
      console.log(
        `  ✓ Tenant already has ${existingTenantTemplates.docs.length} templates, skipping`,
      )
      return
    }

    // Create tenant-specific copies of default templates
    let created = 0
    for (const template of defaultTemplates.docs) {
      try {
        await payload.create({
          collection: 'contract-templates',
          data: {
            tenantId,
            name: template.name,
            templateType: template.templateType,
            description: template.description,
            content: template.content,
            requiresSignature: template.requiresSignature,
            isActive: template.isActive,
            isDefault: false, // Tenant copies are NOT defaults
          } as any,  // Payload 3.x type workaround
        })
        created++
      } catch (error) {
        console.error(`  ✗ Failed to create tenant template: ${template.name}`, error)
      }
    }

    console.log(`  ✓ Created ${created} tenant-specific templates`)
  } catch (error) {
    console.error('Error seeding tenant templates:', error)
    throw error
  }
}
