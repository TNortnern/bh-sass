/**
 * Email Templates for BouncePro - Multi-Variant Design System
 * Professional HTML email templates with 3 style variants:
 * - Modern Dark: Clean, editorial aesthetic with amber accents
 * - Classic Light: Traditional professional white background
 * - Bold Gradient: High contrast, party-friendly design
 */

export interface EmailTemplateVariant {
  id: string
  name: string
  subject: string
  html: (params: Record<string, any>) => string
  text: (params: Record<string, any>) => string
}

export interface EmailTemplateType {
  variants: EmailTemplateVariant[]
  defaultVariant: string
}

/**
 * Interpolate mustache-style variables in a template string
 * Replaces {{variableName}} with the corresponding value from data
 */
export function interpolate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match
  })
}

/**
 * Modern Dark Wrapper - "Midnight Glow" - Sophisticated dark theme with warm amber accents
 * Editorial, refined aesthetic with subtle depth and glowing highlights
 */
const modernDarkWrapper = (content: string, preheader?: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Helvetica, Arial, sans-serif; background-color: #0c0c0c; color: #e5e5e5;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>` : ''}

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0c0c0c;">
    <tr>
      <td style="padding: 0;">
        <!-- Top accent bar -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #f97316 0%, #fbbf24 50%, #f97316 100%);"></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 60px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">

          <!-- Header with glow effect -->
          <tr>
            <td style="padding: 0 0 48px 0; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <!-- Logo container - shows business logo if available -->
                    <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 18px; display: inline-block; box-shadow: 0 0 40px rgba(249, 115, 22, 0.4), 0 0 80px rgba(249, 115, 22, 0.2); overflow: hidden;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="80" height="80">
                        <tr>
                          <td align="center" valign="middle" style="font-size: 36px; color: #ffffff; background: url('{{businessLogo}}') center center / contain no-repeat;">
                            <span style="{{businessLogoHide}}">🏰</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -1px; color: #ffffff; line-height: 1.1;">
                      {{businessName}}
                    </h1>
                    <p style="margin: 12px 0 0; font-size: 14px; color: #737373; letter-spacing: 2px; text-transform: uppercase;">
                      Party Rentals
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Card with subtle border glow -->
          <tr>
            <td style="background-color: #171717; border-radius: 16px; padding: 0; border: 1px solid #262626; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(249, 115, 22, 0.1);">
              <!-- Card header accent -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%); border-radius: 16px 16px 0 0;"></td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 40px 44px 44px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 48px 20px 0; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <div style="width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #404040, transparent); margin: 0 auto;"></div>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 8px; font-size: 15px; color: #f97316; font-weight: 600;">
                {{businessName}}
              </p>
              <p style="margin: 0 0 16px; font-size: 13px; color: #525252; line-height: 1.7;">
                {{businessAddress}}<br>
                {{businessPhone}} · {{businessEmail}}
              </p>
              <p style="margin: 0; font-size: 12px; color: #404040; line-height: 1.5;">
                Making events unforgettable, one bounce at a time
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
 * Classic Light Wrapper - Traditional professional white background
 */
