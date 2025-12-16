import type { Payload } from 'payload'
import type { InvoiceData, ContractData, PackingSlipData, DocumentData } from './types'
import { generateInvoicePDF } from './invoice-template'
import { generateContractPDF } from './contract-template'
import { generatePackingSlipPDF } from './packing-slip-template'
import { getRelationshipId, getRelationshipValue } from './utils'

/**
 * Fetch complete booking data with all relationships
 */
async function fetchBookingData(payload: Payload, bookingId: string): Promise<DocumentData> {
  const booking = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 3, // Deep populate relationships
  })

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`)
  }

  // Extract relationship data
  const tenant = getRelationshipValue<any>(booking.tenantId)
  const customer = getRelationshipValue<any>(booking.customerId)

  // Get rental item - supports new rentalItems array format
  let rentalItem: any = null
  if (Array.isArray(booking.rentalItems) && booking.rentalItems.length > 0) {
    rentalItem = getRelationshipValue<any>(booking.rentalItems[0].rentalItemId)
  }

  if (!tenant || !customer || !rentalItem) {
    throw new Error('Missing required relationship data')
  }

  return {
    tenant: {
      id: String(tenant.id),
      name: tenant.name || 'N/A',
      businessInfo: {
        phone: tenant.phone || 'N/A',
        email: tenant.email || 'N/A',
        website: tenant.domain || undefined,
        address: {
          street: tenant.address?.street || 'N/A',
          city: tenant.address?.city || 'N/A',
          state: tenant.address?.state || 'N/A',
          zipCode: tenant.address?.zip || 'N/A',
        },
      },
      logo: tenant.logo
        ? {
            url: typeof tenant.logo === 'object' ? tenant.logo.url : '',
          }
        : undefined,
    },
    customer: {
      id: String(customer.id),
      firstName: customer.firstName || 'N/A',
      lastName: customer.lastName || 'N/A',
      email: customer.email || 'N/A',
      phone: customer.phone || 'N/A',
      address: {
        street: customer.address?.street || 'N/A',
        city: customer.address?.city || 'N/A',
        state: customer.address?.state || 'N/A',
        zipCode: customer.address?.zipCode || 'N/A',
      },
    },
    booking: {
      id: String(booking.id),
      startDate: booking.startDate,
      endDate: booking.endDate,
      deliveryAddress: {
        street: booking.deliveryAddress?.street || 'N/A',
        city: booking.deliveryAddress?.city || 'N/A',
        state: booking.deliveryAddress?.state || 'N/A',
        zipCode: booking.deliveryAddress?.zipCode || 'N/A',
        specialInstructions: booking.deliveryAddress?.specialInstructions ?? undefined,
      },
      totalPrice: booking.totalPrice || 0,
      depositPaid: booking.depositPaid || 0,
      balanceDue: booking.balanceDue || 0,
      status: booking.status,
      notes: booking.notes ?? undefined,
    },
    rentalItem: {
      id: String(rentalItem.id),
      name: rentalItem.name || 'N/A',
      description: rentalItem.description ?? undefined,
      category: rentalItem.category || 'N/A',
      specifications: rentalItem.specifications,
      setupRequirements: rentalItem.setupRequirements ?? undefined,
      safetyNotes: rentalItem.safetyNotes ?? undefined,
    },
  }
}

/**
 * Generate invoice PDF from booking
 */
export async function generateInvoice(
  payload: Payload,
  bookingId: string,
): Promise<{ buffer: Buffer; invoiceData: InvoiceData }> {
  // Get base booking data
  const baseData = await fetchBookingData(payload, bookingId)

  // Find or create invoice for this booking
  const existingInvoices = await payload.find({
    collection: 'invoices',
    where: {
      bookingId: {
        equals: bookingId,
      },
    },
    limit: 1,
  })

  let invoice
  if (existingInvoices.docs.length > 0) {
    invoice = existingInvoices.docs[0]
  } else {
    // Create a new invoice
    const lineItems = [
      {
        description: `${baseData.rentalItem.name} Rental`,
        quantity: 1,
        unitPrice: baseData.booking.totalPrice,
        total: baseData.booking.totalPrice,
      },
    ]

    invoice = await payload.create({
      collection: 'invoices',
      data: {
        tenantId: Number(baseData.tenant.id),
        bookingId: Number(bookingId),
        customerId: Number(baseData.customer.id),
        lineItems,
        subtotal: baseData.booking.totalPrice,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: baseData.booking.totalPrice,
        status: 'draft',
      } as any,  // Payload 3.x type workaround
    })
  }

  const invoiceData: InvoiceData = {
    ...baseData,
    invoice: {
      id: String(invoice.id),
      invoiceNumber: invoice.invoiceNumber,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount || 0,
      discountAmount: invoice.discountAmount || 0,
      totalAmount: invoice.totalAmount,
      dueDate: invoice.dueDate ?? undefined,
      notes: invoice.notes ?? undefined,
    },
  }

  const buffer = await generateInvoicePDF(invoiceData)

  return { buffer, invoiceData }
}

/**
 * Generate contract PDF from booking
 */
export async function generateContract(
  payload: Payload,
  bookingId: string,
): Promise<{ buffer: Buffer; contractData: ContractData }> {
  // Get base booking data
  const baseData = await fetchBookingData(payload, bookingId)

  // Find or create contract for this booking
  const existingContracts = await payload.find({
    collection: 'contracts',
    where: {
      bookingId: {
        equals: bookingId,
      },
    },
    limit: 1,
  })

  let contract
  if (existingContracts.docs.length > 0) {
    contract = existingContracts.docs[0]
  } else {
    // Create a new contract with default terms
    const defaultTerms = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: `This Rental Agreement is entered into on ${new Date().toLocaleDateString()} between ${baseData.tenant.name} (Lessor) and ${baseData.customer.firstName} ${baseData.customer.lastName} (Lessee).`,
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: `1. RENTAL ITEM: Lessor agrees to rent to Lessee the following item: ${baseData.rentalItem.name}`,
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: `2. RENTAL PERIOD: The rental period begins on ${new Date(baseData.booking.startDate).toLocaleDateString()} and ends on ${new Date(baseData.booking.endDate).toLocaleDateString()}.`,
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: '3. PAYMENT: Lessee agrees to pay the total rental fee as specified in the associated invoice.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: '4. LIABILITY: Lessee assumes full responsibility for the rental item during the rental period and agrees to return it in the same condition as received.',
              },
            ],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: '5. CANCELLATION: Cancellations must be made at least 48 hours in advance for a full refund of any deposit paid.',
              },
            ],
          },
        ],
        direction: null,
        format: '' as const,
        indent: 0,
        version: 1,
      },
    }

    contract = await payload.create({
      collection: 'contracts',
      data: {
        tenantId: Number(baseData.tenant.id),
        bookingId: Number(bookingId),
        customerId: Number(baseData.customer.id),
        type: 'rental-agreement',
        content: defaultTerms,
        status: 'draft',
      } as any,  // Payload 3.x type workaround
    })
  }

  const contractData: ContractData = {
    ...baseData,
    contract: {
      id: String(contract.id),
      contractNumber: contract.contractNumber,
      type: contract.type,
      content: contract.content,
      signatureUrl: contract.signatureUrl ?? undefined,
      signerName: contract.signerName ?? undefined,
    },
  }

  const buffer = await generateContractPDF(contractData)

  return { buffer, contractData }
}

/**
 * Generate packing slip PDF from booking
 */
export async function generatePackingSlip(
  payload: Payload,
  bookingId: string,
): Promise<{ buffer: Buffer; packingSlipData: PackingSlipData }> {
  // Get base booking data
  const baseData = await fetchBookingData(payload, bookingId)

  // Generate packing slip number
  const year = new Date().getFullYear()
  const slipNumber = `PKG-${year}-${bookingId.slice(0, 8).toUpperCase()}`

  const packingSlipData: PackingSlipData = {
    ...baseData,
    packingSlip: {
      id: bookingId,
      slipNumber,
      items: [
        {
          name: baseData.rentalItem.name,
          quantity: 1,
          setupInstructions: baseData.rentalItem.setupRequirements,
        },
      ],
    },
  }

  const buffer = await generatePackingSlipPDF(packingSlipData)

  return { buffer, packingSlipData }
}

/**
 * Generate all documents for a booking
 */
export async function generateAllDocuments(
  payload: Payload,
  bookingId: string,
): Promise<{
  invoice: Buffer
  contract: Buffer
  packingSlip: Buffer
}> {
  const [invoice, contract, packingSlip] = await Promise.all([
    generateInvoice(payload, bookingId),
    generateContract(payload, bookingId),
    generatePackingSlip(payload, bookingId),
  ])

  return {
    invoice: invoice.buffer,
    contract: contract.buffer,
    packingSlip: packingSlip.buffer,
  }
}
