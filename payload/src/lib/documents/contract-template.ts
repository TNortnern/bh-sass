import PDFDocument from 'pdfkit'
import type { ContractData } from './types'
import { formatDocumentDate } from './utils'

/**
 * Convert Lexical rich text to plain text (simplified)
 * In production, you'd want a more robust converter
 */
function lexicalToPlainText(content: any): string {
  if (!content) return ''

  try {
    // Handle Lexical JSON structure
    if (content.root && content.root.children) {
      const extractText = (nodes: any[]): string => {
        return nodes
          .map((node) => {
            if (node.type === 'text') {
              return node.text
            }
            if (node.children) {
              return extractText(node.children)
            }
            return ''
          })
          .join(' ')
      }

      return extractText(content.root.children)
    }

    // Fallback to string representation
    return typeof content === 'string' ? content : JSON.stringify(content)
  } catch (error) {
    return 'Contract content could not be rendered'
  }
}

/**
 * Generate contract PDF
 */
export async function generateContractPDF(data: ContractData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      const buffers: Buffer[] = []

      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })
      doc.on('error', reject)

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('RENTAL AGREEMENT', 50, 50, { align: 'center' })

      doc.fontSize(10).font('Helvetica').text(data.contract.contractNumber, 50, 80)

      // Parties Section
      doc.moveDown(2)
      doc.fontSize(12).font('Helvetica-Bold').text('AGREEMENT BETWEEN:', 50, 120)

      // Business (Lessor)
      doc.moveDown(1)
      doc.fontSize(10).font('Helvetica-Bold').text('Lessor:', 50, 145)
      doc.fontSize(10).font('Helvetica').text(data.tenant.name, 50, 160)
      doc.text(data.tenant.businessInfo.address.street, 50, 175)
      doc.text(
        `${data.tenant.businessInfo.address.city}, ${data.tenant.businessInfo.address.state} ${data.tenant.businessInfo.address.zipCode}`,
        50,
        190,
      )
      doc.text(data.tenant.businessInfo.phone, 50, 205)
      doc.text(data.tenant.businessInfo.email, 50, 220)

      // Customer (Lessee)
      doc.fontSize(10).font('Helvetica-Bold').text('Lessee:', 300, 145)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`${data.customer.firstName} ${data.customer.lastName}`, 300, 160)
      doc.text(data.customer.address.street, 300, 175)
      doc.text(
        `${data.customer.address.city}, ${data.customer.address.state} ${data.customer.address.zipCode}`,
        300,
        190,
      )
      doc.text(data.customer.phone, 300, 205)
      doc.text(data.customer.email, 300, 220)

      // Rental Details
      let yPosition = 250
      doc.fontSize(12).font('Helvetica-Bold').text('RENTAL DETAILS:', 50, yPosition)

      yPosition += 25
      doc.fontSize(10).font('Helvetica').text('Item:', 50, yPosition)
      doc.text(data.rentalItem.name, 150, yPosition)

      yPosition += 20
      doc.text('Rental Period:', 50, yPosition)
      doc.text(
        `${formatDocumentDate(data.booking.startDate)} to ${formatDocumentDate(data.booking.endDate)}`,
        150,
        yPosition,
      )

      yPosition += 20
      doc.text('Delivery Address:', 50, yPosition)
      doc.text(
        `${data.booking.deliveryAddress.street}, ${data.booking.deliveryAddress.city}, ${data.booking.deliveryAddress.state} ${data.booking.deliveryAddress.zipCode}`,
        150,
        yPosition,
        { width: 350 },
      )

      // Contract Terms
      yPosition += 40
      doc.fontSize(12).font('Helvetica-Bold').text('TERMS AND CONDITIONS:', 50, yPosition)

      yPosition += 25
      const contractText = lexicalToPlainText(data.contract.content)
      doc.fontSize(9).font('Helvetica').text(contractText, 50, yPosition, {
        width: 490,
        align: 'justify',
      })

      // Move to bottom for signature section
      // Calculate remaining space or add new page if needed
      const currentY = doc.y
      const signatureTop = doc.page.height - 200

      if (currentY > signatureTop - 50) {
        doc.addPage()
        doc.y = 50
      } else {
        doc.y = signatureTop
      }

      // Signature Section
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('SIGNATURES:', 50, doc.y)

      const sigY = doc.y + 30

      // Lessor signature
      doc
        .strokeColor('#000000')
        .lineWidth(1)
        .moveTo(50, sigY)
        .lineTo(250, sigY)
        .stroke()

      doc.fontSize(9).font('Helvetica').text('Lessor Signature', 50, sigY + 5)
      doc.text(formatDocumentDate(new Date()), 50, sigY + 20)

      // Lessee signature
      doc
        .strokeColor('#000000')
        .lineWidth(1)
        .moveTo(300, sigY)
        .lineTo(500, sigY)
        .stroke()

      doc.fontSize(9).text('Lessee Signature', 300, sigY + 5)

      if (data.contract.signerName) {
        doc.text(data.contract.signerName, 300, sigY + 20)
      }

      if (data.contract.signatureUrl) {
        doc.fontSize(8).text('[Digital Signature]', 300, sigY - 15)
      }

      // Footer
      doc
        .fontSize(8)
        .text(
          'Both parties acknowledge they have read and agree to the terms of this agreement.',
          50,
          doc.page.height - 50,
          { align: 'center', width: 490 },
        )

      // Finalize PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