const classicLightWrapper = (content: string, preheader?: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f8f9fa; color: #212529;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>` : ''}

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dee2e6;">

          <!-- Header -->
          <tr>
            <td style="background-color: #3b82f6; padding: 32px 40px; text-align: center;">
              <!-- Logo container -->
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: #ffffff; border-radius: 12px; overflow: hidden; display: inline-block;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="64" height="64">
                  <tr>
                    <td align="center" valign="middle" style="font-size: 28px; color: #3b82f6; background: url('{{businessLogo}}') center center / contain no-repeat #ffffff;">
                      <span style="{{businessLogoHide}}">🏰</span>
                    </td>
                  </tr>
                </table>
              </div>
              <h1 style="margin: 0; font-size: 32px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">
                {{businessName}}
              </h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #dbeafe; font-style: italic;">
                Premium Party Equipment Rentals
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
            <td style="padding: 24px 40px; background-color: #f8f9fa; border-top: 2px solid #dee2e6; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #495057; font-weight: 600;">
                {{businessName}}
              </p>
              <p style="margin: 0 0 12px; font-size: 13px; color: #6c757d; line-height: 1.6;">
                {{businessAddress}}<br>
                Phone: {{businessPhone}} | Email: {{businessEmail}}
              </p>
              <p style="margin: 0; font-size: 11px; color: #adb5bd;">
                This email was sent by {{businessName}}. All rights reserved.
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
 * Bold Gradient Wrapper - "Sunset Energy" - Warm, celebratory, high-energy design
 * Vibrant orange gradient with playful party-themed aesthetic
 */
const boldGradientWrapper = (content: string, preheader?: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(160deg, #fef3c7 0%, #fed7aa 25%, #fdba74 50%, #fb923c 100%); color: #1c1917;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>` : ''}

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(160deg, #fef3c7 0%, #fed7aa 25%, #fdba74 50%, #fb923c 100%);">
    <tr>
      <td style="padding: 50px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">

          <!-- Decorative top element -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="font-size: 40px; padding: 0 8px;">🎈</td>
                  <td style="font-size: 48px; padding: 0 8px;">🎉</td>
                  <td style="font-size: 40px; padding: 0 8px;">🎈</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(234, 88, 12, 0.25), 0 8px 24px rgba(0, 0, 0, 0.1);">

                <!-- Header with gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 44px 40px 40px; text-align: center; border-radius: 24px 24px 0 0;">
                    <!-- Logo badge -->
                    <div style="width: 72px; height: 72px; margin: 0 auto 20px; background-color: rgba(255, 255, 255, 0.25); border-radius: 16px; overflow: hidden; display: inline-block;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="72" height="72">
                        <tr>
                          <td align="center" valign="middle" style="font-size: 32px; background: url('{{businessLogo}}') center center / contain no-repeat;">
                            <span style="{{businessLogoHide}}">🏰</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <h1 style="margin: 0; font-size: 38px; font-weight: 800; color: #ffffff; letter-spacing: -1px; text-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                      {{businessName}}
                    </h1>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px auto 0;">
                      <tr>
                        <td style="background-color: rgba(255, 255, 255, 0.25); border-radius: 20px; padding: 8px 20px;">
                          <p style="margin: 0; font-size: 13px; color: #ffffff; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                            Party Rental Experts
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 44px 40px;">
                    ${content}
                  </td>
                </tr>

                <!-- Footer inside card -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 16px; border: 2px dashed #fdba74;">
                      <tr>
                        <td style="padding: 24px; text-align: center;">
                          <p style="margin: 0 0 8px; font-size: 15px; color: #ea580c; font-weight: 700;">
                            {{businessName}}
                          </p>
                          <p style="margin: 0; font-size: 13px; color: #78716c; line-height: 1.7;">
                            {{businessAddress}}<br>
                            {{businessPhone}} · {{businessEmail}}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Bottom tagline -->
          <tr>
            <td style="padding: 32px 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #9a3412; font-weight: 600;">
                Let's make your next event unforgettable! 🎊
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

// ===================================
// BOOKING CONFIRMATION TEMPLATES
// ===================================

const BOOKING_CONFIRMATION_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Booking Confirmed – {{bookingId}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
        <tr>
          <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 10px 24px; border-radius: 100px;">
            <span style="font-size: 13px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px;">✓ Confirmed</span>
          </td>
        </tr>
      </table>
      <h2 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
        You're All Set!
      </h2>
    </div>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #a3a3a3;">
      Hey <strong style="color: #f97316;">{{customerName}}</strong>, your booking is confirmed. We can't wait to make your event amazing!
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #262626; border-radius: 12px; margin: 0 0 28px; border: 1px solid #333333;">
      <tr>
        <td style="padding: 28px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #737373; padding: 10px 0; border-bottom: 1px solid #333333;">Booking ID</td>
              <td style="color: #f97316; font-weight: 600; text-align: right; padding: 10px 0; border-bottom: 1px solid #333333; font-family: monospace; font-size: 13px;">{{bookingId}}</td>
            </tr>
            <tr>
              <td style="color: #737373; padding: 10px 0; border-bottom: 1px solid #333333;">Item</td>
              <td style="color: #e5e5e5; font-weight: 500; text-align: right; padding: 10px 0; border-bottom: 1px solid #333333;">{{itemName}}</td>
            </tr>
            <tr>
              <td style="color: #737373; padding: 10px 0; border-bottom: 1px solid #333333;">Event Date</td>
              <td style="color: #e5e5e5; font-weight: 500; text-align: right; padding: 10px 0; border-bottom: 1px solid #333333;">{{eventDate}}</td>
            </tr>
            <tr>
              <td style="color: #737373; padding: 10px 0; border-bottom: 1px solid #333333;">Time</td>
              <td style="color: #e5e5e5; font-weight: 500; text-align: right; padding: 10px 0; border-bottom: 1px solid #333333;">{{eventTime}}</td>
            </tr>
            <tr>
              <td style="color: #737373; padding: 10px 0;">Location</td>
              <td style="color: #e5e5e5; font-weight: 500; text-align: right; padding: 10px 0;">{{location}}</td>
            </tr>
          </table>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #404040;">
            <tr>
              <td style="color: #737373; font-size: 14px;">Total</td>
              <td style="color: #f97316; font-size: 26px; font-weight: 700; text-align: right; letter-spacing: -0.5px;">\${{totalAmount}}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 32px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 10px; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.35);">
            <a href="{{bookingUrl}}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
              View Booking Details
            </a>
          </td>
        </tr>
      </table>
    </div>

    <p style="margin: 28px 0 0; font-size: 13px; line-height: 1.6; color: #525252; text-align: center;">
      We'll send you a reminder 24 hours before your event.
    </p>
  `, `Booking #{{bookingId}} confirmed for {{eventDate}}`),

  text: (params) => `
BOOKING CONFIRMED ✓

Hey {{customerName}},

Your booking is confirmed! Here are the details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: {{bookingId}}
Item: {{itemName}}
Event Date: {{eventDate}}
Time: {{eventTime}}
Location: {{location}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: \${{totalAmount}}

View your booking: {{bookingUrl}}

We'll send you a reminder 24 hours before your event.

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_CONFIRMATION_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Booking Confirmation #{{bookingId}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #3b82f6; padding-bottom: 12px;">
      Booking Confirmation
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{customerName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      We are pleased to confirm your reservation. Thank you for choosing {{businessName}} for your upcoming event.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border: 2px solid #3b82f6; margin: 0 0 28px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px;">
            Reservation Details
          </h3>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
            <tr>
              <td style="color: #6c757d; padding: 6px 0; width: 40%;">Confirmation Number:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;"><strong>{{bookingId}}</strong></td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Equipment:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{itemName}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Event Date:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{eventDate}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Event Time:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{eventTime}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Delivery Address:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{location}}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 0 6px 0; border-top: 2px solid #dee2e6;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="color: #212529; font-size: 18px; font-weight: 600;">Total Amount:</td>
                    <td style="color: #3b82f6; font-size: 24px; font-weight: 700; text-align: right;">\${{totalAmount}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{bookingUrl}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
        View Booking Details
      </a>
    </div>

    <p style="margin: 28px 0 0; font-size: 14px; line-height: 1.7; color: #6c757d; font-style: italic;">
      A reminder will be sent to you 24 hours prior to your event. Should you have any questions or need to make changes to your reservation, please contact us at your earliest convenience.
    </p>
  `, `Booking confirmation #{{bookingId}} from {{businessName}}`),

  text: (params) => `
{{businessName}}
BOOKING CONFIRMATION

Dear {{customerName}},

We are pleased to confirm your reservation for {{eventDate}}.

RESERVATION DETAILS
─────────────────────────────
Confirmation Number: {{bookingId}}
Equipment: {{itemName}}
Event Date: {{eventDate}}
Event Time: {{eventTime}}
Delivery Address: {{location}}
─────────────────────────────
Total Amount: \${{totalAmount}}

View details: {{bookingUrl}}

A reminder will be sent 24 hours before your event.

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_CONFIRMATION_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: '🎉 CONFIRMED! Booking #{{bookingId}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
        <tr>
          <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 12px 28px; border-radius: 100px; box-shadow: 0 6px 20px rgba(34, 197, 94, 0.35);">
            <span style="font-size: 16px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">✓ Confirmed</span>
          </td>
        </tr>
      </table>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #1c1917; letter-spacing: -1px; line-height: 1.2;">
        Let's Party, {{customerName}}!
      </h2>
      <p style="margin: 12px 0 0; font-size: 18px; color: #57534e; font-weight: 600;">
        Your event is going to be amazing!
      </p>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 16px; margin: 0 0 28px; border: 2px solid #fdba74;">
      <tr>
        <td style="padding: 28px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
            <tr>
              <td style="color: #9a3412; font-weight: 700; padding: 10px 0; border-bottom: 1px dashed #fdba74; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Booking #</td>
              <td style="color: #1c1917; font-weight: 700; text-align: right; padding: 10px 0; border-bottom: 1px dashed #fdba74; font-family: monospace;">{{bookingId}}</td>
            </tr>
            <tr>
              <td style="color: #9a3412; font-weight: 700; padding: 10px 0; border-bottom: 1px dashed #fdba74; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Item</td>
              <td style="color: #1c1917; font-weight: 700; text-align: right; padding: 10px 0; border-bottom: 1px dashed #fdba74;">{{itemName}}</td>
            </tr>
            <tr>
              <td style="color: #9a3412; font-weight: 700; padding: 10px 0; border-bottom: 1px dashed #fdba74; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Date</td>
              <td style="color: #1c1917; font-weight: 700; text-align: right; padding: 10px 0; border-bottom: 1px dashed #fdba74;">{{eventDate}}</td>
            </tr>
            <tr>
              <td style="color: #9a3412; font-weight: 700; padding: 10px 0; border-bottom: 1px dashed #fdba74; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Time</td>
              <td style="color: #1c1917; font-weight: 700; text-align: right; padding: 10px 0; border-bottom: 1px dashed #fdba74;">{{eventTime}}</td>
            </tr>
            <tr>
              <td style="color: #9a3412; font-weight: 700; padding: 10px 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Location</td>
              <td style="color: #1c1917; font-weight: 700; text-align: right; padding: 10px 0;">{{location}}</td>
            </tr>
          </table>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <tr>
              <td style="color: #1c1917; font-size: 16px; font-weight: 700;">Total</td>
              <td style="text-align: right;">
                <span style="color: #ea580c; font-size: 28px; font-weight: 800;">\${{totalAmount}}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 28px 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
        <tr>
          <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);">
            <a href="{{bookingUrl}}" style="display: inline-block; padding: 16px 44px; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 15px; letter-spacing: 0.5px; text-transform: uppercase;">
              View My Booking
            </a>
          </td>
        </tr>
      </table>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef3c7; border-radius: 12px; border: 1px solid #fde68a;">
      <tr>
        <td style="padding: 16px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
            ⏰ We'll remind you 24 hours before the big day!
          </p>
        </td>
      </tr>
    </table>
  `, `CONFIRMED! Your booking #{{bookingId}} for {{eventDate}}`),

  text: (params) => `
🎉 BOOKING CONFIRMED! 🎉

Let's Party, {{customerName}}!

Your event is going to be EPIC!

═══════════════════════════════
BOOKING #{{bookingId}}
═══════════════════════════════
WHAT: {{itemName}}
WHEN: {{eventDate}}
TIME: {{eventTime}}
WHERE: {{location}}
═══════════════════════════════
TOTAL: \${{totalAmount}}
═══════════════════════════════

👉 VIEW BOOKING: {{bookingUrl}}

⏰ We'll remind you 24 hours before the big day!

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// BOOKING REMINDER TEMPLATES
// ===================================

const BOOKING_REMINDER_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Tomorrow: {{itemName}} Delivery',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px;">⏰ Reminder</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Tomorrow's the Day!
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{customerName}}</strong>, your rental is scheduled for tomorrow. Everything's ready to go!
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Item</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Date</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Time</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{eventTime}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Location</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{location}}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #0f172a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
        <strong style="color: #f59e0b;">💡 Quick Reminder:</strong><br>
        Please ensure the setup area is clear and accessible. Our team will arrive approximately 30 minutes before your event time.
      </p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="{{bookingUrl}}" style="display: inline-block; padding: 18px 48px; background-color: #f59e0b; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
        View Details
      </a>
    </div>
  `, `Reminder: {{itemName}} delivery tomorrow at {{eventTime}}`),

  text: (params) => `
⏰ REMINDER - TOMORROW!

Hey {{customerName}},

Your rental is scheduled for tomorrow!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Item: {{itemName}}
Date: {{eventDate}}
Time: {{eventTime}}
Location: {{location}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Reminder: Please ensure the setup area is clear and accessible. Our team will arrive approximately 30 minutes before your event time.

View booking: {{bookingUrl}}

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_REMINDER_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Event Reminder - Tomorrow at {{eventTime}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #f59e0b; padding-bottom: 12px;">
      Event Reminder
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{customerName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      This is a friendly reminder that your equipment rental is scheduled for tomorrow. We look forward to serving you!
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff7ed; border: 2px solid #f59e0b; margin: 0 0 28px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px;">
            Event Details
          </h3>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
            <tr>
              <td style="color: #6c757d; padding: 6px 0; width: 40%;">Equipment:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{itemName}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Date:</td>
              <td style="color: #f59e0b; font-weight: 700; padding: 6px 0;">{{eventDate}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Time:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{eventTime}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Location:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{location}}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="background-color: #e7f3ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 0 0 28px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #1e40af;">
        <strong>Important:</strong> Our delivery team will arrive approximately 30 minutes prior to your scheduled event time. Please ensure the setup area is accessible and clear of obstacles.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{bookingUrl}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
        View Booking Details
      </a>
    </div>
  `, `Reminder: Event tomorrow at {{eventTime}}`),

  text: (params) => `
{{businessName}}
EVENT REMINDER

Dear {{customerName}},

Your equipment rental is scheduled for tomorrow.

EVENT DETAILS
─────────────────────────────
Equipment: {{itemName}}
Date: {{eventDate}}
Time: {{eventTime}}
Location: {{location}}
─────────────────────────────

Important: Our delivery team will arrive approximately 30 minutes prior to your scheduled event time. Please ensure the setup area is accessible.

View details: {{bookingUrl}}

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_REMINDER_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: '⏰ TOMORROW! Get Ready to Party!',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 100px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);">
        <span style="font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">⏰ TOMORROW</span>
      </div>
      <h2 style="margin: 0; font-size: 44px; font-weight: 900; color: #1a202c; letter-spacing: -1.5px; line-height: 1.2;">
        Party Time is<br>Almost Here! 🎊
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center; font-weight: 600;">
      Hey {{customerName}}, we're coming tomorrow!
    </p>

    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 36px; margin: 0 0 32px; border: 4px solid #3b82f6;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 16px; line-height: 2.2;">
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">WHAT</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">WHEN</td>
          <td style="color: #f59e0b; font-weight: 900; text-align: right; font-size: 20px; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">TIME</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{eventTime}}</td>
        </tr>
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">WHERE</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{location}}</td>
        </tr>
      </table>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border: 3px solid #f59e0b;">
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #92400e; font-weight: 700; text-align: center;">
        💡 PRO TIP: Clear the setup area! We'll arrive 30 minutes early to get everything ready.
      </p>
    </div>

    <div style="text-align: center; margin: 40px 0 32px;">
      <a href="{{bookingUrl}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 100px; font-weight: 900; font-size: 18px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4); border: 3px solid #ffffff;">
        VIEW DETAILS →
      </a>
    </div>
  `, `TOMORROW! {{itemName}} delivery at {{eventTime}}`),

  text: (params) => `
⏰ TOMORROW! PARTY TIME IS ALMOST HERE! 🎊

Hey {{customerName}}, we're coming tomorrow!

═══════════════════════════════
WHAT: {{itemName}}
WHEN: {{eventDate}}
TIME: {{eventTime}}
WHERE: {{location}}
═══════════════════════════════

💡 PRO TIP: Clear the setup area! We'll arrive 30 minutes early to get everything ready.

👉 VIEW DETAILS: {{bookingUrl}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// BOOKING CANCELLED TEMPLATES
// ===================================

const BOOKING_CANCELLED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Booking Cancelled – {{bookingId}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #475569; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">Cancelled</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Booking Cancelled
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{customerName}}</strong>, your booking has been cancelled as requested. We're sorry we can't be part of your event this time.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Booking ID</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding: 8px 0;">{{bookingId}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Item</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Original Date</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        ${params.refundAmount ? `
        <tr>
          <td colspan="2" style="padding: 16px 0 8px 0; border-top: 2px solid #475569;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="color: #94a3b8; font-size: 16px;">Refund</td>
                <td style="color: #10b981; font-size: 28px; font-weight: 900; text-align: right;">\${{refundAmount}}</td>
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.refundAmount ? `
    <div style="background-color: #0f172a; border-left: 4px solid #10b981; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
        <strong style="color: #10b981;">Refund Processing:</strong><br>
        Your refund of <strong style="color: #10b981;">\${{refundAmount}}</strong> will be processed within 5-7 business days to your original payment method.
      </p>
    </div>
    ` : ''}

    <p style="margin: 32px 0 0; font-size: 16px; line-height: 1.7; color: #94a3b8; text-align: center;">
      We hope to serve you at your next event!
    </p>
  `, `Booking #{{bookingId}} has been cancelled`),

  text: (params) => `
BOOKING CANCELLED

Hey {{customerName}},

Your booking has been cancelled as requested.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: {{bookingId}}
Item: {{itemName}}
Original Date: {{eventDate}}
${params.refundAmount ? `Refund: \$${params.refundAmount}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${params.refundAmount ? `Your refund will be processed within 5-7 business days.\n\n` : ''}We hope to serve you at your next event!

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_CANCELLED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Cancellation Confirmation #{{bookingId}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #6c757d; padding-bottom: 12px;">
      Cancellation Confirmation
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{customerName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      This is to confirm that your booking has been cancelled as requested. We regret that we cannot be part of your event on this occasion.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border: 2px solid #6c757d; margin: 0 0 28px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: 1px;">
            Cancelled Booking
          </h3>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
            <tr>
              <td style="color: #6c757d; padding: 6px 0; width: 40%;">Booking Number:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{bookingId}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Equipment:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{itemName}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Original Date:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{eventDate}}</td>
            </tr>
            ${params.refundAmount ? `
            <tr>
              <td colspan="2" style="padding: 12px 0 6px 0; border-top: 2px solid #dee2e6;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="color: #212529; font-size: 18px; font-weight: 600;">Refund Amount:</td>
                    <td style="color: #10b981; font-size: 24px; font-weight: 700; text-align: right;">\${{refundAmount}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    ${params.refundAmount ? `
    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 28px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #065f46;">
        <strong>Refund Processing:</strong> Your refund of <strong>\${{refundAmount}}</strong> will be credited to your original payment method within 5-7 business days.
      </p>
    </div>
    ` : ''}

    <p style="margin: 28px 0 0; font-size: 16px; line-height: 1.8; color: #495057;">
      We hope to have the opportunity to serve you at your next event. Thank you for your understanding.
    </p>
  `, `Cancellation confirmation for booking #{{bookingId}}`),

  text: (params) => `
{{businessName}}
CANCELLATION CONFIRMATION

Dear {{customerName}},

This confirms that your booking has been cancelled.

CANCELLED BOOKING
─────────────────────────────
Booking Number: {{bookingId}}
Equipment: {{itemName}}
Original Date: {{eventDate}}
${params.refundAmount ? `Refund Amount: \$${params.refundAmount}` : ''}
─────────────────────────────

${params.refundAmount ? `Your refund will be processed within 5-7 business days.\n\n` : ''}We hope to serve you at your next event.

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const BOOKING_CANCELLED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Booking Cancelled #{{bookingId}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #64748b 0%, #475569 100%); border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">CANCELLED</span>
      </div>
      <h2 style="margin: 0; font-size: 44px; font-weight: 900; color: #1a202c; letter-spacing: -1.5px; line-height: 1.2;">
        We'll Miss You,<br>{{customerName}}
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center; font-weight: 600;">
      Your booking has been cancelled.
    </p>

    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 16px; padding: 36px; margin: 0 0 32px; border: 4px solid #9ca3af;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 16px; line-height: 2.2;">
        <tr>
          <td style="color: #4b5563; font-weight: 700; padding: 8px 0;">BOOKING #</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{bookingId}}</td>
        </tr>
        <tr>
          <td style="color: #4b5563; font-weight: 700; padding: 8px 0;">ITEM</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #4b5563; font-weight: 700; padding: 8px 0;">DATE</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        ${params.refundAmount ? `
        <tr>
          <td colspan="2" style="padding: 20px 0 12px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td style="color: #1a202c; font-size: 20px; font-weight: 900;">REFUND</td>
                <td style="text-align: right;">
                  <span style="color: #10b981; font-size: 36px; font-weight: 900; line-height: 1;">\${{refundAmount}}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.refundAmount ? `
    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border: 3px solid #10b981;">
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #065f46; font-weight: 700; text-align: center;">
        💰 Your refund of <span style="font-size: 20px;">\${{refundAmount}}</span> will be processed in 5-7 business days!
      </p>
    </div>
    ` : ''}

    <div style="background-color: #f7fafc; border-radius: 12px; padding: 24px; text-align: center;">
      <p style="margin: 0; font-size: 18px; line-height: 1.6; color: #4a5568; font-weight: 600;">
        We hope to party with you next time! 🎉
      </p>
    </div>
  `, `Booking #{{bookingId}} cancelled`),

  text: (params) => `
BOOKING CANCELLED

We'll miss you, {{customerName}}!

Your booking has been cancelled.

═══════════════════════════════
BOOKING #{{bookingId}}
═══════════════════════════════
ITEM: {{itemName}}
DATE: {{eventDate}}
${params.refundAmount ? `REFUND: \$${params.refundAmount}` : ''}
═══════════════════════════════

${params.refundAmount ? `💰 Your refund will be processed in 5-7 business days!\n\n` : ''}We hope to party with you next time! 🎉

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// PAYMENT RECEIVED TEMPLATES
// ===================================

const PAYMENT_RECEIVED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Payment Received – $' + '{{amount}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">✓ Paid</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Payment Received
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Thanks <strong style="color: #f59e0b;">{{customerName}}</strong>! We've received your payment.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Payment ID</td>
          <td style="color: #ffffff; font-weight: 700; text-align: right; padding: 8px 0;">{{paymentId}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Date</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{paymentDate}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Method</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{paymentMethod}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Booking</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{bookingId}}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 16px 0 8px 0; border-top: 2px solid #475569;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="color: #94a3b8; font-size: 16px;">Amount Paid</td>
                <td style="color: #10b981; font-size: 28px; font-weight: 900; text-align: right;">${'$'}{{amount}}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${params.remainingBalance ? `
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Remaining Balance</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 8px 0; font-size: 18px;">${'$'}{{remainingBalance}}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.remainingBalance ? `
    <div style="background-color: #0f172a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
        <strong style="color: #f59e0b;">⚠️ Balance Due:</strong><br>
        You have a remaining balance of <strong style="color: #f59e0b;">${'$'}{{remainingBalance}}</strong>. Please pay before your event date.
      </p>
    </div>
    ` : `
    <div style="background-color: #0f172a; border-left: 4px solid #10b981; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
        <strong style="color: #10b981;">✅ Paid in Full!</strong><br>
        Your booking is fully paid. We're all set for your event!
      </p>
    </div>
    `}

    <div style="text-align: center; margin: 40px 0;">
      <a href="{{receiptUrl}}" style="display: inline-block; padding: 18px 48px; background-color: #f59e0b; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
        Download Receipt
      </a>
    </div>
  `, 'Payment of $' + '{{amount}}' + ' received for booking #' + '{{bookingId}}'),

  text: (params) => `
✓ PAYMENT RECEIVED

Thanks {{customerName}}!

We've received your payment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment ID: {{paymentId}}
Date: {{paymentDate}}
Method: {{paymentMethod}}
Booking: {{bookingId}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Paid: ${'$'}{{amount}}
${params.remainingBalance ? `Balance Due: ${'$'}${params.remainingBalance}` : 'Status: PAID IN FULL ✅'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Download receipt: {{receiptUrl}}

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PAYMENT_RECEIVED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Payment Receipt #{{paymentId}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #10b981; padding-bottom: 12px;">
      Payment Receipt
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{customerName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      Thank you for your payment. We have successfully received and processed your transaction.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0fdf4; border: 2px solid #10b981; margin: 0 0 28px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">
            Payment Details
          </h3>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
            <tr>
              <td style="color: #6c757d; padding: 6px 0; width: 40%;">Receipt Number:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{paymentId}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Payment Date:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{paymentDate}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Payment Method:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{paymentMethod}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Booking Reference:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{bookingId}}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 0 6px 0; border-top: 2px solid #d1fae5;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="color: #212529; font-size: 18px; font-weight: 600;">Amount Paid:</td>
                    <td style="color: #10b981; font-size: 24px; font-weight: 700; text-align: right;">${'$'}{{amount}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${params.remainingBalance ? `
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Remaining Balance:</td>
              <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 6px 0; font-size: 18px;">${'$'}{{remainingBalance}}</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    ${params.remainingBalance ? `
    <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 0 0 28px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #92400e;">
        <strong>Outstanding Balance:</strong> A balance of <strong>${'$'}{{remainingBalance}}</strong> remains. Please ensure this is settled prior to your event date.
      </p>
    </div>
    ` : `
    <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 0 0 28px;">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #065f46;">
        <strong>Payment Complete:</strong> Your booking is fully paid. Thank you for your business.
      </p>
    </div>
    `}

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{receiptUrl}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
        Download Receipt
      </a>
    </div>
  `, 'Payment receipt #{{paymentId}} from {{businessName}}'),

  text: (params) => `
{{businessName}}
PAYMENT RECEIPT

Dear {{customerName}},

Thank you for your payment.

PAYMENT DETAILS
─────────────────────────────
Receipt Number: {{paymentId}}
Payment Date: {{paymentDate}}
Payment Method: {{paymentMethod}}
Booking Reference: {{bookingId}}
─────────────────────────────
Amount Paid: ${'$'}{{amount}}
${params.remainingBalance ? `Remaining Balance: ${'$'}${params.remainingBalance}` : 'Status: PAID IN FULL'}
─────────────────────────────

Download receipt: {{receiptUrl}}

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PAYMENT_RECEIVED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: '💰 Payment Received - $' + '{{amount}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 100px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
        <span style="font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">✓ PAID</span>
      </div>
      <h2 style="margin: 0; font-size: 44px; font-weight: 900; color: #1a202c; letter-spacing: -1.5px; line-height: 1.2;">
        Thanks for<br>Your Payment! 💰
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center; font-weight: 600;">
      We got it, {{customerName}}!
    </p>

    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 16px; padding: 36px; margin: 0 0 32px; border: 4px solid #10b981;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 16px; line-height: 2.2;">
        <tr>
          <td style="color: #065f46; font-weight: 700; padding: 8px 0;">RECEIPT #</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{paymentId}}</td>
        </tr>
        <tr>
          <td style="color: #065f46; font-weight: 700; padding: 8px 0;">DATE</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{paymentDate}}</td>
        </tr>
        <tr>
          <td style="color: #065f46; font-weight: 700; padding: 8px 0;">METHOD</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{paymentMethod}}</td>
        </tr>
        <tr>
          <td style="color: #065f46; font-weight: 700; padding: 8px 0;">BOOKING</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{bookingId}}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 20px 0 12px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <tr>
                <td style="color: #1a202c; font-size: 20px; font-weight: 900;">PAID</td>
                <td style="text-align: right;">
                  <span style="color: #10b981; font-size: 36px; font-weight: 900; line-height: 1;">${'$'}{{amount}}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${params.remainingBalance ? `
        <tr>
          <td style="color: #065f46; font-weight: 700; padding: 8px 0;">BALANCE</td>
          <td style="color: #f59e0b; font-weight: 900; text-align: right; padding: 8px 0; font-size: 20px;">${'$'}{{remainingBalance}}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${params.remainingBalance ? `
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border: 3px solid #f59e0b;">
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #92400e; font-weight: 700; text-align: center;">
        ⚠️ Balance Due: <span style="font-size: 20px;">${'$'}{{remainingBalance}}</span> - Pay before your event!
      </p>
    </div>
    ` : `
    <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border: 3px solid #10b981;">
      <p style="margin: 0; font-size: 18px; line-height: 1.6; color: #065f46; font-weight: 900; text-align: center;">
        ✅ PAID IN FULL! You're all set! 🎉
      </p>
    </div>
    `}

    <div style="text-align: center; margin: 40px 0 32px;">
      <a href="{{receiptUrl}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 100px; font-weight: 900; font-size: 18px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4); border: 3px solid #ffffff;">
        GET RECEIPT →
      </a>
    </div>
  `, 'Payment received: $' + '{{amount}}' + ' for booking #' + '{{bookingId}}'),

  text: (params) => `
