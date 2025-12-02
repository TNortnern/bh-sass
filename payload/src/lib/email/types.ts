/**
 * Type definitions for Email Service
 * Shared types used across the email system
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
  domain?: string
}

export interface EmailTemplate {
  subject: string
  html: (params: Record<string, any>) => string
  text: (params: Record<string, any>) => string
}

export interface BrevoEmailAddress {
  email: string
  name?: string
}

export interface BrevoAttachment {
  content: string // base64 encoded
  name: string
}

export interface BrevoEmailParams {
  to: BrevoEmailAddress[]
  from?: BrevoEmailAddress
  subject?: string
  htmlContent?: string
  textContent?: string
  cc?: BrevoEmailAddress[]
  bcc?: BrevoEmailAddress[]
  replyTo?: BrevoEmailAddress
  attachments?: BrevoAttachment[]
  headers?: Record<string, string>
  tags?: string[]
}

export interface BrevoTemplateParams extends Omit<BrevoEmailParams, 'subject' | 'htmlContent' | 'textContent'> {
  templateId: number
  params?: Record<string, any>
}

export interface BrevoEmailResponse {
  messageId: string
}

export interface BrevoError {
  code: string
  message: string
}
