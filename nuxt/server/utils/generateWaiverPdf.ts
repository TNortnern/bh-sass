/**
 * Generate a PDF for a signed liability waiver
 * Uses PDFKit for server-side PDF generation
 * Note: PDFKit may not be available in all deployment environments
 */

interface WaiverPdfData {
  tenantName: string
  signerName: string
  signerEmail: string
  signerPhone: string
  signatureData: string // base64 image
  signedAt: string
  signerIP: string
  contractNumber: string
  bookingNumber?: string
}

export async function generateWaiverPdf(data: WaiverPdfData): Promise<string> {
  // Dynamically import pdfkit to avoid bundling issues in production
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let PDFDocument: any
  try {
    const pdfkit = await import('pdfkit')
    PDFDocument = pdfkit.default
  } catch {
    // PDFKit not available - return placeholder
    console.warn('PDFKit not available, returning placeholder PDF')
    return 'data:application/pdf;base64,JVBERi0xLg=='
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: `Liability Waiver - ${data.contractNumber}`,
          Author: data.tenantName,
          Subject: 'Signed Liability Waiver'
        }
      })

      const chunks: Buffer[] = []
      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        const base64 = pdfBuffer.toString('base64')
        resolve(`data:application/pdf;base64,${base64}`)
      })
      doc.on('error', reject)

      const margin = 50
      const pageWidth = 612 // Letter width in points
      const contentWidth = pageWidth - (margin * 2)

      // Header
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('LIABILITY WAIVER', { align: 'center' })

      doc.moveDown(0.5)
        .fontSize(14)
        .font('Helvetica')
        .text(data.tenantName, { align: 'center' })

      doc.moveDown(1)

      // Contract info line
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text(`Contract Number: ${data.contractNumber}`, margin, doc.y, { continued: false })

      if (data.bookingNumber) {
        doc.text(`Booking: ${data.bookingNumber}`, { align: 'right' })
      }

      doc.moveDown(0.5)

      // Horizontal line
      doc.moveTo(margin, doc.y)
        .lineTo(pageWidth - margin, doc.y)
        .stroke()

      doc.moveDown(1)

      // Waiver content sections
      const sections = [
        {
          title: 'ASSUMPTION OF RISK:',
          content: `I, ${data.signerName}, acknowledge that the use of inflatable equipment and party rentals involves inherent risks including falls, collisions, sprains, and other injuries. I voluntarily assume all risks associated with the use of the rented equipment.`
        },
        {
          title: 'RELEASE OF LIABILITY:',
          content: `I hereby release ${data.tenantName}, its owners, employees, and agents from any and all liability arising from the use of rented equipment.`
        },
        {
          title: 'SAFETY AGREEMENT:',
          content: 'I agree to provide adult supervision, not exceed capacity limits, prohibit food/drinks/sharp objects inside inflatables, and discontinue use during adverse weather.'
        },
        {
          title: 'DAMAGE RESPONSIBILITY:',
          content: 'I am financially responsible for any damage to equipment during the rental period, excluding normal wear and tear.'
        },
        {
          title: 'ACKNOWLEDGMENT:',
          content: 'By signing below, I confirm I have read this waiver, understand its terms, am at least 18 years old, and have authority to bind all participants.'
        }
      ]

      for (const section of sections) {
        doc.fontSize(10)
          .font('Helvetica-Bold')
          .text(section.title)
        doc.moveDown(0.3)
          .font('Helvetica')
          .text(section.content, { width: contentWidth })
        doc.moveDown(0.8)
      }

      doc.moveDown(0.5)

      // Signature section divider
      doc.moveTo(margin, doc.y)
        .lineTo(pageWidth - margin, doc.y)
        .stroke()

      doc.moveDown(1)

      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('SIGNATURE')

      doc.moveDown(0.5)

      // Add signature image if provided
      if (data.signatureData && data.signatureData.startsWith('data:image')) {
        try {
          // Extract base64 data from data URL
          const base64Data = data.signatureData.split(',')[1]
          if (!base64Data) {
            throw new Error('Invalid signature data format')
          }
          const signatureBuffer = Buffer.from(base64Data, 'base64')

          // Add the signature image
          doc.image(signatureBuffer, margin, doc.y, {
            width: 200,
            height: 60
          })
          doc.moveDown(4) // Move down past the image
        } catch (imgError) {
          console.error('Error adding signature image to PDF:', imgError)
          doc.fontSize(10)
            .font('Helvetica-Oblique')
            .text('[Signature on file]')
          doc.moveDown(1)
        }
      }

      // Signature line
      const lineY = doc.y
      doc.moveTo(margin, lineY)
        .lineTo(margin + 200, lineY)
        .stroke()

      doc.moveDown(0.3)
        .fontSize(10)
        .font('Helvetica')
        .text('Signature', margin)

      doc.moveDown(1)

      // Signer details
      const signedDate = new Date(data.signedAt).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      })

      const details = [
        { label: 'Signed by:', value: data.signerName },
        { label: 'Email:', value: data.signerEmail },
        { label: 'Phone:', value: data.signerPhone },
        { label: 'Date:', value: signedDate },
        { label: 'IP Address:', value: data.signerIP }
      ]

      for (const detail of details) {
        doc.font('Helvetica-Bold').text(detail.label, margin, doc.y, { continued: true })
        doc.font('Helvetica').text(` ${detail.value}`)
      }

      doc.moveDown(2)

      // Footer
      doc.fontSize(8)
        .fillColor('#808080')
        .text(
          'This document was electronically signed and has the same legal effect as a handwritten signature.',
          margin,
          700,
          { align: 'center', width: contentWidth }
        )
        .text(
          `Generated on ${new Date().toISOString()}`,
          { align: 'center', width: contentWidth }
        )

      // Finalize the PDF
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}
