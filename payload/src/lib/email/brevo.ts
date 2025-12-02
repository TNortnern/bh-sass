/**
 * Brevo (formerly Sendinblue) Email Client
 * Handles transactional and template-based email sending
 */

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

class BrevoClient {
  private apiKey: string
  private apiUrl: string = 'https://api.brevo.com/v3'
  private defaultFrom: BrevoEmailAddress

  constructor(apiKey?: string, defaultFrom?: BrevoEmailAddress) {
    this.apiKey = apiKey || process.env.BREVO_API_KEY || ''

    this.defaultFrom = defaultFrom || {
      email: process.env.EMAIL_FROM_ADDRESS || 'noreply@bouncepro.com',
      name: process.env.EMAIL_FROM_NAME || 'BouncePro',
    }
  }

  /**
   * Check if the client is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Send a transactional email with custom HTML/text content
   */
  async sendTransactionalEmail(params: BrevoEmailParams): Promise<BrevoEmailResponse> {
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is not configured. Please set it in your environment variables.')
    }

    const payload = {
      sender: params.from || this.defaultFrom,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
      attachments: params.attachments,
      headers: params.headers,
      tags: params.tags,
    }

    return this.makeRequest<BrevoEmailResponse>('/smtp/email', 'POST', payload)
  }

  /**
   * Send an email using a Brevo template
   */
  async sendTemplateEmail(params: BrevoTemplateParams): Promise<BrevoEmailResponse> {
    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is not configured. Please set it in your environment variables.')
    }

    const payload = {
      sender: params.from || this.defaultFrom,
      to: params.to,
      templateId: params.templateId,
      params: params.params,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo,
      attachments: params.attachments,
      headers: params.headers,
      tags: params.tags,
    }

    return this.makeRequest<BrevoEmailResponse>('/smtp/email', 'POST', payload)
  }

  /**
   * Make HTTP request to Brevo API
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`

    const headers: Record<string, string> = {
      'api-key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Brevo API error: ${response.status} - ${errorData.message || response.statusText}`
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send email via Brevo: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Update default sender information
   */
  setDefaultFrom(from: BrevoEmailAddress): void {
    this.defaultFrom = from
  }

  /**
   * Get current default sender
   */
  getDefaultFrom(): BrevoEmailAddress {
    return this.defaultFrom
  }
}

// Export singleton instance
export const brevo = new BrevoClient()

// Export class for custom instances
export default BrevoClient
