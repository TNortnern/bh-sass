/**
 * POST /api/waivers/sign
 * Public endpoint for customers to sign waivers
 * Creates a Contract record with type 'liability-waiver'
 * Generates PDF and sends confirmation email
 */

// Utils are auto-imported in Nuxt server - just reference them directly

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Use server-side payloadApiUrl for internal Docker calls
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const payloadApiKey = config.payloadApiKey || ''

  // Headers for authenticated Payload API calls
  const authHeaders: Record<string, string> = payloadApiKey ? { 'X-API-Key': payloadApiKey } : {}

  const {
    tenantId,
    bookingId,
    customerId,
    signerName,
    signerEmail,
    signerPhone,
    signatureData // base64 image
    // signatureMode, // 'draw' or 'type' - unused for now
  } = body

  // Validate required fields
  if (!tenantId || !signerName || !signerEmail || !signatureData) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: tenantId, signerName, signerEmail, signatureData'
    })
  }

  // Get client IP for audit
  const clientIP = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  try {
    // For public waiver signing, always create a new customer
    // The system will handle any deduplication via email matching in hooks
    // This avoids needing read permissions on the API key
    let finalCustomerId = customerId
    const finalBookingId = bookingId

    // If no customer ID provided, create one
    if (!finalCustomerId) {
      const nameParts = signerName.split(' ')
      const firstName = nameParts[0] || signerName
      const lastName = nameParts.slice(1).join(' ') || ''

      const newCustomer = await $fetch<{ doc: { id: string } }>(
        `${payloadUrl}/api/customers`,
        {
          method: 'POST',
          headers: authHeaders,
          body: {
            tenantId,
            name: signerName,
            firstName,
            lastName,
            email: signerEmail,
            phone: signerPhone || 'Not provided'
          }
        }
      )

      finalCustomerId = newCustomer.doc.id
    }

    // Fetch tenant name for PDF
    let tenantName = 'Equipment Rentals'
    try {
      const tenant = await $fetch<{ name: string, branding?: { businessName?: string } }>(
        `${payloadUrl}/api/tenants/${tenantId}`,
        { headers: authHeaders }
      )
      tenantName = tenant.branding?.businessName || tenant.name || 'Equipment Rentals'
    } catch (e) {
      console.warn('Could not fetch tenant name for PDF:', e)
    }

    // Fetch booking number if bookingId provided
    let bookingNumber: string | undefined
    if (finalBookingId) {
      try {
        const booking = await $fetch<{ bookingNumber: string }>(
          `${payloadUrl}/api/bookings/${finalBookingId}`,
          { headers: authHeaders }
        )
        bookingNumber = booking.bookingNumber
      } catch (e) {
        console.warn('Could not fetch booking number for PDF:', e)
      }
    }

    const signedAt = new Date().toISOString()

    // Create the contract/waiver (content is optional, uses standard waiver template)
    const contract = await $fetch<{ doc: { id: string, contractNumber: string } }>(
      `${payloadUrl}/api/contracts`,
      {
        method: 'POST',
        headers: authHeaders,
        body: {
          tenantId,
          bookingId: finalBookingId || undefined,
          customerId: finalCustomerId,
          type: 'liability-waiver',
          status: 'signed',
          signedAt,
          signerName,
          signerIP: clientIP,
          signatureUrl: signatureData
        }
      }
    )

    // Generate PDF
    let pdfUrl: string | undefined
    try {
      pdfUrl = await generateWaiverPdf({
        tenantName,
        signerName,
        signerEmail,
        signerPhone: signerPhone || 'Not provided',
        signatureData,
        signedAt,
        signerIP: clientIP,
        contractNumber: contract.doc.contractNumber,
        bookingNumber
      })

      // Update contract with PDF URL
      await $fetch(
        `${payloadUrl}/api/contracts/${contract.doc.id}`,
        {
          method: 'PATCH',
          headers: authHeaders,
          body: { pdfUrl }
        }
      )
    } catch (e) {
      console.error('Error generating PDF:', e)
      // Continue without PDF - not critical for the signing flow
    }

    // Send confirmation email
    try {
      await sendWaiverConfirmationEmail({
        to: signerEmail,
        signerName,
        tenantName,
        contractNumber: contract.doc.contractNumber,
        signedAt,
        pdfUrl
      })
    } catch (e) {
      console.error('Error sending confirmation email:', e)
      // Continue without email - not critical for the signing flow
    }

    return {
      success: true,
      message: 'Waiver signed successfully',
      contract: {
        id: contract.doc.id,
        contractNumber: contract.doc.contractNumber
      },
      pdfGenerated: !!pdfUrl,
      pdfUrl // Include PDF for client download (base64 data URL)
    }
  } catch (error: unknown) {
    console.error('Error signing waiver:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to process waiver signature'
    })
  }
})

// Generate rich text waiver content (reserved for future use)
function _generateWaiverContent(signerName: string): Array<{
  type: string
  children: Array<{ type: string, text: string }>
}> {
  return [
    {
      type: 'h2',
      children: [{ type: 'text', text: 'Liability Waiver and Release Agreement' }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: `I, ${signerName}, acknowledge that the use of inflatable equipment and party rentals involves inherent risks, including but not limited to falls, collisions, sprains, strains, and other physical injuries.`
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'I voluntarily assume all risks associated with the use of the rented equipment and hereby release the rental company, its owners, employees, agents, and representatives from any and all liability.'
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'I agree to follow all safety rules and guidelines, including providing adult supervision, not exceeding capacity limits, and discontinuing use during adverse weather conditions.'
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: 'I understand that I am financially responsible for any damage to the rented equipment during the rental period, excluding normal wear and tear.'
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: `Signed electronically by: ${signerName}`
      }]
    },
    {
      type: 'paragraph',
      children: [{
        type: 'text',
        text: `Date: ${new Date().toLocaleDateString()}`
      }]
    }
  ]
}
