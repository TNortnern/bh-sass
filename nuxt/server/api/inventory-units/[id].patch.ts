/**
 * PATCH /api/inventory-units/:id
 * Update an inventory unit
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Payload API key not configured'
    })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Unit ID is required'
    })
  }

  // Transform the frontend data format to Payload format if needed
  const payloadData: Record<string, any> = {}

  if (body.label !== undefined) payloadData.label = body.label
  if (body.serialNumber !== undefined) payloadData.serialNumber = body.serialNumber
  if (body.barcode !== undefined) payloadData.barcode = body.barcode
  if (body.status !== undefined) payloadData.status = body.status
  if (body.condition !== undefined) payloadData.condition = body.condition
  if (body.notes !== undefined) payloadData.notes = body.notes
  if (body.purchaseDate !== undefined) payloadData.purchaseDate = body.purchaseDate
  if (body.purchasePrice !== undefined) payloadData.purchasePrice = body.purchasePrice
  if (body.lastMaintenanceDate !== undefined) payloadData.lastMaintenanceDate = body.lastMaintenanceDate

  try {
    const response = await fetch(`${payloadUrl}/api/inventory-units/${id}`, {
      method: 'PATCH',
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
        message: data.errors?.[0]?.message || 'Failed to update inventory unit'
      })
    }

    return {
      success: true,
      unit: data.doc
    }
  } catch (error: any) {
    console.error('Error updating inventory unit:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update inventory unit'
    })
  }
})
