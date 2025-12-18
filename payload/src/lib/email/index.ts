/**
 * Main Email Service
 * Combines Brevo client with email templates
 */

import { brevo } from './brevo'
import type { BrevoEmailAddress } from './brevo'
import { emailTemplates, type EmailTemplateVariant, interpolate } from './templates'

/**
 * Type definitions for email data
 */
export interface BookingItemData {
  id: string
  name: string
  description?: string
  price?: number
  quantity?: number
}

export interface BookingData {
  id: string
  eventDate: string
  eventEndDate?: string
  eventTime: string
  eventEndTime?: string
  location: string
  totalAmount: number
  status: string
  customer?: CustomerData
  item?: BookingItemData  // Primary item (backward compat)
  items?: BookingItemData[]  // All items including add-ons
  notes?: string
  depositAmount?: number
  balanceDue?: number
}

export interface CustomerData {
  id: string
  name: string
  email: string
  phone?: string
}

export interface ItemData {
  id: string
  name: string
  description?: string
}

export interface PaymentData {
  id: string
  amount: number
  paymentDate: string
  paymentMethod: string
  status: string
  booking?: BookingData
}

export interface UserData {
  id: string
  name: string
  email: string
}

export interface TenantData {
  id: string
  name: string
  email?: string
  phone?: string
  domain?: string
  logo?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  branding?: {
    businessName?: string
  }
}

/**
 * Email Service Class
 */
