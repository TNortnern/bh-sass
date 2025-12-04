import PDFDocument from 'pdfkit'
import type { InvoiceData } from './types'
import { formatCurrency, formatDocumentDate } from './utils'

/**
 * Generate invoice PDF
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
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
      doc.fontSize(24).text('INVOICE', 50, 50)
      doc.fontSize(10).text(data.invoice.invoiceNumber, 50, 80)

      // Company Info (right side)
      const rightColumn = 350
      doc.fontSize(12).font('Helvetica-Bold').text(data.tenant.name, rightColumn, 50)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(data.tenant.businessInfo.address.street, rightColumn, 70)
      doc.text(
        `${data.tenant.businessInfo.address.city}, ${data.tenant.businessInfo.address.state} ${data.tenant.businessInfo.address.zipCode}`,
        rightColumn,
        85,
      )
      doc.text(data.tenant.businessInfo.phone, rightColumn, 100)
      doc.text(data.tenant.businessInfo.email, rightColumn, 115)

      // Bill To Section
      doc.moveDown(3)
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 150)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`${data.customer.firstName} ${data.customer.lastName}`, 50, 170)
      doc.text(data.customer.address.street, 50, 185)
      doc.text(
        `${data.customer.address.city}, ${data.customer.address.state} ${data.customer.address.zipCode}`,
        50,
        200,
      )
      doc.text(data.customer.email, 50, 215)
      doc.text(data.customer.phone, 50, 230)

      // Invoice Details (right side)
      doc.fontSize(10).text('Date:', rightColumn, 150)
      doc.text(formatDocumentDate(new Date()), rightColumn + 80, 150)

      if (data.invoice.dueDate) {
        doc.text('Due Date:', rightColumn, 165)
        doc.text(formatDocumentDate(data.invoice.dueDate), rightColumn + 80, 165)
      }

      // Rental Period
      doc.text('Rental Period:', rightColumn, 180)
      doc.text(
        `${formatDocumentDate(data.booking.startDate)} - ${formatDocumentDate(data.booking.endDate)}`,
        rightColumn + 80,
        180,
      )

      // Line Items Table
      const tableTop = 280
      let yPosition = tableTop

      // Table Header
      doc.fontSize(10).font('Helvetica-Bold')
      doc.text('Description', 50, yPosition)
      doc.text('Qty', 300, yPosition, { width: 50, align: 'right' })
      doc.text('Price', 360, yPosition, { width: 80, align: 'right' })
      doc.text('Total', 450, yPosition, { width: 90, align: 'right' })

      // Draw line under header
      yPosition += 20
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(50, yPosition)
        .lineTo(540, yPosition)
        .stroke()

      // Table Rows
      doc.font('Helvetica')
      yPosition += 10

      for (const item of data.invoice.lineItems) {
        // Check if we need a new page
        if (yPosition > 700) {
          doc.addPage()
          yPosition = 50
        }

        doc.text(item.description, 50, yPosition, { width: 240 })
        doc.text(item.quantity.toString(), 300, yPosition, { width: 50, align: 'right' })
        doc.text(formatCurrency(item.unitPrice), 360, yPosition, { width: 80, align: 'right' })
        doc.text(formatCurrency(item.total), 450, yPosition, { width: 90, align: 'right' })
        yPosition += 25
      }

      // Totals Section
      yPosition += 10
      doc
        .strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(350, yPosition)
        .lineTo(540, yPosition)
        .stroke()

      yPosition += 15
      doc.fontSize(10).text('Subtotal:', 380, yPosition)
      doc.text(formatCurrency(data.invoice.subtotal), 450, yPosition, {
        width: 90,
        align: 'right',
      })

      if (data.invoice.taxAmount > 0) {
        yPosition += 20
        doc.text('Tax:', 380, yPosition)
        doc.text(formatCurrency(data.invoice.taxAmount), 450, yPosition, {
          width: 90,
          align: 'right',
        })
      }

      if (data.invoice.discountAmount > 0) {
        yPosition += 20
        doc.text('Discount:', 380, yPosition)
        doc.text(`-${formatCurrency(data.invoice.discountAmount)}`, 450, yPosition, {
          width: 90,
          align: 'right',
        })
      }

      yPosition += 20
      doc.fontSize(12).font('Helvetica-Bold').text('Total:', 380, yPosition)
      doc.text(formatCurrency(data.invoice.totalAmount), 450, yPosition, {
        width: 90,
        align: 'right',
      })

      // Notes
      if (data.invoice.notes) {
        yPosition += 40
        doc.fontSize(10).font('Helvetica-Bold').text('Notes:', 50, yPosition)
        yPosition += 15
        doc.fontSize(9).font('Helvetica').text(data.invoice.notes, 50, yPosition, { width: 490 })
      }

      // Footer
      doc
        .fontSize(8)
        .text(
          'Thank you for your business!',
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
