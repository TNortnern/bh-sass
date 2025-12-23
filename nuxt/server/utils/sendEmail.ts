/**
 * Email utility for Nuxt server routes
 * Uses Brevo (Sendinblue) for transactional emails
 */

interface EmailRecipient {
  email: string
  name?: string
}

interface WaiverConfirmationParams {
  to: string
  signerName: string
  tenantName: string
  contractNumber: string
  signedAt: string
  pdfUrl?: string
}

/**
 * Send a simple email via Brevo API
 */
async function sendBrevoEmail(params: {
  to: EmailRecipient | EmailRecipient[]
  subject: string
  htmlContent: string
  textContent?: string
}): Promise<boolean> {
  const brevoApiKey = process.env.BREVO_API_KEY

  if (!brevoApiKey) {
    console.warn('BREVO_API_KEY not configured - email not sent')
    return false
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: {
          name: 'BouncePro',
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@bouncepro.com'
        },
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to send email via Brevo:', error)
    return false
  }
}

/**
 * Send waiver confirmation email to customer
 */
export async function sendWaiverConfirmationEmail(params: WaiverConfirmationParams): Promise<boolean> {
  const { to, signerName, tenantName, contractNumber, signedAt, pdfUrl } = params

  const signedDate = new Date(signedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  const pdfLink = pdfUrl
    ? `<p style="margin: 20px 0;"><a href="${pdfUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download Signed Waiver (PDF)</a></p>`
    : ''

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #f97316; margin: 0;">Waiver Signed Successfully</h1>
    <p style="color: #666; margin-top: 10px;">${tenantName}</p>
  </div>

  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #333;">Hello ${signerName},</h2>
    <p>Thank you for signing the liability waiver for ${tenantName}. This email confirms that your waiver has been received and recorded.</p>
  </div>

  <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Waiver Details</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #666;">Contract Number:</td>
        <td style="padding: 8px 0; font-weight: bold;">${contractNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Signed By:</td>
        <td style="padding: 8px 0; font-weight: bold;">${signerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Date Signed:</td>
        <td style="padding: 8px 0; font-weight: bold;">${signedDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Business:</td>
        <td style="padding: 8px 0; font-weight: bold;">${tenantName}</td>
      </tr>
    </table>
  </div>

  ${pdfLink}

  <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>Important:</strong> Please keep this email for your records. The waiver is legally binding and confirms your agreement to the terms and conditions outlined in the document.
    </p>
  </div>

  <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p>This is an automated message from ${tenantName}.</p>
    <p>If you have any questions, please contact the business directly.</p>
  </div>
</body>
</html>
`

  const textContent = `
Waiver Signed Successfully

Hello ${signerName},

Thank you for signing the liability waiver for ${tenantName}. This email confirms that your waiver has been received and recorded.

Waiver Details:
- Contract Number: ${contractNumber}
- Signed By: ${signerName}
- Date Signed: ${signedDate}
- Business: ${tenantName}

Please keep this email for your records. The waiver is legally binding and confirms your agreement to the terms and conditions outlined in the document.

If you have any questions, please contact the business directly.

This is an automated message from ${tenantName}.
`

  return sendBrevoEmail({
    to: { email: to, name: signerName },
    subject: `Waiver Signed - ${contractNumber} | ${tenantName}`,
    htmlContent,
    textContent
  })
}