💰 PAYMENT RECEIVED!

Thanks {{customerName}}! We got it!

═══════════════════════════════
RECEIPT #{{paymentId}}
═══════════════════════════════
DATE: {{paymentDate}}
METHOD: {{paymentMethod}}
BOOKING: {{bookingId}}
═══════════════════════════════
PAID: ${'$'}{{amount}}
${params.remainingBalance ? `BALANCE: ${'$'}${params.remainingBalance}` : 'STATUS: PAID IN FULL ✅'}
═══════════════════════════════

👉 GET RECEIPT: {{receiptUrl}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// PASSWORD RESET TEMPLATES
// ===================================

const PASSWORD_RESET_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Reset Your Password',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #475569; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 1px;">🔐 Security</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Reset Your Password
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, we got your password reset request.
    </p>

    <div style="text-align: center; margin: 40px 0;">
      <a href="{{resetLink}}" style="display: inline-block; padding: 18px 48px; background-color: #f59e0b; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
        Reset Password
      </a>
    </div>

    <div style="background-color: #0f172a; border-left: 4px solid #ef4444; border-radius: 8px; padding: 24px; margin: 32px 0;">
      <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.7; color: #cbd5e1;">
        <strong style="color: #ef4444;">⚠️ Security Notice:</strong>
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #94a3b8;">
        This link expires in <strong style="color: #ef4444;">1 hour</strong>. If you didn't request this, ignore this email.
      </p>
    </div>

    <div style="background-color: #334155; border-radius: 8px; padding: 20px; margin: 24px 0 0;">
      <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
        Or copy this link:
      </p>
      <p style="margin: 0; font-size: 13px; color: #94a3b8; word-break: break-all; font-family: monospace;">
        {{resetLink}}
      </p>
    </div>
  `, `Reset your password - link expires in 1 hour`),

  text: (params) => `
🔐 RESET YOUR PASSWORD

Hey {{userName}},

We got your password reset request.

Reset your password here:
{{resetLink}}

⚠️ This link expires in 1 hour.

If you didn't request this, ignore this email.

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PASSWORD_RESET_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Password Reset Request',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #3b82f6; padding-bottom: 12px;">
      Password Reset Request
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      We have received a request to reset the password for your account. To proceed with resetting your password, please click the button below.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{resetLink}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
        Reset Password
      </a>
    </div>

    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 28px 0;">
      <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.7; color: #991b1b; font-weight: 600;">
        Important Security Information:
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #991b1b;">
        This password reset link will expire in <strong>one hour</strong>. If you did not request this password reset, please disregard this email and contact our support team if you have any concerns.
      </p>
    </div>

    <p style="margin: 28px 0 12px; font-size: 14px; line-height: 1.8; color: #6c757d;">
      If the button above does not work, please copy and paste the following link into your web browser:
    </p>

    <p style="margin: 0; font-size: 12px; color: #adb5bd; word-break: break-all; background-color: #f8f9fa; padding: 12px; border-radius: 4px; font-family: monospace;">
      {{resetLink}}
    </p>
  `, `Password reset request from {{businessName}}`),

  text: (params) => `
{{businessName}}
PASSWORD RESET REQUEST

Dear {{userName}},

We have received a request to reset your password.

Reset your password:
{{resetLink}}

IMPORTANT: This link expires in one hour.

If you did not request this, please disregard this email.

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PASSWORD_RESET_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: '🔐 Reset Your Password Now',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #64748b 0%, #475569 100%); border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">🔐 SECURITY</span>
      </div>
      <h2 style="margin: 0; font-size: 44px; font-weight: 900; color: #1a202c; letter-spacing: -1.5px; line-height: 1.2;">
        Reset Your<br>Password
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center; font-weight: 600;">
      Hey {{userName}}, let's get you back in!
    </p>

    <div style="text-align: center; margin: 40px 0 32px;">
      <a href="{{resetLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 100px; font-weight: 900; font-size: 18px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 12px 40px rgba(239, 68, 68, 0.4); border: 3px solid #ffffff;">
        RESET NOW →
      </a>
    </div>

    <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border: 3px solid #ef4444;">
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #991b1b; font-weight: 700; text-align: center;">
        ⚠️ Link expires in <span style="font-size: 20px;">1 HOUR</span>!<br>
        <span style="font-size: 14px; font-weight: 600;">Didn't request this? Ignore this email.</span>
      </p>
    </div>

    <div style="background-color: #f7fafc; border-radius: 12px; padding: 20px;">
      <p style="margin: 0 0 8px; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">
        Or copy this link:
      </p>
      <p style="margin: 0; font-size: 13px; color: #475569; word-break: break-all; font-family: monospace;">
        {{resetLink}}
      </p>
    </div>
  `, `Reset your password - expires in 1 hour`),

  text: (params) => `
🔐 RESET YOUR PASSWORD

Hey {{userName}}, let's get you back in!

👉 RESET NOW: {{resetLink}}

⚠️ Link expires in 1 HOUR!

Didn't request this? Ignore this email.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// WELCOME TEMPLATES
// ===================================

const WELCOME_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Welcome to {{businessName}}!',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">🎉 Welcome</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Welcome Aboard!
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, we're excited to have you with {{businessName}}!
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Business</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 8px 0;">{{tenantName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Email</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{userEmail}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Plan</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{planName}}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #0f172a; border-radius: 8px; padding: 28px; margin: 0 0 32px;">
      <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #f59e0b;">Quick Start Guide</h3>

      <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #334155;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          <strong style="color: #ffffff;">1️⃣ Set up inventory</strong><br>
          <span style="font-size: 14px; color: #94a3b8;">Add your bounce houses and equipment</span>
        </p>
      </div>

      <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #334155;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          <strong style="color: #ffffff;">2️⃣ Create bookings</strong><br>
          <span style="font-size: 14px; color: #94a3b8;">Start managing your rentals</span>
        </p>
      </div>

      <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #334155;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          <strong style="color: #ffffff;">3️⃣ Configure payments</strong><br>
          <span style="font-size: 14px; color: #94a3b8;">Set up your payment methods</span>
        </p>
      </div>

      <div>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
          <strong style="color: #ffffff;">4️⃣ Invite your team</strong><br>
          <span style="font-size: 14px; color: #94a3b8;">Add team members to collaborate</span>
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 18px 48px; background-color: #f59e0b; color: #1e293b; text-decoration: none; border-radius: 8px; font-weight: 800; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);">
        Go to Dashboard
      </a>
    </div>
  `, `Welcome to {{businessName}}! Get started now.`),

  text: (params) => `
🎉 WELCOME ABOARD!

Hey {{userName}},

We're excited to have you with {{businessName}}!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Business: {{tenantName}}
Email: {{userEmail}}
Plan: {{planName}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK START GUIDE
1️⃣ Set up inventory - Add your equipment
2️⃣ Create bookings - Manage your rentals
3️⃣ Configure payments - Set up payment methods
4️⃣ Invite your team - Add team members

👉 Go to Dashboard: {{dashboardUrl}}

— {{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const WELCOME_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Welcome to {{businessName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; font-weight: 600; color: #212529; border-bottom: 3px solid #10b981; padding-bottom: 12px;">
      Welcome to {{businessName}}
    </h2>

    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.8; color: #495057;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 28px; font-size: 16px; line-height: 1.8; color: #495057;">
      We are delighted to welcome you to {{businessName}}. Thank you for choosing our services for your party equipment rental needs.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border: 2px solid #3b82f6; margin: 0 0 28px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px;">
            Account Information
          </h3>

          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
            <tr>
              <td style="color: #6c757d; padding: 6px 0; width: 40%;">Business Name:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{tenantName}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Email Address:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{userEmail}}</td>
            </tr>
            <tr>
              <td style="color: #6c757d; padding: 6px 0;">Subscription Plan:</td>
              <td style="color: #212529; font-weight: 600; padding: 6px 0;">{{planName}}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #212529;">
      Getting Started
    </h3>

    <div style="margin-bottom: 16px; padding: 16px; background-color: #f8f9fa; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #212529;">
        <strong>1. Set Up Your Inventory</strong><br>
        <span style="color: #6c757d;">Begin by adding your bounce houses and party equipment to the system.</span>
      </p>
    </div>

    <div style="margin-bottom: 16px; padding: 16px; background-color: #f8f9fa; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #212529;">
        <strong>2. Create Your First Booking</strong><br>
        <span style="color: #6c757d;">Start managing your rentals and calendar effectively.</span>
      </p>
    </div>

    <div style="margin-bottom: 16px; padding: 16px; background-color: #f8f9fa; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #212529;">
        <strong>3. Configure Payment Settings</strong><br>
        <span style="color: #6c757d;">Set up your preferred payment methods and pricing structure.</span>
      </p>
    </div>

    <div style="margin-bottom: 28px; padding: 16px; background-color: #f8f9fa; border-left: 4px solid #3b82f6;">
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #212529;">
        <strong>4. Invite Your Team</strong><br>
        <span style="color: #6c757d;">Add team members to collaborate and manage your business.</span>
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
        Access Dashboard
      </a>
    </div>
  `, `Welcome to {{businessName}}`),

  text: (params) => `
{{businessName}}
WELCOME

Dear {{userName}},

We are delighted to welcome you to {{businessName}}.

ACCOUNT INFORMATION
─────────────────────────────
Business Name: {{tenantName}}
Email Address: {{userEmail}}
Subscription Plan: {{planName}}
─────────────────────────────

GETTING STARTED

1. Set Up Your Inventory
   Add your bounce houses and party equipment.

2. Create Your First Booking
   Start managing your rentals and calendar.

3. Configure Payment Settings
   Set up payment methods and pricing.

4. Invite Your Team
   Add team members to collaborate.

Access your dashboard: {{dashboardUrl}}

Sincerely,
{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const WELCOME_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: '🎉 WELCOME! Let\'s Get This Party Started!',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 36px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 100px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);">
        <span style="font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">🎉 WELCOME</span>
      </div>
      <h2 style="margin: 0; font-size: 44px; font-weight: 900; color: #1a202c; letter-spacing: -1.5px; line-height: 1.2;">
        Let's Get This<br>Party Started! 🎊
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 20px; line-height: 1.6; color: #4a5568; text-align: center; font-weight: 600;">
      Welcome {{userName}}! Ready to rock?
    </p>

    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 16px; padding: 36px; margin: 0 0 32px; border: 4px solid #3b82f6;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 16px; line-height: 2.2;">
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">BUSINESS</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{tenantName}}</td>
        </tr>
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">EMAIL</td>
          <td style="color: #1a202c; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{userEmail}}</td>
        </tr>
        <tr>
          <td style="color: #1e3a8a; font-weight: 700; padding: 8px 0;">PLAN</td>
          <td style="color: #f59e0b; font-weight: 900; text-align: right; font-size: 18px; padding: 8px 0;">{{planName}}</td>
        </tr>
      </table>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 32px; margin: 0 0 32px; border: 4px solid #f59e0b;">
      <h3 style="margin: 0 0 24px; font-size: 24px; font-weight: 900; color: #92400e; text-align: center; text-transform: uppercase; letter-spacing: 1px;">
        Quick Start 🚀
      </h3>

      <div style="background-color: #ffffff; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1a202c; font-weight: 700;">
          1️⃣ SET UP INVENTORY<br>
          <span style="font-size: 14px; font-weight: 600; color: #4a5568;">Add your awesome equipment</span>
        </p>
      </div>

      <div style="background-color: #ffffff; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1a202c; font-weight: 700;">
          2️⃣ CREATE BOOKINGS<br>
          <span style="font-size: 14px; font-weight: 600; color: #4a5568;">Start taking reservations</span>
        </p>
      </div>

      <div style="background-color: #ffffff; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1a202c; font-weight: 700;">
          3️⃣ SETUP PAYMENTS<br>
          <span style="font-size: 14px; font-weight: 600; color: #4a5568;">Get paid faster</span>
        </p>
      </div>

      <div style="background-color: #ffffff; border-radius: 12px; padding: 16px;">
        <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #1a202c; font-weight: 700;">
          4️⃣ INVITE TEAM<br>
          <span style="font-size: 14px; font-weight: 600; color: #4a5568;">Collaborate and conquer</span>
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0 32px;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 100px; font-weight: 900; font-size: 18px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 12px 40px rgba(239, 68, 68, 0.4); border: 3px solid #ffffff;">
        LET'S GO! →
      </a>
    </div>
  `, `Welcome {{userName}}! Let's get this party started!`),

  text: (params) => `
🎉 WELCOME! LET'S GET THIS PARTY STARTED! 🎊

Welcome {{userName}}! Ready to rock?

═══════════════════════════════
BUSINESS: {{tenantName}}
EMAIL: {{userEmail}}
PLAN: {{planName}}
═══════════════════════════════

QUICK START 🚀

1️⃣ SET UP INVENTORY
   Add your awesome equipment

2️⃣ CREATE BOOKINGS
   Start taking reservations

3️⃣ SETUP PAYMENTS
   Get paid faster

4️⃣ INVITE TEAM
   Collaborate and conquer

👉 LET'S GO: {{dashboardUrl}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// TEAM INVITE TEMPLATES
// ===================================

const TEAM_INVITE_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'You\'re invited to join {{businessName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #8b5cf6; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">📨 Team Invitation</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Join Our Team!
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{inviteeName}}</strong>, <strong>{{inviterName}}</strong> has invited you to join <strong style="color: #8b5cf6;">{{businessName}}</strong> as a <strong>{{role}}</strong>.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Role:</strong> {{role}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        Accept the invitation to start collaborating with the team and managing bookings, inventory, and more.
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{inviteLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        Accept Invitation
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
    </p>
  `, 'Join the team at {{businessName}}'),

  text: (params) => `
You're Invited to Join {{businessName}}!

Hi {{inviteeName}},

{{inviterName}} has invited you to join {{businessName}} as a {{role}}.

ROLE: {{role}}

Accept the invitation to start collaborating with the team and managing bookings, inventory, and more.

ACCEPT INVITATION: {{inviteLink}}

This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const TEAM_INVITE_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'You\'re invited to join {{businessName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #1e3a8a; border-bottom: 3px solid #3b82f6; padding-bottom: 12px;">
      Team Invitation
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{inviteeName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      <strong>{{inviterName}}</strong> has invited you to join <strong>{{businessName}}</strong> as a <strong>{{role}}</strong>.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Role:</strong> {{role}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6;">
            Accept the invitation to start collaborating with the team and managing bookings, inventory, and more.
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{inviteLink}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Accept Invitation
      </a>
    </div>

    <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6; text-align: center;">
      This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
    </p>
  `, 'Join the team at {{businessName}}'),

  text: (params) => `
TEAM INVITATION

Dear {{inviteeName}},

{{inviterName}} has invited you to join {{businessName}} as a {{role}}.

ROLE: {{role}}

Accept the invitation to start collaborating with the team and managing bookings, inventory, and more.

ACCEPT INVITATION: {{inviteLink}}

This invitation will expire in 7 days.

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const TEAM_INVITE_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'You\'re invited to join {{businessName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        JOIN THE TEAM! 🎉
      </h2>
      <p style="margin: 0; font-size: 18px; color: #475569;">
        You've been invited by <strong>{{inviterName}}</strong>
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #8b5cf6;">
      <p style="margin: 0 0 16px; font-size: 17px; color: #1e293b; line-height: 1.6;">
        <strong style="color: #8b5cf6;">{{inviteeName}}</strong>, you're invited to join <strong>{{businessName}}</strong>!
      </p>
      <p style="margin: 0; font-size: 16px; color: #475569; line-height: 1.6;">
        <strong>Your Role:</strong> {{role}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{inviteLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);">
        Accept Invitation
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Invitation expires in 7 days • Ignore if unexpected
    </p>
  `, 'Join {{businessName}} now!'),

  text: (params) => `
🎉 JOIN THE TEAM!

Hi {{inviteeName}},

You've been invited by {{inviterName}} to join {{businessName}}!

YOUR ROLE: {{role}}

👉 ACCEPT NOW: {{inviteLink}}

Invitation expires in 7 days.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// API KEY CREATED TEMPLATES
// ===================================

const API_KEY_CREATED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'New API Key Created: {{keyName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">🔑 API Key Created</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        New API Key Active
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, a new API key has been created for your account.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Key Name:</strong> {{keyName}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Created:</strong> {{createdAt}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Expires:</strong> {{expiresAt}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Scopes:</strong> {{scopes}}
      </p>
    </div>

    <div style="background-color: #422006; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; color: #fbbf24; line-height: 1.6;">
        <strong>Important:</strong> Keep your API key secure. It provides access to your account. If you didn't create this key, please contact support immediately.
      </p>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      This is a security notification. Your API keys are powerful tools — use them wisely.
    </p>
  `, 'New API key created for your account'),

  text: (params) => `
New API Key Created

Hi {{userName}},

A new API key has been created for your account.

KEY DETAILS:
- Name: {{keyName}}
- Created: {{createdAt}}
- Expires: {{expiresAt}}
- Scopes: {{scopes}}

IMPORTANT: Keep your API key secure. It provides access to your account. If you didn't create this key, please contact support immediately.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const API_KEY_CREATED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'New API Key Created: {{keyName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #1e3a8a; border-bottom: 3px solid #3b82f6; padding-bottom: 12px;">
      API Key Created
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      A new API key has been created for your account.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Key Name:</strong> {{keyName}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Created:</strong> {{createdAt}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Expires:</strong> {{expiresAt}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e293b;">
            <strong>Scopes:</strong> {{scopes}}
          </p>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>Security Notice:</strong> Keep your API key secure. If you didn't create this key, please contact support immediately.
      </p>
    </div>
  `, 'New API key created'),

  text: (params) => `
API KEY CREATED

Dear {{userName}},

A new API key has been created for your account.

KEY DETAILS:
Name: {{keyName}}
Created: {{createdAt}}
Expires: {{expiresAt}}
Scopes: {{scopes}}

SECURITY NOTICE: Keep your API key secure. If you didn't create this key, contact support.

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const API_KEY_CREATED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'New API Key Created: {{keyName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        API KEY CREATED 🔑
      </h2>
      <p style="margin: 0; font-size: 18px; color: #475569;">
        Your integration is ready to go
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #06b6d4;">
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Key Name:</strong> {{keyName}}
      </p>
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Created:</strong> {{createdAt}}
      </p>
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Expires:</strong> {{expiresAt}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #1e293b;">
        <strong>Scopes:</strong> {{scopes}}
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border-left: 6px solid #f59e0b;">
      <p style="margin: 0; font-size: 15px; color: #92400e; line-height: 1.6; font-weight: 600;">
        ⚠️ Keep this key secure! If you didn't create it, contact support now.
      </p>
    </div>
  `, 'New API key: {{keyName}}'),

  text: (params) => `
🔑 API KEY CREATED

Hi {{userName}},

Your new API key is ready!

KEY: {{keyName}}
CREATED: {{createdAt}}
EXPIRES: {{expiresAt}}
SCOPES: {{scopes}}

⚠️ SECURITY: Keep secure. Didn't create this? Contact support!

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// API KEY EXPIRING TEMPLATES
// ===================================

const API_KEY_EXPIRING_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'API Key Expiring Soon: {{keyName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">⚠️ Expiring Soon</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        API Key Expiring
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, your API key will expire in <strong>{{daysRemaining}} days</strong>.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Key Name:</strong> {{keyName}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Expires:</strong> {{expiresAt}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{renewLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        Renew API Key
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Renew your key to prevent any service interruptions.
    </p>
  `, 'Your API key expires in {{daysRemaining}} days'),

  text: (params) => `
API Key Expiring Soon

Hi {{userName}},

Your API key will expire in {{daysRemaining}} days.

KEY DETAILS:
- Name: {{keyName}}
- Expires: {{expiresAt}}

RENEW NOW: {{renewLink}}

Renew your key to prevent service interruptions.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const API_KEY_EXPIRING_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'API Key Expiring Soon: {{keyName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #d97706; border-bottom: 3px solid #f59e0b; padding-bottom: 12px;">
      API Key Expiring
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Your API key will expire in <strong>{{daysRemaining}} days</strong>.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #92400e;">
            <strong>Key Name:</strong> {{keyName}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #92400e;">
            <strong>Expires:</strong> {{expiresAt}}
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{renewLink}}" style="display: inline-block; padding: 14px 36px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Renew API Key
      </a>
    </div>
  `, 'API key expires in {{daysRemaining}} days'),

  text: (params) => `
API KEY EXPIRING SOON

Dear {{userName}},

Your API key will expire in {{daysRemaining}} days.

KEY DETAILS:
Name: {{keyName}}
Expires: {{expiresAt}}

RENEW NOW: {{renewLink}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const API_KEY_EXPIRING_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'API Key Expiring Soon: {{keyName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        ⚠️ KEY EXPIRING
      </h2>
      <p style="margin: 0; font-size: 24px; color: #ef4444; font-weight: 700;">
        {{daysRemaining}} Days Remaining
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #f59e0b;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #92400e;">
        <strong>Key Name:</strong> {{keyName}}
      </p>
      <p style="margin: 0; font-size: 17px; color: #92400e;">
        <strong>Expires:</strong> {{expiresAt}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{renewLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);">
        Renew Now
      </a>
    </div>
  `, 'Key expires in {{daysRemaining}} days!'),

  text: (params) => `
⚠️ API KEY EXPIRING!

{{daysRemaining}} DAYS REMAINING

Key: {{keyName}}
Expires: {{expiresAt}}

👉 RENEW NOW: {{renewLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// SUBSCRIPTION CONFIRMED TEMPLATES
// ===================================

const SUBSCRIPTION_CONFIRMED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Subscription Confirmed – {{planName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">✓ Subscribed</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        You're Subscribed!
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, welcome to <strong style="color: #10b981;">{{planName}}</strong>! Your subscription is now active.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Plan:</strong> {{planName}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Price:</strong> {{price}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Features:</strong>
      </p>
      <p style="margin: 12px 0 0 20px; font-size: 15px; color: #cbd5e1; line-height: 1.8;">
        {{features}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        Go to Dashboard
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Your subscription will renew automatically. You can manage your subscription anytime in your dashboard.
    </p>
  `, 'Welcome to {{planName}}!'),

  text: (params) => `
Subscription Confirmed!

Hi {{userName}},

Welcome to {{planName}}! Your subscription is now active.

PLAN DETAILS:
- Plan: {{planName}}
- Price: {{price}}
- Features: {{features}}

GO TO DASHBOARD: {{dashboardUrl}}

Your subscription will renew automatically. Manage it anytime in your dashboard.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const SUBSCRIPTION_CONFIRMED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Subscription Confirmed – {{planName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #10b981; border-bottom: 3px solid #10b981; padding-bottom: 12px;">
      Subscription Confirmed
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Thank you for subscribing to <strong>{{planName}}</strong>. Your subscription is now active.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Plan:</strong> {{planName}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Price:</strong> {{price}}
          </p>
          <p style="margin: 0 0 8px; font-size: 15px; color: #1e293b;">
            <strong>Features:</strong>
          </p>
          <p style="margin: 0 0 0 16px; font-size: 14px; color: #475569; line-height: 1.8;">
            {{features}}
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 14px 36px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Go to Dashboard
      </a>
    </div>
  `, 'Welcome to {{planName}}'),

  text: (params) => `
SUBSCRIPTION CONFIRMED

Dear {{userName}},

Thank you for subscribing to {{planName}}. Your subscription is now active.

PLAN: {{planName}}
PRICE: {{price}}
FEATURES: {{features}}

GO TO DASHBOARD: {{dashboardUrl}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const SUBSCRIPTION_CONFIRMED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Subscription Confirmed – {{planName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        YOU'RE IN! 🎉
      </h2>
      <p style="margin: 0; font-size: 24px; color: #10b981; font-weight: 700;">
        {{planName}} Active
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #10b981;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e293b;">
        <strong>Plan:</strong> {{planName}}
      </p>
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e293b;">
        <strong>Price:</strong> {{price}}
      </p>
      <p style="margin: 0 0 8px; font-size: 17px; color: #1e293b;">
        <strong>Features:</strong>
      </p>
      <p style="margin: 0 0 0 16px; font-size: 15px; color: #475569; line-height: 1.8;">
        {{features}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);">
        Start Now
      </a>
    </div>
  `, 'Welcome to {{planName}}!'),

  text: (params) => `
🎉 YOU'RE IN!

{{planName}} is now active!

PLAN: {{planName}}
PRICE: {{price}}
FEATURES: {{features}}

👉 START NOW: {{dashboardUrl}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// SUBSCRIPTION CANCELLED TEMPLATES
// ===================================

const SUBSCRIPTION_CANCELLED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Subscription Cancelled – {{planName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #64748b; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">Cancelled</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        We're Sorry to See You Go
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, your <strong>{{planName}}</strong> subscription has been cancelled.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Plan:</strong> {{planName}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Access Until:</strong> {{effectiveDate}}
      </p>
    </div>

    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.7; color: #cbd5e1;">
      You'll continue to have access to your account until <strong>{{effectiveDate}}</strong>. After that, your account will be downgraded.
    </p>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{reactivateLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        Reactivate Subscription
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Changed your mind? You can reactivate your subscription anytime.
    </p>
  `, 'Your subscription has been cancelled'),

  text: (params) => `
Subscription Cancelled

Hi {{userName}},

Your {{planName}} subscription has been cancelled.

PLAN: {{planName}}
ACCESS UNTIL: {{effectiveDate}}

You'll continue to have access until {{effectiveDate}}.

REACTIVATE: {{reactivateLink}}

Changed your mind? Reactivate anytime.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const SUBSCRIPTION_CANCELLED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Subscription Cancelled – {{planName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #64748b; border-bottom: 3px solid #94a3b8; padding-bottom: 12px;">
      Subscription Cancelled
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Your <strong>{{planName}}</strong> subscription has been cancelled.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Plan:</strong> {{planName}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e293b;">
            <strong>Access Until:</strong> {{effectiveDate}}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      You'll continue to have access until {{effectiveDate}}.
    </p>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{reactivateLink}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Reactivate Subscription
      </a>
    </div>
  `, 'Subscription cancelled'),

  text: (params) => `
SUBSCRIPTION CANCELLED

Dear {{userName}},

Your {{planName}} subscription has been cancelled.

PLAN: {{planName}}
ACCESS UNTIL: {{effectiveDate}}

REACTIVATE: {{reactivateLink}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const SUBSCRIPTION_CANCELLED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Subscription Cancelled – {{planName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #64748b 0%, #475569 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        SUBSCRIPTION CANCELLED
      </h2>
      <p style="margin: 0; font-size: 18px; color: #475569;">
        We're sorry to see you go
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #64748b;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e293b;">
        <strong>Plan:</strong> {{planName}}
      </p>
      <p style="margin: 0; font-size: 17px; color: #1e293b;">
        <strong>Access Until:</strong> {{effectiveDate}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{reactivateLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);">
        Reactivate
      </a>
    </div>
  `, 'Subscription cancelled'),

  text: (params) => `
SUBSCRIPTION CANCELLED

{{planName}} cancelled

ACCESS UNTIL: {{effectiveDate}}

👉 REACTIVATE: {{reactivateLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// PAYMENT FAILED TEMPLATES
// ===================================

const PAYMENT_FAILED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Payment Failed – Action Required',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #ef4444; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">❌ Payment Failed</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Payment Issue
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, we couldn't process your payment of <strong>\${{amount}}</strong>.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Amount:</strong> \${{amount}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Reason:</strong> {{reason}}
      </p>
    </div>

    <div style="background-color: #7f1d1d; border-left: 4px solid #ef4444; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; color: #fca5a5; line-height: 1.6;">
        <strong>Action Required:</strong> Please update your payment method to avoid service interruption.
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{updatePaymentLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
        Update Payment Method
      </a>
    </div>
  `, 'Payment failed - update required'),

  text: (params) => `
Payment Failed - Action Required

Hi {{userName}},

We couldn't process your payment of \${{amount}}.

AMOUNT: \${{amount}}
REASON: {{reason}}

ACTION REQUIRED: Update your payment method to avoid service interruption.

UPDATE PAYMENT: {{updatePaymentLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PAYMENT_FAILED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Payment Failed – Action Required',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #dc2626; border-bottom: 3px solid #ef4444; padding-bottom: 12px;">
      Payment Failed
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      We were unable to process your payment of <strong>\${{amount}}</strong>.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #fee2e2; border: 1px solid #ef4444; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #7f1d1d;">
            <strong>Amount:</strong> \${{amount}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #7f1d1d;">
            <strong>Reason:</strong> {{reason}}
          </p>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>Action Required:</strong> Please update your payment method to avoid service interruption.
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{updatePaymentLink}}" style="display: inline-block; padding: 14px 36px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Update Payment Method
      </a>
    </div>
  `, 'Payment failed'),

  text: (params) => `
PAYMENT FAILED

Dear {{userName}},

We were unable to process your payment of \${{amount}}.

AMOUNT: \${{amount}}
REASON: {{reason}}

ACTION REQUIRED: Update your payment method.

UPDATE PAYMENT: {{updatePaymentLink}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const PAYMENT_FAILED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Payment Failed – Action Required',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        ❌ PAYMENT FAILED
      </h2>
      <p style="margin: 0; font-size: 24px; color: #ef4444; font-weight: 700;">
        Action Required
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #ef4444;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #7f1d1d;">
        <strong>Amount:</strong> \${{amount}}
      </p>
      <p style="margin: 0; font-size: 17px; color: #7f1d1d;">
        <strong>Reason:</strong> {{reason}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{updatePaymentLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);">
        Update Payment
      </a>
    </div>
  `, 'Payment failed!'),

  text: (params) => `
❌ PAYMENT FAILED

AMOUNT: \${{amount}}
REASON: {{reason}}

👉 UPDATE NOW: {{updatePaymentLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// TEAM REMOVED TEMPLATES
// ===================================

const TEAM_REMOVED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Removed from {{businessName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #64748b; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">Team Update</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Access Removed
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, you have been removed from <strong>{{businessName}}</strong>.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Business:</strong> {{businessName}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Removal Date:</strong> {{removalDate}}
      </p>
    </div>

    <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #cbd5e1;">
      You no longer have access to this business account. If you believe this was done in error, please contact the business owner.
    </p>
  `, 'You have been removed from {{businessName}}'),

  text: (params) => `
Access Removed

Hi {{userName}},

You have been removed from {{businessName}}.

BUSINESS: {{businessName}}
REMOVAL DATE: {{removalDate}}

You no longer have access to this business account. If you believe this was done in error, please contact the business owner.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const TEAM_REMOVED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Removed from {{businessName}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #64748b; border-bottom: 3px solid #94a3b8; padding-bottom: 12px;">
      Team Access Removed
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      You have been removed from <strong>{{businessName}}</strong>.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Business:</strong> {{businessName}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e293b;">
            <strong>Removal Date:</strong> {{removalDate}}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #374151;">
      You no longer have access to this business account.
    </p>
  `, 'Access removed'),

  text: (params) => `
TEAM ACCESS REMOVED

Dear {{userName}},

You have been removed from {{businessName}}.

BUSINESS: {{businessName}}
REMOVAL DATE: {{removalDate}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const TEAM_REMOVED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Removed from {{businessName}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #64748b 0%, #475569 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        ACCESS REMOVED
      </h2>
    </div>

    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #64748b;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e293b;">
        <strong>Business:</strong> {{businessName}}
      </p>
      <p style="margin: 0; font-size: 17px; color: #1e293b;">
        <strong>Removal Date:</strong> {{removalDate}}
      </p>
    </div>

    <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #475569; text-align: center;">
      You no longer have access to this business account.
    </p>
  `, 'Access removed'),

  text: (params) => `
ACCESS REMOVED

Business: {{businessName}}
Removal Date: {{removalDate}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// PASSWORD CHANGED TEMPLATES
// ===================================

const PASSWORD_CHANGED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Password Changed – Security Alert',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">🔒 Security Alert</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        Password Changed
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, your password was recently changed.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Changed At:</strong> {{changedAt}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">IP Address:</strong> {{ipAddress}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Device:</strong> {{deviceInfo}}
      </p>
    </div>

    <div style="background-color: #422006; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; color: #fbbf24; line-height: 1.6;">
        <strong>Didn't make this change?</strong> Contact support immediately to secure your account.
      </p>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      This is a security notification to keep your account safe.
    </p>
  `, 'Your password was changed'),

  text: (params) => `
Password Changed - Security Alert

Hi {{userName}},

Your password was recently changed.

DETAILS:
- Changed At: {{changedAt}}
- IP Address: {{ipAddress}}
- Device: {{deviceInfo}}

Didn't make this change? Contact support immediately.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const PASSWORD_CHANGED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Password Changed – Security Alert',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #10b981; border-bottom: 3px solid #10b981; padding-bottom: 12px;">
      Password Changed
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Your password was recently changed.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Changed At:</strong> {{changedAt}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>IP Address:</strong> {{ipAddress}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e293b;">
            <strong>Device:</strong> {{deviceInfo}}
          </p>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>Security Notice:</strong> If you didn't make this change, contact support immediately.
      </p>
    </div>
  `, 'Password changed'),

  text: (params) => `
PASSWORD CHANGED

Dear {{userName}},

Your password was recently changed.

CHANGED AT: {{changedAt}}
IP ADDRESS: {{ipAddress}}
DEVICE: {{deviceInfo}}

If you didn't make this change, contact support.

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const PASSWORD_CHANGED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Password Changed – Security Alert',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        🔒 PASSWORD CHANGED
      </h2>
      <p style="margin: 0; font-size: 18px; color: #475569;">
        Security Alert
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #10b981;">
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Changed At:</strong> {{changedAt}}
      </p>
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>IP:</strong> {{ipAddress}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #1e293b;">
        <strong>Device:</strong> {{deviceInfo}}
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 12px; padding: 24px; margin: 0 0 32px; border-left: 6px solid #f59e0b;">
      <p style="margin: 0; font-size: 15px; color: #92400e; line-height: 1.6; font-weight: 600;">
        ⚠️ Didn't make this change? Contact support NOW!
      </p>
    </div>
  `, 'Password changed!'),

  text: (params) => `
🔒 PASSWORD CHANGED

CHANGED: {{changedAt}}
IP: {{ipAddress}}
DEVICE: {{deviceInfo}}

⚠️ Didn't change it? Contact support!

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// LOGIN NEW DEVICE TEMPLATES
// ===================================

const LOGIN_NEW_DEVICE_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'New Device Login Detected',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">🔔 Security Alert</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        New Device Login
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{userName}}</strong>, we detected a login from a new device.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Device:</strong> {{deviceInfo}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Location:</strong> {{location}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Login Time:</strong> {{loginTime}}
      </p>
    </div>

    <div style="background-color: #422006; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 24px; margin: 0 0 32px;">
      <p style="margin: 0; font-size: 15px; color: #fbbf24; line-height: 1.6;">
        <strong>Was this you?</strong> If not, secure your account immediately.
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{securityLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
        Secure My Account
      </a>
    </div>
  `, 'New device login detected'),

  text: (params) => `
New Device Login Detected

Hi {{userName}},

We detected a login from a new device.

DETAILS:
- Device: {{deviceInfo}}
- Location: {{location}}
- Login Time: {{loginTime}}

Was this you? If not, secure your account immediately.

SECURE ACCOUNT: {{securityLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const LOGIN_NEW_DEVICE_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'New Device Login Detected',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #06b6d4; border-bottom: 3px solid #06b6d4; padding-bottom: 12px;">
      New Device Login
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{userName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      We detected a login from a new device.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Device:</strong> {{deviceInfo}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e293b;">
            <strong>Location:</strong> {{location}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e293b;">
            <strong>Login Time:</strong> {{loginTime}}
          </p>
        </td>
      </tr>
    </table>

    <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; padding: 16px; margin: 0 0 24px;">
      <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
        <strong>Security Notice:</strong> If this wasn't you, secure your account immediately.
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{securityLink}}" style="display: inline-block; padding: 14px 36px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        Secure My Account
      </a>
    </div>
  `, 'New device login'),

  text: (params) => `
NEW DEVICE LOGIN

Dear {{userName}},

We detected a login from a new device.

DEVICE: {{deviceInfo}}
LOCATION: {{location}}
LOGIN TIME: {{loginTime}}

If this wasn't you, secure your account.

SECURE ACCOUNT: {{securityLink}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const LOGIN_NEW_DEVICE_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'New Device Login Detected',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        🔔 NEW LOGIN
      </h2>
      <p style="margin: 0; font-size: 18px; color: #475569;">
        Security Alert
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #06b6d4;">
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Device:</strong> {{deviceInfo}}
      </p>
      <p style="margin: 0 0 12px; font-size: 16px; color: #1e293b;">
        <strong>Location:</strong> {{location}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #1e293b;">
        <strong>Login Time:</strong> {{loginTime}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{securityLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);">
        Secure Account
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Wasn't you? Secure your account now!
    </p>
  `, 'New device login!'),

  text: (params) => `
🔔 NEW LOGIN DETECTED

DEVICE: {{deviceInfo}}
LOCATION: {{location}}
TIME: {{loginTime}}

👉 SECURE NOW: {{securityLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// NEW BOOKING RECEIVED (TO BUSINESS OWNER)
// ===================================

const NEW_BOOKING_RECEIVED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: '🎉 New Booking from {{customerName}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">🎉 New Booking</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        You Got a New Booking!
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Great news! <strong style="color: #f59e0b;">{{customerName}}</strong> just booked <strong style="color: #10b981;">{{itemName}}</strong>.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Booking ID</td>
          <td style="color: #f97316; font-weight: 700; text-align: right; padding: 8px 0; font-family: monospace;">{{bookingId}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Customer</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{customerName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Email</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{customerEmail}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Phone</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{customerPhone}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Item</td>
          <td style="color: #10b981; font-weight: 700; text-align: right; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Event Date</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Time</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{eventTime}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Location</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{location}}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 16px 0 8px 0; border-top: 2px solid #475569;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="color: #ffffff; font-size: 18px; font-weight: 700;">Total</td>
                <td style="color: #10b981; font-size: 24px; font-weight: 800; text-align: right;">\${{totalAmount}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{dashboardUrl}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);">
        View Booking
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Time to celebrate – another happy customer! 🎈
    </p>
  `, 'New booking from {{customerName}} for {{itemName}}'),

  text: (params) => `
🎉 NEW BOOKING RECEIVED!

Great news! You got a new booking.

BOOKING DETAILS:
- Booking ID: {{bookingId}}
- Customer: {{customerName}}
- Email: {{customerEmail}}
- Phone: {{customerPhone}}
- Item: {{itemName}}
- Event Date: {{eventDate}}
- Time: {{eventTime}}
- Location: {{location}}
- Total: ${{totalAmount}}

👉 VIEW BOOKING: {{dashboardUrl}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// BOOKING STATUS UPDATE (TO CUSTOMER)
// ===================================

const BOOKING_STATUS_UPDATE_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: '{{statusEmoji}} Your rental is {{statusText}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: {{statusColor}}; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">{{statusEmoji}} {{statusLabel}}</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        {{statusHeadline}}
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{customerName}}</strong>, {{statusMessage}}
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px; line-height: 2;">
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Booking ID</td>
          <td style="color: #f97316; font-weight: 700; text-align: right; padding: 8px 0; font-family: monospace;">{{bookingId}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Item</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{itemName}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Event Date</td>
          <td style="color: #f59e0b; font-weight: 700; text-align: right; padding: 8px 0;">{{eventDate}}</td>
        </tr>
        <tr>
          <td style="color: #94a3b8; padding: 8px 0;">Location</td>
          <td style="color: #ffffff; font-weight: 600; text-align: right; padding: 8px 0;">{{location}}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Questions? Contact us at {{businessPhone}} or {{businessEmail}}
    </p>
  `, '{{statusEmoji}} {{statusText}}'),

  text: (params) => `
{{statusEmoji}} {{statusHeadline}}

Hi {{customerName}},

{{statusMessage}}

BOOKING DETAILS:
- Booking ID: {{bookingId}}
- Item: {{itemName}}
- Event Date: {{eventDate}}
- Location: {{location}}

Questions? Contact us at {{businessPhone}} or {{businessEmail}}

{{businessName}}
`
}

