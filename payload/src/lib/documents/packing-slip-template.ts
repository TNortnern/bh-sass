import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import type { PackingSlipData } from './types'
import { formatDocumentDate, formatDateTime } from './utils'

/**
 * Generate packing slip PDF
 */
export async function generatePackingSlipPDF(data: PackingSlipData): Promise<Buffer> {
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
      doc.fontSize(24).font('Helvetica-Bold').text('PACKING SLIP', 50, 50)
      doc.fontSize(10).font('Helvetica').text(data.packingSlip.slipNumber, 50, 80)

      // Company Info
      doc.fontSize(12).font('Helvetica-Bold').text(data.tenant.name, 50, 110)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(data.tenant.businessInfo.phone, 50, 130)
      doc.text(data.tenant.businessInfo.email, 50, 145)

      // Delivery Information
      doc.fontSize(14).font('Helvetica-Bold').text('DELIVERY INFORMATION', 50, 180)

      let yPosition = 210
      doc.fontSize(10).font('Helvetica-Bold').text('Customer:', 50, yPosition)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`${data.customer.firstName} ${data.customer.lastName}`, 150, yPosition)

      yPosition += 20
      doc.font('Helvetica-Bold').text('Phone:', 50, yPosition)
      doc.font('Helvetica').text(data.customer.phone, 150, yPosition)

      yPosition += 20
      doc.font('Helvetica-Bold').text('Delivery Address:', 50, yPosition)
      doc.font('Helvetica').text(data.booking.deliveryAddress.street, 150, yPosition)
      yPosition += 15
      doc.text(
        `${data.booking.deliveryAddress.city}, ${data.booking.deliveryAddress.state} ${data.booking.deliveryAddress.zipCode}`,
        150,
        yPosition,
      )

      yPosition += 25
      doc.font('Helvetica-Bold').text('Delivery Date:', 50, yPosition)
      doc.font('Helvetica').text(formatDateTime(data.booking.startDate), 150, yPosition)

      yPosition += 20
      doc.font('Helvetica-Bold').text('Pickup Date:', 50, yPosition)
      doc.font('Helvetica').text(formatDateTime(data.booking.endDate), 150, yPosition)

      // Special Instructions
      if (data.booking.deliveryAddress.specialInstructions) {
        yPosition += 25
        doc.font('Helvetica-Bold').text('Special Instructions:', 50, yPosition)
        yPosition += 15
        doc
          .font('Helvetica')
          .text(data.booking.deliveryAddress.specialInstructions, 50, yPosition, { width: 490 })
        yPosition = doc.y + 10
      } else {
        yPosition += 30
      }

      // Items List
      yPosition += 20
      doc.fontSize(14).font('Helvetica-Bold').text('ITEMS TO DELIVER', 50, yPosition)

      yPosition += 30
      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('Qty', 50, yPosition, { width: 50 })
      doc.text('Item', 110, yPosition)

      yPosition += 20
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(50, yPosition)
        .lineTo(540, yPosition)
        .stroke()

      yPosition += 15
      doc.font('Helvetica')

      for (const item of data.packingSlip.items) {
        if (yPosition > 650) {
          doc.addPage()
          yPosition = 50
        }

        doc.text(item.quantity.toString(), 50, yPosition, { width: 50 })
        doc.text(item.name, 110, yPosition, { width: 400 })

        if (item.setupInstructions) {
          yPosition += 15
          doc.fontSize(8).text(`Setup: ${item.setupInstructions}`, 110, yPosition, { width: 400 })
          doc.fontSize(10)
        }

        yPosition += 30
      }

      // Setup Requirements
      if (data.rentalItem.setupRequirements) {
        yPosition += 20
        doc.fontSize(12).font('Helvetica-Bold').text('SETUP REQUIREMENTS', 50, yPosition)
        yPosition += 20
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(data.rentalItem.setupRequirements, 50, yPosition, { width: 490 })
        yPosition = doc.y + 15
      }

      // Safety Notes
      if (data.rentalItem.safetyNotes) {
        yPosition += 10
        doc.fontSize(12).font('Helvetica-Bold').text('SAFETY NOTES', 50, yPosition)
        yPosition += 20
        doc
          .fontSize(9)
          .font('Helvetica')
          .text(data.rentalItem.safetyNotes, 50, yPosition, { width: 490 })
      }

      // Generate QR code for quick lookup
      QRCode.toDataURL(data.booking.id, { width: 100 })
        .then((qrDataUrl) => {
          const qrY = doc.page.height - 150
          doc.fontSize(10).font('Helvetica-Bold').text('Scan for booking details:', 400, qrY)
          doc.image(qrDataUrl, 400, qrY + 15, { width: 100, height: 100 })

          // Footer
          doc
            .fontSize(8)
            .font('Helvetica')
            .text(
              'Please inspect all items upon delivery. Contact us immediately if there are any issues.',
              50,
              doc.page.height - 50,
              { align: 'center', width: 490 },
            )

          // Finalize PDF
          doc.end()
        })
        .catch((error) => {
          // If QR code generation fails, just finalize without it
          console.error('QR code generation failed:', error)
          doc.end()
        })
    } catch (error) {
      reject(error)
    }
  })
}
