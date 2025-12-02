/**
 * Email Hooks for Payload CMS
 * Automatically sends emails when certain events occur
 */

import type { CollectionAfterChangeHook } from 'payload'
import { emailService } from '../lib/email'
import type { BookingData, CustomerData, PaymentData, TenantData } from '../lib/email'

/**
 * After Change Hook for Bookings Collection
 * Sends confirmation emails when bookings are created or updated
 */
export const sendBookingEmails: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  try {
    // Only send emails if BREVO_API_KEY is configured
    if (!process.env.BREVO_API_KEY) {
      req.payload.logger.info('Skipping booking email: BREVO_API_KEY not configured')
      return doc
    }

    // Fetch related data (customer, tenant, item)
    const customerId = typeof doc.customerId === 'object' ? doc.customerId.id : doc.customerId
    const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId
    const itemId = typeof doc.rentalItemId === 'object' ? doc.rentalItemId.id : doc.rentalItemId

    // Fetch customer data
    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    // Fetch tenant data
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    // Fetch rental item data
    const item = await req.payload.findByID({
      collection: 'rental-items',
      id: itemId,
    })

    // Transform to email service types
    const customerData: CustomerData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    }

    const tenantData: TenantData = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      domain: tenant.domain,
    }

    const bookingData: BookingData = {
      id: doc.id,
      eventDate: doc.startDate,
      eventTime: formatTime(doc.startDate),
      location: formatAddress(doc.deliveryAddress),
      totalAmount: doc.totalPrice,
      status: doc.status,
      customer: customerData,
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
      },
    }

    // Send confirmation email when booking is created
    if (operation === 'create' && doc.status === 'confirmed') {
      await emailService.sendBookingConfirmation(bookingData, customerData, tenantData)
      req.payload.logger.info(`Booking confirmation email sent for booking ${doc.id}`)
    }

    // Send cancellation email when booking status changes to cancelled
    if (
      operation === 'update' &&
      doc.status === 'cancelled' &&
      previousDoc.status !== 'cancelled'
    ) {
      // Check if there's a refund amount
      const refundAmount =
        doc.paymentStatus === 'refunded' ? doc.depositPaid || doc.totalPrice : undefined

      await emailService.sendBookingCancellation(
        bookingData,
        customerData,
        tenantData,
        refundAmount
      )
      req.payload.logger.info(`Booking cancellation email sent for booking ${doc.id}`)
    }

    // Send confirmation email if status changes from pending to confirmed
    if (
      operation === 'update' &&
      doc.status === 'confirmed' &&
      previousDoc.status === 'pending'
    ) {
      await emailService.sendBookingConfirmation(bookingData, customerData, tenantData)
      req.payload.logger.info(`Booking confirmation email sent for booking ${doc.id}`)
    }
  } catch (error) {
    // Log error but don't fail the operation
    req.payload.logger.error(`Failed to send booking email: ${error}`)
  }

  return doc
}

/**
 * After Change Hook for Payments Collection
 * Sends payment receipt emails when payments are successful
 */
export const sendPaymentEmails: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  try {
    // Only send emails if BREVO_API_KEY is configured
    if (!process.env.BREVO_API_KEY) {
      req.payload.logger.info('Skipping payment email: BREVO_API_KEY not configured')
      return doc
    }

    // Only send on successful payments
    if (doc.status !== 'succeeded') {
      return doc
    }

    // Don't send duplicate emails
    if (operation === 'update' && previousDoc.status === 'succeeded') {
      return doc
    }

    // Fetch related data
    const bookingId = typeof doc.booking === 'object' ? doc.booking.id : doc.booking
    const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId

    // Fetch booking data
    const booking = await req.payload.findByID({
      collection: 'bookings',
      id: bookingId,
    })

    // Fetch customer data
    const customerId = typeof booking.customerId === 'object' ? booking.customerId.id : booking.customerId
    const customer = await req.payload.findByID({
      collection: 'customers',
      id: customerId,
    })

    // Fetch tenant data
    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    // Fetch rental item
    const itemId = typeof booking.rentalItemId === 'object' ? booking.rentalItemId.id : booking.rentalItemId
    const item = await req.payload.findByID({
      collection: 'rental-items',
      id: itemId,
    })

    // Transform to email service types
    const customerData: CustomerData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    }

    const tenantData: TenantData = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      domain: tenant.domain,
    }

    const bookingData: BookingData = {
      id: booking.id,
      eventDate: booking.startDate,
      eventTime: formatTime(booking.startDate),
      location: formatAddress(booking.deliveryAddress),
      totalAmount: booking.totalPrice,
      status: booking.status,
      customer: customerData,
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
      },
    }

    const paymentData: PaymentData = {
      id: doc.id,
      amount: doc.amount / 100, // Convert cents to dollars
      paymentDate: doc.createdAt,
      paymentMethod: getPaymentMethodName(doc),
      status: doc.status,
      booking: bookingData,
    }

    // Calculate remaining balance
    const remainingBalance = booking.balanceDue || 0

    // Send payment receipt email
    await emailService.sendPaymentReceipt(
      paymentData,
      bookingData,
      customerData,
      tenantData,
      remainingBalance
    )

    req.payload.logger.info(`Payment receipt email sent for payment ${doc.id}`)
  } catch (error) {
    // Log error but don't fail the operation
    req.payload.logger.error(`Failed to send payment email: ${error}`)
  }

  return doc
}

/**
 * Helper: Format time from date string
 */
function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch (error) {
    return 'Time TBD'
  }
}

/**
 * Helper: Format address from address object
 */
function formatAddress(address: any): string {
  if (!address) return 'Location TBD'

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Helper: Get payment method display name
 */
function getPaymentMethodName(payment: any): string {
  if (payment.stripePaymentIntentId) {
    return 'Credit Card (Stripe)'
  }

  // Add other payment methods as needed
  return 'Payment'
}

/**
 * After Change Hook for Users Collection
 * Sends welcome emails to new users
 */
export const sendUserWelcomeEmail: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  try {
    // Only send emails if BREVO_API_KEY is configured
    if (!process.env.BREVO_API_KEY) {
      req.payload.logger.info('Skipping welcome email: BREVO_API_KEY not configured')
      return doc
    }

    // Only send on user creation
    if (operation !== 'create') {
      return doc
    }

    // Only send to tenant admins and staff (not super admins)
    if (doc.role === 'super_admin') {
      return doc
    }

    // Fetch tenant data
    const tenantId = typeof doc.tenantId === 'object' ? doc.tenantId.id : doc.tenantId

    if (!tenantId) {
      return doc
    }

    const tenant = await req.payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    // Transform to email service types
    const userData = {
      id: doc.id,
      name: doc.name || doc.email,
      email: doc.email,
    }

    const tenantData: TenantData = {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      domain: tenant.domain,
    }

    // Send welcome email
    await emailService.sendWelcome(userData, tenantData)
    req.payload.logger.info(`Welcome email sent to user ${doc.id}`)
  } catch (error) {
    // Log error but don't fail the operation
    req.payload.logger.error(`Failed to send welcome email: ${error}`)
  }

  return doc
}

/**
 * Export individual hooks for use in collections
 */
export default {
  sendBookingEmails,
  sendPaymentEmails,
  sendUserWelcomeEmail,
}
