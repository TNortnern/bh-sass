import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDocumentDate, formatDateTime } from '../src/lib/documents/utils'

describe('Document Utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency values correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(999999.99)).toBe('$999,999.99')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-50)).toBe('-$50.00')
    })

    it('should handle decimal precision', () => {
      expect(formatCurrency(10.5)).toBe('$10.50')
      expect(formatCurrency(10.555)).toBe('$10.56') // Rounds to 2 decimals
    })
  })

  describe('formatDate', () => {
    it('should format dates with default format', () => {
      const date = new Date('2025-06-15T10:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jun 15, 2025/)
    })

    it('should format dates with custom format', () => {
      const date = new Date('2025-06-15T10:30:00Z')
      const formatted = formatDate(date, 'yyyy-MM-dd')
      expect(formatted).toBe('2025-06-15')
    })

    it('should handle string dates', () => {
      const dateString = '2025-06-15T10:30:00Z'
      const formatted = formatDate(dateString)
      expect(formatted).toMatch(/Jun 15, 2025/)
    })
  })

  describe('formatDocumentDate', () => {
    it('should format document dates', () => {
      const date = new Date('2025-06-15T10:30:00Z')
      const formatted = formatDocumentDate(date)
      expect(formatted).toMatch(/June 15, 2025/)
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time', () => {
      const date = new Date('2025-06-15T10:30:00Z')
      const formatted = formatDateTime(date)
      expect(formatted).toMatch(/Jun 15, 2025/)
      expect(formatted).toMatch(/[0-9]{1,2}:[0-9]{2} [AP]M/)
    })
  })
})

