/**
 * POST /api/inventory-units
 * Create a new inventory unit
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey
  const tenantId = config.payloadTenantId

  // Get the cookie header to forward to Payload for session auth
  const cookieHeader = getHeader(event, 'cookie') || ''

  // Must have either session cookie or API key
  if (!cookieHeader.includes('payload-token') && !apiKey) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  // Build headers - prefer session auth, fall back to API key
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookieHeader.includes('payload-token')) {
    headers['Cookie'] = cookieHeader
  } else if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  const body = await readBody(event)

  // Validate required fields
  if (!body.rentalItemId || !body.serialNumber) {
    throw createError({
      statusCode: 400,
      message: 'rentalItemId and serialNumber are required'
    })
  }

  // Ensure rentalItemId is a number (Payload relationships require numeric IDs)
  const rentalItemId = Number(body.rentalItemId)
  if (isNaN(rentalItemId) || rentalItemId <= 0) {
    throw createError({
      statusCode: 400,
      message: 'rentalItemId must be a valid numeric ID'
    })
  }

  // Transform the frontend data format to Payload format
  const payloadData = {
    tenantId: Number(tenantId),
    rentalItem: rentalItemId,
    label: body.label || `Unit ${body.serialNumber}`,
    serialNumber: body.serialNumber,
    barcode: body.barcode || undefined,
    status: body.status || 'available',
    condition: body.condition || 'excellent',
    notes: body.notes || undefined,
    purchaseDate: body.purchaseDate || undefined,
    purchasePrice: body.purchasePrice || undefined,
    lastMaintenanceDate: body.lastMaintenanceDate || undefined
  }

  console.log('Creating inventory unit with data:', JSON.stringify(payloadData, null, 2))

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payloadData)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Payload error:', data)

      throw createError({
        statusCode: response.status,
        message: data.errors?.[0]?.message || 'Failed to create inventory unit'
      })
    }

    return {
      success: true,
      unit: data.doc
    }
  } catch (error: unknown) {
    console.error('Error creating inventory unit:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: (error as Error).message || 'Failed to create inventory unit'
    })
  }
})
