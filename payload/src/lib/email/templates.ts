/**
 * Email Templates for BouncePro
 * Professional HTML email templates with inline styles
 * Dark-mode friendly and mobile responsive
 */

export interface EmailTemplate {
  subject: string
  html: (params: Record<string, any>) => string
  text: (params: Record<string, any>) => string
}

/**
 * Base email wrapper with consistent branding
 */
const emailWrapper = (content: string, preheader?: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>BouncePro</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #1a1a1a !important; }
      .email-container { background-color: #2d2d2d !important; }
      .text-primary { color: #ffffff !important; }
      .text-secondary { color: #b3b3b3 !important; }
      .divider { border-color: #404040 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;" class="email-body">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;" class="email-body">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" class="email-container">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 2px solid #f0f0f0;" class="divider">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #6366f1; letter-spacing: -0.5px;">
                🎈 BouncePro
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #666666; font-weight: 500;" class="text-secondary">
                Professional Bounce House Rentals
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 2px solid #f0f0f0; background-color: #fafafa;" class="divider">
              <p style="margin: 0 0 12px; font-size: 14px; color: #666666;" class="text-secondary">
                <strong>BouncePro</strong> - Making Events Memorable
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;" class="text-secondary">
                This email was sent by BouncePro. If you have any questions, please contact your event organizer.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

/**
 * Booking Confirmation Template
 */
export const BOOKING_CONFIRMATION: EmailTemplate = {
  subject: 'Booking Confirmation - BouncePro',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Booking Confirmed! 🎉
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.customerName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Great news! Your bounce house rental has been confirmed. Get ready for an amazing event!
    </p>

    <div style="background-color: #f8f9ff; border-left: 4px solid #6366f1; padding: 20px; margin: 0 0 24px; border-radius: 4px;">
      <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
        Booking Details
      </h3>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Booking ID:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.bookingId}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Item:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.itemName}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Date:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.eventDate}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Time:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.eventTime}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Location:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.location}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0; padding-top: 12px; border-top: 1px solid #e0e0e0;" class="text-secondary"><strong>Total Amount:</strong></td>
          <td style="color: #6366f1; padding: 4px 0; padding-top: 12px; text-align: right; font-size: 18px; font-weight: 700; border-top: 1px solid #e0e0e0;">$${params.totalAmount}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #666666;" class="text-secondary">
      We'll send you a reminder 24 hours before your event. If you need to make any changes, please contact us as soon as possible.
    </p>

    <div style="text-align: center; margin: 32px 0 0;">
      <a href="${params.bookingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View Booking Details
      </a>
    </div>
  `, `Your booking #${params.bookingId} has been confirmed!`),

  text: (params) => `
BOOKING CONFIRMED!

Hi ${params.customerName},

Great news! Your bounce house rental has been confirmed.

BOOKING DETAILS
----------------
Booking ID: ${params.bookingId}
Item: ${params.itemName}
Date: ${params.eventDate}
Time: ${params.eventTime}
Location: ${params.location}
Total Amount: $${params.totalAmount}

We'll send you a reminder 24 hours before your event.

View your booking: ${params.bookingUrl}

- BouncePro Team
`
}

/**
 * Booking Reminder Template
 */
export const BOOKING_REMINDER: EmailTemplate = {
  subject: 'Reminder: Your Event is Tomorrow! - BouncePro',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Your Event is Tomorrow! ⏰
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.customerName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      This is a friendly reminder that your bounce house rental is scheduled for tomorrow. Everything is ready for a fantastic event!
    </p>

    <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 0 0 24px; border-radius: 4px;">
      <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
        Event Details
      </h3>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Item:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.itemName}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Date:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.eventDate}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Time:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.eventTime}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Location:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.location}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; margin: 0 0 24px; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0369a1;" class="text-primary">
        <strong>💡 Pro Tip:</strong> Please ensure the setup area is clear and accessible. Our team will arrive approximately 30 minutes before your event time.
      </p>
    </div>

    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #666666;" class="text-secondary">
      If you have any last-minute questions or need to make changes, please contact us immediately.
    </p>

    <div style="text-align: center; margin: 32px 0 0;">
      <a href="${params.bookingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View Booking Details
      </a>
    </div>
  `, `Reminder: Your event is tomorrow at ${params.eventTime}`),

  text: (params) => `
REMINDER: YOUR EVENT IS TOMORROW!

Hi ${params.customerName},

This is a friendly reminder that your bounce house rental is scheduled for tomorrow.

EVENT DETAILS
-------------
Item: ${params.itemName}
Date: ${params.eventDate}
Time: ${params.eventTime}
Location: ${params.location}

