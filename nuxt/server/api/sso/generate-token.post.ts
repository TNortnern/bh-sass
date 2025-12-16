import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

/**
 * Generate SSO Token for rb-payload
 *
 * POST /api/sso/generate-token
 *
 * Generates a signed JWT token that can be used to auto-login to rb-payload.
 * The token is short-lived (5 minutes) and single-use.
 *
 * Body:
 * {
 *   email: string,
 *   tenantId: number,
 *   rbPayloadTenantId: number,
 *   firstName?: string,
 *   lastName?: string,
 *   redirect?: string
 * }
 *
 * Response:
 * {
 *   ssoUrl: string // Full URL to redirect user to
 * }
 */

const SSO_SECRET = process.env.RB_PAYLOAD_SSO_SECRET || process.env.RB_PAYLOAD_API_KEY || ''
const RB_PAYLOAD_URL = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.rbPayloadTenantId) {
    throw createError({
      statusCode: 400,
      message: 'email and rbPayloadTenantId are required'
    })
  }

  if (!SSO_SECRET) {
    throw createError({
      statusCode: 500,
      message: 'SSO secret not configured'
    })
  }

  // Generate the SSO token
  const token = jwt.sign(
    {
      email: body.email,
      tenantId: body.rbPayloadTenantId,
      role: 'tenant_admin',
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      externalUserId: body.tenantId, // BH-SaaS tenant ID for reference
      jti: randomUUID() // Unique token ID for single-use
    },
    SSO_SECRET,
    {
      expiresIn: '5m' // Token expires in 5 minutes
    }
  )

  // Build the SSO URL
  const redirect = body.redirect || '/admin'
  const ssoUrl = `${RB_PAYLOAD_URL}/api/auth/sso?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`

  return {
    ssoUrl
  }
})
