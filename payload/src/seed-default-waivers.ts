/**
 * Seed default waiver templates for existing tenants
 * Run with: pnpm seed:waivers
 */
import { getPayload } from 'payload'
import config from './payload.config'

const defaultWaiverContent = {
  root: {
    type: 'root',
    children: [
      {
        type: 'heading',
        tag: 'h1',
        children: [{ type: 'text', text: 'EQUIPMENT RENTAL AGREEMENT & LIABILITY WAIVER' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'This Agreement is entered into between {{tenantName}} ("Company") and {{customerName}} ("Renter") on {{bookingDate}}.' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '1. RENTAL DETAILS' }],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Equipment: {{itemName}}', format: ['bold'] },
          { type: 'linebreak' },
          { type: 'text', text: 'Rental Period: {{startDate}} to {{endDate}}' },
          { type: 'linebreak' },
          { type: 'text', text: 'Delivery Address: {{deliveryAddress}}' },
          { type: 'linebreak' },
          { type: 'text', text: 'Total Amount: {{totalAmount}}' },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '2. ASSUMPTION OF RISK & RELEASE OF LIABILITY' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'I, {{customerName}}, acknowledge that the use of inflatable equipment and party rental items involves inherent risks, including but not limited to: physical injury, falls, collisions with other users, equipment malfunction, and other hazards.' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'I VOLUNTARILY ASSUME ALL RISKS associated with the use of the rented equipment. I hereby RELEASE, WAIVE, AND DISCHARGE {{tenantName}}, its owners, employees, agents, and representatives from any and all liability, claims, demands, and causes of action arising from any injury, loss, or damage to myself, my family members, guests, or property that may occur during the rental period.' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '3. SAFETY RULES & GUIDELINES' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'The Renter agrees to enforce the following safety rules at all times:' }],
      },
      {
        type: 'list',
        listType: 'bullet',
        children: [
          { type: 'listitem', children: [{ type: 'text', text: 'Adult supervision is REQUIRED at all times when equipment is in use' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Remove shoes, eyeglasses, jewelry, and sharp objects before use' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'No food, drinks, gum, silly string, or water near equipment' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'No flips, wrestling, rough play, or climbing on walls' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Separate users by age and size groups' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Do not exceed maximum capacity as specified' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Do not use in high winds (15+ mph), rain, or severe weather' }] },
          { type: 'listitem', children: [{ type: 'text', text: 'Keep blower running at all times during use' }] },
        ],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '4. DAMAGE & RESPONSIBILITY' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'The Renter is responsible for the equipment from delivery until pickup. The Renter agrees to pay for any damage, excessive cleaning, or loss of equipment caused by misuse, negligence, or failure to follow safety guidelines. A damage assessment will be conducted upon pickup.' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '5. WEATHER & CANCELLATION POLICY' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '{{cancellationPolicy}}' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'In the event of severe weather (winds over 15 mph, lightning, heavy rain), the equipment must be deflated immediately. The Company reserves the right to remove equipment if weather conditions become unsafe.' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '6. INDEMNIFICATION' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'The Renter agrees to indemnify, defend, and hold harmless {{tenantName}} from any claims, lawsuits, judgments, costs, or expenses (including attorney fees) arising from the use of the rented equipment, the Renter\'s negligence, or any breach of this Agreement.' }],
      },
      {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: '7. AGREEMENT' }],
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'By signing below, I acknowledge that I have read, understand, and agree to all terms and conditions of this Agreement. I confirm that I am at least 18 years of age and legally authorized to enter into this Agreement.' }],
      },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Renter Signature: _________________________' },
          { type: 'linebreak' },
          { type: 'text', text: 'Printed Name: {{customerName}}' },
          { type: 'linebreak' },
          { type: 'text', text: 'Date: {{signatureDate}}' },
          { type: 'linebreak' },
          { type: 'text', text: 'Phone: {{customerPhone}}' },
          { type: 'linebreak' },
          { type: 'text', text: 'Email: {{customerEmail}}' },
        ],
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}

async function seedDefaultWaivers() {
  console.log('Starting default waiver template seeding...')

  const payload = await getPayload({ config })

  // Get all tenants
  const tenantsResult = await payload.find({
    collection: 'tenants',
    limit: 100,
  })

  console.log(`Found ${tenantsResult.docs.length} tenants`)

  for (const tenant of tenantsResult.docs) {
    // Check if tenant already has a waiver template
    const existingTemplates = await payload.find({
      collection: 'contract-templates',
      where: {
        tenantId: { equals: tenant.id },
        templateType: { equals: 'waiver' },
      },
      limit: 1,
    })

    if (existingTemplates.docs.length > 0) {
      console.log(`Tenant "${tenant.name}" already has a waiver template, skipping...`)
      continue
    }

    // Create default waiver template
    console.log(`Creating default waiver template for tenant "${tenant.name}"...`)

    try {
      await payload.create({
        collection: 'contract-templates',
        data: {
          tenantId: tenant.id,
          name: 'Equipment Rental Waiver & Agreement',
          templateType: 'waiver',
          description: 'Standard liability waiver and rental agreement for equipment rentals. Covers safety rules, liability release, and rental terms.',
          isDefault: false,
          requiresSignature: true,
          isActive: true,
          content: defaultWaiverContent,
        },
      })

      console.log(`Created default waiver template for tenant "${tenant.name}"`)
    } catch (error) {
      console.error(`Error creating template for tenant "${tenant.name}":`, error)
    }
  }

  console.log('Default waiver template seeding complete!')
  process.exit(0)
}

seedDefaultWaivers().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