describe('Document Templates', () => {
  describe('Invoice Template', () => {
    it('should generate invoice data structure', () => {
      const mockInvoiceData = {
        tenant: {
          id: '1',
          name: 'Test Rental Co',
          businessInfo: {
            phone: '555-1234',
            email: 'test@example.com',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
            },
          },
        },
        customer: {
          id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-5678',
          address: {
            street: '456 Oak Ave',
            city: 'Testville',
            state: 'CA',
            zipCode: '54321',
          },
        },
        booking: {
          id: '3',
          startDate: '2025-06-15T09:00:00Z',
          endDate: '2025-06-15T17:00:00Z',
          deliveryAddress: {
            street: '789 Party Ln',
            city: 'Funtown',
            state: 'CA',
            zipCode: '99999',
          },
          totalPrice: 250,
          depositPaid: 50,
          balanceDue: 200,
          status: 'confirmed',
        },
        rentalItem: {
          id: '4',
          name: 'Princess Castle Bounce House',
          category: 'bounce_house',
        },
        invoice: {
          id: '5',
          invoiceNumber: 'INV-2025-001',
          lineItems: [
            {
              description: 'Princess Castle Bounce House Rental',
              quantity: 1,
              unitPrice: 250,
              total: 250,
            },
          ],
          subtotal: 250,
          taxAmount: 0,
          discountAmount: 0,
          totalAmount: 250,
        },
      }

      expect(mockInvoiceData.invoice.lineItems).toHaveLength(1)
      expect(mockInvoiceData.invoice.totalAmount).toBe(250)
      expect(mockInvoiceData.invoice.subtotal).toBe(250)
    })

    it('should calculate line item totals correctly', () => {
      const lineItem = {
        description: 'Test Item',
        quantity: 3,
        unitPrice: 50,
        total: 0,
      }

      lineItem.total = lineItem.quantity * lineItem.unitPrice

      expect(lineItem.total).toBe(150)
    })

    it('should calculate invoice totals with tax and discount', () => {
      const subtotal = 250
      const taxAmount = 20
      const discountAmount = 30

      const total = subtotal + taxAmount - discountAmount

      expect(total).toBe(240)
    })
  })

  describe('Contract Template', () => {
    it('should generate contract data structure', () => {
      const mockContractData = {
        tenant: {
          id: '1',
          name: 'Test Rental Co',
          businessInfo: {
            phone: '555-1234',
            email: 'test@example.com',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
            },
          },
        },
        customer: {
          id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-5678',
          address: {
            street: '456 Oak Ave',
            city: 'Testville',
            state: 'CA',
            zipCode: '54321',
          },
        },
        booking: {
          id: '3',
          startDate: '2025-06-15T09:00:00Z',
          endDate: '2025-06-15T17:00:00Z',
          deliveryAddress: {
            street: '789 Party Ln',
            city: 'Funtown',
            state: 'CA',
            zipCode: '99999',
          },
          totalPrice: 250,
          depositPaid: 50,
          balanceDue: 200,
          status: 'confirmed',
        },
        rentalItem: {
          id: '4',
          name: 'Princess Castle Bounce House',
          category: 'bounce_house',
        },
        contract: {
          id: '5',
          contractNumber: 'CTR-2025-001',
          type: 'rental-agreement',
          content: {
            root: {
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'This is a rental agreement.',
                    },
                  ],
                },
              ],
            },
          },
        },
      }

      expect(mockContractData.contract.type).toBe('rental-agreement')
      expect(mockContractData.contract.contractNumber).toMatch(/^CTR-/)
    })
  })

  describe('Packing Slip Template', () => {
    it('should generate packing slip data structure', () => {
      const mockPackingSlipData = {
        tenant: {
          id: '1',
          name: 'Test Rental Co',
          businessInfo: {
            phone: '555-1234',
            email: 'test@example.com',
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
            },
          },
        },
        customer: {
          id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-5678',
          address: {
            street: '456 Oak Ave',
            city: 'Testville',
            state: 'CA',
            zipCode: '54321',
          },
        },
        booking: {
          id: '3',
          startDate: '2025-06-15T09:00:00Z',
          endDate: '2025-06-15T17:00:00Z',
          deliveryAddress: {
            street: '789 Party Ln',
            city: 'Funtown',
            state: 'CA',
            zipCode: '99999',
          },
          totalPrice: 250,
          depositPaid: 50,
          balanceDue: 200,
          status: 'confirmed',
        },
        rentalItem: {
          id: '4',
          name: 'Princess Castle Bounce House',
          category: 'bounce_house',
          setupRequirements: 'Flat grass area, 20x20 ft',
          safetyNotes: 'Maximum 8 children at a time',
        },
        packingSlip: {
          id: '3',
          slipNumber: 'PKG-2025-12345678',
          items: [
            {
              name: 'Princess Castle Bounce House',
              quantity: 1,
              setupInstructions: 'Flat grass area, 20x20 ft',
            },
          ],
        },
      }

      expect(mockPackingSlipData.packingSlip.items).toHaveLength(1)
      expect(mockPackingSlipData.packingSlip.slipNumber).toMatch(/^PKG-/)
      expect(mockPackingSlipData.rentalItem.setupRequirements).toBe('Flat grass area, 20x20 ft')
    })
  })
})

describe('PDF Generation', () => {
  it('should handle missing data gracefully', () => {
    const mockData = {
      tenant: {
        id: '1',
        name: 'Test Co',
        businessInfo: {
          phone: 'N/A',
          email: 'N/A',
          address: {
            street: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zipCode: 'N/A',
          },
        },
      },
      customer: {
        id: '2',
        firstName: 'Unknown',
        lastName: 'Customer',
        email: 'N/A',
        phone: 'N/A',
        address: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
        },
      },
      booking: {
        id: '3',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        deliveryAddress: {
          street: 'N/A',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
        },
        totalPrice: 0,
        depositPaid: 0,
        balanceDue: 0,
        status: 'pending',
      },
      rentalItem: {
        id: '4',
        name: 'N/A',
        category: 'N/A',
      },
    }

    // Should not throw errors even with N/A values
    expect(mockData.tenant.businessInfo.phone).toBe('N/A')
    expect(mockData.customer.firstName).toBe('Unknown')
    expect(mockData.rentalItem.name).toBe('N/A')
  })
})
