import type { Endpoint } from 'payload'

import { generatePayloadCookie, headersWithCors, loginOperation } from 'payload'
import { userHasTenantAccess, getTenantId } from '../utilities/getTenantId'

const DEFAULT_REMEMBER_ME_DAYS = 30
const SECONDS_PER_DAY = 24 * 60 * 60

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return false
}

function resolveRememberMeExpiration(defaultSeconds: number): number {
  const secondsFromEnv = Number.parseInt(process.env.REMEMBER_ME_TOKEN_EXPIRATION || '', 10)
  if (Number.isFinite(secondsFromEnv) && secondsFromEnv > 0) {
    return Math.max(defaultSeconds, secondsFromEnv)
  }

  const daysFromEnv = Number.parseInt(process.env.REMEMBER_ME_DAYS || '', 10)
  if (Number.isFinite(daysFromEnv) && daysFromEnv > 0) {
    return Math.max(defaultSeconds, daysFromEnv * SECONDS_PER_DAY)
  }

  return Math.max(defaultSeconds, DEFAULT_REMEMBER_ME_DAYS * SECONDS_PER_DAY)
}

/**
 * Custom login endpoint that supports remember-me expiration.
 */
export const authLoginEndpoint: Endpoint = {
  path: '/auth/login',
  method: 'post',
  handler: async (req) => {
    const { payload } = req
    const collection = payload.collections?.users

    if (!collection?.config?.auth) {
      return Response.json(
        { errors: [{ message: 'Authentication is not configured for users.' }] },
        { status: 500 }
      )
    }

    const body = await req.json?.() || {}
    const rememberMe = parseBoolean(body.rememberMe)
    const depthParam = req.searchParams?.get('depth')
    const depth = depthParam && !Number.isNaN(Number(depthParam)) ? Number(depthParam) : undefined

    const tokenExpiration = rememberMe
      ? resolveRememberMeExpiration(collection.config.auth.tokenExpiration)
      : collection.config.auth.tokenExpiration

    const authConfig = {
      ...collection.config.auth,
      tokenExpiration
    }

    const collectionForLogin = {
      ...collection,
      config: {
        ...collection.config,
        auth: authConfig
      }
    }

    // Validate required credentials before attempting login
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email) {
      return Response.json(
        { errors: [{ message: 'Email is required' }] },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req })
        }
      )
    }

    if (!password) {
      return Response.json(
        { errors: [{ message: 'Password is required' }] },
        {
          status: 400,
          headers: headersWithCors({ headers: new Headers(), req })
        }
      )
    }

    // Build auth data - only include username field when loginWithUsername is explicitly enabled
    const authData = collectionForLogin.config.auth.loginWithUsername === true
      ? {
          email,
          password,
          username: typeof body.username === 'string' ? body.username : ''
        }
      : {
          email,
          password
        }

    let result
    try {
      result = await loginOperation({
        collection: collectionForLogin,
        data: authData,
        depth,
        req
      })
    } catch (error: unknown) {
      const statusCode = typeof (error as any)?.status === 'number'
        ? (error as any).status
        : typeof (error as any)?.statusCode === 'number'
          ? (error as any).statusCode
          : 500
      const message = (error as any)?.data?.errors?.[0]?.message
        || (error as any)?.message
        || 'Login failed. Please try again.'

      return Response.json(
        { errors: [{ message }] },
        {
          status: statusCode,
          headers: headersWithCors({
            headers: new Headers(),
            req
          })
        }
      )
    }

    if (!result?.token) {
      return Response.json(
        { errors: [{ message: 'Login failed. Please try again.' }] },
        {
          status: 401,
          headers: headersWithCors({
            headers: new Headers(),
            req
          })
        }
      )
    }

    // Handle tenant parameter - allow specifying which tenant to activate on login
    // Can be passed as query param (?tenant=slug) or in body (tenantSlug or tenantId)
    const tenantParam = req.searchParams?.get('tenant') || body.tenantSlug || body.tenant
    const tenantIdParam = body.tenantId

    let activeTenant: any = null

    if (result.user && (tenantParam || tenantIdParam)) {
      try {
        // Find the requested tenant
        let requestedTenant: any = null

        if (tenantIdParam) {
          requestedTenant = await payload.findByID({
            collection: 'tenants',
            id: tenantIdParam,
          })
        } else if (tenantParam) {
          const tenantResult = await payload.find({
            collection: 'tenants',
            where: { slug: { equals: tenantParam } },
            limit: 1,
          })
          requestedTenant = tenantResult.docs[0]
        }

        if (requestedTenant) {
          // Check if user has access to this tenant
          if (userHasTenantAccess(result.user, requestedTenant.id)) {
            // Update user's activeTenantId
            await payload.update({
              collection: 'users',
              id: result.user.id,
              data: { activeTenantId: requestedTenant.id },
            })

            activeTenant = {
              id: requestedTenant.id,
              name: requestedTenant.name,
              slug: requestedTenant.slug,
            }

            // Update the result.user object
            result.user.activeTenantId = requestedTenant.id
          }
        }
      } catch (err) {
        // Log but don't fail login if tenant switch fails
        payload.logger.error({ err, msg: 'Failed to set active tenant on login' })
      }
    }

    // If no specific tenant requested, get the current active tenant info
    if (!activeTenant && result.user) {
      const currentTenantId = getTenantId(result.user)
      if (currentTenantId) {
        try {
          const currentTenant = await payload.findByID({
            collection: 'tenants',
            id: currentTenantId,
          })
          if (currentTenant) {
            activeTenant = {
              id: currentTenant.id,
              name: currentTenant.name,
              slug: currentTenant.slug,
            }
          }
        } catch {
          // Ignore errors fetching tenant info
        }
      }
    }

    const cookie = generatePayloadCookie({
      collectionAuthConfig: authConfig,
      cookiePrefix: req.payload.config.cookiePrefix,
      token: result.token
    })

    if (collectionForLogin.config.auth.removeTokenFromResponses) {
      // @ts-expect-error - preserve Payload behavior for login responses
      delete result.token
    }

    return Response.json(
      {
        message: req.t('authentication:passed'),
        ...result,
        // Include active tenant info in response
        activeTenant,
      },
      {
        headers: headersWithCors({
          headers: new Headers({ 'Set-Cookie': cookie }),
          req
        })
      }
    )
  }
}
