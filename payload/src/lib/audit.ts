import type { Payload } from 'payload'

export interface AuditEventParams {
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'api_call'
  collection: string
  documentId: string
  userId?: string | number
  tenantId?: string | number
  changes?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

/**
 * Log an audit event to the audit-logs collection
 * This function is designed to be called from hooks and should not throw errors
 */
export async function logAuditEvent(
  payload: Payload,
  event: AuditEventParams,
): Promise<void> {
  try {
    // Convert string IDs to numbers for relationship fields
    const userId = event.userId ? Number(event.userId) : null
    const tenantId = event.tenantId ? Number(event.tenantId) : null

    await payload.create({
      collection: 'audit-logs',
      data: {
        action: event.action,
        collection: event.collection,
        documentId: event.documentId,
        userId: !isNaN(userId as number) ? userId : null,
        tenantId: !isNaN(tenantId as number) ? tenantId : null,
        changes: event.changes || null,
        metadata: event.metadata || null,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    // Log error but don't throw - audit logging should never break business logic
    payload.logger.error(`Failed to create audit log: ${error}`)
  }
}

/**
 * Extract request metadata for audit logging (IP, user agent, etc.)
 */
export function getRequestMetadata(req: any): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  // Extract IP address
  if (req.ip) {
    metadata.ip = req.ip
  } else if (req.headers?.['x-forwarded-for']) {
    metadata.ip = req.headers['x-forwarded-for']
  } else if (req.headers?.['x-real-ip']) {
    metadata.ip = req.headers['x-real-ip']
  }

  // Extract user agent
  if (req.headers?.['user-agent']) {
    metadata.userAgent = req.headers['user-agent']
  }

  // Extract referrer
  if (req.headers?.referer) {
    metadata.referer = req.headers.referer
  }

  return metadata
}

/**
 * Create a diff of two objects for audit logging
 * Returns an object with 'before' and 'after' keys showing changed fields
 */
export function createDiff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): Record<string, unknown> {
  const changes: Record<string, unknown> = {
    before: {},
    after: {},
  }

  // Find changed, added, or removed fields
  const beforeKeys = Object.keys(before)
  const afterKeys = Object.keys(after)
  const allKeys = Array.from(new Set([...beforeKeys, ...afterKeys]))

  for (const key of allKeys) {
    // Skip certain fields that change frequently but aren't meaningful
    if (['updatedAt', 'createdAt'].includes(key)) {
      continue
    }

    const beforeValue = before[key]
    const afterValue = after[key]

    // Check if values are different
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      ;(changes.before as Record<string, unknown>)[key] = beforeValue
      ;(changes.after as Record<string, unknown>)[key] = afterValue
    }
  }

  return changes
}
