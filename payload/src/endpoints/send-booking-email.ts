/**
 * Endpoint to send booking-related emails
 * Uses the emailService from lib/email
 */

import type { PayloadRequest } from 'payload'
import { emailService } from '../lib/email'

export const sendBookingEmail = async (req: PayloadRequest) => {
  try {
    const { payload } = req
    const { emailType, subject, customMessage, recipientEmail, recipientName } = req.data || {}

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

    // Get customer data
    const customer = typeof booking.customer === 'object' ? booking.customer : null
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

    // Get item data
    const item = typeof booking.rentalItem === 'object' ? booking.rentalItem : null

    // Prepare booking data for email templates
    const bookingData = {
      id: booking.id,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime || 'TBD',
      location: `${booking.deliveryAddress?.street || ''}, ${booking.deliveryAddress?.city || ''}, ${booking.deliveryAddress?.state || ''} ${booking.deliveryAddress?.zip || ''}`,
      totalAmount: booking.totalAmount || 0,
      status: booking.status,
      customer: {
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: recipientEmail || customer.email,
        phone: customer.phone,
      },
      item: item ? {
        id: item.id,
        name: item.name,
        description: item.description,
      } : undefined,
    }

    const customerData = {
      id: customer.id,
      name: recipientName || `${customer.firstName} ${customer.lastName}`,
      email: recipientEmail || customer.email,
      phone: customer.phone,
    }

    const tenantData = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.businessInfo?.email,
      domain: tenant.slug,
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
            subject || `Update for booking ${booking.bookingNumber}`,
            `<div style="font-family: sans-serif;">
              <h2>Hi ${customerData.name},</h2>
              <p>${customMessage || 'This is regarding your booking.'}</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Booking Details:</strong></p>
              <ul>
                <li>Booking #: ${booking.bookingNumber}</li>
                ${item ? `<li>Item: ${item.name}</li>` : ''}
                <li>Event Date: ${new Date(booking.eventDate).toLocaleDateString()}</li>
              </ul>
              <p>Best regards,<br>${tenantData.name}</p>
            </div>`,
            `Hi ${customerData.name},\n\n${customMessage || 'This is regarding your booking.'}\n\nBooking Details:\n- Booking #: ${booking.bookingNumber}\n${item ? `- Item: ${item.name}\n` : ''}- Event Date: ${new Date(booking.eventDate).toLocaleDateString()}\n\nBest regards,\n${tenantData.name}`,
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
