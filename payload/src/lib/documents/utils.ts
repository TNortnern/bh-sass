import { format } from 'date-fns'

/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

/**
 * Format date for documents (full date and time)
 */
export function formatDocumentDate(date: Date | string): string {
  return formatDate(date, 'MMMM dd, yyyy')
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM dd, yyyy h:mm a')
}

/**
 * Calculate tax amount from subtotal
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100)
}

/**
 * Safe get for relationship fields (can be ID or object)
 */
export function getRelationshipId(field: any): string | null {
  if (!field) return null
  return typeof field === 'string' ? field : field.id
}

/**
 * Safe get for relationship value
 */
export function getRelationshipValue<T>(field: any): T | null {
  if (!field) return null
  return typeof field === 'object' ? field : null
}
