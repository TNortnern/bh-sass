import type { PayloadRequest } from 'payload'
import { generateContractPDF } from '../lib/documents/contract-template'
import type { ContractData } from '../lib/documents/types'
import { getRelationshipValue } from '../lib/documents/utils'

/**
 * Interpolate variables in rich text content
 */
function interpolateRichText(content: any, variables: Record<string, string>): any {
  if (!content) return content

  const interpolateText = (text: string): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match
    })
  }

  const processNode = (node: any): any => {
    if (node.type === 'text' && node.text) {
      return {
        ...node,
        text: interpolateText(node.text),
      }
    }

    if (node.children) {
      return {
        ...node,
        children: node.children.map(processNode),
      }
    }

    return node
  }

  if (content.root) {
    return {
      ...content,
      root: processNode(content.root),
    }
  }

  return content
}

/**
 * Extract variables from booking data
 */
async function extractBookingVariables(
  payload: any,
  bookingId: string,
): Promise<Record<string, string>> {
  const booking = await payload.findByID({
    collection: 'bookings',
    id: bookingId,
    depth: 2,
  })

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`)
  }

  const tenant = getRelationshipValue<any>(booking.tenantId)
  const customer = getRelationshipValue<any>(booking.customerId)
  const rentalItem = getRelationshipValue<any>(booking.rentalItemId)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2)
  }

  return {
    // Tenant variables
    tenantName: tenant?.name || 'N/A',
    tenantPhone: tenant?.businessInfo?.phone || 'N/A',
    tenantEmail: tenant?.businessInfo?.email || 'N/A',
    tenantAddress: tenant?.businessInfo?.address
      ? `${tenant.businessInfo.address.street}, ${tenant.businessInfo.address.city}, ${tenant.businessInfo.address.state} ${tenant.businessInfo.address.zipCode}`
      : 'N/A',

    // Customer variables
    customerName: customer?.name || 'N/A',
    customerPhone: customer?.phone || 'N/A',
    customerEmail: customer?.email || 'N/A',
    customerAddress: customer?.address
      ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}`
      : 'N/A',

    // Rental item variables
    itemName: rentalItem?.name || 'N/A',
    itemCategory: rentalItem?.category || 'N/A',

    // Booking variables
    startDate: formatDate(booking.startDate),
    endDate: formatDate(booking.endDate),
    deliveryAddress: booking.deliveryAddress
      ? `${booking.deliveryAddress.street}, ${booking.deliveryAddress.city}, ${booking.deliveryAddress.state} ${booking.deliveryAddress.zipCode}`
      : 'N/A',
    totalPrice: formatCurrency(booking.totalPrice || 0),
    depositPaid: formatCurrency(booking.depositPaid || 0),
    balanceDue: formatCurrency(booking.balanceDue || 0),

    // Current date
    currentDate: formatDate(new Date().toISOString()),
  }
}

/**
 * POST /api/contracts/generate
 * Generate a contract from a template
 */