class EmailService {
  /**
   * Helper: Get default variant from a template
   */
  private getDefaultVariant(templateName: string): EmailTemplateVariant {
    const template = emailTemplates[templateName]
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }
    const defaultVariant = template.variants.find(v => v.id === template.defaultVariant)
    if (!defaultVariant) {
      throw new Error(`Default variant '${template.defaultVariant}' not found in template '${templateName}'`)
    }
    return defaultVariant
  }

  /**
   * Helper: Get business details from tenant for email templates
   */
  private getBusinessDetails(tenant: TenantData): Record<string, string> {
    const hasLogo = !!tenant.logo
    return {
      businessName: tenant.branding?.businessName || tenant.name,
      businessEmail: tenant.email || '',
      businessPhone: tenant.phone || '',
      businessAddress: this.formatAddress(tenant.address),
      businessLogo: tenant.logo || '',
      // Hide emoji fallback when logo is present
      businessLogoHide: hasLogo ? 'display: none;' : '',
    }
  }

  /**
   * Helper: Format address for display
   */
  private formatAddress(address?: TenantData['address']): string {
    if (!address) return ''
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zip,
    ].filter(Boolean)

    if (parts.length === 0) return ''

    // Format as "123 Main St, Austin, TX 78701"
    if (address.street && address.city && address.state && address.zip) {
      return `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    }

    return parts.join(', ')
  }

  /**
   * Helper: Render items list as HTML for email templates
   */
  private renderItemsHtml(items: BookingItemData[] | undefined): string {
    if (!items || items.length === 0) return ''

    return items.map(item => {
      const qty = (item.quantity || 1) > 1 ? ` × ${item.quantity}` : ''
      const price = `$${(item.price || 0).toFixed(2)}`
      return `
        <tr>
          <td style="color: #e5e5e5; padding: 10px 0; border-bottom: 1px solid #333333;">
            <strong style="color: #ffffff;">${item.name}</strong>${qty}
            ${item.description ? `<br><span style="font-size: 12px; color: #737373;">${item.description}</span>` : ''}
          </td>
          <td style="color: #10b981; font-weight: 600; text-align: right; padding: 10px 0; border-bottom: 1px solid #333333; white-space: nowrap;">
            ${price}
          </td>
        </tr>`
    }).join('')
  }

  /**
   * Helper: Render items list as plain text for email templates
   */
  private renderItemsText(items: BookingItemData[] | undefined): string {
    if (!items || items.length === 0) return ''

    return items.map(item => {
      const qty = (item.quantity || 1) > 1 ? ` × ${item.quantity}` : ''
      const price = `$${(item.price || 0).toFixed(2)}`
      return `  • ${item.name}${qty} - ${price}`
    }).join('\n')
  }

  /**
   * Helper: Get date range display
   */
  private formatDateRange(startDate: string, endDate?: string): string {
    const start = this.formatDate(startDate)
    if (!endDate) return start

    const end = this.formatDate(endDate)
    if (start === end) return start

    return `${start} → ${end}`
  }

  /**
   * Helper: Get time range display
   */
  private formatTimeRange(startTime: string, endTime?: string): string {
    if (!endTime) return startTime
    return `${startTime} – ${endTime}`
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData
  ): Promise<void> {
    if (!customer.email) {
      throw new Error('Customer email is required to send booking confirmation')
    }

    const variant = this.getDefaultVariant('BOOKING_CONFIRMATION')

    // Determine if we have multiple items
    const hasMultipleItems = booking.items && booking.items.length > 1
    const primaryItem = booking.item?.name || booking.items?.[0]?.name || 'Bounce House'

    const params = {
      customerName: customer.name,
      bookingId: booking.id,
      // Single item name for subject/header (backward compat)
      itemName: primaryItem,
      // Full items list rendered
      itemsHtml: this.renderItemsHtml(booking.items),
      itemsText: this.renderItemsText(booking.items),
      hasItems: (booking.items && booking.items.length > 0) ? 'true' : '',
      itemCount: String(booking.items?.length || 1),
      // Date/time with ranges
      eventDate: this.formatDateRange(booking.eventDate, booking.eventEndDate),
      eventTime: this.formatTimeRange(booking.eventTime, booking.eventEndTime),
      // Location
      location: booking.location || 'Address pending',
      // Totals
      totalAmount: (booking.totalAmount ?? 0).toFixed(2),
      // Notes if present
      notes: booking.notes || '',
      hasNotes: booking.notes ? 'true' : '',
      // URLs
      bookingUrl: this.getBookingUrl(booking.id, tenant),
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: customer.email, name: customer.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['booking-confirmation', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send booking reminder email (24h before event)
   */
  async sendBookingReminder(
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData
  ): Promise<void> {
    if (!customer.email) {
      throw new Error('Customer email is required to send booking reminder')
    }

    const variant = this.getDefaultVariant('BOOKING_REMINDER')

    const params = {
      customerName: customer.name,
      itemName: booking.item?.name || 'Bounce House',
      eventDate: this.formatDate(booking.eventDate),
      eventTime: booking.eventTime,
      location: booking.location,
      bookingUrl: this.getBookingUrl(booking.id, tenant),
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: customer.email, name: customer.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['booking-reminder', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send booking cancellation email
   */
  async sendBookingCancellation(
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData,
    refundAmount?: number
  ): Promise<void> {
    if (!customer.email) {
      throw new Error('Customer email is required to send cancellation notice')
    }

    const variant = this.getDefaultVariant('BOOKING_CANCELLED')

    const params = {
      customerName: customer.name,
      bookingId: booking.id,
      itemName: booking.item?.name || 'Bounce House',
      eventDate: this.formatDate(booking.eventDate),
      refundAmount: refundAmount ? refundAmount.toFixed(2) : undefined,
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: customer.email, name: customer.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['booking-cancelled', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send payment receipt email
   */
  async sendPaymentReceipt(
    payment: PaymentData,
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData,
    remainingBalance?: number
  ): Promise<void> {
    if (!customer.email) {
      throw new Error('Customer email is required to send payment receipt')
    }

    const variant = this.getDefaultVariant('PAYMENT_RECEIVED')

    const params = {
      customerName: customer.name,
      paymentId: payment.id,
      paymentDate: this.formatDate(payment.paymentDate),
      paymentMethod: this.formatPaymentMethod(payment.paymentMethod),
      bookingId: booking.id,
      amount: payment.amount.toFixed(2),
      remainingBalance: remainingBalance ? remainingBalance.toFixed(2) : undefined,
      receiptUrl: this.getReceiptUrl(payment.id, tenant),
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: customer.email, name: customer.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['payment-receipt', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(user: UserData, resetLink: string): Promise<void> {
    if (!user.email) {
      throw new Error('User email is required to send password reset')
    }

    const variant = this.getDefaultVariant('PASSWORD_RESET')

    const params = {
      userName: user.name || 'User',
      resetLink,
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: user.email, name: user.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['password-reset'],
    })
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcome(user: UserData, tenant: TenantData): Promise<void> {
    if (!user.email) {
      throw new Error('User email is required to send welcome email')
    }

    const variant = this.getDefaultVariant('WELCOME')

    const params = {
      userName: user.name || 'User',
      userEmail: user.email,
      tenantName: tenant.name,
      planName: 'Free Trial', // Could be passed as parameter
      dashboardUrl: this.getDashboardUrl(tenant),
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: user.email, name: user.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['welcome', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send new booking notification to business owner
   */
  async sendNewBookingToOwner(
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData
  ): Promise<void> {
    // Send to tenant's email
    const ownerEmail = tenant.email
    if (!ownerEmail) {
      console.log('[Email] No tenant email configured, skipping owner notification')
      return
    }

    const variant = this.getDefaultVariant('NEW_BOOKING_RECEIVED')

    // Determine if we have multiple items
    const primaryItem = booking.item?.name || booking.items?.[0]?.name || 'Rental Item'

    const params = {
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || 'N/A',
      bookingId: booking.id,
      // Single item name for subject/header (backward compat)
      itemName: primaryItem,
      // Full items list rendered
      itemsHtml: this.renderItemsHtml(booking.items),
      itemsText: this.renderItemsText(booking.items),
      hasItems: (booking.items && booking.items.length > 0) ? 'true' : '',
      itemCount: String(booking.items?.length || 1),
      // Date/time with ranges
      eventDate: this.formatDateRange(booking.eventDate, booking.eventEndDate),
      eventTime: this.formatTimeRange(booking.eventTime, booking.eventEndTime),
      // Location
      location: booking.location || 'Address pending',
      // Totals
      totalAmount: (booking.totalAmount ?? 0).toFixed(2),
      // Notes if present
      notes: booking.notes || '',
      hasNotes: booking.notes ? 'true' : '',
      // URLs
      dashboardUrl: this.getDashboardUrl(tenant) + '/bookings',
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: ownerEmail, name: tenant.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['new-booking-owner', `tenant:${tenant.id}`],
    })
  }

  /**
   * Send booking status update to customer
   */
  async sendStatusUpdate(
    booking: BookingData,
    customer: CustomerData,
    tenant: TenantData,
    newStatus: string
  ): Promise<void> {
    if (!customer.email) {
      throw new Error('Customer email is required to send status update')
    }

    // Status-specific content
    const statusContent: Record<string, {
      emoji: string
      label: string
      headline: string
      message: string
      color: string
      text: string
    }> = {
      preparing: {
        emoji: '🔧',
        label: 'Preparing',
        headline: 'Your Rental is Being Prepared!',
        message: 'we\'re getting your rental ready for delivery. Sit tight!',
        color: '#8b5cf6',
        text: 'being prepared',
      },
      in_route: {
        emoji: '🚚',
        label: 'On The Way',
        headline: 'Your Rental is On The Way!',
        message: 'your rental is on its way to you! The driver will be there soon.',
        color: '#3b82f6',
        text: 'on the way',
      },
      delivered: {
        emoji: '✅',
        label: 'Delivered',
        headline: 'Your Rental Has Arrived!',
        message: 'your rental has been delivered. Have an amazing event!',
        color: '#10b981',
        text: 'delivered',
      },
      picked_up: {
        emoji: '📦',
        label: 'Picked Up',
        headline: 'Your Rental Has Been Picked Up',
        message: 'we\'ve picked up your rental. Thank you for choosing us!',
        color: '#6366f1',
        text: 'picked up',
      },
    }

    const content = statusContent[newStatus]
    if (!content) {
      console.log(`[Email] No status update template for status: ${newStatus}`)
      return
    }

    const variant = this.getDefaultVariant('BOOKING_STATUS_UPDATE')

    const params = {
      customerName: customer.name,
      bookingId: booking.id,
      itemName: booking.item?.name || 'Rental Item',
      eventDate: this.formatDate(booking.eventDate),
      location: booking.location,
      statusEmoji: content.emoji,
      statusLabel: content.label,
      statusHeadline: content.headline,
      statusMessage: content.message,
      statusColor: content.color,
      statusText: content.text,
      ...this.getBusinessDetails(tenant),
    }

    await brevo.sendTransactionalEmail({
      to: [{ email: customer.email, name: customer.name }],
      subject: interpolate(variant.subject, params),
      htmlContent: interpolate(variant.html(params), params),
      textContent: interpolate(variant.text(params), params),
      tags: ['status-update', `status:${newStatus}`, `tenant:${tenant.id}`],
    })
  }

  /**
   * Send custom email (for advanced use cases)
   */
  async sendCustomEmail(
    to: BrevoEmailAddress | BrevoEmailAddress[],
    subject: string,
    htmlContent: string,
    textContent?: string,
    tags?: string[]
  ): Promise<void> {
    await brevo.sendTransactionalEmail({
      to: Array.isArray(to) ? to : [to],
      subject,
      htmlContent,
      textContent,
      tags,
    })
  }

  /**
   * Helper: Format date for display
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      return dateString
    }
  }

  /**
   * Helper: Format payment method for display
   */
  private formatPaymentMethod(method: string): string {
    const methodMap: Record<string, string> = {
      card: 'Credit/Debit Card',
      stripe: 'Credit Card',
      cash: 'Cash',
      check: 'Check',
      bank_transfer: 'Bank Transfer',
    }

    return methodMap[method.toLowerCase()] || method
  }

  /**
   * Helper: Generate booking URL
   */
  private getBookingUrl(bookingId: string, tenant: TenantData): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.bouncepro.com'
    const tenantSlug = tenant.domain || tenant.id

    return `${baseUrl}/${tenantSlug}/bookings/${bookingId}`
  }

  /**
   * Helper: Generate receipt URL
   */
  private getReceiptUrl(paymentId: string, tenant: TenantData): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.bouncepro.com'
    const tenantSlug = tenant.domain || tenant.id

    return `${baseUrl}/${tenantSlug}/payments/${paymentId}/receipt`
  }

  /**
   * Helper: Generate dashboard URL
   */
  private getDashboardUrl(tenant: TenantData): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.bouncepro.com'
    const tenantSlug = tenant.domain || tenant.id

    return `${baseUrl}/${tenantSlug}/dashboard`
  }
}

/**
 * Export singleton instance
 */
export const emailService = new EmailService()

/**
 * Export class for custom instances
 */
export default EmailService

/**
 * Export types
 */
export type {
  BrevoEmailAddress,
  BrevoEmailParams,
  BrevoTemplateParams,
  BrevoEmailResponse,
} from './brevo'

export { emailTemplates } from './templates'
export type { EmailTemplateName } from './templates'
// Force rebuild: $(date)
