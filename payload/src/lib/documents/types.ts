export interface DocumentData {
  // Tenant info
  tenant: {
    id: string
    name: string
    businessInfo: {
      phone: string
      email: string
      website?: string
      address: {
        street: string
        city: string
        state: string
        zipCode: string
      }
    }
    logo?: {
      url: string
    }
  }

  // Customer info
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }

  // Booking info
  booking: {
    id: string
    startDate: string
    endDate: string
    deliveryAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      specialInstructions?: string
    }
    totalPrice: number
    depositPaid: number
    balanceDue: number
    status: string
    notes?: string
  }

  // Rental item info
  rentalItem: {
    id: string
    name: string
    description?: string
    category: string
    specifications?: {
      dimensions?: {
        length: number
        width: number
        height: number
      }
      capacity?: number
      ageRange?: string
    }
    setupRequirements?: string
    safetyNotes?: string
  }
}

export interface InvoiceData extends DocumentData {
  invoice: {
    id: string
    invoiceNumber: string
    lineItems: Array<{
      description: string
      quantity: number
      unitPrice: number
      total: number
    }>
    subtotal: number
    taxAmount: number
    discountAmount: number
    totalAmount: number
    dueDate?: string
    notes?: string
  }
}

export interface ContractData extends DocumentData {
  contract: {
    id: string
    contractNumber: string
    type: string
    content: any // Rich text content
    signatureUrl?: string
    signerName?: string
  }
}

export interface PackingSlipData extends DocumentData {
  packingSlip: {
    id: string
    slipNumber: string
    items: Array<{
      name: string
      quantity: number
      setupInstructions?: string
    }>
  }
}