export const generateFromTemplate = async (req: PayloadRequest) => {
  try {
    // In Payload 3.x endpoints, the body is pre-parsed and available on req.data
    const { templateId, bookingId, customVariables } = req.data || {}

    if (!templateId || !bookingId) {
      return Response.json(
        {
          error: 'Missing required fields: templateId and bookingId',
        },
        { status: 400 },
      )
    }

    // Fetch the template
    const template = await req.payload.findByID({
      collection: 'contract-templates',
      id: templateId,
    })

    if (!template) {
      return Response.json(
        {
          error: 'Template not found',
        },
        { status: 404 },
      )
    }

    // Extract variables from booking
    const bookingVars = await extractBookingVariables(req.payload, bookingId)

    // Merge with custom variables (custom vars override booking vars)
    const allVariables = {
      ...bookingVars,
      ...(customVariables || {}),
    }

    // Interpolate template content
    const interpolatedContent = interpolateRichText(template.content, allVariables)

    // Get booking for contract creation
    const booking = await req.payload.findByID({
      collection: 'bookings',
      id: bookingId,
      depth: 1,
    })

    const tenantId =
      typeof booking.tenantId === 'object' ? booking.tenantId.id : booking.tenantId
    const customerId =
      typeof booking.customerId === 'object' ? booking.customerId.id : booking.customerId

    // Create or update contract
    const existingContracts = await req.payload.find({
      collection: 'contracts',
      where: {
        and: [
          {
            bookingId: {
              equals: bookingId,
            },
          },
          {
            type: {
              equals: template.templateType,
            },
          },
        ],
      },
      limit: 1,
    })

    let contract
    if (existingContracts.docs.length > 0) {
      // Update existing contract
      contract = await req.payload.update({
        collection: 'contracts',
        id: existingContracts.docs[0].id,
        data: {
          content: interpolatedContent,
          status: 'draft',
        },
      })
    } else {
      // Create new contract
      contract = await req.payload.create({
        collection: 'contracts',
        data: {
          tenantId,
          bookingId,
          customerId,
          type: template.templateType,
          content: interpolatedContent,
          status: 'draft',
        } as any,  // Payload 3.x type workaround
      })
    }

    return Response.json({
      success: true,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      message: 'Contract generated successfully',
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error generating contract from template')

    return Response.json(
      {
        error: 'Failed to generate contract',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/contracts/:id/sign
 * Sign a contract with digital signature
 */
export const signContract = async (req: PayloadRequest) => {
  try {
    const contractId = req.routeParams?.id as string
    const { signerName, signatureData, ipAddress } = req.data || {}

    if (!contractId) {
      return Response.json(
        {
          error: 'Contract ID is required',
        },
        { status: 400 },
      )
    }

    if (!signerName || !signatureData) {
      return Response.json(
        {
          error: 'Missing required fields: signerName and signatureData',
        },
        { status: 400 },
      )
    }

    // Fetch contract
    const contract = await req.payload.findByID({
      collection: 'contracts',
      id: contractId,
    })

    if (!contract) {
      return Response.json(
        {
          error: 'Contract not found',
        },
        { status: 404 },
      )
    }

    // In production, you'd upload the signature image to storage
    // For now, we'll just store the data URI or a placeholder
    const signatureUrl = signatureData // Could be uploaded to Bunny CDN

    // Update contract with signature
    const updatedContract = await req.payload.update({
      collection: 'contracts',
      id: contractId,
      data: {
        status: 'signed',
        signedAt: new Date().toISOString(),
        signerName,
        signatureUrl,
        signerIP: ipAddress || req.headers.get('x-forwarded-for') || 'unknown',
      },
    })

    // TODO: Generate and store signed PDF
    // const pdfBuffer = await generateContractPDF(...)
    // Upload to storage and save pdfUrl

    return Response.json({
      success: true,
      contract: {
        id: updatedContract.id,
        contractNumber: updatedContract.contractNumber,
        status: updatedContract.status,
        signedAt: updatedContract.signedAt,
      },
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error signing contract')

    return Response.json(
      {
        error: 'Failed to sign contract',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/contracts/:id/send
 * Send contract to customer for signature
 */
export const sendContractForSignature = async (req: PayloadRequest) => {
  try {
    const contractId = req.routeParams?.id as string

    if (!contractId) {
      return Response.json(
        {
          error: 'Contract ID is required',
        },
        { status: 400 },
      )
    }

    // Fetch contract with relationships
    const contract = await req.payload.findByID({
      collection: 'contracts',
      id: contractId,
      depth: 2,
    })

    if (!contract) {
      return Response.json(
        {
          error: 'Contract not found',
        },
        { status: 404 },
      )
    }

    // Update contract status
    await req.payload.update({
      collection: 'contracts',
      id: contractId,
      data: {
        status: 'sent',
        sentAt: new Date().toISOString(),
      },
    })

    // TODO: Send email to customer with contract link
    // await emailService.sendContractForSignature(...)

    return Response.json({
      success: true,
      message: 'Contract sent to customer for signature',
      contractNumber: contract.contractNumber,
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error sending contract')

    return Response.json(
      {
        error: 'Failed to send contract',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