Pro Tip: Please ensure the setup area is clear and accessible. Our team will arrive approximately 30 minutes before your event time.

View your booking: ${params.bookingUrl}

- BouncePro Team
`
}

/**
 * Booking Cancelled Template
 */
export const BOOKING_CANCELLED: EmailTemplate = {
  subject: 'Booking Cancellation Confirmation - BouncePro',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Booking Cancelled
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.customerName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Your booking has been cancelled as requested. We're sorry we couldn't be part of your event this time.
    </p>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 0 0 24px; border-radius: 4px;">
      <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
        Cancelled Booking
      </h3>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Booking ID:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.bookingId}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Item:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.itemName}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Original Date:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.eventDate}</td>
        </tr>
        ${params.refundAmount ? `
        <tr>
          <td style="color: #666666; padding: 4px 0; padding-top: 12px; border-top: 1px solid #e0e0e0;" class="text-secondary"><strong>Refund Amount:</strong></td>
          <td style="color: #10b981; padding: 4px 0; padding-top: 12px; text-align: right; font-size: 18px; font-weight: 700; border-top: 1px solid #e0e0e0;">$${params.refundAmount}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.refundAmount ? `
    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #666666;" class="text-secondary">
      Your refund of <strong>$${params.refundAmount}</strong> will be processed within 5-7 business days and returned to your original payment method.
    </p>
    ` : ''}

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      We hope to serve you at your next event. Thank you for considering BouncePro!
    </p>
  `, `Booking #${params.bookingId} has been cancelled`),

  text: (params) => `
BOOKING CANCELLED

Hi ${params.customerName},

Your booking has been cancelled as requested.

CANCELLED BOOKING
-----------------
Booking ID: ${params.bookingId}
Item: ${params.itemName}
Original Date: ${params.eventDate}
${params.refundAmount ? `Refund Amount: $${params.refundAmount}` : ''}

${params.refundAmount ? `Your refund will be processed within 5-7 business days.` : ''}

We hope to serve you at your next event!

- BouncePro Team
`
}

/**
 * Payment Received Template
 */
export const PAYMENT_RECEIVED: EmailTemplate = {
  subject: 'Payment Received - BouncePro',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Payment Received 💳
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.customerName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Thank you! We've received your payment. Here's your receipt for your records.
    </p>

    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 24px; border-radius: 4px;">
      <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
        Payment Receipt
      </h3>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Payment ID:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.paymentId}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Date:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.paymentDate}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Method:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.paymentMethod}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Booking ID:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.bookingId}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0; padding-top: 12px; border-top: 1px solid #e0e0e0;" class="text-secondary"><strong>Amount Paid:</strong></td>
          <td style="color: #10b981; padding: 4px 0; padding-top: 12px; text-align: right; font-size: 20px; font-weight: 700; border-top: 1px solid #e0e0e0;">$${params.amount}</td>
        </tr>
        ${params.remainingBalance ? `
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Remaining Balance:</strong></td>
          <td style="color: #f59e0b; padding: 4px 0; text-align: right; font-weight: 600;">$${params.remainingBalance}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.remainingBalance ? `
    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; padding: 16px; margin: 0 0 24px; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #92400e;" class="text-primary">
        <strong>⚠️ Remaining Balance:</strong> You have a remaining balance of $${params.remainingBalance}. Please ensure this is paid before your event date.
      </p>
    </div>
    ` : `
    <div style="background-color: #f0fdf4; border: 1px solid #86efac; padding: 16px; margin: 0 0 24px; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #166534;" class="text-primary">
        <strong>✅ Paid in Full:</strong> Your booking is fully paid. We look forward to your event!
      </p>
    </div>
    `}

    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #666666;" class="text-secondary">
      Keep this email for your records. If you have any questions about this payment, please contact us.
    </p>

    <div style="text-align: center; margin: 32px 0 0;">
      <a href="${params.receiptUrl}" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Download Receipt
      </a>
    </div>
  `, `Payment of $${params.amount} received for booking #${params.bookingId}`),

  text: (params) => `
PAYMENT RECEIVED

Hi ${params.customerName},

Thank you! We've received your payment.

PAYMENT RECEIPT
---------------
Payment ID: ${params.paymentId}
Date: ${params.paymentDate}
Method: ${params.paymentMethod}
Booking ID: ${params.bookingId}
Amount Paid: $${params.amount}
${params.remainingBalance ? `Remaining Balance: $${params.remainingBalance}` : 'Status: PAID IN FULL'}

Download receipt: ${params.receiptUrl}

- BouncePro Team
`
}

/**
 * Password Reset Template
 */
