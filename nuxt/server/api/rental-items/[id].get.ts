/**
 * GET /api/rental-items/:id
 * Fetch a single rental item
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

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required'
    })
  }

  try {
    // Fetch rental item
    const response = await fetch(`${payloadUrl}/api/rental-items/${id}`, {
      headers: {
        'X-API-Key': apiKey
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Failed to fetch rental item'
      })
    }

    const data = await response.json()

    // Fetch inventory units for this rental item
    const unitsResponse = await fetch(`${payloadUrl}/api/inventory-units?where[rentalItem][equals]=${id}`, {
      headers: {
        'X-API-Key': apiKey
      }
    })

    let units: any[] = []
    if (unitsResponse.ok) {
      const unitsData = await unitsResponse.json()
      units = (unitsData.docs || []).map((unit: any) => ({
        id: String(unit.id),
        serialNumber: unit.serialNumber || '',
        barcode: unit.barcode || undefined,
        status: unit.status || 'available',
        condition: unit.condition || 'excellent',
        lastRentalDate: unit.lastRentalDate || undefined,
        maintenanceNotes: unit.notes || undefined,
        purchaseDate: unit.purchaseDate || '',
        purchasePrice: unit.purchasePrice || 0
      }))
    }

    const availableUnits = units.filter(u => u.status === 'available').length
    const totalUnits = units.length

    // Transform Payload format to frontend format
    return {
      id: String(data.id),
      name: data.name || '',
      category: data.category || 'bounce_house',
      description: data.description || '',
      status: data.isActive ? 'active' : 'inactive',
      images: (data.images || []).map((img: any) => img.url || img),
      specifications: {
        dimensions: {
          length: data.dimensions?.length || 0,
          width: data.dimensions?.width || 0,
          height: data.dimensions?.height || 0
        },
        weight: data.weight || 0,
        capacity: {
          maxOccupants: data.capacity || 0,
          maxWeight: data.maxWeight || 0
        },
        ageRange: {
          min: data.ageRange?.minAge || 0,
          max: data.ageRange?.maxAge || 0
        },
        setupTime: data.setupTime || 0,
        requiredSpace: {
          length: data.requiredSpace?.length || 0,
          width: data.requiredSpace?.width || 0
        }
      },
      pricing: {
        hourly: data.pricing?.hourlyRate || 0,
        daily: data.pricing?.dailyRate || 0,
        weekend: data.pricing?.weekendRate || 0,
        weekly: data.pricing?.weeklyRate || 0
      },
      setupRequirements: {
        powerOutlet: data.setupRequirements?.powerRequired || false,
        waterSource: data.setupRequirements?.waterRequired || false,
        anchoringMethod: 'stakes' as const,
        setupCrew: 1
      },
      units,
      totalUnits,
      availableUnits,
      utilization: 0,
      revenue: { total: 0, thisMonth: 0 },
      rbPayloadServiceId: data.rbPayloadServiceId || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  } catch (error: any) {
    console.error('Error fetching rental item:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch rental item'
    })
  }
})
