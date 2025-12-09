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
export interface BookingData {
  id: string
  eventDate: string
  eventTime: string
  location: string
  totalAmount: number
  status: string
  customer?: CustomerData
  item?: ItemData
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

    const params = {
      customerName: customer.name,
      bookingId: booking.id,
      itemName: booking.item?.name || 'Bounce House',
      eventDate: this.formatDate(booking.eventDate),
      eventTime: booking.eventTime,
      location: booking.location,
      totalAmount: booking.totalAmount.toFixed(2),
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
