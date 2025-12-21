import type { Endpoint } from 'payload'

import { generatePayloadCookie, headersWithCors, isNumber, loginOperation } from 'payload'

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
    const depth = isNumber(depthParam) ? Number(depthParam) : undefined

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

    const authData = collectionForLogin.config.auth.loginWithUsername !== false
      ? {
          email: typeof body.email === 'string' ? body.email : '',
          password: typeof body.password === 'string' ? body.password : '',
          username: typeof body.username === 'string' ? body.username : ''
        }
      : {
          email: typeof body.email === 'string' ? body.email : '',
          password: typeof body.password === 'string' ? body.password : ''
        }

    const result = await loginOperation({
      collection: collectionForLogin,
      data: authData,
      depth,
      req
    })

    if (!result.token) {
      return Response.json(
        { errors: [{ message: 'Login failed. Please try again.' }] },
        { status: 401 }
      )
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
        ...result
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