// ===================================
// INVOICE CREATED TEMPLATES
// ===================================

const INVOICE_CREATED_MODERN: EmailTemplateVariant = {
  id: 'modern',
  name: 'Modern Dark',
  subject: 'Invoice {{invoiceNumber}} – Due {{dueDate}}',

  html: (params) => modernDarkWrapper(`
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; border-radius: 100px; margin-bottom: 24px;">
        <span style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">📄 Invoice</span>
      </div>
      <h2 style="margin: 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">
        New Invoice
      </h2>
    </div>

    <p style="margin: 0 0 32px; font-size: 18px; line-height: 1.7; color: #cbd5e1;">
      Hey <strong style="color: #f59e0b;">{{customerName}}</strong>, your invoice is ready.
    </p>

    <div style="background-color: #334155; border-radius: 8px; padding: 32px; margin: 0 0 32px;">
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Invoice Number:</strong> {{invoiceNumber}}
      </p>
      <p style="margin: 0 0 16px; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Amount:</strong> \${{amount}}
      </p>
      <p style="margin: 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
        <strong style="color: #f59e0b;">Due Date:</strong> {{dueDate}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{viewLink}}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
        View Invoice
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
      Please pay by {{dueDate}} to avoid late fees.
    </p>
  `, 'Invoice {{invoiceNumber}} ready'),

  text: (params) => `
New Invoice

Hi {{customerName}},

Your invoice is ready.

INVOICE DETAILS:
- Invoice Number: {{invoiceNumber}}
- Amount: \${{amount}}
- Due Date: {{dueDate}}

VIEW INVOICE: {{viewLink}}

Please pay by {{dueDate}} to avoid late fees.

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

const INVOICE_CREATED_CLASSIC: EmailTemplateVariant = {
  id: 'classic',
  name: 'Classic Light',
  subject: 'Invoice {{invoiceNumber}} – Due {{dueDate}}',

  html: (params) => classicLightWrapper(`
    <h2 style="margin: 0 0 24px; font-size: 28px; color: #3b82f6; border-bottom: 3px solid #3b82f6; padding-bottom: 12px;">
      Invoice
    </h2>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Dear <strong>{{customerName}}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #374151;">
      Your invoice is ready for payment.
    </p>

    <table role="presentation" cellspacing="0" cellpadding="12" border="0" width="100%" style="background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 4px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e3a8a;">
            <strong>Invoice Number:</strong> {{invoiceNumber}}
          </p>
          <p style="margin: 0 0 12px; font-size: 15px; color: #1e3a8a;">
            <strong>Amount:</strong> \${{amount}}
          </p>
          <p style="margin: 0; font-size: 15px; color: #1e3a8a;">
            <strong>Due Date:</strong> {{dueDate}}
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="{{viewLink}}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px;">
        View Invoice
      </a>
    </div>

    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
      Please pay by {{dueDate}}.
    </p>
  `, 'Invoice ready'),

  text: (params) => `
INVOICE

Dear {{customerName}},

Your invoice is ready.

INVOICE NUMBER: {{invoiceNumber}}
AMOUNT: \${{amount}}
DUE DATE: {{dueDate}}

VIEW INVOICE: {{viewLink}}

{{businessName}}
Phone: {{businessPhone}} | Email: {{businessEmail}}
`
}

const INVOICE_CREATED_BOLD: EmailTemplateVariant = {
  id: 'bold',
  name: 'Bold Gradient',
  subject: 'Invoice {{invoiceNumber}} – Due {{dueDate}}',

  html: (params) => boldGradientWrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <h2 style="margin: 0 0 16px; font-size: 48px; font-weight: 900; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1.5px;">
        📄 INVOICE
      </h2>
      <p style="margin: 0; font-size: 24px; color: #3b82f6; font-weight: 700;">
        #{{invoiceNumber}}
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 32px; margin: 0 0 32px; border-left: 6px solid #3b82f6;">
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e3a8a;">
        <strong>Invoice:</strong> {{invoiceNumber}}
      </p>
      <p style="margin: 0 0 12px; font-size: 17px; color: #1e3a8a;">
        <strong>Amount:</strong> \${{amount}}
      </p>
      <p style="margin: 0; font-size: 17px; color: #1e3a8a;">
        <strong>Due:</strong> {{dueDate}}
      </p>
    </div>

    <div style="text-align: center; margin: 0 0 32px;">
      <a href="{{viewLink}}" style="display: inline-block; padding: 20px 56px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);">
        View & Pay
      </a>
    </div>
  `, 'Invoice #{{invoiceNumber}}'),

  text: (params) => `
📄 INVOICE #{{invoiceNumber}}

AMOUNT: \${{amount}}
DUE: {{dueDate}}

👉 VIEW & PAY: {{viewLink}}

{{businessName}}
{{businessPhone}} • {{businessEmail}}
`
}