export const PASSWORD_RESET: EmailTemplate = {
  subject: 'Password Reset Request - BouncePro',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Password Reset Request 🔐
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.userName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      We received a request to reset your password. Click the button below to create a new password.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${params.resetLink}" style="display: inline-block; padding: 16px 40px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; margin: 0 0 24px; border-radius: 4px;">
      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.6; color: #991b1b;" class="text-primary">
        <strong>⚠️ Security Notice:</strong>
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;" class="text-primary">
        This link will expire in <strong>1 hour</strong>. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
      </p>
    </div>

    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #666666;" class="text-secondary">
      If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p style="margin: 0 0 24px; font-size: 12px; line-height: 1.6; color: #999999; word-break: break-all; background-color: #f5f5f5; padding: 12px; border-radius: 4px;" class="text-secondary">
      ${params.resetLink}
    </p>
  `, `Reset your BouncePro password - link expires in 1 hour`),

  text: (params) => `
PASSWORD RESET REQUEST

Hi ${params.userName},

We received a request to reset your password. Click the link below to create a new password:

${params.resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

- BouncePro Team
`
}

/**
 * Welcome Template
 */
export const WELCOME: EmailTemplate = {
  subject: 'Welcome to BouncePro! 🎉',

  html: (params) => emailWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 24px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Welcome to BouncePro! 🎉
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Hi <strong>${params.userName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;" class="text-primary">
      Welcome to BouncePro! We're excited to help you manage your bounce house rental business more efficiently.
    </p>

    <div style="background-color: #f8f9ff; border-left: 4px solid #6366f1; padding: 20px; margin: 0 0 24px; border-radius: 4px;">
      <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
        Your Account Details
      </h3>

      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Business Name:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.tenantName}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Email:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.userEmail}</td>
        </tr>
        <tr>
          <td style="color: #666666; padding: 4px 0;" class="text-secondary"><strong>Plan:</strong></td>
          <td style="color: #1a1a1a; padding: 4px 0; text-align: right;" class="text-primary">${params.planName || 'Free Trial'}</td>
        </tr>
      </table>
    </div>

    <h3 style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; font-weight: 600;" class="text-primary">
      Quick Start Guide
    </h3>

    <div style="margin: 0 0 24px;">
      <div style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;" class="text-primary">
          <strong>1️⃣ Set up your inventory</strong><br>
          <span style="color: #666666;" class="text-secondary">Add your bounce houses and equipment to get started</span>
        </p>
      </div>
      <div style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;" class="text-primary">
          <strong>2️⃣ Create your first booking</strong><br>
          <span style="color: #666666;" class="text-secondary">Start managing your rentals and calendar</span>
        </p>
      </div>
      <div style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;" class="text-primary">
          <strong>3️⃣ Configure payment settings</strong><br>
          <span style="color: #666666;" class="text-secondary">Set up your payment methods and pricing</span>
        </p>
      </div>
      <div style="padding: 12px 0;">
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333333;" class="text-primary">
          <strong>4️⃣ Invite your team</strong><br>
          <span style="color: #666666;" class="text-secondary">Add team members to collaborate</span>
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${params.dashboardUrl}" style="display: inline-block; padding: 16px 40px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>

    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; margin: 24px 0 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0369a1;" class="text-primary">
        <strong>💡 Need Help?</strong> Our support team is here for you. Contact us anytime at <a href="mailto:support@bouncepro.com" style="color: #0369a1; text-decoration: underline;">support@bouncepro.com</a>
      </p>
    </div>
  `, `Welcome to BouncePro! Get started with your account.`),

  text: (params) => `
WELCOME TO BOUNCEPRO!

Hi ${params.userName},

Welcome to BouncePro! We're excited to help you manage your bounce house rental business.

YOUR ACCOUNT DETAILS
--------------------
Business Name: ${params.tenantName}
Email: ${params.userEmail}
Plan: ${params.planName || 'Free Trial'}

QUICK START GUIDE
-----------------
1. Set up your inventory - Add your bounce houses and equipment
2. Create your first booking - Start managing rentals
3. Configure payment settings - Set up payments and pricing
4. Invite your team - Add team members to collaborate

Get started: ${params.dashboardUrl}

Need help? Contact us at support@bouncepro.com

- BouncePro Team
`
}

/**
 * Export all templates
 */
export const emailTemplates = {
  BOOKING_CONFIRMATION,
  BOOKING_REMINDER,
  BOOKING_CANCELLED,
  PAYMENT_RECEIVED,
  PASSWORD_RESET,
  WELCOME,
}

export type EmailTemplateName = keyof typeof emailTemplates
