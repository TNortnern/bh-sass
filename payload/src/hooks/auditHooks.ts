import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { logAuditEvent, getRequestMetadata, createDiff } from '../lib/audit'
import { getTenantId } from '../utilities/getTenantId'

/**
 * Hook to audit document creation
 * Usage: Add to collection's hooks.afterChange array
 */
export const auditCreate: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
}) => {
  // Only log on create operations
  if (operation !== 'create') return doc

  // Fire and forget - don't await to avoid blocking
  setImmediate(async () => {
    try {
      const userId = req.user?.id
      const tenantId = doc.tenantId || (req.user ? getTenantId(req.user) : null)
      const metadata = getRequestMetadata(req)

      await logAuditEvent(req.payload, {
        action: 'create',
        collection: collection.slug,
        documentId: String(doc.id),
        userId,
        tenantId: tenantId ? String(tenantId) : undefined,
        changes: {
          document: doc,
        },
        metadata,
      })
    } catch (error) {
      req.payload.logger.error(`Audit log failed for create: ${error}`)
    }
  })

  return doc
}

/**
 * Hook to audit document updates with before/after diff
 * Usage: Add to collection's hooks.afterChange array
 */
export const auditUpdate: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
  collection,
}) => {
  // Only log on update operations
  if (operation !== 'update') return doc

  // Fire and forget - don't await to avoid blocking
  setImmediate(async () => {
    try {
      const userId = req.user?.id
      const tenantId = doc.tenantId || (req.user ? getTenantId(req.user) : null)
      const metadata = getRequestMetadata(req)

      // Create a diff of what changed
      const changes = previousDoc ? createDiff(previousDoc, doc) : { after: doc }

      await logAuditEvent(req.payload, {
        action: 'update',
        collection: collection.slug,
        documentId: String(doc.id),
        userId,
        tenantId: tenantId ? String(tenantId) : undefined,
        changes,
        metadata,
      })
    } catch (error) {
      req.payload.logger.error(`Audit log failed for update: ${error}`)
    }
  })

  return doc
}

/**
 * Hook to audit document deletion
 * Usage: Add to collection's hooks.afterDelete array
 */
export const auditDelete: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  // Fire and forget - don't await to avoid blocking
  setImmediate(async () => {
    try {
      const userId = req.user?.id
      const tenantId = doc.tenantId || (req.user ? getTenantId(req.user) : null)
      const metadata = getRequestMetadata(req)

      await logAuditEvent(req.payload, {
        action: 'delete',
        collection: collection.slug,
        documentId: String(doc.id),
        userId,
        tenantId: tenantId ? String(tenantId) : undefined,
        changes: {
          document: doc,
        },
        metadata,
      })
    } catch (error) {
      req.payload.logger.error(`Audit log failed for delete: ${error}`)
    }
  })

  return doc
}

/**
 * Combined hook that handles all operations (create, update)
 * This is a convenience hook that combines auditCreate and auditUpdate
 * Usage: Add to collection's hooks.afterChange array
 */
export const auditCreateAndUpdate: CollectionAfterChangeHook = async (args) => {
  if (args.operation === 'create') {
    return auditCreate(args)
  } else if (args.operation === 'update') {
    return auditUpdate(args)
  }
  return args.doc
}
