import type { Endpoint } from 'payload'
import { sql } from 'drizzle-orm'

/**
 * POST /api/admin/direct-link-rb-payload
 * Directly link a BH-SaaS tenant to rb-payload via SQL
 * Protected by PAYLOAD_SECRET (for admin use only)
 */
export const directLinkRbPayloadEndpoint: Endpoint = {
  path: '/admin/direct-link-rb-payload',
  method: 'post',
  handler: async (req) => {
    try {
      const body = req.json ? await req.json() : {}
      const { tenantId, rbPayloadTenantId, email, secret } = body

      // Verify the secret key from body
      const expectedSecret = process.env.PAYLOAD_SECRET

      // Debug logging
      console.log('[direct-link] Received secret:', secret ? `${secret.substring(0, 10)}...` : 'null')
      console.log('[direct-link] Expected secret:', expectedSecret ? `${expectedSecret.substring(0, 10)}...` : 'null')
      console.log('[direct-link] Match:', secret === expectedSecret)

      if (!secret || secret !== expectedSecret) {
        return Response.json(
          { error: 'Unauthorized. Invalid or missing secret in body.', debug: { receivedLength: secret?.length, expectedLength: expectedSecret?.length } },
          { status: 401 }
        )
      }

      if (!tenantId) {
        return Response.json(
          { error: 'tenantId is required' },
          { status: 400 }
        )
      }

      if (!rbPayloadTenantId && !email) {
        return Response.json(
          { error: 'At least one of rbPayloadTenantId or email is required' },
          { status: 400 }
        )
      }

      const payload = req.payload
      const tenantIdNum = parseInt(String(tenantId), 10)

      // Access the drizzle db adapter for direct SQL
      const db = (payload.db as any).drizzle
      if (!db) {
        throw new Error('Could not access Drizzle database adapter')
      }

      // Build dynamic SQL based on provided fields
      let result
      if (rbPayloadTenantId && email) {
        const rbTenantIdNum = parseInt(String(rbPayloadTenantId), 10)
        result = await db.execute(sql`
          UPDATE tenants
          SET rb_payload_tenant_id = ${rbTenantIdNum},
              rb_payload_sync_status = 'provisioned',
              rb_payload_sync_error = NULL,
              email = ${email},
              updated_at = NOW()
          WHERE id = ${tenantIdNum}
          RETURNING id, name, slug, email, rb_payload_tenant_id
        `)
      } else if (rbPayloadTenantId) {
        const rbTenantIdNum = parseInt(String(rbPayloadTenantId), 10)
        result = await db.execute(sql`
          UPDATE tenants
          SET rb_payload_tenant_id = ${rbTenantIdNum},
              rb_payload_sync_status = 'provisioned',
              rb_payload_sync_error = NULL,
              updated_at = NOW()
          WHERE id = ${tenantIdNum}
          RETURNING id, name, slug, email, rb_payload_tenant_id
        `)
      } else {
        result = await db.execute(sql`
          UPDATE tenants
          SET email = ${email},
              updated_at = NOW()
          WHERE id = ${tenantIdNum}
          RETURNING id, name, slug, email, rb_payload_tenant_id
        `)
      }

      if (!result.rows || result.rows.length === 0) {
        return Response.json(
          { error: 'Tenant not found' },
          { status: 404 }
        )
      }

      const tenant = result.rows[0]

      payload.logger.info(`Updated tenant ${tenant.name} (ID: ${tenant.id})`)

      return Response.json({
        success: true,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          email: tenant.email,
          rbPayloadTenantId: tenant.rb_payload_tenant_id,
        },
        message: 'Tenant updated successfully',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      req.payload.logger.error(`Error direct linking tenant: ${errorMessage}`)
      return Response.json(
        { error: 'Failed to link tenant', details: errorMessage },
        { status: 500 }
      )
    }
  },
}
