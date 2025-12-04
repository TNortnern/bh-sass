import type { PayloadRequest } from 'payload'
import { generateInvoice, generateContract, generatePackingSlip } from '../lib/documents/generator'

/**
 * POST /api/documents/generate
 * Generate a document (invoice, contract, or packing slip)
 */
export const generateDocument = async (req: PayloadRequest) => {
  try {
    const { type, bookingId } = req.data || {}

    if (!type || !bookingId) {
      return Response.json(
        {
          error: 'Missing required fields: type and bookingId',
        },
        { status: 400 },
      )
    }

    const validTypes = ['invoice', 'contract', 'packing-slip']
    if (!validTypes.includes(type)) {
      return Response.json(
        {
          error: `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 },
      )
    }

    let buffer: Buffer
    let filename: string
    let documentId: string | undefined

    switch (type) {
      case 'invoice': {
        const result = await generateInvoice(req.payload, bookingId)
        buffer = result.buffer
        filename = `invoice-${result.invoiceData.invoice.invoiceNumber}.pdf`
        documentId = result.invoiceData.invoice.id
        break
      }
      case 'contract': {
        const result = await generateContract(req.payload, bookingId)
        buffer = result.buffer
        filename = `contract-${result.contractData.contract.contractNumber}.pdf`
        documentId = result.contractData.contract.id
        break
      }
      case 'packing-slip': {
        const result = await generatePackingSlip(req.payload, bookingId)
        buffer = result.buffer
        filename = `packing-slip-${result.packingSlipData.packingSlip.slipNumber}.pdf`
        break
      }
      default:
        return Response.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Return PDF as response with proper headers
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error generating document')

    return Response.json(
      {
        error: 'Failed to generate document',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/documents/:collection/:id/download
 * Download an existing document PDF
 */
export const downloadDocument = async (req: PayloadRequest) => {
  try {
    const collection = req.routeParams?.collection as string
    const id = req.routeParams?.id as string

    if (!collection || !id) {
      return Response.json(
        {
          error: 'Missing collection or id parameter',
        },
        { status: 400 },
      )
    }

    if (!['invoices', 'contracts'].includes(collection)) {
      return Response.json(
        {
          error: 'Invalid collection. Must be invoices or contracts',
        },
        { status: 400 },
      )
    }

    // Fetch the document
    const doc = await req.payload.findByID({
      collection: collection as 'invoices' | 'contracts',
      id,
    })

    if (!doc) {
      return Response.json(
        {
          error: 'Document not found',
        },
        { status: 404 },
      )
    }

    // Get the booking ID
    const bookingId =
      typeof doc.bookingId === 'string' ? doc.bookingId : (doc.bookingId as any)?.id

    if (!bookingId) {
      return Response.json(
        {
          error: 'Document has no associated booking',
        },
        { status: 400 },
      )
    }

    // Generate fresh PDF
    let buffer: Buffer
    let filename: string

    if (collection === 'invoices') {
      const result = await generateInvoice(req.payload, bookingId)
      buffer = result.buffer
      filename = `invoice-${result.invoiceData.invoice.invoiceNumber}.pdf`
    } else {
      const result = await generateContract(req.payload, bookingId)
      buffer = result.buffer
      filename = `contract-${result.contractData.contract.contractNumber}.pdf`
    }

    // Return PDF as response with proper headers
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error downloading document')

    return Response.json(
      {
        error: 'Failed to download document',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/documents/preview
 * Preview a document without saving
 */
export const previewDocument = async (req: PayloadRequest) => {
  try {
    const { type, bookingId } = req.data || {}

    if (!type || !bookingId) {
      return Response.json(
        {
          error: 'Missing required fields: type and bookingId',
        },
        { status: 400 },
      )
    }

    const validTypes = ['invoice', 'contract', 'packing-slip']
    if (!validTypes.includes(type)) {
      return Response.json(
        {
          error: `Invalid document type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 },
      )
    }

    let buffer: Buffer

    switch (type) {
      case 'invoice': {
        const result = await generateInvoice(req.payload, bookingId)
        buffer = result.buffer
        break
      }
      case 'contract': {
        const result = await generateContract(req.payload, bookingId)
        buffer = result.buffer
        break
      }
      case 'packing-slip': {
        const result = await generatePackingSlip(req.payload, bookingId)
        buffer = result.buffer
        break
      }
      default:
        return Response.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Return PDF as response with inline viewing
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    req.payload.logger.error({ error }, 'Error previewing document')

    return Response.json(
      {
        error: 'Failed to preview document',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
