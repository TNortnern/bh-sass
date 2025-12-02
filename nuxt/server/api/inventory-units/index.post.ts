/**
 * POST /api/inventory-units
 * Create a new inventory unit
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey
  const tenantId = config.payloadTenantId

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Payload API key not configured'
    })
  }

  const body = await readBody(event)

  // Validate required fields
  if (!body.rentalItemId || !body.serialNumber) {
    throw createError({
      statusCode: 400,
      message: 'rentalItemId and serialNumber are required'
    })
  }

  // Transform the frontend data format to Payload format
  const payloadData = {
    tenantId: Number(tenantId),
    rentalItem: body.rentalItemId,
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

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
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
  } catch (error: any) {
    console.error('Error creating inventory unit:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create inventory unit'
    })
  }
})