// ===================================
// EXPORT ALL TEMPLATES
// ===================================

export const emailTemplates: Record<string, EmailTemplateType> = {
  BOOKING_CONFIRMATION: {
    defaultVariant: 'modern',
    variants: [
      BOOKING_CONFIRMATION_MODERN,
      BOOKING_CONFIRMATION_CLASSIC,
      BOOKING_CONFIRMATION_BOLD
    ]
  },
  BOOKING_REMINDER: {
    defaultVariant: 'modern',
    variants: [
      BOOKING_REMINDER_MODERN,
      BOOKING_REMINDER_CLASSIC,
      BOOKING_REMINDER_BOLD
    ]
  },
  BOOKING_CANCELLED: {
    defaultVariant: 'modern',
    variants: [
      BOOKING_CANCELLED_MODERN,
      BOOKING_CANCELLED_CLASSIC,
      BOOKING_CANCELLED_BOLD
    ]
  },
  PAYMENT_RECEIVED: {
    defaultVariant: 'modern',
    variants: [
      PAYMENT_RECEIVED_MODERN,
      PAYMENT_RECEIVED_CLASSIC,
      PAYMENT_RECEIVED_BOLD
    ]
  },
  PASSWORD_RESET: {
    defaultVariant: 'modern',
    variants: [
      PASSWORD_RESET_MODERN,
      PASSWORD_RESET_CLASSIC,
      PASSWORD_RESET_BOLD
    ]
  },
  WELCOME: {
    defaultVariant: 'modern',
    variants: [
      WELCOME_MODERN,
      WELCOME_CLASSIC,
      WELCOME_BOLD
    ]
  },
  TEAM_INVITE: {
    defaultVariant: 'modern',
    variants: [
      TEAM_INVITE_MODERN,
      TEAM_INVITE_CLASSIC,
      TEAM_INVITE_BOLD
    ]
  },
  API_KEY_CREATED: {
    defaultVariant: 'modern',
    variants: [
      API_KEY_CREATED_MODERN,
      API_KEY_CREATED_CLASSIC,
      API_KEY_CREATED_BOLD
    ]
  },
  API_KEY_EXPIRING: {
    defaultVariant: 'modern',
    variants: [
      API_KEY_EXPIRING_MODERN,
      API_KEY_EXPIRING_CLASSIC,
      API_KEY_EXPIRING_BOLD
    ]
  },
  SUBSCRIPTION_CONFIRMED: {
    defaultVariant: 'modern',
    variants: [
      SUBSCRIPTION_CONFIRMED_MODERN,
      SUBSCRIPTION_CONFIRMED_CLASSIC,
      SUBSCRIPTION_CONFIRMED_BOLD
    ]
  },
  SUBSCRIPTION_CANCELLED: {
    defaultVariant: 'modern',
    variants: [
      SUBSCRIPTION_CANCELLED_MODERN,
      SUBSCRIPTION_CANCELLED_CLASSIC,
      SUBSCRIPTION_CANCELLED_BOLD
    ]
  },
  PAYMENT_FAILED: {
    defaultVariant: 'modern',
    variants: [
      PAYMENT_FAILED_MODERN,
      PAYMENT_FAILED_CLASSIC,
      PAYMENT_FAILED_BOLD
    ]
  },
  TEAM_REMOVED: {
    defaultVariant: 'modern',
    variants: [
      TEAM_REMOVED_MODERN,
      TEAM_REMOVED_CLASSIC,
      TEAM_REMOVED_BOLD
    ]
  },
  PASSWORD_CHANGED: {
    defaultVariant: 'modern',
    variants: [
      PASSWORD_CHANGED_MODERN,
      PASSWORD_CHANGED_CLASSIC,
      PASSWORD_CHANGED_BOLD
    ]
  },
  LOGIN_NEW_DEVICE: {
    defaultVariant: 'modern',
    variants: [
      LOGIN_NEW_DEVICE_MODERN,
      LOGIN_NEW_DEVICE_CLASSIC,
      LOGIN_NEW_DEVICE_BOLD
    ]
  },
  INVOICE_CREATED: {
    defaultVariant: 'modern',
    variants: [
      INVOICE_CREATED_MODERN,
      INVOICE_CREATED_CLASSIC,
      INVOICE_CREATED_BOLD
    ]
  },
  NEW_BOOKING_RECEIVED: {
    defaultVariant: 'modern',
    variants: [
      NEW_BOOKING_RECEIVED_MODERN
    ]
  },
  BOOKING_STATUS_UPDATE: {
    defaultVariant: 'modern',
    variants: [
      BOOKING_STATUS_UPDATE_MODERN
    ]
  }
}

export type EmailTemplateName = keyof typeof emailTemplates
export type EmailVariantId = 'modern' | 'classic' | 'bold'

/**
 * Get a specific template variant
 */
export function getTemplate(
  templateName: EmailTemplateName,
  variantId?: EmailVariantId
): EmailTemplateVariant {
  const template = emailTemplates[templateName]
  if (!template) {
    throw new Error(`Template "${templateName}" not found`)
  }

  const targetVariantId = variantId || template.defaultVariant
  const variant = template.variants.find(v => v.id === targetVariantId)

  if (!variant) {
    throw new Error(`Variant "${targetVariantId}" not found for template "${templateName}"`)
  }

  return variant
}

/**
 * Get all variants for a template
 */
export function getTemplateVariants(templateName: EmailTemplateName): EmailTemplateVariant[] {
  const template = emailTemplates[templateName]
  if (!template) {
    throw new Error(`Template "${templateName}" not found`)
  }
  return template.variants
}
