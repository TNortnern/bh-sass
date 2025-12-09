/**
 * Endpoint to send booking-related emails
 * Uses the emailService from lib/email
 *
 * Field mapping from Bookings collection:
 * - customerId (relationship to customers)
 * - rentalItemId (relationship to rental-items)
 * - tenantId (relationship to tenants)
 * - startDate, endDate (dates)
 * - totalPrice (number)
 * - deliveryAddress.street, .city, .state, .zipCode
 */

import type { PayloadRequest } from 'payload'
import { emailService } from '../lib/email'
import { format, parseISO } from 'date-fns'

export const sendBookingEmail = async (req: PayloadRequest) => {
  try {
    const { payload } = req
    const body = await req.json?.() || {}
    const { emailType, subject, customMessage, recipientEmail, recipientName } = body

    // Get booking ID from URL params
    const bookingId = req.routeParams?.id

    if (!bookingId) {
      return Response.json(
        { success: false, message: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Fetch the booking with relationships
    const booking = await payload.findByID({
      collection: 'bookings',
      id: bookingId,
      depth: 2, // Include customer, item, tenant relationships
    })

    if (!booking) {
      return Response.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if Brevo is configured
    if (!process.env.BREVO_API_KEY) {
      return Response.json(
        {
          success: false,
          message: 'Email service not configured. Please set BREVO_API_KEY in environment variables.',
          fallback: 'mailto'
        },
        { status: 503 }
      )
    }

    // Get customer data - field is customerId in our schema
    const customer = typeof booking.customerId === 'object' ? booking.customerId : null
    if (!customer) {
      return Response.json(
        { success: false, message: 'Customer not found for this booking' },
        { status: 400 }
      )
    }

    // Get tenant data
    const tenant = typeof booking.tenantId === 'object' ? booking.tenantId : null
    if (!tenant) {
      return Response.json(
        { success: false, message: 'Tenant not found for this booking' },
        { status: 400 }
      )
    }

    // Get item data - field is rentalItemId in our schema
    const item = typeof booking.rentalItemId === 'object' ? booking.rentalItemId : null

    // Format dates - field is startDate in our schema
    const eventDate = booking.startDate ? format(parseISO(booking.startDate), 'MMMM d, yyyy') : 'TBD'
    const eventTime = booking.startDate ? format(parseISO(booking.startDate), 'h:mm a') : 'TBD'

    // Build location from deliveryAddress - note: zipCode not zip
    const address = booking.deliveryAddress
    const location = address
      ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zipCode || ''}`
      : 'TBD'

    // Generate a booking reference (use ID if no bookingNumber field)
    const bookingRef = `BK-${String(booking.id).slice(-6).toUpperCase()}`

    // Prepare booking data for email templates
    const bookingData = {
      id: booking.id,
      eventDate,
      eventTime,
      location,
      totalAmount: booking.totalPrice || 0,
      status: booking.status,
      item: item ? {
        id: item.id,
        name: item.name,
      } : undefined,
    }

    const customerData = {
      id: customer.id,
      name: recipientName || `${customer.firstName} ${customer.lastName}`,
      email: recipientEmail || customer.email,
      phone: customer.phone,
    }

    // Get logo URL if available
    let logoUrl: string | undefined
    if (tenant.logo) {
      if (typeof tenant.logo === 'object' && tenant.logo.url) {
        logoUrl = tenant.logo.url
      }
    }

    const tenantData = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      domain: tenant.slug,
      logo: logoUrl,
      address: tenant.address,
      branding: tenant.branding,
    }

    // Send email based on type
    try {
      switch (emailType) {
        case 'confirmation':
          await emailService.sendBookingConfirmation(bookingData, customerData, tenantData)
          break

        case 'reminder':
          await emailService.sendBookingReminder(bookingData, customerData, tenantData)
          break

        case 'cancellation':
          await emailService.sendBookingCancellation(bookingData, customerData, tenantData)
          break

        case 'custom':
          // Send custom email with provided subject and message
          await emailService.sendCustomEmail(
            { email: customerData.email, name: customerData.name },
            subject || `Update for booking ${bookingRef}`,
            `<div style="font-family: sans-serif;">
              <h2>Hi ${customerData.name},</h2>
              <p>${customMessage || 'This is regarding your booking.'}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Booking Details:</strong></p>
              <ul>
                <li>Booking #: ${bookingRef}</li>
                ${item ? `<li>Item: ${item.name}</li>` : ''}
                <li>Event Date: ${eventDate}</li>
              </ul>
              <p>Best regards,<br>${tenantData.name}</p>
            </div>`,
            `Hi ${customerData.name},\n\n${customMessage || 'This is regarding your booking.'}\n\nBooking Details:\n- Booking #: ${bookingRef}\n${item ? `- Item: ${item.name}\n` : ''}- Event Date: ${eventDate}\n\nBest regards,\n${tenantData.name}`,
            ['custom-email', `tenant:${tenant.id}`]
          )
          break

        default:
          return Response.json(
            { success: false, message: 'Invalid email type' },
            { status: 400 }
          )
      }

      // Log success
      req.payload.logger.info(`Email sent for booking ${bookingId}: ${emailType}`)

      return Response.json({
        success: true,
        message: 'Email sent successfully',
        emailType,
        recipient: customerData.email,
      })

    } catch (emailError: any) {
      req.payload.logger.error(`Failed to send email for booking ${bookingId}: ${emailError.message}`)

      return Response.json(
        {
          success: false,
          message: `Failed to send email: ${emailError.message}`,
          fallback: 'mailto'
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    req.payload.logger.error(`Error in sendBookingEmail endpoint: ${error.message}`)

    return Response.json(
      {
        success: false,
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
